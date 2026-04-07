<template>
  <div class="cw-chat">
    <header class="cw-chat-header">
      <div class="cw-chat-header__left">
        <button type="button" class="cw-chat-header__back" @click="$router.push('/sessions')">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>
        </button>
        <div class="cw-chat-header__avatar-wrap">
          <img v-if="sessionTitleMode === 'agent' && agentName" :src="agentAvatar" class="cw-chat-header__avatar-img" alt="" />
          <span v-else class="cw-chat-header__avatar" :style="{ background: avatarGradient }">{{ avatarText }}</span>
        </div>
        <div class="cw-chat-header__title-block">
          <span class="cw-chat-header__title">{{ headerTitle }}</span>
        </div>
      </div>
      <button type="button" class="cw-chat-header__close" aria-label="最小化" @click="$router.push('/minimized')">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" /></svg>
      </button>
    </header>

    <div class="cw-chat-float-tools">
      <button
        v-if="agentSettings.agentResponseMode === 'offline-only'"
        type="button"
        class="cw-chat-float-tools__btn"
        :class="{ 'cw-chat-float-tools__btn--active': humanOnline }"
        @click="toggleHumanAvailability"
      >{{ humanOnline ? '模拟客服在线' : '模拟客服离线' }}</button>
      <div class="cw-chat-float-tools__group">
        <button
          type="button"
          class="cw-chat-float-tools__chip"
          @click="simulateNormalMessage"
        >模拟正常消息</button>
        <button
          type="button"
          class="cw-chat-float-tools__chip"
          :class="{ 'cw-chat-float-tools__chip--active': floatingToggles.transfer }"
          @click="toggleFloatingAction('transfer')"
        >模拟转人工</button>
        <button
          type="button"
          class="cw-chat-float-tools__chip"
          :class="{ 'cw-chat-float-tools__chip--active': floatingToggles.file }"
          @click="toggleFloatingAction('file')"
        >模拟图片/文件</button>
        <button
          type="button"
          class="cw-chat-float-tools__chip"
          :class="{ 'cw-chat-float-tools__chip--active': floatingToggles.inactivity }"
          @click="toggleFloatingAction('inactivity')"
        >模拟不活跃关闭</button>
        <button
          type="button"
          class="cw-chat-float-tools__chip"
          @click="simulateRiskMessage"
        >模拟风控触发</button>
      </div>
    </div>

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
              @click="selectFeedback(opt.value)"
            >
              <span class="cw-feedback-option__emoji">{{ opt.emoji }}</span>
              <span class="cw-feedback-option__label">{{ opt.label }}</span>
            </div>
          </div>
          <p v-if="selectedFeedback" class="cw-feedback-card__result">已评价：{{ feedbackLabel }}</p>
        </div>
      </div>
      <div class="cw-session-ended">{{ endedText }}</div>
    </template>

    <template v-else>
      <div class="cw-messages">
        <div v-if="showQueuePosition && isQueuing && !agentSettings.agentEnabled" class="cw-queue-pill">
          <span>排队中，前面还有<strong class="cw-queue-pill-num">{{ queuePosition }}</strong>人</span>
        </div>
        <div v-for="msg in messages" :key="msg.id" class="cw-msg" :class="[msg.role === 'visitor' ? 'cw-msg--visitor' : msg.role === 'risk-alert' || msg.role === 'feedback' ? 'cw-msg--risk-alert' : 'cw-msg--agent']">
          <template v-if="msg.role === 'risk-alert' || msg.role === 'feedback'">
            <div class="cw-msg__system-text">{{ msg.text }}</div>
          </template>
          <template v-else>
          <span class="cw-msg__time">{{ msg.time }}</span>
          <div class="cw-msg__bubble" :class="[{ 'cw-msg__bubble--visitor': msg.role === 'visitor' }, { 'cw-msg__bubble--typing': msg.pending }]">
            <template v-if="msg.pending">
              <span class="cw-msg__typing" aria-label="Autopilot 发送中">
                <span class="cw-msg__typing-dot"></span>
                <span class="cw-msg__typing-dot"></span>
                <span class="cw-msg__typing-dot"></span>
              </span>
            </template>
            <template v-else>
              {{ msg.text }}
              <span v-if="msg.role === 'ai' && showAgentLabel" class="cw-msg__bubble-label">Autopilot</span>
            </template>
          </div>
          </template>
        </div>
      </div>

      <div class="cw-quick-access">
        <div class="cw-quick-access__btn-group">
            <div
              class="cw-quick-access__btn"
              @mouseenter="showFeedbackCard = true"
              @mouseleave="showFeedbackCard = false"
            >
              <svg class="cw-quick-access__icon" width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.27 5.82 21 7 14.14l-5-4.87 6.91-1.01L12 2z" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              <span class="cw-quick-access__text">会话评价</span>

              <div v-if="showFeedbackCard" class="cw-feedback-hover-card" @click.stop>
                <p class="cw-feedback-hover-card__title">请对我们的服务进行评价</p>
                <div class="cw-feedback-hover-card__options">
                  <div
                    v-for="opt in feedbackOptions"
                    :key="opt.value"
                    class="cw-feedback-hover-card__option"
                    :class="{ 'cw-feedback-hover-card__option--selected': selectedFeedback === opt.value }"
                    @click="handleFeedbackClick(opt.value)"
                  >
                    <span class="cw-feedback-hover-card__emoji">{{ opt.emoji }}</span>
                    <span class="cw-feedback-hover-card__label">{{ opt.label }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
      </div>

      <div class="cw-input-area">
        <div class="cw-input-card">
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
      </div>
    </template>

    <transition name="cw-toast-fade">
      <div v-if="toastVisible" class="cw-toast">
        {{ toastMessage }}
      </div>
    </transition>

    <div class="cw-footer">Powered by <strong>Chat</strong></div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, reactive, ref } from "vue";
import {
  buildAiReply,
  buildHumanReply,
  buildTransferConnectedReply,
  getAvatarGradient,
  getAvatarText,
  isTransferRequest,
  isUnsupportedRequest,
  loadAiAgentDemoSettings,
  type AiAgentDemoSettings
} from "../lib/aiAgentDemo";
import { detectRisk, resetRiskAlerts } from "../lib/riskControl";

type MessageRole = "visitor" | "ai" | "human" | "risk-alert" | "feedback";

interface Message {
  id: string;
  text: string;
  time: string;
  role: MessageRole;
  pending?: boolean;
  readReceipt?: boolean;
}

const agentSettings = ref<AiAgentDemoSettings>(loadAiAgentDemoSettings());
const sessionEnded = ref(false);
const selectedFeedback = ref<string | null>(null);
const showFeedbackCard = ref(false);
const inputText = ref("");
const endedText = ref("会话已结束，请重新咨询");
const humanOnline = ref(agentSettings.value.agentResponseMode === "offline-only" ? false : true);

const toastMessage = ref("");
const toastVisible = ref(false);
let toastTimer: number | null = null;

const feedbackOptions = [
  { value: "good", emoji: "\u{1F60A}", label: "满意" },
  { value: "neutral", emoji: "\u{1F610}", label: "一般" },
  { value: "bad", emoji: "\u{1F61E}", label: "不满意" }
];

const feedbackLabel = computed(() => {
  const opt = feedbackOptions.find(o => o.value === selectedFeedback.value);
  return opt ? opt.label : "";
});

const hasVisitorSent = computed(() => messages.value.some(m => m.role === "visitor"));

const showToast = (message: string) => {
  if (toastTimer) {
    clearTimeout(toastTimer);
  }
  toastMessage.value = message;
  toastVisible.value = true;
  toastTimer = window.setTimeout(() => {
    toastVisible.value = false;
    toastTimer = null;
  }, 2000);
};

const handleFeedbackClick = (value: string) => {
  // 1. 判断会话是否创建
  if (!hasVisitorSent.value) {
    showToast("请先发送消息创建会话");
    return;
  }

  // 2. 判断是否在排队中
  if (isQueuing.value) {
    showToast("排队中无法评价，请等待客服接待");
    return;
  }

  // 3. 执行评价逻辑
  if (selectedFeedback.value === value) {
    selectedFeedback.value = null;
    showFeedbackCard.value = false;
    pushMessage("feedback", "你取消了评价");
    return;
  }
  selectedFeedback.value = value;
  showFeedbackCard.value = false;
  const opt = feedbackOptions.find(o => o.value === value);
  const label = opt ? opt.label : value;
  pushMessage("feedback", `你提交了评价：${label}`);
};

const floatingToggles = reactive({
  transfer: false,
  file: false,
  inactivity: false
});

const avatarText = computed(() => getAvatarText(agentSettings.value.botName));
const avatarGradient = computed(() => getAvatarGradient(agentSettings.value.botName));
const showAgentLabel = computed(() => agentSettings.value.agentEnabled && agentSettings.value.showMessageAgentLabel);

/** 模拟设置：会话标题展示模式 */
const sessionTitleMode = ref<"ai" | "agent">("agent");
/** 模拟设置：是否显示排队位置 */
const showQueuePosition = ref(true);
/** 模拟排队状态 */
const isQueuing = ref(true);
const queuePosition = ref(3);
/** 模拟客服信息 */
const agentName = ref("客服小李");
const agentAvatar = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='184' height='184' viewBox='0 0 184 184'%3E%3Ccircle cx='92' cy='92' r='90' fill='%23C9CED8' stroke='%23F5F7FA' stroke-width='4'/%3E%3Ccircle cx='92' cy='68' r='30' fill='%23EEF1F5'/%3E%3Cpath d='M28 156c10-28 34-46 64-46s54 18 64 46' fill='%23EEF1F5'/%3E%3C/svg%3E";

const headerTitle = computed(() => {
  if (sessionTitleMode.value === "agent" && agentName.value) return `与${agentName.value}的会话`;
  return "新的会话";
});

let msgCounter = 1;
const messages = ref<Message[]>([]);
const aiReplyTimers: number[] = [];

const getTime = () => {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
};

const createMessageId = () => `m-${msgCounter++}`;

const pushMessage = (role: MessageRole, text: string, readReceipt = false, pending = false) => {
  const id = createMessageId();
  messages.value.push({
    id,
    text,
    time: getTime(),
    role,
    pending,
    readReceipt: role === "visitor" ? readReceipt : undefined
  });

  // 文本消息风控检测（risk-alert 和 pending 消息不检测）
  if (role !== "risk-alert" && !pending && text.trim()) {
    checkRisk(text);
  }

  return id;
};

const clearAiReplyTimers = () => {
  aiReplyTimers.forEach((timer) => window.clearTimeout(timer));
  aiReplyTimers.length = 0;
};

const scheduleAiMessage = (text: string, afterDeliver?: () => void, delay = 900) => {
  const pendingId = pushMessage("ai", "", false, true);
  const timerId = window.setTimeout(() => {
    const timerIndex = aiReplyTimers.indexOf(timerId);
    if (timerIndex >= 0) {
      aiReplyTimers.splice(timerIndex, 1);
    }

    const pendingMessage = messages.value.find((message) => message.id === pendingId);
    if (pendingMessage) {
      pendingMessage.text = text;
      pendingMessage.time = getTime();
      pendingMessage.pending = false;
    } else {
      pushMessage("ai", text);
    }

    afterDeliver?.();
  }, delay);

  aiReplyTimers.push(timerId);
};

const resetConversation = () => {
  clearAiReplyTimers();
  resetRiskAlerts();
  sessionEnded.value = false;
  selectedFeedback.value = null;
  showFeedbackCard.value = false;
  endedText.value = "会话已结束，请重新咨询";
  msgCounter = 1;
  messages.value = [];
};

const checkRisk = async (text: string) => {
  const result = await detectRisk(text);
  if (result.hit && result.alertMessage) {
    pushMessage("risk-alert", result.alertMessage);
  }
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
    scheduleAiMessage(agentSettings.value.transferMessage, () => {
      pushMessage("human", buildTransferConnectedReply(agentSettings.value));
    });
    return;
  }

  scheduleAiMessage(agentSettings.value.offlineMessage);
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
    scheduleAiMessage(agentSettings.value.unsupportedQuestionMessage);
    return;
  }

  scheduleAiMessage(buildAiReply(agentSettings.value));
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

const simulateNormalMessage = () => {
  if (sessionEnded.value) return;

  const text = "你好，我想了解一下产品价格和发货时间。";
  pushMessage("visitor", text, true);
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
  clearAiReplyTimers();
  sessionEnded.value = true;
  endedText.value = "会话已结束，请重新咨询";
};

const simulateRiskMessage = () => {
  if (sessionEnded.value) return;
  resetRiskAlerts();
  pushMessage("visitor", "请把钱转账到我的银行卡账号 6228 **** **** 1234", true);
};

const toggleHumanAvailability = () => {
  humanOnline.value = !humanOnline.value;
  resetConversation();
};

const toggleFloatingAction = (actionId: keyof typeof floatingToggles) => {
  const nextActive = !floatingToggles[actionId];
  floatingToggles[actionId] = nextActive;

  if (!nextActive) return;

  if (actionId === "transfer") {
    simulateTransfer();
    return;
  }

  if (actionId === "file") {
    simulateUnsupported();
    return;
  }

  simulateInactivity();
};

onBeforeUnmount(() => {
  clearAiReplyTimers();
});

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
}

.cw-chat-header__avatar-img {
  border-radius: 50%;
  height: 28px;
  object-fit: cover;
  width: 28px;
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

.cw-chat-float-tools {
  align-items: flex-start;
  background: rgba(255, 255, 255, 0.98);
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 12px;
  box-shadow: 0 10px 28px rgba(15, 23, 42, 0.12);
  display: flex;
  flex-direction: column;
  gap: 8px;
  left: -12px;
  padding: 10px;
  position: absolute;
  top: 60px;
  transform: translateX(-100%);
  z-index: 3;
}

.cw-chat-float-tools__group {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  max-width: 240px;
}

.cw-chat-float-tools__btn,
.cw-chat-float-tools__chip {
  background: #fff;
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 999px;
  color: var(--agent-color-text-secondary);
  cursor: pointer;
  font-size: 10px;
  font-weight: 600;
  padding: 6px 10px;
  transition: border-color 0.15s, color 0.15s, background 0.15s;
}

.cw-chat-float-tools__btn:hover,
.cw-chat-float-tools__chip:hover,
.cw-chat-float-tools__btn--active,
.cw-chat-float-tools__chip--active {
  background: rgba(47, 107, 255, 0.08);
  border-color: rgba(47, 107, 255, 0.24);
  color: var(--agent-color-brand-primary);
}

.cw-queue-pill {
  align-self: center;
  background: #fff;
  border-radius: 999px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  color: #666;
  font-size: 11px;
  font-weight: 500;
  margin-bottom: 10px;
  padding: 6px 14px;
  text-align: center;
}

.cw-queue-pill-num {
  color: #ff6b2c;
  font-weight: 700;
}

.cw-quick-access {
  margin: 0 8px 4px;
  padding: 0 0 0 12px;
}

.cw-quick-access__btn-group {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.cw-quick-access__btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  background: transparent;
  border-radius: 16px;
  font-size: 13px;
  color: #4a5568;
  cursor: pointer;
  transition: all 0.2s;
}

.cw-quick-access__btn:hover {
  background: #e2e8f0;
}

.cw-quick-access__icon {
  width: 14px;
  height: 14px;
  stroke: currentColor;
  fill: none;
  stroke-width: 1.6;
}

.cw-quick-access__text {
  font-weight: 500;
}

.cw-feedback-hover-card {
  position: absolute;
  bottom: calc(100% + 8px);
  left: 0;
  min-width: 280px;
  padding: 16px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  z-index: 10;
}

.cw-feedback-hover-card__title {
  margin: 0 0 12px;
  font-size: 14px;
  font-weight: 500;
  color: #2d3748;
}

.cw-feedback-hover-card__options {
  display: flex;
  gap: 12px;
}

.cw-feedback-hover-card__option {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 12px 8px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.cw-feedback-hover-card__option:hover {
  background: #f7fafc;
}

.cw-feedback-hover-card__option--selected {
  background: #ebf8ff;
}

.cw-feedback-hover-card__emoji {
  font-size: 24px;
  filter: grayscale(0.8);
  transition: filter 0.2s;
}

.cw-feedback-hover-card__option:hover .cw-feedback-hover-card__emoji,
.cw-feedback-hover-card__option--selected .cw-feedback-hover-card__emoji {
  filter: grayscale(0);
}

.cw-feedback-hover-card__label {
  font-size: 12px;
  color: #4a5568;
}

.cw-toast {
  position: fixed;
  top: 16px;
  left: 50%;
  transform: translateX(-50%);
  padding: 10px 20px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  border-radius: 8px;
  font-size: 14px;
  z-index: 1000;
  pointer-events: none;
}

.cw-toast-fade-enter-active,
.cw-toast-fade-leave-active {
  transition: opacity 0.3s;
}

.cw-toast-fade-enter-from,
.cw-toast-fade-leave-to {
  opacity: 0;
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

.cw-msg--risk-alert {
  align-items: center;
}

.cw-msg__system-text {
  color: #999;
  font-size: 11px;
  line-height: 1.6;
  max-width: 280px;
  padding: 4px 0;
  text-align: center;
}


.cw-msg__time {
  color: var(--agent-color-text-tertiary);
  font-size: 10px;
  line-height: 1;
}



.cw-msg__bubble {
  background: #fff;
  border-radius: 12px;
  color: var(--agent-color-text-primary);
  font-size: 12px;
  min-height: 18px;
  line-height: 1.6;
  max-width: 280px;
  padding: 8px 12px;
}

.cw-msg__bubble--visitor {
  background: var(--agent-color-brand-primary);
  color: #fff;
}

.cw-msg__bubble-label {
  color: #8c96a6;
  display: block;
  font-size: 10px;
  line-height: 1.4;
  margin-top: 6px;
}

.cw-msg__bubble--typing {
  min-width: 48px;
}

.cw-msg__typing {
  align-items: center;
  display: inline-flex;
  gap: 4px;
  height: 18px;
}

.cw-msg__typing-dot {
  animation: cw-msg-typing 1.2s infinite ease-in-out;
  background: #9aa4b2;
  border-radius: 50%;
  display: inline-block;
  height: 6px;
  opacity: 0.4;
  width: 6px;
}

.cw-msg__typing-dot:nth-child(2) {
  animation-delay: 0.15s;
}

.cw-msg__typing-dot:nth-child(3) {
  animation-delay: 0.3s;
}

@keyframes cw-msg-typing {
  0%,
  80%,
  100% {
    opacity: 0.35;
    transform: translateY(0);
  }

  40% {
    opacity: 1;
    transform: translateY(-1px);
  }
}


.cw-input-area {
  background: transparent;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  gap: 8px;
  margin: 0 8px 8px;
  padding: 0;
}

.cw-input-card {
  background: #fff;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
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
  flex-shrink: 0;
  font-size: 12px;
  font-weight: 500;
  margin: 0 12px 10px;
  padding: 10px;
  text-align: center;
}

.cw-feedback-card__result {
  color: var(--agent-color-brand-primary);
  font-size: 11px;
  font-weight: 500;
  margin: 0;
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
