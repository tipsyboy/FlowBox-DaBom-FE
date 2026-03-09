<script setup>
defineProps({
  src: {
    type: String,
    required: true,
  },
  alt: {
    type: String,
    default: 'banner',
  },
})
</script>

<template>
  <section class="main-banner">
    <div class="banner-frame">
      <img :src="src" :alt="alt" class="banner-image" />
    </div>
  </section>
</template>

<style scoped>
@import '../styles/design-tokens.css';

.main-banner {
  max-width: 1400px;
  margin: 1rem auto 2rem;
  padding: 0 12px;
}

.banner-frame {
  border-radius: 16px;
  border: 1px solid var(--border-color);
  overflow: hidden;
  background: #171717;
}

.banner-image {
  width: 100%;
  height: 11.5rem;
  object-fit: cover;
  object-position: center;
  display: block;
}
</style>

