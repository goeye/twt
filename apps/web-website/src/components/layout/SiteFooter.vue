<template>
  <footer class="site-footer">
    <div class="container">
      <div class="footer-content">
        <div class="footer-col">
          <h4>产品</h4>
          <a href="#">Chat</a>
          <a href="#">Community</a>
          <span class="disabled">Link</span>
          <span class="disabled">Domains</span>
          <span class="disabled">Mail</span>
        </div>

        <div class="footer-col">
          <h4>探索Chat</h4>
          <a href="#">功能介绍</a>
          <a href="#">版本价格</a>
          <a href="#">下载中心</a>
          <a href="#">帮助中心</a>
        </div>

        <div class="footer-col">
          <h4>关于我们</h4>
          <a href="#">了解TWT</a>
          <a href="#">平台资讯</a>
          <a href="#">推广联盟</a>
          <a href="#">联系我们</a>
          <a href="#">合作伙伴</a>
        </div>

        <div class="footer-col">
          <h4>法律事务</h4>
          <a href="#">服务条款</a>
          <a href="#">隐私协议</a>
        </div>

        <div class="footer-col footer-brand">
          <div class="brand-logo">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M4 4h6v6H4V4zm10 0h6v6h-6V4zM4 14h6v6H4v-6zm10 0h6v6h-6v-6z" fill="currentColor"/>
            </svg>
            <span>TWT</span>
          </div>
          <a href="mailto:support@twt.com" class="support-email">support@twt.com</a>
          <div class="social-links">
            <a href="#" class="social-icon">𝕏</a>
            <a href="#" class="social-icon">f</a>
            <a href="#" class="social-icon">in</a>
            <a href="#" class="social-icon">◉</a>
            <a href="#" class="social-icon">W</a>
          </div>
          <div class="app-downloads">
            <a href="#" class="download-btn">Android</a>
            <a href="#" class="download-btn">App Store</a>
          </div>
        </div>
      </div>

      <div class="footer-bottom">
        <div class="footer-badges">
          <span class="badge">GDPR COMPLIANT</span>
          <span class="badge">ISO 27001 CERTIFIED</span>
        </div>
        <p class="copyright">© 2025 TWT. Powered by TWT</p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
</script>

<style scoped>
.site-footer {
  background: #1a1a2e;
  color: #fff;
  padding: 60px 0 24px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 40px;
  margin-bottom: 40px;
}

.footer-col h4 {
  font-size: 14px;
  font-weight: 600;
  margin: 0 0 16px;
  color: #fff;
}

.footer-col a {
  display: block;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  margin-bottom: 12px;
  transition: color 0.2s;
}

.footer-col a:hover {
  color: #fff;
}

.footer-col .disabled {
  display: block;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.3);
  margin-bottom: 12px;
  cursor: not-allowed;
}

.footer-brand {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.brand-logo {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: 600;
}

.brand-logo svg {
  color: #1677ff;
}

.support-email {
  color: #1677ff !important;
  margin-bottom: 0 !important;
}

.social-links {
  display: flex;
  gap: 12px;
}

.social-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  line-height: 1;
  transition: background 0.2s;
  text-decoration: none;
  color: rgba(255, 255, 255, 0.7);
}

.social-icon:hover {
  background: rgba(255, 255, 255, 0.2);
}

.app-downloads {
  display: flex;
  gap: 8px;
}

.download-btn {
  padding: 8px 16px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  font-size: 12px;
  background: transparent;
}

.footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.footer-badges {
  display: flex;
  gap: 12px;
}

.badge {
  padding: 6px 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  font-size: 11px;
  color: rgba(255, 255, 255, 0.7);
}

.copyright {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.5);
  margin: 0;
}

@media (max-width: 768px) {
  .footer-content {
    grid-template-columns: 1fr;
  }

  .footer-bottom {
    flex-direction: column;
    gap: 16px;
  }
}
</style>
