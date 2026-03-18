<template>
  <section
    class="agent-content-page agent-content-page--hide-scrollbar settings-page"
    :class="{ 'settings-page--agents': activeKey === 'agents' || activeKey === 'roles' }"
  >
    <header v-if="activeKey !== 'agents' && activeKey !== 'roles'" class="agent-content-header">
      <h1 class="agent-content-title">{{ pageTitle }}</h1>
    </header>

    <section v-if="activeKey === 'install'" class="settings-install">
      <!-- Current layout: original 3 cards stacked -->
      <article class="settings-card agent-panel">
        <h2 class="settings-card__title agent-settings-feature-title">方法一：聊天页面</h2>
        <p class="settings-card__description agent-settings-feature-description">
          把聊天页面链接发给客户，打开即可对话；无需网站部署，适用于邮件、App、社交媒体等渠道
        </p>
        <div class="settings-link-row">
          <input class="agent-input settings-link-input" readonly :value="chatPageBaseUrl" />
          <button type="button" class="agent-btn agent-btn--primary settings-copy-btn" @click="copyChatPageUrl">复制</button>
        </div>
      </article>

      <article class="settings-card settings-card--html-download agent-panel">
        <div class="html-download-head">
          <div class="html-download-meta">
            <h2 class="settings-card__title agent-settings-feature-title">安装2: HTML下载</h2>
            <p class="settings-card__description agent-settings-feature-description">
              你可以下载HTML部署包(内含已配置好的网页代码)，将其上传至你自己的服务器。完成后，访客即可通过你的专属域名访问聊天窗口。
            </p>
          </div>
        </div>

        <div class="html-download-steps">
          <article class="html-download-step">
            <div class="html-download-step__main">
              <span class="html-download-step__icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M12 3v10.5M8.5 10.5 12 14l3.5-3.5M5 17.5h14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </span>
              <p class="html-download-step__title">下载HTML文件</p>
            </div>
            <button type="button" class="html-download-step__link" @click="downloadHtmlDeployment">立即下载</button>
          </article>
          <article class="html-download-step">
            <div class="html-download-step__main">
              <span class="html-download-step__icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none">
                  <rect x="4" y="6" width="16" height="4" rx="1.5" stroke="currentColor" stroke-width="2" />
                  <rect x="4" y="14" width="16" height="4" rx="1.5" stroke="currentColor" stroke-width="2" />
                  <circle cx="8" cy="8" r="1" fill="currentColor" />
                  <circle cx="8" cy="16" r="1" fill="currentColor" />
                </svg>
              </span>
              <p class="html-download-step__title">上传至服务器</p>
            </div>
            <button type="button" class="html-download-step__link" @click="emitToast('教程功能开发中')">查看教程</button>
          </article>
          <article class="html-download-step">
            <div class="html-download-step__main">
              <span class="html-download-step__icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="8" stroke="currentColor" stroke-width="2" />
                  <path d="M8 12h8M12 8v8M10 10l4 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                </svg>
              </span>
              <p class="html-download-step__title">使用自有域名分享</p>
            </div>
            <button type="button" class="html-download-step__link" @click="emitToast('域名配置说明开发中')">注意事项</button>
          </article>
        </div>
      </article>

      <article class="settings-card agent-panel">
        <h2 class="settings-card__title agent-settings-feature-title">自定义配置（可选）</h2>
        <p class="settings-card__description agent-settings-feature-description">
          如需自定义，可参考下方代码根据需要调整聊天页面语言，或将你内部系统的客户信息传入聊天页面
        </p>

        <section class="settings-step">
          <p class="settings-step__title">
            1、切换聊天页面语言：在链接末尾加上 <code>?lang=语言代码</code> 即可。支持：
            <code>zh-cn</code>(简体中文)、<code>zh-tw</code>(繁体中文)、<code>en</code>(英文)
          </p>
          <div class="settings-example">样例：{{ languageExampleUrl }}</div>
        </section>

        <section class="settings-step">
          <p class="settings-step__title">2、接入内部系统的客户信息</p>
          <DataTable :columns="chatParamColumns" :rows="chatParamRows" />
          <p class="settings-tip">
            <code>sbs_mm</code> 生成规则：<code>md5(md5(sbs + '_' + AppSecret) + '_' + ranstr)</code>；注：
            <code>md5</code> 值为小写 32 位
            <br />
            注意：<code>AppSecret</code> 是生成 <code>sbs_mm</code> 的必要参数，请在开发设置中生成，并妥善保存，避免泄露。
          </p>
          <div class="settings-example">样例：{{ customerSignExampleUrl }}</div>
        </section>
      </article>
    </section>

    <SettingsAgentDetailPage
      v-if="activeKey === 'agents' && agentDetailAgent"
      :agent="agentDetailAgent"
      @back="agentDetailAgent = null"
      @save="handleAgentDetailSave"
      @toast="emitToast"
    />
    <SettingsRoleDetailPage
      v-else-if="activeKey === 'roles' && roleDetailMode"
      :mode="roleDetailMode"
      :role-id="roleDetailId"
      :initial-name="roleDetailName"
      :is-system-role="roleDetailIsSystem"
      :initial-perms="roleDetailPerms"
      :existing-role-names="existingRoleNames"
      @back="handleRoleBack"
      @save="handleRoleSave"
      @toast="emitToast"
    />
    <SettingsAgentsPage
      v-else-if="activeKey === 'agents'"
      @toast="emitToast"
      @view-agent-detail="handleViewAgentDetail"
    />

    <SettingsRolesPage
      v-else-if="activeKey === 'roles' && !roleDetailMode"
      @toast="emitToast"
      @view-role="handleViewRole"
      @edit-role="handleEditRole"
      @create-role="handleCreateRole"
    />

    <section v-else-if="activeKey === 'team'" class="settings-team-page">
      <article class="settings-card agent-panel">
        <div class="settings-card__title-row">
          <h2 class="agent-settings-feature-title">成员不活跃</h2>
          <button
            type="button"
            role="switch"
            :aria-checked="agentIdleEnabled"
            class="settings-toggle"
            :class="{ 'settings-toggle--on': agentIdleEnabled }"
            @click="agentIdleEnabled = !agentIdleEnabled"
          >
            <span class="settings-toggle__thumb" />
          </button>
        </div>
        <p class="settings-card__inline-desc">
          当成员超过
          <TimeDurationInput v-model="agentIdleSeconds" />
          未进行操作，自动将其状态更改为离开
        </p>
      </article>

      <article class="settings-card agent-panel">
        <div class="settings-card__title-row">
          <h2 class="agent-settings-feature-title">会话超时</h2>
          <button
            type="button"
            role="switch"
            :aria-checked="sessionTimeoutEnabled"
            class="settings-toggle"
            :class="{ 'settings-toggle--on': sessionTimeoutEnabled }"
            @click="sessionTimeoutEnabled = !sessionTimeoutEnabled"
          >
            <span class="settings-toggle__thumb" />
          </button>
        </div>
        <p class="settings-card__inline-desc">
          当成员超过
          <TimeDurationInput v-model="sessionTimeoutSeconds" />
          未回复访客消息时，会话将自动进入排队中（会话中所有服务成员将会自动释放）
        </p>
      </article>
    </section>

    <section v-else-if="activeKey === 'quick-reply' || activeKey === 'personal-reply'" class="settings-card agent-panel">
      <div class="settings-card__title-row">
        <h2 class="agent-settings-feature-title">{{ pageTitle }}</h2>
        <button type="button" class="agent-btn agent-btn--ghost" @click="emitToast('模板已保存')">保存</button>
      </div>
      <div class="quick-reply-editor">
        <input v-model="quickReplyDraft" class="agent-input" placeholder="输入快捷回复内容后回车添加" @keydown.enter.prevent="addQuickReply" />
        <button type="button" class="agent-btn agent-btn--primary" :disabled="quickReplyDraft.trim().length === 0" @click="addQuickReply">
          新增
        </button>
      </div>
      <ul class="quick-reply-list">
        <li v-for="item in quickReplies" :key="item" class="quick-reply-item">
          <span class="quick-reply-item__text">{{ item }}</span>
          <button type="button" class="quick-reply-item__remove" @click="removeQuickReply(item)">删除</button>
        </li>
      </ul>
    </section>

    <section v-else-if="activeKey === 'webhooks'" class="settings-webhooks">
      <p class="webhooks-subtitle">通过 Webhook 将 Chat 平台事件实时推送至外部服务</p>

      <article class="settings-card agent-panel">
        <h2 class="settings-card__title agent-settings-feature-title">Webhook URL</h2>
        <p class="agent-settings-feature-description">输入接收事件通知的 URL 地址</p>
        <div class="settings-link-row">
          <input v-model="webhookUrl" class="agent-input settings-link-input" placeholder="请输入URL地址" />
        </div>

        <h2 class="settings-card__title agent-settings-feature-title" style="margin-top: var(--agent-space-8)">支持的事件</h2>
        <p class="agent-settings-feature-description">当前系统支持的 Webhook 事件类型</p>

        <div class="webhooks-event-card">
          <div class="webhooks-event-card__header">
            <span class="webhooks-event-card__name">访客消息未回复</span>
            <button
              type="button"
              role="switch"
              :aria-checked="unrepliedEventEnabled"
              class="settings-toggle"
              :class="{ 'settings-toggle--on': unrepliedEventEnabled }"
              @click="toggleUnrepliedEvent"
            >
              <span class="settings-toggle__thumb" />
            </button>
          </div>
          <p class="settings-card__inline-desc">
            当访客发送消息后，若客服未回复：首次于
            <TimeDurationInput v-model="unrepliedFirstSeconds" />
            后提醒，后续每
            <TimeDurationInput v-model="unrepliedRepeatSeconds" />
            后再次提醒，最多提醒4次。
          </p>
        </div>

      </article>

      <article class="settings-card agent-panel">
        <h2 class="settings-card__title agent-settings-feature-title">配置说明</h2>
        <p class="webhooks-link-text">如何正确配置和使用 Webhooks</p>

        <div class="webhooks-steps">
          <p class="webhooks-step">1. 签名校验：在开发设置中生成「AppSecret」，并通过 x-chat-signature 头部发送。X-Chat-Signature:HMAC-SHA256(secret, raw_body)</p>
          <p class="webhooks-step">2. 填写 URL：在 Webhooks 页面输入你的接收地址，点击「保存」。（注意：需先进行签名校验，否则无法保存。）</p>
          <p class="webhooks-step">3. 结构</p>
        </div>

        <h3 class="webhooks-section-title">请求头</h3>
        <p class="webhooks-hint">每个 webhook 至少包含这二个请求头</p>
        <div class="webhooks-code-block">
          <pre><code>content-type: application/json
x-chat-signature: 4ecdcaf813c422d34413671b2ed68e0a6e69ea8496d34ab40bd33cef26571e70</code></pre>
        </div>

        <h3 class="webhooks-section-title">请求体</h3>
        <p class="webhooks-hint">每个 webhook 正文都包含以下结构</p>
        <DataTable :columns="webhookBodyColumns" :rows="webhookBodyRows" :bare="true" />

        <h3 class="webhooks-section-title" style="margin-top: var(--agent-space-16)">事件数据：UNREPLIED（访客消息无回复）</h3>
        <p class="webhooks-hint-warn">访客发出首条消息后1分钟首次触发；后续每10分钟后再次触发，直到被客服回复或提醒4次以上为止。</p>

        <DataTable :columns="unrepliedContentColumns" :rows="unrepliedContentRows" :bare="true" />

        <div class="webhooks-code-block" style="margin-top: var(--agent-space-16)">
          <pre><code>{
  "created_at": 1765439941,
  "event": "UNREPLIED",
  "webhook_id": "58946f5f583edd94f5cf87e3534d04fb",
  "content": [
    {
      "subject": "New Conversation",
      "visitor_name": "Visitor15",
      "created_at": 1765439652,
      "message_content": "1",
      "property_name": "test",
      "visitor_nickname": "visitor nickname",
      "sbs": "",
      "status": "1",
      "push_times": 4,
      "time_sec": 289,
      "assigned_agent_nickname": "ctccccd"
    }
  ]
}</code></pre>
        </div>
      </article>
    </section>

    <section v-else class="settings-card agent-panel settings-placeholder">
      <div class="settings-placeholder__icon">🚧</div>
      <h2 class="agent-settings-feature-title">{{ pageTitle }}</h2>
      <p class="agent-settings-feature-description">该功能页面正在开发中，敬请期待。</p>
    </section>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { DataTable, TimeDurationInput, type TableColumn } from "@twt/ui-agent";
import { FEATURES } from "../lib/plan";
import { usePlan } from "../composables/usePlan";
import SettingsAgentsPage from "./SettingsAgentsPage.vue";
import SettingsAgentDetailPage from "./SettingsAgentDetailPage.vue";
import SettingsRoleDetailPage from "./SettingsRoleDetailPage.vue";
import SettingsRolesPage from "./SettingsRolesPage.vue";

type SettingsNavKey = "install" | "website-code" | "customize" | "agents" | "roles" | "team" | "quick-reply" | "personal-reply" | "idle-conversation" | "visitor-tags" | "conversation-tags" | "blacklist" | "trusted-domains" | "dev-settings" | "webhooks";

interface ChatParameterRow extends Record<string, unknown> {
  param: string;
  desc: string;
}

const props = defineProps<{
  activeKey: SettingsNavKey;
}>();

const pageTitleMap: Record<SettingsNavKey, string> = {
  install: "聊天页面",
  "website-code": "网站代码",
  customize: "自定义",
  agents: "成员",
  roles: "角色",
  team: "成员设置",
  "quick-reply": "公共回复",
  "personal-reply": "个人回复",
  "idle-conversation": "闲置会话",
  "visitor-tags": "访客标签",
  "conversation-tags": "会话标签",
  blacklist: "黑名单",
  "trusted-domains": "信任域名",
  "dev-settings": "开发设置",
  webhooks: "Webhooks"
};

const pageTitle = computed(() => pageTitleMap[props.activeKey]);

const emit = defineEmits<{
  (e: "toast", message: string): void;
}>();

const { canUse, guardFeature } = usePlan();

const chatPageBaseUrl = "https://visitorchat.twt.com/direct/040d99be00d826dd0ae83d6b2255df59";
const htmlDeploymentFileName = "twt-chat.html";

/* Agent detail page */
interface AgentDetailData {
  id: string;
  name?: string;
  nickname?: string;
  email?: string;
  roleName?: string;
  sessionLimit?: number;
  avatarColor?: string;
  avatarText?: string;
  isSelf?: boolean;
}

const agentDetailAgent = ref<AgentDetailData | null>(null);

const handleViewAgentDetail = (agent: AgentDetailData) => {
  agentDetailAgent.value = { ...agent, isSelf: agent.id === "agent-cafe" };
};

const handleAgentDetailSave = (_data: { name: string; nickname: string; sessionLimit: string; email: string; project: string }) => {
  // stay on detail page, user clicks back button to return
};

/* Role detail page */
const roleDetailMode = ref<"" | "view" | "create" | "edit">("");
const roleDetailId = ref("");
const roleDetailName = ref("");
const roleDetailIsSystem = ref(false);
const roleDetailPerms = ref<string[]>([]);
const existingRoleNames = ["超级管理员", "客服", "高级客服", "主管"];

const handleRoleBack = () => {
  roleDetailMode.value = "";
};

const handleViewRole = (roleId: string) => {
  roleDetailId.value = roleId;
  if (roleId === "role-admin") {
    roleDetailName.value = "超级管理员";
    roleDetailIsSystem.value = true;
    roleDetailPerms.value = [];
  } else if (roleId === "role-agent") {
    roleDetailName.value = "客服";
    roleDetailIsSystem.value = true;
    roleDetailPerms.value = [
      "archive-conversation", "archive-conversation-manage",
      "archive-chat", "archive-chat-manage",
      "visitor-online", "visitor-online-manage",
      "visitor-all", "visitor-all-manage",
      "customer-online", "customer-online-manage",
      "customer-all", "customer-all-manage",
      "campaign-mass", "campaign-mass-manage",
      "campaign-proactive", "campaign-proactive-manage",
      "visitor-tags", "visitor-tags-manage",
      "conversation-tags", "conversation-tags-manage",
      "agent", "agent-manage",
      "public-reply", "public-reply-manage",
      "personal-reply", "personal-reply-manage"
    ];
  } else {
    roleDetailName.value = roleId === "role-senior" ? "高级客服" : "主管";
    roleDetailIsSystem.value = false;
    roleDetailPerms.value = [
      "archive-conversation", "archive-conversation-manage",
      "visitor-online", "visitor-online-manage",
      "report-overview", "report-overview-view",
      "report-evaluation", "report-evaluation-view",
      "public-reply", "public-reply-manage",
      "personal-reply", "personal-reply-manage",
      ...(roleId === "role-supervisor" ? ["agent", "agent-manage", "role", "role-manage"] : [])
    ];
  }
  roleDetailMode.value = "view";
};

const handleEditRole = (roleId: string) => {
  handleViewRole(roleId);
  roleDetailMode.value = "edit";
};

const handleCreateRole = () => {
  roleDetailId.value = "";
  roleDetailName.value = "";
  roleDetailIsSystem.value = false;
  roleDetailPerms.value = [];
  roleDetailMode.value = "create";
};

const handleRoleSave = (_payload: { name: string; permissions: string[] }) => {
  const msg = roleDetailMode.value === "create" ? "新增成功" : "编辑成功";
  roleDetailMode.value = "";
  emitToast(msg);
};

const chatParamColumns: TableColumn<ChatParameterRow>[] = [
  { key: "param", title: "参数名", width: "32%" },
  { key: "desc", title: "说明" }
];

const chatParamRows: ChatParameterRow[] = [
  { param: "sbs", desc: "用户唯一标识" },
  { param: "sbs_mm", desc: "用户签名" },
  { param: "ranstr", desc: "随机字符串（建议16位以上）" }
];

const agentIdleEnabled = ref(false);
const agentIdleSeconds = ref(600);
const sessionTimeoutEnabled = ref(true);
const sessionTimeoutSeconds = ref(540);

const quickReplies = ref<string[]>([
  "你好，已收到你的问题，我马上为你处理。",
  "请稍等 1-2 分钟，我正在核对订单信息。",
  "如果方便，请提供一下订单号或邮箱。"
]);
const quickReplyDraft = ref("");

const languageExampleUrl = computed(() => `${chatPageBaseUrl}?lang=en`);
const customerSignExampleUrl = computed(() => `${chatPageBaseUrl}?sbs={sbs}&sbs_mm={sbs_mm}&ranstr={ranstr}`);

const emitToast = (message: string) => emit("toast", message);

const copyChatPageUrl = async () => {
  if (!navigator?.clipboard?.writeText) {
    emitToast("当前浏览器不支持复制，请手动复制链接。");
    return;
  }
  try {
    await navigator.clipboard.writeText(chatPageBaseUrl);
    emitToast("复制成功");
  } catch {
    emitToast("复制失败，请稍后重试。");
  }
};

const escapeHtmlAttribute = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const createHtmlDeploymentContent = (chatUrl: string) => {
  const safeChatUrl = escapeHtmlAttribute(chatUrl);
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <title>在线客服</title>
  <style>
    html, body {
      margin: 0;
      padding: 0;
      width: 100%;
      height: 100%;
      min-height: 100dvh;
      overflow: hidden;
      background-color: #f9f9f9;
    }
    body {
      padding:
        env(safe-area-inset-top)
        env(safe-area-inset-right)
        env(safe-area-inset-bottom)
        env(safe-area-inset-left);
      box-sizing: border-box;
    }
    .chat-frame {
      width: 100%;
      height: 100%;
      min-height: 100dvh;
      border: none;
      display: block;
    }
  </style>
</head>
<body>
  <iframe
    class="chat-frame"
    src="${safeChatUrl}"
    allow="camera; microphone; fullscreen; display-capture"
    title="Chat Widget"
  ></iframe>
</body>
</html>`;
};

const downloadHtmlDeployment = () => {
  try {
    if (!chatPageBaseUrl.trim()) {
      emitToast("链接加载失败，请刷新后重试。");
      return;
    }
    if (!("download" in HTMLAnchorElement.prototype)) {
      emitToast("当前浏览器不支持文件下载，请更换浏览器后重试。");
      return;
    }
    const htmlContent = createHtmlDeploymentContent(chatPageBaseUrl);
    const htmlBlob = new Blob([htmlContent], { type: "text/html;charset=utf-8" });
    const objectUrl = window.URL.createObjectURL(htmlBlob);

    const anchor = document.createElement("a");
    anchor.href = objectUrl;
    anchor.download = htmlDeploymentFileName;
    anchor.rel = "noopener";
    anchor.style.display = "none";

    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    window.setTimeout(() => {
      window.URL.revokeObjectURL(objectUrl);
    }, 0);
  } catch (error) {
    console.error("Failed to generate html deployment file:", error);
    emitToast("下载失败，请检查浏览器下载权限后重试。");
  }
};

/* Webhooks */
interface WebhookTableRow extends Record<string, unknown> {
  param: string;
  desc: string;
  example: string;
}

const webhookUrl = ref("");
const unrepliedEventEnabled = ref(canUse(FEATURES.WEBHOOKS));
const unrepliedFirstSeconds = ref(60);
const unrepliedRepeatSeconds = ref(600);

const toggleUnrepliedEvent = () => {
  const next = !unrepliedEventEnabled.value;
  if (next && !guardFeature(FEATURES.WEBHOOKS)) return;
  unrepliedEventEnabled.value = next;
};

const webhookBodyColumns: TableColumn<WebhookTableRow>[] = [
  { key: "param", title: "参数名", width: "25%" },
  { key: "desc", title: "说明", width: "35%" },
  { key: "example", title: "参数示例" }
];

const webhookBodyRows: WebhookTableRow[] = [
  { param: "created_at", desc: "webhook 发送日期（时间戳）", example: "1765439941" },
  { param: "event", desc: "事件名称", example: "UNREPLIED" },
  { param: "webhook_id", desc: "唯一的 webhook ID", example: "58946f5f583edd94f5cf87e3534d04fb" },
  { param: "content", desc: "包含特定事件数据的对象", example: "-" }
];

const unrepliedContentColumns: TableColumn<WebhookTableRow>[] = [
  { key: "param", title: "参数名", width: "25%" },
  { key: "desc", title: "说明", width: "35%" },
  { key: "example", title: "参数示例" }
];

const unrepliedContentRows: WebhookTableRow[] = [
  { param: "content", desc: "-", example: "-" },
  { param: "subject", desc: "会话主题", example: "New Conversation" },
  { param: "visitor_name", desc: "访客姓名", example: "Visitor15" },
  { param: "created_at", desc: "消息创建时间", example: "1765439652" },
  { param: "message_content", desc: "消息内容", example: "1" },
  { param: "property_name", desc: "项目名称", example: "test" },
  { param: "visitor_nickname", desc: "访客备注名", example: "VIP" },
  { param: "sbs", desc: "客户标识", example: "234442313" },
  { param: "status", desc: "状态", example: "1: 待回复 2: 排队中 3: 待处理 4: 已回复" },
  { param: "push_times", desc: "推送次数", example: "4" },
  { param: "time_sec", desc: "超时时间（秒）", example: "289" },
  { param: "assigned_agent_nickname", desc: "服务客服名称", example: "ctccccd" }
];

const addQuickReply = () => {
  const next = quickReplyDraft.value.trim();
  if (!next) return;
  quickReplies.value = [next, ...quickReplies.value.filter((item) => item !== next)];
  quickReplyDraft.value = "";
  emitToast("快捷回复已添加");
};

const removeQuickReply = (target: string) => {
  quickReplies.value = quickReplies.value.filter((item) => item !== target);
  emitToast("快捷回复已删除");
};

</script>

<style scoped>
.settings-page {
  align-items: center;
  gap: var(--agent-space-16);
}

.settings-page--agents {
  align-items: stretch;
  gap: 0;
  overflow: hidden;
  padding: 0;
}

.settings-page > * {
  max-width: 1080px;
  width: 100%;
}

.settings-page--agents > * {
  max-width: none;
}

.settings-install {
  display: flex;
  flex-direction: column;
  gap: var(--agent-space-16);
}

.settings-card {
  border-radius: 24px;
  display: flex;
  flex-direction: column;
  gap: var(--agent-space-16);
  padding: var(--agent-space-24);
}

.settings-card__title,
.settings-card__description {
  margin: 0;
}

.settings-card__title-row {
  align-items: center;
  display: flex;
  justify-content: space-between;
}

.settings-link-row {
  align-items: center;
  display: flex;
  gap: var(--agent-space-12);
}

.settings-link-input {
  background: var(--agent-color-bg-muted);
  border-radius: 16px;
  font-size: var(--agent-font-size-lg);
  line-height: 1.4;
  padding: 12px 14px;
}

.settings-copy-btn {
  border-radius: 16px;
  font-size: var(--agent-font-size-md);
  min-width: 84px;
  padding: 10px 18px;
}

.settings-card--html-download {
  gap: var(--agent-space-16);
}

.html-download-head {
  align-items: flex-start;
  display: flex;
}

.html-download-meta {
  display: flex;
  flex-direction: column;
  gap: var(--agent-space-8);
  min-width: 0;
}

.html-download-steps {
  align-items: stretch;
  display: grid;
  gap: 48px;
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.html-download-step {
  background: var(--agent-color-bg-muted);
  border: 1px solid var(--agent-color-border-default);
  border-radius: 18px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  justify-content: center;
  min-height: 96px;
  padding: 16px var(--agent-space-16) 14px;
  position: relative;
}

.html-download-step:not(:last-child)::after {
  border-top: 2px dashed #c9d2e2;
  content: "";
  position: absolute;
  right: -34px;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
}

.html-download-step__main {
  align-items: center;
  display: flex;
  gap: var(--agent-space-12);
}

.html-download-step__icon {
  align-items: center;
  color: #1f2430;
  display: inline-flex;
  flex-shrink: 0;
  height: 22px;
  justify-content: center;
  width: 22px;
}

.html-download-step__icon svg {
  height: 22px;
  width: 22px;
}

.html-download-step__title {
  color: var(--agent-color-text-primary);
  font-size: 18px;
  font-weight: var(--agent-font-weight-semibold);
  line-height: 1.35;
  margin: 0;
}

.html-download-step__link {
  background: transparent;
  border: 0;
  color: var(--agent-color-brand-primary);
  cursor: pointer;
  font-size: var(--agent-font-size-sm);
  font-weight: var(--agent-font-weight-medium);
  line-height: 1;
  margin-left: calc(22px + var(--agent-space-12));
  padding: 0;
  text-align: left;
}

.html-download-step__link:hover {
  text-decoration: underline;
}

.settings-step {
  display: flex;
  flex-direction: column;
  gap: var(--agent-space-12);
}

.settings-step__title {
  color: var(--agent-color-text-primary);
  font-size: var(--agent-font-size-md);
  line-height: 1.5;
  margin: 0;
}

.settings-step code {
  background: rgba(47, 107, 255, 0.08);
  border-radius: var(--agent-radius-sm);
  color: var(--agent-color-text-primary);
  font-size: 0.92em;
  padding: 2px 6px;
}

.settings-example {
  background: var(--agent-color-bg-muted);
  border-radius: 16px;
  color: var(--agent-color-text-secondary);
  font-size: var(--agent-font-size-sm);
  line-height: 1.45;
  padding: 12px 14px;
  word-break: break-all;
}

.settings-tip {
  color: var(--agent-color-text-tertiary);
  font-size: var(--agent-font-size-sm);
  line-height: 1.55;
  margin: 0;
}

.settings-team-page {
  display: flex;
  flex-direction: column;
  gap: var(--agent-space-16);
}

.settings-card__inline-desc {
  align-items: center;
  color: var(--agent-color-text-secondary);
  display: flex;
  flex-wrap: wrap;
  font-size: var(--agent-font-size-sm);
  gap: var(--agent-space-8);
  line-height: 1.6;
  margin: 0;
}

.settings-toggle {
  align-items: center;
  background: var(--agent-color-bg-muted);
  border: 1px solid var(--agent-color-border-default);
  border-radius: 999px;
  cursor: pointer;
  display: inline-flex;
  flex-shrink: 0;
  height: 28px;
  padding: 2px;
  transition: background var(--agent-motion-fast), border-color var(--agent-motion-fast);
  width: 48px;
}

.settings-toggle--on {
  background: var(--agent-color-brand-primary);
  border-color: var(--agent-color-brand-primary);
}

.settings-toggle__thumb {
  background: #ffffff;
  border-radius: 50%;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
  display: block;
  height: 22px;
  transition: transform var(--agent-motion-fast);
  width: 22px;
}

.settings-toggle--on .settings-toggle__thumb {
  transform: translateX(20px);
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
  color: var(--agent-color-text-primary);
  font-size: var(--agent-font-size-sm);
  line-height: 1.4;
}

.quick-reply-item__remove {
  background: transparent;
  border: 0;
  color: var(--agent-color-status-error);
  cursor: pointer;
  font-size: var(--agent-font-size-sm);
  padding: 0;
}

.settings-placeholder {
  align-items: center;
  justify-content: center;
  min-height: 240px;
  text-align: center;
}

.settings-placeholder__icon {
  font-size: 48px;
  line-height: 1;
}

/* Webhooks page */
.settings-webhooks {
  display: flex;
  flex-direction: column;
  gap: var(--agent-space-16);
}

.webhooks-subtitle {
  color: var(--agent-color-text-secondary);
  font-size: var(--agent-font-size-sm);
  margin: 0;
}

.webhooks-event-card {
  background: var(--agent-color-bg-muted);
  border: 1px solid var(--agent-color-border-default);
  border-radius: var(--agent-radius-lg);
  display: flex;
  flex-direction: column;
  gap: var(--agent-space-12);
  padding: var(--agent-space-16) var(--agent-space-20);
}

.webhooks-event-card__header {
  align-items: center;
  display: flex;
  justify-content: space-between;
}

.webhooks-event-card__name {
  color: var(--agent-color-text-primary);
  font-size: var(--agent-font-size-md);
  font-weight: var(--agent-font-weight-semibold);
}

.webhooks-link-text {
  color: #75869c;
  font-size: var(--agent-font-size-sm);
  margin: 0;
}

.webhooks-steps {
  display: flex;
  flex-direction: column;
  gap: var(--agent-space-8);
}

.webhooks-step {
  color: var(--agent-color-text-primary);
  font-size: var(--agent-font-size-sm);
  line-height: 1.6;
  margin: 0;
}

.webhooks-section-title {
  color: var(--agent-color-text-primary);
  font-size: var(--agent-font-size-md);
  font-weight: var(--agent-font-weight-semibold);
  margin: var(--agent-space-8) 0 0;
}

.webhooks-hint {
  color: #75869c;
  font-size: var(--agent-font-size-sm);
  margin: 0 0 var(--agent-space-8);
}

.webhooks-hint-warn {
  color: #75869c;
  font-size: var(--agent-font-size-sm);
  line-height: 1.5;
  margin: 0 0 var(--agent-space-8);
  text-decoration: underline;
}

.webhooks-code-block {
  background: var(--agent-color-bg-muted);
  border-radius: var(--agent-radius-lg);
  overflow-x: auto;
  padding: var(--agent-space-16) var(--agent-space-20);
}

.webhooks-code-block pre {
  margin: 0;
}

.webhooks-code-block code {
  color: var(--agent-color-text-primary);
  font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
  font-size: var(--agent-font-size-sm);
  line-height: 1.6;
  white-space: pre;
}

/* Layout mode switcher */
.layout-switcher {
  display: flex;
  gap: var(--agent-space-8);
  flex-wrap: wrap;
}

.layout-switcher__pill {
  background: var(--agent-color-bg-muted);
  border: 1px solid var(--agent-color-border-default);
  border-radius: 999px;
  color: var(--agent-color-text-secondary);
  cursor: pointer;
  font-size: var(--agent-font-size-sm);
  font-weight: var(--agent-font-weight-medium);
  padding: 6px 16px;
  transition: background 0.15s, color 0.15s, border-color 0.15s;
}

.layout-switcher__pill:hover {
  border-color: var(--agent-color-brand-primary);
  color: var(--agent-color-brand-primary);
}

.layout-switcher__pill--active {
  background: var(--agent-color-brand-primary);
  border-color: var(--agent-color-brand-primary);
  color: #ffffff;
}

.layout-switcher__pill--active:hover {
  background: var(--agent-color-brand-primary);
  border-color: var(--agent-color-brand-primary);
  color: #ffffff;
}

/* Tab bar (standalone) */
.install-tabs-bar {
  border-bottom: 1px solid var(--agent-color-border-default);
  display: flex;
  gap: 2px;
}

.install-tabs-bar__tab {
  background: transparent;
  border: 0;
  color: var(--agent-color-text-secondary);
  cursor: pointer;
  font-size: var(--agent-font-size-sm);
  font-weight: var(--agent-font-weight-semibold);
  height: 48px;
  padding: 0 16px;
  position: relative;
  transition: color 0.15s;
}

.install-tabs-bar__tab:hover {
  color: var(--agent-color-text-primary);
}

.install-tabs-bar__tab--active {
  color: var(--agent-color-brand-primary);
}

.install-tabs-bar__tab--active::after {
  background: var(--agent-color-brand-primary);
  border-radius: 2px 2px 0 0;
  bottom: 0;
  content: "";
  height: 3px;
  left: 16px;
  position: absolute;
  right: 16px;
}

/* HTML tab two-column grid */
.html-tab-grid {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: var(--agent-space-16);
  align-items: start;
}

.html-tab-main {
  border-radius: 24px;
  display: flex;
  flex-direction: column;
  gap: var(--agent-space-24);
  padding: var(--agent-space-24);
}

.html-tab-header {
  display: flex;
  align-items: flex-start;
  gap: var(--agent-space-16);
}

.html-tab-icon-wrap {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: rgba(47, 107, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.html-tab-icon-wrap::before {
  content: "";
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid var(--agent-color-brand-primary);
}

.html-tab-header__text {
  display: flex;
  flex-direction: column;
  gap: var(--agent-space-8);
}

/* Horizontal stepper */
.html-stepper {
  display: flex;
  align-items: flex-start;
  padding: var(--agent-space-8) 0;
}

.html-stepper__step {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  flex: 1;
  gap: 6px;
}

.html-stepper__circle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid var(--agent-color-border-default);
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--agent-font-size-sm);
  font-weight: var(--agent-font-weight-semibold);
  color: var(--agent-color-text-secondary);
}

.html-stepper__step--done .html-stepper__circle {
  background: var(--agent-color-brand-primary);
  border-color: var(--agent-color-brand-primary);
  color: #ffffff;
}

.html-stepper__connector {
  height: 2px;
  flex: 0.5;
  background: var(--agent-color-border-default);
  margin-top: 19px;
}

.html-stepper__title {
  font-size: var(--agent-font-size-sm);
  font-weight: var(--agent-font-weight-semibold);
  color: var(--agent-color-text-primary);
  margin: 0;
}

.html-stepper__desc {
  font-size: var(--agent-font-size-xs);
  color: var(--agent-color-text-tertiary);
  margin: 0;
}

/* Download CTA bar */
.html-download-cta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--agent-space-16);
  background: var(--agent-color-bg-muted);
  border-radius: 14px;
  padding: var(--agent-space-16) var(--agent-space-24);
}

.html-download-cta__title {
  font-size: var(--agent-font-size-md);
  font-weight: var(--agent-font-weight-semibold);
  color: var(--agent-color-text-primary);
  margin: 0;
}

.html-download-cta__desc {
  font-size: var(--agent-font-size-xs);
  color: var(--agent-color-text-tertiary);
  margin: 4px 0 0;
}

.html-download-cta__btn {
  border-radius: 12px;
  padding: 10px 24px;
  white-space: nowrap;
}

/* Sidebar cards */
.html-tab-sidebar {
  display: flex;
  flex-direction: column;
  gap: var(--agent-space-16);
}

.sidebar-card {
  border-radius: 16px;
  padding: var(--agent-space-24);
  display: flex;
  flex-direction: column;
  gap: var(--agent-space-12);
}

.sidebar-card__title {
  font-size: var(--agent-font-size-md);
  font-weight: var(--agent-font-weight-semibold);
  color: var(--agent-color-text-primary);
  margin: 0;
}

.sidebar-card__desc {
  font-size: var(--agent-font-size-sm);
  color: var(--agent-color-text-secondary);
  line-height: 1.5;
  margin: 0;
}

.sidebar-benefit-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: var(--agent-space-12);
}

.sidebar-benefit-item {
  display: flex;
  align-items: flex-start;
  gap: var(--agent-space-8);
  font-size: var(--agent-font-size-sm);
  color: var(--agent-color-text-secondary);
  line-height: 1.5;
}

.sidebar-benefit-item::before {
  content: "\2713";
  color: var(--agent-color-brand-primary);
  font-weight: 700;
  flex-shrink: 0;
  margin-top: 1px;
}

/* Collapsible advanced config */
.advanced-config {
  border-radius: 16px;
}

.advanced-config__toggle {
  width: 100%;
  display: flex;
  align-items: center;
  gap: var(--agent-space-8);
  padding: var(--agent-space-16) var(--agent-space-24);
  background: transparent;
  border: 0;
  cursor: pointer;
  font-size: var(--agent-font-size-md);
  font-weight: var(--agent-font-weight-semibold);
  color: var(--agent-color-text-primary);
  text-align: left;
}

.advanced-config__code-icon {
  color: var(--agent-color-text-tertiary);
  font-family: monospace;
  font-size: var(--agent-font-size-sm);
}

.advanced-config__chevron {
  margin-left: auto;
  display: inline-block;
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 6px solid var(--agent-color-text-tertiary);
  transition: transform 0.2s;
}

.advanced-config__chevron--open {
  transform: rotate(180deg);
}

.advanced-config__body {
  padding: 0 var(--agent-space-24) var(--agent-space-24);
  display: flex;
  flex-direction: column;
  gap: var(--agent-space-16);
}

@media (max-width: 1280px) {
  .settings-card {
    border-radius: 16px;
    padding: var(--agent-space-16);
  }

  .settings-step__title,
  .settings-example,
  .settings-tip,
  .settings-link-input,
  .settings-copy-btn {
    font-size: var(--agent-font-size-md);
  }

  .html-download-steps {
    grid-template-columns: 1fr;
    gap: var(--agent-space-12);
  }

  .html-download-step {
    align-items: flex-start;
  }

  .html-download-step:not(:last-child)::after {
    display: none;
  }

  .html-download-step__title {
    font-size: var(--agent-font-size-md);
  }

  .html-download-step__link {
    margin-left: calc(22px + var(--agent-space-12));
  }

  .html-tab-grid {
    grid-template-columns: 1fr;
  }

  .html-tab-main {
    border-radius: 16px;
  }

  .advanced-config__toggle {
    padding: var(--agent-space-12) var(--agent-space-16);
  }

  .advanced-config__body {
    padding: 0 var(--agent-space-16) var(--agent-space-16);
  }
}
</style>
