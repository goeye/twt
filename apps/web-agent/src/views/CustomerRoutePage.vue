<template>
  <section class="agent-content-page customer-page">
    <header class="agent-content-header">
      <h1 class="agent-content-title">{{ activeKey === 'online-customer' ? '在线客户' : '全部客户' }}</h1>
    </header>

    <!-- 筛选栏 -->
    <div class="customer-filter-bar">
      <div class="customer-filter-bar__left">
        <div class="customer-filter-group">
          <select v-model="searchField" class="customer-select customer-select--field">
            <option value="id">客户标识</option>
            <option value="remark">备注名</option>
            <option value="name">姓名</option>
            <option value="email">邮箱</option>
            <option value="phone">电话</option>
          </select>
          <div class="customer-search-input-wrap">
            <svg class="customer-search-input-wrap__icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input v-model="searchKeyword" class="agent-input customer-search-input" placeholder="请输入" />
          </div>
        </div>

        <select v-model="filterTag" class="customer-select customer-select--tag">
          <option value="">标签</option>
          <option value="VIP">VIP</option>
          <option value="普通">普通</option>
        </select>

        <div class="customer-date-input-wrap">
          <input class="agent-input customer-date-input" placeholder="首次访问" readonly />
          <svg class="customer-date-input-wrap__icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
        </div>

        <div v-if="activeKey === 'all-customer'" class="customer-date-input-wrap">
          <input class="agent-input customer-date-input" placeholder="最后访问" readonly />
          <svg class="customer-date-input-wrap__icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
        </div>
      </div>

      <div class="customer-filter-bar__right">
        <button type="button" class="agent-btn agent-btn--primary" @click="emit('toast', '搜索功能开发中')">搜索</button>
        <button type="button" class="agent-btn agent-btn--ghost" @click="handleReset">重置</button>
      </div>
    </div>

    <!-- 在线客户表格 -->
    <div v-if="activeKey === 'online-customer'" class="doc-table-wrap">
      <table class="doc-table customer-table">
        <thead>
          <tr>
            <th class="doc-table__th">客户标识</th>
            <th class="doc-table__th">备注名</th>
            <th class="doc-table__th">姓名</th>
            <th class="doc-table__th">邮箱</th>
            <th class="doc-table__th">电话</th>
            <th class="doc-table__th">标签</th>
            <th class="doc-table__th" @click="toggleSort('firstVisit')">
              <span class="customer-th--sortable">
                首次访问
                <svg class="customer-sort-icon" width="10" height="14" viewBox="0 0 10 14" fill="currentColor">
                  <path d="M5 0L9.33 5H0.67L5 0Z" :opacity="sortKey === 'firstVisit' && sortDir === 'asc' ? 0.8 : 0.3"/>
                  <path d="M5 14L0.67 9H9.33L5 14Z" :opacity="sortKey === 'firstVisit' && sortDir === 'desc' ? 0.8 : 0.3"/>
                </svg>
              </span>
            </th>
            <th class="doc-table__th">最后访问页面</th>
            <th class="doc-table__th">IP 地址</th>
            <th class="doc-table__th doc-table__th--action">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in onlineCustomerList" :key="item.id" class="doc-table__row">
            <td class="doc-table__td">{{ item.customerId }}</td>
            <td class="doc-table__td">{{ item.remark }}</td>
            <td class="doc-table__td">{{ item.name }}</td>
            <td class="doc-table__td">{{ item.email }}</td>
            <td class="doc-table__td">{{ item.phone }}</td>
            <td class="doc-table__td">{{ item.tag }}</td>
            <td class="doc-table__td">{{ item.firstVisit }}</td>
            <td class="doc-table__td">{{ item.lastPage }}</td>
            <td class="doc-table__td">{{ item.ip }}</td>
            <td class="doc-table__td doc-table__td--action customer-action-cell">
              <button
                type="button"
                class="doc-action-btn"
                @click="toggleActionMenu(item.id)"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <circle cx="8" cy="3" r="1.5"/><circle cx="8" cy="8" r="1.5"/><circle cx="8" cy="13" r="1.5"/>
                </svg>
              </button>
              <div v-if="openMenuId === item.id" class="customer-action-menu">
                <button type="button" class="customer-action-menu__item" @click="handleMenuAction('创建会话')">创建会话</button>
                <button type="button" class="customer-action-menu__item" @click="handleMenuAction('发起聊天')">发起聊天</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 全部客户表格 -->
    <div v-else class="doc-table-wrap">
      <table class="doc-table customer-table">
        <thead>
          <tr>
            <th class="doc-table__th">客户标识</th>
            <th class="doc-table__th">备注名</th>
            <th class="doc-table__th">姓名</th>
            <th class="doc-table__th">邮箱</th>
            <th class="doc-table__th">电话</th>
            <th class="doc-table__th">标签</th>
            <th class="doc-table__th" @click="toggleSort('firstVisit')">
              <span class="customer-th--sortable">
                首次访问
                <svg class="customer-sort-icon" width="10" height="14" viewBox="0 0 10 14" fill="currentColor">
                  <path d="M5 0L9.33 5H0.67L5 0Z" :opacity="sortKey === 'firstVisit' && sortDir === 'asc' ? 0.8 : 0.3"/>
                  <path d="M5 14L0.67 9H9.33L5 14Z" :opacity="sortKey === 'firstVisit' && sortDir === 'desc' ? 0.8 : 0.3"/>
                </svg>
              </span>
            </th>
            <th class="doc-table__th" @click="toggleSort('lastVisit')">
              <span class="customer-th--sortable">
                最后访问
                <svg class="customer-sort-icon" width="10" height="14" viewBox="0 0 10 14" fill="currentColor">
                  <path d="M5 0L9.33 5H0.67L5 0Z" :opacity="sortKey === 'lastVisit' && sortDir === 'asc' ? 0.8 : 0.3"/>
                  <path d="M5 14L0.67 9H9.33L5 14Z" :opacity="sortKey === 'lastVisit' && sortDir === 'desc' ? 0.8 : 0.3"/>
                </svg>
              </span>
            </th>
            <th class="doc-table__th">访问轨迹数</th>
            <th class="doc-table__th">IP 地址</th>
            <th class="doc-table__th doc-table__th--action">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in allCustomerList" :key="item.id" class="doc-table__row">
            <td class="doc-table__td">{{ item.customerId }}</td>
            <td class="doc-table__td">{{ item.remark }}</td>
            <td class="doc-table__td">{{ item.name }}</td>
            <td class="doc-table__td">{{ item.email }}</td>
            <td class="doc-table__td">{{ item.phone }}</td>
            <td class="doc-table__td">{{ item.tag }}</td>
            <td class="doc-table__td">{{ item.firstVisit }}</td>
            <td class="doc-table__td">{{ item.lastVisit }}</td>
            <td class="doc-table__td" style="text-align: center;">{{ item.traceCount }}</td>
            <td class="doc-table__td">{{ item.ip }}</td>
            <td class="doc-table__td doc-table__td--action customer-action-cell">
              <button
                type="button"
                class="doc-action-btn"
                @click="toggleActionMenu(item.id)"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <circle cx="8" cy="3" r="1.5"/><circle cx="8" cy="8" r="1.5"/><circle cx="8" cy="13" r="1.5"/>
                </svg>
              </button>
              <div v-if="openMenuId === item.id" class="customer-action-menu">
                <button type="button" class="customer-action-menu__item" @click="handleMenuAction('创建会话')">创建会话</button>
                <button type="button" class="customer-action-menu__item" @click="handleMenuAction('发起聊天')">发起聊天</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 分页 -->
    <div class="doc-pagination">
      <span class="doc-pagination__total">总条数：{{ activeKey === 'online-customer' ? onlineCustomerList.length : allCustomerList.length }}</span>
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

type CustomerNavKey = "online-customer" | "all-customer";

defineProps<{
  activeKey: CustomerNavKey;
}>();

const emit = defineEmits<{
  (e: "toast", message: string): void;
}>();

const searchField = ref("id");
const searchKeyword = ref("");
const filterTag = ref("");
const openMenuId = ref<number | null>(null);
const sortKey = ref("");
const sortDir = ref<"asc" | "desc">("asc");

interface CustomerItem {
  id: number;
  customerId: string;
  remark: string;
  name: string;
  email: string;
  phone: string;
  tag: string;
  firstVisit: string;
  lastVisit: string;
  traceCount: number;
  ip: string;
}

interface OnlineCustomerItem {
  id: number;
  customerId: string;
  remark: string;
  name: string;
  email: string;
  phone: string;
  tag: string;
  firstVisit: string;
  lastPage: string;
  ip: string;
}

const onlineCustomerList = ref<OnlineCustomerItem[]>([
  { id: 101, customerId: "CU-2001", remark: "张总", name: "张伟", email: "zhangwei@corp.cn", phone: "+86 138-1234-5678", tag: "VIP", firstVisit: "2026-02-20 10:30", lastPage: "/pricing", ip: "116.228.89.12" },
  { id: 102, customerId: "CU-2002", remark: "–", name: "Sarah", email: "sarah@gmail.com", phone: "+1 555-0199", tag: "普通", firstVisit: "2026-03-15 14:22", lastPage: "/products/detail", ip: "74.125.200.100" },
  { id: 103, customerId: "CU-2003", remark: "合作伙伴", name: "Mike Chen", email: "mike@partner.io", phone: "+852 9876-5432", tag: "VIP", firstVisit: "2026-01-10 09:15", lastPage: "/dashboard", ip: "203.198.45.67" },
  { id: 104, customerId: "CU-2004", remark: "–", name: "李娜", email: "lina@163.com", phone: "+86 159-8765-4321", tag: "–", firstVisit: "2026-03-17 11:08", lastPage: "/support/tickets", ip: "222.73.110.88" },
  { id: 105, customerId: "CU-2005", remark: "试用客户", name: "David", email: "david@startup.co", phone: "–", tag: "普通", firstVisit: "2026-03-16 16:45", lastPage: "/demo", ip: "185.220.101.33" },
]);

const allCustomerList = ref<CustomerItem[]>([
  { id: 1, customerId: "CU-1001", remark: "–", name: "王明", email: "wangming@qq.com", phone: "+86 136-0000-1111", tag: "–", firstVisit: "2026-03-10 08:30", lastVisit: "2026-03-16 13:06", traceCount: 3, ip: "192.168.1.100" },
  { id: 2, customerId: "CU-2001", remark: "张总", name: "张伟", email: "zhangwei@corp.cn", phone: "+86 138-1234-5678", tag: "VIP", firstVisit: "2026-02-20 10:30", lastVisit: "2026-03-17 10:30:12", traceCount: 15, ip: "116.228.89.12" },
  { id: 3, customerId: "CU-2002", remark: "–", name: "Sarah", email: "sarah@gmail.com", phone: "+1 555-0199", tag: "普通", firstVisit: "2026-03-15 14:22", lastVisit: "2026-03-17 14:22:05", traceCount: 2, ip: "74.125.200.100" },
  { id: 4, customerId: "CU-2003", remark: "合作伙伴", name: "Mike Chen", email: "mike@partner.io", phone: "+852 9876-5432", tag: "VIP", firstVisit: "2026-01-10 09:15", lastVisit: "2026-03-17 09:15:30", traceCount: 22, ip: "203.198.45.67" },
  { id: 5, customerId: "CU-2004", remark: "–", name: "李娜", email: "lina@163.com", phone: "+86 159-8765-4321", tag: "–", firstVisit: "2026-03-17 11:08", lastVisit: "2026-03-17 11:08:44", traceCount: 1, ip: "222.73.110.88" },
]);

const handleReset = () => {
  searchField.value = "id";
  searchKeyword.value = "";
  filterTag.value = "";
};

const toggleSort = (key: string) => {
  if (sortKey.value === key) {
    sortDir.value = sortDir.value === "asc" ? "desc" : "asc";
  } else {
    sortKey.value = key;
    sortDir.value = "asc";
  }
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
.customer-page {
  background: #fff;
  border-radius: var(--agent-radius-xl);
  gap: var(--agent-space-16);
}

.customer-page > * {
  width: 100%;
}

/* 筛选栏 */
.customer-filter-bar {
  align-items: center;
  display: flex;
  gap: 12px;
  justify-content: space-between;
}

.customer-filter-bar__left {
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.customer-filter-bar__right {
  align-items: center;
  display: flex;
  flex-shrink: 0;
  gap: 8px;
}

.customer-filter-group {
  align-items: center;
  display: flex;
  gap: 0;
}

.customer-select {
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

.customer-select--field {
  border-radius: var(--agent-radius-md) 0 0 var(--agent-radius-md);
  border-right: 0;
  min-width: 88px;
}

.customer-select--tag {
  min-width: 140px;
}

.customer-search-input-wrap {
  position: relative;
}

.customer-search-input-wrap__icon {
  color: var(--agent-color-text-tertiary);
  left: 10px;
  pointer-events: none;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
}

.customer-search-input {
  border-radius: 0 var(--agent-radius-md) var(--agent-radius-md) 0;
  font-size: var(--agent-font-size-sm);
  height: 36px;
  padding-left: 32px;
  width: 140px;
}

.customer-date-input-wrap {
  position: relative;
}

.customer-date-input {
  font-size: var(--agent-font-size-sm);
  height: 36px;
  padding-right: 32px;
  width: 150px;
}

.customer-date-input-wrap__icon {
  color: var(--agent-color-text-tertiary);
  pointer-events: none;
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
}

/* 表格 */
.customer-table {
  table-layout: auto;
}

.customer-th--sortable {
  align-items: center;
  cursor: pointer;
  display: inline-flex;
  gap: 4px;
  user-select: none;
  white-space: nowrap;
}

.customer-sort-icon {
  color: var(--agent-color-text-tertiary);
  flex-shrink: 0;
}

/* 空状态 */
.customer-empty-cell {
  padding: 60px 16px;
}

.customer-empty {
  align-items: center;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.customer-empty__icon {
  margin-bottom: 8px;
}

.customer-empty__title {
  color: var(--agent-color-text-primary);
  font-size: 15px;
  font-weight: var(--agent-font-weight-medium);
  margin: 0;
}

.customer-empty__desc {
  color: var(--agent-color-text-tertiary);
  font-size: var(--agent-font-size-sm);
  margin: 0;
}

/* 操作菜单 */
.customer-action-cell {
  position: relative;
}

.customer-action-menu {
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

.customer-action-menu__item {
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

.customer-action-menu__item:hover {
  background: var(--agent-color-bg-muted);
}

.customer-action-menu__item:first-child {
  border-radius: var(--agent-radius-md) var(--agent-radius-md) 0 0;
}

.customer-action-menu__item:last-child {
  border-radius: 0 0 var(--agent-radius-md) var(--agent-radius-md);
}

/* 复用 doc-table / doc-pagination 样式 */
.doc-table-wrap {
  background: #fff;
  border: 1px solid var(--agent-color-border-default);
  border-radius: var(--agent-radius-md);
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
</style>
