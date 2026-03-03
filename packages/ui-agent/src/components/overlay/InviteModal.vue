<template>
  <BaseModal :open="open" title="邀请客服" @close="handleClose">
    <div class="invite-modal">
      <div class="invite-modal__search-wrap">
        <svg class="invite-modal__search-icon" viewBox="0 0 16 16" fill="none">
          <circle cx="6.5" cy="6.5" r="4" stroke="currentColor" stroke-width="1.3"/>
          <path d="M9.5 9.5L13 13" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
        </svg>
        <input
          class="invite-modal__search-input"
          :value="keyword"
          placeholder="搜索"
          @input="$emit('update:keyword', ($event.target as HTMLInputElement).value)"
        />
      </div>

      <div class="invite-modal__section">
        <p class="invite-modal__section-label">客服</p>
        <div class="invite-modal__list agent-scroll">
          <div v-if="agents.length === 0" class="invite-modal__empty">暂无可邀请的客服</div>
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
import { ref, watch } from "vue";
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

watch(
  () => props.open,
  (val) => {
    if (val) selectedIds.value = [];
  }
);

const toggleAgent = (id: string) => {
  if (selectedIds.value.includes(id)) {
    selectedIds.value = selectedIds.value.filter((x) => x !== id);
  } else {
    selectedIds.value = [...selectedIds.value, id];
  }
};

const handleConfirm = () => {
  emit("confirm", [...selectedIds.value]);
};

const handleClose = () => {
  selectedIds.value = [];
  emit("close");
};
</script>

<style scoped>
.invite-modal {
  display: flex;
  flex-direction: column;
  gap: var(--agent-space-12);
}

.invite-modal__search-wrap {
  align-items: center;
  background: var(--agent-color-bg-muted);
  border: 1px solid var(--agent-color-border-default);
  border-radius: var(--agent-radius-md);
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
  height: 36px;
  outline: none;
  width: 100%;
}

.invite-modal__search-input::placeholder {
  color: var(--agent-color-text-secondary);
}

.invite-modal__section-label {
  color: var(--agent-color-text-secondary);
  font-size: var(--agent-font-size-xs);
  font-weight: var(--agent-font-weight-medium);
  margin: 0 0 var(--agent-space-8);
}

.invite-modal__list {
  display: flex;
  flex-direction: column;
  gap: 2px;
  max-height: 260px;
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
  border: 1px solid transparent;
  border-radius: var(--agent-radius-md);
  cursor: pointer;
  display: flex;
  gap: var(--agent-space-12);
  padding: 8px var(--agent-space-8);
  transition: background-color var(--agent-motion-fast) ease;
}

.invite-modal__row:hover {
  background: var(--agent-color-bg-muted);
}

.invite-modal__row--checked {
  background: rgba(47, 107, 255, 0.05);
  border-color: rgba(47, 107, 255, 0.2);
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
  gap: var(--agent-space-8);
}

.invite-modal__name {
  color: var(--agent-color-text-primary);
  font-size: var(--agent-font-size-sm);
  font-weight: var(--agent-font-weight-medium);
}
</style>
