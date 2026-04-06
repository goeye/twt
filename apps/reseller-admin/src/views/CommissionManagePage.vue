<template>
  <div class="commission-page">
    <!-- 统计卡片 -->
    <div class="stats-cards">
      <div class="stat-card">
        <div class="stat-card__label">累计佣金</div>
        <div class="stat-card__value">¥{{ stats.totalCommission.toLocaleString() }}</div>
        <div class="stat-card__trend">全部时间</div>
      </div>
      <div class="stat-card">
        <div class="stat-card__label">待结算</div>
        <div class="stat-card__value">¥{{ stats.pendingCommission.toLocaleString() }}</div>
        <div class="stat-card__trend">可提现</div>
      </div>
      <div class="stat-card">
        <div class="stat-card__label">已提现</div>
        <div class="stat-card__value">¥{{ stats.withdrawnCommission.toLocaleString() }}</div>
        <div class="stat-card__trend">累计</div>
      </div>
      <div class="stat-card">
        <div class="stat-card__label">本月佣金</div>
        <div class="stat-card__value">¥{{ stats.monthCommission.toLocaleString() }}</div>
        <div class="stat-card__trend">较上月 +18%</div>
      </div>
    </div>

    <!-- 提现申请 -->
    <div class="withdraw-section">
      <div class="withdraw-card">
        <div class="withdraw-card__header">
          <h3>申请提现</h3>
          <p>可提现金额：<span class="amount">¥{{ stats.pendingCommission.toLocaleString() }}</span></p>
        </div>
        <div class="withdraw-card__body">
          <div class="form-group">
            <label>提现金额</label>
            <input
              v-model="withdrawAmount"
              type="number"
              placeholder="请输入提现金额"
              class="form-input"
            />
            <span class="form-hint">最低提现金额 ¥100，手续费 2%</span>
          </div>
          <div class="form-group">
            <label>收款账户</label>
            <select v-model="withdrawAccount" class="form-select">
              <option value="">请选择收款账户</option>
              <option value="alipay">支付宝（***@example.com）</option>
              <option value="bank">银行卡（尾号 1234）</option>
            </select>
          </div>
          <button class="btn btn--primary" @click="submitWithdraw">提交申请</button>
        </div>
      </div>
    </div>

    <!-- 佣金明细 -->
    <div class="commission-section">
      <div class="section-header">
        <h3>佣金明细</h3>
        <div class="filter-tabs">
          <button
            v-for="tab in tabs"
            :key="tab.value"
            class="filter-tab"
            :class="{ 'filter-tab--active': activeTab === tab.value }"
            @click="activeTab = tab.value"
          >
            {{ tab.label }}
          </button>
        </div>
      </div>

      <div class="commission-table-wrapper">
        <table class="commission-table">
          <thead>
            <tr>
              <th>订单号</th>
              <th>项目名称</th>
              <th>订单金额</th>
              <th>佣金比例</th>
              <th>佣金金额</th>
              <th>状态</th>
              <th>时间</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="record in filteredRecords" :key="record.id">
              <td>
                <span class="order-id">{{ record.orderNo }}</span>
              </td>
              <td>{{ record.projectName }}</td>
              <td class="amount">¥{{ record.orderAmount.toLocaleString() }}</td>
              <td>{{ record.commissionRate }}%</td>
              <td class="commission">¥{{ record.commissionAmount.toLocaleString() }}</td>
              <td>
                <span class="status-badge" :class="`status-badge--${record.status}`">
                  {{ getStatusLabel(record.status) }}
                </span>
              </td>
              <td class="time">{{ record.createdAt }}</td>
            </tr>
          </tbody>
        </table>

        <div v-if="filteredRecords.length === 0" class="empty-state">
          <div class="empty-state__icon">💰</div>
          <div class="empty-state__text">暂无佣金记录</div>
        </div>
      </div>
    </div>

    <!-- 提现记录 -->
    <div class="withdraw-history-section">
      <h3>提现记录</h3>
      <div class="withdraw-table-wrapper">
        <table class="withdraw-table">
          <thead>
            <tr>
              <th>提现单号</th>
              <th>提现金额</th>
              <th>手续费</th>
              <th>实际到账</th>
              <th>收款账户</th>
              <th>状态</th>
              <th>申请时间</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="withdraw in withdrawHistory" :key="withdraw.id">
              <td>
                <span class="order-id">{{ withdraw.withdrawNo }}</span>
              </td>
              <td class="amount">¥{{ withdraw.amount.toLocaleString() }}</td>
              <td class="fee">¥{{ withdraw.fee.toLocaleString() }}</td>
              <td class="actual">¥{{ withdraw.actualAmount.toLocaleString() }}</td>
              <td>{{ withdraw.account }}</td>
              <td>
                <span class="status-badge" :class="`status-badge--${withdraw.status}`">
                  {{ getWithdrawStatusLabel(withdraw.status) }}
                </span>
              </td>
              <td class="time">{{ withdraw.createdAt }}</td>
            </tr>
          </tbody>
        </table>

        <div v-if="withdrawHistory.length === 0" class="empty-state">
          <div class="empty-state__icon">📋</div>
          <div class="empty-state__text">暂无提现记录</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface CommissionRecord {
  id: string
  orderNo: string
  projectName: string
  orderAmount: number
  commissionRate: number
  commissionAmount: number
  status: 'pending' | 'settled' | 'withdrawn'
  createdAt: string
}

interface WithdrawRecord {
  id: string
  withdrawNo: string
  amount: number
  fee: number
  actualAmount: number
  account: string
  status: 'pending' | 'processing' | 'completed' | 'rejected'
  createdAt: string
}

const stats = ref({
  totalCommission: 23400,
  pendingCommission: 5600,
  withdrawnCommission: 17800,
  monthCommission: 4200,
})

const withdrawAmount = ref('')
const withdrawAccount = ref('')

const activeTab = ref('all')
const tabs = [
  { label: '全部', value: 'all' },
  { label: '待结算', value: 'pending' },
  { label: '已结算', value: 'settled' },
  { label: '已提现', value: 'withdrawn' },
]

// 模拟佣金记录
const commissionRecords = ref<CommissionRecord[]>([
  {
    id: '1',
    orderNo: 'ORD20260406001',
    projectName: '客户A项目',
    orderAmount: 1980,
    commissionRate: 30,
    commissionAmount: 594,
    status: 'settled',
    createdAt: '2026-04-06 10:30:00',
  },
  {
    id: '2',
    orderNo: 'ORD20260405002',
    projectName: '客户B项目',
    orderAmount: 199,
    commissionRate: 30,
    commissionAmount: 59.7,
    status: 'settled',
    createdAt: '2026-04-05 14:20:00',
  },
  {
    id: '3',
    orderNo: 'ORD20260404003',
    projectName: '客户C项目',
    orderAmount: 199,
    commissionRate: 30,
    commissionAmount: 59.7,
    status: 'pending',
    createdAt: '2026-04-04 09:15:00',
  },
  {
    id: '4',
    orderNo: 'ORD20260403004',
    projectName: '客户D项目',
    orderAmount: 1980,
    commissionRate: 30,
    commissionAmount: 594,
    status: 'withdrawn',
    createdAt: '2026-04-03 16:45:00',
  },
])

// 模拟提现记录
const withdrawHistory = ref<WithdrawRecord[]>([
  {
    id: '1',
    withdrawNo: 'WD20260401001',
    amount: 5000,
    fee: 100,
    actualAmount: 4900,
    account: '支付宝（***@example.com）',
    status: 'completed',
    createdAt: '2026-04-01 10:00:00',
  },
  {
    id: '2',
    withdrawNo: 'WD20260301002',
    amount: 3000,
    fee: 60,
    actualAmount: 2940,
    account: '银行卡（尾号 1234）',
    status: 'completed',
    createdAt: '2026-03-01 15:30:00',
  },
])

const filteredRecords = computed(() => {
  if (activeTab.value === 'all') return commissionRecords.value
  return commissionRecords.value.filter(r => r.status === activeTab.value)
})

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    pending: '待结算',
    settled: '已结算',
    withdrawn: '已提现',
  }
  return labels[status] || status
}

const getWithdrawStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    pending: '待审核',
    processing: '处理中',
    completed: '已完成',
    rejected: '已拒绝',
  }
  return labels[status] || status
}

const submitWithdraw = () => {
  if (!withdrawAmount.value || !withdrawAccount.value) {
    alert('请填写完整信息')
    return
  }
  const amount = parseFloat(withdrawAmount.value)
  if (amount < 100) {
    alert('最低提现金额为 ¥100')
    return
  }
  if (amount > stats.value.pendingCommission) {
    alert('提现金额超过可提现余额')
    return
  }
  alert('提现申请已提交，请等待审核')
  withdrawAmount.value = ''
  withdrawAccount.value = ''
}
</script>

<style scoped>
.commission-page {
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

/* 提现申请 */
.withdraw-section {
  margin-bottom: 24px;
}

.withdraw-card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
}

.withdraw-card__header {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: #fff;
  padding: 24px;
}

.withdraw-card__header h3 {
  margin: 0 0 8px 0;
  font-size: 18px;
  font-weight: 600;
}

.withdraw-card__header p {
  margin: 0;
  font-size: 14px;
  opacity: 0.9;
}

.withdraw-card__header .amount {
  font-size: 24px;
  font-weight: 700;
}

.withdraw-card__body {
  padding: 24px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
}

.form-input,
.form-select {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
}

.form-hint {
  display: block;
  margin-top: 6px;
  font-size: 12px;
  color: #6b7280;
}

.btn {
  padding: 10px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  border: none;
}

.btn--primary {
  background: #6366f1;
  color: #fff;
}

.btn--primary:hover {
  background: #4f46e5;
}

/* 佣金明细 */
.commission-section,
.withdraw-history-section {
  margin-bottom: 24px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-header h3,
.withdraw-history-section h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #111827;
}

.filter-tabs {
  display: flex;
  gap: 8px;
}

.filter-tab {
  padding: 6px 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background: #fff;
  color: #6b7280;
  font-size: 14px;
  cursor: pointer;
}

.filter-tab--active {
  background: #6366f1;
  border-color: #6366f1;
  color: #fff;
}

/* 表格 */
.commission-table-wrapper,
.withdraw-table-wrapper {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
}

.commission-table,
.withdraw-table {
  width: 100%;
  border-collapse: collapse;
}

.commission-table th,
.withdraw-table th {
  background: #f9fafb;
  padding: 12px 16px;
  text-align: left;
  font-size: 13px;
  font-weight: 600;
  color: #6b7280;
  border-bottom: 1px solid #e5e7eb;
}

.commission-table td,
.withdraw-table td {
  padding: 16px;
  font-size: 14px;
  color: #111827;
  border-bottom: 1px solid #f3f4f6;
}

.commission-table tbody tr:hover,
.withdraw-table tbody tr:hover {
  background: #f9fafb;
}

.order-id {
  font-family: monospace;
  color: #6366f1;
  font-weight: 500;
}

.amount {
  font-weight: 600;
}

.commission,
.actual {
  font-weight: 600;
  color: #10b981;
}

.fee {
  color: #ef4444;
}

.time {
  color: #6b7280;
  font-size: 13px;
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

.status-badge--settled {
  background: #dbeafe;
  color: #1e40af;
}

.status-badge--withdrawn {
  background: #d1fae5;
  color: #065f46;
}

.status-badge--processing {
  background: #dbeafe;
  color: #1e40af;
}

.status-badge--completed {
  background: #d1fae5;
  color: #065f46;
}

.status-badge--rejected {
  background: #fee2e2;
  color: #991b1b;
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
</style>
