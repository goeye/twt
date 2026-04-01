<template>
  <div class="cw-page" :class="{ 'cw-page--with-hero': showLeftPanel }">
    <!-- Left Hero Panel -->
    <aside v-if="showLeftPanel" class="cw-hero-panel">
      <div class="cw-hero-panel__content">
        <img :src="BRAND_LOGO" class="cw-hero-panel__logo" alt="Logo" />
        <h1 class="cw-hero-panel__title">{{ heroTitle }}</h1>
        <p class="cw-hero-panel__desc">{{ heroDesc }}</p>
      </div>
    </aside>

    <!-- Chat Widget -->
    <div class="cw-app">
      <router-view />
      <VersionUpdateModal
        :open="versionState.hasUpdate"
        :notes="versionState.notes"
        @dismiss="dismissUpdate"
        @refresh="doRefresh"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import VersionUpdateModal from "./components/VersionUpdateModal.vue";
import { useVersionCheck } from "./lib/useVersionCheck";

const { versionState, doRefresh, dismissUpdate } = useVersionCheck();

const BRAND_LOGO = "data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20width%3D%2764%27%20height%3D%2764%27%20viewBox%3D%270%200%2064%2064%27%3E%3Crect%20width%3D%2764%27%20height%3D%2764%27%20fill%3D%27%232563EB%27%2F%3E%3Cpath%20d%3D%27M24%2018h14c6%200%2010%204%2010%2010v8c0%206-4%2010-10%2010h-6l-8%206v-6h-2c-6%200-10-4-10-10V28c0-6%204-10%2010-10z%27%20fill%3D%27none%27%20stroke%3D%27white%27%20stroke-width%3D%274%27%20stroke-linecap%3D%27round%27%20stroke-linejoin%3D%27round%27%2F%3E%3Cpath%20d%3D%27M24%2028h0.01M32%2028h0.01M40%2028h0.01%27%20stroke%3D%27white%27%20stroke-width%3D%274%27%20stroke-linecap%3D%27round%27%2F%3E%3Cpath%20d%3D%27M16%2017l2.5%202.5L22%2016%27%20stroke%3D%27white%27%20stroke-width%3D%273%27%20stroke-linecap%3D%27round%27%20stroke-linejoin%3D%27round%27%2F%3E%3C%2Fsvg%3E";

/** 模拟配置：是否显示左侧文案 */
const showLeftPanel = ref(true);

/** 模拟配置：左侧文案标题 */
const heroTitle = ref("你好!");

/** 模拟配置：左侧文案描述 */
const heroDesc = ref("欢迎来到我们的聊天页面。\n需要帮助？我们会为你实时解答与跟进。");
</script>

<style scoped>
/* Page wrapper */
.cw-page {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: stretch;
}

.cw-page--with-hero {
  display: grid;
  grid-template-columns: 1fr minmax(360px, 420px);
  max-width: 1100px;
  margin: 0 auto;
  gap: 0;
}

/* Left Hero Panel */
.cw-hero-panel {
  display: flex;
  align-items: center;
  padding: 40px 48px;
}

.cw-hero-panel__content {
  max-width: 400px;
}

.cw-hero-panel__logo {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 24px;
}

.cw-hero-panel__title {
  font-size: 36px;
  font-weight: 800;
  color: var(--agent-color-text-primary, #1a1a1a);
  margin: 0 0 16px;
  line-height: 1.2;
}

.cw-hero-panel__desc {
  font-size: 16px;
  line-height: 1.6;
  color: var(--agent-color-text-secondary, #555);
  margin: 0;
  white-space: pre-line;
}

/* Chat Widget */
.cw-app {
  display: flex;
  flex-direction: column;
  height: 100%;
  max-width: 420px;
  width: 100%;
  background: #fff;
  box-shadow: 0 0 40px rgba(0, 0, 0, 0.08);
  position: relative;
  overflow: visible;
}

.cw-page--with-hero .cw-app {
  margin: 0;
  border-radius: 16px;
  margin-top: 24px;
  margin-bottom: 24px;
  overflow: hidden;
}

.cw-page:not(.cw-page--with-hero) .cw-app {
  margin: 0 auto;
}

/* Mobile: hide hero panel, widget goes full-screen */
@media (max-width: 768px) {
  .cw-page--with-hero {
    display: flex;
  }

  .cw-hero-panel {
    display: none;
  }

  .cw-page--with-hero .cw-app {
    margin: 0 auto;
    border-radius: 0;
    max-width: 100%;
  }
}
</style>
