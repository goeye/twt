<template>
  <transition name="archive-drawer">
    <div v-if="open" class="archive-drawer-layer">
      <div class="archive-drawer-layer__mask" @click="$emit('close')" />

      <aside class="archive-drawer" @click.stop>
        <header class="archive-drawer__header">
          <h2 class="archive-drawer__title">{{ title }}</h2>

          <div class="archive-drawer__actions">
            <button type="button" class="archive-drawer__icon-btn" aria-label="滚动到顶部" @click="scrollToTop">
              <AgentIcon name="chevron-down" :size="18" class="archive-drawer__icon archive-drawer__icon--up" />
            </button>
            <button type="button" class="archive-drawer__icon-btn" aria-label="滚动到底部" @click="scrollToBottom">
              <AgentIcon name="chevron-down" :size="18" class="archive-drawer__icon" />
            </button>
            <button type="button" class="archive-drawer__icon-btn" aria-label="关闭抽屉" @click="$emit('close')">
              <span class="archive-drawer__close">×</span>
            </button>
          </div>
        </header>

        <div ref="messagesRef" class="archive-drawer__messages agent-scroll">
          <div
            v-for="message in messages"
            :key="message.id"
            class="archive-message"
            :class="`archive-message--${message.role}`"
          >
            <template v-if="message.role === 'system'">
              <div class="archive-message__system">{{ message.content }}</div>
            </template>

            <template v-else>
              <span class="archive-message__avatar" :style="{ background: message.avatarUrl ? undefined : message.avatarColor }">
                <img v-if="message.avatarUrl" :src="message.avatarUrl" alt="" class="archive-message__avatar-image" />
                <span v-else>{{ message.avatarText }}</span>
              </span>

              <div class="archive-message__content">
                <div class="archive-message__meta">
                  <span class="archive-message__sender">{{ message.sender }}</span>
                  <span class="archive-message__time">{{ message.time }}</span>
                </div>
                <div class="archive-message__bubble">{{ message.content }}</div>
              </div>
            </template>
          </div>
        </div>

        <footer class="archive-drawer__footer">
          <button type="button" class="archive-drawer__assign-btn" @click="$emit('assign')">分配会话</button>
        </footer>
      </aside>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { nextTick, ref, watch } from "vue";
import { AgentIcon } from "@twt/ui-agent";

interface DrawerMessage {
  id: string;
  role: "agent" | "customer" | "system";
  sender: string;
  content: string;
  time: string;
  avatarText?: string;
  avatarColor?: string;
  avatarUrl?: string;
}

const props = defineProps<{
  open: boolean;
  title: string;
  messages: DrawerMessage[];
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "assign"): void;
}>();

const messagesRef = ref<HTMLElement | null>(null);

const scrollToTop = () => {
  messagesRef.value?.scrollTo({ top: 0, behavior: "smooth" });
};

const scrollToBottom = () => {
  if (!messagesRef.value) {
    return;
  }

  messagesRef.value.scrollTo({ top: messagesRef.value.scrollHeight, behavior: "smooth" });
};

watch(
  () => props.open,
  async (value) => {
    if (!value) {
      return;
    }

    await nextTick();
    scrollToBottom();
  }
);
</script>

<style scoped>
.archive-drawer-layer {
  inset: 0;
  pointer-events: auto;
  position: fixed;
  z-index: 90;
}

.archive-drawer-layer__mask {
  background: rgba(15, 23, 42, 0.08);
  inset: 0;
  position: absolute;
}

.archive-drawer {
  background: #f5f6f8;
  border: 1px solid #cdd9f1;
  border-radius: 16px 0 0 16px;
  box-shadow: -8px 0 24px rgba(15, 23, 42, 0.10);
  display: flex;
  flex-direction: column;
  gap: 12px;
  height: 100%;
  max-width: min(520px, 100vw);
  padding: 18px 20px 20px;
  position: absolute;
  right: 0;
  top: 0;
  width: 520px;
}

.archive-drawer__header {
  align-items: center;
  display: flex;
  justify-content: space-between;
  gap: 16px;
}

.archive-drawer__title {
  color: #222222;
  font-size: 17px;
  font-weight: 600;
  line-height: 1.3;
  margin: 0;
}

.archive-drawer__actions {
  align-items: center;
  display: flex;
  gap: 6px;
}

.archive-drawer__icon-btn {
  align-items: center;
  background: transparent;
  border: 0;
  border-radius: 999px;
  color: #111111;
  cursor: pointer;
  display: inline-flex;
  height: 30px;
  justify-content: center;
  width: 30px;
}

.archive-drawer__icon-btn:hover {
  background: rgba(17, 17, 17, 0.06);
}

.archive-drawer__icon {
  display: block;
}

.archive-drawer__icon--up {
  transform: rotate(180deg);
}

.archive-drawer__close {
  font-size: 22px;
  font-weight: 500;
  line-height: 1;
  transform: translateY(-1px);
}

.archive-drawer__messages {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 22px;
  min-height: 0;
  padding: 4px 0 8px;
}

.archive-message {
  align-items: flex-start;
  display: flex;
  gap: 10px;
}

.archive-message--agent {
  flex-direction: row-reverse;
}

.archive-message--system {
  justify-content: center;
}

.archive-message__avatar {
  align-items: center;
  border-radius: 50%;
  color: #ffffff;
  display: inline-flex;
  flex-shrink: 0;
  font-size: 14px;
  font-weight: 600;
  height: 40px;
  justify-content: center;
  margin-top: 2px;
  overflow: hidden;
  width: 40px;
}

.archive-message__avatar-image {
  display: block;
  height: 100%;
  object-fit: cover;
  width: 100%;
}

.archive-message__content {
  display: flex;
  flex-direction: column;
  gap: 5px;
  max-width: min(380px, calc(100% - 56px));
}

.archive-message--agent .archive-message__content {
  align-items: flex-end;
}

.archive-message__meta {
  color: #8792a7;
  display: flex;
  flex-wrap: wrap;
  font-size: 13px;
  gap: 8px;
  line-height: 1.4;
}

.archive-message--agent .archive-message__meta {
  justify-content: flex-end;
}

.archive-message__bubble {
  background: #fafafa;
  border-radius: 16px;
  color: #222222;
  font-size: 15px;
  line-height: 1.5;
  max-width: 100%;
  min-height: 40px;
  padding: 10px 16px;
  white-space: pre-wrap;
  word-break: break-word;
}

.archive-message--agent .archive-message__bubble {
  background: #e4eaf8;
}

.archive-message__system {
  color: #98a2b3;
  font-size: 13px;
  text-align: center;
}

.archive-drawer__footer {
  padding-top: 4px;
}

.archive-drawer__assign-btn {
  background: #f7f7f7;
  border: 1px solid #d4dbe6;
  border-radius: 22px;
  color: #185dff;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  height: 52px;
  width: 100%;
}

.archive-drawer__assign-btn:hover {
  background: #ffffff;
}

.archive-drawer-enter-active,
.archive-drawer-leave-active {
  transition: opacity 0.2s ease;
}

.archive-drawer-enter-active .archive-drawer,
.archive-drawer-leave-active .archive-drawer {
  transition: transform 0.24s ease;
}

.archive-drawer-enter-from,
.archive-drawer-leave-to {
  opacity: 0;
}

.archive-drawer-enter-from .archive-drawer,
.archive-drawer-leave-to .archive-drawer {
  transform: translateX(100%);
}

@media (max-width: 600px) {
  .archive-drawer {
    border-radius: 0;
    padding: 16px 14px 14px;
    width: 100vw;
  }

  .archive-drawer__title {
    font-size: 16px;
  }

  .archive-message__avatar {
    height: 34px;
    width: 34px;
  }

  .archive-message__meta,
  .archive-message__bubble {
    font-size: 14px;
  }

  .archive-drawer__assign-btn {
    font-size: 15px;
    height: 46px;
  }
}
</style>
