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
            <h2 class="setting-card__title">基本信息</h2>
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
                    :class="{ 'bot-chip--active': selectedTones.includes(tone.value) }"
                    @click="toggleTone(tone.value)"
                  >{{ tone.label }}</button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section class="setting-card agent-panel">
          <header class="setting-card__header">
            <h2 class="setting-card__title">语言</h2>
            <p class="setting-card__desc">AI Agent 可自动识别访客语言并对应回复；若无法识别则切换至默认语言</p>
          </header>
          <div class="setting-card__body">
            <div class="form-row">
              <div class="form-row__label">
                <span class="form-row__name">默认语言</span>
              </div>
              <div class="form-row__control">
                <select v-model="defaultLanguage" class="agent-input">
                  <option value="zh-CN">简体中文</option>
                  <option value="en">English</option>
                  <option value="ja">日本語</option>
                  <option value="ko">한국어</option>
                  <option value="auto">自动检测</option>
                </select>
              </div>
            </div>
          </div>
        </section>

        <div class="ai-tab-content__actions">
          <button type="button" class="agent-btn agent-btn--primary" @click="emitToast('基本设置已保存')">保存</button>
        </div>
      </div>

      <!-- 会话设置 tab -->
      <div v-else-if="agentTab === 'conversation'" class="ai-tab-content">
        <section class="setting-card agent-panel">
          <header class="setting-card__header">
            <h2 class="setting-card__title">会话自动结束</h2>
            <p class="setting-card__desc">访客超过设定时间未回复时自动结束会话</p>
          </header>
          <div class="setting-card__body">
            <div class="form-row">
              <div class="form-row__label">
                <span class="form-row__name">超时时长</span>
              </div>
              <div class="form-row__control">
                <div class="form-row__inline">
                  <span class="form-row__inline-text">超过</span>
                  <input v-model.number="sessionTimeout" type="number" class="agent-input form-row__inline-input" min="1" max="72" />
                  <span class="form-row__inline-text">小时访客未回复，会话自动结束。</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section class="setting-card agent-panel">
          <header class="setting-card__header">
            <h2 class="setting-card__title">介入策略</h2>
            <p class="setting-card__desc">设置 AI Agent 在会话中的介入方式</p>
          </header>
          <div class="setting-card__body">
            <div class="form-row">
              <div class="form-row__label">
                <span class="form-row__name">介入模式</span>
              </div>
              <div class="form-row__control">
                <select v-model="interventionMode" class="agent-input">
                  <option value="pre-intercept">前置拦截 — AI 优先接待，无法解决时转人工</option>
                  <option value="post-fallback">后置兜底 — 人工优先，非工作时间由 AI 接管</option>
                </select>
              </div>
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
            <h2 class="setting-card__title">转人工设置</h2>
            <p class="setting-card__desc">访客主动要求转人工时的处理方案</p>
          </header>
          <div class="setting-card__body">
            <div class="form-row">
              <div class="form-row__label">
                <span class="form-row__name">转人工方式</span>
              </div>
              <div class="form-row__control">
                <select v-model="transferMode" class="agent-input">
                  <option value="immediate">立即转接 — 直接分配给在线客服</option>
                  <option value="confirm">确认转接 — 先确认是否继续 AI 对话</option>
                  <option value="queue">排队转接 — 进入人工排队队列</option>
                </select>
              </div>
            </div>

            <div class="form-row">
              <div class="form-row__label">
                <span class="form-row__name">无客服在线</span>
                <span class="form-row__desc">所有客服离线时的处理方式</span>
              </div>
              <div class="form-row__control">
                <select v-model="offlineTransferMode" class="agent-input">
                  <option value="leave-message">留言 — 引导访客留下联系方式</option>
                  <option value="continue-ai">继续 AI — 提示暂无人工并继续 AI 对话</option>
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
          </div>
        </section>

        <div class="ai-tab-content__actions">
          <button type="button" class="agent-btn agent-btn--primary" @click="emitToast('会话设置已保存')">保存</button>
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
import { computed, ref } from "vue";
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
const botIntro = ref("我是您的智能客服助手，可以帮您快速解答常见问题。");
const selectedTones = ref<string[]>(["friendly", "professional"]);
const defaultLanguage = ref("zh-CN");
const toneOptions = [
  { value: "friendly", label: "友好亲切" },
  { value: "professional", label: "专业严谨" },
  { value: "humorous", label: "幽默活泼" },
  { value: "concise", label: "简洁高效" }
];

// Intervention strategy (会话设置)
const interventionMode = ref("pre-intercept");
const sessionTimeout = ref(1);

// Reply strategy
const replyMode = ref("strict");

// Transfer settings
const transferMode = ref("immediate");
const offlineTransferMode = ref("leave-message");

// Script config
const offlineMessage = ref("很抱歉，当前所有客服均不在线。请留下您的联系方式，我们会尽快回复您。");
const transferMessage = ref("正在为您转接人工客服，请稍候。");

const toggleTone = (value: string) => {
  if (selectedTones.value.includes(value)) {
    if (selectedTones.value.length > 1) {
      selectedTones.value = selectedTones.value.filter((t) => t !== value);
    }
  } else {
    selectedTones.value = [...selectedTones.value, value];
  }
};

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
  border-bottom: 1px solid var(--agent-color-border-default);
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

/* Inline input (e.g. "超过 [1] 小时...") */
.form-row__inline {
  align-items: center;
  display: flex;
  gap: var(--agent-space-8);
}

.form-row__inline-input {
  text-align: center;
  width: 72px;
}

.form-row__inline-text {
  color: var(--agent-color-text-primary);
  font-size: var(--agent-font-size-sm);
  white-space: nowrap;
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
}
</style>
