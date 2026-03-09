<script setup>
defineProps({
  label: {
    type: String,
    required: true,
  },
  active: {
    type: Boolean,
    default: false,
  },
  iconText: {
    type: String,
    default: '●',
  },
  imageSrc: {
    type: String,
    default: '',
  },
})
</script>

<template>
  <a class="sidebar-item" :class="{ active }" href="#" @click.prevent>
    <img v-if="imageSrc" :src="imageSrc" alt="" />
    <span v-else>{{ iconText }}</span>
    {{ label }}
  </a>
</template>

<style scoped>
@import '../styles/design-tokens.css';

.sidebar-item {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--text-secondary);
  text-decoration: none;
  padding: 8px 10px;
  border-radius: 8px;
  transition: var(--transition);
}

.sidebar-item img {
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
}

.sidebar-item:hover {
  color: var(--text-primary);
  background-color: rgba(255, 255, 255, 0.1);
}

.sidebar-item.active {
  color: var(--primary-color);
  background-color: rgba(255, 107, 107, 0.1);
}
</style>

