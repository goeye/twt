<template>
  <section class="roles-view" @click="closeDropdown">
    <article class="roles-panel agent-panel">
      <header class="roles-panel__header">
        <h1 class="roles-panel__title">角色</h1>
        <button type="button" class="agent-btn agent-btn--primary roles-panel__create-btn" @click="handleCreateRole">
          <span class="roles-panel__create-icon">+</span>
          <span>新增角色</span>
        </button>
      </header>

      <div class="roles-panel__table-area">
        <table class="roles-table">
          <thead>
            <tr>
              <th>角色名称</th>
              <th>关联成员数</th>
              <th>创建人</th>
              <th>创建时间</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="role in roles" :key="role.id">
              <td>
                <span class="roles-table__name">{{ role.name }}</span>
              </td>
              <td>{{ role.memberCount }}</td>
              <td>
                <div class="roles-table__creator">
                  <span class="roles-table__creator-avatar" :style="{ background: role.avatarColor }">{{ role.avatarText }}</span>
                  <span>{{ role.creator }}</span>
                </div>
              </td>
              <td>{{ role.createdAt }}</td>
              <td>
                <div class="roles-table__actions">
                  <button
                    type="button"
                    class="roles-table__more-btn"
                    @click.stop="toggleDropdown(role.id)"
                  >···</button>
                  <div
                    v-if="activeDropdownId === role.id"
                    class="roles-table__dropdown"
                  >
                    <button
                      type="button"
                      class="roles-table__dropdown-item"
                      @click="handleAction('view', role)"
                    >查看</button>
                    <button
                      v-if="role.canEdit"
                      type="button"
                      class="roles-table__dropdown-item"
                      @click="handleAction('edit', role)"
                    >编辑</button>
                    <button
                      v-if="role.canDelete"
                      type="button"
                      class="roles-table__dropdown-item roles-table__dropdown-item--danger"
                      @click="handleAction('delete', role)"
                    >删除</button>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <footer class="roles-panel__pagination">
        <button type="button" class="roles-panel__page roles-panel__page--active">1</button>
        <button type="button" class="roles-panel__page">2</button>
        <button type="button" class="roles-panel__page">3</button>
        <button type="button" class="roles-panel__page">4</button>
        <button type="button" class="roles-panel__page">5</button>
        <span class="roles-panel__page-ellipsis">...</span>
        <button type="button" class="roles-panel__page">20</button>
        <button type="button" class="roles-panel__page roles-panel__page-arrow">›</button>
        <span class="roles-panel__page-meta">9/Page</span>
        <span class="roles-panel__page-meta">Total: {{ roles.length }}</span>
      </footer>
    </article>

    <!-- Delete confirmation modal -->
    <Teleport to="body">
      <div v-if="deleteConfirmVisible" class="roles-modal-overlay" @click.self="deleteConfirmVisible = false">
        <div class="roles-modal">
          <h3 class="roles-modal__title">删除角色</h3>
          <p class="roles-modal__desc">删除后不可恢复、确认删除？</p>
          <div class="roles-modal__actions">
            <button type="button" class="agent-btn agent-btn--ghost" @click="deleteConfirmVisible = false">取消</button>
            <button
              type="button"
              class="agent-btn agent-btn--danger"
              @click="confirmDelete"
            >删除</button>
          </div>
        </div>
      </div>
    </Teleport>
  </section>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { FEATURES } from "../lib/plan";
import { usePlan } from "../composables/usePlan";

interface RoleItem {
  id: string;
  name: string;
  isSystem: boolean;
  canEdit: boolean;
  canDelete: boolean;
  permissionSummary: string[];
  memberCount: number;
  creator: string;
  avatarText: string;
  avatarColor: string;
  createdAt: string;
}

const emit = defineEmits<{
  (e: "toast", message: string): void;
  (e: "view-role", roleId: string): void;
  (e: "edit-role", roleId: string): void;
  (e: "create-role"): void;
}>();

const roles = ref<RoleItem[]>([
  {
    id: "role-admin",
    name: "超级管理员",
    isSystem: true,
    canEdit: false,
    canDelete: false,
    permissionSummary: ["全部权限"],
    memberCount: 1,
    creator: "系统",
    avatarText: "系",
    avatarColor: "#6b7280",
    createdAt: "2025-01-01"
  },
  {
    id: "role-agent",
    name: "客服",
    isSystem: true,
    canEdit: true,
    canDelete: false,
    permissionSummary: ["档案", "访客", "客户", "营销", "标签", "团队", "设置"],
    memberCount: 12,
    creator: "Cafe",
    avatarText: "C",
    avatarColor: "#105eff",
    createdAt: "2025-12-30"
  },
  {
    id: "role-senior",
    name: "高级客服",
    isSystem: false,
    canEdit: true,
    canDelete: true,
    permissionSummary: ["档案", "访客", "报表", "设置"],
    memberCount: 2,
    creator: "Cafe",
    avatarText: "C",
    avatarColor: "#105eff",
    createdAt: "2025-06-15"
  },
  {
    id: "role-supervisor",
    name: "主管",
    isSystem: false,
    canEdit: true,
    canDelete: true,
    permissionSummary: ["档案", "访客", "报表", "团队", "设置"],
    memberCount: 1,
    creator: "Cafe",
    avatarText: "C",
    avatarColor: "#105eff",
    createdAt: "2025-08-20"
  }
]);

// ---- Dropdown ----
const activeDropdownId = ref<string | null>(null);

const toggleDropdown = (roleId: string) => {
  activeDropdownId.value = activeDropdownId.value === roleId ? null : roleId;
};

const closeDropdown = () => {
  activeDropdownId.value = null;
};

const { guardFeature } = usePlan();

const handleCreateRole = () => {
  if (!guardFeature(FEATURES.ROLES_MANAGE)) return;
  emit("create-role");
};

const handleAction = (action: "view" | "edit" | "delete", role: RoleItem) => {
  closeDropdown();
  if (action === "view") emit("view-role", role.id);
  else if (action === "edit") {
    if (!guardFeature(FEATURES.ROLES_MANAGE)) return;
    emit("edit-role", role.id);
  }
  else {
    if (!guardFeature(FEATURES.ROLES_MANAGE)) return;
    handleDeleteRole(role);
  }
};

// ---- Delete ----
const deleteConfirmVisible = ref(false);
const deleteTargetRole = ref<RoleItem | null>(null);

const handleDeleteRole = (role: RoleItem) => {
  deleteTargetRole.value = role;
  deleteConfirmVisible.value = true;
};

const confirmDelete = () => {
  if (!guardFeature(FEATURES.ROLES_MANAGE)) return;
  if (!deleteTargetRole.value) return;
  if (deleteTargetRole.value.memberCount > 0) {
    deleteConfirmVisible.value = false;
    emit("toast", `当前角色有 ${deleteTargetRole.value.memberCount} 个关联成员，暂无法删除`);
    deleteTargetRole.value = null;
    return;
  }
  roles.value = roles.value.filter((r) => r.id !== deleteTargetRole.value!.id);
  deleteConfirmVisible.value = false;
  deleteTargetRole.value = null;
  emit("toast", "删除成功");
};
</script>

<style scoped>
.roles-view {
  height: 100%;
  min-height: 0;
  padding: 12px;
}

.roles-panel {
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

.roles-panel__header {
  align-items: center;
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding: 18px 18px 12px;
}

.roles-panel__title {
  color: #252525;
  font-size: 20px;
  font-weight: 600;
  line-height: 28px;
  margin: 0;
}

.roles-panel__create-btn {
  border-radius: 10px;
  font-size: 14px;
  font-weight: 500;
  gap: 4px;
  min-width: 96px;
  padding: 7px 12px 7px 10px;
}

.roles-panel__create-icon {
  display: inline-block;
  font-size: 15px;
  font-weight: 600;
  line-height: 1;
  transform: translateY(-0.5px);
}

/* Table */
.roles-panel__table-area {
  flex: 1;
  min-height: 0;
  overflow: auto;
  padding: 0 18px;
}

.roles-table {
  border-collapse: collapse;
  color: #252525;
  table-layout: fixed;
  width: 100%;
}

.roles-table th,
.roles-table td {
  border-bottom: 1px solid #edf1f5;
  font-size: 13px;
  line-height: 19px;
  padding: 14px 10px;
  text-align: left;
  vertical-align: middle;
}

.roles-table th {
  background: #eef2f5;
  color: #222222;
  font-weight: 600;
  padding-top: 8px;
  padding-bottom: 8px;
}

.roles-table th:nth-child(1) { width: 22%; }
.roles-table th:nth-child(2) { width: 16%; }
.roles-table th:nth-child(3) { width: 16%; }
.roles-table th:nth-child(4) { width: 20%; }
.roles-table th:nth-child(5) { width: 8%; }

.roles-table__name {
  color: #222222;
  font-size: 13px;
  font-weight: 500;
}

.roles-table__creator {
  align-items: center;
  display: inline-flex;
  gap: 8px;
}

.roles-table__creator-avatar {
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

/* Dropdown actions */
.roles-table__actions {
  position: relative;
}

.roles-table__more-btn {
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
  transition: background-color 0.15s, border-color 0.15s;
}

.roles-table__more-btn:hover {
  background: #f5f7f9;
  border-color: #c7cdd8;
}

.roles-table__dropdown {
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

.roles-table__dropdown-item {
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

.roles-table__dropdown-item:hover {
  background: #f5f7f9;
}

.roles-table__dropdown-item--danger {
  color: #ef4444;
}

/* Pagination */
.roles-panel__pagination {
  align-items: center;
  display: inline-flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
  margin: auto;
  padding: 16px 18px 24px;
}

.roles-panel__page {
  align-items: center;
  background: #ffffff;
  border: 1px solid #edf1f5;
  border-radius: 8px;
  color: #4b5563;
  cursor: pointer;
  display: inline-flex;
  font-size: 13px;
  height: 24px;
  justify-content: center;
  min-width: 24px;
  padding: 0 6px;
}

.roles-panel__page--active {
  background: #105eff;
  border-color: #105eff;
  color: #ffffff;
}

.roles-panel__page-arrow {
  font-size: 16px;
  font-weight: 600;
}

.roles-panel__page-ellipsis {
  color: #9ca3af;
  font-size: 13px;
}

.roles-panel__page-meta {
  color: #4b5563;
  font-size: 13px;
  line-height: 20px;
}

/* Delete confirmation modal */
.roles-modal-overlay {
  align-items: center;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  inset: 0;
  justify-content: center;
  position: fixed;
  z-index: 1000;
}

.roles-modal {
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  max-width: 420px;
  padding: 24px;
  width: 90%;
}

.roles-modal__title {
  color: #252525;
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 12px;
}

.roles-modal__desc {
  color: #75869c;
  font-size: 14px;
  line-height: 1.5;
  margin: 0 0 20px;
}

.roles-modal__actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.agent-btn--danger {
  background: #ef4444;
  border-color: #ef4444;
  border-radius: 10px;
  color: #ffffff;
  cursor: pointer;
  font-size: 14px;
  padding: 7px 16px;
}

.agent-btn--danger:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}
</style>
