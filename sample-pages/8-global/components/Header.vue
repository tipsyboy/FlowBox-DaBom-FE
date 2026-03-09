<script setup>
import SearchBar from './SearchBar.vue';
import AuthButtons from './AuthButtons.vue';

const props = defineProps({
  logoSrc: { type: String, default: '/src/assets/images/dabom2.png' },
  logoHref: { type: String, default: '/' },
  loginHref: { type: String, default: '/login' },
  signupHref: { type: String, default: '/signup' },
  searchPlaceholder: { type: String, default: '검색어를 입력하세요' },
});

const emit = defineEmits(['search']);
</script>

<template>
  <header class="g-topbar">
    <div class="g-topbar__inner">
      <a class="g-brand" :href="logoHref">
        <img :src="logoSrc" alt="logo" />
      </a>

      <SearchBar :placeholder="searchPlaceholder" @search="(value) => emit('search', value)" />

      <AuthButtons :login-href="loginHref" :signup-href="signupHref" />
    </div>
  </header>
</template>
