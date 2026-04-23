<template>
  <div class="dashboard-page">
    <!-- 统计卡片 -->
    <div class="stats-cards">
      <a-card class="stat-card">
        <a-statistic title="客户总数" :value="stats.totalCustomers">
          <template #prefix><TeamOutlined style="color: #6366f1" /></template>
        </a-statistic>
      </a-card>
      <a-card class="stat-card">
        <a-statistic title="运行中" :value="stats.running">
          <template #prefix><CheckCircleOutlined style="color: #10b981" /></template>
        </a-statistic>
      </a-card>
      <a-card class="stat-card">
        <a-statistic title="待部署" :value="stats.pending">
          <template #prefix><ClockCircleOutlined style="color: #f59e0b" /></template>
        </a-statistic>
      </a-card>
      <a-card class="stat-card">
        <a-statistic title="License 即将到期" :value="stats.expiringLicenses">
          <template #prefix><WarningOutlined style="color: #ef4444" /></template>
        </a-statistic>
      </a-card>
    </div>

    <div class="dashboard-grid">
      <!-- 版本分布 -->
      <a-card title="版本分布" class="chart-card">
        <div class="version-list">
          <div v-for="v in versionDistribution" :key="v.version" class="version-item">
            <span class="version-tag">{{ v.version }}</span>
            <div class="version-bar">
              <div class="version-bar__fill" :style="{ width: v.percent + '%' }"></div>
            </div>
            <span class="version-count">{{ v.count }} 个客户</span>
          </div>
        </div>
      </a-card>

      <!-- 最近部署记录 -->
      <a-card title="最近部署记录" class="chart-card">
        <a-table
          :columns="deployColumns"
          :data-source="recentDeploys"
          :pagination="false"
          size="small"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'action'">
              <a-tag :color="getActionColor(record.action)">{{ getActionText(record.action) }}</a-tag>
            </template>
            <template v-else-if="column.key === 'result'">
              <a-tag :color="getResultColor(record.result)">{{ getResultText(record.result) }}</a-tag>
            </template>
          </template>
        </a-table>
      </a-card>

      <!-- 服务状态概览 -->
      <a-card title="服务状态概览" class="chart-card">
        <div class="service-overview">
          <div class="service-row">
            <span class="service-name">OSS 存储</span>
            <div class="service-dots">
              <span v-for="c in customers" :key="c.id" class="service-dot" :class="'service-dot--' + c.serviceConfig.oss.status" :title="c.name"></span>
            </div>
            <span class="service-count">{{ serviceStats.oss.connected }}/{{ serviceStats.oss.total }}</span>
          </div>
          <div class="service-row">
            <span class="service-name">邮件服务</span>
            <div class="service-dots">
              <span v-for="c in customers" :key="c.id" class="service-dot" :class="'service-dot--' + c.serviceConfig.email.status" :title="c.name"></span>
            </div>
            <span class="service-count">{{ serviceStats.email.connected }}/{{ serviceStats.email.total }}</span>
          </div>
          <div class="service-row">
            <span class="service-name">短信服务</span>
            <div class="service-dots">
              <span v-for="c in customers" :key="c.id" class="service-dot" :class="'service-dot--' + c.serviceConfig.sms.status" :title="c.name"></span>
            </div>
            <span class="service-count">{{ serviceStats.sms.connected }}/{{ serviceStats.sms.total }}</span>
          </div>
        </div>
      </a-card>
    </div>

    <!-- 快捷操作 -->
    <a-card title="快捷操作">
      <div class="quick-actions">
        <a-button type="primary" @click="$router.push('/customers')">
          <template #icon><PlusOutlined /></template>
          新增客户
        </a-button>
        <a-button @click="$router.push('/licenses')">
          <template #icon><SafetyCertificateOutlined /></template>
          签发 License
        </a-button>
        <a-button @click="$router.push('/deployments')">
          <template #icon><CloudServerOutlined /></template>
          执行部署
        </a-button>
        <a-button @click="$router.push('/versions')">
          <template #icon><TagOutlined /></template>
          发布版本
        </a-button>
      </div>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  TeamOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  WarningOutlined,
  PlusOutlined,
  SafetyCertificateOutlined,
  CloudServerOutlined,
  TagOutlined,
} from '@ant-design/icons-vue'
import { customersData } from '../mock/customersData'
import { deployRecordsData } from '../mock/deploymentsData'
import { licensesData } from '../mock/licensesData'

const customers = customersData

const stats = computed(() => {
  const now = new Date()
  const threeMonths = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000)
  return {
    totalCustomers: customers.length,
    running: customers.filter(c => c.deployStatus === 'running').length,
    pending: customers.filter(c => c.deployStatus === 'pending').length,
    expiringLicenses: licensesData.filter(l => {
      const exp = new Date(l.expiresAt)
      return l.status === 'active' && exp <= threeMonths
    }).length,
  }
})

const versionDistribution = computed(() => {
  const map: Record<string, number> = {}
  customers.forEach(c => {
    if (c.currentVersion !== '-') {
      map[c.currentVersion] = (map[c.currentVersion] || 0) + 1
    }
  })
  const total = Object.values(map).reduce((a, b) => a + b, 0)
  return Object.entries(map)
    .map(([version, count]) => ({ version, count, percent: total ? (count / total) * 100 : 0 }))
    .sort((a, b) => b.count - a.count)
})

const serviceStats = computed(() => {
  const calc = (key: 'oss' | 'email' | 'sms') => ({
    connected: customers.filter(c => c.serviceConfig[key].status === 'connected').length,
    total: customers.length,
  })
  return { oss: calc('oss'), email: calc('email'), sms: calc('sms') }
})

const recentDeploys = deployRecordsData.slice(0, 5)

const deployColumns = [
  { title: '客户', dataIndex: 'customerName', key: 'customerName' },
  { title: '操作', key: 'action' },
  { title: '版本', dataIndex: 'toVersion', key: 'toVersion' },
  { title: '结果', key: 'result' },
  { title: '时间', dataIndex: 'startedAt', key: 'startedAt' },
]

function getActionColor(action: string) {
  const map: Record<string, string> = { deploy: 'blue', upgrade: 'green', rollback: 'orange', suspend: 'red', resume: 'cyan', offline: 'default' }
  return map[action] || 'default'
}
function getActionText(action: string) {
  const map: Record<string, string> = { deploy: '部署', upgrade: '升级', rollback: '回滚', suspend: '暂停', resume: '恢复', offline: '下线' }
  return map[action] || action
}
function getResultColor(result: string) {
  const map: Record<string, string> = { success: 'green', failed: 'red', in_progress: 'blue' }
  return map[result] || 'default'
}
function getResultText(result: string) {
  const map: Record<string, string> = { success: '成功', failed: '失败', in_progress: '进行中' }
  return map[result] || result
}
</script>

<style scoped>
.dashboard-page {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.stats-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}
.stat-card { text-align: center; }
.dashboard-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}
.mode-stats { display: flex; flex-direction: column; gap: 16px; }
.version-list { display: flex; flex-direction: column; gap: 12px; }
.version-item { display: flex; align-items: center; gap: 12px; }
.version-tag { width: 60px; font-size: 13px; font-weight: 500; color: #374151; }
.version-bar { flex: 1; height: 20px; background: #f3f4f6; border-radius: 4px; overflow: hidden; }
.version-bar__fill { height: 100%; background: #6366f1; border-radius: 4px; }
.version-count { width: 70px; text-align: right; font-size: 13px; color: #6b7280; }
.service-overview { display: flex; flex-direction: column; gap: 20px; }
.service-row { display: flex; align-items: center; gap: 12px; }
.service-name { width: 70px; font-size: 14px; color: #374151; }
.service-dots { display: flex; gap: 6px; flex: 1; }
.service-dot { width: 12px; height: 12px; border-radius: 50%; }
.service-dot--connected { background: #10b981; }
.service-dot--disconnected { background: #ef4444; }
.service-dot--unconfigured { background: #d1d5db; }
.service-count { width: 40px; text-align: right; font-size: 13px; color: #6b7280; }
.quick-actions { display: flex; gap: 12px; }
</style>
