<script setup>
import { computed } from 'vue'

const props = defineProps({
  message: Object,
  userIdx: [String, Number],
})

const isWriter = computed(() => String(props.message?.userIdx) === String(props.userIdx))
</script>

<template>
  <div v-if="!props.message?.isJoin" class="message" :class="{ 'my-message': isWriter, 'other-message': !isWriter }">
    <div class="message-meta">
      <div class="message-author" :class="{ 'my-author': isWriter, 'other-author': !isWriter }">
        {{ props.message?.name || props.message?.userId || `user-${props.message?.userIdx ?? ''}` }}
      </div>
      <div class="message-time">{{ props.message?.now }}</div>
    </div>
    <div class="message-content">{{ props.message?.message }}</div>
  </div>

  <div v-else class="system-message">{{ props.message?.name }}님이 방에 입장했습니다.</div>
</template>

<style scoped>
.message {
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-bottom: 12px;
}

.my-message {
  align-items: flex-end;
}

.other-message {
  align-items: flex-start;
}

.message-meta {
  display: flex;
  gap: 8px;
  align-items: center;
  font-size: 11px;
  padding: 0 3px;
}

.message-author {
  font-weight: 700;
}

.my-author {
  color: #ffae78;
}

.other-author {
  color: #9dc0ff;
}

.message-time {
  color: var(--text-secondary);
}

.message-content {
  max-width: 82%;
  padding: 9px 11px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.05);
  line-height: 1.4;
  font-size: 13px;
  word-break: break-word;
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.14);
}

.my-message .message-content {
  border-color: rgba(250, 85, 0, 0.22);
  background: linear-gradient(135deg, rgba(250, 85, 0, 0.22), rgba(250, 85, 0, 0.08));
  border-bottom-right-radius: 6px;
}

.other-message .message-content {
  border-bottom-left-radius: 6px;
}

.system-message {
  width: fit-content;
  margin: 14px auto;
  padding: 8px 12px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.05);
  color: var(--text-secondary);
  font-size: 12px;
  text-align: center;
}
</style>
