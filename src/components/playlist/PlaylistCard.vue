<template>
  <router-link :to="{ name: 'playlist-detail', params: { id: playlist.idx } }" class="playlist-card-link">
    <div class="playlist-card">
      <div class="playlist-thumbnail">
        <img :src="coverImage" :alt="playlist.playlistTitle" class="playlist-cover" />
        <div class="video-count-overlay">
          <span>{{ playlist.items?.length || playlist.videos?.length || 0 }}</span>
          <i class="fas fa-bars"></i>
        </div>
      </div>
      <div class="playlist-info">
        <h4 class="playlist-title">{{ playlist.playlistTitle }}</h4>
        <p class="playlist-meta">수정일: {{ formattedUpdatedAt }}</p>
        <span class="playlist-open">열기</span>
      </div>
    </div>
  </router-link>
</template>

<script setup>
import { computed } from 'vue';
import bannerFallback from '@/assets/images/banner.png'

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

const coverImage = computed(() => {
  return props.playlist.thumbnailImage || props.playlist.videos?.[0]?.videoImage || bannerFallback
})
</script>

<style scoped>
.playlist-card-link {
  text-decoration: none;
  color: inherit;
}

.playlist-card {
  background-color: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.playlist-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 14px 30px rgba(0, 0, 0, 0.24);
  border-color: rgba(250, 85, 0, 0.45);
}

.playlist-thumbnail {
  position: relative;
  aspect-ratio: 16 / 9;
  background-color: #333;
}

.playlist-cover {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.video-count-overlay {
  position: absolute;
  bottom: 8px;
  right: 8px;
  background-color: rgba(0, 0, 0, 0.78);
  color: white;
  padding: 4px 8px;
  border-radius: 8px;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 5px;
}

.playlist-info {
  padding: 12px;
  display: grid;
  gap: 6px;
}

.playlist-title {
  color: var(--text-primary);
  font-size: 16px;
  font-weight: 600;
  margin: 0;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.playlist-meta {
  margin: 0;
  font-size: 13px;
  color: var(--text-secondary);
}

.playlist-open {
  margin-top: 4px;
  width: fit-content;
  border: 1px solid var(--border-color);
  background: #373737;
  color: var(--text-primary);
  border-radius: 10px;
  padding: 7px 11px;
  font-size: 13px;
}
</style>
