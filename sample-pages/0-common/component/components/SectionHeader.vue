<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
  linkLabel: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['action'])
</script>

<template>
  <div class="section-header-row">
    <h3 class="section-title">{{ title }}</h3>
    <a v-if="linkLabel" href="#" @click.prevent="emit('action')">{{ linkLabel }}</a>
  </div>
</template>

<style scoped>
@import '../styles/design-tokens.css';

.section-header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.8rem;
  margin-bottom: 0.9rem;
}

.section-title {
  color: var(--text-primary);
  font-size: 1.3rem;
  font-weight: 600;
}

a {
  color: var(--primary-color);
  text-decoration: none;
}
</style>

