<script setup>
import { useRouter } from 'vue-router'
import { reactive, ref } from 'vue'
import api from '@/api/channel/index.js'

const props = defineProps({
  postData: {
    type: Object,
    required: true
  }
})

const router = useRouter()
const isProcessing = ref(false)

const localPost = reactive({
  ...props.postData
})

const clickLikeBtn = async (idx) => {
  if (isProcessing.value) return

  try {
    isProcessing.value = true
    if (typeof api.ChannelBoardLikes === 'function') {
      const data = await api.ChannelBoardLikes(idx)
      if (data) {
        localPost.isLikes = !localPost.isLikes
        if (localPost.isLikes) {
          localPost.likesCount = (localPost.likesCount || 0) + 1
        } else {
          localPost.likesCount = Math.max(0, (localPost.likesCount || 0) - 1)
        }
      }
    }
  } finally {
    isProcessing.value = false
  }
}

const clickPost = () => {
  router.push(`/post/${localPost.idx}`)
}
</script>

<template>
  <article class="community-card">
    <div class="community-top">
      <img src="@/assets/images/dabom2.png" alt="채널" />
      <div>
        <strong>{{ localPost.name || '크리에이터' }}</strong>
        <p>{{ localPost.createdAt || localPost.createAt }}</p>
      </div>
    </div>

    <h3>{{ localPost.title }}</h3>
    <p class="community-text">{{ localPost.contents }}</p>

    <div class="community-actions-row">
      <button @click="clickLikeBtn(localPost.idx)" :disabled="isProcessing">
        <i class="fas fa-heart" :style="{ color: localPost.isLikes ? '#ff3040' : '#8e8e8e' }"></i>
        {{ localPost.likesCount || 0 }}
      </button>
      <button @click="clickPost">
        <i class="fas fa-comment"></i>
        {{ localPost.commentCount || 0 }}
      </button>
      <a href="#" @click.prevent="clickPost">자세히 보기</a>
    </div>
  </article>
</template>

<style scoped>
.community-card {
  background: #2a2a2a;
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 14px;
}

.community-top {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.community-top img {
  width: 38px;
  height: 38px;
  border-radius: 50%;
}

.community-top strong {
  font-size: 14px;
}

.community-top p {
  margin: 2px 0 0;
  font-size: 12px;
  color: var(--text-secondary);
}

.community-card h3 {
  margin: 0 0 8px;
  font-size: 18px;
}

.community-text {
  margin: 0;
  color: #d5d5d5;
  line-height: 1.6;
}

.community-actions-row {
  margin-top: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.community-actions-row button {
  border: 1px solid #4a4a4a;
  background: #343434;
  color: var(--text-secondary);
  border-radius: 16px;
  padding: 6px 10px;
  font-size: 12px;
  cursor: pointer;
}

.community-actions-row a {
  margin-left: auto;
  color: var(--primary-color);
  text-decoration: none;
  font-size: 13px;
}
</style>
