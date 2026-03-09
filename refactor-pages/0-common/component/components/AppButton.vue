<script setup>
import { computed } from 'vue'

const props = defineProps({
  label: {
    type: String,
    required: true,
  },
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'ghost', 'danger'].includes(value),
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md'].includes(value),
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['click'])

const className = computed(() => [`btn`, `btn-${props.variant}`, `btn-${props.size}`])

const onClick = (event) => {
  if (props.disabled) return
  emit('click', event)
}
</script>

<template>
  <button :class="className" :disabled="disabled" @click="onClick">
    {{ label }}
  </button>
</template>

<style scoped>
@import '../styles/design-tokens.css';

.btn {
  border: none;
  border-radius: 10px;
  padding: 8px 12px;
  cursor: pointer;
  transition: var(--transition);
  font-weight: 600;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-sm {
  padding: 6px 10px;
  font-size: 13px;
}

.btn-md {
  padding: 8px 12px;
  font-size: 14px;
}

.btn-primary {
  background: var(--primary-color);
  color: #fff;
}

.btn-ghost {
  background: #3a3a3a;
  color: #fff;
}

.btn-danger {
  background: var(--danger-color);
  color: #fff;
}
</style>

