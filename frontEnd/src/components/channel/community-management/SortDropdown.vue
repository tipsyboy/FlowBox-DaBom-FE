<script setup>
import { ref, onMounted, onUnmounted  } from 'vue'

const props = defineProps({
  sortBy: {
    type: String,
    default: 'oldest'
  }
})

const emit = defineEmits(['sort-change'])

const showDropdown = ref(false)
const sortDropdownRef = ref(null)

const toggleDropdown = (event) => {
  event.stopPropagation()
  showDropdown.value = !showDropdown.value
}

const handleSortChange = (newSort) => {
  showDropdown.value = false
  emit('sort-change', newSort)
}

// 외부 클릭 감지
const handleClickOutside = (event) => {
  if (showDropdown.value && sortDropdownRef.value && !sortDropdownRef.value.contains(event.target)) {
    showDropdown.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
<template>
  <div class="sort-dropdown" ref="sortDropdownRef">
    <button class="sort-button" @click="toggleDropdown">
      <i class="fas fa-sort"></i>
      {{ sortBy === 'oldest' ? '오래된순' : '최신순' }}
      <i class="fas fa-chevron-down"></i>
    </button>
    
    <div v-if="showDropdown" class="dropdown-menu" @click.stop>
      <div 
        class="dropdown-item"
        :class="{ active: sortBy === 'oldest' }"
        @click="handleSortChange('oldest')"
      >
        오래된순
      </div>
      <div 
        class="dropdown-item"
        :class="{ active: sortBy === 'latest' }"
        @click="handleSortChange('latest')"
      >
        최신순
      </div>
    </div>
  </div>
</template>



<style scoped>
.sort-dropdown {
  position: relative;
}

.sort-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: rgb(35, 32, 32);
  color: white;
  border: 1px solid #444;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.2s;
}

.sort-button:hover {
  background-color: rgb(45, 42, 42);
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  background-color: rgb(35, 32, 32);
  border: 1px solid #444;
  border-radius: 6px;
  overflow: hidden;
  z-index: 100;
  min-width: 120px;
  margin-top: 0.25rem;
}

.dropdown-item {
  padding: 0.75rem 1rem;
  color: white;
  cursor: pointer;
  transition: background-color 0.2s;
}

.dropdown-item:hover {
  background-color: rgb(45, 42, 42);
}

.dropdown-item.active {
  background-color: #3b82f6;
  color: white;
}
</style>