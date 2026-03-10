<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ButtonBasic from '@/components/ui/ButtonBasic.vue'

const route = useRoute()
const router = useRouter()

const rooms = [
  { id: 301, title: '리팩토링 스터디 공개방 A', host: 'flowbox_admin', members: 12 },
  { id: 302, title: '리팩토링 스터디 공개방 B', host: 'dabom_user', members: 7 },
  { id: 303, title: 'Vue3 구조개선 같이보기', host: 'frontend_note', members: 9 }
]

const query = computed(() => (route.query.q || '').toString())

const filteredRooms = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return rooms
  return rooms.filter((room) => room.title.toLowerCase().includes(q) || room.host.toLowerCase().includes(q))
})

const moveToMain = () => {
  router.push('/together')
}

const moveToRoom = (id) => {
  router.push(`/together/${id}`)
}
</script>

<template>
  <main class="together-page-wrap">
    <section class="page-head">
      <div>
        <h1>Together 검색 (참고용)</h1>
        <p>현재는 메인 페이지에 검색 결과를 통합한 상태</p>
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
    </section>
  </main>
</template>

<style scoped>
@import '@/assets/together/togetherPage.css';
</style>
