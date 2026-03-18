<template>
  <BaseModal :open="open" title="转移会话" @close="$emit('close')">
    <div class="transfer-modal">
      <div class="transfer-modal__search-wrap">
        <svg class="transfer-modal__search-icon" viewBox="0 0 16 16" fill="none">
          <circle cx="6.5" cy="6.5" r="4" stroke="currentColor" stroke-width="1.3"/>
          <path d="M9.5 9.5L13 13" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
        </svg>
        <input
          class="transfer-modal__search-input"
          :value="keyword"
          placeholder="搜索"
          @input="$emit('update:keyword', ($event.target as HTMLInputElement).value)"
        />
      </div>

      <div class="transfer-modal__section">
        <p class="transfer-modal__section-label">成员</p>
        <div class="transfer-modal__list agent-scroll">
          <div v-if="agents.length === 0" class="transfer-modal__empty">暂无可转移的成员</div>
          <div v-for="agent in agents" :key="agent.id" class="transfer-modal__row">
            <div class="transfer-modal__agent">
              <span class="transfer-modal__avatar-wrap">
                <span class="transfer-modal__avatar" :style="{ background: agent.avatarColor }">
                  {{ agent.avatarText }}
                </span>
                <span
                  class="transfer-modal__status-dot"
                  :class="agent.online ? 'transfer-modal__status-dot--online' : 'transfer-modal__status-dot--offline'"
                />
              </span>
              <span class="transfer-modal__name">{{ agent.name }}</span>
            </div>
            <button
              class="transfer-modal__action-btn"
              type="button"
              @click="$emit('confirm', agent.id)"
            >转移</button>
          </div>
        </div>
      </div>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import BaseModal from "./BaseModal.vue";

interface TransferAgent {
  id: string;
  name: string;
  online: boolean;
  avatarText: string;
  avatarColor: string;
}

defineProps<{
  open: boolean;
  keyword?: string;
  agents: TransferAgent[];
}>();

defineEmits<{
  (e: "close"): void;
  (e: "confirm", id: string): void;
  (e: "update:keyword", value: string): void;
}>();
</script>

<style scoped>
.transfer-modal {
  display: flex;
  flex-direction: column;
  gap: var(--agent-space-12);
}

.transfer-modal__search-wrap {
  align-items: center;
  background: var(--agent-color-bg-muted);
  border: 1px solid var(--agent-color-border-default);
  border-radius: var(--agent-radius-md);
  display: flex;
  gap: var(--agent-space-8);
  padding: 0 var(--agent-space-12);
}

.transfer-modal__search-icon {
  color: var(--agent-color-text-secondary);
  flex-shrink: 0;
  height: 14px;
  width: 14px;
}

.transfer-modal__search-input {
  background: transparent;
  border: 0;
  color: var(--agent-color-text-primary);
  flex: 1;
  font-size: var(--agent-font-size-sm);
  height: 36px;
  outline: none;
  width: 100%;
}

.transfer-modal__search-input::placeholder {
  color: var(--agent-color-text-secondary);
}

.transfer-modal__section-label {
  color: var(--agent-color-text-secondary);
  font-size: var(--agent-font-size-xs);
  font-weight: var(--agent-font-weight-medium);
  margin: 0 0 var(--agent-space-8);
}

.transfer-modal__list {
  display: flex;
  flex-direction: column;
  gap: 2px;
  max-height: 260px;
}

.transfer-modal__empty {
  align-items: center;
  color: var(--agent-color-text-secondary);
  display: flex;
  font-size: var(--agent-font-size-sm);
  height: 64px;
  justify-content: center;
}

.transfer-modal__row {
  align-items: center;
  border-radius: var(--agent-radius-md);
  display: flex;
  justify-content: space-between;
  padding: 8px var(--agent-space-8);
  transition: background-color var(--agent-motion-fast) ease;
}

.transfer-modal__row:hover {
  background: var(--agent-color-bg-muted);
}

.transfer-modal__agent {
  align-items: center;
  display: flex;
  gap: var(--agent-space-12);
}

.transfer-modal__avatar {
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

.transfer-modal__avatar-wrap {
  position: relative;
  display: inline-flex;
  flex-shrink: 0;
}

.transfer-modal__status-dot {
  border: 2px solid var(--agent-color-bg-surface, #fff);
  border-radius: 50%;
  bottom: 0;
  height: 10px;
  position: absolute;
  right: 0;
  width: 10px;
}

.transfer-modal__status-dot--online {
  background: #22c55e;
}

.transfer-modal__status-dot--offline {
  background: #9ca3af;
}

.transfer-modal__name {
  color: var(--agent-color-text-primary);
  font-size: var(--agent-font-size-sm);
  font-weight: var(--agent-font-weight-medium);
}

.transfer-modal__action-btn {
  background: transparent;
  border: 1px solid var(--agent-color-border-default);
  border-radius: var(--agent-radius-md);
  color: var(--agent-color-text-primary);
  cursor: pointer;
  font-size: var(--agent-font-size-xs);
  padding: 4px 12px;
  transition: background-color var(--agent-motion-fast) ease, border-color var(--agent-motion-fast) ease;
}

.transfer-modal__action-btn:hover {
  background: var(--agent-color-brand-primary);
  border-color: var(--agent-color-brand-primary);
  color: #fff;
}
</style>
