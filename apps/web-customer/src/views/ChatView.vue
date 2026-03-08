<template>
  <div class="cw-chat">
    <!-- Header -->
    <header class="cw-chat-header">
      <div class="cw-chat-header__left">
        <button type="button" class="cw-chat-header__back" @click="$router.push('/sessions')">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>
        </button>
        <div class="cw-chat-header__avatar-wrap">
          <img :src="AGENT_AVATAR" class="cw-chat-header__avatar-img" alt="客服头像" />
          <span class="cw-chat-header__status-dot" />
        </div>
        <span class="cw-chat-header__title">聊天</span>
      </div>
      <button type="button" class="cw-chat-header__close" aria-label="最小化" @click="$router.push('/minimized')">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" /></svg>
      </button>
    </header>

    <!-- Feedback / Ended state -->
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
      <div class="cw-session-ended">会话已结束，请重新咨询</div>
    </template>

    <!-- Normal chat -->
    <template v-else>
      <!-- Messages -->
      <div class="cw-messages">
        <div v-for="msg in messages" :key="msg.id" class="cw-msg" :class="msg.isVisitor ? 'cw-msg--visitor' : 'cw-msg--agent'">
          <span class="cw-msg__time">{{ msg.time }}</span>
          <div class="cw-msg__bubble" :class="msg.isVisitor ? 'cw-msg__bubble--visitor' : ''">
            {{ msg.text }}
          </div>
          <span v-if="msg.isVisitor && msg.readReceipt" class="cw-msg__receipt">
            <svg width="20" height="12" viewBox="0 0 20 12" fill="none" class="cw-msg__receipt-icon">
              <path d="M1.5 6.2L4.4 9l5-5.3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M8.2 6.2L11.1 9l5-5.3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </span>
        </div>
      </div>

      <!-- Quick Access Tags -->
      <div v-if="quickAccessItems.length > 0" class="cw-quick-access">
        <span v-for="item in quickAccessItems" :key="item.id" class="cw-quick-access__tag">{{ item.label }}</span>
      </div>

      <!-- Input Area -->
      <div class="cw-input-area">
        <div class="cw-input-box" contenteditable="true" @input="onInput" @keydown.enter.prevent="sendMessage" />
        <div class="cw-input-toolbar">
          <div class="cw-toolbar-icons">
            <span class="cw-toolbar-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" /><path d="M19 10v2a7 7 0 01-14 0v-2M12 19v4M8 23h8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" /></svg>
            </span>
            <span class="cw-toolbar-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" /></svg>
            </span>
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

    <!-- Footer -->
    <div class="cw-footer">Powered by <strong>Chat</strong></div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";

const AGENT_AVATAR = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='184' height='184' viewBox='0 0 184 184'%3E%3Ccircle cx='92' cy='92' r='90' fill='%23C9CED8' stroke='%23F5F7FA' stroke-width='4'/%3E%3Ccircle cx='92' cy='68' r='30' fill='%23EEF1F5'/%3E%3Cpath d='M28 156c10-28 34-46 64-46s54 18 64 46' fill='%23EEF1F5'/%3E%3C/svg%3E";

interface Message {
  id: string;
  text: string;
  time: string;
  isVisitor: boolean;
  readReceipt?: boolean;
}

const sessionEnded = ref(false);
const selectedFeedback = ref<string | null>(null);
const inputText = ref("");

const feedbackOptions = [
  { value: "good", emoji: "\u{1F60A}", label: "满意" },
  { value: "neutral", emoji: "\u{1F610}", label: "一般" },
  { value: "bad", emoji: "\u{1F61E}", label: "不满意" }
];

const quickAccessItems = reactive([
  { id: "qa-1", label: "帮助中心" },
  { id: "qa-2", label: "常见问题" }
]);

let msgCounter = 3;
const messages = ref<Message[]>([
  { id: "m-1", text: "Hello, is there anything I can help you with?", time: "10:32", isVisitor: false },
  { id: "m-2", text: "您好，我想确认一下订单物流进度。", time: "10:33", isVisitor: true, readReceipt: true }
]);

const onInput = (e: Event) => {
  inputText.value = (e.target as HTMLElement).textContent || "";
};

const sendMessage = () => {
  const text = inputText.value.trim();
  if (!text) return;
  const now = new Date();
  const time = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
  messages.value.push({ id: `m-${msgCounter++}`, text, time, isVisitor: true, readReceipt: false });
  inputText.value = "";
  const inputBox = document.querySelector(".cw-input-box") as HTMLElement | null;
  if (inputBox) inputBox.textContent = "";
};
</script>

<style scoped>
.cw-chat {
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;
}

/* Header */
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

.cw-chat-header__avatar-img {
  border-radius: 50%;
  display: block;
  height: 28px;
  object-fit: cover;
  width: 28px;
}

.cw-chat-header__status-dot {
  background: #22c55e;
  border: 2px solid #fff;
  border-radius: 50%;
  bottom: -1px;
  height: 10px;
  position: absolute;
  right: -1px;
  width: 10px;
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

/* Messages */
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
  line-height: 1.5;
  max-width: 260px;
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

/* Quick Access */
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

/* Input Area */
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

/* Feedback */
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

/* Footer */
.cw-footer {
  background: #fff;
  color: var(--agent-color-text-tertiary);
  flex-shrink: 0;
  font-size: 10px;
  padding: 6px;
  text-align: center;
}
</style>
