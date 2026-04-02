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
          <span class="session-item__preview">{{ preview }}</span>
          <span v-if="unreadCount && unreadCount > 0" class="session-item__unread-dot"></span>
        </template>
      </div>
    </div>
  </button>
</template>

<script setup lang="ts">
import type { ChannelType } from "../../types";
import AgentIcon from "../icon/AgentIcon.vue";

withDefaults(
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
  }>(),
  {
    avatarColor: "linear-gradient(135deg, #2f6bff 0%, #4a84ff 100%)"
  }
);
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
</style>
