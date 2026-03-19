<template>
  <button class="session-item" :class="{ 'session-item--active': active }" type="button">
    <span v-if="avatarText" class="session-item__avatar" :style="{ background: avatarColor }">{{ avatarText }}</span>
    <div class="session-item__main">
      <div class="session-item__row">
        <span class="session-item__name-wrap">
          <strong>{{ customerName }}</strong>
          <span v-if="channelType === 'email'" class="session-item__channel-badge" title="Email">
            <AgentIcon name="email" :size="12" />
          </span>
        </span>
        <span class="session-item__time">{{ updatedAt }}</span>
      </div>
      <div class="session-item__row">
        <span class="session-item__preview">{{ preview }}</span>
        <span v-if="unreadCount && unreadCount > 0" class="session-item__unread-dot"></span>
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

.session-item__channel-badge {
  align-items: center;
  color: var(--agent-color-text-tertiary);
  display: inline-flex;
  flex-shrink: 0;
}
</style>
