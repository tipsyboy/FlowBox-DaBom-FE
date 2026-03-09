<script setup>
defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
});
</script>

<template>
  <div class="g-section-header">
    <div>
      <h2>{{ title }}</h2>
      <p v-if="subtitle" style="margin: 4px 0 0; color: var(--text-secondary)">{{ subtitle }}</p>
    </div>
    <slot name="actions" />
  </div>
</template>
