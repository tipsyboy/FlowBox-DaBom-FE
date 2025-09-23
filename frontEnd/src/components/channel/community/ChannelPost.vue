<script setup>
import { reactive, ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getChannelBoardDetail } from '@/api/channel'
import CommentsSection from '@/components/channel/community/CommentsSection.vue'

const route = useRoute()
const postId = route.params.id
const loading = ref(false)

const post = reactive({
    idx: 0,
    title: '',
    contents: '',
    createdAt: '',
    commentCount: 0
    
})

const fetchPostDetail = async () => {
    loading.value = true
    try {
        const response = await getChannelBoardDetail(postId)
        
        Object.assign(post, {
            idx: response.idx || 0,
            title: response.title || '제목 없음',
            contents: response.contents || '내용 없음',
            createdAt: response.createdAt || '시간 정보 없음',
            commentCount: response.commentCount || 0,
            
        })
        
    } catch (error) {
        console.error('게시글 로딩 실패:', error)
        Object.assign(post, {
            idx: 0,
            title: '게시글을 불러올 수 없습니다',
            contents: '네트워크 오류가 발생했습니다.',
            createdAt: '',
            commentCount: 0
        })
    } finally {
        loading.value = false
    }
}

onMounted(() => {
    fetchPostDetail()
})
</script>

<template>
  <div class="post-detail-container">
    <div v-if="loading" class="loading">
      게시글을 불러오는 중...
    </div>
    
    <div v-else class="community-post">
      <div class="post-header">
        <div class="post-author">
          <!-- <img src="https://via.placeholder.com/40" alt="채널" class="author-avatar"> -->
          <div class="author-info">
            <span class="author-name">크리에이티브 채널</span>
            <span class="post-time">{{ post.createdAt }}</span>
          </div>
        </div>
        <h1 class="post-title">{{ post.title }}</h1>
      </div>
      
      <div class="post-content">
        <p>{{ post.contents }}</p>
      </div>
      
      <CommentsSection 
        :postId="postId" 
        :initialCommentCount="post.commentCount"
        @comment-count-updated="(count) => post.commentCount = count"
      />
    </div>
  </div>
</template>

<style scoped>
.post-detail-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem;
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  font-size: 1.2rem;
  color: white;
}

.community-post {
  background-color: rgb(45, 42, 42);
  border-radius: 12px;
  padding: 2rem;
  color: white;
}

.post-header {
  margin-bottom: 1.5rem;
}

.post-author {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.author-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.author-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.author-name {
  font-weight: 600;
  color: white;
}

.post-time {
  font-size: 0.875rem;
  color: #888;
}

.post-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: white;
  margin: 0;
}

.post-content {
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid #444;
}

.post-content p {
  line-height: 1.6;
  color: white;
  margin: 0;
}
</style>