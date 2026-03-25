<template>
  <transition name="agent-toast-fade">
    <div v-if="visible" class="agent-toast" role="status" aria-live="polite">
      <span v-if="type === 'success'" class="agent-toast__icon agent-toast__icon--success" aria-hidden="true" />
      <span v-if="type === 'error'" class="agent-toast__icon agent-toast__icon--error" aria-hidden="true" />
      <span class="agent-toast__message">{{ message }}</span>
    </div>
  </transition>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    visible: boolean;
    message: string;
    type?: "success" | "error";
  }>(),
  {
    type: "success"
  }
);
</script>

<style scoped>
.agent-toast {
  align-items: center;
  background: var(--agent-color-bg-panel);
  border-radius: 16px;
  box-shadow: 0 6px 18px rgba(15, 17, 20, 0.12);
  color: #222222;
  display: inline-flex;
  gap: 8px;
  height: 42px;
  left: 50%;
  justify-content: center;
  min-width: 122px;
  padding: 0 20px;
  pointer-events: none;
  position: fixed;
  top: 16px;
  transform: translateX(-50%);
  width: auto;
  z-index: var(--agent-z-toast);
}

.agent-toast__icon {
  border-radius: 50%;
  display: inline-block;
  flex-shrink: 0;
  height: 20px;
  position: relative;
  width: 20px;
}

.agent-toast__icon--success {
  background: #52c41a;
}

.agent-toast__icon--success::after {
  border-bottom: 2px solid #fff;
  border-right: 2px solid #fff;
  content: "";
  height: 7px;
  left: 6px;
  position: absolute;
  top: 3px;
  transform: rotate(40deg);
  width: 4px;
}

.agent-toast__icon--error {
  background: #ff4d4f;
}

.agent-toast__icon--error::before,
.agent-toast__icon--error::after {
  background: #fff;
  content: "";
  height: 2px;
  left: 50%;
  position: absolute;
  top: 50%;
  width: 10px;
}

.agent-toast__icon--error::before {
  transform: translate(-50%, -50%) rotate(45deg);
}

.agent-toast__icon--error::after {
  transform: translate(-50%, -50%) rotate(-45deg);
}

.agent-toast__message {
  color: #222222;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.2;
  white-space: nowrap;
}

.agent-toast-fade-enter-active,
.agent-toast-fade-leave-active {
  transition: opacity var(--agent-motion-base) ease, transform var(--agent-motion-base) ease;
}

.agent-toast-fade-enter-from,
.agent-toast-fade-leave-to {
  opacity: 0;
  transform: translate(-50%, -8px);
}

@media (max-width: 1280px) {
  .agent-toast {
    top: 12px;
  }
}
</style>
