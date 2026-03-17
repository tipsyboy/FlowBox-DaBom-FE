<script setup>
const props = defineProps({
  brand: { type: String, default: 'DaBom' },
  copyText: { type: String, default: 'All rights reserved.' },
});
</script>

<template>
  <footer class="g-footer">
    <div class="g-footer__inner">
      <strong>{{ brand }}</strong>
      <span>{{ copyText }}</span>
    </div>
  </footer>
</template>
