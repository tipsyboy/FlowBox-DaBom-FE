<template>
  <div class="view-container">
    <div v-if="loading" class="loading-container">
      <i class="fas fa-spinner fa-spin"></i>
      <span>플레이리스트 정보를 불러오는 중...</span>
    </div>
    <div v-else-if="error" class="error-container">
      <i class="fas fa-exclamation-triangle"></i>
      <span>{{ error }}</span>
    </div>
    <div v-else-if="playlist" class="playlist-detail-container">
      <div class="playlist-header">
        <div class="header-icon">
            <i class="fas fa-list-music"></i>
        </div>
        <div class="header-info">
            <h1 class="playlist-title">{{ playlist.playlistTitle }}</h1>
            <p class="playlist-meta">{{ playlist.videos.length }}개의 동영상 • 최종 수정: {{ formattedUpdatedAt }}</p>
        </div>
      </div>

      <div class="video-list-section">
         <VideoSectionComp 
            :videos="videoListForComponent" 
            title="Video List"
            icon="fa-solid fa-music"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import api from '@/api/playlist';
import VideoSectionComp from '@/components/videos/VideoSectionComp.vue';

const route = useRoute();
const playlist = ref(null);
const loading = ref(true);
const error = ref(null);

const playlistId = route.params.id;

onMounted(async () => {
  console.log("플레이리스트 상세 정보 로딩 시작. ID:", playlistId);
  try {
    const response = await api.getPlaylistDetails(playlistId);
    console.log("API 응답:", response);
    if (response.code === 200) {
      playlist.value = response.data;
      console.log("플레이리스트 데이터:", playlist.value);
    } else {
      const errorMessage = response.message || '플레이리스트 상세 정보를 가져올 수 없습니다.';
      console.error("API 응답 오류:", errorMessage, response);
      throw new Error(errorMessage);
    }
  } catch (err) {
    console.error("데이터 로딩 중 예외 발생:", err);
    error.value = err.message;
  } finally {
    loading.value = false;
    console.log("로딩 상태 종료. loading.value:", loading.value);
  }
});

const formattedUpdatedAt = computed(() => {
  if (!playlist.value || !playlist.value.updatedAt) return '';
  return playlist.value.updatedAt.split(' ')[0];
});

const videoListForComponent = computed(() => {
    if (!playlist.value || !playlist.value.videos) return [];
    return playlist.value.videos.map(item => {
        return {
            ...item,
            videoId: item.idx // videoId를 video 객체의 idx로 설정
        };
    });
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

.playlist-header {
    display: flex;
    align-items: center;
    gap: 2rem;
    padding: 2rem;
    background-color: var(--card-bg);
    border-radius: 12px;
    margin-bottom: 3rem;
}

.header-icon {
    font-size: 5rem;
    color: var(--primary-color);
}

.header-info {
    display: flex;
    flex-direction: column;
}

.playlist-title {
    font-size: 2.5rem;
    font-weight: 700;
    color: var(--text-primary);
    margin: 0 0 0.5rem 0;
}

.playlist-meta {
    font-size: 1rem;
    color: var(--text-secondary);
}

.loading-container, .error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  color: var(--text-secondary);
}

.loading-container i, .error-container i {
  font-size: 3rem;
  margin-bottom: 1rem;
  color: var(--primary-color);
}
</style>
