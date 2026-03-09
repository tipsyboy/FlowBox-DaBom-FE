<script setup>
import { ref } from 'vue'
import AppHeader from './components/AppHeader.vue'
import BannerImage from './components/BannerImage.vue'
import SidebarSection from './components/SidebarSection.vue'
import SectionHeader from './components/SectionHeader.vue'
import VideoCard from './components/VideoCard.vue'
import PlaylistRow from './components/PlaylistRow.vue'
import PostItem from './components/PostItem.vue'
import EmptyState from './components/EmptyState.vue'
import LoadingState from './components/LoadingState.vue'

const keyword = ref('')

const homeItems = [
  { label: '홈', active: true, iconText: '●' },
  { label: '재생목록', active: false, iconText: '●' },
  { label: 'Together', active: false, iconText: '●' },
]

const subscribeItems = [
  { label: 'FlowBox Studio', imageSrc: '/src/assets/images/dabom2.png' },
  { label: 'Dabom Clips', imageSrc: '/src/assets/images/dabom2.png' },
  { label: 'Together Live', imageSrc: '/src/assets/images/dabom2.png' },
]

const videos = [
  {
    thumbnailSrc: '/src/assets/images/banner.png',
    channelImageSrc: '/src/assets/images/dabom2.png',
    duration: '14:10',
    title: 'Vue 프로젝트 구조 리팩토링',
    channelName: 'FlowBox Studio',
    rating: '평점 4.2',
    views: '조회수 12K',
    uploadedAt: '2일 전',
  },
  {
    thumbnailSrc: '/src/assets/images/banner.png',
    channelImageSrc: '/src/assets/images/dabom2.png',
    duration: '09:34',
    title: 'Pinia 상태 관리 정리 패턴',
    channelName: 'Dabom Dev',
    rating: '평점 4.6',
    views: '조회수 8.1K',
    uploadedAt: '5일 전',
  },
]
</script>

<template>
  <div class="page">
    <AppHeader
      logo-src="/src/assets/images/dabom2.png"
      @search="(value) => (keyword = value)"
      @login="() => {}"
      @signup="() => {}"
    />
    <BannerImage src="/src/assets/images/banner.png" alt="DaBom banner" />

    <div class="main-content">
      <aside class="sidebar">
        <SidebarSection title="홈" :items="homeItems" />
        <SidebarSection title="구독" :items="subscribeItems" />
      </aside>

      <main class="content">
        <section class="panel">
          <SectionHeader title="인기영상" link-label="전체보기" />
          <div class="video-grid">
            <VideoCard v-for="(video, index) in videos" :key="index" :video="video" />
          </div>
        </section>

        <section class="panel">
          <SectionHeader title="플레이리스트 관리" />
          <PlaylistRow title="UI 리팩토링 모음" :video-count="8" />
        </section>

        <section class="panel split">
          <PostItem title="컴포넌트 분리 순서 의견 받습니다" meta="댓글 14 · 좋아요 21" />
          <div class="state-row">
            <EmptyState />
            <LoadingState />
          </div>
        </section>
      </main>
    </div>
  </div>
</template>

<style scoped>
@import './styles/design-tokens.css';

.page {
  background: var(--background-color);
  min-height: 100vh;
}

.main-content {
  display: flex;
  gap: 1rem;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 12px 2rem;
}

.sidebar {
  width: 17rem;
  background: var(--background-color);
  height: fit-content;
  position: sticky;
  top: 90px;
  padding: 0.7rem 0;
}

.content {
  flex: 1;
  display: grid;
  gap: 1rem;
}

.panel {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: 1rem;
}

.video-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));
  gap: 1rem;
}

.split {
  display: grid;
  gap: 1rem;
}

.state-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.7rem;
}

@media (max-width: 1080px) {
  .main-content {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    position: static;
  }

  .state-row {
    grid-template-columns: 1fr;
  }
}
</style>

