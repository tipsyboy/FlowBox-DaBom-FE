<template>
    <div class="modal-backdrop">
        <div class="modal-card">
            <h2 class="modal-title">{{ props.title }}</h2>
            <p class="modal-message">{{ props.message }}</p>
            <ButtonBasic class="modal-button" variant="secondary" @click="emit('confirm')">확인</ButtonBasic>
        </div>
    </div>
</template>

<script setup>
import ButtonBasic from '@/components/ui/ButtonBasic.vue'

const props = defineProps(['title', 'message'])
const emit = defineEmits(['confirm'])
</script>

<style scoped>
.modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.6);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
    backdrop-filter: blur(4px);
}

.modal-card {
    background-color: var(--card-bg);
    color: var(--text-primary);
    padding: 2rem;
    border-radius: 20px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    width: 90%;
    max-width: 35rem;
    text-align: center;
    transition: all 0.3s ease;
}

.modal-title {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    color: var(--text-primary);
}

.modal-message {
    font-size: 1rem;
    color: var(--text-secondary);
    margin-bottom: 2rem;
}

.modal-button {
    padding: 0.8rem 1.5rem;
    border-radius: 10px;
    font-weight: 600;
    font-size: 1rem;
}
</style>
