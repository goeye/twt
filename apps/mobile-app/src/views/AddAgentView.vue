<template>
  <div class="add-agent-page">
    <!-- 导航栏 -->
    <div class="nav-bar">
      <button class="nav-back" @click="router.back()">
        <svg width="10" height="18" viewBox="0 0 10 18" fill="none">
          <path d="M9 1L1 9L9 17" stroke="#222" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>
      <span class="nav-title">添加客服</span>
      <span class="nav-placeholder" />
    </div>

    <!-- 内容 -->
    <div class="content-area">
      <div class="card">
        <!-- 搜索框 -->
        <div class="search-bar">
          <svg class="search-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <circle cx="9" cy="9" r="6.5" stroke="rgba(100,116,145,0.5)" stroke-width="1.4" />
            <path d="M14 14L17 17" stroke="rgba(100,116,145,0.5)" stroke-width="1.4" stroke-linecap="round" />
          </svg>
          <input v-model="searchText" class="search-input" type="text" placeholder="搜索" />
        </div>

        <!-- 客服列表 -->
        <div class="agent-list">
          <label
            v-for="agent in filteredAgents"
            :key="agent.id"
            class="agent-row"
          >
            <span
              class="checkbox"
              :class="{ 'checkbox--checked': selected.has(agent.id) }"
              @click="toggleSelect(agent.id)"
            >
              <svg v-if="selected.has(agent.id)" width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 6L5 9L10 3" stroke="#fff" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </span>
            <div class="avatar-wrap">
              <div class="agent-avatar" :style="{ background: agent.color }">
                <span class="agent-avatar-char">{{ agent.initial }}</span>
              </div>
              <span class="online-dot" :class="agent.online ? 'online-dot--on' : 'online-dot--off'" />
            </div>
            <span class="agent-name">{{ agent.name }}</span>
          </label>
        </div>
      </div>
    </div>

    <!-- 底部栏 -->
    <div class="bottom-bar">
      <div class="bottom-bar-inner">
        <button class="selected-count" @click="showSelectedPanel = true">
          <span>已选择 ({{ selected.size }})</span>
          <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
            <path d="M1 5L5 1L9 5" stroke="#222" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>
        <button class="confirm-btn" :class="{ 'confirm-btn--disabled': selected.size === 0 }" :disabled="selected.size === 0" @click="handleConfirm">确认</button>
      </div>
    </div>

    <!-- 已选择面板 -->
    <Transition name="sheet">
      <div v-if="showSelectedPanel" class="panel-overlay" @click.self="showSelectedPanel = false">
        <div class="panel">
          <div class="panel-header">
            <button class="panel-close" @click="showSelectedPanel = false">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M1 1L13 13M13 1L1 13" stroke="#222" stroke-width="1.6" stroke-linecap="round" />
              </svg>
            </button>
            <span class="panel-title">已选择</span>
            <span class="panel-placeholder" />
          </div>
          <div class="panel-list">
            <div v-for="agent in selectedAgents" :key="agent.id" class="panel-item">
              <div class="agent-avatar" :style="{ background: agent.color }">
                <span class="agent-avatar-char">{{ agent.initial }}</span>
              </div>
              <span class="panel-item-name">{{ agent.name }}</span>
              <button class="remove-btn" @click="toggleSelect(agent.id)">移除</button>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Toast -->
    <Transition name="toast">
      <div v-if="toastText" class="toast">{{ toastText }}</div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();

interface Agent {
  id: number;
  name: string;
  initial: string;
  color: string;
  online: boolean;
}

const agents = ref<Agent[]>([
  { id: 1, name: "李维利", initial: "李", color: "#f5a623", online: true },
  { id: 2, name: "张思远", initial: "张", color: "#4a90d9", online: true },
  { id: 3, name: "江晚柠", initial: "江", color: "#e8a040", online: true },
  { id: 4, name: "王子豪", initial: "王", color: "#c8d94a", online: false },
  { id: 5, name: "陈思琪", initial: "陈", color: "#36c6d9", online: false },
  { id: 6, name: "马未果", initial: "马", color: "#f5a623", online: false },
]);

const searchText = ref("");
const selected = ref(new Set<number>());
const showSelectedPanel = ref(false);
const toastText = ref("");
let toastTimer: ReturnType<typeof setTimeout> | null = null;

const sortedAgents = computed(() => {
  return [...agents.value].sort((a, b) => {
    if (a.online === b.online) return 0;
    return a.online ? -1 : 1;
  });
});

const filteredAgents = computed(() => {
  const kw = searchText.value.trim().toLowerCase();
  if (!kw) return sortedAgents.value;
  return sortedAgents.value.filter(a => a.name.toLowerCase().includes(kw));
});

const selectedAgents = computed(() => {
  return agents.value.filter(a => selected.value.has(a.id));
});

function toggleSelect(id: number) {
  const s = new Set(selected.value);
  if (s.has(id)) s.delete(id);
  else s.add(id);
  selected.value = s;
  if (s.size === 0) showSelectedPanel.value = false;
}

function handleConfirm() {
  if (selected.value.size === 0) return;
  const added = selectedAgents.value.map(a => ({ name: a.name, initial: a.initial, color: a.color }));
  sessionStorage.setItem("addedAgents", JSON.stringify(added));

  const id = route.params.id || "1";
  const currentAgent = "李明";
  const allNames = selectedAgents.value.map(a => a.name);
  const displayNames = allNames.length <= 3
    ? allNames.join("、")
    : allNames.slice(0, 3).join("、") + `等${allNames.length}人`;
  const sysMsg = `${currentAgent}添加了${displayNames}加入会话`;
  const pending = JSON.parse(sessionStorage.getItem("pendingSystemMessages") || "{}");
  const list = pending[id] || [];
  list.push(sysMsg);
  pending[id] = list;
  sessionStorage.setItem("pendingSystemMessages", JSON.stringify(pending));

  toastText.value = "添加成功";
  setTimeout(() => {
    toastText.value = "";
    router.replace({ path: `/session/${id}/info`, query: { tab: "session" } });
  }, 1200);
}
</script>

<style scoped>
.add-agent-page {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #f5f7f9;
}

/* 导航栏 */
.nav-bar {
  display: flex;
  align-items: center;
  height: 44px;
  padding: 0 16px;
  margin-top: env(safe-area-inset-top, 44px);
  background: #fff;
  flex-shrink: 0;
}

.nav-back {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  -webkit-tap-highlight-color: transparent;
}

.nav-title {
  flex: 1;
  font-size: 17px;
  font-weight: 500;
  color: #000;
  text-align: center;
}

.nav-placeholder {
  width: 24px;
  flex-shrink: 0;
}

/* 内容区域 */
.content-area {
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  padding: 16px;
}

.card {
  background: #fff;
  border-radius: 20px;
  padding: 20px;
}

/* 搜索框 */
.search-bar {
  display: flex;
  align-items: center;
  height: 36px;
  background: #f5f7f9;
  border-radius: 60px;
  padding: 0 12px;
  gap: 4px;
  margin-bottom: 20px;
}

.search-icon {
  flex-shrink: 0;
}

.search-input {
  flex: 1;
  font-size: 14px;
  color: #222;
  border: none;
  outline: none;
  background: transparent;
  min-width: 0;
}

.search-input::placeholder {
  color: rgba(100, 116, 145, 0.5);
}

/* 客服列表 */
.agent-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.agent-row {
  display: flex;
  align-items: center;
  gap: 16px;
  height: 40px;
}

/* 复选框 */
.checkbox {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 1.5px solid #d0d5dd;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  -webkit-tap-highlight-color: transparent;
}

.checkbox--checked {
  background: #105eff;
  border-color: #105eff;
}

/* 头像 */
.avatar-wrap {
  position: relative;
  width: 40px;
  height: 40px;
  flex-shrink: 0;
}

.agent-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.agent-avatar-char {
  font-size: 15px;
  font-weight: 500;
  color: #fff;
}

.online-dot {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 2px solid #fff;
}

.online-dot--on {
  background: #34c759;
}

.online-dot--off {
  background: #c0c4cc;
}

.agent-name {
  font-size: 16px;
  color: #000;
  line-height: 26px;
}

/* 底部栏 */
.bottom-bar {
  flex-shrink: 0;
  background: #fff;
  padding: 0 20px;
  padding-bottom: env(safe-area-inset-bottom, 0px);
  box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.04);
}

.bottom-bar-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 52px;
}

.selected-count {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 16px;
  color: #000;
  -webkit-tap-highlight-color: transparent;
}

.confirm-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 36px;
  padding: 0 18px;
  background: #105eff;
  border-radius: 50px;
  font-size: 14px;
  font-weight: 500;
  color: #fff;
  -webkit-tap-highlight-color: transparent;
}

.confirm-btn:active {
  opacity: 0.85;
}

.confirm-btn--disabled {
  background: #a0b4ff;
  pointer-events: none;
}

/* 已选择面板 */
.panel-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 100;
  display: flex;
  align-items: flex-end;
}

.panel {
  width: 100%;
  background: #f5f7f9;
  border-radius: 20px 20px 0 0;
  padding-bottom: env(safe-area-inset-bottom, 0px);
  max-height: 60vh;
  display: flex;
  flex-direction: column;
}

.panel-header {
  display: flex;
  align-items: center;
  height: 48px;
  padding: 0 20px;
  flex-shrink: 0;
}

.panel-close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  -webkit-tap-highlight-color: transparent;
}

.panel-title {
  flex: 1;
  font-size: 16px;
  font-weight: 500;
  color: #222;
  text-align: center;
}

.panel-placeholder {
  width: 24px;
  flex-shrink: 0;
}

.panel-list {
  background: #fff;
  border-radius: 20px;
  margin: 0 16px 16px;
  padding: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.panel-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.panel-item-name {
  flex: 1;
  font-size: 16px;
  color: #000;
  line-height: 26px;
}

.remove-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 26px;
  padding: 0 12px;
  border: 0.5px solid #e2e8ef;
  border-radius: 8px;
  font-size: 13px;
  color: #647491;
  flex-shrink: 0;
  -webkit-tap-highlight-color: transparent;
}

.remove-btn:active {
  background: #f5f7f9;
}

/* 面板过渡 */
.sheet-enter-active,
.sheet-leave-active {
  transition: opacity 0.25s;
}

.sheet-enter-active .panel,
.sheet-leave-active .panel {
  transition: transform 0.25s ease-out;
}

.sheet-enter-from,
.sheet-leave-to {
  opacity: 0;
}

.sheet-enter-from .panel,
.sheet-leave-to .panel {
  transform: translateY(100%);
}

/* Toast */
.toast {
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.75);
  color: #fff;
  font-size: 14px;
  padding: 10px 24px;
  border-radius: 8px;
  z-index: 200;
  pointer-events: none;
}

.toast-enter-active,
.toast-leave-active {
  transition: opacity 0.2s;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
}
</style>
