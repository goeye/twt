<template>
  <header class="site-header">
    <div class="site-header__inner">
      <router-link to="/links" class="site-header__logo">
        <strong>TWT</strong>
        <span class="site-header__logo-sub">资源导航</span>
      </router-link>
      <nav class="site-header__nav">
        <router-link to="/">官网首页</router-link>
        <a href="https://www.twt.com/zh-CN/pricing" target="_blank" rel="noopener noreferrer">价格</a>
        <router-link to="/links">资源导航</router-link>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.site-header {
  position: sticky;
  top: 0;
  z-index: 100;
  height: var(--links-header-height);
  background: #fff;
  border-bottom: 1px solid var(--links-color-border);
}

.site-header__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: var(--links-content-max-width);
  margin: 0 auto;
  padding: 0 var(--links-space-24);
  height: 100%;
}

.site-header__logo {
  display: flex;
  align-items: baseline;
  gap: var(--links-space-8);
  font-size: var(--links-font-size-xl);
  color: var(--links-color-primary);
}

.site-header__logo strong {
  font-weight: 700;
}

.site-header__logo-sub {
  font-size: var(--links-font-size-sm);
  color: var(--links-color-text-secondary);
}

.site-header__nav {
  display: flex;
  align-items: center;
  gap: var(--links-space-24);
}

.site-header__nav a {
  font-size: var(--links-font-size-md);
  color: var(--links-color-text-primary);
  transition: color var(--links-motion-fast);
}

.site-header__nav a:hover,
.site-header__nav a.router-link-active {
  color: var(--links-color-primary);
}
</style>
