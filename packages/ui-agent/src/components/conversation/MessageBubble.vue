<template>
  <article class="message" :class="`message--${role}`">
    <template v-if="role === 'system'">
      <div class="message__system">{{ content }}</div>
    </template>

    <template v-else>
      <span class="message__avatar" :style="{ background: avatarColor }">{{ avatarText }}</span>
      <div class="message__main">
        <header class="message__meta">
          <span class="message__sender">{{ sender }}</span>
          <time>{{ time }}</time>
        </header>
        <div class="message__bubble">{{ content }}</div>
      </div>
    </template>
  </article>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    role: "agent" | "customer" | "system" | "bot";
    sender: string;
    content: string;
    time: string;
    avatarText?: string;
    avatarColor?: string;
  }>(),
  {
    avatarText: "?",
    avatarColor: "linear-gradient(135deg, #2f6bff 0%, #69a1ff 100%)"
  }
);
</script>

<style scoped>
.message {
  display: flex;
  gap: var(--agent-space-8);
  max-width: 80%;
}

.message--customer {
  align-self: flex-start;
}

.message--agent {
  align-self: flex-end;
  flex-direction: row-reverse;
}

.message--system {
  align-self: center;
  max-width: 100%;
}

.message__avatar {
  align-items: center;
  border-radius: 50%;
  color: #ffffff;
  display: inline-flex;
  flex-shrink: 0;
  font-size: 11px;
  font-weight: var(--agent-font-weight-semibold);
  height: 32px;
  justify-content: center;
  margin-top: 2px;
  width: 32px;
}

.message__main {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
}

.message__meta {
  color: var(--agent-color-text-tertiary);
  display: flex;
  font-size: var(--agent-font-size-xs);
  gap: var(--agent-space-8);
}

.message--agent .message__meta {
  justify-content: flex-end;
}

.message__sender {
  color: var(--agent-color-text-secondary);
}

.message__bubble {
  border: 1px solid var(--agent-color-border-default);
  border-radius: var(--agent-radius-lg);
  color: var(--agent-color-text-primary);
  font-size: var(--agent-font-size-sm);
  line-height: 1.5;
  padding: 10px var(--agent-space-12);
  white-space: pre-wrap;
}

.message--customer .message__bubble {
  background: #ffffff;
}

.message--agent .message__bubble {
  background: #eef4ff;
}

.message--bot {
  align-self: flex-start;
}

.message--bot .message__bubble {
  background: #f0fdf4;
}

.message__system {
  color: var(--agent-color-text-tertiary);
  font-size: var(--agent-font-size-xs);
  text-align: center;
}
</style>
