<template>
  <button class="setting-btn" type="button" title="설정">
    <i class="fas fa-cog"></i>
  </button>
</template>

<style scoped>
.setting-btn {
  width: 48px;
  height: 48px;
  border: none;
  border-radius: 999px;
  background: transparent;
  color: var(--text-secondary);
  cursor: pointer;
  font-size: 18px;
}

.setting-btn:hover {
  background: var(--hover-color);
  color: var(--text-primary);
}
</style>
