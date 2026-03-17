<script setup>
import { onMounted, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import togetherApi from '@/api/together/index.js'
import ModalCloseButton from '@/components/together_room/ModalCloseButton.vue'
import TogetherMasterModalItem from '@/components/together_room/TogetherMasterModalItem.vue'

const route = useRoute()

const props = defineProps({
  socket: Object,
})

const emit = defineEmits(['close_modal'])

const togetherIdx = ref('')
const masterBody = reactive({
  videoUrl: '',
  kickIdx: 0,
})

const members = ref([])

const getMembers = async () => {
  const res = await togetherApi.getMembersByMaster(togetherIdx.value)
  if (res.code === 200) {
    members.value = Array.isArray(res.data?.members) ? res.data.members : []
  }
}

const changeVideo = async () => {
  if (!masterBody.videoUrl) return

  const res = await togetherApi.changeTogetherVideo(togetherIdx.value, masterBody.videoUrl)
  if (res.code === 200) {
    masterBody.kickIdx = 0
    props.socket.send(`/app/master/control/together/${togetherIdx.value}`, {}, JSON.stringify(masterBody))
    masterBody.videoUrl = ''
  }
}

onMounted(() => {
  togetherIdx.value = route.params.id
  getMembers()
})
</script>

<template>
  <div class="modal-overlay" @click="emit('close_modal')">
    <div class="modal-card" @click.stop>
      <div class="modal-header">
        <h3 class="modal-title">마스터 관리</h3>
        <ModalCloseButton @close_modal="emit('close_modal')" />
      </div>

      <div class="form-group">
        <label for="videoUrl">동영상 URL</label>
        <div class="input-row">
          <input id="videoUrl" v-model="masterBody.videoUrl" type="url" placeholder="함께 볼 동영상 URL을 입력하세요" />
          <button type="button" class="btn-create" @click="changeVideo">변경 완료</button>
        </div>
      </div>

      <div class="participant-list">
        <TogetherMasterModalItem
          v-for="member in members"
          :key="member.memberIdx"
          :member="member"
          :socket="props.socket"
          :master-body="masterBody"
          @reload="getMembers"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.62);
  z-index: 60;
  display: grid;
  place-items: center;
  padding: 20px;
}

.modal-card {
  width: min(680px, 100%);
  max-height: 85vh;
  overflow-y: auto;
  background: var(--card-bg);
  border-radius: 18px;
  padding: 20px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;
}

.modal-title {
  margin: 0;
  font-size: 22px;
}

.form-group {
  margin-bottom: 18px;
}

.form-group label {
  display: block;
  margin-bottom: 10px;
  font-weight: 700;
}

.input-row {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 10px;
}

.input-row input {
  min-width: 0;
  padding: 12px 14px;
  border: 1px solid var(--border-color);
  border-radius: 12px;
  background: var(--dark-bg);
  color: var(--text-primary);
}

.btn-create {
  border: none;
  border-radius: 12px;
  padding: 0 16px;
  background: var(--primary-color);
  color: white;
  cursor: pointer;
}

.participant-list {
  display: grid;
  gap: 10px;
}
</style>
