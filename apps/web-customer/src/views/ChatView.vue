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

      <div ref="quickAccessRef" class="cw-quick-access">
        <div ref="quickAccessScrollRef" class="cw-quick-access__scroll" @scroll="handleQuickAccessScroll">
          <div class="cw-quick-access__btn-group">
            <button
              ref="feedbackTriggerRef"
              type="button"
              class="cw-quick-access__btn cw-quick-access__btn--feedback"
              @mouseenter="openFeedbackCard"
              @mouseleave="scheduleHideFeedbackCard"
            >
              <span class="cw-quick-access__icon cw-quick-access__icon--image" aria-hidden="true">
                <img :src="feedbackQuickAccessIcon" alt="" />
              </span>
              <span class="cw-quick-access__text">会话评价</span>
            </button>
            <button
              v-for="item in quickAccessItems"
              :key="item.id"
              type="button"
              class="cw-quick-access__btn"
              @click="handleQuickAccessAction(item)"
            >
              <span
                class="cw-quick-access__icon"
                :class="{
                  'cw-quick-access__icon--image': isImageIcon(item.icon),
                  'cw-quick-access__icon--emoji': item.icon && !isImageIcon(item.icon)
                }"
                aria-hidden="true"
              >
                <img v-if="item.icon && isImageIcon(item.icon)" :src="item.icon" alt="" />
                <span v-else>{{ item.icon || item.label.slice(0, 1) }}</span>
              </span>
              <span v-if="item.label" class="cw-quick-access__text">{{ item.label }}</span>
            </button>
          </div>
        </div>

        <div
          v-if="showFeedbackCard"
          class="cw-feedback-hover-card"
          :style="{ left: `${feedbackCardLeft}px` }"
          @mouseenter="openFeedbackCard"
          @mouseleave="scheduleHideFeedbackCard"
          @click.stop
        >
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
import { computed, nextTick, onBeforeUnmount, reactive, ref } from "vue";
import {
  FEEDBACK_QUICK_ACCESS_ICON,
  getWidgetQuickAccessItems,
  type QuickAccessItem,
  useTenant
} from "@twt/branding";
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
const tenant = useTenant();
const sessionEnded = ref(false);
const selectedFeedback = ref<string | null>(null);
const showFeedbackCard = ref(false);
const inputText = ref("");
const endedText = ref("会话已结束，请重新咨询");
const humanOnline = ref(agentSettings.value.agentResponseMode === "offline-only" ? false : true);

const toastMessage = ref("");
const toastVisible = ref(false);
let toastTimer: number | null = null;
let feedbackHideTimer: number | null = null;
const feedbackQuickAccessIcon = FEEDBACK_QUICK_ACCESS_ICON;
const quickAccessRef = ref<HTMLElement | null>(null);
const quickAccessScrollRef = ref<HTMLElement | null>(null);
const feedbackTriggerRef = ref<HTMLElement | null>(null);
const feedbackCardLeft = ref(0);

const feedbackOptions = [
  { value: "good", emoji: "\u{1F60A}", label: "满意" },
  { value: "neutral", emoji: "\u{1F610}", label: "一般" },
  { value: "bad", emoji: "\u{1F61E}", label: "不满意" }
];

const feedbackLabel = computed(() => {
  const opt = feedbackOptions.find(o => o.value === selectedFeedback.value);
  return opt ? opt.label : "";
});
const quickAccessItems = computed(() => getWidgetQuickAccessItems(tenant));

const hasVisitorSent = computed(() => messages.value.some(m => m.role === "visitor"));
const isImageIcon = (icon?: string) => Boolean(icon && /^(data:image|https?:\/\/|\/)/.test(icon));

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

const clearFeedbackHideTimer = () => {
  if (feedbackHideTimer) {
    clearTimeout(feedbackHideTimer);
    feedbackHideTimer = null;
  }
};

const updateFeedbackCardPosition = () => {
  if (!quickAccessRef.value || !feedbackTriggerRef.value) return;

  const quickAccessRect = quickAccessRef.value.getBoundingClientRect();
  const triggerRect = feedbackTriggerRef.value.getBoundingClientRect();
  feedbackCardLeft.value = Math.max(0, triggerRect.left - quickAccessRect.left);
};

const openFeedbackCard = async () => {
  clearFeedbackHideTimer();
  showFeedbackCard.value = true;
  await nextTick();
  updateFeedbackCardPosition();
};

const scheduleHideFeedbackCard = () => {
  clearFeedbackHideTimer();
  feedbackHideTimer = window.setTimeout(() => {
    showFeedbackCard.value = false;
    feedbackHideTimer = null;
  }, 120);
};

const handleQuickAccessScroll = () => {
  if (!showFeedbackCard.value) return;
  updateFeedbackCardPosition();
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

const normalizeLink = (url: string) => {
  if (!url) return "#";
  if (/^https?:\/\//i.test(url) || url.startsWith("/")) return url;
  return `https://${url}`;
};

const handleQuickAccessAction = async (item: QuickAccessItem) => {
  if (sessionEnded.value) return;

  const actionType = item.actionType ?? "link";

  if (actionType === "copy") {
    if (!navigator.clipboard?.writeText) {
      showToast("当前浏览器不支持复制");
      return;
    }

    try {
      await navigator.clipboard.writeText(item.url);
      showToast("已复制快捷入口内容");
    } catch {
      showToast("复制失败，请稍后重试");
    }
    return;
  }

  if (actionType === "message") {
    const message = item.url.trim() || item.label.trim();
    if (!message) return;

    pushMessage("visitor", message, true);
    handleAgentOrHumanReply(message);
    return;
  }

  if (!item.url || item.url === "#") return;

  window.open(normalizeLink(item.url), "_blank", "noopener,noreferrer");
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
  clearFeedbackHideTimer();
});

resetConversation();
</script>

<style scoped>
.cw-chat {
  background: #f4f7fb;
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
  align-items: center;
  background: transparent;
  display: flex;
  flex-shrink: 0;
  margin: 0 14px 8px;
  min-height: 34px;
  position: relative;
}

.cw-quick-access__scroll {
  background: transparent;
  max-width: 100%;
  overflow-x: auto;
  scrollbar-width: none;
}

.cw-quick-access__scroll::-webkit-scrollbar {
  display: none;
}

.cw-quick-access__btn-group {
  display: flex;
  gap: 8px;
  width: max-content;
}

.cw-quick-access__btn {
  align-items: center;
  background: #fff;
  border: 1px solid rgba(217, 226, 239, 0.92);
  border-radius: 999px;
  box-shadow: 0 4px 10px rgba(15, 23, 42, 0.04);
  color: #1f2937;
  cursor: pointer;
  display: inline-flex;
  flex: 0 0 auto;
  gap: 6px;
  font-size: 12px;
  min-height: 34px;
  padding: 4px 10px;
  position: relative;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.cw-quick-access__btn:hover {
  border-color: rgba(191, 203, 220, 0.96);
  box-shadow: 0 4px 10px rgba(15, 23, 42, 0.04);
}

.cw-quick-access__icon {
  align-items: center;
  background: #eef3ff;
  border-radius: 50%;
  color: #42526b;
  display: inline-flex;
  flex-shrink: 0;
  font-size: 14px;
  height: 20px;
  justify-content: center;
  overflow: hidden;
  width: 20px;
}

.cw-quick-access__icon--image {
  background: transparent;
}

.cw-quick-access__icon img {
  display: block;
  height: 100%;
  object-fit: cover;
  width: 100%;
}

.cw-quick-access__text {
  color: #1f2937;
  line-height: 1;
  font-weight: 500;
  white-space: nowrap;
}

.cw-feedback-hover-card {
  background: white;
  border: 1px solid rgba(148, 163, 184, 0.16);
  border-radius: 12px;
  bottom: calc(100% + 8px);
  box-shadow: 0 12px 28px rgba(15, 23, 42, 0.14);
  box-sizing: border-box;
  left: 0;
  max-width: calc(100vw - 40px);
  min-width: 240px;
  padding: 14px;
  position: absolute;
  width: min(300px, calc(100vw - 56px));
  z-index: 10;
}

.cw-feedback-hover-card__title {
  margin: 0 0 12px;
  font-size: 13px;
  font-weight: 500;
  color: #2d3748;
}

.cw-feedback-hover-card__options {
  gap: 12px;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.cw-feedback-hover-card__option {
  flex-direction: column;
  align-items: center;
  display: flex;
  gap: 6px;
  min-width: 0;
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
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 10px;
  min-height: 160px;
  overflow-y: auto;
  padding: 14px 14px 12px;
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
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  margin: 0 14px 14px;
  padding: 0;
}

.cw-input-card {
  background: #fff;
  border: 1px solid #d9e2ef;
  border-radius: 24px;
  box-shadow: 0 12px 28px rgba(15, 23, 42, 0.05);
  display: flex;
  flex-direction: column;
  gap: 24px;
  min-height: 132px;
  padding: 16px 0 12px;
  width: 100%;
}

.cw-input-box {
  color: var(--agent-color-text-primary);
  font-size: 15px;
  line-height: 1.5;
  min-height: 46px;
  outline: none;
  padding: 0 18px;
}

.cw-input-box:empty::before {
  color: rgba(100, 116, 145, 0.5);
  content: "输入消息...";
}

.cw-input-toolbar {
  align-items: center;
  display: flex;
  justify-content: space-between;
  padding: 0 14px;
}

.cw-toolbar-icons {
  align-items: center;
  display: flex;
  gap: 8px;
}

.cw-toolbar-icon {
  align-items: center;
  background: transparent;
  border: none;
  border-radius: 10px;
  color: #20283a;
  cursor: pointer;
  display: inline-flex;
  height: 38px;
  justify-content: center;
  width: 38px;
}

.cw-toolbar-icon--bg {
  background: #f5f8fd;
}

.cw-send-btn {
  align-items: center;
  background: #edf1f7;
  border: none;
  border-radius: 50%;
  color: #9aa7bc;
  cursor: pointer;
  display: inline-flex;
  flex-shrink: 0;
  height: 48px;
  justify-content: center;
  transition: background 0.15s, color 0.15s;
  width: 48px;
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
  background: transparent;
  color: #8796b3;
  flex-shrink: 0;
  font-size: 12px;
  padding: 2px 6px 18px;
  text-align: center;
}

@media (max-width: 360px) {
  .cw-messages {
    padding: 12px 12px 10px;
  }

  .cw-quick-access {
    margin: 0 12px 12px;
    min-height: 32px;
  }

  .cw-quick-access__btn-group {
    gap: 6px;
  }

  .cw-quick-access__btn {
    font-size: 11px;
    min-height: 32px;
    padding: 4px 9px;
  }

  .cw-input-area {
    margin: 0 12px 14px;
  }

  .cw-input-card {
    border-radius: 22px;
    gap: 20px;
    min-height: 122px;
    padding: 14px 0 10px;
  }

  .cw-input-box {
    font-size: 14px;
    min-height: 42px;
    padding: 0 16px;
  }

  .cw-input-toolbar {
    padding: 0 12px;
  }

  .cw-toolbar-icon {
    height: 34px;
    width: 34px;
  }

  .cw-send-btn {
    height: 44px;
    width: 44px;
  }
}
</style>
