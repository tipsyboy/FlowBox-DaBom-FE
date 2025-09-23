<script setup>
import Item from "@/components/together_room/TogetherMasterModalItem.vue"
import ModalCloseButton from "@/components/together_room/ModalCloseButton.vue"
import api from '@/api/together/'
import {onMounted, reactive, ref} from "vue";
import {useRoute} from "vue-router";

const props = defineProps(['socket'])
const emits = defineEmits(['close_modal'])
const route = useRoute()
const togetherIdx = ref('');
const masterBody = reactive({
  videoUrl: '',
  kickIdx: 0
});
const members = reactive({
  members: []
})

const getMembers = async () => {
  let res = await api.getMembersByMaster(togetherIdx.value);
  if (res.code === 200) {
    members.members = [...res.data.members]
  }
}

const changeVideo = async () => {
  if(masterBody.videoUrl === '') {
    return
  }
  let res = await api.changeTogetherVideo(togetherIdx.value, masterBody.videoUrl);
  if(res.code === 200) {
    masterBody.kickIdx = 0
    props.socket.send(`/app/master/control/together/${togetherIdx.value}`, {}, JSON.stringify(masterBody));
    masterBody.videoUrl = ''
  }
}

const reloadMember = () => {
  getMembers();
}

const closeMasterModal = () => {
  emits('close_modal')
}

onMounted(() => {
  togetherIdx.value = route.params.id;
  getMembers()
})
</script>

<template>
  <div class="modal-overlay" id="masterModal" @click="closeMasterModal">
    <div class="modal" @click.stop>
      <div class="modal-header">
        <h3 class="modal-title">마스터 관리</h3>
        <ModalCloseButton @close_modal="closeMasterModal"/>
      </div>
      <!-- 동영상 URL 입력 -->
      <div class="form-group">
        <label>동영상 URL</label>
        <div class="input-container">
          <input
              id="videoUrl"
              type="url"
              placeholder="함께 볼 동영상 URL을 입력하세요"
              v-model="masterBody.videoUrl"
          />
          <div class="button-container">
            <button type="submit" class="btn-create" @click="changeVideo">
              <i class="fas fa-plus"></i>
              변경 완료
            </button>
          </div>
        </div>
      </div>
      <div class="modal-content">
        <div class="participant-list" id="participantList">
          <Item v-for="member in members.members"
                :masterBody="masterBody"
                :socket="props.socket"
                :member="member"
                @reload="reloadMember"></Item>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
@import url(@/assets/together_room/TogetherMasterModal.css);
.form-group {
  margin-bottom: 0.1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.form-group:last-child {
  margin-bottom: 0;
}

.form-group label {
  display: block;
  color: var(--text-primary);
  font-weight: 600;
  margin-bottom: 0.75rem;
  font-size:1.3vw;
  text-align: center; /* Center the label text */
}

.input-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  gap: 1rem;
}

.form-group input,
.form-group select {
  width: 70%; /* Adjustable width */
  max-width: 400px; /* Maximum width for better UX */
  min-width: 200px; /* Minimum width for mobile */
  padding: 0.75rem 1rem;
  border: 2px solid var(--border-color);
  border-radius: 10px;
  background-color: var(--dark-bg);
  color: var(--text-primary);
  font-size: 1rem;
  outline: none;
  transition: var(--transition);
  text-align: center; /* Center the input text */
}

.form-group input:focus,
.form-group select:focus {
  border-color: var(--primary-color);
}

.button-container {
  width: 100%;
  display: flex;
  justify-content: flex-end; /* Left align the button */
  padding-right: calc(1rem); /* Align with input field start */
}

.btn-create {
  padding: 0.5rem; /* Adjustable padding */
  min-width: 100px; /* Minimum button width */
  border: none;
  border-radius: 10px;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
  background-color: var(--primary-color);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-create:hover {
  background-color: #ff3838;
  transform: translateY(-1px); /* Subtle hover effect */
}
</style>