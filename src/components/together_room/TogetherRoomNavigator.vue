<script setup>
import SettingBtn from '@/components/together_room/SettingBtn.vue'

const props = defineProps({
  chatOpen: Boolean,
  isMaster: Boolean,
})

const emit = defineEmits(['open_chat_modal', 'open_master_modal'])
</script>

<template>
  <div class="nav-container">
    <button class="nav-btn" :class="{ active: props.chatOpen }" type="button" title="채팅" @click="emit('open_chat_modal')">
      <i class="fas fa-comments"></i>
    </button>
    <span v-if="props.isMaster" @click="emit('open_master_modal')">
      <SettingBtn />
    </span>
  </div>
</template>

<style scoped>
.nav-container {
  position: fixed;
  top: 110px;
  right: 26px;
  z-index: 40;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.nav-btn {
  width: 58px;
  height: 58px;
  border: none;
  border-radius: 999px;
  background: var(--card-bg);
  color: var(--text-primary);
  box-shadow: 0 14px 30px rgba(0, 0, 0, 0.22);
  cursor: pointer;
  font-size: 20px;
}

.nav-btn:hover {
  background: var(--hover-color);
}

.nav-btn.active {
  background: var(--secondary-color);
}
</style>
