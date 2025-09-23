<script setup>

const props = defineProps({
  post: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['edit', 'delete', 'save', 'cancel', 'comment-manage'])

// 날짜 포맷팅
const formatDate = (dateString) => {
  if (!dateString) return '날짜 정보 없음'
  
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch (error) {
    return '날짜 정보 없음'
  }
}

// 이벤트 핸들러들
const handleEdit = () => {
  emit('edit', props.post)
}

const handleDelete = () => {
  emit('delete', props.post.idx)
}

const handleSave = () => {
  emit('save', props.post)
}

const handleCancel = () => {
  emit('cancel', props.post)
}

const handleCommentManage = () => {
  emit('comment-manage', props.post.title)
}
</script>
<template>
  <div class="community-post-manage">
    <div class="post-header">
      <!-- 편집 모드가 아닐 때: 제목 표시 -->
      <h3 v-if="!post.isEditing" class="post-title">{{ post.title }}</h3>
      <!-- 편집 모드일 때: 제목 입력 -->
      <input 
        v-else 
        v-model="post.editTitle" 
        class="edit-title-input"
        placeholder="제목을 입력하세요"
      />
      <div class="post-meta">
        <span class="post-date">{{ formatDate(post.createdAt) }}</span>
      </div>
    </div>
    
    <!-- 편집 모드가 아닐 때: 내용 표시 -->
    <div v-if="!post.isEditing" class="post-content">
      <p>{{ post.contents }}</p>
    </div>
    
    <!-- 편집 모드일 때: 내용 입력 -->
    <div v-else class="post-edit">
      <textarea 
        v-model="post.editContent" 
        class="edit-textarea"
        rows="4"
        placeholder="내용을 입력하세요"
      ></textarea>
    </div>
    
    <div class="community-actions">
      <!-- 편집 모드가 아닐 때 -->
      <template v-if="!post.isEditing">
        <button class="btn-edit" @click="handleEdit">
          <i class="fas fa-edit"></i> 편집
        </button>
        <button class="btn-delete" @click="handleDelete">
          <i class="fas fa-trash"></i> 삭제
        </button>
        <button class="btn-comment-manage" @click="handleCommentManage">
          <i class="fas fa-comments"></i> 댓글 관리
        </button>
      </template>
      
      <!-- 편집 모드일 때 -->
      <template v-else>
        <button class="btn-save" @click="handleSave">
          <i class="fas fa-check"></i> 저장
        </button>
        <button class="btn-cancel" @click="handleCancel">
          <i class="fas fa-times"></i> 취소
        </button>
      </template>
    </div>
  </div>
</template>



<style scoped>
.community-post-manage {
  margin-bottom: 1.5rem;
  background: rgb(45, 42, 42);
  border-radius: 8px;
  padding: 1.5rem;
  border: 1px solid #444;
}

.post-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #444;
  gap: 1rem;
}

.post-title {
  margin: 0;
  color: white;
  font-size: 1.2rem;
  font-weight: 600;
  flex: 1;
  word-break: break-word;
}

.post-meta {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: flex-end;
  flex-shrink: 0;
}

.post-date {
  color: #888;
  font-size: 0.875rem;
}

.edit-title-input {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #444;
  border-radius: 4px;
  font-size: 1.1rem;
  font-weight: bold;
  background: rgb(35, 32, 32);
  color: white;
}

.post-content p {
  margin: 0;
  line-height: 1.6;
  color: white;
  white-space: pre-wrap;
}

.post-edit {
  margin: 1rem 0;
}

.edit-textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #444;
  border-radius: 6px;
  font-family: inherit;
  resize: vertical;
  min-height: 100px;
  background: rgb(35, 32, 32);
  color: white;
}

.community-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
  justify-content: flex-end;
  flex-wrap: wrap;
}

.community-actions button {
  padding: 0.5rem 1rem;
  border: 1px solid #444; /* 테두리만 남김 */
  background: transparent; /* 또는 rgb(45, 42, 42) - 배경색과 동일 */
  color: white;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}
/* 호버 시에만 색상 변경 */
.community-actions button:hover {
  background-color: rgba(255, 255, 255, 0.1); /* 살짝 밝게 */
  transform: translateY(-1px);
}


.btn-edit {
  background-color: #3b82f6;
  color: white;
}

.btn-delete {
  background-color: #ef4444;
  color: white;
}

.btn-comment-manage {
  background-color: #8b5cf6;
  color: white;
}

.btn-save {
  background-color: #10b981;
  color: white;
}

.btn-cancel {
  background-color: #6b7280;
  color: white;
}

.community-actions button:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

/* 반응형 디자인 */
@media (max-width: 768px) {
  .post-header {
    flex-direction: column;
    align-items: stretch;
  }
  
  .post-meta {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
  
  .community-actions {
    flex-direction: column;
  }
  
  .community-actions button {
    justify-content: center;
  }
}
</style>