<script setup>
import ChannelHeader from '@/components/channel/ChannelHeader.vue';  // 새로 만든 컴포넌트
import { useRoute } from 'vue-router';
import { computed } from 'vue';
import ChannelNavigationBar from "@/components/channel/ChannelNavigationBar.vue";


const route = useRoute();
const channelIdx = route.params.channelIdx;

const isMyChannelRoute = computed(() => {
    return route.name === 'mychannel';
});
</script>

<template>
    <ChannelHeader :channelIdx="channelIdx" />
    <ChannelNavigationBar/>
    <div class="channel-content">
        <RouterView />
    </div>

</template>

<style scoped>
.channel-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
}

.channel-content {
    padding-top: 1rem;
}
</style>