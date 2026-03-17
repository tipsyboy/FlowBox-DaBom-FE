<script setup>
import { computed } from 'vue';

const props = defineProps({
  as: { type: String, default: 'button' },
  href: { type: String, default: '' },
  variant: { type: String, default: 'default' },
  size: { type: String, default: 'md' },
  type: { type: String, default: 'button' },
  disabled: { type: Boolean, default: false },
});

const tagName = computed(() => (props.as === 'a' ? 'a' : 'button'));
const classes = computed(() => [
  'g-btn',
  props.variant === 'primary' ? 'g-btn--primary' : '',
  props.variant === 'secondary' ? 'g-btn--secondary' : '',
  props.variant === 'danger' ? 'g-btn--danger' : '',
  props.size === 'sm' ? 'g-btn--sm' : '',
  props.size === 'md' ? 'g-btn--md' : '',
  props.size === 'lg' ? 'g-btn--lg' : '',
]);
</script>

<template>
  <component
    :is="tagName"
    :class="classes"
    :href="tagName === 'a' ? href : undefined"
    :type="tagName === 'button' ? type : undefined"
    :disabled="tagName === 'button' ? disabled : undefined"
  >
    <slot />
  </component>
</template>
