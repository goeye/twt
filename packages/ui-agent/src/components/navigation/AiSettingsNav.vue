<template>
  <section class="ai-nav" :class="`ai-nav--${variant}`">
    <header v-if="title" class="ai-nav__header">
      <h2 class="ai-nav__title">{{ title }}</h2>
    </header>

    <div class="ai-nav__body agent-scroll">
      <section v-for="group in groups" :key="group.key" class="ai-nav__group">
        <button v-if="group.title" class="ai-nav__group-title" type="button">
          <span class="ai-nav__group-title-main">
            <span v-if="group.leadingEmoji" class="ai-nav__group-emoji" aria-hidden="true">{{ group.leadingEmoji }}</span>
            <span>{{ group.title }}</span>
          </span>
        </button>

        <button
          v-for="item in group.items"
          :key="item.key"
          class="ai-nav__item"
          :class="{ 'ai-nav__item--active': item.key === activeKey }"
          type="button"
          :aria-label="item.label"
          @click="$emit('select', item.key)"
        >
          <span v-if="item.leadingEmoji" class="ai-nav__item-emoji" aria-hidden="true">{{ item.leadingEmoji }}</span>
          <span
            v-if="item.icon"
            class="ai-nav__item-icon"
            :class="item.iconTone ? `ai-nav__item-icon--${item.iconTone}` : ''"
          >
            <AgentIcon :name="item.icon" :size="16" />
          </span>
          <span>{{ item.label }}</span>
        </button>
      </section>
    </div>
  </section>
</template>

<script setup lang="ts">
import AgentIcon from "../icon/AgentIcon.vue";

interface AiSettingsNavItem {
  key: string;
  label: string;
  leadingEmoji?: string;
  icon?: string;
  iconTone?: string;
}

interface AiSettingsNavGroup {
  key: string;
  title: string;
  leadingEmoji?: string;
  items: AiSettingsNavItem[];
}

withDefaults(
  defineProps<{
    title?: string;
    activeKey: string;
    groups: AiSettingsNavGroup[];
    variant?: "default" | "settings";
  }>(),
  {
    variant: "default"
  }
);

defineEmits<{
  (e: "select", key: string): void;
}>();
</script>

<style scoped>
.ai-nav {
  display: flex;
  flex-direction: column;
  gap: var(--agent-space-24);
  height: 100%;
  padding: var(--agent-space-24) var(--agent-space-12);
}

.ai-nav__header {
  padding: 0 var(--agent-space-8);
}

.ai-nav__title {
  margin: 0;
  font-size: var(--agent-font-size-2xl);
  font-weight: var(--agent-font-weight-semibold);
  line-height: 1.2;
}

.ai-nav__body {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: var(--agent-space-16);
  min-height: 0;
}

.ai-nav__group {
  display: flex;
  flex-direction: column;
  gap: var(--agent-space-4);
}

.ai-nav__group-title {
  align-items: center;
  background: transparent;
  border: 0;
  color: var(--agent-color-text-primary);
  cursor: default;
  display: flex;
  font-size: var(--agent-font-size-lg);
  font-weight: var(--agent-font-weight-medium);
  justify-content: flex-start;
  line-height: 1.2;
  padding: var(--agent-space-8);
  text-align: left;
}

.ai-nav__group-title-main {
  align-items: center;
  display: inline-flex;
  gap: 6px;
}

.ai-nav__group-emoji {
  display: inline-block;
  font-size: 14px;
  line-height: 1;
}

.ai-nav__item {
  align-items: center;
  background: transparent;
  border: 0;
  border-radius: var(--agent-radius-md);
  color: var(--agent-color-text-primary);
  cursor: pointer;
  display: inline-flex;
  font-size: var(--agent-font-size-lg);
  font-weight: var(--agent-font-weight-medium);
  gap: var(--agent-space-8);
  line-height: 1.25;
  padding: var(--agent-space-8) var(--agent-space-12);
  text-align: left;
  transition: background-color var(--agent-motion-fast) ease;
  width: 100%;
}

.ai-nav__item:hover {
  background: var(--agent-color-bg-panel);
}

.ai-nav__item--active {
  background: var(--agent-color-brand-soft);
}

.ai-nav__item-icon {
  align-items: center;
  color: var(--agent-color-text-secondary);
  display: inline-flex;
  font-size: var(--agent-font-size-md);
  justify-content: center;
}

.ai-nav__item-icon--brand {
  color: var(--agent-color-brand-primary);
}

.ai-nav__item-icon--warning {
  color: var(--agent-color-status-warning);
}

.ai-nav__item-icon--secondary {
  color: var(--agent-color-text-tertiary);
}

.ai-nav__item-emoji {
  align-items: center;
  display: inline-flex;
  font-size: 16px;
  justify-content: center;
  line-height: 1;
}

.ai-nav--default .ai-nav__title {
  color: #222222;
  font-size: 20px;
  font-weight: var(--agent-font-weight-semibold);
}

.ai-nav--default .ai-nav__group-title {
  font-size: 12px;
}

.ai-nav--default .ai-nav__item {
  font-size: 14px;
}

.ai-nav--settings .ai-nav__group-title {
  color: #222222;
  font-size: 14px;
  font-weight: var(--agent-font-weight-semibold);
  justify-content: flex-start;
}

.ai-nav--settings .ai-nav__item {
  font-size: 13px;
  font-weight: var(--agent-font-weight-regular);
}

.ai-nav--settings .ai-nav__body {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.ai-nav--settings .ai-nav__body::-webkit-scrollbar {
  display: none;
  height: 0;
  width: 0;
}
</style>
