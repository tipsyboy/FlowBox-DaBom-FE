<script setup>
import Video_Main_Info from '@/components/video/player/VideoMainInfo.vue'
import Video_Tag_Explain from '@/components/video/player/VideoTagExplain.vue'
import Video_Comment from '@/components/video/player/VideoComment.vue'
import {useRoute} from 'vue-router'
import {onMounted, reactive, ref, onUnmounted} from 'vue'
import Hls from 'hls.js'
import api from '@/api/video-player/index.js'
import useMemberStore from '@/stores/useMemberStore.js'
import channelApi from "@/api/channel/index.js"
import bannerImg from '@/assets/images/banner.png'
import { withImageCacheBust } from '@/utils/image.js'

const route = useRoute()
const videoId = route.params.id
const videoPlayer = ref(null)
const isMuted = ref(true)
const memberStore = useMemberStore() 
let hls = null

const videoInfo = reactive({
  idx: '',
  title: '',
  description: '',
  savedPath: '',
  isSubscribed: '',
  channelName: '',
  viewCount: 0,
  videoScore: 0,
  subscribeCount: 0
})

const recommendVideos = [
  { id: 1, title: 'Pinia 스토어 구조 정리', channel: 'FlowBox Studio', views: '7.3K', thumbnail: bannerImg },
  { id: 2, title: '공통 CSS 토큰 적용법', channel: 'Dabom Dev', views: '5.1K', thumbnail: bannerImg },
  { id: 3, title: '모달 컴포넌트 재사용 패턴', channel: 'Frontend Notes', views: '4.7K', thumbnail: bannerImg }
]

const currentUserProfile = ref({
  profileImg: 'https://via.placeholder.com/40',
  name: '사용자'
})

const loadCurrentUserProfile = async () => {
  try {
    const myChannelName = memberStore.getChannelNameWithEncrypt()
    if (myChannelName) {
      const channelInfoResponse = await channelApi.getChannelInfoByChannelName(myChannelName)
      if (channelInfoResponse) {
        currentUserProfile.value = {
          profileImg: withImageCacheBust(channelInfoResponse.profileImg || '', Date.now()) || 'https://via.placeholder.com/40',
          name: channelInfoResponse.name || '사용자'
        }
      }
    }
  } catch (error) {
  }
}

const getData = async () => {
  const result = await api.getVideoById(videoId)
  Object.assign(videoInfo, result.data)
  console.log(result.data)
  if (videoInfo.savedPath) {
    initHlsPlayer()
  }
}

const initHlsPlayer = () => {
  if (!videoPlayer.value || !videoInfo.savedPath) return

  const video = videoPlayer.value
  const videoUrl = videoInfo.savedPath
  isMuted.value = video.muted || video.volume === 0

  if (hls) {
    hls.destroy()
  }

  if (Hls.isSupported()) {
    hls = new Hls()
    hls.loadSource(videoUrl)
    hls.attachMedia(video)

    hls.on(Hls.Events.MANIFEST_PARSED, () => {
      console.log("load hls..")
    })

    hls.on(Hls.Events.ERROR, (event, data) => {
      console.error('HLS 에러:', data)
    })
  } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
    video.src = videoUrl
  }
}

const syncMuteState = () => {
  if (!videoPlayer.value) return
  isMuted.value = videoPlayer.value.muted || videoPlayer.value.volume === 0
}

onMounted(async () => {
  // 데이터 로드를 병렬로 실행
  await Promise.all([
    getData(),
    loadCurrentUserProfile()
  ])
})

onUnmounted(() => {
  if (hls) {
    hls.destroy()
    hls = null
  }
})
</script>

<template>
  <div class="video-page-container">
    <section class="video-player-section">
      <div class="video-player-wrapper">
        <video
          ref="videoPlayer"
          class="video-player"
          controls
          muted
          autoplay
          @volumechange="syncMuteState"
        >
          지원하지 않는 비디오 플레이어 입니다.
        </video>
        <div v-if="isMuted" class="audio-hint">소리를 들으려면 음소거를 해제하세요</div>
      </div>
    </section>

    <section class="main-content-area">
      <div class="content-column">
        <h1 class="video-title">{{ videoInfo.title }}</h1>
        <Video_Tag_Explain :videoInfo="videoInfo"/>
        <Video_Main_Info :videoInfo="videoInfo"/>
        <Video_Comment :current-user-profile="currentUserProfile"/>
      </div>

      <aside class="right-column">
        <h3>추천 영상</h3>
        <RouterLink
          v-for="item in recommendVideos"
          :key="item.id"
          class="recommend-card"
          :to="`/video-player/${videoId}`"
        >
          <img :src="item.thumbnail" :alt="item.title" />
          <div>
            <strong>{{ item.title }}</strong>
            <p>{{ item.channel }} · 조회수 {{ item.views }}</p>
          </div>
        </RouterLink>
      </aside>
    </section>
  </div>
</template>

<style scoped>
.video-page-container {
  width: 100%;
  min-height: 100vh;
  background-color: var(--background-color, #1a1a1a);
}

.video-player-section {
  background-color: #000000;
}

.video-player-wrapper {
  width: 100%;
  max-height: 75vh;
  aspect-ratio: 16 / 9;
  background-color: #000;
  position: relative;
}

.video-player {
  width: 100%;
  height: 100%;
  object-fit: contain;
  background: #000;
  display: block;
}

.audio-hint {
  position: absolute;
  right: 24px;
  bottom: 96px;
  padding: 12px 18px;
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.72);
  color: #fff;
  font-size: 15px;
  font-weight: 700;
  line-height: 1.3;
  pointer-events: none;
}

.main-content-area {
  max-width: 1400px;
  margin: 0 auto;
  padding: 32px 16px 72px;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 350px;
  gap: 32px;
}

.content-column {
  display: grid;
  gap: 22px;
  padding: 0 0.5rem 0 3.5rem;
}

.video-title {
  margin: 0;
  color: var(--text-primary, #fff);
  font-size: 32px;
  font-weight: 600;
  line-height: 1.3;
}

.right-column h3 {
  margin: 0 0 14px;
  font-size: 20px;
}

.right-column {
  display: grid;
  gap: 12px;
  align-content: start;
}

.recommend-card {
  display: grid;
  grid-template-columns: 160px 1fr;
  gap: 10px;
  text-decoration: none;
  color: var(--text-primary);
  background: #2c2c2c;
  border: 1px solid var(--border-color);
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.recommend-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.3);
}

.recommend-card img {
  width: 100%;
  height: 100%;
  min-height: 90px;
  object-fit: cover;
}

.recommend-card > div {
  padding: 10px 10px 10px 0;
}

.recommend-card strong {
  display: block;
  font-size: 14px;
  line-height: 1.35;
  margin-bottom: 4px;
}

.recommend-card p {
  margin: 0;
  color: var(--text-secondary);
  font-size: 12px;
}

@media (max-width: 1200px) {
  .content-column {
    padding: 0;
  }
}

@media (max-width: 1024px) {
  .main-content-area {
    grid-template-columns: 1fr;
    gap: 20px;
  }
}
</style>
