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
        <p class="agent-content-subtitle">配置 AI 机器人的基本信息与会话策略</p>
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
                  <option value="always">始终开启</option>
                  <option value="offline-only">仅客服离线时</option>
                </select>
              </div>
            </div>

            <div class="form-row">
              <div class="form-row__label">
                <span class="form-row__name">在消息中显示 AI Agent 标签</span>
                <span class="form-row__desc">开启后，访客端会在 AI Agent 回复消息中看到标签，用于识别</span>
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
                <span class="form-row__desc">AI Agent 在被询问身份相关问题时，将使用该昵称进行回复</span>
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
                <span class="form-row__name">简介</span>
                <span class="form-row__desc">描述你的业务，AI Agent 将为你的访客定制专属回复</span>
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
                <span class="form-row__desc">无法识别访客语言时，将使用该语言回复</span>
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
          <button type="button" class="agent-btn agent-btn--primary" :disabled="!basicFormValid" @click="saveBasicSettings">保存</button>
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
                  <option value="creative">发散模式 — 允许 AI 自主推理</option>
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
            <div class="setting-helper-stack">
              <div class="setting-callout">
                <p class="setting-callout__text">如果你更新以下文案，系统会自动同步翻译为其他已支持的语言版本</p>
              </div>
            </div>

            <div class="form-row">
              <div class="form-row__label">
                <span class="form-row__name">转接人工客服</span>
                <span class="form-row__desc">当 AI Agent 准备将会话转接给人工客服时，向访客展示的提示文案</span>
              </div>
              <div class="form-row__control">
                <textarea
                  v-model="transferMessage"
                  class="agent-input form-row__textarea"
                  :class="{ 'agent-input--error': transferMessageTouched && !transferMessage.trim() }"
                  rows="4"
                  maxlength="2000"
                  placeholder="请输入"
                  @blur="transferMessageTouched = true"
                />
                <p v-if="transferMessageTouched && !transferMessage.trim()" class="form-row__error">请输入回复内容</p>
              </div>
            </div>

            <div class="form-row">
              <div class="form-row__label">
                <span class="form-row__name">客服离线</span>
                <span class="form-row__desc">当客服团队暂时离线时，向访客展示的提示文案</span>
              </div>
              <div class="form-row__control">
                <textarea
                  v-model="offlineMessage"
                  class="agent-input form-row__textarea"
                  :class="{ 'agent-input--error': offlineMessageTouched && !offlineMessage.trim() }"
                  rows="4"
                  maxlength="2000"
                  placeholder="请输入"
                  @blur="offlineMessageTouched = true"
                />
                <p v-if="offlineMessageTouched && !offlineMessage.trim()" class="form-row__error">请输入回复内容</p>
              </div>
            </div>

            <div class="form-row">
              <div class="form-row__label">
                <span class="form-row__name">暂时无法回答</span>
                <span class="form-row__desc">当访客发送图片、文件，或问题超出 AI Agent 当前能力范围时展示的提示文案</span>
              </div>
              <div class="form-row__control">
                <textarea
                  v-model="unsupportedQuestionMessage"
                  class="agent-input form-row__textarea"
                  :class="{ 'agent-input--error': unsupportedMessageTouched && !unsupportedQuestionMessage.trim() }"
                  rows="4"
                  maxlength="2000"
                  placeholder="请输入"
                  @blur="unsupportedMessageTouched = true"
                />
                <p v-if="unsupportedMessageTouched && !unsupportedQuestionMessage.trim()" class="form-row__error">请输入回复内容</p>
              </div>
            </div>
          </div>
        </section>

        <div class="ai-tab-content__actions">
          <button type="button" class="agent-btn agent-btn--primary" :disabled="!conversationFormValid" @click="saveConversationSettings">保存</button>
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
    <UnsavedChangesModal :open="unsavedChangesModalOpen" @cancel="cancelPendingNavigation" @confirm="confirmPendingNavigation" />

    <BaseModal :open="cropModalOpen" title="图片裁剪" max-width="580px" @close="closeCropModal">
      <div v-if="cropState.imageSrc" class="avatar-crop-modal">
        <p class="avatar-crop-modal__hint">拖动图片调整头像显示区域</p>
        <div
          class="avatar-crop-canvas"
          :class="{ 'avatar-crop-canvas--dragging': cropDragging }"
          @mousedown.prevent="startCropDrag"
          @mousemove.prevent="handleCropDrag"
          @mouseup="endCropDrag"
          @mouseleave="endCropDrag"
        >
          <img :src="cropState.imageSrc" alt="头像裁剪预览" :style="cropImageStyle" draggable="false" />
        </div>
      </div>
      <template #footer>
        <span />
        <div class="modal-footer-actions">
          <button type="button" class="agent-btn agent-btn--ghost" @click="closeCropModal">取消</button>
          <button type="button" class="agent-btn agent-btn--primary" @click="confirmCropImage">确定</button>
        </div>
      </template>
    </BaseModal>
  </section>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { BaseModal, CopilotPromoBanner, CopilotSettingItem, UnsavedChangesModal } from "@twt/ui-agent";
import {
  type StoredAiAgentSettings,
  loadStoredAiAgentSettings,
  persistStoredAiAgentSettings
} from "../lib/aiAgentSettings";

type AiAgentNavKey = "doc-knowledge" | "faq" | "copilot-settings" | "ai-agent-config";

type AgentTabKey = "basic" | "conversation";

interface CopilotSetting {
  key: string;
  title: string;
  description: string;
  enabled: boolean;
}

interface CropState {
  imageSrc: string;
  naturalWidth: number;
  naturalHeight: number;
  offsetX: number;
  offsetY: number;
}

const props = defineProps<{
  activeKey: AiAgentNavKey;
}>();

const emit = defineEmits<{
  (e: "toast", message: string): void;
  (e: "dirty-change", dirty: boolean): void;
}>();

const AVATAR_CROP_SIZE = 240;
const AVATAR_CROP_DRAG_SCALE = 1.1;
const AVATAR_MAX_SIZE = 10 * 1024 * 1024; // 10MB

const createEmptyCropState = (): CropState => ({
  imageSrc: "",
  naturalWidth: 0,
  naturalHeight: 0,
  offsetX: 0,
  offsetY: 0
});

const showBanner = ref(true);
const agentTab = ref<AgentTabKey>("basic");
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

const agentResponseMode = ref("always");
const showMessageAgentLabel = ref(true);
const visitorInactiveMinutes = ref(10);
const replyMode = ref("strict");
const offlineMessage = ref("当前客服暂时不在线。你可以先留下问题或联系方式，我们会尽快与您联系。");
const transferMessage = ref("正在为您转接人工客服，请稍候，马上为您接入。");
const unsupportedQuestionMessage = ref("抱歉，这个问题我暂时还无法准确处理。您可以换一种说法继续提问，或直接转接人工客服获得帮助。");

const avatarInputRef = ref<HTMLInputElement | null>(null);
const cropModalOpen = ref(false);
const cropDragging = ref(false);
const cropDragStart = ref({ x: 0, y: 0, offsetX: 0, offsetY: 0 });
const cropState = ref<CropState>(createEmptyCropState());
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

const getConfigSnapshot = () =>
  JSON.stringify({
    agentEnabled: agentEnabled.value,
    agentResponseMode: agentResponseMode.value,
    showMessageAgentLabel: showMessageAgentLabel.value,
    botAvatarUrl: botAvatarUrl.value,
    botName: botName.value,
    botIntro: botIntro.value,
    selectedTone: selectedTone.value,
    defaultLanguage: defaultLanguage.value,
    visitorInactiveMinutes: visitorInactiveMinutes.value,
    replyMode: replyMode.value,
    offlineMessage: offlineMessage.value,
    transferMessage: transferMessage.value,
    unsupportedQuestionMessage: unsupportedQuestionMessage.value
  });

const savedSnapshot = ref(getConfigSnapshot());

const hasUnsavedChanges = computed(() => !initializing.value && getConfigSnapshot() !== savedSnapshot.value);

const persistAgentSettings = () => {
  const settings: StoredAiAgentSettings = {
    agentEnabled: agentEnabled.value,
    agentResponseMode: agentResponseMode.value,
    showMessageAgentLabel: showMessageAgentLabel.value,
    botAvatarUrl: botAvatarUrl.value,
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

  persistStoredAiAgentSettings(settings);
};

const loadAgentSettings = () => {
  const settings = loadStoredAiAgentSettings();

  if (typeof settings.agentEnabled === "boolean") agentEnabled.value = settings.agentEnabled;
  if (typeof settings.agentResponseMode === "string") agentResponseMode.value = settings.agentResponseMode;
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
  if (typeof settings.replyMode === "string") replyMode.value = settings.replyMode;
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
    showMessageAgentLabel.value = typeof settings.showMessageAgentLabel === "boolean" ? settings.showMessageAgentLabel : true;
    botAvatarUrl.value = settings.botAvatarUrl ?? "";
    botName.value = settings.botName ?? "AI Agent";
    botIntro.value = settings.botIntro ?? "";
    selectedTone.value = settings.selectedTone ?? "friendly";
    defaultLanguage.value = settings.defaultLanguage ?? "en";
    visitorInactiveMinutes.value = typeof settings.visitorInactiveMinutes === "number" ? settings.visitorInactiveMinutes : 10;
    replyMode.value = settings.replyMode ?? "strict";
    offlineMessage.value = settings.offlineMessage ?? "当前客服暂时不在线。你可以先留下问题或联系方式，我们会尽快与您联系。";
    transferMessage.value = settings.transferMessage ?? "正在为您转接人工客服，请稍候，马上为您接入。";
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

const basicFormValid = computed(() => botName.value.trim().length > 0);

const conversationFormValid = computed(
  () => transferMessage.value.trim().length > 0 && offlineMessage.value.trim().length > 0 && unsupportedQuestionMessage.value.trim().length > 0
);

const saveBasicSettings = () => {
  markSnapshotSaved();
  emitToast("基本设置已保存");
};

const saveConversationSettings = () => {
  markSnapshotSaved();
  emitToast("会话设置已保存");
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

const loadImageMeta = (src: string) =>
  new Promise<{ width: number; height: number }>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve({ width: image.naturalWidth, height: image.naturalHeight });
    image.onerror = () => reject(new Error("image-load-failed"));
    image.src = src;
  });

const loadImageElement = (src: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("image-load-failed"));
    image.src = src;
  });

const getCropDrawMetrics = () => {
  const { naturalWidth, naturalHeight, offsetX, offsetY } = cropState.value;
  if (!naturalWidth || !naturalHeight) {
    return {
      drawWidth: 0,
      drawHeight: 0,
      left: 0,
      top: 0,
      maxOffsetX: 0,
      maxOffsetY: 0
    };
  }

  const baseScale = Math.max(AVATAR_CROP_SIZE / naturalWidth, AVATAR_CROP_SIZE / naturalHeight);
  const drawWidth = naturalWidth * baseScale * AVATAR_CROP_DRAG_SCALE;
  const drawHeight = naturalHeight * baseScale * AVATAR_CROP_DRAG_SCALE;
  const maxOffsetX = Math.max(0, (drawWidth - AVATAR_CROP_SIZE) / 2);
  const maxOffsetY = Math.max(0, (drawHeight - AVATAR_CROP_SIZE) / 2);
  const clampedOffsetX = Math.max(-maxOffsetX, Math.min(maxOffsetX, offsetX));
  const clampedOffsetY = Math.max(-maxOffsetY, Math.min(maxOffsetY, offsetY));
  const left = AVATAR_CROP_SIZE / 2 - drawWidth / 2 + clampedOffsetX;
  const top = AVATAR_CROP_SIZE / 2 - drawHeight / 2 + clampedOffsetY;

  return {
    drawWidth,
    drawHeight,
    left,
    top,
    maxOffsetX,
    maxOffsetY
  };
};

const cropImageStyle = computed(() => {
  const { drawWidth, drawHeight, left, top } = getCropDrawMetrics();
  return {
    width: `${drawWidth}px`,
    height: `${drawHeight}px`,
    left: `${left}px`,
    top: `${top}px`
  };
});

const clampCropOffset = () => {
  const { maxOffsetX, maxOffsetY } = getCropDrawMetrics();
  cropState.value.offsetX = Math.max(-maxOffsetX, Math.min(maxOffsetX, cropState.value.offsetX));
  cropState.value.offsetY = Math.max(-maxOffsetY, Math.min(maxOffsetY, cropState.value.offsetY));
};

const openCropModalWithSource = async (source: string) => {
  try {
    const meta = await loadImageMeta(source);
    cropState.value = {
      imageSrc: source,
      naturalWidth: meta.width,
      naturalHeight: meta.height,
      offsetX: 0,
      offsetY: 0
    };
    cropModalOpen.value = true;
  } catch {
    emitToast("图片解析失败，请重试");
  }
};

const closeCropModal = () => {
  cropModalOpen.value = false;
  cropDragging.value = false;
  cropState.value = createEmptyCropState();
};

const startCropDrag = (event: MouseEvent) => {
  if (!cropState.value.imageSrc) return;
  cropDragging.value = true;
  cropDragStart.value = {
    x: event.clientX,
    y: event.clientY,
    offsetX: cropState.value.offsetX,
    offsetY: cropState.value.offsetY
  };
};

const handleCropDrag = (event: MouseEvent) => {
  if (!cropDragging.value) return;
  cropState.value.offsetX = cropDragStart.value.offsetX + (event.clientX - cropDragStart.value.x);
  cropState.value.offsetY = cropDragStart.value.offsetY + (event.clientY - cropDragStart.value.y);
  clampCropOffset();
};

const endCropDrag = () => {
  cropDragging.value = false;
};

const confirmCropImage = async () => {
  if (!cropState.value.imageSrc) return;

  try {
    const image = await loadImageElement(cropState.value.imageSrc);
    const canvas = document.createElement("canvas");
    canvas.width = AVATAR_CROP_SIZE;
    canvas.height = AVATAR_CROP_SIZE;
    const context = canvas.getContext("2d");
    if (!context) return;

    const { drawWidth, drawHeight, left, top } = getCropDrawMetrics();
    context.drawImage(image, left, top, drawWidth, drawHeight);
    botAvatarUrl.value = canvas.toDataURL("image/png");
    closeCropModal();
  } catch {
    emitToast("头像裁剪失败，请重试");
  }
};

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
    const source = await readFileAsDataUrl(file);
    await openCropModalWithSource(source);
  } catch {
    emitToast("头像读取失败，请重试");
  }
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

.setting-helper-stack {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.setting-callout {
  background: #f8e7a7;
  border-radius: 10px;
  padding: 12px 14px;
}

.setting-callout__text {
  color: #4f3a00;
  font-size: var(--agent-font-size-sm);
  font-weight: var(--agent-font-weight-medium);
  line-height: 1.6;
  margin: 0;
}

.setting-translation-note {
  color: var(--agent-color-text-secondary);
  font-size: var(--agent-font-size-sm);
  line-height: 1.7;
  margin: 0;
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

.form-row__error {
  color: #e53e3e;
  font-size: var(--agent-font-size-xs);
  line-height: 1.5;
  margin: 4px 0 0;
}

.agent-input--error {
  border-color: #e53e3e;
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
}

.bot-avatar-upload__input {
  display: none;
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

.modal-footer-actions {
  display: flex;
  gap: 8px;
}

.avatar-crop-modal {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.avatar-crop-modal__hint {
  color: var(--agent-color-text-secondary);
  font-size: var(--agent-font-size-sm);
  line-height: 1.6;
  margin: 0;
}

.avatar-crop-canvas {
  background: #f4f6fa;
  border: 1px solid var(--agent-color-border-default);
  border-radius: var(--agent-radius-lg);
  cursor: grab;
  height: 240px;
  margin: 0 auto;
  overflow: hidden;
  position: relative;
  width: 240px;
}

.avatar-crop-canvas::after {
  border: 1px solid rgba(255, 255, 255, 0.9);
  border-radius: var(--agent-radius-lg);
  box-shadow: 0 0 0 999px rgba(17, 24, 39, 0.08);
  content: "";
  inset: 0;
  pointer-events: none;
  position: absolute;
}

.avatar-crop-canvas--dragging {
  cursor: grabbing;
}

.avatar-crop-canvas img {
  position: absolute;
  user-select: none;
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

  .bot-avatar-upload {
    align-items: flex-start;
    flex-direction: column;
  }

  .avatar-crop-canvas {
    height: 220px;
    width: 220px;
  }
}
</style>
