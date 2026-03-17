<script setup>
import BannerComp from '@/components/home/BannerComp.vue';
import SidebarContainer from '@/components/app/SidebarContainer.vue';
import VideoSectionComp from '@/components/video/list/VideoSectionComp.vue';
import ButtonBasic from '@/components/ui/ButtonBasic.vue';
import { onMounted, onUnmounted, reactive, watch, computed } from 'vue';
import { useRoute } from 'vue-router';
import api from '@/api/video/index.js'

const route = useRoute();

const state = reactive({
  popularVideos: [],
  currentPage: 0,
  size: 10,
  loading: false,
  hasNext: true,
  error: null,
  currentKeyword: ''
})

const searchKeyword = computed(() => route.query.keyword || '');

const sectionTitle = computed(() => {
  return searchKeyword.value ? `"${searchKeyword.value}" 검색결과` : '인기영상';
});

const sectionIcon = computed(() => {
  return searchKeyword.value ? 'fas fa-search' : 'fas fa-fire';
});

const getVideoList = async (page = 0, append = false, keyword = '') => {
  if (state.loading) return;

  try {
    state.loading = true;
    state.error = null;

    const result = await api.getVideoList(page, state.size, keyword);

    if (append) {
      // 무한 스크롤로 추가 데이터 로드
      state.popularVideos = [...state.popularVideos, ...result.content];
    } else {
      // 초기 데이터 로드 또는 새로운 검색
      state.popularVideos = result.content;
    }

    state.hasNext = result.hasNext;
    state.currentPage = page;
    state.currentKeyword = keyword;

    // 검색 결과가 없을 때 메시지 설정
    if (result.content.length === 0 && keyword) {
      state.error = `"${keyword}"에 대한 검색 결과가 없습니다.`;
    }

  } catch (error) {
    state.error = '비디오를 불러오는데 실패했습니다.';
  } finally {
    state.loading = false;
  }
}

const loadMoreVideos = async () => {
  if (state.loading || !state.hasNext) return;

  const nextPage = state.currentPage + 1;
  await getVideoList(nextPage, true, state.currentKeyword);
}

// 새로운 검색 실행
const performNewSearch = async (keyword) => {
  // 현재 상태 초기화
  state.popularVideos = [];
  state.currentPage = 0;
  state.hasNext = true;
  state.error = null;

  await getVideoList(0, false, keyword);
}

// 스크롤 이벤트 핸들러
const handleScroll = () => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const windowHeight = window.innerHeight;
  const documentHeight = document.documentElement.scrollHeight;

  // 페이지 하단에서 200px 전에 미리 로드
  const threshold = 200;
  const shouldLoadMore = scrollTop + windowHeight >= documentHeight - threshold;

  if (shouldLoadMore && state.hasNext && !state.loading) {
    loadMoreVideos();
  }
}

// 스크롤 이벤트 스로틀링 (성능 최적화)
let scrollTimer = null;
const throttledScroll = () => {
  if (scrollTimer) return;

  scrollTimer = setTimeout(() => {
    handleScroll();
    scrollTimer = null;
  }, 100); // 100ms마다 실행
}

// 검색어 변경 감지
watch(
    () => route.query.keyword,
    (newKeyword, oldKeyword) => {
      const keyword = newKeyword || '';

      // 검색어가 실제로 변경된 경우에만 검색 실행
      if (keyword !== state.currentKeyword) {
        performNewSearch(keyword);
      }
    },
    { immediate: false } // immediate를 false로 설정하여 초기 마운트 시에는 실행하지 않음
);

onMounted(async () => {
  // 초기 데이터 로드 (현재 URL의 검색어 사용)
  const initialKeyword = searchKeyword.value;
  await getVideoList(0, false, initialKeyword);
  console.log(state.popularVideos)
  // 스크롤 이벤트 리스너 등록
  window.addEventListener('scroll', throttledScroll, { passive: true });
})

onUnmounted(() => {
  // 스크롤 이벤트 리스너 제거
  window.removeEventListener('scroll', throttledScroll);

  // 타이머 정리
  if (scrollTimer) {
    clearTimeout(scrollTimer);
  }
})
</script>

<template>
  <div class="main-view">
    <BannerComp />

    <div class="main-content">
      <SidebarContainer />

      <div class="video-content">
      <VideoSectionComp
          :title="sectionTitle"
          :icon="sectionIcon"
          :videos="state.popularVideos"
      />

      <!-- 로딩 인디케이터 -->
      <div v-if="state.loading && state.popularVideos.length > 0" class="loading-container">
        <div class="loading-spinner">
          <i class="fas fa-spinner fa-spin"></i>
          <span>추가 영상을 불러오는 중...</span>
        </div>
      </div>

      <!-- 초기 로딩 -->
      <div v-if="state.loading && state.popularVideos.length === 0" class="loading-container">
        <div class="loading-spinner">
          <i class="fas fa-spinner fa-spin"></i>
          <span>영상을 불러오는 중...</span>
        </div>
      </div>

      <!-- 에러 메시지 또는 검색 결과 없음 -->
      <div v-if="state.error && !state.loading" class="error-container">
        <div class="error-message">
          <i class="fas fa-exclamation-triangle" v-if="!searchKeyword"></i>
          <i class="fas fa-search" v-else></i>
          <span>{{ state.error }}</span>
          <ButtonBasic
            v-if="!searchKeyword"
            @click="performNewSearch(state.currentKeyword)"
            class="retry-btn"
            variant="primary"
          >
            다시 시도
          </ButtonBasic>
        </div>
      </div>

      <!-- 더 이상 불러올 데이터가 없을 때 -->
      <div v-if="!state.hasNext && state.popularVideos.length > 0" class="end-message">
        <span>모든 영상을 불러왔습니다</span>
      </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.main-view {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 12px;
}

.main-content {
  display: flex;
  margin-top: 0.2rem;
  gap: 1rem;
}

.video-content {
  flex: 1;
  min-width: 0;
  padding: 1rem 0.6rem 1rem 0.2rem;
}

/* 로딩 인디케이터 */
.loading-container {
  display: flex;
  justify-content: center;
  padding: 2rem 0;
  margin-top: 2rem;
}

.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-secondary);
}

.loading-spinner i {
  font-size: 1.5rem;
  color: var(--primary-color);
}

.loading-spinner span {
  font-size: 0.9rem;
}

/* 에러 메시지 */
.error-container {
  display: flex;
  justify-content: center;
  padding: 2rem 0;
  margin-top: 2rem;
}

.error-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  color: var(--text-secondary);
  text-align: center;
}

.error-message i {
  font-size: 1.5rem;
}

.error-message i.fa-exclamation-triangle {
  color: #e74c3c;
}

.error-message i.fa-search {
  color: var(--text-secondary);
}

.retry-btn {
  padding: 0.5rem 1rem;
  background-color: #3a3a3a;
  color: #fff;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: var(--transition);
}

.retry-btn:hover {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
}

/* 끝 메시지 */
.end-message {
  display: flex;
  justify-content: center;
  padding: 2rem 0;
  margin-top: 2rem;
  color: var(--text-secondary);
  font-size: 0.9rem;
  border-top: 1px solid var(--border-color);
}

/* 반응형 */
@media (max-width: 768px) {
  .main-view {
    padding: 0 8px;
  }

  .main-content {
    flex-direction: column;
  }

  .video-content {
    padding: 0.4rem;
  }
}
</style>
