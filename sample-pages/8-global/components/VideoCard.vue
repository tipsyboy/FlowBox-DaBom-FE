<script setup>
const props = defineProps({
  thumbnail: { type: String, required: true },
  title: { type: String, required: true },
  meta: { type: String, default: '' },
  duration: { type: String, default: '' },
  href: { type: String, default: '#' },
});
</script>

<template>
  <article class="g-video-card">
    <a class="g-video-card__thumb" :href="href">
      <img :src="thumbnail" :alt="title" />
      <span v-if="duration" class="g-video-card__duration">{{ duration }}</span>
    </a>
    <div class="g-video-card__body">
      <h3 class="g-video-card__title">{{ title }}</h3>
      <p v-if="meta" class="g-video-card__meta">{{ meta }}</p>
    </div>
  </article>
</template>
