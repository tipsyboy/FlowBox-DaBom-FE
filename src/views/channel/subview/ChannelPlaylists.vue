<template>
  <section class="tab-header">
    <h2>재생목록</h2>
  </section>

  <div class="view-container">
    <div v-if="loading" class="state-box">
      <i class="fas fa-spinner fa-spin"></i>
      <span>플레이리스트를 불러오는 중...</span>
    </div>
    <div v-else-if="error" class="state-box">
      <i class="fas fa-exclamation-triangle"></i>
      <span>{{ error }}</span>
    </div>
    <div v-else-if="playlists.length === 0" class="state-box">
      <i class="fas fa-box-open"></i>
      <span>플레이리스트가 없습니다.</span>
    </div>
    <div v-else class="playlist-grid">
      <PlaylistCard v-for="playlist in playlists" :key="playlist.idx" :playlist="playlist" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/api/playlist/index.js'
import PlaylistCard from '@/components/playlist/PlaylistCard.vue'

const playlists = ref([])
const loading = ref(true)
const error = ref(null)

onMounted(async () => {
  try {
    const response = await api.getMyPlaylists()
    if (response.code === 200) {
      playlists.value = response.data
    } else {
      throw new Error(response.message || '플레이리스트를 가져올 수 없습니다.')
    }
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
})
</script>

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

.view-container {
  width: 100%;
}

.playlist-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}

.state-box {
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 24px;
  color: var(--text-secondary);
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

@media (max-width: 1080px) {
  .playlist-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 860px) {
  .playlist-grid {
    grid-template-columns: 1fr;
  }
}
</style>
