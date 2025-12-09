<template>
  <Teleport to="body">
    <Transition name="modal" appear>
      <div v-if="modelValue" class="modal-backdrop" @click="handleBackdropClick">
        <div
            class="modal-card"
            :class="[`modal-${size}`, `modal-${variant}`]"
            @click.stop
            ref="modalRef"
        >
          <!-- Header -->
          <div v-if="showHeader" class="modal-header">
            <div class="modal-title-section">
              <component
                  v-if="icon"
                  :is="icon"
                  class="modal-icon"
                  :class="iconClass"
              />
              <h2 v-if="title || $slots.title" class="modal-title">
                <slot name="title">{{ title }}</slot>
              </h2>
            </div>
            <button
                v-if="closable"
                class="modal-close-btn"
                @click="handleClose"
                aria-label="닫기"
            >
              ✕
            </button>
          </div>

          <!-- Body -->
          <div class="modal-body">
            <slot name="default">
              <p v-if="message" class="modal-message">{{ message }}</p>
            </slot>
          </div>

          <!-- Footer -->
          <div v-if="showFooter" class="modal-footer">
            <slot name="footer">
              <button
                  v-if="showCancel"
                  class="modal-button modal-button-cancel"
                  @click="handleCancel"
                  :disabled="loading"
              >
                {{ cancelText }}
              </button>
              <button
                  v-if="showConfirm"
                  class="modal-button modal-button-confirm"
                  @click="handleConfirm"
                  :disabled="loading"
                  :class="{ 'loading': loading }"
              >
                <span v-if="loading" class="loading-spinner"></span>
                {{ loading ? loadingText : confirmText }}
              </button>
            </slot>
          </div>

          <!-- Loading Overlay -->
          <div v-if="loading" class="modal-loading-overlay">
            <div class="loading-spinner large"></div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: ''
  },
  message: {
    type: String,
    default: ''
  },
  size: {
    type: String,
    default: 'medium', // small, medium, large, full
    validator: (value) => ['small', 'medium', 'large', 'full'].includes(value)
  },
  variant: {
    type: String,
    default: 'default', // default, success, warning, error, info
    validator: (value) => ['default', 'success', 'warning', 'error', 'info'].includes(value)
  },
  icon: {
    type: [String, Object],
    default: null
  },
  closable: {
    type: Boolean,
    default: true
  },
  closeOnBackdrop: {
    type: Boolean,
    default: true
  },
  closeOnEscape: {
    type: Boolean,
    default: true
  },
  showHeader: {
    type: Boolean,
    default: true
  },
  showFooter: {
    type: Boolean,
    default: true
  },
  showCancel: {
    type: Boolean,
    default: false
  },
  showConfirm: {
    type: Boolean,
    default: true
  },
  confirmText: {
    type: String,
    default: '확인'
  },
  cancelText: {
    type: String,
    default: '취소'
  },
  loading: {
    type: Boolean,
    default: false
  },
  loadingText: {
    type: String,
    default: '처리중...'
  },
  persistent: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'confirm', 'cancel', 'close'])

const modalRef = ref(null)

const iconClass = computed(() => ({
  'text-green-500': props.variant === 'success',
  'text-yellow-500': props.variant === 'warning',
  'text-red-500': props.variant === 'error',
  'text-blue-500': props.variant === 'info'
}))

const handleClose = () => {
  if (props.persistent && props.loading) return
  emit('update:modelValue', false)
  emit('close')
}

const handleConfirm = () => {
  emit('confirm')
}

const handleCancel = () => {
  emit('cancel')
  if (!props.persistent) {
    handleClose()
  }
}

const handleBackdropClick = () => {
  if (props.closeOnBackdrop && !props.persistent) {
    handleClose()
  }
}

const handleEscape = (e) => {
  if (e.key === 'Escape' && props.closeOnEscape && !props.persistent) {
    handleClose()
  }
}

// Focus trap
const focusableElements = ref([])
let firstFocusableElement = null
let lastFocusableElement = null

const trapFocus = (e) => {
  if (e.key === 'Tab') {
    if (e.shiftKey) {
      if (document.activeElement === firstFocusableElement) {
        e.preventDefault()
        lastFocusableElement?.focus()
      }
    } else {
      if (document.activeElement === lastFocusableElement) {
        e.preventDefault()
        firstFocusableElement?.focus()
      }
    }
  }
}

const updateFocusableElements = () => {
  if (!modalRef.value) return

  focusableElements.value = modalRef.value.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  )
  firstFocusableElement = focusableElements.value[0]
  lastFocusableElement = focusableElements.value[focusableElements.value.length - 1]

  // 첫 번째 요소에 포커스
  nextTick(() => {
    firstFocusableElement?.focus()
  })
}

onMounted(() => {
  document.addEventListener('keydown', handleEscape)
  document.addEventListener('keydown', trapFocus)
  if (props.modelValue) {
    updateFocusableElements()
  }
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscape)
  document.removeEventListener('keydown', trapFocus)
})

// 모달이 열릴 때마다 포커스 관리 업데이트
watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    nextTick(() => {
      updateFocusableElements()
    })
  }
})
</script>

<style scoped>
/* Modal Transitions */
.modal-enter-active, .modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from, .modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-card,
.modal-leave-to .modal-card {
  transform: scale(0.9) translateY(-20px);
}

/* Base Styles */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  backdrop-filter: blur(4px);
  padding: 1rem;
  overflow-y: auto;
}

.modal-card {
  background-color: var(--card-bg, #ffffff);
  color: var(--text-primary, #333333);
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  position: relative;
  transition: all 0.3s ease;
  max-height: 90vh;
  overflow-y: auto;
}

/* Size Variants */
.modal-small {
  width: 90%;
  max-width: 400px;
}

.modal-medium {
  width: 90%;
  max-width: 500px;
}

.modal-large {
  width: 90%;
  max-width: 700px;
}

.modal-full {
  width: 95%;
  max-width: 1200px;
  height: 90vh;
}

/* Variant Styles */
.modal-success {
  border-left: 4px solid #10b981;
}

.modal-warning {
  border-left: 4px solid #f59e0b;
}

.modal-error {
  border-left: 4px solid #ef4444;
}

.modal-info {
  border-left: 4px solid #3b82f6;
}

/* Header */
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 1.5rem 1.5rem 0;
  border-bottom: 1px solid var(--border-color, #e5e7eb);
  margin-bottom: 1rem;
}

.modal-title-section {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
}

.modal-icon {
  width: 1.5rem;
  height: 1.5rem;
  flex-shrink: 0;
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
  color: var(--text-primary, #1f2937);
}

.modal-close-btn {
  background: none;
  border: none;
  font-size: 1.25rem;
  cursor: pointer;
  padding: 0.25rem;
  color: var(--text-secondary, #6b7280);
  transition: color 0.2s;
  flex-shrink: 0;
}

.modal-close-btn:hover {
  color: var(--text-primary, #1f2937);
}

/* Body */
.modal-body {
  padding: 0 1.5rem;
  max-height: 60vh;
  overflow-y: auto;
}

.modal-message {
  font-size: 1rem;
  color: var(--text-secondary, #6b7280);
  margin: 0;
  line-height: 1.6;
}

/* Footer */
.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding: 1.5rem;
  border-top: 1px solid var(--border-color, #e5e7eb);
  margin-top: 1rem;
}

.modal-button {
  padding: 0.625rem 1.25rem;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.modal-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.modal-button-cancel {
  background-color: var(--gray-100, #f3f4f6);
  color: var(--text-primary, #374151);
}

.modal-button-cancel:hover:not(:disabled) {
  background-color: var(--gray-200, #e5e7eb);
}

.modal-button-confirm {
  background: linear-gradient(135deg, var(--primary-color, #3b82f6), var(--secondary-color, #1d4ed8));
  color: white;
}

.modal-button-confirm:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}

/* Loading States */
.modal-loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 16px;
}

.loading-spinner {
  width: 1rem;
  height: 1rem;
  border: 2px solid #e5e7eb;
  border-top: 2px solid var(--primary-color, #3b82f6);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.loading-spinner.large {
  width: 2rem;
  height: 2rem;
  border-width: 3px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Responsive */
@media (max-width: 640px) {
  .modal-backdrop {
    padding: 0.5rem;
  }

  .modal-card {
    margin: auto;
  }

  .modal-header {
    padding: 1rem 1rem 0;
  }

  .modal-body {
    padding: 0 1rem;
  }

  .modal-footer {
    padding: 1rem;
    flex-direction: column;
  }

  .modal-button {
    width: 100%;
    justify-content: center;
  }
}
</style>