<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
// 정렬 드롭다운임 정렬 옵션만 프롭스로 받으면
//      재활용 가능.
const props = defineProps({
    currentSort: {
        type: String,
        default: 'oldest'
    }
})

const emit = defineEmits(['sort-changed'])

const showSortDropdown = ref(false)
const sortDropdownRef = ref(null)

const toggleSortDropdown = (event) => {
    event.stopPropagation()
    showSortDropdown.value = !showSortDropdown.value
}

const handleClickOutside = (event) => {
    if (showSortDropdown.value && sortDropdownRef.value && !sortDropdownRef.value.contains(event.target)) {
        showSortDropdown.value = false
    }
}

const handleDropdownItemClick = (event, newSort) => {
    event.stopPropagation()
    emit('sort-changed', newSort)
    showSortDropdown.value = false
}

onMounted(() => {
    setTimeout(() => {
        document.addEventListener('click', handleClickOutside)
    }, 100)
})

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
    <div class="sort-dropdown" ref="sortDropdownRef">
        <button class="sort-button" @click="toggleSortDropdown">
            <i class="fas fa-sort"></i>
            {{ currentSort === 'oldest' ? '오래된순' : '최신순' }}
            <i class="fas fa-chevron-down"></i>
        </button>
        
        <div v-if="showSortDropdown" class="dropdown-menu" @click.stop>
            <div 
                class="dropdown-item"
                :class="{ active: currentSort === 'oldest' }"
                @click="handleDropdownItemClick($event, 'oldest')"
            >
                오래된순
            </div>
            <div 
                class="dropdown-item"
                :class="{ active: currentSort === 'latest' }"
                @click="handleDropdownItemClick($event, 'latest')"
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