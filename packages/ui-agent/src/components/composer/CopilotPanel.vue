<template>
  <div class="copilot-panel">
    <div class="copilot-panel__header">
      <span class="copilot-panel__title">Copilot 回复</span>
      <span class="copilot-panel__badge">基于 AI 生成</span>
      <button class="copilot-panel__close" type="button" @click="$emit('close')">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10" fill="#c8cdd6"/><line x1="8" y1="8" x2="16" y2="16" stroke="#fff" stroke-width="2" stroke-linecap="round"/><line x1="16" y1="8" x2="8" y2="16" stroke="#fff" stroke-width="2" stroke-linecap="round"/></svg>
      </button>
    </div>
    <div class="copilot-panel__body">
      <textarea class="copilot-panel__textarea" v-model="text" rows="2" />
      <button v-if="text.trim()" class="copilot-panel__send" type="button" @click="handleSend">发送</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{ suggestion: string }>();
const emit = defineEmits<{
  (e: 'send', text: string): void;
  (e: 'close'): void;
}>();

const text = ref(props.suggestion);

function handleSend() {
  if (!text.value.trim()) return;
  emit('send', text.value);
}
</script>

<style scoped>
.copilot-panel {
  background: #fff;
  border-radius: var(--agent-radius-lg);
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
  margin: 0 0 8px;
}

.copilot-panel__header {
  align-items: center;
  display: flex;
  gap: 8px;
  padding: 12px 16px 8px;
}

.copilot-panel__title {
  color: var(--agent-color-text-primary);
  font-size: var(--agent-font-size-sm);
  font-weight: var(--agent-font-weight-semibold);
}

.copilot-panel__badge {
  color: var(--agent-color-text-tertiary);
  font-size: var(--agent-font-size-xs);
}

.copilot-panel__close {
  background: transparent;
  border: 0;
  cursor: pointer;
  display: flex;
  margin-left: auto;
  padding: 0;
}

.copilot-panel__body {
  align-items: flex-end;
  display: flex;
  gap: 8px;
  padding: 4px 16px 14px;
}

.copilot-panel__textarea {
  background: transparent;
  border: 0;
  color: var(--agent-color-text-primary);
  flex: 1;
  font-family: inherit;
  font-size: var(--agent-font-size-sm);
  line-height: 1.5;
  outline: none;
  resize: none;
}

.copilot-panel__send {
  background: transparent;
  border: 0;
  color: var(--agent-color-brand-primary);
  cursor: pointer;
  flex-shrink: 0;
  font-size: var(--agent-font-size-sm);
  font-weight: var(--agent-font-weight-semibold);
  padding: 0;
}
</style>
