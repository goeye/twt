<template>
  <div class="agent-time-duration" :class="{ 'agent-time-duration--compact': compact }">
    <div class="agent-time-duration__field">
      <input
        v-model.number="hours"
        type="number"
        min="0"
        class="agent-time-duration__input"
        @input="onInput"
      />
      <span class="agent-time-duration__label">时</span>
    </div>
    <div class="agent-time-duration__field">
      <input
        v-model.number="minutes"
        type="number"
        min="0"
        max="59"
        class="agent-time-duration__input"
        @input="onInput"
      />
      <span class="agent-time-duration__label">分</span>
    </div>
    <div class="agent-time-duration__field">
      <input
        v-model.number="seconds"
        type="number"
        min="0"
        max="59"
        class="agent-time-duration__input"
        @input="onInput"
      />
      <span class="agent-time-duration__label">秒</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

const props = withDefaults(
  defineProps<{
    /** Total duration in seconds */
    modelValue: number;
    /** Use smaller sizing */
    compact?: boolean;
  }>(),
  { compact: false }
);

const emit = defineEmits<{
  (e: "update:modelValue", value: number): void;
}>();

const hours = ref(0);
const minutes = ref(0);
const seconds = ref(0);

const decompose = (totalSeconds: number) => {
  const safe = Math.max(0, Math.floor(totalSeconds));
  hours.value = Math.floor(safe / 3600);
  minutes.value = Math.floor((safe % 3600) / 60);
  seconds.value = safe % 60;
};

decompose(props.modelValue);

watch(
  () => props.modelValue,
  (val) => decompose(val)
);

const onInput = () => {
  const h = Math.max(0, Math.floor(hours.value || 0));
  const m = Math.max(0, Math.min(59, Math.floor(minutes.value || 0)));
  const s = Math.max(0, Math.min(59, Math.floor(seconds.value || 0)));
  const total = h * 3600 + m * 60 + s;
  emit("update:modelValue", total);
};
</script>

<style scoped>
.agent-time-duration {
  align-items: center;
  display: inline-flex;
  gap: var(--agent-space-4);
}

.agent-time-duration__field {
  align-items: center;
  display: inline-flex;
  gap: 2px;
}

.agent-time-duration__input {
  background: var(--agent-color-bg-muted);
  border: 1px solid var(--agent-color-border-default);
  border-radius: var(--agent-radius-md);
  color: var(--agent-color-text-primary);
  font-size: var(--agent-font-size-sm);
  padding: 6px 4px;
  text-align: center;
  width: 48px;
  -moz-appearance: textfield;
}

.agent-time-duration__input::-webkit-inner-spin-button,
.agent-time-duration__input::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.agent-time-duration__input:focus {
  border-color: var(--agent-color-brand-primary);
  outline: none;
}

.agent-time-duration__label {
  color: var(--agent-color-text-secondary);
  font-size: var(--agent-font-size-sm);
  flex-shrink: 0;
}

.agent-time-duration--compact .agent-time-duration__input {
  padding: 4px 2px;
  width: 40px;
  font-size: var(--agent-font-size-xs);
}

.agent-time-duration--compact .agent-time-duration__label {
  font-size: var(--agent-font-size-xs);
}
</style>
