<script setup>
import SidebarItem from './SidebarItem.vue'

defineProps({
  title: {
    type: String,
    required: true,
  },
  items: {
    type: Array,
    default: () => [],
  },
})
</script>

<template>
  <div class="sidebar-section">
    <h3>{{ title }}</h3>
    <div class="sidebar-list">
      <SidebarItem
        v-for="item in items"
        :key="item.label"
        :label="item.label"
        :active="item.active"
        :icon-text="item.iconText || '●'"
        :image-src="item.imageSrc || ''"
      />
    </div>
  </div>
</template>

<style scoped>
@import '../styles/design-tokens.css';

.sidebar-section {
  margin-bottom: 1.4rem;
}

.sidebar-section h3 {
  color: var(--text-primary);
  font-size: 1rem;
  margin-bottom: 0.6rem;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 0.4rem;
}

.sidebar-list {
  display: grid;
  gap: 4px;
}
</style>

