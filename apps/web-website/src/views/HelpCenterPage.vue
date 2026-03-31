<template>
  <div class="help-center-page">
    <MarketingHeader />

    <div class="help-center-shell">
      <ProductSubNav active-key="help-center" :show-cta="false" />

      <section class="help-center-hero">
        <div class="help-center-hero__inner">
          <h1>👋 欢迎来到 Chat 帮助中心</h1>
          <p>在这里可以找到你想要的答案～</p>
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

const helpCenterGroups: HelpGroup[] = [
  {
    id: 'faq',
    title: '常见问题',
    items: [
      { id: 'faq-what-is-twt-chat', label: 'TWT Chat 是什么？' },
      { id: 'faq-pricing', label: '你们是怎么收费的？' },
      { id: 'faq-version-diff', label: '专业版和免费的区别是什么？' },
      { id: 'faq-trial-expire', label: '14 天体验期到期后会怎样？' },
      { id: 'faq-project-management', label: '如何创建和管理项目？' },
      { id: 'faq-clients', label: '支持哪些客户端？' },
      { id: 'faq-ai-model', label: 'AI 是用的什么大模型？' },
      { id: 'faq-chat-group', label: '如何创建单聊和群聊？' },
      { id: 'faq-knowledge-base', label: '知识库如何使用？' },
      { id: 'faq-session-management', label: '会话如何自动分配和转移？' },
      { id: 'faq-team-management', label: '如何管理客服团队？' },
      { id: 'faq-visitor-setup', label: '怎么和访客进行互通？' }
    ]
  },
  {
    id: 'quick-start',
    title: '快速开始',
    items: [
      { id: 'chat-intro', label: 'Chat 介绍' },
      { id: 'create-project', label: '创建项目' },
      { id: 'project-management', label: '项目管理' },
      { id: 'login-chat', label: '登录 Chat' },
      { id: 'getting-started', label: '开始使用' }
    ]
  },
  {
    id: 'conversation',
    title: '会话',
    items: [{ id: 'session-overview', label: '会话总览' }]
  },
  {
    id: 'chat',
    title: '聊天',
    items: [{ id: 'quick-reply', label: '快捷回复' }]
  },
  {
    id: 'visitor',
    title: '访客与客户',
    items: [{ id: 'customer-profile', label: '客户资料管理' }]
  },
  {
    id: 'install',
    title: '安装',
    items: [{ id: 'web-install', label: '网站接入' }]
  },
  {
    id: 'report',
    title: '报表',
    items: [{ id: 'dashboard', label: '运营看板' }]
  },
  {
    id: 'marketing',
    title: '营销',
    items: [{ id: 'proactive-campaign', label: '主动营销' }]
  },
  {
    id: 'ai-agent',
    title: 'AI Agent',
    items: [{ id: 'copilot', label: 'Copilot 协作' }]
  },
  {
    id: 'settings',
    title: '设置',
    items: [{ id: 'roles-permission', label: '角色与权限' }]
  }
];

const helpArticles: Record<string, HelpArticle> = {
  'faq-what-is-twt-chat': article(
    'faq-what-is-twt-chat',
    'TWT Chat 是什么？',
    ['TWT Chat 是一个集 AI客服、在线工单、聊天、音视频通话与远程协助于一体的全渠道客户服务解决方案，简单易用，让小团队也能轻松服务客户。'],
    []
  ),
  'faq-pricing': article(
    'faq-pricing',
    '你们是怎么收费的？',
    [
      '我们的专业版是按照席位收费的，推荐您直接按年订阅，目前订阅费用$11.88/席位/年，价格非常划算。',
      '您订阅专业版后我们会建专属服务群，由客服、运营、产品、技术给您提供专属服务。',
      '（席位概念：需要在客服工作台接待访客的工作人员，订阅后可通过邮箱邀请加入）'
    ],
    []
  ),
  'faq-version-diff': article(
    'faq-version-diff',
    '专业版和免费的区别是什么？',
    [
      '1、核心差异在于自定义功能和 AI 拓展能力：比如隐藏平台标识、推荐回复、AI 机器人、双向实时翻译等等',
      '2、您新建项目后会自动赠送 14 天的专业版体验权益，到期前您可以选择续费，到期后也可手动降级为免费版',
      '3、目前平台在拓展期，价格非常优惠，年付仅$11.88/席位',
      '详细功能对比可见定价页面：https://www.twt.com/chat/pricing'
    ],
    []
  ),
  'faq-trial-expire': article(
    'faq-trial-expire',
    '14 天体验期到期后会怎样？',
    [
      '您好，项目到期后您依旧可以正常使用，但需要您在控制台手动降级项目的订阅版本为免费版，免费版可永久享受 1 个席位的基础功能，您可根据实际业务进行选择。',
      '免费版和专业版差异：https://www.twt.com/chat/pricing'
    ],
    []
  ),
  'faq-project-management': article(
    'faq-project-management',
    '如何创建和管理项目？',
    [
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
    '支持哪些客户端？',
    [
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
    'AI 是用的什么大模型？',
    ['目前采用的是OpenAI+QWen大模型组合，我们会根据市面上最新的大模型进行动态调整。'],
    []
  ),
  'faq-chat-group': article(
    'faq-chat-group',
    '如何创建单聊和群聊？',
    [
      '我们平台支持创建1v1 的单聊和建群沟通，但仅支持客服发起。',
      '',
      '操作入口：',
      '• 电脑端：会话-在线聊天旁边【+】-选择要发起单聊的访客或建群的访客及客服',
      '• 手机端：会话-右上角【+】-选择要发起单聊的访客或建群的访客及客服',
      '',
      '群聊人数限制：目前最大限制 100 人，可以满足绝大多数业务场景。'
    ],
    []
  ),
  'faq-knowledge-base': article(
    'faq-knowledge-base',
    '知识库如何使用？',
    [
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
    '会话如何自动分配和转移？',
    [
      '会话自动分配：',
      '• 会话采用动态轮询分配，会自动分配给当前在线的客服',
      '• 如果会话长时间无法分配，请检查：',
      '  1. 客服是否设置为在线状态（在左下角头像处检查）',
      '  2. 当前接待的未结束会话数是否达到上限（可手动结束会话，或调大客服接待上限）',
      '',
      '客服下线转移：',
      '• 支持配置客服超时不回消息，自动把会话分配给其他在线客服',
      '• 开启方式：设置-团队-客服设置-会话超时',
      '',
      '翻译功能：',
      '• 支持双向实时翻译，访客发的消息自动翻译成客服语言，客服打字自动翻译成目标语言',
      '• 开启方式：访客对话框底部，AI 翻译功能，开启即可'
    ],
    []
  ),
  'faq-team-management': article(
    'faq-team-management',
    '如何管理客服团队？',
    [
      '坐席管理：',
      '• 坐席是指需要在客服工作台接待访客的工作人员',
      '• 免费版支持 1 个免费坐席永久使用',
      '• 如需新增坐席需要升级专业版（$11.88/坐席/年）',
      '',
      '修改客服信息：',
      '• 管理员可以修改团队客服的头像、姓名、昵称等信息',
      '• 操作位置：工作台-设置-团队-成员，列表右侧操作按钮，点击【账号详情】',
      '',
      '通知设置：',
      '• 在客服工作台，左侧边栏-头像-通知设置，可开启或关闭访客进入提醒等各类通知',
      '• 如果依旧没有通知，需检查浏览器的权限，点击地址栏旁边的设置按钮，确认通知权限开启'
    ],
    []
  ),
  'faq-visitor-setup': article(
    'faq-visitor-setup',
    '怎么和访客进行互通？',
    [
      '第一步：完成项目创建，并进入客服工作台',
      '',
      '第二步：选择接入方式',
      '1. 直接分享聊天地址：在客服工作台首页顶部【聊天页面】按钮点击即可跳转到访客端，分享该地址即可',
      '2. 安装网站小部件：在设置-安装-网站代码，复制代码并集成到网站即可',
      '3. 使用自己的域名：可下载 Html 并部署，具体教程可见帮助中心',
      '',
      '第三步：访客拿到地址或打开小部件即可向您发起会话或聊天',
      '',
      '访客端设置：',
      '• 会话标题展示：可在设置-安装-自定义-常规模块，调整会话标题展示方式',
      '• 限制访客发起会话数：设置-自定义-常规-会话功能，限制访客发起会话数上限',
      '',
      '链接被墙解决方案：',
      '• 如果您有自己的网站，采用小组件接入方式，访问您的站点，小组件打开无影响',
      '• 如果没有网站，建议自行购买域名，并下载平台提供的 Html，通过技术手段用您自己的域名访问聊天链接',
      '• 具体操作流程：https://www.twt.com/zh-CN/chat/help/html-xia-zai'
    ],
    []
  ),
  'chat-intro': article(
    'chat-intro',
    'Chat 介绍',
    [
      'TWT Chat 是 TWT 旗下的全渠道客服与实时聊天平台，帮助网站、App 与社媒在一个后台统一接待全球访客，集消息聚合、知识库、自动化分配和数据看板于一体。',
      '如果你是第一次接触 Chat，建议先看完 Chat 介绍、创建项目和开始使用这几个章节，先把一条真实会话完整跑通。'
    ],
    [
      {
        title: '核心能力',
        items: [
          { title: '统一消息接待', description: '网页、App、社媒和直聊链接的消息都可以在同一个工作台接收和处理。' },
          { title: '客服协作', description: '支持会话分配、转接、待处理和快捷回复，避免团队在多个工具之间来回切换。' },
          { title: '知识与数据沉淀', description: '常见问题、客户资料和运营数据可以持续积累，后续优化更有抓手。' }
        ]
      },
      {
        title: '推荐上手顺序',
        items: [
          { title: '先接入消息来源', description: '优先完成网站嵌码或直聊链接部署，确保消息能稳定进入系统。' },
          { title: '再配置协作规则', description: '先补齐客服组、分配规则、标签和快捷回复，让团队流程先统一。' },
          { title: '最后看报表和优化', description: '等业务跑起来后，再看首响、处理时长和满意度这些指标。' }
        ]
      }
    ],
    'Chat 介绍'
  ),
  'create-project': article(
    'create-project',
    '创建项目',
    [
      '项目是 Chat 的业务容器。通常一个品牌、一个站点或者一条独立业务线，都建议使用单独项目管理。'
    ],
    [
      {
        title: '创建前准备',
        items: [
          { title: '确定项目边界', description: '先明确这个项目服务哪个网站、品牌或业务场景，避免不同团队混用同一套规则。' },
          { title: '准备基础信息', description: '项目名称、默认语言、时区和客服组会直接影响后续接入与协作。' }
        ]
      },
      {
        title: '创建流程',
        items: [
          { title: '填写基础配置', description: '先完成名称、语言、时区和品牌信息，再进入渠道接入。' },
          { title: '接入真实渠道', description: '至少跑通一个真实消息来源，避免创建完成后仍然是空项目。' }
        ]
      }
    ]
  ),
  'project-management': article(
    'project-management',
    '项目管理',
    [
      '项目管理的重点不是堆配置，而是把业务边界、成员职责和消息流转先理顺。'
    ],
    [
      {
        title: '推荐管理方式',
        items: [
          { title: '按业务拆分项目', description: '不同品牌、不同语种或不同服务策略的业务，建议独立管理。' },
          { title: '统一命名规范', description: '项目、客服组、标签和快捷回复最好提前约定命名方式，后续检索会轻松很多。' }
        ]
      }
    ]
  ),
  'login-chat': article(
    'login-chat',
    '登录 Chat',
    [
      '登录前请先确认你的账号已经加入对应项目，并且拥有正确的角色权限。'
    ],
    [
      {
        title: '登录方式',
        items: [
          { title: '邮箱或账号密码登录', description: '使用管理员邀请的邮箱或企业账号进入工作台。' },
          { title: '多端同步使用', description: 'Web、客户端和移动端可按团队习惯选择，消息与会话状态保持同步。' }
        ]
      }
    ]
  ),
  'getting-started': article(
    'getting-started',
    '开始使用',
    [
      '真正的上手，不是把按钮点一遍，而是让一条真实消息从进入系统到被解决，完整跑通一次。'
    ],
    [
      {
        title: '建议优先完成',
        items: [
          { title: '跑通一条完整会话', description: '确认访客发起消息、客服接收、回复、转接和关闭会话都正常。' },
          { title: '准备基础素材', description: '欢迎语、快捷回复、常见问题和标签先补齐，团队使用起来会更顺。' }
        ]
      }
    ]
  ),
  'session-overview': article(
    'session-overview',
    '会话总览',
    [
      '会话页是客服的主工作区，重点是帮助坐席快速判断优先级并完成处理动作。'
    ],
    [
      {
        title: '核心视图',
        items: [
          { title: '状态与筛选', description: '按待接入、处理中、待处理、已关闭等状态快速筛选会话。' },
          { title: '访客上下文', description: '结合来源、页面、历史记录和备注，减少重复提问。' }
        ]
      }
    ]
  ),
  'quick-reply': article(
    'quick-reply',
    '快捷回复',
    [
      '快捷回复用于统一高频场景表达，减少重复输入，同时保证服务口径一致。'
    ],
    [
      {
        title: '推荐沉淀内容',
        items: [
          { title: '标准问候语', description: '覆盖开场、排队说明、结束语等高频场景。' },
          { title: '常见问题答案', description: '支付、物流、售后等高频问题建议整理成模板。' }
        ]
      }
    ]
  ),
  'customer-profile': article(
    'customer-profile',
    '客户资料管理',
    [
      '客户资料页的目标，是帮助客服在极短时间内判断客户是谁、来自哪里、历史发生过什么。'
    ],
    [
      {
        title: '建议维护的信息',
        items: [
          { title: '基础身份信息', description: '姓名、邮箱、电话、地区等字段用于建立客户识别能力。' },
          { title: '标签与备注', description: '用标签表达阶段与类型，用备注补充个性化背景。' }
        ]
      }
    ]
  ),
  'web-install': article(
    'web-install',
    '网站接入',
    [
      '网站接入的核心目标，是让消息入口展示在正确的位置，并确保访客消息稳定进入工作台。'
    ],
    [
      {
        title: '接入检查项',
        items: [
          { title: '确认嵌码位置', description: '建议放在站点公共布局中，避免部分页面漏挂。' },
          { title: '验证真实环境', description: '上线前至少在桌面端和移动端各走一遍完整会话。' }
        ]
      }
    ]
  ),
  'dashboard': article(
    'dashboard',
    '运营看板',
    [
      '看板的价值，不是摆数据，而是帮团队看清忙不忙、慢不慢、值不值。'
    ],
    [
      {
        title: '重点关注指标',
        items: [
          { title: '会话量与首响', description: '先看量，再看速度，这是最直接的负载反馈。' },
          { title: '处理时长与满意度', description: '效率和质量要一起看，别只盯一个平均值。' }
        ]
      }
    ]
  ),
  'proactive-campaign': article(
    'proactive-campaign',
    '主动营销',
    [
      '主动营销不是乱弹窗，而是在合适时机，把合适的信息推给最可能转化的人。'
    ],
    [
      {
        title: '推荐做法',
        items: [
          { title: '基于行为触发', description: '根据页面、停留时长和来源渠道进行差异化触发。' },
          { title: '控制触达频次', description: '频次过高只会打扰用户，反而伤害体验和转化。' }
        ]
      }
    ]
  ),
  'copilot': article(
    'copilot',
    'Copilot 协作',
    [
      'Copilot 的意义，是帮客服降低重复劳动，把精力放到真正需要判断的问题上。'
    ],
    [
      {
        title: '主要能力',
        items: [
          { title: '推荐回复', description: '结合上下文与知识库生成建议回复，缩短响应时间。' },
          { title: '多语言辅助', description: '帮助客服在跨语种服务场景中更高效理解和表达。' }
        ]
      }
    ]
  ),
  'roles-permission': article(
    'roles-permission',
    '角色与权限',
    [
      '权限设计的本质，是让每个人只接触自己必须接触的能力和数据。'
    ],
    [
      {
        title: '配置建议',
        items: [
          { title: '按岗位分层授权', description: '管理员、主管、客服分别配置不同能力，别把所有权限堆给所有人。' },
          { title: '保留操作边界', description: '删除数据、修改规则和查看报表等高风险能力要单独控制。' }
        ]
      }
    ]
  )
};

const defaultArticleId = 'chat-intro';
const activeArticleId = ref(defaultArticleId);
const openGroupIds = ref<string[]>(['faq', 'quick-start']);

const currentArticle = computed(() => helpArticles[activeArticleId.value] ?? helpArticles[defaultArticleId]);

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
