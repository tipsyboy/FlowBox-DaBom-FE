<script setup>
import { ref, watch, computed, onMounted } from 'vue';
import api from '@/api/score';
import useMemberStore from '@/stores/useMemberStore';
import Modal from '@/components/main/Modal.vue'

const memberStore = useMemberStore();

const showLoginModal = ref(false);
const showLoginModal2 = ref(false);

const props = defineProps({
  modelValue: { type: Number, default: 0 },
  maxStars: { type: Number, default: 5 },
  editable: { type: Boolean, default: true },
  starSize: { type: String, default: '24px' },
  color: { type: String, default: '#FFD700' },
  emptyColor: { type: String, default: '#ccc' },
  videoInfo: { type: Object, default: null },
  channelInfo: { type: Object, default: null },
});

const emit = defineEmits(['update:modelValue']);

const currentRating = ref(props.modelValue);
const userRatedScore = ref(0);
const userScoreIdx = ref(null);
const hoverRating = ref(0);
const selectedRating = ref(0);
const isDragging = ref(false);

// ✅ 전역으로 scoreData 선언 (submitRating, getData에서 공유)
const scoreData = ref({
  score: 0,
  Member: '',
  channel: null,
  videoIdx: null,
  ScoreType: ''
});

const scoreTarget = computed(() => {
  if (props.videoInfo && props.videoInfo.idx) {
    return { type: 'VIDEO', info: props.videoInfo, idx: props.videoInfo.idx };
  } else if (props.channelInfo && props.channelInfo.idx) {
    return { type: 'CHANNEL', info: props.channelInfo, idx: props.channelInfo.idx };
  }
  return null;
});

watch(() => props.modelValue, (newValue) => {
  currentRating.value = newValue;
});

watch(scoreTarget, async (newTarget) => {
  if (newTarget && newTarget.idx) {
    try {
      // 항상 전체 평균 점수만 가져오도록 로직을 단순화합니다.
      const avgScore = await api.getAverageScore(newTarget.type, newTarget.idx);
      currentRating.value = avgScore;
    } catch (error) {
      console.error('평균 점수 로딩 실패:', error);
      currentRating.value = 0; // 에러 발생 시 0으로 초기화
    }
  } else {
    // 대상이 없으면 평점을 0으로 리셋합니다.
    currentRating.value = 0;
  }
  emit('update:modelValue', currentRating.value);
}, { immediate: true });

const stars = computed(() => {
  let displayRating;
  if (selectedRating.value > 0) {
    displayRating = selectedRating.value;
  } else if (hoverRating.value > 0) {
    displayRating = hoverRating.value;
  } else {
    displayRating = currentRating.value;
  }

  return Array.from({ length: props.maxStars }, (_, i) => ({
    filled: i + 1 <= displayRating,
    hovered: i + 1 <= hoverRating.value && hoverRating.value > 0 && selectedRating.value === 0,
    selected: i + 1 <= selectedRating.value && selectedRating.value > 0,
  }));
});

const getStarColor = (star) => {
  if (star.selected) return props.color;
  if (star.hovered && selectedRating.value === 0) return props.color;
  if (star.filled) return props.color;
  return props.emptyColor;
};

const startDrag = (event) => {
  if (!props.editable) return;
  isDragging.value = true;
  onMouseMove(event);
};

const onMouseMove = (event) => {
  if (!props.editable || !isDragging.value) return;
  const rect = event.currentTarget.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const starWidth = rect.width / props.maxStars;
  const newRating = Math.ceil(x / starWidth);
  if (selectedRating.value === 0) {
    hoverRating.value = Math.min(Math.max(0, newRating), props.maxStars);
  }
};

const endDrag = () => {
  if (!props.editable) return;
  isDragging.value = false;
  if (selectedRating.value === 0) hoverRating.value = 0;
};

const setRating = (rating) => {
  if (!props.editable) return;
  selectedRating.value = rating;
  hoverRating.value = 0;
};

const resetHover = () => {
  if (!props.editable || isDragging.value || selectedRating.value > 0) return;
  hoverRating.value = 0;
};

const submitRating = async () => {
  console.log(selectedRating.value);
  console.log(props.channelInfo);
  console.log(props.videoInfo.idx);
  console.log('scoreTarget', scoreTarget.value.type);

  // ✅ 수정된 부분: scoreTarget을 활용하여 정확한 idx만 할당
  const isVideo = scoreTarget.value.type === 'VIDEO';
  const isChannel = scoreTarget.value.type === 'CHANNEL';


  const ratingToSubmit = selectedRating.value;
  if (!props.editable || ratingToSubmit === 0) return;

  if (!memberStore.checkLogin()) {
    showLoginModal.value = true;
    return;
  }
  scoreData.value = {
    score: ratingToSubmit,

    videoIdx: isVideo ? scoreTarget.value.idx : null,
    channelIdx: isChannel ? scoreTarget.value.idx : null,
    scoreType: scoreTarget.value.type

  };


  try {
    await api.saveOrUpdateVideoScore(scoreData.value);
     showLoginModal2.value = true;
    const updatedAvgScore = await api.getAverageScore(scoreTarget.value.type, scoreTarget.value.idx);
    currentRating.value = updatedAvgScore;
    emit('update:modelValue', currentRating.value);

    selectedRating.value = 0;
    hoverRating.value = 0;

  } catch (error) {
    console.error('평점 처리 실패:', error);
    alert(error.message || '알 수 없는 오류가 발생했습니다.');
  }
};

const cancelRating = () => {
  selectedRating.value = 0;
  hoverRating.value = 0;
};

</script>

<template>
  <div
    class="star-rating-container star-rating-interactive"
    @mousedown="startDrag"
    @mousemove="onMouseMove"
    @mouseup="endDrag"
    @mouseleave="resetHover"
  >
    <i
      v-for="(star, index) in stars"
      :key="index"
      class="fas fa-star"
      :class="{ 'selected': star.selected }"
      :style="{ color: getStarColor(star), fontSize: '1.5rem', cursor: editable ? 'pointer' : 'default' }"
      @click="setRating(index + 1)"
      @mouseover="editable && selectedRating === 0 && (hoverRating = index + 1)"
      @mouseleave="editable && selectedRating === 0 && (hoverRating = 0)"
    ></i>

    <!-- 평점이 선택되었을 때만 버튼 표시 -->
    <div v-if="editable && selectedRating > 0" style="margin-left: 10px; display: flex; gap: 5px;">
      <button @click="submitRating()" class="submit-btn">
        평점 매기기
      </button>
      <button @click="cancelRating()" class="cancel-btn">
        취소
      </button>
    </div>
  </div>

  <!-- Login Required Modal -->
  <Modal
    v-if="showLoginModal"
    title="로그인이 필요합니다."
    message="평점을 매기려면 로그인해주세요."
    @confirm="showLoginModal = false"
  />

  <Modal
    v-if="showLoginModal2"
    title="평가 등록 완료."
    message="영상 평가가 성공적으로 등록 되었습니다."
    @confirm="showLoginModal2 = false"
  />
</template>

<style scoped>
.star-rating-container {
  display: inline-flex;
  align-items: center;
  user-select: none; /* 드래그 시 텍스트 선택 방지 */
  gap: 0.125rem; /* main.css의 .star-rating과 유사하게 별 간격 추가 */
}

.star-rating-container i {
  transition: color 0.2s ease;
  color: var(--empty-color); /* 기본 빈 별 색상 */
}

/* 채워진 별 색상은 컴포넌트 props.color로 제어 */

button { /* 평점 매기기 버튼 스타일 */
  background-color: var(--primary-color); /* main.css의 primary-color 사용 */
  color: white;
  border: none;
  padding: 0.5rem 1rem; /* 적절한 패딩 */
  border-radius: 5px; /* 둥근 모서리 */
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease; /* main.css의 transition 변수 사용 */
  margin-left: 10px;
  font-size: 0.875rem; /* 폰트 크기 조정 */
}

button:hover {
  background-color: #ff3838; /* hover 색상 */
  transform: translateY(-1px); /* 살짝 위로 이동 효과 */
}
</style>
