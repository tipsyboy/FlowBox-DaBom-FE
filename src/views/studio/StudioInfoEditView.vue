<script setup>
import { onMounted, reactive, ref } from 'vue'
import { storeToRefs } from 'pinia'
import authApi from '@/api/auth/index.js'
import channelApi from '@/api/channel/index.js'
import imageApi from '@/api/image/index.js'
import avatarFallback from '@/assets/images/dabom2.png'
import bannerFallback from '@/assets/images/banner.png'
import useStudioChannelStore from '@/stores/useStudioChannelStore.js'

const isSaving = ref(false)
const errorMessage = ref('')
const channelStore = useStudioChannelStore()
const { isLoading } = storeToRefs(channelStore)
const profilePreview = ref(avatarFallback)
const bannerPreview = ref(bannerFallback)

const form = reactive({
  id: '',
  content: ''
})

const ImageType = {
  PROFILE: { requestPath: 'profile', entityType: 'PROFILE' },
  BANNER: { requestPath: 'banner', entityType: 'BANNER' }
}

const loadChannelInfo = async () => {
  try {
    errorMessage.value = ''
    const data = await channelStore.loadChannelInfo({ force: true })

    form.id = data.id || ''
    form.content = data.content || ''

    if (data.profileImg) {
      profilePreview.value = data.profileImg
    }
    if (data.bannerImg) {
      bannerPreview.value = data.bannerImg
    }
  } catch (error) {
    errorMessage.value = '채널 정보를 불러오지 못했습니다.'
  }
}

const saveInfo = async () => {
  try {
    isSaving.value = true
    errorMessage.value = ''
    await channelApi.updateChannelInfo({
      id: form.id,
      content: form.content
    })
    channelStore.setChannelInfo({
      id: form.id,
      content: form.content
    })
    alert('채널 정보가 저장되었습니다.')
  } catch (error) {
    errorMessage.value = '채널 정보 저장에 실패했습니다.'
  } finally {
    isSaving.value = false
  }
}

const uploadImage = async (file, typeConfig) => {
  const fileInfo = {
    originalFilename: file.name,
    fileSize: file.size,
    contentType: file.type
  }

  const presignedResponse = await imageApi.getPresignedUrl(fileInfo, typeConfig.requestPath)
  const { s3Key, uploadUrl } = presignedResponse.data || {}

  if (!s3Key || !uploadUrl) {
    throw new Error('presigned url not found')
  }

  await imageApi.uploadToPresignedUrl(uploadUrl, file)
  return await imageApi.createMemberImageEntity({
    ...fileInfo,
    s3Key,
    imageType: typeConfig.entityType
  })
}

const uploadProfileImage = async (file) => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('directory', 'profile')

  return await authApi.updateProfileImage(formData)
}

const syncImageState = async (fieldName, localPreviewUrl) => {
  const data = await channelStore.loadChannelInfo({ force: true })
  const nextImageUrl = data[fieldName]

  if (fieldName === 'profileImg') {
    profilePreview.value = nextImageUrl || localPreviewUrl || avatarFallback
    return
  }

  bannerPreview.value = nextImageUrl || localPreviewUrl || bannerFallback
}

const onProfileChange = async (event) => {
  const file = event.target.files?.[0]
  if (!file) return

  try {
    await uploadProfileImage(file)
    await syncImageState('profileImg', URL.createObjectURL(file))
    alert('프로필 이미지를 변경했습니다.')
  } catch (error) {
    errorMessage.value = '프로필 이미지 업로드에 실패했습니다.'
  } finally {
    event.target.value = ''
  }
}

const onBannerChange = async (event) => {
  const file = event.target.files?.[0]
  if (!file) return

  try {
    await uploadImage(file, ImageType.BANNER)
    await syncImageState('bannerImg', URL.createObjectURL(file))
    alert('배너 이미지를 변경했습니다.')
  } catch (error) {
    errorMessage.value = '배너 이미지 업로드에 실패했습니다.'
  } finally {
    event.target.value = ''
  }
}

onMounted(() => {
  loadChannelInfo()
})
</script>

<template>
  <section class="studio-card">
    <div class="head-row">
      <div>
        <h2>채널 정보 수정</h2>
        <p>채널 소개와 이미지를 최신 상태로 관리하세요.</p>
      </div>
      <button class="save-btn" type="button" :disabled="isSaving" @click="saveInfo">
        {{ isSaving ? '저장 중...' : '저장' }}
      </button>
    </div>

    <p v-if="isLoading" class="subtext">채널 정보를 불러오는 중입니다...</p>
    <p v-else-if="errorMessage" class="subtext error">{{ errorMessage }}</p>

    <form class="form" @submit.prevent>
      <label class="field">
        <span>채널 설명</span>
        <textarea v-model="form.content" rows="4" placeholder="창작과 영감을 나누는 공간입니다." />
      </label>

      <div class="upload-grid">
        <label class="field upload-field">
          <span>채널 프로필 이미지</span>
          <div class="preview-box avatar-box">
            <img :src="profilePreview" alt="프로필 미리보기" />
          </div>
          <input type="file" accept="image/*" @change="onProfileChange" />
        </label>

        <label class="field upload-field">
          <span>배너(커버) 이미지</span>
          <div class="preview-box banner-box">
            <img :src="bannerPreview" alt="배너 미리보기" />
          </div>
          <input type="file" accept="image/*" @change="onBannerChange" />
        </label>
      </div>
    </form>
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

.head-row p {
  margin: 6px 0 0;
  color: var(--text-secondary);
  font-size: 14px;
}

.subtext {
  margin: 10px 0 0;
  color: var(--text-secondary);
}

.subtext.error {
  color: #ff9f9f;
}

.save-btn {
  border: 1px solid rgba(250, 85, 0, 0.5);
  border-radius: 10px;
  background: rgba(250, 85, 0, 0.15);
  color: #ffc3a1;
  font-weight: 700;
  padding: 8px 14px;
  cursor: pointer;
}

.save-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.form {
  margin-top: 14px;
  display: grid;
  gap: 14px;
}

.field {
  display: grid;
  gap: 8px;
}

.field span {
  font-size: 14px;
  font-weight: 700;
}

textarea,
input[type='file'] {
  border: 1px solid var(--border-color);
  border-radius: 10px;
  background: #141518;
  color: var(--text-primary);
  font-size: 14px;
}

textarea {
  padding: 12px;
  resize: vertical;
}

input[type='file'] {
  padding: 9px;
}

.upload-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.preview-box {
  border: 1px solid var(--border-color);
  border-radius: 12px;
  overflow: hidden;
  background: #121418;
  position: relative;
}

.preview-box img {
  display: block;
  width: 100%;
  object-fit: cover;
}

.avatar-box img,
.banner-box img {
  height: 220px;
}

@media (max-width: 760px) {
  .upload-grid {
    grid-template-columns: 1fr;
  }

  .head-row {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
