<template>
  <header class="page-header">
    <div class="page-header__inner">
      <a href="#top" class="page-header__logo">
        <span class="logo-mark">T</span>
        <span class="logo-text">TWT</span>
      </a>

      <nav class="page-header__nav">
        <a href="#product">产品</a>
        <a href="#features">功能</a>
        <a href="#solutions">方案</a>
        <a href="#news">资讯</a>
        <a href="#faq">常见问题</a>
      </nav>

      <div class="page-header__actions">
        <RouterLink to="/links" class="page-header__link">资源导航</RouterLink>
        <a href="#consult" class="page-header__cta">立即咨询</a>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { RouterLink } from "vue-router";
</script>

<style scoped>
.page-header {
  position: sticky;
  top: 0;
  z-index: 60;
  padding-top: 18px;
}

.page-header__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  width: min(1180px, calc(100% - 48px));
  min-height: 72px;
  margin: 0 auto;
  padding: 0 22px;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.82);
  border: 1px solid rgba(214, 225, 255, 0.92);
  box-shadow: 0 18px 40px rgba(64, 94, 154, 0.08);
  backdrop-filter: blur(16px);
}

.page-header__logo {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: #0f172a;
  font-size: 20px;
  font-weight: 800;
  letter-spacing: 0.04em;
}

.logo-mark {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 12px;
  background: linear-gradient(135deg, #1762ff 0%, #1aa2ff 100%);
  color: #ffffff;
  font-size: 18px;
}

.page-header__nav,
.page-header__actions {
  display: flex;
  align-items: center;
  gap: 18px;
}

.page-header__nav a,
.page-header__link {
  color: #4c5b75;
  font-size: 14px;
  font-weight: 600;
  transition: color 180ms ease;
}

.page-header__nav a:hover,
.page-header__link:hover {
  color: #105eff;
}

.page-header__cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 104px;
  min-height: 42px;
  padding: 0 18px;
  border-radius: 999px;
  background: #101828;
  color: #ffffff;
  font-size: 14px;
  font-weight: 700;
}

@media (max-width: 960px) {
  .page-header__inner {
    width: min(100% - 32px, 1180px);
  }

  .page-header__nav {
    display: none;
  }
}

@media (max-width: 640px) {
  .page-header {
    padding-top: 12px;
  }

  .page-header__inner {
    min-height: 62px;
    padding: 0 16px;
    gap: 12px;
  }

  .page-header__actions {
    gap: 10px;
  }

  .page-header__link {
    display: none;
  }
}
</style>
