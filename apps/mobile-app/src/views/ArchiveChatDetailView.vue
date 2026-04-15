<template>
  <div class="chat-detail">
    <!-- 导航栏 -->
    <div class="nav-bar">
      <button class="nav-back" @click="handleBack">
        <svg width="10" height="18" viewBox="0 0 10 18" fill="none">
          <path d="M9 1L1 9L9 17" stroke="#222" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>
      <span class="nav-title">聊天记录详情</span>
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
        <span class="time-divider-text">2025-02-24 10:30</span>
        <span class="time-divider-line" />
      </div>

      <!-- 消息列表 -->
      <template v-for="msg in messages" :key="msg.id">
        <div v-if="msg.type === 'system'" class="system-message">
          <span class="system-message-text">{{ msg.content }}</span>
        </div>
        <div v-else class="message-item" :class="{ 'message-item--self': msg.isSelf }">
          <img :src="msg.avatar" class="message-avatar" />
          <div class="message-content">
            <div class="message-meta">
              <span class="message-sender">{{ msg.sender }}</span>
              <span class="message-time">{{ msg.time }}</span>
            </div>
            <div class="message-bubble">
              <p class="message-text">{{ msg.content }}</p>
            </div>
          </div>
        </div>
      </template>
    </div>

    <!-- 操作面板 -->
    <Transition name="sheet">
      <div v-if="showActionSheet" class="action-sheet-overlay" @click.self="showActionSheet = false">
        <div class="action-sheet">
          <div class="action-sheet-menu">
            <button class="action-sheet-item" @click="handleViewParticipants">
              <svg class="action-sheet-icon" width="18" height="18" viewBox="0 0 18 18" fill="none">
                <circle cx="9" cy="5.5" r="3" stroke="#222" stroke-width="1.4" />
                <path d="M3 15.75C3 12.436 5.686 9.75 9 9.75C12.314 9.75 15 12.436 15 15.75" stroke="#222" stroke-width="1.4" stroke-linecap="round" />
              </svg>
              <span>查看参与人</span>
            </button>
            <button class="action-sheet-item" @click="handleViewTags">
              <svg class="action-sheet-icon" width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M2.25 9.75L8.25 3.75L11.25 2.25L12.75 5.25L6.75 11.25L2.25 9.75Z" stroke="#222" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" />
                <circle cx="10.5" cy="6" r="0.75" fill="#222" />
                <path d="M2.25 9.75L5.25 12.75L12.75 15.75" stroke="#222" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              <span>查看标签</span>
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
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();

interface Message {
  id: number;
  type?: 'normal' | 'system';
  sender: string;
  avatar: string;
  time: string;
  content: string;
  isSelf?: boolean;
}

const messages = ref<Message[]>([
  {
    id: 1,
    sender: '李文娟',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face',
    time: '10:30',
    content: '大家好，关于这个项目的进度，我想和大家同步一下。',
    isSelf: false
  },
  {
    id: 2,
    sender: '张思远',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face',
    time: '10:31',
    content: '好的，我这边已经完成了第一阶段的开发。',
    isSelf: true
  },
  {
    id: 3,
    type: 'system',
    sender: '',
    avatar: '',
    time: '',
    content: '王子豪加入了对话'
  },
  {
    id: 4,
    sender: '王子豪',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face',
    time: '10:32',
    content: '抱歉来晚了，现在讨论到哪里了？',
    isSelf: false
  },
  {
    id: 5,
    sender: '李文娟',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face',
    time: '10:33',
    content: '我们正在讨论项目进度，张思远刚说他完成了第一阶段。',
    isSelf: false
  }
]);

const showActionSheet = ref(false);
const toastText = ref("");
let toastTimer: ReturnType<typeof setTimeout> | null = null;

function showToast(text: string) {
  if (toastTimer) clearTimeout(toastTimer);
  toastText.value = text;
  toastTimer = setTimeout(() => { toastText.value = ""; }, 2000);
}

function handleBack() {
  router.back();
}

function handleViewParticipants() {
  showActionSheet.value = false;
  showToast('查看参与人');
}

function handleViewTags() {
  showActionSheet.value = false;
  showToast('查看标签');
}
</script>

<style scoped>
.chat-detail {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #f5f7f9;
}

/* 导航栏 */
.nav-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
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

.nav-title {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  font-size: 17px;
  font-weight: 500;
  color: #000;
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

/* 消息项 */
.message-item {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  justify-content: flex-start;
}

.message-item--self {
  justify-content: flex-end;
}

.message-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
  order: 1;
}

.message-item--self .message-avatar {
  order: 2;
}

.message-content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  max-width: 260px;
  order: 2;
}

.message-item--self .message-content {
  align-items: flex-end;
  order: 1;
}

.message-meta {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-bottom: 6px;
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

.message-item--self .message-bubble {
  border-radius: 16px 4px 16px 16px;
}

.message-text {
  font-size: 16px;
  color: #000;
  line-height: 22px;
  word-break: break-word;
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
