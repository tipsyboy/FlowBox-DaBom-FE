<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import useMemberStore from '@/stores/useMemberStore.js'
import {
  createChannelBoard,
  deleteChannelBoard,
  getChannelBoardListPaged,
  updateChannelBoard
} from '@/api/channel/index.js'

const memberStore = useMemberStore()

const isLoading = ref(false)
const isSubmitting = ref(false)
const errorMessage = ref('')
const sortBy = ref('latest')

const posts = ref([])
const totalCount = ref(0)

const createModalOpen = ref(false)
const createForm = reactive({
  title: '',
  contents: ''
})

const editingId = ref(null)
const editForm = reactive({
  title: '',
  contents: ''
})

const channelName = computed(() => {
  try {
    return memberStore.getChannelNameWithEncrypt()
  } catch (error) {
    return ''
  }
})

const formatDate = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  if (Number.isNaN(date.getTime())) return dateString
  return date.toLocaleString('ko-KR')
}

const loadPosts = async () => {
  if (!channelName.value) {
    posts.value = []
    totalCount.value = 0
    return
  }

  try {
    isLoading.value = true
    errorMessage.value = ''
    const response = await getChannelBoardListPaged(0, 20, sortBy.value, channelName.value)
    const content = Array.isArray(response?.content) ? response.content : []
    posts.value = content
    totalCount.value = response?.totalCount ?? content.length
  } catch (error) {
    posts.value = []
    totalCount.value = 0
    errorMessage.value = '게시글 목록을 불러오지 못했습니다.'
  } finally {
    isLoading.value = false
  }
}

const openCreateModal = () => {
  createForm.title = ''
  createForm.contents = ''
  createModalOpen.value = true
}

const closeCreateModal = () => {
  createModalOpen.value = false
}

const submitCreate = async () => {
  const title = createForm.title.trim()
  const contents = createForm.contents.trim()

  if (!title || !contents) return

  try {
    isSubmitting.value = true
    await createChannelBoard({ title, contents })
    closeCreateModal()
    await loadPosts()
  } catch (error) {
    errorMessage.value = '게시글 작성에 실패했습니다.'
  } finally {
    isSubmitting.value = false
  }
}

const startEdit = (post) => {
  editingId.value = post.idx
  editForm.title = post.title || ''
  editForm.contents = post.contents || ''
}

const cancelEdit = () => {
  editingId.value = null
  editForm.title = ''
  editForm.contents = ''
}

const submitEdit = async (postIdx) => {
  const title = editForm.title.trim()
  const contents = editForm.contents.trim()
  if (!title || !contents) return

  try {
    isSubmitting.value = true
    await updateChannelBoard(postIdx, { title, contents })
    cancelEdit()
    await loadPosts()
  } catch (error) {
    errorMessage.value = '게시글 수정에 실패했습니다.'
  } finally {
    isSubmitting.value = false
  }
}

const removePost = async (postIdx) => {
  if (!window.confirm('정말 이 게시글을 삭제할까요?')) return

  try {
    await deleteChannelBoard(postIdx)
    await loadPosts()
  } catch (error) {
    errorMessage.value = '게시글 삭제에 실패했습니다.'
  }
}

const onChangeSort = async (event) => {
  sortBy.value = event.target.value
  await loadPosts()
}

onMounted(() => {
  loadPosts()
})
</script>

<template>
  <section class="studio-card">
    <div class="head-row">
      <h2>커뮤니티 관리</h2>
      <div class="head-actions">
        <select class="sort-select" :value="sortBy" @change="onChangeSort">
          <option value="latest">최신순</option>
          <option value="oldest">오래된순</option>
        </select>
        <button class="primary-btn" type="button" @click="openCreateModal">새 게시글 작성</button>
      </div>
    </div>

    <p class="subtext">총 {{ totalCount }}개 게시글</p>
    <p v-if="isLoading" class="subtext loading">게시글을 불러오는 중입니다...</p>
    <p v-else-if="errorMessage" class="subtext error">{{ errorMessage }}</p>

    <div v-if="!isLoading && !errorMessage && posts.length === 0" class="empty-state">
      <i class="fas fa-inbox"></i>
      <h3>게시글이 없습니다</h3>
      <p>채널 커뮤니티의 첫 글을 작성해보세요.</p>
      <button class="primary-btn" type="button" @click="openCreateModal">새 게시글 작성</button>
    </div>

    <div v-else class="post-list">
      <article v-for="post in posts" :key="post.idx" class="post-card">
        <header class="post-head">
          <div>
            <h4>{{ post.title || '(제목 없음)' }}</h4>
            <p>{{ formatDate(post.createdAt || post.updatedAt) }}</p>
          </div>
          <div class="tools" v-if="editingId !== post.idx">
            <button type="button" @click="startEdit(post)">수정</button>
            <button type="button" class="danger" @click="removePost(post.idx)">삭제</button>
          </div>
        </header>

        <div v-if="editingId === post.idx" class="edit-box">
          <input v-model="editForm.title" type="text" maxlength="100" placeholder="제목" />
          <textarea v-model="editForm.contents" rows="5" maxlength="500" placeholder="내용"></textarea>
          <div class="edit-actions">
            <button type="button" @click="cancelEdit">취소</button>
            <button type="button" class="primary-btn" :disabled="isSubmitting" @click="submitEdit(post.idx)">저장</button>
          </div>
        </div>
        <p v-else class="post-body">{{ post.contents || '내용이 없습니다.' }}</p>
      </article>
    </div>

    <Teleport to="body">
      <div v-if="createModalOpen" class="modal-overlay" @click="closeCreateModal">
        <div class="modal" @click.stop>
          <header class="modal-header">
            <h3>새 게시글 작성</h3>
            <button type="button" class="close-btn" @click="closeCreateModal"><i class="fas fa-times"></i></button>
          </header>
          <div class="modal-body">
            <label>
              제목
              <input v-model="createForm.title" type="text" maxlength="100" placeholder="게시글 제목" />
            </label>
            <label>
              내용
              <textarea v-model="createForm.contents" rows="7" maxlength="500" placeholder="게시글 내용"></textarea>
            </label>
          </div>
          <footer class="modal-footer">
            <button type="button" @click="closeCreateModal">취소</button>
            <button
              type="button"
              class="primary-btn"
              :disabled="isSubmitting || !createForm.title.trim() || !createForm.contents.trim()"
              @click="submitCreate"
            >
              작성
            </button>
          </footer>
        </div>
      </div>
    </Teleport>
  </section>
</template>

<style scoped>
.studio-card {
  border: 1px solid var(--border-color);
  border-radius: 14px;
  background: #191b1f;
  padding: 18px;
}

.head-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}

.head-row h2 {
  margin: 0;
  font-size: 24px;
}

.head-actions {
  display: flex;
  gap: 8px;
}

.sort-select,
.tools button,
.edit-box input,
.edit-box textarea,
.modal-body input,
.modal-body textarea {
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: #141518;
  color: var(--text-primary);
}

.sort-select {
  padding: 8px 10px;
}

.primary-btn,
.tools button,
.edit-actions button,
.modal-footer button {
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: #2c2e33;
  color: var(--text-primary);
  padding: 8px 12px;
  cursor: pointer;
}

.primary-btn {
  border-color: rgba(250, 85, 0, 0.5);
  background: rgba(250, 85, 0, 0.15);
  color: #ffc3a1;
  font-weight: 700;
}

.tools {
  display: flex;
  gap: 8px;
}

.tools .danger {
  color: #ffb0b0;
}

.subtext {
  margin: 10px 0 0;
  color: var(--text-secondary);
}

.subtext.error {
  color: #ff9f9f;
}

.post-list {
  margin-top: 12px;
  display: grid;
  gap: 10px;
}

.post-card {
  border: 1px solid var(--border-color);
  border-radius: 12px;
  background: #15171a;
  padding: 12px;
}

.post-head {
  display: flex;
  justify-content: space-between;
  gap: 10px;
}

.post-head h4 {
  margin: 0;
  font-size: 16px;
}

.post-head p {
  margin: 5px 0 0;
  color: var(--text-secondary);
  font-size: 12px;
}

.post-body {
  margin: 10px 0 0;
  color: #d5d5d5;
  line-height: 1.45;
  white-space: pre-wrap;
}

.edit-box {
  margin-top: 10px;
  display: grid;
  gap: 8px;
}

.edit-box input,
.edit-box textarea {
  padding: 9px 10px;
  font-size: 14px;
}

.edit-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.empty-state {
  margin-top: 12px;
  border: 1px dashed var(--border-color);
  border-radius: 12px;
  text-align: center;
  padding: 28px 14px;
  background: #16181c;
}

.empty-state i {
  font-size: 32px;
  color: #a8a8a8;
}

.empty-state h3 {
  margin: 12px 0 6px;
}

.empty-state p {
  margin: 0 0 14px;
  color: var(--text-secondary);
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  display: grid;
  place-items: center;
  z-index: 1200;
}

.modal {
  width: min(680px, calc(100% - 24px));
  border: 1px solid var(--border-color);
  border-radius: 12px;
  background: #1b1d22;
  overflow: hidden;
}

.modal-header,
.modal-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 16px;
  border-bottom: 1px solid var(--border-color);
}

.modal-footer {
  border-bottom: none;
  border-top: 1px solid var(--border-color);
  justify-content: flex-end;
  gap: 8px;
}

.modal-header h3 {
  margin: 0;
}

.close-btn {
  border: none;
  background: transparent;
  color: var(--text-secondary);
  cursor: pointer;
}

.modal-body {
  padding: 16px;
  display: grid;
  gap: 10px;
}

.modal-body label {
  display: grid;
  gap: 6px;
  font-size: 13px;
}

.modal-body input,
.modal-body textarea {
  padding: 9px 10px;
  font-size: 14px;
}

@media (max-width: 760px) {
  .head-row {
    flex-direction: column;
    align-items: flex-start;
  }

  .head-actions {
    width: 100%;
  }

  .sort-select,
  .primary-btn {
    flex: 1;
  }
}
</style>
