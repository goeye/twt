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

    <!-- AI Agent 配置 (tab-based) -->
    <template v-else-if="activeKey === 'ai-agent-config'">
      <header class="agent-content-header">
        <h1 class="agent-content-title">AI Agent</h1>
        <p class="agent-content-subtitle">配置 AI 机器人的基本信息与会话策略。</p>
      </header>

      <nav class="ai-tabs">
        <button
          type="button"
          class="ai-tabs__item"
          :class="{ 'ai-tabs__item--active': agentTab === 'basic' }"
          @click="agentTab = 'basic'"
        >基本设置</button>
        <button
          type="button"
          class="ai-tabs__item"
          :class="{ 'ai-tabs__item--active': agentTab === 'conversation' }"
          @click="agentTab = 'conversation'"
        >会话设置</button>
      </nav>

      <!-- 基本设置 tab -->
      <div v-if="agentTab === 'basic'" class="ai-tab-content">
        <section class="setting-card agent-panel">
          <header class="setting-card__header">
            <h2 class="setting-card__title">启用与展示</h2>
          </header>
          <div class="setting-card__body">
            <div class="form-row">
              <div class="form-row__label">
                <span class="form-row__name">启用 AI Agent</span>
                <span class="form-row__desc">开启后 AI Agent 将自动接管访客会话</span>
              </div>
              <div class="form-row__control">
                <label class="agent-switch">
                  <input v-model="agentEnabled" type="checkbox" class="agent-switch__input" />
                  <span class="agent-switch__track" />
                </label>
              </div>
            </div>

            <div class="form-row">
              <div class="form-row__label">
                <span class="form-row__name">AI Agent 回复</span>
                <span class="form-row__desc">设置 AI Agent 何时参与会话回复</span>
              </div>
              <div class="form-row__control">
                <select v-model="agentResponseMode" class="agent-input">
                  <option value="always">始终</option>
                  <option value="offline-only">仅客服离线时</option>
                </select>
              </div>
            </div>

            <div class="form-row">
              <div class="form-row__label">
                <span class="form-row__name">在消息中显示 AI Agent 标签</span>
                <span class="form-row__desc">开启后，访客端会在 AI Agent 回复消息中看到标签，用于识别。</span>
              </div>
              <div class="form-row__control">
                <label class="agent-switch">
                  <input v-model="showMessageAgentLabel" type="checkbox" class="agent-switch__input" />
                  <span class="agent-switch__track" />
                </label>
              </div>
            </div>
          </div>
        </section>

        <section class="setting-card agent-panel">
          <header class="setting-card__header">
            <h2 class="setting-card__title">AI Agent 信息</h2>
          </header>
          <div class="setting-card__body">
            <div class="form-row">
              <div class="form-row__label">
                <span class="form-row__name">头像</span>
                <span class="form-row__desc">自定义 AI Agent 的头像形象</span>
              </div>
              <div class="form-row__control">
                <div class="bot-avatar-upload">
                  <span class="bot-avatar-upload__preview">🤖</span>
                  <button type="button" class="agent-btn agent-btn--ghost" @click="emitToast('头像上传功能开发中')">上传头像</button>
                </div>
              </div>
            </div>

            <div class="form-row">
              <div class="form-row__label">
                <span class="form-row__name">名称</span>
                <span class="form-row__desc">AI Agent 在被询问身份相关问题时，将使用该名称进行回复。</span>
              </div>
              <div class="form-row__control">
                <input
                  v-model="botName"
                  class="agent-input"
                  maxlength="20"
                  placeholder="请输入名称"
                />
              </div>
            </div>

            <div class="form-row">
              <div class="form-row__label">
                <span class="form-row__name">简介</span>
                <span class="form-row__desc">描述你的业务，AI Agent 将为你的客户定制专属回复</span>
              </div>
              <div class="form-row__control">
                <textarea
                  v-model="botIntro"
                  class="agent-input form-row__textarea"
                  rows="5"
                  maxlength="200"
                  placeholder="请输入"
                />
              </div>
            </div>

            <div class="form-row">
              <div class="form-row__label">
                <span class="form-row__name">回复语气</span>
                <span class="form-row__desc">设置 AI Agent 回复时的语言风格</span>
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
                <span class="form-row__desc">无法识别访客语言时，将使用该语言回复。</span>
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
        </section>

        <div class="ai-tab-content__actions">
          <button type="button" class="agent-btn agent-btn--primary" @click="saveBasicSettings">保存</button>
        </div>
      </div>

      <!-- 会话设置 tab -->
      <div v-else-if="agentTab === 'conversation'" class="ai-tab-content">
        <section class="setting-card agent-panel">
          <header class="setting-card__header">
            <h2 class="setting-card__title">访客不活跃</h2>
          </header>
          <div class="setting-card__body setting-card__body--compact">
            <div class="inactive-setting">
              <span class="inactive-setting__text">当访客超过</span>
              <input
                v-model.number="visitorInactiveMinutes"
                type="number"
                class="agent-input inactive-setting__input"
                min="1"
                max="1440"
              />
              <span class="inactive-setting__text">分钟未进行操作，自动关闭会话</span>
            </div>
          </div>
        </section>

        <section class="setting-card agent-panel">
          <header class="setting-card__header">
            <h2 class="setting-card__title">回复策略</h2>
            <p class="setting-card__desc">配置 AI Agent 的回复生成方式</p>
          </header>
          <div class="setting-card__body">
            <div class="form-row">
              <div class="form-row__label">
                <span class="form-row__name">回复模式</span>
              </div>
              <div class="form-row__control">
                <select v-model="replyMode" class="agent-input">
                  <option value="strict">严格模式 — 仅使用知识库匹配内容回复</option>
                  <option value="creative">发散模式 — 允许 AI 结合上下文推理补充</option>
                </select>
              </div>
            </div>
          </div>
        </section>

        <section class="setting-card agent-panel">
          <header class="setting-card__header">
            <h2 class="setting-card__title">个性化回复</h2>
            <p class="setting-card__desc">为以下场景设置 AI Agent 的回复语</p>
          </header>
          <div class="setting-card__body">
            <div class="form-row">
              <div class="form-row__label">
                <span class="form-row__name">客服离线</span>
                <span class="form-row__desc">客服全部离线时的提示语</span>
              </div>
              <div class="form-row__control">
                <textarea
                  v-model="offlineMessage"
                  class="agent-input form-row__textarea"
                  rows="4"
                  placeholder="请输入离线提示语"
                />
              </div>
            </div>

            <div class="form-row">
              <div class="form-row__label">
                <span class="form-row__name">转移人工客服</span>
                <span class="form-row__desc">AI 转人工时的提示语</span>
              </div>
              <div class="form-row__control">
                <textarea
                  v-model="transferMessage"
                  class="agent-input form-row__textarea"
                  rows="4"
                  placeholder="请输入转人工提示语"
                />
              </div>
            </div>

            <div class="form-row">
              <div class="form-row__label">
                <span class="form-row__name">无法回答的问题</span>
                <span class="form-row__desc">当访客发送图片、文件或超出 AI 能力范围的问题时使用的提示语</span>
              </div>
              <div class="form-row__control">
                <textarea
                  v-model="unsupportedQuestionMessage"
                  class="agent-input form-row__textarea"
                  rows="4"
                  placeholder="请输入无法回答场景的提示语"
                />
              </div>
            </div>
          </div>
        </section>

        <div class="ai-tab-content__actions">
          <button type="button" class="agent-btn agent-btn--primary" @click="saveConversationSettings">保存</button>
        </div>
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
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { CopilotPromoBanner, CopilotSettingItem } from "@twt/ui-agent";

type AiAgentNavKey = "doc-knowledge" | "faq" | "copilot-settings" | "ai-agent-config";

interface CopilotSetting {
  key: string;
  title: string;
  description: string;
  enabled: boolean;
}

const props = defineProps<{
  activeKey: AiAgentNavKey;
}>();

const emit = defineEmits<{
  (e: "toast", message: string): void;
}>();

const AI_AGENT_SETTINGS_STORAGE_KEY = "twt:ai-agent-settings";

interface StoredAiAgentSettings {
  agentEnabled?: boolean;
  agentResponseMode?: string;
  showMessageAgentLabel?: boolean;
  botName?: string;
  botIntro?: string;
  selectedTone?: string;
  defaultLanguage?: string;
  visitorInactiveMinutes?: number;
  visitorInactiveHours?: number;
  replyMode?: string;
  offlineMessage?: string;
  transferMessage?: string;
  unsupportedQuestionMessage?: string;
}

const showBanner = ref(true);
const agentTab = ref<"basic" | "conversation">("basic");
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

// Bot persona config (基本设置)
const botName = ref("智能助手");
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

// Basic settings
const agentResponseMode = ref("always");
const showMessageAgentLabel = ref(true);

// Conversation settings
const visitorInactiveMinutes = ref(10);

// Reply strategy
const replyMode = ref("strict");

// Script config
const offlineMessage = ref("很抱歉，当前所有客服均不在线。请留下您的联系方式，我们会尽快回复您。");
const transferMessage = ref("正在为您转接人工客服，请稍候。");
const unsupportedQuestionMessage = ref("抱歉，我暂时无法处理图片、文件或这个问题。您可以尝试换一种描述方式，或转接人工客服继续为您服务。");

const persistAgentSettings = () => {
  if (typeof window === "undefined") return;

  const settings: StoredAiAgentSettings = {
    agentEnabled: agentEnabled.value,
    agentResponseMode: agentResponseMode.value,
    showMessageAgentLabel: showMessageAgentLabel.value,
    botName: botName.value,
    botIntro: botIntro.value,
    selectedTone: selectedTone.value,
    defaultLanguage: defaultLanguage.value,
    visitorInactiveMinutes: visitorInactiveMinutes.value,
    replyMode: replyMode.value,
    offlineMessage: offlineMessage.value,
    transferMessage: transferMessage.value,
    unsupportedQuestionMessage: unsupportedQuestionMessage.value
  };

  window.localStorage.setItem(AI_AGENT_SETTINGS_STORAGE_KEY, JSON.stringify(settings));
};

const loadAgentSettings = () => {
  if (typeof window === "undefined") return;

  try {
    const raw = window.localStorage.getItem(AI_AGENT_SETTINGS_STORAGE_KEY);
    if (!raw) return;

    const settings = JSON.parse(raw) as StoredAiAgentSettings;

    if (typeof settings.agentEnabled === "boolean") agentEnabled.value = settings.agentEnabled;
    if (typeof settings.agentResponseMode === "string") agentResponseMode.value = settings.agentResponseMode;
    if (typeof settings.showMessageAgentLabel === "boolean") showMessageAgentLabel.value = settings.showMessageAgentLabel;
    if (typeof settings.botName === "string") botName.value = settings.botName;
    if (typeof settings.botIntro === "string") botIntro.value = settings.botIntro;
    if (typeof settings.selectedTone === "string") selectedTone.value = settings.selectedTone;
    if (typeof settings.defaultLanguage === "string") defaultLanguage.value = settings.defaultLanguage;
    if (typeof settings.visitorInactiveMinutes === "number") {
      visitorInactiveMinutes.value = settings.visitorInactiveMinutes;
    } else if (typeof settings.visitorInactiveHours === "number") {
      visitorInactiveMinutes.value = settings.visitorInactiveHours * 60;
    }
    if (typeof settings.replyMode === "string") replyMode.value = settings.replyMode;
    if (typeof settings.offlineMessage === "string") offlineMessage.value = settings.offlineMessage;
    if (typeof settings.transferMessage === "string") transferMessage.value = settings.transferMessage;
    if (typeof settings.unsupportedQuestionMessage === "string") {
      unsupportedQuestionMessage.value = settings.unsupportedQuestionMessage;
    }
  } catch {}
};

const saveBasicSettings = () => {
  persistAgentSettings();
  emitToast("基本设置已保存");
};

const saveConversationSettings = () => {
  persistAgentSettings();
  emitToast("会话设置已保存");
};

onMounted(() => {
  loadAgentSettings();
});

const activeSectionLabel = computed(() => {
  if (props.activeKey === "doc-knowledge") return "文档知识";
  if (props.activeKey === "faq") return "常见问题";
  return "Copilot设置";
});

const updateCopilotSetting = (key: string, next: boolean) => {
  copilotSettings.value = copilotSettings.value.map((item) => {
    if (item.key !== key) return item;
    return { ...item, enabled: next };
  });
  emit("toast", next ? "设置已开启" : "设置已关闭");
};

const emitToast = (message: string) => {
  emit("toast", message);
};
</script>

<style scoped>
.ai-agent-page {
  gap: var(--agent-space-16);
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

/* Tabs */
.ai-tabs {
  border-bottom: 1px solid var(--agent-color-border-default);
  display: flex;
  gap: 0;
}

.ai-tabs__item {
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  color: var(--agent-color-text-secondary);
  cursor: pointer;
  font-size: var(--agent-font-size-sm);
  font-weight: var(--agent-font-weight-medium);
  padding: var(--agent-space-12) var(--agent-space-20);
  transition: all var(--agent-motion-fast);
}

.ai-tabs__item:hover {
  color: var(--agent-color-text-primary);
}

.ai-tabs__item--active {
  border-bottom-color: var(--agent-color-brand-primary);
  color: var(--agent-color-brand-primary);
  font-weight: var(--agent-font-weight-semibold);
}

/* Tab content */
.ai-tab-content {
  display: flex;
  flex-direction: column;
  gap: var(--agent-space-20);
}

.ai-tab-content__actions {
  display: flex;
  gap: var(--agent-space-8);
}

/* Setting card */
.setting-card {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: 0;
}

.setting-card__header {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: var(--agent-space-20) var(--agent-space-24);
}

.setting-card__title {
  color: var(--agent-color-text-primary);
  font-size: var(--agent-font-size-base);
  font-weight: var(--agent-font-weight-semibold);
  margin: 0;
}

.setting-card__desc {
  color: var(--agent-color-text-tertiary);
  font-size: var(--agent-font-size-xs);
  line-height: 1.5;
  margin: 0;
}

.setting-card__body {
  display: flex;
  flex-direction: column;
  gap: var(--agent-space-24);
  padding: var(--agent-space-24);
}

.setting-card__body--compact {
  padding-top: 8px;
}

/* Horizontal form row: label left, control right */
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
  width: 200px;
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
  max-width: 560px;
  min-width: 0;
}

.form-row__control .agent-input {
  width: 100%;
}

.form-row__textarea {
  min-height: 120px;
  resize: vertical;
  width: 100%;
}

.inactive-setting {
  align-items: center;
  color: var(--agent-color-text-primary);
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.inactive-setting__input {
  max-width: 88px;
  min-height: 38px;
  padding-left: 12px;
  padding-right: 12px;
  text-align: center;
}

.inactive-setting__text {
  color: var(--agent-color-text-primary);
  font-size: var(--agent-font-size-sm);
  line-height: 1.6;
}

/* Switch */
.agent-switch {
  cursor: pointer;
  display: inline-flex;
  position: relative;
}

.agent-switch__input {
  height: 0;
  opacity: 0;
  position: absolute;
  width: 0;
}

.agent-switch__track {
  background: var(--agent-color-border-default);
  border-radius: 12px;
  display: inline-block;
  height: 24px;
  position: relative;
  transition: background var(--agent-motion-fast);
  width: 44px;
}

.agent-switch__track::after {
  background: #fff;
  border-radius: 50%;
  content: "";
  height: 20px;
  left: 2px;
  position: absolute;
  top: 2px;
  transition: transform var(--agent-motion-fast);
  width: 20px;
}

.agent-switch__input:checked + .agent-switch__track {
  background: var(--agent-color-brand-primary);
}

.agent-switch__input:checked + .agent-switch__track::after {
  transform: translateX(20px);
}

/* Bot avatar upload */
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
  font-size: 24px;
  height: 56px;
  justify-content: center;
  width: 56px;
}

/* Bot chips */
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

  .inactive-setting {
    align-items: flex-start;
  }
}
</style>
