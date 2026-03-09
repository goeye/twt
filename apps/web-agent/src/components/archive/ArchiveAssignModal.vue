<template>
  <BaseModal :open="open" title="分配会话" @close="handleClose">
    <div class="assign-modal">
      <div class="assign-modal__left-pane">
        <div class="assign-modal__search-wrap">
          <svg class="assign-modal__search-icon" viewBox="0 0 16 16" fill="none">
            <circle cx="6.5" cy="6.5" r="4" stroke="currentColor" stroke-width="1.3" />
            <path d="M9.5 9.5L13 13" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" />
          </svg>
          <input
            class="assign-modal__search-input"
            :value="keyword"
            placeholder="搜索客服"
            @input="$emit('update:keyword', ($event.target as HTMLInputElement).value)"
          />
        </div>

        <div class="assign-modal__list agent-scroll">
          <div v-if="agents.length === 0" class="assign-modal__empty">暂无可分配的客服</div>
          <label
            v-for="agent in agents"
            :key="agent.id"
            class="assign-modal__row"
            :class="{ 'assign-modal__row--checked': selectedId === agent.id }"
          >
            <input
              class="assign-modal__radio"
              type="radio"
              name="assign-agent"
              :value="agent.id"
              :checked="selectedId === agent.id"
              @change="selectAgent(agent.id)"
            />
            <div class="assign-modal__agent">
              <span class="assign-modal__avatar-wrap">
                <span class="assign-modal__avatar" :style="{ background: agent.avatarColor }">
                  {{ agent.avatarText }}
                </span>
                <span
                  class="assign-modal__status-dot"
                  :class="agent.online ? 'assign-modal__status-dot--online' : 'assign-modal__status-dot--offline'"
                />
              </span>
              <span class="assign-modal__name">{{ agent.name }}</span>
            </div>
          </label>
        </div>
      </div>

      <aside class="assign-modal__right-pane">
        <p class="assign-modal__selected-title">会话</p>
        <div class="assign-modal__conversation-card">
          <p class="assign-modal__conversation-label">当前选择</p>
          <p class="assign-modal__conversation-name">{{ conversationTitle || '未选择会话' }}</p>
        </div>

        <p class="assign-modal__selected-title">已选择（{{ selectedAgent ? 1 : 0 }}）</p>
        <div class="assign-modal__selected-list agent-scroll">
          <div v-if="selectedAgent" class="assign-modal__selected-item">
            <span class="assign-modal__avatar" :style="{ background: selectedAgent.avatarColor }">
              {{ selectedAgent.avatarText }}
            </span>
            <span class="assign-modal__selected-name">{{ selectedAgent.name }}</span>
          </div>
          <div v-else class="assign-modal__selected-empty">请选择一个客服进行分配</div>
        </div>
      </aside>
    </div>

    <template #footer>
      <span />
      <div class="assign-modal__footer-actions">
        <button class="agent-btn agent-btn--ghost" type="button" @click="handleClose">取消</button>
        <button class="agent-btn agent-btn--primary" type="button" :disabled="!selectedId" @click="handleConfirm">
          确认分配
        </button>
      </div>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { BaseModal } from "@twt/ui-agent";

interface AssignAgent {
  id: string;
  name: string;
  online: boolean;
  avatarText: string;
  avatarColor: string;
}

const props = defineProps<{
  open: boolean;
  keyword?: string;
  conversationTitle?: string;
  agents: AssignAgent[];
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "confirm", id: string): void;
  (e: "update:keyword", value: string): void;
}>();

const selectedId = ref<string | null>(null);
const selectedSnapshot = ref<AssignAgent | null>(null);

const selectedAgent = computed(() => {
  if (!selectedId.value) {
    return null;
  }

  return props.agents.find((agent) => agent.id === selectedId.value) ?? selectedSnapshot.value;
});

watch(
  () => props.open,
  (value) => {
    if (value) {
      selectedId.value = null;
      selectedSnapshot.value = null;
    }
  }
);

const selectAgent = (id: string) => {
  selectedId.value = id;
  selectedSnapshot.value = props.agents.find((agent) => agent.id === id) ?? null;
};

const handleConfirm = () => {
  if (!selectedId.value) {
    return;
  }

  emit("confirm", selectedId.value);
};

const handleClose = () => {
  selectedId.value = null;
  selectedSnapshot.value = null;
  emit("close");
};
</script>

<style scoped>
:deep(.modal-card) {
  max-width: 1080px;
}

:deep(.modal-card__header) {
  padding: var(--agent-space-20) var(--agent-space-20) var(--agent-space-12);
}

:deep(.modal-card__body) {
  padding: 0 var(--agent-space-20) var(--agent-space-16);
}

:deep(.modal-card__footer) {
  padding: 0 var(--agent-space-20) var(--agent-space-20);
}

.assign-modal {
  display: grid;
  gap: var(--agent-space-24);
  grid-template-columns: minmax(0, 1fr) minmax(320px, 360px);
  min-height: 460px;
}

.assign-modal__left-pane {
  border-right: 1px solid var(--agent-color-border-default);
  display: flex;
  flex-direction: column;
  gap: var(--agent-space-16);
  min-width: 0;
  padding-right: var(--agent-space-24);
}

.assign-modal__right-pane {
  display: flex;
  flex-direction: column;
  gap: var(--agent-space-12);
  min-width: 0;
}

.assign-modal__search-wrap {
  align-items: center;
  background: #ffffff;
  border: 1px solid var(--agent-color-border-default);
  border-radius: 14px;
  display: flex;
  gap: var(--agent-space-8);
  padding: 0 var(--agent-space-12);
}

.assign-modal__search-icon {
  color: var(--agent-color-text-secondary);
  flex-shrink: 0;
  height: 14px;
  width: 14px;
}

.assign-modal__search-input {
  background: transparent;
  border: 0;
  color: var(--agent-color-text-primary);
  flex: 1;
  font-size: var(--agent-font-size-sm);
  height: 40px;
  outline: none;
}

.assign-modal__list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-height: 0;
}

.assign-modal__empty,
.assign-modal__selected-empty {
  align-items: center;
  color: var(--agent-color-text-secondary);
  display: flex;
  font-size: var(--agent-font-size-sm);
  justify-content: center;
  min-height: 96px;
}

.assign-modal__row {
  align-items: center;
  border: 1px solid transparent;
  border-radius: 16px;
  cursor: pointer;
  display: flex;
  gap: var(--agent-space-12);
  padding: 12px 14px;
  transition: border-color var(--agent-motion-fast) ease, background-color var(--agent-motion-fast) ease;
}

.assign-modal__row:hover {
  background: var(--agent-color-bg-muted);
}

.assign-modal__row--checked {
  background: #eef4ff;
  border-color: rgba(47, 107, 255, 0.22);
}

.assign-modal__radio {
  accent-color: var(--agent-color-brand-primary);
  margin: 0;
}

.assign-modal__agent {
  align-items: center;
  display: flex;
  gap: var(--agent-space-12);
}

.assign-modal__avatar-wrap {
  display: inline-flex;
  position: relative;
}

.assign-modal__avatar {
  align-items: center;
  border-radius: 50%;
  color: #ffffff;
  display: inline-flex;
  flex-shrink: 0;
  font-size: 13px;
  font-weight: var(--agent-font-weight-semibold);
  height: 38px;
  justify-content: center;
  width: 38px;
}

.assign-modal__status-dot {
  border: 2px solid #ffffff;
  border-radius: 50%;
  bottom: 0;
  height: 10px;
  position: absolute;
  right: 0;
  width: 10px;
}

.assign-modal__status-dot--online {
  background: #22c55e;
}

.assign-modal__status-dot--offline {
  background: #9ca3af;
}

.assign-modal__name,
.assign-modal__selected-name,
.assign-modal__conversation-name {
  color: var(--agent-color-text-primary);
  font-size: var(--agent-font-size-sm);
  font-weight: var(--agent-font-weight-medium);
}

.assign-modal__selected-title,
.assign-modal__conversation-label {
  color: var(--agent-color-text-secondary);
  font-size: var(--agent-font-size-xs);
  font-weight: var(--agent-font-weight-medium);
  margin: 0;
}

.assign-modal__conversation-card,
.assign-modal__selected-list {
  background: #f8fafc;
  border: 1px solid var(--agent-color-border-default);
  border-radius: 18px;
  padding: 14px;
}

.assign-modal__conversation-card {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.assign-modal__conversation-name {
  margin: 0;
}

.assign-modal__selected-list {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 10px;
  min-height: 0;
}

.assign-modal__selected-item {
  align-items: center;
  background: #ffffff;
  border-radius: 14px;
  display: flex;
  gap: 12px;
  padding: 12px;
}

.assign-modal__footer-actions {
  display: flex;
  gap: 8px;
}

@media (max-width: 900px) {
  .assign-modal {
    grid-template-columns: 1fr;
  }

  .assign-modal__left-pane {
    border-right: 0;
    border-bottom: 1px solid var(--agent-color-border-default);
    padding-bottom: var(--agent-space-16);
    padding-right: 0;
  }
}
</style>
