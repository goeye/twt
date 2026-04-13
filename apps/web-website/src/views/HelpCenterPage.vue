<template>
  <div class="help-center-page">
    <MarketingHeader />

    <div class="help-center-shell">
      <ProductSubNav active-key="help-center" :show-cta="false" />

      <section class="help-center-hero">
        <div class="help-center-hero__inner">
          <h1>{{ t.heroTitle }}</h1>
          <p>{{ t.heroSub }}</p>
        </div>
      </section>

      <section class="help-center-body">
        <div class="help-center-body__container">
          <aside class="help-center-sidebar">
            <div class="help-center-sidebar__inner">
              <div v-for="group in helpCenterGroups" :key="group.id" class="help-group">
                <button
                  type="button"
                  class="help-group__trigger"
                  :class="{ 'help-group__trigger--open': isGroupOpen(group.id) }"
                  :aria-expanded="isGroupOpen(group.id)"
                  @click="toggleGroup(group.id)"
                >
                  <span>{{ group.title }}</span>
                  <svg class="help-group__arrow" width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                    <path d="M3.5 5.25L7 8.75L10.5 5.25" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </button>

                <div v-show="isGroupOpen(group.id)" class="help-group__items">
                  <button
                    v-for="item in group.items"
                    :key="item.id"
                    type="button"
                    class="help-group__item"
                    :class="{ 'help-group__item--active': item.id === activeArticleId }"
                    @click="setActiveArticle(group.id, item.id)"
                  >
                    {{ item.label }}
                  </button>
                </div>
              </div>
            </div>
          </aside>

          <main class="help-center-article">
            <h2>{{ currentArticle.title }}</h2>

            <section class="help-center-article__intro">
              <h3>{{ currentArticle.subheading ?? currentArticle.title }}</h3>
              <p v-for="paragraph in currentArticle.intro" :key="paragraph" class="help-center-article__paragraph">
                {{ paragraph }}
              </p>
            </section>

            <section
              v-for="section in currentArticle.sections"
              :key="section.title"
              class="help-center-article__section"
            >
              <h4>{{ section.title }}</h4>

              <p
                v-for="paragraph in section.paragraphs ?? []"
                :key="paragraph"
                class="help-center-article__paragraph"
              >
                {{ paragraph }}
              </p>

              <ul v-if="section.items?.length" class="help-center-article__list">
                <li v-for="item in section.items" :key="item.title" class="help-center-article__list-item">
                  <span class="help-center-article__dot" aria-hidden="true"></span>
                  <div>
                    <div class="help-center-article__list-title">{{ item.title }}</div>
                    <p class="help-center-article__paragraph">{{ item.description }}</p>
                  </div>
                </li>
              </ul>
            </section>
          </main>
        </div>
      </section>

      <SiteFooter />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import MarketingHeader from '../components/layout/MarketingHeader.vue';
import ProductSubNav from '../components/layout/ProductSubNav.vue';
import SiteFooter from '../components/layout/SiteFooter.vue';
import { useLocale, useT } from '../composables/useLocale';

type HelpArticleItem = {
  title: string;
  description: string;
};

type HelpArticleSection = {
  title: string;
  paragraphs?: string[];
  items?: HelpArticleItem[];
};

type HelpArticle = {
  id: string;
  title: string;
  subheading?: string;
  intro: string[];
  sections: HelpArticleSection[];
};

type HelpGroup = {
  id: string;
  title: string;
  items: Array<{
    id: string;
    label: string;
  }>;
};

const article = (
  id: string,
  title: string,
  intro: string[],
  sections: HelpArticleSection[],
  subheading?: string
): HelpArticle => ({
  id,
  title,
  subheading,
  intro,
  sections
});

const { locale } = useLocale();

const t = useT({
  'zh-CN': { heroTitle: '👋 欢迎来到 Chat 帮助中心', heroSub: '在这里可以找到你想要的答案～' },
  'zh-TW': { heroTitle: '👋 歡迎來到 Chat 幫助中心', heroSub: '在這裡可以找到你想要的答案～' },
  'en': { heroTitle: '👋 Welcome to the Chat Help Center', heroSub: 'Find the answers you need right here.' },
});

const groupLabels = {
  'zh-CN': { faq: '常见问题', 'quick-start': '快速开始', conversation: '会话', chat: '聊天', visitor: '访客与客户', install: '安装', report: '报表', marketing: '营销', 'ai-agent': 'AI Agent', settings: '设置' },
  'zh-TW': { faq: '常見問題', 'quick-start': '快速開始', conversation: '會話', chat: '聊天', visitor: '訪客與客戶', install: '安裝', report: '報表', marketing: '行銷', 'ai-agent': 'AI Agent', settings: '設定' },
  'en': { faq: 'FAQ', 'quick-start': 'Quick Start', conversation: 'Conversations', chat: 'Chat', visitor: 'Visitors & Customers', install: 'Installation', report: 'Reports', marketing: 'Marketing', 'ai-agent': 'AI Agent', settings: 'Settings' },
};

const itemLabels = {
  'zh-CN': {
    'faq-pricing': '专业版和免费版有什么区别？怎么收费？', 'faq-project-management': '如何创建和管理项目？', 'faq-clients': '支持哪些客户端？', 'faq-ai-model': 'AI 是用的什么大模型？', 'faq-knowledge-base': '知识库如何使用？', 'faq-session-management': '会话如何自动分配和转移？', 'faq-team-management': '如何管理客服团队？', 'faq-visitor-setup': '怎么和访客进行互通？',
    'chat-intro': 'Chat 介绍', 'create-project': '创建项目', 'project-management': '项目管理', 'login-chat': '登录 Chat', 'getting-started': '开始使用',
    'session-overview': '会话总览', 'quick-reply': '快捷回复', 'customer-profile': '客户资料管理', 'web-install': '网站接入', 'dashboard': '运营看板', 'proactive-campaign': '主动营销', 'copilot': 'Copilot 协作', 'roles-permission': '角色与权限',
  },
  'zh-TW': {
    'faq-pricing': '專業版和免費版有什麼區別？怎麼收費？', 'faq-project-management': '如何建立和管理項目？', 'faq-clients': '支援哪些客戶端？', 'faq-ai-model': 'AI 是用的什麼大模型？', 'faq-knowledge-base': '知識庫如何使用？', 'faq-session-management': '會話如何自動分配和轉移？', 'faq-team-management': '如何管理客服團隊？', 'faq-visitor-setup': '怎麼和訪客進行互通？',
    'chat-intro': 'Chat 介紹', 'create-project': '建立項目', 'project-management': '項目管理', 'login-chat': '登入 Chat', 'getting-started': '開始使用',
    'session-overview': '會話總覽', 'quick-reply': '快捷回覆', 'customer-profile': '客戶資料管理', 'web-install': '網站接入', 'dashboard': '營運看板', 'proactive-campaign': '主動行銷', 'copilot': 'Copilot 協作', 'roles-permission': '角色與權限',
  },
  'en': {
    'faq-pricing': 'Pro vs Free — what\'s the difference?', 'faq-project-management': 'How do I create and manage a project?', 'faq-clients': 'Which clients are supported?', 'faq-ai-model': 'Which AI model does TWT Chat use?', 'faq-knowledge-base': 'How do I use the knowledge base?', 'faq-session-management': 'How are conversations assigned and transferred?', 'faq-team-management': 'How do I manage my support team?', 'faq-visitor-setup': 'How do visitors connect with me?',
    'chat-intro': 'Chat Overview', 'create-project': 'Create a Project', 'project-management': 'Project Management', 'login-chat': 'Log in to Chat', 'getting-started': 'Getting Started',
    'session-overview': 'Conversation Overview', 'quick-reply': 'Quick Replies', 'customer-profile': 'Customer Profile Management', 'web-install': 'Website Integration', 'dashboard': 'Analytics Dashboard', 'proactive-campaign': 'Proactive Campaigns', 'copilot': 'Copilot Collaboration', 'roles-permission': 'Roles & Permissions',
  },
};

const helpCenterGroups = computed(() => {
  const gl = groupLabels[locale.value];
  const il = itemLabels[locale.value];
  return [
    { id: 'faq', title: gl.faq, items: ['faq-pricing','faq-project-management','faq-clients','faq-ai-model','faq-knowledge-base','faq-session-management','faq-team-management','faq-visitor-setup'].map(id => ({ id, label: il[id as keyof typeof il] })) },
    { id: 'quick-start', title: gl['quick-start'], items: ['chat-intro','create-project','project-management','login-chat','getting-started'].map(id => ({ id, label: il[id as keyof typeof il] })) },
    { id: 'conversation', title: gl.conversation, items: [{ id: 'session-overview', label: il['session-overview'] }] },
    { id: 'chat', title: gl.chat, items: [{ id: 'quick-reply', label: il['quick-reply'] }] },
    { id: 'visitor', title: gl.visitor, items: [{ id: 'customer-profile', label: il['customer-profile'] }] },
    { id: 'install', title: gl.install, items: [{ id: 'web-install', label: il['web-install'] }] },
    { id: 'report', title: gl.report, items: [{ id: 'dashboard', label: il['dashboard'] }] },
    { id: 'marketing', title: gl.marketing, items: [{ id: 'proactive-campaign', label: il['proactive-campaign'] }] },
    { id: 'ai-agent', title: gl['ai-agent'], items: [{ id: 'copilot', label: il['copilot'] }] },
    { id: 'settings', title: gl.settings, items: [{ id: 'roles-permission', label: il['roles-permission'] }] },
  ];
});

const helpArticles = computed((): Record<string, HelpArticle> => {
const isEn = locale.value === 'en';
const isTW = locale.value === 'zh-TW';
return {
  'faq-pricing': article(
    'faq-pricing',
    isEn ? 'Pro vs Free — what\'s the difference?' : isTW ? '專業版和免費版有什麼區別？怎麼收費？' : '专业版和免费版有什么区别？怎么收费？',
    [isEn ? 'Every new project gets a 14-day full Pro trial. After that, choose to subscribe or downgrade to Free.' : isTW ? '新項目建立即贈 14 天專業版全功能免費體驗，到期後可自主選擇續費或降級免費版。' : '新项目创建即赠 14 天专业版全功能免费体验，到期后可自主选择续费或降级免费版。'],
    [
      {
        title: isEn ? 'Key differences' : isTW ? '版本核心差異' : '版本核心差异',
        paragraphs: isEn ? [
          'Free: unlimited time, 1 seat, limited features.',
          'Pro: AI features (reply suggestions, chatbot, real-time translation), custom branding, and all advanced capabilities. See full comparison: https://www.twt.com/chat/pricing'
        ] : isTW ? [
          '免費版：長期可用，限 1 坐席，部分功能受限。',
          '專業版：解鎖 AI 能力（推薦回覆、AI 機器人、雙向即時翻譯）、自訂品牌標識及全部高級功能。詳細對比見定價頁面：https://www.twt.com/chat/pricing'
        ] : [
          '免费版：长期可用，限 1 坐席，部分功能受限。',
          '专业版：解锁 AI 能力（推荐回复、AI 机器人、双向实时翻译）、自定义品牌标识及全部高级功能。详细对比见定价页面：https://www.twt.com/chat/pricing'
        ]
      },
      {
        title: isEn ? 'Pricing' : isTW ? '收費方式' : '收费方式',
        paragraphs: isEn ? [
          'Pro is billed per seat. Annual billing recommended at $11.88/seat/year.',
          'A seat is any team member who handles visitor conversations in the workspace.',
          'Subscribers get a dedicated support group with our customer success, product, and engineering teams.'
        ] : isTW ? [
          '專業版按席位收費，推薦按年訂閱，目前 $11.88/席位/年。',
          '席位指需要在客服工作台接待訪客的工作人員，訂閱後可透過郵箱邀請加入。',
          '訂閱後我們會建專屬服務群，由客服、運營、產品、技術提供專屬支援。'
        ] : [
          '专业版按席位收费，推荐按年订阅，目前 $11.88/席位/年。',
          '席位指需要在客服工作台接待访客的工作人员，订阅后可通过邮箱邀请加入。',
          '订阅后我们会建专属服务群，由客服、运营、产品、技术提供专属支持。'
        ]
      }
    ]
  ),
  'faq-project-management': article(
    'faq-project-management',
    isEn ? 'How do I create and manage a project?' : isTW ? '如何建立和管理項目？' : '如何创建和管理项目？',
    isEn ? [
      'Create a project:',
      '1. Go to https://www.twt.com',
      '2. Click "14-day free trial" or "Login / Sign up"',
      '3. Create a new project in the console',
      '4. Jump to the agent workspace to configure settings',
      '',
      'Edit project name and avatar:',
      'Option 1: Console → Project Management, click the avatar/name to edit (https://chat-console.twt.com)',
      'Option 2: Workspace → Settings → Customize → Appearance (https://chat.twt.com/workspace/settings/install/custom)'
    ] : isTW ? [
      '建立項目：',
      '1、進入平台官網 https://www.twt.com',
      '2、點擊頁面中間的【14天免費試用】或【登入/註冊】按鈕',
      '3、進入控制台新建項目',
      '4、點擊跳轉至客服工作台進行設定管理即可',
      '',
      '修改項目名稱和頭像：',
      '方式一：在控制台-項目管理，滑鼠點擊頭像/名稱即可修改（https://chat-console.twt.com）',
      '方式二：在客服工作台，設定-自訂-外觀，修改 Logo及品牌名稱即可（https://chat.twt.com/workspace/settings/install/custom）'
    ] : [
      '创建项目：',
      '1、进入平台官网 https://www.twt.com',
      '2、点击页面中间的【14天免费试用】或【登录/注册】按钮',
      '3、进入控制台新建项目',
      '4、点击跳转至客服工作台进行设置管理即可',
      '',
      '修改项目名称和头像：',
      '方式一：在控制台-项目管理，鼠标点击头像/名称即可修改（https://chat-console.twt.com）',
      '方式二：在客服工作台，设置-自定义-外观，修改 Logo及品牌名称即可（https://chat.twt.com/workspace/settings/install/custom）'
    ],
    []
  ),
  'faq-clients': article(
    'faq-clients',
    isEn ? 'Which clients are supported?' : isTW ? '支援哪些客戶端？' : '支持哪些客户端？',
    isEn ? [
      'We support web, PWA, and mobile apps.',
      '',
      'Desktop:',
      '• Web: access directly via browser',
      '• PWA: open the workspace in Chrome/Safari/Firefox, click Install in the address bar',
      '• Native desktop client coming in June',
      '',
      'Mobile:',
      '• iOS: search "TWT Chat" on the App Store',
      '• Android (Google Play): search "TWT Chat" on Google Play',
      '• Other Android: download from https://www.twt.com/zh-CN/chat/download'
    ] : isTW ? [
      '我們支援網頁端、PWA應用、手機App等多種客戶端。',
      '',
      '電腦端：',
      '• 網頁版：直接透過瀏覽器訪問',
      '• PWA應用：使用 Google/Safari/Firefox 瀏覽器進入客服工作台，地址欄右側點擊【安裝】即可',
      '• 原生客戶端將在 6 月份正式上線',
      '',
      '手機端：',
      '• 蘋果手機：AppStore 直接搜尋 TWT Chat 下載',
      '• 支援Google服務手機：GooglePlay 直接搜尋 TWT Chat 下載',
      '• 其他安卓手機：訪問官網下載地址 https://www.twt.com/zh-CN/chat/download'
    ] : [
      '我们支持网页端、PWA应用、手机App等多种客户端。',
      '',
      '电脑端：',
      '• 网页版：直接通过浏览器访问',
      '• PWA应用：使用 Google/Safari/火狐浏览器进入客服工作台，地址栏右侧点击【安装】即可',
      '• 原生客户端将在 6 月份正式上线',
      '',
      '手机端：',
      '• 苹果手机：AppStore 直接搜索 TWT Chat 下载',
      '• 支持Google服务手机：GooglePlay 直接搜索 TWT Chat 下载',
      '• 其他安卓手机：访问官网下载地址 https://www.twt.com/zh-CN/chat/download'
    ],
    []
  ),
  'faq-ai-model': article(
    'faq-ai-model',
    isEn ? 'Which AI model does TWT Chat use?' : isTW ? 'AI 是用的什麼大模型？' : 'AI 是用的什么大模型？',
    [isEn ? 'We currently use a combination of OpenAI and QWen models, and dynamically update as better models become available.' : isTW ? '目前採用的是OpenAI+QWen大模型組合，我們會根據市面上最新的大模型進行動態調整。' : '目前采用的是OpenAI+QWen大模型组合，我们会根据市面上最新的大模型进行动态调整。'],
    []
  ),
  'faq-knowledge-base': article(
    'faq-knowledge-base',
    isEn ? 'How do I use the knowledge base?' : isTW ? '知識庫如何使用？' : '知识库如何使用？',
    isEn ? [
      '1. Go to Workspace → Sidebar → AI Agent → Knowledge Base, and add content via documents or Q&A pairs',
      '2. AI will automatically train on the content to build a project-specific knowledge framework',
      '3. Enable the relevant capabilities in Copilot / Autopilot',
      '4. When a visitor sends a message, AI searches the knowledge base and generates a reply',
      '5. Both suggested and automated replies significantly improve response efficiency and accuracy'
    ] : isTW ? [
      '1、客服工作台-側邊欄-AI Agent-知識庫，透過文件或者 QA 錄入相關知識及問題',
      '2、AI 會自動調用大模型進行訓練學習，建立項目專屬的知識框架',
      '3、在 Copilot/Autopilot 中開啟對應能力',
      '4、訪客發送消息後 AI 會自動從知識庫中尋找對應回答，並生成對應回覆',
      '5、無論是推薦回覆還是自動回覆，都能大大提升接待效率和精準度'
    ] : [
      '1、客服工作台-侧边栏-AI Agent-知识库，通过文档或者 QA 录入相关知识及问题',
      '2、AI 会自动调用大模型进行训练学习，创建项目专属的知识框架',
      '3、在 Copilot/Autopilot 中开启对应能力',
      '4、访客发送消息后 AI 会自动从知识库中寻找对应回答，并生成对应回复',
      '5、无论是推荐回复还是自动回复，都能大大提升接待效率和精准度'
    ],
    []
  ),
  'faq-session-management': article(
    'faq-session-management',
    isEn ? 'How are conversations assigned and transferred?' : isTW ? '會話如何自動分配和轉移？' : '会话如何自动分配和转移？',
    [],
    isEn ? [
      { title: 'Auto-assignment', paragraphs: ['Conversations are assigned via dynamic round-robin to online agents.', 'If conversations aren\'t being assigned, check: 1. Agent status is set to Online (bottom-left avatar). 2. Active conversation count hasn\'t hit the limit (close conversations or raise the limit).'] },
      { title: 'Transfer on agent offline', paragraphs: ['You can configure auto-transfer when an agent is unresponsive. Enable via: Settings → Team → Agent Settings → Session Timeout.'] },
      { title: 'Translation', paragraphs: ['Real-time two-way translation is supported. Enable via the AI Translation toggle at the bottom of the conversation input area.'] },
    ] : isTW ? [
      { title: '會話自動分配', paragraphs: ['會話採用動態輪詢分配，會自動分配給當前在線的客服。', '如果會話長時間無法分配，請檢查：1. 客服是否設定為在線狀態（在左下角頭像處檢查）。2. 當前接待的未結束會話數是否達到上限。'] },
      { title: '客服下線轉移', paragraphs: ['支援配置客服超時不回消息，自動把會話分配給其他在線客服。', '開啟方式：設定-團隊-客服設定-會話超時。'] },
      { title: '翻譯功能', paragraphs: ['支援雙向即時翻譯，訪客發的消息自動翻譯成客服語言，客服打字自動翻譯成目標語言。', '開啟方式：訪客對話框底部，AI 翻譯功能，開啟即可。'] },
    ] : [
      { title: '会话自动分配', paragraphs: ['会话采用动态轮询分配，会自动分配给当前在线的客服。', '如果会话长时间无法分配，请检查：1. 客服是否设置为在线状态（在左下角头像处检查）。2. 当前接待的未结束会话数是否达到上限（可手动结束会话，或调大客服接待上限）。'] },
      { title: '客服下线转移', paragraphs: ['支持配置客服超时不回消息，自动把会话分配给其他在线客服。', '开启方式：设置-团队-客服设置-会话超时。'] },
      { title: '翻译功能', paragraphs: ['支持双向实时翻译，访客发的消息自动翻译成客服语言，客服打字自动翻译成目标语言。', '开启方式：访客对话框底部，AI 翻译功能，开启即可。'] },
    ]
  ),
  'faq-team-management': article(
    'faq-team-management',
    isEn ? 'How do I manage my support team?' : isTW ? '如何管理客服團隊？' : '如何管理客服团队？',
    [],
    isEn ? [
      { title: 'Seat management', paragraphs: ['A seat is any team member who handles visitor conversations in the workspace.', 'Free plan includes 1 permanent free seat.', 'Additional seats require a Pro subscription ($11.88/seat/year).'] },
      { title: 'Edit agent info', paragraphs: ['Admins can update agent avatars, names, and nicknames.', 'Go to: Workspace → Settings → Team → Members → Account Details.'] },
      { title: 'Notification settings', paragraphs: ['Go to: Workspace → Left sidebar → Avatar → Notification Settings to toggle visitor alerts and other notifications.', 'If notifications still don\'t appear, check browser permissions via the address bar settings icon.'] },
    ] : isTW ? [
      { title: '坐席管理', paragraphs: ['坐席是指需要在客服工作台接待訪客的工作人員。', '免費版支援 1 個免費坐席永久使用。', '如需新增坐席需要升級專業版（$11.88/坐席/年）。'] },
      { title: '修改客服資訊', paragraphs: ['管理員可以修改團隊客服的頭像、姓名、暱稱等資訊。', '操作位置：工作台-設定-團隊-成員，列表右側操作按鈕，點擊【帳號詳情】。'] },
      { title: '通知設定', paragraphs: ['在客服工作台，左側邊欄-頭像-通知設定，可開啟或關閉訪客進入提醒等各類通知。', '如果依舊沒有通知，需檢查瀏覽器的權限，點擊地址欄旁邊的設定按鈕，確認通知權限開啟。'] },
    ] : [
      { title: '坐席管理', paragraphs: ['坐席是指需要在客服工作台接待访客的工作人员。', '免费版支持 1 个免费坐席永久使用。', '如需新增坐席需要升级专业版（$11.88/坐席/年）。'] },
      { title: '修改客服信息', paragraphs: ['管理员可以修改团队客服的头像、姓名、昵称等信息。', '操作位置：工作台-设置-团队-成员，列表右侧操作按钮，点击【账号详情】。'] },
      { title: '通知设置', paragraphs: ['在客服工作台，左侧边栏-头像-通知设置，可开启或关闭访客进入提醒等各类通知。', '如果依旧没有通知，需检查浏览器的权限，点击地址栏旁边的设置按钮，确认通知权限开启。'] },
    ]
  ),
  'faq-visitor-setup': article(
    'faq-visitor-setup',
    isEn ? 'How do visitors connect with me?' : isTW ? '怎麼和訪客進行互通？' : '怎么和访客进行互通？',
    isEn ? [
      'Step 1: Create a project and enter the agent workspace.',
      '',
      'Step 2: Choose an access method:',
      '1. Share the chat link: click "Chat Page" at the top of the workspace homepage',
      '2. Install the website widget: Settings → Installation → Website Code',
      '3. Use your own domain: download the HTML and deploy it',
    ] : isTW ? [
      '第一步：完成項目建立，並進入客服工作台',
      '',
      '第二步：選擇接入方式',
      '1. 直接分享聊天地址：在客服工作台首頁頂部【聊天頁面】按鈕點擊即可跳轉到訪客端，分享該地址即可',
      '2. 安裝網站小部件：在設定-安裝-網站代碼，複製代碼並整合到網站即可',
      '3. 使用自己的域名：可下載 Html 並部署，具體教程可見幫助中心',
    ] : [
      '第一步：完成项目创建，并进入客服工作台',
      '',
      '第二步：选择接入方式',
      '1. 直接分享聊天地址：在客服工作台首页顶部【聊天页面】按钮点击即可跳转到访客端，分享该地址即可',
      '2. 安装网站小部件：在设置-安装-网站代码，复制代码并集成到网站即可',
      '3. 使用自己的域名：可下载 Html 并部署，具体教程可见帮助中心',
    ],
    isEn ? [
      { title: 'Group & direct chat', paragraphs: ['Agents can initiate 1-on-1 or group chats (agent-initiated only).', '• Desktop: Conversations → [+] next to Live Chat', '• Mobile: Conversations → [+] top right', 'Group chats support up to 100 members.'] },
      { title: 'Visitor settings', paragraphs: ['• Conversation title: Settings → Installation → Customize → General', '• Limit visitor sessions: Settings → Customize → General → Session Features'] },
      { title: 'If your link is blocked', paragraphs: ['• With a website: use the widget — visitors open it through your domain, unaffected.', '• Without a website: buy a domain and deploy the platform\'s HTML under your own domain.', '• Guide: https://www.twt.com/zh-CN/chat/help/html-xia-zai'] },
    ] : isTW ? [
      { title: '單聊與群聊', paragraphs: ['平台支援客服主動發起 1v1 單聊或群聊（僅支援客服發起）。', '• 電腦端：會話-在線聊天旁邊【+】-選擇訪客或客服', '• 手機端：會話-右上角【+】-選擇訪客或客服', '群聊最多支援 100 人。'] },
      { title: '訪客端設定', paragraphs: ['• 會話標題展示：設定-安裝-自訂-常規模組', '• 限制訪客發起會話數：設定-自訂-常規-會話功能'] },
      { title: '連結被牆解決方案', paragraphs: ['• 有自己網站：採用小部件接入，訪客透過您的站點打開，不受影響', '• 無網站：購買域名後下載平台提供的 Html，用自己域名訪問聊天連結', '• 具體操作：https://www.twt.com/zh-CN/chat/help/html-xia-zai'] },
    ] : [
      { title: '单聊与群聊', paragraphs: ['平台支持客服主动发起 1v1 单聊或群聊（仅支持客服发起）。', '• 电脑端：会话-在线聊天旁边【+】-选择访客或客服', '• 手机端：会话-右上角【+】-选择访客或客服', '群聊最多支持 100 人。'] },
      { title: '访客端设置', paragraphs: ['• 会话标题展示：设置-安装-自定义-常规模块', '• 限制访客发起会话数：设置-自定义-常规-会话功能'] },
      { title: '链接被墙解决方案', paragraphs: ['• 有自己网站：采用小组件接入，访客通过您的站点打开，不受影响', '• 无网站：购买域名后下载平台提供的 Html，用自己域名访问聊天链接', '• 具体操作：https://www.twt.com/zh-CN/chat/help/html-xia-zai'] },
    ]
  ),
  'chat-intro': article(
    'chat-intro',
    isEn ? 'Chat Overview' : isTW ? 'Chat 介紹' : 'Chat 介绍',
    isEn ? [
      'TWT Chat is a full-channel customer service and live chat platform. It unifies messages from websites, apps, and social media in one workspace — with message aggregation, a knowledge base, automated routing, and analytics.',
      'If this is your first time using Chat, we recommend reading Chat Overview, Create a Project, and Getting Started in order to run through one complete real conversation.'
    ] : isTW ? [
      'TWT Chat 是 TWT 旗下的全渠道客服與即時聊天平台，幫助網站、App 與社媒在一個後台統一接待全球訪客，集消息聚合、知識庫、自動化分配和數據看板於一體。',
      '如果你是第一次接觸 Chat，建議先看完 Chat 介紹、建立項目和開始使用這幾個章節，先把一條真實會話完整跑通。'
    ] : [
      'TWT Chat 是 TWT 旗下的全渠道客服与实时聊天平台，帮助网站、App 与社媒在一个后台统一接待全球访客，集消息聚合、知识库、自动化分配和数据看板于一体。',
      '如果你是第一次接触 Chat，建议先看完 Chat 介绍、创建项目和开始使用这几个章节，先把一条真实会话完整跑通。'
    ],
    isEn ? [
      { title: 'Core capabilities', items: [
        { title: 'Unified messaging', description: 'Messages from web, app, social media, and direct chat links are all handled in one workspace.' },
        { title: 'Team collaboration', description: 'Supports conversation assignment, transfer, pending queues, and quick replies — no more switching between tools.' },
        { title: 'Knowledge & data', description: 'FAQs, customer profiles, and operational data accumulate over time for continuous improvement.' }
      ]},
      { title: 'Recommended onboarding order', items: [
        { title: 'Connect a message source first', description: 'Complete website embed or direct chat link deployment to ensure messages flow in reliably.' },
        { title: 'Then configure collaboration rules', description: 'Set up agent groups, routing rules, tags, and quick replies to align team workflows.' },
        { title: 'Finally review reports and optimize', description: 'Once the business is running, look at first response time, handle duration, and satisfaction scores.' }
      ]}
    ] : isTW ? [
      { title: '核心能力', items: [
        { title: '統一消息接待', description: '網頁、App、社媒和直聊連結的消息都可以在同一個工作台接收和處理。' },
        { title: '客服協作', description: '支援會話分配、轉接、待處理和快捷回覆，避免團隊在多個工具之間來回切換。' },
        { title: '知識與數據沉澱', description: '常見問題、客戶資料和營運數據可以持續積累，後續優化更有抓手。' }
      ]},
      { title: '推薦上手順序', items: [
        { title: '先接入消息來源', description: '優先完成網站嵌碼或直聊連結部署，確保消息能穩定進入系統。' },
        { title: '再配置協作規則', description: '先補齊客服組、分配規則、標籤和快捷回覆，讓團隊流程先統一。' },
        { title: '最後看報表和優化', description: '等業務跑起來後，再看首響、處理時長和滿意度這些指標。' }
      ]}
    ] : [
      { title: '核心能力', items: [
        { title: '统一消息接待', description: '网页、App、社媒和直聊链接的消息都可以在同一个工作台接收和处理。' },
        { title: '客服协作', description: '支持会话分配、转接、待处理和快捷回复，避免团队在多个工具之间来回切换。' },
        { title: '知识与数据沉淀', description: '常见问题、客户资料和运营数据可以持续积累，后续优化更有抓手。' }
      ]},
      { title: '推荐上手顺序', items: [
        { title: '先接入消息来源', description: '优先完成网站嵌码或直聊链接部署，确保消息能稳定进入系统。' },
        { title: '再配置协作规则', description: '先补齐客服组、分配规则、标签和快捷回复，让团队流程先统一。' },
        { title: '最后看报表和优化', description: '等业务跑起来后，再看首响、处理时长和满意度这些指标。' }
      ]}
    ],
    isEn ? 'Chat Overview' : isTW ? 'Chat 介紹' : 'Chat 介绍'
  ),
  'create-project': article(
    'create-project',
    isEn ? 'Create a Project' : isTW ? '建立項目' : '创建项目',
    [isEn ? 'A project is the business container in Chat. Each brand, site, or independent business line should have its own project.' : isTW ? '項目是 Chat 的業務容器。通常一個品牌、一個站點或一條獨立業務線，都建議使用單獨項目管理。' : '项目是 Chat 的业务容器。通常一个品牌、一个站点或者一条独立业务线，都建议使用单独项目管理。'],
    [
      {
        title: isEn ? 'Before you create' : isTW ? '建立前準備' : '创建前准备',
        items: isEn ? [
          { title: 'Define project scope', description: 'Clarify which website, brand, or business scenario this project serves to avoid teams sharing the same ruleset.' },
          { title: 'Prepare basic info', description: 'Project name, default language, timezone, and agent group directly affect onboarding and collaboration.' }
        ] : isTW ? [
          { title: '確定項目邊界', description: '先明確這個項目服務哪個網站、品牌或業務場景，避免不同團隊混用同一套規則。' },
          { title: '準備基礎信息', description: '項目名稱、預設語言、時區和客服組會直接影響後續接入與協作。' }
        ] : [
          { title: '确定项目边界', description: '先明确这个项目服务哪个网站、品牌或业务场景，避免不同团队混用同一套规则。' },
          { title: '准备基础信息', description: '项目名称、默认语言、时区和客服组会直接影响后续接入与协作。' }
        ]
      },
      {
        title: isEn ? 'Creation steps' : isTW ? '建立流程' : '创建流程',
        items: isEn ? [
          { title: 'Fill in basic config', description: 'Complete name, language, timezone, and brand info before setting up channels.' },
          { title: 'Connect a real channel', description: 'Run at least one real message source end-to-end so the project is not left empty.' }
        ] : isTW ? [
          { title: '填寫基礎配置', description: '先完成名稱、語言、時區和品牌信息，再進入渠道接入。' },
          { title: '接入真實渠道', description: '至少跑通一個真實消息來源，避免建立完成後仍然是空項目。' }
        ] : [
          { title: '填写基础配置', description: '先完成名称、语言、时区和品牌信息，再进入渠道接入。' },
          { title: '接入真实渠道', description: '至少跑通一个真实消息来源，避免创建完成后仍然是空项目。' }
        ]
      }
    ]
  ),
  'project-management': article(
    'project-management',
    isEn ? 'Project Management' : isTW ? '項目管理' : '项目管理',
    [isEn ? 'Project management is about clarifying business boundaries, member responsibilities, and message routing — not piling on configuration.' : isTW ? '項目管理的重點不是堆配置，而是把業務邊界、成員職責和消息流轉先理順。' : '项目管理的重点不是堆配置，而是把业务边界、成员职责和消息流转先理顺。'],
    [
      {
        title: isEn ? 'Recommended practices' : isTW ? '推薦管理方式' : '推荐管理方式',
        items: isEn ? [
          { title: 'Split projects by business line', description: 'Different brands, languages, or service strategies should be managed independently.' },
          { title: 'Standardize naming conventions', description: 'Agree on naming for projects, agent groups, tags, and quick replies upfront — it makes searching much easier later.' }
        ] : isTW ? [
          { title: '按業務拆分項目', description: '不同品牌、不同語種或不同服務策略的業務，建議獨立管理。' },
          { title: '統一命名規範', description: '項目、客服組、標籤和快捷回覆最好提前約定命名方式，後續檢索會輕鬆很多。' }
        ] : [
          { title: '按业务拆分项目', description: '不同品牌、不同语种或不同服务策略的业务，建议独立管理。' },
          { title: '统一命名规范', description: '项目、客服组、标签和快捷回复最好提前约定命名方式，后续检索会轻松很多。' }
        ]
      }
    ]
  ),
  'login-chat': article(
    'login-chat',
    isEn ? 'Log in to Chat' : isTW ? '登入 Chat' : '登录 Chat',
    [isEn ? 'Before logging in, confirm your account has been added to the project with the correct role.' : isTW ? '登入前請先確認你的帳號已經加入對應項目，並且擁有正確的角色權限。' : '登录前请先确认你的账号已经加入对应项目，并且拥有正确的角色权限。'],
    [{ title: isEn ? 'Login methods' : isTW ? '登入方式' : '登录方式', items: isEn ? [
      { title: 'Email or password', description: 'Use the email invited by the admin or your enterprise account to enter the workspace.' },
      { title: 'Multi-device sync', description: 'Web, desktop client, and mobile can be used based on team preference — messages and session state stay in sync.' }
    ] : isTW ? [
      { title: '郵箱或帳號密碼登入', description: '使用管理員邀請的郵箱或企業帳號進入工作台。' },
      { title: '多端同步使用', description: 'Web、客戶端和移動端可按團隊習慣選擇，消息與會話狀態保持同步。' }
    ] : [
      { title: '邮箱或账号密码登录', description: '使用管理员邀请的邮箱或企业账号进入工作台。' },
      { title: '多端同步使用', description: 'Web、客户端和移动端可按团队习惯选择，消息与会话状态保持同步。' }
    ]}]
  ),
  'getting-started': article(
    'getting-started',
    isEn ? 'Getting Started' : isTW ? '開始使用' : '开始使用',
    [isEn ? 'Getting started isn\'t about clicking every button — it\'s about running one real message from entry to resolution, end to end.' : isTW ? '真正的上手，不是把按鈕點一遍，而是讓一條真實消息從進入系統到被解決，完整跑通一次。' : '真正的上手，不是把按钮点一遍，而是让一条真实消息从进入系统到被解决，完整跑通一次。'],
    [{ title: isEn ? 'Recommended first steps' : isTW ? '建議優先完成' : '建议优先完成', items: isEn ? [
      { title: 'Run through a complete conversation', description: 'Confirm that a visitor can send a message, an agent receives it, replies, transfers, and closes it.' },
      { title: 'Prepare basic content', description: 'Set up welcome messages, quick replies, FAQs, and tags before the team starts using it.' }
    ] : isTW ? [
      { title: '跑通一條完整會話', description: '確認訪客發起消息、客服接收、回覆、轉接和關閉會話都正常。' },
      { title: '準備基礎素材', description: '歡迎語、快捷回覆、常見問題和標籤先補齊，團隊使用起來會更順。' }
    ] : [
      { title: '跑通一条完整会话', description: '确认访客发起消息、客服接收、回复、转接和关闭会话都正常。' },
      { title: '准备基础素材', description: '欢迎语、快捷回复、常见问题和标签先补齐，团队使用起来会更顺。' }
    ]}]
  ),
  'session-overview': article(
    'session-overview',
    isEn ? 'Conversation Overview' : isTW ? '會話總覽' : '会话总览',
    [isEn ? 'The conversation page is the agent\'s main workspace — focused on helping agents quickly prioritize and act.' : isTW ? '會話頁是客服的主工作區，重點是幫助坐席快速判斷優先級並完成處理動作。' : '会话页是客服的主工作区，重点是帮助坐席快速判断优先级并完成处理动作。'],
    [{ title: isEn ? 'Core views' : isTW ? '核心視圖' : '核心视图', items: isEn ? [
      { title: 'Status & filters', description: 'Quickly filter conversations by status: pending, active, on-hold, or closed.' },
      { title: 'Visitor context', description: 'Use source, page, history, and notes to reduce repeated questions.' }
    ] : isTW ? [
      { title: '狀態與篩選', description: '按待接入、處理中、待處理、已關閉等狀態快速篩選會話。' },
      { title: '訪客上下文', description: '結合來源、頁面、歷史記錄和備註，減少重複提問。' }
    ] : [
      { title: '状态与筛选', description: '按待接入、处理中、待处理、已关闭等状态快速筛选会话。' },
      { title: '访客上下文', description: '结合来源、页面、历史记录和备注，减少重复提问。' }
    ]}]
  ),
  'quick-reply': article(
    'quick-reply',
    isEn ? 'Quick Replies' : isTW ? '快捷回覆' : '快捷回复',
    [isEn ? 'Quick replies standardize high-frequency responses, reduce repetitive typing, and keep service messaging consistent.' : isTW ? '快捷回覆用於統一高頻場景表達，減少重複輸入，同時保證服務口徑一致。' : '快捷回复用于统一高频场景表达，减少重复输入，同时保证服务口径一致。'],
    [{ title: isEn ? 'Recommended content to add' : isTW ? '推薦沉澱內容' : '推荐沉淀内容', items: isEn ? [
      { title: 'Standard greetings', description: 'Cover opening, queue notices, and closing messages for high-frequency scenarios.' },
      { title: 'Common question answers', description: 'Template answers for payment, shipping, and after-sales questions.' }
    ] : isTW ? [
      { title: '標準問候語', description: '覆蓋開場、排隊說明、結束語等高頻場景。' },
      { title: '常見問題答案', description: '支付、物流、售後等高頻問題建議整理成模板。' }
    ] : [
      { title: '标准问候语', description: '覆盖开场、排队说明、结束语等高频场景。' },
      { title: '常见问题答案', description: '支付、物流、售后等高频问题建议整理成模板。' }
    ]}]
  ),
  'customer-profile': article(
    'customer-profile',
    isEn ? 'Customer Profile Management' : isTW ? '客戶資料管理' : '客户资料管理',
    [isEn ? 'The customer profile page helps agents quickly understand who the customer is, where they\'re from, and what\'s happened before.' : isTW ? '客戶資料頁的目標，是幫助客服在極短時間內判斷客戶是誰、來自哪裡、歷史發生過什麼。' : '客户资料页的目标，是帮助客服在极短时间内判断客户是谁、来自哪里、历史发生过什么。'],
    [{ title: isEn ? 'Recommended fields to maintain' : isTW ? '建議維護的資訊' : '建议维护的信息', items: isEn ? [
      { title: 'Basic identity', description: 'Name, email, phone, and region fields build customer recognition capability.' },
      { title: 'Tags & notes', description: 'Use tags for stage and type; use notes for personalized context.' }
    ] : isTW ? [
      { title: '基礎身份資訊', description: '姓名、郵箱、電話、地區等欄位用於建立客戶識別能力。' },
      { title: '標籤與備註', description: '用標籤表達階段與類型，用備註補充個性化背景。' }
    ] : [
      { title: '基础身份信息', description: '姓名、邮箱、电话、地区等字段用于建立客户识别能力。' },
      { title: '标签与备注', description: '用标签表达阶段与类型，用备注补充个性化背景。' }
    ]}]
  ),
  'web-install': article(
    'web-install',
    isEn ? 'Website Integration' : isTW ? '網站接入' : '网站接入',
    [isEn ? 'The goal of website integration is to display the chat entry in the right place and ensure visitor messages reliably reach the workspace.' : isTW ? '網站接入的核心目標，是讓消息入口展示在正確的位置，並確保訪客消息穩定進入工作台。' : '网站接入的核心目标，是让消息入口展示在正确的位置，并确保访客消息稳定进入工作台。'],
    [{ title: isEn ? 'Integration checklist' : isTW ? '接入檢查項' : '接入检查项', items: isEn ? [
      { title: 'Confirm embed location', description: 'Place the code in the site\'s shared layout to avoid missing pages.' },
      { title: 'Verify in real environment', description: 'Before going live, run through a complete conversation on both desktop and mobile.' }
    ] : isTW ? [
      { title: '確認嵌碼位置', description: '建議放在站點公共佈局中，避免部分頁面漏掛。' },
      { title: '驗證真實環境', description: '上線前至少在桌面端和移動端各走一遍完整會話。' }
    ] : [
      { title: '确认嵌码位置', description: '建议放在站点公共布局中，避免部分页面漏挂。' },
      { title: '验证真实环境', description: '上线前至少在桌面端和移动端各走一遍完整会话。' }
    ]}]
  ),
  'dashboard': article(
    'dashboard',
    isEn ? 'Analytics Dashboard' : isTW ? '營運看板' : '运营看板',
    [isEn ? 'The dashboard\'s value isn\'t displaying data — it\'s helping the team see whether they\'re busy, slow, or effective.' : isTW ? '看板的價值，不是擺數據，而是幫團隊看清忙不忙、慢不慢、值不值。' : '看板的价值，不是摆数据，而是帮团队看清忙不忙、慢不慢、值不值。'],
    [{ title: isEn ? 'Key metrics to watch' : isTW ? '重點關注指標' : '重点关注指标', items: isEn ? [
      { title: 'Volume & first response', description: 'Start with volume, then speed — the most direct load signal.' },
      { title: 'Handle time & satisfaction', description: 'Efficiency and quality must be read together — don\'t fixate on a single average.' }
    ] : isTW ? [
      { title: '會話量與首響', description: '先看量，再看速度，這是最直接的負載反饋。' },
      { title: '處理時長與滿意度', description: '效率和品質要一起看，別只盯一個平均值。' }
    ] : [
      { title: '会话量与首响', description: '先看量，再看速度，这是最直接的负载反馈。' },
      { title: '处理时长与满意度', description: '效率和质量要一起看，别只盯一个平均值。' }
    ]}]
  ),
  'proactive-campaign': article(
    'proactive-campaign',
    isEn ? 'Proactive Campaigns' : isTW ? '主動行銷' : '主动营销',
    [isEn ? 'Proactive campaigns aren\'t random popups — they\'re the right message, to the right person, at the right moment.' : isTW ? '主動行銷不是亂彈窗，而是在合適時機，把合適的資訊推給最可能轉化的人。' : '主动营销不是乱弹窗，而是在合适时机，把合适的信息推给最可能转化的人。'],
    [{ title: isEn ? 'Best practices' : isTW ? '推薦做法' : '推荐做法', items: isEn ? [
      { title: 'Behavior-based triggers', description: 'Trigger based on page, time on site, and traffic source for differentiated messaging.' },
      { title: 'Control frequency', description: 'Too many triggers just annoy users and hurt conversion.' }
    ] : isTW ? [
      { title: '基於行為觸發', description: '根據頁面、停留時長和來源渠道進行差異化觸發。' },
      { title: '控制觸達頻次', description: '頻次過高只會打擾用戶，反而傷害體驗和轉化。' }
    ] : [
      { title: '基于行为触发', description: '根据页面、停留时长和来源渠道进行差异化触发。' },
      { title: '控制触达频次', description: '频次过高只会打扰用户，反而伤害体验和转化。' }
    ]}]
  ),
  'copilot': article(
    'copilot',
    isEn ? 'Copilot Collaboration' : isTW ? 'Copilot 協作' : 'Copilot 协作',
    [isEn ? 'Copilot reduces repetitive work for agents, freeing them to focus on decisions that actually require judgment.' : isTW ? 'Copilot 的意義，是幫客服降低重複勞動，把精力放到真正需要判斷的問題上。' : 'Copilot 的意义，是帮客服降低重复劳动，把精力放到真正需要判断的问题上。'],
    [{ title: isEn ? 'Key capabilities' : isTW ? '主要能力' : '主要能力', items: isEn ? [
      { title: 'Reply suggestions', description: 'Generates suggested replies from context and the knowledge base to shorten response time.' },
      { title: 'Multilingual assistance', description: 'Helps agents understand and communicate more efficiently in cross-language service scenarios.' }
    ] : isTW ? [
      { title: '推薦回覆', description: '結合上下文與知識庫生成建議回覆，縮短響應時間。' },
      { title: '多語言輔助', description: '幫助客服在跨語種服務場景中更高效理解和表達。' }
    ] : [
      { title: '推荐回复', description: '结合上下文与知识库生成建议回复，缩短响应时间。' },
      { title: '多语言辅助', description: '帮助客服在跨语种服务场景中更高效理解和表达。' }
    ]}]
  ),
  'roles-permission': article(
    'roles-permission',
    isEn ? 'Roles & Permissions' : isTW ? '角色與權限' : '角色与权限',
    [isEn ? 'The essence of permission design is ensuring each person only accesses the capabilities and data they actually need.' : isTW ? '權限設計的本質，是讓每個人只接觸自己必須接觸的能力和數據。' : '权限设计的本质，是让每个人只接触自己必须接触的能力和数据。'],
    [{ title: isEn ? 'Configuration recommendations' : isTW ? '配置建議' : '配置建议', items: isEn ? [
      { title: 'Layer permissions by role', description: 'Configure different capabilities for admins, supervisors, and agents — don\'t pile all permissions on everyone.' },
      { title: 'Preserve operational boundaries', description: 'High-risk capabilities like deleting data, modifying rules, and viewing reports should be separately controlled.' }
    ] : isTW ? [
      { title: '按崗位分層授權', description: '管理員、主管、客服分別配置不同能力，別把所有權限堆給所有人。' },
      { title: '保留操作邊界', description: '刪除數據、修改規則和查看報表等高風險能力要單獨控制。' }
    ] : [
      { title: '按岗位分层授权', description: '管理员、主管、客服分别配置不同能力，别把所有权限堆给所有人。' },
      { title: '保留操作边界', description: '删除数据、修改规则和查看报表等高风险能力要单独控制。' }
    ]}]
  )
};
});

const defaultArticleId = 'chat-intro';
const activeArticleId = ref(defaultArticleId);
const openGroupIds = ref<string[]>(['faq', 'quick-start']);

const currentArticle = computed(() => helpArticles.value[activeArticleId.value] ?? helpArticles.value[defaultArticleId]);

const isGroupOpen = (groupId: string) => openGroupIds.value.includes(groupId);

const toggleGroup = (groupId: string) => {
  if (isGroupOpen(groupId)) {
    openGroupIds.value = openGroupIds.value.filter((id) => id !== groupId);
    return;
  }

  openGroupIds.value = [...openGroupIds.value, groupId];
};

const setActiveArticle = (groupId: string, articleId: string) => {
  activeArticleId.value = articleId;

  if (!isGroupOpen(groupId)) {
    openGroupIds.value = [...openGroupIds.value, groupId];
  }
};
</script>

<style scoped>
.help-center-page {
  min-height: 100vh;
  background: #fff;
}

.help-center-shell {
  background: #fff;
}

.help-center-hero {
  background: #f3f6fc;
  padding: 82px 24px 92px;
  text-align: center;
}

.help-center-hero__inner {
  max-width: 1200px;
  margin: 0 auto;
}

.help-center-hero h1 {
  margin: 0;
  font-size: clamp(38px, 5.1vw, 72px);
  line-height: 1.18;
  font-weight: 600;
  color: var(--links-color-text-primary);
}

.help-center-hero p {
  margin: 28px 0 0;
  font-size: 16px;
  color: #70788c;
}

.help-center-body {
  padding: 42px 0 88px;
}

.help-center-body__container {
  display: grid;
  grid-template-columns: 320px minmax(0, 1fr);
  gap: 44px;
  align-items: start;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 24px;
}

.help-center-sidebar__inner {
  padding: 22px 18px;
  border-radius: 16px;
  background: #f7f8fb;
}

.help-group + .help-group {
  margin-top: 4px;
}

.help-group__trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 12px 12px;
  border: none;
  background: transparent;
  font: inherit;
  font-size: 16px;
  font-weight: 600;
  color: var(--links-color-text-primary);
  text-align: left;
  cursor: pointer;
}

.help-group__trigger--open {
  color: var(--links-color-primary);
}

.help-group__arrow {
  flex-shrink: 0;
  color: #8b93a6;
  transition: transform var(--links-motion-fast);
}

.help-group__trigger--open .help-group__arrow {
  transform: rotate(180deg);
}

.help-group__items {
  margin: 4px 0 10px 22px;
  padding: 6px 0 2px 24px;
}

.help-group__item {
  display: block;
  width: 100%;
  padding: 12px 0;
  border: none;
  background: transparent;
  font: inherit;
  font-size: 15px;
  color: #3f4758;
  text-align: left;
  cursor: pointer;
}

.help-group__item--active {
  color: var(--links-color-primary);
}

.help-center-article {
  min-width: 0;
  color: #2e3445;
}

.help-center-article h2 {
  margin: 0 0 38px;
  font-size: 36px;
  line-height: 1.18;
  font-weight: 600;
  color: var(--links-color-text-primary);
}

.help-center-article__intro {
  margin-bottom: 32px;
}

.help-center-article__intro h3,
.help-center-article__section h4 {
  margin: 0 0 16px;
  font-size: 18px;
  line-height: 1.5;
  font-weight: 600;
  color: var(--links-color-text-primary);
}

.help-center-article__section {
  margin-top: 34px;
}

.help-center-article__paragraph {
  margin: 0 0 16px;
  font-size: 16px;
  line-height: 1.95;
  color: #3f4758;
}

.help-center-article__list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.help-center-article__list-item {
  display: grid;
  grid-template-columns: 12px minmax(0, 1fr);
  gap: 12px;
  align-items: start;
  margin-bottom: 20px;
}

.help-center-article__dot {
  width: 12px;
  height: 12px;
  margin-top: 9px;
  border-radius: 50%;
  background: var(--links-color-text-primary);
}

.help-center-article__list-title {
  margin-bottom: 8px;
  font-size: 16px;
  line-height: 1.8;
  font-weight: 500;
  color: var(--links-color-text-primary);
}

@media (max-width: 960px) {
  .help-center-body__container {
    grid-template-columns: 1fr;
    gap: 32px;
  }
}

@media (max-width: 768px) {
  .help-center-hero {
    padding: 62px 16px 72px;
  }

  .help-center-body {
    padding: 28px 0 72px;
  }

  .help-center-body__container {
    padding: 0 16px;
  }

  .help-center-article h2 {
    margin-bottom: 26px;
  }

  .help-center-article__paragraph,
  .help-center-article__list-title {
    font-size: 15px;
  }
}
</style>
