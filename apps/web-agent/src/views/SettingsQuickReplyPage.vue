<template>
  <section class="qr-view" @click="closeDropdown">
    <article class="qr-panel agent-panel">
      <header class="qr-panel__header">
        <h1 class="qr-panel__title">{{ props.pageTitle || '公共回复' }}</h1>
        <button type="button" class="agent-btn agent-btn--primary qr-panel__add-btn" @click="openAddModal">
          <span class="qr-panel__add-icon">+</span>
          <span>添加</span>
        </button>
      </header>

      <div class="qr-panel__search">
        <div class="qr-search-input">
          <input
            v-model="searchQuery"
            class="agent-input qr-search-input__field"
            placeholder="搜索回复"
          />
          <svg class="qr-search-input__icon" viewBox="0 0 20 20" fill="none">
            <circle cx="9" cy="9" r="6" stroke="currentColor" stroke-width="1.8" />
            <path d="M13.5 13.5L17 17" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
          </svg>
        </div>
      </div>

      <div class="qr-panel__table-area">
        <table class="qr-table">
          <thead>
            <tr>
              <th>标签</th>
              <th>回复</th>
              <th>图片</th>
              <th>创建人</th>
              <th>创建时间</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in filteredList" :key="row.id">
              <td>
                <span class="qr-table__tag">{{ row.tag }}</span>
              </td>
              <td>{{ row.reply }}</td>
              <td>{{ row.image || '-' }}</td>
              <td>{{ row.creator }}</td>
              <td>{{ row.createdAt }}</td>
              <td>
                <div class="qr-table__actions">
                  <button
                    type="button"
                    class="qr-table__more-btn"
                    @click.stop="toggleDropdown(row.id)"
                  >
                    <svg viewBox="0 0 16 16" fill="currentColor" width="16" height="16">
                      <circle cx="8" cy="3" r="1.5" />
                      <circle cx="8" cy="8" r="1.5" />
                      <circle cx="8" cy="13" r="1.5" />
                    </svg>
                  </button>
                  <div v-if="activeDropdownId === row.id" class="qr-table__dropdown">
                    <button type="button" class="qr-table__dropdown-item" @click="handleEdit(row)">编辑</button>
                    <button type="button" class="qr-table__dropdown-item qr-table__dropdown-item--danger" @click="handleDelete(row)">删除</button>
                  </div>
                </div>
              </td>
            </tr>
            <tr v-if="filteredList.length === 0">
              <td colspan="6" class="qr-table__empty">暂无数据</td>
            </tr>
          </tbody>
        </table>
      </div>

      <footer class="qr-pagination">
        <span class="qr-pagination__total">总条数：{{ filteredList.length }}</span>
        <div class="qr-pagination__nav">
          <button type="button" class="qr-pagination__arrow" :disabled="currentPage <= 1" @click="currentPage--">&lt;</button>
          <button
            v-for="p in totalPages"
            :key="p"
            type="button"
            class="qr-pagination__page"
            :class="{ 'qr-pagination__page--active': p === currentPage }"
            @click="currentPage = p"
          >{{ p }}</button>
          <button type="button" class="qr-pagination__arrow" :disabled="currentPage >= totalPages" @click="currentPage++">&gt;</button>
        </div>
        <div class="qr-pagination__size">
          <span>{{ pageSize }} 条/页</span>
          <svg viewBox="0 0 12 12" width="12" height="12" fill="none">
            <path d="M3 5l3 3 3-3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </div>
      </footer>
    </article>

    <!-- Delete confirmation modal -->
    <Teleport to="body">
      <div v-if="deleteConfirmVisible" class="qr-modal-overlay" @click.self="deleteConfirmVisible = false">
        <div class="qr-modal">
          <h3 class="qr-modal__title">删除回复</h3>
          <p class="qr-modal__desc">删除后不可恢复，确认删除？</p>
          <footer class="qr-modal__footer">
            <button type="button" class="agent-btn agent-btn--ghost qr-modal__cancel" @click="deleteConfirmVisible = false">取 消</button>
            <button type="button" class="agent-btn agent-btn--primary qr-modal__ok" @click="confirmDelete">确认删除</button>
          </footer>
        </div>
      </div>
    </Teleport>

    <!-- Add/Edit modal -->
    <Teleport to="body">
      <div v-if="formModalVisible" class="qr-modal-overlay" @click.self="formModalVisible = false">
        <div class="qr-modal qr-modal--form">
          <header class="qr-modal__header">
            <h3 class="qr-modal__title">{{ formMode === 'add' ? '添加回复' : '编辑回复' }}</h3>
            <button type="button" class="qr-modal__close" @click="formModalVisible = false">&times;</button>
          </header>
          <div class="qr-modal__body">
            <div class="qr-modal__field">
              <label class="qr-modal__label">标签</label>
              <input v-model="formTag" class="agent-input" placeholder="例如 /hello" />
            </div>
            <div class="qr-modal__field">
              <label class="qr-modal__label">回复内容</label>
              <textarea v-model="formReply" class="agent-input qr-modal__textarea" placeholder="输入回复内容" rows="4" />
            </div>
          </div>
          <footer class="qr-modal__footer">
            <button type="button" class="agent-btn agent-btn--ghost qr-modal__cancel" @click="formModalVisible = false">取 消</button>
            <button
              type="button"
              class="agent-btn agent-btn--primary qr-modal__ok"
              :disabled="!formTag.trim() || !formReply.trim()"
              @click="confirmForm"
            >确 定</button>
          </footer>
        </div>
      </div>
    </Teleport>
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

const emit = defineEmits<{
  (e: "toast", message: string): void;
}>();

const props = defineProps<{
  pageTitle?: string;
}>();

interface QuickReplyItem {
  id: string;
  tag: string;
  reply: string;
  image: string;
  creator: string;
  createdAt: string;
}

const searchQuery = ref("");
const currentPage = ref(1);
const pageSize = 20;

let nextId = 2;

const items = ref<QuickReplyItem[]>([
  {
    id: "1",
    tag: "/hello",
    reply: "你好",
    image: "",
    creator: "123",
    createdAt: "2026-03-18 22:34",
  },
]);

const filteredList = computed(() => {
  const q = searchQuery.value.trim().toLowerCase();
  if (!q) return items.value;
  return items.value.filter(
    (item) =>
      item.tag.toLowerCase().includes(q) ||
      item.reply.toLowerCase().includes(q)
  );
});

const totalPages = computed(() => Math.max(1, Math.ceil(filteredList.value.length / pageSize)));

// ---- Dropdown ----
const activeDropdownId = ref<string | null>(null);

const toggleDropdown = (rowId: string) => {
  activeDropdownId.value = activeDropdownId.value === rowId ? null : rowId;
};

const closeDropdown = () => {
  activeDropdownId.value = null;
};

// ---- Delete ----
const deleteConfirmVisible = ref(false);
const deleteTarget = ref<QuickReplyItem | null>(null);

const handleDelete = (row: QuickReplyItem) => {
  closeDropdown();
  deleteTarget.value = row;
  deleteConfirmVisible.value = true;
};

const confirmDelete = () => {
  if (!deleteTarget.value) return;
  items.value = items.value.filter((item) => item.id !== deleteTarget.value!.id);
  emit("toast", "删除成功");
  deleteConfirmVisible.value = false;
  deleteTarget.value = null;
};

// ---- Add / Edit form ----
const formModalVisible = ref(false);
const formMode = ref<"add" | "edit">("add");
const formTag = ref("");
const formReply = ref("");
const formEditId = ref("");

const openAddModal = () => {
  formMode.value = "add";
  formTag.value = "";
  formReply.value = "";
  formEditId.value = "";
  formModalVisible.value = true;
};

const handleEdit = (row: QuickReplyItem) => {
  closeDropdown();
  formMode.value = "edit";
  formTag.value = row.tag;
  formReply.value = row.reply;
  formEditId.value = row.id;
  formModalVisible.value = true;
};

const now = () => {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const confirmForm = () => {
  if (!formTag.value.trim() || !formReply.value.trim()) return;

  if (formMode.value === "add") {
    nextId++;
    items.value.push({
      id: String(nextId),
      tag: formTag.value.trim(),
      reply: formReply.value.trim(),
      image: "",
      creator: "123",
      createdAt: now(),
    });
    emit("toast", "添加成功");
  } else {
    const target = items.value.find((item) => item.id === formEditId.value);
    if (target) {
      target.tag = formTag.value.trim();
      target.reply = formReply.value.trim();
      emit("toast", "编辑成功");
    }
  }
  formModalVisible.value = false;
};
</script>

<style scoped>
.qr-view {
  height: 100%;
  min-height: 0;
  padding: 12px;
}

.qr-panel {
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

/* Header */
.qr-panel__header {
  align-items: center;
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding: 18px 18px 12px;
}

.qr-panel__title {
  color: #252525;
  font-size: 20px;
  font-weight: 600;
  line-height: 28px;
  margin: 0;
}

.qr-panel__add-btn {
  border-radius: 10px;
  font-size: 14px;
  font-weight: 500;
  gap: 4px;
  min-width: 84px;
  padding: 7px 14px 7px 10px;
}

.qr-panel__add-icon {
  display: inline-block;
  font-size: 15px;
  font-weight: 600;
  line-height: 1;
  transform: translateY(-0.5px);
}

/* Search */
.qr-panel__search {
  padding: 0 18px 12px;
}

.qr-search-input {
  max-width: 240px;
  position: relative;
}

.qr-search-input__field {
  border: 1px solid #dbe1ea;
  border-radius: 10px;
  color: #252525;
  font-size: 14px;
  padding: 8px 36px 8px 14px;
  width: 100%;
}

.qr-search-input__field:focus {
  border-color: #105eff;
  outline: none;
}

.qr-search-input__field::placeholder {
  color: #b0b8c8;
}

.qr-search-input__icon {
  color: #b0b8c8;
  height: 18px;
  pointer-events: none;
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  width: 18px;
}

/* Table */
.qr-panel__table-area {
  flex: 1;
  min-height: 0;
  overflow: auto;
  padding: 0 18px;
}

.qr-table {
  border-collapse: collapse;
  color: #252525;
  table-layout: fixed;
  width: 100%;
}

.qr-table th,
.qr-table td {
  border-bottom: 1px solid #edf1f5;
  font-size: 13px;
  line-height: 19px;
  padding: 14px 8px;
  text-align: left;
  vertical-align: middle;
}

.qr-table th {
  background: #eef2f5;
  color: #222222;
  font-weight: 600;
  padding-bottom: 8px;
  padding-top: 8px;
}

.qr-table th:nth-child(1) { width: 14%; }
.qr-table th:nth-child(2) { width: 30%; }
.qr-table th:nth-child(3) { width: 10%; }
.qr-table th:nth-child(4) { width: 12%; }
.qr-table th:nth-child(5) { width: 18%; }
.qr-table th:nth-child(6) { width: 8%; }

.qr-table__tag {
  background: #f5f7fa;
  border: 1px solid #e5e8ed;
  border-radius: 6px;
  color: #252525;
  display: inline-block;
  font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
  font-size: 13px;
  line-height: 20px;
  padding: 2px 8px;
}

.qr-table__empty {
  color: #b0b8c8;
  padding: 48px 8px;
  text-align: center;
}

/* Actions dropdown */
.qr-table__actions {
  position: relative;
}

.qr-table__more-btn {
  align-items: center;
  background: transparent;
  border: 0;
  border-radius: 6px;
  color: #75869c;
  cursor: pointer;
  display: inline-flex;
  height: 28px;
  justify-content: center;
  padding: 0;
  transition: background-color 0.15s;
  width: 28px;
}

.qr-table__more-btn:hover {
  background: #f5f7f9;
}

.qr-table__dropdown {
  background: #ffffff;
  border: 1px solid #edf1f5;
  border-radius: 10px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.10);
  display: flex;
  flex-direction: column;
  min-width: 100px;
  overflow: hidden;
  position: absolute;
  right: 0;
  top: 100%;
  z-index: 100;
}

.qr-table__dropdown-item {
  background: transparent;
  border: 0;
  color: #252525;
  cursor: pointer;
  font-size: 13px;
  line-height: 20px;
  padding: 8px 16px;
  text-align: left;
  transition: background-color 0.1s;
  white-space: nowrap;
}

.qr-table__dropdown-item:hover {
  background: #f5f7f9;
}

.qr-table__dropdown-item--danger {
  color: #ef4444;
}

/* Pagination */
.qr-pagination {
  align-items: center;
  display: flex;
  gap: 16px;
  justify-content: flex-end;
  padding: 14px 18px 18px;
}

.qr-pagination__total {
  color: #75869c;
  font-size: 13px;
  margin-right: auto;
}

.qr-pagination__nav {
  align-items: center;
  display: flex;
  gap: 4px;
}

.qr-pagination__arrow {
  align-items: center;
  background: #ffffff;
  border: 1px solid #dbe1ea;
  border-radius: 6px;
  color: #4b5563;
  cursor: pointer;
  display: inline-flex;
  font-size: 13px;
  height: 28px;
  justify-content: center;
  width: 28px;
}

.qr-pagination__arrow:disabled {
  color: #d2d7e0;
  cursor: not-allowed;
}

.qr-pagination__arrow:hover:not(:disabled) {
  border-color: #105eff;
  color: #105eff;
}

.qr-pagination__page {
  align-items: center;
  background: #ffffff;
  border: 1px solid #dbe1ea;
  border-radius: 6px;
  color: #4b5563;
  cursor: pointer;
  display: inline-flex;
  font-size: 13px;
  height: 28px;
  justify-content: center;
  min-width: 28px;
  padding: 0 6px;
}

.qr-pagination__page--active {
  background: #e8eeff;
  border-color: #105eff;
  color: #105eff;
  font-weight: 600;
}

.qr-pagination__size {
  align-items: center;
  border: 1px solid #dbe1ea;
  border-radius: 6px;
  color: #4b5563;
  display: inline-flex;
  font-size: 13px;
  gap: 4px;
  height: 28px;
  padding: 0 10px;
}

/* Modal */
.qr-modal-overlay {
  align-items: center;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  inset: 0;
  justify-content: center;
  position: fixed;
  z-index: 1000;
}

.qr-modal {
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  max-width: 400px;
  padding: 28px 32px 24px;
  width: 90%;
}

.qr-modal--form {
  max-width: 480px;
  padding: 0;
}

.qr-modal__header {
  align-items: center;
  display: flex;
  justify-content: space-between;
  padding: 24px 28px 0;
}

.qr-modal__title {
  color: #252525;
  font-size: 18px;
  font-weight: 600;
  margin: 0;
}

.qr-modal__close {
  background: transparent;
  border: 0;
  color: #252525;
  cursor: pointer;
  font-size: 22px;
  line-height: 1;
  padding: 0;
}

.qr-modal__close:hover {
  opacity: 0.6;
}

.qr-modal__desc {
  color: #75869c;
  font-size: 14px;
  line-height: 22px;
  margin: 0 0 24px;
}

.qr-modal__body {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px 28px;
}

.qr-modal__field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.qr-modal__label {
  color: #252525;
  font-size: 14px;
  font-weight: 600;
}

.qr-modal__textarea {
  border: 1px solid #dbe1ea;
  border-radius: 10px;
  color: #252525;
  font-size: 14px;
  line-height: 1.5;
  min-height: 100px;
  padding: 10px 14px;
  resize: vertical;
  width: 100%;
}

.qr-modal__textarea:focus {
  border-color: #105eff;
  outline: none;
}

.qr-modal__footer {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding: 16px 28px 24px;
}

.qr-modal__cancel {
  border: 1px solid #dbe1ea;
  border-radius: 8px;
  font-size: 14px;
  min-width: 72px;
  padding: 8px 20px;
}

.qr-modal__ok {
  border-radius: 8px;
  font-size: 14px;
  min-width: 96px;
  padding: 8px 20px;
}
</style>
