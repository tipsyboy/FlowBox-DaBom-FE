<script setup>
import { onMounted, reactive, computed } from 'vue'
import api from '@/api/video/index.js'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const state = reactive({
  videos: [],
  loading: false,
  error: null,
  size: 16
})

const channelName = computed(() => route.params.channelName || null)

const formatViews = (value) => {
  const count = Number(value || 0)
  if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`
  if (count >= 1000) return `${(count / 1000).toFixed(1)}K`
  return `${count}`
}

const openVideo = (video) => {
  const id = video.videoId || video.id || video.idx
  if (!id) return
  router.push({ name: 'videoPlayer', params: { id } })
}

const getVideoList = async () => {
  try {
    state.loading = true
    state.error = null
    const result = await api.getVideoList(0, state.size, '', channelName.value)
    state.videos = result.content || []
  } catch (error) {
    state.error = '동영상을 불러오지 못했습니다.'
  } finally {
    state.loading = false
  }
}

onMounted(() => {
  getVideoList()
})
</script>

<template>
  <section class="tab-header">
    <h2>동영상</h2>
    <div class="sort-wrap">
      <button class="sort-btn active">최신순</button>
      <button class="sort-btn">인기순</button>
    </div>
  </section>

  <div v-if="state.loading" class="state-box">동영상을 불러오는 중...</div>
  <div v-else-if="state.error" class="state-box">{{ state.error }}</div>
  <div v-else-if="state.videos.length === 0" class="state-box">등록된 동영상이 없습니다.</div>

  <section v-else class="video-grid">
    <article class="video-card" v-for="video in state.videos" :key="video.videoId || video.id || video.idx">
      <button class="thumb-wrap" type="button" @click="openVideo(video)">
        <img :src="video.videoImage || '/src/assets/images/banner.png'" alt="영상 썸네일" />
        <span class="duration">{{ video.duration || '00:00' }}</span>
      </button>
      <div class="video-body">
        <h3>{{ video.title || '제목 없음' }}</h3>
        <p>조회수 {{ formatViews(video.views) }}회</p>
      </div>
    </article>
  </section>
</template>

<style scoped>
.tab-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.tab-header h2 {
  margin: 0;
  font-size: 30px;
}

.sort-wrap {
  display: flex;
  gap: 8px;
}

.sort-btn {
  border: 1px solid var(--border-color);
  background: #303030;
  color: var(--text-secondary);
  border-radius: 16px;
  font-size: 13px;
  padding: 7px 12px;
  cursor: pointer;
}

.sort-btn.active {
  color: var(--text-primary);
  border-color: #5a5a5a;
}

.state-box {
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 24px;
  color: var(--text-secondary);
  text-align: center;
}

.video-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
}

.video-card {
  background: #282828;
  border: 1px solid var(--border-color);
  border-radius: 12px;
  overflow: hidden;
}

.thumb-wrap {
  position: relative;
  display: block;
  text-decoration: none;
  border: none;
  background: transparent;
  padding: 0;
  width: 100%;
  cursor: pointer;
}

.thumb-wrap img {
  width: 100%;
  aspect-ratio: 16 / 9;
  object-fit: cover;
  display: block;
}

.duration {
  position: absolute;
  right: 8px;
  bottom: 8px;
  background: rgba(0, 0, 0, 0.8);
  color: #fff;
  font-size: 12px;
  border-radius: 6px;
  padding: 2px 6px;
}

.video-body {
  padding: 11px;
}

.video-body h3 {
  margin: 0 0 6px;
  font-size: 15px;
  line-height: 1.35;
}

.video-body p {
  margin: 0;
  color: var(--text-secondary);
  font-size: 13px;
}

@media (max-width: 1080px) {
  .video-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (max-width: 860px) {
  .video-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 560px) {
  .video-grid {
    grid-template-columns: 1fr;
  }
}
</style>
