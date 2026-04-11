<template>
  <div class="notification-settings-page">
    <!-- 导航栏 -->
    <div class="nav-bar">
      <button class="nav-back" @click="handleBack">
        <svg width="10" height="18" viewBox="0 0 10 18" fill="none">
          <path d="M9 1L1 9L9 17" stroke="#222" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>
      <span class="nav-title">消息通知</span>
    </div>

    <!-- 提示信息 -->
    <div class="tip-section">
      <span class="tip-text">通知已被禁用，请先开启系统通知权限</span>
      <button class="tip-link" @click="handleOpenSettings">去开启</button>
    </div>

    <!-- 通知设置列表 -->
    <div class="notification-card">
      <div class="notification-item">
        <span class="notification-label">新消息</span>
        <button
          class="toggle"
          :class="{ 'toggle--on': settings.newMessage }"
          @click="settings.newMessage = !settings.newMessage"
        >
          <span class="toggle-knob" />
        </button>
      </div>

      <div class="notification-divider" />

      <div class="notification-item">
        <span class="notification-label">新会话请求</span>
        <button
          class="toggle"
          :class="{ 'toggle--on': settings.newSession }"
          @click="settings.newSession = !settings.newSession"
        >
          <span class="toggle-knob" />
        </button>
      </div>

      <div class="notification-divider" />

      <div class="notification-item">
        <span class="notification-label">排队中会话</span>
        <button
          class="toggle"
          :class="{ 'toggle--on': settings.queueSession }"
          @click="settings.queueSession = !settings.queueSession"
        >
          <span class="toggle-knob" />
        </button>
      </div>

      <div class="notification-divider" />

      <div class="notification-item">
        <span class="notification-label">访客进入</span>
        <button
          class="toggle"
          :class="{ 'toggle--on': settings.visitorEnter }"
          @click="settings.visitorEnter = !settings.visitorEnter"
        >
          <span class="toggle-knob" />
        </button>
      </div>
    </div>

    <!-- Toast -->
    <Transition name="toast">
      <div v-if="toastText" class="toast">{{ toastText }}</div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const toastText = ref("");
let toastTimer: ReturnType<typeof setTimeout> | null = null;

const settings = reactive({
  newMessage: true,
  newSession: true,
  queueSession: true,
  visitorEnter: true
});

function showToast(text: string) {
  if (toastTimer) clearTimeout(toastTimer);
  toastText.value = text;
  toastTimer = setTimeout(() => { toastText.value = ""; }, 2000);
}

function handleBack() {
  router.back();
}

function handleOpenSettings() {
  showToast('打开系统设置');
}
</script>

<style scoped>
.notification-settings-page {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #f5f7f9;
}

/* 导航栏 */
.nav-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 44px;
  padding: 0 16px;
  margin-top: env(safe-area-inset-top, 44px);
  background: #fff;
  position: relative;
  flex-shrink: 0;
}

.nav-back {
  position: absolute;
  left: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

.nav-title {
  font-size: 17px;
  font-weight: 500;
  color: #000;
}

/* 提示信息 */
.tip-section {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 24px 16px 16px;
}

.tip-text {
  font-size: 12px;
  color: #75869c;
  text-align: center;
}

.tip-link {
  font-size: 12px;
  color: #3177ff;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  white-space: nowrap;
}

/* 通知设置卡片 */
.notification-card {
  margin: 0 16px;
  padding: 4px 20px;
  background: #fff;
  border-radius: 20px;
}

.notification-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 0;
}

.notification-label {
  font-size: 16px;
  color: #222;
}

.notification-divider {
  height: 0.5px;
  background: #f0f1f3;
}

/* Toggle 开关 */
.toggle {
  position: relative;
  width: 40px;
  height: 22px;
  border-radius: 11px;
  background: #dcdfe6;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  transition: background 0.2s ease;
  flex-shrink: 0;
}

.toggle--on {
  background: #00b578;
}

.toggle-knob {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
  transition: transform 0.2s ease;
}

.toggle--on .toggle-knob {
  transform: translateX(18px);
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
