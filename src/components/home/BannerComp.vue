<script setup>
import SearchQueryForm from '@/forms/searchQueryForm.js'
import {reactive} from 'vue'
import SearchBarComp from '@/components/app/SearchBarComp.vue'


</script>

<template>
  <section class="main-banner">
    <div class="banner-frame">
      <img src="../../assets/images/banner.png" alt="Dabom banner" class="banner-image" />
    </div>
  </section>
</template>

<style scoped>
.main-banner {
  margin: 1rem 0 1.5rem;
}

.banner-frame {
  border-radius: 16px;
  border: 1px solid var(--border-color);
  overflow: hidden;
  background: #171717;
  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25);
}

.banner-image {
  width: 100%;
  height: 11.5rem;
  display: block;
  object-fit: cover;
}
</style>
