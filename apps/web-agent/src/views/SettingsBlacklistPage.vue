<template>
  <section class="bl-view">
    <article class="bl-panel agent-panel">
      <header class="bl-panel__header">
        <div>
          <h1 class="bl-panel__title">黑名单</h1>
          <p class="bl-panel__desc">添加到黑名单的 IP 将无法访问聊天小部件和聊天页面</p>
        </div>
        <button type="button" class="agent-btn agent-btn--primary bl-panel__add-btn" @click="openAddModal">
          <span class="bl-panel__add-icon">+</span>
          <span>添加</span>
        </button>
      </header>

      <div class="bl-panel__table-area">
        <table class="bl-table">
          <thead>
            <tr>
              <th>IP 地址</th>
              <th>拦截次数</th>
              <th>创建人</th>
              <th>创建时间</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in pagedList" :key="row.id">
              <td>{{ row.ip }}</td>
              <td>{{ row.blockCount }}</td>
              <td>{{ row.creator }}</td>
              <td>{{ row.createdAt }}</td>
              <td>
                <button type="button" class="bl-table__delete-btn" @click="handleDelete(row)">删除</button>
              </td>
            </tr>
            <tr v-if="pagedList.length === 0">
              <td colspan="5" class="bl-table__empty">暂无数据</td>
            </tr>
          </tbody>
        </table>
      </div>

      <footer class="bl-pagination">
        <span class="bl-pagination__total">总条数：{{ items.length }}</span>
        <div class="bl-pagination__nav">
          <button type="button" class="bl-pagination__arrow" :disabled="currentPage <= 1" @click="currentPage--">&lt;</button>
          <button
            v-for="p in totalPages"
            :key="p"
            type="button"
            class="bl-pagination__page"
            :class="{ 'bl-pagination__page--active': p === currentPage }"
            @click="currentPage = p"
          >{{ p }}</button>
          <button type="button" class="bl-pagination__arrow" :disabled="currentPage >= totalPages" @click="currentPage++">&gt;</button>
        </div>
        <div class="bl-pagination__size">
          <span>{{ pageSize }} 条/页</span>
          <svg viewBox="0 0 12 12" width="12" height="12" fill="none">
            <path d="M3 5l3 3 3-3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </div>
      </footer>
    </article>

    <!-- Delete confirmation -->
    <Teleport to="body">
      <div v-if="deleteConfirmVisible" class="bl-modal-overlay" @click.self="deleteConfirmVisible = false">
        <div class="bl-modal">
          <h3 class="bl-modal__title">删除黑名单</h3>
          <p class="bl-modal__desc">确认将该 IP 从黑名单中移除？</p>
          <footer class="bl-modal__footer">
            <button type="button" class="agent-btn agent-btn--ghost bl-modal__cancel" @click="deleteConfirmVisible = false">取 消</button>
            <button type="button" class="agent-btn agent-btn--primary bl-modal__ok" @click="confirmDelete">确认删除</button>
          </footer>
        </div>
      </div>
    </Teleport>

    <!-- Add modal -->
    <Teleport to="body">
      <div v-if="addModalVisible" class="bl-modal-overlay" @click.self="addModalVisible = false">
        <div class="bl-modal bl-modal--form">
          <header class="bl-modal__header">
            <h3 class="bl-modal__title">添加黑名单</h3>
            <button type="button" class="bl-modal__close" @click="addModalVisible = false">&times;</button>
          </header>
          <div class="bl-modal__body">
            <div class="bl-modal__field">
              <label class="bl-modal__label">IP 地址</label>
              <input v-model="formIp" class="agent-input" placeholder="例如 192.168.1.1" />
            </div>
          </div>
          <footer class="bl-modal__footer">
            <button type="button" class="agent-btn agent-btn--ghost bl-modal__cancel" @click="addModalVisible = false">取 消</button>
            <button
              type="button"
              class="agent-btn agent-btn--primary bl-modal__ok"
              :disabled="!formIp.trim()"
              @click="confirmAdd"
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

interface BlacklistItem {
  id: string;
  ip: string;
  blockCount: number;
  creator: string;
  createdAt: string;
}

const currentPage = ref(1);
const pageSize = 20;
let nextId = 2;

const items = ref<BlacklistItem[]>([
  {
    id: "1",
    ip: "127.0.0.1",
    blockCount: 0,
    creator: "客服主管",
    createdAt: "2026-03-18 22:54:25",
  },
]);

const totalPages = computed(() => Math.max(1, Math.ceil(items.value.length / pageSize)));
const pagedList = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  return items.value.slice(start, start + pageSize);
});

// ---- Delete ----
const deleteConfirmVisible = ref(false);
const deleteTarget = ref<BlacklistItem | null>(null);

const handleDelete = (row: BlacklistItem) => {
  deleteTarget.value = row;
  deleteConfirmVisible.value = true;
};

const confirmDelete = () => {
  if (!deleteTarget.value) return;
  items.value = items.value.filter((i) => i.id !== deleteTarget.value!.id);
  emit("toast", "删除成功");
  deleteConfirmVisible.value = false;
  deleteTarget.value = null;
};

// ---- Add ----
const addModalVisible = ref(false);
const formIp = ref("");

const openAddModal = () => {
  formIp.value = "";
  addModalVisible.value = true;
};

const now = () => {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
};

const confirmAdd = () => {
  const ip = formIp.value.trim();
  if (!ip) return;
  if (items.value.some((i) => i.ip === ip)) {
    emit("toast", "该 IP 已在黑名单中");
    return;
  }
  nextId++;
  items.value.push({
    id: String(nextId),
    ip,
    blockCount: 0,
    creator: "客服主管",
    createdAt: now(),
  });
  emit("toast", "添加成功");
  addModalVisible.value = false;
};
</script>

<style scoped>
.bl-view {
  height: 100%;
  min-height: 0;
  padding: 12px;
}

.bl-panel {
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

.bl-panel__header {
  align-items: flex-start;
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding: 18px 18px 12px;
}

.bl-panel__title {
  color: #252525;
  font-size: 20px;
  font-weight: 600;
  line-height: 28px;
  margin: 0;
}

.bl-panel__desc {
  color: #75869c;
  font-size: 14px;
  line-height: 22px;
  margin: 6px 0 0;
}

.bl-panel__add-btn {
  border-radius: 10px;
  flex-shrink: 0;
  font-size: 14px;
  font-weight: 500;
  gap: 4px;
  min-width: 84px;
  padding: 7px 14px 7px 10px;
}

.bl-panel__add-icon {
  display: inline-block;
  font-size: 15px;
  font-weight: 600;
  line-height: 1;
  transform: translateY(-0.5px);
}

/* Table */
.bl-panel__table-area {
  flex: 1;
  min-height: 0;
  overflow: auto;
  padding: 0 18px;
}

.bl-table {
  border-collapse: collapse;
  color: #252525;
  table-layout: fixed;
  width: 100%;
}

.bl-table th,
.bl-table td {
  border-bottom: 1px solid #edf1f5;
  font-size: 13px;
  line-height: 19px;
  padding: 14px 8px;
  text-align: left;
  vertical-align: middle;
}

.bl-table th {
  background: #eef2f5;
  color: #222222;
  font-weight: 600;
  padding-bottom: 8px;
  padding-top: 8px;
}

.bl-table th:nth-child(1) { width: 22%; }
.bl-table th:nth-child(2) { width: 18%; }
.bl-table th:nth-child(3) { width: 18%; }
.bl-table th:nth-child(4) { width: 24%; }
.bl-table th:nth-child(5) { width: 10%; }

.bl-table__delete-btn {
  background: transparent;
  border: 0;
  color: #ef4444;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  padding: 0;
}

.bl-table__delete-btn:hover {
  text-decoration: underline;
}

.bl-table__empty {
  color: #b0b8c8;
  padding: 48px 8px;
  text-align: center;
}

/* Pagination */
.bl-pagination {
  align-items: center;
  display: flex;
  gap: 16px;
  justify-content: flex-end;
  padding: 14px 18px 18px;
}

.bl-pagination__total {
  color: #75869c;
  font-size: 13px;
  margin-right: auto;
}

.bl-pagination__nav {
  align-items: center;
  display: flex;
  gap: 4px;
}

.bl-pagination__arrow {
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

.bl-pagination__arrow:disabled {
  color: #d2d7e0;
  cursor: not-allowed;
}

.bl-pagination__arrow:hover:not(:disabled) {
  border-color: #105eff;
  color: #105eff;
}

.bl-pagination__page {
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

.bl-pagination__page--active {
  background: #e8eeff;
  border-color: #105eff;
  color: #105eff;
  font-weight: 600;
}

.bl-pagination__size {
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
.bl-modal-overlay {
  align-items: center;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  inset: 0;
  justify-content: center;
  position: fixed;
  z-index: 1000;
}

.bl-modal {
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  max-width: 400px;
  padding: 28px 32px 24px;
  width: 90%;
}

.bl-modal--form {
  max-width: 480px;
  padding: 0;
}

.bl-modal__header {
  align-items: center;
  display: flex;
  justify-content: space-between;
  padding: 24px 28px 0;
}

.bl-modal__title {
  color: #252525;
  font-size: 18px;
  font-weight: 600;
  margin: 0;
}

.bl-modal__close {
  background: transparent;
  border: 0;
  color: #252525;
  cursor: pointer;
  font-size: 22px;
  line-height: 1;
  padding: 0;
}

.bl-modal__close:hover {
  opacity: 0.6;
}

.bl-modal__desc {
  color: #75869c;
  font-size: 14px;
  line-height: 22px;
  margin: 0 0 24px;
}

.bl-modal__body {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px 28px;
}

.bl-modal__field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.bl-modal__label {
  color: #252525;
  font-size: 14px;
  font-weight: 600;
}

.bl-modal__footer {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding: 16px 28px 24px;
}

.bl-modal__cancel {
  border: 1px solid #dbe1ea;
  border-radius: 8px;
  font-size: 14px;
  min-width: 72px;
  padding: 8px 20px;
}

.bl-modal__ok {
  border-radius: 8px;
  font-size: 14px;
  min-width: 96px;
  padding: 8px 20px;
}
</style>
