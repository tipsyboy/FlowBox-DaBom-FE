<script setup>
import { reactive, ref, watch } from 'vue'
import videoApi from '@/api/video/index.js'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'uploaded'])

const step = ref(1)
const fileInputRef = ref(null)
const selectedFile = ref(null)
const previewUrl = ref('')
const isUploading = ref(false)
const isSaving = ref(false)
const errorMessage = ref('')

const metadata = reactive({
  idx: null,
  title: '',
  description: '',
  isPublic: true,
  videoTag: ''
})

const resetState = () => {
  step.value = 1
  selectedFile.value = null
  errorMessage.value = ''
  isUploading.value = false
  isSaving.value = false

  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value)
  }
  previewUrl.value = ''

  metadata.idx = null
  metadata.title = ''
  metadata.description = ''
  metadata.isPublic = true
  metadata.videoTag = ''
}

const triggerFileSelect = () => {
  fileInputRef.value?.click()
}

const onSelectFile = async (event) => {
  const file = event.target.files?.[0]
  if (!file) return

  selectedFile.value = file
  errorMessage.value = ''

  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value)
  }
  previewUrl.value = URL.createObjectURL(file)

  try {
    isUploading.value = true
    const fileInfo = {
      originalFilename: file.name,
      fileSize: file.size,
      contentType: file.type
    }

    const presignedResponse = await videoApi.getPresignedUrl(fileInfo)
    const uploadInfo = presignedResponse?.data || {}

    if (!uploadInfo.uploadUrl || !uploadInfo.videoIdx) {
      throw new Error('업로드 URL 정보를 가져오지 못했습니다.')
    }

    await videoApi.uploadToPresignedUrl(uploadInfo.uploadUrl, file)
    metadata.idx = uploadInfo.videoIdx
    step.value = 2
  } catch (error) {
    errorMessage.value = '파일 업로드 중 오류가 발생했습니다. 다시 시도해 주세요.'
  } finally {
    isUploading.value = false
    event.target.value = ''
  }
}

const onSave = async () => {
  if (!metadata.idx || !metadata.title.trim() || !metadata.description.trim() || !metadata.videoTag) return

  try {
    isSaving.value = true
    errorMessage.value = ''
    await videoApi.uploadVideoMetadata(metadata.idx, metadata)
    emit('uploaded')
    emit('close')
    resetState()
  } catch (error) {
    errorMessage.value = '동영상 정보 저장에 실패했습니다.'
  } finally {
    isSaving.value = false
  }
}

const cleanupTempVideo = async () => {
  if (metadata.idx && step.value === 2) {
    try {
      await videoApi.cleanupS3TempVideo(metadata.idx)
    } catch (error) {
      // no-op
    }
  }
}

const onClose = async () => {
  await cleanupTempVideo()
  emit('close')
  resetState()
}

watch(
  () => props.visible,
  (visible) => {
    if (!visible) {
      resetState()
    }
  }
)
</script>

<template>
  <Teleport to="body">
    <div v-if="visible" class="modal-overlay" @click="onClose">
      <div class="modal" @click.stop>
        <header class="modal-header">
          <h3>{{ step === 1 ? '동영상 업로드' : '동영상 정보 입력' }}</h3>
          <button class="close-btn" type="button" @click="onClose"><i class="fas fa-times"></i></button>
        </header>

        <section class="modal-body">
          <template v-if="step === 1">
            <div class="upload-area" @click="triggerFileSelect">
              <input ref="fileInputRef" type="file" accept="video/*" class="hidden" @change="onSelectFile" />
              <div class="upload-placeholder">
                <i class="fas fa-video"></i>
                <h4>비디오 파일 선택</h4>
                <p>MP4, AVI, MOV 형식 업로드 가능</p>
                <button class="btn btn-primary" type="button">파일 선택</button>
              </div>
            </div>
            <p v-if="isUploading" class="status-text">파일을 업로드하는 중입니다...</p>
          </template>

          <template v-else>
            <div class="content-grid">
              <div class="preview-box">
                <video v-if="previewUrl" :src="previewUrl" controls></video>
              </div>

              <div class="form-grid">
                <label>
                  제목
                  <input v-model="metadata.title" type="text" maxlength="100" placeholder="동영상 제목" />
                </label>
                <label>
                  설명
                  <textarea v-model="metadata.description" rows="6" maxlength="500" placeholder="동영상 설명"></textarea>
                </label>
                <label>
                  카테고리
                  <select v-model="metadata.videoTag">
                    <option value="" disabled>카테고리 선택</option>
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
                </label>
                <label class="checkbox-row">
                  <input v-model="metadata.isPublic" type="checkbox" />
                  <span>공개 설정</span>
                </label>
              </div>
            </div>
          </template>

          <p v-if="errorMessage" class="error-text">{{ errorMessage }}</p>
        </section>

        <footer class="modal-footer" v-if="step === 2">
          <button class="btn" type="button" @click="onClose">취소</button>
          <button
            class="btn btn-primary"
            type="button"
            :disabled="isSaving || !metadata.title.trim() || !metadata.description.trim() || !metadata.videoTag"
            @click="onSave"
          >
            {{ isSaving ? '저장 중...' : '완료' }}
          </button>
        </footer>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  display: grid;
  place-items: center;
  z-index: 1200;
}

.modal {
  width: min(860px, calc(100% - 24px));
  border: 1px solid var(--border-color);
  border-radius: 12px;
  background: #1b1d22;
  overflow: hidden;
}

.modal-header,
.modal-footer {
  padding: 14px 16px;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-footer {
  border-bottom: none;
  border-top: 1px solid var(--border-color);
  justify-content: flex-end;
  gap: 8px;
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
}

.close-btn {
  border: none;
  background: transparent;
  color: var(--text-secondary);
  cursor: pointer;
}

.modal-body {
  padding: 16px;
}

.upload-area {
  border: 2px dashed var(--border-color);
  border-radius: 12px;
  padding: 36px 16px;
  text-align: center;
  cursor: pointer;
}

.upload-placeholder i {
  font-size: 34px;
  color: #a6a6a6;
}

.upload-placeholder h4 {
  margin: 10px 0 6px;
}

.upload-placeholder p {
  margin: 0 0 12px;
  color: var(--text-secondary);
}

.content-grid {
  display: grid;
  grid-template-columns: minmax(260px, 1fr) minmax(300px, 1fr);
  gap: 14px;
}

.preview-box {
  border: 1px solid var(--border-color);
  border-radius: 10px;
  overflow: hidden;
  background: #111;
  aspect-ratio: 16 / 9;
}

.preview-box video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.form-grid {
  display: grid;
  gap: 10px;
}

.form-grid label {
  display: grid;
  gap: 6px;
  font-size: 13px;
}

.form-grid input,
.form-grid textarea,
.form-grid select {
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: #14161a;
  color: var(--text-primary);
  padding: 9px 10px;
  font-size: 14px;
}

.checkbox-row {
  display: flex !important;
  align-items: center;
  gap: 8px;
  margin-top: 2px;
}

.status-text,
.error-text {
  margin: 12px 0 0;
  font-size: 13px;
}

.error-text {
  color: #ff9f9f;
}

.btn {
  border: 1px solid var(--border-color);
  background: #36383d;
  color: var(--text-primary);
  border-radius: 8px;
  padding: 8px 12px;
  cursor: pointer;
}

.btn-primary {
  background: rgba(250, 85, 0, 0.2);
  border-color: rgba(250, 85, 0, 0.55);
  color: #ffc3a1;
  font-weight: 700;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.hidden {
  display: none;
}

@media (max-width: 760px) {
  .content-grid {
    grid-template-columns: 1fr;
  }
}
</style>
