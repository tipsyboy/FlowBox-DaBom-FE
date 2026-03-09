<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import bannerImg from '@/assets/images/banner.png'

const route = useRoute()
const router = useRouter()

const messages = ref([
  { user: 'flowbox_admin', text: '이 장면부터 구조 분리 설명할게요.' },
  { user: 'dabom_user', text: '네, 지금 따라가고 있습니다.' },
  { user: 'frontend_note', text: '공통 컴포넌트 경계가 좋네요.' }
])

const draft = ref('')

const roomId = computed(() => route.params.id)

const roomTitle = computed(() => `Together 방 #${roomId.value}`)

const goToList = () => {
  router.push('/together')
}

const sendMessage = () => {
  const text = draft.value.trim()
  if (!text) return
  messages.value.push({ user: 'me', text })
  draft.value = ''
}
</script>

<template>
  <main class="together-page-wrap">
    <section class="page-head">
      <div>
        <h1>{{ roomTitle }}</h1>
        <p>프론트엔드 코드리뷰 같이보기 · 참여자 8명</p>
      </div>
      <div class="row">
        <button class="btn" type="button" @click="goToList">방 목록</button>
        <button class="btn btn-primary" type="button">초대 링크 복사</button>
      </div>
    </section>

    <section class="layout-room">
      <article class="card">
        <video class="player" controls :poster="bannerImg"></video>
        <div class="row" style="margin-top: 10px">
          <button class="btn" type="button">재생/일시정지 동기화</button>
          <button class="btn" type="button">5초 되감기</button>
          <button class="btn" type="button">5초 앞으로</button>
        </div>
      </article>

      <aside class="chat">
        <h3>실시간 채팅</h3>
        <div class="chat-log">
          <div v-for="(item, idx) in messages" :key="`${item.user}-${idx}`" class="chat-item">
            <strong>{{ item.user }}</strong>: {{ item.text }}
          </div>
        </div>
        <input v-model="draft" class="chat-input" placeholder="메시지를 입력하세요" @keyup.enter="sendMessage" />
        <button class="btn btn-primary" type="button" @click="sendMessage">전송</button>
      </aside>
    </section>
  </main>
</template>

<style scoped>
@import '@/assets/together/togetherPage.css';
</style>
