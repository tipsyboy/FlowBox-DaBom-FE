<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  modelValue: { type: String, default: '' },
  placeholder: { type: String, default: '검색어를 입력하세요' },
  buttonText: { type: String, default: '검색' },
});

const emit = defineEmits(['update:modelValue', 'search']);
const localValue = ref(props.modelValue);

watch(
  () => props.modelValue,
  (value) => {
    localValue.value = value;
  }
);

const submit = () => {
  emit('update:modelValue', localValue.value);
  emit('search', localValue.value);
};
</script>

<template>
  <div class="g-search">
    <input
      v-model="localValue"
      class="g-search__input"
      :placeholder="placeholder"
      @keyup.enter="submit"
    />
    <button class="g-search__button" type="button" @click="submit">{{ buttonText }}</button>
  </div>
</template>
