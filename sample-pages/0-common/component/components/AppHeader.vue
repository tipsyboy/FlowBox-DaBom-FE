<script setup>
import { ref } from 'vue'
import SearchBar from './SearchBar.vue'
import AuthButtons from './AuthButtons.vue'

const props = defineProps({
  logoSrc: {
    type: String,
    required: true,
  },
  navItems: {
    type: Array,
    default: () => [
      { label: '홈', active: true },
      { label: '투게더', active: false },
    ],
  },
})

const emit = defineEmits(['search', 'login', 'signup'])
const keyword = ref('')

const onSearch = (value) => emit('search', value)
</script>

<template>
  <header class="topbar">
    <div class="topbar-inner">
      <div class="top-left">
        <div class="brand">
          <img :src="logoSrc" alt="DaBom logo" />
        </div>
        <nav class="top-nav">
          <a
            v-for="item in navItems"
            :key="item.label"
            href="#"
            :class="{ active: item.active }"
            @click.prevent
          >
            {{ item.label }}
          </a>
        </nav>
      </div>

      <div class="top-center">
        <SearchBar v-model="keyword" @search="onSearch" />
      </div>

      <AuthButtons @login="emit('login')" @signup="emit('signup')" />
    </div>
  </header>
</template>

<style scoped>
@import '../styles/design-tokens.css';

.topbar {
  position: sticky;
  top: 0;
  z-index: 20;
  background: #232323;
  border-bottom: 1px solid var(--border-color);
}

.topbar-inner {
  max-width: 1400px;
  margin: 0 auto;
  padding: 12px 16px;
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 22px;
}

.top-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.brand img {
  width: 96px;
  height: auto;
  display: block;
}

.top-nav {
  display: flex;
  gap: 8px;
}

.top-nav a {
  color: var(--text-secondary);
  text-decoration: none;
  padding: 6px 12px;
  border-radius: 20px;
  transition: var(--transition);
}

.top-nav a:hover,
.top-nav a.active {
  color: var(--text-primary);
  background-color: var(--hover-color);
}

.top-center {
  display: flex;
  justify-content: center;
}

@media (max-width: 1080px) {
  .topbar-inner {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .top-left {
    justify-content: center;
  }

  .top-center {
    width: 100%;
  }
}
</style>

