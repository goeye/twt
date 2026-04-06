<template>
  <div class="dashboard-page">
    <h2 class="page-title">数据看板</h2>

    <!-- 统计卡片 -->
    <a-row :gutter="16" style="margin-bottom: 24px">
      <a-col :span="6">
        <a-card>
          <a-statistic
            title="总项目数"
            :value="stats.totalProjects"
            :value-style="{ color: tenant.primaryColor }"
          >
            <template #prefix>
              <ProjectOutlined />
            </template>
          </a-statistic>
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card>
          <a-statistic
            title="总订单数"
            :value="stats.totalOrders"
            :value-style="{ color: '#3f8600' }"
          >
            <template #prefix>
              <ShoppingOutlined />
            </template>
          </a-statistic>
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card>
          <a-statistic
            title="总收入"
            :value="stats.totalRevenue"
            :precision="2"
            prefix="¥"
            :value-style="{ color: '#cf1322' }"
          >
            <template #prefix>
              <DollarOutlined />
            </template>
          </a-statistic>
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card>
          <a-statistic
            title="待提现佣金"
            :value="stats.pendingCommission"
            :precision="2"
            prefix="¥"
          >
            <template #prefix>
              <WalletOutlined />
            </template>
          </a-statistic>
        </a-card>
      </a-col>
    </a-row>

    <!-- 最近订单 -->
    <a-card title="最近订单" style="margin-bottom: 24px">
      <a-table
        :columns="orderColumns"
        :data-source="recentOrders"
        :pagination="false"
        size="small"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'status'">
            <a-tag :color="getStatusColor(record.status)">
              {{ getStatusText(record.status) }}
            </a-tag>
          </template>
          <template v-if="column.key === 'amount'">
            ¥{{ record.amount.toFixed(2) }}
          </template>
        </template>
      </a-table>
    </a-card>

    <!-- 快捷操作 -->
    <a-card title="快捷操作">
      <a-space>
        <a-button type="primary" @click="$router.push('/brand')">
          <template #icon><SettingOutlined /></template>
          品牌配置
        </a-button>
        <a-button @click="$router.push('/projects')">
          <template #icon><ProjectOutlined /></template>
          项目管理
        </a-button>
        <a-button @click="$router.push('/orders')">
          <template #icon><ShoppingOutlined /></template>
          订单管理
        </a-button>
        <a-button @click="$router.push('/commission')">
          <template #icon><WalletOutlined /></template>
          佣金管理
        </a-button>
      </a-space>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  ProjectOutlined,
  ShoppingOutlined,
  DollarOutlined,
  WalletOutlined,
  SettingOutlined,
} from '@ant-design/icons-vue'
import { useTenant } from '@twt/branding'

const tenant = useTenant()

// 模拟数据
const stats = ref({
  totalProjects: 12,
  totalOrders: 156,
  totalRevenue: 89650.00,
  pendingCommission: 26895.00,
})

const orderColumns = [
  { title: '订单号', dataIndex: 'orderNo', key: 'orderNo' },
  { title: '项目名称', dataIndex: 'projectName', key: 'projectName' },
  { title: '金额', dataIndex: 'amount', key: 'amount' },
  { title: '状态', dataIndex: 'status', key: 'status' },
  { title: '创建时间', dataIndex: 'createdAt', key: 'createdAt' },
]

const recentOrders = ref([
  {
    key: '1',
    orderNo: 'ORD20260406001',
    projectName: '电商客服项目',
    amount: 999.00,
    status: 'paid',
    createdAt: '2026-04-06 10:30:00',
  },
  {
    key: '2',
    orderNo: 'ORD20260405002',
    projectName: '在线教育客服',
    amount: 1999.00,
    status: 'paid',
    createdAt: '2026-04-05 15:20:00',
  },
  {
    key: '3',
    orderNo: 'ORD20260404003',
    projectName: '金融服务客服',
    amount: 2999.00,
    status: 'pending',
    createdAt: '2026-04-04 09:15:00',
  },
])

function getStatusColor(status: string) {
  const colors: Record<string, string> = {
    paid: 'green',
    pending: 'orange',
    cancelled: 'red',
  }
  return colors[status] || 'default'
}

function getStatusText(status: string) {
  const texts: Record<string, string> = {
    paid: '已支付',
    pending: '待支付',
    cancelled: '已取消',
  }
  return texts[status] || status
}
</script>

<style scoped>
.dashboard-page {
  background: #f0f2f5;
  padding: 24px;
  min-height: calc(100vh - 112px);
}

.page-title {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 24px;
  color: #262626;
}
</style>
