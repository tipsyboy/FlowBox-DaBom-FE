<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { getBoardCommentsPagedSorted, createBoardComment } from '@/api/channel'
import CommentItem from '@/components/channel/community/CommentItem.vue'
import CommentForm from '@/components/channel/community/CommentForm.vue'
import SortDropdown from '@/components/channel/community/SortDropdown.vue'

const props = defineProps({
    postId: {
        type: [String, Number],
        required: true
    },
    initialCommentCount: {
        type: Number,
        default: 0
    }
})

const emit = defineEmits(['comment-count-updated'])

const comments = ref([])
const sortBy = ref('oldest')
const totalCommentCount = ref(props.initialCommentCount)
const currentPage = ref(0)
const hasNext = ref(true)
const isLoadingMore = ref(false)
const pageSize = 10
const observerTarget = ref(null)
let observer = null

const loadComments = async (page = 0, reset = false) => {
    if (isLoadingMore.value && !reset) return
    
    isLoadingMore.value = true
    
    if (page > 0 && !reset) { 
        await new Promise(resolve => setTimeout(resolve, 2000))
    }
    
    const response = await getBoardCommentsPagedSorted(props.postId, page, pageSize, sortBy.value)
    
    if (reset || page === 0) {
        totalCommentCount.value = response.totalCount || props.initialCommentCount || 0
        emit('comment-count-updated', totalCommentCount.value)
    }
    
    if (reset) {
        comments.value = response.content || []
    } else {
        comments.value = [...comments.value, ...(response.content || [])]
    }
    
    hasNext.value = response.hasNext
    currentPage.value = page
    
    if (reset) {
        setTimeout(() => {
            setupIntersectionObserver()
        }, 100)
    }
    
    isLoadingMore.value = false
}

const setupIntersectionObserver = () => {
    if (observer) observer.disconnect()
    if (observerTarget.value && hasNext.value) {
        observer = new IntersectionObserver(handleIntersection, {
            threshold: 0.1,
            rootMargin: '100px'
        })
        observer.observe(observerTarget.value)
    }
}

const handleIntersection = (entries) => {
    const [entry] = entries
    if (entry.isIntersecting && hasNext.value && !isLoadingMore.value) {
        loadMoreComments()
    }
}

const loadMoreComments = () => {
    if (hasNext.value && !isLoadingMore.value) {
        loadComments(currentPage.value + 1)
    }
}

const handleSortChange = (newSort) => {
    sortBy.value = newSort
    currentPage.value = 0
    hasNext.value = true
    loadComments(0, true)
}

const handleCommentSubmitted = async (commentText) => {
    try {
        const response = await createBoardComment(props.postId, { content: commentText })
        if (response.code === 200) {
            alert('댓글이 작성되었습니다.')
            currentPage.value = 0
            hasNext.value = true
            await loadComments(0, true)
            return true
        } else {
            throw new Error('댓글 작성에 실패했습니다.')
        }
    } catch (error) {
        alert('댓글 작성에 실패했습니다.')
        return false
    }
}

const handleCommentDeleted = () => {
    currentPage.value = 0
    hasNext.value = true
    loadComments(0, true)
}

onMounted(() => {
    loadComments(0, true)
    
    setTimeout(() => {
        setupIntersectionObserver()
    }, 500)
})

onUnmounted(() => {
    if (observer) {
        observer.disconnect()
    }
})
</script>

<template>
    <div class="comments-section">
        <div class="comments-header">
            <h3 class="comments-title">댓글 {{ totalCommentCount }}개</h3>
            <SortDropdown 
                :currentSort="sortBy" 
                @sort-changed="handleSortChange"
            />
        </div>

        <CommentForm @comment-submitted="handleCommentSubmitted" />
        
        <div class="comments-list">
            <div v-if="comments.length === 0 && !isLoadingMore" class="no-comments">
                첫 번째 댓글을 작성해보세요!
            </div>
            
            <CommentItem
                v-for="comment in comments" 
                :key="comment.idx"
                :comment="comment"
                @comment-deleted="handleCommentDeleted"
            />
            
            <div 
                v-if="hasNext" 
                ref="observerTarget" 
                class="loading-trigger"
            >
                <div v-if="isLoadingMore" class="loading-more">
                    <i class="fas fa-spinner fa-spin"></i>
                    댓글을 더 불러오는 중...
                </div>
            </div>
            
            <div v-if="!hasNext && comments.length > 0" class="comments-end">
                모든 댓글을 불러왔습니다.
            </div>
        </div>
    </div>
</template>

<style scoped>
.comments-section {
  margin-top: 2rem;
}

.comments-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.comments-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: white;
  margin: 0;
}

.comments-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.no-comments {
  text-align: center;
  color: #888;
  padding: 2rem;
  font-style: italic;
}

.loading-trigger {
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.loading-more {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #888;
  font-size: 0.875rem;
}

.loading-more i {
  color: #3b82f6;
}

.comments-end {
  text-align: center;
  color: #666;
  font-size: 0.875rem;
  padding: 1.5rem;
  border-top: 1px solid #444;
  margin-top: 1rem;
  font-style: italic;
}
</style>