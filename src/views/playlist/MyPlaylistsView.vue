<template>
  <main class="playlist-page">
    <section class="page-head">
      <div>
        <h1>내 플레이리스트</h1>
        <p>총 {{ playlists.length }}개</p>
      </div>
      <ButtonBasic variant="primary" :disabled="true">새 플레이리스트</ButtonBasic>
    </section>

    <div v-if="loading" class="state-panel">
      <i class="fas fa-spinner fa-spin"></i>
      <span>플레이리스트를 불러오는 중...</span>
    </div>
    <div v-else-if="error" class="state-panel">
      <i class="fas fa-exclamation-triangle"></i>
      <span>{{ error }}</span>
    </div>
    <div v-else-if="playlists.length === 0" class="state-panel">
      <i class="fas fa-box-open"></i>
      <span>플레이리스트가 없습니다.</span>
      <p>'내 채널 관리'에서 새로운 플레이리스트를 만들어보세요.</p>
    </div>
    <div v-else class="playlist-grid">
      <PlaylistCard v-for="playlist in playlists" :key="playlist.idx" :playlist="playlist" />
    </div>
  </main>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import api from '@/api/playlist/index.js'
import PlaylistCard from '@/components/playlist/PlaylistCard.vue'
import ButtonBasic from '@/components/ui/ButtonBasic.vue'

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
.playlist-page {
  max-width: 1400px;
  margin: 0 auto;
  padding: 22px 16px 56px;
}

.page-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  margin-bottom: 14px;
}

.page-head h1 {
  margin: 0;
  font-size: 30px;
}

.page-head p {
  margin: 4px 0 0;
  color: var(--text-secondary);
}

.playlist-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
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

.state-panel p {
  margin-top: 0.5rem;
  font-size: 0.9rem;
}

@media (max-width: 1024px) {
  .playlist-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 760px) {
  .page-head {
    flex-direction: column;
    align-items: flex-start;
  }

  .playlist-grid {
    grid-template-columns: 1fr;
  }
}
</style>
