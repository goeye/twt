<template>
  <button
    class="agent-switch"
    :class="{ 'agent-switch--checked': modelValue }"
    role="switch"
    type="button"
    :aria-checked="modelValue"
    @click="toggle"
  >
    <span class="agent-switch__thumb" />
  </button>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
  (e: "change", value: boolean): void;
}>();

const toggle = () => {
  const next = !props.modelValue;
  emit("update:modelValue", next);
  emit("change", next);
};
</script>

<style scoped>
.agent-switch {
  background: var(--agent-color-border-strong);
  border: 0;
  border-radius: 999px;
  cursor: pointer;
  display: inline-flex;
  height: 24px;
  padding: 2px;
  transition: background-color var(--agent-motion-fast) ease;
  width: 46px;
}

.agent-switch__thumb {
  background: var(--agent-color-bg-panel);
  border-radius: 50%;
  display: block;
  height: 20px;
  transform: translateX(0);
  transition: transform var(--agent-motion-fast) ease;
  width: 20px;
}

.agent-switch--checked {
  background: var(--agent-color-brand-primary);
}

.agent-switch--checked .agent-switch__thumb {
  transform: translateX(22px);
}

.agent-switch:focus-visible {
  outline: 2px solid var(--agent-color-brand-primary);
  outline-offset: 2px;
}
</style>
