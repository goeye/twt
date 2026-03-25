<template>
  <header class="page-header">
    <div class="page-header__inner">
      <div class="page-header__left">
        <div class="page-header__logo">
          <div class="logo-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" fill="#105EFF"/>
            </svg>
          </div>
          <div class="logo-content">
            <span class="logo-text">TWT</span>
            <span class="logo-tagline">Talk, Work and Thrive Easier</span>
          </div>
        </div>
        <nav class="page-header__nav">
          <a href="#" class="nav-item">产品</a>
          <a href="#" class="nav-item active">了解TWT</a>
          <a href="#" class="nav-item">平台资讯</a>
          <a href="#" class="nav-item">推广联盟</a>
          <a href="#" class="nav-item">联系我们</a>
        </nav>
      </div>
      <div class="page-header__right">
        <button class="lang-btn">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="10" r="8" stroke="currentColor" stroke-width="1.5"/>
            <path d="M2 10h16M10 2c-2.5 3-2.5 13 0 16M10 2c2.5 3 2.5 13 0 16" stroke="currentColor" stroke-width="1.5"/>
          </svg>
        </button>
        <button class="auth-btn">登录/注册</button>
      </div>
    </div>
  </header>
</template>

<style scoped>
.page-header {
  height: 72px;
  background: #fff;
  border-bottom: 1px solid #f0f0f0;
}

.page-header__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1440px;
  height: 100%;
  margin: 0 auto;
  padding: 0 32px;
}

.page-header__left {
  display: flex;
  align-items: center;
  gap: 56px;
}

.page-header__logo {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-icon {
  width: 32px;
  height: 32px;
  flex-shrink: 0;
}

.logo-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.logo-text {
  font-size: 18px;
  font-weight: 700;
  color: #181c29;
  line-height: 1;
}

.logo-tagline {
  font-size: 11px;
  color: #828897;
  line-height: 1;
}

.page-header__nav {
  display: flex;
  align-items: center;
  gap: 16px;
}

.nav-item {
  padding: 8px 12px;
  font-size: 14px;
  color: #181c29;
  border-radius: 8px;
  transition: background 0.2s;
}

.nav-item:hover {
  background: #f5f5f5;
}

.nav-item.active {
  color: #000;
  font-weight: 500;
}

.page-header__right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.lang-btn {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  color: #181c29;
  transition: background 0.2s;
}

.lang-btn:hover {
  background: #f5f5f5;
}

.auth-btn {
  padding: 8px 20px;
  background: #181c29;
  color: #fff;
  font-size: 14px;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  transition: opacity 0.2s;
}

.auth-btn:hover {
  opacity: 0.9;
}
</style>
