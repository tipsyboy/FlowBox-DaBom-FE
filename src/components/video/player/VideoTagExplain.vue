<script setup>
import { computed } from 'vue'

const props = defineProps(['videoInfo'])

const tags = computed(() => {
  return Array.isArray(props.videoInfo?.tags) ? props.videoInfo.tags : []
})

const filledStars = computed(() => {
  const score = Number(props.videoInfo?.videoScore || 0)
  return Math.max(0, Math.min(5, Math.round(score)))
})
</script>

<template>
  <div class="description-box">
    <div class="meta-rating-box">
      <p class="description-meta">조회수 {{ props.videoInfo.viewCount }}회</p>
      <div class="stars" aria-label="rating">
        <i v-for="index in 5" :key="index" class="fa-star" :class="index <= filledStars ? 'fas active' : 'far'"></i>
      </div>
    </div>

    <p class="description-text">{{ props.videoInfo.description }}</p>

    <div class="tags" v-if="tags.length">
      <span v-for="tag in tags" :key="tag">#{{ tag }}</span>
    </div>
  </div>
</template>

<style scoped>
.description-box {
  background: var(--card-bg);
  border: none;
  border-radius: 15px;
  padding: 20px;
  line-height: 1.6;
}

.meta-rating-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 10px;
}

.description-meta {
  margin: 0;
  color: var(--text-secondary);
  font-size: 14px;
}

.stars {
  color: #f5b301;
  font-size: 14px;
}

.stars .active {
  color: #f5b301;
}

.description-text {
  margin: 0 0 14px;
  color: #dedede;
  font-size: 15px;
  line-height: 1.75;
  white-space: pre-line;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tags span {
  background: var(--hover-color);
  border: 1px solid #4a4a4a;
  color: var(--primary-color);
  border-radius: 15px;
  padding: 5px 11px;
  font-size: 13px;
}
</style>
