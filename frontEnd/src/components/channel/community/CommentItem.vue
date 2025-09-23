<script setup>
import { ref } from 'vue'
import { BoardCommentLikes } from '@/api/channel'

const props = defineProps({
    comment: {
        type: Object,
        required: true
    }
})

const emit = defineEmits(['comment-deleted'])

const likingComments = ref(new Set())

const handleCommentLike = async (commentIdx) => {
    if (likingComments.value.has(commentIdx)) return
    
    try {
        likingComments.value.add(commentIdx)
        const response = await BoardCommentLikes(commentIdx)
        
        if (response === true || (response && response.data === true) || (response && response.code === 200)) {
            props.comment.isLikes = !props.comment.isLikes
            
            if (props.comment.isLikes) {
                props.comment.likesCount = (props.comment.likesCount || 0) + 1
            } else {
                props.comment.likesCount = Math.max(0, (props.comment.likesCount || 0) - 1)
            }
        }
    } catch (error) {
        console.error('댓글 좋아요 처리 오류:', error)
    } finally {
        likingComments.value.delete(commentIdx)
    }
}
</script>

<template>
    <div class="comment-item">
        <div class="comment-avatar-container">
<img :src="comment.profileImg || 'https://via.placeholder.com/32'" alt="작성자" class="comment-avatar">
        </div>
        <div class="comment-main">
            <div class="comment-header">
                <span class="comment-author-name"></span>
                 <span class="comment-author-name">{{ comment.name  || '익명' }}</span>
                <span class="comment-time">{{ comment.createdAt }}</span>
                <span v-if="comment.isModified" class="modified-badge">
                    <i class="fas fa-edit"></i>
                    <!-- 수정됨 -->
                </span>
            </div>
            <div class="comment-content">
                {{ comment.content || '댓글 내용이 없습니다' }}
            </div>
            <div v-if="comment.isModified" class="comment-modified-info">
                수정된 댓글입니다.
            </div>
            <div class="comment-actions-bar">
                <button 
                    class="comment-action-btn like-btn"
                    :class="{ 
                        'liked': comment.isLikes,
                        'processing': likingComments.has(comment.idx)
                    }"
                    :disabled="likingComments.has(comment.idx)"
                    @click="handleCommentLike(comment.idx)"
                >
                    <i 
                        class="fas fa-thumbs-up" 
                        :style="{ color: comment.isLikes ? '#ff3040' : '#888' }"
                    ></i>
                    <span v-if="comment.likesCount > 0">{{ comment.likesCount }}</span>
                </button>
                
                <button class="comment-action-btn">답글</button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.comment-item {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}

.comment-avatar-container {
  flex-shrink: 0;
}

.comment-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
}

.comment-main {
  flex: 1;
}

.comment-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
}

.comment-author-name {
  font-weight: 500;
  color: white;
  font-size: 0.875rem;
}

.comment-time {
  font-size: 0.75rem;
  color: #888;
}

.modified-badge {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.7rem;
  color: #fbbf24;
  background-color: rgba(251, 191, 36, 0.1);
  padding: 0.2rem 0.5rem;
  border-radius: 12px;
  border: 1px solid rgba(251, 191, 36, 0.3);
}

.modified-badge i {
  font-size: 0.6rem;
}

.comment-content {
  color: white;
  line-height: 1.5;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
}

.comment-modified-info {
  font-size: 0.7rem;
  color: #888;
  font-style: italic;
  margin-bottom: 0.5rem;
}

.comment-actions-bar {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.comment-action-btn {
  background: transparent;
  border: none;
  color: #888;
  cursor: pointer;
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.comment-action-btn:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
}

.comment-action-btn i {
  font-size: 0.75rem;
}
</style>