<script setup>
import {reactive, ref} from 'vue'
import api, {cleanupS3TempVideo} from '@/api/video'

const props = defineProps(['visible'])
const emit = defineEmits(['close', 'complete'])

// 상태
const step = ref(1)
const fileInput = ref(null)
const videoPreviewUrl = ref(null)

const fileInfo = reactive({
  originalFilename: '',
  fileSize: '',
  contentType: ''
})

const s3VideoInfo = reactive({
  videoIdx: '',
  uploadUrl: '',
  s3Key: '',
  expiresIn: ''
})

const metadata = reactive({
  idx: null,
  title: '',
  description: '',
  isPublic: false,
  videoTag: null,
})

// 모달 오픈
const handleFileSelect = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  // Step 2로 이동
  step.value = 2

  try {
    // preview
    videoPreviewUrl.value = getPreview(file);

    // 파일 업로드 API 호출
    metadata.idx = await uploadFile(file);
  } catch (error) {
    // 에러 처리
    console.error('파일 업로드 실패:', error)
  }
}

// 파일 선택
const triggerFileInput = () => {
  fileInput.value?.click()
}

// 프리뷰 생성
const getPreview = (file) => {
  return URL.createObjectURL(file)
}

const uploadFile = async (file) => {
  [fileInfo.originalFilename, fileInfo.fileSize, fileInfo.contentType] = [file.name, file.size, file.type]

  const presignedUrlResponse = await api.getPresignedUrl(fileInfo);
  const s3VideoInfo = presignedUrlResponse.data;

  let axiosResponse = await api.uploadToPresignedUrl(s3VideoInfo.uploadUrl, file); // presigned upload
  return s3VideoInfo.videoIdx;
}

// 메타데이터 저장
const saveMetadata = async () => {
  try {
    const data = await api.uploadVideoMetadata(metadata.idx, metadata)
    emit('complete', metadata)
    resetAndClose()
    window.location.reload()
  } catch (error) {
    console.error('저장 실패:', error)
  }
}

// 초기화 및 닫기
const resetAndClose = () => {
  step.value = 1
  metadata.idx = null
  videoPreviewUrl.value = null
  metadata.title = ''
  metadata.description = ''
  metadata.isPublic = true
  emit('close')
}

const cleanup = () => {
  if (metadata.idx && step.value === 2) {
    api.cleanupS3TempVideo(metadata.idx)
  }
}

const closeModal = () => {
  cleanup()
  resetAndClose()
}

const handleOverlayClick = () => {
  closeModal()
}
</script>

<template>
  <div v-if="visible" class="modal-overlay" @click="handleOverlayClick">
    <div class="modal" @click.stop>

      <!-- Step 1: 파일 선택 -->
      <div v-if="step === 1" class="file-select-step">
        <div class="modal-header">
          <h3>비디오 업로드</h3>
          <button @click="closeModal" class="close-btn">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <div class="modal-body">
          <div class="upload-area" @click="triggerFileInput">
            <input
                ref="fileInput"
                type="file"
                accept="video/*"
                @change="handleFileSelect"
                style="display: none"
            />

            <div class="upload-placeholder">
              <i class="fas fa-video"></i>
              <h4>비디오 파일 선택</h4>
              <p>MP4, AVI, MOV 등의 형식</p>
              <button class="upload-btn">파일 선택</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Step 2: 메타데이터 입력 -->
      <div v-else class="metadata-step">
        <div class="modal-header">
          <h3>비디오 정보 입력</h3>
          <button @click="closeModal" class="close-btn">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <div class="modal-body">
          <div class="content-grid">
            <!-- 비디오 미리보기 -->
            <div class="video-preview">
              <div class="preview-container">
                <video v-if="videoPreviewUrl" :src="videoPreviewUrl" controls></video>
                <div v-else class="loading-preview">
                  <i class="fas fa-spinner fa-spin"></i>
                  <p>업로드 중...</p>
                </div>
              </div>
            </div>

            <!-- 메타데이터 폼 -->
            <div class="metadata-form">
              <div class="form-group">
                <label for="title">제목 *</label>
                <input
                    id="title"
                    type="text"
                    v-model="metadata.title"
                    placeholder="동영상을 설명하는 제목 추가"
                    maxlength="100"
                />
                <small class="char-count">{{ metadata.title.length }}/100</small>
              </div>

              <div class="form-group">
                <label for="description">설명</label>
                <textarea
                    id="description"
                    v-model="metadata.description"
                    placeholder="시청자에게 동영상에 대해 설명해 주세요."
                    rows="8"
                    maxlength="500"
                    style="resize: none"
                ></textarea>
                <small class="char-count">{{ metadata.description.length }}/500</small>
              </div>

              <div class="form-group">
                <label for="videoTag">카테고리 *</label>
                <select
                    id="videoTag"
                    v-model="metadata.videoTag"
                    class="select-box"
                >
                  <option value="" disabled>카테고리를 선택하세요</option>
                  <option value="ENTERTAINMENT">엔터테인먼트</option>
                  <option value="EDUCATION">교육</option>
                  <option value="GAMING">게임</option>
                  <option value="LIFESTYLE">라이프스타일</option>
                  <option value="MUSIC">음악</option>
                  <option value="SPORTS">스포츠</option>
                  <option value="NEWS">뉴스·시사</option>
                  <option value="TECH">과학·기술</option>
                  <option value="TRAVEL">여행</option>
                  <option value="REVIEW">리뷰·쇼핑</option>
                </select>
              </div>

              <div class="form-group">
                <label class="checkbox-label">
                  <input type="checkbox" v-model="metadata.isPublic"/>
                  <span class="checkmark"></span>
                  <span>공개 설정</span>
                </label>
                <small class="form-help">체크하면 모든 사용자가 볼 수 있습니다</small>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button @click="closeModal" class="btn-cancel">취소</button>
          <button
              @click="saveMetadata"
              :disabled="!metadata.title.trim() || !metadata.description.trim() || !metadata.videoTag"
              class="btn-save"
          >
            완료
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background-color: var(--card-bg);
  border-radius: 12px;
  width: 90%;
  max-width: 800px;
  max-height: 100vh;
  overflow-y: auto;
  color: var(--text-primary);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-lg);
  border-bottom: 1px solid var(--border-color);
}

.modal-header h3 {
  margin: 0;
  font-size: var(--font-lg);
  font-weight: 600;
}

.close-btn {
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  padding: var(--spacing-sm);
  border-radius: 6px;
  transition: var(--transition);
}

.close-btn:hover {
  background-color: var(--hover-color);
  color: var(--text-primary);
}

.modal-body {
  padding: var(--spacing-lg);
}

/* Step 1: 파일 선택 */
.upload-area {
  border: 2px solid var(--border-color);
  border-radius: 8px;
  padding: var(--spacing-xl);
  text-align: center;
  cursor: pointer;
  transition: var(--transition);
}

.upload-area:hover {
  border-color: var(--primary-color);
  background-color: rgba(250, 85, 0, 0.05);
}

.upload-placeholder i {
  font-size: 3rem;
  color: var(--text-secondary);
  margin-bottom: var(--spacing-md);
}

.upload-placeholder h4 {
  color: var(--text-primary);
  margin-bottom: var(--spacing-sm);
}

.upload-placeholder p {
  color: var(--text-secondary);
  margin-bottom: var(--spacing-lg);
}

.upload-btn {
  background-color: var(--primary-color);
  color: white;
  border: none;
  padding: var(--spacing-md) var(--spacing-xl);
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
}

.upload-btn:hover {
  background-color: #ff3838;
}

/* Step 2: 메타데이터 입력 */
.content-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-xl);
}

.preview-container {
  background-color: var(--background-color);
  border-radius: 8px;
  aspect-ratio: 16/9;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.preview-container video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.loading-preview {
  text-align: center;
  color: var(--text-secondary);
}

.loading-preview i {
  font-size: 2rem;
  margin-bottom: var(--spacing-sm);
}

/* 폼 스타일 */
.form-group {
  margin-bottom: var(--spacing-md);
}

.form-group label {
  display: block;
  margin-bottom: var(--spacing-xs);
  color: var(--text-primary);
  font-weight: 500;
  font-size: var(--font-sm);
}

input, textarea {
  width: 100%;
  padding: var(--spacing-sm);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  background-color: var(--background-color);
  color: var(--text-primary);
  font-size: var(--font-sm);
}

input:focus, textarea:focus {
  outline: none;
  border-color: var(--primary-color);
}

.char-count {
  display: block;
  text-align: right;
  color: var(--text-secondary);
  font-size: var(--font-xs);
  margin-top: var(--spacing-xs);
}

.checkbox-label {
  display: flex !important;
  align-items: center !important;
  cursor: pointer !important;
  color: var(--text-secondary) !important;
  font-size: var(--font-sm) !important;
}

.checkbox-label input[type="checkbox"] {
  display: none !important;
}

.checkmark {
  width: 20px !important;
  height: 20px !important;
  background-color: var(--hover-color) !important;
  border: 2px solid var(--border-color) !important;
  border-radius: 4px !important;
  margin-right: 0.5rem !important;
  position: relative !important;
  transition: var(--transition) !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}

.checkbox-label input:checked + .checkmark {
  background-color: var(--primary-color) !important;
  border-color: var(--primary-color) !important;
}

.checkbox-label input:checked + .checkmark::after {
  content: '' !important;
  width: 6px !important;
  height: 10px !important;
  border: solid white !important;
  border-width: 0 2px 2px 0 !important;
  transform: rotate(45deg) !important;
  display: block !important;
}

.form-help {
  display: block;
  margin-top: var(--spacing-xs);
  color: var(--text-secondary);
  font-size: var(--font-xs);
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-sm);
  padding: var(--spacing-lg);
  border-top: 1px solid var(--border-color);
}

.btn-cancel, .btn-save {
  padding: var(--spacing-sm) var(--spacing-md);
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
}

.btn-cancel {
  background-color: var(--hover-color);
  color: var(--text-primary);
}

.btn-save {
  background-color: var(--primary-color);
  color: white;
}

.btn-save:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.select-box {
  width: 100%;
  padding: var(--spacing-sm);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  background-color: var(--background-color);
  color: var(--text-primary);
  font-size: var(--font-sm);
  cursor: pointer;
}

.select-box:focus {
  outline: none;
  border-color: var(--primary-color);
}

/* 반응형 */
@media (max-width: 768px) {
  .content-grid {
    grid-template-columns: 1fr;
  }

  .modal {
    width: 95%;
  }
}
</style>