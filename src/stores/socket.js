import { ref } from 'vue'
import { defineStore } from 'pinia'
import SockJS from 'sockjs-client'
import Stomp from 'stompjs'
import { useChatStore } from './useChatStore.js'
import together from '@/api/together/index.js'

export const useSocketStore = defineStore('socket', () => {
  const stompClient = ref(null)
  const isConnected = ref(false)

  async function getJWT() {
    try {
      const tokenData = await together.getToken()
      const jwt = tokenData.authorization
      return jwt || null
    } catch (error) {
      return null
    }
  }

  async function connect() {
    if (isConnected.value) return

    const jwt = await getJWT()
    const chatStore = useChatStore()
    const socket = new SockJS('http://localhost:8080/chat')
    stompClient.value = Stomp.over(socket)

    if (jwt) {
      document.cookie = `ACCESS_TOKEN=${jwt}; path=/;`
    }

    stompClient.value.connect(
      {},
      (frame) => {
        console.log('STOMP: Connected', frame)
        isConnected.value = true
        stompClient.value.subscribe('/user/queue/messages', (message) => {
          const messageData = JSON.parse(message.body)
          chatStore.processIncomingMessage(messageData)
        })
      },
      (error) => {
        console.error('STOMP: Connection error', error)
        isConnected.value = false
        stompClient.value = null
      }
    )
  }

  function disconnect() {
    if (!stompClient.value) return

    stompClient.value.disconnect(() => {
      isConnected.value = false
      stompClient.value = null
    })
  }

  function sendMessage(messageDto) {
    if (!stompClient.value || !isConnected.value) return

    stompClient.value.send('/app/chat/send', {}, JSON.stringify(messageDto))
  }

  return {
    stompClient,
    isConnected,
    connect,
    disconnect,
    sendMessage,
  }
})
