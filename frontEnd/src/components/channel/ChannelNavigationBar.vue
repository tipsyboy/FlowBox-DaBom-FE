<script setup lang="ts">
</script>

<template>
  <nav class="channel-nav">
    <RouterLink to="videos" class="nav-item" active-class="active">동영상</RouterLink>
    <RouterLink to="playlists" class="nav-item" active-class="active">재생목록</RouterLink>
    <RouterLink to="community" class="nav-item" active-class="active">커뮤니티</RouterLink>
    <RouterLink to="about" class="nav-item" active-class="active">정보</RouterLink>
  </nav>
</template>

<style scoped>
.channel-nav {
  display: flex;
  justify-content: center;
  gap: 2rem;
  padding: 1rem 2rem;
  border-bottom: 1px solid var(--border-color);
}

.nav-item {
  color: var(--text-secondary);
  text-decoration: none;
  padding: 0.5rem 0;
  border-bottom: 2px solid transparent;
}

.nav-item:hover {
  color: var(--text-primary);
}

.nav-item.active {
  color: var(--primary-color);
  border-bottom-color: var(--primary-color);
}
</style>
