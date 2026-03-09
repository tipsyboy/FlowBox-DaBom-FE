<script setup>
defineProps({
  message: {
    type: String,
    default: '불러오는 중...',
  },
})
</script>

<template>
  <div class="loading-state">
    <span class="dot"></span>
    {{ message }}
  </div>
</template>

<style scoped>
@import '../styles/design-tokens.css';

.loading-state {
  border: 1px dashed var(--border-color);
  border-radius: 10px;
  padding: 1rem;
  text-align: center;
  color: var(--text-secondary);
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  display: inline-block;
  margin-right: 7px;
  background: var(--primary-color);
  animation: pulse 0.8s infinite ease-in-out;
}

@keyframes pulse {
  0% {
    transform: scale(0.9);
    opacity: 0.5;
  }
  100% {
    transform: scale(1.1);
    opacity: 1;
  }
}
</style>

