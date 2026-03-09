<script setup>
const emit = defineEmits(['login', 'signup'])
</script>

<template>
  <div class="top-right">
    <a href="#" class="auth-btn" @click.prevent="emit('login')">로그인</a>
    <a href="#" class="auth-btn" @click.prevent="emit('signup')">회원가입</a>
  </div>
</template>

<style scoped>
@import '../styles/design-tokens.css';

.top-right {
  display: flex;
  align-items: center;
  gap: 10px;
}

.auth-btn {
  color: var(--text-secondary);
  text-decoration: none;
  font-weight: 500;
  padding: 8px 14px;
  border-radius: 20px;
  transition: var(--transition);
}

.auth-btn:hover {
  color: var(--text-primary);
  background-color: var(--hover-color);
}
</style>

