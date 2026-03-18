<template>
  <teleport to="body">
    <div v-if="open" class="perm-changed-mask">
      <section class="perm-changed-card" role="alertdialog" aria-modal="true">
        <div class="perm-changed-body">
          <h3 class="perm-changed-title">权限变更</h3>
          <p class="perm-changed-desc">你的权限已变更，即将进入首页</p>
        </div>
        <div class="perm-changed-footer">
          <button type="button" class="agent-btn agent-btn--primary perm-changed-btn" @click="$emit('confirm')">
            确认
          </button>
        </div>
      </section>
    </div>
  </teleport>
</template>

<script setup lang="ts">
defineProps<{
  open: boolean
}>()

defineEmits<{
  (e: 'confirm'): void
}>()
</script>

<style scoped>
.perm-changed-mask {
  align-items: center;
  background: var(--agent-color-overlay-mask);
  display: flex;
  inset: 0;
  justify-content: center;
  padding: var(--agent-space-24);
  position: fixed;
  z-index: var(--agent-z-modal);
}

.perm-changed-card {
  background: #fff;
  border-radius: var(--agent-radius-xl);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  max-width: 400px;
  overflow: hidden;
  width: 100%;
}

.perm-changed-body {
  padding: 24px 24px 0;
}

.perm-changed-title {
  color: #1a1a1a;
  font-size: 16px;
  font-weight: 600;
  line-height: 1.4;
  margin: 0 0 8px;
}

.perm-changed-desc {
  color: #75869c;
  font-size: 14px;
  line-height: 1.6;
  margin: 0;
}

.perm-changed-footer {
  display: flex;
  justify-content: flex-end;
  padding: 20px 24px 24px;
}

.perm-changed-btn {
  min-width: 80px;
  height: 36px;
  border-radius: var(--agent-radius-lg);
  font-size: 14px;
}
</style>
