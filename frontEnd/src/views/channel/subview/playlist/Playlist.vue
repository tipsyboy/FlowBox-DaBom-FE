<script setup>
import { onMounted, reactive, ref } from 'vue';
import api from '@/api/playlist';
import { useRouter } from 'vue-router';
import '@/CSS/playList.css';

const router = useRouter();
const playlists = reactive([]);
const selectedPlaylist = ref(null); // To store the currently selected playlist details
const showPlaylistVideos = ref(false); // To control visibility of video list

onMounted(async () => {
  try {
    const response = await api.getMyPlaylists();
    console.log('Response from getMyPlaylists:', response); // Add this line for debugging
    playlists.splice(0, playlists.length, ...response.data);
  } catch (error) {
    console.error('Failed to load playlists:', error);
  }
});

const getPlaylistDetails = async (playlistIdx) => {
  try {
    const response = await api.getPlaylistDetails(playlistIdx);
    selectedPlaylist.value = response; // Assuming response contains playlist details including videoList
    showPlaylistVideos.value = true; // Show the video list section
  } catch (error) {
    console.error('Failed to load playlist details:', error);
  }
};

const playVideo = (videoIdx) => {
  router.push(`/video-player/${videoIdx}`);
};

const goBackToPlaylists = () => {
  showPlaylistVideos.value = false;
  selectedPlaylist.value = null;
};
</script>

<template>
  <div class="layout-wrap">
    <div class="main-wrap">
      <h1 v-if="!showPlaylistVideos">내 플레이리스트</h1>
      <h1 v-else>{{ selectedPlaylist.playlistTitle }}</h1>

      <button v-if="showPlaylistVideos" @click="goBackToPlaylists" class="back-button">
        &larr; 플레이리스트 목록으로 돌아가기
      </button>

      <div class="playlists-grid" v-if="!showPlaylistVideos">
        <div v-for="playlist in playlists" :key="playlist.idx" class="playlist-card" @click="getPlaylistDetails(playlist.idx)">
          <div class="playlist-thumbnail">
            <!-- <img src="https://via.placeholder.com/320x180?text=Playlist" alt="플레이리스트 썸네일"> -->
            <div style="width: 320px; height: 180px; background-color: #ccc; display: flex; align-items: center; justify-content: center; color: #333;">플레이리스트 썸네일</div>
            <div class="playlist-count">
              <i class="fas fa-list"></i>
              {{ playlist.videoCount }}개 동영상
            </div>
          </div>
          <div class="playlist-info">
            <h3 class="playlist-title">{{ playlist.playlistTitle }}</h3>
          </div>
        </div>
      </div>

      <div class="video-list-grid" v-if="showPlaylistVideos && selectedPlaylist">
        <div v-for="video in selectedPlaylist.videoList" :key="video.idx" class="video-card" @click="playVideo(video.idx)">
          <div class="video-thumbnail">
            <!-- <img :src="video.thumbnailUrl || 'https://via.placeholder.com/320x180?text=Video'" :alt="video.title"> -->
            <div style="width: 320px; height: 180px; background-color: #ccc; display: flex; align-items: center; justify-content: center; color: #333;">비디오 썸네일</div>
          </div>
          <div class="video-info">
            <h3 class="video-title">{{ video.title }}</h3>
            <p class="video-channel">{{ video.channelName }}</p>
          </div>
        </div>
        <p v-if="selectedPlaylist.videoList && selectedPlaylist.videoList.length === 0">이 플레이리스트에는 동영상이 없습니다.</p>
      </div>
    </div>
  </div>
</template>

<style scoped>


.layout-wrap {
  display: flex;
}

.main-wrap {
  flex: 1;
  margin-top: 3rem;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 78%;
}

h1 {
  color: white;
  margin-bottom: 2rem;
}

.back-button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
  margin-bottom: 20px;
}

.back-button:hover {
  background-color: #0056b3;
}

.video-list-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  width: 100%;
  max-width: 1200px; /* Adjust as needed */
}

.video-card {
  background-color: #2c2c2c;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s;
}

.video-card:hover {
  transform: translateY(-5px);
}

.video-thumbnail img {
  width: 100%;
  height: 150px;
  object-fit: cover;
}

.video-info {
  padding: 10px;
}

.video-title {
  font-size: 1.1em;
  color: white;
  margin-bottom: 5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.video-channel {
  font-size: 0.9em;
  color: #aaa;
}

/* Using the existing styles from playList.css */
</style>