<template>
  <div class="cw-session-list">
    <!-- Header -->
    <header class="cw-header">
      <div class="cw-header__left">
        <img :src="BRAND_LOGO" class="cw-header__logo" alt="Logo" />
        <span class="cw-header__brand">{{ BRAND_NAME }}</span>
      </div>
      <button type="button" class="cw-header__close" aria-label="最小化" @click="$router.push('/minimized')">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" /></svg>
      </button>
    </header>

    <!-- Session List -->
    <div class="cw-sessions">
      <div
        v-for="session in sessions"
        :key="session.id"
        class="cw-session"
        @click="openChat(session.id)"
      >
        <button
          type="button"
          class="cw-session__delete"
          aria-label="删除会话"
          @click.stop="openDeleteModal(session.id)"
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none"><path d="M18 6 6 18M6 6l12 12" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" /></svg>
        </button>
        <template v-if="showAgentInfoToVisitor && session.agentName">
          <img :src="session.agentAvatar" class="cw-session__avatar-img" alt="" />
        </template>
        <template v-else-if="showAgentInfoToVisitor && !session.agentName">
          <img :src="BRAND_LOGO" class="cw-session__avatar-img" alt="" />
        </template>
        <div v-else class="cw-session__avatar" :style="{ background: session.avatarColor }">{{ session.avatarLabel }}</div>
        <div class="cw-session__body">
          <div class="cw-session__top">
            <span class="cw-session__name">{{ showAgentInfoToVisitor ? (session.agentName ? `与${session.agentName}的会话` : BRAND_NAME) : session.name }}</span>
            <span class="cw-session__time">{{ session.time }}</span>
          </div>
          <div class="cw-session__bottom">
            <span class="cw-session__msg">{{ session.message }}</span>
            <span v-if="session.unread > 0" class="cw-session__badge">{{ session.unread }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- New Session Button -->
    <div class="cw-new-session" @click="$router.push('/form')">新的会话</div>

    <!-- Footer -->
    <div class="cw-footer">Powered by <strong>Chat</strong></div>

    <!-- Delete Modal -->
    <div v-if="deleteModalOpen" class="cw-modal-mask" @click="closeDeleteModal">
      <div class="cw-modal" @click.stop>
        <div class="cw-modal__head">
          <h4 class="cw-modal__title">删除会话</h4>
          <button type="button" class="cw-modal__close" @click="closeDeleteModal">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M18 6 6 18M6 6l12 12" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" /></svg>
          </button>
        </div>
        <label class="cw-modal__option">
          <input v-model="endSessionChecked" type="checkbox" class="cw-modal__checkbox" />
          <span>同时结束会话</span>
        </label>
        <div class="cw-modal__actions">
          <button type="button" class="cw-modal__btn cw-modal__btn--ghost" @click="closeDeleteModal">取消</button>
          <button type="button" class="cw-modal__btn cw-modal__btn--danger" @click="confirmDelete">确认</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

const BRAND_LOGO = "data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20width%3D%2764%27%20height%3D%2764%27%20viewBox%3D%270%200%2064%2064%27%3E%3Crect%20width%3D%2764%27%20height%3D%2764%27%20fill%3D%27%232563EB%27%2F%3E%3Cpath%20d%3D%27M24%2018h14c6%200%2010%204%2010%2010v8c0%206-4%2010-10%2010h-6l-8%206v-6h-2c-6%200-10-4-10-10V28c0-6%204-10%2010-10z%27%20fill%3D%27none%27%20stroke%3D%27white%27%20stroke-width%3D%274%27%20stroke-linecap%3D%27round%27%20stroke-linejoin%3D%27round%27%2F%3E%3Cpath%20d%3D%27M24%2028h0.01M32%2028h0.01M40%2028h0.01%27%20stroke%3D%27white%27%20stroke-width%3D%274%27%20stroke-linecap%3D%27round%27%2F%3E%3Cpath%20d%3D%27M16%2017l2.5%202.5L22%2016%27%20stroke%3D%27white%27%20stroke-width%3D%273%27%20stroke-linecap%3D%27round%27%20stroke-linejoin%3D%27round%27%2F%3E%3C%2Fsvg%3E";
const BRAND_NAME = "项目名称";
const DEFAULT_AGENT_AVATAR = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='184' height='184' viewBox='0 0 184 184'%3E%3Ccircle cx='92' cy='92' r='90' fill='%23C9CED8' stroke='%23F5F7FA' stroke-width='4'/%3E%3Ccircle cx='92' cy='68' r='30' fill='%23EEF1F5'/%3E%3Cpath d='M28 156c10-28 34-46 64-46s54 18 64 46' fill='%23EEF1F5'/%3E%3C/svg%3E";

/** 模拟设置：是否展示客服信息 */
const showAgentInfoToVisitor = ref(true);

const router = useRouter();

const sessions = ref([
  {
    id: "s-1",
    name: "Lily",
    message: "Can you help me check the order status?",
    time: "09:46",
    unread: 0,
    avatarLabel: "L",
    avatarColor: "#7C3AED",
    agentName: "客服小李",
    agentAvatar: DEFAULT_AGENT_AVATAR
  }
]);

const deleteModalOpen = ref(false);
const deleteTargetId = ref<string | null>(null);
const endSessionChecked = ref(false);

const openChat = (id: string) => {
  router.push(`/chat/${id}`);
};

const openDeleteModal = (id: string) => {
  deleteTargetId.value = id;
  endSessionChecked.value = false;
  deleteModalOpen.value = true;
};

const closeDeleteModal = () => {
  deleteModalOpen.value = false;
  deleteTargetId.value = null;
};

const confirmDelete = () => {
  if (deleteTargetId.value) {
    sessions.value = sessions.value.filter(s => s.id !== deleteTargetId.value);
  }
  closeDeleteModal();
};
</script>

<style scoped>
.cw-session-list {
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;
}

/* Header */
.cw-header {
  align-items: center;
  background: #fff;
  border-bottom: 1px solid var(--agent-color-border-default);
  display: flex;
  flex-shrink: 0;
  justify-content: space-between;
  padding: 14px 16px;
}

.cw-header__left {
  align-items: center;
  display: flex;
  gap: 10px;
  min-width: 0;
}

.cw-header__logo {
  border-radius: 50%;
  flex-shrink: 0;
  height: 34px;
  object-fit: cover;
  width: 34px;
}

.cw-header__brand {
  color: var(--agent-color-text-primary);
  font-size: 13px;
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.cw-header__close {
  align-items: center;
  background: none;
  border: none;
  border-radius: 50%;
  color: var(--agent-color-text-secondary);
  cursor: pointer;
  display: flex;
  flex-shrink: 0;
  height: 28px;
  justify-content: center;
  transition: background 0.15s, color 0.15s;
  width: 28px;
}

.cw-header__close:hover {
  background: var(--agent-color-bg-hover, rgba(0, 0, 0, 0.06));
  color: var(--agent-color-text-primary);
}

/* Sessions */
.cw-sessions {
  display: flex;
  flex: 1;
  flex-direction: column;
  overflow-y: auto;
  padding: 8px 0;
}

.cw-session {
  align-items: center;
  cursor: pointer;
  display: flex;
  gap: 12px;
  padding: 12px 26px;
  position: relative;
  transition: background 0.15s;
}

.cw-session:hover {
  background: #f8f9fb;
}

.cw-session__delete {
  align-items: center;
  background: transparent;
  border: none;
  color: #98a2b3;
  cursor: pointer;
  display: inline-flex;
  height: 20px;
  justify-content: center;
  left: 4px;
  opacity: 0;
  padding: 0;
  pointer-events: none;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  transition: opacity 0.15s, color 0.15s;
  width: 20px;
}

.cw-session:hover .cw-session__delete {
  opacity: 1;
  pointer-events: auto;
}

.cw-session__delete:hover {
  color: #f04438;
}

.cw-session__avatar {
  align-items: center;
  border-radius: 50%;
  color: #fff;
  display: flex;
  flex-shrink: 0;
  font-size: 16px;
  font-weight: 700;
  height: 42px;
  justify-content: center;
  width: 42px;
}

.cw-session__avatar-img {
  border-radius: 50%;
  flex-shrink: 0;
  height: 42px;
  object-fit: cover;
  width: 42px;
}

.cw-session__body {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.cw-session__top {
  align-items: center;
  display: flex;
  justify-content: space-between;
}

.cw-session__name {
  color: var(--agent-color-text-primary);
  font-size: 14px;
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.cw-session__time {
  color: var(--agent-color-text-tertiary);
  flex-shrink: 0;
  font-size: 12px;
}

.cw-session__bottom {
  align-items: center;
  display: flex;
  justify-content: space-between;
}

.cw-session__msg {
  color: var(--agent-color-text-tertiary);
  font-size: 13px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.cw-session__badge {
  align-items: center;
  background: #f04438;
  border-radius: 999px;
  color: #fff;
  display: inline-flex;
  flex-shrink: 0;
  font-size: 11px;
  font-weight: 600;
  height: 20px;
  justify-content: center;
  min-width: 20px;
  padding: 0 5px;
}

/* New Session */
.cw-new-session {
  background: var(--agent-color-brand-primary);
  border-radius: 999px;
  color: #fff;
  cursor: pointer;
  flex-shrink: 0;
  font-size: 14px;
  font-weight: 600;
  margin: 10px 16px 14px;
  padding: 14px;
  text-align: center;
  transition: opacity 0.15s;
}

.cw-new-session:hover {
  opacity: 0.92;
}

/* Footer */
.cw-footer {
  background: #fff;
  color: var(--agent-color-text-tertiary);
  flex-shrink: 0;
  font-size: 10px;
  padding: 6px;
  text-align: center;
}

/* Delete Modal */
.cw-modal-mask {
  align-items: center;
  background: rgba(15, 23, 42, 0.24);
  display: flex;
  inset: 0;
  justify-content: center;
  padding: 20px;
  position: absolute;
  z-index: 10;
}

.cw-modal {
  align-items: center;
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.2);
  display: flex;
  flex-direction: column;
  gap: 14px;
  max-width: 272px;
  padding: 18px;
  width: 100%;
}

.cw-modal__head {
  align-items: center;
  display: flex;
  justify-content: center;
  position: relative;
  width: 100%;
}

.cw-modal__title {
  color: var(--agent-color-text-primary);
  font-size: 16px;
  font-weight: 600;
  margin: 0;
}

.cw-modal__close {
  align-items: center;
  background: transparent;
  border: 0;
  border-radius: 999px;
  color: #98a2b3;
  cursor: pointer;
  display: inline-flex;
  height: 24px;
  justify-content: center;
  padding: 0;
  position: absolute;
  right: 0;
  width: 24px;
}

.cw-modal__option {
  align-items: center;
  color: var(--agent-color-text-primary);
  display: inline-flex;
  font-size: 14px;
  gap: 8px;
}

.cw-modal__checkbox {
  accent-color: var(--agent-color-brand-primary);
  height: 16px;
  width: 16px;
}

.cw-modal__actions {
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  width: 100%;
}

.cw-modal__btn {
  border: 1px solid transparent;
  border-radius: 10px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  padding: 10px 0;
}

.cw-modal__btn--ghost {
  background: #f2f4f7;
  color: var(--agent-color-text-secondary);
}

.cw-modal__btn--danger {
  background: #f04438;
  color: #fff;
}
</style>
