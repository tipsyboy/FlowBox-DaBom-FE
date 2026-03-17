<script setup>
import { onMounted, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import togetherApi from '@/api/together/index.js'

const route = useRoute()

const props = defineProps({
  member: Object,
  socket: Object,
  masterBody: Object,
})

const emit = defineEmits(['reload'])

const togetherIdx = ref('')
const memberInfo = reactive({
  isMaster: false,
  memberIdx: '',
  name: '',
})

const kickMember = async () => {
  const res = await togetherApi.kickTogetherMember(togetherIdx.value, memberInfo.memberIdx)
  if (res.code === 200) {
    props.masterBody.kickIdx = memberInfo.memberIdx
    props.masterBody.videoUrl = ''
    props.socket.send(`/app/master/control/together/${togetherIdx.value}`, {}, JSON.stringify(props.masterBody))
    emit('reload')
  }
}

onMounted(() => {
  togetherIdx.value = route.params.id
  memberInfo.name = props.member?.name || ''
  memberInfo.isMaster = props.member?.isMaster || false
  memberInfo.memberIdx = props.member?.memberIdx || ''
})
</script>

<template>
  <div class="participant-item">
    <div class="participant-details">
      <div class="participant-name">{{ memberInfo.name }}</div>
      <div class="participant-status">{{ memberInfo.isMaster ? '방장' : '온라인' }}</div>
    </div>
    <div class="participant-actions">
      <span v-if="memberInfo.isMaster" class="master-badge">마스터</span>
      <button v-else class="kick-btn" type="button" @click="kickMember">강퇴</button>
    </div>
  </div>
</template>

<style scoped>
.participant-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 14px;
  border: 1px solid var(--border-color);
  border-radius: 12px;
}

.participant-name {
  font-weight: 700;
}

.participant-status {
  margin-top: 4px;
  color: var(--text-secondary);
  font-size: 13px;
}

.master-badge {
  color: var(--secondary-color);
  font-size: 13px;
  font-weight: 700;
}

.kick-btn {
  border: none;
  border-radius: 10px;
  padding: 8px 10px;
  background: #d94b4b;
  color: white;
  cursor: pointer;
}
</style>
