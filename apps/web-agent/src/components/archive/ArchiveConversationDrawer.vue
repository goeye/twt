<template>
  <transition name="archive-drawer">
    <div v-if="open" class="archive-drawer-layer">
      <div class="archive-drawer-layer__mask" @click="$emit('close')" />

      <aside class="archive-drawer" @click.stop>
        <header class="archive-drawer__header">
          <div v-if="isEditingTitle" class="archive-drawer__title-edit">
            <input
              ref="drawerTitleInputRef"
              v-model="draftTitle"
              class="archive-drawer__title-input"
              @blur="saveTitle"
              @keydown.enter.prevent="saveTitle"
              @keydown.esc.prevent="cancelEditTitle"
            />
          </div>
          <div v-else class="archive-drawer__title-row">
            <h2 class="archive-drawer__title">{{ title }}</h2>
            <button
              v-if="editable"
              type="button"
              class="archive-drawer__edit-btn"
              aria-label="编辑会话标题"
              @click="startEditTitle"
            >
              <AgentIcon name="edit" :size="14" />
            </button>
          </div>

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
          <div v-if="matchedMessageIds.length > 1" class="archive-drawer__search-nav">
            <div class="archive-drawer__search-pill">
              <button type="button" class="archive-drawer__search-arrow" aria-label="上一条" @click="goToPrevMatch">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2.5 7.5L6 4L9.5 7.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </button>
              <span class="archive-drawer__search-text">{{ matchedMessageIds.length }} 条匹配</span>
              <button type="button" class="archive-drawer__search-arrow" aria-label="下一条" @click="goToNextMatch">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </button>
            </div>
          </div>
          <div
            v-for="message in messages"
            :key="message.id"
            :data-message-id="message.id"
            class="archive-message"
            :class="[`archive-message--${message.role}`, { 'archive-message--highlighted': matchedMessageIds.length > 0 && matchedMessageIds[currentMatchIndex] === message.id }]"
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
          <template v-if="showAutopilotActions">
            <div class="archive-drawer__dual-actions">
              <button type="button" class="archive-drawer__action-btn archive-drawer__action-btn--takeover" @click="$emit('takeover')">接管会话</button>
              <button type="button" class="archive-drawer__action-btn archive-drawer__action-btn--assign" @click="$emit('assign')">分配会话</button>
            </div>
          </template>
          <template v-else-if="showQueueingActions">
            <div class="archive-drawer__dual-actions">
              <button type="button" class="archive-drawer__action-btn archive-drawer__action-btn--assign" @click="$emit('takeover')">分配会话</button>
              <button type="button" class="archive-drawer__action-btn archive-drawer__action-btn--takeover" @click="$emit('assign')">领取会话</button>
            </div>
          </template>
          <template v-else>
            <button type="button" class="archive-drawer__assign-btn" :class="{ 'archive-drawer__assign-btn--join': variant === 'join' }" @click="$emit('assign')">{{ assignLabel }}</button>
          </template>
        </footer>
      </aside>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, watch } from "vue";
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

const props = withDefaults(
  defineProps<{
    open: boolean;
    title: string;
    messages: DrawerMessage[];
    searchKeyword?: string;
    assignLabel?: string;
    editable?: boolean;
    variant?: "default" | "join";
    showAutopilotActions?: boolean;
    showQueueingActions?: boolean;
  }>(),
  {
    assignLabel: "分配会话",
    editable: true,
    variant: "default",
    showAutopilotActions: false,
    showQueueingActions: false
  }
);

const emit = defineEmits<{
  (e: "close"): void;
  (e: "assign"): void;
  (e: "takeover"): void;
  (e: "edit-title"): void;
  (e: "update:title", value: string): void;
}>();

const messagesRef = ref<HTMLElement | null>(null);
const drawerTitleInputRef = ref<HTMLInputElement | null>(null);
const isEditingTitle = ref(false);
const draftTitle = ref("");

const startEditTitle = () => {
  draftTitle.value = props.title;
  isEditingTitle.value = true;
  nextTick(() => {
    drawerTitleInputRef.value?.focus();
  });
};

const saveTitle = () => {
  const next = draftTitle.value.trim();
  if (next && next !== props.title) {
    emit("update:title", next);
  }
  isEditingTitle.value = false;
};

const cancelEditTitle = () => {
  isEditingTitle.value = false;
};

const scrollToTop = () => {
  messagesRef.value?.scrollTo({ top: 0, behavior: "smooth" });
};

const scrollToBottom = () => {
  if (!messagesRef.value) {
    return;
  }

  messagesRef.value.scrollTo({ top: messagesRef.value.scrollHeight, behavior: "smooth" });
};

// 搜索匹配导航
const currentMatchIndex = ref(0);

const matchedMessageIds = computed(() => {
  const kw = (props.searchKeyword ?? "").trim().toLowerCase();
  if (!kw) return [] as string[];
  return props.messages
    .filter((m) => m.role !== "system" && m.content.toLowerCase().includes(kw))
    .map((m) => m.id);
});

function scrollToMatchedMessage(messageId: string) {
  nextTick(() => {
    const el = messagesRef.value?.querySelector(`[data-message-id="${messageId}"]`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
  });
}

function goToPrevMatch() {
  if (matchedMessageIds.value.length === 0) return;
  currentMatchIndex.value = (currentMatchIndex.value - 1 + matchedMessageIds.value.length) % matchedMessageIds.value.length;
  scrollToMatchedMessage(matchedMessageIds.value[currentMatchIndex.value]);
}

function goToNextMatch() {
  if (matchedMessageIds.value.length === 0) return;
  currentMatchIndex.value = (currentMatchIndex.value + 1) % matchedMessageIds.value.length;
  scrollToMatchedMessage(matchedMessageIds.value[currentMatchIndex.value]);
}

watch(
  () => props.open,
  async (value) => {
    if (!value) return;
    await nextTick();
    currentMatchIndex.value = 0;
    if (matchedMessageIds.value.length > 0) {
      scrollToMatchedMessage(matchedMessageIds.value[0]);
    } else {
      scrollToBottom();
    }
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
  background: var(--agent-color-bg-muted);
  border: 1px solid var(--agent-color-border-default);
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

.archive-drawer__title-row {
  align-items: center;
  display: flex;
  gap: 8px;
  min-width: 0;
}

.archive-drawer__title {
  color: var(--agent-color-text-primary);
  font-size: 17px;
  font-weight: 600;
  line-height: 1.3;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.archive-drawer__edit-btn {
  align-items: center;
  background: transparent;
  border: 0;
  border-radius: 6px;
  color: var(--agent-color-text-tertiary);
  cursor: pointer;
  display: inline-flex;
  flex-shrink: 0;
  height: 28px;
  justify-content: center;
  padding: 0;
  transition: color 0.15s ease;
  width: 28px;
}

.archive-drawer__edit-btn:hover {
  color: var(--agent-color-brand-primary);
}

.archive-drawer__title-edit {
  flex: 1;
  min-width: 0;
}

.archive-drawer__title-input {
  appearance: none;
  background: var(--agent-color-bg-panel);
  border: 1px solid var(--agent-color-border-default);
  border-radius: 8px;
  color: var(--agent-color-text-primary);
  font-size: 16px;
  font-weight: 600;
  height: 36px;
  outline: none;
  padding: 0 10px;
  width: 100%;
}

.archive-drawer__title-input:focus {
  border-color: var(--agent-color-brand-primary);
  box-shadow: 0 0 0 2px rgba(47, 107, 255, 0.08);
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
  color: var(--agent-color-text-primary);
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
  color: var(--agent-color-bg-panel);
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
  color: var(--agent-color-text-tertiary);
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
  background: var(--agent-color-bg-muted);
  border-radius: 16px;
  color: var(--agent-color-text-primary);
  font-size: 15px;
  line-height: 1.5;
  max-width: 100%;
  min-height: 40px;
  padding: 10px 16px;
  white-space: pre-wrap;
  word-break: break-word;
}

.archive-message--agent .archive-message__bubble {
  background: var(--agent-color-brand-soft);
}

.archive-message__system {
  color: var(--agent-color-text-tertiary);
  font-size: 13px;
  text-align: center;
}

.archive-message--highlighted .archive-message__bubble {
  background: rgba(47, 107, 255, 0.08);
  box-shadow: 0 0 0 2px rgba(47, 107, 255, 0.2);
}

.archive-drawer__search-nav {
  display: flex;
  justify-content: flex-end;
  position: sticky;
  top: 0;
  z-index: 1;
}

.archive-drawer__search-pill {
  align-items: center;
  background: #fff;
  border: 1px solid var(--agent-color-border-default);
  border-radius: 999px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  display: inline-flex;
  gap: 2px;
  padding: 4px 6px;
}

.archive-drawer__search-text {
  color: var(--agent-color-text-secondary);
  font-size: 12px;
  line-height: 1;
  padding: 0 4px;
  white-space: nowrap;
}

.archive-drawer__search-arrow {
  align-items: center;
  background: transparent;
  border: 0;
  border-radius: 50%;
  color: var(--agent-color-text-tertiary);
  cursor: pointer;
  display: inline-flex;
  height: 22px;
  justify-content: center;
  transition: background-color 0.15s ease, color 0.15s ease;
  width: 22px;
}

.archive-drawer__search-arrow:hover {
  background: var(--agent-color-bg-muted);
  color: var(--agent-color-text-primary);
}

.archive-drawer__footer {
  padding-top: 4px;
}

.archive-drawer__assign-btn {
  background: var(--agent-color-bg-muted);
  border: 1px solid var(--agent-color-border-default);
  border-radius: 22px;
  color: var(--agent-color-brand-primary);
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  height: 52px;
  width: 100%;
}

.archive-drawer__assign-btn:hover {
  background: var(--agent-color-bg-panel);
}

.archive-drawer__assign-btn--join {
  background: var(--agent-color-brand-primary);
  border-color: var(--agent-color-brand-primary);
  color: var(--agent-color-bg-panel);
}

.archive-drawer__assign-btn--join:hover {
  background: var(--agent-color-brand-primary-hover);
}

.archive-drawer__dual-actions {
  display: flex;
  gap: 12px;
}

.archive-drawer__action-btn {
  border-radius: 22px;
  cursor: pointer;
  flex: 1;
  font-size: 16px;
  font-weight: 600;
  height: 52px;
}

.archive-drawer__action-btn--takeover {
  background: var(--agent-color-brand-primary);
  border: 1px solid var(--agent-color-brand-primary);
  color: var(--agent-color-bg-panel);
}

.archive-drawer__action-btn--takeover:hover {
  background: var(--agent-color-brand-primary-hover);
}

.archive-drawer__action-btn--assign {
  background: var(--agent-color-bg-muted);
  border: 1px solid var(--agent-color-border-default);
  color: var(--agent-color-brand-primary);
}

.archive-drawer__action-btn--assign:hover {
  background: var(--agent-color-bg-panel);
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
