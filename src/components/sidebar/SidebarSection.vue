<template>
    <div class="sidebar-section">
        <h3>{{ props.title }}</h3>
        <ul class="sidebar-menu">
            <li v-for="(item, idx) in props.items" :key="idx">
                <SidebarItem :item="item" :is-channel="props.isChannel" />
            </li>
        </ul>
    </div>
</template>

<script setup>
import SidebarItem from '@/components/sidebar/SidebarItem.vue'

const props = defineProps(['title', 'items', 'isChannel'])
</script>

<style scoped>
.sidebar-section {
    margin-bottom: var(--spacing-xl);
}

.sidebar-section h3 {
    color: var(--text-primary);
    font-size: var(--font-md);
    font-weight: 600;
    margin-bottom: var(--spacing-md);
    padding-bottom: var(--spacing-sm);
    border-bottom: 1px solid var(--border-color);
}

.sidebar-menu {
    list-style: none;
    padding: 0;
    margin: 0;
}

.sidebar-menu li {
    margin-bottom: var(--spacing-xs);
}
</style>