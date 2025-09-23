<template>
  <div class="modal-backdrop" @click.self="closeModal">
    <div class="modal-content">
      <div class="modal-header">
        <h3>플레이리스트에 추가</h3>
        <button class="close-btn" @click="closeModal">&times;</button>
      </div>
      <div class="modal-body">
        <ul v-if="playlists.length > 0" class="playlist-list">
          <li v-for="playlist in playlists" :key="playlist.idx" @click="handleAddToPlaylist(playlist.idx)">
            {{ playlist.playlistTitle }}
          </li>
        </ul>
        <p v-else>생성된 플레이리스트가 없습니다.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import playlistApi from '@/api/playlist';

// 부모 컴포넌트로부터 받을 props 정의 (videoId)
const props = defineProps({
  videoInfo: {
    type: Object,
    required: true
  }
});

// 부모 컴포넌트로 보낼 emits 이벤트 정의 (close)
const emit = defineEmits(['close']);

const playlists = ref([]);

// 컴포넌트가 마운트될 때 내 플레이리스트 목록을 가져옵니다.
onMounted(async () => {
  const response = await playlistApi.getMyPlaylists();
  if (response.code === 200) {
    playlists.value = response.data;
  } else {
    alert(response.message || '플레이리스트를 불러오는 데 실패했습니다.');
  }
});

// 플레이리스트에 비디오를 추가하는 함수
const handleAddToPlaylist = async (playlistIdx) => {
  if (!props.videoInfo || !props.videoInfo.idx) {
    alert('비디오 정보가 올바르지 않습니다.');
    return;
  }
  
  const response = await playlistApi.addVideoToPlaylist(playlistIdx, props.videoInfo.idx);
  if (response.code === 200) {
    alert('플레이리스트에 비디오가 추가되었습니다.');
    closeModal(); // 성공 시 모달 닫기
  } else {
    alert(response.message || '비디오 추가에 실패했습니다.');
  }
};

// 모달을 닫는 함수
const closeModal = () => {
  emit('close');
};
</script>

<style scoped>
/* 전체적인 모달 스타일 */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  transition: opacity 0.3s ease;
}

.modal-content {
  background-color: #2c2c2c;
  color: #fff;
  padding: 24px;
  border-radius: 12px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.5);
  border: 1px solid #444;
  transform: scale(0.95);
  transition: transform 0.3s ease;
}

.modal-backdrop:not(.v-enter-from):not(.v-leave-to) .modal-content {
    transform: scale(1);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #444;
  padding-bottom: 16px;
  margin-bottom: 16px;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.4rem;
  font-weight: 600;
}

.close-btn {
  border: none;
  background: none;
  font-size: 1.8rem;
  color: #aaa;
  cursor: pointer;
  transition: color 0.2s ease;
}

.close-btn:hover {
  color: #fff;
}

.modal-body p {
    text-align: center;
    color: #aaa;
    padding: 20px 0;
}

.playlist-list {
  list-style: none;
  padding: 0;
  margin: 0;
  max-height: 250px;
  overflow-y: auto;
}

/* 스크롤바 스타일 */
.playlist-list::-webkit-scrollbar {
  width: 8px;
}

.playlist-list::-webkit-scrollbar-track {
  background: #2c2c2c;
}

.playlist-list::-webkit-scrollbar-thumb {
  background: #555;
  border-radius: 4px;
}

.playlist-list::-webkit-scrollbar-thumb:hover {
  background: #777;
}

.playlist-list li {
  padding: 14px 10px;
  border-bottom: 1px solid #444;
  cursor: pointer;
  transition: background-color 0.2s ease;
  font-size: 1rem;
}

.playlist-list li:hover {
  background-color: #3a3a3a;
}

.playlist-list li:last-child {
  border-bottom: none;
}
</style>