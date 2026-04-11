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
      <!-- 时间分隔 -->
      <div class="time-divider">
        <span class="time-divider-line" />
        <span class="time-divider-text">开始时间 -10:30</span>
        <span class="time-divider-line" />
      </div>

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

    <!-- 底部操作栏 -->
    <div class="bottom-action-wrap">
      <!-- Autopilot 待回复状态 -->
      <template v-if="isAutopilotSession && sessionStatus === 'pending'">
        <button class="action-btn action-btn--secondary" @click="handleAssignSession">
          分配会话
        </button>
        <button class="action-btn action-btn--primary" @click="handleTakeoverSession">
          接管会话
        </button>
      </template>

      <!-- 已回复状态 -->
      <button v-else-if="sessionStatus === 'replied' && !isCurrentAgentInSession" class="action-btn action-btn--primary" @click="handleJoinSession">
        加入会话
      </button>
      <button v-else-if="sessionStatus === 'replied' && isCurrentAgentInSession" class="action-btn action-btn--primary" @click="handleEnterSession">
        进入会话
      </button>

      <!-- 排队中状态 -->
      <button v-else-if="sessionStatus === 'queuing'" class="action-btn action-btn--primary" @click="handleClaimSession">
        领取会话
      </button>

      <!-- 已关闭状态 -->
      <button v-else-if="sessionStatus === 'closed' && isAdmin" class="action-btn action-btn--danger" @click="handleDeleteSession">
        删除会话
      </button>
      <div v-else-if="sessionStatus === 'closed' && !isAdmin" class="action-text">
        会话已结束
      </div>
    </div>

    <!-- 操作面板 -->
    <Transition name="sheet">
      <div v-if="showActionSheet" class="action-sheet-overlay" @click.self="showActionSheet = false">
        <div class="action-sheet">
          <div class="action-sheet-menu">
            <button class="action-sheet-item" @click="showActionSheet = false">
              <svg class="action-sheet-icon" width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M10.5 2.25L7.5 5.25H3C2.586 5.25 2.25 5.586 2.25 6V12C2.25 12.414 2.586 12.75 3 12.75H7.5L10.5 15.75V2.25Z" stroke="#222" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M2.25 15.75L15.75 2.25" stroke="#222" stroke-width="1.4" stroke-linecap="round" />
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

    <!-- 分配会话面板 -->
    <Transition name="sheet">
      <div v-if="showAssignSheet" class="action-sheet-overlay" @click.self="showAssignSheet = false">
        <div class="assign-sheet">
          <div class="assign-list">
            <div v-for="agent in agentList" :key="agent.id" class="assign-item">
              <img :src="agent.avatar" class="assign-avatar" />
              <span class="assign-name">{{ agent.name }}</span>
              <button class="assign-btn" @click="handleAssignToAgent(agent)">分配</button>
            </div>
          </div>
          <div class="assign-divider" />
          <button class="assign-cancel" @click="showAssignSheet = false">取消</button>
        </div>
      </div>
    </Transition>

    <!-- 接管确认弹窗 -->
    <Transition name="dialog">
      <div v-if="showTakeoverDialog" class="dialog-overlay" @click.self="showTakeoverDialog = false">
        <div class="dialog-box">
          <h3 class="dialog-title">确认接管</h3>
          <p class="dialog-message">确定接管该会话吗？</p>
          <div class="dialog-actions">
            <button class="dialog-btn dialog-btn--cancel" @click="showTakeoverDialog = false">取消</button>
            <button class="dialog-btn dialog-btn--confirm" @click="confirmTakeover">确认</button>
          </div>
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

// 从路由参数获取会话状态，并映射到对应的状态值
const statusMap: Record<string, 'replied' | 'queuing' | 'closed' | 'pending'> = {
  'replied': 'replied',
  'queuing': 'queuing',
  'closed': 'closed',
  'pending': 'pending',
  'processing': 'replied'
};

const sessionStatus = ref<'replied' | 'queuing' | 'closed' | 'pending'>(
  statusMap[route.query.status as string] || 'replied'
);

// 当前客服是否在会话中
const isCurrentAgentInSession = ref(false);
// 是否是管理员
const isAdmin = ref(true);
// 是否是 Autopilot 会话
const isAutopilotSession = ref(route.params.id === '4');

const session = ref(
  isAutopilotSession.value
    ? {
        title: "咨询业务问题",
        avatarChar: "A",
        avatarBg: "#105EFF"
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
  isAutopilotSession.value
    ? [
        {
          id: 1,
          type: 'system',
          sender: '',
          avatar: '',
          time: '',
          content: '系统消息 22:04'
        },
        {
          id: 2,
          role: 'agent',
          sender: 'Autopilot',
          avatar: 'data:image/svg+xml,%3Csvg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg"%3E%3Crect width="80" height="80" rx="40" fill="%23105EFF"/%3E%3Ccircle cx="40" cy="32" r="8" fill="white"/%3E%3Ccircle cx="32" cy="48" r="4" fill="white"/%3E%3Ccircle cx="48" cy="48" r="4" fill="white"/%3E%3C/svg%3E',
          time: '22:04',
          content: '你好，请问有什么可以帮您的？'
        },
        {
          id: 3,
          type: 'system',
          sender: '',
          avatar: '',
          time: '',
          content: '开始时间 22:04'
        },
        {
          id: 4,
          role: 'customer',
          sender: 'Visitor5',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop&crop=face',
          time: '22:04',
          content: '123'
        },
        {
          id: 5,
          role: 'agent',
          sender: 'Autopilot',
          avatar: 'data:image/svg+xml,%3Csvg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg"%3E%3Crect width="80" height="80" rx="40" fill="%23105EFF"/%3E%3Ccircle cx="40" cy="32" r="8" fill="white"/%3E%3Ccircle cx="32" cy="48" r="4" fill="white"/%3E%3Ccircle cx="48" cy="48" r="4" fill="white"/%3E%3C/svg%3E',
          time: '22:05',
          content: '您好，我是客服 Autopilot。看到您发送了"123"，请问具体是想查询什么业务或遇到什么问题需要帮助吗？\n\n您可以简单描述一下您的需求，我会立刻为您处理。'
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
const showAssignSheet = ref(false);
const showTakeoverDialog = ref(false);
const isPending = ref(false);
const toastText = ref("");
let toastTimer: ReturnType<typeof setTimeout> | null = null;

interface Agent {
  id: number;
  name: string;
  avatar: string;
}

const agentList = ref<Agent[]>([
  {
    id: 1,
    name: "Alienwang",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face"
  },
  {
    id: 2,
    name: "李伟",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face"
  }
]);

function showToast(text: string) {
  if (toastTimer) clearTimeout(toastTimer);
  toastText.value = text;
  toastTimer = setTimeout(() => { toastText.value = ""; }, 2000);
}

function handleBack() {
  router.back();
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

function handleJoinSession() {
  showToast('已加入会话');
  isCurrentAgentInSession.value = true;
}

function handleEnterSession() {
  showToast('进入会话');
  // 这里可以跳转到实时会话页面
}

function handleClaimSession() {
  showToast('领取会话');
  // 这里可以领取会话并跳转到会话详情
}

function handleDeleteSession() {
  showToast('删除会话');
  // 这里可以打开确认删除的弹窗
}

function handleTakeoverSession() {
  showTakeoverDialog.value = true;
}

function confirmTakeover() {
  showTakeoverDialog.value = false;
  showToast('接管成功');

  // 延迟跳转，让 toast 显示一下
  setTimeout(() => {
    // 跳转到会话页面，并传递会话信息
    router.push({
      path: '/session',
      query: {
        sessionId: route.params.id,
        category: 'autopilot' // 标记为 Autopilot 分类
      }
    });
  }, 500);
}

function handleAssignSession() {
  showAssignSheet.value = true;
}

function handleAssignToAgent(agent: Agent) {
  showAssignSheet.value = false;
  showToast(`已分配给 ${agent.name}`);
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

/* 底部操作栏 */
.bottom-action-wrap {
  padding: 8px 16px;
  padding-bottom: calc(8px + env(safe-area-inset-bottom, 0px));
  background: #f5f7f9;
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
}

.action-btn {
  flex: 1;
  height: 52px;
  border-radius: 70px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  transition: opacity 0.2s;
}

.action-btn:active {
  opacity: 0.8;
}

.action-btn--primary {
  background: #105EFF;
  color: #fff;
}

.action-btn--secondary {
  background: #fff;
  color: #105EFF;
  border: 1px solid #105EFF;
}

.action-btn--danger {
  background: transparent;
  color: #ff382e;
  border: 1px solid #ff382e;
}

.action-text {
  font-size: 14px;
  color: #647491;
  text-align: center;
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

/* 分配会话面板 */
.assign-sheet {
  width: 100%;
  background: #fff;
  border-radius: 20px 20px 0 0;
  padding: 16px;
  padding-bottom: calc(16px + env(safe-area-inset-bottom, 0px));
}

.assign-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.assign-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 8px;
  min-height: 64px;
}

.assign-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}

.assign-name {
  flex: 1;
  font-size: 16px;
  color: #222;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.assign-btn {
  flex-shrink: 0;
  height: 32px;
  padding: 0 20px;
  border-radius: 16px;
  border: 1px solid #105EFF;
  background: #fff;
  color: #105EFF;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  transition: opacity 0.2s;
}

.assign-btn:active {
  opacity: 0.7;
}

.assign-divider {
  height: 1px;
  background: #e2e8ef;
  margin: 8px 0;
}

.assign-cancel {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 50px;
  font-size: 18px;
  color: #222;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  border-radius: 8px;
}

.assign-cancel:active {
  background: #f5f7f9;
}

/* 确认弹窗 */
.dialog-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 32px;
}

.dialog-box {
  width: 100%;
  max-width: 400px;
  background: #fff;
  border-radius: 24px;
  padding: 32px 24px 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.dialog-title {
  font-size: 20px;
  font-weight: 600;
  color: #222;
  text-align: center;
  margin: 0;
}

.dialog-message {
  font-size: 16px;
  color: #647491;
  text-align: center;
  margin: 0;
  line-height: 24px;
}

.dialog-actions {
  display: flex;
  gap: 12px;
  margin-top: 8px;
}

.dialog-btn {
  flex: 1;
  height: 48px;
  border-radius: 24px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  transition: opacity 0.2s;
}

.dialog-btn:active {
  opacity: 0.8;
}

.dialog-btn--cancel {
  background: #f5f7f9;
  color: #222;
}

.dialog-btn--confirm {
  background: #105EFF;
  color: #fff;
}

/* 弹窗过渡动画 */
.dialog-enter-active,
.dialog-leave-active {
  transition: opacity 0.25s;
}

.dialog-enter-active .dialog-box,
.dialog-leave-active .dialog-box {
  transition: transform 0.25s ease-out, opacity 0.25s;
}

.dialog-enter-from,
.dialog-leave-to {
  opacity: 0;
}

.dialog-enter-from .dialog-box,
.dialog-leave-to .dialog-box {
  transform: scale(0.9);
  opacity: 0;
}
</style>
