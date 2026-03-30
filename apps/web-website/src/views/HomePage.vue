<template>
  <div class="home-page">
    <!-- Hero Section -->
    <section class="hero">
      <div class="container">
        <div class="hero-content">
          <div class="hero-left">
            <h1>一个平台,统一所有<br>客户沟通渠道</h1>
            <p class="subtitle">整合 Email、Chat、社交媒体等多渠道对话,让团队在一个工作台高效协作</p>
            <div class="actions">
              <n-button type="primary" size="large" round>免费试用</n-button>
              <n-button size="large" quaternary>预约演示</n-button>
            </div>
            <p class="note">已有 10000+ 企业正在使用</p>
          </div>
          <div class="hero-right">
            <img src="https://via.placeholder.com/500x600/f0f5ff/1677ff?text=3D+Phone" alt="产品" />
          </div>
        </div>
      </div>
    </section>

    <!-- Video Demo -->
    <section class="video">
      <div class="container">
        <h2>3 分钟,看懂 Chat 如何重塑您的客户体验</h2>
        <div class="video-box">
          <img src="https://via.placeholder.com/1100x620/1a1a2e/ffffff?text=Video+Demo" alt="视频" />
          <div class="play-btn">▶</div>
        </div>
      </div>
    </section>

    <!-- Why Choose -->
    <section class="why">
      <div class="container">
        <h2>为什么选择 TWT Chat?</h2>
        <div class="why-list">
          <div v-for="(item, i) in whyList" :key="i" class="why-item">
            <div class="why-left">
              <div class="why-buttons">
                <n-button v-for="btn in item.buttons" :key="btn" type="primary" size="large">{{ btn }}</n-button>
              </div>
              <p>{{ item.desc }}</p>
            </div>
            <div class="why-right">
              <img :src="item.img" alt="" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Efficiency -->
    <section class="efficiency">
      <div class="container">
        <div class="eff-card">
          <div class="eff-left">
            <h3>提高客服效率,降低运营成本的解决方案</h3>
            <ul>
              <li>一个平台统一</li>
              <li>多渠道消息集中处理</li>
              <li>智能分配与自动化</li>
              <li>AI 辅助回复</li>
            </ul>
          </div>
          <div class="eff-right">
            <img src="https://via.placeholder.com/500x400/2a2a3e/ffffff?text=Real+Photo" alt="实景" />
          </div>
        </div>
      </div>
    </section>

    <!-- Features -->
    <section class="features">
      <div class="container">
        <h2>灵活、高效、更安全</h2>
        <div class="feat-grid">
          <n-card v-for="f in featList" :key="f.title">
            <div class="feat-icon">{{ f.icon }}</div>
            <h3>{{ f.title }}</h3>
            <p>{{ f.desc }}</p>
          </n-card>
        </div>
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

    <!-- CTA -->
    <section class="cta">
      <div class="container">
        <div class="cta-content">
          <img src="https://via.placeholder.com/200x200/e6f4ff/1677ff?text=Avatar" alt="专家" class="avatar" />
          <h2>预约专家演示</h2>
          <p>了解 TWT Chat 如何帮助您的团队</p>
          <n-button type="primary" size="large" round>立即预约免费试用和演示</n-button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { NButton, NCard } from 'naive-ui';

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
  padding: 80px 0;
}

.hero-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
}

.hero-left h1 {
  font-size: 48px;
  font-weight: 700;
  margin: 0 0 20px;
  line-height: 1.2;
}

.hero-left .subtitle {
  font-size: 18px;
  color: #666;
  margin: 0 0 32px;
}

.hero-left .actions {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
}

.hero-left .note {
  font-size: 14px;
  color: #999;
}

.hero-right img {
  width: 100%;
}

/* Video */
.video {
  padding: 80px 0;
  background: #fafafa;
}

.video h2 {
  text-align: center;
  font-size: 32px;
  margin: 0 0 40px;
}

.video-box {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
}

.video-box img {
  width: 100%;
  display: block;
}

.play-btn {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80px;
  height: 80px;
  background: rgba(255,255,255,0.9);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  cursor: pointer;
}

/* Why */
.why {
  padding: 80px 0;
  background: linear-gradient(180deg, #e6f4ff 0%, #bae0ff 100%);
}

.why h2 {
  text-align: center;
  font-size: 32px;
  margin: 0 0 60px;
}

.why-list {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.why-item {
  display: grid;
  grid-template-columns: 400px 1fr;
  gap: 40px;
  align-items: center;
}

.why-buttons {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
}

.why-left p {
  color: #666;
}

.why-right img {
  width: 100%;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

/* Efficiency */
.efficiency {
  padding: 80px 0;
}

.eff-card {
  background: #2a2a3e;
  color: #fff;
  padding: 60px;
  border-radius: 16px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
}

.eff-left h3 {
  font-size: 28px;
  margin: 0 0 24px;
}

.eff-left ul {
  list-style: none;
  padding: 0;
}

.eff-left li {
  padding: 10px 0;
  padding-left: 24px;
  position: relative;
}

.eff-left li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: #52c41a;
}

.eff-right img {
  width: 100%;
  border-radius: 8px;
}

/* Features */
.features {
  padding: 80px 0;
  background: #fafafa;
}

.features h2 {
  text-align: center;
  font-size: 32px;
  margin: 0 0 40px;
}

.feat-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.feat-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.feat-grid h3 {
  font-size: 18px;
  margin: 0 0 8px;
}

.feat-grid p {
  font-size: 14px;
  color: #666;
  margin: 0;
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

/* CTA */
.cta {
  padding: 80px 0;
  background: linear-gradient(135deg, #1677ff 0%, #0958d9 100%);
}

.cta-content {
  text-align: center;
  color: #fff;
}

.avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  margin: 0 auto 24px;
  display: block;
}

.cta h2 {
  font-size: 32px;
  margin: 0 0 16px;
}

.cta p {
  font-size: 18px;
  margin: 0 0 32px;
  opacity: 0.9;
}

/* Responsive */
@media (max-width: 768px) {
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
