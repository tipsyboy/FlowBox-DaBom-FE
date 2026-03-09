<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import bannerImg from '@/assets/images/banner.png'

const router = useRouter()

const searchQuery = ref('')
const inviteCode = ref('')

const createdRooms = ref([
  { id: 101, title: '프론트엔드 코드리뷰 같이보기', people: '참여자 8 / 15 · 공개방' },
  { id: 102, title: '리팩토링 라이브 Q&A', people: '참여자 15 / 30 · 공개방' }
])

const joinedRooms = ref([
  { id: 201, title: 'Vue3 구조개선 스터디', people: '참여자 11 / 20 · 공개방' }
])

const activeRooms = ref([
  { id: 301, title: '리팩토링 스터디 공개방 A', host: 'flowbox_admin', members: 12, thumbnail: bannerImg },
  { id: 302, title: '리팩토링 스터디 공개방 B', host: 'dabom_user', members: 7, thumbnail: bannerImg },
  { id: 303, title: '컴포넌트 설계 리뷰룸', host: 'frontend_note', members: 9, thumbnail: bannerImg }
])

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

const joinByCode = () => {
  const parsed = Number(inviteCode.value)
  if (!Number.isNaN(parsed) && parsed > 0) {
    moveToRoom(parsed)
    return
  }
  alert('숫자 형태의 초대 코드를 입력해 주세요. (샘플 동작)')
}
</script>

<template>
  <main class="together-page-wrap">
    <section class="together-header">
      <h1><i class="fas fa-users"></i> Together</h1>
      <p>친구들과 함께 동영상을 시청하고 실시간으로 소통하세요</p>
    </section>

    <section class="together-search">
      <input v-model="searchQuery" type="text" class="search-input" placeholder="Together 검색..." />
      <button class="search-btn" type="button" @click="moveToSearchPage"><i class="fas fa-search"></i></button>
    </section>

    <section class="room-options">
      <article class="option-card">
        <div class="option-icon"><i class="fas fa-plus"></i></div>
        <h3>방 만들기</h3>
        <p>새로운 함께보기 방을 만들고 링크를 공유하세요.</p>
        <button class="btn btn-primary" type="button">생성하기</button>
      </article>
      <article class="option-card">
        <div class="option-icon"><i class="fas fa-key"></i></div>
        <h3>코드로 입장</h3>
        <p>초대 코드를 입력해 비공개 방에 바로 입장합니다.</p>
        <div class="join-row">
          <input v-model="inviteCode" type="text" placeholder="초대 코드 입력" />
          <button class="btn" type="button" @click="joinByCode">입장</button>
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
            <button class="btn" type="button">관리</button>
            <button class="btn btn-primary" type="button" @click="moveToRoom(room.id)">입장</button>
          </div>
        </article>
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
            <button class="btn btn-primary" type="button" @click="moveToRoom(room.id)">입장</button>
          </div>
        </article>
      </div>
    </section>

    <section class="section-block">
      <div class="section-header">
        <h2><i class="fas fa-fire"></i> 활성 Together 방</h2>
        <button class="btn" type="button" @click="moveToSearchPage">검색 결과 보기</button>
      </div>

      <div class="rooms-grid">
        <article v-for="room in filteredActiveRooms" :key="room.id" class="room-card">
          <img class="room-thumb" :src="room.thumbnail" alt="room" />
          <h3>{{ room.title }}</h3>
          <p class="muted">호스트 {{ room.host }} · 참여자 {{ room.members }}명</p>
          <button class="btn btn-primary" type="button" @click="moveToRoom(room.id)">입장</button>
        </article>
      </div>
    </section>
  </main>
</template>

<style scoped>
@import '@/assets/together/togetherPage.css';
</style>
