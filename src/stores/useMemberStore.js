import { ref } from 'vue'
import { defineStore } from 'pinia'
import { EncryptStorage } from 'encrypt-storage'

const LOGIN_KEY = 'IS_LOGIN'
const CHANNEL_NAME_KEY = 'CHANNEL_NAME'
const LOGIN_EXPIRE_MS = 60 * 60 * 1000
const STORAGE_PREFIX = 'dabom'
const STORAGE_SECRET = import.meta.env.VITE_MEMBER_STORAGE_SECRET || 'gdagsdafsdadkflsjfsadfdsate' // 환경 변수가 없으면 기존 키를 그대로 사용한다.

const encryptStorage = new EncryptStorage(STORAGE_SECRET, {
  prefix: STORAGE_PREFIX,
})

const useMemberStore = defineStore('member', () => {
  const isLogin = ref(false)

  const checkLogin = () => {
    const data = encryptStorage.getItem(LOGIN_KEY)
    if (!data) {
      return false
    }
    if (Date.now() > data.expireAt) {
      encryptStorage.removeItem(LOGIN_KEY)
      encryptStorage.removeItem(CHANNEL_NAME_KEY)
      return false
    }
    return data.loggedIn
  }

  const setWithEncrypt = (channelName) => {
    const expireAt = Date.now() + LOGIN_EXPIRE_MS
    encryptStorage.setItem(LOGIN_KEY, { loggedIn: true, expireAt })
    encryptStorage.setItem(CHANNEL_NAME_KEY, { name: channelName, expireAt })
  }

  const getChannelNameWithEncrypt = () => {
    return encryptStorage.getItem(CHANNEL_NAME_KEY).name
  }

  const removeWithEncrypt = () => {
    encryptStorage.removeItem(LOGIN_KEY)
    encryptStorage.removeItem(CHANNEL_NAME_KEY)
  }

  return { isLogin, checkLogin, setWithEncrypt, removeWithEncrypt, getChannelNameWithEncrypt }
})

export default useMemberStore
