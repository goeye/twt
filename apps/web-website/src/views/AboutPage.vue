<template>
  <div class="marketing-home">
    <PageHeader />

    <main class="marketing-main">
      <section class="hero-section" id="top">
        <div class="hero-section__halo hero-section__halo--left"></div>
        <div class="hero-section__halo hero-section__halo--right"></div>
        <div class="section-shell hero-layout">
          <div class="hero-copy">
            <span class="eyebrow">TWT Chat 客服平台</span>
            <h1 class="hero-title">
              一个平台，统一所有
              <span>客户服务场景</span>
            </h1>
            <p class="hero-desc">
              统一接入官网、社媒、IM 与邮件渠道，让 AI 与人工客服在同一工作台协同接待、转化与运营。
            </p>
            <div class="hero-actions">
              <a class="primary-btn" href="#consult">预约演示</a>
              <a class="secondary-btn" href="#features">了解产品</a>
            </div>
            <div class="hero-stats">
              <div v-for="stat in heroStats" :key="stat.label" class="hero-stat">
                <strong>{{ stat.value }}</strong>
                <span>{{ stat.label }}</span>
              </div>
            </div>
          </div>

          <div class="hero-scene" aria-hidden="true">
            <div class="floating-chip floating-chip--left">实时会话 +128</div>
            <div class="floating-chip floating-chip--right">AI Assist 在线</div>
            <div class="scene-window scene-window--back">
              <div class="scene-toolbar">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <div class="scene-sidebar">
                <div class="scene-sidebar__item scene-sidebar__item--active"></div>
                <div class="scene-sidebar__item"></div>
                <div class="scene-sidebar__item"></div>
                <div class="scene-sidebar__item"></div>
              </div>
            </div>
            <div class="scene-window scene-window--front">
              <div class="scene-toolbar">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <div class="scene-content">
                <div class="scene-left">
                  <div class="scene-nav">
                    <div class="scene-nav__item scene-nav__item--active"></div>
                    <div class="scene-nav__item"></div>
                    <div class="scene-nav__item"></div>
                    <div class="scene-nav__item"></div>
                  </div>
                  <div class="scene-persona-list">
                    <div class="persona-row">
                      <span class="avatar avatar--blue"></span>
                      <span></span>
                    </div>
                    <div class="persona-row">
                      <span class="avatar avatar--orange"></span>
                      <span></span>
                    </div>
                    <div class="persona-row">
                      <span class="avatar avatar--green"></span>
                      <span></span>
                    </div>
                  </div>
                </div>
                <div class="scene-chat">
                  <div class="chat-card">
                    <div class="chat-card__title"></div>
                    <div class="chat-card__message chat-card__message--short"></div>
                    <div class="chat-card__message"></div>
                    <div class="chat-card__message chat-card__message--blue"></div>
                  </div>
                </div>
              </div>
            </div>
            <div class="phone-float">
              <div class="phone-float__camera"></div>
              <div class="phone-float__profile">
                <span class="avatar avatar--neutral avatar--lg"></span>
                <div class="phone-float__name">
                  <strong>访客咨询中</strong>
                  <span>等待客服接入</span>
                </div>
              </div>
              <div class="phone-float__message"></div>
              <div class="phone-float__message phone-float__message--small"></div>
              <div class="phone-float__actions">
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        </div>

        <div class="section-shell hero-brands">
          <span v-for="brand in brands" :key="brand">{{ brand }}</span>
        </div>
      </section>

      <section class="section-shell overview-section" id="product">
        <div class="section-heading">
          <span class="section-heading__eyebrow">全链路产品体验</span>
          <h2>3 分钟，借助 Chat 搭起覆盖客户旅程的沟通枢纽</h2>
          <p>从线索承接、售中跟进到售后运营，全部收拢进一个可协同、可自动化、可复盘的统一工作台。</p>
        </div>

        <div class="overview-card">
          <div class="overview-card__main">
            <div class="window-toolbar">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <div class="workspace-board">
              <aside class="workspace-board__nav">
                <span class="is-active"></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
              </aside>
              <div class="workspace-board__list">
                <div class="workspace-line"></div>
                <div class="workspace-line workspace-line--thin"></div>
                <div class="workspace-line"></div>
                <div class="workspace-chip-row">
                  <span>自动分流</span>
                  <span>AI 草拟</span>
                </div>
              </div>
              <div class="workspace-board__chat">
                <div class="bubble bubble--in">请问什么时候发货</div>
                <div class="bubble bubble--out">您好，系统已识别订单，预计今晚 20:00 前揽收。</div>
                <div class="bubble bubble--in">能否同步物流状态</div>
                <div class="bubble bubble--out">当然可以，我已经为您开启短信与邮件通知。</div>
                <div class="workspace-tags">
                  <span>订单咨询</span>
                  <span>高意向</span>
                  <span>已跟进</span>
                </div>
              </div>
            </div>
          </div>

          <div class="overview-card__side">
            <div class="mini-panel">
              <div class="mini-panel__title">AI 助理</div>
              <div class="mini-panel__body">
                <div class="mini-panel__line"></div>
                <div class="mini-panel__line mini-panel__line--short"></div>
                <div class="mini-panel__line"></div>
              </div>
              <button>立即接入</button>
            </div>
            <div class="mini-panel mini-panel--dark">
              <div class="mini-panel__title">绩效看板</div>
              <div class="mini-bars">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        </div>

        <div class="overview-caption">统一会话视图</div>
      </section>

      <section class="section-shell feature-section" id="features">
        <div class="section-heading section-heading--center">
          <span class="section-heading__eyebrow">产品优势</span>
          <h2>为什么选择 TWT Chat？</h2>
          <p>把客服、AI、数据和流程放进一套系统，才能真的把服务质量和转化效率一起拉起来。</p>
        </div>

        <div class="feature-list">
          <article
            v-for="(feature, index) in features"
            :key="feature.title"
            :class="['feature-row', { 'feature-row--reverse': index % 2 === 1 }]"
          >
            <div class="feature-copy-card">
              <span class="feature-tag">{{ feature.tag }}</span>
              <h3>{{ feature.title }}</h3>
              <p>{{ feature.desc }}</p>
              <div class="feature-point-list">
                <span v-for="point in feature.points" :key="point" class="feature-point">{{ point }}</span>
              </div>
            </div>

            <div class="feature-visual-card" :class="`feature-visual-card--${feature.mock}`">
              <div v-if="feature.mock === 'inbox'" class="mockup-inbox">
                <div class="window-toolbar">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <div class="mockup-grid">
                  <div class="mockup-side">
                    <span class="is-active"></span>
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  <div class="mockup-panel mockup-panel--list">
                    <div class="mockup-panel__line"></div>
                    <div class="mockup-panel__line"></div>
                    <div class="mockup-panel__line mockup-panel__line--short"></div>
                  </div>
                  <div class="mockup-panel mockup-panel--chat">
                    <div class="bubble bubble--in">客户正在询问产品方案</div>
                    <div class="bubble bubble--out">系统自动带出客户标签与历史订单。</div>
                    <div class="bubble bubble--out bubble--compact">客服可以直接继续跟进。</div>
                  </div>
                </div>
              </div>

              <div v-else-if="feature.mock === 'ai'" class="mockup-ai">
                <div class="mockup-ai__header">
                  <span>AI Assist</span>
                  <strong>建议回复</strong>
                </div>
                <div class="mockup-ai__body">
                  <div class="mockup-ai__sidebar">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  <div class="mockup-ai__chat">
                    <div class="bubble bubble--in">客户问退款政策</div>
                    <div class="bubble bubble--out">AI 已根据知识库生成回答，并标注退款条件。</div>
                    <div class="mockup-ai__score">命中知识库 100%</div>
                  </div>
                </div>
              </div>

              <div v-else-if="feature.mock === 'flow'" class="mockup-flow">
                <div class="mockup-flow__sidebar">
                  <span></span>
                  <span class="is-active"></span>
                  <span></span>
                  <span></span>
                </div>
                <div class="mockup-flow__canvas">
                  <div class="flow-node">触发器</div>
                  <div class="flow-line"></div>
                  <div class="flow-node flow-node--accent">自动分配</div>
                  <div class="flow-line"></div>
                  <div class="flow-node">发送模板消息</div>
                  <div class="flow-line"></div>
                  <div class="flow-node">创建跟进任务</div>
                </div>
              </div>

              <div v-else-if="feature.mock === 'team'" class="mockup-team">
                <div class="window-toolbar">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <div class="mockup-team__body">
                  <div class="mockup-team__column">
                    <div class="team-member" v-for="member in teamMembers" :key="member.name">
                      <span :class="['avatar', member.avatar]"></span>
                      <div>
                        <strong>{{ member.name }}</strong>
                        <p>{{ member.role }}</p>
                      </div>
                    </div>
                  </div>
                  <div class="mockup-team__chat">
                    <div class="bubble bubble--in">需要销售同事介入报价</div>
                    <div class="bubble bubble--out">已 @Sunny 接手，并同步客户预算区间。</div>
                    <div class="bubble bubble--out bubble--compact">内部备注不会暴露给访客。</div>
                  </div>
                </div>
              </div>

              <div v-else class="mockup-report">
                <div class="mockup-report__chart">
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <div class="mockup-report__lines">
                  <div class="mockup-panel__line"></div>
                  <div class="mockup-panel__line mockup-panel__line--short"></div>
                  <div class="mockup-panel__line"></div>
                </div>
                <div class="mockup-report__legend">
                  <span>响应率</span>
                  <span>转化率</span>
                  <span>满意度</span>
                </div>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section class="industry-section" id="solutions">
        <div class="section-shell">
          <div class="section-heading section-heading--center">
            <span class="section-heading__eyebrow">行业方案</span>
            <h2>面向多行业，提供真正匹配业务的解决方案</h2>
            <p>不是空话式通用平台，而是把常见业务动作直接塞进产品里，让团队上手就能用起来。</p>
          </div>

          <div class="industry-tabs">
            <button
              v-for="(tab, index) in industryTabs"
              :key="tab"
              :class="['industry-tab', { 'industry-tab--active': index === 0 }]"
              type="button"
            >
              {{ tab }}
            </button>
          </div>

          <div class="industry-grid">
            <article v-for="card in industryCards" :key="card.title" class="industry-card">
              <div class="industry-card__head">
                <span class="industry-card__badge">{{ card.badge }}</span>
                <h3>{{ card.title }}</h3>
                <p>{{ card.desc }}</p>
              </div>
              <div class="industry-card__visual" :class="`industry-card__visual--${card.theme}`">
                <div class="industry-card__visual-top">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <div class="industry-card__visual-body">
                  <div v-for="item in card.highlights" :key="item" class="industry-highlight">{{ item }}</div>
                </div>
              </div>
              <a href="#consult" class="industry-card__action">立即咨询</a>
            </article>
          </div>

          <div class="industry-dots" aria-hidden="true">
            <span class="is-active"></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </section>

      <section class="section-shell trust-section" id="security">
        <div class="section-heading section-heading--center">
          <span class="section-heading__eyebrow">平台能力</span>
          <h2>更稳定、更高能、更安全</h2>
          <p>从权限、审计到可用性与扩展性，把企业真正会担心的东西提前处理掉。</p>
        </div>

        <div class="trust-grid">
          <article v-for="item in trustItems" :key="item.title" class="trust-card">
            <span class="trust-card__icon">{{ item.icon }}</span>
            <h3>{{ item.title }}</h3>
            <p>{{ item.desc }}</p>
          </article>
        </div>
      </section>

      <section class="section-shell faq-section" id="faq">
        <div class="section-heading section-heading--center">
          <span class="section-heading__eyebrow">常见问题</span>
          <h2>常见问题</h2>
        </div>

        <div class="faq-list">
          <article v-for="(item, index) in faqItems" :key="item.q" class="faq-item">
            <button class="faq-item__question" type="button" @click="openFaq = openFaq === index ? -1 : index">
              <span>{{ item.q }}</span>
              <strong>{{ openFaq === index ? "−" : "+" }}</strong>
            </button>
            <p v-if="openFaq === index" class="faq-item__answer">{{ item.a }}</p>
          </article>
        </div>
      </section>

      <section class="section-shell news-section" id="news">
        <div class="section-heading section-heading--center">
          <span class="section-heading__eyebrow">内容更新</span>
          <h2>平台资讯</h2>
        </div>

        <div class="news-grid">
          <article v-for="post in newsCards" :key="post.title" class="news-card">
            <div class="news-card__cover" :class="`news-card__cover--${post.theme}`">
              <div class="news-card__cover-shape"></div>
            </div>
            <div class="news-card__body">
              <span>{{ post.category }}</span>
              <h3>{{ post.title }}</h3>
              <p>{{ post.desc }}</p>
            </div>
          </article>
        </div>

        <div class="news-more">
          <a href="#consult">了解更多</a>
        </div>
      </section>

      <section class="section-shell consult-section" id="consult">
        <div class="consult-card">
          <div class="consult-copy">
            <span class="section-heading__eyebrow">预约专属顾问</span>
            <h2>预约专家演示</h2>
            <p>留下团队规模和业务场景，我们会按照你的咨询渠道、AI 策略和协同流程来做专属演示。</p>

            <form class="consult-form">
              <label>
                <span>姓名</span>
                <input type="text" placeholder="请输入姓名" />
              </label>
              <label>
                <span>公司</span>
                <input type="text" placeholder="请输入公司名称" />
              </label>
              <label>
                <span>手机号</span>
                <input type="text" placeholder="请输入手机号" />
              </label>
              <label>
                <span>业务场景</span>
                <input type="text" placeholder="例如电商售前售后" />
              </label>
              <button type="button" class="primary-btn consult-form__submit">提交预约</button>
            </form>
          </div>

          <div class="consult-visual" aria-hidden="true">
            <div class="consult-visual__card">
              <div class="consult-visual__halo"></div>
              <div class="consult-avatar">
                <div class="consult-avatar__head"></div>
                <div class="consult-avatar__body"></div>
              </div>
              <div class="consult-visual__badge">1 对 1 产品顾问</div>
            </div>
          </div>
        </div>
      </section>

      <section class="section-shell cta-section">
        <div class="cta-card">
          <div>
            <span class="section-heading__eyebrow section-heading__eyebrow--light">开始体验</span>
            <h2>选择 TWT Chat<br />以较高可靠，应对复杂的服务挑战</h2>
          </div>
          <div class="cta-actions">
            <a class="cta-btn cta-btn--light" href="#consult">预约演示</a>
            <a class="cta-btn cta-btn--ghost" href="/links">了解更多</a>
          </div>
        </div>
      </section>
    </main>

    <PageFooter />

    <a class="floating-help" href="#consult" aria-label="预约咨询">咨</a>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import PageFooter from "../components/about/PageFooter.vue";
import PageHeader from "../components/about/PageHeader.vue";

const heroStats = [
  { value: "98.5%", label: "首响达标率" },
  { value: "12+", label: "主流渠道统一接入" },
  { value: "7x24", label: "AI 与人工协同在线" },
];

const brands = [
  "WhatsApp",
  "Messenger",
  "Instagram",
  "Telegram",
  "Shopify",
  "TikTok",
  "Slack",
  "Line",
];

const features = [
  {
    tag: "全渠道消息中心",
    title: "消息统一收口，客服终于不用在一堆窗口里瞎跳",
    desc: "把官网、社媒、IM 与邮件全部接进同一收件箱，客户历史、订单记录和标签同步展示。",
    points: ["统一收件箱", "客户画像", "优先级分配"],
    mock: "inbox",
  },
  {
    tag: "AI Copilot",
    title: "知识库驱动的 AI 辅助回复，让新人也能稳住服务质量",
    desc: "自动理解上下文、推荐回复、调用知识库与 SOP，人工只需要确认和补充关键判断。",
    points: ["智能建议", "知识库命中", "多语言回复"],
    mock: "ai",
  },
  {
    tag: "自动化编排",
    title: "把重复动作交给流程，团队精力拿去处理真正复杂的问题",
    desc: "自动分流、打标签、跟进提醒、客户回访和任务创建都能在可视化流程里完成。",
    points: ["流程画布", "规则引擎", "自动任务"],
    mock: "flow",
  },
  {
    tag: "团队协同",
    title: "客服、销售、运营一起接住客户，不再互相甩锅",
    desc: "支持内部备注、协作指派、SLA 机制和跨角色接力，让一个客户从咨询到成交不再断层。",
    points: ["内部备注", "多人协同", "SLA 管理"],
    mock: "team",
  },
  {
    tag: "数据洞察",
    title: "每一次会话都能变成数据资产，知道问题出在哪，也知道增长从哪来",
    desc: "围绕响应率、满意度、转化率、坐席效率等核心指标形成统一报表，方便复盘与优化。",
    points: ["服务报表", "转化漏斗", "绩效排行"],
    mock: "report",
  },
];

const teamMembers = [
  { name: "Mia", role: "客服主管", avatar: "avatar--blue" },
  { name: "Sunny", role: "销售顾问", avatar: "avatar--orange" },
  { name: "Aiden", role: "运营支持", avatar: "avatar--green" },
];

const industryTabs = ["电商零售", "教育培训", "SaaS", "金融服务"];

const industryCards = [
  {
    badge: "跨境电商",
    title: "售前承接到售后追单，一套流程全管住",
    desc: "自动识别高意向客户、同步订单状态、沉淀售后标准话术，减少客服重复劳动。",
    highlights: ["高价值客户识别", "订单状态同步", "退款质检闭环"],
    theme: "commerce",
  },
  {
    badge: "在线教育",
    title: "顾问跟进、试听转化和续费提醒同时在线",
    desc: "把线索分配、试听提醒、上课前通知与续费激活放进统一流程，提高转化连续性。",
    highlights: ["试听提醒", "课程顾问接力", "续费自动触达"],
    theme: "education",
  },
  {
    badge: "SaaS 服务",
    title: "售前演示、试用激活和工单支持天然串起来",
    desc: "把试用客户的咨询、功能问题与销售机会同时记录，避免前后链路脱节。",
    highlights: ["试用激活", "产品答疑", "续约风险预警"],
    theme: "saas",
  },
];

const trustItems = [
  { icon: "◧", title: "多渠道接入", desc: "网站、社媒、IM、邮件与 CRM 均可接入，不做信息孤岛。" },
  { icon: "⌁", title: "智能路由", desc: "按来源、语言、客户等级与业务规则自动分配到对应队列。" },
  { icon: "▣", title: "权限体系", desc: "支持角色权限、敏感操作控制与关键字段访问隔离。" },
  { icon: "≈", title: "服务稳定性", desc: "围绕高并发接待和多团队协同设计，服务不中断才有资格谈增长。" },
  { icon: "◌", title: "安全审计", desc: "操作日志、会话记录和流程动作均可追溯，方便内控与合规。" },
  { icon: "✦", title: "开放扩展", desc: "支持 API、Webhook 与第三方系统集成，不把团队锁死在黑盒里。" },
];

const faqItems = [
  {
    q: "TWT Chat 适合什么规模的团队使用？",
    a: "从刚开始搭建客服体系的中小团队，到需要多团队协作的成熟企业都能用。区别只在于接入渠道数量、自动化深度和权限配置复杂度。",
  },
  {
    q: "是否支持 AI 和人工客服混合接待？",
    a: "支持。AI 可以负责首轮问答、知识库命中和回复草拟，复杂问题随时转人工继续处理，整个上下文会完整保留。",
  },
  {
    q: "上线周期一般需要多久？",
    a: "如果只是接入常见渠道并使用标准流程，通常几天内即可完成。若涉及复杂权限、系统对接或定制自动化，周期会更长一些。",
  },
  {
    q: "可以对接现有 CRM、订单或会员系统吗？",
    a: "可以。平台支持 API、Webhook 和第三方集成，能把客户标签、订单状态和业务事件同步回客服工作台。",
  },
];

const newsCards = [
  {
    category: "产品更新",
    title: "更细粒度的会话分析能力上线，帮助团队看清服务瓶颈",
    desc: "围绕响应时长、转化效率和满意度等关键指标，支持更直观的横向对比与趋势判断。",
    theme: "chart",
  },
  {
    category: "客户成功",
    title: "一家跨境品牌如何用统一收件箱把首响时间压缩到 5 分钟内",
    desc: "从客服排班、AI 辅助到流程编排，拆解真实团队的效率改造路径。",
    theme: "product",
  },
  {
    category: "平台公告",
    title: "TWT Chat 新增更多开放接口，方便对接 CRM 与营销系统",
    desc: "开放能力不是摆设，真正有价值的是让你的业务链路不被平台卡脖子。",
    theme: "dark",
  },
];

const openFaq = ref(0);
</script>

<style scoped>
.marketing-home {
  min-height: 100vh;
  background:
    radial-gradient(circle at top left, rgba(38, 109, 255, 0.16), transparent 28%),
    linear-gradient(180deg, #f8fbff 0%, #ffffff 24%, #f7fbff 68%, #ffffff 100%);
  color: #0f172a;
}

.marketing-main {
  position: relative;
  overflow: hidden;
}

.section-shell {
  width: min(1180px, calc(100% - 48px));
  margin: 0 auto;
}

.hero-section {
  position: relative;
  padding: 34px 0 44px;
  overflow: hidden;
}

.hero-section__halo {
  position: absolute;
  width: 420px;
  height: 420px;
  border-radius: 50%;
  filter: blur(24px);
  opacity: 0.6;
  pointer-events: none;
}

.hero-section__halo--left {
  top: -110px;
  left: -130px;
  background: rgba(76, 157, 255, 0.22);
}

.hero-section__halo--right {
  top: 40px;
  right: -150px;
  background: rgba(153, 190, 255, 0.36);
}

.hero-layout {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 480px) minmax(0, 1fr);
  gap: 56px;
  align-items: center;
}

.hero-copy {
  position: relative;
  z-index: 1;
  padding: 62px 0 56px;
}

.eyebrow,
.section-heading__eyebrow {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 32px;
  padding: 0 14px;
  border-radius: 999px;
  background: rgba(17, 95, 255, 0.08);
  color: #105eff;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.04em;
}

.hero-title {
  margin-top: 20px;
  font-size: clamp(42px, 5vw, 60px);
  line-height: 1.08;
  font-weight: 700;
  letter-spacing: -0.04em;
}

.hero-title span {
  color: #105eff;
}

.hero-desc {
  max-width: 470px;
  margin-top: 22px;
  color: #51607b;
  font-size: 17px;
  line-height: 1.8;
}

.hero-actions,
.cta-actions {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-top: 30px;
  flex-wrap: wrap;
}

.primary-btn,
.secondary-btn,
.cta-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 138px;
  min-height: 48px;
  padding: 0 24px;
  border-radius: 999px;
  font-size: 15px;
  font-weight: 600;
  transition:
    transform 180ms ease,
    box-shadow 180ms ease,
    background 180ms ease,
    color 180ms ease;
}

.primary-btn {
  color: #ffffff;
  background: linear-gradient(135deg, #1762ff 0%, #1a86ff 100%);
  box-shadow: 0 18px 32px rgba(16, 94, 255, 0.24);
}

.secondary-btn {
  color: #105eff;
  background: #ffffff;
  border: 1px solid rgba(16, 94, 255, 0.16);
  box-shadow: 0 14px 24px rgba(101, 128, 178, 0.08);
}

.primary-btn:hover,
.secondary-btn:hover,
.cta-btn:hover,
.industry-card__action:hover,
.news-more a:hover {
  transform: translateY(-2px);
}

.hero-stats {
  display: flex;
  gap: 18px;
  margin-top: 36px;
  flex-wrap: wrap;
}

.hero-stat {
  min-width: 138px;
  padding: 16px 18px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(189, 208, 255, 0.7);
  box-shadow: 0 14px 30px rgba(49, 89, 163, 0.08);
}

.hero-stat strong {
  display: block;
  font-size: 22px;
  font-weight: 700;
  color: #101828;
}

.hero-stat span {
  display: block;
  margin-top: 6px;
  font-size: 13px;
  color: #61708d;
}

.hero-scene {
  position: relative;
  min-height: 540px;
}

.floating-chip {
  position: absolute;
  z-index: 4;
  min-height: 36px;
  padding: 0 16px;
  border-radius: 999px;
  background: rgba(8, 15, 35, 0.88);
  color: #ffffff;
  font-size: 13px;
  font-weight: 600;
  line-height: 36px;
  box-shadow: 0 12px 24px rgba(7, 16, 40, 0.18);
}

.floating-chip--left {
  top: 56px;
  left: 12px;
}

.floating-chip--right {
  right: 10px;
  bottom: 88px;
}

.scene-window {
  position: absolute;
  top: 70px;
  right: 26px;
  width: min(100%, 510px);
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.84);
  border: 1px solid rgba(210, 224, 255, 0.92);
  box-shadow:
    0 34px 70px rgba(62, 98, 170, 0.12),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(18px);
}

.scene-window--back {
  width: 420px;
  height: 280px;
  top: 116px;
  right: 72px;
  opacity: 0.62;
}

.scene-window--front {
  width: 510px;
  height: 340px;
}

.scene-toolbar,
.window-toolbar,
.industry-card__visual-top {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px 18px;
}

.scene-toolbar span,
.window-toolbar span,
.industry-card__visual-top span {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #d7def2;
}

.scene-toolbar span:first-child,
.window-toolbar span:first-child,
.industry-card__visual-top span:first-child {
  background: #ff7c6d;
}

.scene-toolbar span:nth-child(2),
.window-toolbar span:nth-child(2),
.industry-card__visual-top span:nth-child(2) {
  background: #ffd166;
}

.scene-toolbar span:nth-child(3),
.window-toolbar span:nth-child(3),
.industry-card__visual-top span:nth-child(3) {
  background: #54d39b;
}

.scene-window--back .scene-sidebar {
  display: flex;
  flex-direction: column;
  gap: 14px;
  width: 54px;
  padding: 18px;
}

.scene-sidebar__item {
  width: 18px;
  height: 18px;
  border-radius: 10px;
  background: #e9effd;
}

.scene-sidebar__item--active {
  height: 38px;
  background: linear-gradient(180deg, #1c72ff 0%, #4b9dff 100%);
}

.scene-content {
  display: grid;
  grid-template-columns: 128px 1fr;
  height: calc(100% - 42px);
}

.scene-left {
  padding: 4px 18px 18px;
  border-right: 1px solid rgba(215, 227, 255, 0.8);
}

.scene-nav {
  display: flex;
  gap: 8px;
  margin-bottom: 22px;
}

.scene-nav__item {
  width: 30px;
  height: 8px;
  border-radius: 999px;
  background: #eaf0fe;
}

.scene-nav__item--active {
  width: 48px;
  background: #1a73ff;
}

.scene-persona-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.persona-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.persona-row span:last-child {
  flex: 1;
  height: 10px;
  border-radius: 999px;
  background: #ecf2ff;
}

.avatar {
  display: inline-flex;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  flex-shrink: 0;
}

.avatar--lg {
  width: 48px;
  height: 48px;
}

.avatar--blue {
  background: linear-gradient(135deg, #95c0ff 0%, #327dff 100%);
}

.avatar--orange {
  background: linear-gradient(135deg, #ffd7a0 0%, #ff8e45 100%);
}

.avatar--green {
  background: linear-gradient(135deg, #bbf3d0 0%, #37c47c 100%);
}

.avatar--neutral {
  background: linear-gradient(135deg, #f3f5fb 0%, #c7d3ea 100%);
}

.scene-chat {
  padding: 24px;
}

.chat-card {
  height: 100%;
  border-radius: 24px;
  background:
    linear-gradient(180deg, rgba(245, 249, 255, 0.86) 0%, rgba(255, 255, 255, 0.96) 100%);
  padding: 24px;
}

.chat-card__title,
.chat-card__message {
  height: 12px;
  border-radius: 999px;
  background: #ecf2ff;
}

.chat-card__title {
  width: 36%;
}

.chat-card__message {
  width: 88%;
  margin-top: 16px;
}

.chat-card__message--short {
  width: 64%;
  margin-top: 24px;
}

.chat-card__message--blue {
  width: 74%;
  background: linear-gradient(90deg, rgba(16, 94, 255, 0.12) 0%, rgba(16, 94, 255, 0.34) 100%);
}

.phone-float {
  position: absolute;
  top: 98px;
  right: 112px;
  z-index: 3;
  width: 180px;
  padding: 16px 14px 18px;
  border-radius: 28px;
  background: rgba(37, 36, 42, 0.88);
  box-shadow: 0 26px 60px rgba(25, 28, 44, 0.34);
  backdrop-filter: blur(12px);
}

.phone-float__camera {
  width: 54px;
  height: 6px;
  margin: 0 auto 18px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.22);
}

.phone-float__profile {
  display: flex;
  align-items: center;
  gap: 12px;
}

.phone-float__name strong,
.phone-float__name span {
  display: block;
  color: #ffffff;
}

.phone-float__name strong {
  font-size: 14px;
}

.phone-float__name span {
  margin-top: 4px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.68);
}

.phone-float__message {
  height: 38px;
  margin-top: 20px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.14);
}

.phone-float__message--small {
  width: 70%;
  height: 28px;
}

.phone-float__actions {
  display: flex;
  gap: 12px;
  margin-top: 18px;
}

.phone-float__actions span {
  flex: 1;
  height: 34px;
  border-radius: 999px;
  background: #ff5454;
}

.phone-float__actions span:last-child {
  background: #54d39b;
}

.hero-brands {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 16px 28px;
  padding: 18px 22px;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.82);
  border: 1px solid rgba(214, 225, 255, 0.88);
  box-shadow: 0 20px 44px rgba(78, 111, 180, 0.08);
}

.hero-brands span {
  color: #677792;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.06em;
}

.overview-section,
.feature-section,
.trust-section,
.faq-section,
.news-section,
.consult-section,
.cta-section {
  padding-top: 108px;
}

.section-heading {
  max-width: 720px;
}

.section-heading--center {
  margin: 0 auto;
  text-align: center;
}

.section-heading h2 {
  margin-top: 16px;
  font-size: clamp(30px, 3.6vw, 42px);
  line-height: 1.18;
  font-weight: 700;
  letter-spacing: -0.03em;
  color: #0f172a;
}

.section-heading p {
  margin-top: 14px;
  color: #60708c;
  font-size: 16px;
  line-height: 1.85;
}

.overview-card {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 240px;
  gap: 22px;
  margin-top: 36px;
  padding: 24px;
  border-radius: 32px;
  background: linear-gradient(180deg, #ffffff 0%, #f7fbff 100%);
  border: 1px solid rgba(206, 221, 255, 0.9);
  box-shadow: 0 28px 60px rgba(82, 111, 175, 0.12);
}

.overview-card__main,
.feature-visual-card,
.industry-card,
.trust-card,
.news-card,
.consult-card {
  box-shadow: 0 26px 60px rgba(84, 110, 168, 0.1);
}

.overview-card__main {
  border-radius: 28px;
  border: 1px solid rgba(208, 221, 252, 0.9);
  background: #ffffff;
  overflow: hidden;
}

.workspace-board {
  display: grid;
  grid-template-columns: 64px 214px minmax(0, 1fr);
  min-height: 390px;
}

.workspace-board__nav {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 18px;
  background: #f8fbff;
  border-right: 1px solid rgba(220, 229, 248, 0.9);
}

.workspace-board__nav span,
.mockup-side span,
.mockup-flow__sidebar span {
  width: 24px;
  height: 24px;
  border-radius: 12px;
  background: #dce8ff;
}

.workspace-board__nav .is-active,
.mockup-side .is-active,
.mockup-flow__sidebar .is-active {
  height: 44px;
  background: linear-gradient(180deg, #196dff 0%, #49a1ff 100%);
}

.workspace-board__list {
  padding: 24px 18px;
  border-right: 1px solid rgba(220, 229, 248, 0.9);
}

.workspace-line,
.mini-panel__line,
.mockup-panel__line {
  height: 12px;
  border-radius: 999px;
  background: #edf3ff;
}

.workspace-line + .workspace-line,
.mockup-panel__line + .mockup-panel__line {
  margin-top: 18px;
}

.workspace-line--thin,
.mini-panel__line--short,
.mockup-panel__line--short {
  width: 70%;
}

.workspace-chip-row {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 26px;
}

.workspace-chip-row span,
.workspace-tags span,
.feature-point,
.mockup-ai__score,
.industry-card__badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 32px;
  padding: 0 14px;
  border-radius: 999px;
  background: rgba(16, 94, 255, 0.08);
  color: #105eff;
  font-size: 12px;
  font-weight: 600;
}

.workspace-board__chat {
  padding: 28px;
}

.bubble {
  max-width: 86%;
  padding: 14px 16px;
  border-radius: 18px;
  font-size: 13px;
  line-height: 1.65;
  box-shadow: 0 10px 20px rgba(81, 107, 165, 0.08);
}

.bubble + .bubble {
  margin-top: 14px;
}

.bubble--in {
  color: #40506b;
  background: #f2f6ff;
}

.bubble--out {
  margin-left: auto;
  color: #ffffff;
  background: linear-gradient(135deg, #1d6eff 0%, #47a2ff 100%);
}

.bubble--compact {
  max-width: 68%;
}

.workspace-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 22px;
}

.overview-card__side {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.mini-panel {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 184px;
  padding: 22px;
  border-radius: 24px;
  background: #ffffff;
  border: 1px solid rgba(208, 221, 252, 0.9);
}

.mini-panel__title {
  font-size: 15px;
  font-weight: 700;
}

.mini-panel__body {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.mini-panel button,
.industry-card__action,
.news-more a {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;
  padding: 0 18px;
  border-radius: 999px;
  background: linear-gradient(135deg, #1762ff 0%, #1a86ff 100%);
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
  transition: transform 180ms ease;
}

.mini-panel--dark {
  color: #ffffff;
  background: linear-gradient(160deg, #121c31 0%, #0b1426 100%);
}

.mini-bars {
  display: flex;
  align-items: flex-end;
  gap: 10px;
  height: 80px;
}

.mini-bars span {
  flex: 1;
  border-radius: 10px 10px 4px 4px;
  background: linear-gradient(180deg, #7bb8ff 0%, #2d75ff 100%);
}

.mini-bars span:nth-child(1) {
  height: 30%;
}

.mini-bars span:nth-child(2) {
  height: 62%;
}

.mini-bars span:nth-child(3) {
  height: 48%;
}

.mini-bars span:nth-child(4) {
  height: 78%;
}

.overview-caption {
  width: fit-content;
  margin: 22px auto 0;
  padding: 10px 16px;
  border-radius: 999px;
  border: 1px solid rgba(208, 219, 246, 0.9);
  color: #4e5e78;
  font-size: 13px;
  background: #ffffff;
}

.feature-list {
  margin-top: 46px;
}

.feature-row {
  display: grid;
  grid-template-columns: minmax(0, 380px) minmax(0, 1fr);
  gap: 26px;
  align-items: stretch;
}

.feature-row + .feature-row {
  margin-top: 26px;
}

.feature-row--reverse {
  grid-template-columns: minmax(0, 1fr) minmax(0, 380px);
}

.feature-row--reverse .feature-copy-card {
  order: 2;
}

.feature-row--reverse .feature-visual-card {
  order: 1;
}

.feature-copy-card,
.feature-visual-card,
.industry-card,
.trust-card,
.news-card,
.consult-card,
.cta-card {
  border: 1px solid rgba(208, 220, 248, 0.9);
  background: linear-gradient(180deg, #ffffff 0%, #f8fbff 100%);
}

.feature-copy-card {
  padding: 34px 30px;
  border-radius: 28px;
}

.feature-tag {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 30px;
  padding: 0 12px;
  border-radius: 999px;
  background: rgba(16, 94, 255, 0.08);
  color: #105eff;
  font-size: 12px;
  font-weight: 700;
}

.feature-copy-card h3 {
  margin-top: 18px;
  font-size: 30px;
  line-height: 1.28;
  letter-spacing: -0.03em;
}

.feature-copy-card p {
  margin-top: 16px;
  color: #5d6c88;
  font-size: 15px;
  line-height: 1.9;
}

.feature-point-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 24px;
}

.feature-visual-card {
  min-height: 340px;
  padding: 22px;
  border-radius: 28px;
}

.mockup-inbox,
.mockup-ai,
.mockup-flow,
.mockup-team,
.mockup-report {
  height: 100%;
  border-radius: 24px;
  background: #ffffff;
  overflow: hidden;
}

.mockup-grid,
.mockup-team__body {
  display: grid;
  grid-template-columns: 60px 180px minmax(0, 1fr);
  min-height: calc(100% - 42px);
}

.mockup-side,
.mockup-flow__sidebar {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 18px;
  border-right: 1px solid rgba(217, 227, 249, 0.92);
  background: #f8fbff;
}

.mockup-panel {
  padding: 22px 18px;
}

.mockup-panel--list {
  border-right: 1px solid rgba(217, 227, 249, 0.92);
}

.mockup-panel--chat {
  padding: 24px;
}

.mockup-ai {
  background: linear-gradient(180deg, #ffffff 0%, #f8fbff 100%);
}

.mockup-ai__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 22px 24px;
  border-bottom: 1px solid rgba(220, 229, 248, 0.9);
  font-size: 14px;
}

.mockup-ai__header span {
  color: #105eff;
  font-weight: 700;
}

.mockup-ai__body {
  display: grid;
  grid-template-columns: 90px minmax(0, 1fr);
  min-height: calc(100% - 65px);
}

.mockup-ai__sidebar {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 22px;
  border-right: 1px solid rgba(220, 229, 248, 0.9);
}

.mockup-ai__sidebar span {
  width: 44px;
  height: 12px;
  border-radius: 999px;
  background: #dce8ff;
}

.mockup-ai__chat {
  padding: 26px;
}

.mockup-ai__score {
  margin-top: 20px;
}

.mockup-flow {
  display: grid;
  grid-template-columns: 70px minmax(0, 1fr);
}

.mockup-flow__canvas {
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  gap: 10px;
  padding: 22px;
  background:
    radial-gradient(circle at top right, rgba(16, 94, 255, 0.08), transparent 32%),
    #ffffff;
}

.flow-node {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 104px;
  min-height: 52px;
  padding: 0 16px;
  border-radius: 18px;
  background: #f4f8ff;
  color: #3f4e67;
  font-size: 13px;
  font-weight: 700;
}

.flow-node--accent {
  background: linear-gradient(135deg, #1b70ff 0%, #4da4ff 100%);
  color: #ffffff;
}

.flow-line {
  width: 42px;
  height: 2px;
  border-radius: 999px;
  background: linear-gradient(90deg, rgba(16, 94, 255, 0.24) 0%, rgba(16, 94, 255, 0.64) 100%);
}

.mockup-team__column {
  padding: 22px 18px;
  border-right: 1px solid rgba(217, 227, 249, 0.92);
}

.team-member {
  display: flex;
  align-items: center;
  gap: 12px;
}

.team-member + .team-member {
  margin-top: 18px;
}

.team-member strong,
.team-member p {
  display: block;
}

.team-member strong {
  font-size: 14px;
}

.team-member p {
  margin-top: 4px;
  font-size: 12px;
  color: #667791;
}

.mockup-team__chat {
  padding: 24px;
}

.mockup-report {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 30px;
  background:
    linear-gradient(180deg, rgba(246, 250, 255, 0.92) 0%, rgba(255, 255, 255, 1) 100%);
}

.mockup-report__chart {
  display: flex;
  align-items: flex-end;
  gap: 14px;
  height: 180px;
}

.mockup-report__chart span {
  flex: 1;
  border-radius: 16px 16px 6px 6px;
  background: linear-gradient(180deg, rgba(16, 94, 255, 0.24) 0%, #2e79ff 100%);
}

.mockup-report__chart span:nth-child(1) {
  height: 44%;
}

.mockup-report__chart span:nth-child(2) {
  height: 56%;
}

.mockup-report__chart span:nth-child(3) {
  height: 34%;
}

.mockup-report__chart span:nth-child(4) {
  height: 70%;
}

.mockup-report__chart span:nth-child(5) {
  height: 54%;
}

.mockup-report__chart span:nth-child(6) {
  height: 82%;
}

.mockup-report__lines {
  margin-top: 28px;
}

.mockup-report__legend {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 24px;
}

.mockup-report__legend span {
  min-height: 32px;
  padding: 0 14px;
  border-radius: 999px;
  background: #eef4ff;
  color: #56708b;
  font-size: 12px;
  line-height: 32px;
}

.industry-section {
  margin-top: 108px;
  padding: 112px 0;
  background:
    linear-gradient(180deg, rgba(236, 244, 255, 0.92) 0%, rgba(246, 250, 255, 0.92) 100%);
}

.industry-tabs {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 30px;
  flex-wrap: wrap;
}

.industry-tab {
  min-height: 38px;
  padding: 0 18px;
  border-radius: 999px;
  border: 1px solid rgba(182, 201, 238, 0.9);
  background: rgba(255, 255, 255, 0.72);
  color: #667791;
  font-size: 13px;
  font-weight: 600;
}

.industry-tab--active {
  background: #0f172a;
  color: #ffffff;
  border-color: #0f172a;
}

.industry-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 22px;
  margin-top: 34px;
}

.industry-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 430px;
  padding: 24px;
  border-radius: 30px;
}

.industry-card__head h3 {
  margin-top: 16px;
  font-size: 26px;
  line-height: 1.3;
}

.industry-card__head p {
  margin-top: 14px;
  color: #61718d;
  line-height: 1.85;
  font-size: 15px;
}

.industry-card__visual {
  margin-top: 26px;
  border-radius: 24px;
  overflow: hidden;
}

.industry-card__visual-body {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 22px;
}

.industry-card__visual--commerce {
  background: linear-gradient(160deg, #102147 0%, #2c4277 100%);
}

.industry-card__visual--education {
  background: linear-gradient(160deg, #3a312f 0%, #7a695c 100%);
}

.industry-card__visual--saas {
  background: linear-gradient(160deg, #eef5ff 0%, #dbe8ff 100%);
}

.industry-highlight {
  min-height: 38px;
  padding: 0 14px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.16);
  color: #ffffff;
  font-size: 13px;
  line-height: 38px;
}

.industry-card__visual--saas .industry-highlight {
  background: rgba(255, 255, 255, 0.72);
  color: #32425d;
}

.industry-card__action {
  align-self: flex-start;
  margin-top: 24px;
}

.industry-dots {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 26px;
}

.industry-dots span {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: rgba(16, 23, 42, 0.18);
}

.industry-dots .is-active {
  width: 42px;
  border-radius: 999px;
  background: #10172a;
}

.trust-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
  margin-top: 40px;
}

.trust-card {
  min-height: 208px;
  padding: 28px 24px;
  border-radius: 26px;
}

.trust-card__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 54px;
  height: 54px;
  border-radius: 16px;
  background: rgba(16, 94, 255, 0.08);
  color: #105eff;
  font-size: 22px;
  font-weight: 700;
}

.trust-card h3 {
  margin-top: 18px;
  font-size: 22px;
}

.trust-card p {
  margin-top: 12px;
  color: #61718d;
  line-height: 1.85;
}

.faq-list {
  max-width: 920px;
  margin: 38px auto 0;
}

.faq-item {
  border-bottom: 1px solid rgba(210, 221, 244, 0.94);
}

.faq-item__question {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 22px 0;
  text-align: left;
  font-size: 16px;
  font-weight: 600;
  color: #111827;
}

.faq-item__question strong {
  font-size: 26px;
  font-weight: 400;
  color: #6b7c95;
}

.faq-item__answer {
  padding: 0 0 20px;
  color: #61708c;
  line-height: 1.85;
}

.news-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px;
  margin-top: 38px;
}

.news-card {
  overflow: hidden;
  border-radius: 26px;
}

.news-card__cover {
  position: relative;
  height: 180px;
  overflow: hidden;
}

.news-card__cover--chart {
  background: linear-gradient(135deg, #111927 0%, #27406e 100%);
}

.news-card__cover--product {
  background: linear-gradient(135deg, #f1f6ff 0%, #dbe8ff 100%);
}

.news-card__cover--dark {
  background: linear-gradient(135deg, #101728 0%, #2a2a2a 100%);
}

.news-card__cover-shape {
  position: absolute;
  inset: 22px;
  border-radius: 22px;
  background:
    linear-gradient(135deg, rgba(16, 94, 255, 0.28) 0%, rgba(16, 94, 255, 0) 60%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.02));
}

.news-card__body {
  padding: 22px;
}

.news-card__body span {
  color: #105eff;
  font-size: 12px;
  font-weight: 700;
}

.news-card__body h3 {
  margin-top: 12px;
  font-size: 20px;
  line-height: 1.45;
}

.news-card__body p {
  margin-top: 12px;
  color: #61718d;
  line-height: 1.8;
}

.news-more {
  display: flex;
  justify-content: center;
  margin-top: 28px;
}

.consult-card {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 340px;
  gap: 24px;
  align-items: stretch;
  padding: 34px;
  border-radius: 32px;
}

.consult-copy h2 {
  margin-top: 16px;
  font-size: 38px;
  line-height: 1.2;
  letter-spacing: -0.03em;
}

.consult-copy p {
  max-width: 640px;
  margin-top: 14px;
  color: #61718d;
  line-height: 1.85;
}

.consult-form {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
  margin-top: 28px;
}

.consult-form label {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.consult-form label span {
  color: #44546c;
  font-size: 13px;
  font-weight: 600;
}

.consult-form input {
  min-height: 50px;
  padding: 0 16px;
  border-radius: 16px;
  border: 1px solid rgba(205, 219, 248, 0.9);
  background: #ffffff;
}

.consult-form__submit {
  min-width: 0;
  width: fit-content;
  margin-top: 10px;
}

.consult-visual {
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.consult-visual__card {
  position: relative;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  width: 100%;
  min-height: 360px;
  padding-bottom: 18px;
  border-radius: 28px;
  background:
    radial-gradient(circle at top center, rgba(16, 94, 255, 0.18), transparent 40%),
    linear-gradient(180deg, #f6f9ff 0%, #e8f0ff 100%);
  overflow: hidden;
}

.consult-visual__halo {
  position: absolute;
  top: 28px;
  width: 180px;
  height: 180px;
  border-radius: 50%;
  background: rgba(16, 94, 255, 0.12);
  filter: blur(8px);
}

.consult-avatar {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 1;
}

.consult-avatar__head {
  width: 88px;
  height: 88px;
  border-radius: 50%;
  background: linear-gradient(180deg, #f1c39b 0%, #d89f76 100%);
  box-shadow: 0 8px 22px rgba(92, 102, 135, 0.18);
}

.consult-avatar__body {
  width: 178px;
  height: 188px;
  margin-top: -14px;
  border-radius: 92px 92px 24px 24px;
  background: linear-gradient(180deg, #1d3f78 0%, #0f1e3b 100%);
}

.consult-visual__badge {
  position: absolute;
  bottom: 24px;
  padding: 0 16px;
  min-height: 38px;
  border-radius: 999px;
  background: rgba(16, 94, 255, 0.94);
  color: #ffffff;
  font-size: 13px;
  font-weight: 700;
  line-height: 38px;
}

.cta-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 28px;
  margin-top: 108px;
  margin-bottom: 44px;
  padding: 42px 46px;
  border-radius: 28px;
  background: linear-gradient(135deg, #1762ff 0%, #208dff 100%);
  color: #ffffff;
  box-shadow: 0 24px 60px rgba(17, 97, 255, 0.26);
}

.cta-card h2 {
  margin-top: 18px;
  font-size: clamp(28px, 3vw, 40px);
  line-height: 1.25;
  letter-spacing: -0.03em;
}

.section-heading__eyebrow--light {
  color: #ffffff;
  background: rgba(255, 255, 255, 0.18);
}

.cta-btn {
  color: #0f172a;
  background: #ffffff;
}

.cta-btn--ghost {
  color: #ffffff;
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.22);
}

.floating-help {
  position: fixed;
  right: 22px;
  bottom: 22px;
  z-index: 40;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 46px;
  height: 46px;
  border-radius: 50%;
  background: linear-gradient(135deg, #1762ff 0%, #1a86ff 100%);
  color: #ffffff;
  font-size: 16px;
  font-weight: 700;
  box-shadow: 0 18px 34px rgba(16, 94, 255, 0.26);
}

@media (max-width: 1120px) {
  .hero-layout,
  .feature-row,
  .feature-row--reverse,
  .industry-grid,
  .trust-grid,
  .news-grid,
  .consult-card,
  .cta-card {
    grid-template-columns: 1fr;
  }

  .hero-scene {
    min-height: 500px;
  }

  .feature-row--reverse .feature-copy-card,
  .feature-row--reverse .feature-visual-card {
    order: initial;
  }

  .industry-grid,
  .trust-grid,
  .news-grid {
    display: grid;
  }

  .cta-card {
    display: grid;
  }
}

@media (max-width: 900px) {
  .section-shell {
    width: min(100% - 32px, 1180px);
  }

  .hero-copy {
    padding: 28px 0 0;
  }

  .scene-window--front,
  .scene-window--back {
    width: min(100%, 100%);
    right: 0;
  }

  .scene-window--back {
    width: 82%;
    right: 20px;
  }

  .phone-float {
    right: 24px;
  }

  .overview-card,
  .consult-card {
    grid-template-columns: 1fr;
  }

  .workspace-board,
  .mockup-grid,
  .mockup-team__body {
    grid-template-columns: 54px 1fr;
  }

  .workspace-board__list,
  .mockup-panel--list,
  .mockup-team__column {
    display: none;
  }

  .consult-form {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 720px) {
  .hero-section {
    padding-top: 18px;
  }

  .hero-title {
    font-size: 38px;
  }

  .hero-desc,
  .section-heading p,
  .feature-copy-card p,
  .trust-card p,
  .news-card__body p,
  .consult-copy p {
    font-size: 14px;
  }

  .hero-scene {
    min-height: 440px;
  }

  .scene-window--front {
    height: 296px;
  }

  .phone-float {
    top: 128px;
    width: 148px;
  }

  .hero-brands {
    justify-content: center;
  }

  .overview-section,
  .feature-section,
  .trust-section,
  .faq-section,
  .news-section,
  .consult-section,
  .cta-section,
  .industry-section {
    padding-top: 76px;
  }

  .industry-section {
    padding-bottom: 82px;
  }

  .feature-copy-card,
  .feature-visual-card,
  .industry-card,
  .trust-card,
  .news-card,
  .consult-card {
    border-radius: 24px;
  }

  .feature-copy-card h3,
  .industry-card__head h3 {
    font-size: 24px;
  }

  .trust-grid,
  .news-grid,
  .industry-grid {
    gap: 16px;
  }

  .cta-card {
    margin-top: 76px;
    padding: 34px 28px;
  }

  .cta-actions {
    width: 100%;
  }

  .cta-btn {
    flex: 1;
  }

  .floating-help {
    right: 16px;
    bottom: 16px;
  }
}
</style>
