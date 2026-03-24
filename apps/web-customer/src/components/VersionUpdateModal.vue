<template>
  <teleport to="body">
    <div v-if="open" class="version-mask">
      <section class="version-card">
        <header class="version-header">
          <div class="version-icon">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <circle cx="20" cy="20" r="20" fill="#eef3ff" />
              <circle cx="20" cy="20" r="12" stroke="#4080ff" stroke-width="1.5" fill="none" />
              <path d="M20 25V17m0 0l-3 3m3-3l3 3" stroke="#4080ff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </div>
          <div class="version-header-text">
            <h3 class="version-title">发现新版本</h3>
            <p class="version-desc">系统已更新，刷新页面即可使用最新功能</p>
          </div>
        </header>

        <div v-if="notesList.length" class="version-notes">
          <h4 class="version-notes-title">更新内容</h4>
          <ul class="version-notes-list">
            <li v-for="(note, i) in notesList" :key="i">{{ note }}</li>
          </ul>
        </div>

        <footer class="version-footer">
          <button type="button" class="version-btn version-btn-ghost" @click="$emit('dismiss')">
            稍后提醒
          </button>
          <button type="button" class="version-btn version-btn-primary" @click="$emit('refresh')">
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
.version-mask {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  z-index: 1000;
}

.version-card {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  max-width: 420px;
  width: 100%;
}

.version-header {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 24px 24px 0;
}

.version-icon {
  flex-shrink: 0;
}

.version-header-text {
  flex: 1;
}

.version-title {
  color: #1a1a1a;
  font-size: 18px;
  font-weight: 700;
  margin: 0 0 4px;
}

.version-desc {
  color: #75869c;
  font-size: 14px;
  margin: 0;
}

.version-notes {
  margin: 16px 24px 0;
  padding: 12px 16px;
  background: #f7f9fc;
  border-radius: 8px;
}

.version-notes-title {
  color: #1a1a1a;
  font-size: 13px;
  font-weight: 600;
  margin: 0 0 8px;
}

.version-notes-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.version-notes-list li {
  color: #666;
  font-size: 13px;
  line-height: 1.6;
  padding-left: 14px;
  position: relative;
}

.version-notes-list li::before {
  content: "";
  position: absolute;
  left: 0;
  top: 8px;
  width: 5px;
  height: 5px;
  background: #4080ff;
  border-radius: 50%;
}

.version-footer {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding: 20px 24px 24px;
}

.version-btn {
  border: none;
  border-radius: 8px;
  font-size: 14px;
  height: 38px;
  min-width: 100px;
  cursor: pointer;
}

.version-btn-ghost {
  background: #f5f5f5;
  color: #666;
}

.version-btn-primary {
  background: #4080ff;
  color: #fff;
}
</style>
