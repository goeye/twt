<template>
  <section class="session-list">
    <header class="session-list__header">
      <h3 class="agent-title">会话列表</h3>
      <input class="agent-input" :value="keyword" placeholder="搜索" @input="onKeywordInput" />
    </header>
    <div class="session-list__body agent-scroll">
      <SessionListItem
        v-for="item in items"
        :key="item.id"
        :active="item.id === activeId"
        :customer-name="item.customerName"
        :preview="item.preview"
        :unread-count="item.unreadCount"
        :updated-at="item.updatedAt"
        @click="$emit('select', item.id)"
      />
      <slot v-if="items.length === 0" name="empty" />
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { SessionItem } from "../../types";
import SessionListItem from "./SessionListItem.vue";

const props = defineProps<{
  items: SessionItem[];
  activeId?: string;
  keyword?: string;
}>();

const emit = defineEmits<{
  (e: "select", id: string): void;
  (e: "update:keyword", value: string): void;
}>();

const keyword = computed(() => props.keyword ?? "");

const onKeywordInput = (event: Event) => {
  const next = (event.target as HTMLInputElement).value;
  emit("update:keyword", next);
};
</script>

<style scoped>
.session-list {
  display: flex;
  flex-direction: column;
  gap: var(--agent-space-12);
  height: 100%;
  padding: var(--agent-space-12);
}

.session-list__header {
  display: flex;
  flex-direction: column;
  gap: var(--agent-space-8);
}

.session-list__body {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: var(--agent-space-8);
  min-height: 0;
}
</style>
