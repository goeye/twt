<template>
  <div class="link-page">
    <!-- 导航：仅 Logo + 下载按钮 -->
    <header class="link-header">
      <div class="container">
        <div class="header-inner">
          <div class="logo">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M4 4h6v6H4V4zm10 0h6v6h-6V4zM4 14h6v6H4v-6zm10 0h6v6h-6v-6z" fill="currentColor"/>
            </svg>
            <span class="brand">TWT Link</span>
          </div>
          <a href="#download" class="download-btn">{{ t.download }}</a>
        </div>
      </div>
    </header>

    <!-- Hero -->
    <section class="hero">
      <div class="container">
        <h1>{{ t.heroTitle }}</h1>
        <p class="subtitle">{{ t.heroSubtitle }}</p>
        <a href="https://www.twt.com/contact" target="_blank" class="cta-btn">{{ t.ctaBtn }}</a>
        <p class="hint">{{ t.heroHint }}</p>
      </div>
    </section>

    <!-- 平台亮点 -->
    <section class="trust">
      <div class="container">
        <div class="trust-grid">
          <div class="trust-item">
            <strong>{{ t.trust1Title }}</strong>
            <span>{{ t.trust1Desc }}</span>
          </div>
          <div class="trust-item">
            <strong>{{ t.trust2Title }}</strong>
            <span>{{ t.trust2Desc }}</span>
          </div>
          <div class="trust-item">
            <strong>{{ t.trust3Title }}</strong>
            <span>{{ t.trust3Desc }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Why 区 -->
    <section class="why">
      <div class="container">
        <h2>{{ t.whyTitle }}</h2>
        <div class="why-list">
          <div v-for="item in whyItems" :key="item.title" class="why-item">
            <div class="why-icon">{{ item.icon }}</div>
            <div>
              <h3>{{ item.title }}</h3>
              <p>{{ item.desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 功能特性 -->
    <section class="features">
      <div class="container">
        <h2>{{ t.featTitle }}</h2>
        <div class="feat-grid">
          <div v-for="feat in featItems" :key="feat.title" class="feat-card">
            <div class="feat-icon">{{ feat.icon }}</div>
            <h3>{{ feat.title }}</h3>
            <p>{{ feat.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 适用场景 -->
    <section class="scenarios">
      <div class="container">
        <h2>{{ t.scenarioTitle }}</h2>
        <div class="scenario-grid">
          <div v-for="s in scenarios" :key="s.title" class="scenario-card">
            <h3>{{ s.title }}</h3>
            <p>{{ s.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 下载区 -->
    <section id="download" class="download">
      <div class="container">
        <h2>{{ t.downloadTitle }}</h2>
        <p>{{ t.downloadDesc }}</p>
        <div class="download-btns">
          <a href="#" class="dl-btn">iOS App Store</a>
          <a href="#" class="dl-btn">Android</a>
          <a href="#" class="dl-btn">Windows</a>
          <a href="#" class="dl-btn">macOS</a>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="cta-section">
      <div class="container">
        <div class="cta-box">
          <h2>{{ t.ctaTitle }}</h2>
          <a href="https://www.twt.com/contact" target="_blank" class="cta-btn cta-btn--white">{{ t.ctaBtn }}</a>
        </div>
      </div>
    </section>

    <SiteFooter />
  </div>
</template>

<script setup lang="ts">
import SiteFooter from '../components/layout/SiteFooter.vue';
import { useT } from '../composables/useLocale';

const t = useT({
  'zh-CN': {
    download: '下载',
    heroTitle: '数据在你手中\n企业级私有化通讯，安全可控',
    heroSubtitle: 'TWT Link 支持私有化部署，端对端加密，全平台多端同步。让企业内部沟通真正做到数据不出门、权限可管控。',
    ctaBtn: '预约演示',
    heroHint: '支持 Docker / K8s 快速部署',
    trust1Title: '私有化部署', trust1Desc: '数据完全自主可控',
    trust2Title: '端对端加密', trust2Desc: '服务端无法读取内容',
    trust3Title: '全端同步', trust3Desc: 'iOS / Android / Windows / macOS',
    whyTitle: '为什么选择 TWT Link？',
    featTitle: '核心功能',
    scenarioTitle: '适用场景',
    downloadTitle: '立即下载',
    downloadDesc: '支持 iOS、Android、Windows、macOS 全平台',
    ctaTitle: '选择 TWT Link\n让企业通讯数据真正掌握在自己手中',
  },
  'zh-TW': {
    download: '下載',
    heroTitle: '數據在你手中\n企業級私有化通訊，安全可控',
    heroSubtitle: 'TWT Link 支援私有化部署，端對端加密，全平台多端同步。讓企業內部溝通真正做到數據不出門、權限可管控。',
    ctaBtn: '預約演示',
    heroHint: '支援 Docker / K8s 快速部署',
    trust1Title: '私有化部署', trust1Desc: '數據完全自主可控',
    trust2Title: '端對端加密', trust2Desc: '服務端無法讀取內容',
    trust3Title: '全端同步', trust3Desc: 'iOS / Android / Windows / macOS',
    whyTitle: '為什麼選擇 TWT Link？',
    featTitle: '核心功能',
    scenarioTitle: '適用場景',
    downloadTitle: '立即下載',
    downloadDesc: '支援 iOS、Android、Windows、macOS 全平台',
    ctaTitle: '選擇 TWT Link\n讓企業通訊數據真正掌握在自己手中',
  },
  'en': {
    download: 'Download',
    heroTitle: 'Your Data, Your Control\nEnterprise-grade private messaging',
    heroSubtitle: 'TWT Link supports private deployment, end-to-end encryption, and multi-device sync — keeping your communications secure and fully under your control.',
    ctaBtn: 'Book a Demo',
    heroHint: 'Supports Docker / K8s deployment',
    trust1Title: 'Private Deployment', trust1Desc: 'Data stays on your servers',
    trust2Title: 'End-to-End Encrypted', trust2Desc: 'Server cannot read messages',
    trust3Title: 'All-Platform Sync', trust3Desc: 'iOS / Android / Windows / macOS',
    whyTitle: 'Why TWT Link?',
    featTitle: 'Core Features',
    scenarioTitle: 'Use Cases',
    downloadTitle: 'Download Now',
    downloadDesc: 'Available on iOS, Android, Windows, and macOS',
    ctaTitle: 'Choose TWT Link\nTake full control of your enterprise communications',
  },
});

const whyItems = useT({
  'zh-CN': [
    { icon: '🔒', title: '数据存在你自己的服务器', desc: '所有消息、文件、通话记录均存储在企业自有服务器，不经过任何第三方云端，彻底杜绝数据泄露风险。' },
    { icon: '🔐', title: '消息加密传输，服务端无法读取', desc: '采用端对端加密技术，消息在发送端加密、接收端解密，即使服务器被攻击，内容也无法被还原。' },
    { icon: '📱', title: '手机、电脑，随时随地在线', desc: 'iOS、Android、Windows、macOS 全端覆盖，消息实时同步，多设备同时在线，离线消息上线后自动补齐。' },
    { icon: '👥', title: '谁能聊、聊什么，管理员说了算', desc: '支持禁止指定成员私聊、部分频道对特定成员不可见，管理员可随时强制退出、禁言或注销账号。' },
    { icon: '💬', title: '单聊、群聊、文件、音视频，一个软件全搞定', desc: '支持大规模群组、大文件传输、语音视频通话、消息引用与 @提及，满足企业日常沟通的全部场景。' },
  ],
  'zh-TW': [
    { icon: '🔒', title: '數據存在你自己的伺服器', desc: '所有訊息、檔案、通話記錄均存儲在企業自有伺服器，不經過任何第三方雲端，徹底杜絕數據洩露風險。' },
    { icon: '🔐', title: '訊息加密傳輸，服務端無法讀取', desc: '採用端對端加密技術，訊息在發送端加密、接收端解密，即使伺服器被攻擊，內容也無法被還原。' },
    { icon: '📱', title: '手機、電腦，隨時隨地在線', desc: 'iOS、Android、Windows、macOS 全端覆蓋，訊息即時同步，多設備同時在線，離線訊息上線後自動補齊。' },
    { icon: '👥', title: '誰能聊、聊什麼，管理員說了算', desc: '支援禁止指定成員私聊、部分頻道對特定成員不可見，管理員可隨時強制退出、禁言或登出帳號。' },
    { icon: '💬', title: '單聊、群聊、檔案、音視頻，一個軟體全搞定', desc: '支援大規模群組、大檔案傳輸、語音視頻通話、訊息引用與 @提及，滿足企業日常溝通的全部場景。' },
  ],
  'en': [
    { icon: '🔒', title: 'Data stays on your own servers', desc: 'All messages, files, and call records are stored on your enterprise servers — no third-party cloud involved.' },
    { icon: '🔐', title: 'End-to-end encrypted — server cannot read', desc: 'Messages are encrypted at the sender and decrypted at the receiver. Even if the server is compromised, content cannot be recovered.' },
    { icon: '📱', title: 'Stay connected on any device', desc: 'iOS, Android, Windows, macOS — all in sync. Multiple devices online simultaneously, offline messages auto-delivered on reconnect.' },
    { icon: '👥', title: 'Admins control who can chat and what they see', desc: 'Restrict private messaging, hide channels from specific members, force-logout, mute, or deactivate accounts at any time.' },
    { icon: '💬', title: 'DMs, groups, files, voice & video — all in one app', desc: 'Large group chats, big file transfers, voice/video calls, message quoting and @mentions — everything your team needs.' },
  ],
});

const featItems = useT({
  'zh-CN': [
    { icon: '🔒', title: '私有化部署', desc: '数据存储在企业自有服务器，完全自主可控' },
    { icon: '🔐', title: '端对端加密', desc: '消息全程加密，服务端无法读取内容' },
    { icon: '📱', title: '全平台同步', desc: 'iOS / Android / Windows / macOS 多端实时同步' },
    { icon: '👥', title: '权限精细管控', desc: '禁止私聊、内容可见性控制、成员分级管理' },
    { icon: '💬', title: '即时通讯全功能', desc: '单聊、群聊、文件传输、语音视频通话' },
    { icon: '⚡', title: '快速私有化部署', desc: 'Docker / K8s 支持，快速完成企业内网部署' },
  ],
  'zh-TW': [
    { icon: '🔒', title: '私有化部署', desc: '數據存儲在企業自有伺服器，完全自主可控' },
    { icon: '🔐', title: '端對端加密', desc: '訊息全程加密，服務端無法讀取內容' },
    { icon: '📱', title: '全平台同步', desc: 'iOS / Android / Windows / macOS 多端即時同步' },
    { icon: '👥', title: '權限精細管控', desc: '禁止私聊、內容可見性控制、成員分級管理' },
    { icon: '💬', title: '即時通訊全功能', desc: '單聊、群聊、檔案傳輸、語音視頻通話' },
    { icon: '⚡', title: '快速私有化部署', desc: 'Docker / K8s 支援，快速完成企業內網部署' },
  ],
  'en': [
    { icon: '🔒', title: 'Private Deployment', desc: 'Data stored on your own servers — fully self-controlled' },
    { icon: '🔐', title: 'End-to-End Encryption', desc: 'Messages encrypted throughout — server cannot read content' },
    { icon: '📱', title: 'All-Platform Sync', desc: 'iOS / Android / Windows / macOS — real-time multi-device sync' },
    { icon: '👥', title: 'Granular Permission Control', desc: 'Restrict DMs, control channel visibility, tiered member management' },
    { icon: '💬', title: 'Full Messaging Suite', desc: 'DMs, group chats, file transfer, voice & video calls' },
    { icon: '⚡', title: 'Fast Private Deployment', desc: 'Docker / K8s support — deploy on your intranet quickly' },
  ],
});

const scenarios = useT({
  'zh-CN': [
    { title: '合规行业：数据不能上公有云', desc: '监管要求数据本地化存储？TWT Link 私有化部署，满足金融、法律、医疗等行业合规要求，消息记录完整留存，随时可审计。' },
    { title: '企业内部协作：不想用微信、钉钉', desc: '员工离职带走客户资源？TWT Link 权限管控让企业完全掌控通讯数据，成员管理一键到位。' },
    { title: '跨国团队：沟通不能掉线', desc: '全平台多端同步，离线消息自动补齐，语音视频通话内网优先，低延迟稳定连接。' },
  ],
  'zh-TW': [
    { title: '合規行業：數據不能上公有雲', desc: '監管要求數據本地化存儲？TWT Link 私有化部署，滿足金融、法律、醫療等行業合規要求，訊息記錄完整留存，隨時可審計。' },
    { title: '企業內部協作：不想用微信、釘釘', desc: '員工離職帶走客戶資源？TWT Link 權限管控讓企業完全掌控通訊數據，成員管理一鍵到位。' },
    { title: '跨國團隊：溝通不能掉線', desc: '全平台多端同步，離線訊息自動補齊，語音視頻通話內網優先，低延遲穩定連接。' },
  ],
  'en': [
    { title: 'Regulated Industries: Data Cannot Go to Public Cloud', desc: 'Compliance requires local data storage? TWT Link private deployment meets requirements for finance, legal, healthcare, and more — full audit trail included.' },
    { title: 'Internal Teams: Break Free from WeChat & DingTalk', desc: 'Worried about employees taking client data when they leave? TWT Link gives you full control over communications and member access.' },
    { title: 'Distributed Teams: Always Connected', desc: 'Multi-platform sync, offline message delivery, intranet-first voice/video calls — low latency, always reliable.' },
  ],
});
</script>

<style scoped>
.link-page {
  background: #fff;
  font-family: inherit;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

/* Header */
.link-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: #fff;
  border-bottom: 1px solid #eee;
  height: 64px;
  display: flex;
  align-items: center;
}

.header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #1677ff;
  font-weight: 600;
  font-size: 18px;
}

.logo svg { color: #1677ff; }

.download-btn {
  padding: 8px 24px;
  background: #1677ff;
  color: #fff;
  border-radius: 20px;
  text-decoration: none;
  font-size: 14px;
  transition: background 0.2s;
}

.download-btn:hover { background: #0958d9; }

/* Hero */
.hero {
  padding: 100px 0 80px;
  text-align: center;
  background: linear-gradient(180deg, #f0f5ff 0%, #fff 100%);
}

.hero h1 {
  font-size: 48px;
  font-weight: 700;
  line-height: 1.25;
  white-space: pre-line;
  margin: 0 0 24px;
  color: #0a0a0a;
}

.hero .subtitle {
  font-size: 18px;
  color: #555;
  line-height: 1.7;
  max-width: 640px;
  margin: 0 auto 40px;
}

.cta-btn {
  display: inline-block;
  padding: 14px 40px;
  background: #1677ff;
  color: #fff;
  border-radius: 28px;
  text-decoration: none;
  font-size: 16px;
  font-weight: 500;
  transition: background 0.2s;
}

.cta-btn:hover { background: #0958d9; }

.hint {
  margin: 16px 0 0;
  font-size: 13px;
  color: #999;
}

/* Trust */
.trust {
  padding: 48px 0;
  background: #fff;
  border-bottom: 1px solid #f0f0f0;
}

.trust-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  text-align: center;
}

.trust-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.trust-item strong {
  font-size: 18px;
  font-weight: 600;
  color: #1677ff;
}

.trust-item span {
  font-size: 14px;
  color: #666;
}

/* Why */
.why {
  padding: 80px 0;
  background: #fafafa;
}

.why h2 {
  text-align: center;
  font-size: 32px;
  font-weight: 600;
  margin: 0 0 48px;
}

.why-list {
  display: flex;
  flex-direction: column;
  gap: 40px;
  max-width: 800px;
  margin: 0 auto;
}

.why-item {
  display: flex;
  gap: 24px;
  align-items: flex-start;
}

.why-icon {
  font-size: 36px;
  flex-shrink: 0;
  width: 56px;
  text-align: center;
}

.why-item h3 {
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 8px;
}

.why-item p {
  font-size: 15px;
  color: #555;
  line-height: 1.7;
  margin: 0;
}

/* Features */
.features {
  padding: 80px 0;
  background: #fff;
}

.features h2 {
  text-align: center;
  font-size: 32px;
  font-weight: 600;
  margin: 0 0 48px;
}

.feat-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.feat-card {
  padding: 32px 24px;
  border: 1px solid #eee;
  border-radius: 12px;
  text-align: center;
  transition: box-shadow 0.2s;
}

.feat-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.08); }

.feat-icon { font-size: 40px; margin-bottom: 16px; }

.feat-card h3 {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 8px;
}

.feat-card p {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
  margin: 0;
}

/* Scenarios */
.scenarios {
  padding: 80px 0;
  background: #fafafa;
}

.scenarios h2 {
  text-align: center;
  font-size: 32px;
  font-weight: 600;
  margin: 0 0 48px;
}

.scenario-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.scenario-card {
  padding: 32px 24px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}

.scenario-card h3 {
  font-size: 17px;
  font-weight: 600;
  margin: 0 0 12px;
  color: #1677ff;
}

.scenario-card p {
  font-size: 14px;
  color: #555;
  line-height: 1.7;
  margin: 0;
}

/* Download */
.download {
  padding: 80px 0;
  background: #fff;
  text-align: center;
}

.download h2 {
  font-size: 32px;
  font-weight: 600;
  margin: 0 0 12px;
}

.download p {
  font-size: 15px;
  color: #666;
  margin: 0 0 32px;
}

.download-btns {
  display: flex;
  justify-content: center;
  gap: 16px;
  flex-wrap: wrap;
}

.dl-btn {
  padding: 12px 28px;
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  text-decoration: none;
  font-size: 14px;
  color: #333;
  transition: all 0.2s;
}

.dl-btn:hover {
  border-color: #1677ff;
  color: #1677ff;
}

/* CTA */
.cta-section {
  padding: 80px 0;
  background: #fff;
}

.cta-box {
  background: linear-gradient(135deg, #1677ff 0%, #0958d9 100%);
  border-radius: 24px;
  padding: 60px;
  text-align: center;
  color: #fff;
}

.cta-box h2 {
  font-size: 36px;
  font-weight: 600;
  white-space: pre-line;
  margin: 0 0 32px;
  line-height: 1.4;
}

.cta-btn--white {
  background: #fff;
  color: #1677ff;
}

.cta-btn--white:hover { background: #f0f5ff; }

@media (max-width: 768px) {
  .hero h1 { font-size: 32px; }
  .trust-grid,
  .feat-grid,
  .scenario-grid { grid-template-columns: 1fr; }
  .cta-box { padding: 40px 24px; }
  .cta-box h2 { font-size: 26px; }
}
</style>
