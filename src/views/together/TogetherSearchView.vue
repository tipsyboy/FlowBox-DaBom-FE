<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ButtonBasic from '@/components/ui/ButtonBasic.vue'
import togetherApi from '@/api/together/index.js'

const route = useRoute()
const router = useRouter()
const rooms = ref([])

const query = computed(() => (route.query.q || '').toString())

const extractList = (response) => {
  if (Array.isArray(response)) return response
  if (Array.isArray(response?.data)) return response.data
  if (Array.isArray(response?.data?.content)) return response.data.content
  if (Array.isArray(response?.content)) return response.content
  return []
}

const mapRoom = (room) => ({
  id: room.togetherIdx || room.id,
  title: room.title || room.name || '이름 없는 방',
  host: room.masterName || room.host || room.channelName || '알 수 없음',
  members: room.currentMemberCount ?? room.currentMember ?? room.memberCount ?? 0,
})

const filteredRooms = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return rooms.value
  return rooms.value.filter((room) => room.title.toLowerCase().includes(q) || room.host.toLowerCase().includes(q))
})

const moveToMain = () => {
  router.push('/together')
}

const moveToRoom = (id) => {
  router.push(`/together/${id}`)
}

const loadRooms = async () => {
  const keyword = query.value.trim()
  if (!keyword) {
    rooms.value = []
    return
  }

  const response = await togetherApi.searchTogether(keyword, 0, 20)
  rooms.value = extractList(response).map(mapRoom)
}

watch(
  () => route.query.q,
  async () => {
    await loadRooms()
  }
)

onMounted(async () => {
  await loadRooms()
})
</script>

<template>
  <main class="together-page-wrap">
    <section class="page-head">
      <div>
        <h1>Together 검색</h1>
        <p v-if="query">"{{ query }}" 검색 결과입니다.</p>
        <p v-else>검색어를 입력해 Together 방을 찾아보세요.</p>
      </div>
      <ButtonBasic @click="moveToMain">메인으로</ButtonBasic>
    </section>

    <section class="grid">
      <article v-for="room in filteredRooms" :key="room.id" class="card">
        <h3>{{ room.title }}</h3>
        <p class="muted">호스트: {{ room.host }} · 참여자 {{ room.members }}명</p>
        <div class="row">
          <ButtonBasic variant="primary" @click="moveToRoom(room.id)">입장</ButtonBasic>
        </div>
      </article>
      <p v-if="filteredRooms.length === 0" class="empty-copy">검색 결과가 없습니다.</p>
    </section>
  </main>
</template>

<style scoped>
@import '@/assets/together/togetherPage.css';

.empty-copy {
  margin: 0;
  padding: 16px;
  border: 1px dashed var(--border-color);
  border-radius: 12px;
  color: var(--text-secondary);
}
</style>
