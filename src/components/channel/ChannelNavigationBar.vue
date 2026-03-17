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
  max-width: 1400px;
  margin: 18px auto 0;
  padding: 0 16px;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  gap: 18px;
}

.nav-item {
  text-decoration: none;
  color: var(--text-secondary);
  padding: 14px 2px;
  border-bottom: 2px solid transparent;
}

.nav-item:hover {
  color: var(--text-primary);
}

.nav-item.active,
.nav-item.router-link-active {
  color: var(--primary-color);
  border-bottom-color: var(--primary-color);
}
</style>
