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
          <div class="match-item__bubble">{{ msg.content }}</div>
        </div>
      </button>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import BaseModal from "./BaseModal.vue";

defineProps<{
  open: boolean;
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
  display: -webkit-box;
  font-size: var(--agent-font-size-sm);
  line-height: 1.5;
  overflow: hidden;
  padding: var(--agent-space-8) var(--agent-space-12);
  text-overflow: ellipsis;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}
</style>
