<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['submit', 'close'])

const title = ref('')
const content = ref('')

// 모달이 열릴 때마다 폼 초기화
watch(() => props.show, (newValue) => {
  if (newValue) {
    title.value = ''
    content.value = ''
  }
})

const handleSubmit = () => {
  if (!title.value.trim()) {
    alert('게시글 제목을 입력해주세요.')
    return
  }
  
  if (!content.value.trim()) {
    alert('게시글 내용을 입력해주세요.')
    return
  }

  emit('submit', {
    title: title.value.trim(),
    contents: content.value.trim()
  })
}

const handleClose = () => {
  emit('close')
}

const handleOverlayClick = () => {
  emit('close')
}
</script>
<template>
  <div v-if="show" class="modal-overlay" @click="handleOverlayClick">
    <div class="modal-content" @click.stop>
      <h3>새 게시글 작성</h3>
      
      <!-- 제목 입력 -->
      <input 
        v-model="title" 
        placeholder="게시글 제목을 입력하세요..."
        class="create-title-input"
      />
      
      <!-- 내용 입력 -->
      <textarea 
        v-model="content" 
        placeholder="게시글 내용을 입력하세요..."
        class="create-textarea"
        rows="6"
      ></textarea>
      
      <div class="modal-actions">
        <button class="btn-submit" @click="handleSubmit">
          <i class="fas fa-pen"></i> 작성
        </button>
        <button class="btn-cancel" @click="handleClose">
          취소
        </button>
      </div>
    </div>
  </div>
</template>



<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: rgb(42, 40, 40);
  border-radius: 12px;
  padding: 2rem;
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  overflow: auto;
}

.modal-content h3 {
  margin: 0 0 1rem 0;
  color: white;
}

.create-title-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #444;
  border-radius: 6px;
  font-family: inherit;
  font-size: 1rem;
  margin-bottom: 1rem;
  background: rgb(35, 32, 32);
  color: white;
}

.create-textarea {
  width: 100%;
  padding: 1rem;
  border: 1px solid #444;
  border-radius: 8px;
  font-family: inherit;
  resize: vertical;
  margin-bottom: 1rem;
  background: rgb(35, 32, 32);
  color: white;
}

.create-title-input::placeholder,
.create-textarea::placeholder {
  color: #888;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.btn-submit {
  background-color: #3b82f6;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.btn-submit:hover {
  background-color: #2563eb;
}

.btn-cancel {
  background-color: #6b7280;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.btn-cancel:hover {
  background-color: #4b5563;
}
</style>