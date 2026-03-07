<template>
  <section class="archive-nav">
    <header class="archive-nav__header">
      <h2 class="archive-nav__title">{{ title }}</h2>
    </header>

    <div class="archive-nav__body agent-scroll">
      <button
        v-for="item in items"
        :key="item.key"
        type="button"
        class="archive-nav__item"
        :class="{ 'archive-nav__item--active': item.key === activeKey }"
        @click="$emit('select', item.key)"
      >
        <span class="archive-nav__item-icon">
          <AgentIcon :name="item.icon" :size="16" />
        </span>
        <span class="archive-nav__item-label">{{ item.label }}</span>
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { AgentIcon } from "@twt/ui-agent";

defineProps<{
  title: string;
  activeKey: string;
  items: Array<{
    key: string;
    label: string;
    icon: string;
  }>;
}>();

defineEmits<{
  (e: "select", key: string): void;
}>();
</script>

<style scoped>
.archive-nav {
  display: flex;
  flex-direction: column;
  gap: var(--agent-space-20);
  height: 100%;
  padding: var(--agent-space-24) var(--agent-space-12) var(--agent-space-16);
}

.archive-nav__header {
  padding: 0 var(--agent-space-8);
}

.archive-nav__title {
  color: #222222;
  font-size: 20px;
  font-weight: var(--agent-font-weight-semibold);
  line-height: 1.2;
  margin: 0;
}

.archive-nav__body {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 6px;
  min-height: 0;
}

.archive-nav__item {
  align-items: center;
  background: transparent;
  border: 0;
  border-radius: var(--agent-radius-md);
  color: #222222;
  cursor: pointer;
  display: flex;
  font-size: 14px;
  font-weight: var(--agent-font-weight-medium);
  gap: var(--agent-space-8);
  padding: 12px var(--agent-space-12);
  text-align: left;
  transition: background-color var(--agent-motion-fast) ease, color var(--agent-motion-fast) ease;
  width: 100%;
}

.archive-nav__item:hover {
  background: var(--agent-color-bg-panel);
}

.archive-nav__item--active {
  background: #e7eefc;
}

.archive-nav__item-icon {
  align-items: center;
  color: var(--agent-color-text-secondary);
  display: inline-flex;
  justify-content: center;
}

.archive-nav__item--active .archive-nav__item-icon,
.archive-nav__item--active .archive-nav__item-label {
  color: var(--agent-color-text-primary);
}

.archive-nav__item-label {
  line-height: 1.2;
}
</style>
