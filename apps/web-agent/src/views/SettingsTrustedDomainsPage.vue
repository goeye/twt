<template>
  <section class="td-view" @click="closeDropdown">
    <article class="td-panel agent-panel">
      <header class="td-panel__header">
        <div>
          <h1 class="td-panel__title">信任域名</h1>
          <p class="td-panel__desc">添加后，只有受信任的域名才能访问聊天小组件。信任一个域名会自动信任其所有子域名，信任子域并不信任其主域名。</p>
        </div>
        <button type="button" class="agent-btn agent-btn--primary td-panel__add-btn" @click="openAddModal">
          <span class="td-panel__add-icon">+</span>
          <span>添加</span>
        </button>
      </header>

      <div class="td-panel__table-area">
        <table class="td-table">
          <thead>
            <tr>
              <th>域名</th>
              <th>创建人</th>
              <th>创建时间</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in pagedList" :key="row.id">
              <td>{{ row.domain }}</td>
              <td>{{ row.creator }}</td>
              <td>{{ row.createdAt }}</td>
              <td>
                <div class="td-table__actions">
                  <button type="button" class="td-table__more-btn" @click.stop="toggleDropdown(row.id)">···</button>
                  <div v-if="activeDropdownId === row.id" class="td-table__dropdown" @click.stop>
                    <button type="button" class="td-table__dropdown-item" @click="handleEdit(row)">编辑</button>
                    <button type="button" class="td-table__dropdown-item td-table__dropdown-item--danger" @click="handleDelete(row)">删除</button>
                  </div>
                </div>
              </td>
            </tr>
            <tr v-if="pagedList.length === 0">
              <td colspan="4">
                <div class="td-table__empty">
                  <svg class="td-table__empty-icon" viewBox="0 0 64 64" fill="none" width="64" height="64">
                    <rect x="14" y="8" width="36" height="48" rx="4" stroke="#d2d7e0" stroke-width="2" />
                    <path d="M22 20h20M22 28h20M22 36h12" stroke="#d2d7e0" stroke-width="2" stroke-linecap="round" />
                    <path d="M14 8h24l12 12v36a4 4 0 01-4 4H18a4 4 0 01-4-4V8z" fill="none" stroke="#d2d7e0" stroke-width="2" />
                    <path d="M38 8v12h12" stroke="#d2d7e0" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                  <p class="td-table__empty-title">还未添加任何域名</p>
                  <p class="td-table__empty-desc">只有受信任的域名才能访问聊天小组件</p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <footer class="td-pagination">
        <span class="td-pagination__total">总条数：{{ items.length }}</span>
        <div class="td-pagination__nav">
          <button type="button" class="td-pagination__arrow" :disabled="currentPage <= 1" @click="currentPage--">&lt;</button>
          <span class="td-pagination__page-text">{{ currentPage }}</span>
          <button type="button" class="td-pagination__arrow" :disabled="currentPage >= totalPages" @click="currentPage++">&gt;</button>
        </div>
        <div class="td-pagination__size">
          <span>{{ pageSize }} 条/页</span>
          <svg viewBox="0 0 12 12" width="12" height="12" fill="none">
            <path d="M3 5l3 3 3-3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </div>
      </footer>
    </article>

    <!-- Delete confirmation -->
    <Teleport to="body">
      <div v-if="deleteConfirmVisible" class="td-modal-overlay" @click.self="deleteConfirmVisible = false">
        <div class="td-modal">
          <h3 class="td-modal__title">删除域名</h3>
          <p class="td-modal__desc">删除后该域名将无法访问聊天小组件，确认删除？</p>
          <footer class="td-modal__footer">
            <button type="button" class="agent-btn agent-btn--ghost td-modal__cancel" @click="deleteConfirmVisible = false">取 消</button>
            <button type="button" class="agent-btn agent-btn--primary td-modal__ok" @click="confirmDelete">确认删除</button>
          </footer>
        </div>
      </div>
    </Teleport>

    <!-- Add modal -->
    <Teleport to="body">
      <div v-if="addModalVisible" class="td-modal-overlay" @click.self="addModalVisible = false">
        <div class="td-modal td-modal--form">
          <header class="td-modal__header">
            <h3 class="td-modal__title">{{ formMode === 'add' ? '添加信任域名' : '编辑信任域名' }}</h3>
            <button type="button" class="td-modal__close" @click="addModalVisible = false">&times;</button>
          </header>
          <div class="td-modal__body">
            <div class="td-modal__field">
              <label class="td-modal__label">域名</label>
              <input v-model="formDomain" class="agent-input" placeholder="例如 example.com" />
            </div>
          </div>
          <footer class="td-modal__footer">
            <button type="button" class="agent-btn agent-btn--ghost td-modal__cancel" @click="addModalVisible = false">取 消</button>
            <button
              type="button"
              class="agent-btn agent-btn--primary td-modal__ok"
              :disabled="!formDomain.trim()"
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
import { FEATURES } from "../lib/plan";
import { usePlan } from "../composables/usePlan";

const emit = defineEmits<{
  (e: "toast", message: string): void;
}>();

interface DomainItem {
  id: string;
  domain: string;
  creator: string;
  createdAt: string;
}

const currentPage = ref(1);
const pageSize = 20;
let nextId = 2;

const items = ref<DomainItem[]>([
  {
    id: "1",
    domain: "support.twt.com",
    creator: "客服主管",
    createdAt: "2026-03-18 22:54:25",
  },
]);

const totalPages = computed(() => Math.max(1, Math.ceil(items.value.length / pageSize)));
const pagedList = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  return items.value.slice(start, start + pageSize);
});

const { guardFeature } = usePlan();

const activeDropdownId = ref<string | null>(null);

const toggleDropdown = (rowId: string) => {
  if (activeDropdownId.value !== rowId && !guardFeature(FEATURES.TRUSTED_DOMAINS)) return;
  activeDropdownId.value = activeDropdownId.value === rowId ? null : rowId;
};

const closeDropdown = () => {
  activeDropdownId.value = null;
};

// ---- Delete ----
const deleteConfirmVisible = ref(false);
const deleteTarget = ref<DomainItem | null>(null);

const handleDelete = (row: DomainItem) => {
  closeDropdown();
  if (!guardFeature(FEATURES.TRUSTED_DOMAINS)) return;
  deleteTarget.value = row;
  deleteConfirmVisible.value = true;
};

const confirmDelete = () => {
  if (!guardFeature(FEATURES.TRUSTED_DOMAINS)) return;
  if (!deleteTarget.value) return;
  items.value = items.value.filter((i) => i.id !== deleteTarget.value!.id);
  emit("toast", "删除成功");
  deleteConfirmVisible.value = false;
  deleteTarget.value = null;
};

// ---- Add ----
const addModalVisible = ref(false);
const formMode = ref<"add" | "edit">("add");
const formEditId = ref("");
const formDomain = ref("");

const openAddModal = () => {
  if (!guardFeature(FEATURES.TRUSTED_DOMAINS)) return;
  closeDropdown();
  formMode.value = "add";
  formEditId.value = "";
  formDomain.value = "";
  addModalVisible.value = true;
};

const handleEdit = (row: DomainItem) => {
  closeDropdown();
  if (!guardFeature(FEATURES.TRUSTED_DOMAINS)) return;
  formMode.value = "edit";
  formEditId.value = row.id;
  formDomain.value = row.domain;
  addModalVisible.value = true;
};

const now = () => {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
};

const confirmForm = () => {
  if (!guardFeature(FEATURES.TRUSTED_DOMAINS)) return;
  const domain = formDomain.value.trim();
  if (!domain) return;
  if (items.value.some((i) => i.domain === domain && i.id !== formEditId.value)) {
    emit("toast", "该域名已存在");
    return;
  }
  if (formMode.value === "add") {
    nextId++;
    items.value.push({
      id: String(nextId),
      domain,
      creator: "客服主管",
      createdAt: now(),
    });
    emit("toast", "添加成功");
  } else {
    items.value = items.value.map((item) =>
      item.id === formEditId.value
        ? {
            ...item,
            domain,
          }
        : item
    );
    emit("toast", "编辑成功");
  }
  addModalVisible.value = false;
};
</script>

<style scoped>
.td-view {
  height: 100%;
  min-height: 0;
  padding: 12px;
}

.td-panel {
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

.td-panel__header {
  align-items: flex-start;
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding: 18px 18px 12px;
}

.td-panel__title {
  color: #252525;
  font-size: 20px;
  font-weight: 600;
  line-height: 28px;
  margin: 0;
}

.td-panel__desc {
  color: #75869c;
  font-size: 14px;
  line-height: 22px;
  margin: 6px 0 0;
}

.td-panel__add-btn {
  border-radius: 10px;
  flex-shrink: 0;
  font-size: 14px;
  font-weight: 500;
  gap: 4px;
  min-width: 84px;
  padding: 7px 14px 7px 10px;
}

.td-panel__add-icon {
  display: inline-block;
  font-size: 15px;
  font-weight: 600;
  line-height: 1;
  transform: translateY(-0.5px);
}

/* Table */
.td-panel__table-area {
  flex: 1;
  min-height: 0;
  overflow: auto;
  padding: 0 18px;
}

.td-table {
  border-collapse: collapse;
  color: #252525;
  table-layout: fixed;
  width: 100%;
}

.td-table th,
.td-table td {
  border-bottom: 1px solid #edf1f5;
  font-size: 13px;
  line-height: 19px;
  padding: 14px 8px;
  text-align: left;
  vertical-align: middle;
}

.td-table th {
  background: #eef2f5;
  color: #222222;
  font-weight: 600;
  padding-bottom: 8px;
  padding-top: 8px;
}

.td-table th:nth-child(1) { width: 30%; }
.td-table th:nth-child(2) { width: 20%; }
.td-table th:nth-child(3) { width: 28%; }
.td-table th:nth-child(4) { width: 10%; }

.td-table__actions {
  position: relative;
}

.td-table__more-btn {
  align-items: center;
  background: transparent;
  border: 1px solid #dbe1ea;
  border-radius: 6px;
  color: #75869c;
  cursor: pointer;
  display: inline-flex;
  font-size: 14px;
  font-weight: 700;
  height: 28px;
  justify-content: center;
  letter-spacing: 1px;
  line-height: 1;
  padding: 0 8px;
}

.td-table__more-btn:hover {
  background: #f5f7f9;
  border-color: #c7cdd8;
}

.td-table__dropdown {
  background: #ffffff;
  border: 1px solid #edf1f5;
  border-radius: 10px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.10);
  display: flex;
  flex-direction: column;
  min-width: 120px;
  overflow: hidden;
  position: absolute;
  right: 0;
  top: 100%;
  z-index: 100;
}

.td-table__dropdown-item {
  background: transparent;
  border: 0;
  color: #252525;
  cursor: pointer;
  font-size: 13px;
  line-height: 20px;
  padding: 8px 16px;
  text-align: left;
  white-space: nowrap;
}

.td-table__dropdown-item:hover {
  background: #f5f7f9;
}

.td-table__dropdown-item--danger {
  color: #ef4444;
}

/* Empty state */
.td-table__empty {
  align-items: center;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 60px 0;
}

.td-table__empty-icon {
  margin-bottom: 4px;
}

.td-table__empty-title {
  color: #252525;
  font-size: 15px;
  font-weight: 600;
  margin: 0;
}

.td-table__empty-desc {
  color: #b0b8c8;
  font-size: 13px;
  margin: 0;
}

/* Pagination */
.td-pagination {
  align-items: center;
  display: flex;
  gap: 16px;
  justify-content: flex-end;
  padding: 14px 18px 18px;
}

.td-pagination__total {
  color: #75869c;
  font-size: 13px;
  margin-right: auto;
}

.td-pagination__nav {
  align-items: center;
  display: flex;
  gap: 4px;
}

.td-pagination__arrow {
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

.td-pagination__arrow:disabled {
  color: #d2d7e0;
  cursor: not-allowed;
}

.td-pagination__arrow:hover:not(:disabled) {
  border-color: #105eff;
  color: #105eff;
}

.td-pagination__page-text {
  color: #4b5563;
  font-size: 13px;
  min-width: 20px;
  text-align: center;
}

.td-pagination__size {
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
.td-modal-overlay {
  align-items: center;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  inset: 0;
  justify-content: center;
  position: fixed;
  z-index: 1000;
}

.td-modal {
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  max-width: 400px;
  padding: 28px 32px 24px;
  width: 90%;
}

.td-modal--form {
  max-width: 480px;
  padding: 0;
}

.td-modal__header {
  align-items: center;
  display: flex;
  justify-content: space-between;
  padding: 24px 28px 0;
}

.td-modal__title {
  color: #252525;
  font-size: 18px;
  font-weight: 600;
  margin: 0;
}

.td-modal__close {
  background: transparent;
  border: 0;
  color: #252525;
  cursor: pointer;
  font-size: 22px;
  line-height: 1;
  padding: 0;
}

.td-modal__close:hover {
  opacity: 0.6;
}

.td-modal__desc {
  color: #75869c;
  font-size: 14px;
  line-height: 22px;
  margin: 0 0 24px;
}

.td-modal__body {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px 28px;
}

.td-modal__field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.td-modal__label {
  color: #252525;
  font-size: 14px;
  font-weight: 600;
}

.td-modal__footer {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding: 16px 28px 24px;
}

.td-modal__cancel {
  border: 1px solid #dbe1ea;
  border-radius: 8px;
  font-size: 14px;
  min-width: 72px;
  padding: 8px 20px;
}

.td-modal__ok {
  border-radius: 8px;
  font-size: 14px;
  min-width: 96px;
  padding: 8px 20px;
}
</style>
