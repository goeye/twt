<template>
  <button class="session-item" :class="{ 'session-item--active': active }" type="button">
    <span v-if="avatarText" class="session-item__avatar-wrap">
      <span class="session-item__avatar" :style="{ background: avatarColor }">{{ avatarText }}</span>
      <span v-if="showOnlineStatus" class="session-item__online-dot" :class="online ? 'session-item__online-dot--online' : 'session-item__online-dot--offline'" />
    </span>
    <div class="session-item__main">
      <div class="session-item__row">
        <span class="session-item__name-wrap">
          <span v-if="channelType === 'email'" class="session-item__channel-icon session-item__channel-icon--email" title="Email">
            <AgentIcon name="email" :size="12" />
          </span>
          <span v-else-if="channelType === 'telegram'" class="session-item__channel-icon session-item__channel-icon--telegram" title="Telegram">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
            </svg>
          </span>
          <span v-else-if="channelType === 'widget'" class="session-item__channel-icon session-item__channel-icon--widget" title="聊天插件">
            <AgentIcon name="widget" :size="12" />
          </span>
          <span v-else class="session-item__channel-icon session-item__channel-icon--web" title="Web">
            <AgentIcon name="web" :size="12" />
          </span>
          <strong>{{ customerName }}</strong>
        </span>
        <span class="session-item__time">{{ updatedAt }}</span>
      </div>
      <div class="session-item__row">
        <span v-if="matchCount && matchCount > 0" class="session-item__match-count">{{ matchCount }}条相关记录</span>
        <template v-else>
          <span class="session-item__preview" v-html="highlightedPreview"></span>
          <span v-if="unreadCount && unreadCount > 0" class="session-item__unread-dot"></span>
        </template>
      </div>
    </div>
  </button>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { ChannelType } from "../../types";
import AgentIcon from "../icon/AgentIcon.vue";

const props = withDefaults(
  defineProps<{
    customerName: string;
    preview: string;
    updatedAt: string;
    unreadCount?: number;
    active?: boolean;
    tag?: string;
    avatarText?: string;
    avatarColor?: string;
    channelType?: ChannelType;
    showOnlineStatus?: boolean;
    online?: boolean;
    matchCount?: number;
    keyword?: string;
    isNotePreview?: boolean;
  }>(),
  {
    avatarColor: "linear-gradient(135deg, #2f6bff 0%, #4a84ff 100%)"
  }
);

const highlightedPreview = computed(() => {
  const kw = props.keyword?.trim();
  const text = props.preview;
  if (!kw) return escapeHtml(text);
  return highlightKeyword(text, kw, "session-item__highlight");
});

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
.session-item {
  align-items: center;
  background: #fff;
  border: 0;
  border-radius: var(--agent-radius-md);
  cursor: pointer;
  display: flex;
  gap: var(--agent-space-8);
  padding: var(--agent-space-12);
  text-align: left;
  width: 100%;
}

.session-item:hover {
  background: var(--agent-color-bg-muted);
}

.session-item--active {
  background: #e8f0ff;
}

.session-item__avatar-wrap {
  flex-shrink: 0;
  position: relative;
}

.session-item__avatar {
  align-items: center;
  border-radius: 50%;
  color: #ffffff;
  display: inline-flex;
  font-size: var(--agent-font-size-sm);
  font-weight: var(--agent-font-weight-semibold);
  height: 38px;
  justify-content: center;
  width: 38px;
}

.session-item__online-dot {
  border: 2px solid #fff;
  border-radius: 50%;
  bottom: 0;
  height: 10px;
  position: absolute;
  right: 0;
  width: 10px;
}

.session-item__online-dot--online {
  background: #22c55e;
}

.session-item__online-dot--offline {
  background: #9ca3af;
}

.session-item__main {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: var(--agent-space-8);
  min-width: 0;
}

.session-item__row {
  align-items: center;
  display: flex;
  gap: var(--agent-space-8);
  justify-content: space-between;
}

.session-item__name-wrap {
  align-items: center;
  display: inline-flex;
  gap: 6px;
  min-width: 0;
}

.session-item strong {
  color: var(--agent-color-text-primary);
  font-size: var(--agent-font-size-sm);
  font-weight: var(--agent-font-weight-medium);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.session-item__time {
  color: var(--agent-color-text-tertiary);
  font-size: var(--agent-font-size-xs);
  flex-shrink: 0;
}

.session-item__preview {
  color: var(--agent-color-text-secondary);
  flex: 1;
  font-size: var(--agent-font-size-xs);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.session-item__unread-dot {
  background: var(--agent-color-status-error);
  border-radius: 50%;
  flex-shrink: 0;
  height: 8px;
  width: 8px;
}

:deep(.session-item__highlight) {
  color: var(--agent-color-brand-primary);
  font-weight: var(--agent-font-weight-medium);
}

.session-item__match-count {
  color: var(--agent-color-brand-primary);
  flex-shrink: 0;
  font-size: 11px;
  white-space: nowrap;
}

.session-item__channel-icon {
  align-items: center;
  border-radius: 4px;
  display: inline-flex;
  flex-shrink: 0;
  height: 18px;
  justify-content: center;
  width: 18px;
}

.session-item__channel-icon--web {
  background: #e8f0ff;
  color: #2f6bff;
}

.session-item__channel-icon--widget {
  background: #e8f5e9;
  color: #22c55e;
}

.session-item__channel-icon--email {
  background: #fef3cd;
  color: #b45309;
}

.session-item__channel-icon--telegram {
  background: #dbeafe;
  color: #0088cc;
}
</style>
