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
  font-size: clamp(34px, 4vw, 52px);
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
