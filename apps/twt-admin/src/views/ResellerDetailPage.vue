<template>
  <div class="reseller-detail-page">
    <!-- 返回按钮 -->
    <a-button @click="$router.back()" style="margin-bottom: 16px">
      <template #icon><ArrowLeftOutlined /></template>
      返回
    </a-button>

    <!-- 基本信息 -->
    <a-card title="基本信息" class="section-card">
      <a-descriptions :column="2" bordered>
        <a-descriptions-item label="代理商 ID">{{ reseller.id }}</a-descriptions-item>
        <a-descriptions-item label="代理商名称">{{ reseller.name }}</a-descriptions-item>
        <a-descriptions-item label="联系人">{{ reseller.contact }}</a-descriptions-item>
        <a-descriptions-item label="邮箱">{{ reseller.email }}</a-descriptions-item>
        <a-descriptions-item label="手机号">{{ reseller.phone }}</a-descriptions-item>
        <a-descriptions-item label="状态">
          <a-tag :color="getStatusColor(reseller.status)">
            {{ getStatusText(reseller.status) }}
          </a-tag>
        </a-descriptions-item>
        <a-descriptions-item label="分成比例">{{ reseller.commissionRate }}%</a-descriptions-item>
        <a-descriptions-item label="创建时间">{{ reseller.createdAt }}</a-descriptions-item>
        <a-descriptions-item label="备注" :span="2">{{ reseller.remark || '-' }}</a-descriptions-item>
      </a-descriptions>
    </a-card>

    <!-- 数据统计 -->
    <a-card title="数据统计" class="section-card">
      <div class="stats-grid">
        <div class="stat-item">
          <div class="stat-label">项目数</div>
          <div class="stat-value">{{ reseller.projectCount }}</div>
        </div>
        <div class="stat-item">
          <div class="stat-label">总订单数</div>
          <div class="stat-value">{{ reseller.totalOrders }}</div>
        </div>
        <div class="stat-item">
          <div class="stat-label">总收入</div>
          <div class="stat-value">¥{{ reseller.totalRevenue.toLocaleString() }}</div>
        </div>
        <div class="stat-item">
          <div class="stat-label">总佣金</div>
          <div class="stat-value">¥{{ reseller.totalCommission.toLocaleString() }}</div>
        </div>
      </div>
    </a-card>

    <!-- 品牌配置 -->
    <a-card title="品牌配置" class="section-card">
      <a-descriptions :column="2" bordered>
        <a-descriptions-item label="品牌名称">{{ brandConfig.name }}</a-descriptions-item>
        <a-descriptions-item label="主色">
          <div style="display: flex; align-items: center; gap: 8px">
            <div :style="{ width: '20px', height: '20px', background: brandConfig.primaryColor, border: '1px solid #d9d9d9' }"></div>
            {{ brandConfig.primaryColor }}
          </div>
        </a-descriptions-item>
        <a-descriptions-item label="Logo">
          <img v-if="brandConfig.logo" :src="brandConfig.logo" style="max-width: 120px; max-height: 40px" />
          <span v-else>-</span>
        </a-descriptions-item>
        <a-descriptions-item label="绑定域名">
          <a-tag v-for="domain in brandConfig.domains" :key="domain">{{ domain }}</a-tag>
          <span v-if="!brandConfig.domains.length">-</span>
        </a-descriptions-item>
      </a-descriptions>
    </a-card>

    <!-- 项目列表 -->
    <a-card title="项目列表" class="section-card">
      <a-table
        :columns="projectColumns"
        :data-source="projects"
        :pagination="{ pageSize: 10 }"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'status'">
            <a-tag :color="record.status === '启用' ? 'green' : 'red'">
              {{ record.status }}
            </a-tag>
          </template>
          <template v-else-if="column.key === 'revenue'">
            ¥{{ record.revenue.toLocaleString() }}
          </template>
        </template>
      </a-table>
    </a-card>

    <!-- 订单列表 -->
    <a-card title="订单列表" class="section-card">
      <a-table
        :columns="orderColumns"
        :data-source="orders"
        :pagination="{ pageSize: 10 }"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'status'">
            <a-tag :color="getOrderStatusColor(record.status)">
              {{ record.status }}
            </a-tag>
          </template>
          <template v-else-if="column.key === 'amount'">
            ¥{{ record.amount.toLocaleString() }}
          </template>
          <template v-else-if="column.key === 'commission'">
            ¥{{ record.commission.toLocaleString() }}
          </template>
        </template>
      </a-table>
    </a-card>

    <!-- 佣金明细 -->
    <a-card title="佣金明细" class="section-card">
      <a-table
        :columns="commissionColumns"
        :data-source="commissions"
        :pagination="{ pageSize: 10 }"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'status'">
            <a-tag :color="getCommissionStatusColor(record.status)">
              {{ record.status }}
            </a-tag>
          </template>
          <template v-else-if="column.key === 'amount'">
            ¥{{ record.amount.toLocaleString() }}
          </template>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { ArrowLeftOutlined } from '@ant-design/icons-vue'
import { getResellerById } from '../mock/resellersData'

const route = useRoute()
const router = useRouter()
const resellerId = route.params.id as string

// 代理商基本信息
const resellerData = getResellerById(resellerId)

if (!resellerData) {
  message.error('代理商不存在')
  router.push('/resellers')
}

const reseller = ref(resellerData || {
  id: resellerId,
  name: '未知代理商',
  contact: '-',
  email: '-',
  phone: '-',
  status: 'inactive',
  commissionRate: 0,
  createdAt: '-',
  remark: '',
  projectCount: 0,
  totalOrders: 0,
  totalRevenue: 0,
  totalCommission: 0,
})

// 品牌配置
const brandConfig = ref({
  name: 'Demo 客服',
  logo: '',
  primaryColor: '#1890ff',
  domains: ['support.demo.com', 'help.demo.com'],
})

// 项目列表
const projectColumns = [
  { title: '项目 ID', dataIndex: 'id', key: 'id' },
  { title: '项目名称', dataIndex: 'name', key: 'name' },
  { title: '服务版本', dataIndex: 'version', key: 'version' },
  { title: '客服数', dataIndex: 'clientCount', key: 'clientCount' },
  { title: '会话数', dataIndex: 'sessionCount', key: 'sessionCount' },
  { title: '收入', key: 'revenue' },
  { title: '状态', key: 'status' },
  { title: '创建时间', dataIndex: 'createdAt', key: 'createdAt' },
]

const projects = ref([
  {
    key: '1',
    id: 'proj-001',
    name: '测试项目 A',
    version: '专业版',
    clientCount: 5,
    sessionCount: 234,
    revenue: 9900,
    status: '启用',
    createdAt: '2026-02-01',
  },
  {
    key: '2',
    id: 'proj-002',
    name: '测试项目 B',
    version: '免费版',
    clientCount: 2,
    sessionCount: 89,
    revenue: 0,
    status: '启用',
    createdAt: '2026-03-15',
  },
])

// 订单列表
const orderColumns = [
  { title: '订单号', dataIndex: 'orderNo', key: 'orderNo' },
  { title: '项目名称', dataIndex: 'projectName', key: 'projectName' },
  { title: '订单金额', key: 'amount' },
  { title: '佣金', key: 'commission' },
  { title: '状态', key: 'status' },
  { title: '创建时间', dataIndex: 'createdAt', key: 'createdAt' },
]

const orders = ref([
  {
    key: '1',
    orderNo: 'ORD-20260201-001',
    projectName: '测试项目 A',
    amount: 9900,
    commission: 2970,
    status: '已支付',
    createdAt: '2026-02-01 10:30:00',
  },
  {
    key: '2',
    orderNo: 'ORD-20260315-002',
    projectName: '测试项目 B',
    amount: 9900,
    commission: 2970,
    status: '已支付',
    createdAt: '2026-03-15 14:20:00',
  },
])

// 佣金明细
const commissionColumns = [
  { title: '佣金 ID', dataIndex: 'id', key: 'id' },
  { title: '订单号', dataIndex: 'orderNo', key: 'orderNo' },
  { title: '佣金金额', key: 'amount' },
  { title: '状态', key: 'status' },
  { title: '结算时间', dataIndex: 'settledAt', key: 'settledAt' },
]

const commissions = ref([
  {
    key: '1',
    id: 'COM-001',
    orderNo: 'ORD-20260201-001',
    amount: 2970,
    status: '已结算',
    settledAt: '2026-02-05 10:00:00',
  },
  {
    key: '2',
    id: 'COM-002',
    orderNo: 'ORD-20260315-002',
    amount: 2970,
    status: '待结算',
    settledAt: '-',
  },
])

function getStatusColor(status: string) {
  const colors: Record<string, string> = {
    pending: 'orange',
    active: 'green',
    inactive: 'red',
    rejected: 'default',
  }
  return colors[status] || 'default'
}

function getStatusText(status: string) {
  const texts: Record<string, string> = {
    pending: '待审核',
    active: '已启用',
    inactive: '已停用',
    rejected: '已拒绝',
  }
  return texts[status] || status
}

function getOrderStatusColor(status: string) {
  const colors: Record<string, string> = {
    '已支付': 'green',
    '待支付': 'orange',
    '已取消': 'red',
  }
  return colors[status] || 'default'
}

function getCommissionStatusColor(status: string) {
  const colors: Record<string, string> = {
    '已结算': 'green',
    '待结算': 'orange',
    '结算中': 'blue',
  }
  return colors[status] || 'default'
}
</script>

<style scoped>
.reseller-detail-page {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.section-card {
  background: #fff;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}

.stat-item {
  text-align: center;
  padding: 20px;
  background: #fafafa;
  border-radius: 4px;
}

.stat-label {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.stat-value {
  font-size: 24px;
  font-weight: 600;
  color: #1890ff;
}
</style>
