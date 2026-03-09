<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { Footer, Header } from '@/components/global/index.js'

const route = useRoute()

const showFooter = computed(() => {
  return route.name !== 'message'
})
</script>

<template>
  <Header />
  <RouterView />
  <Footer v-if="showFooter" />
</template>

<style scoped></style>
