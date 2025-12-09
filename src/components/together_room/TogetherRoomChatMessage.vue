<script setup>
import { computed } from 'vue'

const props = defineProps(['message', 'userIdx'])

const isWriter = computed(() => props.message.userIdx === props.userIdx)
</script>

<template>
  <div
    class="message"
    :class="{'my-message': isWriter, 'other-message': !isWriter}"
    v-if="!props.message.isJoin"
  >
    <div class="message-header">
      <div
        class="message-author"
        :class="{'my-author': isWriter, 'other-author': !isWriter}"
      >
        {{ props.message.name }}
      </div>
      <div class="message-time">{{ props.message.now }}</div>
    </div>
    <div class="message-content">{{ props.message.message }}</div>
  </div>

  <div class="system-message" v-if="props.message.isJoin">{{props.message.name}}님이 방에 입장했습니다.</div>
</template>

<style scoped>
@import url(@/assets/together_room/TogetherRoomChatMessage.css);


/* 상대 메시지(기본 왼쪽 정렬) */
.other-message {
  align-items: flex-start;
}

/* 내 메시지: 오른쪽 정렬 */
.my-message {
  align-items: flex-end;
}

/* 이름 색상 설정 */
.other-author {
  color: orange;
  font-weight: bold;
}

.my-author {
  color: #4FC3F7; /* 본인 메시지 이름에 파란 계열 색상 예시 */
  font-weight: bold;
}

</style>