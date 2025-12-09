<template>
  <router-link :to="{ name: 'playlist-detail', params: { id: playlist.idx } }" class="playlist-card-link">
    <div class="playlist-card">
      <div class="playlist-thumbnail">
        <i class="fas fa-list-music"></i>
        <div class="video-count-overlay">
          <span>{{ playlist.items.length }}</span>
          <i class="fas fa-bars"></i>
        </div>
      </div>
      <div class="playlist-info">
        <h4 class="playlist-title">{{ playlist.playlistTitle }}</h4>
        <p class="playlist-meta">수정일: {{ formattedUpdatedAt }}</p>
      </div>
    </div>
  </router-link>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  playlist: {
    type: Object,
    required: true
  }
});

const formattedUpdatedAt = computed(() => {
  if (!props.playlist.updatedAt) return '';
  return props.playlist.updatedAt.split(' ')[0]; // 날짜 부분만 표시
});
</script>

<style scoped>
.playlist-card-link {
  text-decoration: none;
  color: inherit;
}

.playlist-card {
  background-color: var(--card-bg);
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.playlist-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}

.playlist-thumbnail {
  position: relative;
  aspect-ratio: 16 / 9;
  background-color: #333;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 4rem; /* 아이콘 크기 */
}

.video-count-overlay {
  position: absolute;
  bottom: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 5px 10px;
  border-top-left-radius: 8px;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 5px;
}

.playlist-info {
  padding: var(--spacing-md);
}

.playlist-title {
  color: var(--text-primary);
  font-size: var(--font-md);
  font-weight: 600;
  margin-bottom: var(--spacing-xs);
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.playlist-meta {
  font-size: var(--font-sm);
  color: var(--text-secondary);
}
</style>
