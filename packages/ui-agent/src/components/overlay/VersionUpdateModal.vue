<template>
  <teleport to="body">
    <div v-if="open" class="version-update-mask">
      <section class="version-update-card" role="dialog" aria-modal="true">
        <header class="version-update-header">
          <div class="version-update-icon">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <circle cx="20" cy="20" r="20" fill="#eef3ff" />
              <circle cx="20" cy="20" r="12" stroke="#4080ff" stroke-width="1.5" fill="none" />
              <path d="M20 25V17m0 0l-3 3m3-3l3 3" stroke="#4080ff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </div>
          <div class="version-update-header__text">
            <h3 class="version-update-title">发现新版本</h3>
            <p class="version-update-desc">系统已更新，刷新页面即可使用最新功能</p>
          </div>
        </header>

        <div v-if="notesList.length" class="version-update-notes">
          <h4 class="version-update-notes__title">更新内容</h4>
          <ul class="version-update-notes__list">
            <li v-for="(note, i) in notesList" :key="i">{{ note }}</li>
          </ul>
        </div>

        <footer class="version-update-footer">
          <button type="button" class="agent-btn agent-btn--ghost version-update-btn" @click="$emit('dismiss')">
            稍后提醒
          </button>
          <button type="button" class="agent-btn agent-btn--primary version-update-btn" @click="$emit('refresh')">
            立即刷新
          </button>
        </footer>
      </section>
    </div>
  </teleport>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  open: boolean;
  notes: string;
}>();

defineEmits<{
  (e: "dismiss"): void;
  (e: "refresh"): void;
}>();

const notesList = computed(() => {
  if (!props.notes) return [];
  return props.notes
    .split("\n")
    .map((line) => line.replace(/^[a-f0-9]+ /, "").trim())
    .filter(Boolean);
});
</script>

<style scoped>
.version-update-mask {
  align-items: center;
  background: var(--agent-color-overlay-mask);
  display: flex;
  inset: 0;
  justify-content: center;
  padding: var(--agent-space-24);
  position: fixed;
  z-index: var(--agent-z-modal);
}

.version-update-card {
  background: #fff;
  border-radius: var(--agent-radius-xl);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  max-width: 420px;
  overflow: hidden;
  width: 100%;
}

.version-update-header {
  align-items: flex-start;
  display: flex;
  gap: var(--agent-space-12);
  padding: 24px 24px 0;
}

.version-update-icon {
  flex-shrink: 0;
}

.version-update-header__text {
  flex: 1;
  min-width: 0;
}

.version-update-title {
  color: #1a1a1a;
  font-size: 18px;
  font-weight: 700;
  line-height: 1.4;
  margin: 0 0 4px;
}

.version-update-desc {
  color: #75869c;
  font-size: 14px;
  line-height: 1.5;
  margin: 0;
}

.version-update-notes {
  margin: 16px 24px 0;
  padding: 12px 16px;
  background: #f7f9fc;
  border-radius: var(--agent-radius-md);
}

.version-update-notes__title {
  color: #1a1a1a;
  font-size: 13px;
  font-weight: 600;
  margin: 0 0 8px;
}

.version-update-notes__list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.version-update-notes__list li {
  color: var(--agent-color-text-secondary);
  font-size: 13px;
  line-height: 1.6;
  padding-left: 14px;
  position: relative;
}

.version-update-notes__list li::before {
  background: #4080ff;
  border-radius: 50%;
  content: "";
  height: 5px;
  left: 0;
  position: absolute;
  top: 8px;
  width: 5px;
}

.version-update-footer {
  display: flex;
  gap: var(--agent-space-12);
  justify-content: flex-end;
  padding: 20px 24px 24px;
}

.version-update-btn {
  border-radius: var(--agent-radius-lg);
  font-size: 14px;
  height: 38px;
  min-width: 100px;
}
</style>
