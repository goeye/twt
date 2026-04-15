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
  height: 100%;
  min-height: 0;
  padding: 12px;
}

.telegram-panel {
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

.telegram-panel__header {
  align-items: center;
  display: flex;
  gap: 16px;
  justify-content: space-between;
  padding: 18px 18px 12px;
}

.telegram-panel__title {
  color: #252525;
  font-size: 20px;
  font-weight: 600;
  line-height: 28px;
  margin: 0;
}

.telegram-panel__add-btn {
  border-radius: 10px;
  font-size: 14px;
  font-weight: 500;
  gap: 4px;
  min-width: 80px;
  padding: 7px 12px 7px 10px;
  display: flex;
  align-items: center;
}

.telegram-panel__add-icon {
  display: inline-block;
  font-size: 15px;
  font-weight: 600;
  line-height: 1;
  transform: translateY(-0.5px);
}

.telegram-panel__desc {
  color: #75869c;
  font-size: 13px;
  line-height: 1.5;
  margin: 0;
  padding: 0 18px 12px;
}

.telegram-panel__empty {
  align-items: center;
  display: flex;
  flex: 1;
  justify-content: center;
  min-height: 200px;
}

.telegram-panel__empty-content {
  text-align: center;
}

.telegram-panel__empty-title {
  color: var(--agent-color-text-primary);
  font-size: 15px;
  font-weight: 500;
  margin: 0 0 6px;
}

.telegram-panel__empty-desc {
  color: var(--agent-color-text-tertiary);
  font-size: 13px;
  margin: 0;
}

.telegram-panel__table-area {
  flex: 1;
  min-height: 0;
  overflow: auto;
  padding: 0 18px;
}

.telegram-table {
  border-collapse: collapse;
  color: #252525;
  table-layout: fixed;
  width: 100%;
}

.telegram-table th,
.telegram-table td {
  border-bottom: 1px solid #edf1f5;
  font-size: 13px;
  line-height: 19px;
  padding: 14px 10px;
  text-align: left;
  vertical-align: middle;
}

.telegram-table th {
  background: #eef2f5;
  color: #222222;
  font-weight: 600;
  padding-bottom: 8px;
  padding-top: 8px;
}

.telegram-table th:nth-child(1) { width: 20%; }
.telegram-table th:nth-child(2) { width: 25%; }
.telegram-table th:nth-child(3) { width: 12%; }
.telegram-table th:nth-child(4) { width: 18%; }
.telegram-table th:nth-child(5) { width: 18%; }
.telegram-table th:nth-child(6) { width: 7%; }

.telegram-table__name {
  color: #222222;
  font-size: 13px;
  font-weight: 500;
}

.telegram-table__username {
  color: var(--agent-color-text-secondary);
  font-family: monospace;
}

.telegram-table__status {
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  padding: 2px 8px;
}

.telegram-table__status--active {
  background: #ecfdf5;
  color: #059669;
}

.telegram-table__status--error {
  background: #fef2f2;
  color: #ef4444;
}

.telegram-table__creator {
  align-items: center;
  display: inline-flex;
  gap: 8px;
}

.telegram-table__creator-avatar {
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

.telegram-table__time {
  color: var(--agent-color-text-secondary);
}

.telegram-table__actions-wrap {
  position: relative;
  display: inline-flex;
}

.telegram-table__more-btn {
  align-items: center;
  background: transparent;
  border: 0;
  border-radius: 6px;
  cursor: pointer;
  display: inline-flex;
  height: 28px;
  justify-content: center;
  padding: 0;
  width: 28px;
}

.telegram-table__more-btn:hover {
  background: #f3f4f6;
}

.telegram-table__dropdown {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  min-width: 120px;
  overflow: hidden;
  position: absolute;
  right: 0;
  top: 100%;
  z-index: 50;
}

.telegram-table__dropdown-item {
  background: transparent;
  border: 0;
  color: #374151;
  cursor: pointer;
  display: block;
  font-family: inherit;
  font-size: 13px;
  padding: 8px 16px;
  text-align: left;
  width: 100%;
}

.telegram-table__dropdown-item:hover {
  background: #f3f4f6;
}

.telegram-table__dropdown-item--danger {
  color: #ef4444;
}

.telegram-table__dropdown-item--danger:hover {
  background: #fef2f2;
}

.telegram-modal-overlay {
  align-items: center;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  inset: 0;
  justify-content: center;
  position: fixed;
  z-index: 1000;
}

.telegram-modal {
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  max-width: 420px;
  padding: 24px;
  width: 90%;
}

.telegram-modal--add {
  max-width: 560px;
}

.telegram-modal__header {
  align-items: center;
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.telegram-modal__title {
  color: #252525;
  font-size: 16px;
  font-weight: 600;
  margin: 0;
}

.telegram-modal__close {
  background: transparent;
  border: 0;
  color: #9ca3af;
  cursor: pointer;
  font-size: 22px;
  height: 32px;
  line-height: 1;
  width: 32px;
}

.telegram-modal__close:hover {
  color: #6b7280;
}

.telegram-modal__desc {
  color: #75869c;
  font-size: 14px;
  line-height: 1.5;
  margin: 12px 0 20px;
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
  color: #252525;
  margin-bottom: 8px;
}

.telegram-form-required {
  color: #ef4444;
}

.telegram-form-input,
.telegram-form-textarea {
  width: 100%;
  padding: 10px 12px;
  font-size: 14px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  box-sizing: border-box;
  transition: border-color 0.15s;
}

.telegram-form-input:focus,
.telegram-form-textarea:focus {
  outline: none;
  border-color: var(--agent-color-brand-primary, #2f6bff);
}

.telegram-form-input:disabled {
  background: #f3f4f6;
  color: #9ca3af;
  cursor: not-allowed;
}

.telegram-form-textarea {
  resize: vertical;
  font-family: inherit;
}

.telegram-form-hint {
  font-size: 12px;
  color: #9ca3af;
  margin-top: 6px;
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
