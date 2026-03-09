import { ref } from 'vue'
import { defineStore } from 'pinia'
import { getChatRoom } from '@/api/chat/index.js'

export const useChatStore = defineStore('chat', () => {
  const currentRoomIdx = ref(null)
  const currentRecipientIdx = ref(null)
  const currentRecipientName = ref(null)
  const currentMemberIdx = ref(null)
  const currentMemberName = ref(null)
  const messages = ref([])
  const chatRooms = ref({})

  function setChatRooms(rooms) {
    chatRooms.value = rooms
  }

  async function fetchAndSetMessages(roomIdx) {
    if (!roomIdx) return

    try {
      const chatHistory = await getChatRoom(roomIdx)
      const transformedMessages = chatHistory.content
        .map((msg) => ({
          id: msg.createdAt || Date.now(),
          content: msg.message,
          sender: msg.senderName,
          sent: String(msg.senderIdx) === String(currentMemberIdx.value),
          time: new Date(msg.createdAt).toLocaleTimeString(),
          isRead: msg.isRead,
        }))
        .filter((msg) => msg.content && msg.content.trim() !== '')
        .reverse()

      setMessages(transformedMessages)
    } catch (error) {
      console.error('Failed to fetch chat history:', error)
      setMessages([])
    }
  }

  async function setCurrentChatRoom(roomIdx, recipientIdx, recipientName) {
    currentRoomIdx.value = roomIdx
    currentRecipientIdx.value = recipientIdx
    currentRecipientName.value = recipientName
    messages.value = []

    if (chatRooms.value[roomIdx]) {
      chatRooms.value[roomIdx].unreadCount = 0
    }

    await fetchAndSetMessages(roomIdx)
  }

  function setCurrentMember(idx, name) {
    currentMemberIdx.value = idx
    currentMemberName.value = name
  }

  function addMessage(message) {
    messages.value.push(message)
  }

  function setMessages(newMessages) {
    messages.value = newMessages
  }

  function clearMessages() {
    messages.value = []
  }

  function processIncomingMessage(messageData) {
    const roomIdx = messageData.roomIdx.toString()

    if (chatRooms.value[roomIdx]) {
      chatRooms.value[roomIdx].lastMessage = messageData.message
      chatRooms.value[roomIdx].time = new Date(messageData.createdAt).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      })
    }

    if (String(messageData.roomIdx) === String(currentRoomIdx.value)) {
      const transformedMessage = {
        id: messageData.createdAt || Date.now(),
        content: messageData.message,
        sender: messageData.senderName,
        sent: String(messageData.senderIdx) === String(currentMemberIdx.value),
        time: new Date(messageData.createdAt).toLocaleTimeString(),
        isRead: messageData.isRead,
      }

      if (transformedMessage.content && transformedMessage.content.trim() !== '') {
        addMessage(transformedMessage)
      }
    } else if (chatRooms.value[roomIdx]) {
      chatRooms.value[roomIdx].unreadCount = (chatRooms.value[roomIdx].unreadCount || 0) + 1
    }
  }

  return {
    currentRoomIdx,
    currentRecipientIdx,
    currentRecipientName,
    currentMemberIdx,
    currentMemberName,
    messages,
    chatRooms,
    setChatRooms,
    setCurrentChatRoom,
    setCurrentMember,
    addMessage,
    setMessages,
    clearMessages,
    processIncomingMessage,
  }
})
