<template>
  <footer class="site-footer">
    <div class="container">
      <div class="footer-content">
        <div class="footer-col">
          <h4>{{ t.product }}</h4>
          <RouterLink to="/">Chat</RouterLink>
          <a href="#">Community</a>
          <span class="disabled">Link</span>
          <span class="disabled">Domains</span>
          <span class="disabled">Mail</span>
        </div>

        <div class="footer-col">
          <h4>{{ t.exploreChat }}</h4>
          <a href="#">{{ t.features }}</a>
          <a href="#">{{ t.pricing }}</a>
          <a href="#">{{ t.downloadCenter }}</a>
          <RouterLink to="/updates">{{ t.changelog }}</RouterLink>
          <RouterLink to="/help-center">{{ t.helpCenter }}</RouterLink>
        </div>

        <div class="footer-col">
          <h4>{{ t.aboutUs }}</h4>
          <a href="#">{{ t.about }}{{ tenant.name }}</a>
          <a href="#">{{ t.news }}</a>
          <a href="#">{{ t.affiliate }}</a>
          <a href="#">{{ t.contact }}</a>
          <a href="#">{{ t.partner }}</a>
        </div>

        <div class="footer-col">
          <h4>{{ t.legal }}</h4>
          <a href="#">{{ t.terms }}</a>
          <a href="#">{{ t.privacy }}</a>
        </div>

        <div class="footer-col footer-brand">
          <div class="brand-logo">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M4 4h6v6H4V4zm10 0h6v6h-6V4zM4 14h6v6H4v-6zm10 0h6v6h-6v-6z" fill="currentColor"/>
            </svg>
            <span>{{ tenant.name }}</span>
          </div>
          <a :href="`mailto:${tenant.email.replyTo}`" class="support-email">{{ tenant.email.replyTo }}</a>
          <div class="social-links">
            <a href="#" class="social-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            <a href="#" class="social-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            <a href="#" class="social-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
            <a href="#" class="social-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z"/>
              </svg>
            </a>
            <a href="#" class="social-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
            </a>
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
        <p class="copyright">© 2025 {{ tenant.website.footer.companyName }}</p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { RouterLink } from "vue-router";
import { useTenant } from '@twt/branding';
import { useT } from '../../composables/useLocale';

const tenant = useTenant();

const t = useT({
  'zh-CN': {
    product: '产品', exploreChat: '探索Chat', aboutUs: '关于我们', legal: '法律事务',
    features: '功能介绍', pricing: '版本价格', downloadCenter: '下载中心', changelog: '更新日志', helpCenter: '帮助中心',
    about: '了解', news: '平台资讯', affiliate: '推广联盟', contact: '联系我们', partner: '合作伙伴',
    terms: '服务条款', privacy: '隐私协议',
  },
  'zh-TW': {
    product: '產品', exploreChat: '探索Chat', aboutUs: '關於我們', legal: '法律事務',
    features: '功能介紹', pricing: '版本價格', downloadCenter: '下載中心', changelog: '更新日誌', helpCenter: '幫助中心',
    about: '了解', news: '平台資訊', affiliate: '推廣聯盟', contact: '聯繫我們', partner: '合作夥伴',
    terms: '服務條款', privacy: '隱私協議',
  },
  'en': {
    product: 'Product', exploreChat: 'Explore Chat', aboutUs: 'About Us', legal: 'Legal',
    features: 'Features', pricing: 'Pricing', downloadCenter: 'Downloads', changelog: 'Changelog', helpCenter: 'Help Center',
    about: 'About', news: 'News', affiliate: 'Affiliate', contact: 'Contact', partner: 'Partners',
    terms: 'Terms of Service', privacy: 'Privacy Policy',
  },
});
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
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.2s;
  text-decoration: none;
  color: rgba(255, 255, 255, 0.7);
}

.social-icon:hover {
  opacity: 0.8;
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
