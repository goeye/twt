<template>
  <div class="order-page">
    <!-- 统计卡片 -->
    <div class="stats-cards">
      <div class="stat-card">
        <div class="stat-card__label">总订单数</div>
        <div class="stat-card__value">{{ stats.totalOrders }}</div>
        <div class="stat-card__trend">较上月 +12%</div>
      </div>
      <div class="stat-card">
        <div class="stat-card__label">总收入</div>
        <div class="stat-card__value">¥{{ stats.totalRevenue.toLocaleString() }}</div>
        <div class="stat-card__trend">较上月 +8%</div>
      </div>
      <div class="stat-card">
        <div class="stat-card__label">待结算</div>
        <div class="stat-card__value">¥{{ stats.pendingRevenue.toLocaleString() }}</div>
        <div class="stat-card__trend">本月</div>
      </div>
      <div class="stat-card">
        <div class="stat-card__label">已结算</div>
        <div class="stat-card__value">¥{{ stats.settledRevenue.toLocaleString() }}</div>
        <div class="stat-card__trend">累计</div>
      </div>
    </div>

    <!-- 筛选栏 -->
    <div class="filter-bar">
      <div class="filter-bar__left">
        <select v-model="filters.status" class="filter-select">
          <option value="">全部状态</option>
          <option value="pending">待支付</option>
          <option value="paid">已支付</option>
          <option value="refunded">已退款</option>
          <option value="cancelled">已取消</option>
        </select>
        <select v-model="filters.plan" class="filter-select">
          <option value="">全部套餐</option>
          <option value="free">免费版</option>
          <option value="pro-monthly">专业版（月付）</option>
          <option value="pro-yearly">专业版（年付）</option>
        </select>
        <input
          v-model="filters.search"
          type="text"
          placeholder="搜索订单号、项目名称"
          class="filter-input"
        />
      </div>
      <div class="filter-bar__right">
        <button class="btn btn--secondary" @click="exportOrders">导出订单</button>
      </div>
    </div>

    <!-- 订单表格 -->
    <div class="order-table-wrapper">
      <table class="order-table">
        <thead>
          <tr>
            <th>订单号</th>
            <th>项目名称</th>
            <th>套餐</th>
            <th>金额</th>
            <th>佣金</th>
            <th>状态</th>
            <th>创建时间</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in filteredOrders" :key="order.id">
            <td>
              <span class="order-id">{{ order.orderNo }}</span>
            </td>
            <td>{{ order.projectName }}</td>
            <td>
              <span class="plan-badge" :class="`plan-badge--${order.plan}`">
                {{ getPlanLabel(order.plan) }}
              </span>
            </td>
            <td class="amount">¥{{ order.amount.toLocaleString() }}</td>
            <td class="commission">¥{{ order.commission.toLocaleString() }}</td>
            <td>
              <span class="status-badge" :class="`status-badge--${order.status}`">
                {{ getStatusLabel(order.status) }}
              </span>
            </td>
            <td class="time">{{ order.createdAt }}</td>
            <td>
              <button class="btn-link" @click="viewOrder(order)">查看</button>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="filteredOrders.length === 0" class="empty-state">
        <div class="empty-state__icon">📦</div>
        <div class="empty-state__text">暂无订单数据</div>
      </div>
    </div>

    <!-- 分页 -->
    <div class="pagination">
      <span class="pagination__info">共 {{ filteredOrders.length }} 条</span>
      <div class="pagination__controls">
        <button class="pagination__btn" :disabled="currentPage === 1" @click="currentPage--">上一页</button>
        <span class="pagination__current">{{ currentPage }}</span>
        <button class="pagination__btn" :disabled="currentPage >= totalPages" @click="currentPage++">下一页</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Order {
  id: string
  orderNo: string
  projectName: string
  plan: 'free' | 'pro-monthly' | 'pro-yearly'
  amount: number
  commission: number
  status: 'pending' | 'paid' | 'refunded' | 'cancelled'
  createdAt: string
}

const stats = ref({
  totalOrders: 156,
  totalRevenue: 89600,
  pendingRevenue: 12800,
  settledRevenue: 76800,
})

const filters = ref({
  status: '',
  plan: '',
  search: '',
})

const currentPage = ref(1)
const pageSize = 20

// 模拟订单数据
const orders = ref<Order[]>([
  {
    id: '1',
    orderNo: 'ORD20260406001',
    projectName: '客户A项目',
    plan: 'pro-yearly',
    amount: 1980,
    commission: 594,
    status: 'paid',
    createdAt: '2026-04-06 10:30:00',
  },
  {
    id: '2',
    orderNo: 'ORD20260405002',
    projectName: '客户B项目',
    plan: 'pro-monthly',
    amount: 199,
    commission: 59.7,
    status: 'paid',
    createdAt: '2026-04-05 14:20:00',
  },
  {
    id: '3',
    orderNo: 'ORD20260404003',
    projectName: '客户C项目',
    plan: 'pro-monthly',
    amount: 199,
    commission: 59.7,
    status: 'pending',
    createdAt: '2026-04-04 09:15:00',
  },
  {
    id: '4',
    orderNo: 'ORD20260403004',
    projectName: '客户D项目',
    plan: 'pro-yearly',
    amount: 1980,
    commission: 594,
    status: 'paid',
    createdAt: '2026-04-03 16:45:00',
  },
  {
    id: '5',
    orderNo: 'ORD20260402005',
    projectName: '客户E项目',
    plan: 'pro-monthly',
    amount: 199,
    commission: 59.7,
    status: 'refunded',
    createdAt: '2026-04-02 11:30:00',
  },
])

const filteredOrders = computed(() => {
  return orders.value.filter(order => {
    if (filters.value.status && order.status !== filters.value.status) return false
    if (filters.value.plan && order.plan !== filters.value.plan) return false
    if (filters.value.search) {
      const search = filters.value.search.toLowerCase()
      return (
        order.orderNo.toLowerCase().includes(search) ||
        order.projectName.toLowerCase().includes(search)
      )
    }
    return true
  })
})

const totalPages = computed(() => Math.ceil(filteredOrders.value.length / pageSize))

const getPlanLabel = (plan: string) => {
  const labels: Record<string, string> = {
    free: '免费版',
    'pro-monthly': '专业版（月付）',
    'pro-yearly': '专业版（年付）',
  }
  return labels[plan] || plan
}

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    pending: '待支付',
    paid: '已支付',
    refunded: '已退款',
    cancelled: '已取消',
  }
  return labels[status] || status
}

const viewOrder = (order: Order) => {
  alert(`查看订单：${order.orderNo}`)
}

const exportOrders = () => {
  alert('导出订单功能开发中')
}
</script>

<style scoped>
.order-page {
  padding: 24px;
}

/* 统计卡片 */
.stats-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.stat-card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 20px;
}

.stat-card__label {
  color: #6b7280;
  font-size: 14px;
  margin-bottom: 8px;
}

.stat-card__value {
  color: #111827;
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 4px;
}

.stat-card__trend {
  color: #10b981;
  font-size: 13px;
}

/* 筛选栏 */
.filter-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  gap: 12px;
}

.filter-bar__left {
  display: flex;
  gap: 12px;
  flex: 1;
}

.filter-select {
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  background: #fff;
  cursor: pointer;
}

.filter-input {
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  flex: 1;
  max-width: 300px;
}

.btn {
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  border: none;
}

.btn--secondary {
  background: #fff;
  border: 1px solid #d1d5db;
  color: #374151;
}

.btn--secondary:hover {
  background: #f9fafb;
}

/* 订单表格 */
.order-table-wrapper {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 16px;
}

.order-table {
  width: 100%;
  border-collapse: collapse;
}

.order-table th {
  background: #f9fafb;
  padding: 12px 16px;
  text-align: left;
  font-size: 13px;
  font-weight: 600;
  color: #6b7280;
  border-bottom: 1px solid #e5e7eb;
}

.order-table td {
  padding: 16px;
  font-size: 14px;
  color: #111827;
  border-bottom: 1px solid #f3f4f6;
}

.order-table tbody tr:hover {
  background: #f9fafb;
}

.order-id {
  font-family: monospace;
  color: #6366f1;
  font-weight: 500;
}

.amount,
.commission {
  font-weight: 600;
}

.commission {
  color: #10b981;
}

.time {
  color: #6b7280;
  font-size: 13px;
}

.plan-badge {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
}

.plan-badge--free {
  background: #f3f4f6;
  color: #6b7280;
}

.plan-badge--pro-monthly {
  background: #dbeafe;
  color: #1e40af;
}

.plan-badge--pro-yearly {
  background: #fef3c7;
  color: #92400e;
}

.status-badge {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
}

.status-badge--pending {
  background: #fef3c7;
  color: #92400e;
}

.status-badge--paid {
  background: #d1fae5;
  color: #065f46;
}

.status-badge--refunded {
  background: #fee2e2;
  color: #991b1b;
}

.status-badge--cancelled {
  background: #f3f4f6;
  color: #6b7280;
}

.btn-link {
  background: none;
  border: none;
  color: #6366f1;
  cursor: pointer;
  font-size: 14px;
  padding: 0;
}

.btn-link:hover {
  text-decoration: underline;
}

/* 空状态 */
.empty-state {
  padding: 60px 20px;
  text-align: center;
}

.empty-state__icon {
  font-size: 48px;
  margin-bottom: 12px;
}

.empty-state__text {
  color: #6b7280;
  font-size: 14px;
}

/* 分页 */
.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.pagination__info {
  color: #6b7280;
  font-size: 14px;
}

.pagination__controls {
  display: flex;
  align-items: center;
  gap: 12px;
}

.pagination__btn {
  padding: 6px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: #fff;
  color: #374151;
  font-size: 14px;
  cursor: pointer;
}

.pagination__btn:hover:not(:disabled) {
  background: #f9fafb;
}

.pagination__btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination__current {
  color: #111827;
  font-size: 14px;
  font-weight: 500;
}
</style>
