<template>
  <div class="home-page">
    <MarketingHeader />
    <ProductSubNav />

    <!-- Hero Section -->
    <section class="hero">
      <div class="container">
        <div class="hero-content">
          <div class="hero-left">
            <h1>
              <template v-for="(line, i) in t.heroTitle.split('\n')" :key="i">
                <br v-if="i > 0" />{{ line }}
              </template>
            </h1>
            <p class="subtitle">{{ t.heroSubtitle }}</p>
            <div class="actions">
              <n-button type="primary" size="large" class="trial-btn">{{ t.trialBtn }}</n-button>
              <n-button size="large" quaternary class="demo-btn">
                <span class="play-icon">▶</span>{{ t.learnBtn }}
              </n-button>
            </div>
            <p class="note">{{ t.noCard }}</p>
          </div>
          <div class="hero-right">
            <div class="product-preview">
              <div class="glow"></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 合作品牌 -->
    <section class="brands">
      <div class="container">
        <p class="brands-title">{{ t.brandsTitle }}</p>
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
        <h2>{{ t.videoTitle }}</h2>
        <div class="video-wrapper">
          <div class="video-box">
            <div class="video-placeholder">
              <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                <circle cx="40" cy="40" r="40" fill="rgba(255,255,255,0.9)"/>
                <path d="M32 26L56 40L32 54V26Z" fill="#1677ff"/>
              </svg>
            </div>
          </div>
          <button class="video-cta">{{ t.bookDemo }}</button>
          <p class="video-note">{{ t.demoNote }}</p>
        </div>
      </div>
    </section>

    <!-- Why Choose -->
    <section class="why">
      <div class="container">
        <h2>{{ t.whyTitle }}</h2>
        <p class="why-subtitle">{{ t.whySubtitle }}</p>

        <div class="why-item">
          <div class="why-left">
            <h3>{{ t.why1Title }}</h3>
            <p>{{ t.why1Desc }}</p>
            <n-button type="primary" size="large" round>{{ t.tryNow }}</n-button>
          </div>
          <div class="why-right"><div class="why-preview"><div class="preview-placeholder"></div></div></div>
        </div>

        <div class="why-item">
          <div class="why-left">
            <h3>{{ t.why2Title }}</h3>
            <p>{{ t.why2Desc }}</p>
            <n-button type="primary" size="large" round>{{ t.tryNow }}</n-button>
          </div>
          <div class="why-right"><div class="why-preview"><div class="preview-placeholder"></div></div></div>
        </div>

        <div class="why-item">
          <div class="why-left">
            <h3>{{ t.why3Title }}</h3>
            <p>{{ t.why3Desc }}</p>
            <n-button type="primary" size="large" round>{{ t.tryNow }}</n-button>
          </div>
          <div class="why-right"><div class="why-preview"><div class="preview-placeholder"></div></div></div>
        </div>

        <div class="why-item">
          <div class="why-left">
            <h3>{{ t.why4Title }}</h3>
            <p>{{ t.why4Desc }}</p>
            <n-button type="primary" size="large" round>{{ t.tryNow }}</n-button>
          </div>
          <div class="why-right"><div class="why-preview"><div class="preview-placeholder"></div></div></div>
        </div>

        <div class="why-item">
          <div class="why-left">
            <h3>{{ t.why5Title }}</h3>
            <p>{{ t.why5Desc }}</p>
            <n-button type="primary" size="large" round>{{ t.tryNow }}</n-button>
          </div>
          <div class="why-right"><div class="why-preview"><div class="preview-placeholder"></div></div></div>
        </div>
      </div>
    </section>

    <!-- 解决方案 -->
    <section class="solutions">
      <div class="container">
        <h2>{{ t.solutionsTitle }}</h2>
        <p class="solutions-subtitle">{{ t.solutionsSubtitle }}</p>

        <div class="solutions-carousel">
          <div class="carousel-track" :style="{ transform: `translateX(-${currentIndex * 100}%)` }">
            <div v-for="(solution, index) in solutions" :key="index" class="carousel-slide">
              <div class="solution-content">
                <div class="solution-card">
                  <h3>{{ solution.title }}</h3>
                  <div class="solution-features">
                    <p class="feature-title">{{ t.weProvide }}</p>
                    <ul>
                      <li v-for="(feature, i) in solution.features" :key="i" v-html="feature"></li>
                    </ul>
                    <n-button type="primary" size="large" round class="solution-btn">{{ t.consultBtn }}</n-button>
                  </div>
                </div>
                <div class="solution-image">
                  <div class="image-placeholder"></div>
                </div>
              </div>
              <div class="solution-tab">{{ solution.tab }}</div>
            </div>
          </div>
        </div>

        <div class="carousel-nav">
          <button class="nav-btn" :disabled="currentIndex === 0" @click="prevSolution">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>
          <button class="nav-btn" :disabled="currentIndex === solutions.length - 1" @click="nextSolution">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>
        </div>
      </div>
    </section>

    <!-- 功能特性 -->
    <section class="features">
      <div class="container">
        <h2>{{ t.featTitle }}</h2>
        <p class="features-subtitle">{{ t.featSubtitle }}</p>

        <div class="features-grid">
          <div v-for="feat in featList" :key="feat.title" class="feature-card">
            <div class="feature-icon">{{ feat.icon }}</div>
            <h3>{{ feat.title }}</h3>
            <p>{{ feat.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ -->
    <section class="faq">
      <div class="container">
        <h2>{{ t.faqTitle }}</h2>
        <div class="faq-list">
          <div v-for="(item, index) in faqItems" :key="item.q" class="faq-item">
            <button
              type="button"
              class="faq-question"
              :class="{ 'faq-question--active': activeFaqIndex === index }"
              @click="toggleFaq(index)"
            >
              <span>{{ item.q }}</span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" class="faq-icon">
                <path d="M4 6L8 10L12 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
            <div v-show="activeFaqIndex === index" class="faq-answer">
              <p v-for="(line, i) in item.a" :key="i">{{ line }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 平台资讯 -->
    <section class="news">
      <div class="container">
        <h2>{{ t.newsTitle }}</h2>

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

        <button class="news-more">{{ t.newsMore }}</button>
      </div>
    </section>

    <!-- 预约专家演示 -->
    <section class="demo">
      <div class="container">
        <div class="demo-content">
          <h2>{{ t.demoTitle }}</h2>
          <p class="demo-subtitle">{{ t.demoSubtitle }}</p>

          <form class="demo-form">
            <div class="form-row">
              <div class="form-group">
                <span class="required">*</span>
                <input type="text" :placeholder="t.namePlaceholder" required />
              </div>
              <div class="form-group">
                <span class="required">*</span>
                <input type="email" :placeholder="t.emailPlaceholder" required />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <input type="date" :placeholder="t.datePlaceholder" />
              </div>
              <div class="form-group">
                <div class="phone-input">
                  <n-select v-model:value="countryCode" :options="countryOptions" class="country-select" :consistent-menu-width="false" />
                  <input type="tel" :placeholder="t.phonePlaceholder" class="phone-number" />
                </div>
              </div>
            </div>

            <div class="form-group">
              <input type="text" :placeholder="t.companyPlaceholder" />
            </div>

            <n-button type="primary" size="large" class="submit-btn">{{ t.submitBtn }}</n-button>
            <p class="form-note">{{ t.formNote }}</p>
          </form>
        </div>
      </div>
    </section>

    <!-- CTA 卡片 -->
    <section class="cta-card">
      <div class="container">
        <div class="cta-box">
          <h2>{{ t.ctaTitle.split('\n')[0] }}<br>{{ t.ctaTitle.split('\n')[1] }}</h2>
          <div class="cta-actions">
            <n-button size="large" class="cta-btn-white">{{ t.ctaFree }}</n-button>
            <n-button size="large" quaternary class="cta-btn-outline">{{ t.ctaPlan }}</n-button>
          </div>
        </div>
      </div>
    </section>

    <button class="floating-chat">💬</button>

    <SiteFooter />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { NButton, NCard, NSelect } from 'naive-ui';
import MarketingHeader from '../components/layout/MarketingHeader.vue';
import ProductSubNav from '../components/layout/ProductSubNav.vue';
import SiteFooter from '../components/layout/SiteFooter.vue';
import { useT } from '../composables/useLocale';

const t = useT({
  'zh-CN': {
    heroTitle: '一个平台，统一所有\n客户服务场景',
    heroHighlight: '客户服务',
    heroSubtitle: 'TWT Chat 集成在线客服、工单、群聊、远程协助、音视频与 AI 能力，构建面向全球化团队的全场景智能服务与协作平台。',
    trialBtn: '14天免费试用', learnBtn: '快速了解', noCard: '无需绑定信用卡',
    brandsTitle: '正在被来自不同行业的团队持续使用中',
    videoTitle: '3 分钟，看懂 Chat 如何重塑您的客户体验',
    bookDemo: '预约专家演示 →', demoNote: '1 对 1 在线演示',
    whyTitle: '为什么选择 TWT Chat?', whySubtitle: '专为高效率和低成本而设计，而不是堆砌功能',
    tryNow: '立即体验',
    why1Title: '无限制会话,不为增长付费', why1Desc: '告别按量计费旧模式！Chat 支持无限制会话、不限使用时长、即使客户咨询量激增，也无额外费用，成本透明可控。',
    why2Title: '打破语言壁垒，即时服务全球客户', why2Desc: '内置双向实时自动翻译，您的团队只需用母语，即可与全球客户无缝交流，轻松助力您的全球业务扩张。',
    why3Title: 'AI 深度学习，解放80%的客服精力', why3Desc: 'AI 深度学习知识库，Copilot 智能助手实时推荐专业回复，让您的客服团队专注于解决核心问题。',
    why4Title: 'App/客户端/网页多端同步支持，服务从不掉线', why4Desc: '通过Chat APP，您的客服人员可以随时随地接收会话通知、处理工单并即时回复客户，确保服务24/7连线。',
    why5Title: '屏幕共享+实时标注，问题秒速解决', why5Desc: '不只是文字聊天，更可通过远程协助功能，复杂的技术或操作问题即时诊断和指导，大幅提升一次解决率。',
    solutionsTitle: '面向多行业，提供真正匹配业务的解决方案', solutionsSubtitle: '为真实客户沟通场景而设计，不同行业,同样高效',
    consultBtn: '立即咨询', weProvide: '我们提供',
    featTitle: '更极速、更智能、更安全', featSubtitle: '让每一次体验都高效靠谱',
    faqTitle: '常见问题',
    newsTitle: '平台资讯', newsMore: '查看更多',
    demoTitle: '预约专家演示', demoSubtitle: '预约后，会有技术专家联系您进行产品演示，帮助您更好的了解 Chat。',
    namePlaceholder: '姓名', emailPlaceholder: '邮箱', datePlaceholder: '预约时间', phonePlaceholder: '联系电话', companyPlaceholder: '公司名称',
    submitBtn: '提交预约', formNote: '*为必填项，请如实填写您的信息，我们将于1个工作日内与您取得联系。',
    ctaTitle: '选择 TWT Chat\n以极简工具，应对复杂的业务挑战',
    ctaFree: '免费使用', ctaPlan: '获取方案',
  },
  'zh-TW': {
    heroTitle: '一個平台，統一所有\n客戶服務場景',
    heroHighlight: '客戶服務',
    heroSubtitle: 'TWT Chat 整合線上客服、工單、群聊、遠端協助、音視頻與 AI 能力，構建面向全球化團隊的全場景智能服務與協作平台。',
    trialBtn: '14天免費試用', learnBtn: '快速了解', noCard: '無需綁定信用卡',
    brandsTitle: '正在被來自不同行業的團隊持續使用中',
    videoTitle: '3 分鐘，看懂 Chat 如何重塑您的客戶體驗',
    bookDemo: '預約專家演示 →', demoNote: '1 對 1 線上演示',
    whyTitle: '為什麼選擇 TWT Chat?', whySubtitle: '專為高效率和低成本而設計，而不是堆砌功能',
    tryNow: '立即體驗',
    why1Title: '無限制會話，不為增長付費', why1Desc: '告別按量計費舊模式！Chat 支援無限制會話、不限使用時長，即使客戶諮詢量激增，也無額外費用，成本透明可控。',
    why2Title: '打破語言壁壘，即時服務全球客戶', why2Desc: '內建雙向即時自動翻譯，您的團隊只需用母語，即可與全球客戶無縫交流，輕鬆助力您的全球業務擴張。',
    why3Title: 'AI 深度學習，解放80%的客服精力', why3Desc: 'AI 深度學習知識庫，Copilot 智能助手即時推薦專業回覆，讓您的客服團隊專注於解決核心問題。',
    why4Title: 'App/客戶端/網頁多端同步支援，服務從不掉線', why4Desc: '透過Chat APP，您的客服人員可以隨時隨地接收會話通知、處理工單並即時回覆客戶，確保服務24/7連線。',
    why5Title: '螢幕共享+即時標註，問題秒速解決', why5Desc: '不只是文字聊天，更可透過遠端協助功能，複雜的技術或操作問題即時診斷和指導，大幅提升一次解決率。',
    solutionsTitle: '面向多行業，提供真正匹配業務的解決方案', solutionsSubtitle: '為真實客戶溝通場景而設計，不同行業，同樣高效',
    consultBtn: '立即諮詢', weProvide: '我們提供',
    featTitle: '更極速、更智能、更安全', featSubtitle: '讓每一次體驗都高效靠譜',
    faqTitle: '常見問題',
    newsTitle: '平台資訊', newsMore: '查看更多',
    demoTitle: '預約專家演示', demoSubtitle: '預約後，會有技術專家聯繫您進行產品演示，幫助您更好地了解 Chat。',
    namePlaceholder: '姓名', emailPlaceholder: '電子郵件', datePlaceholder: '預約時間', phonePlaceholder: '聯絡電話', companyPlaceholder: '公司名稱',
    submitBtn: '提交預約', formNote: '*為必填項，請如實填寫您的資訊，我們將於1個工作日內與您取得聯繫。',
    ctaTitle: '選擇 TWT Chat\n以極簡工具，應對複雜的業務挑戰',
    ctaFree: '免費使用', ctaPlan: '獲取方案',
  },
  'en': {
    heroTitle: 'One platform for all\ncustomer service needs',
    heroHighlight: 'customer service',
    heroSubtitle: 'TWT Chat integrates live chat, ticketing, group chat, remote assistance, video calls, and AI — a unified workspace for global support teams.',
    trialBtn: '14-day free trial', learnBtn: 'Quick overview', noCard: 'No credit card required',
    brandsTitle: 'Trusted by teams across industries',
    videoTitle: 'See how Chat transforms your customer experience in 3 minutes',
    bookDemo: 'Book an expert demo →', demoNote: '1-on-1 live demo',
    whyTitle: 'Why TWT Chat?', whySubtitle: 'Designed for efficiency and low cost — not feature bloat',
    tryNow: 'Try it now',
    why1Title: 'Unlimited conversations, no growth tax', why1Desc: 'No per-conversation billing. Chat supports unlimited sessions with no time limits — even during traffic spikes, costs stay predictable.',
    why2Title: 'Break language barriers, serve global customers instantly', why2Desc: 'Built-in real-time two-way translation lets your team work in their native language while serving customers worldwide.',
    why3Title: 'AI that frees 80% of your support workload', why3Desc: 'AI learns your knowledge base and Copilot suggests expert replies in real time — so your team focuses on what matters.',
    why4Title: 'App, web, and desktop in sync — always on', why4Desc: 'Your agents receive session alerts, handle tickets, and reply to customers from any device, ensuring 24/7 availability.',
    why5Title: 'Screen sharing + live annotation — resolve issues instantly', why5Desc: 'Go beyond text chat. Remote assistance lets you diagnose and guide through complex issues in real time, boosting first-contact resolution.',
    solutionsTitle: 'Industry-specific solutions that actually fit your business', solutionsSubtitle: 'Built for real customer conversations — efficient across every industry',
    consultBtn: 'Talk to us', weProvide: 'What we offer',
    featTitle: 'Faster. Smarter. More secure.', featSubtitle: 'Every interaction, reliably excellent',
    faqTitle: 'Frequently Asked Questions',
    newsTitle: 'News & Updates', newsMore: 'View more',
    demoTitle: 'Book an Expert Demo', demoSubtitle: 'A product specialist will reach out to walk you through Chat and help you get started.',
    namePlaceholder: 'Name', emailPlaceholder: 'Email', datePlaceholder: 'Preferred date', phonePlaceholder: 'Phone number', companyPlaceholder: 'Company name',
    submitBtn: 'Submit request', formNote: '* Required fields. We\'ll get back to you within 1 business day.',
    ctaTitle: 'Choose TWT Chat\nSimple tools for complex business challenges',
    ctaFree: 'Start for free', ctaPlan: 'Get a plan',
  },
});

const countryCode = ref('+86');
const countryOptions = [
  { label: '+86', value: '+86' },
  { label: '+93', value: '+93' },
  { label: '+297', value: '+297' },
  { label: '+968', value: '+968' },
  { label: '+971', value: '+971' },
  { label: '+251', value: '+251' },
  { label: '+1', value: '+1' },
  { label: '+44', value: '+44' },
];

const currentIndex = ref(0);
const solutions = useT({
  'zh-CN': [
    { tab: 'SaaS / B2B 团队', title: '把原本要来回十几封邮件的问题，一次讲清楚。', features: ['一键生成<strong>链接协助</strong>，屏幕共享+语音说明','使用<strong>实时标注</strong>，操作步骤一目了然','<strong>Copilot 智能推荐</strong>回复，降低对人工经验的依赖','在同一工作台实现<strong>客户支持与团队协作</strong>，减少反复沟通'] },
    { tab: '电商独立站/D2C品牌', title: '让每一次咨询，都更有机会变成订单。', features: ['<strong>快捷回复+实时翻译</strong>，缩短等待时间，提升下单转化','<strong>不限会话数、不限时段</strong>，高峰期也能稳定承接咨询','内置<strong>自动翻译</strong>，直接服务不同语系和语言的客户','将客户从人<strong>售后转化</strong>，订单与问题全程可追踪'] },
    { tab: '教培/在线课程团队', title: '让学员问题得到及时响应，提升课程完成率。', features: ['<strong>多渠道接入</strong>，学员随时随地提问','<strong>智能分配</strong>，问题快速流转到对应老师','<strong>知识库沉淀</strong>，常见问题自动回复','<strong>学习进度跟踪</strong>，主动关怀提升留存'] },
    { tab: '金融/投资服务团队', title: '在合规前提下，提供专业高效的客户服务。', features: ['<strong>数据加密传输</strong>，符合金融行业安全标准','<strong>会话记录留存</strong>，满足合规审计要求','<strong>专业术语库</strong>，确保服务专业性','<strong>VIP客户标识</strong>，提供差异化服务体验'] },
  ],
  'zh-TW': [
    { tab: 'SaaS / B2B 團隊', title: '把原本要來回十幾封郵件的問題，一次講清楚。', features: ['一鍵生成<strong>連結協助</strong>，螢幕共享+語音說明','使用<strong>即時標註</strong>，操作步驟一目了然','<strong>Copilot 智能推薦</strong>回覆，降低對人工經驗的依賴','在同一工作台實現<strong>客戶支援與團隊協作</strong>，減少反覆溝通'] },
    { tab: '電商獨立站/D2C品牌', title: '讓每一次諮詢，都更有機會變成訂單。', features: ['<strong>快捷回覆+即時翻譯</strong>，縮短等待時間，提升下單轉化','<strong>不限會話數、不限時段</strong>，高峰期也能穩定承接諮詢','內建<strong>自動翻譯</strong>，直接服務不同語系和語言的客戶','將客戶從人<strong>售後轉化</strong>，訂單與問題全程可追蹤'] },
    { tab: '教培/線上課程團隊', title: '讓學員問題得到及時回應，提升課程完成率。', features: ['<strong>多渠道接入</strong>，學員隨時隨地提問','<strong>智能分配</strong>，問題快速流轉到對應老師','<strong>知識庫沉澱</strong>，常見問題自動回覆','<strong>學習進度追蹤</strong>，主動關懷提升留存'] },
    { tab: '金融/投資服務團隊', title: '在合規前提下，提供專業高效的客戶服務。', features: ['<strong>資料加密傳輸</strong>，符合金融行業安全標準','<strong>會話記錄留存</strong>，滿足合規審計要求','<strong>專業術語庫</strong>，確保服務專業性','<strong>VIP客戶標識</strong>，提供差異化服務體驗'] },
  ],
  'en': [
    { tab: 'SaaS / B2B Teams', title: 'Resolve in one conversation what used to take a dozen emails.', features: ['One-click <strong>link-based assistance</strong> with screen sharing + voice','<strong>Live annotation</strong> makes every step crystal clear','<strong>Copilot smart suggestions</strong> reduce reliance on individual expertise','<strong>Customer support and team collaboration</strong> in one workspace'] },
    { tab: 'E-commerce / D2C Brands', title: 'Turn every inquiry into a purchase opportunity.', features: ['<strong>Quick replies + real-time translation</strong> shorten wait times and boost conversions','<strong>Unlimited sessions, no time restrictions</strong> — handle peak traffic with ease','Built-in <strong>auto-translation</strong> serves customers in any language','Track <strong>post-sale conversions</strong> — orders and issues fully traceable'] },
    { tab: 'EdTech / Online Courses', title: 'Respond to learner questions instantly and improve course completion.', features: ['<strong>Multi-channel access</strong> — learners ask questions anytime, anywhere','<strong>Smart routing</strong> sends questions to the right instructor fast','<strong>Knowledge base</strong> auto-answers common questions','<strong>Progress tracking</strong> enables proactive outreach to boost retention'] },
    { tab: 'Finance / Investment Teams', title: 'Professional, efficient customer service — fully compliant.', features: ['<strong>Encrypted data transmission</strong> meets financial industry security standards','<strong>Session records</strong> satisfy compliance and audit requirements','<strong>Professional terminology library</strong> ensures service quality','<strong>VIP client tagging</strong> enables differentiated service experiences'] },
  ],
});

const prevSolution = () => { if (currentIndex.value > 0) currentIndex.value--; };
const nextSolution = () => { if (currentIndex.value < solutions.value.length - 1) currentIndex.value++; };

const featList = useT({
  'zh-CN': [
    { icon: '📱', title: '高效极速接入', desc: '3 分钟完成网站代码部署，无需下载，注册即可使用' },
    { icon: '💻', title: '多端协同响应', desc: '支持 App、Web、客户端，数据实时同步，多端无缝切换' },
    { icon: '🤖', title: 'AI 智能赋能', desc: 'AI 深度学习企业知识库，Copilot 智能辅助推荐高质量回复' },
    { icon: '👤', title: '专业服务支持', desc: '专业客户成功团队全程支持，7x24 小时服务响应' },
    { icon: '🔒', title: '数据安全保障', desc: '全站 HTTPS / SSL 加密传输，遵循GDPR数据保护原则' },
    { icon: '🔌', title: '开放能力扩展', desc: '提供开放 API 与开发能力，Webhook 支持轻松对接各系统' },
  ],
  'zh-TW': [
    { icon: '📱', title: '高效極速接入', desc: '3 分鐘完成網站代碼部署，無需下載，註冊即可使用' },
    { icon: '💻', title: '多端協同響應', desc: '支援 App、Web、客戶端，資料即時同步，多端無縫切換' },
    { icon: '🤖', title: 'AI 智能賦能', desc: 'AI 深度學習企業知識庫，Copilot 智能輔助推薦高品質回覆' },
    { icon: '👤', title: '專業服務支援', desc: '專業客戶成功團隊全程支援，7x24 小時服務響應' },
    { icon: '🔒', title: '資料安全保障', desc: '全站 HTTPS / SSL 加密傳輸，遵循GDPR資料保護原則' },
    { icon: '🔌', title: '開放能力擴展', desc: '提供開放 API 與開發能力，Webhook 支援輕鬆對接各系統' },
  ],
  'en': [
    { icon: '📱', title: 'Fast onboarding', desc: 'Deploy website code in 3 minutes. No download needed — sign up and go.' },
    { icon: '💻', title: 'Multi-device sync', desc: 'App, web, and desktop client — real-time sync, seamless switching.' },
    { icon: '🤖', title: 'AI-powered assistance', desc: 'AI learns your knowledge base. Copilot suggests high-quality replies instantly.' },
    { icon: '👤', title: 'Dedicated support', desc: 'Customer success team available 7×24 to help you succeed.' },
    { icon: '🔒', title: 'Enterprise-grade security', desc: 'HTTPS/SSL encryption site-wide. GDPR compliant. Your data, your control.' },
    { icon: '🔌', title: 'Open & extensible', desc: 'Open API, webhooks, and developer tools to integrate with any system.' },
  ],
});

const faqItems = useT({
  'zh-CN': [
    { q: 'TWT Chat 是什么？', a: ['TWT Chat 是一个集 AI客服、在线工单、聊天、音视频与远程协助于一体的全渠道客户服务解决方案，简单易用，让小团队也能轻松服务客户。'] },
    { q: '你们是怎么收费的？', a: ['我们的专业版是按照席位收费的，推荐您直接按年订阅，目前订阅费用$11.88/席位/年，价格非常划算。您订阅专业版后我们会建专属服务群，由客服、运营、产品、技术给您提供专属服务'] },
    { q: '专业版和免费的区别是什么？', a: ['核心差异在于自定义功能和 AI 拓展能力：比如隐藏平台标识、推荐回复、AI 机器人、双向实时翻译等等。您新建项目后会自动赠送 14 天的专业版体验权益，到期前您可以选择续费，到期后也可手动降级为免费版。'] },
    { q: '14 天体验期到期后会怎样？', a: ['新项目创建即赠14天专业版全功能免费体验。体验结束可自主选择：1.续费专业版；2.降级免费版：长期可用，限1坐席，部分功能受限。'] },
    { q: '如何注册/新建Chat项目？', a: ['进入平台官网 https://www.twt.com，点击【14天免费试用】或【登录/注册】按钮，进入控制台新建项目即可。'] },
    { q: '你们有App吗？', a: ['支持网页端、PWA及手机App。苹果手机可在 AppStore 搜索 TWT Chat 下载，安卓手机访问官网下载地址即可。'] },
    { q: 'AI 是用的什么大模型？', a: ['目前采用的是OpenAI+QWen大模型组合，我们会根据市面上最新的大模型进行动态调整。'] },
  ],
  'zh-TW': [
    { q: 'TWT Chat 是什麼？', a: ['TWT Chat 是一個集 AI客服、線上工單、聊天、音視頻與遠端協助於一體的全渠道客戶服務解決方案，簡單易用，讓小團隊也能輕鬆服務客戶。'] },
    { q: '你們是怎麼收費的？', a: ['我們的專業版是按照席位收費的，推薦您直接按年訂閱，目前訂閱費用$11.88/席位/年。訂閱後我們會建專屬服務群，由客服、運營、產品、技術給您提供專屬服務。'] },
    { q: '專業版和免費版的區別是什麼？', a: ['核心差異在於自訂功能和 AI 擴展能力：例如隱藏平台標識、推薦回覆、AI 機器人、雙向即時翻譯等。新建項目後自動贈送 14 天專業版體驗，到期可選擇續費或降級免費版。'] },
    { q: '14 天體驗期到期後會怎樣？', a: ['體驗結束可自主選擇：1.續費專業版；2.降級免費版：長期可用，限1坐席，部分功能受限。'] },
    { q: '如何註冊/新建Chat項目？', a: ['進入平台官網 https://www.twt.com，點擊【14天免費試用】或【登入/註冊】按鈕，進入控制台新建項目即可。'] },
    { q: '你們有App嗎？', a: ['支援網頁端、PWA及手機App。蘋果手機可在 AppStore 搜尋 TWT Chat 下載，安卓手機訪問官網下載地址即可。'] },
    { q: 'AI 是用的什麼大模型？', a: ['目前採用的是OpenAI+QWen大模型組合，我們會根據市面上最新的大模型進行動態調整。'] },
  ],
  'en': [
    { q: 'What is TWT Chat?', a: ['TWT Chat is an all-in-one customer service platform combining AI support, ticketing, live chat, video calls, and remote assistance — simple enough for small teams, powerful enough for global operations.'] },
    { q: 'How does pricing work?', a: ['Pro is billed per seat. We recommend annual billing at $11.88/seat/year. After subscribing, you get a dedicated support group with our customer success, product, and engineering teams.'] },
    { q: 'What\'s the difference between Pro and Free?', a: ['The key differences are AI features and customization: custom branding, AI reply suggestions, chatbot, real-time translation, and more. Every new project gets a 14-day free Pro trial. After that, you can subscribe or downgrade to Free.'] },
    { q: 'What happens after the 14-day trial?', a: ['You can choose to subscribe to Pro, or downgrade to Free (1 seat, limited features). Current pricing is highly competitive — contact us for details.'] },
    { q: 'How do I create a Chat project?', a: ['Go to https://www.twt.com, click "14-day free trial" or "Login / Sign up", then create a new project in the console.'] },
    { q: 'Is there a mobile app?', a: ['Yes — iOS (App Store), Android (Google Play), and other Android devices via our website download page.'] },
    { q: 'Which AI model does TWT Chat use?', a: ['We currently use a combination of OpenAI and QWen models, and we dynamically update as better models become available.'] },
  ],
});

const activeFaqIndex = ref(0);
const toggleFaq = (index: number) => {
  activeFaqIndex.value = activeFaqIndex.value === index ? -1 : index;
};
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
  margin: 0 0 60px;
}

.solutions-carousel {
  overflow: hidden;
  margin-bottom: 40px;
}

.carousel-track {
  display: flex;
  transition: transform 0.5s ease;
}

.carousel-slide {
  min-width: 100%;
  padding: 0 60px;
}

.solution-content {
  display: grid;
  grid-template-columns: 1fr 400px;
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
  width: 100%;
  aspect-ratio: 4 / 3;
  border-radius: 16px;
  overflow: hidden;
}

.solution-tab {
  text-align: center;
  margin-top: 24px;
  padding: 10px 24px;
  background: #fff;
  border-radius: 20px;
  font-size: 14px;
  color: var(--links-color-text-primary);
  display: inline-block;
  margin-left: 50%;
  transform: translateX(-50%);
}

.carousel-nav {
  display: flex;
  justify-content: center;
  gap: 16px;
}

.nav-btn {
  width: 48px;
  height: 48px;
  border: 1px solid var(--links-color-border);
  border-radius: 50%;
  background: #fff;
  color: var(--links-color-text-primary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--links-motion-base);
}

.nav-btn:hover:not(:disabled) {
  border-color: var(--links-color-primary);
  color: var(--links-color-primary);
}

.nav-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
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

/* 功能特性 */
.features {
  padding: 80px 0;
  background: #fafafa;
}

.features h2 {
  text-align: center;
  font-size: 32px;
  margin: 0 0 16px;
  font-weight: 600;
}

.features-subtitle {
  text-align: center;
  font-size: 16px;
  color: var(--links-color-text-secondary);
  margin: 0 0 60px;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.feature-card {
  background: #fff;
  padding: 40px 24px;
  border-radius: 12px;
  text-align: center;
  transition: box-shadow var(--links-motion-base);
}

.feature-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.feature-icon {
  font-size: 48px;
  margin-bottom: 20px;
}

.feature-card h3 {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 12px;
}

.feature-card p {
  font-size: 14px;
  color: var(--links-color-text-secondary);
  line-height: 1.8;
  margin: 0;
}

@media (max-width: 768px) {
  .features-grid {
    grid-template-columns: 1fr;
  }
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
  max-width: 1200px;
  margin: 0 auto;
}

.faq-item {
  border-bottom: 1px solid #eee;
}

.faq-question {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 0;
  border: none;
  background: transparent;
  font-size: 16px;
  font-weight: 500;
  color: #333;
  text-align: left;
  cursor: pointer;
  transition: color 0.3s;
}

.faq-question:hover {
  color: var(--links-color-primary);
}

.faq-question--active {
  color: var(--links-color-primary);
}

.faq-icon {
  flex-shrink: 0;
  transition: transform 0.3s;
}

.faq-question--active .faq-icon {
  transform: rotate(180deg);
}

.faq-answer {
  padding: 0 0 20px;
  animation: fadeIn 0.3s ease;
}

.faq-answer p {
  margin: 0 0 12px;
  font-size: 15px;
  line-height: 1.8;
  color: #666;
}

.faq-answer p:last-child {
  margin-bottom: 0;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
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
  max-width: 600px;
  margin: 0 auto;
}

.demo-content h2 {
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
  width: 100%;
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

.form-group .required {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #ff4d4f;
  font-size: 14px;
  z-index: 1;
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

.form-group .required + input {
  padding-left: 32px;
}

.phone-input {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border: 1px solid var(--links-color-border);
  border-radius: 8px;
  background: #fff;
}

.country-select {
  width: 80px;
  flex-shrink: 0;
}

.country-select :deep(.n-base-selection) {
  border: none !important;
  background: transparent !important;
  padding: 0 !important;
}

.divider {
  color: var(--links-color-border);
  font-size: 16px;
}

.phone-number {
  flex: 1;
  border: none;
  outline: none;
  font-size: 14px;
  background: transparent;
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
