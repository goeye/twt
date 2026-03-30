<template>
  <BaseModal :open="open" title="发起聊天" @close="$emit('close')">
    <div class="start-chat-modal">
      <div class="start-chat-modal__search">
        <input type="text" class="start-chat-modal__input" placeholder="搜索" v-model="searchQuery" />
      </div>

      <div class="start-chat-modal__tabs">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          type="button"
          class="start-chat-modal__tab"
          :class="{ 'start-chat-modal__tab--active': activeTab === tab.key }"
          @click="activeTab = tab.key"
        >
          {{ tab.label }}
        </button>
      </div>

      <div class="start-chat-modal__content">
        <div class="start-chat-modal__selected" v-if="selectedItems.length > 0">
          <span class="start-chat-modal__selected-label">已选择 ({{ selectedItems.length }})</span>
          <div class="start-chat-modal__selected-list">
            <div v-for="item in selectedItems" :key="item.id" class="start-chat-modal__selected-item">
              <div class="start-chat-modal__avatar" :style="{ background: item.color }">{{ item.name.charAt(0) }}</div>
              <span class="start-chat-modal__name">{{ item.name }}</span>
            </div>
          </div>
        </div>

        <div class="start-chat-modal__list">
          <label
            v-for="item in filteredItems"
            :key="item.id"
            class="start-chat-modal__item"
          >
            <input type="checkbox" class="start-chat-modal__checkbox" :checked="isSelected(item.id)" @change="toggleItem(item)" />
            <div class="start-chat-modal__avatar" :style="{ background: item.color }">{{ item.name.charAt(0) }}</div>
            <span class="start-chat-modal__name">{{ item.name }}</span>
          </label>
        </div>
      </div>
    </div>

    <template #footer>
      <button type="button" class="agent-btn agent-btn--secondary" @click="$emit('close')">取消</button>
      <button type="button" class="agent-btn agent-btn--primary" @click="handleConfirm" :disabled="selectedItems.length === 0">确定</button>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import BaseModal from "../overlay/BaseModal.vue";

interface ChatTarget {
  id: string;
  name: string;
  color: string;
  type: "visitor" | "customer" | "agent";
}

defineProps<{
  open: boolean;
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "confirm", items: ChatTarget[]): void;
}>();

const searchQuery = ref("");
const activeTab = ref("visitor");
const selectedItems = ref<ChatTarget[]>([]);

const tabs = [
  { key: "visitor", label: "访客" },
  { key: "customer", label: "客户" },
  { key: "agent", label: "客服" },
  { key: "manual", label: "手动输入" }
];

const mockData: Record<string, ChatTarget[]> = {
  visitor: [
    { id: "v1", name: "Visitor56", color: "#7B9FE8", type: "visitor" },
    { id: "v2", name: "123", color: "#A8D08D", type: "visitor" },
    { id: "v3", name: "Visitor54", color: "#A8D08D", type: "visitor" },
    { id: "v4", name: "Visitor53", color: "#7DD3C0", type: "visitor" },
    { id: "v5", name: "123", color: "#A8D08D", type: "visitor" },
    { id: "v6", name: "Visitor51", color: "#D291BC", type: "visitor" },
    { id: "v7", name: "Visitor50", color: "#7DD3C0", type: "visitor" },
    { id: "v8", name: "Visitor49", color: "#7DD3C0", type: "visitor" }
  ],
  customer: [],
  agent: [{ id: "a1", name: "tuski", color: "#E8A87B", type: "agent" }]
};

const filteredItems = computed(() => {
  const items = mockData[activeTab.value] || [];
  if (!searchQuery.value) return items;
  return items.filter(item => item.name.toLowerCase().includes(searchQuery.value.toLowerCase()));
});

const isSelected = (id: string) => selectedItems.value.some(item => item.id === id);

const toggleItem = (item: ChatTarget) => {
  if (isSelected(item.id)) {
    selectedItems.value = selectedItems.value.filter(i => i.id !== item.id);
  } else {
    selectedItems.value = [...selectedItems.value, item];
  }
};

const handleConfirm = () => {
  emit("confirm", selectedItems.value);
  selectedItems.value = [];
};
</script>

<style scoped>
.start-chat-modal {
  display: flex;
  flex-direction: column;
  gap: var(--agent-space-16);
  min-height: 400px;
}

.start-chat-modal__search {
  padding: 0 var(--agent-space-4);
}

.start-chat-modal__input {
  background: var(--agent-color-bg-muted);
  border: 1px solid var(--agent-color-border-default);
  border-radius: var(--agent-radius-md);
  color: var(--agent-color-text-primary);
  font-size: 14px;
  padding: var(--agent-space-8) var(--agent-space-12);
  width: 100%;
}

.start-chat-modal__tabs {
  display: flex;
  gap: var(--agent-space-8);
  padding: 0 var(--agent-space-4);
}

.start-chat-modal__tab {
  background: var(--agent-color-bg-muted);
  border: 0;
  border-radius: var(--agent-radius-md);
  color: var(--agent-color-text-secondary);
  cursor: pointer;
  font-size: 13px;
  padding: var(--agent-space-8) var(--agent-space-16);
  transition: all var(--agent-motion-fast);
}

.start-chat-modal__tab--active {
  background: var(--agent-color-brand-soft);
  color: var(--agent-color-brand-primary);
}

.start-chat-modal__content {
  display: flex;
  flex-direction: column;
  gap: var(--agent-space-12);
  flex: 1;
  min-height: 0;
}

.start-chat-modal__selected {
  border: 1px solid var(--agent-color-border-default);
  border-radius: var(--agent-radius-md);
  padding: var(--agent-space-12);
}

.start-chat-modal__selected-label {
  color: var(--agent-color-text-primary);
  font-size: 13px;
  font-weight: var(--agent-font-weight-semibold);
}

.start-chat-modal__selected-list {
  display: flex;
  flex-wrap: wrap;
  gap: var(--agent-space-8);
  margin-top: var(--agent-space-8);
}

.start-chat-modal__selected-item {
  align-items: center;
  background: var(--agent-color-bg-panel);
  border-radius: var(--agent-radius-md);
  display: flex;
  gap: var(--agent-space-8);
  padding: var(--agent-space-4) var(--agent-space-8);
}

.start-chat-modal__list {
  display: flex;
  flex-direction: column;
  gap: var(--agent-space-4);
  overflow-y: auto;
  padding: 0 var(--agent-space-4);
}

.start-chat-modal__item {
  align-items: center;
  border-radius: var(--agent-radius-md);
  cursor: pointer;
  display: flex;
  gap: var(--agent-space-12);
  padding: var(--agent-space-8);
  transition: background-color var(--agent-motion-fast);
}

.start-chat-modal__item:hover {
  background: var(--agent-color-bg-muted);
}

.start-chat-modal__checkbox {
  cursor: pointer;
  height: 16px;
  width: 16px;
}

.start-chat-modal__avatar {
  align-items: center;
  border-radius: 50%;
  color: #ffffff;
  display: flex;
  font-size: 12px;
  font-weight: var(--agent-font-weight-semibold);
  height: 32px;
  justify-content: center;
  width: 32px;
}

.start-chat-modal__name {
  color: var(--agent-color-text-primary);
  font-size: 14px;
}
</style>
