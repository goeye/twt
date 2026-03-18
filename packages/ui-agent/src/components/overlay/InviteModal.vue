<template>
  <BaseModal :open="open" title="添加成员" @close="handleClose">
    <div class="invite-modal">
      <div class="invite-modal__left-pane">
        <div class="invite-modal__search-wrap">
          <svg class="invite-modal__search-icon" viewBox="0 0 16 16" fill="none">
            <circle cx="6.5" cy="6.5" r="4" stroke="currentColor" stroke-width="1.3" />
            <path d="M9.5 9.5L13 13" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" />
          </svg>
          <input
            class="invite-modal__search-input"
            :value="keyword"
            placeholder="搜索"
            @input="$emit('update:keyword', ($event.target as HTMLInputElement).value)"
          />
        </div>

        <div class="invite-modal__list agent-scroll">
          <div v-if="agents.length === 0" class="invite-modal__empty">暂无可邀请的成员</div>
          <label
            v-for="agent in agents"
            :key="agent.id"
            class="invite-modal__row"
            :class="{ 'invite-modal__row--checked': selectedIds.includes(agent.id) }"
          >
            <input
              class="invite-modal__checkbox"
              type="checkbox"
              :value="agent.id"
              :checked="selectedIds.includes(agent.id)"
              @change="toggleAgent(agent.id)"
            />
            <div class="invite-modal__agent">
              <span class="invite-modal__avatar-wrap">
                <span class="invite-modal__avatar" :style="{ background: agent.avatarColor }">
                  {{ agent.avatarText }}
                </span>
                <span
                  class="invite-modal__status-dot"
                  :class="agent.online ? 'invite-modal__status-dot--online' : 'invite-modal__status-dot--offline'"
                />
              </span>
              <span class="invite-modal__name">{{ agent.name }}</span>
            </div>
          </label>
        </div>
      </div>

      <aside class="invite-modal__right-pane">
        <p class="invite-modal__selected-title">已选择（{{ selectedIds.length }}）</p>
        <div class="invite-modal__selected-list agent-scroll">
          <div v-for="agent in selectedAgents" :key="agent.id" class="invite-modal__selected-item">
            <span class="invite-modal__avatar" :style="{ background: agent.avatarColor }">
              {{ agent.avatarText }}
            </span>
            <span class="invite-modal__selected-name">{{ agent.name }}</span>
          </div>
        </div>
      </aside>
    </div>

    <template #footer>
      <span />
      <div class="invite-modal__footer-actions">
        <button class="agent-btn agent-btn--ghost" type="button" @click="handleClose">取消</button>
        <button
          class="agent-btn agent-btn--primary"
          type="button"
          :disabled="selectedIds.length === 0"
          @click="handleConfirm"
        >
          确认邀请{{ selectedIds.length > 0 ? `（${selectedIds.length}）` : '' }}
        </button>
      </div>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import BaseModal from "./BaseModal.vue";

interface InviteAgent {
  id: string;
  name: string;
  online: boolean;
  avatarText: string;
  avatarColor: string;
}

const props = defineProps<{
  open: boolean;
  keyword?: string;
  agents: InviteAgent[];
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "confirm", ids: string[]): void;
  (e: "update:keyword", value: string): void;
}>();

const selectedIds = ref<string[]>([]);
const selectedSnapshots = ref<Record<string, InviteAgent>>({});

const selectedAgents = computed(() => {
  const byId = new Map(props.agents.map((agent) => [agent.id, agent]));
  return selectedIds.value
    .map((id) => byId.get(id) ?? selectedSnapshots.value[id])
    .filter((agent): agent is InviteAgent => !!agent);
});

watch(
  () => props.open,
  (val) => {
    if (val) {
      selectedIds.value = [];
      selectedSnapshots.value = {};
    }
  }
);

const toggleAgent = (id: string) => {
  if (selectedIds.value.includes(id)) {
    selectedIds.value = selectedIds.value.filter((x) => x !== id);
    const { [id]: _, ...rest } = selectedSnapshots.value;
    selectedSnapshots.value = rest;
  } else {
    selectedIds.value = [...selectedIds.value, id];
    const matched = props.agents.find((agent) => agent.id === id);
    if (matched) {
      selectedSnapshots.value = {
        ...selectedSnapshots.value,
        [id]: matched
      };
    }
  }
};

const handleConfirm = () => {
  emit("confirm", [...selectedIds.value]);
};

const handleClose = () => {
  selectedIds.value = [];
  selectedSnapshots.value = {};
  emit("close");
};
</script>

<style scoped>
:deep(.modal-card) {
  max-width: 1160px;
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

.invite-modal {
  display: grid;
  gap: var(--agent-space-24);
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  min-height: 510px;
}

.invite-modal__left-pane {
  border-right: 1px solid var(--agent-color-border-default);
  display: flex;
  flex-direction: column;
  gap: var(--agent-space-16);
  min-width: 0;
  padding-right: var(--agent-space-24);
}

.invite-modal__right-pane {
  display: flex;
  flex-direction: column;
  gap: var(--agent-space-12);
  min-width: 0;
}

.invite-modal__search-wrap {
  align-items: center;
  background: #ffffff;
  border: 1px solid var(--agent-color-border-default);
  border-radius: 14px;
  display: flex;
  gap: var(--agent-space-8);
  padding: 0 var(--agent-space-12);
}

.invite-modal__search-icon {
  color: var(--agent-color-text-secondary);
  flex-shrink: 0;
  height: 14px;
  width: 14px;
}

.invite-modal__search-input {
  background: transparent;
  border: 0;
  color: var(--agent-color-text-primary);
  flex: 1;
  font-size: var(--agent-font-size-sm);
  height: 44px;
  outline: none;
  width: 100%;
}

.invite-modal__search-input::placeholder {
  color: var(--agent-color-text-secondary);
}

.invite-modal__list {
  display: flex;
  flex-direction: column;
  gap: var(--agent-space-8);
  max-height: 430px;
  padding-right: var(--agent-space-8);
}

.invite-modal__empty {
  align-items: center;
  color: var(--agent-color-text-secondary);
  display: flex;
  font-size: var(--agent-font-size-sm);
  height: 64px;
  justify-content: center;
}

.invite-modal__row {
  align-items: center;
  border: 1px solid #e7ebf3;
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  gap: var(--agent-space-12);
  min-height: 58px;
  padding: 10px var(--agent-space-12);
  transition: background-color var(--agent-motion-fast) ease, border-color var(--agent-motion-fast) ease;
}

.invite-modal__row:hover {
  background: #f7f9fc;
}

.invite-modal__row--checked {
  background: #f2f4f7;
  border-color: #dbe3ef;
}

.invite-modal__checkbox {
  accent-color: var(--agent-color-brand-primary);
  cursor: pointer;
  flex-shrink: 0;
  height: 16px;
  width: 16px;
}

.invite-modal__agent {
  align-items: center;
  display: flex;
  gap: var(--agent-space-12);
}

.invite-modal__avatar {
  align-items: center;
  border-radius: 50%;
  color: #fff;
  display: inline-flex;
  flex-shrink: 0;
  font-size: 13px;
  font-weight: var(--agent-font-weight-semibold);
  height: 36px;
  justify-content: center;
  width: 36px;
}

.invite-modal__avatar-wrap {
  position: relative;
  display: inline-flex;
  flex-shrink: 0;
}

.invite-modal__status-dot {
  border: 2px solid var(--agent-color-bg-surface, #fff);
  border-radius: 50%;
  bottom: 0;
  height: 10px;
  position: absolute;
  right: 0;
  width: 10px;
}

.invite-modal__status-dot--online {
  background: #22c55e;
}

.invite-modal__status-dot--offline {
  background: #9ca3af;
}

.invite-modal__footer-actions {
  display: flex;
  gap: var(--agent-space-12);
  margin-left: auto;
}

.invite-modal__name {
  color: var(--agent-color-text-primary);
  font-size: var(--agent-font-size-sm);
  font-weight: var(--agent-font-weight-medium);
}

.invite-modal__selected-title {
  color: var(--agent-color-text-primary);
  font-size: 14px;
  font-weight: var(--agent-font-weight-semibold);
  line-height: 1.35;
  margin: 0;
  white-space: nowrap;
}

.invite-modal__selected-list {
  display: flex;
  flex-wrap: wrap;
  gap: var(--agent-space-8);
  max-height: 430px;
}

.invite-modal__selected-item {
  align-items: center;
  background: var(--agent-color-bg-muted);
  border: 1px solid var(--agent-color-border-default);
  border-radius: 12px;
  display: inline-flex;
  gap: var(--agent-space-8);
  min-height: 46px;
  padding: 6px var(--agent-space-12);
}

.invite-modal__selected-name {
  color: var(--agent-color-text-primary);
  font-size: var(--agent-font-size-sm);
  font-weight: var(--agent-font-weight-medium);
  white-space: nowrap;
}

@media (max-width: 1100px) {
  :deep(.modal-card) {
    max-width: 760px;
  }

  .invite-modal {
    grid-template-columns: 1fr;
    min-height: auto;
  }

  .invite-modal__left-pane {
    border-bottom: 1px solid var(--agent-color-border-default);
    border-right: 0;
    padding-bottom: var(--agent-space-16);
    padding-right: 0;
  }

  .invite-modal__selected-title {
    font-size: var(--agent-font-size-lg);
  }

  .invite-modal__list,
  .invite-modal__selected-list {
    max-height: 240px;
  }
}
</style>
