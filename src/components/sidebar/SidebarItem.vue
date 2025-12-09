<template>
    <router-link v-if="props.item.path" :to="props.item.path" class="sidebar-item" :class="{ active: props.item.active }">
        <template v-if="props.isChannel">
            <img :src="props.item.img" alt="채널" class="channel-icon" />
        </template>
        <template v-else>
            <i :class="props.item.icon"></i>
        </template>
        {{ props.item.label }}
    </router-link>
    <a v-else href="#" class="sidebar-item" :class="{ active: props.item.active }">
        <template v-if="props.isChannel">
            <img :src="props.item.img" alt="채널" class="channel-icon" />
        </template>
        <template v-else>
            <i :class="props.item.icon"></i>
        </template>
        {{ props.item.label }}
    </a>
</template>

<script setup>
import { RouterLink } from 'vue-router';
const props = defineProps(['item', 'isChannel'])
</script>

<style scoped>
.sidebar-item {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
    color: var(--text-secondary);
    text-decoration: none;
    padding: var(--spacing-sm) var(--spacing-md);
    border-radius: 8px;
    font-size: var(--font-sm);
    transition: all 0.3s ease;
}

.sidebar-item:hover {
    color: var(--text-primary);
    background-color: rgba(255, 255, 255, 0.1);
}

.sidebar-item.active {
    color: var(--primary-color);
    background-color: rgba(255, 107, 107, 0.1);
}

.sidebar-item i {
    width: 1rem;
    text-align: center;
}

.channel-icon {
    width: 1.5rem;
    height: 1.5rem;
    border-radius: 50%;
}
</style>
