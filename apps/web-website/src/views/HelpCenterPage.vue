<template>
  <div class="help-center-page">
    <MarketingHeader />

    <div class="help-center-shell">
      <ProductSubNav />

      <section class="help-center-hero">
        <div class="help-center-hero__inner">
          <span class="help-center-hero__eyebrow">Help center</span>
          <h1>👋 欢迎来到 Chat 帮助中心</h1>
          <p>在这里可以快速找到 Chat 的核心能力说明、接入步骤和日常使用方法。</p>
        </div>
      </section>

      <section class="help-center-body">
        <div class="help-center-body__container">
          <aside class="help-center-sidebar">
            <div class="help-center-sidebar__inner">
              <div class="help-center-sidebar__header">
                <span class="help-center-sidebar__eyebrow">文档导航</span>
                <h2>使用帮助</h2>
              </div>

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
            <div class="help-center-article__header">
              <div>
                <span class="help-center-article__eyebrow">{{ currentArticle.category }}</span>
                <h2>{{ currentArticle.title }}</h2>
              </div>
              <span class="help-center-article__updated">更新于 {{ currentArticle.updatedAt }}</span>
            </div>

            <p class="help-center-article__lead">{{ currentArticle.lead }}</p>

            <section
              v-for="section in currentArticle.sections"
              :key="section.title"
              class="help-center-article__section"
            >
              <h3>{{ section.title }}</h3>

              <p v-for="paragraph in section.paragraphs" :key="paragraph" class="help-center-article__paragraph">
                {{ paragraph }}
              </p>

              <div v-if="section.items?.length" class="help-center-article__grid">
                <article v-for="item in section.items" :key="item.title" class="help-center-article__card">
                  <span class="help-center-article__dot" aria-hidden="true"></span>
                  <div>
                    <h4>{{ item.title }}</h4>
                    <p>{{ item.description }}</p>
                  </div>
                </article>
              </div>
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

type HelpArticleSectionItem = {
  title: string;
  description: string;
};

type HelpArticleSection = {
  title: string;
  paragraphs?: string[];
  items?: HelpArticleSectionItem[];
};

type HelpArticle = {
  id: string;
  category: string;
  title: string;
  lead: string;
  updatedAt: string;
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

const latestUpdatedAt = '2026-03-30';

const buildSection = (
  title: string,
  items: HelpArticleSectionItem[],
  paragraphs: string[] = []
): HelpArticleSection => ({
  title,
  paragraphs,
  items
});

const helpCenterGroups: HelpGroup[] = [
  {
    id: 'quick-start',
    title: '快速开始',
    items: [
      { id: 'chat-intro', label: 'Chat 介绍' },
      { id: 'create-project', label: '创建项目' },
      { id: 'project-management', label: '项目管理' },
      { id: 'getting-started', label: '开始使用' }
    ]
  },
  {
    id: 'conversation',
    title: '会话',
    items: [
      { id: 'session-overview', label: '会话总览' },
      { id: 'session-routing', label: '分配与流转' }
    ]
  },
  {
    id: 'chat',
    title: '聊天',
    items: [
      { id: 'quick-reply', label: '快捷回复' },
      { id: 'group-mention', label: '@ 提及协作' }
    ]
  },
  {
    id: 'visitor',
    title: '访客与客户',
    items: [
      { id: 'customer-profile', label: '客户资料管理' },
      { id: 'customer-api', label: '客户接入 API' }
    ]
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
    items: [
      { id: 'proactive-campaign', label: '主动营销' },
      { id: 'template-library', label: '模板管理' }
    ]
  },
  {
    id: 'ai-agent',
    title: 'AI Agent',
    items: [
      { id: 'copilot', label: 'Copilot 协作' },
      { id: 'knowledge-base', label: '知识库接入' }
    ]
  },
  {
    id: 'settings',
    title: '设置',
    items: [
      { id: 'roles-permission', label: '角色与权限' },
      { id: 'website-settings', label: '站点与小部件' }
    ]
  }
];

const helpArticles: Record<string, HelpArticle> = {
  'chat-intro': {
    id: 'chat-intro',
    category: '快速开始',
    title: 'Chat 介绍',
    lead: 'TWT Chat 是面向全球化团队的全渠道客服与实时协同平台，帮助网站、App 与社媒消息统一接入、统一协作、统一沉淀。',
    updatedAt: latestUpdatedAt,
    sections: [
      buildSection(
        '核心能力概览',
        [
          {
            title: '全渠道消息聚合',
            description: '统一接入网页、App、社媒和官网表单消息，客服无需再在多个后台来回切换。'
          },
          {
            title: '客服与 AI 协作',
            description: '通过 Copilot、知识库与自动化规则辅助首响、分配和回复，提高服务一致性。'
          },
          {
            title: '多端同步处理',
            description: '支持 Web、客户端和移动端同时协作，团队随时接手，服务不中断。'
          }
        ],
        ['如果你刚开始接触 Chat，先理解消息流、分配流和知识流这三件事，后面所有配置都会顺很多。']
      ),
      buildSection('推荐落地顺序', [
        {
          title: '先跑通消息接入',
          description: '优先完成网站嵌码或 API 接入，确认消息能够稳定进入工作台。'
        },
        {
          title: '再配置协作规则',
          description: '补齐客服组、分配规则、标签和快捷回复，让团队流程先标准化。'
        },
        {
          title: '最后引入 AI',
          description: '在知识库与常见问题沉淀之后再启用 Copilot，命中率和可靠性会高很多。'
        }
      ])
    ]
  },
  'create-project': {
    id: 'create-project',
    category: '快速开始',
    title: '创建项目',
    lead: '项目是 Chat 的业务容器，一个品牌、一条业务线或一个独立站点，通常都建议单独建立项目管理。',
    updatedAt: latestUpdatedAt,
    sections: [
      buildSection('创建前先想清楚', [
        {
          title: '服务对象是谁',
          description: '先明确这个项目面向哪个站点、品牌或市场，避免不同业务混到同一个工作台。'
        },
        {
          title: '谁会参与协作',
          description: '提前梳理客服、运营、管理员角色，后面配权限时会更省事。'
        },
        {
          title: '会接入哪些渠道',
          description: '网站、小部件、表单、API 或社媒渠道可以按业务优先级逐步接入。'
        }
      ]),
      buildSection('标准创建流程', [
        {
          title: '填写基础信息',
          description: '先完成项目名称、默认语言、时区和展示品牌配置，保证对外信息统一。'
        },
        {
          title: '补齐接入渠道',
          description: '至少完成一个真实渠道接入，确保创建后不是空壳项目。'
        },
        {
          title: '邀请成员并分组',
          description: '按客服组、业务组拆分成员，后面做分配规则时更容易扩展。'
        }
      ])
    ]
  },
  'project-management': {
    id: 'project-management',
    category: '快速开始',
    title: '项目管理',
    lead: '当你有多个品牌、多语言站点或多个业务团队时，项目管理的关键不是堆配置，而是把边界划清楚。',
    updatedAt: latestUpdatedAt,
    sections: [
      buildSection('建议的组织方式', [
        {
          title: '按品牌或业务线拆分',
          description: '不同服务策略、不同客服团队的业务，优先用独立项目管理，避免规则互相污染。'
        },
        {
          title: '渠道统一归档',
          description: '同一品牌下的网站、App 与 API 接入尽量放在同一项目，客户视图更完整。'
        },
        {
          title: '成员按职责分组',
          description: '客服、运营、管理员分层管理，既方便授权，也方便后期审计。'
        }
      ]),
      buildSection('管理时要盯住的点', [
        {
          title: '命名统一',
          description: '项目、客服组、标签和快捷回复都建议统一命名规范，不然后期一定会乱。'
        },
        {
          title: '权限最小化',
          description: '不要一开始就给所有人管理员权限，越省事的配置，后面越容易埋雷。'
        },
        {
          title: '定期清理',
          description: '每月清理不用的规则、成员和渠道，保持项目结构轻量。'
        }
      ])
    ]
  },
  'getting-started': {
    id: 'getting-started',
    category: '快速开始',
    title: '开始使用',
    lead: '真正的上手不是把页面点一遍，而是让一条完整的客户消息，从进入系统到被解决，真的跑通一次。',
    updatedAt: latestUpdatedAt,
    sections: [
      buildSection('第一周建议完成这些事', [
        {
          title: '完成真实环境测试',
          description: '用站点、测试账号和真实客服账号各走一遍，确认通知、分配和回复链路没断。'
        },
        {
          title: '准备基础素材',
          description: '把欢迎语、快捷回复、常见问题、标签和客服组一次性补齐。'
        },
        {
          title: '约定处理规范',
          description: '至少先统一首响时限、待处理标准和转接规则，不然团队会各干各的。'
        }
      ]),
      buildSection('怎么判断已经上手成功', [
        {
          title: '消息不丢',
          description: '任意来源的测试消息都能进入工作台，并且能追踪到处理人和处理状态。'
        },
        {
          title: '人能协作',
          description: '客服之间能顺畅转接、提及和补充备注，而不是靠私聊喊人。'
        },
        {
          title: '问题能复用',
          description: '常见问题开始沉淀成知识库和快捷回复，重复劳动明显下降。'
        }
      ])
    ]
  },
  'session-overview': {
    id: 'session-overview',
    category: '会话',
    title: '会话总览',
    lead: '会话页是客服的主战场，重点不是把列表做满，而是让人能在最短时间内判断优先级。',
    updatedAt: latestUpdatedAt,
    sections: [
      buildSection('你会看到什么', [
        {
          title: '状态分层',
          description: '待接入、处理中、待处理、已关闭等状态帮助客服快速识别当前动作。'
        },
        {
          title: '筛选与搜索',
          description: '可按渠道、标签、客服、满意度和时间范围定位会话，减少翻找成本。'
        },
        {
          title: '访客上下文',
          description: '同屏查看客户资料、访问路径、历史会话和备注，避免重复发问。'
        }
      ]),
      buildSection('高效处理的原则', [
        {
          title: '先看优先级',
          description: '排队时长长、情绪风险高和高价值客户的会话，永远优先处理。'
        },
        {
          title: '不要把列表当仓库',
          description: '能关闭就关闭，能标记待处理就标记，列表越干净，团队越高效。'
        }
      ])
    ]
  },
  'session-routing': {
    id: 'session-routing',
    category: '会话',
    title: '分配与流转',
    lead: '会话分配不是一个开关，而是一套责任机制。谁先接、谁可转、什么时候回队列，这些都要定义清楚。',
    updatedAt: latestUpdatedAt,
    sections: [
      buildSection('常见流转方式', [
        {
          title: '自动分配',
          description: '按在线状态、轮询规则或客服组自动派单，适合稳定的大批量接待场景。'
        },
        {
          title: '手动转接',
          description: '当问题涉及售后、技术或特定语言能力时，由当前客服主动转给目标同事。'
        },
        {
          title: '标记待处理',
          description: '需要等待用户补充信息或内部确认时，先保留上下文，再回来继续处理。'
        }
      ]),
      buildSection('建议的配置原则', [
        {
          title: '规则越少越稳',
          description: '先用最简单的轮询或客服组分发，别一上来就堆十几条复杂条件。'
        },
        {
          title: '转接要有记录',
          description: '每次转接都应该能追踪原因和处理人，不然问题一多就开始甩锅。'
        }
      ])
    ]
  },
  'quick-reply': {
    id: 'quick-reply',
    category: '聊天',
    title: '快捷回复',
    lead: '快捷回复不是为了偷懒，是为了把高频问题的表达统一起来，让服务质量别全靠个人发挥。',
    updatedAt: latestUpdatedAt,
    sections: [
      buildSection('适合沉淀哪些内容', [
        {
          title: '标准问候语',
          description: '覆盖开场、排队说明、结束语等高频场景，确保品牌语气一致。'
        },
        {
          title: '常见问题答案',
          description: '把支付、物流、售后、账号问题的标准回复固定下来，减少重复输入。'
        },
        {
          title: '多语言模板',
          description: '结合翻译能力整理常见语言版本，跨语种服务时更稳定。'
        }
      ]),
      buildSection('维护时的建议', [
        {
          title: '按主题分组',
          description: '不要把所有快捷回复堆在一个列表里，按售前、售后、系统通知分类最实用。'
        },
        {
          title: '定期淘汰旧模板',
          description: '业务一变就要跟着改，不然客服越用越乱，客户也能明显感觉到不一致。'
        }
      ])
    ]
  },
  'group-mention': {
    id: 'group-mention',
    category: '聊天',
    title: '@ 提及协作',
    lead: '@ 提及的意义不是热闹，而是让正确的人，在正确的时候，被准确叫到当前会话里。',
    updatedAt: latestUpdatedAt,
    sections: [
      buildSection('适合使用的场景', [
        {
          title: '跨部门协同',
          description: '需要售后、技术或运营补充信息时，在当前会话中直接提及对应成员即可。'
        },
        {
          title: '复杂问题会审',
          description: '多人共同判断风险、退款或技术异常时，提及可以保留沟通上下文。'
        }
      ]),
      buildSection('怎么用得不烦人', [
        {
          title: '先写清需求',
          description: '提及时把问题背景和期望动作说完整，别只丢一个名字过去。'
        },
        {
          title: '控制提及频率',
          description: '不是所有问题都要拉人，能靠知识库和备注解决的，先自己解决。'
        }
      ])
    ]
  },
  'customer-profile': {
    id: 'customer-profile',
    category: '访客与客户',
    title: '客户资料管理',
    lead: '资料页的价值不在于字段多，而在于让客服在 5 秒内判断这个人是谁、来过几次、值不值得优先跟进。',
    updatedAt: latestUpdatedAt,
    sections: [
      buildSection('建议重点维护的信息', [
        {
          title: '基础身份信息',
          description: '姓名、邮箱、电话、国家地区等基础字段，用来建立客户识别能力。'
        },
        {
          title: '业务标签与备注',
          description: '用标签标记客户阶段、来源和关注点，用备注补充个性化背景。'
        },
        {
          title: '历史轨迹',
          description: '会话记录、访问页面和最近动作可以帮助客服快速判断客户意图。'
        }
      ]),
      buildSection('维护资料时别踩坑', [
        {
          title: '字段别堆太多',
          description: '填不动的字段等于没有字段，只保留真正会影响服务动作的信息。'
        },
        {
          title: '标签要有统一规则',
          description: '同一类客户别出现好几个名字，不然筛选和报表都会失真。'
        }
      ])
    ]
  },
  'customer-api': {
    id: 'customer-api',
    category: '访客与客户',
    title: '客户接入 API',
    lead: '如果你已经在 CRM、订单系统或会员系统里有客户资料，就别让客服再手抄一遍，直接通过 API 同步进来。',
    updatedAt: latestUpdatedAt,
    sections: [
      buildSection('常见接入内容', [
        {
          title: '唯一客户标识',
          description: '先确保每个客户有稳定的唯一 ID，这是串联资料和历史会话的基础。'
        },
        {
          title: '扩展资料字段',
          description: '支持补充备注名、姓名、电话、邮箱等业务字段，客服接待前就能看到。'
        },
        {
          title: '业务状态同步',
          description: '订单状态、会员等级或风险信息也可以同步，方便客服快速做判断。'
        }
      ]),
      buildSection('接入建议', [
        {
          title: '先少量字段试跑',
          description: '别一开始就同步几十个字段，先验证核心识别链路稳定，再逐步扩展。'
        },
        {
          title: '处理好更新时机',
          description: '客户资料频繁变化时，要先想好是实时更新还是定时同步，别把旧数据当真数据。'
        }
      ])
    ]
  },
  'web-install': {
    id: 'web-install',
    category: '安装',
    title: '网站接入',
    lead: '网站接入的目标很简单，让访客在正确的页面、正确的时机看到入口，并且每一条消息都能稳定到达。',
    updatedAt: latestUpdatedAt,
    sections: [
      buildSection('上线前需要确认', [
        {
          title: '嵌码位置',
          description: '将代码放在全站公共布局中，避免部分页面漏挂导致消息入口消失。'
        },
        {
          title: '可信域名',
          description: '提前配置站点域名与环境，减少跨域、拦截或脚本加载异常。'
        },
        {
          title: '展示策略',
          description: '确定小部件在哪些页面展示、是否默认展开、是否跟随业务时段显示。'
        }
      ]),
      buildSection('上线后怎么验收', [
        {
          title: '多设备测试',
          description: '桌面端和移动端都要验证一次，别只在自己电脑上看着没问题就算完。'
        },
        {
          title: '消息闭环测试',
          description: '从访客发消息到客服收到通知、回复成功、客户看到回复，这一整链必须走通。'
        }
      ])
    ]
  },
  'dashboard': {
    id: 'dashboard',
    category: '报表',
    title: '运营看板',
    lead: '看板不是给人看热闹的，它应该帮你回答三个问题，忙不忙、慢不慢、值不值。',
    updatedAt: latestUpdatedAt,
    sections: [
      buildSection('建议重点关注的指标', [
        {
          title: '会话量与首响',
          description: '先看会话是否上涨，再看首响是否被拖慢，这能最快暴露团队负载问题。'
        },
        {
          title: '处理时长与满意度',
          description: '时长只看效率，满意度才看质量，两个指标要一起看才不容易误判。'
        },
        {
          title: '来源与转化',
          description: '识别高价值来源页面和高转化渠道，方便把资源投到最有效的地方。'
        }
      ]),
      buildSection('看板使用建议', [
        {
          title: '按周期复盘',
          description: '至少每周做一次团队复盘，把数据波动和具体动作对上。'
        },
        {
          title: '别只看平均值',
          description: '平均值最会骗人，高峰时段、重点渠道和异常客服要单独拆出来看。'
        }
      ])
    ]
  },
  'proactive-campaign': {
    id: 'proactive-campaign',
    category: '营销',
    title: '主动营销',
    lead: '主动营销不是乱弹窗，而是在最合适的时机，把最合适的信息，推给最可能转化的人。',
    updatedAt: latestUpdatedAt,
    sections: [
      buildSection('常见触发方式', [
        {
          title: '基于页面行为触发',
          description: '根据停留时长、访问页面或滚动深度触发消息，更贴近用户真实意图。'
        },
        {
          title: '基于来源渠道触发',
          description: '不同广告渠道、不同活动页可以配置不同话术，减少千人一面的打扰感。'
        },
        {
          title: '基于客户标签触发',
          description: '对老客户、新访客或高价值客户使用差异化策略，提升命中率。'
        }
      ]),
      buildSection('别把它做成骚扰', [
        {
          title: '控制频次',
          description: '同一访客短时间内不要反复弹，多一次曝光不一定多一次转化。'
        },
        {
          title: '明确目标',
          description: '每个活动最好只追一个目标，是留资、咨询还是转化，别什么都想要。'
        }
      ])
    ]
  },
  'template-library': {
    id: 'template-library',
    category: '营销',
    title: '模板管理',
    lead: '模板库不是素材堆放区，它应该是一套可复用、可维护、可快速调用的营销资产系统。',
    updatedAt: latestUpdatedAt,
    sections: [
      buildSection('适合收进模板库的内容', [
        {
          title: '欢迎类模板',
          description: '用于新访客首屏引导或首访问候，帮助快速建立对话。'
        },
        {
          title: '促销类模板',
          description: '适合活动页、限时折扣和大促提醒，但要注意频次和时机。'
        },
        {
          title: '服务引导模板',
          description: '用于主动邀请咨询、引导留资或推荐客服入口，提升会话转化。'
        }
      ]),
      buildSection('维护模板的方式', [
        {
          title: '按用途命名',
          description: '模板名称要一眼看出用途、渠道和阶段，不然团队根本找不到。'
        },
        {
          title: '上线前先预览',
          description: '文字、按钮、图片和跳转都要在预览里确认一次，别把低级错误发给用户。'
        }
      ])
    ]
  },
  'copilot': {
    id: 'copilot',
    category: 'AI Agent',
    title: 'Copilot 协作',
    lead: 'Copilot 的价值不是替人偷懒，而是把客服从重复劳动里解放出来，让人把精力放到真正需要判断的问题上。',
    updatedAt: latestUpdatedAt,
    sections: [
      buildSection('Copilot 能帮你做什么', [
        {
          title: '推荐回复',
          description: '结合上下文与知识库，给出可直接编辑的回复建议，缩短响应时间。'
        },
        {
          title: '多语言辅助',
          description: '在跨语言服务场景下辅助理解与组织表达，减少沟通损耗。'
        },
        {
          title: '整理信息',
          description: '帮助快速提炼用户问题、总结重点信息，降低接手成本。'
        }
      ]),
      buildSection('怎么用更靠谱', [
        {
          title: '先有人审',
          description: '重要场景先保持人工审核，别把 AI 当免责工具，那是给自己挖坑。'
        },
        {
          title: '知识库先打底',
          description: '没有稳定知识库时，推荐回复会漂，先把标准答案沉淀好再放量使用。'
        }
      ])
    ]
  },
  'knowledge-base': {
    id: 'knowledge-base',
    category: 'AI Agent',
    title: '知识库接入',
    lead: '知识库是 AI 输出质量的地基。地基松，楼再漂亮也会歪，这事别想偷懒。',
    updatedAt: latestUpdatedAt,
    sections: [
      buildSection('适合纳入知识库的内容', [
        {
          title: 'FAQ 与标准流程',
          description: '把重复问题和标准处理流程先结构化，这是命中率最高的一批内容。'
        },
        {
          title: '产品说明与政策',
          description: '定价、功能、售后、物流、退款规则等正式口径都应沉淀进去。'
        },
        {
          title: '内部协作规则',
          description: '哪些问题要升级、哪些问题能直接处理，也应该写清楚。'
        }
      ]),
      buildSection('维护知识库的建议', [
        {
          title: '宁可少，不要脏',
          description: '过期内容、互相冲突的内容，会比没有知识库更害人。'
        },
        {
          title: '和业务版本同步',
          description: '产品规则一变，知识库就该跟着变，不然客服和 AI 都会一起说错话。'
        }
      ])
    ]
  },
  'roles-permission': {
    id: 'roles-permission',
    category: '设置',
    title: '角色与权限',
    lead: '权限设计的本质，是让每个人都只接触自己必须接触的能力和数据，这才叫安全，也才叫可控。',
    updatedAt: latestUpdatedAt,
    sections: [
      buildSection('推荐的角色层级', [
        {
          title: '管理员',
          description: '负责项目配置、成员管理和规则维护，数量不宜过多。'
        },
        {
          title: '客服主管',
          description: '负责团队排班、质量管理和会话复盘，通常需要看报表和转接能力。'
        },
        {
          title: '普通客服',
          description: '聚焦接待、回复、转接和备注，不建议开放过多系统级设置。'
        }
      ]),
      buildSection('配置时的注意点', [
        {
          title: '先定义动作边界',
          description: '哪些人能删数据、哪些人能改规则、哪些人能看报表，提前划线。'
        },
        {
          title: '按岗位，不按人',
          description: '权限模板要围绕岗位来设计，不要围绕某个同事的特殊习惯来配。'
        }
      ])
    ]
  },
  'website-settings': {
    id: 'website-settings',
    category: '设置',
    title: '站点与小部件',
    lead: '小部件不是挂上去就完事，它既是客服入口，也是品牌触点，丑和乱都会直接影响转化。',
    updatedAt: latestUpdatedAt,
    sections: [
      buildSection('建议重点配置的内容', [
        {
          title: '展示位置与时机',
          description: '根据页面类型、停留时长和设备端决定入口位置，别挡内容，也别太难找。'
        },
        {
          title: '品牌视觉',
          description: '头像、颜色、欢迎语和按钮文案最好统一，否则看起来就像临时拼起来的。'
        },
        {
          title: '表单与预设问题',
          description: '在对话前补充必要字段，能明显减少客服后续反复追问。'
        }
      ]),
      buildSection('上线前检查', [
        {
          title: '移动端兼容',
          description: '手机端弹层、输入框和浮窗位置一定要测，很多体验问题都死在这里。'
        },
        {
          title: '品牌一致性',
          description: '确认文案、按钮和跳转都符合你当前站点的品牌语气，不要像拼接广告。'
        }
      ])
    ]
  }
};

const defaultArticleId = 'chat-intro';
const activeArticleId = ref(defaultArticleId);
const openGroupIds = ref<string[]>(['quick-start']);

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
  background: linear-gradient(180deg, #f2f5fb 0 360px, #ffffff 360px);
}

.help-center-hero {
  position: relative;
  overflow: hidden;
  padding: 72px 24px 92px;
  text-align: center;
}

.help-center-hero::before,
.help-center-hero::after {
  content: '';
  position: absolute;
  border-radius: 999px;
  pointer-events: none;
  filter: blur(2px);
}

.help-center-hero::before {
  top: -120px;
  left: 8%;
  width: 280px;
  height: 280px;
  background: radial-gradient(circle, rgba(22, 119, 255, 0.16) 0%, rgba(22, 119, 255, 0) 70%);
}

.help-center-hero::after {
  right: 10%;
  bottom: -150px;
  width: 320px;
  height: 320px;
  background: radial-gradient(circle, rgba(255, 181, 77, 0.18) 0%, rgba(255, 181, 77, 0) 72%);
}

.help-center-hero__inner {
  position: relative;
  z-index: 1;
  max-width: 860px;
  margin: 0 auto;
}

.help-center-hero__eyebrow {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 32px;
  padding: 0 14px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.82);
  border: 1px solid rgba(22, 119, 255, 0.12);
  color: var(--links-color-primary);
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.help-center-hero h1 {
  margin: 20px 0 18px;
  font-size: clamp(36px, 5vw, 56px);
  line-height: 1.12;
  color: var(--links-color-text-primary);
}

.help-center-hero p {
  margin: 0;
  font-size: 18px;
  line-height: 1.8;
  color: var(--links-color-text-secondary);
}

.help-center-body {
  padding: 0 0 88px;
}

.help-center-body__container {
  display: grid;
  grid-template-columns: 280px minmax(0, 1fr);
  gap: 32px;
  align-items: start;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.help-center-sidebar {
  position: sticky;
  top: calc(var(--links-product-nav-height) + 24px);
}

.help-center-sidebar__inner {
  max-height: calc(100vh - var(--links-product-nav-height) - 48px);
  overflow: auto;
  padding: 14px;
  border-radius: 26px;
  border: 1px solid rgba(232, 233, 240, 0.88);
  background: rgba(255, 255, 255, 0.92);
  box-shadow: 0 24px 54px rgba(15, 23, 42, 0.08);
  backdrop-filter: blur(16px);
}

.help-center-sidebar__header {
  padding: 10px 10px 16px;
}

.help-center-sidebar__eyebrow {
  display: inline-block;
  margin-bottom: 8px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--links-color-text-muted);
}

.help-center-sidebar__header h2 {
  margin: 0;
  font-size: 26px;
  color: var(--links-color-text-primary);
}

.help-group + .help-group {
  margin-top: 6px;
}

.help-group__trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  border: none;
  border-radius: 16px;
  background: transparent;
  padding: 12px 14px;
  font: inherit;
  font-size: 15px;
  font-weight: 700;
  color: var(--links-color-text-primary);
  cursor: pointer;
  transition:
    background-color var(--links-motion-fast),
    color var(--links-motion-fast);
}

.help-group__trigger:hover,
.help-group__trigger--open {
  background: #f5f8ff;
  color: var(--links-color-primary);
}

.help-group__arrow {
  flex-shrink: 0;
  transition: transform var(--links-motion-fast);
}

.help-group__trigger--open .help-group__arrow {
  transform: rotate(180deg);
}

.help-group__items {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin: 4px 0 10px 24px;
  padding: 6px 0 4px 16px;
  border-left: 1px solid var(--links-color-border);
}

.help-group__item {
  width: 100%;
  border: none;
  border-radius: 14px;
  background: transparent;
  padding: 10px 12px;
  font: inherit;
  font-size: 14px;
  text-align: left;
  color: var(--links-color-text-secondary);
  cursor: pointer;
  transition:
    background-color var(--links-motion-fast),
    color var(--links-motion-fast),
    transform var(--links-motion-fast);
}

.help-group__item:hover {
  background: #f7f9fc;
  color: var(--links-color-text-primary);
  transform: translateX(2px);
}

.help-group__item--active {
  background: var(--links-color-primary-light);
  color: var(--links-color-primary);
  box-shadow: inset 0 0 0 1px rgba(22, 119, 255, 0.12);
}

.help-center-article {
  padding: 38px 40px 42px;
  border-radius: 32px;
  border: 1px solid rgba(232, 233, 240, 0.92);
  background: #fff;
  box-shadow: 0 28px 60px rgba(15, 23, 42, 0.08);
}

.help-center-article__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
}

.help-center-article__eyebrow {
  display: inline-flex;
  align-items: center;
  min-height: 28px;
  padding: 0 12px;
  border-radius: 999px;
  background: #f4f7ff;
  color: var(--links-color-primary);
  font-size: 13px;
  font-weight: 700;
}

.help-center-article__header h2 {
  margin: 16px 0 0;
  font-size: clamp(30px, 4vw, 46px);
  line-height: 1.14;
  color: var(--links-color-text-primary);
}

.help-center-article__updated {
  display: inline-flex;
  align-items: center;
  min-height: 34px;
  padding: 0 14px;
  border-radius: 999px;
  background: #f7f9fc;
  color: var(--links-color-text-secondary);
  font-size: 13px;
  white-space: nowrap;
}

.help-center-article__lead {
  margin: 20px 0 0;
  font-size: 17px;
  line-height: 1.9;
  color: var(--links-color-text-secondary);
}

.help-center-article__section {
  padding-top: 34px;
  margin-top: 34px;
  border-top: 1px solid rgba(232, 233, 240, 0.88);
}

.help-center-article__section h3 {
  margin: 0 0 18px;
  font-size: 24px;
  line-height: 1.3;
  color: var(--links-color-text-primary);
}

.help-center-article__paragraph {
  margin: 0 0 16px;
  font-size: 15px;
  line-height: 1.9;
  color: var(--links-color-text-secondary);
}

.help-center-article__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.help-center-article__card {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  min-height: 100%;
  padding: 18px 18px 18px 16px;
  border-radius: 20px;
  border: 1px solid rgba(232, 233, 240, 0.92);
  background: linear-gradient(180deg, #ffffff 0%, #f9fbff 100%);
}

.help-center-article__dot {
  width: 10px;
  height: 10px;
  margin-top: 7px;
  border-radius: 50%;
  flex-shrink: 0;
  background: linear-gradient(135deg, #44d2ff 0%, #1677ff 100%);
  box-shadow: 0 0 0 6px rgba(22, 119, 255, 0.08);
}

.help-center-article__card h4 {
  margin: 0 0 8px;
  font-size: 16px;
  line-height: 1.5;
  color: var(--links-color-text-primary);
}

.help-center-article__card p {
  margin: 0;
  font-size: 14px;
  line-height: 1.8;
  color: var(--links-color-text-secondary);
}

@media (max-width: 1080px) {
  .help-center-body__container {
    gap: 24px;
  }

  .help-center-article {
    padding: 32px;
  }
}

@media (max-width: 900px) {
  .help-center-body__container {
    grid-template-columns: 1fr;
  }

  .help-center-sidebar {
    position: static;
  }

  .help-center-sidebar__inner {
    max-height: none;
  }
}

@media (max-width: 768px) {
  .help-center-hero {
    padding: 56px 20px 72px;
  }

  .help-center-hero p {
    font-size: 16px;
  }

  .help-center-body {
    padding-bottom: 72px;
  }

  .help-center-body__container {
    padding: 0 16px;
  }

  .help-center-article {
    padding: 26px 22px 28px;
    border-radius: 24px;
  }

  .help-center-article__header {
    flex-direction: column;
    gap: 12px;
  }

  .help-center-article__grid {
    grid-template-columns: 1fr;
  }
}
</style>
