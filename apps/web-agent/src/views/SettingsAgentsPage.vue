<template>
  <section class="settings-agents-view" @click="closeDropdown">
    <article class="settings-agents-panel agent-panel">
      <!-- Header: title + seat summary + invite (always visible) -->
      <header class="settings-agents-panel__header">
        <div class="settings-agents-panel__title-block">
          <h1 class="settings-agents-panel__title">客服</h1>
          <div class="settings-agents-panel__summary">
            <span class="settings-agents-panel__summary-pill">
              当前服务包含坐席总数：<strong>{{ seatSummary.total }}</strong>
            </span>
            <span class="settings-agents-panel__summary-pill">
              使用中：<strong>{{ seatSummary.used }}</strong>
              <span class="settings-agents-panel__summary-divider">·</span>
              剩余：<strong>{{ seatSummary.remaining }}</strong>
            </span>
            <button type="button" class="settings-agents-panel__summary-link" @click="emit('toast', '加购坐席功能开发中')">
              加购坐席
            </button>
          </div>
        </div>

        <button type="button" class="agent-btn agent-btn--primary settings-agents-panel__invite-btn" @click="openInviteModal">
          <span class="settings-agents-panel__invite-icon">+</span>
          <span>邀请成员</span>
        </button>
      </header>

      <!-- Tab bar: below header -->
      <nav class="settings-agents-tabs">
        <button
          type="button"
          class="settings-agents-tabs__tab"
          :class="{ 'settings-agents-tabs__tab--active': activeTab === 'agents' }"
          @click="switchTab('agents')"
        >客服</button>
        <button
          type="button"
          class="settings-agents-tabs__tab"
          :class="{ 'settings-agents-tabs__tab--active': activeTab === 'roles' }"
          @click="switchTab('roles')"
        >角色</button>
      </nav>

      <!-- 客服 Tab Content -->
      <template v-if="activeTab === 'agents' && !agentDetailVisible">
        <div class="settings-agents-panel__table-area">
          <table class="settings-agents-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>姓名</th>
                <th>昵称</th>
                <th>角色</th>
                <th>邮箱</th>
                <th>会话限制</th>
                <th>在线状态</th>
                <th>状态</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in displayList" :key="row.id" :class="{ 'settings-agents-table__row--invite': row.isInvite }">
                <td>{{ row.memberId }}</td>
                <td>
                  <div v-if="!row.isInvite" class="settings-agents-table__name-cell">
                    <span class="settings-agents-table__avatar" :style="{ background: row.avatarColor }">{{ row.avatarText }}</span>
                    <span>{{ row.name }}</span>
                    <span v-if="row.isOwner" class="settings-agents-table__owner-tag">所有者</span>
                  </div>
                  <span v-else class="settings-agents-table__empty-dash">-</span>
                </td>
                <td>{{ row.isInvite ? '待激活' : row.nickname }}</td>
                <td>
                  <span class="settings-agents-table__role-badge" :class="getRoleBadgeClass(row.roleName)">{{ row.roleName }}</span>
                </td>
                <td>{{ row.email }}</td>
                <td>{{ row.isInvite ? '-' : row.sessionLimit }}</td>
                <td>
                  <template v-if="!row.isInvite">
                    <span class="settings-agents-table__status" :class="getOnlineStatusClass(row.onlineStatus)">
                      <span class="settings-agents-table__status-dot" />
                      {{ row.onlineStatus }}
                    </span>
                  </template>
                  <span v-else class="settings-agents-table__empty-dash">-</span>
                </td>
                <td>
                  <template v-if="!row.isInvite">
                    <button
                      type="button"
                      role="switch"
                      :aria-checked="row.accountEnabled"
                      class="settings-agents-table__switch"
                      :class="{ 'settings-agents-table__switch--on': row.accountEnabled }"
                      @click="toggleAccount(row.id)"
                    >
                      <span class="settings-agents-table__switch-thumb" />
                    </button>
                  </template>
                  <span v-else class="settings-agents-table__invite-status" :class="getInviteStatusClass(row.inviteStatus)">
                    {{ row.inviteStatus }}
                  </span>
                </td>
                <td>
                  <div class="settings-agents-table__actions">
                    <button
                      type="button"
                      class="settings-agents-table__more-btn"
                      @click.stop="toggleDropdown(row.id)"
                    >···</button>
                    <div
                      v-if="activeDropdownId === row.id"
                      class="settings-agents-table__dropdown"
                    >
                      <template v-if="!row.isInvite">
                        <button
                          type="button"
                          class="settings-agents-table__dropdown-item"
                          :disabled="row.id === currentUserId"
                          @click="handleStartChat(row)"
                        >发起聊天</button>
                        <button
                          type="button"
                          class="settings-agents-table__dropdown-item"
                          @click="openAgentDetail(row)"
                        >账号详情</button>
                        <button
                          type="button"
                          class="settings-agents-table__dropdown-item"
                          :disabled="row.id === currentUserId"
                          @click="handleResetPassword(row)"
                        >修改密码</button>
                        <button
                          type="button"
                          class="settings-agents-table__dropdown-item settings-agents-table__dropdown-item--danger"
                          :disabled="row.id === currentUserId"
                          @click="handleDeleteAgent(row)"
                        >删除</button>
                      </template>
                      <template v-else>
                        <button
                          type="button"
                          class="settings-agents-table__dropdown-item"
                          :disabled="row.reinviteCooldown"
                          @click="handleReinvite(row)"
                        >重新邀请</button>
                        <button
                          type="button"
                          class="settings-agents-table__dropdown-item settings-agents-table__dropdown-item--danger"
                          @click="handleDeleteInvite(row)"
                        >删除</button>
                      </template>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <footer class="settings-agents-pagination">
          <button type="button" class="settings-agents-pagination__page settings-agents-pagination__page--active">1</button>
          <button type="button" class="settings-agents-pagination__page">2</button>
          <button type="button" class="settings-agents-pagination__page">3</button>
          <span class="settings-agents-pagination__meta">{{ pagination.pageSize }}/Page</span>
          <span class="settings-agents-pagination__meta">Total: {{ pagination.total }}</span>
        </footer>
      </template>

      <!-- Agent Detail (inline) -->
      <template v-if="activeTab === 'agents' && agentDetailVisible">
        <div class="agent-detail-view">
          <header class="agent-detail-view__header">
            <button type="button" class="agent-detail-view__back" @click="agentDetailVisible = false">
              <span class="agent-detail-view__back-arrow">‹</span>
              <span>返回列表</span>
            </button>
            <h2 class="agent-detail-view__title">成员详情</h2>
          </header>
          <div class="agent-detail-view__body agent-scroll">
            <div class="agent-detail-view__field">
              <label class="agent-detail-view__label">姓名</label>
              <span class="agent-detail-view__value">{{ selectedAgent?.name }}</span>
            </div>
            <div class="agent-detail-view__field">
              <label class="agent-detail-view__label">昵称</label>
              <span class="agent-detail-view__value">{{ selectedAgent?.nickname }}</span>
            </div>
            <div class="agent-detail-view__field">
              <label class="agent-detail-view__label">邮箱</label>
              <span class="agent-detail-view__value">{{ selectedAgent?.email }}</span>
            </div>
            <div class="agent-detail-view__field">
              <label class="agent-detail-view__label">角色</label>
              <div class="agent-detail-view__role-select">
                <select
                  v-model="selectedAgentRole"
                  class="agent-input agent-detail-view__select"
                  :disabled="selectedAgent?.isOwner"
                >
                  <option value="管理员">管理员</option>
                  <option value="客服">客服</option>
                  <option value="高级客服">高级客服</option>
                  <option value="主管">主管</option>
                </select>
                <span v-if="selectedAgent?.isOwner" class="agent-detail-view__creator-tag">项目所有者，不可修改</span>
              </div>
            </div>
            <div class="agent-detail-view__field">
              <label class="agent-detail-view__label">会话限制</label>
              <span class="agent-detail-view__value">{{ selectedAgent?.sessionLimit }}</span>
            </div>
            <div class="agent-detail-view__actions">
              <button type="button" class="agent-btn agent-btn--ghost" @click="agentDetailVisible = false">取消</button>
              <button type="button" class="agent-btn agent-btn--primary" @click="handleSaveAgentRole">保存</button>
            </div>
          </div>
        </div>
      </template>

      <!-- 角色 Tab Content -->
      <template v-if="activeTab === 'roles' && !roleDetailMode">
        <div class="settings-agents-panel__roles-area">
          <SettingsRolesPage
            @toast="(msg: string) => emit('toast', msg)"
            @view-role="handleViewRole"
            @edit-role="handleEditRole"
            @create-role="handleCreateRole"
          />
        </div>
      </template>

      <!-- Role Detail/Create/Edit -->
      <template v-if="activeTab === 'roles' && roleDetailMode">
        <SettingsRoleDetailPage
          :mode="roleDetailMode"
          :role-id="roleDetailId"
          :initial-name="roleDetailName"
          :is-system-role="roleDetailIsSystem"
          :bound-member-count="roleDetailMemberCount"
          :initial-perms="roleDetailPerms"
          @back="roleDetailMode = ''"
          @save="handleRoleSave"
          @toast="(msg: string) => emit('toast', msg)"
        />
      </template>
    </article>

    <!-- Invite modal -->
    <Teleport to="body">
      <div v-if="inviteModalVisible" class="invite-modal-overlay" @click.self="inviteModalVisible = false">
        <div class="invite-modal">
          <header class="invite-modal__header">
            <h3 class="invite-modal__title">邀请成员</h3>
            <button type="button" class="invite-modal__close" @click="inviteModalVisible = false">×</button>
          </header>
          <div class="invite-modal__body">
            <div class="invite-modal__field">
              <label class="invite-modal__label">邮箱地址</label>
              <input v-model="inviteEmail" class="agent-input" placeholder="请输入邮箱地址" />
            </div>
            <div class="invite-modal__field">
              <label class="invite-modal__label">角色</label>
              <select v-model="inviteRole" class="agent-input invite-modal__select">
                <option value="客服">客服</option>
                <option value="管理员">管理员</option>
                <option value="高级客服">高级客服</option>
                <option value="主管">主管</option>
              </select>
            </div>
          </div>
          <footer class="invite-modal__footer">
            <button type="button" class="agent-btn agent-btn--ghost" @click="inviteModalVisible = false">取消</button>
            <button
              type="button"
              class="agent-btn agent-btn--primary"
              :disabled="!inviteEmail.trim()"
              @click="handleSendInvite"
            >发送邀请</button>
          </footer>
        </div>
      </div>
    </Teleport>
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import SettingsRolesPage from "./SettingsRolesPage.vue";
import SettingsRoleDetailPage from "./SettingsRoleDetailPage.vue";

interface DisplayRow {
  id: string;
  isInvite: boolean;
  memberId: string;
  name?: string;
  avatarColor?: string;
  avatarText?: string;
  nickname?: string;
  roleName: string;
  email: string;
  sessionLimit?: number;
  onlineStatus?: string;
  accountEnabled?: boolean;
  isOwner?: boolean;
  inviteStatus?: string;
  reinviteCooldown?: boolean;
}

const emit = defineEmits<{
  (e: "toast", message: string): void;
}>();

/* Current logged-in user */
const currentUserId = "agent-cafe";

const activeTab = ref<"agents" | "roles">("agents");

const switchTab = (tab: "agents" | "roles") => {
  activeTab.value = tab;
  agentDetailVisible.value = false;
  roleDetailMode.value = "";
};

// ---- Dropdown menu ----
const activeDropdownId = ref<string | null>(null);

const toggleDropdown = (rowId: string) => {
  activeDropdownId.value = activeDropdownId.value === rowId ? null : rowId;
};

const closeDropdown = () => {
  activeDropdownId.value = null;
};

// ---- Agent list data ----
const seatSummary = computed(() => ({
  total: 10,
  used: members.value.length + inviteRecords.value.filter((r) => r.status === "待激活").length,
  remaining: 10 - members.value.length - inviteRecords.value.filter((r) => r.status === "待激活").length
}));

const pagination = computed(() => ({
  pageSize: 10,
  total: members.value.length + inviteRecords.value.length
}));

let nextMemberId = 10006;

const members = ref([
  {
    id: "agent-cafe",
    memberId: "10001",
    name: "Cafe",
    avatarColor: "#105eff",
    avatarText: "C",
    roleName: "管理员",
    nickname: "客服-莉莉",
    email: "aidanswang@gmail.com",
    sessionLimit: 10,
    onlineStatus: "在线",
    accountEnabled: true,
    isOwner: true
  },
  {
    id: "agent-mike",
    memberId: "10002",
    name: "Mike",
    avatarColor: "#30bf60",
    avatarText: "M",
    roleName: "客服",
    nickname: "客服-小明",
    email: "mike@example.com",
    sessionLimit: 8,
    onlineStatus: "在线",
    accountEnabled: true,
    isOwner: false
  },
  {
    id: "agent-lisa",
    memberId: "10003",
    name: "Lisa",
    avatarColor: "#f59e0b",
    avatarText: "L",
    roleName: "高级客服",
    nickname: "客服-小丽",
    email: "lisa@example.com",
    sessionLimit: 12,
    onlineStatus: "离开",
    accountEnabled: true,
    isOwner: false
  },
  {
    id: "agent-tom",
    memberId: "10004",
    name: "Tom",
    avatarColor: "#8b5cf6",
    avatarText: "T",
    roleName: "客服",
    nickname: "客服-阿汤",
    email: "tom@example.com",
    sessionLimit: 8,
    onlineStatus: "离线",
    accountEnabled: false,
    isOwner: false
  },
  {
    id: "agent-jenny",
    memberId: "10005",
    name: "Jenny",
    avatarColor: "#ec4899",
    avatarText: "J",
    roleName: "主管",
    nickname: "客服-珍妮",
    email: "jenny@example.com",
    sessionLimit: 15,
    onlineStatus: "在线",
    accountEnabled: true,
    isOwner: false
  }
]);

const inviteRecords = ref([
  {
    id: "invite-001",
    memberId: "10006",
    email: "newagent@example.com",
    roleName: "客服",
    invitedAt: "2025-12-10 15:30",
    status: "待激活",
    reinviteCooldown: false
  },
  {
    id: "invite-002",
    memberId: "10007",
    email: "expired@example.com",
    roleName: "高级客服",
    invitedAt: "2025-11-20 09:00",
    status: "已过期",
    reinviteCooldown: false
  }
]);

const displayList = computed<DisplayRow[]>(() => {
  const agentRows: DisplayRow[] = members.value.map((m) => ({
    id: m.id,
    isInvite: false,
    memberId: m.memberId,
    name: m.name,
    avatarColor: m.avatarColor,
    avatarText: m.avatarText,
    nickname: m.nickname,
    roleName: m.roleName,
    email: m.email,
    sessionLimit: m.sessionLimit,
    onlineStatus: m.onlineStatus,
    accountEnabled: m.accountEnabled,
    isOwner: m.isOwner
  }));

  const inviteRows: DisplayRow[] = inviteRecords.value.map((r) => ({
    id: r.id,
    isInvite: true,
    memberId: r.memberId,
    roleName: r.roleName,
    email: r.email,
    inviteStatus: r.status,
    reinviteCooldown: r.reinviteCooldown
  }));

  return [...agentRows, ...inviteRows];
});

const toggleAccount = (rowId: string) => {
  const member = members.value.find((m) => m.id === rowId);
  if (!member) return;
  member.accountEnabled = !member.accountEnabled;
  emit("toast", `${member.nickname} 账号已${member.accountEnabled ? "启用" : "停用"}`);
};

const getRoleBadgeClass = (roleName: string) => {
  if (roleName === "管理员") return "settings-agents-table__role-badge--admin";
  return "";
};

const getOnlineStatusClass = (status?: string) => {
  if (status === "离线") return "settings-agents-table__status--offline";
  if (status === "离开") return "settings-agents-table__status--away";
  return "";
};

const getInviteStatusClass = (status?: string) => {
  if (status === "已过期") return "settings-agents-table__invite-status--expired";
  return "";
};

// ---- Action handlers ----
const handleStartChat = (row: DisplayRow) => {
  closeDropdown();
  emit("toast", `正在发起与 ${row.nickname} 的聊天`);
};

const handleResetPassword = (row: DisplayRow) => {
  closeDropdown();
  emit("toast", `已向 ${row.email} 发送密码重置邮件`);
};

const handleDeleteAgent = (row: DisplayRow) => {
  closeDropdown();
  members.value = members.value.filter((m) => m.id !== row.id);
  emit("toast", `已删除客服 ${row.name}`);
};

// ---- Agent detail ----
const agentDetailVisible = ref(false);
const selectedAgent = ref<DisplayRow | null>(null);
const selectedAgentRole = ref("");

const openAgentDetail = (row: DisplayRow) => {
  closeDropdown();
  selectedAgent.value = row;
  selectedAgentRole.value = row.roleName;
  agentDetailVisible.value = true;
};

const handleSaveAgentRole = () => {
  if (!selectedAgent.value) return;
  const member = members.value.find((m) => m.id === selectedAgent.value!.id);
  if (member) {
    member.roleName = selectedAgentRole.value;
  }
  agentDetailVisible.value = false;
  emit("toast", "保存成功");
};

// ---- Invite modal ----
const inviteModalVisible = ref(false);
const inviteEmail = ref("");
const inviteRole = ref("客服");

const openInviteModal = () => {
  inviteEmail.value = "";
  inviteRole.value = "客服";
  inviteModalVisible.value = true;
};

const handleSendInvite = () => {
  if (!inviteEmail.value.trim()) return;
  const existing = inviteRecords.value.find((r) => r.email === inviteEmail.value.trim());
  if (existing) {
    existing.status = "待激活";
    existing.invitedAt = new Date().toLocaleString("zh-CN", { hour12: false }).replace(/\//g, "-");
    existing.roleName = inviteRole.value;
    emit("toast", `已重新发送邀请至 ${inviteEmail.value}`);
  } else {
    nextMemberId++;
    inviteRecords.value.push({
      id: `invite-${Date.now()}`,
      memberId: String(nextMemberId),
      email: inviteEmail.value.trim(),
      roleName: inviteRole.value,
      invitedAt: new Date().toLocaleString("zh-CN", { hour12: false }).replace(/\//g, "-"),
      status: "待激活",
      reinviteCooldown: false
    });
    emit("toast", `邀请已发送至 ${inviteEmail.value}`);
  }
  inviteModalVisible.value = false;
};

const handleReinvite = (row: DisplayRow) => {
  closeDropdown();
  const record = inviteRecords.value.find((r) => r.id === row.id);
  if (!record) return;
  record.status = "待激活";
  record.invitedAt = new Date().toLocaleString("zh-CN", { hour12: false }).replace(/\//g, "-");
  record.reinviteCooldown = true;
  emit("toast", `已重新发送邀请至 ${record.email}`);
  setTimeout(() => {
    record.reinviteCooldown = false;
  }, 60000);
};

const handleDeleteInvite = (row: DisplayRow) => {
  closeDropdown();
  inviteRecords.value = inviteRecords.value.filter((r) => r.id !== row.id);
  emit("toast", "已删除");
};

// ---- Role detail ----
const roleDetailMode = ref<"" | "view" | "create" | "edit">("");
const roleDetailId = ref("");
const roleDetailName = ref("");
const roleDetailIsSystem = ref(false);
const roleDetailMemberCount = ref(0);
const roleDetailPerms = ref<string[]>([]);

const handleViewRole = (roleId: string) => {
  roleDetailId.value = roleId;
  if (roleId === "role-admin") {
    roleDetailName.value = "管理员";
    roleDetailIsSystem.value = true;
    roleDetailMemberCount.value = 1;
    roleDetailPerms.value = [];
  } else if (roleId === "role-agent") {
    roleDetailName.value = "客服";
    roleDetailIsSystem.value = true;
    roleDetailMemberCount.value = 4;
    roleDetailPerms.value = [
      "conv-view", "conv-transfer", "conv-invite", "conv-close",
      "visitor-view",
      "archive-view",
      "personal-reply-view", "personal-reply-edit",
      "public-reply-view",
      "agent-list-view"
    ];
  } else {
    roleDetailName.value = roleId === "role-senior" ? "高级客服" : "主管";
    roleDetailIsSystem.value = false;
    roleDetailMemberCount.value = roleId === "role-senior" ? 2 : 1;
    roleDetailPerms.value = [
      "conv-view", "conv-transfer", "conv-invite", "conv-close",
      "visitor-view",
      "archive-view",
      "report-view",
      "personal-reply-view", "personal-reply-edit",
      "public-reply-view"
    ];
  }
  roleDetailMode.value = "view";
};

const handleEditRole = (roleId: string) => {
  handleViewRole(roleId);
  roleDetailMode.value = "edit";
};

const handleCreateRole = () => {
  roleDetailId.value = "";
  roleDetailName.value = "";
  roleDetailIsSystem.value = false;
  roleDetailMemberCount.value = 0;
  roleDetailPerms.value = [];
  roleDetailMode.value = "create";
};

const handleRoleSave = (payload: { name: string; permissions: string[] }) => {
  roleDetailMode.value = "";
  emit("toast", "保存成功");
};
</script>

<style scoped>
.settings-agents-view {
  height: 100%;
  min-height: 0;
  padding: 12px;
}

.settings-agents-panel {
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

/* Agent list header */
.settings-agents-panel__header {
  align-items: flex-start;
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding: 18px 18px 8px;
}

.settings-agents-panel__title-block {
  min-width: 0;
}

.settings-agents-panel__title {
  color: #252525;
  font-size: 20px;
  font-weight: 600;
  line-height: 28px;
  margin: 0;
}

.settings-agents-panel__summary {
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
}

.settings-agents-panel__summary-pill {
  align-items: center;
  background: #f5f7f9;
  border-radius: 6px;
  color: #222222;
  display: inline-flex;
  font-size: 14px;
  gap: 2px;
  line-height: 20px;
  min-height: 28px;
  padding: 4px 8px;
}

.settings-agents-panel__summary-pill strong {
  font-weight: 600;
}

.settings-agents-panel__summary-divider {
  color: #6b7280;
  margin: 0 2px;
}

.settings-agents-panel__summary-link {
  background: transparent;
  border: 0;
  color: #105eff;
  cursor: pointer;
  font-size: 14px;
  line-height: 20px;
  padding: 0;
}

.settings-agents-panel__summary-link:hover {
  text-decoration: underline;
}

.settings-agents-panel__invite-btn {
  border-radius: 10px;
  font-size: 14px;
  font-weight: 500;
  gap: 4px;
  min-width: 96px;
  padding: 7px 12px 7px 10px;
}

.settings-agents-panel__invite-icon {
  display: inline-block;
  font-size: 15px;
  font-weight: 600;
  line-height: 1;
  transform: translateY(-0.5px);
}

/* Tabs */
.settings-agents-tabs {
  border-bottom: 1px solid #edf1f5;
  display: flex;
  flex-shrink: 0;
  gap: 0;
  padding: 0 18px;
}

.settings-agents-tabs__tab {
  background: transparent;
  border: 0;
  color: #75869c;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  height: 44px;
  padding: 0 16px;
  position: relative;
  transition: color 0.15s;
}

.settings-agents-tabs__tab:hover {
  color: #252525;
}

.settings-agents-tabs__tab--active {
  color: #105eff;
}

.settings-agents-tabs__tab--active::after {
  background: #105eff;
  border-radius: 2px 2px 0 0;
  bottom: 0;
  content: "";
  height: 3px;
  left: 16px;
  position: absolute;
  right: 16px;
}

/* Table */
.settings-agents-panel__table-area {
  flex: 1;
  min-height: 0;
  overflow: auto;
  padding: 0 18px;
}

.settings-agents-table {
  border-collapse: collapse;
  color: #252525;
  table-layout: fixed;
  width: 100%;
}

.settings-agents-table th,
.settings-agents-table td {
  border-bottom: 1px solid #edf1f5;
  font-size: 13px;
  line-height: 19px;
  padding: 14px 8px;
  text-align: left;
  vertical-align: middle;
}

.settings-agents-table th {
  background: #eef2f5;
  color: #222222;
  font-weight: 600;
  padding-top: 8px;
  padding-bottom: 8px;
}

.settings-agents-table th:nth-child(1) { width: 7%; }
.settings-agents-table th:nth-child(2) { width: 14%; }
.settings-agents-table th:nth-child(3) { width: 10%; }
.settings-agents-table th:nth-child(4) { width: 8%; }
.settings-agents-table th:nth-child(5) { width: 18%; }
.settings-agents-table th:nth-child(6) { width: 8%; }
.settings-agents-table th:nth-child(7) { width: 8%; }
.settings-agents-table th:nth-child(8) { width: 8%; }
.settings-agents-table th:nth-child(9) { width: 5%; }

.settings-agents-table__row--invite {
  background: #fafbfc;
}

.settings-agents-table__name-cell {
  align-items: center;
  display: inline-flex;
  gap: 8px;
}

.settings-agents-table__avatar {
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

.settings-agents-table__owner-tag {
  background: #fef3c7;
  border-radius: 4px;
  color: #d97706;
  display: inline-flex;
  font-size: 10px;
  font-weight: 500;
  line-height: 14px;
  padding: 0 5px;
  white-space: nowrap;
}

.settings-agents-table__role-badge {
  background: #dce9ff;
  border-radius: 4px;
  color: #105eff;
  display: inline-flex;
  font-size: 10px;
  font-weight: 500;
  line-height: 14px;
  padding: 0 5px;
  white-space: nowrap;
}

.settings-agents-table__role-badge--admin {
  background: #fef3c7;
  color: #d97706;
}

.settings-agents-table__empty-dash {
  color: #c7cdd8;
}

.settings-agents-table__status {
  align-items: center;
  color: #252525;
  display: inline-flex;
  gap: 6px;
}

.settings-agents-table__status-dot {
  background: #30bf60;
  border-radius: 50%;
  display: block;
  height: 8px;
  width: 8px;
}

.settings-agents-table__status--offline .settings-agents-table__status-dot {
  background: #c7cdd8;
}

.settings-agents-table__status--away .settings-agents-table__status-dot {
  background: #f59e0b;
}

.settings-agents-table__switch {
  align-items: center;
  background: #d2d7e0;
  border: 0;
  border-radius: 999px;
  cursor: pointer;
  display: inline-flex;
  height: 16px;
  padding: 2px;
  transition: background-color 0.15s ease;
  width: 28px;
}

.settings-agents-table__switch--on {
  background: #105eff;
}

.settings-agents-table__switch-thumb {
  background: #ffffff;
  border-radius: 50%;
  display: block;
  height: 12px;
  transform: translateX(0);
  transition: transform 0.15s ease;
  width: 12px;
}

.settings-agents-table__switch--on .settings-agents-table__switch-thumb {
  transform: translateX(12px);
}

.settings-agents-table__invite-status {
  background: #dbeafe;
  border-radius: 4px;
  color: #2563eb;
  font-size: 12px;
  line-height: 18px;
  padding: 1px 8px;
}

.settings-agents-table__invite-status--expired {
  background: #fee2e2;
  color: #dc2626;
}

.settings-agents-table__actions {
  position: relative;
}

.settings-agents-table__more-btn {
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

.settings-agents-table__more-btn:hover {
  background: #f5f7f9;
  border-color: #c7cdd8;
}

.settings-agents-table__dropdown {
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

.settings-agents-table__dropdown-item {
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

.settings-agents-table__dropdown-item:hover:not(:disabled) {
  background: #f5f7f9;
}

.settings-agents-table__dropdown-item:disabled {
  color: #c7cdd8;
  cursor: not-allowed;
}

.settings-agents-table__dropdown-item--danger {
  color: #ef4444;
}

.settings-agents-table__dropdown-item--danger:disabled {
  color: #fca5a5;
}

/* Pagination */
.settings-agents-pagination {
  align-items: center;
  display: inline-flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
  margin: auto;
  padding: 16px 18px 24px;
}

.settings-agents-pagination__page {
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

.settings-agents-pagination__page--active {
  background: #105eff;
  border-color: #105eff;
  color: #ffffff;
}

.settings-agents-pagination__meta {
  color: #4b5563;
  font-size: 13px;
  line-height: 20px;
}

/* Roles area */
.settings-agents-panel__roles-area {
  flex: 1;
  min-height: 0;
  padding: 18px;
}

/* Agent detail view */
.agent-detail-view {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
}

.agent-detail-view__header {
  align-items: center;
  border-bottom: 1px solid #edf1f5;
  display: flex;
  gap: 12px;
  padding: 14px 18px;
}

.agent-detail-view__back {
  align-items: center;
  background: transparent;
  border: 0;
  color: #105eff;
  cursor: pointer;
  display: inline-flex;
  font-size: 14px;
  gap: 4px;
  padding: 0;
}

.agent-detail-view__back-arrow {
  font-size: 18px;
  line-height: 1;
}

.agent-detail-view__back:hover {
  text-decoration: underline;
}

.agent-detail-view__title {
  color: #252525;
  font-size: 18px;
  font-weight: 600;
  margin: 0;
}

.agent-detail-view__body {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 24px 18px;
}

.agent-detail-view__field {
  margin-bottom: 20px;
}

.agent-detail-view__label {
  color: #75869c;
  display: block;
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 6px;
}

.agent-detail-view__value {
  color: #252525;
  font-size: 14px;
}

.agent-detail-view__role-select {
  display: flex;
  align-items: center;
  gap: 12px;
}

.agent-detail-view__select {
  max-width: 200px;
}

.agent-detail-view__creator-tag {
  color: #f59e0b;
  font-size: 12px;
}

.agent-detail-view__actions {
  display: flex;
  gap: 12px;
  margin-top: 32px;
}

/* Invite modal */
.invite-modal-overlay {
  align-items: center;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  inset: 0;
  justify-content: center;
  position: fixed;
  z-index: 1000;
}

.invite-modal {
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  max-width: 480px;
  width: 90%;
}

.invite-modal__header {
  align-items: center;
  border-bottom: 1px solid #edf1f5;
  display: flex;
  justify-content: space-between;
  padding: 16px 20px;
}

.invite-modal__title {
  color: #252525;
  font-size: 16px;
  font-weight: 600;
  margin: 0;
}

.invite-modal__close {
  background: transparent;
  border: 0;
  color: #75869c;
  cursor: pointer;
  font-size: 22px;
  line-height: 1;
  padding: 0;
}

.invite-modal__body {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px;
}

.invite-modal__field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.invite-modal__label {
  color: #252525;
  font-size: 13px;
  font-weight: 500;
}

.invite-modal__select {
  max-width: 200px;
}

.invite-modal__footer {
  border-top: 1px solid #edf1f5;
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding: 14px 20px;
}

@media (max-width: 1280px) {
  .settings-agents-panel__header {
    align-items: stretch;
    flex-direction: column;
  }

  .settings-agents-panel__invite-btn {
    align-self: flex-end;
  }
}
</style>
