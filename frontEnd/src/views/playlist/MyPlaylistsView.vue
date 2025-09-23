<template>
  <div class="view-container">
    <div class="header-section">
      <h2 class="view-title">
        <i class="fas fa-swatchbook"></i>
        내 플레이리스트
      </h2>
    </div>
    <div v-if="loading" class="loading-container">
      <i class="fas fa-spinner fa-spin"></i>
      <span>플레이리스트를 불러오는 중...</span>
    </div>
    <div v-else-if="error" class="error-container">
      <i class="fas fa-exclamation-triangle"></i>
      <span>{{ error }}</span>
    </div>
    <div v-else-if="playlists.length === 0" class="empty-container">
        <i class="fas fa-box-open"></i>
        <span>플레이리스트가 없습니다.</span>
        <p>'내 채널 관리'에서 새로운 플레이리스트를 만들어보세요.</p>
    </div>
    <div v-else class="playlist-grid">
      <PlaylistCard v-for="playlist in playlists" :key="playlist.idx" :playlist="playlist" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '@/api/playlist';
import PlaylistCard from '@/components/playlist/PlaylistCard.vue';

const playlists = ref([]);
const loading = ref(true);
const error = ref(null);

onMounted(async () => {
  try {
    const response = await api.getMyPlaylists();
    if (response.code === 200) {
      playlists.value = response.data;
    } else {
      throw new Error(response.message || '플레이리스트를 가져올 수 없습니다.');
    }
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.view-container {
  width: 100%;
  max-width: 1600px;
  margin: 0 auto;
  padding: 2rem;
  margin-top: 3rem;
}

.header-section {
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border-color);
}

.view-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.playlist-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

.loading-container, .error-container, .empty-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  color: var(--text-secondary);
  text-align: center;
}

.loading-container i, .error-container i, .empty-container i {
  font-size: 3rem;
  margin-bottom: 1rem;
  color: var(--primary-color);
}

.empty-container p {
    margin-top: 0.5rem;
    font-size: 0.9rem;
}
</style>
