<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: '검색어를 입력하세요',
  },
  buttonText: {
    type: String,
    default: '검색',
  },
})

const emit = defineEmits(['update:modelValue', 'search'])

const keyword = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

const submit = () => {
  emit('search', keyword.value.trim())
}
</script>

<template>
  <div class="search-wrap">
    <input v-model="keyword" type="text" :placeholder="placeholder" @keyup.enter="submit" />
    <button @click="submit">{{ buttonText }}</button>
  </div>
</template>

<style scoped>
@import '../styles/design-tokens.css';

.search-wrap {
  display: flex;
  max-width: 640px;
  width: 100%;
}

.search-wrap input {
  flex: 1;
  border: 2px solid var(--border-color);
  border-radius: 25px 0 0 25px;
  background: var(--card-bg);
  color: var(--text-primary);
  padding: 12px 16px;
  font-size: 16px;
}

.search-wrap button {
  border: 2px solid var(--border-color);
  border-radius: 0 25px 25px 0;
  padding: 12px 22px;
  background: var(--hover-color);
  color: var(--text-primary);
  cursor: pointer;
  transition: var(--transition);
}

.search-wrap button:hover {
  background: var(--primary-color);
  border-color: var(--primary-color);
  color: #fff;
}
</style>

