<script setup>
import { onMounted, ref } from 'vue'
import videoApi from '@/api/video/index.js'
import StudioVideoUploadModal from '@/components/studio/StudioVideoUploadModal.vue'
import bannerFallback from '@/assets/images/banner.png'
import ButtonBasic from '@/components/ui/ButtonBasic.vue'

const videos = ref([])
const isLoading = ref(false)
const errorMessage = ref('')
const showUploadModal = ref(false)

const formatDate = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  if (Number.isNaN(date.getTime())) return dateString
  return date.toLocaleDateString('ko-KR')
}

const openUploadModal = () => {
  showUploadModal.value = true
}

const closeUploadModal = () => {
  showUploadModal.value = false
}

const loadMyVideos = async () => {
  try {
    isLoading.value = true
    errorMessage.value = ''
    const response = await videoApi.getMyVideoList()
    videos.value = Array.isArray(response?.data) ? response.data : []
  } catch (error) {
    videos.value = []
    errorMessage.value = '내 동영상 목록을 불러오지 못했습니다.'
  } finally {
    isLoading.value = false
  }
}

const onUploaded = async () => {
  await loadMyVideos()
}

onMounted(() => {
  loadMyVideos()
})
</script>

<template>
  <section class="studio-card">
    <StudioVideoUploadModal :visible="showUploadModal" @close="closeUploadModal" @uploaded="onUploaded" />

    <div class="head-row">
      <h2>동영상 관리</h2>
      <ButtonBasic class="upload-btn" type="button" variant="primary" @click="openUploadModal">동영상 업로드</ButtonBasic>
    </div>
    <p class="subtext">총 {{ videos.length }}개 동영상 (내 채널 기준)</p>

    <p v-if="isLoading" class="subtext loading">내 동영상 목록을 불러오는 중입니다...</p>
    <p v-else-if="errorMessage" class="subtext error">{{ errorMessage }}</p>

    <div v-if="!isLoading && !errorMessage && videos.length > 0" class="table-wrap">
      <table class="video-table">
        <thead>
          <tr>
            <th>동영상</th>
            <th>제목</th>
            <th>조회수</th>
            <th>평점</th>
            <th>상태</th>
            <th>업로드날짜</th>
            <th>관리</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in videos" :key="item.videoIdx">
            <td class="thumb-cell">
              <img :src="item.thumbnailImage || bannerFallback" :alt="item.title || '동영상 썸네일'" class="thumbnail" />
            </td>
            <td>
              <strong>{{ item.title || '(제목 없음)' }}</strong>
              <p>{{ item.description || '설명이 없습니다.' }}</p>
            </td>
            <td>{{ item.views ?? 0 }}</td>
            <td>★ {{ item.averageScore ?? 0 }}</td>
            <td>
              <span class="status" :class="{ off: !item.publicVideo }">{{ item.publicVideo ? '공개' : '비공개' }}</span>
            </td>
            <td>{{ formatDate(item.uploadedAt) }}</td>
            <td><ButtonBasic class="edit-btn" type="button" variant="ghost" size="sm">수정</ButtonBasic></td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-else-if="!isLoading && !errorMessage" class="empty-state">
      <i class="fas fa-file-video"></i>
      <h3>업로드된 동영상이 없습니다</h3>
      <p>첫 번째 동영상을 업로드해보세요.</p>
      <ButtonBasic class="upload-btn" type="button" variant="primary" @click="openUploadModal">동영상 업로드</ButtonBasic>
    </div>
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

.subtext {
  margin: 7px 0 0;
  color: var(--text-secondary);
  font-size: 14px;
}

.subtext.loading {
  color: #b8b8b8;
}

.subtext.error {
  color: #ff9f9f;
}

.upload-btn,
.edit-btn {
  border-radius: 10px;
  font-weight: 700;
}

.table-wrap {
  margin-top: 12px;
  overflow-x: auto;
}

.video-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 760px;
}

.video-table th,
.video-table td {
  border-bottom: 1px solid var(--border-color);
  padding: 12px 10px;
  font-size: 14px;
  vertical-align: middle;
}

.thumb-cell {
  width: 128px;
}

.thumbnail {
  width: 116px;
  height: 66px;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid var(--border-color);
}

.video-table th {
  color: var(--text-secondary);
  text-align: left;
}

.video-table td p {
  margin: 4px 0 0;
  color: var(--text-secondary);
  font-size: 12px;
}

.status {
  display: inline-block;
  border: 1px solid rgba(32, 196, 110, 0.5);
  border-radius: 999px;
  color: #8be6b9;
  padding: 4px 8px;
  font-size: 12px;
  font-weight: 700;
}

.status.off {
  border-color: rgba(255, 130, 130, 0.5);
  color: #ffb0b0;
}

.empty-state {
  margin-top: 14px;
  border: 1px dashed var(--border-color);
  border-radius: 12px;
  background: #16181c;
  padding: 28px 14px;
  text-align: center;
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
</style>
