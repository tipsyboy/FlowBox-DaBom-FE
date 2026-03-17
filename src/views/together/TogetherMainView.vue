<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import SearchBar from '@/components/app/SearchBar.vue'
import ButtonBasic from '@/components/ui/ButtonBasic.vue'
import Modal from '@/components/ui/Modal.vue'
import CreateTogetherModal from '@/components/together/CreateTogetherModal.vue'
import togetherApi from '@/api/together/index.js'

const router = useRouter()

const searchQuery = ref('')
const inviteCode = ref('')
const createModalOpen = ref(false)
const showInviteCodeModal = ref(false)

const createdRooms = ref([])
const joinedRooms = ref([])
const activeRooms = ref([])

const extractList = (response) => {
  if (Array.isArray(response)) return response
  if (Array.isArray(response?.data)) return response.data
  if (Array.isArray(response?.data?.content)) return response.data.content
  if (Array.isArray(response?.content)) return response.content
  return []
}

const roomId = (room) => room.togetherIdx || room.id

const roomTitle = (room) => room.title || room.name || '이름 없는 방'

const roomMeta = (room) => {
  const currentMember = room.currentMemberCount ?? room.currentMember ?? room.memberCount ?? 0
  const maxMember = room.maxMemberNumber ?? room.maxMember ?? room.maxCount
  const openness = room.isOpen === false ? '비공개방' : '공개방'

  if (maxMember) {
    return `참여자 ${currentMember} / ${maxMember} · ${openness}`
  }

  return `참여자 ${currentMember}명 · ${openness}`
}

const mapListRoom = (room) => ({
  id: roomId(room),
  title: roomTitle(room),
  people: roomMeta(room),
})

const mapActiveRoom = (room) => ({
  id: roomId(room),
  title: roomTitle(room),
  host: room.masterName || room.host || room.channelName || '알 수 없음',
  members: room.currentMemberCount ?? room.currentMember ?? room.memberCount ?? 0,
})

const loadTogetherRooms = async () => {
  const [masterResponse, memberResponse, activeResponse] = await Promise.all([
    togetherApi.getTogetherListInMaster(),
    togetherApi.getTogetherListInMember(),
    togetherApi.getRandomTogetherList(),
  ])

  createdRooms.value = extractList(masterResponse).map(mapListRoom)
  joinedRooms.value = extractList(memberResponse).map(mapListRoom)
  activeRooms.value = extractList(activeResponse).map(mapActiveRoom)
}

const filteredActiveRooms = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return activeRooms.value

  return activeRooms.value.filter((room) => {
    return room.title.toLowerCase().includes(q) || room.host.toLowerCase().includes(q)
  })
})

const moveToRoom = (id) => {
  router.push(`/together/${id}`)
}

const moveToSearchPage = () => {
  router.push({ path: '/together/search', query: { q: searchQuery.value.trim() || '리팩토링' } })
}

const openCreateModal = () => {
  createModalOpen.value = true
}

const closeCreateModal = () => {
  createModalOpen.value = false
}

const joinByCode = () => {
  const parsed = Number(inviteCode.value)
  if (!Number.isNaN(parsed) && parsed > 0) {
    moveToRoom(parsed)
    return
  }
  showInviteCodeModal.value = true
}

onMounted(async () => {
  await loadTogetherRooms()
})
</script>

<template>
  <main class="together-page-wrap">
    <section class="together-header">
      <h1><i class="fas fa-users"></i> Together</h1>
      <p>친구들과 함께 동영상을 시청하고 실시간으로 소통하세요</p>
    </section>

    <section class="together-search">
      <SearchBar
        v-model="searchQuery"
        placeholder="Together 검색..."
        button-text="검색"
        button-icon-class="fas fa-search"
        :icon-only="true"
        @search="moveToSearchPage"
      />
    </section>

    <section class="room-options">
      <article class="option-card">
        <div class="option-icon"><i class="fas fa-plus"></i></div>
        <h3>방 만들기</h3>
        <p>새로운 함께보기 방을 만들고 링크를 공유하세요.</p>
        <ButtonBasic variant="primary" @click="openCreateModal">생성하기</ButtonBasic>
      </article>
      <article class="option-card">
        <div class="option-icon"><i class="fas fa-key"></i></div>
        <h3>코드로 입장</h3>
        <p>초대 코드를 입력해 비공개 방에 바로 입장합니다.</p>
        <div class="join-row">
          <input v-model="inviteCode" type="text" placeholder="초대 코드 입력" />
          <ButtonBasic @click="joinByCode">입장</ButtonBasic>
        </div>
      </article>
    </section>

    <section class="section-block">
      <div class="section-header">
        <h2><i class="fas fa-user"></i> 내가 만든 방</h2>
      </div>
      <div class="my-rooms-list">
        <article v-for="room in createdRooms" :key="room.id" class="my-room-item">
          <div class="room-info">
            <h4>{{ room.title }}</h4>
            <p>{{ room.people }}</p>
          </div>
          <div class="room-actions">
            <ButtonBasic>관리</ButtonBasic>
            <ButtonBasic variant="primary" @click="moveToRoom(room.id)">입장</ButtonBasic>
          </div>
        </article>
        <p v-if="createdRooms.length === 0" class="empty-copy">아직 만든 방이 없습니다.</p>
      </div>
    </section>

    <section class="section-block">
      <div class="section-header">
        <h2><i class="fas fa-user"></i> 내가 참여하고 있는 방</h2>
      </div>
      <div class="my-rooms-list">
        <article v-for="room in joinedRooms" :key="room.id" class="my-room-item">
          <div class="room-info">
            <h4>{{ room.title }}</h4>
            <p>{{ room.people }}</p>
          </div>
          <div class="room-actions">
            <ButtonBasic variant="primary" @click="moveToRoom(room.id)">입장</ButtonBasic>
          </div>
        </article>
        <p v-if="joinedRooms.length === 0" class="empty-copy">참여 중인 방이 없습니다.</p>
      </div>
    </section>

    <section class="section-block">
      <div class="section-header">
        <h2><i class="fas fa-fire"></i> 활성 Together 방</h2>
        <ButtonBasic @click="moveToSearchPage">검색 결과 보기</ButtonBasic>
      </div>

      <div class="rooms-grid">
        <article v-for="room in filteredActiveRooms" :key="room.id" class="room-card">
          <h3>{{ room.title }}</h3>
          <p class="muted">호스트 {{ room.host }} · 참여자 {{ room.members }}명</p>
          <ButtonBasic variant="primary" @click="moveToRoom(room.id)">입장</ButtonBasic>
        </article>
        <p v-if="filteredActiveRooms.length === 0" class="empty-copy">표시할 Together 방이 없습니다.</p>
      </div>
    </section>
    <CreateTogetherModal
      v-if="createModalOpen"
      :visible="createModalOpen"
      @close="closeCreateModal"
    />
    <Modal
      v-if="showInviteCodeModal"
      title="초대 코드 확인"
      message="숫자 형태의 초대 코드를 입력해 주세요."
      @confirm="showInviteCodeModal = false"
    />
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
