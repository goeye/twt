<template>
  <nav class="tab-bar">
    <router-link
      v-for="tab in tabs"
      :key="tab.path"
      :to="tab.path"
      class="tab-item"
      :class="{ 'tab-item--active': isActive(tab.path) }"
    >
      <div class="tab-icon" v-html="tab.icon" />
      <span class="tab-label">{{ tab.label }}</span>
    </router-link>
  </nav>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";

const route = useRoute();

const tabs = [
  {
    path: "/session",
    label: "会话",
    icon: `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="1" y="3" width="16" height="11" rx="2" stroke="currentColor" stroke-width="1.5"/>
      <path d="M5 14L3 17" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      <path d="M13 14L15 17" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      <circle cx="5.5" cy="8.5" r="1" fill="currentColor"/>
      <circle cx="9" cy="8.5" r="1" fill="currentColor"/>
      <circle cx="12.5" cy="8.5" r="1" fill="currentColor"/>
    </svg>`
  },
  {
    path: "/chat",
    label: "聊天",
    icon: `<svg width="20" height="18" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17 0H3C1.34 0 0 1.34 0 3V11C0 12.66 1.34 14 3 14H5L7 17.5C7.2 17.81 7.59 18 8 18C8.41 18 8.8 17.81 9 17.5L11 14H17C18.66 14 20 12.66 20 11V3C20 1.34 18.66 0 17 0Z" fill="currentColor"/>
    </svg>`
  },
  {
    path: "/archive",
    label: "档案",
    icon: `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 1H16C16.55 1 17 1.45 17 2V4C17 4.55 16.55 5 16 5H2C1.45 5 1 4.55 1 4V2C1 1.45 1.45 1 2 1Z" stroke="currentColor" stroke-width="1.5"/>
      <path d="M3 5V15C3 16.1 3.9 17 5 17H13C14.1 17 15 16.1 15 15V5" stroke="currentColor" stroke-width="1.5"/>
      <path d="M7 9H11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
    </svg>`
  },
  {
    path: "/profile",
    label: "我的",
    icon: `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="9" cy="5.5" r="3.5" stroke="currentColor" stroke-width="1.5"/>
      <path d="M1.5 16.5C1.5 13.19 4.19 10.5 7.5 10.5H10.5C13.81 10.5 16.5 13.19 16.5 16.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
    </svg>`
  }
];

function isActive(path: string) {
  return route.path === path;
}
</script>

<style scoped>
.tab-bar {
  display: flex;
  align-items: center;
  height: 56px;
  background: #fff;
  border-radius: 24px 24px 0 0;
  box-shadow: 0 -7px 28px rgba(0, 0, 0, 0.02);
  padding: 7px 16px;
  padding-bottom: calc(7px + env(safe-area-inset-bottom, 0px));
  flex-shrink: 0;
  position: relative;
  z-index: 10;
}

.tab-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  color: #222;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

.tab-item--active {
  color: #105eff;
}

.tab-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 20px;
}

.tab-icon :deep(svg) {
  width: 18px;
  height: 18px;
}

.tab-label {
  font-size: 12px;
  font-weight: 500;
  line-height: 1;
}
</style>
