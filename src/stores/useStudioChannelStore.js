import { ref } from 'vue'
import { defineStore } from 'pinia'
import channelApi from '@/api/channel/index.js'
import { withImageCacheBust } from '@/utils/image.js'

const defaultChannelInfo = () => ({
  id: '',
  name: '',
  content: '',
  profileImg: '',
  bannerImg: '',
  subscriberCount: 0,
  videoCount: 0
})

const normalizeChannelInfo = (payload) => {
  const data = payload?.data || payload || {}

  return {
    id: data.id || '',
    name: data.name || '',
    content: data.content || '',
    profileImg: data.profileImg || '',
    bannerImg: data.bannerImg || '',
    subscriberCount: data.subscriberCount || 0,
    videoCount: data.videoCount || 0
  }
}

const useStudioChannelStore = defineStore('studioChannel', () => {
  const channelInfo = ref(defaultChannelInfo())
  const isLoading = ref(false)
  const isLoaded = ref(false)
  const imageCacheKey = ref(Date.now())
  let loadPromise = null

  const setChannelInfo = (patch) => {
    channelInfo.value = {
      ...channelInfo.value,
      ...patch,
      profileImg: patch.profileImg !== undefined
        ? withImageCacheBust(patch.profileImg, imageCacheKey.value)
        : channelInfo.value.profileImg,
      bannerImg: patch.bannerImg !== undefined
        ? withImageCacheBust(patch.bannerImg, imageCacheKey.value)
        : channelInfo.value.bannerImg
    }
  }

  const loadChannelInfo = async ({ force = false } = {}) => {
    if (isLoading.value && loadPromise) return await loadPromise
    if (isLoaded.value && !force) return channelInfo.value

    isLoading.value = true

    try {
      loadPromise = (async () => {
        imageCacheKey.value = Date.now()
        const response = await channelApi.getChannelInfo()
        const normalized = normalizeChannelInfo(response)
        channelInfo.value = {
          ...normalized,
          profileImg: withImageCacheBust(normalized.profileImg, imageCacheKey.value),
          bannerImg: withImageCacheBust(normalized.bannerImg, imageCacheKey.value)
        }
        isLoaded.value = true
        return channelInfo.value
      })()

      return await loadPromise
    } finally {
      loadPromise = null
      isLoading.value = false
    }
  }

  return {
    channelInfo,
    isLoading,
    isLoaded,
    setChannelInfo,
    loadChannelInfo,
    imageCacheKey
  }
})

export default useStudioChannelStore
