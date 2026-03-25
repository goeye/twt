<template>
  <footer class="page-footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-col">
          <h4>产品</h4>
          <a href="#">Chat</a>
          <a href="#">Community</a>
          <a href="#" class="disabled">Link</a>
          <a href="#" class="disabled">Domains</a>
          <a href="#" class="disabled">Mail</a>
        </div>
        <div class="footer-col">
          <h4>关于我们</h4>
          <a href="#">了解TWT</a>
          <a href="#">平台资讯</a>
          <a href="#">推广联盟</a>
          <a href="#">联系我们</a>
        </div>
        <div class="footer-col">
          <h4>法律事务</h4>
          <a href="#">服务条款</a>
          <a href="#">隐私协议</a>
        </div>
        <div class="footer-col">
          <div class="footer-logo">
            <div class="logo-icon">TWT</div>
          </div>
          <a href="mailto:support@twt.com" class="email">support@twt.com</a>
          <div class="social-icons">
            <a href="#" class="social-icon">📱</a>
            <a href="#" class="social-icon">💬</a>
            <a href="#" class="social-icon">📧</a>
          </div>
          <p class="copyright">© 2025 TWT. Powered by TWT</p>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.page-footer {
  padding: 44px 0;
  background: #1d1e2e;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 120px;
}

.footer-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 32px;
}

.footer-col h4 {
  font-size: 15px;
  line-height: 22px;
  color: #999;
  margin-bottom: 18px;
}

.footer-col a {
  display: block;
  font-size: 15px;
  line-height: 22px;
  color: #fff;
  margin-bottom: 18px;
  transition: opacity 0.2s;
}

.footer-col a:hover {
  opacity: 0.8;
}

.footer-col a.disabled {
  color: #666;
  pointer-events: none;
  cursor: default;
}

.footer-logo {
  margin-bottom: 16px;
}

.logo-icon {
  font-size: 20px;
  font-weight: 700;
  color: #fff;
}

.email {
  text-decoration: underline;
  margin-bottom: 24px;
}

.social-icons {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
}

.social-icon {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #3d3e4b;
  border-radius: 50%;
  font-size: 18px;
}

.copyright {
  font-size: 14px;
  line-height: 22px;
  color: #bbb;
  margin: 0;
}
</style>
