<script setup>
defineProps({
  loginHref: { type: String, default: '/login' },
  signupHref: { type: String, default: '/signup' },
  loginText: { type: String, default: '로그인' },
  signupText: { type: String, default: '회원가입' },
});
</script>

<template>
  <div class="g-auth-buttons">
    <a :href="loginHref">{{ loginText }}</a>
    <a :href="signupHref">{{ signupText }}</a>
  </div>
</template>
