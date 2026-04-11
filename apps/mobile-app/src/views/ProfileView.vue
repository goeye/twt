<template>
  <div class="profile-page">
    <!-- 顶部渐变背景 -->
    <div class="page-bg" />

    <!-- 页面头部 -->
    <div class="page-header">
      <h1 class="page-title">我的</h1>
    </div>

    <!-- 用户信息 -->
    <div class="user-section" @click="handleProfileClick">
      <div class="user-avatar-wrap">
        <img
          src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=128&h=128&fit=crop&crop=face"
          alt="avatar"
          class="user-avatar"
        />
        <span class="online-dot" />
      </div>
      <div class="user-info">
        <span class="user-name">客服主管-粒粒</span>
        <span class="user-role">客服主管</span>
      </div>
      <svg class="chevron" width="7" height="10" viewBox="0 0 7 10" fill="none">
        <path d="M1 1L5 5L1 9" stroke="#C0C4CC" stroke-width="1.5" stroke-linecap="round" />
      </svg>
    </div>

    <!-- 在线状态卡片 -->
    <div class="card status-card">
      <div class="status-info">
        <span class="status-title">在线</span>
        <span class="status-desc">接收新会话和消息通知</span>
      </div>
      <button
        class="toggle"
        :class="{ 'toggle--on': isOnline }"
        @click="isOnline = !isOnline"
      >
        <span class="toggle-knob" />
      </button>
    </div>

    <!-- 菜单卡片 -->
    <div class="card menu-card">
      <div class="menu-item" @click="handleMenuClick('project')">
        <span class="menu-label">所属项目</span>
        <div class="menu-right">
          <span class="menu-value">够上信息科技（合肥…</span>
          <svg class="chevron" width="7" height="10" viewBox="0 0 7 10" fill="none">
            <path d="M1 1L5 5L1 9" stroke="#C0C4CC" stroke-width="1.5" stroke-linecap="round" />
          </svg>
        </div>
      </div>

      <div class="menu-divider" />

      <div class="menu-item" @click="handleMenuClick('contact')">
        <span class="menu-label">联系我们</span>
        <div class="menu-right">
          <svg class="chevron" width="7" height="10" viewBox="0 0 7 10" fill="none">
            <path d="M1 1L5 5L1 9" stroke="#C0C4CC" stroke-width="1.5" stroke-linecap="round" />
          </svg>
        </div>
      </div>

      <div class="menu-divider" />

      <div class="menu-item" @click="handleMenuClick('settings')">
        <span class="menu-label">设置</span>
        <div class="menu-right">
          <span v-if="hasSettingsBadge" class="badge-dot" />
          <svg class="chevron" width="7" height="10" viewBox="0 0 7 10" fill="none">
            <path d="M1 1L5 5L1 9" stroke="#C0C4CC" stroke-width="1.5" stroke-linecap="round" />
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const isOnline = ref(true);
const hasSettingsBadge = ref(true);

function handleProfileClick() {
  // placeholder
}

function handleMenuClick(key: string) {
  if (key === 'settings') {
    router.push('/settings');
  }
  // placeholder for other menu items
}
</script>

<style scoped>
.profile-page {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  position: relative;
}

/* 顶部渐变背景 */
.page-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 240px;
  background: linear-gradient(
    180deg,
    rgba(200, 225, 255, 0.5) 0%,
    rgba(245, 247, 249, 0) 100%
  );
  pointer-events: none;
  z-index: 0;
}

/* 头部 */
.page-header {
  padding: 0 20px;
  padding-top: calc(env(safe-area-inset-top, 44px) + 16px);
  position: relative;
  z-index: 1;
}

.page-title {
  font-size: 24px;
  font-weight: 500;
  color: #222;
  line-height: 1.2;
}

/* 用户信息 */
.user-section {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 20px 24px;
  position: relative;
  z-index: 1;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

.user-avatar-wrap {
  position: relative;
  flex-shrink: 0;
}

.user-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
}

.online-dot {
  position: absolute;
  bottom: 0;
  left: 4px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #00b578;
  border: 2px solid #f5f7f9;
}

.user-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.user-name {
  font-size: 18px;
  font-weight: 500;
  color: #222;
}

.user-role {
  font-size: 13px;
  color: #75869c;
}

.chevron {
  flex-shrink: 0;
}

/* 卡片通用 */
.card {
  margin: 0 16px;
  background: #fff;
  border-radius: 20px;
  position: relative;
  z-index: 1;
}

/* 在线状态卡片 */
.status-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  margin-bottom: 12px;
}

.status-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.status-title {
  font-size: 16px;
  font-weight: 500;
  color: #222;
}

.status-desc {
  font-size: 12px;
  color: #75869c;
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

/* 菜单卡片 */
.menu-card {
  padding: 4px 20px;
}

.menu-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 0;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

.menu-label {
  font-size: 16px;
  font-weight: 500;
  color: #222;
}

.menu-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.menu-value {
  font-size: 14px;
  color: #75869c;
  max-width: 140px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: right;
}

.menu-divider {
  height: 0.5px;
  background: #f0f1f3;
}

.badge-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #f53f3f;
}
</style>
