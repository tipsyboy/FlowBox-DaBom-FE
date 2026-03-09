<script setup>
import AppButton from './AppButton.vue'

defineProps({
  title: {
    type: String,
    required: true,
  },
  videoCount: {
    type: Number,
    default: 0,
  },
})
</script>

<template>
  <table class="playlist-table">
    <tbody>
      <tr>
        <td>{{ title }}</td>
        <td>{{ videoCount }}개 영상</td>
        <td>
          <AppButton label="수정" variant="ghost" size="sm" />
        </td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped>
@import '../styles/design-tokens.css';

.playlist-table {
  width: 100%;
  border-collapse: collapse;
}

.playlist-table td {
  border-bottom: 1px solid var(--border-color);
  padding: 10px 6px;
}
</style>

