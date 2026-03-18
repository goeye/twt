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

        <button type="button" class="agent-btn agent-btn--primary settings-agents-panel__invite-btn" @click="handleHeaderAction">
          <span class="settings-agents-panel__invite-icon">+</span>
          <span>{{ activeTab === 'roles' ? '新增角色' : '邀请成员' }}</span>
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
      <template v-if="activeTab === 'agents'">
        <div class="settings-agents-panel__table-area">
          <table class="settings-agents-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>姓名</th>
                <th>昵称</th>
                <th>加入时间</th>
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
                <td>{{ row.isInvite ? '-' : row.memberId }}</td>
                <td>
                  <div v-if="!row.isInvite" class="settings-agents-table__name-cell">
                    <span class="settings-agents-table__avatar" :style="{ background: row.avatarColor }">{{ row.avatarText }}</span>
                    <span>{{ row.name }}</span>
                  </div>
                  <span v-else class="settings-agents-table__empty-dash">-</span>
                </td>
                <td>{{ row.isInvite ? '-' : (row.nickname || '-') }}</td>
                <td>{{ row.isInvite ? '-' : (row.joinedAt || '-') }}</td>
                <td>
                  <span class="settings-agents-table__role-text">{{ row.roleName }}</span>
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
                  <span v-else class="settings-agents-table__invite-text">
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
                          @click="handleCancelInvite(row)"
                        >取消邀请</button>
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

      <!-- 角色 Tab Content -->
      <template v-if="activeTab === 'roles'">
        <div class="settings-agents-panel__roles-area">
          <SettingsRolesPage
            @toast="(msg: string) => emit('toast', msg)"
            @view-role="(roleId: string) => emit('view-role', roleId)"
            @edit-role="(roleId: string) => emit('edit-role', roleId)"
          />
        </div>
      </template>
    </article>

    <!-- Delete confirmation modal -->
    <Teleport to="body">
      <div v-if="deleteConfirmVisible" class="delete-confirm-overlay" @click.self="deleteConfirmVisible = false">
        <div class="delete-confirm">
          <h3 class="delete-confirm__title">删除客服</h3>
          <p class="delete-confirm__desc">删除后不可恢复，确认删除？</p>
          <footer class="delete-confirm__footer">
            <button type="button" class="agent-btn agent-btn--ghost delete-confirm__cancel" @click="deleteConfirmVisible = false">取 消</button>
            <button type="button" class="agent-btn agent-btn--primary delete-confirm__ok" @click="confirmDeleteAgent">确认删除</button>
          </footer>
        </div>
      </div>
    </Teleport>

    <!-- Cancel invite confirmation modal -->
    <Teleport to="body">
      <div v-if="cancelInviteConfirmVisible" class="delete-confirm-overlay" @click.self="cancelInviteConfirmVisible = false">
        <div class="delete-confirm">
          <h3 class="delete-confirm__title">取消邀请</h3>
          <p class="delete-confirm__desc">取消后本次邀请将失效，是否取消？</p>
          <footer class="delete-confirm__footer">
            <button type="button" class="agent-btn agent-btn--ghost delete-confirm__cancel" @click="cancelInviteConfirmVisible = false">取 消</button>
            <button type="button" class="agent-btn agent-btn--primary delete-confirm__ok" @click="confirmCancelInvite">确 定</button>
          </footer>
        </div>
      </div>
    </Teleport>

    <!-- Invite modal -->
    <Teleport to="body">
      <div v-if="inviteModalVisible" class="invite-modal-overlay" @click.self="inviteModalVisible = false">
        <div class="invite-modal">
          <header class="invite-modal__header">
            <h3 class="invite-modal__title">邀请客服加入你的团队</h3>
            <button type="button" class="invite-modal__close" @click="inviteModalVisible = false">×</button>
          </header>
          <div class="invite-modal__body">
            <p class="invite-modal__desc">团队成员将通过电子邮件被邀请，最多一次可以发送 10 个邀请</p>
            <div class="invite-modal__field">
              <label class="invite-modal__label">角色</label>
              <select v-model="inviteRole" class="agent-input invite-modal__select">
                <option value="客服">客服</option>
                <option value="高级客服">高级客服</option>
                <option value="主管">主管</option>
              </select>
            </div>
            <textarea
              v-model="inviteEmail"
              class="agent-input invite-modal__textarea"
              placeholder="请输入电子邮箱地址"
              rows="5"
            />
            <button
              type="button"
              class="agent-btn agent-btn--primary invite-modal__submit"
              :disabled="!inviteEmail.trim()"
              @click="handleSendInvite"
            >邀请</button>
          </div>
        </div>
      </div>
    </Teleport>
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import SettingsRolesPage from "./SettingsRolesPage.vue";
import { FEATURES } from "../lib/plan";
import { usePlan } from "../composables/usePlan";

interface DisplayRow {
  id: string;
  isInvite: boolean;
  memberId: string;
  name?: string;
  avatarColor?: string;
  avatarText?: string;
  nickname?: string;
  joinedAt?: string;
  roleName: string;
  email: string;
  sessionLimit?: number;
  onlineStatus?: string;
  accountEnabled?: boolean;
  isOwner?: boolean;
  inviteStatus?: string;
}

const props = withDefaults(
  defineProps<{
    initialTab?: "agents" | "roles";
  }>(),
  { initialTab: "agents" }
);

const emit = defineEmits<{
  (e: "toast", message: string): void;
  (e: "view-agent-detail", agent: DisplayRow): void;
  (e: "view-role", roleId: string): void;
  (e: "edit-role", roleId: string): void;
  (e: "create-role"): void;
}>();

/* Current logged-in user */
const currentUserId = "agent-cafe";

const activeTab = ref<"agents" | "roles">(props.initialTab);

const switchTab = (tab: "agents" | "roles") => {
  activeTab.value = tab;
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
  used: members.value.length + inviteRecords.value.filter((r) => r.status === "邀请中").length,
  remaining: 10 - members.value.length - inviteRecords.value.filter((r) => r.status === "邀请中").length
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
    roleName: "超级管理员",
    nickname: "客服-莉莉",
    joinedAt: "2025-06-15",
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
    joinedAt: "2025-08-20",
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
    joinedAt: "2025-09-10",
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
    joinedAt: "2025-10-05",
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
    joinedAt: "2025-07-01",
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
    status: "邀请中"
  },
  {
    id: "invite-002",
    memberId: "10007",
    email: "expired@example.com",
    roleName: "高级客服",
    invitedAt: "2025-11-20 09:00",
    status: "邀请中"
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
    joinedAt: m.joinedAt,
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
    inviteStatus: r.status
  }));

  return [...agentRows, ...inviteRows];
});

const toggleAccount = (rowId: string) => {
  const member = members.value.find((m) => m.id === rowId);
  if (!member) return;
  member.accountEnabled = !member.accountEnabled;
  emit("toast", `${member.nickname} 账号已${member.accountEnabled ? "启用" : "停用"}`);
};

const getOnlineStatusClass = (status?: string) => {
  if (status === "离线") return "settings-agents-table__status--offline";
  if (status === "离开") return "settings-agents-table__status--away";
  return "";
};

// ---- Action handlers ----
const { canUse, guardFeature } = usePlan();

const handleStartChat = (row: DisplayRow) => {
  closeDropdown();
  emit("toast", `正在发起与 ${row.nickname} 的聊天`);
};

const handleResetPassword = (row: DisplayRow) => {
  closeDropdown();
  emit("toast", `已向 ${row.email} 发送密码重置邮件`);
};

const deleteConfirmVisible = ref(false);
const deleteTargetAgent = ref<DisplayRow | null>(null);

const handleDeleteAgent = (row: DisplayRow) => {
  closeDropdown();
  deleteTargetAgent.value = row;
  deleteConfirmVisible.value = true;
};

const confirmDeleteAgent = () => {
  if (!deleteTargetAgent.value) return;
  const target = deleteTargetAgent.value;
  members.value = members.value.filter((m) => m.id !== target.id);
  emit("toast", "删除成功");
  deleteConfirmVisible.value = false;
  deleteTargetAgent.value = null;
};

// ---- Agent detail ----
const openAgentDetail = (row: DisplayRow) => {
  closeDropdown();
  emit("view-agent-detail", row);
};

// ---- Header action ----
const handleHeaderAction = () => {
  if (activeTab.value === "roles") {
    if (!guardFeature(FEATURES.ROLES_MANAGE)) return;
    emit("create-role");
  } else {
    openInviteModal();
  }
};

// ---- Invite modal ----
const inviteModalVisible = ref(false);
const inviteEmail = ref("");
const inviteRole = ref("客服");
const dailyInviteCount = ref(0);

const maxDailyInvites = computed(() => seatSummary.value.total * 2);
const remainingDailyInvites = computed(() => maxDailyInvites.value - dailyInviteCount.value);

const openInviteModal = () => {
  inviteEmail.value = "";
  inviteRole.value = "客服";
  inviteModalVisible.value = true;
};

const parseEmails = (raw: string): string[] => {
  return raw
    .split(/[\n,;]+/)
    .map((e) => e.trim())
    .filter((e) => e.length > 0);
};

const handleSendInvite = () => {
  if (!inviteEmail.value.trim()) return;

  const emails = parseEmails(inviteEmail.value);
  if (emails.length === 0) return;

  const maxCount = maxDailyInvites.value;
  const remainCount = remainingDailyInvites.value;

  // 已达上限
  if (remainCount <= 0) {
    emit("toast", `今日邀请次数已达 ${maxCount} 上限`);
    return;
  }

  // 输入邮箱数大于剩余次数
  if (emails.length > remainCount) {
    emit("toast", `今天可邀请 ${maxCount} 次，还剩 ${remainCount} 次`);
    return;
  }

  // 逐个处理邀请
  for (const email of emails) {
    const existing = inviteRecords.value.find((r) => r.email === email);
    if (existing) {
      existing.status = "邀请中";
      existing.invitedAt = new Date().toLocaleString("zh-CN", { hour12: false }).replace(/\//g, "-");
      existing.roleName = inviteRole.value;
    } else {
      nextMemberId++;
      inviteRecords.value.push({
        id: `invite-${Date.now()}-${nextMemberId}`,
        memberId: String(nextMemberId),
        email,
        roleName: inviteRole.value,
        invitedAt: new Date().toLocaleString("zh-CN", { hour12: false }).replace(/\//g, "-"),
        status: "邀请中"
      });
    }
    dailyInviteCount.value++;
  }

  emit("toast", emails.length === 1 ? `邀请已发送至 ${emails[0]}` : `邀请已发送至 ${emails.length} 个邮箱`);
  inviteModalVisible.value = false;
};

const cancelInviteConfirmVisible = ref(false);
const cancelInviteTarget = ref<DisplayRow | null>(null);

const handleCancelInvite = (row: DisplayRow) => {
  closeDropdown();
  cancelInviteTarget.value = row;
  cancelInviteConfirmVisible.value = true;
};

const confirmCancelInvite = () => {
  if (!cancelInviteTarget.value) return;
  inviteRecords.value = inviteRecords.value.filter((r) => r.id !== cancelInviteTarget.value!.id);
  emit("toast", "邀请已取消");
  cancelInviteConfirmVisible.value = false;
  cancelInviteTarget.value = null;
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
  margin-bottom: 4px;
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

.settings-agents-table th:nth-child(1) { width: 6%; }
.settings-agents-table th:nth-child(2) { width: 12%; }
.settings-agents-table th:nth-child(3) { width: 9%; }
.settings-agents-table th:nth-child(4) { width: 10%; }
.settings-agents-table th:nth-child(5) { width: 8%; }
.settings-agents-table th:nth-child(6) { width: 16%; }
.settings-agents-table th:nth-child(7) { width: 8%; }
.settings-agents-table th:nth-child(8) { width: 8%; }
.settings-agents-table th:nth-child(9) { width: 7%; }
.settings-agents-table th:nth-child(10) { width: 5%; }

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

.settings-agents-table__role-text {
  color: #222222;
  font-size: 13px;
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

.settings-agents-table__invite-text {
  color: #9ca3af;
  font-size: 13px;
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
  overflow: auto;
  padding: 0 18px;
}

/* Delete confirmation modal */
.delete-confirm-overlay {
  align-items: center;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  inset: 0;
  justify-content: center;
  position: fixed;
  z-index: 1000;
}

.delete-confirm {
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  max-width: 400px;
  padding: 28px 32px 24px;
  width: 90%;
}

.delete-confirm__title {
  color: #252525;
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 12px;
}

.delete-confirm__desc {
  color: #75869c;
  font-size: 14px;
  line-height: 22px;
  margin: 0 0 28px;
}

.delete-confirm__footer {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.delete-confirm__cancel {
  border: 1px solid #dbe1ea;
  border-radius: 8px;
  font-size: 14px;
  min-width: 72px;
  padding: 8px 20px;
}

.delete-confirm__ok {
  border-radius: 8px;
  font-size: 14px;
  min-width: 96px;
  padding: 8px 20px;
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
  max-width: 520px;
  width: 90%;
}

.invite-modal__header {
  align-items: center;
  display: flex;
  justify-content: space-between;
  padding: 28px 28px 0;
}

.invite-modal__title {
  color: #252525;
  font-size: 18px;
  font-weight: 600;
  margin: 0;
}

.invite-modal__close {
  background: transparent;
  border: 0;
  color: #252525;
  cursor: pointer;
  font-size: 22px;
  line-height: 1;
  padding: 0;
}

.invite-modal__close:hover {
  opacity: 0.6;
}

.invite-modal__body {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px 28px 28px;
}

.invite-modal__desc {
  color: #75869c;
  font-size: 14px;
  line-height: 22px;
  margin: 0;
}

.invite-modal__textarea {
  border: 1px solid #dbe1ea;
  border-radius: 10px;
  color: #252525;
  font-size: 14px;
  line-height: 1.5;
  min-height: 120px;
  padding: 12px 14px;
  resize: vertical;
  transition: border-color 0.15s;
  width: 100%;
}

.invite-modal__textarea:focus {
  border-color: #105eff;
  outline: none;
}

.invite-modal__textarea::placeholder {
  color: #b0b8c8;
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

.invite-modal__submit {
  border-radius: 10px;
  font-size: 15px;
  font-weight: 500;
  padding: 12px;
  width: 100%;
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
