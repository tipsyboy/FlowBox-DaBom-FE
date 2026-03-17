<script setup>
import { reactive, ref, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import useMemberStore from '@/stores/useMemberStore.js';
import api from '@/api/auth/index.js';
import SearchBar from '@/components/app/SearchBar.vue';

const memberStore = useMemberStore();
const router = useRouter();
const route = useRoute();
const profileWrapperRef = ref(null);
const searchKeyword = ref(route.query.keyword || '');

const state = reactive({
  isDropdownOpen: false,
});

const toggleDropdown = () => {
  state.isDropdownOpen = !state.isDropdownOpen;
};

const toMyChannel = async () => {
  const channelName = memberStore.getChannelNameWithEncrypt();
  state.isDropdownOpen = false;
  await router.push(`/channel/${channelName}`);
};

const toDM = async () => {
  state.isDropdownOpen = false;
  await router.push('/message');
};

const toMyChannelStudio = async () => {
  state.isDropdownOpen = false;
  await router.push('/mychannel');
};

const logoutMember = async () => {
  await api.logout();
  memberStore.removeWithEncrypt();
  state.isDropdownOpen = false;
  window.location.href = '/';
};

const handleSearch = async (keyword) => {
  const trimmedKeyword = keyword.trim();
  await router.push({
    name: 'main',
    query: {
      keyword: trimmedKeyword || undefined
    }
  });
};

const onClickOutside = (event) => {
  if (!profileWrapperRef.value) return;
  if (!profileWrapperRef.value.contains(event.target)) {
    state.isDropdownOpen = false;
  }
};

onMounted(() => {
  document.addEventListener('click', onClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', onClickOutside);
});
</script>

<template>
  <header class="header">
    <div class="header-left">
      <div class="header-logo">
        <a href="/">
          <img src="@/assets/images/dabom2.png" alt="Dabom Logo" class="logo-image" />
        </a>
      </div>
      <div class="nav-left">
        <nav class="nav-menu">
          <RouterLink :to="{ name: 'main' }" class="nav-item">홈</RouterLink>
          <RouterLink to="/together" class="nav-item">투게더</RouterLink>
        </nav>
      </div>
    </div>

    <SearchBar
      v-model="searchKeyword"
      placeholder="검색어를 입력해주세요..."
      button-text="검색"
      @search="handleSearch"
    />

    <div class="header-right">
      <div v-if="!memberStore.checkLogin()" class="login-menu">
        <RouterLink :to="{ name: 'login' }" class="login-item">로그인</RouterLink>
        <RouterLink :to="{ name: 'signup' }" class="login-item">회원가입</RouterLink>
      </div>

      <div v-else class="nav-right">
        <div class="profile-wrapper" ref="profileWrapperRef">
          <div class="profile-trigger" @click.stop="toggleDropdown">
            <img src="@/assets/images/dabom2.png" alt="프로필" class="profile-img" />
          </div>
          <div class="profile-dropdown" v-if="state.isDropdownOpen">
            <a @click.prevent="toMyChannel" class="dropdown-item" href="#">내 채널</a>
            <a @click.prevent="toMyChannelStudio" class="dropdown-item" href="#">채널 관리</a>
            <a @click.prevent="toDM" class="dropdown-item" href="#">DM</a>
            <a href="#" class="dropdown-item" @click.prevent="logoutMember">로그아웃</a>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 1rem;
  background-color: var(--background-color);
  border-bottom: 1px solid var(--border-color);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 2.5rem;
}

.logo-image {
  width: 6.123rem;
  height: 4.213rem;
  margin-top: 0.7rem;
}

.logo-image:hover,
.logo-image.active {
  cursor: pointer;
}

.nav-left {
  padding: 0.5rem 1rem;
}

.nav-menu {
  display: flex;
  gap: 1.5rem;
}

.nav-item {
  color: var(--text-secondary);
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  transition: var(--transition);
  position: relative;
}

.nav-item:hover,
.nav-item.router-link-active {
  color: var(--text-primary);
  background-color: var(--hover-color);
}

.header-right {
  margin-right: 1rem;
}

.login-menu {
  display: flex;
  gap: 1rem;
}

.login-item {
  color: var(--text-secondary);
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  transition: var(--transition);
  position: relative;
}

.login-item:hover,
.login-item.router-link-active {
  color: var(--text-primary);
  background-color: var(--hover-color);
}

.nav-right {
  display: flex;
  align-items: center;
  position: relative;
}

.profile-wrapper {
  position: relative;
}

.profile-trigger {
  cursor: pointer;
}

.profile-img {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid var(--border-color);
}

.profile-dropdown {
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  background-color: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  min-width: 160px;
  z-index: 1000;
  padding: 0.3rem 0;
}

.dropdown-item {
  display: block;
  padding: 0.75rem 1rem;
  color: var(--text-secondary);
  text-decoration: none;
  font-weight: 500;
  transition: var(--transition);
}

.dropdown-item:hover {
  background-color: var(--hover-color);
  color: var(--text-primary);
}
</style>
