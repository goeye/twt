<template>
  <BaseModal :open="open" title="消息列表" @close="$emit('close')">
    <div class="match-list">
      <button
        v-for="msg in messages"
        :key="msg.id"
        type="button"
        class="match-item"
        @click="$emit('select', msg.id)"
      >
        <span class="match-item__avatar" :style="{ background: msg.avatarColor }">
          <img v-if="msg.avatarUrl" :src="msg.avatarUrl" alt="" />
          <span v-else>{{ msg.avatarText }}</span>
        </span>
        <div class="match-item__content">
          <div class="match-item__meta">
            <span class="match-item__sender">{{ msg.sender }}</span>
            <span class="match-item__time">{{ msg.time }}</span>
          </div>
          <div class="match-item__bubble" v-html="highlight(msg.content)"></div>
        </div>
      </button>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import BaseModal from "./BaseModal.vue";

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
  return highlightKeyword(text, kw, "match-highlight");
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
.match-list {
  display: flex;
  flex-direction: column;
  gap: var(--agent-space-8);
  max-height: 400px;
  overflow-y: auto;
}

.match-item {
  align-items: flex-start;
  background: #fff;
  border: 0;
  border-radius: var(--agent-radius-md);
  cursor: pointer;
  display: flex;
  gap: var(--agent-space-12);
  padding: var(--agent-space-12);
  text-align: left;
  width: 100%;
}

.match-item:hover {
  background: var(--agent-color-bg-muted);
}

.match-item__avatar {
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

.match-item__avatar img {
  height: 100%;
  object-fit: cover;
  width: 100%;
}

.match-item__content {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: var(--agent-space-4);
  min-width: 0;
}

.match-item__meta {
  align-items: center;
  display: flex;
  gap: var(--agent-space-8);
}

.match-item__sender {
  color: var(--agent-color-text-primary);
  font-size: var(--agent-font-size-sm);
  font-weight: var(--agent-font-weight-medium);
}

.match-item__time {
  color: var(--agent-color-text-tertiary);
  font-size: var(--agent-font-size-xs);
}

.match-item__bubble {
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

:deep(.match-highlight) {
  color: var(--agent-color-brand-primary);
  font-weight: var(--agent-font-weight-medium);
}
</style>
