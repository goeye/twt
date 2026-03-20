<template>
  <section class="agent-content-page visitors-page">
    <header class="agent-content-header">
      <h1 class="agent-content-title">{{ activeKey === 'online-visitors' ? '在线访客' : '全部访客' }}</h1>
    </header>

    <!-- 筛选栏 -->
    <div class="visitor-filter-bar">
      <div class="visitor-filter-bar__left">
        <div class="visitor-filter-group">
          <select v-model="searchField" class="visitor-select visitor-select--field">
            <option value="name">姓名</option>
            <option value="remark">备注名</option>
            <option value="email">邮箱</option>
            <option value="phone">电话</option>
          </select>
          <div class="visitor-search-input-wrap">
            <svg class="visitor-search-input-wrap__icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input v-model="searchKeyword" class="agent-input visitor-search-input" placeholder="请输入" />
          </div>
        </div>

        <select v-model="filterTag" class="visitor-select visitor-select--tag">
          <option value="">标签</option>
          <option value="VIP">VIP</option>
          <option value="普通">普通</option>
        </select>

        <select v-if="activeKey === 'all-visitors'" v-model="filterChannel" class="visitor-select visitor-select--channel">
          <option value="">来源渠道</option>
          <option value="web">Web</option>
          <option value="email">Email</option>
        </select>

        <div class="visitor-date-input-wrap">
          <input class="agent-input visitor-date-input" placeholder="首次访问" readonly />
          <svg class="visitor-date-input-wrap__icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
        </div>

        <div v-if="activeKey === 'all-visitors'" class="visitor-date-input-wrap">
          <input class="agent-input visitor-date-input" placeholder="最后访问" readonly />
          <svg class="visitor-date-input-wrap__icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
        </div>
      </div>

      <div class="visitor-filter-bar__right">
        <button type="button" class="agent-btn agent-btn--primary" @click="emit('toast', '搜索功能开发中')">搜索</button>
        <button type="button" class="agent-btn agent-btn--ghost" @click="handleReset">重置</button>
      </div>
    </div>

    <!-- 在线访客表格 -->
    <div v-if="activeKey === 'online-visitors'" class="doc-table-wrap">
      <table class="doc-table visitor-table">
        <thead>
          <tr>
            <th class="doc-table__th">姓名</th>
            <th class="doc-table__th">备注名</th>
            <th class="doc-table__th">邮箱</th>
            <th class="doc-table__th">电话</th>
            <th class="doc-table__th">标签</th>
            <th class="doc-table__th">
              <span class="visitor-th--sortable">
                首次访问
                <svg class="visitor-sort-icon" width="10" height="14" viewBox="0 0 10 14" fill="currentColor">
                  <path d="M5 0L9.33 5H0.67L5 0Z" opacity="0.3"/><path d="M5 14L0.67 9H9.33L5 14Z" opacity="0.3"/>
                </svg>
              </span>
            </th>
            <th class="doc-table__th">最后访问页面</th>
            <th class="doc-table__th">IP 地址</th>
            <th class="doc-table__th doc-table__th--action">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in onlineVisitorsList" :key="item.id" class="doc-table__row">
            <td class="doc-table__td">
              <a class="visitor-name-link" href="javascript:void(0)" @click.prevent="emit('toast', '访客详情开发中')">{{ item.name }}</a>
            </td>
            <td class="doc-table__td">{{ item.remark }}</td>
            <td class="doc-table__td">{{ item.email }}</td>
            <td class="doc-table__td">{{ item.phone }}</td>
            <td class="doc-table__td">{{ item.tag }}</td>
            <td class="doc-table__td">{{ item.firstVisit }}</td>
            <td class="doc-table__td">{{ item.lastPage }}</td>
            <td class="doc-table__td">{{ item.ip }}</td>
            <td class="doc-table__td doc-table__td--action visitor-action-cell">
              <button
                type="button"
                class="doc-action-btn"
                @click="toggleActionMenu(item.id)"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <circle cx="8" cy="3" r="1.5"/><circle cx="8" cy="8" r="1.5"/><circle cx="8" cy="13" r="1.5"/>
                </svg>
              </button>
              <div v-if="openMenuId === item.id" class="visitor-action-menu">
                <button type="button" class="visitor-action-menu__item" @click="handleMenuAction('创建会话')">创建会话</button>
                <button v-if="item.channelType !== 'email'" type="button" class="visitor-action-menu__item" @click="handleMenuAction('发起聊天')">发起聊天</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 全部访客表格 -->
    <div v-else class="doc-table-wrap">
      <table class="doc-table visitor-table">
        <thead>
          <tr>
            <th class="doc-table__th">姓名</th>
            <th class="doc-table__th">备注名</th>
            <th class="doc-table__th">邮箱</th>
            <th class="doc-table__th">电话</th>
            <th class="doc-table__th">标签</th>
            <th class="doc-table__th">来源渠道</th>
            <th class="doc-table__th">
              <span class="visitor-th--sortable">
                首次访问
                <svg class="visitor-sort-icon" width="10" height="14" viewBox="0 0 10 14" fill="currentColor">
                  <path d="M5 0L9.33 5H0.67L5 0Z" opacity="0.3"/><path d="M5 14L0.67 9H9.33L5 14Z" opacity="0.3"/>
                </svg>
              </span>
            </th>
            <th class="doc-table__th">
              <span class="visitor-th--sortable">
                最后访问
                <svg class="visitor-sort-icon" width="10" height="14" viewBox="0 0 10 14" fill="currentColor">
                  <path d="M5 0L9.33 5H0.67L5 0Z" opacity="0.3"/><path d="M5 14L0.67 9H9.33L5 14Z" opacity="0.3"/>
                </svg>
              </span>
            </th>
            <th class="doc-table__th">访问轨迹数</th>
            <th class="doc-table__th">IP 地址</th>
            <th class="doc-table__th doc-table__th--action">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in allVisitorsList" :key="item.id" class="doc-table__row">
            <td class="doc-table__td">
              <a class="visitor-name-link" href="javascript:void(0)" @click.prevent="emit('toast', '访客详情开发中')">{{ item.name }}</a>
            </td>
            <td class="doc-table__td">{{ item.remark }}</td>
            <td class="doc-table__td">{{ item.email }}</td>
            <td class="doc-table__td">{{ item.phone }}</td>
            <td class="doc-table__td">{{ item.tag }}</td>
            <td class="doc-table__td">{{ item.channelType === 'email' ? 'Email' : 'Web' }}</td>
            <td class="doc-table__td">{{ item.firstVisit }}</td>
            <td class="doc-table__td">{{ item.lastVisit }}</td>
            <td class="doc-table__td" style="text-align: center;">{{ item.traceCount }}</td>
            <td class="doc-table__td">{{ item.ip }}</td>
            <td class="doc-table__td doc-table__td--action visitor-action-cell">
              <button
                type="button"
                class="doc-action-btn"
                @click="toggleActionMenu(item.id)"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <circle cx="8" cy="3" r="1.5"/><circle cx="8" cy="8" r="1.5"/><circle cx="8" cy="13" r="1.5"/>
                </svg>
              </button>
              <div v-if="openMenuId === item.id" class="visitor-action-menu">
                <button type="button" class="visitor-action-menu__item" @click="handleMenuAction('创建会话')">创建会话</button>
                <button v-if="item.channelType !== 'email'" type="button" class="visitor-action-menu__item" @click="handleMenuAction('发起聊天')">发起聊天</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 分页 -->
    <div class="doc-pagination">
      <span class="doc-pagination__total">总条数：{{ activeKey === 'online-visitors' ? onlineVisitorsList.length : allVisitorsList.length }}</span>
      <div class="doc-pagination__pages">
        <button type="button" class="doc-pagination__btn" disabled>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <span class="doc-pagination__current">1</span>
        <button type="button" class="doc-pagination__btn" disabled>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
        </button>
      </div>
      <div class="doc-pagination__size">
        20 条/页
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from "vue";

type VisitorsNavKey = "online-visitors" | "all-visitors";

defineProps<{
  activeKey: VisitorsNavKey;
}>();

const emit = defineEmits<{
  (e: "toast", message: string): void;
}>();

const searchField = ref("name");
const searchKeyword = ref("");
const filterTag = ref("");
const filterChannel = ref("");
const openMenuId = ref<number | null>(null);

interface AllVisitorItem {
  id: number;
  name: string;
  remark: string;
  email: string;
  phone: string;
  tag: string;
  channelType: "web" | "email";
  firstVisit: string;
  lastVisit: string;
  traceCount: number;
  ip: string;
}

interface OnlineVisitorItem {
  id: number;
  name: string;
  remark: string;
  email: string;
  phone: string;
  tag: string;
  channelType: "web" | "email";
  firstVisit: string;
  lastPage: string;
  ip: string;
}

const onlineVisitorsList = ref<OnlineVisitorItem[]>([
  { id: 101, name: "Tom", remark: "Tom-VIP", email: "tom@example.com", phone: "+1 555-0101", tag: "VIP", channelType: "web", firstVisit: "2026-03-17 09:12", lastPage: "/pricing", ip: "192.168.1.23" },
  { id: 102, name: "Emily", remark: "–", email: "emily@mail.com", phone: "–", tag: "普通", channelType: "web", firstVisit: "2026-03-17 10:05", lastPage: "/products/detail", ip: "10.0.0.45" },
  { id: 103, name: "James", remark: "老客户", email: "james@corp.io", phone: "+44 7700-900123", tag: "VIP", channelType: "web", firstVisit: "2026-03-16 14:30", lastPage: "/support/faq", ip: "172.16.0.88" },
  { id: 104, name: "Sophia", remark: "–", email: "–", phone: "–", tag: "–", channelType: "web", firstVisit: "2026-03-17 11:22", lastPage: "/home", ip: "203.0.113.12" },
  { id: 105, name: "Liam", remark: "潜在客户", email: "liam@startup.co", phone: "+86 138-0000-1234", tag: "普通", channelType: "web", firstVisit: "2026-03-17 08:45", lastPage: "/demo", ip: "198.51.100.7" },
]);

const allVisitorsList = ref<AllVisitorItem[]>([
  { id: 1, name: "Visitor3", remark: "–", email: "–", phone: "–", tag: "–", channelType: "web", firstVisit: "2026-03-16 11:42", lastVisit: "2026-03-16 13:32:59", traceCount: 2, ip: "192.168.1.100" },
  { id: 2, name: "Visitor2", remark: "超级无敌SuperVIP", email: "–", phone: "–", tag: "–", channelType: "web", firstVisit: "2026-03-06 15:14", lastVisit: "2026-03-06 15:14:19", traceCount: 1, ip: "10.0.0.55" },
  { id: 3, name: "Visitor1", remark: "–", email: "–", phone: "–", tag: "123", channelType: "web", firstVisit: "2026-02-12 11:35", lastVisit: "2026-03-06 13:15:09", traceCount: 4, ip: "172.16.0.22" },
  { id: 4, name: "Tom", remark: "Tom-VIP", email: "tom@example.com", phone: "+1 555-0101", tag: "VIP", channelType: "web", firstVisit: "2026-03-10 09:12", lastVisit: "2026-03-17 09:12:33", traceCount: 8, ip: "192.168.1.23" },
  { id: 5, name: "Emily", remark: "–", email: "emily@mail.com", phone: "–", tag: "普通", channelType: "web", firstVisit: "2026-03-12 10:05", lastVisit: "2026-03-17 10:05:47", traceCount: 3, ip: "10.0.0.45" },
  { id: 6, name: "Michael Brown", remark: "–", email: "michael.brown@acme.com", phone: "–", tag: "–", channelType: "email", firstVisit: "2026-03-18 16:30", lastVisit: "2026-03-18 16:45:12", traceCount: 1, ip: "–" },
  { id: 7, name: "Sarah Johnson", remark: "–", email: "sarah.johnson@techcorp.io", phone: "–", tag: "VIP", channelType: "email", firstVisit: "2026-03-15 13:00", lastVisit: "2026-03-18 14:20:33", traceCount: 3, ip: "–" },
]);

const handleReset = () => {
  searchField.value = "name";
  searchKeyword.value = "";
  filterTag.value = "";
  filterChannel.value = "";
};

const toggleActionMenu = (id: number) => {
  openMenuId.value = openMenuId.value === id ? null : id;
};

const handleMenuAction = (action: string) => {
  openMenuId.value = null;
  emit("toast", `${action}功能开发中`);
};
</script>

<style scoped>
.visitors-page {
  background: #fff;
  border-radius: var(--agent-radius-xl);
  gap: var(--agent-space-16);
}

.visitors-page > * {
  width: 100%;
}

/* 筛选栏 */
.visitor-filter-bar {
  align-items: center;
  display: flex;
  gap: 12px;
  justify-content: space-between;
}

.visitor-filter-bar__left {
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.visitor-filter-bar__right {
  align-items: center;
  display: flex;
  flex-shrink: 0;
  gap: 8px;
}

.visitor-filter-group {
  align-items: center;
  display: flex;
  gap: 0;
}

.visitor-select {
  appearance: none;
  background: #fff url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%23999' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") no-repeat right 10px center;
  border: 1px solid var(--agent-color-border-default);
  border-radius: var(--agent-radius-md);
  color: var(--agent-color-text-secondary);
  cursor: pointer;
  font-size: var(--agent-font-size-sm);
  height: 36px;
  padding: 0 28px 0 12px;
}

.visitor-select--field {
  border-radius: var(--agent-radius-md) 0 0 var(--agent-radius-md);
  border-right: 0;
  min-width: 72px;
}

.visitor-select--tag {
  min-width: 140px;
}

.visitor-select--channel {
  min-width: 140px;
}

.visitor-search-input-wrap {
  position: relative;
}

.visitor-search-input-wrap__icon {
  color: var(--agent-color-text-tertiary);
  left: 10px;
  pointer-events: none;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
}

.visitor-search-input {
  border-radius: 0 var(--agent-radius-md) var(--agent-radius-md) 0;
  font-size: var(--agent-font-size-sm);
  height: 36px;
  padding-left: 32px;
  width: 140px;
}

.visitor-date-input-wrap {
  position: relative;
}

.visitor-date-input {
  font-size: var(--agent-font-size-sm);
  height: 36px;
  padding-right: 32px;
  width: 150px;
}

.visitor-date-input-wrap__icon {
  color: var(--agent-color-text-tertiary);
  pointer-events: none;
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
}

/* 表格复用 doc-table 样式 + 覆盖 */
.visitor-table {
  table-layout: auto;
}

.visitor-th--sortable {
  align-items: center;
  cursor: pointer;
  display: inline-flex;
  gap: 4px;
  user-select: none;
  white-space: nowrap;
}

.visitor-sort-icon {
  color: var(--agent-color-text-tertiary);
  flex-shrink: 0;
}

/* 空状态 */
.visitor-empty-cell {
  padding: 60px 16px;
}

.visitor-empty {
  align-items: center;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.visitor-empty__icon {
  margin-bottom: 8px;
}

.visitor-empty__title {
  color: var(--agent-color-text-primary);
  font-size: 15px;
  font-weight: var(--agent-font-weight-medium);
  margin: 0;
}

.visitor-empty__desc {
  color: var(--agent-color-text-tertiary);
  font-size: var(--agent-font-size-sm);
  margin: 0;
}

/* 姓名链接 */
.visitor-name-link {
  color: var(--agent-color-text-primary);
  text-decoration: underline;
}

.visitor-name-link:hover {
  color: var(--agent-color-brand-primary);
}

/* 操作菜单 */
.visitor-action-cell {
  position: relative;
}

.visitor-action-menu {
  background: #fff;
  border: 1px solid var(--agent-color-border-default);
  border-radius: var(--agent-radius-md);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  min-width: 100px;
  position: absolute;
  right: 0;
  top: 100%;
  z-index: var(--agent-z-dropdown);
}

.visitor-action-menu__item {
  background: none;
  border: 0;
  color: var(--agent-color-text-primary);
  cursor: pointer;
  display: block;
  font-size: var(--agent-font-size-sm);
  padding: 8px 16px;
  text-align: left;
  white-space: nowrap;
  width: 100%;
}

.visitor-action-menu__item:hover {
  background: var(--agent-color-bg-muted);
}

.visitor-action-menu__item:first-child {
  border-radius: var(--agent-radius-md) var(--agent-radius-md) 0 0;
}

.visitor-action-menu__item:last-child {
  border-radius: 0 0 var(--agent-radius-md) var(--agent-radius-md);
}

/* 复用 doc-table / doc-pagination 样式 —— 需要在全局或父组件中有这些类 */
.doc-table-wrap {
  background: #fff;
}

.doc-table {
  border-collapse: collapse;
  width: 100%;
}

.doc-table__th {
  background: #fafbfc;
  border-bottom: 1px solid var(--agent-color-border-default);
  color: var(--agent-color-text-primary);
  font-size: var(--agent-font-size-sm);
  font-weight: var(--agent-font-weight-semibold);
  padding: 12px 16px;
  text-align: left;
  white-space: nowrap;
}

.doc-table__th--action {
  text-align: center;
}

.doc-table__row:not(:last-child) .doc-table__td {
  border-bottom: 1px solid var(--agent-color-border-default);
}

.doc-table__td {
  color: var(--agent-color-text-primary);
  font-size: var(--agent-font-size-sm);
  padding: 14px 16px;
  white-space: nowrap;
}

.doc-table__td--action {
  text-align: center;
}

.doc-action-btn {
  align-items: center;
  background: none;
  border: 0;
  border-radius: var(--agent-radius-sm);
  color: var(--agent-color-text-tertiary);
  cursor: pointer;
  display: inline-flex;
  justify-content: center;
  padding: 4px;
}

.doc-action-btn:hover {
  background: var(--agent-color-bg-muted);
  color: var(--agent-color-text-secondary);
}

.doc-pagination {
  align-items: center;
  display: flex;
  gap: 16px;
  justify-content: flex-end;
  padding: 8px 0;
}

.doc-pagination__total {
  color: var(--agent-color-text-secondary);
  font-size: var(--agent-font-size-sm);
}

.doc-pagination__pages {
  align-items: center;
  display: flex;
  gap: 8px;
}

.doc-pagination__btn {
  align-items: center;
  background: none;
  border: 1px solid var(--agent-color-border-default);
  border-radius: var(--agent-radius-sm);
  color: var(--agent-color-text-tertiary);
  cursor: pointer;
  display: inline-flex;
  height: 32px;
  justify-content: center;
  width: 32px;
}

.doc-pagination__btn:disabled {
  cursor: not-allowed;
  opacity: 0.4;
}

.doc-pagination__current {
  align-items: center;
  background: var(--agent-color-brand-primary);
  border-radius: var(--agent-radius-sm);
  color: #fff;
  display: inline-flex;
  font-size: var(--agent-font-size-sm);
  height: 32px;
  justify-content: center;
  min-width: 32px;
  padding: 0 8px;
}

.doc-pagination__size {
  align-items: center;
  border: 1px solid var(--agent-color-border-default);
  border-radius: var(--agent-radius-sm);
  color: var(--agent-color-text-secondary);
  display: inline-flex;
  font-size: var(--agent-font-size-sm);
  gap: 4px;
  height: 32px;
  padding: 0 10px;
}

.visitor-channel-badge {
  border-radius: 999px;
  display: inline-block;
  font-size: var(--agent-font-size-xs);
  font-weight: var(--agent-font-weight-medium);
  line-height: 1;
  padding: 3px 8px;
}

.visitor-channel-badge--web {
  background: #e8f0ff;
  color: #2f6bff;
}

.visitor-channel-badge--email {
  background: #fef3cd;
  color: #b45309;
}
</style>
