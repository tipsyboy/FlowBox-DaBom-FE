<script setup>
import { computed, nextTick, onMounted, reactive, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import ModalCloseButton from '@/components/together_room/ModalCloseButton.vue'
import SettingBtn from '@/components/together_room/SettingBtn.vue'
import TogetherRoomChatMessage from '@/components/together_room/TogetherRoomChatMessage.vue'

const route = useRoute()

const props = defineProps({
  isMaster: Boolean,
  socket: Object,
  userIdx: [String, Number],
})

const emit = defineEmits(['close_modal', 'open_master_modal'])

const togetherIdx = ref('')
const writeMessage = ref('')
const chatMessagesRef = ref(null)
const inputRef = ref(null)

const state = reactive({
  messages: [],
  joinMember: 0,
})

const canSend = computed(() => writeMessage.value.trim().length > 0)

const chatSubscription = () => {
  if (!props.socket) return

  props.socket.subscribe(`/topic/together/${togetherIdx.value}`, (message) => {
    const data = JSON.parse(message.body)
    state.messages.push(data)

    if (data.users !== state.joinMember) {
      state.joinMember = data.users
    }
  })
}

const sendMessage = () => {
  if (!canSend.value || !props.socket) return

  props.socket.send(`/app/together/${togetherIdx.value}`, {}, writeMessage.value)
  writeMessage.value = ''
  nextTick(() => {
    inputRef.value?.focus()
  })
}

const closeModal = () => emit('close_modal')

const fillQuickMessage = (message) => {
  writeMessage.value = message
  nextTick(() => {
    inputRef.value?.focus()
  })
}

watch(
  () => state.messages.length,
  async () => {
    await nextTick()
    const element = chatMessagesRef.value
    if (element) {
      element.scrollTop = element.scrollHeight
    }
  },
)

onMounted(() => {
  togetherIdx.value = route.params.id
  chatSubscription()
  nextTick(() => {
    inputRef.value?.focus()
  })
})
</script>

<template>
  <div class="chat-shell">
    <button class="chat-backdrop" type="button" aria-label="채팅 닫기" @click="closeModal"></button>
    <aside class="chat-sidebar">
      <div class="chat-header">
        <div class="chat-heading">
          <div class="chat-title">실시간 대화</div>
          <div class="online-count">{{ state.joinMember }}명 참여 중</div>
        </div>
        <div class="chat-actions">
          <span
            v-if="props.isMaster"
            class="header-icon-btn"
            title="방 설정"
            @click="emit('open_master_modal')"
          >
            <SettingBtn />
          </span>
          <ModalCloseButton @close_modal="emit('close_modal')" />
        </div>
      </div>

      <div ref="chatMessagesRef" class="chat-messages">
        <div v-if="state.messages.length === 0" class="chat-empty">
          <i class="fas fa-comments"></i>
          <strong>아직 대화가 없습니다</strong>
          <p>짧게 인사하거나 지금 보는 장면 얘기부터 시작하면 됩니다.</p>
          <div class="quick-actions">
            <button class="quick-btn" type="button" @click="fillQuickMessage('안녕하세요!')">안녕하세요!</button>
            <button class="quick-btn" type="button" @click="fillQuickMessage('지금 장면 좋네요')">지금 장면 좋네요</button>
            <button class="quick-btn" type="button" @click="fillQuickMessage('같이 보니까 더 재밌네요')">같이 보니까 더 재밌네요</button>
          </div>
        </div>
        <TogetherRoomChatMessage
          v-for="(msg, index) in state.messages"
          :key="`${msg?.now || index}-${index}`"
          :message="msg"
          :user-idx="props.userIdx"
        />
      </div>

      <div class="chat-input-container">
        <div class="chat-input-caption">
          <span>메시지 200자 제한</span>
          <span>{{ writeMessage.length }}/200</span>
        </div>
        <div class="chat-input-wrapper">
          <input
            ref="inputRef"
            v-model="writeMessage"
            type="text"
            class="chat-input"
            placeholder="메시지를 입력하고 Enter를 누르세요"
            maxlength="200"
            @keyup.enter="sendMessage"
          />
          <button class="send-btn" :disabled="!canSend" type="button" @click="sendMessage">
            <i class="fas fa-paper-plane"></i>
          </button>
        </div>
      </div>
    </aside>
  </div>
</template>

<style scoped>
.chat-shell {
  min-width: 0;
  height: 100%;
}

.chat-backdrop {
  display: none;
}

.chat-sidebar {
  position: sticky;
  top: 84px;
  width: 100%;
  height: min(76vh, 860px);
  background:
    linear-gradient(180deg, rgba(46, 46, 46, 0.98), rgba(30, 30, 30, 0.98)),
    radial-gradient(circle at top, rgba(250, 85, 0, 0.14), transparent 30%);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 22px;
  display: grid;
  grid-template-rows: auto 1fr auto;
  backdrop-filter: blur(18px);
  box-shadow: 0 20px 52px rgba(0, 0, 0, 0.28);
  overflow: hidden;
}

.chat-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 22px 20px 18px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.chat-heading {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.chat-title {
  font-size: 24px;
  font-weight: 700;
}

.online-count {
  color: var(--text-secondary);
  font-size: 14px;
}

.chat-actions {
  display: flex;
  align-items: center;
  gap: 6px;
}

.header-icon-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.chat-messages {
  overflow-y: auto;
  padding: 18px 16px 24px;
}

.chat-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100%;
  padding: 32px 20px;
  text-align: center;
  color: var(--text-secondary);
}

.chat-empty i {
  margin-bottom: 14px;
  font-size: 34px;
  color: rgba(250, 85, 0, 0.7);
}

.chat-empty strong {
  margin-bottom: 8px;
  color: var(--text-primary);
  font-size: 18px;
}

.chat-empty p {
  margin: 0 0 18px;
  line-height: 1.55;
}

.quick-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
}

.quick-btn {
  min-height: 36px;
  padding: 0 13px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.04);
  color: var(--text-primary);
  cursor: pointer;
}

.chat-input-container {
  padding: 16px 18px 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  background: rgba(24, 24, 24, 0.75);
}

.chat-input-caption {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: 13px;
  color: var(--text-secondary);
}

.chat-input-wrapper {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 8px;
}

.chat-input {
  min-width: 0;
  padding: 15px 16px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.04);
  color: var(--text-primary);
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.chat-input:focus {
  outline: none;
  border-color: rgba(250, 85, 0, 0.55);
  box-shadow: 0 0 0 4px rgba(250, 85, 0, 0.12);
}

.send-btn {
  width: 52px;
  border: none;
  border-radius: 16px;
  background: linear-gradient(135deg, #fa5500, #ff7b3d);
  color: white;
  cursor: pointer;
  box-shadow: 0 12px 26px rgba(250, 85, 0, 0.24);
}

.send-btn:disabled {
  background: rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.45);
  box-shadow: none;
  cursor: default;
}

@media (max-width: 960px) {
  .chat-shell {
    position: fixed;
    inset: 0;
    z-index: 50;
    pointer-events: none;
  }

  .chat-backdrop {
    position: absolute;
    inset: 0;
    display: block;
    border: none;
    background: rgba(0, 0, 0, 0.26);
    pointer-events: auto;
  }

  .chat-sidebar {
    position: fixed;
    top: 0;
    right: 0;
    width: min(100vw, 420px);
    height: 100vh;
    border: none;
    border-left: 1px solid rgba(255, 255, 255, 0.06);
    border-radius: 0;
    z-index: 1;
    box-shadow: -24px 0 64px rgba(0, 0, 0, 0.32);
    pointer-events: auto;
  }
}

@media (max-width: 640px) {
  .chat-header {
    padding: 18px 16px 16px;
  }

  .chat-title {
    font-size: 22px;
  }

  .chat-messages {
    padding: 16px 14px 20px;
  }
}
</style>
