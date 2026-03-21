<template>
  <div class="transfer-page">
    <!-- 导航栏 -->
    <div class="nav-bar">
      <button class="nav-back" @click="router.back()">
        <svg width="10" height="18" viewBox="0 0 10 18" fill="none">
          <path d="M9 1L1 9L9 17" stroke="#222" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>
      <span class="nav-title">转移会话</span>
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
          <div
            v-for="agent in filteredAgents"
            :key="agent.id"
            class="agent-row"
          >
            <div class="avatar-wrap">
              <div class="agent-avatar" :style="{ background: agent.color }">
                <span class="agent-avatar-char">{{ agent.initial }}</span>
              </div>
              <span class="online-dot" :class="agent.online ? 'online-dot--on' : 'online-dot--off'" />
            </div>
            <span class="agent-name">{{ agent.name }}</span>
            <button class="transfer-btn" @click="transferTarget = agent">转移</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 确认弹窗 -->
    <Transition name="fade">
      <div v-if="transferTarget" class="dialog-overlay" @click.self="transferTarget = null">
        <div class="dialog">
          <p class="dialog-title">确认转移</p>
          <p class="dialog-desc">转移后你将自动移出当前会话</p>
          <div class="dialog-actions">
            <button class="dialog-btn dialog-btn--cancel" @click="transferTarget = null">取消</button>
            <button class="dialog-btn dialog-btn--confirm" @click="handleConfirmTransfer">确认</button>
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
  { id: 2, name: "张思远", initial: "张", color: "#4a90d9", online: true },
  { id: 3, name: "江晚柠", initial: "江", color: "#e8a040", online: true },
  { id: 4, name: "王子豪", initial: "王", color: "#c8d94a", online: false },
  { id: 5, name: "陈思琪", initial: "陈", color: "#36c6d9", online: false },
  { id: 6, name: "马未果", initial: "马", color: "#f5a623", online: false },
]);

const searchText = ref("");
const transferTarget = ref<Agent | null>(null);
const toastText = ref("");

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

function handleConfirmTransfer() {
  if (!transferTarget.value) return;
  const id = route.params.id || "1";
  const currentAgent = "李明";
  const sysMsg = `${currentAgent}已将会话转移给${transferTarget.value.name}`;
  const pending = JSON.parse(sessionStorage.getItem("pendingSystemMessages") || "{}");
  const list = pending[id] || [];
  list.push(sysMsg);
  pending[id] = list;
  sessionStorage.setItem("pendingSystemMessages", JSON.stringify(pending));

  transferTarget.value = null;
  toastText.value = "转移成功";
  setTimeout(() => {
    toastText.value = "";
    router.replace("/session");
  }, 1200);
}
</script>

<style scoped>
.transfer-page {
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
  gap: 12px;
  height: 40px;
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
  flex: 1;
  font-size: 16px;
  color: #000;
  line-height: 26px;
}

.transfer-btn {
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

.transfer-btn:active {
  background: #f5f7f9;
}

/* 确认弹窗 */
.dialog-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dialog {
  width: 295px;
  background: #fff;
  border-radius: 20px;
  padding: 24px 24px 20px;
  text-align: center;
}

.dialog-title {
  font-size: 18px;
  font-weight: 500;
  color: #222;
  margin-bottom: 12px;
}

.dialog-desc {
  font-size: 14px;
  color: #222;
  line-height: 20px;
  margin-bottom: 20px;
}

.dialog-actions {
  display: flex;
  gap: 14px;
}

.dialog-btn {
  flex: 1;
  height: 44px;
  border-radius: 64px;
  font-size: 16px;
  font-weight: 500;
  -webkit-tap-highlight-color: transparent;
}

.dialog-btn--cancel {
  background: #f4f7ff;
  color: #222;
}

.dialog-btn--confirm {
  background: rgba(255, 56, 46, 0.05);
  color: #ff382e;
}

/* 过渡 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
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
