<script setup>
import TogetherHeader from '@/components/together/TogetherHeader.vue'
import quickButton from '@/components/together/TogetherQuickButton.vue'
import CreateTogetherModal from '@/components/together/CreateTogetherModal.vue'

import { ref } from 'vue'

const showModal = ref(false);

const openCreateRoomModal = () => { 
  showModal.value = true 
}

const closeModal = () => { 
  showModal.value = false 
}
</script>

<template>
  <main class="main-content">
    <div class="together-container">
      <TogetherHeader />
      <router-view></router-view>
      <span @click="openCreateRoomModal"><quickButton /></span>
      <CreateTogetherModal 
      v-if="showModal" 
      :visible="showModal" 
      @close="closeModal" 
      />
    </div>
  </main>
</template>

<style scoped>
</style>
