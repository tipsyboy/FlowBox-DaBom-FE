
<script setup>
import api from '@/api/video/index.js'
import {onMounted, ref} from "vue";
import VideoPublicStatusModal from "@/components/channel/video-management/VideoPublicStatusModal.vue";
import {useRouter} from "vue-router";
import imageApi from "@/api/image/index.js";

const ImageType = {
  THUMBNAIL: { requestPath: "thumbnail", entityType: "VIDEO_THUMBNAIL" }
}
const props = defineProps(['videos'])
const router = useRouter();
const publicStatusModal = ref(false)
const targetVideoIdx = ref(null)
const targetVideo = ref(null)


const formatDate = (dateString) => {
  if (!dateString) return ''
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('ko-KR')
  } catch {
    return dateString
  }
}

const handleConfirm = async () => {
  await api.toggleVideoVisibility(targetVideoIdx.value)
  targetVideo.value.publicVideo = !targetVideo.value.publicVideo
  alert("공개 여부 상태가 변경되었습니다.")
  closePublicStatusUpdateModal()
}


const onThumbnailImage = (event, videoIdx) => {
  const file = event.target.files[0]
  if (file) imageUpload(file, ImageType.THUMBNAIL, videoIdx)
}

const imageUpload = async (file, { requestPath, entityType }, videoIdx) => {
  try {
    const fileInfo = {
      originalFilename: file.name,
      fileSize: file.size,
      contentType: file.type
    }

    const presignedResponse = await imageApi.getPresignedUrl(fileInfo, requestPath)
    const { s3Key, uploadUrl } = presignedResponse.data

    const uploadResponse = await imageApi.uploadToPresignedUrl(uploadUrl, file)
    console.log(videoIdx)

    if (uploadResponse.ok || uploadResponse.status === 200) {
      const entityResponse = await imageApi.createThumbnailImageEntity({
        ...fileInfo,
        s3Key,
        imageType: entityType
      }, videoIdx)
      alert(entityResponse.message)
    }
  } catch (error) {
    console.error(`${entityType} 이미지 업로드 실패:`, error)
    alert(`${entityType} 이미지 변경 실패`)
  }
}

const openPublicStatusUpdateModal = (videoIdx, video) => {
  targetVideo.value = video
  targetVideoIdx.value = videoIdx
  publicStatusModal.value = true
}

const closePublicStatusUpdateModal = () => {
  publicStatusModal.value = false
  targetVideoIdx.value = null
  targetVideo.value = null
}

const playVideo = (videoIdx) => {
  router.push({name: "videoPlayer", params: {id: videoIdx}})
}


onMounted(() => {
  console.log('videos:', props.videos)
})
</script>

<template>
  <div>
    <teleport to="body">
      <VideoPublicStatusModal
          v-if="publicStatusModal"
          :title="targetVideo?.publicVideo ? '동영상 비공개' : '동영상 공개'"
          :message="targetVideo?.publicVideo ?'동영상을 비공개 상태로 변경하시겠습니까?' : '동영상을 공개상태로 변경하시겠습니까?'"
          @confirm="handleConfirm"
          @cancel="closePublicStatusUpdateModal"
      />
    </teleport>

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
      <tr v-for="video in videos" :key="video.videoIdx" class="video-row">
        <td class="video-cell" @click="playVideo(video.videoIdx)">
          <div class="video-wrapper">
            <img :src='video.thumbnailImage' :alt="video.title"/>
            <div class="play-overlay" @click="playVideo(video.idx)">
              <i class="fa-solid fa-play"></i>
            </div>
          </div>
        </td>

        <td class="title-cell">
          <div class="title-wrapper">
            <h4>{{ video.title }}</h4>
            <p class="description">{{ video.description }}</p>
          </div>
        </td>

        <td class="views-cell">{{ video.views }}</td>

        <td class="rating-cell">
          <div class="rating">
            <i class="icon-star"></i>
            {{ video.averageScore }}
          </div>
        </td>

        <td class="status-cell">
          <div class="action-buttons">
            <button @click="openPublicStatusUpdateModal(video.videoIdx, video)" class="action-btn delete">
              {{ video.publicVideo ? '공개' : '비공개' }}
            </button>
          </div>
        </td>

        <td class="date-cell">{{ formatDate(video.uploadedAt) }}</td>

        <td class="actions-cell">
          <input
              :id="'thumbnail-' + video.videoIdx"
              type="file"
              accept="image/*"
              class="hidden"
              @change="(event) => onThumbnailImage(event, video.videoIdx)"
          />
          <label :for="'thumbnail-' + video.videoIdx" class="action-btn upload">
            썸네일 업로드
          </label>
        </td>

      </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.video-table {
  width: 100%;
  background-color: var(--card-bg);
  border-radius: 12px;
  overflow: hidden;
  border-collapse: collapse;
  //margin: var(--spacing-lg) 0;
}

.video-table thead {
  background-color: var(--border-color);
}

.video-table th {
  padding: var(--spacing-md);
  text-align: left;
  font-weight: 600;
  color: var(--text-primary);
  font-size: var(--font-sm);
  border-bottom: 2px solid var(--border-color);
}

.video-table tbody tr {
  border-bottom: 1px solid var(--border-color);
  transition: var(--transition);
}

.video-table tbody tr:hover {
  background-color: var(--hover-color);
}

.video-table td {
  padding: var(--spacing-md);
  vertical-align: middle;
  color: var(--text-secondary);
  font-size: var(--font-sm);
}

.video-cell {
  width: 15vh;
  text-align: center;
}

.title-cell {
  max-width: 40vh;
  /* min-width: 80px; */
}

.title-wrapper h4 {
  color: var(--text-primary);
  font-size: var(--font-md);
  font-weight: 600;
  margin-bottom: var(--spacing-xs);
  line-height: 1.3;
}

.description {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.4;
}

.views-cell {
  font-weight: 500;
  color: var(--text-primary);
}


.rating {
  display: flex;
  gap: var(--spacing-xs);
  color: var(--star-color);
  font-weight: 600;
}

.rating i {
  color: var(--star-color);
}

.date-cell {
  font-size: var(--font-xs);
  white-space: nowrap;
}

.actions-cell {
  min-width: 120px;
}

.action-buttons {
  display: flex;
}

.action-btn {
  background: none;
  border: none;
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  cursor: pointer;
  transition: var(--transition);
  color: var(--text-secondary);
  white-space: nowrap;
  font-size: 0.8rem;
}

.action-btn:hover {
  background-color: var(--hover-color);
  color: var(--text-primary);
}

.action-btn.delete:hover {
  background-color: #e74c3c;
  color: white;
}

.hidden {
  display: none;
}

/* 썸네일 이미지 */
.video-wrapper {
  position: relative;
  display: inline-block;
  width: 120px;
  height: 68px;
  border-radius: 6px;
  overflow: hidden;
  cursor: pointer;
}

.video-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.video-wrapper .play-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s ease-in-out;
  border-radius: 6px;
}

.video-wrapper:hover .play-overlay {
  opacity: 1;
}

.video-wrapper .play-overlay i.icon-play {
  font-size: 20px; /* 재생 아이콘 크기 */
  color: #fff;
}

</style>