<script setup>
import StudioSummaryHeader from '@/components/studio/StudioSummaryHeader.vue'
import StudioSidebar from '@/components/studio/StudioSidebar.vue'
</script>

<template>
  <div class="studio-page container">
    <StudioSummaryHeader />

    <section class="studio-body">
      <StudioSidebar class="studio-nav" />
      <main class="studio-main">
        <RouterView />
      </main>
    </section>
  </div>
</template>

<style scoped>
.studio-page {
  max-width: 1400px;
  margin: 16px auto 0;
  padding: 0 16px 28px;
  display: grid;
  gap: 14px;
}

.studio-body {
  display: grid;
  grid-template-columns: 240px minmax(0, 1fr);
  gap: 14px;
  align-items: start;
}

.studio-main {
  min-width: 0;
}

@media (max-width: 980px) {
  .studio-body {
    grid-template-columns: 1fr;
  }

  .studio-nav {
    position: static;
  }
}
</style>
