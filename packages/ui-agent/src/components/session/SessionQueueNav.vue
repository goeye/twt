<template>
  <section class="queue-nav">
    <header class="queue-nav__header">
      <h2 class="queue-nav__title">{{ title }}</h2>
    </header>

    <div class="queue-nav__body agent-scroll">
      <section v-for="group in groups" :key="group.key" class="queue-nav__group">
        <div class="queue-nav__group-header">
          <button class="queue-nav__group-trigger" type="button" @click="toggleGroup(group.key)">
            <span class="queue-nav__group-trigger-main">
              <span class="queue-nav__group-title">{{ group.title }}</span>
              <span class="queue-nav__group-arrow" :class="{ 'queue-nav__group-arrow--collapsed': isGroupCollapsed(group.key) }">
                <AgentIcon :name="isGroupCollapsed(group.key) ? 'chevron-right' : 'chevron-down'" :size="14" />
              </span>
            </span>
          </button>

          <div v-if="group.actions?.length" class="queue-nav__group-actions">
            <button
              v-for="action in group.actions"
              :key="action.key"
              type="button"
              class="queue-nav__group-action"
              :aria-label="action.label"
              :title="action.label"
              @click.stop="$emit('group-action', { groupKey: group.key, actionKey: action.key })"
            >
              <AgentIcon v-if="action.icon" :name="action.icon" :size="14" />
              <span v-else class="queue-nav__group-action-text">{{ action.text ?? "+" }}</span>
            </button>
          </div>
        </div>

        <div v-show="!isGroupCollapsed(group.key)" class="queue-nav__items">
          <button
            v-for="item in group.items"
            :key="item.key"
            class="queue-nav__item"
            :class="{ 'queue-nav__item--active': item.key === activeKey }"
            type="button"
            @click="$emit('select', item.key)"
          >
            <span class="queue-nav__item-main">
              <span v-if="item.leadingEmoji" class="queue-nav__item-emoji">{{ item.leadingEmoji }}</span>
              <span v-else-if="item.icon" class="queue-nav__item-icon">
                <AgentIcon :name="item.icon" :size="14" />
              </span>
              <span>{{ item.label }}</span>
            </span>
            <span v-if="shouldShowBadge(item.key, item.count)" class="queue-nav__badge">{{ item.count }}</span>
          </button>
        </div>
      </section>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { SessionQueueGroup } from "../../types";
import AgentIcon from "../icon/AgentIcon.vue";

defineProps<{
  title: string;
  groups: SessionQueueGroup[];
  activeKey: string;
}>();

defineEmits<{
  (e: "select", key: string): void;
  (e: "group-action", payload: { groupKey: string; actionKey: string }): void;
}>();

const collapsedGroups = ref<string[]>([]);

const isGroupCollapsed = (key: string) => collapsedGroups.value.includes(key);

const toggleGroup = (key: string) => {
  if (isGroupCollapsed(key)) {
    collapsedGroups.value = collapsedGroups.value.filter((item) => item !== key);
    return;
  }
  collapsedGroups.value = [...collapsedGroups.value, key];
};

const shouldShowBadge = (itemKey: string, count?: number) => {
  if (itemKey === "resolved") {
    return false;
  }
  return Boolean(count && count > 0);
};
</script>

<style scoped>
.queue-nav {
  display: flex;
  flex-direction: column;
  gap: var(--agent-space-16);
  height: 100%;
  padding: var(--agent-space-24) var(--agent-space-12) var(--agent-space-16);
}

.queue-nav__title {
  color: #222222;
  font-size: 20px;
  font-weight: var(--agent-font-weight-semibold);
  line-height: 1.2;
  margin: 0;
}

.queue-nav__body {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: var(--agent-space-16);
  min-height: 0;
}

.queue-nav__group {
  display: flex;
  flex-direction: column;
  gap: var(--agent-space-4);
}

.queue-nav__group-header {
  align-items: center;
  display: flex;
  gap: var(--agent-space-4);
  justify-content: space-between;
}

.queue-nav__group-trigger {
  align-items: center;
  background: transparent;
  border: 0;
  border-radius: var(--agent-radius-md);
  cursor: pointer;
  display: inline-flex;
  flex: 1;
  justify-content: flex-start;
  min-width: 0;
  padding: var(--agent-space-8);
  text-align: left;
}

.queue-nav__group-trigger-main {
  align-items: center;
  display: inline-flex;
  gap: 2px;
  min-width: 0;
}

.queue-nav__group-title {
  color: var(--agent-color-text-tertiary);
  font-size: 12px;
  font-weight: var(--agent-font-weight-medium);
  margin: 0;
}

.queue-nav__group-arrow {
  color: var(--agent-color-text-secondary);
  display: inline-flex;
}

.queue-nav__group-arrow--collapsed {
  color: var(--agent-color-text-tertiary);
}

.queue-nav__group-actions {
  align-items: center;
  display: inline-flex;
  gap: 2px;
}

.queue-nav__group-action {
  align-items: center;
  background: transparent;
  border: 0;
  border-radius: var(--agent-radius-md);
  color: var(--agent-color-text-secondary);
  cursor: pointer;
  display: inline-flex;
  height: 28px;
  justify-content: center;
  min-width: 28px;
  padding: 0 6px;
  transition: background-color var(--agent-motion-fast) ease, color var(--agent-motion-fast) ease;
}

.queue-nav__group-action:hover {
  background: var(--agent-color-bg-panel);
  color: var(--agent-color-text-primary);
}

.queue-nav__group-action-text {
  font-size: 22px;
  font-weight: var(--agent-font-weight-medium);
  line-height: 1;
}

.queue-nav__items {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.queue-nav__item {
  align-items: center;
  background: transparent;
  border: 0;
  border-radius: var(--agent-radius-md);
  color: #222222;
  cursor: pointer;
  display: inline-flex;
  font-size: 14px;
  font-weight: var(--agent-font-weight-medium);
  justify-content: space-between;
  line-height: 1.2;
  padding: 10px var(--agent-space-12);
  transition: background-color var(--agent-motion-fast) ease;
  width: 100%;
}

.queue-nav__item:hover {
  background: var(--agent-color-bg-panel);
}

.queue-nav__item--active {
  background: var(--agent-color-brand-soft);
}

.queue-nav__item-main {
  align-items: center;
  display: inline-flex;
  gap: var(--agent-space-8);
}

.queue-nav__item-emoji {
  font-size: var(--agent-font-size-lg);
  line-height: 1;
}

.queue-nav__item-icon {
  color: var(--agent-color-text-secondary);
  display: inline-flex;
}

.queue-nav__badge {
  align-items: center;
  background: var(--agent-color-status-error);
  border-radius: 999px;
  color: #ffffff;
  display: inline-flex;
  font-size: 10px;
  font-weight: var(--agent-font-weight-semibold);
  height: 18px;
  justify-content: center;
  line-height: 1;
  min-width: 18px;
  padding: 0 5px;
}
</style>
