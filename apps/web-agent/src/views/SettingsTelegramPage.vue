<template>
  <section class="telegram-view">
    <article class="telegram-panel agent-panel">
      <header class="telegram-panel__header">
        <h1 class="telegram-panel__title">Telegram Bot</h1>
        <button
          type="button"
          class="agent-btn agent-btn--primary telegram-panel__add-btn"
          :disabled="connectedBots.length >= maxBots"
          :title="connectedBots.length >= maxBots ? `最多支持 ${maxBots} 个 Bot` : undefined"
          @click="showAddModal = true"
        >
          <span class="telegram-panel__add-icon">+</span>
          <span>添加 Bot</span>
        </button>
      </header>

      <p class="telegram-panel__desc">通过 Telegram Bot 接收和回复用户消息，所有对话都会以会话形式呈现</p>

      <div v-if="connectedBots.length === 0" class="telegram-panel__empty">
        <div class="telegram-panel__empty-content">
          <p class="telegram-panel__empty-title">还未添加任何 Bot</p>
          <p class="telegram-panel__empty-desc">添加 Telegram Bot 开始接收消息</p>
        </div>
      </div>

      <template v-else>
        <div class="telegram-panel__table-area">
          <table class="telegram-table">
            <thead>
              <tr>
                <th>Bot 名称</th>
                <th>Bot Username</th>
                <th>状态</th>
                <th>创建人</th>
                <th>创建时间</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in connectedBots" :key="item.id">
                <td>
                  <span class="telegram-table__name">{{ item.name }}</span>
                </td>
                <td>
                  <span class="telegram-table__username">@{{ item.username }}</span>
                </td>
                <td>
                  <span v-if="item.status === 'error'" class="telegram-table__status telegram-table__status--error">异常</span>
                  <span v-else class="telegram-table__status telegram-table__status--active">正常</span>
                </td>
                <td>
                  <div class="telegram-table__creator">
                    <span class="telegram-table__creator-avatar" :style="{ background: item.avatarColor }">{{ item.avatarText }}</span>
                    <span>{{ item.createdBy }}</span>
                  </div>
                </td>
                <td class="telegram-table__time">{{ item.createdAt }}</td>
                <td>
                  <div class="telegram-table__actions-wrap">
                    <button type="button" class="telegram-table__more-btn" @click.stop="toggleMenu(item.id)">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="3" r="1.2" fill="#6b7280"/><circle cx="8" cy="8" r="1.2" fill="#6b7280"/><circle cx="8" cy="13" r="1.2" fill="#6b7280"/></svg>
                    </button>
                    <div v-if="openMenuId === item.id" class="telegram-table__dropdown">
                      <button type="button" class="telegram-table__dropdown-item" @click="handleEdit(item); openMenuId = null">编辑</button>
                      <button type="button" class="telegram-table__dropdown-item telegram-table__dropdown-item--danger" @click="confirmDelete(item); openMenuId = null">删除</button>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>
    </article>

    <!-- 添加/编辑 Bot 弹窗 -->
    <Teleport to="body">
      <div v-if="showAddModal" class="telegram-modal-overlay" @click.self="showAddModal = false">
        <div class="telegram-modal telegram-modal--add">
          <header class="telegram-modal__header">
            <h3 class="telegram-modal__title">{{ editingBot ? '编辑 Bot' : '添加 Telegram Bot' }}</h3>
            <button type="button" class="telegram-modal__close" @click="showAddModal = false">&times;</button>
          </header>
          <div class="telegram-modal__body">
            <div class="telegram-form-group">
              <label class="telegram-form-label">Bot Token <span class="telegram-form-required">*</span></label>
              <input
                v-model="botForm.token"
                type="text"
                class="telegram-form-input"
                placeholder="1234567890:ABCdefGHIjklMNOpqrsTUVwxyz"
                :disabled="!!editingBot"
              />
              <p class="telegram-form-hint">从 @BotFather 获取 Bot Token</p>
            </div>
            <div class="telegram-form-group">
              <label class="telegram-form-label">Bot 名称</label>
              <input
                v-model="botForm.name"
                type="text"
                class="telegram-form-input"
                placeholder="客服助手"
              />
            </div>
            <div class="telegram-form-group">
              <label class="telegram-form-label">欢迎消息</label>
              <textarea
                v-model="botForm.welcomeMessage"
                class="telegram-form-textarea"
                placeholder="您好！我是客服助手，有什么可以帮助您的吗？"
                rows="3"
              />
            </div>
          </div>
          <div class="telegram-modal__footer">
            <button type="button" class="agent-btn agent-btn--ghost" @click="showAddModal = false">取消</button>
            <button type="button" class="agent-btn agent-btn--primary" @click="handleSaveBot">保存</button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- 删除确认弹窗 -->
    <Teleport to="body">
      <div v-if="showDeleteModal" class="telegram-modal-overlay" @click.self="showDeleteModal = false">
        <div class="telegram-modal">
          <h3 class="telegram-modal__title">删除 Bot</h3>
          <p class="telegram-modal__desc">删除后将无法接收该 Bot 的消息</p>
          <div class="telegram-modal__actions">
            <button type="button" class="agent-btn agent-btn--ghost" @click="showDeleteModal = false">取消</button>
            <button type="button" class="agent-btn agent-btn--danger" @click="handleDelete">删除</button>
          </div>
        </div>
      </div>
    </Teleport>
  </section>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";

interface TelegramBot {
  id: string;
  name: string;
  username: string;
  token: string;
  welcomeMessage: string;
  createdAt: string;
  createdBy: string;
  avatarText: string;
  avatarColor: string;
  status?: 'active' | 'error';
}

const emit = defineEmits<{
  (e: "toast", message: string): void;
}>();

const maxBots = 10;

const connectedBots = ref<TelegramBot[]>([
  {
    id: "1",
    name: "客服助手",
    username: "twt_support_bot",
    token: "1234567890:ABCdefGHIjklMNOpqrsTUVwxyz",
    welcomeMessage: "您好！我是客服助手，有什么可以帮助您的吗？",
    createdAt: "2026-04-01 10:30",
    createdBy: "客服主管",
    avatarText: "主",
    avatarColor: "linear-gradient(135deg, #2f6bff 0%, #69a1ff 100%)",
    status: "active"
  },
  {
    id: "2",
    name: "销售机器人",
    username: "twt_sales_bot",
    token: "9876543210:ZYXwvuTSRqponMLKjihgfedcba",
    welcomeMessage: "欢迎咨询产品信息！",
    createdAt: "2026-04-02 14:20",
    createdBy: "王珂",
    avatarText: "王",
    avatarColor: "linear-gradient(135deg, #7f6bff 0%, #a259ff 100%)",
    status: "active"
  }
]);

const showAddModal = ref(false);
const showDeleteModal = ref(false);
const openMenuId = ref<string | null>(null);
const editingBot = ref<TelegramBot | null>(null);
const deletingBot = ref<TelegramBot | null>(null);

const botForm = ref({
  token: "",
  name: "",
  welcomeMessage: ""
});

const toggleMenu = (id: string) => {
  openMenuId.value = openMenuId.value === id ? null : id;
};

const handleEdit = (bot: TelegramBot) => {
  editingBot.value = bot;
  botForm.value = {
    token: bot.token,
    name: bot.name,
    welcomeMessage: bot.welcomeMessage
  };
  showAddModal.value = true;
};

const handleSaveBot = () => {
  if (!botForm.value.token.trim()) {
    emit("toast", "请输入 Bot Token");
    return;
  }

  if (editingBot.value) {
    // 编辑模式
    const index = connectedBots.value.findIndex(b => b.id === editingBot.value!.id);
    if (index !== -1) {
      connectedBots.value[index] = {
        ...connectedBots.value[index],
        name: botForm.value.name || connectedBots.value[index].name,
        welcomeMessage: botForm.value.welcomeMessage
      };
    }
    emit("toast", "Bot 更新成功");
  } else {
    // 新增模式
    const newBot: TelegramBot = {
      id: Date.now().toString(),
      name: botForm.value.name || "Telegram Bot",
      username: "new_bot",
      token: botForm.value.token,
      welcomeMessage: botForm.value.welcomeMessage || "您好！有什么可以帮助您的吗？",
      createdAt: new Date().toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }).replace(/\//g, '-'),
      createdBy: "当前用户",
      avatarText: "当",
      avatarColor: "linear-gradient(135deg, #00b578 0%, #00a66f 100%)",
      status: "active"
    };
    connectedBots.value.push(newBot);
    emit("toast", "Bot 添加成功");
  }

  showAddModal.value = false;
  editingBot.value = null;
  botForm.value = { token: "", name: "", welcomeMessage: "" };
};

const confirmDelete = (bot: TelegramBot) => {
  deletingBot.value = bot;
  showDeleteModal.value = true;
};

const handleDelete = () => {
  if (deletingBot.value) {
    connectedBots.value = connectedBots.value.filter(b => b.id !== deletingBot.value!.id);
    emit("toast", "Bot 删除成功");
  }
  showDeleteModal.value = false;
  deletingBot.value = null;
};

const handleClickOutside = (e: MouseEvent) => {
  const target = e.target as HTMLElement;
  if (!target.closest('.telegram-table__actions-wrap')) {
    openMenuId.value = null;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
.telegram-view {
  padding: 24px;
}

.telegram-panel {
  max-width: 1200px;
}

.telegram-panel__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.telegram-panel__title {
  font-size: 20px;
  font-weight: 600;
  color: var(--agent-color-text-primary, #1f2937);
}

.telegram-panel__add-btn {
  display: flex;
  align-items: center;
  gap: 6px;
}

.telegram-panel__add-icon {
  font-size: 18px;
  line-height: 1;
}

.telegram-panel__desc {
  font-size: 14px;
  color: var(--agent-color-text-secondary, #6b7280);
  margin-bottom: 24px;
}

.telegram-panel__empty {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  border: 1px dashed var(--agent-color-border-secondary, #e5e7eb);
  border-radius: 8px;
  background: var(--agent-color-bg-secondary, #f9fafb);
}

.telegram-panel__empty-content {
  text-align: center;
}

.telegram-panel__empty-title {
  font-size: 16px;
  font-weight: 500;
  color: var(--agent-color-text-primary, #1f2937);
  margin-bottom: 8px;
}

.telegram-panel__empty-desc {
  font-size: 14px;
  color: var(--agent-color-text-tertiary, #9ca3af);
}

.telegram-table {
  width: 100%;
  border-collapse: collapse;
}

.telegram-table thead {
  background: var(--agent-color-bg-secondary, #f9fafb);
}

.telegram-table th {
  padding: 12px 16px;
  text-align: left;
  font-size: 13px;
  font-weight: 500;
  color: var(--agent-color-text-secondary, #6b7280);
  border-bottom: 1px solid var(--agent-color-border-primary, #e5e7eb);
}

.telegram-table td {
  padding: 16px;
  font-size: 14px;
  color: var(--agent-color-text-primary, #1f2937);
  border-bottom: 1px solid var(--agent-color-border-secondary, #f3f4f6);
}

.telegram-table__name {
  font-weight: 500;
}

.telegram-table__username {
  color: var(--agent-color-text-secondary, #6b7280);
  font-family: monospace;
}

.telegram-table__status {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.telegram-table__status--active {
  background: #d1fae5;
  color: #065f46;
}

.telegram-table__status--error {
  background: #fee2e2;
  color: #991b1b;
}

.telegram-table__creator {
  display: flex;
  align-items: center;
  gap: 8px;
}

.telegram-table__creator-avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  font-size: 12px;
  font-weight: 500;
  color: white;
}

.telegram-table__time {
  color: var(--agent-color-text-tertiary, #9ca3af);
  font-size: 13px;
}

.telegram-table__actions-wrap {
  position: relative;
}

.telegram-table__more-btn {
  padding: 4px;
  border: none;
  background: none;
  cursor: pointer;
  border-radius: 4px;
  transition: background 0.15s;
}

.telegram-table__more-btn:hover {
  background: var(--agent-color-bg-secondary, #f3f4f6);
}

.telegram-table__dropdown {
  position: absolute;
  right: 0;
  top: 100%;
  margin-top: 4px;
  min-width: 120px;
  background: white;
  border: 1px solid var(--agent-color-border-primary, #e5e7eb);
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 10;
  overflow: hidden;
}

.telegram-table__dropdown-item {
  display: block;
  width: 100%;
  padding: 10px 16px;
  text-align: left;
  font-size: 14px;
  color: var(--agent-color-text-primary, #1f2937);
  background: none;
  border: none;
  cursor: pointer;
  transition: background 0.15s;
}

.telegram-table__dropdown-item:hover {
  background: var(--agent-color-bg-secondary, #f9fafb);
}

.telegram-table__dropdown-item--danger {
  color: #dc2626;
}

.telegram-table__dropdown-item--danger:hover {
  background: #fef2f2;
}

.telegram-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.telegram-modal {
  background: white;
  border-radius: 12px;
  padding: 24px;
  max-width: 480px;
  width: 90%;
}

.telegram-modal--add {
  max-width: 560px;
}

.telegram-modal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.telegram-modal__title {
  font-size: 18px;
  font-weight: 600;
  color: var(--agent-color-text-primary, #1f2937);
}

.telegram-modal__close {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: none;
  font-size: 24px;
  color: var(--agent-color-text-tertiary, #9ca3af);
  cursor: pointer;
  border-radius: 6px;
  transition: background 0.15s;
}

.telegram-modal__close:hover {
  background: var(--agent-color-bg-secondary, #f3f4f6);
}

.telegram-modal__desc {
  font-size: 14px;
  color: var(--agent-color-text-secondary, #6b7280);
  margin-bottom: 24px;
}

.telegram-modal__actions,
.telegram-modal__footer {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.telegram-form-group {
  margin-bottom: 20px;
}

.telegram-form-label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: var(--agent-color-text-primary, #1f2937);
  margin-bottom: 8px;
}

.telegram-form-required {
  color: #dc2626;
}

.telegram-form-input,
.telegram-form-textarea {
  width: 100%;
  padding: 10px 12px;
  font-size: 14px;
  border: 1px solid var(--agent-color-border-primary, #d1d5db);
  border-radius: 6px;
  transition: border-color 0.15s;
}

.telegram-form-input:focus,
.telegram-form-textarea:focus {
  outline: none;
  border-color: var(--agent-color-brand-primary, #2f6bff);
}

.telegram-form-input:disabled {
  background: var(--agent-color-bg-secondary, #f3f4f6);
  color: var(--agent-color-text-tertiary, #9ca3af);
  cursor: not-allowed;
}

.telegram-form-textarea {
  resize: vertical;
  font-family: inherit;
}

.telegram-form-hint {
  font-size: 12px;
  color: var(--agent-color-text-tertiary, #9ca3af);
  margin-top: 6px;
}
</style>
