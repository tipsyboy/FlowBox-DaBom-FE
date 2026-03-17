<script setup>
import ChannelHeader from '@/components/channel/ChannelHeader.vue'
import ChannelNavigationBar from '@/components/channel/ChannelNavigationBar.vue'
</script>

<template>
  <ChannelHeader />
  <ChannelNavigationBar />
  <div class="channel-content">
    <RouterView />
  </div>
</template>

<style scoped>
.channel-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 24px 16px 64px;
}
</style>
