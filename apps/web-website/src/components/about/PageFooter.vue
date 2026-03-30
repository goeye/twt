<template>
  <footer class="page-footer">
    <div class="page-footer__inner">
      <div class="page-footer__brand">
        <div class="page-footer__logo">
          <span>T</span>
          <strong>TWT Chat</strong>
        </div>
        <p>统一客服、AI 与业务流程，让服务这件事不再靠蛮力硬扛。</p>
      </div>

      <div class="page-footer__links">
        <a href="#product">产品介绍</a>
        <a href="#solutions">行业方案</a>
        <a href="#faq">常见问题</a>
        <RouterLink to="/links">资源导航</RouterLink>
      </div>

      <div class="page-footer__meta">
        <a href="mailto:support@twtchat.com">support@twtchat.com</a>
        <span>© 2026 TWT. All rights reserved.</span>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { RouterLink } from "vue-router";
</script>

<style scoped>
.page-footer {
  padding: 10px 0 42px;
}

.page-footer__inner {
  display: grid;
  grid-template-columns: minmax(0, 1.3fr) minmax(0, 1fr) minmax(0, 0.9fr);
  gap: 24px;
  width: min(1180px, calc(100% - 48px));
  margin: 0 auto;
  padding: 30px 34px;
  border-radius: 28px;
  border: 1px solid rgba(211, 221, 246, 0.92);
  background: rgba(255, 255, 255, 0.86);
  box-shadow: 0 20px 50px rgba(70, 98, 156, 0.08);
}

.page-footer__logo {
  display: inline-flex;
  align-items: center;
  gap: 12px;
}

.page-footer__logo span {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 12px;
  background: linear-gradient(135deg, #1762ff 0%, #1aa2ff 100%);
  color: #ffffff;
  font-size: 18px;
  font-weight: 800;
}

.page-footer__logo strong {
  font-size: 20px;
  letter-spacing: -0.02em;
}

.page-footer__brand p {
  max-width: 360px;
  margin-top: 16px;
  color: #62728e;
  line-height: 1.8;
}

.page-footer__links {
  display: grid;
  align-content: start;
  gap: 12px;
}

.page-footer__links a,
.page-footer__meta a {
  color: #435169;
  font-weight: 600;
}

.page-footer__meta {
  display: grid;
  align-content: start;
  gap: 12px;
  color: #6b7c95;
  font-size: 14px;
}

@media (max-width: 920px) {
  .page-footer__inner {
    grid-template-columns: 1fr;
    width: min(100% - 32px, 1180px);
  }
}
</style>
