<script setup>
import { reactive, watch, ref, computed, onMounted, onUnmounted } from 'vue';
import {useRoute, useRouter} from 'vue-router'
import useMemberStore from '@/stores/useMemberStore';
import api from '@/api/auth'
import SearchBarComp from "@/components/search/SearchBarComp.vue";

const route = useRoute()
const memberStore = useMemberStore();
const currentUserIdx = ref(null);
const profileWrapperRef = ref(null);
const router = useRouter();


const state = reactive({
  isDropdownOpen: false
})

// 사용자 정보 조회
const toMyChannel = async () => {
  const channelName = memberStore.getChannelNameWithEncrypt()
  await toggleDropdown()
  await router.push(`/channel/${channelName}`)
}

const logoutMember = async () => {
  const data = await api.logout()
  memberStore.removeWithEncrypt()
  currentUserIdx.value = null; // 로그아웃 시 초기화
  await toggleDropdown()
  window.location.href = '/'
}

const toDM = async () => {
  await router.push(`/message`)
  await toggleDropdown()
}

const toggleDropdown = async () => {
  state.isDropdownOpen = !state.isDropdownOpen;
}

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
          <RouterLink :to="{ name: 'togetherMain' }" class="nav-item">투게더</RouterLink>
        </nav>
      </div>
    </div>
    <SearchBarComp/>
    <div class="header-right">
      <div v-if="!memberStore.checkLogin()" class="login-menu">
        <RouterLink :to="{ name: 'login' }" class="login-item">로그인</RouterLink>
        <RouterLink :to="{ name: 'signup' }" class="login-item">회원가입</RouterLink>
      </div>

      <div v-else class="nav-right">
        <div class="profile-wrapper" ref="profileWrapperRef">
          <div class="profile-trigger" @click="toggleDropdown">
            <img src="@/assets/images/dabom2.png" alt="프로필" class="profile-img" />
          </div>
          <div class="profile-dropdown" v-if="state.isDropdownOpen">
            <a @click="toMyChannel" class="dropdown-item" href="#" @click.prevent>내 채널</a>
            <a @click="toDM" class="dropdown-item" href="/message" @click.prevent>DM</a>
            <a href="#" class="dropdown-item" @click="logoutMember">로그아웃</a>
          </div>
        </div>
      </div>
    </div>

  </header>
</template>

<style scoped>
/* 헤더 메인 */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 1rem;
  background-color: var(--background-color);
}

/* 헤더 좌측 */
.header-left {
  display: flex;
  align-items: center;
  gap: 2.5rem;
}

/* 헤더 좌측 - 로고 */
.logo-image {
  width: 6.123rem;
  height: 4.213rem;
  margin-top: 0.7rem;
}

.logo-image:hover,
.logo-image.active {
  cursor: pointer;
}


/* 헤더 좌측 - 좌측 네비게이션 */
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
.nav-item.active {
  color: var(--text-primary);
  background-color: var(--hover-color);
}


/* 헤더 우측 */
.header-right {
  margin-right: 1rem;
}

/* 헤더 우측 - 로그인 X */
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
.login-item.active {
  color: var(--text-primary);
  background-color: var(--hover-color);
}

/* 헤더 우측 - 로그인 O*/
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

/* 다크 모드 드롭다운 */
.profile-dropdown {
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  background-color: var(--card-bg);
  /* 카드 스타일 */
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

/* 드롭다운 표시 조건 */
/* .nav-right:hover .profile-wrapper .profile-dropdown {
  display: block;
} */
</style>
