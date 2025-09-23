<script setup>
import SearchQueryForm from '@/entity/SearchQueryForm'
import {reactive} from 'vue'
import SearchBarComp from '@/components/search/SearchBarComp.vue'


</script>

<template>
  <section class="main-banner">
    <img src="@/assets/images/banner.png" alt="Dabom banner" class="banner-image"/>
<!--    <h1 class="main-banner_title">Welcome Dabom</h1>-->
<!--    <p class="main-banner_subtitle">혼자 보는 영상에서 함께하는 경험으로</p>-->
  </section>
</template>

<style scoped>
.main-banner {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-height: 15rem;
  margin-bottom: 3rem;
  overflow: hidden; /* 추가 */
}

.banner-image {
  width: 100%;
  height: 15rem; /* max-height 대신 고정 height */
  object-fit: cover;
}
</style>
