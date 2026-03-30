<template>
  <header class="marketing-header">
    <nav class="main-nav">
      <div class="container">
        <div class="nav-content">
          <div class="logo">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M4 4h6v6H4V4zm10 0h6v6h-6V4zM4 14h6v6H4v-6zm10 0h6v6h-6v-6z" fill="currentColor"/>
            </svg>
            <div class="logo-text">
              <span class="brand">TWT</span>
              <span class="tagline">Talk, Work and Thrive Easier</span>
            </div>
          </div>
          <div class="nav-menu">
            <a href="#">产品</a>
            <a href="#">了解TWT</a>
            <a href="#">平台资讯</a>
            <a href="#">推广联盟</a>
            <a href="#">联系我们</a>
          </div>
          <div class="nav-actions">
            <button class="lang-btn">🌐</button>
            <n-button quaternary class="login-btn">登录/注册</n-button>
          </div>
        </div>
      </div>
    </nav>

    <nav v-if="showProductNav" class="product-nav">
      <div class="container">
        <div class="product-nav-content">
          <div class="product-logo">
            <span class="chat-icon">💬</span>
            <span class="product-name">Chat</span>
          </div>
          <div class="product-links">
            <a href="#">下载</a>
            <a href="#">功能介绍</a>
            <a href="#">版本价格</a>
            <a href="#">帮助中心</a>
          </div>
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { NButton } from 'naive-ui';

defineProps<{
  showProductNav?: boolean;
}>();
</script>

<style scoped>
.marketing-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: #fff;
}

.main-nav .container {
  max-width: 100%;
  padding: 0 48px;
}

/* 主导航 */
.main-nav {
  height: 64px;
  border-bottom: 1px solid var(--links-color-border);
  background: #fff;
}

.nav-content {
  display: flex;
  align-items: center;
  height: 100%;
  gap: 48px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
}

.logo svg {
  color: var(--links-color-primary);
}

.logo-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.brand {
  font-weight: 600;
  font-size: 18px;
  color: var(--links-color-text-primary);
  line-height: 1;
}

.tagline {
  font-size: 11px;
  font-weight: 400;
  color: var(--links-color-text-secondary);
  line-height: 1;
}

.nav-menu {
  display: flex;
  gap: 32px;
  align-items: center;
}

.nav-menu a {
  color: var(--links-color-text-primary);
  text-decoration: none;
  font-size: 14px;
  transition: color var(--links-motion-fast);
  line-height: 64px;
}

.nav-menu a:hover {
  color: var(--links-color-primary);
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-left: auto;
}

.lang-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: background var(--links-motion-fast);
}

.lang-btn:hover {
  background: var(--links-color-bg-page);
}

.login-btn {
  background: #000 !important;
  color: #fff !important;
  border-radius: 20px !important;
  padding: 0 20px !important;
}

/* 产品子导航 */
.product-nav {
  height: 56px;
  background: transparent;
}

.product-nav-content {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 48px;
}

.product-logo {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
}

.chat-icon {
  font-size: 20px;
}

.product-name {
  font-size: 16px;
  color: var(--links-color-text-primary);
}

.product-links {
  display: flex;
  gap: 32px;
}

.product-links a {
  color: var(--links-color-text-primary);
  text-decoration: none;
  font-size: 14px;
  transition: color var(--links-motion-fast);
}

.product-links a:hover {
  color: var(--links-color-primary);
}

@media (max-width: 768px) {
  .nav-menu {
    display: none;
  }

  .tagline {
    display: none;
  }

  .product-links {
    gap: 16px;
    font-size: 13px;
  }
}
</style>
