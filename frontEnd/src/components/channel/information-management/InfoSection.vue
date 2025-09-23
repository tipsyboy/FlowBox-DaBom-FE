<script setup>
import { onMounted, reactive } from 'vue'
import api from '@/api/channel'
import imageApi from '@/api/image'

const props = defineProps({
  isActive: Boolean
})

const ImageType = {
  PROFILE: { requestPath: "profile", entityType: "PROFILE" },
  BANNER: { requestPath: "banner", entityType: "BANNER" }
}

const channelInfoForm = reactive({
  id: '',
  content: ''
})

const onSubmit = async() => {
  try {
    const res = await api.updateChannelInfo(channelInfoForm)
    console.log(res)
    alert('저장되었습니다!')
  } catch (error) {
    console.error("저장 실패:", error)
    alert('저장에 실패했습니다.')
  }
}

const onImageChange = (event) => {
  const file = event.target.files[0]
  if (file) imageUpload(file, ImageType.PROFILE)
}

const onBannerChange = (event) => {
  const file = event.target.files[0]
  if (file) imageUpload(file, ImageType.BANNER)
}

const imageUpload = async (file, { requestPath, entityType }) => {
  try {
    const fileInfo = {
      originalFilename: file.name,
      fileSize: file.size,
      contentType: file.type
    }

    const presignedResponse = await imageApi.getPresignedUrl(fileInfo, requestPath)
    const { s3Key, uploadUrl } = presignedResponse.data

    const uploadResponse = await imageApi.uploadToPresignedUrl(uploadUrl, file)

    if (uploadResponse.ok || uploadResponse.status === 200) {
      const entityResponse = await imageApi.createMemberImageEntity({ ...fileInfo, s3Key, imageType: entityType })
      alert(entityResponse.message)
    }
  } catch (error) {
    console.error(`${entityType} 이미지 업로드 실패:`, error)
    alert(`${entityType} 이미지 변경 실패`)
  }
}


onMounted(async () => {
  try {
    const result = await api.getChannelInfo()
    if (result && result.data) {
      channelInfoForm.id = result.data.id
      channelInfoForm.content = result.data.content
    }
  } catch (error) {
    console.error("채널 정보 로드 실패:", error)
  }
})
</script>

<template>
  <section id="section-info" class="dashboard-section" :class="{ active: props.isActive }">
    <h2>채널 정보 수정</h2>

    <form class="channel-info-form" @submit.prevent="onSubmit">
      <label>
        채널 설명
        <textarea rows="3" v-model="channelInfoForm.content" placeholder="창작과 영감을 나누는 공간입니다."></textarea>
      </label>
      <label>
        채널 프로필 이미지
        <input type="file" accept="image/*" @change="onImageChange">
      </label>
      <label>
        배너(커버) 이미지
        <input type="file" accept="image/*" @change="onBannerChange">
      </label>
      <button class="btn-save" type="submit"><i class="fas fa-save"></i> 저장</button>
    </form>
  </section>
</template>

<style scoped>
@import url(@/assets/channel/mychannel.css);
</style>