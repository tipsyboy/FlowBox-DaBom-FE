<script setup>
import api from "@/api/auth";
import DeleteModal from "@/components/together/DeleteModal.vue";
import Modal from "@/components/main/Modal.vue";
import {reactive} from "vue";
import useMemberStore from "@/stores/useMemberStore.js";

const props = defineProps({
  currentSection: {
    type: String,
    default: ''
  }
})
const renderModal = reactive({
  "deleteModal": false,
  "modal": false
});
const memberStore = useMemberStore();
const deleteTitle = "Dabom 탈퇴"
const deleteMessage = "Dabom에서 탈퇴하시겠습니까? (삭제된 데이터는 복구할 수 없습니다.)"
const deleteCompleteMessage = "Dabom에서 탈퇴되었습니다."

const openDeleteModal = () => {
  renderModal.deleteModal = true;
}

const closeDeleteModal = () => {
  renderModal.deleteModal = false;
}

const deleteUser = async () => {
  await api.deleteMember();
  closeDeleteModal()
  renderModal.modal=true
}

const endDelete = () => {
  renderModal.modal=true
  window.location.href = '/';
  memberStore.removeWithEncrypt()
}

const emit = defineEmits(['navigate'])
const handleNavigate = (section) => {
  emit('navigate', section)
}
</script>

<template>
  <aside class="dashboard-sidebar">
    <form class="channel-info-form" @submit.prevent="onSubmit">
    </form>
    
    <button 
      :class="['sidebar-btn', { active: props.currentSection === 'videos' }]" 
      @click="handleNavigate('videos')"
    >
      <i class="fas fa-video"></i> 동영상 관리
    </button>
    
    <button 
      :class="['sidebar-btn', { active: props.currentSection === 'playlists' }]" 
      @click="handleNavigate('playlists')"
    >
      <i class="fas fa-list"></i> 플레이리스트 관리
    </button>
    
    <button 
      :class="['sidebar-btn', { active: props.currentSection === 'community' }]" 
      @click="handleNavigate('community')"
    >
      <i class="fas fa-comments"></i> 커뮤니티 관리
    </button>
    
    <button 
      :class="['sidebar-btn', { active: props.currentSection === 'info' }]" 
      @click="handleNavigate('info')"
    >
      <i class="fas fa-user-cog"></i> 채널 정보 수정
    </button>

    <button class="sidebar-btn" @click="openDeleteModal">
      <i class="fas fa-user-times"></i> 회원 탈퇴
    </button>
  </aside>
  <DeleteModal v-if="renderModal.deleteModal" :title="deleteTitle" :message="deleteMessage" @close="closeDeleteModal" @confirm="deleteUser"  />
  <Modal v-if="renderModal.modal" :title="deleteTitle" :message="deleteCompleteMessage" @confirm="endDelete" />
</template>

<style scoped>
@import url(@/assets/channel/mychannel.css);
</style>