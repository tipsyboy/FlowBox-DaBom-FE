<script setup>
/*
Usage:
- as: 'button' | 'router-link' | 'a'
- variant:
  - default: 기본 회색 버튼
  - primary: 메인 강조 버튼
  - secondary: 보조 강조 버튼
  - ghost: 배경을 약하게 둔 버튼
  - danger: 삭제/위험 액션 버튼
- size: 'sm' | 'md' | 'lg'
Examples:
<ButtonBasic>기본 버튼</ButtonBasic>
<ButtonBasic variant="primary" size="lg">저장</ButtonBasic>
<ButtonBasic variant="ghost">취소</ButtonBasic>
<ButtonBasic variant="danger">삭제</ButtonBasic>
<ButtonBasic as="router-link" :to="{ name: 'main' }">페이지 이동</ButtonBasic>
<ButtonBasic as="a" href="/docs">링크 버튼</ButtonBasic>
 */
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

const props = defineProps({
  as: { type: String, default: 'button' },
  href: { type: String, default: '' },
  to: { type: [String, Object], default: '' },
  variant: { type: String, default: 'default' },
  size: { type: String, default: 'md' },
  type: { type: String, default: 'button' },
  disabled: { type: Boolean, default: false },
})

const tagName = computed(() => {
  if (props.as === 'a') return 'a'
  if (props.as === 'router-link') return RouterLink
  return 'button'
})

const classes = computed(() => [
  'g-btn',
  props.variant === 'primary' ? 'g-btn--primary' : '',
  props.variant === 'secondary' ? 'g-btn--secondary' : '',
  props.variant === 'danger' ? 'g-btn--danger' : '',
  props.variant === 'ghost' ? 'g-btn--ghost' : '',
  props.size === 'sm' ? 'g-btn--sm' : '',
  props.size === 'md' ? 'g-btn--md' : '',
  props.size === 'lg' ? 'g-btn--lg' : '',
])
</script>

<template>
  <component
    :is="tagName"
    :class="classes"
    :href="tagName === 'a' ? href : undefined"
    :to="as === 'router-link' ? to : undefined"
    :type="as === 'button' ? type : undefined"
    :disabled="as === 'button' ? disabled : undefined"
    :aria-disabled="as !== 'button' && disabled ? 'true' : undefined"
  >
    <slot />
  </component>
</template>
