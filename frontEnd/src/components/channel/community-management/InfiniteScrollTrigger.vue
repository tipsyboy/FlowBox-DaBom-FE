<script setup>
import { ref, onMounted, onUnmounted, watch  } from 'vue'

const props = defineProps({
  hasNext: {
    type: Boolean,
    default: true
  },
  isLoading: {
    type: Boolean,
    default: false
  },
  showEndMessage: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['load-more'])

const observerTarget = ref(null)
let observer = null

// Intersection Observer 콜백
const handleIntersection = (entries) => {
  const [entry] = entries
  if (entry.isIntersecting && props.hasNext && !props.isLoading) {
    console.log('Intersection 감지: 다음 페이지 로드')
    emit('load-more')
  }
}

// Observer 설정
const setupObserver = () => {
  if (observer) observer.disconnect()
  
  if (observerTarget.value && props.hasNext) {
    observer = new IntersectionObserver(handleIntersection, {
      threshold: 0.1,
      rootMargin: '100px'
    })
    observer.observe(observerTarget.value)
    console.log('Infinite Scroll Observer 설정 완료')
  }
}

// hasNext가 변경될 때 Observer 재설정
watch(() => props.hasNext, () => {
  setTimeout(setupObserver, 100)
})

onMounted(() => {
  setTimeout(setupObserver, 500)
})

onUnmounted(() => {
  if (observer) {
    observer.disconnect()
  }
})

// 외부에서 Observer 재설정 필요할 때 사용
defineExpose({
  setupObserver
})
</script>
<template>
  <div>
    <!-- 무한 스크롤 트리거 -->
    <div 
      v-if="hasNext" 
      ref="observerTarget" 
      class="loading-trigger"
    >
      <div v-if="isLoading" class="loading-more">
        <i class="fas fa-spinner fa-spin"></i>
        게시글을 더 불러오는 중...
      </div>
    </div>
    
    <!-- 모든 게시글 로드 완료 -->
    <div v-if="!hasNext && showEndMessage" class="posts-end">
      모든 게시글을 불러왔습니다.
    </div>
  </div>
</template>



<style scoped>
.loading-trigger {
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.loading-more {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #888;
  font-size: 0.875rem;
}

.loading-more i {
  color: #3b82f6;
}

.posts-end {
  text-align: center;
  color: #666;
  font-size: 0.875rem;
  padding: 1.5rem;
  border-top: 1px solid #444;
  margin-top: 1rem;
  font-style: italic;
}
</style>