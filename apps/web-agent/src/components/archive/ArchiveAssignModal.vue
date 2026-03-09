<template>
  <teleport to="body">
    <div v-if="open" class="assign-mask" @click.self="$emit('close')">
      <section class="assign-card" role="dialog" aria-modal="true" @click.stop>
        <header class="assign-card__header">
          <h3 class="assign-card__title">分配会话</h3>
          <button class="assign-card__close" type="button" aria-label="关闭" @click="$emit('close')">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
            </svg>
          </button>
        </header>

        <div class="assign-card__search">
          <input
            class="assign-card__search-input"
            :value="keyword"
            placeholder="搜索"
            @input="$emit('update:keyword', ($event.target as HTMLInputElement).value)"
          />
        </div>

        <div class="assign-card__list agent-scroll">
          <div v-if="sortedAgents.length === 0" class="assign-card__empty">
            <svg class="assign-card__empty-icon" viewBox="0 0 64 48" fill="none">
              <rect x="6" y="8" width="52" height="32" rx="4" fill="#e8eaed" />
              <rect x="12" y="14" width="20" height="3" rx="1.5" fill="#c4c9d1" />
              <rect x="12" y="21" width="32" height="3" rx="1.5" fill="#c4c9d1" />
              <rect x="12" y="28" width="26" height="3" rx="1.5" fill="#c4c9d1" />
              <rect x="40" y="2" width="18" height="18" rx="9" fill="#d5d8dd" />
              <path d="M46 8v6M49 11h-6" stroke="#fff" stroke-width="1.5" stroke-linecap="round" />
            </svg>
            <span class="assign-card__empty-text">暂无数据</span>
          </div>

          <button
            v-for="agent in sortedAgents"
            :key="agent.id"
            type="button"
            class="assign-card__agent-row"
            @click="handleSelect(agent.id)"
          >
            <span class="assign-card__avatar-wrap">
              <span class="assign-card__avatar" :style="{ background: agent.avatarColor }">
                {{ agent.avatarText }}
              </span>
              <span
                class="assign-card__status-dot"
                :class="agent.online ? 'assign-card__status-dot--online' : 'assign-card__status-dot--offline'"
              />
            </span>
            <span class="assign-card__agent-name">{{ agent.name }}</span>
            <span
              class="assign-card__online-tag"
              :class="agent.online ? 'assign-card__online-tag--on' : 'assign-card__online-tag--off'"
            >
              {{ agent.online ? '在线' : '离线' }}
            </span>
          </button>
        </div>
      </section>
    </div>
  </teleport>
</template>

<script setup lang="ts">
import { computed } from "vue";

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

const sortedAgents = computed(() => {
  return [...props.agents].sort((a, b) => {
    if (a.online === b.online) return 0;
    return a.online ? -1 : 1;
  });
});

const handleSelect = (id: string) => {
  emit("confirm", id);
};
</script>

<style scoped>
.assign-mask {
  align-items: center;
  background: rgba(15, 23, 42, 0.35);
  display: flex;
  inset: 0;
  justify-content: center;
  padding: 24px;
  position: fixed;
  z-index: var(--agent-z-modal);
}

.assign-card {
  background: #ffffff;
  border-radius: 18px;
  box-shadow: 0 8px 32px rgba(15, 23, 42, 0.12);
  display: flex;
  flex-direction: column;
  max-height: 520px;
  max-width: 420px;
  width: 100%;
}

.assign-card__header {
  align-items: center;
  display: flex;
  justify-content: space-between;
  padding: 20px 22px 0;
}

.assign-card__title {
  color: #1a1a1a;
  font-size: 17px;
  font-weight: 700;
  margin: 0;
}

.assign-card__close {
  align-items: center;
  background: transparent;
  border: 0;
  border-radius: 50%;
  color: #555;
  cursor: pointer;
  display: inline-flex;
  height: 30px;
  justify-content: center;
  width: 30px;
}

.assign-card__close:hover {
  background: #f0f1f3;
  color: #222;
}

.assign-card__search {
  padding: 16px 22px 8px;
}

.assign-card__search-input {
  background: #ffffff;
  border: 1px solid #dde1e8;
  border-radius: 10px;
  color: #1a1a1a;
  font-size: 14px;
  height: 40px;
  outline: none;
  padding: 0 14px;
  width: 100%;
}

.assign-card__search-input::placeholder {
  color: #b0b6c2;
}

.assign-card__search-input:focus {
  border-color: #a0b4e0;
}

.assign-card__list {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 2px;
  min-height: 0;
  overflow-y: auto;
  padding: 8px 14px 18px;
}

.assign-card__empty {
  align-items: center;
  display: flex;
  flex-direction: column;
  gap: 10px;
  justify-content: center;
  padding: 36px 0;
}

.assign-card__empty-icon {
  height: 48px;
  width: 64px;
}

.assign-card__empty-text {
  color: #8792a7;
  font-size: 14px;
}

.assign-card__agent-row {
  align-items: center;
  background: transparent;
  border: 0;
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  gap: 12px;
  padding: 10px 10px;
  text-align: left;
  width: 100%;
}

.assign-card__agent-row:hover {
  background: #f3f5f8;
}

.assign-card__avatar-wrap {
  display: inline-flex;
  flex-shrink: 0;
  position: relative;
}

.assign-card__avatar {
  align-items: center;
  border-radius: 50%;
  color: #ffffff;
  display: inline-flex;
  font-size: 13px;
  font-weight: 600;
  height: 36px;
  justify-content: center;
  width: 36px;
}

.assign-card__status-dot {
  border: 2px solid #ffffff;
  border-radius: 50%;
  bottom: -1px;
  height: 10px;
  position: absolute;
  right: -1px;
  width: 10px;
}

.assign-card__status-dot--online {
  background: #22c55e;
}

.assign-card__status-dot--offline {
  background: #9ca3af;
}

.assign-card__agent-name {
  color: #1a1a1a;
  flex: 1;
  font-size: 14px;
  font-weight: 500;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.assign-card__online-tag {
  border-radius: 8px;
  flex-shrink: 0;
  font-size: 12px;
  font-weight: 500;
  padding: 2px 8px;
}

.assign-card__online-tag--on {
  background: #ecfdf5;
  color: #16a34a;
}

.assign-card__online-tag--off {
  background: #f3f4f6;
  color: #9ca3af;
}

@media (max-width: 480px) {
  .assign-card {
    border-radius: 14px;
    max-height: 80vh;
  }
}
</style>
