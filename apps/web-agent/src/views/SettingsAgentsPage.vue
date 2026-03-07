<template>
  <section class="settings-agents-view">
    <article class="settings-agents-panel agent-panel">
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

        <button type="button" class="agent-btn agent-btn--primary settings-agents-panel__invite-btn" @click="emit('toast', '邀请成员功能开发中')">
          <span class="settings-agents-panel__invite-icon">+</span>
          <span>邀请成员</span>
        </button>
      </header>

      <div class="settings-agents-panel__table-area">
        <table class="settings-agents-table">
          <thead>
            <tr>
              <th>姓名</th>
              <th>昵称</th>
              <th>邮箱</th>
              <th>会话限制</th>
              <th>在线状态</th>
              <th>账号状态</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="member in members" :key="member.id">
              <td>
                <div class="settings-agents-table__name-cell">
                  <span>{{ member.name }}</span>
                  <span v-if="member.roleLabel" class="settings-agents-table__role-badge">{{ member.roleLabel }}</span>
                </div>
              </td>
              <td>{{ member.nickname }}</td>
              <td>{{ member.email }}</td>
              <td>{{ member.sessionLimit }}</td>
              <td>
                <span class="settings-agents-table__status" :class="{ 'settings-agents-table__status--offline': !member.online }">
                  <span class="settings-agents-table__status-dot" />
                  {{ member.online ? '在线' : '离线' }}
                </span>
              </td>
              <td>
                <button
                  type="button"
                  role="switch"
                  :aria-checked="member.accountEnabled"
                  class="settings-agents-table__switch"
                  :class="{ 'settings-agents-table__switch--on': member.accountEnabled }"
                  @click="toggleAccount(member.id)"
                >
                  <span class="settings-agents-table__switch-thumb" />
                </button>
              </td>
              <td>
                <button type="button" class="settings-agents-table__action-btn" :aria-label="`更多操作：${member.nickname}`" @click="emit('toast', `${member.nickname} 的更多操作开发中`)">
                  <span />
                  <span />
                  <span />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <footer class="settings-agents-pagination">
        <button type="button" class="settings-agents-pagination__page settings-agents-pagination__page--active">1</button>
        <button type="button" class="settings-agents-pagination__page">2</button>
        <button type="button" class="settings-agents-pagination__page">3</button>
        <button type="button" class="settings-agents-pagination__page">4</button>
        <button type="button" class="settings-agents-pagination__page">5</button>
        <span class="settings-agents-pagination__ellipsis">…</span>
        <button type="button" class="settings-agents-pagination__page">20</button>
        <button type="button" class="settings-agents-pagination__page settings-agents-pagination__page--arrow" aria-label="下一页">›</button>
        <span class="settings-agents-pagination__meta">{{ pagination.pageSize }}/Page</span>
        <span class="settings-agents-pagination__meta">Total: {{ pagination.total }}</span>
      </footer>
    </article>
  </section>
</template>

<script setup lang="ts">
import { ref } from "vue";

interface AgentMember {
  id: string;
  name: string;
  roleLabel?: string;
  nickname: string;
  email: string;
  sessionLimit: number;
  online: boolean;
  accountEnabled: boolean;
}

const emit = defineEmits<{
  (e: "toast", message: string): void;
}>();

const seatSummary = {
  total: 10,
  used: 5,
  remaining: 5
};

const pagination = {
  pageSize: 9,
  total: 11
};

const members = ref<AgentMember[]>([
  {
    id: "agent-cafe",
    name: "Cafe",
    roleLabel: "管理员",
    nickname: "客服-莉莉",
    email: "aidanswang@gmail.com",
    sessionLimit: 10,
    online: true,
    accountEnabled: false
  }
]);

const toggleAccount = (memberId: string) => {
  const member = members.value.find((item) => item.id === memberId);
  if (!member) {
    return;
  }
  member.accountEnabled = !member.accountEnabled;
  emit("toast", `${member.nickname} 账号已${member.accountEnabled ? "启用" : "停用"}`);
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
  padding: 14px 10px;
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

.settings-agents-table th:nth-child(1) {
  width: 13%;
}

.settings-agents-table th:nth-child(2) {
  width: 14%;
}

.settings-agents-table th:nth-child(3) {
  width: 25%;
}

.settings-agents-table th:nth-child(4) {
  width: 14%;
}

.settings-agents-table th:nth-child(5) {
  width: 14%;
}

.settings-agents-table th:nth-child(6) {
  width: 12%;
}

.settings-agents-table th:nth-child(7) {
  width: 8%;
}

.settings-agents-table__name-cell {
  align-items: center;
  display: inline-flex;
  gap: 8px;
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

.settings-agents-table__action-btn {
  align-items: center;
  background: transparent;
  border: 0;
  color: #252525;
  cursor: pointer;
  display: inline-flex;
  flex-direction: column;
  gap: 2px;
  justify-content: center;
  padding: 0;
  width: 18px;
}

.settings-agents-table__action-btn span {
  background: currentColor;
  border-radius: 50%;
  display: block;
  height: 3px;
  width: 3px;
}

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

.settings-agents-pagination__page--arrow {
  font-size: 16px;
  line-height: 1;
}

.settings-agents-pagination__ellipsis,
.settings-agents-pagination__meta {
  color: #4b5563;
  font-size: 13px;
  line-height: 20px;
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
