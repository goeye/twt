<template>
  <section class="email-view">
    <article class="email-panel agent-panel">
      <header class="email-panel__header">
        <h1 class="email-panel__title">Email</h1>
        <button
          type="button"
          class="agent-btn agent-btn--primary email-panel__add-btn"
          :disabled="connectedEmails.length >= maxEmails"
          :title="connectedEmails.length >= maxEmails ? `最多支持 ${maxEmails} 个邮箱` : undefined"
          @click="showConnectModal = true"
        >
          <span class="email-panel__add-icon">+</span>
          <span>添加</span>
        </button>
      </header>

      <p class="email-panel__desc">统一收发邮箱服务商的邮件，所有邮件都会以会话形式呈现，便于统一管理</p>

      <div v-if="connectedEmails.length === 0" class="email-panel__empty">
        <div class="email-panel__empty-content">
          <p class="email-panel__empty-title">还未添加任何邮箱</p>
          <p class="email-panel__empty-desc">添加邮箱统一收发邮件</p>
        </div>
      </div>

      <template v-else>
        <div class="email-panel__table-area">
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
                <td>
                  <div class="email-table__creator">
                    <span class="email-table__creator-avatar" :style="{ background: item.avatarColor }">{{ item.avatarText }}</span>
                    <span>{{ item.createdBy }}</span>
                  </div>
                </td>
                <td>
                  <button type="button" class="email-table__delete-btn" @click="confirmDelete(item)">删除</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>
    </article>

    <!-- 添加邮箱弹窗 -->
    <Teleport to="body">
      <div v-if="showConnectModal" class="email-modal-overlay" @click.self="showConnectModal = false">
        <div class="email-modal email-modal--connect">
          <header class="email-modal__header">
            <h3 class="email-modal__title">添加邮箱</h3>
            <button type="button" class="email-modal__close" @click="showConnectModal = false">&times;</button>
          </header>
          <div class="email-provider-list">
            <button type="button" class="email-provider-card" @click="handleConnectGmail">
              <span class="email-provider-card__icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09A6.97 6.97 0 015.48 12c0-.72.13-1.43.36-2.09V7.07H2.18A11.96 11.96 0 001 12c0 1.94.46 3.77 1.18 5.07l3.66-2.98z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
              </span>
              <span class="email-provider-card__name">Gmail</span>
              <span class="email-provider-card__desc">连接Gamil</span>
            </button>
            <div class="email-provider-card email-provider-card--disabled">
              <span class="email-provider-card__icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="5" width="18" height="14" rx="2" stroke="#9ca3af" stroke-width="1.5" fill="none"/>
                  <path d="M3 7l9 6 9-6" stroke="#9ca3af" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </span>
              <span class="email-provider-card__name">其他邮箱</span>
              <span class="email-provider-card__desc">敬请期待</span>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- 删除确认弹窗 -->
    <Teleport to="body">
      <div v-if="showDeleteModal" class="email-modal-overlay" @click.self="showDeleteModal = false">
        <div class="email-modal">
          <h3 class="email-modal__title">删除邮箱</h3>
          <p class="email-modal__desc">删除后将无法接收该邮箱的邮件</p>
          <div class="email-modal__actions">
            <button type="button" class="agent-btn agent-btn--ghost" @click="showDeleteModal = false">取消</button>
            <button type="button" class="agent-btn agent-btn--danger" @click="handleDelete">删除</button>
          </div>
        </div>
      </div>
    </Teleport>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";

interface ConnectedEmail {
  id: string;
  email: string;
  createdAt: string;
  createdBy: string;
  avatarText: string;
  avatarColor: string;
}

const emit = defineEmits<{
  (e: "toast", message: string): void;
}>();

const maxEmails = 99;

const connectedEmails = ref<ConnectedEmail[]>([
  { id: "1", email: "support@company.gmail.com", createdAt: "2026-03-15 10:30", createdBy: "客服主管", avatarText: "主", avatarColor: "linear-gradient(135deg, #2f6bff 0%, #69a1ff 100%)" },
  { id: "2", email: "sales@company.gmail.com", createdAt: "2026-03-16 14:20", createdBy: "王珂", avatarText: "王", avatarColor: "linear-gradient(135deg, #7f6bff 0%, #a259ff 100%)" },
  { id: "3", email: "hello@team.gmail.com", createdAt: "2026-03-18 09:15", createdBy: "客服主管", avatarText: "主", avatarColor: "linear-gradient(135deg, #2f6bff 0%, #69a1ff 100%)" },
]);

const showConnectModal = ref(false);
const showDeleteModal = ref(false);
const deleteTarget = ref<ConnectedEmail | null>(null);

let nextId = 100;

const syncToLocalStorage = () => {
  localStorage.setItem("email_channels", JSON.stringify(connectedEmails.value));
};

// OAuth 回跳处理：检查 URL 中的 oauth_success 参数
onMounted(() => {
  const stored = localStorage.getItem("email_channels");
  if (stored) {
    try {
      connectedEmails.value = JSON.parse(stored);
    } catch (e) {
      // 忽略解析错误
    }
  } else {
    // 首次加载，同步默认数据到 localStorage
    syncToLocalStorage();
  }

  const url = new URL(window.location.href);
  if (url.searchParams.get("oauth_success") === "1") {
    const oauthEmail = url.searchParams.get("email") || `user${nextId++}@gmail.com`;
    connectedEmails.value.push({
      id: String(nextId++),
      email: oauthEmail,
      createdAt: new Date().toLocaleString("zh-CN", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" }),
      createdBy: "客服主管",
      avatarText: "主",
      avatarColor: "linear-gradient(135deg, #2f6bff 0%, #69a1ff 100%)",
    });
    syncToLocalStorage();
    emit("toast", "邮箱连接成功");
    // 清除 URL 参数
    url.searchParams.delete("oauth_success");
    url.searchParams.delete("email");
    window.history.replaceState({}, "", url.toString());
  }
});

const handleConnectGmail = () => {
  showConnectModal.value = false;
  // 在当前页面打开 Gmail OAuth 授权，授权成功后回跳到邮件设置页面
  const redirectUri = encodeURIComponent(window.location.origin + window.location.pathname + "#/settings/email?oauth_success=1");
  window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?client_id=YOUR_CLIENT_ID&redirect_uri=${redirectUri}&response_type=code&scope=https://mail.google.com/&access_type=offline&prompt=consent`;
};

const confirmDelete = (item: ConnectedEmail) => {
  deleteTarget.value = item;
  showDeleteModal.value = true;
};

const handleDelete = () => {
  if (deleteTarget.value) {
    connectedEmails.value = connectedEmails.value.filter(e => e.id !== deleteTarget.value!.id);
    syncToLocalStorage();
    emit("toast", "删除成功");
  }
  showDeleteModal.value = false;
  deleteTarget.value = null;
};
</script>

<style scoped>
/* Panel — same pattern as roles-panel */
.email-view {
  height: 100%;
  min-height: 0;
  padding: 12px;
}

.email-panel {
  background: #ffffff;
  border-color: #dbe1ea;
  border-radius: 18px;
  display: flex;
  flex-direction: column;
  gap: 0;
  height: 100%;
  min-height: 0;
  overflow: hidden;
}

.email-panel__header {
  align-items: center;
  display: flex;
  gap: 16px;
  justify-content: space-between;
  padding: 18px 18px 12px;
}

.email-panel__title {
  color: #252525;
  font-size: 20px;
  font-weight: 600;
  line-height: 28px;
  margin: 0;
}

.email-panel__add-btn {
  border-radius: 10px;
  font-size: 14px;
  font-weight: 500;
  gap: 4px;
  min-width: 80px;
  padding: 7px 12px 7px 10px;
}

.email-panel__add-icon {
  display: inline-block;
  font-size: 15px;
  font-weight: 600;
  line-height: 1;
  transform: translateY(-0.5px);
}

.email-panel__desc {
  color: #75869c;
  font-size: 13px;
  line-height: 1.5;
  margin: 0;
  padding: 0 18px 12px;
}

.email-panel__empty {
  align-items: center;
  display: flex;
  flex: 1;
  justify-content: center;
  min-height: 200px;
}

.email-panel__empty-content {
  text-align: center;
}

.email-panel__empty-title {
  color: var(--agent-color-text-primary);
  font-size: 15px;
  font-weight: 500;
  margin: 0 0 6px;
}

.email-panel__empty-desc {
  color: var(--agent-color-text-tertiary);
  font-size: 13px;
  margin: 0;
}

/* Table — same pattern as roles-table */
.email-panel__table-area {
  flex: 1;
  min-height: 0;
  overflow: auto;
  padding: 0 18px;
}

.email-table {
  border-collapse: collapse;
  color: #252525;
  table-layout: fixed;
  width: 100%;
}

.email-table th,
.email-table td {
  border-bottom: 1px solid #edf1f5;
  font-size: 13px;
  line-height: 19px;
  padding: 14px 10px;
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

.email-table th:nth-child(1) { width: 35%; }
.email-table th:nth-child(2) { width: 25%; }
.email-table th:nth-child(3) { width: 22%; }
.email-table th:nth-child(4) { width: 18%; }

.email-table__addr {
  color: #222222;
  font-size: 13px;
  font-weight: 500;
}

.email-table__time {
  color: var(--agent-color-text-secondary);
}

.email-table__creator {
  align-items: center;
  display: inline-flex;
  gap: 8px;
}

.email-table__creator-avatar {
  align-items: center;
  border-radius: 50%;
  color: #ffffff;
  display: inline-flex;
  flex-shrink: 0;
  font-size: 11px;
  font-weight: 600;
  height: 28px;
  justify-content: center;
  width: 28px;
}

.email-table__delete-btn {
  background: transparent;
  border: 0;
  color: #ef4444;
  cursor: pointer;
  font-size: 13px;
  padding: 0;
}

.email-table__delete-btn:hover {
  text-decoration: underline;
}

/* Modal overlay — same pattern as roles-modal */
.email-modal-overlay {
  align-items: center;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  inset: 0;
  justify-content: center;
  position: fixed;
  z-index: 1000;
}

.email-modal {
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  max-width: 420px;
  padding: 24px;
  width: 90%;
}

.email-modal--connect {
  max-width: 520px;
  padding: 0;
}

.email-modal__header {
  align-items: center;
  display: flex;
  justify-content: space-between;
  padding: 20px 24px 0;
}

.email-modal__close {
  background: transparent;
  border: 0;
  color: #9ca3af;
  cursor: pointer;
  font-size: 22px;
  height: 32px;
  line-height: 1;
  width: 32px;
}

.email-modal__close:hover {
  color: #6b7280;
}

.email-modal__title {
  color: #252525;
  font-size: 16px;
  font-weight: 600;
  margin: 0;
}

.email-modal__desc {
  color: #75869c;
  font-size: 14px;
  line-height: 1.5;
  margin: 12px 0 20px;
}

.email-modal__actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

/* Provider cards */
.email-provider-list {
  display: grid;
  gap: 16px;
  grid-template-columns: 1fr 1fr;
  padding: 24px;
}

.email-provider-card {
  align-items: flex-start;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  font-family: inherit;
  gap: 10px;
  padding: 20px;
  text-align: left;
  transition: border-color 0.15s, box-shadow 0.15s;
}

.email-provider-card:hover:not(.email-provider-card--disabled) {
  border-color: var(--agent-color-brand-primary);
  box-shadow: 0 0 0 1px var(--agent-color-brand-primary);
}

.email-provider-card--disabled {
  cursor: not-allowed;
  opacity: 0.55;
}

.email-provider-card__icon {
  display: flex;
}

.email-provider-card__name {
  color: #252525;
  font-size: 15px;
  font-weight: 600;
}

.email-provider-card__desc {
  color: #75869c;
  font-size: 12px;
  line-height: 1.4;
}

.agent-btn--danger {
  background: #ef4444;
  border-color: #ef4444;
  border-radius: 10px;
  color: #ffffff;
}

.agent-btn--danger:hover {
  background: #dc2626;
  border-color: #dc2626;
}
</style>
