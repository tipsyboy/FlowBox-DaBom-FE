<template>
  <aside class="sidebar">
    <SidebarSection title="홈" :items="homeMenu"/>
<!--    <SidebarSection title="라이브러리" :items="libraryMenu"/>-->
    <SidebarSection title="구독" :items="subscriptionMenu" isChannel/>
    <!-- <SidebarSection title="더보기" :items="moreMenu" /> -->
  </aside>
</template>

<script setup>
import SidebarSection from './SidebarSection.vue'
import { useSubscriptionStore } from '@/stores/useSubscriptionStore.js';
import { onMounted, computed } from 'vue';

const subscriptionStore = useSubscriptionStore();

const homeMenu = [
  {icon: 'fas fa-home', label: '홈', active: true, path: '/'},
  {icon: 'fas fa-list', label: '재생목록', path: '/my-playlists'},
  {icon: 'fas fa-users', label: 'Together', path: '/together'},
]

const subscriptionMenu = computed(() => {
  return subscriptionStore.subscriptions.map(sub => ({
    img: sub.profileImage || 'https://via.placeholder.com/24', // Assuming profileImage might exist, otherwise default
    label: sub.name || 'Unknown Channel', // CORRECT
    path: `/channel/${sub.name}` // CORRECT
  }));
});

const moreMenu = [
  {icon: 'fas fa-cog', label: '설정'},
  {icon: 'fas fa-question-circle', label: '고객센터'},
  {icon: 'fas fa-flag', label: '신고'},
]

onMounted(() => {
  subscriptionStore.fetchSubscriptions();
});

</script>

<style scoped>
.sidebar {
  margin: 0;
  width: 17rem;
  background-color: var(--background-color);
  padding: var(--spacing-md);
  height: calc(100vh - 70px);
  overflow-y: auto;
  position: relative;
  top: 70px;
}
</style>