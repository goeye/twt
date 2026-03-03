<template>
  <section class="message-list agent-panel">
    <div v-if="items.length === 0" class="message-list__empty">
      <slot name="empty" />
    </div>
    <div v-else class="message-list__body agent-scroll">
      <MessageBubble
        v-for="item in items"
        :key="item.id"
        :content="item.content"
        :role="item.role"
        :sender="item.sender"
        :time="item.time"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import type { MessageItem } from "../../types";
import MessageBubble from "./MessageBubble.vue";

defineProps<{
  items: MessageItem[];
}>();
</script>

<style scoped>
.message-list {
  display: flex;
  flex: 1;
  min-height: 0;
  padding: var(--agent-space-12);
}

.message-list__empty {
  align-items: center;
  color: var(--agent-color-text-tertiary);
  display: flex;
  justify-content: center;
  width: 100%;
}

.message-list__body {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: var(--agent-space-12);
  min-height: 0;
}
</style>
