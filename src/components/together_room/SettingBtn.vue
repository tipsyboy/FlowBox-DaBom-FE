<script setup>
const emits = defineEmits([''])

const openSetting = () => {
    
}
</script>

<template>
<button class="setting-btn" id="settingsBtn" title="설정" @click="openSetting">
    <i class="fas fa-cog"></i>
</button>
</template>

<style scoped>
.setting-btn {
    display: flexbox;
    padding: 0.75rem;
    border: none;
    border-radius: 50%;
    background-color: transparent;
    color: var(--text-secondary);
    cursor: pointer;
    transition: var(--transition);
    font-size: 1.2rem;
}

.setting-btn:hover {
    background-color: var(--hover-color);
    color: var(--text-primary);
}

.setting-btn.active {
    background-color: var(--primary-color);
    color: white;
}
</style>