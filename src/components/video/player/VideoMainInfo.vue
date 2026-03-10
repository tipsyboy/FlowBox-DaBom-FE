<script setup>
import { onMounted, ref } from 'vue'
import StarRating from '@/components/ui/StarRating.vue'
import PlaylistAddModal from './PlaylistAddModal.vue'
import api from '@/api/chat/index.js'
import subscribeApi from '@/api/subscribe/index.js'
import videoApi from '@/api/video-player/index.js'
import channelApi from '@/api/channel/index.js'
import useMemberStore from '@/stores/useMemberStore.js'
import Modal from '@/components/ui/Modal.vue'
import CreateTogetherModal from '@/components/together/CreateTogetherModal.vue'
import { useRoute, useRouter } from 'vue-router'
import ButtonBasic from '@/components/ui/ButtonBasic.vue'

const route = useRoute()
const videoId = route.params.id
const props = defineProps(['videoInfo'])
const router = useRouter()
const memberStore = useMemberStore()

const showModal = ref(false)
const videoRating = ref(0)
const showPlaylistModal = ref(false)
const showChatModal = ref(false)
const showLoginModal = ref(false)
const channelIdx = ref(0)
const subscribeState = ref(false)

const createChatRoom = async () => {
  if (!memberStore.checkLogin()) {
    showLoginModal.value = true
    return
  }

  const videoIdx = props.videoInfo.idx

  try {
    await api.createChatRoom(videoIdx)
    showChatModal.value = true
  } catch (error) {
    alert('채팅방 생성에 실패했습니다.')
  }
}

const getChannelIdx = async () => {
  const res = await videoApi.getVideoById(videoId)
  if (res.code === 200) {
    const response = await channelApi.getChannelInfoByChannelName(res.data.channelName)
    channelIdx.value = response.id
  }
}

const getSubscribe = async () => {
  const res = await subscribeApi.isSubscribe(channelIdx.value)
  if (res.code === 200) {
    subscribeState.value = res.data.isSubscribe
  }
}

const trySubscribe = async () => {
  if (!subscribeState.value) {
    await subscribeApi.trySubscribe(channelIdx.value)
    subscribeState.value = true
    return
  }
  await subscribeApi.deleteSubscribe(channelIdx.value)
  subscribeState.value = false
}

const closeTogetherModal = () => {
  showModal.value = false
}

const showTogetherModal = () => {
  showModal.value = true
}

const copyVideo = async () => {
  const currentUrl = window.location.href
  await navigator.clipboard.writeText(currentUrl)
  alert('클립보드에 복사되었습니다!')
}

const navigateToChatRoom = () => {
  showChatModal.value = false
  router.push({ name: 'message' })
}

onMounted(async () => {
  await getChannelIdx()
  await getSubscribe()
})
</script>

<template>
  <div class="channel-panel">
    <div class="channel-left">
      <img class="channel-avatar" src="@/assets/images/dabom2.png" alt="채널 프로필" />
      <div class="channel-meta">
        <strong>{{ props.videoInfo.channelName }}</strong>
        <span>구독자 {{ props.videoInfo.subscribeCount }}명</span>
      </div>
    </div>

    <div class="channel-actions">
      <ButtonBasic class="btn" variant="primary" @click="trySubscribe">{{ subscribeState ? '구독중' : '구독' }}</ButtonBasic>
      <ButtonBasic class="btn" @click="createChatRoom"><i class="fa-solid fa-envelope"></i> 메시지</ButtonBasic>
      <ButtonBasic class="btn" @click="showTogetherModal"><i class="fas fa-users"></i> 투게더</ButtonBasic>
      <ButtonBasic class="btn" @click="copyVideo"><i class="fas fa-share"></i> 공유</ButtonBasic>
      <ButtonBasic class="btn" @click="showPlaylistModal = true"><i class="fas fa-plus"></i> 저장</ButtonBasic>
    </div>
  </div>

  <div class="rating-inline">
    <span>이 영상을 평가해주세요:</span>
    <StarRating v-model="videoRating" :video-info="props.videoInfo" />
  </div>

  <PlaylistAddModal
    v-if="showPlaylistModal"
    :video-info="props.videoInfo"
    @close="showPlaylistModal = false"
  />
  <Modal
    v-if="showChatModal"
    title="채팅방 생성"
    message="채팅방이 생성되었습니다. 채팅 페이지로 이동합니다"
    @confirm="navigateToChatRoom"
  />
  <Modal
    v-if="showLoginModal"
    title="로그인이 필요합니다."
    message="채팅을 시작하려면 로그인해주세요."
    @confirm="showLoginModal = false"
  />
  <CreateTogetherModal
    v-if="showModal"
    :visible="showModal"
    @close="closeTogetherModal"
  />
</template>

<style scoped>
.channel-panel {
  background: #2c2c2c;
  border: 1px solid #404040;
  border-radius: 16px;
  padding: 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
}

.channel-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.channel-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
}

.channel-meta {
  display: grid;
  gap: 3px;
}

.channel-meta strong {
  font-size: 16px;
}

.channel-meta span {
  font-size: 13px;
  color: var(--text-secondary);
}

.channel-actions {
  display: flex;
  flex-wrap: nowrap;
  gap: 10px;
  align-items: center;
  overflow-x: auto;
}

.btn {
  border: 1px solid var(--border-color);
  background: #383838;
  color: var(--text-primary);
  border-radius: 22px;
  padding: 10px 16px;
  font-size: 14px;
  cursor: pointer;
  white-space: nowrap;
}

.btn i {
  margin-right: 6px;
}

.btn-primary {
  background: var(--primary-color);
  border-color: var(--primary-color);
  color: #fff;
  font-weight: 700;
}

.rating-inline {
  margin-top: 10px;
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--text-secondary);
  font-size: 13px;
}

@media (max-width: 900px) {
  .channel-panel {
    flex-direction: column;
    align-items: flex-start;
  }

  .channel-actions {
    width: 100%;
  }
}
</style>
