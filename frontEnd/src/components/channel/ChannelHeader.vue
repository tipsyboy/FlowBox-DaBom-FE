<script setup>
import {computed, onMounted, reactive, ref, watch} from 'vue';
import {useRoute} from 'vue-router';
import api from "@/api/channel"
import useMemberStore from '@/stores/useMemberStore';
import subscribe from "@/api/subscribe/index.js";

const route = useRoute();
const memberStore = useMemberStore();
const isMyChannel = ref(false);
const channelInfo = reactive({
  id: '',
  name: '',
  content: '',
  email: '',
  videoCount: 0,
  profileImg: "",
})

const bannerImg = ref('');


const getBannerImage = async () => {
  const imageUrl = await api.getChannelBannerImage();
  console.log(imageUrl);
  if (imageUrl) {
    bannerImg.value = imageUrl;
  }
};

const headerBackgroundStyle = computed(() => {
  if (bannerImg) {
    return `
      background-image: url(${bannerImg.value});
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
    `;
  } else {
    return `background: linear-gradient(135deg, #0d1117 0%, #161b22 25%, #21262d 50%, #161b22 75%, #0d1117 100%);`;
  }
});

const isSubscribe = ref(false)
const subscribeIdx = reactive({
  memberIdx: 0
})


const isOwner = computed(() => {
  return isMyChannel.value;
});
const isManagementPage = computed(() =>
    route.path === '/mychannel'
);

const getSubscribe = async () => {
  if (!channelInfo.id) {
    isSubscribe.value = false;
    return;
  }
  const res = await subscribe.getSubscribe();
  if (res && res.data) {
    const subscriptionList = res.data;
    isSubscribe.value = subscriptionList.some(sub => sub.id === channelInfo.id);
  } else {
    isSubscribe.value = false;
  }
}

const subscribing = async () => {
  if (isSubscribe.value) {
    // Unsubscribe
    await subscribe.deleteSubscribe(channelInfo.id);
  } else {
    // Subscribe
    await subscribe.trySubscribe(channelInfo.id);
  }

  // After action, reload everything to ensure UI is fully updated
  // This will refresh subscriber count and button state
  await loadChannelInfo();
  await getSubscribe();
}

const checkIsMyChannel = () => {
  const myChannel = memberStore.getChannelNameWithEncrypt();
  return myChannel && channelInfo.name && myChannel === channelInfo.name;
}

const loadChannelInfo = async () => {
  let channelName;
  if (route.path === '/mychannel') {
    channelName = memberStore.getChannelNameWithEncrypt();
  } else {
    channelName = route.params.channelName;
  }
  if (channelName) {
    const channelInfoResponse = await api.getChannelInfoByChannelName(channelName);
    Object.assign(channelInfo, channelInfoResponse);
    isMyChannel.value = checkIsMyChannel();
  }

}

// 컴포넌트가 마운트될 때 채널 정보와 구독 상태를 불러옵니다.
onMounted(async () => {
  await loadChannelInfo();
  await getSubscribe();
  await getBannerImage();
})

// 다른 채널 페이지로 이동하는 것을 감지하여 데이터를 새로고침합니다.
watch(() => route.params.channelName, async (newChannelName, oldChannelName) => {
  if (newChannelName && newChannelName !== oldChannelName) {
    await loadChannelInfo();
    await getSubscribe();
  }
});

</script>

<template>
  <div class="channel-header" :style="headerBackgroundStyle">
    <div class="channel-info">
      <div class="profile-section">
        <img
            :src="channelInfo.profileImg"
            alt="채널 프로필"
            class="channel-profile-img"
        />
        <div class="channel-details">
          <h1 class="channel-name">{{ channelInfo?.name ?? '찾을 수 없음' }}</h1>
          <div class="channel-meta">
            <span class="subscriber-count">구독자 {{ channelInfo?.subscriberCount ?? '0' }}명</span>
            <span class="video-count">동영상 {{ channelInfo?.videoCount ?? "0" }}개</span>
          </div>
        </div>
      </div>

      <div class="channel-actions">
        <!-- 관리 페이지에서는 돌아가기 버튼 -->
        <RouterLink
            v-if="isOwner && isManagementPage"
            :to="{ name: 'channel', params: { channelName: channelInfo.name } }"
            class="back-to-channel-btn"
        >
          <i class="fas fa-arrow-left"></i>
          채널로 돌아가기
        </RouterLink>

        <!-- 일반 채널 페이지에서는 관리 버튼 -->
        <RouterLink
            v-else-if="isMyChannel"
            :to="{ name: 'mychannel' }"
            class="manage-channel-btn"
        >
          <i class="fas fa-cog"></i>
          채널 관리
        </RouterLink>

        <!-- 다른 사람 채널일 때는 구독 버튼 -->
        <button v-else-if="!isMyChannel" class="subscribe-btn" @click="subscribing">
          <div v-if="!isSubscribe">
            <i class="fas fa-bell"></i>
            구독
          </div>
          <div v-if="isSubscribe">
            <i class="fas fa-bell"></i>
            구독 중
          </div>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 헤더임 */
.channel-header {
  /* background: linear-gradient(135deg, #0d1117 0%, #161b22 25%, #21262d 50%, #161b22 75%, #0d1117 100%); */
  padding: 4rem 0 4rem 0;
  color: white;
  min-height: 10rem;
}

.channel-info {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.profile-section {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.channel-profile-img {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 2px solid var(--border-color);
}

.channel-details {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.channel-name {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
}

.channel-meta {
  display: flex;
  gap: 1rem;
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.channel-actions {
  display: flex;
  gap: 1rem;
}

.back-to-channel-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background-color: var(--hover-color);
  color: var(--text-primary);
  text-decoration: none;
  border: 2px solid var(--border-color);
  border-radius: 20px;
  font-weight: 500;
  transition: var(--transition);
}

.back-to-channel-btn:hover {
  background-color: var(--border-color);
  border-color: var(--primary-color);
}

.manage-channel-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background-color: var(--primary-color);
  color: white;
  text-decoration: none;
  border-radius: 20px;
  font-weight: 500;
  transition: var(--transition);
}

.manage-channel-btn:hover {
  background-color: #ff3838;
  transform: translateY(-1px);
}

.subscribe-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background-color: transparent;
  color: var(--text-primary);
  border: 2px solid var(--border-color);
  border-radius: 20px;
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);
}

.subscribe-btn:hover {
  background-color: var(--hover-color);
  border-color: var(--primary-color);
}

/* 반응형 */
@media (max-width: 768px) {
  .channel-info {
    flex-direction: column;
    gap: 1.5rem;
    align-items: flex-start;
  }

  .channel-name {
    font-size: 1.5rem;
  }

  .channel-profile-img {
    width: 60px;
    height: 60px;
  }
}
</style>