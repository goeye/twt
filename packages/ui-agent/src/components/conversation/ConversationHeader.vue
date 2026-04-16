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

    <div class="conversation-header__actions">
      <!-- 会话模式 -->
      <template v-if="mode === 'conversation'">
        <div
          v-if="showCollaborateActions"
          class="conversation-header__icon-btn-wrap"
        >
          <button
            class="conversation-header__icon-btn"
            :class="{ 'conversation-header__icon-btn--disabled': !canCollaborate || closed }"
            type="button"
            :aria-label="channelType === 'email' ? '添加客服' : '添加成员'"
            @click="handleInvite"
          >
            <AgentIcon name="user-plus" :size="16" />
          </button>
          <span class="conversation-header__tooltip">{{ channelType === 'email' ? '添加客服' : '添加成员' }}</span>
        </div>

        <div
          v-if="showCollaborateActions"
          class="conversation-header__icon-btn-wrap"
        >
          <button
            class="conversation-header__icon-btn"
            :class="{ 'conversation-header__icon-btn--disabled': !canCollaborate || closed }"
            type="button"
            aria-label="转移会话"
            @click="handleTransfer"
          >
            <AgentIcon name="transfer" :size="16" />
          </button>
          <span class="conversation-header__tooltip">转移会话</span>
        </div>

        <div v-if="showPendingAction" class="conversation-header__icon-btn-wrap">
          <button
            class="conversation-header__icon-btn"
            :class="{ 'conversation-header__icon-btn--disabled': closed }"
            type="button"
            :aria-label="isProcessing ? '取消待处理' : '标记为待处理'"
            @click="handleMarkPending"
          >
            <AgentIcon :name="isProcessing ? 'remove-pending' : 'mark-pending'" :size="16" />
          </button>
          <span class="conversation-header__tooltip">{{ isProcessing ? '取消待处理' : '标记为待处理' }}</span>
        </div>

        <div v-if="showCloseAction && channelType !== 'email'" class="conversation-header__icon-btn-wrap">
          <button
            class="conversation-header__icon-btn conversation-header__icon-btn--danger"
            :class="{ 'conversation-header__icon-btn--disabled': closed }"
            type="button"
            aria-label="结束会话"
            @click="handleClose"
          >
            <AgentIcon name="close-session" :size="16" />
          </button>
          <span class="conversation-header__tooltip">结束会话</span>
        </div>

        <div v-if="showCloseAction && channelType === 'email'" class="conversation-header__icon-btn-wrap">
          <button
            class="conversation-header__icon-btn conversation-header__icon-btn--danger"
            :class="{ 'conversation-header__icon-btn--disabled': closed }"
            type="button"
            aria-label="结束会话"
            @click="handleCloseEmail"
          >
            <AgentIcon name="close-session" :size="16" />
          </button>
          <span class="conversation-header__tooltip">结束会话</span>
        </div>
      </template>

      <!-- 单聊模式 -->
      <template v-else-if="mode === 'single-chat'">
        <div class="conversation-header__icon-btn-wrap">
          <button
            class="conversation-header__icon-btn"
            type="button"
            aria-label="发起群聊"
            @click="$emit('start-group-chat')"
          >
            <AgentIcon name="group-chat" :size="16" />
          </button>
          <span class="conversation-header__tooltip">发起群聊</span>
        </div>

        <div class="conversation-header__icon-btn-wrap">
          <button
            class="conversation-header__icon-btn conversation-header__icon-btn--danger"
            type="button"
            aria-label="删除聊天"
            @click="$emit('delete-chat')"
          >
            <AgentIcon name="delete" :size="16" />
          </button>
          <span class="conversation-header__tooltip">删除聊天</span>
        </div>
      </template>

      <!-- 群聊模式 -->
      <template v-else-if="mode === 'group-chat'">
        <div class="conversation-header__icon-btn-wrap">
          <button
            class="conversation-header__icon-btn"
            type="button"
            aria-label="添加成员"
            @click="$emit('add-member')"
          >
            <AgentIcon name="add-member" :size="16" />
          </button>
          <span class="conversation-header__tooltip">添加成员</span>
        </div>

        <div class="conversation-header__icon-btn-wrap">
          <button
            class="conversation-header__icon-btn conversation-header__icon-btn--danger"
            type="button"
            aria-label="删除聊天"
            @click="$emit('delete-chat')"
          >
            <AgentIcon name="delete" :size="16" />
          </button>
          <span class="conversation-header__tooltip">删除聊天</span>
        </div>
      </template>

      <div v-if="showDetailToggle" class="conversation-header__icon-btn-wrap">
        <button
          class="conversation-header__icon-btn"
          :class="{ 'conversation-header__icon-btn--active': detailOpen }"
          type="button"
          :aria-label="detailOpen ? '隐藏详情' : '展示详情'"
          @click="handleToggleDetail"
        >
          <span class="conversation-header__panel-icon" aria-hidden="true"></span>
        </button>
        <span class="conversation-header__tooltip">{{ detailOpen ? "隐藏详情" : "展示详情" }}</span>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import AgentIcon from "../icon/AgentIcon.vue";
import type { ChannelType } from "../../types";

const props = withDefaults(
  defineProps<{
    title: string;
    subtitle?: string;
    editable?: boolean;
    canCollaborate?: boolean;
    showCollaborateActions?: boolean;
    showPendingAction?: boolean;
    showCloseAction?: boolean;
    isProcessing?: boolean;
    closed?: boolean;
    mode?: "conversation" | "single-chat" | "group-chat";
    channelType?: ChannelType;
    showDetailToggle?: boolean;
    detailOpen?: boolean;
  }>(),
  {
    editable: false,
    canCollaborate: true,
    showCollaborateActions: true,
    showPendingAction: true,
    showCloseAction: true,
    isProcessing: false,
    closed: false,
    mode: "conversation",
    showDetailToggle: false,
    detailOpen: true
  }
);

const emit = defineEmits<{
  (e: "transfer"): void;
  (e: "invite"): void;
  (e: "close"): void;
  (e: "mark-pending"): void;
  (e: "remove-pending"): void;
  (e: "close-email"): void;
  (e: "update:title", value: string): void;
  (e: "start-group-chat"): void;
  (e: "add-member"): void;
  (e: "delete-chat"): void;
  (e: "toggle-detail"): void;
}>();

const isEditing = ref(false);
const draftTitle = ref(props.title);

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

const handleInvite = () => {
  if (!props.canCollaborate || props.closed) return;
  emit("invite");
};

const handleTransfer = () => {
  if (!props.canCollaborate || props.closed) return;
  emit("transfer");
};

const handleMarkPending = () => {
  if (props.closed) return;
  if (props.isProcessing) {
    emit("remove-pending");
  } else {
    emit("mark-pending");
  }
};

const handleClose = () => {
  if (props.closed) return;
  emit("close");
};

const handleCloseEmail = () => {
  if (props.closed) return;
  emit("close-email");
};

const handleToggleDetail = () => {
  emit("toggle-detail");
};
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
  display: flex;
  gap: var(--agent-space-4);
  align-items: center;
}

.conversation-header__icon-btn-wrap {
  position: relative;
}

.conversation-header__icon-btn {
  align-items: center;
  background: transparent;
  border: 1px solid var(--agent-color-border-default);
  border-radius: var(--agent-radius-md);
  color: var(--agent-color-text-secondary);
  cursor: pointer;
  display: inline-flex;
  height: 32px;
  justify-content: center;
  transition: background-color var(--agent-motion-fast) ease, color var(--agent-motion-fast) ease;
  width: 32px;
}

.conversation-header__icon-btn:hover {
  background: var(--agent-color-bg-muted);
  color: var(--agent-color-text-primary);
}

.conversation-header__icon-btn--active {
  background: var(--agent-color-brand-soft);
  color: var(--agent-color-brand-primary);
}

.conversation-header__icon-btn--active:hover {
  background: var(--agent-color-brand-soft);
  color: var(--agent-color-brand-primary);
}

.conversation-header__icon-btn--danger:hover {
  background: rgba(245, 63, 63, 0.06);
  color: var(--agent-color-status-error);
}

.conversation-header__icon-btn--success:hover {
  background: rgba(0, 181, 120, 0.08);
  color: var(--agent-color-status-success);
}

.conversation-header__icon-btn--disabled {
  color: var(--agent-color-text-secondary);
  cursor: not-allowed;
  opacity: 0.5;
}

.conversation-header__icon-btn--disabled:hover {
  background: transparent;
  color: var(--agent-color-text-secondary);
}

.conversation-header__tooltip {
  background: rgba(0, 0, 0, 0.75);
  border-radius: var(--agent-radius-sm);
  color: #fff;
  font-size: 12px;
  left: 50%;
  line-height: 1;
  opacity: 0;
  padding: 6px 8px;
  pointer-events: none;
  position: absolute;
  top: calc(100% + 6px);
  transform: translateX(-50%);
  transition: opacity var(--agent-motion-fast) ease;
  white-space: nowrap;
  z-index: var(--agent-z-dropdown);
}

.conversation-header__panel-icon {
  border: 1.4px solid currentColor;
  border-radius: 2px;
  box-sizing: border-box;
  display: inline-flex;
  height: 14px;
  position: relative;
  width: 14px;
}

.conversation-header__panel-icon::after {
  background: currentColor;
  border-radius: 1px;
  content: "";
  height: 8px;
  position: absolute;
  right: 2px;
  top: 2px;
  width: 2px;
}

.conversation-header__icon-btn-wrap:hover .conversation-header__tooltip {
  opacity: 1;
}
</style>
