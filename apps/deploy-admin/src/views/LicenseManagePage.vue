<template>
  <div class="license-manage-page">
    <div class="stats-cards">
      <a-card class="stat-card"><a-statistic title="License 总数" :value="stats.total" /></a-card>
      <a-card class="stat-card"><a-statistic title="有效" :value="stats.active" /></a-card>
      <a-card class="stat-card"><a-statistic title="已过期" :value="stats.expired" /></a-card>
      <a-card class="stat-card"><a-statistic title="已吊销" :value="stats.revoked" /></a-card>
    </div>

    <a-card class="filter-card">
      <div class="filter-row">
        <a-input v-model:value="filters.keyword" placeholder="搜索 License Key / 客户名称" style="width: 280px" allow-clear>
          <template #prefix><SearchOutlined /></template>
        </a-input>
        <a-select v-model:value="filters.status" placeholder="状态" style="width: 120px" allow-clear>
          <a-select-option value="active">有效</a-select-option>
          <a-select-option value="expired">已过期</a-select-option>
          <a-select-option value="revoked">已吊销</a-select-option>
        </a-select>
        <a-select v-model:value="filters.plan" placeholder="版本" style="width: 120px" allow-clear>
          <a-select-option value="标准版">标准版</a-select-option>
          <a-select-option value="专业版">专业版</a-select-option>
          <a-select-option value="企业版">企业版</a-select-option>
        </a-select>
        <a-button @click="handleReset"><template #icon><ReloadOutlined /></template>重置</a-button>
        <div style="margin-left: auto">
          <a-button type="primary" @click="showIssueModal = true">
            <template #icon><PlusOutlined /></template>
            签发 License
          </a-button>
        </div>
      </div>
    </a-card>

    <a-card>
      <a-table :columns="columns" :data-source="filteredLicenses" :pagination="pagination" :scroll="{ x: 1200 }">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'licenseKey'">
            <code style="font-size: 12px">{{ record.licenseKey }}</code>
          </template>
          <template v-else-if="column.key === 'status'">
            <a-tag :color="getStatusColor(record.status)">{{ getStatusText(record.status) }}</a-tag>
          </template>
          <template v-else-if="column.key === 'features'">
            <a-tag v-for="f in record.features.slice(0, 3)" :key="f" style="margin: 2px">{{ featureLabel(f) }}</a-tag>
            <span v-if="record.features.length > 3" style="color: #6b7280; font-size: 12px">+{{ record.features.length - 3 }}</span>
          </template>
          <template v-else-if="column.key === 'expiresAt'">
            <span :style="{ color: isExpiringSoon(record.expiresAt) && record.status === 'active' ? '#ef4444' : undefined }">
              {{ record.expiresAt }}
            </span>
          </template>
          <template v-else-if="column.key === 'action'">
            <a-space>
              <a-button v-if="record.status === 'active'" size="small" @click="handleRenew(record)">续期</a-button>
              <a-button v-if="record.status === 'active'" size="small" danger @click="handleRevoke(record)">吊销</a-button>
              <a-button v-if="record.status === 'expired'" size="small" type="primary" @click="handleReissue(record)">重新签发</a-button>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>

    <!-- 签发弹窗 -->
    <a-modal v-model:open="showIssueModal" title="签发 License" width="600px" @ok="handleIssue">
      <a-form :model="issueForm" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }">
        <a-form-item label="客户" required>
          <a-select v-model:value="issueForm.customerId" placeholder="选择客户">
            <a-select-option v-for="c in availableCustomers" :key="c.id" :value="c.id">{{ c.name }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="服务版本" required>
          <a-select v-model:value="issueForm.plan">
            <a-select-option value="标准版">标准版</a-select-option>
            <a-select-option value="专业版">专业版</a-select-option>
            <a-select-option value="企业版">企业版</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="坐席上限" required>
          <a-input-number v-model:value="issueForm.maxAgents" :min="1" :max="500" style="width: 100%" />
        </a-form-item>
        <a-form-item label="有效期" required>
          <a-select v-model:value="issueForm.duration">
            <a-select-option value="6">6 个月</a-select-option>
            <a-select-option value="12">1 年</a-select-option>
            <a-select-option value="24">2 年</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="功能权限">
          <a-checkbox-group v-model:value="issueForm.features" :options="featureOptions" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { message } from 'ant-design-vue'
import { PlusOutlined, SearchOutlined, ReloadOutlined } from '@ant-design/icons-vue'
import { licensesData, type License } from '../mock/licensesData'
import { customersData } from '../mock/customersData'

const licenses = ref<License[]>([...licensesData])
const showIssueModal = ref(false)

const filters = reactive({ keyword: '', status: undefined as string | undefined, plan: undefined as string | undefined })

const stats = computed(() => ({
  total: licenses.value.length,
  active: licenses.value.filter(l => l.status === 'active').length,
  expired: licenses.value.filter(l => l.status === 'expired').length,
  revoked: licenses.value.filter(l => l.status === 'revoked').length,
}))

const filteredLicenses = computed(() => {
  let result = licenses.value
  if (filters.keyword) {
    const kw = filters.keyword.toLowerCase()
    result = result.filter(l => l.licenseKey.toLowerCase().includes(kw) || l.customerName.toLowerCase().includes(kw))
  }
  if (filters.status) result = result.filter(l => l.status === filters.status)
  if (filters.plan) result = result.filter(l => l.plan === filters.plan)
  return result
})

const availableCustomers = customersData.filter(c => !c.licenseKey)

const columns = [
  { title: 'License Key', key: 'licenseKey', width: 200 },
  { title: '客户', dataIndex: 'customerName', key: 'customerName', width: 100 },
  { title: '版本', dataIndex: 'plan', key: 'plan', width: 80 },
  { title: '坐席上限', dataIndex: 'maxAgents', key: 'maxAgents', width: 80 },
  { title: '功能', key: 'features', width: 200 },
  { title: '到期时间', key: 'expiresAt', width: 110 },
  { title: '状态', key: 'status', width: 80 },
  { title: '操作', key: 'action', width: 160, fixed: 'right' as const },
]

const pagination = ref({ current: 1, pageSize: 10, showSizeChanger: true, showTotal: (t: number) => `共 ${t} 条` })

const featureOptions = [
  { label: 'AI 机器人', value: 'ai-agent' },
  { label: '多渠道', value: 'multi-channel' },
  { label: '数据分析', value: 'analytics' },
  { label: '自定义品牌', value: 'custom-brand' },
  { label: 'SLA', value: 'sla' },
  { label: '审计日志', value: 'audit-log' },
]

const issueForm = reactive({
  customerId: '', plan: '专业版', maxAgents: 20, duration: '12',
  features: ['multi-channel', 'analytics'] as string[],
})

const featureLabelMap: Record<string, string> = {
  'ai-agent': 'AI', 'multi-channel': '多渠道', analytics: '分析',
  'custom-brand': '品牌', sla: 'SLA', 'audit-log': '审计',
}
function featureLabel(f: string) { return featureLabelMap[f] || f }
function getStatusColor(s: string) { return { active: 'green', expired: 'orange', revoked: 'red' }[s] || 'default' }
function getStatusText(s: string) { return { active: '有效', expired: '已过期', revoked: '已吊销' }[s] || s }
function isExpiringSoon(date: string) {
  const diff = new Date(date).getTime() - Date.now()
  return diff > 0 && diff < 90 * 24 * 60 * 60 * 1000
}
function handleReset() { filters.keyword = ''; filters.status = undefined; filters.plan = undefined }
function handleRenew(record: License) {
  const exp = new Date(record.expiresAt)
  exp.setFullYear(exp.getFullYear() + 1)
  record.expiresAt = exp.toISOString().split('T')[0]
  message.success('续期成功，新到期时间：' + record.expiresAt)
}
function handleRevoke(record: License) { record.status = 'revoked'; message.success('已吊销') }
function handleReissue(record: License) { record.status = 'active'; message.success('已重新签发') }
function handleIssue() {
  if (!issueForm.customerId) { message.error('请选择客户'); return }
  const customer = customersData.find(c => c.id === issueForm.customerId)
  const key = `LIC-${issueForm.customerId.toUpperCase()}-${new Date().getFullYear()}`
  const exp = new Date()
  exp.setMonth(exp.getMonth() + parseInt(issueForm.duration))
  licenses.value.push({
    key: String(licenses.value.length + 1), licenseKey: key,
    customerId: issueForm.customerId, customerName: customer?.name || '',
    plan: issueForm.plan, maxAgents: issueForm.maxAgents, features: [...issueForm.features],
    issuedAt: new Date().toISOString().split('T')[0], expiresAt: exp.toISOString().split('T')[0],
    status: 'active', lastVerified: '-',
  })
  message.success('License 签发成功')
  showIssueModal.value = false
}
</script>

<style scoped>
.license-manage-page { display: flex; flex-direction: column; gap: 16px; }
.stats-cards { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
.stat-card { text-align: center; }
.filter-row { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
</style>
