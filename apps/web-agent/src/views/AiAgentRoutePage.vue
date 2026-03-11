<template>
  <section class="agent-content-page ai-agent-page">
    <template v-if="activeKey === 'copilot-settings'">
      <header class="agent-content-header">
        <h1 class="agent-content-title">Copilot设置</h1>
        <p class="agent-content-subtitle">使用 Copilot 工具在客服对话中提供智能辅助功能。</p>
      </header>

      <CopilotPromoBanner
        v-if="showBanner"
        title="以智能驱动服务，助力业务增长"
        description="通过 Copilot 提升响应速度与服务满意度。将每一次咨询转化为高质量的互动，让智能客服成为你业务转化的核心驱动力。"
        @close="showBanner = false"
        @learn="emitToast('文档功能开发中')"
      />

      <div class="ai-agent-page__list">
        <CopilotSettingItem
          v-for="item in copilotSettings"
          :key="item.key"
          :description="item.description"
          :model-value="item.enabled"
          :title="item.title"
          @update:model-value="updateCopilotSetting(item.key, $event)"
        />
      </div>
    </template>

    <template v-else-if="activeKey === 'ai-agent-config'">
      <header class="agent-content-header agent-config-header">
        <div class="agent-config-header__content">
          <div class="agent-config-header__title-row">
            <h1 class="agent-content-title">AI Agent</h1>
            <span class="agent-config-header__status" :class="agentEnabled ? 'agent-config-header__status--active' : 'agent-config-header__status--inactive'">
              {{ agentEnabled ? '已开启' : '已关闭' }}
            </span>
          </div>
          <p class="agent-content-subtitle">开启后，AI Agent 将自动回复访客咨询，根据知识库内容智能回复，并在需要时转接人工客服</p>
        </div>

        <div class="agent-config-header__actions">
          <button
            type="button"
            class="agent-btn"
            :class="agentEnabled ? 'agent-btn--ghost' : 'agent-btn--primary'"
            @click="toggleAgentLiveStatus"
          >
            {{ launchActionLabel }}
          </button>
        </div>
      </header>

      <nav class="config-tabs">
        <button
          type="button"
          class="config-tabs__item"
          :class="{ 'config-tabs__item--active': configTab === 'deploy' }"
          @click="configTab = 'deploy'"
        >AI Agent 部署</button>
        <button
          type="button"
          class="config-tabs__item"
          :class="{ 'config-tabs__item--active': configTab === 'settings' }"
          @click="configTab = 'settings'"
        >AI Agent 设置</button>
      </nav>

      <AiAgentDeployFlow
        v-if="configTab === 'deploy'"
        :sections="deployLifecycleSections"
        :open-card-key="openLifecycleCard"
        :visitor-audience="visitorAudience"
        :agent-response-mode="agentResponseMode"
        :show-message-agent-label="showMessageAgentLabel"
        :bot-avatar-url="botAvatarUrl"
        :bot-name="botName"
        :bot-name-touched="botNameTouched"
        :bot-intro="botIntro"
        :selected-tone="selectedTone"
        :default-language="defaultLanguage"
        :reply-mode="replyMode"
        :knowledge-doc-count="knowledgeDocCount"
        :unsupported-question-message="unsupportedQuestionMessage"
        :unsupported-message-touched="unsupportedMessageTouched"
        :transfer-enabled="transferEnabled"
        :transfer-message="transferMessage"
        :transfer-message-touched="transferMessageTouched"
        :offline-message="offlineMessage"
        :offline-message-touched="offlineMessageTouched"
        :follow-up-enabled="followUpEnabled"
        :follow-up-message="followUpMessage"
        :follow-up-message-touched="followUpMessageTouched"
        :idle-hours="idleHours"
        :idle-minutes="idleMinutes"
        :idle-seconds="idleSeconds"
        :avatar-fallback-text="avatarFallbackText"
        @toggle-card="toggleLifecycleCard"
        @update:field="handleDeployFieldUpdate"
        @update:touched="handleDeployTouchedUpdate"
        @trigger-avatar-select="triggerBotAvatarSelect"
        @nav-change="emit('nav-change', $event)"
      />

      <div v-else-if="configTab === 'settings'" class="settings-panel">
        <div class="settings-section agent-panel">
          <h3 class="settings-section__title">基本信息</h3>
          <p class="settings-section__desc"> </p>

          <div class="settings-form">
            <div class="form-row">
              <div class="form-row__label">
                <span class="form-row__name">头像</span>
                <span class="form-row__desc">设置 AI Agent 的头像，用于会话列表中展示</span>
              </div>
              <div class="form-row__control form-row__control--stack">
                <div class="bot-avatar-upload">
                  <div class="bot-avatar-upload__preview" :class="{ 'bot-avatar-upload__preview--image': Boolean(botAvatarUrl) }">
                    <img v-if="botAvatarUrl" :src="botAvatarUrl" alt="AI Agent 头像" class="bot-avatar-upload__image" />
                    <span v-else class="bot-avatar-upload__fallback">{{ avatarFallbackText }}</span>
                  </div>
                  <div class="bot-avatar-upload__actions">
                    <button type="button" class="agent-btn agent-btn--ghost" @click="triggerBotAvatarSelect">
                      {{ botAvatarUrl ? '重新上传' : '上传头像' }}
                    </button>
                  </div>
                  <input
                    ref="avatarInputRef"
                    type="file"
                    accept="image/png,image/jpeg,image/jpg"
                    class="bot-avatar-upload__input"
                    @change="handleAvatarFileChange"
                  />
                </div>
              </div>
            </div>

            <div class="form-row">
              <div class="form-row__label">
                <span class="form-row__name">昵称</span>
                <span class="form-row__desc">当访客询问"你是谁"时，AI Agent 会使用这个昵称</span>
              </div>
              <div class="form-row__control">
                <input
                  v-model="botName"
                  class="agent-input"
                  :class="{ 'agent-input--error': botNameTouched && !botName.trim() }"
                  maxlength="64"
                  placeholder="请输入昵称"
                  @blur="botNameTouched = true"
                />
                <p v-if="botNameTouched && !botName.trim()" class="form-row__error">请输入昵称</p>
              </div>
            </div>

            <div class="form-row">
              <div class="form-row__label">
                <span class="form-row__name">业务简介</span>
                <span class="form-row__desc">描述你的业务和服务范围，AI Agent 会据此生成更贴合场景的回答</span>
              </div>
              <div class="form-row__control">
                <textarea
                  v-model="botIntro"
                  class="agent-input form-row__textarea"
                  rows="5"
                  maxlength="2000"
                  placeholder="请输入"
                />
              </div>
            </div>
          </div>
        </div>

        <div class="settings-section agent-panel">
          <h3 class="settings-section__title">回复风格</h3>
          <p class="settings-section__desc"> </p>

          <div class="settings-form">
            <div class="form-row">
              <div class="form-row__label">
                <span class="form-row__name">回复语气</span>
                <span class="form-row__desc">设置 AI Agent 的表达风格，保证对外沟通体验一致</span>
              </div>
              <div class="form-row__control">
                <div class="bot-chips-group">
                  <button
                    v-for="tone in toneOptions"
                    :key="tone.value"
                    type="button"
                    class="bot-chip"
                    :class="{ 'bot-chip--active': selectedTone === tone.value }"
                    @click="selectedTone = tone.value"
                  >{{ tone.label }}</button>
                </div>
              </div>
            </div>

            <div class="form-row">
              <div class="form-row__label">
                <span class="form-row__name">默认语言</span>
                <span class="form-row__desc">当 AI Agent 无法判断访客语言时，将使用该语言进行回复</span>
              </div>
              <div class="form-row__control">
                <select v-model="defaultLanguage" class="agent-input">
                  <option
                    v-for="language in languageOptions"
                    :key="language.value"
                    :value="language.value"
                  >{{ language.label }}</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="ai-agent-page__footer">
        <button
          type="button"
          class="agent-btn agent-btn--primary"
          @click="saveAllChanges"
        >
          保存
        </button>
      </div>

    </template>

    <!-- 原有的占位页面 -->
    <section v-else class="ai-agent-page__placeholder agent-panel">
      <h2 class="agent-settings-feature-title">{{ activeSectionLabel }}</h2>
      <p class="agent-settings-feature-description">
        {{ activeKey === "doc-knowledge" ? "文档知识管理页面建设中。" : "常见问题管理页面建设中。" }}
      </p>
      <button type="button" class="agent-btn agent-btn--ghost" @click="emitToast('功能开发中')">了解更多</button>
    </section>
    <UnsavedChangesModal :open="unsavedChangesModalOpen" @cancel="cancelPendingNavigation" @confirm="confirmPendingNavigation" />

    <AiAgentImageCropModal
      :open="cropModalOpen"
      :image-src="cropImageSource"
      @close="cropModalOpen = false"
      @confirm="handleCroppedImage"
    />
  </section>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { CopilotPromoBanner, CopilotSettingItem, UnsavedChangesModal } from "@twt/ui-agent";
import {
  type StoredAiAgentSettings,
  loadStoredAiAgentSettings,
  persistStoredAiAgentSettings
} from "../lib/aiAgentSettings";
import AiAgentDeployFlow from "../components/ai-agent/AiAgentDeployFlow.vue";
import AiAgentImageCropModal from "../components/ai-agent/AiAgentImageCropModal.vue";

type AiAgentNavKey = "doc-knowledge" | "faq" | "copilot-settings" | "ai-agent-config";

type AudienceType = "all" | "visitor" | "customer";
type LifecycleSectionKey = "entry" | "answering" | "fallback" | "idle";
type LifecycleCardKey =
  | "entry-routing"
  | "entry-visibility"
  | "identity-profile"
  | "identity-style"
  | "answering-mode"
  | "answering-knowledge"
  | "answering-unsupported"
  | "fallback-transfer"
  | "idle-autoclose"
  | "idle-followup";

interface CopilotSetting {
  key: string;
  title: string;
  description: string;
  enabled: boolean;
}

interface LifecycleCard {
  key: LifecycleCardKey;
  title: string;
  summary: string;
  badge?: string;
  badgeTone?: "warning" | "default";
}

interface LifecycleSection {
  key: LifecycleSectionKey;
  title: string;
  icon: "customer" | "ai-agent" | "service" | "calendar";
  cards: LifecycleCard[];
}

const lifecycleCardKeys: LifecycleCardKey[] = [
  "entry-routing",
  "entry-visibility",
  "identity-profile",
  "identity-style",
  "answering-mode",
  "answering-knowledge",
  "answering-unsupported",
  "fallback-transfer",
  "idle-followup",
  "idle-autoclose"
];

const lifecycleCardFieldMap: Record<LifecycleCardKey, Array<keyof StoredAiAgentSettings>> = {
  "entry-routing": ["visitorAudience", "agentResponseMode"],
  "entry-visibility": ["showMessageAgentLabel"],
  "identity-profile": ["botAvatarUrl", "botName", "botIntro"],
  "identity-style": ["selectedTone", "defaultLanguage"],
  "answering-mode": ["replyMode"],
  "answering-knowledge": [],
  "answering-unsupported": ["unsupportedQuestionMessage"],
  "fallback-transfer": ["transferEnabled", "transferMessage", "offlineMessage"],
  "idle-followup": ["followUpEnabled", "followUpMessage"],
  "idle-autoclose": ["idleHours", "idleMinutes", "idleSeconds"]
};

const props = defineProps<{
  activeKey: AiAgentNavKey;
}>();

const emit = defineEmits<{
  (e: "toast", message: string): void;
  (e: "dirty-change", dirty: boolean): void;
  (e: "nav-change", key: string): void;
}>();

const AVATAR_MAX_SIZE = 10 * 1024 * 1024; // 10MB

type ConfigTab = "deploy" | "settings";

const showBanner = ref(true);
const configTab = ref<ConfigTab>("deploy");
const openLifecycleCard = ref<LifecycleCardKey | null>(null);
const agentEnabled = ref(true);

const copilotSettings = ref<CopilotSetting[]>([
  { key: "auto-suggest", title: "自动推荐回复", description: "针对访客咨询，自动生成推荐回复。", enabled: true },
  { key: "chat-translation", title: "聊天翻译", description: "访客发送的消息将被自动翻译。", enabled: true },
  { key: "side-translation", title: "边写边译", description: "客服发送的消息将被自动翻译。", enabled: true },
  {
    key: "text-polish",
    title: "文本润色",
    description: "借助 AI 优化客服回复内容，支持润色、丰富内容、精简内容等。",
    enabled: true
  }
]);

const botAvatarUrl = ref("");
const botName = ref("AI Agent");
const botIntro = ref("");
const selectedTone = ref("friendly");
const defaultLanguage = ref("en");
const toneOptions = [
  { value: "friendly", label: "友好亲切" },
  { value: "professional", label: "专业严谨" },
  { value: "humorous", label: "幽默活泼" },
  { value: "concise", label: "简洁高效" }
];
const languageOptions = [
  { value: "en", label: "英语" },
  { value: "es", label: "西班牙语" },
  { value: "fr", label: "法语" },
  { value: "de", label: "德语" },
  { value: "pt", label: "葡萄牙语" },
  { value: "ru", label: "俄语" },
  { value: "zh-CN", label: "简体中文" },
  { value: "zh-TW", label: "繁体中文" },
  { value: "ja", label: "日语" },
  { value: "ko", label: "韩语" },
  { value: "vi", label: "越南语" },
  { value: "th", label: "泰语" },
  { value: "id", label: "印尼语" },
  { value: "ms", label: "马利西亚语" }
];

const audienceLabelMap: Record<AudienceType, string> = {
  all: "全部",
  visitor: "访客",
  customer: "客户"
};

const responseModeLabelMap: Record<string, string> = {
  always: "始终由 AI Agent 回复",
  "offline-only": "仅客服离线时"
};

const replyModeLabelMap: Record<string, string> = {
  strict: "严格模式",
  creative: "发散模式"
};

const agentResponseMode = ref("always");
const visitorAudience = ref<AudienceType>("all");
const showMessageAgentLabel = ref(true);
const visitorInactiveMinutes = ref(10);
const idleHours = ref(0);
const idleMinutes = ref(10);
const idleSeconds = ref(0);
const followUpEnabled = ref(false);
const followUpMessage = ref("你好，请问还有什么可以帮你的吗？如果没有其他问题，会话将在稍后自动关闭。");
const followUpMessageTouched = ref(false);
const replyMode = ref("strict");
const transferEnabled = ref(false);
const offlineMessage = ref("当前客服暂时不在线。你可以先留下问题或联系方式，我们会尽快与您联系。");
const transferMessage = ref("正在为你转接人工客服，请稍候");
const unsupportedQuestionMessage = ref("抱歉，我暂时无法处理这类内容，请用文字描述或换个问题");

const knowledgeDocCount = ref(3);

const avatarInputRef = ref<HTMLInputElement | null>(null);
const cropModalOpen = ref(false);
const cropImageSource = ref("");
const unsavedChangesModalOpen = ref(false);
const pendingNavigationAction = ref<(() => void) | null>(null);
const initializing = ref(true);
const botNameTouched = ref(false);
const transferMessageTouched = ref(false);
const offlineMessageTouched = ref(false);
const unsupportedMessageTouched = ref(false);

const emitToast = (message: string) => {
  emit("toast", message);
};

const activeSectionLabel = computed(() => {
  if (props.activeKey === "doc-knowledge") return "文档知识";
  if (props.activeKey === "faq") return "常见问题";
  return "Copilot设置";
});

const avatarFallbackText = computed(() => "🤖");

const idleSummaryText = computed(() => {
  const parts: string[] = [];
  if (idleHours.value > 0) parts.push(`${idleHours.value} 时`);
  if (idleMinutes.value > 0) parts.push(`${idleMinutes.value} 分`);
  if (idleSeconds.value > 0) parts.push(`${idleSeconds.value} 秒`);
  return parts.length > 0 ? `${parts.join(" ")}后自动关闭会话` : "0 秒后自动关闭会话";
});

const getToneLabel = (tone: string) => toneOptions.find((item) => item.value === tone)?.label ?? toneOptions[0].label;

const getLanguageLabel = (languageCode: string) => languageOptions.find((item) => item.value === languageCode)?.label ?? languageCode;

const resolveAudienceType = (value: unknown): AudienceType => {
  if (value === "visitor" || value === "customer") {
    return value;
  }

  return "all";
};

const normalizeInactiveMinutes = (value: unknown) => {
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) {
    return 10;
  }

  return Math.min(1440, Math.max(1, Math.round(numericValue)));
};

const lifecycleSections = computed<LifecycleSection[]>(() => {
  const hasIntro = botIntro.value.trim().length > 0;
  const hasUnsupportedReply = unsupportedQuestionMessage.value.trim().length > 0;
  const hasTransferReply = transferMessage.value.trim().length > 0;
  const hasOfflineReply = offlineMessage.value.trim().length > 0;
  const botLabel = botName.value.trim() || "未设置昵称";

  return [
    {
      key: "entry",
      title: "当访客发送第一条消息",
      icon: "customer",
      cards: [
        {
          key: "entry-routing",
          title: "AI Agent 将回复",
          summary: `${audienceLabelMap[visitorAudience.value]} · ${responseModeLabelMap[agentResponseMode.value] ?? responseModeLabelMap.always}`
        },
        {
          key: "entry-visibility",
          title: "AI Agent 标签",
          summary: showMessageAgentLabel.value ? "显示" : "不显示"
        }
      ]
    },
    {
      key: "answering",
      title: "当 AI Agent 回复访客",
      icon: "ai-agent",
      cards: [
        {
          key: "identity-profile",
          title: "AI 如何介绍自己",
          summary: `${botLabel} · ${hasIntro ? "已设置业务简介" : "未设置业务简介"}`,
          badge: botName.value.trim() ? undefined : "需要补充",
          badgeTone: botName.value.trim() ? undefined : "warning"
        },
        {
          key: "identity-style",
          title: "AI 使用什么语气和语言",
          summary: `${getToneLabel(selectedTone.value)} · ${getLanguageLabel(defaultLanguage.value)}`
        },
        {
          key: "answering-mode",
          title: "如何回复",
          summary: replyModeLabelMap[replyMode.value] ?? replyModeLabelMap.strict
        },
        {
          key: "answering-knowledge",
          title: "关联知识库",
          summary: `已关联 ${knowledgeDocCount.value} 篇知识库文档`
        }
      ]
    },
    {
      key: "fallback",
      title: "当 AI Agent 无法解决会话",
      icon: "service",
      cards: [
        {
          key: "answering-unsupported",
          title: "特殊场景",
          summary: hasUnsupportedReply ? " " : " ",
          badge: hasUnsupportedReply ? undefined : "需要补充",
          badgeTone: hasUnsupportedReply ? undefined : "warning"
        },
        {
          key: "fallback-transfer",
          title: "转接人工客服",
          summary: transferEnabled.value
            ? (hasTransferReply ? "转接人工客服" : "不转接人工客服")
            : (hasOfflineReply ? "不转接人工客服" : "不转接人工客服"),
          badge: (transferEnabled.value && !hasTransferReply) || !hasOfflineReply ? "需要补充" : undefined,
          badgeTone: (transferEnabled.value && !hasTransferReply) || !hasOfflineReply ? "warning" : undefined
        }
      ]
    },
    {
      key: "idle",
      title: "访客不活跃",
      icon: "calendar",
      cards: [
        {
          key: "idle-followup",
          title: "跟进",
          summary: followUpEnabled.value ? "5 分钟后发送跟进消息" : "不跟进"
        },
        {
          key: "idle-autoclose",
          title: "自动关闭空闲会话",
          summary: idleSummaryText.value
        }
      ]
    }
  ];
});

const deployLifecycleSections = computed<LifecycleSection[]>(() =>
  lifecycleSections.value.map((section) => {
    if (section.key !== "answering") return section;
    return {
      ...section,
      cards: section.cards.filter((c) => c.key !== "identity-profile" && c.key !== "identity-style")
    };
  })
);

const getCurrentSettings = (): StoredAiAgentSettings => ({
  agentEnabled: agentEnabled.value,
  agentResponseMode: agentResponseMode.value,
  visitorAudience: visitorAudience.value,
  showMessageAgentLabel: showMessageAgentLabel.value,
  botAvatarUrl: botAvatarUrl.value,
  botName: botName.value,
  botIntro: botIntro.value,
  selectedTone: selectedTone.value,
  defaultLanguage: defaultLanguage.value,
  visitorInactiveMinutes: visitorInactiveMinutes.value,
  idleHours: idleHours.value,
  idleMinutes: idleMinutes.value,
  idleSeconds: idleSeconds.value,
  followUpEnabled: followUpEnabled.value,
  followUpMessage: followUpMessage.value,
  replyMode: replyMode.value,
  transferEnabled: transferEnabled.value,
  offlineMessage: offlineMessage.value,
  transferMessage: transferMessage.value,
  unsupportedQuestionMessage: unsupportedQuestionMessage.value
});

const getSavedSettings = (): StoredAiAgentSettings => {
  try {
    return JSON.parse(savedSnapshot.value) as StoredAiAgentSettings;
  } catch {
    return getCurrentSettings();
  }
};

const getConfigSnapshot = () => JSON.stringify(getCurrentSettings());

const savedSnapshot = ref(getConfigSnapshot());

const hasUnsavedChanges = computed(() => !initializing.value && getConfigSnapshot() !== savedSnapshot.value);

const persistAgentSettings = () => {
  persistStoredAiAgentSettings(getCurrentSettings());
};

const loadAgentSettings = () => {
  const settings = loadStoredAiAgentSettings();

  if (typeof settings.agentEnabled === "boolean") agentEnabled.value = settings.agentEnabled;
  if (typeof settings.agentResponseMode === "string") agentResponseMode.value = settings.agentResponseMode;
  if (typeof settings.visitorAudience === "string") visitorAudience.value = resolveAudienceType(settings.visitorAudience);
  if (typeof settings.showMessageAgentLabel === "boolean") showMessageAgentLabel.value = settings.showMessageAgentLabel;
  if (typeof settings.botAvatarUrl === "string") botAvatarUrl.value = settings.botAvatarUrl;
  if (typeof settings.botName === "string") botName.value = settings.botName;
  if (typeof settings.botIntro === "string") botIntro.value = settings.botIntro;
  if (typeof settings.selectedTone === "string") selectedTone.value = settings.selectedTone;
  if (typeof settings.defaultLanguage === "string") defaultLanguage.value = settings.defaultLanguage;
  if (typeof settings.visitorInactiveMinutes === "number") {
    visitorInactiveMinutes.value = settings.visitorInactiveMinutes;
  } else if (typeof settings.visitorInactiveHours === "number") {
    visitorInactiveMinutes.value = settings.visitorInactiveHours * 60;
  }
  if (typeof settings.idleHours === "number") idleHours.value = settings.idleHours;
  if (typeof settings.idleMinutes === "number") idleMinutes.value = settings.idleMinutes;
  if (typeof settings.idleSeconds === "number") idleSeconds.value = settings.idleSeconds;
  if (typeof settings.followUpEnabled === "boolean") followUpEnabled.value = settings.followUpEnabled;
  if (typeof settings.followUpMessage === "string") followUpMessage.value = settings.followUpMessage;
  if (typeof settings.replyMode === "string") replyMode.value = settings.replyMode;
  if (typeof settings.transferEnabled === "boolean") transferEnabled.value = settings.transferEnabled;
  if (typeof settings.offlineMessage === "string") offlineMessage.value = settings.offlineMessage;
  if (typeof settings.transferMessage === "string") transferMessage.value = settings.transferMessage;
  if (typeof settings.unsupportedQuestionMessage === "string") {
    unsupportedQuestionMessage.value = settings.unsupportedQuestionMessage;
  }
};

const restoreSavedSnapshot = () => {
  try {
    const settings = JSON.parse(savedSnapshot.value) as StoredAiAgentSettings;

    agentEnabled.value = Boolean(settings.agentEnabled);
    agentResponseMode.value = settings.agentResponseMode ?? "always";
    visitorAudience.value = resolveAudienceType(settings.visitorAudience);
    showMessageAgentLabel.value = typeof settings.showMessageAgentLabel === "boolean" ? settings.showMessageAgentLabel : true;
    botAvatarUrl.value = settings.botAvatarUrl ?? "";
    botName.value = settings.botName ?? "AI Agent";
    botIntro.value = settings.botIntro ?? "";
    selectedTone.value = settings.selectedTone ?? "friendly";
    defaultLanguage.value = settings.defaultLanguage ?? "en";
    visitorInactiveMinutes.value = typeof settings.visitorInactiveMinutes === "number" ? settings.visitorInactiveMinutes : 10;
    idleHours.value = typeof settings.idleHours === "number" ? settings.idleHours : 0;
    idleMinutes.value = typeof settings.idleMinutes === "number" ? settings.idleMinutes : 10;
    idleSeconds.value = typeof settings.idleSeconds === "number" ? settings.idleSeconds : 0;
    followUpEnabled.value = typeof settings.followUpEnabled === "boolean" ? settings.followUpEnabled : false;
    followUpMessage.value = settings.followUpMessage ?? "你好，请问还有什么可以帮你的吗？如果没有其他问题，会话将在稍后自动关闭。";
    followUpMessageTouched.value = false;
    replyMode.value = settings.replyMode ?? "strict";
    transferEnabled.value = typeof settings.transferEnabled === "boolean" ? settings.transferEnabled : false;
    offlineMessage.value = settings.offlineMessage ?? "当前客服暂时不在线。你可以先留下问题或联系方式，我们会尽快与您联系。";
    transferMessage.value = settings.transferMessage ?? "正在为你转接人工客服，请稍候";
    unsupportedQuestionMessage.value =
      settings.unsupportedQuestionMessage ??
      "抱歉，这个问题我暂时还无法准确处理。您可以换一种说法继续提问，或直接转接人工客服获得帮助。";
  } catch {}
};

const markSnapshotSaved = () => {
  persistAgentSettings();
  savedSnapshot.value = getConfigSnapshot();
  emit("dirty-change", false);
};

const launchActionLabel = computed(() => (agentEnabled.value ? "暂停 AI Agent" : "开启 AI Agent"));

const toggleLifecycleCard = (key: LifecycleCardKey) => {
  openLifecycleCard.value = openLifecycleCard.value === key ? null : key;
};

const cardHasChanges = (cardKey: LifecycleCardKey) => {
  const currentSettings = getCurrentSettings();
  const savedSettings = getSavedSettings();
  return lifecycleCardFieldMap[cardKey].some((field) => currentSettings[field] !== savedSettings[field]);
};

const firstDirtyCard = computed<LifecycleCardKey | null>(() => lifecycleCardKeys.find((cardKey) => cardHasChanges(cardKey)) ?? null);

const applyCardSettings = (cardKey: LifecycleCardKey, settings: StoredAiAgentSettings) => {
  switch (cardKey) {
    case "entry-routing":
      agentResponseMode.value = settings.agentResponseMode ?? "always";
      visitorAudience.value = resolveAudienceType(settings.visitorAudience);
      break;
    case "entry-visibility":
      showMessageAgentLabel.value = typeof settings.showMessageAgentLabel === "boolean" ? settings.showMessageAgentLabel : true;
      break;
    case "identity-profile":
      botAvatarUrl.value = settings.botAvatarUrl ?? "";
      botName.value = settings.botName ?? "AI Agent";
      botIntro.value = settings.botIntro ?? "";
      botNameTouched.value = false;
      break;
    case "identity-style":
      selectedTone.value = settings.selectedTone ?? "friendly";
      defaultLanguage.value = settings.defaultLanguage ?? "en";
      break;
    case "answering-mode":
      replyMode.value = settings.replyMode ?? "strict";
      break;
    case "answering-unsupported":
      unsupportedQuestionMessage.value =
        settings.unsupportedQuestionMessage ??
        "抱歉，这个问题我暂时还无法准确处理。您可以换一种说法继续提问，或直接转接人工客服获得帮助。";
      unsupportedMessageTouched.value = false;
      break;
    case "fallback-transfer":
      transferEnabled.value = typeof settings.transferEnabled === "boolean" ? settings.transferEnabled : false;
      transferMessage.value = settings.transferMessage ?? "正在为你转接人工客服，请稍候";
      transferMessageTouched.value = false;
      offlineMessage.value = settings.offlineMessage ?? "当前客服暂不在线。你可以先留下问题或联系方式，我们会尽快与你联系。";
      offlineMessageTouched.value = false;
      break;
    case "idle-followup":
      followUpEnabled.value = typeof settings.followUpEnabled === "boolean" ? settings.followUpEnabled : false;
      followUpMessage.value = settings.followUpMessage ?? "你好，请问还有什么可以帮你的吗？如果没有其他问题，会话将在稍后自动关闭。";
      followUpMessageTouched.value = false;
      break;
    case "idle-autoclose":
      idleHours.value = typeof settings.idleHours === "number" ? settings.idleHours : 0;
      idleMinutes.value = typeof settings.idleMinutes === "number" ? settings.idleMinutes : 10;
      idleSeconds.value = typeof settings.idleSeconds === "number" ? settings.idleSeconds : 0;
      break;
  }
};

const validateCard = (cardKey: LifecycleCardKey) => {
  if (cardKey === "identity-profile") {
    botNameTouched.value = true;
    return botName.value.trim().length > 0;
  }

  if (cardKey === "answering-unsupported") {
    unsupportedMessageTouched.value = true;
    return unsupportedQuestionMessage.value.trim().length > 0;
  }

  if (cardKey === "fallback-transfer") {
    if (transferEnabled.value) {
      transferMessageTouched.value = true;
      if (!transferMessage.value.trim()) return false;
      offlineMessageTouched.value = true;
      return offlineMessage.value.trim().length > 0;
    }
    offlineMessageTouched.value = true;
    return offlineMessage.value.trim().length > 0;
  }

  if (cardKey === "idle-followup") {
    if (followUpEnabled.value) {
      followUpMessageTouched.value = true;
      return followUpMessage.value.trim().length > 0;
    }
  }

  if (cardKey === "idle-autoclose") {
    idleHours.value = Math.max(0, Math.round(Number(idleHours.value) || 0));
    idleMinutes.value = Math.max(0, Math.min(59, Math.round(Number(idleMinutes.value) || 0)));
    idleSeconds.value = Math.max(0, Math.min(59, Math.round(Number(idleSeconds.value) || 0)));
  }

  return true;
};

const saveCardChanges = (cardKey: LifecycleCardKey) => {
  if (!validateCard(cardKey)) {
    openLifecycleCard.value = cardKey;
    emitToast("请先完善当前卡片中的必填项");
    return;
  }

  markSnapshotSaved();
  emitToast("当前配置已保存");
};

const cancelCardChanges = (cardKey: LifecycleCardKey) => {
  applyCardSettings(cardKey, getSavedSettings());
  emitToast("已取消当前卡片的修改");
};

const saveAllChanges = () => {
  for (const cardKey of lifecycleCardKeys) {
    if (cardHasChanges(cardKey) && !validateCard(cardKey)) {
      openLifecycleCard.value = cardKey;
      emitToast("请先完善必填项");
      return;
    }
  }
  markSnapshotSaved();
  emitToast("配置已保存");
};

const restoreAndNotify = () => {
  restoreSavedSnapshot();
  emitToast("已取消所有修改");
};

const handleInactiveMinutesBlur = () => {
  visitorInactiveMinutes.value = normalizeInactiveMinutes(visitorInactiveMinutes.value);
};

const toggleAgentLiveStatus = () => {
  if (hasUnsavedChanges.value) {
    if (firstDirtyCard.value) {
      openLifecycleCard.value = firstDirtyCard.value;
    }
    emitToast("请先保存或取消当前更改");
    return;
  }

  agentEnabled.value = !agentEnabled.value;
  markSnapshotSaved();
  emitToast(agentEnabled.value ? "AI Agent 已开启" : "AI Agent 已暂停");
};

const updateCopilotSetting = (key: string, next: boolean) => {
  copilotSettings.value = copilotSettings.value.map((item) => {
    if (item.key !== key) return item;
    return { ...item, enabled: next };
  });
  emit("toast", next ? "设置已开启" : "设置已关闭");
};

const triggerBotAvatarSelect = () => {
  avatarInputRef.value?.click();
};

const readFileAsDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(new Error("read-failed"));
    reader.readAsDataURL(file);
  });

const handleAvatarFileChange = async (event: Event) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  input.value = "";

  if (!file) {
    return;
  }

  if (!file.type.startsWith("image/")) {
    emitToast("请上传图片文件");
    return;
  }

  const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
  if (!allowedTypes.includes(file.type)) {
    emitToast("仅支持 JPG、JPEG、PNG 格式的图片");
    return;
  }

  if (file.size > AVATAR_MAX_SIZE) {
    emitToast("图片大小不能超过 10MB");
    return;
  }

  try {
    cropImageSource.value = await readFileAsDataUrl(file);
    cropModalOpen.value = true;
  } catch {
    emitToast("头像读取失败，请重试");
  }
};

const handleCroppedImage = (dataUrl: string) => {
  botAvatarUrl.value = dataUrl;
  cropModalOpen.value = false;
  cropImageSource.value = "";
};

const handleDeployFieldUpdate = (field: string, value: unknown) => {
  const fieldMap: Record<string, { ref: { value: unknown } }> = {
    visitorAudience: { ref: visitorAudience },
    agentResponseMode: { ref: agentResponseMode },
    showMessageAgentLabel: { ref: showMessageAgentLabel },
    botName: { ref: botName },
    botIntro: { ref: botIntro },
    selectedTone: { ref: selectedTone },
    defaultLanguage: { ref: defaultLanguage },
    replyMode: { ref: replyMode },
    unsupportedQuestionMessage: { ref: unsupportedQuestionMessage },
    transferEnabled: { ref: transferEnabled },
    transferMessage: { ref: transferMessage },
    offlineMessage: { ref: offlineMessage },
    followUpEnabled: { ref: followUpEnabled },
    followUpMessage: { ref: followUpMessage },
    idleHours: { ref: idleHours },
    idleMinutes: { ref: idleMinutes },
    idleSeconds: { ref: idleSeconds }
  };
  const entry = fieldMap[field];
  if (entry) entry.ref.value = value;
};

const handleDeployTouchedUpdate = (field: string, value: boolean) => {
  const touchedMap: Record<string, { value: boolean }> = {
    botNameTouched: botNameTouched,
    unsupportedMessageTouched: unsupportedMessageTouched,
    transferMessageTouched: transferMessageTouched,
    offlineMessageTouched: offlineMessageTouched,
    followUpMessageTouched: followUpMessageTouched
  };
  const entry = touchedMap[field];
  if (entry) entry.value = value;
};

const requestNavigation = (action: () => void) => {
  if (!hasUnsavedChanges.value) {
    action();
    return true;
  }

  pendingNavigationAction.value = action;
  unsavedChangesModalOpen.value = true;
  return false;
};

const cancelPendingNavigation = () => {
  pendingNavigationAction.value = null;
  unsavedChangesModalOpen.value = false;
};

const confirmPendingNavigation = () => {
  const action = pendingNavigationAction.value;
  restoreSavedSnapshot();
  cancelPendingNavigation();
  action?.();
};

const handleBeforeUnload = (event: BeforeUnloadEvent) => {
  if (!hasUnsavedChanges.value) {
    return;
  }
  event.preventDefault();
  event.returnValue = "";
};

watch(
  hasUnsavedChanges,
  (dirty) => {
    emit("dirty-change", dirty);
  },
  { immediate: true }
);

onMounted(() => {
  loadAgentSettings();
  savedSnapshot.value = getConfigSnapshot();
  initializing.value = false;
  window.addEventListener("beforeunload", handleBeforeUnload);
});

onBeforeUnmount(() => {
  window.removeEventListener("beforeunload", handleBeforeUnload);
});

defineExpose({
  requestNavigation,
  hasUnsavedChanges: () => hasUnsavedChanges.value
});
</script>

<style scoped>
.ai-agent-page {
  align-items: center;
  gap: var(--agent-space-16);
}

.ai-agent-page > * {
  max-width: 1080px;
  width: 100%;
}

.ai-agent-page__list {
  display: flex;
  flex-direction: column;
  gap: var(--agent-space-16);
}

.ai-agent-page__placeholder {
  align-items: flex-start;
  display: flex;
  flex-direction: column;
  gap: var(--agent-space-12);
  justify-content: center;
  min-height: 240px;
  padding: var(--agent-space-24);
}

.agent-config-header {
  align-items: center;
  flex-direction: row;
  justify-content: space-between;
}

.agent-config-header__content {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: var(--agent-space-8);
  min-width: 0;
}

.agent-config-header__title-row {
  align-items: center;
  display: flex;
  gap: 12px;
}

.agent-config-header__status {
  align-items: center;
  border-radius: 999px;
  display: inline-flex;
  font-size: 12px;
  font-weight: var(--agent-font-weight-medium);
  line-height: 1;
  padding: 4px 10px;
}

.agent-config-header__status--active {
  background: #e8f7ef;
  color: #137a49;
}

.agent-config-header__status--inactive {
  background: #feecec;
  color: #c53030;
}

.agent-config-header__actions {
  align-items: center;
  display: flex;
  flex-shrink: 0;
  gap: 12px;
}

.config-tabs {
  border-bottom: 1px solid var(--agent-color-border-default);
  display: flex;
  gap: 0;
}

.config-tabs__item {
  background: transparent;
  border: 0;
  border-bottom: 2px solid transparent;
  color: var(--agent-color-text-tertiary);
  cursor: pointer;
  font-size: 15px;
  font-weight: var(--agent-font-weight-medium);
  padding: 12px 20px;
  transition: color var(--agent-motion-fast), border-color var(--agent-motion-fast);
}

.config-tabs__item:hover {
  color: var(--agent-color-text-primary);
}

.config-tabs__item--active {
  border-bottom-color: var(--agent-color-brand-primary);
  color: var(--agent-color-brand-primary);
}

.settings-panel {
  display: flex;
  flex-direction: column;
  gap: var(--agent-space-20);
}

.settings-section {
  display: flex;
  flex-direction: column;
  gap: var(--agent-space-4);
  padding: var(--agent-space-24);
}

.settings-section__title {
  color: var(--agent-color-text-primary);
  font-size: 16px;
  font-weight: var(--agent-font-weight-semibold);
  line-height: 1.5;
  margin: 0;
}

.settings-section__desc {
  color: var(--agent-color-text-tertiary);
  font-size: var(--agent-font-size-sm);
  line-height: 1.5;
  margin: 0 0 var(--agent-space-16);
}

.settings-form {
  display: flex;
  flex-direction: column;
  gap: var(--agent-space-24);
}

.settings-form .form-row + .form-row {
  border-top: 1px solid var(--agent-color-border-default);
  padding-top: var(--agent-space-24);
}

.ai-agent-page__footer {
  display: flex;
  justify-content: flex-start;
  padding-top: var(--agent-space-20);
}

.form-row {
  align-items: flex-start;
  display: flex;
  gap: var(--agent-space-24);
}

.form-row__label {
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  gap: 4px;
  padding-top: 8px;
  width: 220px;
}

.form-row__name {
  color: var(--agent-color-text-primary);
  font-size: var(--agent-font-size-sm);
  font-weight: var(--agent-font-weight-medium);
}

.form-row__desc {
  color: var(--agent-color-text-tertiary);
  font-size: var(--agent-font-size-xs);
  line-height: 1.5;
}

.form-row__control {
  flex: 1;
  max-width: 620px;
  min-width: 0;
}

.form-row__control--stack {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.form-row__control .agent-input {
  width: 100%;
}

.form-row__textarea {
  min-height: 120px;
  resize: vertical;
  width: 100%;
}

.form-row__error {
  color: #e53e3e;
  font-size: var(--agent-font-size-xs);
  line-height: 1.5;
  margin: 4px 0 0;
}

.agent-input--error {
  border-color: #e53e3e;
}

.bot-avatar-upload {
  align-items: center;
  display: flex;
  gap: var(--agent-space-12);
}

.bot-avatar-upload__preview {
  align-items: center;
  background: linear-gradient(135deg, #00b578, #00c2b8);
  border-radius: 50%;
  display: inline-flex;
  flex-shrink: 0;
  height: 64px;
  justify-content: center;
  overflow: hidden;
  position: relative;
  width: 64px;
}

.bot-avatar-upload__preview--image {
  background: #eef2f8;
}

.bot-avatar-upload__image {
  height: 100%;
  object-fit: cover;
  width: 100%;
}

.bot-avatar-upload__fallback {
  color: #ffffff;
  font-size: 18px;
  font-weight: 600;
}

.bot-avatar-upload__actions {
  align-items: flex-start;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.bot-avatar-upload__hint {
  color: var(--agent-color-text-tertiary);
  font-size: var(--agent-font-size-xs);
  line-height: 1.5;
  margin: 0;
}

.bot-avatar-upload__input {
  display: none;
}

.bot-chips-group {
  display: flex;
  flex-wrap: wrap;
  gap: var(--agent-space-8);
}

.bot-chip {
  background: var(--agent-color-bg-muted);
  border: 1px solid var(--agent-color-border-default);
  border-radius: 999px;
  color: var(--agent-color-text-secondary);
  cursor: pointer;
  font-size: var(--agent-font-size-sm);
  padding: 8px var(--agent-space-16);
  transition: all var(--agent-motion-fast);
}

.bot-chip:hover {
  border-color: var(--agent-color-brand-primary);
  color: var(--agent-color-brand-primary);
}

.bot-chip--active {
  background: var(--agent-color-brand-soft);
  border-color: var(--agent-color-brand-primary);
  color: var(--agent-color-brand-primary);
  font-weight: var(--agent-font-weight-medium);
}

@media (max-width: 1280px) {
  .ai-agent-page__placeholder {
    padding: var(--agent-space-16);
  }

  .form-row {
    flex-direction: column;
    gap: var(--agent-space-8);
  }

  .form-row__label {
    padding-top: 0;
    width: auto;
  }

  .bot-avatar-upload {
    align-items: flex-start;
    flex-direction: column;
  }

  .agent-config-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .agent-config-header__actions {
    width: 100%;
  }
}
</style>
