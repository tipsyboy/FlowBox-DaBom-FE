<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import channelApi from '@/api/channel/index.js'
import subscribeApi from '@/api/subscribe/index.js'
import bannerFallback from '@/assets/images/banner.png'
import profileFallback from '@/assets/images/dabom2.png'
import { withImageCacheBust } from '@/utils/image.js'
import ButtonBasic from '@/components/ui/ButtonBasic.vue'

const route = useRoute()

const channelInfo = reactive({
  id: '',
  name: '',
  videoCount: 0,
  subscriberCount: 0,
  profileImg: ''
})

const bannerImg = ref('')
const imageCacheKey = ref(Date.now())
const isSubscribe = ref(false)

const channelBanner = computed(() => bannerImg.value || bannerFallback)
const profileImg = computed(() => channelInfo.profileImg || profileFallback)
const channelHandle = computed(() => `@${(channelInfo.name || '').toLowerCase().replace(/\s+/g, '_')}`)

const loadChannelInfo = async () => {
  const channelName = route.params.channelName
  if (!channelName) return

  const res = await channelApi.getChannelInfoByChannelName(channelName)
  imageCacheKey.value = Date.now()
  Object.assign(channelInfo, {
    id: res?.id || '',
    name: res?.name || '',
    videoCount: res?.videoCount || 0,
    subscriberCount: res?.subscriberCount || 0,
    profileImg: withImageCacheBust(res?.profileImg || '', imageCacheKey.value)
  })
  bannerImg.value = withImageCacheBust(res?.bannerImg || '', imageCacheKey.value)
}

const loadSubscribe = async () => {
  if (!channelInfo.id) {
    isSubscribe.value = false
    return
  }

  try {
    const res = await subscribeApi.getSubscribe()
    if (res && res.data) {
      isSubscribe.value = res.data.some((sub) => sub.id === channelInfo.id)
    }
  } catch (error) {
    isSubscribe.value = false
  }
}

const toggleSubscribe = async () => {
  if (!channelInfo.id) return

  if (isSubscribe.value) {
    await subscribeApi.deleteSubscribe(channelInfo.id)
  } else {
    await subscribeApi.trySubscribe(channelInfo.id)
  }
  await loadChannelInfo()
  await loadSubscribe()
}

onMounted(async () => {
  await loadChannelInfo()
  await loadSubscribe()
})

watch(
  () => route.params.channelName,
  async () => {
    await loadChannelInfo()
    await loadSubscribe()
  }
)
</script>

<template>
  <section class="channel-header">
    <img :src="channelBanner" alt="채널 배너" class="channel-banner" />

    <div class="channel-info">
      <div class="profile-section">
        <img :src="profileImg" alt="채널 프로필" class="channel-profile-img" />
        <div class="channel-details">
          <h1 class="channel-name">{{ channelInfo.name || '채널' }}</h1>
          <p class="channel-handle">{{ channelHandle }}</p>
          <div class="channel-meta">
            <span>구독자 {{ channelInfo.subscriberCount || 0 }}명</span>
            <span>동영상 {{ channelInfo.videoCount || 0 }}개</span>
          </div>
        </div>
      </div>

      <div class="channel-actions">
        <ButtonBasic class="subscribe-btn" :class="{ 'is-subscribed': isSubscribe }" @click="toggleSubscribe">
          <i class="fas fa-bell"></i>
          {{ isSubscribe ? '구독 중' : '구독' }}
        </ButtonBasic>
        <ButtonBasic class="message-btn"><i class="fas fa-envelope"></i> 메시지</ButtonBasic>
        <ButtonBasic as="router-link" to="/mychannel" class="manage-btn"><i class="fas fa-gear"></i> 내 채널 관리</ButtonBasic>
      </div>
    </div>
  </section>
</template>

<style scoped>
.channel-header {
  max-width: 1400px;
  margin: 20px auto 0;
  padding: 0 16px;
}

.channel-banner {
  width: 100%;
  height: 220px;
  object-fit: cover;
  border-radius: 14px;
  border: 1px solid var(--border-color);
  display: block;
}

.channel-info {
  margin-top: 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

.profile-section {
  display: flex;
  align-items: center;
  gap: 14px;
}

.channel-profile-img {
  width: 88px;
  height: 88px;
  border-radius: 50%;
  border: 2px solid #4d4d4d;
}

.channel-details {
  display: grid;
  gap: 4px;
  justify-items: start;
  text-align: left;
}

.channel-name {
  margin: 0;
  font-size: 32px;
  line-height: 1.2;
}

.channel-handle {
  margin: 0;
  color: var(--text-secondary);
  font-size: 14px;
}

.channel-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 14px;
  color: #c0c0c0;
  font-size: 14px;
}

.channel-actions {
  display: flex;
  gap: 10px;
}

.subscribe-btn,
.message-btn,
.manage-btn {
  border: 1px solid var(--border-color);
  border-radius: 22px;
  background: #333;
  color: var(--text-primary);
  font-size: 14px;
  font-weight: 600;
  padding: 11px 16px;
  cursor: pointer;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.subscribe-btn {
  background: var(--primary-color);
  border-color: var(--primary-color);
  color: #fff;
}

.subscribe-btn.is-subscribed {
  background: #4a5783;
  border-color: #4a5783;
}

@media (max-width: 860px) {
  .channel-info {
    flex-direction: column;
    align-items: flex-start;
  }
}

@media (max-width: 560px) {
  .channel-profile-img {
    width: 74px;
    height: 74px;
  }

  .channel-name {
    font-size: 26px;
  }
}
</style>
