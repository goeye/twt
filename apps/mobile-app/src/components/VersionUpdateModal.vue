<template>
  <teleport to="body">
    <transition name="fade">
      <div v-if="open" class="version-overlay">
        <div class="version-dialog">
          <h3 class="version-title">发现新版本</h3>
          <p class="version-desc">系统已更新，刷新页面即可使用最新功能</p>

          <div v-if="notesList.length" class="version-notes">
            <div class="version-notes-title">更新内容</div>
            <ul class="version-notes-list">
              <li v-for="(note, i) in notesList" :key="i">{{ note }}</li>
            </ul>
          </div>

          <div class="version-actions">
            <button type="button" class="version-btn version-btn-confirm" @click="$emit('refresh')">
              立即刷新
            </button>
          </div>
        </div>
      </div>
    </transition>
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
.version-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.version-dialog {
  width: 295px;
  background: #fff;
  border-radius: 20px;
  padding: 24px;
}

.version-title {
  font-size: 18px;
  font-weight: 500;
  color: #222;
  text-align: center;
  margin: 0 0 8px;
}

.version-desc {
  font-size: 14px;
  color: #222;
  text-align: center;
  line-height: 20px;
  margin: 0 0 16px;
}

.version-notes {
  margin-bottom: 20px;
  padding: 12px;
  background: #f7f9fc;
  border-radius: 12px;
}

.version-notes-title {
  font-size: 13px;
  font-weight: 600;
  color: #222;
  margin-bottom: 8px;
}

.version-notes-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.version-notes-list li {
  font-size: 13px;
  color: #666;
  line-height: 1.6;
  padding-left: 14px;
  position: relative;
}

.version-notes-list li::before {
  content: "";
  position: absolute;
  left: 0;
  top: 7px;
  width: 4px;
  height: 4px;
  background: #4080ff;
  border-radius: 50%;
}

.version-actions {
  display: flex;
}

.version-btn {
  width: 100%;
  height: 44px;
  border: none;
  border-radius: 64px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
}

.version-btn-cancel {
  background: #f4f7ff;
  color: #222;
}

.version-btn-confirm {
  background: rgba(255, 56, 46, 0.05);
  color: #ff382e;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
