<script setup>
import { onMounted, onUnmounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import SockJS from 'sockjs-client'
import Stomp from 'stompjs'
import togetherApi from '@/api/together/index.js'
import Modal from '@/components/ui/Modal.vue'
import VideoPlayerComponent from '@/components/video/player/VideoPlayerComponent.vue'
import TogetherMasterModal from '@/components/together_room/TogetherMasterModal.vue'
import TogetherRoomChat from '@/components/together_room/TogetherRoomChat.vue'
import TogetherRoomNavigator from '@/components/together_room/TogetherRoomNavigator.vue'

const route = useRoute()
const router = useRouter()

const socket = ref(null)
const subscribed = ref(false)
const isMaster = ref(false)

const stateModal = reactive({
  chatModal: false,
  masterModal: false,
  togetherModal: false,
})

const togetherTitle = 'Together 공지'
const togetherMessage = ref('')

const togetherInfo = reactive({
  togetherIdx: 0,
  title: '',
  maxMemberNum: '',
  joinMemberNumber: '',
  master: '',
  isOpen: true,
  userIdx: 0,
  videoUrl: '',
  code: '',
})

const backendChatUrl = () => {
  return window.location.hostname === 'localhost'
    ? 'http://localhost:8080/chat'
    : 'https://www.dabom-together.kro.kr/chat'
}

const loadTogetherInfo = (data) => {
  togetherInfo.togetherIdx = data.togetherIdx ?? togetherInfo.togetherIdx
  togetherInfo.isOpen = data.isOpen ?? true
  togetherInfo.title = data.title || ''
  togetherInfo.master = typeof data.master === 'object' ? (data.master?.name || '') : (data.master || data.masterName || '')
  togetherInfo.maxMemberNum = data.maxMemberNum ?? data.maxMemberNumber ?? ''
  togetherInfo.joinMemberNumber = data.joinMemberNumber ?? data.currentMemberCount ?? 0
  togetherInfo.userIdx = data.userIdx ?? 0
  togetherInfo.videoUrl = data.videoUrl || ''
  togetherInfo.code = data.code || data.inviteCode || ''

  if (togetherInfo.videoUrl === '') {
    togetherInfo.videoUrl = 'https://s3.ap-northeast-2.amazonaws.com/raccoon.aws.s3/encoder/sample/playlist.m3u8'
  }
}

const getTogetherInfo = async () => {
  const res = await togetherApi.getTogetherInfo(togetherInfo.togetherIdx)
  if (res.code === 200) {
    loadTogetherInfo(res.data)
    return
  }

  togetherMessage.value = res.message || '방 정보를 불러오지 못했습니다.'
  stateModal.togetherModal = true
}

const getIsMaster = async () => {
  const res = await togetherApi.isMaster(togetherInfo.togetherIdx)
  if (res.code === 200 && res.data?.isMaster === true) {
    isMaster.value = true
  }
}

const connectWebSocket = async () => {
  const ws = new SockJS(backendChatUrl(), null, {
    transportOptions: {
      xhr: { withCredentials: true },
      xhrStreaming: { withCredentials: true },
    },
  })

  const client = Stomp.over(ws)
  socket.value = client

  socket.value.connect(
    {},
    () => {
      subscribed.value = true
      subscribeMasterEvent()
    },
    (error) => {
      console.error('Together 소켓 연결 실패', error)
      subscribed.value = false
    },
  )
}

const subscribeMasterEvent = () => {
  if (!socket.value) return

  socket.value.subscribe(`/topic/master/control/together/${togetherInfo.togetherIdx}`, (message) => {
    const data = JSON.parse(message.body)

    if (data.videoUrl) {
      window.location.reload()
    }

    if (data.kickIdx && togetherInfo.userIdx === data.kickIdx) {
      togetherMessage.value = '강퇴당하셨습니다.'
      stateModal.togetherModal = true
    }
  })
}

const goToList = () => {
  router.push('/together')
}

const returnTogether = () => {
  stateModal.togetherModal = false
  goToList()
}

onMounted(async () => {
  togetherInfo.togetherIdx = Number(route.params.id)
  await getTogetherInfo()
  await getIsMaster()
  await connectWebSocket()
})

onUnmounted(() => {
  if (socket.value) {
    socket.value.disconnect()
  }
})
</script>

<template>
  <TogetherRoomNavigator
    :chat-open="stateModal.chatModal"
    :is-master="isMaster"
    @open_chat_modal="stateModal.chatModal = !stateModal.chatModal"
    @open_master_modal="stateModal.masterModal = true"
  />

  <main class="together-room-page">
    <section class="video-section" :class="{ 'chat-active': stateModal.chatModal }">
      <div class="video-column">
        <div class="video-container">
          <div class="video-player">
            <VideoPlayerComponent
              v-if="subscribed"
              :video_url="togetherInfo.videoUrl"
              :socket="socket"
              :together-idx="togetherInfo.togetherIdx"
              :is-master="isMaster"
            />
          </div>
        </div>

        <section class="room-meta-bar">
          <div class="room-title-row">
            <p class="room-eyebrow">Together Room</p>
            <h1>{{ togetherInfo.title || `Together 방 #${togetherInfo.togetherIdx}` }}</h1>
          </div>

          <div class="room-meta">
            <span class="meta-pill">호스트 {{ togetherInfo.master || '알 수 없음' }}</span>
            <span class="meta-pill">참여 {{ togetherInfo.joinMemberNumber || 0 }} / {{ togetherInfo.maxMemberNum || '-' }}</span>
            <span class="meta-pill">{{ togetherInfo.isOpen ? '공개방' : '비공개방' }}</span>
            <span v-if="togetherInfo.code" class="meta-pill meta-pill-accent">초대코드 {{ togetherInfo.code }}</span>
          </div>
        </section>
      </div>

      <TogetherRoomChat
        v-if="stateModal.chatModal && subscribed"
        :is-master="isMaster"
        :socket="socket"
        :user-idx="togetherInfo.userIdx"
        @close_modal="stateModal.chatModal = false"
        @open_master_modal="stateModal.masterModal = true"
      />
    </section>
  </main>

  <TogetherMasterModal
    v-if="stateModal.masterModal && subscribed"
    :socket="socket"
    @close_modal="stateModal.masterModal = false"
  />

  <Modal
    v-if="stateModal.togetherModal"
    :title="togetherTitle"
    :message="togetherMessage"
    @confirm="returnTogether"
  />
</template>

<style scoped>
.together-room-page {
  max-width: 1660px;
  margin: 0 auto;
  padding: 18px 22px 64px;
}

.room-eyebrow {
  margin: 0 0 8px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--secondary-color);
}

.room-title-row {
  min-width: 0;
}

.room-title-row h1 {
  margin: 0;
  font-size: clamp(22px, 2.4vw, 30px);
  line-height: 1.1;
}

.room-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.room-meta-bar {
  display: grid;
  gap: 14px;
  padding: 16px 6px 0;
}

.meta-pill {
  display: inline-flex;
  align-items: center;
  min-height: 34px;
  padding: 0 12px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.05);
  color: var(--text-secondary);
  font-size: 13px;
  white-space: nowrap;
}

.meta-pill-accent {
  background: rgba(250, 85, 0, 0.12);
  color: #ffbc97;
}

.video-section {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  align-items: start;
  gap: 22px;
}

.video-section.chat-active {
  grid-template-columns: minmax(0, 1.52fr) minmax(320px, 0.54fr);
}

.video-column {
  min-width: 0;
}

.video-container {
  width: 100%;
  height: min(69vw, 800px);
  transition: transform 0.28s ease;
}

.video-player {
  width: 100%;
  height: 100%;
  overflow: hidden;
  border: 1px solid var(--border-color);
  border-radius: 28px;
  background: #000;
  box-shadow: 0 32px 92px rgba(0, 0, 0, 0.3);
}

@media (max-width: 960px) {
  .video-section.chat-active {
    grid-template-columns: 1fr;
  }

  .video-container {
    width: 100%;
    height: 56vw;
  }
}

@media (max-width: 640px) {
  .together-room-page {
    padding: 14px 14px 48px;
  }
}
</style>
