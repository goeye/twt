<template>
  <section class="email-settings">
    <header class="email-settings__header">
      <h1 class="agent-content-title">Email</h1>
      <button
        type="button"
        class="agent-btn agent-btn--primary"
        :disabled="connectedEmails.length >= maxEmails"
        :title="connectedEmails.length >= maxEmails ? `最多支持 ${maxEmails} 个邮箱` : undefined"
        @click="showConnectModal = true"
      >
        + 添加
      </button>
    </header>

    <p class="email-settings__desc">连接 Gmail 邮箱，通过邮件渠道接收和回复客户消息。初期仅支持 Gmail，后续将支持更多邮箱服务。</p>

    <article class="settings-card agent-panel">
      <h2 class="agent-settings-feature-title">已连接邮箱</h2>

      <div v-if="connectedEmails.length === 0" class="email-settings__empty">
        <p class="email-settings__empty-text">暂未连接任何邮箱，点击上方按钮添加邮箱</p>
      </div>

      <div v-else class="email-table-wrap">
        <table class="email-table">
          <thead>
            <tr>
              <th>邮箱地址</th>
              <th>创建时间</th>
              <th>创建人</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in connectedEmails" :key="item.id">
              <td>
                <span class="email-table__addr">{{ item.email }}</span>
              </td>
              <td class="email-table__time">{{ item.createdAt }}</td>
              <td>{{ item.createdBy }}</td>
              <td>
                <button
                  type="button"
                  class="email-table__action-btn"
                  @click="confirmDelete(item)"
                >
                  删除
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <p v-if="connectedEmails.length > 0" class="email-settings__limit-hint">
        已连接 {{ connectedEmails.length }} / {{ maxEmails }} 个邮箱
      </p>
    </article>

    <!-- 添加邮箱弹窗 -->
    <BaseModal
      :open="showConnectModal"
      title="添加邮箱"
      @close="showConnectModal = false"
    >
      <div class="email-provider-list">
        <button type="button" class="email-provider-card" @click="handleConnectGmail">
          <span class="email-provider-card__icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09A6.97 6.97 0 015.48 12c0-.72.13-1.43.36-2.09V7.07H2.18A11.96 11.96 0 001 12c0 1.94.46 3.77 1.18 5.07l3.66-2.98z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
          </span>
          <span class="email-provider-card__name">Gmail</span>
          <span class="email-provider-card__desc">连接 Gmail 或 Google Workspace 邮箱</span>
        </button>
        <div class="email-provider-card email-provider-card--disabled">
          <span class="email-provider-card__icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="5" width="18" height="14" rx="2" stroke="#9ca3af" stroke-width="1.5" fill="none"/>
              <path d="M3 7l9 6 9-6" stroke="#9ca3af" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </span>
          <span class="email-provider-card__name">其他邮箱</span>
          <span class="email-provider-card__desc">敬请期待</span>
        </div>
      </div>
    </BaseModal>

    <!-- 删除确认弹窗 -->
    <BaseModal
      :open="showDeleteModal"
      title="删除邮箱"
      @close="showDeleteModal = false"
    >
      <p class="email-modal__desc">确定要删除 <strong>{{ deleteTarget?.email }}</strong> 吗？删除后将无法接收该邮箱的邮件。</p>
      <template #footer>
        <button type="button" class="agent-btn agent-btn--ghost" @click="showDeleteModal = false">取消</button>
        <button type="button" class="agent-btn agent-btn--danger" @click="handleDelete">确认删除</button>
      </template>
    </BaseModal>
  </section>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { BaseModal } from "@twt/ui-agent";

interface ConnectedEmail {
  id: string;
  email: string;
  createdAt: string;
  createdBy: string;
}

const emit = defineEmits<{
  (e: "toast", message: string): void;
}>();

const maxEmails = 99;

const connectedEmails = ref<ConnectedEmail[]>([
  { id: "1", email: "support@company.gmail.com", createdAt: "2026-03-15 10:30", createdBy: "客服主管" },
  { id: "2", email: "sales@company.gmail.com", createdAt: "2026-03-16 14:20", createdBy: "王珂" },
  { id: "3", email: "hello@team.gmail.com", createdAt: "2026-03-18 09:15", createdBy: "客服主管" },
]);

const showConnectModal = ref(false);
const showDeleteModal = ref(false);
const deleteTarget = ref<ConnectedEmail | null>(null);

let nextId = 100;
const handleConnectGmail = () => {
  showConnectModal.value = false;
  // 打开 Google OAuth 授权页面
  window.open(
    "https://accounts.google.com/o/oauth2/v2/auth?client_id=YOUR_CLIENT_ID&redirect_uri=YOUR_REDIRECT_URI&response_type=code&scope=https://mail.google.com/&access_type=offline&prompt=consent",
    "_blank"
  );
  // 模拟 OAuth 回调成功
  setTimeout(() => {
    const fakeEmail = `user${nextId++}@gmail.com`;
    connectedEmails.value.push({
      id: String(nextId),
      email: fakeEmail,
      createdAt: new Date().toLocaleString("zh-CN", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" }),
      createdBy: "客服主管",
    });
    emit("toast", "邮箱连接成功");
  }, 800);
};

const confirmDelete = (item: ConnectedEmail) => {
  deleteTarget.value = item;
  showDeleteModal.value = true;
};

const handleDelete = () => {
  if (deleteTarget.value) {
    connectedEmails.value = connectedEmails.value.filter(e => e.id !== deleteTarget.value!.id);
    emit("toast", "删除成功");
  }
  showDeleteModal.value = false;
  deleteTarget.value = null;
};
</script>

<style scoped>
.email-settings {
  display: flex;
  flex-direction: column;
  gap: var(--agent-space-16);
}

.email-settings__header {
  align-items: center;
  display: flex;
  justify-content: space-between;
}

.email-settings__desc {
  color: #75869c;
  font-size: var(--agent-font-size-sm);
  line-height: 1.5;
  margin: 0;
}

.email-settings__empty {
  align-items: center;
  display: flex;
  justify-content: center;
  min-height: 120px;
}

.email-settings__empty-text {
  color: var(--agent-color-text-tertiary);
  font-size: var(--agent-font-size-sm);
  margin: 0;
}

.email-settings__limit-hint {
  color: var(--agent-color-text-tertiary);
  font-size: var(--agent-font-size-xs);
  margin: 0;
  text-align: right;
}

.email-table-wrap {
  overflow-x: auto;
}

.email-table {
  border-collapse: collapse;
  width: 100%;
}

.email-table th,
.email-table td {
  border-bottom: 1px solid #edf1f5;
  font-size: var(--agent-font-size-sm);
  padding: 12px 8px;
  text-align: left;
  vertical-align: middle;
}

.email-table th {
  background: #eef2f5;
  color: #222222;
  font-weight: 600;
  padding-bottom: 8px;
  padding-top: 8px;
}

.email-table__addr {
  color: var(--agent-color-text-primary);
  font-weight: var(--agent-font-weight-medium);
}

.email-table__time {
  color: var(--agent-color-text-secondary);
}

.email-table__action-btn {
  background: transparent;
  border: 0;
  color: var(--agent-color-status-error);
  cursor: pointer;
  font-size: var(--agent-font-size-sm);
  padding: 0;
}

.email-table__action-btn:hover {
  text-decoration: underline;
}

.email-modal__desc {
  color: #75869c;
  font-size: var(--agent-font-size-sm);
  line-height: 1.6;
  margin: 0;
}

.email-provider-list {
  display: grid;
  gap: var(--agent-space-12);
  grid-template-columns: 1fr 1fr;
}

.email-provider-card {
  align-items: flex-start;
  background: #ffffff;
  border: 1px solid var(--agent-color-border-default);
  border-radius: var(--agent-radius-lg);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  font-family: inherit;
  gap: 8px;
  padding: var(--agent-space-20);
  text-align: left;
  transition: border-color var(--agent-motion-fast), box-shadow var(--agent-motion-fast);
}

.email-provider-card:hover:not(.email-provider-card--disabled) {
  border-color: var(--agent-color-brand-primary);
  box-shadow: 0 0 0 1px var(--agent-color-brand-primary);
}

.email-provider-card--disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.email-provider-card__icon {
  display: flex;
}

.email-provider-card__name {
  color: var(--agent-color-text-primary);
  font-size: var(--agent-font-size-base);
  font-weight: var(--agent-font-weight-semibold);
}

.email-provider-card__desc {
  color: #75869c;
  font-size: var(--agent-font-size-xs);
  line-height: 1.4;
}

.settings-card {
  border-radius: 24px;
  display: flex;
  flex-direction: column;
  gap: var(--agent-space-16);
  padding: var(--agent-space-24);
}

@media (max-width: 1280px) {
  .settings-card {
    border-radius: 16px;
    padding: var(--agent-space-16);
  }
}
</style>
