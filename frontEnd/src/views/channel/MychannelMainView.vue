<script setup>
import { ref, onMounted } from 'vue';
import ChannelHeader from '@/components/channel/ChannelHeader.vue';
import Sidebar from '@/components/channel/MyChannelSidbar.vue';
// import VideoSection from '@/components/channel/video-management/VideoSection.vue';
import VideoManagementSection from '@/components/channel/video-management/VideoManagementSection.vue';
import CommunitySection from '@/components/channel/community-management/CommunitySection.vue';
import InfoSection from '@/components/channel/information-management/InfoSection.vue';
import PlaylistSection from '@/components/channel/playlist-management/PlaylistSection.vue';
import useMemberStore from '@/stores/useMemberStore';
import api from '@/api/auth';

const memberStore = useMemberStore();
const currentUserIdx = ref(null);
const currentSection = ref('videos');


const getCurrentUserIdx = async () => {
  if (memberStore.checkLogin()) {
      const result = await api.getCurrentMemberInfo();
      if (result.code === 200) {
        currentUserIdx.value = result.data.id;
      }
  }
}

const handleNavigation = (section) => {
  currentSection.value = section;
}

onMounted(() => {
  getCurrentUserIdx();
});
</script>

<template>
  <div class="management-layout">
    <ChannelHeader v-if="currentUserIdx" :channelIdx="currentUserIdx" />

    <div class="channel-dashboard">
      <Sidebar :currentSection="currentSection" @navigate="handleNavigation" />
      <main class="dashboard-main">
        <VideoManagementSection :isActive="currentSection === 'videos'" />
        <PlaylistSection :isActive="currentSection === 'playlists'" />
        <CommunitySection :isActive="currentSection === 'community'" />
        <InfoSection :isActive="currentSection === 'info'" />
      </main>
    </div>
  </div>
</template>

<style scoped>
@import url(@/assets/channel/mychannel.css);

.management-layout {
  display: flex;
  flex-direction: column;
}

.channel-dashboard {
  flex: 1;
}
</style>