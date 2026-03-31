<template>
  <section class="agent-content-page agent-content-page--hide-scrollbar home-page">
    <header class="home-page__header">
      <h1 class="home-page__title">欢迎回来，Jeson! 👋</h1>
    </header>

    <section class="home-hero agent-panel">
      <div class="home-hero__copy">
        <div class="home-hero__eyebrow">体验访客端</div>
        <p class="home-hero__description">打开访客对话窗口，像真实客户一样发送消息，体验客户是如何找到你的。</p>
        <div class="home-hero__actions">
          <button type="button" class="agent-btn agent-btn--primary home-hero__cta" @click="openCustomerPreview">聊天页面</button>
        </div>
      </div>

      <div class="home-hero__preview" aria-hidden="true">
        <div class="hero-widget">
          <div class="hero-widget__bubble">
            <span class="hero-widget__avatar">J</span>
            <span class="hero-widget__bubble-text">我的订单一直没收到…</span>
          </div>
          <div class="hero-widget__panel">
            <div class="hero-widget__line hero-widget__line--short" />
            <div class="hero-widget__line" />
            <div class="hero-widget__actions">
              <span class="hero-widget__action" />
              <span class="hero-widget__action" />
              <span class="hero-widget__action" />
              <span class="hero-widget__send" />
            </div>
            <div class="hero-widget__brand">Powered by Tidio</div>
          </div>
        </div>
      </div>
    </section>

    <div class="home-grid">
      <div class="home-main">
        <section class="home-section">
          <div class="home-section__title-row">
            <h2 class="home-section__title">成员概览</h2>
          </div>
          <div class="home-summary-card agent-panel">
            <article v-for="item in serviceOverview" :key="item.key" class="home-summary-card__item">
              <div class="home-summary-card__label-row">
                <span v-if="item.dotColor" class="home-summary-card__dot" :style="{ backgroundColor: item.dotColor }" />
                <span class="home-summary-card__label">{{ item.label }}</span>
              </div>
              <div class="home-summary-card__value-row">
                <span class="home-summary-card__value">{{ item.value }}</span>
                <button
                  v-if="item.actionLabel && item.actionRoute"
                  type="button"
                  class="home-summary-card__action"
                  @click="openRoute(item.actionRoute)"
                >
                  {{ item.actionLabel }}
                </button>
              </div>
            </article>
          </div>
        </section>

        <section class="home-section">
          <div class="home-section__title-row">
            <h2 class="home-section__title">实时会话</h2>
          </div>
          <div class="home-summary-card agent-panel">
            <article v-for="item in realtimeConversationStats" :key="item.key" class="home-summary-card__item">
              <div class="home-summary-card__label-row">
                <span class="home-summary-card__label">{{ item.label }}</span>
              </div>
              <div class="home-summary-card__value-row">
                <span class="home-summary-card__value">{{ item.value }}</span>
              </div>
            </article>
          </div>
        </section>

        <section class="home-section">
          <div class="home-section__title-row home-section__title-row--with-hint">
            <div class="home-section__heading">
              <h2 class="home-section__title">成员概览</h2>
              <span class="home-section__hint">i</span>
            </div>
          </div>

          <section class="home-chart-card agent-panel">
            <div class="home-chart-card__stats">
              <article
                v-for="(item, index) in conversationOverview"
                :key="item.key"
                class="home-chart-card__stat"
                :class="{ 'home-chart-card__stat--active': index === 0 }"
              >
                <p class="home-chart-card__stat-label">{{ item.label }}</p>
                <p class="home-chart-card__stat-value">
                  <span>{{ item.value }}</span>
                  <small v-if="item.unit">{{ item.unit }}</small>
                </p>
              </article>
            </div>

            <div class="home-chart">
              <div class="home-chart__y-labels">
                <span
                  v-for="tick in chartYTicks"
                  :key="tick.label"
                  class="home-chart__y-label"
                  :style="{ bottom: `${((chartHeight - chartPadding.bottom - tick.y) / (chartHeight - chartPadding.top - chartPadding.bottom)) * 100}%` }"
                >
                  {{ tick.label }}
                </span>
              </div>
              <svg class="home-chart__svg" :viewBox="`0 0 ${chartWidth} ${chartHeight}`" preserveAspectRatio="none" aria-hidden="true">
                <line
                  v-for="tick in chartYTicks"
                  :key="'grid-' + tick.label"
                  class="home-chart__grid"
                  :x1="chartPadding.left"
                  :y1="tick.y"
                  :x2="chartWidth - chartPadding.right"
                  :y2="tick.y"
                />
                <line
                  class="home-chart__axis"
                  :x1="chartPadding.left"
                  :y1="chartPadding.top"
                  :x2="chartPadding.left"
                  :y2="chartHeight - chartPadding.bottom"
                />
                <line
                  class="home-chart__axis"
                  :x1="chartPadding.left"
                  :y1="chartHeight - chartPadding.bottom"
                  :x2="chartWidth - chartPadding.right"
                  :y2="chartHeight - chartPadding.bottom"
                />
                <line
                  v-if="chartLastPoint"
                  class="home-chart__guide"
                  :x1="chartLastPoint.x"
                  :y1="chartPadding.top + 18"
                  :x2="chartLastPoint.x"
                  :y2="chartHeight - chartPadding.bottom"
                />
                <polyline class="home-chart__line" :points="chartPolyline" />
                <circle
                  v-if="chartLastPoint"
                  class="home-chart__point"
                  :cx="chartLastPoint.x"
                  :cy="chartLastPoint.y"
                  r="4.5"
                />
              </svg>
              <div class="home-chart__labels" :style="{ gridTemplateColumns: `repeat(${chartAxisLabels.length}, minmax(0, 1fr))` }">
                <span
                  v-for="(item, index) in chartAxisLabels"
                  :key="item.label"
                  class="home-chart__label"
                  :class="{
                    'home-chart__label--start': index === 0,
                    'home-chart__label--end': index === chartAxisLabels.length - 1
                  }"
                >
                  {{ item.label }}
                </span>
              </div>
            </div>
          </section>
        </section>

        <section class="home-section">
          <div class="home-section__title-row home-section__title-row--with-hint">
            <div class="home-section__heading">
              <h2 class="home-section__title">Autopilot 概览</h2>
              <span class="home-section__hint" title="近7日 Autopilot 会话数据概览">i</span>
            </div>
          </div>

          <section class="home-chart-card agent-panel">
            <div class="home-chart-card__stats">
              <button
                v-for="(item, index) in aiAgentOverview"
                :key="item.key"
                type="button"
                class="home-chart-card__stat home-chart-card__stat--clickable"
                :class="{ 'home-chart-card__stat--active': activeAiTab === index }"
                @click="activeAiTab = index"
              >
                <p class="home-chart-card__stat-label">{{ item.label }}</p>
                <p class="home-chart-card__stat-value">
                  <span>{{ item.value }}</span>
                  <small v-if="item.unit">{{ item.unit }}</small>
                </p>
              </button>
            </div>

            <div class="home-chart">
              <div class="home-chart__y-labels">
                <span
                  v-for="tick in aiChartYTicks"
                  :key="tick.label"
                  class="home-chart__y-label"
                  :style="{ bottom: `${((chartHeight - chartPadding.bottom - tick.y) / (chartHeight - chartPadding.top - chartPadding.bottom)) * 100}%` }"
                >
                  {{ tick.label }}
                </span>
              </div>
              <svg class="home-chart__svg" :viewBox="`0 0 ${chartWidth} ${chartHeight}`" preserveAspectRatio="none" aria-hidden="true">
                <line
                  v-for="tick in aiChartYTicks"
                  :key="'ai-grid-' + tick.label"
                  class="home-chart__grid"
                  :x1="chartPadding.left"
                  :y1="tick.y"
                  :x2="chartWidth - chartPadding.right"
                  :y2="tick.y"
                />
                <line
                  class="home-chart__axis"
                  :x1="chartPadding.left"
                  :y1="chartPadding.top"
                  :x2="chartPadding.left"
                  :y2="chartHeight - chartPadding.bottom"
                />
                <line
                  class="home-chart__axis"
                  :x1="chartPadding.left"
                  :y1="chartHeight - chartPadding.bottom"
                  :x2="chartWidth - chartPadding.right"
                  :y2="chartHeight - chartPadding.bottom"
                />
                <line
                  v-if="aiChartLastPoint"
                  class="home-chart__guide"
                  :x1="aiChartLastPoint.x"
                  :y1="chartPadding.top + 18"
                  :x2="aiChartLastPoint.x"
                  :y2="chartHeight - chartPadding.bottom"
                />
                <polyline class="home-chart__line home-chart__line--ai" :points="aiChartPolyline" />
                <circle
                  v-if="aiChartLastPoint"
                  class="home-chart__point home-chart__point--ai"
                  :cx="aiChartLastPoint.x"
                  :cy="aiChartLastPoint.y"
                  r="4.5"
                />
              </svg>
              <div class="home-chart__labels" :style="{ gridTemplateColumns: `repeat(${chartAxisLabels.length}, minmax(0, 1fr))` }">
                <span
                  v-for="(item, index) in chartAxisLabels"
                  :key="item.label"
                  class="home-chart__label"
                  :class="{
                    'home-chart__label--start': index === 0,
                    'home-chart__label--end': index === chartAxisLabels.length - 1
                  }"
                >
                  {{ item.label }}
                </span>
              </div>
            </div>
          </section>
        </section>
      </div>

      <aside class="home-sidebar">
        <section class="home-section">
          <div class="home-section__title-row">
            <h2 class="home-section__title">常见问题</h2>
          </div>

          <section class="home-guide-card agent-panel">
            <div class="home-guide-card__visual" aria-hidden="true">
              <div class="home-guide-card__caption">All-in-One Customer Support</div>
              <div class="home-guide-card__screen">
                <div class="home-guide-card__window" />
                <div class="home-guide-card__window home-guide-card__window--small" />
                <div class="home-guide-card__play" />
              </div>
            </div>

            <div class="home-guide-card__list">
              <button
                v-for="item in guideItems"
                :key="item.key"
                type="button"
                class="home-guide-card__item"
                @click="item.route ? openRoute(item.route) : undefined"
              >
                <div class="home-guide-card__item-body">
                  <span class="home-guide-card__item-title">{{ item.title }}</span>
                  <span class="home-guide-card__item-desc">{{ item.description }}</span>
                </div>
                <AgentIcon v-if="item.showArrow" name="chevron-right" :size="14" />
              </button>
            </div>
          </section>
        </section>

        <section class="home-section">
          <div class="home-section__title-row">
            <h2 class="home-section__title">快捷入口</h2>
          </div>

          <div class="home-quick-grid">
            <button
              v-for="item in quickLinks"
              :key="item.key"
              type="button"
              class="home-quick-link agent-panel"
              :style="{
                '--quick-link-bg': item.bgColor,
                '--quick-link-color': item.color
              }"
              @click="openRoute(item.route)"
            >
              <span class="home-quick-link__icon">
                <AgentIcon :name="item.icon" :size="15" />
              </span>
              <span class="home-quick-link__label">{{ item.label }}</span>
            </button>
          </div>
        </section>
      </aside>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { AgentIcon } from "@twt/ui-agent";

interface SummaryItem {
  key: string;
  label: string;
  value: number;
  dotColor?: string;
  actionLabel?: string;
  actionRoute?: string;
}

interface ChartStatItem {
  key: string;
  label: string;
  value: number;
  unit?: string;
}

interface GuideItem {
  key: string;
  title: string;
  description: string;
  route?: string;
  showArrow?: boolean;
}

interface QuickLinkItem {
  key: string;
  label: string;
  icon: string;
  route: string;
  bgColor: string;
  color: string;
}

const router = useRouter();

const openRoute = (path: string) => {
  router.push(path);
};

const resolveCustomerPreviewUrl = () => {
  if (typeof window === "undefined") {
    return "/web-customer/";
  }

  const currentUrl = new URL(window.location.href);
  const isLocalHost = ["localhost", "127.0.0.1"].includes(currentUrl.hostname);

  if (isLocalHost && currentUrl.port) {
    const currentPort = Number(currentUrl.port);

    if (!Number.isNaN(currentPort)) {
      currentUrl.port = String(currentPort + 1);
      currentUrl.pathname = "/";
      currentUrl.search = "";
      currentUrl.hash = "";
      return currentUrl.toString();
    }
  }

  currentUrl.pathname = currentUrl.pathname.replace(/^\/web-agent(?:\/.*)?$/, "/web-customer/");

  if (!currentUrl.pathname.startsWith("/web-customer")) {
    currentUrl.pathname = "/web-customer/";
  }

  currentUrl.search = "";
  currentUrl.hash = "";
  return currentUrl.toString();
};

const openCustomerPreview = () => {
  window.open(resolveCustomerPreviewUrl(), "_blank", "noopener,noreferrer");
};

const serviceOverview: SummaryItem[] = [
  { key: "online", label: "在线", value: 1, dotColor: "#43c568" },
  { key: "away", label: "离开", value: 2, dotColor: "#ff5b57" },
  { key: "offline", label: "离线", value: 1, dotColor: "#c3cad7" },
  { key: "total", label: "总计", value: 4, actionLabel: "邀请成员", actionRoute: "/settings" }
];

const realtimeConversationStats: SummaryItem[] = [
  { key: "pending-reply", label: "待回复会话", value: 5 },
  { key: "queueing", label: "排队中会话", value: 3 },
  { key: "pending-process", label: "待处理会话", value: 1 },
  { key: "replied", label: "已回复会话", value: 4 }
];

const conversationOverview: ChartStatItem[] = [
  { key: "total", label: "会话总数", value: 3 },
  { key: "response", label: "平均响应时间", value: 2, unit: "分钟" },
  { key: "duration", label: "平均会话时长", value: 2, unit: "分钟" }
];

const guideItems: GuideItem[] = [
  { key: 'create-chat', title: '如何创建单聊/群聊？', description: '支持创建1v1单聊和建群沟通' },
  { key: 'session-assign', title: '会话为什么无法自动分配？', description: '检查客服在线状态和接待上限' },
  { key: 'seat', title: '坐席是什么意思？', description: '需要在工作台接待访客的工作人员' },
  { key: 'visitor-connect', title: '怎么和访客进行互通？', description: '分享聊天地址或安装网站小部件' },
  { key: 'notification', title: '如何开启访客进入提醒？', description: '在通知设置中管理各类提醒' },
  { key: 'knowledge-base', title: '知识库如何使用？', description: '录入知识让AI自动学习和回复' }
];

const quickLinks: QuickLinkItem[] = [
  { key: "files", label: "档案", icon: "files", route: "/files", bgColor: "rgba(255, 128, 26, 0.12)", color: "#ff801a" },
  { key: "knowledge", label: "知识库", icon: "book", route: "/ai-agent", bgColor: "rgba(16, 94, 255, 0.12)", color: "#105eff" },
  { key: "campaign", label: "群发消息", icon: "campaign", route: "/campaign", bgColor: "rgba(42, 178, 96, 0.12)", color: "#2ab260" },
  { key: "service", label: "成员", icon: "service", route: "/settings", bgColor: "rgba(103, 109, 255, 0.12)", color: "#676dff" },
];

const chartLabels = ["12-19", "12-20", "12-21", "12-22", "12-23", "12-24", "12-25"];
const chartValues = [0, 0, 0, 0, 0, 0, 78];
const chartWidth = 720;
const chartHeight = 252;
const chartPadding = {
  top: 10,
  right: 18,
  bottom: 30,
  left: 44
};

const yTickCount = 4;

function generateYTicks(values: number[]) {
  const maxValue = Math.max(...values, 1);
  const usableHeight = chartHeight - chartPadding.top - chartPadding.bottom;
  const ticks: { label: string; y: number }[] = [];
  for (let i = 0; i <= yTickCount; i++) {
    const value = Math.round((maxValue / yTickCount) * i);
    const y = chartPadding.top + usableHeight - (i / yTickCount) * usableHeight;
    ticks.push({ label: String(value), y });
  }
  return ticks;
}

const chartYTicks = computed(() => generateYTicks(chartValues));

const chartPoints = computed(() => {
  const maxValue = Math.max(...chartValues, 1);
  const usableWidth = chartWidth - chartPadding.left - chartPadding.right;
  const usableHeight = chartHeight - chartPadding.top - chartPadding.bottom;

  return chartValues.map((value, index) => {
    const x = chartPadding.left + (usableWidth / (chartValues.length - 1)) * index;
    const y = chartPadding.top + usableHeight - (value / maxValue) * usableHeight;
    return { x, y };
  });
});

const chartPolyline = computed(() => chartPoints.value.map((point) => `${point.x},${point.y}`).join(" "));
const chartLastPoint = computed(() => chartPoints.value[chartPoints.value.length - 1]);
const chartAxisLabels = chartLabels.map((label) => ({ label }));

const activeAiTab = ref(0);

const aiAgentOverview: ChartStatItem[] = [
  { key: "total", label: "总会话数", value: 126 },
  { key: "resolved", label: "解决率", value: 77.8, unit: "%" },
  { key: "transfer", label: "转人工", value: 28 }
];

const aiChartDataSets = [
  [12, 18, 22, 15, 28, 35, 126],
  [66.7, 77.8, 77.3, 73.3, 78.6, 80.0, 77.8],
  [4, 4, 5, 4, 6, 7, 28]
];

const aiChartPoints = computed(() => {
  const values = aiChartDataSets[activeAiTab.value];
  const maxValue = Math.max(...values, 1);
  const usableWidth = chartWidth - chartPadding.left - chartPadding.right;
  const usableHeight = chartHeight - chartPadding.top - chartPadding.bottom;

  return values.map((value, index) => {
    const x = chartPadding.left + (usableWidth / (values.length - 1)) * index;
    const y = chartPadding.top + usableHeight - (value / maxValue) * usableHeight;
    return { x, y };
  });
});

const aiChartPolyline = computed(() => aiChartPoints.value.map((point) => `${point.x},${point.y}`).join(" "));
const aiChartLastPoint = computed(() => aiChartPoints.value[aiChartPoints.value.length - 1]);
const aiChartYTicks = computed(() => generateYTicks(aiChartDataSets[activeAiTab.value]));
</script>

<style scoped>
.home-page {
  gap: 12px;
}

.home-page__header {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.home-page__title {
  color: #2a2a2a;
  font-size: 16px;
  font-weight: 600;
  line-height: 1.4;
  margin: 0;
}

.home-hero {
  background:
    linear-gradient(105deg, rgba(243, 246, 250, 0.96) 0%, rgba(235, 241, 248, 0.98) 54%, rgba(225, 238, 250, 0.98) 100%),
    linear-gradient(180deg, #ffffff 0%, #f7f9fc 100%);
  align-items: center;
  display: grid;
  gap: 24px;
  grid-template-columns: minmax(0, 1fr) minmax(220px, 296px);
  isolation: isolate;
  min-height: 154px;
  overflow: hidden;
  padding: 18px 24px;
  position: relative;
}

.home-hero::before {
  background: radial-gradient(circle at center, rgba(117, 172, 255, 0.22) 0%, rgba(117, 172, 255, 0) 70%);
  content: "";
  height: 220px;
  pointer-events: none;
  position: absolute;
  right: -60px;
  top: -72px;
  width: 320px;
  z-index: 0;
}

.home-hero::after {
  background: linear-gradient(120deg, rgba(255, 255, 255, 0) 34%, rgba(255, 255, 255, 0.75) 48%, rgba(255, 255, 255, 0) 65%);
  content: "";
  inset: 0;
  pointer-events: none;
  position: absolute;
  z-index: 0;
}

.home-hero__copy,
.home-hero__preview {
  position: relative;
}

.home-hero__copy {
  display: flex;
  flex-direction: column;
  gap: 10px;
  justify-content: center;
  min-width: 0;
  padding-right: 8px;
  z-index: 2;
}

.home-hero__eyebrow {
  color: #31353d;
  font-size: 13px;
  font-weight: 600;
  line-height: 1.4;
}

.home-hero__description {
  color: #7b8798;
  font-size: 12px;
  line-height: 1.6;
  margin: 0;
  max-width: 560px;
}

.home-hero__actions {
  align-items: center;
  display: inline-flex;
  gap: 6px;
}

.home-hero__cta {
  min-width: 78px;
  padding: 9px 14px;
}

.home-hero__preview {
  align-items: center;
  display: flex;
  justify-content: flex-end;
  min-width: 0;
  z-index: 1;
}

.hero-widget {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
  width: min(296px, 100%);
}

.hero-widget__bubble {
  align-items: center;
  align-self: flex-start;
  background: rgba(255, 255, 255, 0.96);
  border: 1px solid rgba(224, 230, 239, 0.95);
  border-radius: 999px;
  box-shadow: 0 10px 30px rgba(64, 100, 164, 0.08);
  color: #566375;
  display: inline-flex;
  gap: 8px;
  padding: 5px 10px 5px 7px;
}

.hero-widget__avatar {
  align-items: center;
  background: linear-gradient(135deg, #a45a3a 0%, #e1b494 100%);
  border-radius: 50%;
  color: #ffffff;
  display: inline-flex;
  font-size: 10px;
  font-weight: 600;
  height: 20px;
  justify-content: center;
  width: 20px;
}

.hero-widget__bubble-text {
  font-size: 10px;
  line-height: 1.2;
  white-space: nowrap;
}

.hero-widget__panel {
  align-self: flex-end;
  backdrop-filter: blur(6px);
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(227, 232, 240, 0.95);
  border-radius: 16px;
  box-shadow: 0 14px 36px rgba(84, 116, 170, 0.12);
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-height: 72px;
  padding: 12px 12px 9px;
  width: 154px;
}

.hero-widget__line {
  background: linear-gradient(90deg, #eceff4 0%, #f5f7fb 100%);
  border-radius: 999px;
  height: 7px;
  width: 100%;
}

.hero-widget__line--short {
  width: 56%;
}

.hero-widget__actions {
  align-items: center;
  display: flex;
  gap: 6px;
  margin-top: 1px;
}

.hero-widget__action,
.hero-widget__send {
  border-radius: 50%;
  display: inline-flex;
  height: 10px;
  width: 10px;
}

.hero-widget__action {
  background: #d6dce6;
}

.hero-widget__send {
  background: linear-gradient(135deg, #2f6bff 0%, #6f9fff 100%);
  margin-left: auto;
}

.hero-widget__brand {
  color: #a0acbd;
  font-size: 7px;
  text-align: center;
}

.home-grid {
  display: grid;
  gap: 12px;
  grid-template-columns: minmax(0, 1fr) 224px;
}

.home-main,
.home-sidebar {
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 0;
}

.home-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.home-section__title-row {
  align-items: center;
  display: flex;
  justify-content: space-between;
}

.home-section__title-row--with-hint {
  justify-content: flex-start;
}

.home-section__heading {
  align-items: center;
  display: inline-flex;
  gap: 6px;
}

.home-section__title {
  color: #2b2f36;
  font-size: 14px;
  font-weight: 600;
  line-height: 1.4;
  margin: 0;
}

.home-section__hint {
  align-items: center;
  border: 1px solid #cbd5e1;
  border-radius: 50%;
  color: #94a3b8;
  display: inline-flex;
  font-size: 10px;
  font-weight: 600;
  height: 14px;
  justify-content: center;
  line-height: 1;
  width: 14px;
}

.home-summary-card {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  overflow: hidden;
}

.home-summary-card__item {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-height: 72px;
  padding: 16px 18px;
  position: relative;
}

.home-summary-card__item:not(:last-child)::after {
  background: var(--agent-color-border-default);
  content: "";
  inset: 16px 0 16px auto;
  position: absolute;
  width: 1px;
}

.home-summary-card__label-row {
  align-items: center;
  display: inline-flex;
  gap: 6px;
}

.home-summary-card__dot {
  border-radius: 50%;
  display: inline-flex;
  height: 6px;
  width: 6px;
}

.home-summary-card__label {
  color: #515a69;
  font-size: 12px;
  line-height: 1.3;
}

.home-summary-card__value-row {
  align-items: baseline;
  display: inline-flex;
  gap: 10px;
}

.home-summary-card__value {
  color: #2b2f36;
  font-size: 18px;
  font-weight: 600;
  line-height: 1;
}

.home-summary-card__action {
  background: #eff4ff;
  border: 1px solid rgba(47, 107, 255, 0.2);
  border-radius: 999px;
  color: #2f6bff;
  cursor: pointer;
  font-size: 11px;
  line-height: 1;
  padding: 4px 8px;
}

.home-chart-card {
  overflow: hidden;
}

.home-chart-card__stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.home-chart-card__stat {
  border-bottom: 1px solid var(--agent-color-border-default);
  min-height: 76px;
  padding: 16px 18px;
  position: relative;
}

.home-chart-card__stat--clickable {
  background: #ffffff;
  border: 0;
  border-bottom: 1px solid var(--agent-color-border-default);
  cursor: pointer;
  text-align: left;
  transition: background-color var(--agent-motion-fast);
}

.home-chart-card__stat--clickable:hover {
  background: var(--agent-color-bg-muted);
}

.home-chart-card__stat:not(:last-child) {
  border-right: 1px solid var(--agent-color-border-default);
}

.home-chart-card__stat--active::before {
  background: #2f6bff;
  content: "";
  height: 2px;
  left: 0;
  position: absolute;
  right: 0;
  top: 0;
}

.home-chart-card__stat-label {
  color: #586475;
  font-size: 12px;
  line-height: 1.3;
  margin: 0 0 10px;
}

.home-chart-card__stat-value {
  align-items: baseline;
  color: #2b2f36;
  display: inline-flex;
  font-size: 16px;
  font-weight: 600;
  gap: 4px;
  line-height: 1;
  margin: 0;
}

.home-chart-card__stat-value small {
  color: #8b97a8;
  font-size: 12px;
  font-weight: 400;
}

.home-chart {
  min-height: 248px;
  padding: 12px 18px 36px 0;
  position: relative;
}

.home-chart__y-labels {
  bottom: 36px;
  display: flex;
  flex-direction: column;
  left: 0;
  position: absolute;
  top: 12px;
  width: 44px;
}

.home-chart__y-label {
  color: #99a3b3;
  font-size: 11px;
  left: 0;
  line-height: 1;
  position: absolute;
  text-align: right;
  transform: translateY(50%);
  width: 38px;
}

.home-chart__svg {
  display: block;
  height: 212px;
  margin-left: 44px;
  width: calc(100% - 44px);
}

.home-chart__grid {
  stroke: #f0f2f5;
  stroke-dasharray: 3 3;
  stroke-width: 1;
}

.home-chart__axis {
  stroke: #dfe5ee;
  stroke-width: 1;
}

.home-chart__guide {
  stroke: #e3e8f0;
  stroke-width: 1;
}

.home-chart__line {
  fill: none;
  stroke: #2f6bff;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 2;
}

.home-chart__point {
  fill: #2f6bff;
}

.home-chart__line--ai {
  stroke: #00b578;
}

.home-chart__point--ai {
  fill: #00b578;
}

.home-chart__labels {
  bottom: 12px;
  display: grid;
  gap: 4px;
  left: 44px;
  position: absolute;
  right: 18px;
}

.home-chart__label {
  color: #99a3b3;
  font-size: 11px;
  overflow: hidden;
  text-align: center;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.home-chart__label--start {
  text-align: left;
}

.home-chart__label--end {
  text-align: right;
}

.home-guide-card {
  overflow: hidden;
}

.home-guide-card__visual {
  background: linear-gradient(140deg, #eef5ff 0%, #dfeeff 55%, #f4f8ff 100%);
  border-bottom: 1px solid var(--agent-color-border-default);
  min-height: 110px;
  padding: 14px;
  position: relative;
}

.home-guide-card__visual::before,
.home-guide-card__visual::after {
  background: rgba(47, 107, 255, 0.12);
  border-radius: 999px;
  content: "";
  position: absolute;
}

.home-guide-card__visual::before {
  height: 72px;
  right: -18px;
  top: -24px;
  width: 120px;
}

.home-guide-card__visual::after {
  height: 88px;
  left: -28px;
  top: 44px;
  width: 132px;
}

.home-guide-card__caption {
  color: #3f5f9a;
  font-size: 12px;
  font-style: italic;
  font-weight: 600;
  position: relative;
  text-align: center;
  z-index: 1;
}

.home-guide-card__screen {
  align-items: center;
  display: flex;
  justify-content: center;
  margin-top: 12px;
  position: relative;
  z-index: 1;
}

.home-guide-card__window {
  background: rgba(255, 255, 255, 0.94);
  border: 1px solid rgba(210, 221, 238, 0.92);
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(77, 112, 177, 0.12);
  height: 44px;
  width: 96px;
}

.home-guide-card__window--small {
  height: 36px;
  margin-left: -18px;
  margin-top: 22px;
  width: 62px;
}

.home-guide-card__play {
  background: linear-gradient(135deg, #2f6bff 0%, #7fa8ff 100%);
  border-radius: 50%;
  box-shadow: 0 10px 28px rgba(47, 107, 255, 0.26);
  height: 34px;
  margin-left: -68px;
  position: relative;
  width: 34px;
}

.home-guide-card__play::before {
  border-color: transparent transparent transparent #ffffff;
  border-style: solid;
  border-width: 6px 0 6px 9px;
  content: "";
  left: 13px;
  position: absolute;
  top: 11px;
}

.home-guide-card__list {
  display: flex;
  flex-direction: column;
}

.home-guide-card__item {
  align-items: center;
  background: #ffffff;
  border: 0;
  cursor: pointer;
  display: flex;
  gap: 10px;
  justify-content: space-between;
  min-height: 50px;
  padding: 12px 14px;
  text-align: left;
}

.home-guide-card__item:not(:last-child) {
  border-bottom: 1px solid var(--agent-color-border-default);
}

.home-guide-card__item-body {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.home-guide-card__item-title {
  color: #2b2f36;
  font-size: 13px;
  line-height: 1.3;
}

.home-guide-card__item-desc {
  color: #8b97a8;
  font-size: 12px;
  line-height: 1.45;
}

.home-quick-grid {
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.home-quick-link {
  align-items: center;
  cursor: pointer;
  display: inline-flex;
  gap: 8px;
  min-height: 54px;
  padding: 10px 12px;
  text-align: left;
}

.home-quick-link__icon {
  align-items: center;
  background: var(--quick-link-bg);
  border-radius: 50%;
  color: var(--quick-link-color);
  display: inline-flex;
  flex-shrink: 0;
  height: 32px;
  justify-content: center;
  width: 32px;
}

.home-quick-link__label {
  color: #2b2f36;
  font-size: 13px;
  line-height: 1.3;
}

@media (max-width: 1200px) {
  .home-grid {
    grid-template-columns: 1fr;
  }

  .home-sidebar {
    display: grid;
    gap: 12px;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  }
}

@media (max-width: 1120px) {
  .home-hero {
    gap: 16px;
    grid-template-columns: 1fr;
  }

  .home-hero__copy {
    padding-right: 0;
  }

  .home-hero__preview {
    justify-content: flex-start;
  }
}

@media (max-width: 960px) {

  .home-summary-card,
  .home-chart-card__stats {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 720px) {
  .home-page {
    padding: 16px;
  }

  .home-sidebar {
    grid-template-columns: 1fr;
  }

  .home-summary-card,
  .home-chart-card__stats,
  .home-quick-grid {
    grid-template-columns: 1fr;
  }

  .home-summary-card__item:not(:last-child)::after {
    display: none;
  }

  .home-summary-card__item:not(:last-child),
  .home-chart-card__stat:not(:last-child) {
    border-bottom: 1px solid var(--agent-color-border-default);
  }

  .home-chart-card__stat:not(:last-child) {
    border-right: 0;
  }
}
</style>
