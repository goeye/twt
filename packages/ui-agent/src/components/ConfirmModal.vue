<template>
  <div v-if="visible" class="agent-modal-overlay" @click="onCancel">
    <div class="agent-modal" @click.stop>
      <div class="agent-modal-title">{{ title }}</div>
      <div class="agent-modal-content">{{ message }}</div>
      <div class="agent-modal-footer">
        <button class="agent-btn agent-btn--ghost" @click="onCancel">
          {{ cancelText || '取消' }}
        </button>
        <button
          class="agent-btn"
          :class="type === 'danger' ? 'agent-btn--danger' : 'agent-btn--primary'"
          @click="onConfirm"
        >
          {{ confirmText || '确定' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  visible: boolean
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  type?: 'primary' | 'danger'
}>()

const emit = defineEmits<{
  confirm: []
  cancel: []
}>()

const onConfirm = () => emit('confirm')
const onCancel = () => emit('cancel')
</script>

<style scoped>
.agent-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--agent-color-overlay-default);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: var(--agent-z-modal);
}

.agent-modal {
  background: var(--agent-color-bg-panel);
  border-radius: var(--agent-radius-lg);
  box-shadow: var(--agent-shadow-lg);
  min-width: 400px;
  max-width: 500px;
}

.agent-modal-title {
  padding: var(--agent-space-20) var(--agent-space-24) var(--agent-space-12);
  font-size: var(--agent-font-size-lg);
  font-weight: var(--agent-font-weight-semibold);
  color: var(--agent-color-text-primary);
}

.agent-modal-content {
  padding: 0 var(--agent-space-24) var(--agent-space-20);
  font-size: var(--agent-font-size-sm);
  color: var(--agent-color-text-secondary);
  line-height: 1.5;
}

.agent-modal-footer {
  padding: var(--agent-space-16) var(--agent-space-24);
  display: flex;
  gap: var(--agent-space-12);
  justify-content: flex-end;
  border-top: 1px solid var(--agent-color-border-default);
}
</style>
