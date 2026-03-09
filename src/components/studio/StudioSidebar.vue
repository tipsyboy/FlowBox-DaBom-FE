<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()

const menu = [
  { label: '동영상 관리', to: '/mychannel/videos', path: '/mychannel/videos' },
  { label: '커뮤니티 관리', to: '/mychannel/community', path: '/mychannel/community' },
  { label: '채널 정보 수정', to: '/mychannel/info', path: '/mychannel/info' }
]

const isActive = (itemPath) => route.path === itemPath
</script>

<template>
  <aside class="studio-sidebar">
    <RouterLink
      v-for="item in menu"
      :key="item.label"
      :to="item.to"
      class="sidebar-link"
      :class="{ 'is-active': isActive(item.path) }"
    >
      {{ item.label }}
    </RouterLink>
    <button class="sidebar-link danger" type="button">회원 탈퇴</button>
  </aside>
</template>

<style scoped>
.studio-sidebar {
  border: 1px solid var(--border-color);
  border-radius: 14px;
  background: #191b1f;
  padding: 10px;
  display: grid;
  gap: 8px;
  position: sticky;
  top: 88px;
}

.sidebar-link {
  border: 1px solid var(--border-color);
  border-radius: 10px;
  background: #141518;
  color: var(--text-primary);
  text-decoration: none;
  font-size: 14px;
  font-weight: 600;
  padding: 11px 12px;
  text-align: left;
  cursor: pointer;
}

.sidebar-link.is-active {
  background: rgba(250, 85, 0, 0.14);
  border-color: rgba(250, 85, 0, 0.45);
  color: #ffb085;
}

.sidebar-link.danger {
  color: #ff9c9c;
  border-color: rgba(255, 120, 120, 0.4);
}
</style>
