<template>
  <Teleport to="body">
    <div v-if="open" class="drawer-mask" @click.self="$emit('close')">
      <aside class="drawer-panel agent-panel">
        <header class="drawer-panel__header">
          <h2 class="drawer-panel__title">消息列表</h2>
          <button type="button" class="drawer-panel__close" aria-label="关闭" @click="$emit('close')">×</button>
        </header>

        <div class="drawer-panel__body agent-scroll">
          <button
            v-for="msg in messages"
            :key="msg.id"
            type="button"
            class="message-item"
            @click="$emit('select', msg.id)"
          >
            <span class="message-item__avatar" :style="{ background: msg.avatarColor }">
              <img v-if="msg.avatarUrl" :src="msg.avatarUrl" alt="" />
              <span v-else>{{ msg.avatarText }}</span>
            </span>
            <div class="message-item__content">
              <div class="message-item__meta">
                <span class="message-item__sender">{{ msg.sender }}</span>
                <span class="message-item__time">{{ msg.time }}</span>
              </div>
              <div class="message-item__bubble" v-html="highlight(msg.content)"></div>
            </div>
          </button>
        </div>
      </aside>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
const props = defineProps<{
  open: boolean;
  keyword?: string;
  messages: Array<{
    id: string;
    sender: string;
    content: string;
    time: string;
    avatarText?: string;
    avatarColor?: string;
    avatarUrl?: string;
  }>;
}>();

defineEmits<{
  (e: "select", messageId: string): void;
  (e: "close"): void;
}>();

function highlight(text: string) {
  const kw = props.keyword?.trim();
  if (!kw) return escapeHtml(text);
  return highlightKeyword(text, kw, "msg-highlight");
}

function escapeHtml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function highlightKeyword(text: string, keyword: string, className: string) {
  const lowerText = text.toLowerCase();
  const lowerKeyword = keyword.toLowerCase();
  let cursor = 0;
  let html = "";

  while (cursor < text.length) {
    const index = lowerText.indexOf(lowerKeyword, cursor);
    if (index === -1) {
      html += escapeHtml(text.slice(cursor));
      break;
    }

    html += escapeHtml(text.slice(cursor, index));
    html += `<span class="${className}">${escapeHtml(text.slice(index, index + keyword.length))}</span>`;
    cursor = index + keyword.length;
  }

  return html;
}
</script>

<style scoped>
.drawer-mask {
  align-items: center;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  inset: 0;
  justify-content: flex-end;
  position: fixed;
  z-index: var(--agent-z-modal);
}

.drawer-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
  max-width: 480px;
  width: 100%;
}

.drawer-panel__header {
  align-items: center;
  border-bottom: 1px solid var(--agent-color-border-primary);
  display: flex;
  justify-content: space-between;
  padding: var(--agent-space-16);
}

.drawer-panel__title {
  font-size: var(--agent-font-size-lg);
  font-weight: var(--agent-font-weight-semibold);
  margin: 0;
}

.drawer-panel__close {
  background: transparent;
  border: 0;
  color: var(--agent-color-text-secondary);
  cursor: pointer;
  font-size: 24px;
  line-height: 1;
  padding: 0;
}

.drawer-panel__body {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: var(--agent-space-8);
  overflow-y: auto;
  padding: var(--agent-space-16);
}

.message-item {
  align-items: flex-start;
  background: transparent;
  border: 0;
  border-radius: var(--agent-radius-md);
  cursor: pointer;
  display: flex;
  gap: var(--agent-space-12);
  padding: var(--agent-space-12);
  text-align: left;
  width: 100%;
}

.message-item:hover {
  background: var(--agent-color-bg-muted);
}

.message-item__avatar {
  align-items: center;
  border-radius: 50%;
  color: #fff;
  display: flex;
  flex-shrink: 0;
  font-size: var(--agent-font-size-sm);
  font-weight: var(--agent-font-weight-semibold);
  height: 36px;
  justify-content: center;
  overflow: hidden;
  width: 36px;
}

.message-item__avatar img {
  height: 100%;
  object-fit: cover;
  width: 100%;
}

.message-item__content {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: var(--agent-space-4);
  min-width: 0;
}

.message-item__meta {
  align-items: center;
  display: flex;
  gap: var(--agent-space-8);
}

.message-item__sender {
  color: var(--agent-color-text-primary);
  font-size: var(--agent-font-size-sm);
  font-weight: var(--agent-font-weight-medium);
}

.message-item__time {
  color: var(--agent-color-text-tertiary);
  font-size: var(--agent-font-size-xs);
}

.message-item__bubble {
  background: var(--agent-color-bg-secondary);
  border-radius: var(--agent-radius-md);
  color: var(--agent-color-text-primary);
  display: block;
  font-size: var(--agent-font-size-sm);
  line-height: 1.5;
  overflow: hidden;
  padding: var(--agent-space-8) var(--agent-space-12);
  text-overflow: ellipsis;
  white-space: nowrap;
}

:deep(.msg-highlight) {
  color: var(--agent-color-brand-primary);
  font-weight: var(--agent-font-weight-medium);
}
</style>
