<template>
  <div class="cw-chat">
    <header class="cw-chat-header">
      <div class="cw-chat-header__left">
        <button type="button" class="cw-chat-header__back" @click="$router.push('/sessions')">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>
        </button>
        <div class="cw-chat-header__avatar-wrap">
          <span class="cw-chat-header__avatar" :style="{ background: avatarGradient }">{{ avatarText }}</span>
          <span class="cw-chat-header__status-dot" :class="headerStatusClass" />
        </div>
        <div class="cw-chat-header__title-block">
          <span class="cw-chat-header__title">{{ displayName }}</span>
          <span class="cw-chat-header__subtitle">{{ headerSubtitle }}</span>
        </div>
      </div>
      <button type="button" class="cw-chat-header__close" aria-label="最小化" @click="$router.push('/minimized')">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" /></svg>
      </button>
    </header>

    <section class="cw-chat-demo">
      <div class="cw-chat-demo__chips">
        <span class="cw-chat-demo__chip">{{ agentEnabledLabel }}</span>
        <span class="cw-chat-demo__chip">{{ responseModeLabel }}</span>
        <span class="cw-chat-demo__chip">{{ languageLabel }}</span>
        <span class="cw-chat-demo__chip">{{ toneLabel }}</span>
        <span class="cw-chat-demo__chip">{{ replyModeLabel }}</span>
        <span class="cw-chat-demo__chip">{{ `不活跃 ${agentSettings.visitorInactiveMinutes} 分钟` }}</span>
      </div>
      <p class="cw-chat-demo__intro">{{ introText }}</p>
      <p class="cw-chat-demo__status">{{ statusText }}</p>
      <div class="cw-chat-demo__actions">
        <button
          v-if="agentSettings.agentResponseMode === 'offline-only'"
          type="button"
          class="cw-chat-demo__btn"
          @click="toggleHumanAvailability"
        >{{ humanOnline ? '模拟客服离线' : '模拟客服在线' }}</button>
        <button type="button" class="cw-chat-demo__btn" @click="simulateTransfer">模拟转人工</button>
        <button type="button" class="cw-chat-demo__btn" @click="simulateUnsupported">模拟图片/文件</button>
        <button type="button" class="cw-chat-demo__btn" @click="simulateInactivity">模拟不活跃关闭</button>
      </div>
    </section>

    <template v-if="sessionEnded">
      <div class="cw-feedback-area">
        <div class="cw-feedback-card">
          <p class="cw-feedback-card__title">Please evaluate our service</p>
          <div class="cw-feedback-options">
            <div
              v-for="opt in feedbackOptions"
              :key="opt.value"
              class="cw-feedback-option"
              :class="{ 'cw-feedback-option--selected': selectedFeedback === opt.value }"
              @click="selectedFeedback = opt.value"
            >
              <span class="cw-feedback-option__emoji">{{ opt.emoji }}</span>
              <span class="cw-feedback-option__label">{{ opt.label }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="cw-session-ended" @click="resetConversation">{{ endedText }}</div>
    </template>

    <template v-else>
      <div class="cw-messages">
        <div v-for="msg in messages" :key="msg.id" class="cw-msg" :class="msg.role === 'visitor' ? 'cw-msg--visitor' : 'cw-msg--agent'">
          <div v-if="msg.role === 'ai' && showAgentLabel" class="cw-msg__meta">
            <span class="cw-msg__badge">AI Agent</span>
            <span class="cw-msg__time">{{ msg.time }}</span>
          </div>
          <div v-else-if="msg.role === 'human'" class="cw-msg__meta">
            <span class="cw-msg__badge cw-msg__badge--human">人工客服</span>
            <span class="cw-msg__time">{{ msg.time }}</span>
          </div>
          <span v-else class="cw-msg__time">{{ msg.time }}</span>
          <div class="cw-msg__bubble" :class="msg.role === 'visitor' ? 'cw-msg__bubble--visitor' : ''">
            {{ msg.text }}
          </div>
          <span v-if="msg.role === 'visitor' && msg.readReceipt" class="cw-msg__receipt">
            <svg width="20" height="12" viewBox="0 0 20 12" fill="none" class="cw-msg__receipt-icon">
              <path d="M1.5 6.2L4.4 9l5-5.3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M8.2 6.2L11.1 9l5-5.3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </span>
        </div>
      </div>

      <div v-if="quickAccessItems.length > 0" class="cw-quick-access">
        <button v-for="item in quickAccessItems" :key="item.id" type="button" class="cw-quick-access__tag" @click="handleQuickAction(item.id)">
          {{ item.label }}
        </button>
      </div>

      <div class="cw-input-area">
        <div class="cw-input-box" contenteditable="true" @input="onInput" @keydown.enter.prevent="sendMessage" />
        <div class="cw-input-toolbar">
          <div class="cw-toolbar-icons">
            <span class="cw-toolbar-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" /><path d="M19 10v2a7 7 0 01-14 0v-2M12 19v4M8 23h8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" /></svg>
            </span>
            <button type="button" class="cw-toolbar-icon" @click="simulateUnsupported">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" /></svg>
            </button>
            <span class="cw-toolbar-icon cw-toolbar-icon--bg">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.6" /><path d="M8 14s1.5 2 4 2 4-2 4-2" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" /><circle cx="9" cy="9" r="1" fill="currentColor" /><circle cx="15" cy="9" r="1" fill="currentColor" /></svg>
            </span>
          </div>
          <button type="button" class="cw-send-btn" :class="{ 'cw-send-btn--active': inputText.trim().length > 0 }" @click="sendMessage">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>
          </button>
        </div>
      </div>
    </template>

    <div class="cw-footer">Powered by <strong>Chat</strong></div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import {
  buildAiReply,
  buildHumanReply,
  buildTransferConnectedReply,
  getAgentIntro,
  getAvatarGradient,
  getAvatarText,
  getLanguageLabel,
  getReplyModeLabel,
  getResponseModeLabel,
  getToneLabel,
  isTransferRequest,
  isUnsupportedRequest,
  loadAiAgentDemoSettings,
  type AiAgentDemoSettings
} from "../lib/aiAgentDemo";

type MessageRole = "visitor" | "ai" | "human";

interface Message {
  id: string;
  text: string;
  time: string;
  role: MessageRole;
  readReceipt?: boolean;
}

const agentSettings = ref<AiAgentDemoSettings>(loadAiAgentDemoSettings());
const sessionEnded = ref(false);
const selectedFeedback = ref<string | null>(null);
const inputText = ref("");
const endedText = ref("会话已结束，请重新咨询");
const humanOnline = ref(agentSettings.value.agentResponseMode === "offline-only" ? false : true);

const feedbackOptions = [
  { value: "good", emoji: "\u{1F60A}", label: "满意" },
  { value: "neutral", emoji: "\u{1F610}", label: "一般" },
  { value: "bad", emoji: "\u{1F61E}", label: "不满意" }
];

const quickAccessItems = reactive([
  { id: "help", label: "帮助中心" },
  { id: "transfer", label: "转人工" },
  { id: "file", label: "发送图片/文件" }
]);

const displayName = computed(() => agentSettings.value.botName);
const avatarText = computed(() => getAvatarText(agentSettings.value.botName));
const avatarGradient = computed(() => getAvatarGradient(agentSettings.value.botName));
const introText = computed(() => getAgentIntro(agentSettings.value));
const languageLabel = computed(() => getLanguageLabel(agentSettings.value.defaultLanguage));
const toneLabel = computed(() => getToneLabel(agentSettings.value.selectedTone));
const responseModeLabel = computed(() => getResponseModeLabel(agentSettings.value.agentResponseMode));
const replyModeLabel = computed(() => getReplyModeLabel(agentSettings.value.replyMode));
const agentEnabledLabel = computed(() => (agentSettings.value.agentEnabled ? "AI Agent 已开启" : "AI Agent 已关闭"));
const headerSubtitle = computed(() => {
  if (!agentSettings.value.agentEnabled) return "当前由人工客服接待";
  if (agentSettings.value.agentResponseMode === "offline-only") {
    return humanOnline.value ? "客服在线" : "客服离线，AI 接待中";
  }
  return "AI Agent 接待中";
});
const statusText = computed(() => {
  if (!agentSettings.value.agentEnabled) return "当前 AI Agent 已关闭，发送消息后将展示人工客服接待效果。";
  if (agentSettings.value.agentResponseMode === "offline-only") {
    return humanOnline.value
      ? "当前演示为客服在线状态，AI Agent 不主动回复；可点击上方按钮切换为离线。"
      : "当前演示为客服离线状态，由 AI Agent 自动接待并回复消息。";
  }
  return "当前演示为 AI Agent 始终回复模式，所有消息会按已配置语气和语言进行示例回复。";
});
const showAgentLabel = computed(() => agentSettings.value.agentEnabled && agentSettings.value.showMessageAgentLabel);
const headerStatusClass = computed(() => {
  if (!agentSettings.value.agentEnabled) return "cw-chat-header__status-dot--disabled";
  if (agentSettings.value.agentResponseMode === "offline-only" && humanOnline.value) {
    return "cw-chat-header__status-dot--human";
  }
  return "cw-chat-header__status-dot--ai";
});

let msgCounter = 1;
const messages = ref<Message[]>([]);

const getTime = () => {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
};

const pushMessage = (role: MessageRole, text: string, readReceipt = false) => {
  messages.value.push({
    id: `m-${msgCounter++}`,
    text,
    time: getTime(),
    role,
    readReceipt: role === "visitor" ? readReceipt : undefined
  });
};

const resetConversation = () => {
  sessionEnded.value = false;
  selectedFeedback.value = null;
  endedText.value = "会话已结束，请重新咨询";
  msgCounter = 1;
  messages.value = [];

  if (!agentSettings.value.agentEnabled) {
    pushMessage("human", buildHumanReply(agentSettings.value));
    return;
  }

  if (agentSettings.value.agentResponseMode === "offline-only" && humanOnline.value) {
    pushMessage("human", buildHumanReply(agentSettings.value));
    return;
  }

  pushMessage("ai", introText.value);
};

const shouldUseHumanReply = () => {
  if (!agentSettings.value.agentEnabled) return true;
  return agentSettings.value.agentResponseMode === "offline-only" && humanOnline.value;
};

const handleTransferFlow = () => {
  if (shouldUseHumanReply()) {
    pushMessage("human", buildTransferConnectedReply(agentSettings.value));
    return;
  }

  const humanAvailable = humanOnline.value || agentSettings.value.agentResponseMode === "always";
  if (humanAvailable) {
    pushMessage("ai", agentSettings.value.transferMessage);
    pushMessage("human", buildTransferConnectedReply(agentSettings.value));
    return;
  }

  pushMessage("ai", agentSettings.value.offlineMessage);
};

const handleAgentOrHumanReply = (text: string) => {
  if (isTransferRequest(text)) {
    handleTransferFlow();
    return;
  }

  if (shouldUseHumanReply()) {
    pushMessage("human", buildHumanReply(agentSettings.value));
    return;
  }

  if (isUnsupportedRequest(text)) {
    pushMessage("ai", agentSettings.value.unsupportedQuestionMessage);
    return;
  }

  pushMessage("ai", buildAiReply(agentSettings.value));
};

const onInput = (event: Event) => {
  inputText.value = (event.target as HTMLElement).textContent || "";
};

const clearInput = () => {
  inputText.value = "";
  const inputBox = document.querySelector(".cw-input-box") as HTMLElement | null;
  if (inputBox) inputBox.textContent = "";
};

const sendMessage = () => {
  const text = inputText.value.trim();
  if (!text || sessionEnded.value) return;

  pushMessage("visitor", text, true);
  clearInput();
  handleAgentOrHumanReply(text);
};

const simulateTransfer = () => {
  if (sessionEnded.value) return;
  pushMessage("visitor", "我想转人工客服", true);
  handleTransferFlow();
};

const simulateUnsupported = () => {
  if (sessionEnded.value) return;
  pushMessage("visitor", "[图片] order-screenshot.png", true);
  handleAgentOrHumanReply("图片 文件");
};

const simulateInactivity = () => {
  sessionEnded.value = true;
  endedText.value = `访客超过 ${agentSettings.value.visitorInactiveMinutes} 分钟未操作，会话已自动关闭，点击可重新开始演示`;
};

const toggleHumanAvailability = () => {
  humanOnline.value = !humanOnline.value;
  resetConversation();
};

const handleQuickAction = (actionId: string) => {
  if (actionId === "transfer") {
    simulateTransfer();
    return;
  }
  if (actionId === "file") {
    simulateUnsupported();
    return;
  }
  if (actionId === "help") {
    if (sessionEnded.value) return;
    pushMessage("visitor", "我想了解帮助中心的内容", true);
    handleAgentOrHumanReply("help center");
  }
};

resetConversation();
</script>

<style scoped>
.cw-chat {
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;
}

.cw-chat-header {
  align-items: center;
  background: #fff;
  border-bottom: 1px solid var(--agent-color-border-default);
  display: flex;
  flex-shrink: 0;
  justify-content: space-between;
  padding: 14px 16px;
}

.cw-chat-header__left {
  align-items: center;
  display: flex;
  gap: 10px;
  min-width: 0;
}

.cw-chat-header__back {
  align-items: center;
  background: none;
  border: none;
  color: var(--agent-color-text-secondary);
  cursor: pointer;
  display: inline-flex;
  padding: 0;
}

.cw-chat-header__avatar-wrap {
  display: inline-flex;
  flex-shrink: 0;
  position: relative;
}

.cw-chat-header__avatar {
  align-items: center;
  border-radius: 50%;
  color: #fff;
  display: inline-flex;
  font-size: 12px;
  font-weight: 700;
  height: 28px;
  justify-content: center;
  width: 28px;
}

.cw-chat-header__status-dot {
  border: 2px solid #fff;
  border-radius: 50%;
  bottom: -1px;
  height: 10px;
  position: absolute;
  right: -1px;
  width: 10px;
}

.cw-chat-header__status-dot--ai {
  background: #2f6bff;
}

.cw-chat-header__status-dot--human {
  background: #22c55e;
}

.cw-chat-header__status-dot--disabled {
  background: #c3cad7;
}

.cw-chat-header__title-block {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.cw-chat-header__title {
  color: var(--agent-color-text-primary);
  font-size: 13px;
  font-weight: 600;
}

.cw-chat-header__subtitle {
  color: var(--agent-color-text-tertiary);
  font-size: 10px;
  line-height: 1.4;
}

.cw-chat-header__close {
  align-items: center;
  background: none;
  border: none;
  border-radius: 50%;
  color: var(--agent-color-text-secondary);
  cursor: pointer;
  display: flex;
  flex-shrink: 0;
  height: 28px;
  justify-content: center;
  transition: background 0.15s, color 0.15s;
  width: 28px;
}

.cw-chat-header__close:hover {
  background: var(--agent-color-bg-hover, rgba(0, 0, 0, 0.06));
  color: var(--agent-color-text-primary);
}

.cw-chat-demo {
  background: linear-gradient(180deg, #f8fbff 0%, #ffffff 100%);
  border-bottom: 1px solid rgba(15, 23, 42, 0.06);
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 12px 14px;
}

.cw-chat-demo__chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.cw-chat-demo__chip {
  background: rgba(47, 107, 255, 0.08);
  border: 1px solid rgba(47, 107, 255, 0.12);
  border-radius: 999px;
  color: var(--agent-color-brand-primary);
  font-size: 10px;
  font-weight: 600;
  padding: 4px 8px;
}

.cw-chat-demo__intro,
.cw-chat-demo__status {
  color: var(--agent-color-text-secondary);
  font-size: 11px;
  line-height: 1.6;
  margin: 0;
}

.cw-chat-demo__intro {
  color: var(--agent-color-text-primary);
}

.cw-chat-demo__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.cw-chat-demo__btn {
  background: #fff;
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 999px;
  color: var(--agent-color-text-secondary);
  cursor: pointer;
  font-size: 10px;
  font-weight: 600;
  padding: 6px 10px;
}

.cw-chat-demo__btn:hover {
  border-color: var(--agent-color-brand-primary);
  color: var(--agent-color-brand-primary);
}

.cw-messages {
  background: #f5f5f5;
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 10px;
  min-height: 160px;
  overflow-y: auto;
  padding: 14px;
}

.cw-msg {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.cw-msg--visitor {
  align-items: flex-end;
}

.cw-msg__meta {
  align-items: center;
  display: flex;
  gap: 6px;
}

.cw-msg__time {
  color: var(--agent-color-text-tertiary);
  font-size: 10px;
  line-height: 1;
}

.cw-msg__badge {
  background: rgba(47, 107, 255, 0.08);
  border: 1px solid rgba(47, 107, 255, 0.18);
  border-radius: 999px;
  color: var(--agent-color-brand-primary);
  font-size: 10px;
  font-weight: 600;
  line-height: 1;
  padding: 4px 8px;
}

.cw-msg__badge--human {
  background: rgba(15, 23, 42, 0.06);
  border-color: rgba(15, 23, 42, 0.08);
  color: var(--agent-color-text-secondary);
}

.cw-msg__bubble {
  background: #fff;
  border-radius: 12px;
  color: var(--agent-color-text-primary);
  font-size: 12px;
  line-height: 1.6;
  max-width: 280px;
  padding: 8px 12px;
}

.cw-msg__bubble--visitor {
  background: var(--agent-color-brand-primary);
  color: #fff;
}

.cw-msg__receipt {
  color: #2f6bff;
  display: inline-flex;
  margin-top: 2px;
}

.cw-msg__receipt-icon {
  display: block;
}

.cw-quick-access {
  background: #fff;
  border-top: 1px solid var(--agent-color-border-default);
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  padding: 8px 14px;
}

.cw-quick-access__tag {
  background: #f0f2f5;
  border: none;
  border-radius: 999px;
  color: var(--agent-color-text-secondary);
  cursor: pointer;
  font-size: 10px;
  padding: 3px 10px;
  transition: background 0.15s;
}

.cw-quick-access__tag:hover {
  background: #e5e7eb;
}

.cw-input-area {
  background: transparent;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  gap: 12px;
  margin: 0 8px 8px;
  padding: 12px 0 8px;
}

.cw-input-box {
  color: var(--agent-color-text-primary);
  font-size: 12px;
  line-height: 1.4;
  min-height: 20px;
  outline: none;
  padding: 0 14px;
}

.cw-input-box:empty::before {
  color: rgba(100, 116, 145, 0.5);
  content: "输入消息...";
}

.cw-input-toolbar {
  align-items: center;
  display: flex;
  justify-content: space-between;
  padding: 0 8px;
}

.cw-toolbar-icons {
  align-items: center;
  display: flex;
}

.cw-toolbar-icon {
  align-items: center;
  background: transparent;
  border: none;
  border-radius: 10px;
  color: #4a5568;
  cursor: pointer;
  display: inline-flex;
  height: 34px;
  justify-content: center;
  width: 34px;
}

.cw-toolbar-icon--bg {
  background: #f5f7f9;
  border-radius: 9px;
}

.cw-send-btn {
  align-items: center;
  background: #f2f4f8;
  border: none;
  border-radius: 50%;
  color: #8c96a6;
  cursor: pointer;
  display: inline-flex;
  flex-shrink: 0;
  height: 32px;
  justify-content: center;
  transition: background 0.15s, color 0.15s;
  width: 32px;
}

.cw-send-btn--active {
  background: var(--agent-color-brand-primary);
  color: #fff;
}

.cw-feedback-area {
  background: linear-gradient(180deg, #e8f0fe 0%, #f5f8ff 100%);
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: 16px;
}

.cw-feedback-card {
  align-items: center;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 18px 16px;
}

.cw-feedback-card__title {
  color: var(--agent-color-text-primary);
  font-size: 12px;
  font-weight: 600;
  margin: 0;
  text-align: center;
}

.cw-feedback-options {
  display: flex;
  gap: 24px;
  justify-content: center;
}

.cw-feedback-option {
  align-items: center;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.cw-feedback-option__emoji {
  filter: grayscale(0.8);
  font-size: 26px;
  line-height: 1;
  transition: filter 0.15s;
}

.cw-feedback-option:hover .cw-feedback-option__emoji,
.cw-feedback-option--selected .cw-feedback-option__emoji {
  filter: grayscale(0);
}

.cw-feedback-option__label {
  color: var(--agent-color-text-secondary);
  font-size: 10px;
}

.cw-session-ended {
  background: #e8f0fe;
  border-radius: 8px;
  color: var(--agent-color-brand-primary);
  cursor: pointer;
  flex-shrink: 0;
  font-size: 12px;
  font-weight: 500;
  margin: 0 12px 10px;
  padding: 10px;
  text-align: center;
}

.cw-footer {
  background: #fff;
  color: var(--agent-color-text-tertiary);
  flex-shrink: 0;
  font-size: 10px;
  padding: 6px;
  text-align: center;
}
</style>
