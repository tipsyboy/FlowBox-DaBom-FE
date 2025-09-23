<script setup>
import { reactive, onMounted } from 'vue';
import api from '@/api/playlist';

const props = defineProps({
  isActive: Boolean
});

const playlists = reactive([]);

// Fetch playlists on component mount
const fetchPlaylists = async () => {
  try {
    const response = await api.getMyPlaylists();
    playlists.splice(0, playlists.length, ...response.data);
  } catch (error) {
    console.error('Failed to load playlists:', error);
    alert('플레이리스트를 불러오는데 실패했습니다.');
  }
};

onMounted(() => {
  fetchPlaylists();
});

// Handle playlist title update
const handleEdit = async (item) => {
  try {
    await api.updatePlaylist(item.idx, item.playlistTitle);
    alert('수정되었습니다!');
  } catch (e) {
    alert('수정 실패: 이 기능은 백엔드에 구현이 필요합니다.');
    console.error(e);
  }
};

// Handle playlist deletion
const handleDelete = async (item) => {
  if (!confirm('정말 삭제하시겠습니까?')) return;
  try {
    await api.deletePlaylist(item.idx);
    // Refetch the list to show the change
    await fetchPlaylists();
    alert('삭제되었습니다!');
  } catch (e) {
    alert('삭제 실패: 이 기능은 백엔드에 구현이 필요합니다.');
    console.error(e);
  }
};

// Handle new playlist creation
const handleCreate = async () => {
  const newTitle = prompt('새 플레이리스트의 이름을 입력하세요:');
  if (!newTitle) return;

  try {
    await api.createPlaylist(newTitle);
    // Refetch the list to show the new playlist
    await fetchPlaylists();
    alert('새 플레이리스트가 추가되었습니다!');
  } catch (e) {
    alert('추가 실패');
    console.error(e);
  }
};
</script>

<template>
  <section id="section-playlists" class="dashboard-section" :class="{ active: isActive }">
    <h2>플레이리스트 관리</h2>
    <button class="btn-create" @click="handleCreate">
      <i class="fas fa-plus"></i> 플레이리스트 추가
    </button>
    <div class="playlist-table-area">
      <table class="playlist-table">
        <thead>
        <tr>
          <th>제목</th>
          <th>영상 수</th>
          <th>관리</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="item in playlists" :key="item.idx">
          <td>
            <input type="text" v-model="item.playlistTitle">
          </td>
          <td>
            <span class="video-count">{{ item.items.length }}</span>
          </td>
          <td>
            <button class="btn-list-edit" @click="handleEdit(item)">
              <i class="fas fa-edit"></i>
            </button>
            <button class="btn-list-delete" @click="handleDelete(item)">
              <i class="fas fa-trash"></i>
            </button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<style scoped>
@import url(@/CSS/main.css);
@import url(@/assets/channel/mychannel.css);

/* Add some styles for the input field to make it look better */
input[type="text"] {
  background-color: var(--card-bg);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
  padding: 0.5rem;
  border-radius: 5px;
  width: 100%;
}

input[type="text"]:focus {
  outline: none;
  border-color: var(--primary-color);
}

</style>