<template>
  <section class="roles-page">
    <header class="roles-page__header">
      <h2 class="roles-page__title">角色管理</h2>
      <button
        type="button"
        class="agent-btn agent-btn--primary roles-page__add-btn"
        @click="emit('create-role')"
      >
        <span class="roles-page__add-icon">+</span>
        <span>新增角色</span>
      </button>
    </header>

    <div class="roles-page__table-area agent-scroll">
      <table class="roles-table">
        <thead>
          <tr>
            <th>角色名称</th>
            <th>角色类型</th>
            <th>权限概览</th>
            <th>绑定成员数</th>
            <th>创建人</th>
            <th>创建时间</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="role in roles" :key="role.id">
            <td>
              <button type="button" class="roles-table__name-link" @click="emit('view-role', role.id)">
                {{ role.name }}
              </button>
            </td>
            <td>
              <span
                class="roles-table__type-badge"
                :class="{ 'roles-table__type-badge--system': role.isSystem }"
              >
                {{ role.isSystem ? '系统角色' : '自定义角色' }}
              </span>
            </td>
            <td>
              <div class="roles-table__perm-tags">
                <span
                  v-for="perm in role.permissionSummary"
                  :key="perm"
                  class="roles-table__perm-tag"
                >{{ perm }}</span>
                <span v-if="role.permissionSummary.length === 0" class="roles-table__perm-empty">—</span>
              </div>
            </td>
            <td>{{ role.memberCount }}</td>
            <td>{{ role.creator }}</td>
            <td>{{ role.createdAt }}</td>
            <td>
              <div class="roles-table__actions">
                <button
                  type="button"
                  class="roles-table__action-link"
                  @click="emit('view-role', role.id)"
                >查看</button>
                <template v-if="!role.isSystem">
                  <button
                    type="button"
                    class="roles-table__action-link"
                    @click="emit('edit-role', role.id)"
                  >编辑</button>
                  <button
                    type="button"
                    class="roles-table__action-link roles-table__action-link--danger"
                    @click="handleDeleteRole(role)"
                  >删除</button>
                </template>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Delete confirmation modal -->
    <Teleport to="body">
      <div v-if="deleteConfirmVisible" class="roles-modal-overlay" @click.self="deleteConfirmVisible = false">
        <div class="roles-modal">
          <h3 class="roles-modal__title">确认删除</h3>
          <p class="roles-modal__desc">{{ deleteMessage }}</p>
          <div class="roles-modal__actions">
            <button type="button" class="agent-btn agent-btn--ghost" @click="deleteConfirmVisible = false">取消</button>
            <button
              type="button"
              class="agent-btn agent-btn--danger"
              :disabled="!canDeleteTarget"
              @click="confirmDelete"
            >删除</button>
          </div>
        </div>
      </div>
    </Teleport>
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

interface RoleItem {
  id: string;
  name: string;
  isSystem: boolean;
  permissionSummary: string[];
  memberCount: number;
  creator: string;
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
    name: "管理员",
    isSystem: true,
    permissionSummary: ["全部权限"],
    memberCount: 1,
    creator: "系统",
    createdAt: "2025-01-01 00:00"
  },
  {
    id: "role-agent",
    name: "客服",
    isSystem: true,
    permissionSummary: ["会话", "访客", "档案", "个人资料", "快捷回复"],
    memberCount: 4,
    creator: "系统",
    createdAt: "2025-01-01 00:00"
  },
  {
    id: "role-senior",
    name: "高级客服",
    isSystem: false,
    permissionSummary: ["会话", "访客", "档案", "报表", "快捷回复"],
    memberCount: 2,
    creator: "Cafe",
    createdAt: "2025-06-15 14:30"
  },
  {
    id: "role-supervisor",
    name: "主管",
    isSystem: false,
    permissionSummary: ["会话", "访客", "档案", "报表", "客服管理", "快捷回复"],
    memberCount: 1,
    creator: "Cafe",
    createdAt: "2025-08-20 09:00"
  }
]);

const deleteConfirmVisible = ref(false);
const deleteTargetRole = ref<RoleItem | null>(null);

const canDeleteTarget = computed(() => {
  if (!deleteTargetRole.value) return false;
  return deleteTargetRole.value.memberCount === 0;
});

const deleteMessage = computed(() => {
  if (!deleteTargetRole.value) return "";
  if (deleteTargetRole.value.memberCount > 0) {
    return `角色「${deleteTargetRole.value.name}」当前仍有 ${deleteTargetRole.value.memberCount} 位绑定成员，请先调整成员角色后再删除。`;
  }
  return `确定要删除角色「${deleteTargetRole.value.name}」吗？删除后不可恢复。`;
});

const handleDeleteRole = (role: RoleItem) => {
  deleteTargetRole.value = role;
  deleteConfirmVisible.value = true;
};

const confirmDelete = () => {
  if (!deleteTargetRole.value || !canDeleteTarget.value) return;
  const name = deleteTargetRole.value.name;
  roles.value = roles.value.filter((r) => r.id !== deleteTargetRole.value!.id);
  deleteConfirmVisible.value = false;
  deleteTargetRole.value = null;
  emit("toast", `角色「${name}」已删除`);
};
</script>

<style scoped>
.roles-page {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
}

.roles-page__header {
  align-items: center;
  display: flex;
  justify-content: space-between;
  padding: 0 0 16px;
}

.roles-page__title {
  color: #252525;
  font-size: 16px;
  font-weight: 600;
  margin: 0;
}

.roles-page__add-btn {
  border-radius: 10px;
  font-size: 14px;
  font-weight: 500;
  gap: 4px;
  min-width: 96px;
  padding: 7px 12px 7px 10px;
}

.roles-page__add-icon {
  display: inline-block;
  font-size: 15px;
  font-weight: 600;
  line-height: 1;
  transform: translateY(-0.5px);
}

.roles-page__table-area {
  flex: 1;
  min-height: 0;
  overflow: auto;
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

.roles-table th:nth-child(1) { width: 12%; }
.roles-table th:nth-child(2) { width: 10%; }
.roles-table th:nth-child(3) { width: 30%; }
.roles-table th:nth-child(4) { width: 10%; }
.roles-table th:nth-child(5) { width: 10%; }
.roles-table th:nth-child(6) { width: 14%; }
.roles-table th:nth-child(7) { width: 14%; }

.roles-table__name-link {
  background: transparent;
  border: 0;
  color: #105eff;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  padding: 0;
  text-decoration: none;
}

.roles-table__name-link:hover {
  text-decoration: underline;
}

.roles-table__type-badge {
  background: #f0f3f7;
  border-radius: 4px;
  color: #75869c;
  display: inline-flex;
  font-size: 12px;
  line-height: 18px;
  padding: 1px 8px;
}

.roles-table__type-badge--system {
  background: #dce9ff;
  color: #105eff;
}

.roles-table__perm-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.roles-table__perm-tag {
  background: #f5f7f9;
  border-radius: 4px;
  color: #4b5563;
  font-size: 12px;
  line-height: 18px;
  padding: 1px 6px;
}

.roles-table__perm-empty {
  color: #c7cdd8;
}

.roles-table__actions {
  align-items: center;
  display: flex;
  gap: 12px;
}

.roles-table__action-link {
  background: transparent;
  border: 0;
  color: #105eff;
  cursor: pointer;
  font-size: 13px;
  padding: 0;
}

.roles-table__action-link:hover {
  text-decoration: underline;
}

.roles-table__action-link--danger {
  color: #ef4444;
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
  color: #4b5563;
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
