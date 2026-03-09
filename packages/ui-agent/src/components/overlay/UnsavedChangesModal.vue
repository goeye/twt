<template>
  <teleport to="body">
    <div v-if="open" class="unsaved-mask" @click.self="$emit('cancel')">
      <section class="unsaved-card" role="dialog" aria-modal="true">
        <div class="unsaved-card__body">
          <h3 class="unsaved-card__title">未保存的更改</h3>
          <p class="unsaved-card__desc">继续操作会放弃本次更改，确定吗？</p>
        </div>
        <footer class="unsaved-card__footer">
          <button type="button" class="unsaved-btn unsaved-btn--ghost" @click="$emit('cancel')">取 消</button>
          <button type="button" class="unsaved-btn unsaved-btn--danger" @click="$emit('confirm')">确认放弃</button>
        </footer>
      </section>
    </div>
  </teleport>
</template>

<script setup lang="ts">
defineProps<{
  open: boolean;
}>();

defineEmits<{
  (e: "cancel"): void;
  (e: "confirm"): void;
}>();
</script>

<style scoped>
.unsaved-mask {
  align-items: center;
  background: var(--agent-color-overlay-mask);
  display: flex;
  inset: 0;
  justify-content: center;
  padding: var(--agent-space-24);
  position: fixed;
  z-index: var(--agent-z-modal);
}

.unsaved-card {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
  max-width: 400px;
  width: 100%;
}

.unsaved-card__body {
  padding: 24px 24px 16px;
}

.unsaved-card__title {
  font-size: 18px;
  font-weight: var(--agent-font-weight-bold, 700);
  margin: 0 0 8px;
}

.unsaved-card__desc {
  color: #75869C;
  font-size: 14px;
  line-height: 1.6;
  margin: 0;
}

.unsaved-card__footer {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding: 12px 24px 20px;
}

.unsaved-btn {
  border: 0;
  border-radius: var(--agent-radius-md, 8px);
  cursor: pointer;
  font-size: 14px;
  font-weight: var(--agent-font-weight-medium, 500);
  letter-spacing: 2px;
  line-height: 1;
  padding: 8px 20px;
  transition: background var(--agent-motion-fast, 0.15s) ease, opacity var(--agent-motion-fast, 0.15s) ease;
}

.unsaved-btn--ghost {
  background: transparent;
  border: 1px solid var(--agent-color-border-default, #d0d5dd);
  color: var(--agent-color-text-primary, #1e293b);
}

.unsaved-btn--ghost:hover {
  background: #f1f5f9;
  border-color: #b0b8c4;
}

.unsaved-btn--danger {
  background: var(--agent-color-status-error, #e5484d);
  color: #fff;
}

.unsaved-btn--danger:hover {
  opacity: 0.88;
}
</style>
