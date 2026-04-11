<template>
  <div class="settings-page">
    <!-- 导航栏 -->
    <div class="nav-bar">
      <button class="nav-back" @click="handleBack">
        <svg width="10" height="18" viewBox="0 0 10 18" fill="none">
          <path d="M9 1L1 9L9 17" stroke="#222" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>
      <span class="nav-title">设置</span>
    </div>

    <!-- 消息通知卡片 -->
    <div class="notification-card" @click="handleNotificationClick">
      <span class="notification-label">消息通知</span>
      <svg class="chevron" width="7" height="10" viewBox="0 0 7 10" fill="none">
        <path d="M1 1L5 5L1 9" stroke="#C0C4CC" stroke-width="1.5" stroke-linecap="round" />
      </svg>
    </div>

    <!-- 设置列表 -->
    <div class="settings-card">
      <div class="settings-item" @click="handleSettingClick('translation')">
        <span class="settings-label">翻译</span>
        <div class="settings-right">
          <span class="settings-value">英文</span>
          <svg class="chevron" width="7" height="10" viewBox="0 0 7 10" fill="none">
            <path d="M1 1L5 5L1 9" stroke="#C0C4CC" stroke-width="1.5" stroke-linecap="round" />
          </svg>
        </div>
      </div>

      <div class="settings-divider" />

      <div class="settings-item" @click="handleSettingClick('language')">
        <span class="settings-label">语言</span>
        <div class="settings-right">
          <span class="settings-value">简体中文</span>
          <svg class="chevron" width="7" height="10" viewBox="0 0 7 10" fill="none">
            <path d="M1 1L5 5L1 9" stroke="#C0C4CC" stroke-width="1.5" stroke-linecap="round" />
          </svg>
        </div>
      </div>

      <div class="settings-divider" />

      <div class="settings-item" @click="handleSettingClick('cache')">
        <span class="settings-label">清理缓存</span>
        <div class="settings-right">
          <span class="settings-value">0.00M</span>
          <svg class="chevron" width="7" height="10" viewBox="0 0 7 10" fill="none">
            <path d="M1 1L5 5L1 9" stroke="#C0C4CC" stroke-width="1.5" stroke-linecap="round" />
          </svg>
        </div>
      </div>

      <div class="settings-divider" />

      <div class="settings-item" @click="handleSettingClick('about')">
        <span class="settings-label">关于我们</span>
        <div class="settings-right">
          <span class="badge-dot" />
          <svg class="chevron" width="7" height="10" viewBox="0 0 7 10" fill="none">
            <path d="M1 1L5 5L1 9" stroke="#C0C4CC" stroke-width="1.5" stroke-linecap="round" />
          </svg>
        </div>
      </div>
    </div>

    <!-- 退出按钮 -->
    <button class="logout-btn" @click="handleLogout">
      退出
    </button>

    <!-- Toast -->
    <Transition name="toast">
      <div v-if="toastText" class="toast">{{ toastText }}</div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const toastText = ref("");
let toastTimer: ReturnType<typeof setTimeout> | null = null;

function showToast(text: string) {
  if (toastTimer) clearTimeout(toastTimer);
  toastText.value = text;
  toastTimer = setTimeout(() => { toastText.value = ""; }, 2000);
}

function handleBack() {
  router.back();
}

function handleNotificationClick() {
  router.push('/settings/notification');
}

function handleSettingClick(key: string) {
  switch (key) {
    case 'translation':
      showToast('翻译设置');
      break;
    case 'language':
      showToast('语言设置');
      break;
    case 'cache':
      showToast('清理缓存');
      break;
    case 'about':
      showToast('关于我们');
      break;
  }
}

function handleLogout() {
  showToast('退出登录');
}
</script>

<style scoped>
.settings-page {
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

/* 消息通知卡片 */
.notification-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 16px 16px 12px;
  padding: 11px 20px;
  background: #fff;
  border-radius: 20px;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

.notification-label {
  font-size: 16px;
  font-weight: 500;
  color: #222;
}

.chevron {
  flex-shrink: 0;
}

.chevron {
  flex-shrink: 0;
}

/* 设置列表卡片 */
.settings-card {
  margin: 0 16px;
  padding: 4px 20px;
  background: #fff;
  border-radius: 20px;
}

.settings-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 0;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

.settings-label {
  font-size: 16px;
  font-weight: 500;
  color: #222;
}

.settings-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.settings-value {
  font-size: 14px;
  color: #75869c;
  text-align: right;
}

.chevron {
  flex-shrink: 0;
}

.settings-divider {
  height: 0.5px;
  background: #f0f1f3;
}

.badge-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #f53f3f;
}

/* 退出按钮 */
.logout-btn {
  margin: 16px 16px 0;
  height: 56px;
  background: #fff;
  border-radius: 18px;
  font-size: 16px;
  font-weight: 500;
  color: #ff382e;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  transition: opacity 0.2s;
}

.logout-btn:active {
  opacity: 0.8;
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
