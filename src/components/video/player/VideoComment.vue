<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { getComments, postComment, deleteComment, videoCommentLikes } from '@/api/video-comment/index.js'
import ButtonBasic from '@/components/ui/ButtonBasic.vue'

const route = useRoute()
const videoId = ref(route.params.id)

const props = defineProps({
  currentUserProfile: {
    type: Object,
    required: true,
    default: () => ({
      profileImg: 'https://via.placeholder.com/40',
      name: '사용자'
    })
  }
})

const commentText = ref('')
const comments = ref([])
const currentUser = ref(null)
const sortOrder = ref('newest')
const page = ref(0)
const pageSize = 10
const hasMore = ref(true)
const likingComments = ref(new Set())

const loadComments = async (reset = false) => {
  if (!videoId.value) return

  if (reset) {
    page.value = 0
    comments.value = []
    hasMore.value = true
  }

  try {
    let sortParam = ''
    if (sortOrder.value === 'newest') sortParam = 'createdAt,desc'
    if (sortOrder.value === 'oldest') sortParam = 'createdAt,asc'
    if (sortOrder.value === 'popular') sortParam = 'likes,desc'

    const response = await getComments(videoId.value, {
      page: page.value,
      size: pageSize,
      sort: sortParam
    })

    if (response && response.data && response.data.content) {
      const commentsWithLikes = response.data.content.map((comment) => ({
        ...comment,
        isLikes: comment.isLikes || false,
        likesCount: comment.likesCount || 0
      }))

      comments.value = reset ? commentsWithLikes : [...comments.value, ...commentsWithLikes]
      hasMore.value = !response.data.last
    } else {
      comments.value = []
      hasMore.value = false
    }
  } catch (error) {
    comments.value = []
    hasMore.value = false
    alert(error.response?.data?.message || '댓글 목록을 불러오는데 실패했습니다.')
  }
}

const submitComment = async () => {
  if (!videoId.value) {
    alert('비디오 ID가 없습니다.')
    return
  }

  if (!commentText.value.trim()) {
    alert('댓글을 입력해주세요.')
    return
  }

  try {
    await postComment(videoId.value, { content: commentText.value })
    commentText.value = ''
    loadComments(true)
  } catch (error) {
    alert(error.response?.data?.message || '댓글 작성에 실패했습니다.')
  }
}

const handleDeleteComment = async (commentId) => {
  if (!confirm('이 댓글을 삭제하시겠습니까?')) return

  try {
    await deleteComment(commentId)
    loadComments(true)
  } catch (error) {
    alert(error.response?.data?.message || '댓글 삭제에 실패했습니다.')
  }
}

const handleCommentLike = async (comment) => {
  if (likingComments.value.has(comment.idx)) return

  try {
    likingComments.value.add(comment.idx)
    const response = await videoCommentLikes(comment.idx)

    if (response === true || (response && response.data === true) || (response && response.code === 200)) {
      comment.isLikes = !comment.isLikes
      if (comment.isLikes) {
        comment.likesCount = (comment.likesCount || 0) + 1
      } else {
        comment.likesCount = Math.max(0, (comment.likesCount || 0) - 1)
      }
    }
  } catch (error) {
    alert('좋아요 처리에 실패했습니다.')
  } finally {
    likingComments.value.delete(comment.idx)
  }
}

const loadMoreComments = () => {
  if (hasMore.value) {
    page.value += 1
    loadComments()
  }
}

const changeSortOrder = () => {
  loadComments(true)
}

watch(() => route.params.id, (newVideoId) => {
  if (newVideoId) {
    videoId.value = newVideoId
    loadComments(true)
  }
}, { immediate: true })

onMounted(() => {
  currentUser.value = { id: 1 }
})
</script>

<template>
  <div class="comments-section">
    <div class="comments-head">
      <h2>댓글 {{ comments.length }}개</h2>
      <select v-model="sortOrder" @change="changeSortOrder">
        <option value="newest">최신순</option>
        <option value="popular">인기순</option>
        <option value="oldest">오래된순</option>
      </select>
    </div>

    <div class="comment-write">
      <img class="comment-avatar" :src="props.currentUserProfile.profileImg" :alt="props.currentUserProfile.name + ' 프로필'" />
      <div class="comment-input-wrap">
        <textarea
          v-model="commentText"
          placeholder="댓글을 입력해주세요..."
        ></textarea>
        <div class="comment-write-actions">
          <ButtonBasic variant="ghost" @click="commentText = ''">취소</ButtonBasic>
          <ButtonBasic variant="primary" @click="submitComment">댓글 달기</ButtonBasic>
        </div>
      </div>
    </div>

    <ul class="comment-list">
      <li class="comment-item" v-for="comment in comments" :key="comment.idx">
        <img class="comment-avatar" :src="comment.profileImg || 'https://via.placeholder.com/40'" alt="사용자" />
        <div class="comment-body">
          <div class="comment-top">
            <strong>{{ comment.username }}</strong>
            <span>{{ comment.createdAt }}</span>
          </div>
          <p>{{ comment.content }}</p>

          <div class="comment-actions-row">
            <button
              class="like-btn"
              :class="{ liked: comment.isLikes }"
              :disabled="likingComments.has(comment.idx)"
              @click="handleCommentLike(comment)"
            >
              <i class="fas fa-thumbs-up"></i> {{ comment.likesCount || 0 }}
            </button>

            <ButtonBasic
              v-if="currentUser && currentUser.id === comment.memberIdx"
              class="delete-btn"
              variant="ghost"
              size="sm"
              @click="handleDeleteComment(comment.idx)"
            >
              삭제
            </ButtonBasic>
          </div>
        </div>
      </li>
    </ul>

    <div class="load-more" v-if="hasMore">
      <ButtonBasic variant="primary" @click="loadMoreComments">더 보기</ButtonBasic>
    </div>
  </div>
</template>

<style scoped>
.comments-section {
  border: none;
  border-radius: 15px;
  background: var(--card-bg);
  padding: 22px;
  display: grid;
  gap: 16px;
}

.comments-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.comments-head h2 {
  margin: 0;
  font-size: 20px;
}

.comments-head select {
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: #303030;
  color: var(--text-primary);
  padding: 8px 10px;
}

.comment-write {
  display: grid;
  grid-template-columns: 40px 1fr;
  gap: 10px;
}

.comment-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.comment-input-wrap textarea {
  width: 100%;
  min-height: 92px;
  resize: vertical;
  border: 1px solid var(--border-color);
  border-radius: 10px;
  background: var(--hover-color);
  color: var(--text-primary);
  padding: 12px;
  font-size: 14px;
}

.comment-write-actions {
  margin-top: 8px;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.comment-list {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 16px;
}

.comment-item {
  display: flex;
  gap: 10px;
  padding-bottom: 14px;
  border-bottom: 1px solid var(--border-color);
}

.comment-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.comment-body {
  flex: 1;
}

.comment-top {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}

.comment-top span {
  color: var(--text-secondary);
  font-size: 12px;
}

.comment-body p {
  margin: 0;
  color: #dedede;
  font-size: 14px;
  line-height: 1.6;
}

.comment-actions-row {
  margin-top: 8px;
  display: flex;
  gap: 8px;
}

.like-btn,
.delete-btn {
  border: 1px solid var(--border-color);
  background: transparent;
  color: var(--text-secondary);
  border-radius: 14px;
  padding: 4px 10px;
  cursor: pointer;
  font-size: 12px;
}

.like-btn.liked {
  color: var(--primary-color);
  border-color: rgba(250, 85, 0, 0.5);
}

.load-more {
  display: flex;
  justify-content: center;
}
</style>
