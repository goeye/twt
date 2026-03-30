<template>
  <div class="home-page">
    <MarketingHeader :show-product-nav="false" />

    <!-- Hero Section -->
    <section class="hero">
      <div class="product-nav">
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
      </div>
      <div class="container">
        <div class="hero-content">
          <div class="hero-left">
            <h1>
              一个平台，统一所有<br>
              <span class="highlight">客户服务</span>场景
            </h1>
            <p class="subtitle">
              TWT Chat 集成在线客服、工单、群聊、远程协助、音视频与 AI 能力，构建面向全球化团队的全场景智能服务与协作平台。
            </p>
            <div class="actions">
              <n-button type="primary" size="large" class="trial-btn">
                14天免费试用
              </n-button>
              <n-button size="large" quaternary class="demo-btn">
                <span class="play-icon">▶</span>
                快速了解
              </n-button>
            </div>
            <p class="note">无需绑定信用卡</p>
          </div>
          <div class="hero-right">
            <div class="product-preview">
              <div class="glow"></div>
              <img src="https://via.placeholder.com/600x700/ffffff/e6f4ff?text=Product+UI" alt="TWT Chat 产品界面" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 合作品牌 -->
    <section class="brands">
      <div class="container">
        <p class="brands-title">正在被来自不同行业的团队持续使用中</p>
        <div class="brands-list">
          <span class="brand-item">Capterra</span>
          <span class="brand-item">R</span>
          <span class="brand-item">AMZ123</span>
          <span class="brand-item">VMcard</span>
          <span class="brand-item">☁️</span>
          <span class="brand-item">teletype</span>
          <span class="brand-item">Hubstudio</span>
          <span class="brand-item">W365.hk</span>
          <span class="brand-item">K</span>
          <span class="brand-item">M</span>
        </div>
      </div>
    </section>

    <button class="floating-chat">💬</button>

    <!-- Video Demo -->
    <section class="video">
      <div class="container">
        <h2>3 分钟，看懂 Chat 如何重塑您的客户体验</h2>
        <div class="video-wrapper">
          <div class="video-box">
            <div class="video-placeholder">
              <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                <circle cx="40" cy="40" r="40" fill="rgba(255,255,255,0.9)"/>
                <path d="M32 26L56 40L32 54V26Z" fill="#1677ff"/>
              </svg>
            </div>
          </div>
          <button class="video-cta">
            预约专家演示 →
          </button>
          <p class="video-note">1 对 1 在线演示</p>
        </div>
      </div>
    </section>

    <!-- Why Choose -->
    <section class="why">
      <div class="container">
        <h2>为什么选择 TWT Chat?</h2>
        <p class="why-subtitle">专为高效率和低成本而设计，而不是堆砌功能</p>

        <div class="why-item">
          <div class="why-left">
            <h3>无限制会话,不为增长付费</h3>
            <p>告别按量计费旧模式！Chat 支持无限制会话、不限使用时长、即使客户咨询量激增，也无额外费用，成本透明可控。</p>
            <n-button type="primary" size="large" round>立即体验</n-button>
          </div>
          <div class="why-right">
            <div class="why-preview">
              <div class="preview-placeholder"></div>
            </div>
          </div>
        </div>

        <div class="why-item">
          <div class="why-left">
            <h3>打破语言壁垒，即时服务全球客户</h3>
            <p>内置双向实时自动翻译，您的团队只需用母语，即可与全球客户无缝交流，轻松助力您的全球业务扩张。</p>
            <n-button type="primary" size="large" round>立即体验</n-button>
          </div>
          <div class="why-right">
            <div class="why-preview">
              <div class="preview-placeholder"></div>
            </div>
          </div>
        </div>

        <div class="why-item">
          <div class="why-left">
            <h3>AI 深度学习，解放80%的客服精力</h3>
            <p>AI 深度学习知识库，Copilot 智能助手实时推荐专业回复，让您的客服团队专注于解决核心问题。</p>
            <n-button type="primary" size="large" round>立即体验</n-button>
          </div>
          <div class="why-right">
            <div class="why-preview">
              <div class="preview-placeholder"></div>
            </div>
          </div>
        </div>

        <div class="why-item">
          <div class="why-left">
            <h3>App/客户端/网页多端同步支持，服务从不掉线</h3>
            <p>通过Chat APP，您的客服人员可以随时随地接收会话通知、处理工单并即时回复客户，确保服务24/7连线。</p>
            <n-button type="primary" size="large" round>立即体验</n-button>
          </div>
          <div class="why-right">
            <div class="why-preview">
              <div class="preview-placeholder"></div>
            </div>
          </div>
        </div>

        <div class="why-item">
          <div class="why-left">
            <h3>屏幕共享+实时标注，问题秒速解决</h3>
            <p>不只是文字聊天，更可通过远程协助功能，复杂的技术或操作问题即时诊断和指导，大幅提升一次解决率。</p>
            <n-button type="primary" size="large" round>立即体验</n-button>
          </div>
          <div class="why-right">
            <div class="why-preview">
              <div class="preview-placeholder"></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 解决方案 -->
    <section class="solutions">
      <div class="container">
        <h2>面向多行业，提供真正匹配业务的解决方案</h2>
        <p class="solutions-subtitle">为真实客户沟通场景而设计，不同行业,同样高效</p>

        <div class="solutions-tabs">
          <button class="tab-btn active">SaaS / B2B 团队</button>
          <button class="tab-btn">电商独立站/D2C品牌</button>
          <button class="tab-btn">教培/在线课程团队</button>
          <button class="tab-btn">金融/投资服务团队</button>
        </div>

        <div class="solutions-content">
          <div class="solution-card">
            <h3>把原本要来回十几封邮件的问题，一次讲清楚。</h3>
            <div class="solution-features">
              <p class="feature-title">我们提供</p>
              <ul>
                <li>一键生成<strong>链接协助</strong>，屏幕共享+语音说明</li>
                <li>使用<strong>实时标注</strong>，操作步骤一目了然</li>
                <li><strong>Copilot 智能推荐</strong>回复，降低对人工经验的依赖</li>
                <li>在同一工作台实现<strong>客户支持与团队协作</strong>，减少反复沟通</li>
              </ul>
              <n-button type="primary" size="large" round class="solution-btn">立即咨询</n-button>
            </div>
          </div>

          <div class="solution-image">
            <div class="image-placeholder"></div>
          </div>

          <div class="solution-card">
            <h3>让每一次咨询，都更有机会变成订单。</h3>
            <div class="solution-features">
              <p class="feature-title">我们提供</p>
              <ul>
                <li><strong>快捷回复+实时翻译</strong>，缩短等待时间，提升下单转化</li>
                <li><strong>不限会话数、不限时段</strong>，高峰期也能稳定承接咨询</li>
                <li>内置<strong>自动翻译</strong>，直接服务不同语系和语言的客户</li>
                <li>将客户从人<strong>售后转化</strong>，订单与问题全程可追踪</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 平台资讯 -->
    <section class="news">
      <div class="container">
        <h2>平台资讯</h2>

        <div class="news-grid">
          <div class="news-card">
            <div class="news-image">
              <div class="news-placeholder"></div>
            </div>
            <h3>TWT Chat 一站式跨境客服解决方案</h3>
            <p>在跨境业务快速发展的今天，企业面临客户不同国家和地区客户的多样化需求，如何在有限人力下高效、精准地...</p>
          </div>

          <div class="news-card">
            <div class="news-image">
              <div class="news-placeholder"></div>
            </div>
            <h3>TWT Chat 如何在高度竞争的在线聊天软件市场中找到位置</h3>
            <p>在全球数字化转型加速的背景下，在线聊天软件市场已经进入高度成熟且竞争激烈的阶段，超本越多的产品涌现...</p>
          </div>

          <div class="news-card">
            <div class="news-image">
              <div class="news-placeholder dark"></div>
            </div>
            <h3>传统在线客服的问题在哪里？TWT Chat 是如何解决的</h3>
            <p>传统在线客服（traditional live chat）已经存在很多年了，几乎每一家初创公司在某个阶段都会使用它。在网站...</p>
          </div>
        </div>

        <button class="news-more">查看更多</button>
      </div>
    </section>

    <!-- FAQ -->
    <section class="faq">
      <div class="container">
        <h2>常见问题</h2>
        <div class="faq-list">
          <div v-for="q in faqList" :key="q" class="faq-item">{{ q }}</div>
        </div>
      </div>
    </section>

    <!-- Certificates -->
    <section class="certs">
      <div class="container">
        <h2>平台资质</h2>
        <div class="cert-grid">
          <img v-for="i in 3" :key="i" :src="`https://via.placeholder.com/300x200/f5f6fa/666?text=Cert+${i}`" alt="证书" />
        </div>
      </div>
    </section>

    <!-- 预约专家演示 -->
    <section class="demo">
      <div class="container">
        <div class="demo-content">
          <div class="demo-left">
            <h2>预约专家演示</h2>
            <p class="demo-subtitle">预约后，会有技术专家联系您进行产品演示，帮助您更好的了解 Chat。</p>

            <form class="demo-form">
              <div class="form-row">
                <div class="form-group">
                  <input type="text" placeholder="姓名" required />
                </div>
                <div class="form-group">
                  <input type="email" placeholder="邮箱" required />
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <input type="date" placeholder="预约时间" />
                </div>
                <div class="form-group phone-group">
                  <select class="country-code">
                    <option>+86</option>
                    <option>+1</option>
                    <option>+44</option>
                  </select>
                  <input type="tel" placeholder="联系电话" />
                </div>
              </div>

              <div class="form-group">
                <input type="text" placeholder="公司名称" />
              </div>

              <n-button type="primary" size="large" class="submit-btn">提交预约</n-button>

              <p class="form-note">*为必填项，请如实填写您的信息，我们将于1个工作日内与您取得联系。</p>
            </form>
          </div>

          <div class="demo-right">
            <div class="expert-image"></div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA 卡片 -->
    <section class="cta-card">
      <div class="container">
        <div class="cta-box">
          <h2>选择 TWT Chat<br>以极简工具，应对复杂的业务挑战</h2>
          <div class="cta-actions">
            <n-button size="large" class="cta-btn-white">免费使用</n-button>
            <n-button size="large" quaternary class="cta-btn-outline">获取方案</n-button>
          </div>
        </div>
      </div>
    </section>

    <button class="floating-chat">💬</button>
  </div>
</template>

<script setup lang="ts">
import { NButton, NCard } from 'naive-ui';
import MarketingHeader from '../components/layout/MarketingHeader.vue';

const whyList = [
  {
    buttons: ['全渠道统一管理', '智能工单系统'],
    desc: '整合多渠道消息,统一处理',
    img: 'https://via.placeholder.com/700x400/f0f5ff/1677ff?text=Screenshot+1'
  },
  {
    buttons: ['团队协作', 'AI 辅助'],
    desc: '高效协作,智能推荐',
    img: 'https://via.placeholder.com/700x400/f0f5ff/1677ff?text=Screenshot+2'
  },
  {
    buttons: ['数据分析', '自动化流程'],
    desc: '洞察数据,优化流程',
    img: 'https://via.placeholder.com/700x400/f0f5ff/1677ff?text=Screenshot+3'
  }
];

const featList = [
  { icon: '🚀', title: '高效极速接入', desc: '3 分钟完成部署' },
  { icon: '📱', title: '多端协同响应', desc: 'App、Web 无缝切换' },
  { icon: '🤖', title: 'AI 智能赋能', desc: 'Copilot 辅助回复' },
  { icon: '💼', title: '专业服务支持', desc: '7×24 小时响应' },
  { icon: '🔒', title: '数据安全保障', desc: 'GDPR 合规加密' },
  { icon: '🔌', title: '开放能力扩展', desc: 'API 与 Webhook' }
];

const faqList = [
  '如何开始使用 TWT Chat?',
  '支持哪些渠道接入?',
  '如何收费?',
  '数据安全如何保障?'
];
</script>

<style scoped>
.home-page {
  background: #fff;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

/* Hero */
.hero {
  padding: 0 0 120px;
  background: #fff;
  margin-top: var(--links-main-nav-height);
}

.hero .product-nav {
  height: 56px;
  background: transparent;
  margin-top: -8px;
}

.hero .product-nav-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
}

.hero .product-logo {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
}

.hero .chat-icon {
  font-size: 20px;
}

.hero .product-name {
  font-size: 16px;
  color: var(--links-color-text-primary);
}

.hero .product-links {
  display: flex;
  gap: 32px;
}

.hero .product-links a {
  color: var(--links-color-text-primary);
  text-decoration: none;
  font-size: 14px;
  transition: color var(--links-motion-fast);
}

.hero .product-links a:hover {
  color: var(--links-color-primary);
}

.hero-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
  align-items: center;
  padding-top: 80px;
}

.hero-left h1 {
  font-size: var(--links-hero-title-size);
  font-weight: 700;
  margin: 0 0 24px;
  line-height: 1.2;
  color: var(--links-color-text-primary);
}

.hero-left .highlight {
  color: var(--links-color-primary);
}

.hero-left .subtitle {
  font-size: var(--links-hero-subtitle-size);
  color: var(--links-color-text-secondary);
  margin: 0 0 40px;
  line-height: 1.6;
}

.hero-left .actions {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
}

.trial-btn {
  border-radius: 24px !important;
  padding: 0 32px !important;
  height: 48px !important;
  background: #52c41a !important;
}

.demo-btn {
  border-radius: 24px !important;
  padding: 0 32px !important;
  height: 48px !important;
  border: 1px solid var(--links-color-border) !important;
}

.play-icon {
  margin-right: 8px;
  font-size: 12px;
}

.hero-left .note {
  font-size: 14px;
  color: var(--links-color-text-muted);
  margin: 0;
}

.hero-right {
  position: relative;
}

.product-preview {
  position: relative;
  width: 100%;
}

.product-preview .glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 400px;
  height: 400px;
  background: var(--links-hero-glow);
  border-radius: 50%;
  filter: blur(80px);
  z-index: 0;
}

.product-preview img {
  position: relative;
  width: 100%;
  z-index: 1;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
}

.floating-chat {
  position: fixed;
  bottom: 32px;
  right: 32px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: var(--links-color-primary);
  border: none;
  font-size: 24px;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(22, 119, 255, 0.3);
  transition: transform var(--links-motion-base);
  z-index: 99;
}

.floating-chat:hover {
  transform: scale(1.1);
}

/* 合作品牌 */
.brands {
  padding: 60px 0;
  background: #fff;
}

.brands-title {
  font-size: 14px;
  color: var(--links-color-text-secondary);
  margin: 0 0 32px;
}

.brands-list {
  display: flex;
  align-items: center;
  gap: 40px;
  flex-wrap: wrap;
}

.brand-item {
  font-size: 14px;
  color: var(--links-color-text-muted);
  font-weight: 500;
  transition: color var(--links-motion-base);
}

.brand-item:hover {
  color: var(--links-color-text-primary);
}

/* Video */
.video {
  padding: 80px 0;
  background: #fff;
}

.video h2 {
  text-align: center;
  font-size: 32px;
  margin: 0 0 48px;
  font-weight: 600;
}

.video-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
}

.video-box {
  width: 100%;
  max-width: 1100px;
  aspect-ratio: 16 / 9;
  border-radius: 16px;
  overflow: hidden;
  position: relative;
  background: linear-gradient(135deg, #e6f4ff 0%, #bae0ff 100%);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
}

.video-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform var(--links-motion-base);
}

.video-placeholder:hover {
  transform: scale(1.02);
}

.video-cta {
  padding: 12px 32px;
  border: 1px solid var(--links-color-border);
  border-radius: 24px;
  background: #fff;
  font-size: 14px;
  color: var(--links-color-text-primary);
  cursor: pointer;
  transition: all var(--links-motion-base);
}

.video-cta:hover {
  border-color: var(--links-color-primary);
  color: var(--links-color-primary);
}

.video-note {
  font-size: 13px;
  color: var(--links-color-text-muted);
  margin: 0;
}

/* Why */
.why {
  padding: 80px 0;
  background: #fff;
}

.why h2 {
  text-align: center;
  font-size: 32px;
  margin: 0 0 16px;
  font-weight: 600;
}

.why-subtitle {
  text-align: center;
  font-size: 16px;
  color: var(--links-color-text-secondary);
  margin: 0 0 60px;
}

.why-item {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
  margin-bottom: 80px;
}

.why-left h3 {
  font-size: 28px;
  font-weight: 600;
  margin: 0 0 16px;
  color: var(--links-color-text-primary);
}

.why-left p {
  font-size: 16px;
  color: var(--links-color-text-secondary);
  line-height: 1.6;
  margin: 0 0 32px;
}

.why-right {
  position: relative;
}

.why-preview {
  width: 100%;
  aspect-ratio: 16 / 10;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
}

.preview-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #e6f4ff 0%, #f0f5ff 100%);
}

/* 解决方案 */
.solutions {
  padding: 80px 0;
  background: #fafafa;
}

.solutions h2 {
  text-align: center;
  font-size: 32px;
  margin: 0 0 16px;
  font-weight: 600;
}

.solutions-subtitle {
  text-align: center;
  font-size: 16px;
  color: var(--links-color-text-secondary);
  margin: 0 0 40px;
}

.solutions-tabs {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-bottom: 60px;
}

.tab-btn {
  padding: 10px 24px;
  border: none;
  border-radius: 20px;
  background: #fff;
  color: var(--links-color-text-primary);
  font-size: 14px;
  cursor: pointer;
  transition: all var(--links-motion-base);
}

.tab-btn.active {
  background: #000;
  color: #fff;
}

.solutions-content {
  display: grid;
  grid-template-columns: 1fr 400px 1fr;
  gap: 40px;
  align-items: start;
}

.solution-card {
  background: #fff;
  padding: 40px;
  border-radius: 16px;
}

.solution-card h3 {
  font-size: 24px;
  font-weight: 600;
  margin: 0 0 24px;
  line-height: 1.4;
}

.feature-title {
  font-size: 14px;
  color: var(--links-color-text-secondary);
  margin: 0 0 16px;
}

.solution-features ul {
  list-style: none;
  padding: 0;
  margin: 0 0 32px;
}

.solution-features li {
  padding: 8px 0;
  padding-left: 28px;
  position: relative;
  font-size: 15px;
  color: var(--links-color-text-primary);
  line-height: 1.6;
}

.solution-features li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: #52c41a;
  font-weight: bold;
}

.solution-features strong {
  font-weight: 600;
}

.solution-btn {
  width: 100%;
}

.solution-image {
  position: relative;
}

.image-placeholder {
  width: 100%;
  aspect-ratio: 3 / 4;
  background: linear-gradient(135deg, #e6f4ff 0%, #f0f5ff 100%);
  border-radius: 16px;
}

/* 平台资讯 */
.news {
  padding: 80px 0;
  background: #fff;
}

.news h2 {
  text-align: center;
  font-size: 32px;
  margin: 0 0 48px;
  font-weight: 600;
}

.news-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-bottom: 40px;
}

.news-card {
  background: #fff;
  border: 1px solid var(--links-color-border);
  border-radius: 12px;
  overflow: hidden;
  transition: box-shadow var(--links-motion-base);
}

.news-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.news-image {
  width: 100%;
  aspect-ratio: 16 / 9;
  overflow: hidden;
}

.news-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #e6f4ff 0%, #f0f5ff 100%);
}

.news-placeholder.dark {
  background: linear-gradient(135deg, #2a2a3e 0%, #1a1a2e 100%);
}

.news-card h3 {
  font-size: 18px;
  font-weight: 600;
  margin: 20px 20px 12px;
  line-height: 1.4;
}

.news-card p {
  font-size: 14px;
  color: var(--links-color-text-secondary);
  line-height: 1.6;
  margin: 0 20px 20px;
}

.news-more {
  display: block;
  margin: 0 auto;
  padding: 12px 32px;
  border: 1px solid var(--links-color-border);
  border-radius: 24px;
  background: #fff;
  font-size: 14px;
  color: var(--links-color-text-primary);
  cursor: pointer;
  transition: all var(--links-motion-base);
}

.news-more:hover {
  border-color: var(--links-color-primary);
  color: var(--links-color-primary);
}

/* FAQ */
.faq {
  padding: 80px 0;
}

.faq h2 {
  text-align: center;
  font-size: 32px;
  margin: 0 0 40px;
}

.faq-list {
  max-width: 800px;
  margin: 0 auto;
}

.faq-item {
  padding: 20px 0;
  border-bottom: 1px solid #eee;
  font-size: 16px;
  color: #333;
}

/* Certificates */
.certs {
  padding: 80px 0;
  background: #fafafa;
}

.certs h2 {
  text-align: center;
  font-size: 32px;
  margin: 0 0 40px;
}

.cert-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.cert-grid img {
  width: 100%;
  border-radius: 8px;
}

/* 预约专家演示 */
.demo {
  padding: 80px 0;
  background: linear-gradient(135deg, #e6f4ff 0%, #f0f5ff 100%);
}

.demo-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
}

.demo-left h2 {
  font-size: 32px;
  font-weight: 600;
  margin: 0 0 16px;
  text-align: center;
}

.demo-subtitle {
  font-size: 14px;
  color: var(--links-color-text-secondary);
  margin: 0 0 32px;
  text-align: center;
}

.demo-form {
  max-width: 500px;
  margin: 0 auto;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 16px;
}

.form-group {
  position: relative;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid var(--links-color-border);
  border-radius: 8px;
  font-size: 14px;
  background: #fff;
}

.phone-group {
  display: flex;
  gap: 8px;
}

.country-code {
  width: 80px;
  flex-shrink: 0;
}

.submit-btn {
  width: 100%;
  margin: 24px 0 16px;
  border-radius: 8px !important;
}

.form-note {
  font-size: 12px;
  color: var(--links-color-text-muted);
  margin: 0;
  text-align: center;
}

.expert-image {
  width: 100%;
  aspect-ratio: 1;
  background: linear-gradient(135deg, #bae0ff 0%, #e6f4ff 100%);
  border-radius: 16px;
}

/* CTA 卡片 */
.cta-card {
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
  margin: 0 0 32px;
  line-height: 1.4;
}

.cta-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
}

.cta-btn-white {
  background: #fff !important;
  color: var(--links-color-primary) !important;
  border-radius: 24px !important;
  padding: 0 32px !important;
}

.cta-btn-outline {
  border: 1px solid #fff !important;
  color: #fff !important;
  border-radius: 24px !important;
  padding: 0 32px !important;
}

/* Responsive */
@media (max-width: 768px) {
  .hero {
    padding: 40px 0 60px;
    margin-top: calc(var(--links-main-nav-height) + var(--links-product-nav-height));
  }

  .hero-content {
    grid-template-columns: 1fr;
    gap: 40px;
  }

  .hero-left h1 {
    font-size: 36px;
  }

  .hero-left .subtitle {
    font-size: 16px;
  }

  .hero-left .actions {
    flex-direction: column;
  }

  .trial-btn,
  .demo-btn {
    width: 100%;
  }

  .product-preview .glow {
    width: 300px;
    height: 300px;
  }

  .floating-chat {
    bottom: 20px;
    right: 20px;
    width: 48px;
    height: 48px;
    font-size: 20px;
  }

  .hero-content,
  .why-item,
  .eff-card {
    grid-template-columns: 1fr;
  }

  .feat-grid,
  .cert-grid {
    grid-template-columns: 1fr;
  }
}
</style>
