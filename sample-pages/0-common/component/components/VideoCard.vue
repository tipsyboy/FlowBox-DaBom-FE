<script setup>
defineProps({
  video: {
    type: Object,
    required: true,
  },
})
</script>

<template>
  <article class="video-card">
    <div class="video-thumbnail">
      <img :src="video.thumbnailSrc" alt="썸네일" />
      <div class="video-duration">{{ video.duration }}</div>
    </div>

    <div class="video-info">
      <div class="channel-avatar">
        <img :src="video.channelImageSrc" alt="채널" />
      </div>
      <div class="video-details">
        <h4 class="video-title">{{ video.title }}</h4>
        <p class="channel-name">{{ video.channelName }}</p>
        <div class="video-meta">
          <span>{{ video.rating }}</span>
          <span>{{ video.views }}</span>
          <span>{{ video.uploadedAt }}</span>
        </div>
      </div>
    </div>
  </article>
</template>

<style scoped>
@import '../styles/design-tokens.css';

.video-card {
  width: 100%;
  background-color: var(--card-bg);
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.video-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.35);
}

.video-thumbnail {
  position: relative;
  aspect-ratio: 16 / 9;
}

.video-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.video-duration {
  position: absolute;
  bottom: 8px;
  right: 8px;
  background-color: rgba(0, 0, 0, 0.8);
  color: #fff;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
}

.video-info {
  padding: 12px;
  display: flex;
  gap: 12px;
}

.channel-avatar img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.video-title {
  font-size: 15px;
  margin-bottom: 2px;
}

.channel-name {
  color: var(--text-secondary);
  font-size: 13px;
  margin-bottom: 2px;
}

.video-meta {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  color: var(--text-secondary);
  font-size: 12px;
}
</style>

