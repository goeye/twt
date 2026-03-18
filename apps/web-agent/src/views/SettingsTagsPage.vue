<template>
  <section class="tags-view" @click="closeDropdown">
    <article class="tags-panel agent-panel">
      <header class="tags-panel__header">
        <h1 class="tags-panel__title">{{ props.pageTitle }}</h1>
        <button type="button" class="agent-btn agent-btn--primary tags-panel__add-btn" @click="openAddModal">
          <span class="tags-panel__add-icon">+</span>
          <span>添加</span>
        </button>
      </header>

      <div class="tags-panel__search">
        <div class="tags-search-input">
          <input
            v-model="searchQuery"
            class="agent-input tags-search-input__field"
            placeholder="搜索标签"
          />
          <svg class="tags-search-input__icon" viewBox="0 0 20 20" fill="none">
            <circle cx="9" cy="9" r="6" stroke="currentColor" stroke-width="1.8" />
            <path d="M13.5 13.5L17 17" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
          </svg>
        </div>
      </div>

      <div class="tags-panel__table-area">
        <table class="tags-table">
          <thead>
            <tr>
              <th>排序</th>
              <th>标签</th>
              <th>
                <span class="tags-table__sortable">
                  使用数量
                  <svg class="tags-table__sort-icon" viewBox="0 0 10 14" fill="none" width="10" height="14">
                    <path d="M5 1v12M2 4l3-3 3 3M2 10l3 3 3-3" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </span>
              </th>
              <th>创建人</th>
              <th>创建时间</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in pagedList" :key="row.id">
              <td>{{ row.sort }}</td>
              <td>{{ row.name }}</td>
              <td>{{ row.usageCount }}</td>
              <td>{{ row.creator }}</td>
              <td>{{ row.createdAt }}</td>
              <td>
                <div class="tags-table__actions">
                  <button
                    type="button"
                    class="tags-table__more-btn"
                    @click.stop="toggleDropdown(row.id)"
                  >
                    <svg viewBox="0 0 16 16" fill="currentColor" width="16" height="16">
                      <circle cx="8" cy="3" r="1.5" />
                      <circle cx="8" cy="8" r="1.5" />
                      <circle cx="8" cy="13" r="1.5" />
                    </svg>
                  </button>
                  <div v-if="activeDropdownId === row.id" class="tags-table__dropdown">
                    <button type="button" class="tags-table__dropdown-item" @click="handleEdit(row)">编辑</button>
                    <button type="button" class="tags-table__dropdown-item tags-table__dropdown-item--danger" @click="handleDelete(row)">删除</button>
                  </div>
                </div>
              </td>
            </tr>
            <tr v-if="pagedList.length === 0">
              <td colspan="6" class="tags-table__empty">暂无数据</td>
            </tr>
          </tbody>
        </table>
      </div>

      <footer class="tags-pagination">
        <span class="tags-pagination__total">共 {{ filteredList.length }} 条</span>
        <div class="tags-pagination__nav">
          <button type="button" class="tags-pagination__arrow" :disabled="currentPage <= 1" @click="currentPage--">&lt;</button>
          <button
            v-for="p in totalPages"
            :key="p"
            type="button"
            class="tags-pagination__page"
            :class="{ 'tags-pagination__page--active': p === currentPage }"
            @click="currentPage = p"
          >{{ p }}</button>
          <button type="button" class="tags-pagination__arrow" :disabled="currentPage >= totalPages" @click="currentPage++">&gt;</button>
        </div>
        <div class="tags-pagination__size">
          <span>{{ pageSize }} 条/页</span>
          <svg viewBox="0 0 12 12" width="12" height="12" fill="none">
            <path d="M3 5l3 3 3-3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </div>
      </footer>
    </article>

    <!-- Delete confirmation modal -->
    <Teleport to="body">
      <div v-if="deleteConfirmVisible" class="tags-modal-overlay" @click.self="deleteConfirmVisible = false">
        <div class="tags-modal">
          <h3 class="tags-modal__title">删除标签</h3>
          <p class="tags-modal__desc">删除后不可恢复，确认删除？</p>
          <footer class="tags-modal__footer">
            <button type="button" class="agent-btn agent-btn--ghost tags-modal__cancel" @click="deleteConfirmVisible = false">取 消</button>
            <button type="button" class="agent-btn agent-btn--primary tags-modal__ok" @click="confirmDelete">确认删除</button>
          </footer>
        </div>
      </div>
    </Teleport>

    <!-- Add/Edit modal -->
    <Teleport to="body">
      <div v-if="formModalVisible" class="tags-modal-overlay" @click.self="formModalVisible = false">
        <div class="tags-modal tags-modal--form">
          <header class="tags-modal__header">
            <h3 class="tags-modal__title">{{ formMode === 'add' ? '添加标签' : '编辑标签' }}</h3>
            <button type="button" class="tags-modal__close" @click="formModalVisible = false">&times;</button>
          </header>
          <div class="tags-modal__body">
            <div class="tags-modal__field">
              <label class="tags-modal__label">标签名称</label>
              <input v-model="formName" class="agent-input" placeholder="请输入标签名称" />
            </div>
            <div class="tags-modal__field">
              <label class="tags-modal__label">排序</label>
              <input v-model.number="formSort" type="number" class="agent-input" placeholder="数字越小越靠前" min="1" />
            </div>
          </div>
          <footer class="tags-modal__footer">
            <button type="button" class="agent-btn agent-btn--ghost tags-modal__cancel" @click="formModalVisible = false">取 消</button>
            <button
              type="button"
              class="agent-btn agent-btn--primary tags-modal__ok"
              :disabled="!formName.trim()"
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

const props = defineProps<{
  pageTitle: string;
}>();

const emit = defineEmits<{
  (e: "toast", message: string): void;
}>();

interface TagItem {
  id: string;
  sort: number;
  name: string;
  usageCount: number;
  creator: string;
  createdAt: string;
}

const searchQuery = ref("");
const currentPage = ref(1);
const pageSize = 10;

let nextId = 2;

const items = ref<TagItem[]>([
  {
    id: "1",
    sort: 1,
    name: "123",
    usageCount: 1,
    creator: "123",
    createdAt: "2026-03-04 14:13:31",
  },
]);

const filteredList = computed(() => {
  const q = searchQuery.value.trim().toLowerCase();
  if (!q) return items.value;
  return items.value.filter((item) => item.name.toLowerCase().includes(q));
});

const totalPages = computed(() => Math.max(1, Math.ceil(filteredList.value.length / pageSize)));

const pagedList = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  return filteredList.value.slice(start, start + pageSize);
});

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
const deleteTarget = ref<TagItem | null>(null);

const handleDelete = (row: TagItem) => {
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
const formName = ref("");
const formSort = ref(1);
const formEditId = ref("");

const openAddModal = () => {
  formMode.value = "add";
  formName.value = "";
  formSort.value = items.value.length + 1;
  formEditId.value = "";
  formModalVisible.value = true;
};

const handleEdit = (row: TagItem) => {
  closeDropdown();
  formMode.value = "edit";
  formName.value = row.name;
  formSort.value = row.sort;
  formEditId.value = row.id;
  formModalVisible.value = true;
};

const now = () => {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
};

const confirmForm = () => {
  if (!formName.value.trim()) return;

  if (formMode.value === "add") {
    nextId++;
    items.value.push({
      id: String(nextId),
      sort: formSort.value,
      name: formName.value.trim(),
      usageCount: 0,
      creator: "123",
      createdAt: now(),
    });
    items.value.sort((a, b) => a.sort - b.sort);
    emit("toast", "添加成功");
  } else {
    const target = items.value.find((item) => item.id === formEditId.value);
    if (target) {
      target.name = formName.value.trim();
      target.sort = formSort.value;
      items.value.sort((a, b) => a.sort - b.sort);
      emit("toast", "编辑成功");
    }
  }
  formModalVisible.value = false;
};
</script>

<style scoped>
.tags-view {
  height: 100%;
  min-height: 0;
  padding: 12px;
}

.tags-panel {
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
.tags-panel__header {
  align-items: center;
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding: 18px 18px 12px;
}

.tags-panel__title {
  color: #252525;
  font-size: 20px;
  font-weight: 600;
  line-height: 28px;
  margin: 0;
}

.tags-panel__add-btn {
  border-radius: 10px;
  font-size: 14px;
  font-weight: 500;
  gap: 4px;
  min-width: 84px;
  padding: 7px 14px 7px 10px;
}

.tags-panel__add-icon {
  display: inline-block;
  font-size: 15px;
  font-weight: 600;
  line-height: 1;
  transform: translateY(-0.5px);
}

/* Search */
.tags-panel__search {
  padding: 0 18px 12px;
}

.tags-search-input {
  max-width: 240px;
  position: relative;
}

.tags-search-input__field {
  border: 1px solid #dbe1ea;
  border-radius: 10px;
  color: #252525;
  font-size: 14px;
  padding: 8px 36px 8px 14px;
  width: 100%;
}

.tags-search-input__field:focus {
  border-color: #105eff;
  outline: none;
}

.tags-search-input__field::placeholder {
  color: #b0b8c8;
}

.tags-search-input__icon {
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
.tags-panel__table-area {
  flex: 1;
  min-height: 0;
  overflow: auto;
  padding: 0 18px;
}

.tags-table {
  border-collapse: collapse;
  color: #252525;
  table-layout: fixed;
  width: 100%;
}

.tags-table th,
.tags-table td {
  border-bottom: 1px solid #edf1f5;
  font-size: 13px;
  line-height: 19px;
  padding: 14px 8px;
  text-align: left;
  vertical-align: middle;
}

.tags-table th {
  background: #eef2f5;
  color: #222222;
  font-weight: 600;
  padding-bottom: 8px;
  padding-top: 8px;
}

.tags-table th:nth-child(1) { width: 8%; }
.tags-table th:nth-child(2) { width: 24%; }
.tags-table th:nth-child(3) { width: 18%; }
.tags-table th:nth-child(4) { width: 14%; }
.tags-table th:nth-child(5) { width: 22%; }
.tags-table th:nth-child(6) { width: 8%; }

.tags-table__sortable {
  align-items: center;
  display: inline-flex;
  gap: 4px;
}

.tags-table__sort-icon {
  color: #b0b8c8;
}

.tags-table__empty {
  color: #b0b8c8;
  padding: 48px 8px;
  text-align: center;
}

/* Actions dropdown */
.tags-table__actions {
  position: relative;
}

.tags-table__more-btn {
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

.tags-table__more-btn:hover {
  background: #f5f7f9;
}

.tags-table__dropdown {
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

.tags-table__dropdown-item {
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

.tags-table__dropdown-item:hover {
  background: #f5f7f9;
}

.tags-table__dropdown-item--danger {
  color: #ef4444;
}

/* Pagination */
.tags-pagination {
  align-items: center;
  display: flex;
  gap: 16px;
  justify-content: flex-end;
  padding: 14px 18px 18px;
}

.tags-pagination__total {
  color: #75869c;
  font-size: 13px;
  margin-right: auto;
}

.tags-pagination__nav {
  align-items: center;
  display: flex;
  gap: 4px;
}

.tags-pagination__arrow {
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

.tags-pagination__arrow:disabled {
  color: #d2d7e0;
  cursor: not-allowed;
}

.tags-pagination__arrow:hover:not(:disabled) {
  border-color: #105eff;
  color: #105eff;
}

.tags-pagination__page {
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

.tags-pagination__page--active {
  background: #e8eeff;
  border-color: #105eff;
  color: #105eff;
  font-weight: 600;
}

.tags-pagination__size {
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
.tags-modal-overlay {
  align-items: center;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  inset: 0;
  justify-content: center;
  position: fixed;
  z-index: 1000;
}

.tags-modal {
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  max-width: 400px;
  padding: 28px 32px 24px;
  width: 90%;
}

.tags-modal--form {
  max-width: 480px;
  padding: 0;
}

.tags-modal__header {
  align-items: center;
  display: flex;
  justify-content: space-between;
  padding: 24px 28px 0;
}

.tags-modal__title {
  color: #252525;
  font-size: 18px;
  font-weight: 600;
  margin: 0;
}

.tags-modal__close {
  background: transparent;
  border: 0;
  color: #252525;
  cursor: pointer;
  font-size: 22px;
  line-height: 1;
  padding: 0;
}

.tags-modal__close:hover {
  opacity: 0.6;
}

.tags-modal__desc {
  color: #75869c;
  font-size: 14px;
  line-height: 22px;
  margin: 0 0 24px;
}

.tags-modal__body {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px 28px;
}

.tags-modal__field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.tags-modal__label {
  color: #252525;
  font-size: 14px;
  font-weight: 600;
}

.tags-modal__footer {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding: 16px 28px 24px;
}

.tags-modal__cancel {
  border: 1px solid #dbe1ea;
  border-radius: 8px;
  font-size: 14px;
  min-width: 72px;
  padding: 8px 20px;
}

.tags-modal__ok {
  border-radius: 8px;
  font-size: 14px;
  min-width: 96px;
  padding: 8px 20px;
}
</style>
