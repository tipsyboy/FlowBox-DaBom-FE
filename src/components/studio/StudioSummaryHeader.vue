<script setup>
import { computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import bannerFallback from '@/assets/images/banner.png'
import avatarFallback from '@/assets/images/dabom2.png'
import useStudioChannelStore from '@/stores/useStudioChannelStore.js'

const stats = [
  { label: '구독자', value: '12.8만' },
  { label: '동영상', value: '142개' },
  { label: '누적 조회수', value: '4,982,110' }
]

const channelStore = useStudioChannelStore()
const { channelInfo } = storeToRefs(channelStore)

const bannerImg = computed(() => channelInfo.value.bannerImg || bannerFallback)
const avatarImg = computed(() => channelInfo.value.profileImg || avatarFallback)
const channelName = computed(() => channelInfo.value.name || '내 채널')
const channelHandle = computed(() => {
  const baseName = channelInfo.value.name || 'my_channel'
  return `@${baseName.toLowerCase().replace(/\s+/g, '_')}`
})

onMounted(() => {
  channelStore.loadChannelInfo()
})
</script>

<template>
  <section class="studio-top">
    <div class="banner-frame">
      <img :src="bannerImg" alt="채널 배너" class="banner-image" />
    </div>

    <div class="summary-card">
      <div class="profile-block">
        <img :src="avatarImg" alt="채널 프로필" class="avatar" />
        <div class="identity">
          <h1>{{ channelName }}</h1>
          <p>{{ channelHandle }} · 채널 운영</p>
        </div>
      </div>

      <div class="metrics">
        <div v-for="item in stats" :key="item.label" class="metric-item">
          <span class="metric-label">{{ item.label }}</span>
          <strong class="metric-value">{{ item.value }}</strong>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.studio-top {
  display: grid;
  gap: 12px;
}

.banner-frame {
  border: 1px solid var(--border-color);
  border-radius: 14px;
  overflow: hidden;
  background: #141518;
}

.banner-image {
  width: 100%;
  height: 190px;
  object-fit: cover;
  display: block;
}

.summary-card {
  border: 1px solid var(--border-color);
  border-radius: 14px;
  background: #191b1f;
  padding: 16px;
  display: flex;
  justify-content: space-between;
  gap: 14px;
  align-items: center;
}

.profile-block {
  display: flex;
  gap: 12px;
  align-items: center;
}

.avatar {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  border: 2px solid #555;
}

.identity h1 {
  margin: 0;
  font-size: 24px;
}

.identity p {
  margin: 6px 0 0;
  color: var(--text-secondary);
  font-size: 13px;
}

.metrics {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.metric-item {
  min-width: 120px;
  border: 1px solid var(--border-color);
  border-radius: 10px;
  background: #15171a;
  padding: 10px 12px;
  display: grid;
  gap: 4px;
}

.metric-label {
  color: var(--text-secondary);
  font-size: 12px;
}

.metric-value {
  font-size: 16px;
}

@media (max-width: 920px) {
  .summary-card {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
