<template>
  <header class="conversation-header agent-panel">
    <div class="conversation-header__main">
      <div v-if="isEditing" class="conversation-header__edit-row">
        <input
          v-model="draftTitle"
          class="agent-input conversation-header__title-input"
          @keydown.enter.prevent="confirmEdit"
          @keydown.esc.prevent="cancelEdit"
        />
        <button class="agent-btn agent-btn--ghost conversation-header__edit-action" type="button" @click="confirmEdit">保存</button>
        <button class="agent-btn agent-btn--ghost conversation-header__edit-action" type="button" @click="cancelEdit">取消</button>
      </div>

      <div v-else class="conversation-header__title-row">
        <h2 class="conversation-header__title">{{ title }}</h2>
        <button
          v-if="editable"
          class="conversation-header__edit-btn"
          type="button"
          aria-label="编辑会话标题"
          @click="startEdit"
        >
          <AgentIcon name="edit" :size="14" />
        </button>
      </div>

      <p v-if="subtitle" class="conversation-header__subtitle">{{ subtitle }}</p>
    </div>

    <div class="conversation-header__actions" ref="actionsRef">
      <button class="conversation-header__more-btn" type="button" aria-label="更多操作" @click="toggleDropdown">
        <span class="conversation-header__more-dots">···</span>
      </button>
      <div v-if="dropdownVisible" class="conversation-header__dropdown">
        <button
          class="conversation-header__dropdown-item"
          :class="{ 'conversation-header__dropdown-item--disabled': !canCollaborate }"
          type="button"
          @click="handleInvite"
        >添加客服</button>
        <button
          class="conversation-header__dropdown-item"
          :class="{ 'conversation-header__dropdown-item--disabled': !canCollaborate }"
          type="button"
          @click="handleTransfer"
        >转移会话</button>
        <button class="conversation-header__dropdown-item conversation-header__dropdown-item--danger" type="button" @click="handleClose">结束会话</button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from "vue";
import AgentIcon from "../icon/AgentIcon.vue";

const props = withDefaults(
  defineProps<{
    title: string;
    subtitle?: string;
    editable?: boolean;
    canCollaborate?: boolean;
  }>(),
  {
    editable: false,
    canCollaborate: true
  }
);

const emit = defineEmits<{
  (e: "transfer"): void;
  (e: "invite"): void;
  (e: "close"): void;
  (e: "update:title", value: string): void;
}>();

const isEditing = ref(false);
const draftTitle = ref(props.title);
const dropdownVisible = ref(false);
const actionsRef = ref<HTMLElement | null>(null);

watch(
  () => props.title,
  (value) => {
    if (!isEditing.value) {
      draftTitle.value = value;
    }
  }
);

const startEdit = () => {
  draftTitle.value = props.title;
  isEditing.value = true;
};

const cancelEdit = () => {
  draftTitle.value = props.title;
  isEditing.value = false;
};

const confirmEdit = () => {
  const nextTitle = draftTitle.value.trim();
  if (!nextTitle) {
    cancelEdit();
    return;
  }
  emit("update:title", nextTitle);
  isEditing.value = false;
};

const toggleDropdown = () => {
  dropdownVisible.value = !dropdownVisible.value;
};

const closeDropdown = () => {
  dropdownVisible.value = false;
};

const handleInvite = () => {
  if (!props.canCollaborate) return;
  closeDropdown();
  emit("invite");
};

const handleTransfer = () => {
  if (!props.canCollaborate) return;
  closeDropdown();
  emit("transfer");
};

const handleClose = () => {
  closeDropdown();
  emit("close");
};

const onClickOutside = (event: MouseEvent) => {
  if (actionsRef.value && !actionsRef.value.contains(event.target as Node)) {
    closeDropdown();
  }
};

onMounted(() => {
  document.addEventListener("click", onClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", onClickOutside);
});
</script>

<style scoped>
.conversation-header {
  align-items: center;
  display: flex;
  justify-content: space-between;
  min-height: 54px;
  padding: var(--agent-space-12);
}

.conversation-header__main {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.conversation-header__title-row {
  align-items: center;
  display: flex;
  gap: var(--agent-space-8);
}

.conversation-header__title {
  color: #222222;
  font-size: 14px;
  font-weight: var(--agent-font-weight-semibold);
  line-height: 1.4;
  margin: 0;
}

.conversation-header__subtitle {
  color: var(--agent-color-text-secondary);
  font-size: var(--agent-font-size-xs);
  margin: 0;
}

.conversation-header__edit-btn {
  align-items: center;
  background: transparent;
  border: 0;
  border-radius: var(--agent-radius-sm);
  color: var(--agent-color-text-secondary);
  cursor: pointer;
  display: inline-flex;
  height: 24px;
  justify-content: center;
  width: 24px;
}

.conversation-header__edit-btn:hover {
  background: var(--agent-color-bg-muted);
}

.conversation-header__edit-row {
  align-items: center;
  display: flex;
  gap: var(--agent-space-8);
}

.conversation-header__title-input {
  max-width: 360px;
  min-width: 220px;
}

.conversation-header__edit-action {
  height: 32px;
  padding: 0 10px;
}

.conversation-header__actions {
  position: relative;
}

.conversation-header__more-btn {
  align-items: center;
  background: transparent;
  border: 1px solid var(--agent-color-border-default);
  border-radius: var(--agent-radius-md);
  color: var(--agent-color-text-secondary);
  cursor: pointer;
  display: inline-flex;
  height: 32px;
  justify-content: center;
  width: 32px;
}

.conversation-header__more-btn:hover {
  background: var(--agent-color-bg-muted);
}

.conversation-header__more-dots {
  font-size: 16px;
  font-weight: var(--agent-font-weight-semibold);
  letter-spacing: 1px;
  line-height: 1;
}

.conversation-header__dropdown {
  background: var(--agent-color-bg-panel);
  border: 1px solid var(--agent-color-border-default);
  border-radius: var(--agent-radius-md);
  box-shadow: var(--agent-shadow-md);
  display: flex;
  flex-direction: column;
  min-width: 120px;
  padding: 4px;
  position: absolute;
  right: 0;
  top: calc(100% + 6px);
  z-index: var(--agent-z-dropdown);
}

.conversation-header__dropdown-item {
  background: transparent;
  border: 0;
  border-radius: var(--agent-radius-sm);
  color: var(--agent-color-text-primary);
  cursor: pointer;
  font-size: var(--agent-font-size-sm);
  padding: 8px 12px;
  text-align: left;
  transition: background-color var(--agent-motion-fast) ease;
  width: 100%;
}

.conversation-header__dropdown-item:hover {
  background: var(--agent-color-bg-muted);
}

.conversation-header__dropdown-item--danger {
  color: var(--agent-color-status-error);
}

.conversation-header__dropdown-item--danger:hover {
  background: rgba(245, 63, 63, 0.06);
}

.conversation-header__dropdown-item--disabled {
  color: var(--agent-color-text-secondary);
  cursor: not-allowed;
  opacity: 0.5;
}

.conversation-header__dropdown-item--disabled:hover {
  background: transparent;
}
</style>
