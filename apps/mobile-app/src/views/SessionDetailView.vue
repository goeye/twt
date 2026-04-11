<template>
  <div class="session-detail">
    <!-- 导航栏 -->
    <div class="nav-bar">
      <button class="nav-back" @click="handleBack">
        <svg width="10" height="18" viewBox="0 0 10 18" fill="none">
          <path d="M9 1L1 9L9 17" stroke="#222" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>
      <div class="nav-center">
        <div class="nav-avatar" :style="{ background: session.avatarBg }">
          <span class="nav-avatar-char">{{ session.avatarChar }}</span>
        </div>
        <span class="nav-title">{{ session.title }}</span>
      </div>
      <button class="nav-more" @click="showActionSheet = true">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <circle cx="4" cy="10" r="1.5" fill="#222" />
          <circle cx="10" cy="10" r="1.5" fill="#222" />
          <circle cx="16" cy="10" r="1.5" fill="#222" />
        </svg>
      </button>
    </div>

    <!-- 消息区域 -->
    <div class="messages-area">
      <!-- 消息列表 -->
      <template v-for="msg in messages" :key="msg.id">
        <div v-if="msg.type === 'system'" class="system-message">
          <span class="system-message-text">{{ msg.content }}</span>
        </div>
        <div v-else-if="msg.type === 'rating'" class="rating-message">
          <span class="rating-message-text">{{ msg.content }}</span>
        </div>
        <div v-else class="message-item" :class="{ 'message-item--agent': msg.role === 'agent' }">
          <div class="message-content">
            <div class="message-meta" :class="{ 'message-meta--note': msg.type === 'note' }">
              <span class="message-sender">{{ msg.sender }}</span>
              <span class="message-time">{{ msg.time }}</span>
            </div>
            <div class="message-bubble">
              <p class="message-text">{{ msg.content }}</p>
            </div>
          </div>
          <img :src="msg.avatar" class="message-avatar" />
        </div>
      </template>
    </div>

    <!-- 底部输入栏 -->
    <div class="input-bar-wrap">
      <div class="input-bar" :class="{ 'input-bar--active': inputFocused }">
        <textarea
          ref="textareaRef"
          v-model="inputText"
          class="input-field"
          :class="{ 'input-field--active': inputFocused }"
          placeholder="输入信息…"
          rows="1"
          @focus="inputFocused = true"
          @blur="handleBlur"
        />
        <div class="input-actions">
          <button class="input-action">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="#C0C4CC" stroke-width="1.5" />
              <circle cx="8.5" cy="10" r="1" fill="#C0C4CC" />
              <circle cx="15.5" cy="10" r="1" fill="#C0C4CC" />
              <path d="M8.5 14.5C9.5 16 10.5 16.5 12 16.5C13.5 16.5 14.5 16 15.5 14.5" stroke="#C0C4CC" stroke-width="1.2" stroke-linecap="round" />
            </svg>
          </button>
          <button v-if="!inputText.trim()" class="input-action">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="#C0C4CC" stroke-width="1.5" />
              <path d="M12 8V16M8 12H16" stroke="#C0C4CC" stroke-width="1.5" stroke-linecap="round" />
            </svg>
          </button>
          <button v-else class="input-send" @click="handleSend">发送</button>
        </div>
      </div>
    </div>

    <!-- 操作面板 -->
    <Transition name="sheet">
      <div v-if="showActionSheet" class="action-sheet-overlay" @click.self="showActionSheet = false">
        <div class="action-sheet">
          <div class="action-sheet-menu">
            <button class="action-sheet-item" @click="handleEditTitle">
              <svg class="action-sheet-icon" width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M12.75 2.25L15.75 5.25L6.75 14.25H3.75V11.25L12.75 2.25Z" stroke="#222" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M10.5 4.5L13.5 7.5" stroke="#222" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              <span>修改会话标题</span>
            </button>
            <button class="action-sheet-item" @click="handleGoInfo('visitor')">
              <svg class="action-sheet-icon" width="18" height="18" viewBox="0 0 18 18" fill="none">
                <circle cx="9" cy="5.5" r="3" stroke="#222" stroke-width="1.4" />
                <path d="M3 15.75C3 12.436 5.686 9.75 9 9.75C12.314 9.75 15 12.436 15 15.75" stroke="#222" stroke-width="1.4" stroke-linecap="round" />
              </svg>
              <span>访客信息</span>
            </button>
            <button class="action-sheet-item" @click="handleGoInfo('session')">
              <svg class="action-sheet-icon" width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M2.25 3.75C2.25 3.336 2.586 3 3 3H15C15.414 3 15.75 3.336 15.75 3.75V12.75C15.75 13.164 15.414 13.5 15 13.5H5.25L2.25 15.75V3.75Z" stroke="#222" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              <span>会话信息</span>
            </button>
            <button class="action-sheet-item" @click="handleTogglePending">
              <svg class="action-sheet-icon" width="18" height="18" viewBox="0 0 18 18" fill="none">
                <circle cx="9" cy="9" r="7" stroke="#222" stroke-width="1.4" />
                <path d="M9 5V9L11.5 11.5" stroke="#222" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              <span>{{ isPending ? '取消待处理' : '标记为待处理' }}</span>
            </button>
            <button class="action-sheet-item action-sheet-item--danger" @click="showActionSheet = false">
              <svg class="action-sheet-icon" width="18" height="18" viewBox="0 0 18 18" fill="none">
                <circle cx="9" cy="9" r="7" stroke="#ff382e" stroke-width="1.4" />
                <path d="M9 5V9" stroke="#ff382e" stroke-width="1.4" stroke-linecap="round" />
                <circle cx="9" cy="12" r="0.75" fill="#ff382e" />
              </svg>
              <span>结束会话</span>
            </button>
          </div>
          <div class="action-sheet-divider" />
          <button class="action-sheet-cancel" @click="showActionSheet = false">取消</button>
        </div>
      </div>
    </Transition>

    <!-- Toast -->
    <Transition name="toast">
      <div v-if="toastText" class="toast">{{ toastText }}</div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();

// 判断是否是被接管的 Autopilot 会话
const isTakeoverSession = ref(route.params.id === '8');

const session = ref(
  isTakeoverSession.value
    ? {
        title: "咨询产品功能",
        avatarChar: "咨",
        avatarBg: "#ff6b6b"
      }
    : {
        title: "未知问题",
        avatarChar: "?",
        avatarBg: "#36c6d9"
      }
);

interface Message {
  id: number;
  type?: 'normal' | 'system' | 'note' | 'rating';
  role?: 'customer' | 'agent';
  sender: string;
  avatar: string;
  time: string;
  content: string;
  ratingValue?: 'satisfied' | 'neutral' | 'unsatisfied';
}

const messages = ref<Message[]>(
  isTakeoverSession.value
    ? [
        {
          id: 1,
          type: 'system',
          sender: '',
          avatar: '',
          time: '',
          content: '开始时间 22:08'
        },
        {
          id: 2,
          role: 'customer',
          sender: 'Visitor7',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop&crop=face',
          time: '22:09',
          content: '我想了解一下你们的产品功能'
        },
        {
          id: 3,
          role: 'agent',
          sender: 'Autopilot',
          avatar: 'data:image/svg+xml,%3Csvg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg"%3E%3Crect width="80" height="80" rx="40" fill="%23105EFF"/%3E%3Ccircle cx="40" cy="32" r="8" fill="white"/%3E%3Ccircle cx="32" cy="48" r="4" fill="white"/%3E%3Ccircle cx="48" cy="48" r="4" fill="white"/%3E%3C/svg%3E',
          time: '22:10',
          content: '您好，我是客服 Autopilot。看到您想了解产品功能，我会立刻为您处理。\n\n请问您具体想了解哪方面的功能呢？'
        },
        {
          id: 4,
          type: 'system',
          sender: '',
          avatar: '',
          time: '',
          content: 'Autopilot 已将会话转接给人工客服'
        }
      ]
    : [
        {
          id: 1,
          role: 'customer',
          sender: "这里展示的应该为一个超长的昵…",
          avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop&crop=face",
          time: "12/31 23:59",
          content: "这是一条示例消息。它展示了来自【会话】的客户对话在您的收件箱中的显示方式。"
        },
        {
          id: 2,
          type: 'system',
          sender: '',
          avatar: '',
          time: '',
          content: '李明已将会话转移给张思远'
        },
        {
          id: 3,
          type: 'note',
          role: 'agent',
          sender: '大王',
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face',
          time: '10:34',
          content: '这是一条内部备注信息，仅客服可见。'
        },
        {
          id: 4,
          type: 'rating',
          sender: '',
          avatar: '',
          time: '',
          content: '访客提交了评价：满意',
          ratingValue: 'satisfied'
        },
        {
          id: 5,
          type: 'system',
          sender: '',
          avatar: '',
          time: '',
          content: '李明添加了张思远、江晚柠、王子豪等5人加入会话'
        }
      ]
);

const inputText = ref("");
const inputFocused = ref(false);
const textareaRef = ref<HTMLTextAreaElement | null>(null);
const showActionSheet = ref(false);
const isPending = ref(false);
const toastText = ref("");
let toastTimer: ReturnType<typeof setTimeout> | null = null;

function showToast(text: string) {
  if (toastTimer) clearTimeout(toastTimer);
  toastText.value = text;
  toastTimer = setTimeout(() => { toastText.value = ""; }, 2000);
}

function handleBack() {
  // 检查是否是从接管会话跳转过来的
  const fromTakeover = route.query.fromTakeover;

  if (fromTakeover) {
    // 如果是接管会话跳转过来的，返回到会话列表页并保持在待回复标签
    router.push('/session');
  } else {
    // 否则正常返回上一页
    router.back();
  }
}

function handleBlur() {
  if (!inputText.value.trim()) {
    inputFocused.value = false;
  }
}

function handleSend() {
  if (!inputText.value.trim()) return;
  inputText.value = "";
  inputFocused.value = false;
  textareaRef.value?.blur();
}

function handleTogglePending() {
  isPending.value = !isPending.value;
  showActionSheet.value = false;
  showToast(isPending.value ? '已标记为待处理' : '已取消待处理');
}

function handleGoInfo(tab: string) {
  showActionSheet.value = false;
  const id = route.params.id || '1';
  router.push({ path: `/session/${id}/info`, query: { tab } });
}

function handleEditTitle() {
  showActionSheet.value = false;
  const id = route.params.id || '1';
  router.push(`/session/${id}/edit-title`);
}

function loadPendingSystemMessages() {
  const id = String(route.params.id || '1');
  const pending = JSON.parse(sessionStorage.getItem("pendingSystemMessages") || "{}");
  const list: string[] = pending[id] || [];
  if (list.length === 0) return;
  let nextId = messages.value.length + 1;
  for (const content of list) {
    messages.value.push({
      id: nextId++,
      type: 'system',
      sender: '',
      avatar: '',
      time: '',
      content
    });
  }
  delete pending[id];
  sessionStorage.setItem("pendingSystemMessages", JSON.stringify(pending));
}

onMounted(() => {
  loadPendingSystemMessages();
});
</script>

<style scoped>
.session-detail {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #f5f7f9;
}

/* 导航栏 */
.nav-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 44px;
  padding: 0 16px;
  margin-top: env(safe-area-inset-top, 44px);
  background: #fff;
  flex-shrink: 0;
  position: relative;
  z-index: 10;
}

.nav-back {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  cursor: pointer;
  flex-shrink: 0;
  -webkit-tap-highlight-color: transparent;
}

.nav-center {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.nav-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.nav-avatar-char {
  font-size: 14px;
  font-weight: 500;
  color: #fff;
}

.nav-title {
  font-size: 17px;
  font-weight: 500;
  color: #000;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.nav-more {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  cursor: pointer;
  flex-shrink: 0;
  -webkit-tap-highlight-color: transparent;
}

/* 消息区域 */
.messages-area {
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  padding: 16px;
}

/* 时间分隔线 */
.time-divider {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.time-divider-line {
  flex: 1;
  height: 1px;
  background: #e2e8ef;
}

.time-divider-text {
  font-size: 12px;
  color: rgba(100, 116, 145, 0.8);
  white-space: nowrap;
  flex-shrink: 0;
}

/* 系统消息 */
.system-message {
  display: flex;
  justify-content: center;
  margin-bottom: 16px;
}

.system-message-text {
  font-size: 12px;
  color: rgba(100, 116, 145, 0.8);
  line-height: 18px;
  text-align: center;
  max-width: 80%;
}

/* 评价消息 */
.rating-message {
  display: flex;
  justify-content: center;
  margin-bottom: 16px;
}

.rating-message-text {
  font-size: 12px;
  color: rgba(100, 116, 145, 0.8);
  line-height: 18px;
  text-align: center;
}

/* 消息项 */
.message-item {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  justify-content: flex-start;
}

.message-item--agent {
  justify-content: flex-end;
}

.message-content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  max-width: 260px;
}

.message-item--agent .message-content {
  align-items: flex-end;
}

.message-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
  order: 1;
}

.message-item--agent .message-avatar {
  order: 2;
}

.message-item--agent .message-content {
  order: 1;
}

.message-meta {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-bottom: 6px;
}

.message-meta--note .message-sender,
.message-meta--note .message-time {
  color: #f59e0b;
}

.message-sender {
  font-size: 12px;
  color: #647491;
  max-width: 180px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.message-time {
  font-size: 12px;
  color: #647491;
  white-space: nowrap;
  flex-shrink: 0;
}

.message-bubble {
  background: #fff;
  border-radius: 4px 16px 16px 16px;
  padding: 12px;
  max-width: 260px;
}

.message-item--agent .message-bubble {
  border-radius: 16px 4px 16px 16px;
}

.message-text {
  font-size: 16px;
  color: #000;
  line-height: 22px;
  word-break: break-word;
}

/* 底部输入栏 */
.input-bar-wrap {
  padding: 8px 16px;
  padding-bottom: calc(8px + env(safe-area-inset-bottom, 0px));
  background: #f5f7f9;
  flex-shrink: 0;
}

.input-bar {
  display: flex;
  align-items: center;
  min-height: 52px;
  background: #fff;
  border-radius: 70px;
  padding: 0 12px 0 20px;
  box-shadow: 0 -7px 28px rgba(0, 0, 0, 0.02);
  gap: 4px;
  transition: border-radius 0.2s, min-height 0.2s;
}

.input-bar--active {
  border-radius: 20px;
  min-height: 100px;
  flex-direction: column;
  align-items: stretch;
  padding: 14px 16px 10px 20px;
}

.input-field {
  flex: 1;
  font-size: 16px;
  color: #222;
  min-width: 0;
  border: none;
  outline: none;
  background: transparent;
  resize: none;
  font-family: inherit;
  line-height: 22px;
  padding: 0;
}

.input-field--active {
  flex: 1;
  min-height: 48px;
}

.input-field::placeholder {
  color: rgba(100, 116, 145, 0.5);
}

.input-actions {
  display: flex;
  align-items: center;
  gap: 4px;
}

.input-bar--active .input-actions {
  justify-content: flex-end;
}

.input-action {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  cursor: pointer;
  flex-shrink: 0;
  -webkit-tap-highlight-color: transparent;
}

.input-send {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 32px;
  padding: 0 16px;
  background: #105EFF;
  border-radius: 20px;
  color: #fff;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  flex-shrink: 0;
  -webkit-tap-highlight-color: transparent;
}

/* 操作面板 */
.action-sheet-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 100;
  display: flex;
  align-items: flex-end;
}

.action-sheet {
  width: 100%;
  background: #fff;
  border-radius: 20px 20px 0 0;
  padding: 8px 16px;
  padding-bottom: calc(8px + env(safe-area-inset-bottom, 0px));
}

.action-sheet-menu {
  display: flex;
  flex-direction: column;
}

.action-sheet-item {
  display: flex;
  align-items: center;
  gap: 16px;
  height: 46px;
  padding: 0 8px;
  font-size: 16px;
  color: #222;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

.action-sheet-item:active {
  background: #f5f7f9;
}

.action-sheet-item--danger {
  color: #ff382e;
}

.action-sheet-icon {
  flex-shrink: 0;
}

.action-sheet-divider {
  height: 1px;
  background: #e2e8ef;
  margin: 4px 0;
}

.action-sheet-cancel {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 50px;
  font-size: 18px;
  color: #222;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

.action-sheet-cancel:active {
  background: #f5f7f9;
}

/* 面板过渡动画 */
.sheet-enter-active,
.sheet-leave-active {
  transition: opacity 0.25s;
}

.sheet-enter-active .action-sheet,
.sheet-leave-active .action-sheet {
  transition: transform 0.25s ease-out;
}

.sheet-enter-from,
.sheet-leave-to {
  opacity: 0;
}

.sheet-enter-from .action-sheet,
.sheet-leave-to .action-sheet {
  transform: translateY(100%);
}

/* Toast */
.toast {
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.75);
  color: #fff;
  font-size: 14px;
  padding: 10px 24px;
  border-radius: 8px;
  z-index: 200;
  pointer-events: none;
}

.toast-enter-active,
.toast-leave-active {
  transition: opacity 0.2s;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
}
</style>
