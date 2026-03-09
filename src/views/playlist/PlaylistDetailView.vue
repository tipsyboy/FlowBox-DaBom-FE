<template>
  <main class="playlist-detail-page">
    <div v-if="loading" class="state-panel">
      <i class="fas fa-spinner fa-spin"></i>
      <span>플레이리스트 정보를 불러오는 중...</span>
    </div>
    <div v-else-if="error" class="state-panel">
      <i class="fas fa-exclamation-triangle"></i>
      <span>{{ error }}</span>
    </div>
    <section v-else-if="playlist" class="layout">
      <aside class="panel summary-panel">
        <h2>{{ playlist.playlistTitle }}</h2>
        <p class="muted">{{ playlist.videos.length }}개 영상 · 공개</p>
        <p class="muted">{{ playlist.description || '저장한 영상들을 한 곳에서 이어서 볼 수 있는 플레이리스트입니다.' }}</p>
        <div class="action-row">
          <button class="primary-btn" type="button" disabled>전체 재생</button>
          <button class="ghost-btn" type="button" disabled>편집</button>
          <RouterLink class="ghost-btn" :to="{ name: 'my-playlists' }">목록</RouterLink>
        </div>
      </aside>

      <section class="panel">
        <div class="section-head">
          <div>
            <h2>영상 목록</h2>
            <p class="muted">최종 수정: {{ formattedUpdatedAt }}</p>
          </div>
        </div>

        <div class="video-list">
          <article v-for="video in videoListForComponent" :key="video.videoId" class="video-item">
            <img :src="video.videoImage || bannerFallback" :alt="video.title || 'thumb'" />
            <div class="video-copy">
              <h4>{{ video.title || '제목 없음' }}</h4>
              <p>{{ video.views || 0 }} views · {{ video.uploadedAt || '-' }}</p>
            </div>
            <RouterLink class="ghost-btn" :to="{ name: 'videoPlayer', params: { id: video.videoId } }">재생</RouterLink>
          </article>
        </div>
      </section>
    </section>
  </main>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import api from '@/api/playlist/index.js'
import bannerFallback from '@/assets/images/banner.png'

const route = useRoute()
const playlist = ref(null)
const loading = ref(true)
const error = ref(null)

const playlistId = route.params.id

onMounted(async () => {
  try {
    const response = await api.getPlaylistDetails(playlistId)
    if (response.code === 200) {
      playlist.value = response.data
    } else {
      throw new Error(response.message || '플레이리스트 상세 정보를 가져올 수 없습니다.')
    }
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
})

const formattedUpdatedAt = computed(() => {
  if (!playlist.value || !playlist.value.updatedAt) return ''
  return playlist.value.updatedAt.split(' ')[0]
})

const videoListForComponent = computed(() => {
  if (!playlist.value || !playlist.value.videos) return []
  return playlist.value.videos.map((item) => ({
    ...item,
    videoId: item.idx,
  }))
})
</script>

<style scoped>
.playlist-detail-page {
  max-width: 1400px;
  margin: 0 auto;
  padding: 22px 16px 56px;
}

.layout {
  display: grid;
  grid-template-columns: 380px 1fr;
  gap: 14px;
}

.panel {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 14px;
}

.panel h2 {
  margin: 0 0 10px;
}

.muted {
  margin: 0 0 10px;
  color: var(--text-secondary);
  font-size: 13px;
  line-height: 1.5;
}

.action-row {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.primary-btn,
.ghost-btn {
  border: 1px solid var(--border-color);
  background: #373737;
  color: var(--text-primary);
  border-radius: 10px;
  padding: 9px 12px;
  font-size: 13px;
  text-decoration: none;
  display: inline-block;
}

.primary-btn {
  background: var(--primary-color);
  border-color: var(--primary-color);
  color: #fff;
}

.section-head {
  margin-bottom: 10px;
}

.video-list {
  display: grid;
  gap: 10px;
}

.video-item {
  border: 1px solid var(--border-color);
  border-radius: 10px;
  background: #282828;
  padding: 10px;
  display: grid;
  grid-template-columns: 150px 1fr auto;
  gap: 10px;
  align-items: center;
}

.video-item img {
  width: 150px;
  height: 84px;
  object-fit: cover;
  border-radius: 8px;
}

.video-copy h4 {
  margin: 0 0 5px;
  font-size: 15px;
}

.video-copy p {
  margin: 0;
  color: var(--text-secondary);
  font-size: 12px;
}

.state-panel {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  color: var(--text-secondary);
  text-align: center;
}

.state-panel i {
  font-size: 3rem;
  margin-bottom: 1rem;
  color: var(--primary-color);
}

@media (max-width: 1024px) {
  .layout {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 760px) {
  .video-item {
    grid-template-columns: 1fr;
  }

  .video-item img {
    width: 100%;
    height: auto;
    aspect-ratio: 16 / 9;
  }
}
</style>
