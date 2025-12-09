<script setup>
const emits = defineEmits('close_modal')

const closeModal = () => emits('close_modal')
</script>

<template>
    <button class="modal-close" id="modalClose" @click="closeModal()">
        <i class="fas fa-times"></i>
    </button>
</template>

<style scoped>
@import url(@/assets/together_room/ModalCloseButton.css);
</style>