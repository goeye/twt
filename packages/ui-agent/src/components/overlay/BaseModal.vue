<template>
  <teleport to="body">
    <div v-if="open" class="modal-mask" @click.self="$emit('close')">
      <section class="modal-card agent-panel" role="dialog" aria-modal="true" :style="{ maxWidth }">
        <header class="modal-card__header">
          <h3 class="agent-title">{{ title }}</h3>
          <button v-if="showClose" class="close-btn" type="button" aria-label="Close" @click="$emit('close')">x</button>
        </header>
        <div class="modal-card__body">
          <slot />
        </div>
        <footer v-if="$slots.footer" class="modal-card__footer">
          <slot name="footer" />
        </footer>
      </section>
    </div>
  </teleport>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    open: boolean;
    title: string;
    maxWidth?: string;
    showClose?: boolean;
  }>(),
  {
    maxWidth: "560px",
    showClose: true
  }
);

defineEmits<{
  (e: "close"): void;
}>();
</script>

<style scoped>
.modal-mask {
  align-items: center;
  background: var(--agent-color-overlay-mask);
  display: flex;
  inset: 0;
  justify-content: center;
  padding: var(--agent-space-24);
  position: fixed;
  z-index: var(--agent-z-modal);
}

.modal-card {
  max-width: 560px;
  width: 100%;
}

.modal-card__header,
.modal-card__footer {
  align-items: center;
  display: flex;
  justify-content: space-between;
  padding: var(--agent-space-12);
}

.modal-card__body {
  padding: 0 var(--agent-space-12) var(--agent-space-12);
}

.close-btn {
  background: transparent;
  border: 0;
  color: var(--agent-color-text-secondary);
  cursor: pointer;
}
</style>
