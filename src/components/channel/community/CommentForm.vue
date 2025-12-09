<script setup>
import { ref } from 'vue'

const emit = defineEmits(['comment-submitted'])

const newCommentText = ref('')
const isCommentFocused = ref(false)

const handleCommentFocus = () => {
    isCommentFocused.value = true
}

const handleCommentBlur = () => {
    if (!newCommentText.value.trim()) {
        isCommentFocused.value = false
    }
}
const cancelComment = () => {
    newCommentText.value = ''
    isCommentFocused.value = false
}

const submitComment = async () => {
    if (!newCommentText.value.trim()) {
        alert('댓글 내용을 입력해주세요.')
        return
    }
    
    const success = await emit('comment-submitted', newCommentText.value)
    if (success !== false) {
        newCommentText.value = ''
        isCommentFocused.value = false
    }
}
</script>

<template>
    <div class="comment-form">
        <div class="comment-input-container">
            <img src="https://via.placeholder.com/40" alt="내 프로필" class="comment-user-avatar">
            <div class="comment-input-wrapper">
                <textarea
                    v-model="newCommentText"
                    @focus="handleCommentFocus"
                    @blur="handleCommentBlur"
                    placeholder="댓글을 입력하세요..."
                    class="comment-input"
                    :class="{ focused: isCommentFocused }"
                    rows="1"
                ></textarea>
                
                <div v-if="isCommentFocused || newCommentText.trim()" class="comment-actions">
                    <button class="comment-cancel-btn" @click="cancelComment">취소</button>
                    <button 
                        class="comment-submit-btn" 
                        :disabled="!newCommentText.trim()"
                        @click="submitComment"
                    >
                        댓글
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.comment-form {
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
}

.comment-input-container {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}

.comment-user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  flex-shrink: 0;
}

.comment-input-wrapper {
  flex: 1;
}

.comment-input {
  width: 100%;
  background: transparent;
  border: none;
  border-bottom: 1px solid #444;
  color: white;
  font-size: 1rem;
  font-family: inherit;
  padding: 0.5rem 0;
  resize: none;
  transition: border-color 0.2s;
}

.comment-input:focus {
  outline: none;
  border-bottom-color: #3b82f6;
}

.comment-input.focused {
  border-bottom-color: #3b82f6;
}

.comment-input::placeholder {
  color: #888;
}

.comment-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
}

.comment-cancel-btn {
  background: transparent;
  color: #888;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: background-color 0.2s;
}

.comment-cancel-btn:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.comment-submit-btn {
  background-color: #3b82f6;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.2s;
}

.comment-submit-btn:disabled {
  background-color: #444;
  color: #888;
  cursor: not-allowed;
}

.comment-submit-btn:not(:disabled):hover {
  background-color: #2563eb;
}
</style>