<template>
  <AgentAppShell :show-detail="isConversationRoute">
    <template #nav-rail>
      <PrimaryNavRail :active-key="activeMainNav" :items="mainNavItems" @select="handleMainNavSelect">
        <template #brand>
          <button type="button" class="brand-mark" aria-label="TWT 品牌">T</button>
        </template>
        <template #footer>
          <div class="rail-footer">
            <button type="button" class="rail-footer__icon" aria-label="帮助中心">
              <AgentIcon name="help" :size="16" />
            </button>
            <button type="button" class="rail-footer__icon" aria-label="设置" @click="openSettingsPage">
              <AgentIcon name="settings" :size="16" />
            </button>
            <button type="button" class="rail-footer__profile" aria-label="当前客服账号" />
          </div>
        </template>
      </PrimaryNavRail>
    </template>

    <template #sub-nav>
      <SessionQueueNav
        v-if="isConversationRoute"
        title="会话"
        :active-key="activeQueueKey"
        :groups="queueGroups"
        @select="handleQueueSelect"
      />
      <AiSettingsNav
        v-else-if="isAiAgentRoute"
        title="AI Agent"
        :active-key="activeAiNavKey"
        :groups="aiNavGroups"
        @select="handleAiNavSelect"
      />
      <AiSettingsNav
        v-else-if="isSettingsRoute"
        title="设置"
        variant="settings"
        :active-key="activeSettingsNavKey"
        :groups="settingsNavGroups"
        @select="handleSettingsNavSelect"
      />
      <AiSettingsNav
        v-else-if="isCampaignRoute"
        title="营销"
        :active-key="activeCampaignNavKey"
        :groups="campaignNavGroups"
        @select="handleCampaignNavSelect"
      />
      <section v-else class="module-subnav">
        <h2 class="module-subnav__title">{{ currentModuleLabel }}</h2>
        <p class="module-subnav__hint">模块导航开发中</p>
      </section>
    </template>

    <section v-if="isConversationRoute" class="session-page">
      <aside class="inbox-pane agent-panel">
        <header class="inbox-pane__header">
          <div class="inbox-pane__title-row">
            <button type="button" class="inbox-pane__back" aria-label="返回">‹</button>
            <h1 class="inbox-pane__title">👋 {{ activeQueueLabel }}</h1>
          </div>

          <div class="inbox-pane__search-row">
            <div class="inbox-pane__search-box">
              <input v-model="searchKeyword" class="agent-input inbox-pane__search-input" placeholder="搜索会话" />
              <button type="button" class="inbox-pane__search-icon-btn" aria-label="筛选">
                <AgentIcon name="filter" :size="14" />
              </button>
            </div>
          </div>

          <div class="inbox-pane__filter-row">
            <div class="inbox-pane__chips">
              <button type="button" class="filter-chip filter-chip--active">全部 {{ getFilterCount() }}</button>
            </div>
            <button type="button" class="inbox-pane__filter-icon-btn" aria-label="筛选">
              <AgentIcon name="filter" :size="14" />
            </button>
          </div>
        </header>

        <div class="inbox-pane__list agent-scroll">
          <SessionListItem
            v-for="item in visibleSessions"
            :key="item.id"
            :active="item.id === activeSessionId"
            :avatar-color="item.avatarColor"
            :avatar-text="item.avatarText"
            :customer-name="item.customerName"
            :preview="item.preview"
            :tag="item.tag"
            :unread-count="item.unreadCount"
            :updated-at="item.updatedAt"
            @click="activeSessionId = item.id"
          />
          <p v-if="visibleSessions.length === 0" class="inbox-pane__empty">暂无符合条件的会话</p>
        </div>
      </aside>

      <section class="chat-pane agent-panel">
        <ConversationHeader
          class="chat-pane__header"
          :editable="true"
          :title="activeSessionTitle"
          :can-collaborate="canCollaborate"
          @close="showTopToast('会话已标记为结束')"
          @invite="handleOpenInvite"
          @transfer="handleOpenTransfer"
          @update:title="updateSessionTitle"
        />

        <div class="chat-pane__stream agent-scroll">
          <p class="chat-pane__start-time">开始时间 {{ activeSession?.startedAt ?? '--' }}</p>

          <MessageBubble
            v-for="message in activeMessages"
            :key="message.id"
            :avatar-color="getMessageAvatarColor(message.role)"
            :avatar-text="getMessageAvatarLabel(message.role)"
            :content="message.content"
            :role="message.role"
            :sender="message.sender"
            :time="message.time"
          />
        </div>

        <MessageComposer
          v-model="composerText"
          class="chat-pane__composer"
          :disabled="composerText.trim().length === 0"
          placeholder="发送消息输入 / 选择快捷回复"
          @attachment="showTopToast('附件功能开发中')"
          @emoji="showTopToast('表情面板开发中')"
          @quick-reply="showTopToast('快捷回复面板开发中')"
          @send="handleSend"
        />
      </section>
    </section>

    <template v-else-if="isSettingsRoute">
      <WidgetCustomizePage v-if="activeSettingsNavKey === 'customize'" @toast="showTopToast" />
      <SettingsRoutePage v-else :active-key="activeSettingsNavKey" @toast="showTopToast" />
    </template>
    <AiAgentRoutePage v-else-if="isAiAgentRoute" :active-key="activeAiNavKey" @toast="showTopToast" />
    <template v-else-if="isCampaignRoute">
      <CampaignRoutePage v-show="activeCampaignNavKey === 'campaign-chatting'" @toast="showTopToast" />
      <ProactiveCampaignRoutePage v-show="activeCampaignNavKey === 'campaign-proactive'" @toast="showTopToast" />
    </template>

    <section v-else class="agent-content-page module-page">
      <header class="agent-content-header">
        <h1 class="agent-content-title">{{ currentModuleLabel }}</h1>
        <p class="agent-content-subtitle">该模块页面开发中，已可通过左侧导航进行路由切换。</p>
      </header>
      <section class="module-placeholder agent-panel">
        <p>当前路径：{{ route.path }}</p>
      </section>
    </section>

    <template #detail-pane>
      <section v-if="isConversationRoute" class="detail-pane">
        <header class="detail-pane__topbar">
          <div class="detail-pane__tabs">
            <button
              v-for="tab in detailTabs"
              :key="tab.key"
              type="button"
              class="detail-pane__tab"
              :class="{ 'detail-pane__tab--active': activeDetailTab === tab.key }"
              @click="activeDetailTab = tab.key"
            >
              {{ tab.label }}
            </button>
          </div>
          <button type="button" class="detail-pane__dock-btn" aria-label="面板操作" />
        </header>
        <div class="detail-pane__content agent-scroll">
          <section v-for="section in activeInfoSections" :key="section.key" class="detail-section">
            <button type="button" class="detail-section__header" @click="toggleDetailSection(section.key)">
              <span class="detail-section__title">{{ section.title }}</span>
              <AgentIcon :name="isDetailSectionCollapsed(section.key) ? 'chevron-right' : 'chevron-down'" :size="14" />
            </button>

            <div v-show="!isDetailSectionCollapsed(section.key)" class="detail-section__body">
              <dl v-if="section.type === 'fields'" class="detail-section__fields">
                <div v-for="field in section.fields" :key="field.key" class="detail-section__field">
                  <dt>{{ field.label }}</dt>
                  <dd>{{ field.value }}</dd>
                </div>
              </dl>

              <div v-else-if="section.type === 'agents'" class="detail-section__agents">
                <div v-for="agent in section.agents" :key="agent.key" class="detail-agent-row">
                  <span class="detail-agent-row__avatar" :style="{ background: agent.avatarColor }">{{ agent.avatarText }}</span>
                  <span class="detail-agent-row__name">{{ agent.name }}</span>
                  <span v-if="agent.role === 'owner'" class="detail-agent-row__badge detail-agent-row__badge--owner">会话负责人</span>
                  <span class="detail-agent-row__count">{{ agent.messageCount }}</span>
                </div>
              </div>

              <button v-else-if="section.type === 'tags'" type="button" class="detail-section__add-tag">+</button>

              <ul v-else class="detail-section__timeline">
                <li v-for="item in section.timeline" :key="item.key" class="timeline-item">
                  <span class="timeline-item__dot" :class="item.dotClass ?? ''" />
                  <div class="timeline-item__main">
                    <p class="timeline-item__title">
                      <span>{{ item.label }}</span>
                      <a href="#" @click.prevent>{{ item.link }}</a>
                    </p>
                    <p class="timeline-item__meta">{{ item.time }}&nbsp;&nbsp;{{ item.duration }}</p>
                  </div>
                </li>
                <li v-if="section.moreText" class="timeline-item timeline-item--more">{{ section.moreText }}</li>
              </ul>
            </div>
          </section>
        </div>
      </section>
    </template>

    <TransferModal
      :open="transferModalOpen"
      :keyword="transferKeyword"
      :agents="transferableAgents"
      @close="transferModalOpen = false"
      @update:keyword="transferKeyword = $event"
      @confirm="handleRequestTransfer"
    />

    <BaseModal :open="confirmTransferModalOpen" title="确认转移" @close="handleCloseConfirmTransfer">
      <div class="confirm-transfer-modal">
        <p class="confirm-transfer-modal__description">
          转移后你将自动移出当前会话
        </p>
      </div>

      <template #footer>
        <span />
        <div class="confirm-transfer-modal__footer-actions">
          <button class="agent-btn agent-btn--ghost" type="button" @click="handleCloseConfirmTransfer">取消</button>
          <button
            class="agent-btn agent-btn--primary"
            type="button"
            :disabled="!pendingTransferAgent"
            @click="handleConfirmTransfer"
          >
            确认
          </button>
        </div>
      </template>
    </BaseModal>

    <InviteModal
      :open="inviteModalOpen"
      :keyword="inviteKeyword"
      :agents="invitableAgents"
      @close="inviteModalOpen = false"
      @update:keyword="inviteKeyword = $event"
      @confirm="handleConfirmInvite"
    />

    <AgentToast :message="toastMessage" :visible="showToast" />
  </AgentAppShell>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import AiAgentRoutePage from "./views/AiAgentRoutePage.vue";
import CampaignRoutePage from "./views/CampaignRoutePage.vue";
import ProactiveCampaignRoutePage from "./views/ProactiveCampaignRoutePage.vue";
import SettingsRoutePage from "./views/SettingsRoutePage.vue";
import WidgetCustomizePage from "./views/WidgetCustomizePage.vue";
import {
  AgentAppShell,
  AiSettingsNav,
  BaseModal,
  AgentIcon,
  AgentToast,
  ConversationHeader,
  InviteModal,
  MessageBubble,
  MessageComposer,
  PrimaryNavRail,
  SessionListItem,
  SessionQueueNav,
  TransferModal,
  type MessageItem,
  type NavItem,
  type SessionItem,
  type SessionQueueGroup
} from "@twt/ui-agent";

type DetailTabKey = "visitor" | "session";
type AiAgentNavKey = "doc-knowledge" | "faq" | "copilot-settings";
type SettingsNavKey = "install" | "customize" | "team" | "quick-reply";
type CampaignNavKey = "campaign-chatting" | "campaign-proactive";

interface AgentEntry {
  id: string;
  name: string;
  online: boolean;
  avatarText: string;
  avatarColor: string;
}

const agentPool: AgentEntry[] = [
  { id: "ag-1", name: "客服主管", online: true, avatarText: "主", avatarColor: "linear-gradient(135deg, #2f6bff 0%, #69a1ff 100%)" },
  { id: "ag-2", name: "王珂", online: true, avatarText: "王", avatarColor: "linear-gradient(135deg, #7f6bff 0%, #a259ff 100%)" },
  { id: "ag-3", name: "刘昊", online: true, avatarText: "刘", avatarColor: "linear-gradient(135deg, #ff7d00 0%, #ffb15d 100%)" },
  { id: "ag-4", name: "陈悦", online: true, avatarText: "陈", avatarColor: "linear-gradient(135deg, #00c2b8 0%, #00a0cc 100%)" },
  { id: "ag-5", name: "李想", online: true, avatarText: "李", avatarColor: "linear-gradient(135deg, #00b578 0%, #00a66f 100%)" },
  { id: "ag-6", name: "张明", online: false, avatarText: "张", avatarColor: "#a7b0c0" },
  { id: "ag-7", name: "林晓", online: false, avatarText: "林", avatarColor: "#a7b0c0" }
];

const currentAgentName = "客服主管";

const getAgentAvatarText = (name: string) => agentPool.find((a) => a.name === name)?.avatarText ?? name.slice(0, 1);
const getAgentAvatarColor = (name: string) => agentPool.find((a) => a.name === name)?.avatarColor ?? "#a7b0c0";

interface ConversationSession extends SessionItem {
  queueKey: string;
  tag: "访客" | "VIP" | "客户";
  avatarText: string;
  avatarColor: string;
  channel: string;
  visitorName: string;
  visitorId: string;
  phone: string;
  email: string;
  entryPage: string;
  visitStats: string;
  deviceIp: string;
  os: string;
  browser: string;
  startedAt: string;
  acceptedAt: string;
  assignee: string;
  assistants: string[];
}

interface DetailField {
  key: string;
  label: string;
  value: string;
}

interface AgentInfoItem {
  key: string;
  name: string;
  avatarText: string;
  avatarColor: string;
  role: "owner" | "assistant";
  messageCount: number;
}

interface TimelineItem {
  key: string;
  label: string;
  link: string;
  time: string;
  duration: string;
  dotClass?: string;
}

interface InfoSection {
  key: string;
  title: string;
  type: "fields" | "tags" | "timeline" | "agents";
  fields?: DetailField[];
  agents?: AgentInfoItem[];
  timeline?: TimelineItem[];
  moreText?: string;
}

const mainNavItemsBase: NavItem[] = [
  { key: "home", label: "首页", icon: "home" },
  { key: "conversation", label: "会话", icon: "conversation" },
  { key: "files", label: "档案", icon: "files" },
  { key: "visitors", label: "访客", icon: "visitors" },
  { key: "customer", label: "客户", icon: "customer" },
  { key: "campaign", label: "营销", icon: "campaign" },
  { key: "report", label: "报表", icon: "report" },
  { key: "ai-agent", label: "AI Agent", icon: "ai-agent" }
];

const navRoutePathMap: Record<string, string> = {
  home: "/home",
  conversation: "/conversation",
  files: "/files",
  visitors: "/visitors",
  customer: "/customer",
  campaign: "/campaign",
  report: "/report",
  "ai-agent": "/ai-agent"
};

const settingsNavGroups = [
  {
    key: "install-group",
    title: "安装",
    leadingEmoji: "⚙️",
    items: [
      { key: "install", label: "聊天页面" },
      { key: "customize", label: "自定义" }
    ]
  },
  {
    key: "team-group",
    title: "团队",
    leadingEmoji: "👩‍💻",
    items: [{ key: "team", label: "客服设置" }]
  },
  {
    key: "quick-reply-group",
    title: "快捷回复",
    leadingEmoji: "↩️",
    items: [{ key: "quick-reply", label: "公共回复" }]
  }
];

const campaignNavGroups = [
  {
    key: "campaign",
    title: "",
    items: [
      { key: "campaign-chatting", label: "群发消息", icon: "campaign" },
      { key: "campaign-proactive", label: "主动营销", icon: "campaign" }
    ]
  }
];

const aiNavGroups = [
  {
    key: "knowledge",
    title: "知识库",
    items: [
      { key: "doc-knowledge", label: "文档知识", leadingEmoji: "📖" },
      { key: "faq", label: "常见问题", leadingEmoji: "👩‍💻" }
    ]
  },
  {
    key: "ai-settings",
    title: "AI设置",
    items: [{ key: "copilot-settings", label: "Copilot设置", leadingEmoji: "💡" }]
  }
];

const queueGroupSeed: SessionQueueGroup[] = [
  {
    key: "online-session",
    title: "在线会话",
    items: [
      { key: "pending-reply", label: "待回复", leadingEmoji: "👋" },
      { key: "queueing", label: "排队中", leadingEmoji: "⌛" },
      { key: "processing", label: "待处理", leadingEmoji: "📝" },
      { key: "resolved", label: "已回复", leadingEmoji: "↩️" }
    ]
  },
  {
    key: "online-chat",
    title: "在线聊天",
    items: [{ key: "chat-room", label: "聊天", leadingEmoji: "💬" }]
  }
];

const detailTabs: Array<{ key: DetailTabKey; label: string }> = [
  { key: "visitor", label: "访客信息" },
  { key: "session", label: "会话信息" }
];

const allSessions = ref<ConversationSession[]>([
  {
    id: "s-6001",
    queueKey: "pending-reply",
    customerName: "了解铂金会员权益",
    preview: "我刚买的套餐，权益什么时候生效？",
    updatedAt: "19:34",
    unreadCount: 2,
    tag: "客户",
    avatarText: "J",
    avatarColor: "linear-gradient(135deg, #1aa3e8 0%, #2f6bff 100%)",
    channel: "官网入口",
    visitorName: "微微",
    visitorId: "449868",
    phone: "18133093890",
    email: "aidanswang@gmail.com",
    entryPage: "https://www.twt.com/shop/vip-plan",
    visitStats: "3 会话，1 聊天",
    deviceIp: "192.169.0.23",
    os: "Windows 11",
    browser: "Chrome 133",
    startedAt: "10:30",
    acceptedAt: "10:31",
    assignee: "客服主管",
    assistants: []
  },
  {
    id: "s-6002",
    queueKey: "pending-reply",
    customerName: "续费折扣咨询",
    preview: "企业版续费有季度折扣吗？",
    updatedAt: "12:23",
    unreadCount: 1,
    tag: "VIP",
    avatarText: "E",
    avatarColor: "linear-gradient(135deg, #7f6bff 0%, #a259ff 100%)",
    channel: "活动落地页",
    visitorName: "Ella",
    visitorId: "552108",
    phone: "18677774561",
    email: "ella.vip@demo.com",
    entryPage: "https://www.twt.com/pricing/pro",
    visitStats: "6 会话，2 聊天",
    deviceIp: "10.16.88.102",
    os: "macOS 15",
    browser: "Safari 19",
    startedAt: "12:00",
    acceptedAt: "12:01",
    assignee: "王珂",
    assistants: []
  },
  {
    id: "s-6003",
    queueKey: "queueing",
    customerName: "发票抬头修改",
    preview: "系统里改完抬头还是旧的，帮忙看下",
    updatedAt: "11:10",
    unreadCount: 3,
    tag: "访客",
    avatarText: "Q",
    avatarColor: "linear-gradient(135deg, #00b578 0%, #00a66f 100%)",
    channel: "客服入口",
    visitorName: "秦川",
    visitorId: "418022",
    phone: "13902099876",
    email: "qinchuan@example.com",
    entryPage: "https://www.twt.com/help/billing",
    visitStats: "1 会话，1 聊天",
    deviceIp: "172.26.19.6",
    os: "Android 16",
    browser: "Edge 133",
    startedAt: "11:08",
    acceptedAt: "--",
    assignee: "排队中",
    assistants: []
  },
  {
    id: "s-6004",
    queueKey: "processing",
    customerName: "接口限流报错",
    preview: "最近接口 429 比例突然上升",
    updatedAt: "09:10",
    unreadCount: 0,
    tag: "VIP",
    avatarText: "R",
    avatarColor: "linear-gradient(135deg, #ff7d00 0%, #ffb15d 100%)",
    channel: "控制台工单",
    visitorName: "Rita",
    visitorId: "321900",
    phone: "15800110022",
    email: "rita@team.io",
    entryPage: "https://console.twt.com/api/monitor",
    visitStats: "4 会话，5 聊天",
    deviceIp: "10.0.12.91",
    os: "Ubuntu 24.04",
    browser: "Firefox 135",
    startedAt: "08:58",
    acceptedAt: "09:00",
    assignee: "刘昊",
    assistants: []
  },
  {
    id: "s-6005",
    queueKey: "resolved",
    customerName: "订单退款进度",
    preview: "已经提交 3 天了，状态还是处理中",
    updatedAt: "昨天",
    unreadCount: 0,
    tag: "客户",
    avatarText: "M",
    avatarColor: "linear-gradient(135deg, #00c2b8 0%, #00a0cc 100%)",
    channel: "邮件链接",
    visitorName: "Mia",
    visitorId: "901177",
    phone: "13799220031",
    email: "mia.order@demo.com",
    entryPage: "https://www.twt.com/order/refund",
    visitStats: "2 会话，0 聊天",
    deviceIp: "100.65.44.11",
    os: "iOS 19",
    browser: "Mobile Safari",
    startedAt: "昨天 18:22",
    acceptedAt: "昨天 18:24",
    assignee: "陈悦",
    assistants: []
  },
  {
    id: "s-6006",
    queueKey: "chat-room",
    customerName: "活动报名咨询",
    preview: "今天直播回放什么时候开放？",
    updatedAt: "06:56",
    unreadCount: 1,
    tag: "访客",
    avatarText: "L",
    avatarColor: "linear-gradient(135deg, #2f6bff 0%, #69a1ff 100%)",
    channel: "社媒私信",
    visitorName: "Leo",
    visitorId: "883209",
    phone: "18621004482",
    email: "leo.chat@demo.com",
    entryPage: "https://www.twt.com/events/live-02",
    visitStats: "5 会话，8 聊天",
    deviceIp: "192.168.7.200",
    os: "HarmonyOS Next",
    browser: "WebView",
    startedAt: "06:50",
    acceptedAt: "06:52",
    assignee: "李想",
    assistants: []
  }
]);

const messageMap = ref<Record<string, MessageItem[]>>({
  "s-6001": [
    {
      id: "m-100",
      role: "system",
      sender: "系统",
      content: " ",
      time: "10:30"
    },
    {
      id: "m-101",
      role: "customer",
      sender: "微微",
      content: "我昨天买的东西还没到，是不是出什么问题了？",
      time: "10:32"
    },
    {
      id: "m-102",
      role: "agent",
      sender: "客服主管",
      content: "已帮你核对物流状态，包裹正在派送中，预计今晚 20:00 前送达。",
      time: "10:33"
    }
  ],
  "s-6002": [
    {
      id: "m-201",
      role: "customer",
      sender: "Ella",
      content: "企业版续费如果一次付一年有优惠吗？",
      time: "12:20"
    }
  ],
  "s-6003": [
    {
      id: "m-301",
      role: "customer",
      sender: "秦川",
      content: "发票抬头我改了两次，下载下来还是老公司名。",
      time: "11:09"
    }
  ],
  "s-6004": [
    {
      id: "m-401",
      role: "customer",
      sender: "Rita",
      content: "API 在高峰期频繁 429，想确认是否平台限流策略调整。",
      time: "09:08"
    },
    {
      id: "m-402",
      role: "agent",
      sender: "刘昊",
      content: "我们正在排查，请提供最近 10 分钟的请求 ID 样本。",
      time: "09:09"
    }
  ],
  "s-6005": [
    {
      id: "m-501",
      role: "agent",
      sender: "陈悦",
      content: "退款申请已提交财务，预计 1-2 个工作日原路退回。",
      time: "昨天 18:30"
    }
  ],
  "s-6006": [
    {
      id: "m-601",
      role: "customer",
      sender: "Leo",
      content: "今天直播回放几点能看？",
      time: "06:54"
    }
  ]
});

const router = useRouter();
const route = useRoute();

const activeMainNav = ref("conversation");
const activeQueueKey = ref("pending-reply");
const activeSessionId = ref("s-6001");
const searchKeyword = ref("");
const composerText = ref("");
const activeDetailTab = ref<DetailTabKey>("visitor");
const collapsedDetailSections = ref<string[]>([]);
const activeSettingsNavKey = ref<SettingsNavKey>("install");
const activeAiNavKey = ref<AiAgentNavKey>("copilot-settings");
const activeCampaignNavKey = ref<CampaignNavKey>("campaign-chatting");
const showToast = ref(false);
const toastMessage = ref("");
let toastTimer: number | undefined;

const transferModalOpen = ref(false);
const transferKeyword = ref("");
const confirmTransferModalOpen = ref(false);
const pendingTransferAgentId = ref<string | null>(null);

const inviteModalOpen = ref(false);
const inviteKeyword = ref("");

const queueGroups = computed(() =>
  queueGroupSeed.map((group) => ({
    ...group,
    items: group.items.map((item) => ({
      ...item,
      count: allSessions.value.filter((session) => session.queueKey === item.key).length
    }))
  }))
);

const canCollaborate = computed(() => activeSession.value?.queueKey !== "queueing");

const transferableAgents = computed(() => {
  const keyword = transferKeyword.value.trim().toLowerCase();
  return agentPool
    .filter((a) => a.name !== currentAgentName)
    .filter((a) => keyword.length === 0 || a.name.toLowerCase().includes(keyword))
    .sort((a, b) => (a.online === b.online ? 0 : a.online ? -1 : 1))
    .map((a) => ({ id: a.id, name: a.name, online: a.online, avatarText: a.avatarText, avatarColor: a.avatarColor }));
});

const pendingTransferAgent = computed(() => {
  if (!pendingTransferAgentId.value) {
    return null;
  }
  return agentPool.find((agent) => agent.id === pendingTransferAgentId.value) ?? null;
});

const invitableAgents = computed(() => {
  const session = activeSession.value;
  if (!session) return [];
  const inSession = new Set([session.assignee, ...session.assistants]);
  const keyword = inviteKeyword.value.trim().toLowerCase();
  return agentPool
    .filter((a) => !inSession.has(a.name))
    .filter((a) => keyword.length === 0 || a.name.toLowerCase().includes(keyword))
    .sort((a, b) => (a.online === b.online ? 0 : a.online ? -1 : 1))
    .map((a) => ({ id: a.id, name: a.name, online: a.online, avatarText: a.avatarText, avatarColor: a.avatarColor }));
});

const conversationBadgeCount = computed(() => {
  const queueKeys = queueGroupSeed.flatMap((group) => group.items.map((item) => item.key));
  return allSessions.value.filter((session) => queueKeys.includes(session.queueKey)).length;
});

const mainNavItems = computed<NavItem[]>(() =>
  mainNavItemsBase.map((item) => {
    if (item.key !== "conversation") {
      return item;
    }
    return {
      ...item,
      badge: conversationBadgeCount.value
    };
  })
);

const currentRouteName = computed(() => (typeof route.name === "string" ? route.name : "conversation"));
const isConversationRoute = computed(() => currentRouteName.value === "conversation");
const isAiAgentRoute = computed(() => currentRouteName.value === "ai-agent");
const isSettingsRoute = computed(() => currentRouteName.value === "settings");
const isCampaignRoute = computed(() => currentRouteName.value === "campaign");

const currentModuleLabel = computed(() => {
  if (isSettingsRoute.value) {
    return "设置";
  }
  const item = mainNavItemsBase.find((entry) => entry.key === currentRouteName.value);
  return item?.label ?? "模块";
});

const queueSessionList = computed(() => allSessions.value.filter((session) => session.queueKey === activeQueueKey.value));

const visibleSessions = computed(() => {
  const keyword = searchKeyword.value.trim().toLowerCase();
  return queueSessionList.value.filter((session) => {
    return (
      keyword.length === 0 ||
      session.customerName.toLowerCase().includes(keyword) ||
      session.preview.toLowerCase().includes(keyword)
    );
  });
});

const activeSession = computed(() => {
  const inVisible = visibleSessions.value.find((item) => item.id === activeSessionId.value);
  if (inVisible) {
    return inVisible;
  }
  const fallback = queueSessionList.value.find((item) => item.id === activeSessionId.value);
  if (fallback) {
    return fallback;
  }
  return visibleSessions.value[0] ?? queueSessionList.value[0] ?? allSessions.value[0];
});

const activeMessages = computed(() => {
  if (!activeSession.value) {
    return [];
  }
  return messageMap.value[activeSession.value.id] ?? [];
});

const activeSessionTitle = computed(() => activeSession.value?.customerName ?? "会话详情");

const activeQueueLabel = computed(() => {
  for (const group of queueGroups.value) {
    const item = group.items.find((entry) => entry.key === activeQueueKey.value);
    if (item) {
      return item.label;
    }
  }
  return "会话";
});

const activeInfoSections = computed<InfoSection[]>(() => {
  if (!activeSession.value) {
    return [];
  }

  if (activeDetailTab.value === "session") {
    return [
      {
        key: "session-basic",
        title: "基础信息",
        type: "fields",
        fields: [
          { key: "session-id", label: "会话ID", value: activeSession.value.id },
          { key: "session-title", label: "会话标题", value: activeSession.value.customerName },
          { key: "session-start", label: "发起时间", value: activeSession.value.startedAt },
          { key: "session-accept", label: "接待时间", value: activeSession.value.acceptedAt }
        ]
      },
      {
        key: "session-tag",
        title: "会话标签",
        type: "tags"
      },
      {
        key: "session-service",
        title: "服务客服",
        type: "agents",
        agents: [
          {
            key: "session-owner",
            name: activeSession.value.assignee,
            avatarText: getAgentAvatarText(activeSession.value.assignee),
            avatarColor: getAgentAvatarColor(activeSession.value.assignee),
            role: "owner",
            messageCount: (messageMap.value[activeSession.value.id] ?? []).filter((m) => m.sender === activeSession.value!.assignee).length
          },
          ...activeSession.value.assistants.map((name, i) => ({
            key: `session-assistant-${i}`,
            name,
            avatarText: getAgentAvatarText(name),
            avatarColor: getAgentAvatarColor(name),
            role: "assistant" as const,
            messageCount: (messageMap.value[activeSession.value!.id] ?? []).filter((m) => m.sender === name).length
          }))
        ]
      }
    ];
  }

  return [
    {
      key: "visitor-basic",
      title: "基础信息",
      type: "fields",
      fields: [
        { key: "visitor-alias", label: "备注名", value: "需要进群的客户" },
        { key: "visitor-name", label: "姓名", value: activeSession.value.visitorName },
        { key: "visitor-phone", label: "电话", value: activeSession.value.phone || "-" },
        { key: "visitor-email", label: "邮箱", value: activeSession.value.email || "-" }
      ]
    },
    {
      key: "visitor-tag",
      title: "访客标签",
      type: "tags"
    },
    {
      key: "visitor-customer",
      title: "客户信息",
      type: "fields",
      fields: [{ key: "visitor-bind", label: "关联客户", value: "123456" }]
    },
    {
      key: "visitor-extra",
      title: "附加信息",
      type: "fields",
      fields: [
        { key: "visitor-entry", label: "起点页面", value: activeSession.value.entryPage },
        { key: "visitor-stat", label: "会话总数", value: "6 个会话" }
      ]
    },
    {
      key: "visitor-trace",
      title: "访问轨迹",
      type: "timeline",
      timeline: [
        {
          key: "trace-1",
          label: "Chat with us",
          link: "https://visitorchat.twt.com/...",
          time: "2026-02-24 16:09",
          duration: "1天 2小时 30分",
          dotClass: "timeline-item__dot--active"
        },
        {
          key: "trace-2",
          label: "Chat with us",
          link: "https://visitorchat.twt.com/...",
          time: "2026-02-05 19:34",
          duration: "1分 14秒"
        },
        {
          key: "trace-3",
          label: "Chat with us",
          link: "https://visitorchat.twt.com/...",
          time: "2026-02-05 19:34",
          duration: "3秒"
        }
      ],
      moreText: "查看更多"
    },
    {
      key: "visitor-device",
      title: "设备信息",
      type: "fields",
      fields: [
        { key: "visitor-ip", label: "IP 地址", value: activeSession.value.deviceIp },
        { key: "visitor-os", label: "操作系统", value: activeSession.value.os },
        { key: "visitor-browser", label: "浏览器", value: activeSession.value.browser }
      ]
    }
  ];
});

const isDetailSectionCollapsed = (key: string) => collapsedDetailSections.value.includes(key);

const toggleDetailSection = (key: string) => {
  if (isDetailSectionCollapsed(key)) {
    collapsedDetailSections.value = collapsedDetailSections.value.filter((item) => item !== key);
    return;
  }
  collapsedDetailSections.value = [...collapsedDetailSections.value, key];
};

const handleMainNavSelect = (key: string) => {
  const nextPath = navRoutePathMap[key];
  if (!nextPath) {
    return;
  }
  router.push(nextPath);
};

const openSettingsPage = () => {
  router.push("/settings");
};

const handleSettingsNavSelect = (key: string) => {
  if (key === "install" || key === "customize" || key === "team" || key === "quick-reply") {
    activeSettingsNavKey.value = key;
  }
};

const handleAiNavSelect = (key: string) => {
  if (key === "doc-knowledge" || key === "faq" || key === "copilot-settings") {
    activeAiNavKey.value = key;
  }
};

const handleCampaignNavSelect = (key: string) => {
  if (key === "campaign-chatting" || key === "campaign-proactive") {
    activeCampaignNavKey.value = key;
  }
};

const handleQueueSelect = (key: string) => {
  activeQueueKey.value = key;
  searchKeyword.value = "";
};

const getFilterCount = () => queueSessionList.value.length;

const getMessageAvatarLabel = (role: MessageItem["role"]) => {
  if (role === "system") {
    return "S";
  }
  if (role === "agent") {
    return "客";
  }
  return activeSession.value?.avatarText ?? "?";
};

const getMessageAvatarColor = (role: MessageItem["role"]) => {
  if (role === "system") {
    return "#a7b0c0";
  }
  if (role === "agent") {
    return "linear-gradient(135deg, #2f6bff 0%, #69a1ff 100%)";
  }
  return activeSession.value?.avatarColor ?? "#2f6bff";
};

const updateSessionTitle = (nextTitle: string) => {
  const currentSession = activeSession.value;
  if (!currentSession) {
    return;
  }
  allSessions.value = allSessions.value.map((session) => {
    if (session.id !== currentSession.id) {
      return session;
    }
    return {
      ...session,
      customerName: nextTitle
    };
  });
};

const sendPushNotification = (title: string, body: string) => {
  if (!("Notification" in window) || Notification.permission !== "granted") return;
  new Notification(title, { body, icon: "/favicon.ico" });
};

onMounted(() => {
  if ("Notification" in window && Notification.permission === "default") {
    Notification.requestPermission();
  }
});

const showTopToast = (message: string) => {
  toastMessage.value = message;
  showToast.value = true;

  if (toastTimer) {
    window.clearTimeout(toastTimer);
  }
  toastTimer = window.setTimeout(() => {
    showToast.value = false;
  }, 1500);
};

const handleOpenTransfer = () => {
  transferKeyword.value = "";
  pendingTransferAgentId.value = null;
  confirmTransferModalOpen.value = false;
  transferModalOpen.value = true;
};

const handleOpenInvite = () => {
  inviteKeyword.value = "";
  inviteModalOpen.value = true;
};

const handleRequestTransfer = (id: string) => {
  const nextOwner = agentPool.find((agent) => agent.id === id);
  if (!nextOwner) return;
  pendingTransferAgentId.value = nextOwner.id;
  transferModalOpen.value = false;
  confirmTransferModalOpen.value = true;
};

const handleCloseConfirmTransfer = () => {
  confirmTransferModalOpen.value = false;
  pendingTransferAgentId.value = null;
};

const handleConfirmTransfer = () => {
  const session = activeSession.value;
  const pendingId = pendingTransferAgentId.value;
  if (!session) return;
  if (!pendingId) return;
  const newOwner = agentPool.find((a) => a.id === pendingId);
  if (!newOwner) return;

  const now = new Date();
  const time = now.toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit", hour12: false });
  const sysMsg: MessageItem = {
    id: `m-${session.id}-transfer-${now.getTime()}`,
    role: "system",
    sender: "系统",
    content: `${currentAgentName}已将会话转移给${newOwner.name}`,
    time
  };
  messageMap.value = {
    ...messageMap.value,
    [session.id]: [...(messageMap.value[session.id] ?? []), sysMsg]
  };

  allSessions.value = allSessions.value.filter((s) => s.id !== session.id);
  transferModalOpen.value = false;
  confirmTransferModalOpen.value = false;
  pendingTransferAgentId.value = null;
  sendPushNotification(session.customerName, `${currentAgentName}已将会话转移给你`);
  showTopToast("转移会话成功");
};

const handleConfirmInvite = (ids: string[]) => {
  const session = activeSession.value;
  if (!session || ids.length === 0) return;

  const invitees = ids.map((id) => agentPool.find((a) => a.id === id)).filter((a): a is AgentEntry => !!a);
  if (invitees.length === 0) return;

  allSessions.value = allSessions.value.map((s) => {
    if (s.id !== session.id) return s;
    return { ...s, assistants: [...s.assistants, ...invitees.map((i) => i.name)] };
  });

  const now = new Date();
  const time = now.toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit", hour12: false });
  const names = invitees.map((i) => i.name).join(",");
  const sysMsg: MessageItem = {
    id: `m-${session.id}-invite-${now.getTime()}`,
    role: "system",
    sender: "系统",
    content: `${currentAgentName}邀请${names}加入会话`,
    time
  };
  messageMap.value = {
    ...messageMap.value,
    [session.id]: [...(messageMap.value[session.id] ?? []), sysMsg]
  };

  inviteModalOpen.value = false;
  sendPushNotification(session.customerName, `${currentAgentName}邀请你加入会话`);
  showTopToast("邀请成功");
};

const handleSend = () => {
  const text = composerText.value.trim();
  if (!text || !activeSession.value) {
    return;
  }

  const now = new Date();
  const time = now.toLocaleTimeString("zh-CN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  });

  const nextMessage: MessageItem = {
    id: `m-${activeSession.value.id}-${now.getTime()}`,
    role: "agent",
    sender: "客服主管",
    content: text,
    time
  };

  const history = messageMap.value[activeSession.value.id] ?? [];
  messageMap.value = {
    ...messageMap.value,
    [activeSession.value.id]: [...history, nextMessage]
  };

  composerText.value = "";
  showTopToast("消息已发送");
};

watch(
  visibleSessions,
  (list) => {
    if (list.length === 0) {
      return;
    }

    const stillExists = list.some((item) => item.id === activeSessionId.value);
    if (!stillExists) {
      activeSessionId.value = list[0].id;
    }
  },
  { immediate: true }
);

watch(
  () => route.name,
  (name) => {
    if (typeof name === "string" && name in navRoutePathMap) {
      activeMainNav.value = name;
    }
  },
  { immediate: true }
);

onBeforeUnmount(() => {
  if (toastTimer) {
    window.clearTimeout(toastTimer);
  }
});
</script>

<style scoped>
:deep(.agent-shell__main) {
  padding-left: 0;
}

:deep(.agent-shell__detail) {
  padding-left: 0;
}

.brand-mark {
  align-items: center;
  background: linear-gradient(135deg, #2f6bff 0%, #00b5ff 100%);
  border: 0;
  border-radius: var(--agent-radius-md);
  color: #ffffff;
  cursor: pointer;
  display: inline-flex;
  font-size: 11px;
  font-weight: var(--agent-font-weight-semibold);
  height: 24px;
  justify-content: center;
  width: 24px;
}

.rail-footer {
  align-items: center;
  display: flex;
  flex-direction: column;
  gap: var(--agent-space-8);
}

.rail-footer__icon {
  align-items: center;
  background: transparent;
  border: 0;
  border-radius: var(--agent-radius-md);
  color: var(--agent-color-text-secondary);
  cursor: pointer;
  display: inline-flex;
  height: 30px;
  justify-content: center;
  width: 30px;
}

.rail-footer__icon:hover {
  background: var(--agent-color-bg-muted);
}

.rail-footer__profile {
  background: radial-gradient(circle at 30% 25%, #f8dfb8 0%, #d4986f 48%, #8b6042 100%);
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  cursor: pointer;
  height: 30px;
  position: relative;
  width: 30px;
}

.rail-footer__profile::after {
  background: var(--agent-color-status-success);
  border: 2px solid var(--agent-color-bg-panel);
  border-radius: 50%;
  bottom: -1px;
  content: "";
  height: 9px;
  position: absolute;
  right: -1px;
  width: 9px;
}

.session-page {
  display: grid;
  gap: 0;
  grid-template-columns: var(--agent-layout-inbox-pane-width) minmax(580px, 1fr);
  height: 100%;
  min-width: 0;
}

.inbox-pane {
  border-radius: var(--agent-radius-xl) 0 0 var(--agent-radius-xl);
  border-right: 0;
  display: flex;
  flex-direction: column;
  height: 100%;
  min-width: 0;
}

.inbox-pane__header {
  display: flex;
  flex-direction: column;
  gap: var(--agent-space-12);
  padding: var(--agent-space-16);
}

.inbox-pane__title-row {
  align-items: center;
  display: flex;
  gap: var(--agent-space-12);
}

.inbox-pane__back {
  align-items: center;
  background: var(--agent-color-bg-muted);
  border: 1px solid var(--agent-color-border-default);
  border-radius: 999px;
  color: var(--agent-color-text-secondary);
  cursor: pointer;
  display: inline-flex;
  font-size: var(--agent-font-size-xl);
  height: 28px;
  justify-content: center;
  line-height: 1;
  width: 28px;
}

.inbox-pane__title {
  color: #222222;
  font-size: 20px;
  font-weight: var(--agent-font-weight-semibold);
  line-height: 1.2;
  margin: 0;
}

.inbox-pane__search-row {
  display: block;
}

.inbox-pane__search-box {
  position: relative;
}

.inbox-pane__search-input {
  padding-right: 40px;
}

.inbox-pane__search-icon-btn {
  align-items: center;
  background: var(--agent-color-bg-muted);
  border: 1px solid var(--agent-color-border-default);
  border-radius: var(--agent-radius-sm);
  color: var(--agent-color-text-secondary);
  cursor: pointer;
  display: inline-flex;
  height: 24px;
  justify-content: center;
  position: absolute;
  right: 6px;
  top: 50%;
  transform: translateY(-50%);
  width: 24px;
}

.inbox-pane__filter-row {
  align-items: center;
  display: flex;
  justify-content: space-between;
}

.inbox-pane__chips {
  display: flex;
  gap: var(--agent-space-8);
}

.filter-chip {
  background: var(--agent-color-bg-muted);
  border: 1px solid transparent;
  border-radius: 999px;
  color: var(--agent-color-text-secondary);
  cursor: pointer;
  font-size: var(--agent-font-size-sm);
  font-weight: var(--agent-font-weight-medium);
  line-height: 1;
  padding: 9px var(--agent-space-12);
}

.filter-chip--active {
  background: var(--agent-color-brand-soft);
  border-color: #bfd4ff;
  color: var(--agent-color-brand-primary);
}

.inbox-pane__filter-icon-btn {
  align-items: center;
  background: var(--agent-color-bg-muted);
  border: 1px solid var(--agent-color-border-default);
  border-radius: var(--agent-radius-md);
  color: var(--agent-color-text-secondary);
  cursor: pointer;
  display: inline-flex;
  height: 30px;
  justify-content: center;
  width: 30px;
}

.inbox-pane__list {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: var(--agent-space-8);
  min-height: 0;
  padding: var(--agent-space-12);
}

.inbox-pane__empty {
  color: var(--agent-color-text-tertiary);
  font-size: var(--agent-font-size-sm);
  margin: var(--agent-space-20) 0 0;
  text-align: center;
}

.chat-pane {
  border-left: 1px solid var(--agent-color-border-default);
  border-radius: 0 var(--agent-radius-xl) var(--agent-radius-xl) 0;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.chat-pane__header {
  border: 0;
  border-bottom: 1px solid var(--agent-color-border-default);
  border-radius: 0;
  box-shadow: none;
}

.chat-pane__stream {
  background: var(--agent-color-bg-page);
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: var(--agent-space-12);
  min-height: 0;
  padding: var(--agent-space-16);
}

.chat-pane__start-time {
  color: var(--agent-color-text-tertiary);
  font-size: var(--agent-font-size-xs);
  margin: 0;
  text-align: center;
}

.chat-pane__composer {
  min-height: 196px;
  padding: 0 var(--agent-space-16) var(--agent-space-16);
}

.detail-pane {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.detail-pane__topbar {
  align-items: center;
  border-bottom: 1px solid var(--agent-color-border-default);
  display: flex;
  justify-content: space-between;
  min-height: 56px;
  padding: 0 var(--agent-space-12);
}

.detail-pane__tabs {
  display: flex;
  gap: 2px;
}

.detail-pane__tab {
  background: transparent;
  border: 0;
  color: #222222;
  cursor: pointer;
  font-size: var(--agent-font-size-sm);
  font-weight: var(--agent-font-weight-semibold);
  height: 56px;
  padding: 0 10px;
  position: relative;
}

.detail-pane__tab--active {
  color: var(--agent-color-brand-primary);
}

.detail-pane__tab--active::after {
  background: var(--agent-color-brand-primary);
  border-radius: 2px;
  bottom: 0;
  content: "";
  height: 2px;
  left: 10px;
  position: absolute;
  right: 10px;
}

.detail-pane__dock-btn {
  background: transparent;
  border: 1px solid var(--agent-color-border-default);
  border-radius: var(--agent-radius-sm);
  cursor: pointer;
  height: 18px;
  position: relative;
  width: 18px;
}

.detail-pane__dock-btn::before {
  border: 1px solid var(--agent-color-text-secondary);
  content: "";
  height: 8px;
  left: 4px;
  position: absolute;
  top: 4px;
  width: 8px;
}

.detail-pane__content {
  flex: 1;
  min-height: 0;
  padding: 6px var(--agent-space-16) var(--agent-space-16);
}

.detail-section {
  padding: 6px 0;
}

.detail-section:last-child {
  border-bottom: 0;
}

.detail-section__header {
  align-items: center;
  background: transparent;
  border: 0;
  color: #222222;
  cursor: pointer;
  display: inline-flex;
  justify-content: space-between;
  line-height: 1.2;
  padding: 6px 0;
  width: 100%;
}

.detail-section__title {
  font-size: 14px;
  font-weight: var(--agent-font-weight-semibold);
}

.detail-section__body {
  padding: 4px 0 2px;
}

.detail-section__fields {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 0;
}

.detail-section__field {
  align-items: baseline;
  display: grid;
  gap: var(--agent-space-8);
  grid-template-columns: 84px 1fr;
}

.detail-section__field dt {
  color: #7e8999;
  font-size: var(--agent-font-size-sm);
}

.detail-section__field dd {
  color: #222222;
  font-size: 14px;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.detail-section__agents {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.detail-agent-row {
  align-items: center;
  display: flex;
  gap: var(--agent-space-8);
  padding: 4px 0;
}

.detail-agent-row__avatar {
  align-items: center;
  border-radius: 50%;
  color: #fff;
  display: inline-flex;
  flex-shrink: 0;
  font-size: 12px;
  font-weight: var(--agent-font-weight-semibold);
  height: 30px;
  justify-content: center;
  width: 30px;
}

.detail-agent-row__name {
  color: var(--agent-color-text-primary);
  flex: 1;
  font-size: var(--agent-font-size-sm);
  font-weight: var(--agent-font-weight-medium);
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.detail-agent-row__badge {
  border-radius: 4px;
  flex-shrink: 0;
  font-size: 11px;
  font-weight: var(--agent-font-weight-medium);
  padding: 2px 6px;
}

.detail-agent-row__badge--owner {
  background: rgba(47, 107, 255, 0.1);
  color: var(--agent-color-brand-primary);
}

.detail-agent-row__count {
  color: var(--agent-color-text-secondary);
  flex-shrink: 0;
  font-size: var(--agent-font-size-sm);
  font-variant-numeric: tabular-nums;
}

.detail-section__add-tag {
  align-items: center;
  background: #f2f4f8;
  border: 1px solid #e7ebf0;
  border-radius: 999px;
  color: #8d98a9;
  cursor: pointer;
  display: inline-flex;
  font-size: 16px;
  height: 28px;
  justify-content: center;
  width: 28px;
}

.detail-section__timeline {
  display: flex;
  flex-direction: column;
  gap: 10px;
  list-style: none;
  margin: 0;
  padding: 0;
}

.timeline-item {
  display: flex;
  gap: var(--agent-space-8);
}

.timeline-item__dot {
  background: #c6ccd8;
  border-radius: 50%;
  display: inline-block;
  flex-shrink: 0;
  height: 8px;
  margin-top: 6px;
  width: 8px;
}

.timeline-item__dot--active {
  background: #57c878;
}

.timeline-item__main {
  min-width: 0;
}

.timeline-item__title {
  color: #222222;
  display: flex;
  font-size: var(--agent-font-size-sm);
  gap: 6px;
  margin: 0;
}

.timeline-item__title a {
  color: var(--agent-color-brand-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.timeline-item__meta {
  color: #93a0b2;
  font-size: var(--agent-font-size-sm);
  margin: 2px 0 0;
}

.timeline-item--more {
  color: #222222;
  font-size: var(--agent-font-size-sm);
  padding-left: 16px;
}

.module-subnav {
  display: flex;
  flex-direction: column;
  gap: var(--agent-space-8);
  height: 100%;
  padding: var(--agent-space-24) var(--agent-space-16);
}

.module-subnav__title {
  color: var(--agent-color-text-primary);
  font-size: var(--agent-font-size-xl);
  font-weight: var(--agent-font-weight-semibold);
  margin: 0;
}

.module-subnav__hint {
  color: var(--agent-color-text-tertiary);
  font-size: var(--agent-font-size-sm);
  margin: 0;
}

.module-page {
  justify-content: center;
}

.module-placeholder {
  align-items: center;
  display: flex;
  justify-content: center;
  min-height: 220px;
}

.confirm-transfer-modal {
  display: flex;
  flex-direction: column;
  gap: var(--agent-space-8);
}

.confirm-transfer-modal__description {
  color: var(--agent-color-text-primary);
  font-size: var(--agent-font-size-sm);
  line-height: 1.6;
  margin: 0;
}

.confirm-transfer-modal__footer-actions {
  display: flex;
  gap: var(--agent-space-8);
}

.settings-page {
  gap: var(--agent-space-16);
}

.settings-card {
  border-radius: var(--agent-radius-lg);
  display: flex;
  flex-direction: column;
  gap: var(--agent-space-12);
  padding: var(--agent-space-16);
}

.settings-card__title-row {
  align-items: center;
  display: flex;
  justify-content: space-between;
}

.settings-code {
  background: var(--agent-color-bg-muted);
  border: 1px solid var(--agent-color-border-default);
  border-radius: var(--agent-radius-md);
  color: var(--agent-color-text-primary);
  font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
  font-size: 12px;
  line-height: 1.5;
  margin: 0;
  overflow: auto;
  padding: var(--agent-space-12);
}

.settings-table {
  border-collapse: collapse;
  width: 100%;
}

.settings-table th,
.settings-table td {
  border-bottom: 1px solid var(--agent-color-border-default);
  font-size: var(--agent-font-size-sm);
  padding: 10px 0;
  text-align: left;
}

.settings-table th {
  color: var(--agent-color-text-tertiary);
  font-weight: var(--agent-font-weight-medium);
}

.team-status-pill {
  background: var(--agent-color-bg-muted);
  border-radius: 999px;
  color: var(--agent-color-text-secondary);
  font-size: 12px;
  padding: 4px 8px;
}

.team-status-pill--online {
  background: rgba(0, 181, 120, 0.12);
  color: var(--agent-color-status-success);
}

.quick-reply-editor {
  display: grid;
  gap: var(--agent-space-12);
  grid-template-columns: 1fr auto;
}

.quick-reply-list {
  display: flex;
  flex-direction: column;
  gap: var(--agent-space-8);
  list-style: none;
  margin: 0;
  padding: 0;
}

.quick-reply-item {
  align-items: center;
  background: var(--agent-color-bg-muted);
  border: 1px solid var(--agent-color-border-default);
  border-radius: var(--agent-radius-md);
  display: flex;
  gap: var(--agent-space-12);
  justify-content: space-between;
  padding: 10px var(--agent-space-12);
}

.quick-reply-item__text {
  background: transparent;
  border: 0;
  color: var(--agent-color-text-primary);
  cursor: pointer;
  font-size: var(--agent-font-size-sm);
  line-height: 1.4;
  padding: 0;
  text-align: left;
}

.quick-reply-item__remove {
  background: transparent;
  border: 0;
  color: var(--agent-color-status-error);
  cursor: pointer;
  font-size: var(--agent-font-size-sm);
  padding: 0;
}

@media (max-width: 1680px) {
  .session-page {
    grid-template-columns: minmax(300px, var(--agent-layout-session-pane-width)) minmax(520px, 1fr);
  }

  .inbox-pane__title {
    font-size: 20px;
  }
}

@media (max-width: 1280px) {
  :deep(.agent-shell__detail) {
    display: none;
  }

  .session-page {
    grid-template-columns: minmax(280px, var(--agent-layout-session-pane-width)) minmax(360px, 1fr);
  }

  .inbox-pane__title {
    font-size: 28px;
  }
}

@media (max-width: 980px) {
  .session-page {
    grid-template-columns: 1fr;
  }

  .chat-pane {
    min-height: 62vh;
  }
}
</style>
