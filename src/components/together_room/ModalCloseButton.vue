<script setup>
const emit = defineEmits(['close_modal'])

const closeModal = () => {
  emit('close_modal')
}
</script>

<template>
  <button class="modal-close" type="button" @click="closeModal">
    <i class="fas fa-times"></i>
  </button>
</template>

<style scoped>
.modal-close {
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 999px;
  background: transparent;
  color: var(--text-secondary);
  cursor: pointer;
  font-size: 18px;
}

.modal-close:hover {
  background: var(--hover-color);
  color: var(--text-primary);
}
</style>
