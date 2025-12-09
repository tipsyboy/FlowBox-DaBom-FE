<template>
    <div class="modal-backdrop">
        <div class="modal-card">
            <h2 class="modal-title">{{ props.title }}</h2>
            <p class="modal-message">{{ props.message }}</p>
            <div class="modal-buttons">
                <button class="modal-button cancel" @click="emit('cancel')">취소</button>
                <button class="modal-button confirm" @click="emit('confirm')">확인</button>
            </div>
        </div>
    </div>
</template>

<script setup>
const props = defineProps(['title', 'message'])
const emit = defineEmits(['confirm', 'cancel'])
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

.modal-buttons {
    display: flex;
    gap: 1rem;
    justify-content: center;
}

.modal-button {
    padding: 0.8rem 1.5rem;
    border: none;
    border-radius: 10px;
    color: white;
    font-weight: 600;
    font-size: 1rem;
    cursor: pointer;
    transition: background 0.3s ease;
}

.modal-button.cancel {
    background: linear-gradient(135deg, #95a5a6, #7f8c8d);
}

.modal-button.cancel:hover {
    background: #7f8c8d;
}

.modal-button.confirm {
    background: linear-gradient(135deg, var(--secondary-color), #27ae60);
}

.modal-button.confirm:hover {
    background: #2ecc71;
}
</style>