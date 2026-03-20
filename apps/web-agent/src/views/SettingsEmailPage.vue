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
        连接 Gmail 邮箱
      </button>
    </header>

    <p class="email-settings__desc">连接 Gmail 邮箱，通过邮件渠道接收和回复客户消息。初期仅支持 Gmail，后续将支持更多邮箱服务。</p>

    <article class="settings-card agent-panel">
      <h2 class="agent-settings-feature-title">已连接邮箱</h2>

      <div v-if="connectedEmails.length === 0" class="email-settings__empty">
        <p class="email-settings__empty-text">暂未连接任何邮箱，点击上方按钮添加 Gmail 邮箱</p>
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

    <!-- 连接 Gmail 弹窗 -->
    <BaseModal
      :open="showConnectModal"
      title="连接 Gmail 邮箱"
      @close="showConnectModal = false"
    >
      <p class="email-modal__desc">点击"开始授权"后将跳转到 Google 账号授权页面，授权成功后邮箱将自动添加到列表中。</p>
      <template #footer>
        <button type="button" class="agent-btn agent-btn--ghost" @click="showConnectModal = false">取消</button>
        <button type="button" class="agent-btn agent-btn--primary" @click="handleConnect">开始授权</button>
      </template>
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
const handleConnect = () => {
  showConnectModal.value = false;
  // 模拟 OAuth 流程
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
