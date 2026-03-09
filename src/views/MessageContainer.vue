<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { getChatList, getProfile } from '@/api/chat/index.js'
import useMemberStore from '@/stores/useMemberStore.js'
import { useChatStore } from '@/stores/useChatStore.js'
import { useSocketStore } from '@/stores/socket.js'

const memberStore = useMemberStore()
const chatStore = useChatStore()
const socketStore = useSocketStore()

const { chatRooms: chatData, messages } = storeToRefs(chatStore)

const currentChatId = ref('')
const searchQuery = ref('')
const messageText = ref('')
const messagesContainer = ref(null)

async function transformChatListData(backendList, currentMemberIdx) {
  const transformed = {}
  if (!backendList) return transformed

  const chatPromises = backendList.map(async (item) => {
    const opponent = item.member1Idx === currentMemberIdx
      ? { name: item.member2Name, idx: item.member2Idx }
      : { name: item.member1Name, idx: item.member1Idx }

    let profileImgUrl = 'https://via.placeholder.com/50x50'

    try {
      const profileResponse = await getProfile(opponent.idx)
      if (profileResponse) {
        profileImgUrl = profileResponse
      }
    } catch (error) {
      console.error(`Failed to fetch profile image for member ${opponent.idx}:`, error)
    }

    return {
      idx: item.idx.toString(),
      data: {
        name: opponent.name,
        avatar: profileImgUrl,
        recipientIdx: opponent.idx,
        recipientName: opponent.name,
        lastMessage: item.lastMessage || '대화를 시작해보세요.',
        time: item.lastMessageTime
          ? new Date(item.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          : '',
        unreadCount: item.unreadCount || 0,
        isOnline: false,
        status: '대화 가능',
      },
    }
  })

  const results = await Promise.all(chatPromises)
  results.forEach((result) => {
    transformed[result.idx] = result.data
  })

  return transformed
}

const filteredChatEntries = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  const entries = Object.entries(chatData.value || {})

  if (!query) return entries

  return entries.filter(([, chat]) => {
    return (
      chat.name.toLowerCase().includes(query) ||
      chat.lastMessage.toLowerCase().includes(query)
    )
  })
})

const currentChat = computed(() => chatData.value[currentChatId.value] || null)

async function selectChat(chatId) {
  currentChatId.value = chatId
  const selectedChat = chatData.value[chatId]

  if (!selectedChat || !selectedChat.recipientIdx || !selectedChat.recipientName) return

  await chatStore.setCurrentChatRoom(
    parseInt(chatId, 10),
    selectedChat.recipientIdx,
    selectedChat.recipientName
  )
}

function focusLatestMessage() {
  nextTick(() => {
    if (!messagesContainer.value) return
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  })
}

function sendMessage() {
  const chat = currentChat.value
  const trimmedMessage = messageText.value.trim()
  if (!chat || !trimmedMessage) return

  const optimisticMessage = {
    id: Date.now(),
    content: trimmedMessage,
    sender: chatStore.currentMemberName,
    sent: true,
    time: new Date().toLocaleTimeString(),
    isRead: false,
  }

  chatStore.addMessage(optimisticMessage)

  const messageDto = {
    roomIdx: chatStore.currentRoomIdx,
    senderIdx: chatStore.currentMemberIdx,
    senderName: chatStore.currentMemberName,
    recipientIdx: chatStore.currentRecipientIdx,
    recipientName: chatStore.currentRecipientName,
    message: trimmedMessage,
  }

  socketStore.sendMessage(messageDto)
  chat.lastMessage = trimmedMessage
  chat.time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  messageText.value = ''
  focusLatestMessage()
}

function handleMessageKeydown(event) {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    sendMessage()
  }
}

watch(
  () => messages.value.length,
  () => {
    focusLatestMessage()
  }
)

onMounted(async () => {
  if (!memberStore.checkLogin()) return

  socketStore.connect()

  const response = await getChatList()
  const rawChatList = response.chatRooms
  const currentMemberIdx = response.currentMemberIdx

  let currentMemberName = null
  if (rawChatList && rawChatList.length > 0) {
    const firstChat = rawChatList[0]
    if (firstChat.member1Idx === currentMemberIdx) {
      currentMemberName = firstChat.member1Name
    } else if (firstChat.member2Idx === currentMemberIdx) {
      currentMemberName = firstChat.member2Name
    }
  }

  if (currentMemberIdx && currentMemberName) {
    chatStore.setCurrentMember(currentMemberIdx, currentMemberName)
  }

  const transformedData = await transformChatListData(rawChatList, currentMemberIdx)
  chatStore.setChatRooms(transformedData)

  const firstChatId = rawChatList?.[0]?.idx?.toString()
  if (firstChatId) {
    await selectChat(firstChatId)
  }
})

onUnmounted(() => {
  socketStore.disconnect()
})
</script>

<template>
  <main class="message-page">
    <div class="messages-shell">
      <aside class="chat-list">
        <div class="chat-list-header">
          <h2>메시지</h2>
        </div>

        <div class="chat-search">
          <input
            v-model="searchQuery"
            class="chat-search-input"
            type="text"
            placeholder="대화 검색"
          />
        </div>

        <div class="chat-list-content">
          <button
            v-for="[chatId, chat] in filteredChatEntries"
            :key="chatId"
            class="chat-item"
            :class="{ active: chatId === currentChatId }"
            type="button"
            @click="selectChat(chatId)"
          >
            <img class="chat-avatar" :src="chat.avatar" :alt="chat.name" />
            <div class="chat-item-main">
              <div class="chat-item-top">
                <strong class="chat-item-name">{{ chat.name }}</strong>
                <span class="chat-item-time">{{ chat.time }}</span>
              </div>
              <p class="chat-item-last">{{ chat.lastMessage }}</p>
            </div>
          </button>
        </div>
      </aside>

      <section v-if="currentChat" class="chat-window">
        <div class="chat-header">
          <div class="chat-header-info">
            <img class="chat-header-avatar" :src="currentChat.avatar" :alt="currentChat.name" />
            <div class="chat-header-details">
              <h3>{{ currentChat.name }}</h3>
              <span class="chat-header-status">{{ currentChat.status }}</span>
            </div>
          </div>

          <div class="chat-actions">
            <button class="chat-action-btn" type="button"><i class="fas fa-phone"></i></button>
            <button class="chat-action-btn" type="button"><i class="fas fa-video"></i></button>
            <button class="chat-action-btn" type="button"><i class="fas fa-ellipsis-v"></i></button>
          </div>
        </div>

        <div ref="messagesContainer" class="chat-messages">
          <article
            v-for="message in messages"
            :key="message.id"
            class="message"
            :class="{ sent: message.sent }"
          >
            <img
              v-if="!message.sent"
              class="message-avatar"
              :src="currentChat.avatar"
              :alt="message.sender"
            />
            <div class="message-content-wrapper">
              <div class="message-content">{{ message.content }}</div>
              <span class="message-time">{{ message.time }}</span>
            </div>
          </article>
        </div>

        <div class="message-input-container">
          <div class="message-input-wrapper">
            <button class="input-btn" type="button"><i class="fas fa-paperclip"></i></button>
            <div class="message-input-area">
              <textarea
                v-model="messageText"
                class="message-input"
                placeholder="메시지를 입력하세요"
                rows="1"
                @keydown="handleMessageKeydown"
              />
              <button class="send-btn" type="button" :disabled="!messageText.trim()" @click="sendMessage">
                <i class="fas fa-paper-plane"></i>
              </button>
            </div>
          </div>
        </div>
      </section>

      <section v-else class="empty-chat">
        <i class="fas fa-comments"></i>
        <p>대화를 선택하면 메시지가 표시됩니다.</p>
      </section>
    </div>
  </main>
</template>

<style scoped>
.message-page {
  min-height: calc(100vh - 78px);
  padding: 14px 16px 24px;
}

.messages-shell {
  display: flex;
  max-width: 1320px;
  margin: 0 auto;
  height: calc(100vh - 78px - 38px);
  background-color: var(--background-color);
  border: 1px solid var(--border-color);
  border-radius: 14px;
  overflow: hidden;
}

.chat-list {
  width: 350px;
  background-color: var(--card-bg);
  border-right: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
}

.chat-list-header {
  padding: 1rem 1rem 0.75rem;
  border-bottom: 1px solid var(--border-color);
}

.chat-list-header h2 {
  margin: 0;
  font-size: 1.2rem;
}

.chat-search {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--border-color);
}

.chat-search-input {
  width: 100%;
  border: 1px solid var(--border-color);
  border-radius: 10px;
  background: #252525;
  color: var(--text-primary);
  padding: 10px 12px;
}

.chat-list-content {
  flex: 1;
  overflow-y: auto;
}

.chat-item {
  width: 100%;
  display: flex;
  gap: 10px;
  padding: 12px;
  border: 0;
  border-bottom: 1px solid var(--border-color);
  background: transparent;
  cursor: pointer;
  text-align: left;
  transition: background-color 0.2s;
}

.chat-item:hover {
  background: #313131;
}

.chat-item.active {
  background: #343434;
}

.chat-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  flex-shrink: 0;
}

.chat-item-main {
  min-width: 0;
  flex: 1;
}

.chat-item-top {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 4px;
}

.chat-item-name {
  font-size: 15px;
  font-weight: 700;
}

.chat-item-time {
  color: var(--text-secondary);
  font-size: 12px;
  white-space: nowrap;
}

.chat-item-last {
  margin: 0;
  color: var(--text-secondary);
  font-size: 13px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.chat-window,
.empty-chat {
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: var(--background-color);
}

.chat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.2rem;
  background-color: var(--card-bg);
  border-bottom: 1px solid var(--border-color);
}

.chat-header-info {
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.chat-header-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.chat-header-details h3 {
  margin: 0 0 2px;
  font-size: 1.05rem;
}

.chat-header-status {
  color: var(--text-secondary);
  font-size: 0.82rem;
}

.chat-actions {
  display: flex;
  gap: 0.4rem;
}

.chat-action-btn {
  border: none;
  background: transparent;
  color: var(--text-secondary);
  border-radius: 50%;
  width: 34px;
  height: 34px;
}

.chat-action-btn:hover {
  background: var(--hover-color);
  color: var(--text-primary);
}

.chat-messages {
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.message {
  display: flex;
  align-items: flex-end;
  gap: 0.6rem;
  max-width: 66%;
}

.message.sent {
  align-self: flex-end;
  flex-direction: row-reverse;
}

.message-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
}

.message-content-wrapper {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.message.sent .message-content-wrapper {
  align-items: flex-end;
}

.message-content {
  background-color: var(--card-bg);
  color: var(--text-primary);
  padding: 9px 12px;
  border-radius: 14px;
  font-size: 13.5px;
  line-height: 1.4;
}

.message.sent .message-content {
  background-color: var(--primary-color);
  color: #fff;
}

.message-time {
  color: var(--text-secondary);
  font-size: 11px;
}

.message-input-container {
  padding: 0.9rem 1rem;
  border-top: 1px solid var(--border-color);
  background: var(--card-bg);
}

.message-input-wrapper {
  display: flex;
  gap: 0.7rem;
  align-items: center;
}

.input-btn,
.send-btn {
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #3a3a3a;
  color: var(--text-primary);
  cursor: pointer;
  flex-shrink: 0;
}

.send-btn {
  background: var(--primary-color);
}

.send-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.message-input-area {
  flex: 1;
  display: flex;
  align-items: flex-end;
  gap: 0.6rem;
  border: 1px solid var(--border-color);
  border-radius: 14px;
  background: #252525;
  padding: 0.5rem 0.6rem;
}

.message-input {
  flex: 1;
  border: none;
  resize: none;
  background: transparent;
  color: var(--text-primary);
  min-height: 24px;
  max-height: 120px;
  outline: none;
}

.empty-chat {
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  color: var(--text-secondary);
}

.empty-chat i {
  font-size: 2rem;
}

@media (max-width: 920px) {
  .messages-shell {
    height: auto;
    min-height: calc(100vh - 78px - 38px);
    flex-direction: column;
  }

  .chat-list {
    width: 100%;
    max-height: 320px;
  }

  .message {
    max-width: 82%;
  }
}
</style>
