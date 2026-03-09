<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
  meta: {
    type: String,
    default: '',
  },
})
</script>

<template>
  <article class="post-item">
    <h3>{{ title }}</h3>
    <p>{{ meta }}</p>
  </article>
</template>

<style scoped>
@import '../styles/design-tokens.css';

.post-item {
  border: 1px solid var(--border-color);
  border-radius: 10px;
  background: #252525;
  padding: 10px;
}

.post-item h3 {
  margin-bottom: 4px;
  font-size: 15px;
}

.post-item p {
  color: var(--text-secondary);
  font-size: 13px;
}
</style>

