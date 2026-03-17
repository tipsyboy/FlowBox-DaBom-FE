<script setup>
const props = defineProps({
  items: {
    type: Array,
    default: () => [],
  },
  activeKey: {
    type: String,
    default: '',
  },
});
</script>

<template>
  <nav class="g-card g-sidebar">
    <template v-for="item in items" :key="item.key">
      <a
        v-if="item.href"
        :href="item.href"
        class="g-sidebar__item"
        :class="{ 'is-active': item.key === activeKey, 'is-danger': item.danger }"
      >
        {{ item.label }}
      </a>
      <button
        v-else
        type="button"
        class="g-sidebar__item"
        :class="{ 'is-active': item.key === activeKey, 'is-danger': item.danger }"
      >
        {{ item.label }}
      </button>
    </template>
  </nav>
</template>
