<script setup>
defineProps({
  message: {
    type: String,
    default: '데이터가 없습니다.',
  },
})
</script>

<template>
  <div class="empty-state">{{ message }}</div>
</template>

<style scoped>
@import '../styles/design-tokens.css';

.empty-state {
  border: 1px dashed var(--border-color);
  border-radius: 10px;
  padding: 1rem;
  text-align: center;
  color: var(--text-secondary);
}
</style>

