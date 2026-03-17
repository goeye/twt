<template>
  <article class="copilot-setting agent-panel">
    <div class="copilot-setting__meta">
      <h3 class="copilot-setting__title">{{ title }}</h3>
      <p class="copilot-setting__description">{{ description }}</p>
    </div>

    <div class="copilot-setting__toggle-area">
      <span v-if="locked" class="agent-feature-lock">
        <svg viewBox="0 0 24 24" fill="none"><rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" stroke-width="1.5"/><path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
      </span>
      <AgentSwitch :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)" />
    </div>
  </article>
</template>

<script setup lang="ts">
import AgentSwitch from "../form/AgentSwitch.vue";

defineProps<{
  title: string;
  description: string;
  modelValue: boolean;
  locked?: boolean;
}>();

defineEmits<{
  (e: "update:modelValue", value: boolean): void;
}>();
</script>

<style scoped>
.copilot-setting {
  align-items: center;
  border-radius: var(--agent-radius-lg);
  display: flex;
  gap: var(--agent-space-16);
  justify-content: space-between;
  min-height: 96px;
  padding: 0 var(--agent-space-24);
}

.copilot-setting__meta {
  display: flex;
  flex-direction: column;
  gap: var(--agent-space-12);
  min-width: 0;
}

.copilot-setting__title {
  color: var(--agent-color-text-primary);
  font-size: var(--agent-font-size-lg);
  font-weight: var(--agent-font-weight-semibold);
  line-height: 1.4;
  margin: 0;
}

.copilot-setting__description {
  color: var(--agent-color-text-tertiary);
  font-size: var(--agent-font-size-md);
  line-height: 1.4;
  margin: 0;
}

.copilot-setting__toggle-area {
  align-items: center;
  display: flex;
  flex-shrink: 0;
  gap: 6px;
}
</style>
