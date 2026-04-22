<template>
  <div class="deployment-manage-page">
    <div class="stats-cards">
      <a-card class="stat-card"><a-statistic title="总部署次数" :value="records.length" /></a-card>
      <a-card class="stat-card"><a-statistic title="成功" :value="successCount" /></a-card>
      <a-card class="stat-card"><a-statistic title="失败" :value="failedCount" /></a-card>
      <a-card class="stat-card"><a-statistic title="进行中" :value="inProgressCount" /></a-card>
    </div>

    <a-card class="filter-card">
      <div class="filter-row">
        <a-input v-model:value="filters.keyword" placeholder="搜索客户名称" style="width: 200px" allow-clear>
          <template #prefix><SearchOutlined /></template>
        </a-input>
        <a-select v-model:value="filters.action" placeholder="操作类型" style="width: 120px" allow-clear>
          <a-select-option value="deploy">部署</a-select-option>
          <a-select-option value="upgrade">升级</a-select-option>
          <a-select-option value="rollback">回滚</a-select-option>
          <a-select-option value="suspend">暂停</a-select-option>
          <a-select-option value="resume">恢复</a-select-option>
          <a-select-option value="offline">下线</a-select-option>
        </a-select>
        <a-select v-model:value="filters.result" placeholder="结果" style="width: 120px" allow-clear>
          <a-select-option value="success">成功</a-select-option>
          <a-select-option value="failed">失败</a-select-option>
          <a-select-option value="in_progress">进行中</a-select-option>
        </a-select>
        <a-button @click="handleReset"><template #icon><ReloadOutlined /></template>重置</a-button>
        <div style="margin-left: auto">
          <a-button type="primary" @click="showDeployModal = true">
            <template #icon><CloudServerOutlined /></template>
            执行部署
          </a-button>
        </div>
      </div>
    </a-card>

    <a-card>
      <a-table :columns="columns" :data-source="filteredRecords" :pagination="pagination" :scroll="{ x: 1200 }">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'action'">
            <a-tag :color="getActionColor(record.action)">{{ getActionText(record.action) }}</a-tag>
          </template>
          <template v-else-if="column.key === 'version'">
            <span v-if="record.fromVersion !== '-'">{{ record.fromVersion }} → </span>{{ record.toVersion }}
          </template>
          <template v-else-if="column.key === 'result'">
            <a-tag :color="getResultColor(record.result)">{{ getResultText(record.result) }}</a-tag>
          </template>
          <template v-else-if="column.key === 'duration'">
            {{ calcDuration(record.startedAt, record.finishedAt) }}
          </template>
          <template v-else-if="column.key === 'ops'">
            <a-button v-if="record.result === 'in_progress'" size="small" danger>取消</a-button>
            <a-button v-if="record.result === 'failed'" size="small" type="primary">重试</a-button>
          </template>
        </template>
      </a-table>
    </a-card>

    <!-- 执行部署弹窗 -->
    <a-modal v-model:open="showDeployModal" title="执行部署" @ok="handleDeploy">
      <a-form :model="deployForm" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }">
        <a-form-item label="客户" required>
          <a-select v-model:value="deployForm.customerId" placeholder="选择客户">
            <a-select-option v-for="c in deployableCustomers" :key="c.id" :value="c.id">
              {{ c.name }} ({{ c.deployStatus === 'pending' ? '首次部署' : '当前 ' + c.currentVersion }})
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="操作类型" required>
          <a-radio-group v-model:value="deployForm.action">
            <a-radio value="deploy">首次部署</a-radio>
            <a-radio value="upgrade">升级</a-radio>
            <a-radio value="rollback">回滚</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="目标版本" required>
          <a-select v-model:value="deployForm.toVersion">
            <a-select-option v-for="v in versions" :key="v.version" :value="v.version">
              {{ v.version }} {{ v.isLatest ? '(最新)' : '' }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="备注">
          <a-textarea v-model:value="deployForm.remark" :rows="2" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { message } from 'ant-design-vue'
import { SearchOutlined, ReloadOutlined, CloudServerOutlined } from '@ant-design/icons-vue'
import { deployRecordsData, versionsData, type DeployRecord } from '../mock/deploymentsData'
import { customersData } from '../mock/customersData'

const records = ref<DeployRecord[]>([...deployRecordsData])
const versions = versionsData
const showDeployModal = ref(false)

const filters = reactive({ keyword: '', action: undefined as string | undefined, result: undefined as string | undefined })

const successCount = computed(() => records.value.filter(r => r.result === 'success').length)
const failedCount = computed(() => records.value.filter(r => r.result === 'failed').length)
const inProgressCount = computed(() => records.value.filter(r => r.result === 'in_progress').length)

const filteredRecords = computed(() => {
  let result = records.value
  if (filters.keyword) {
    const kw = filters.keyword.toLowerCase()
    result = result.filter(r => r.customerName.toLowerCase().includes(kw))
  }
  if (filters.action) result = result.filter(r => r.action === filters.action)
  if (filters.result) result = result.filter(r => r.result === filters.result)
  return result.sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime())
})

const deployableCustomers = customersData.filter(c => c.deployStatus !== 'offline')

const columns = [
  { title: '部署 ID', dataIndex: 'id', key: 'id', width: 100 },
  { title: '客户', dataIndex: 'customerName', key: 'customerName', width: 100 },
  { title: '操作', key: 'action', width: 80 },
  { title: '版本', key: 'version', width: 160 },
  { title: '结果', key: 'result', width: 80 },
  { title: '操作人', dataIndex: 'operator', key: 'operator', width: 80 },
  { title: '开始时间', dataIndex: 'startedAt', key: 'startedAt', width: 160 },
  { title: '耗时', key: 'duration', width: 80 },
  { title: '备注', dataIndex: 'remark', key: 'remark', width: 120, ellipsis: true },
  { title: '操作', key: 'ops', width: 80, fixed: 'right' as const },
]

const pagination = ref({ current: 1, pageSize: 10, showSizeChanger: true, showTotal: (t: number) => `共 ${t} 条` })

const deployForm = reactive({ customerId: '', action: 'deploy', toVersion: 'v2.3.1', remark: '' })

function getActionColor(a: string) {
  return { deploy: 'blue', upgrade: 'green', rollback: 'orange', suspend: 'red', resume: 'cyan', offline: 'default' }[a] || 'default'
}
function getActionText(a: string) {
  return { deploy: '部署', upgrade: '升级', rollback: '回滚', suspend: '暂停', resume: '恢复', offline: '下线' }[a] || a
}
function getResultColor(r: string) { return { success: 'green', failed: 'red', in_progress: 'blue' }[r] || 'default' }
function getResultText(r: string) { return { success: '成功', failed: '失败', in_progress: '进行中' }[r] || r }
function calcDuration(start: string, end: string) {
  if (!end || end === start) return '-'
  const diff = (new Date(end).getTime() - new Date(start).getTime()) / 1000
  if (diff < 60) return `${Math.round(diff)}s`
  return `${Math.round(diff / 60)}m`
}
function handleReset() { filters.keyword = ''; filters.action = undefined; filters.result = undefined }
function handleDeploy() {
  if (!deployForm.customerId) { message.error('请选择客户'); return }
  const customer = customersData.find(c => c.id === deployForm.customerId)
  records.value.unshift({
    key: String(records.value.length + 1),
    id: `dep-${String(records.value.length + 1).padStart(3, '0')}`,
    customerId: deployForm.customerId, customerName: customer?.name || '',
    action: deployForm.action as any,
    fromVersion: customer?.currentVersion || '-', toVersion: deployForm.toVersion,
    result: 'success', operator: '管理员',
    startedAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
    finishedAt: new Date(Date.now() + 600000).toISOString().replace('T', ' ').slice(0, 19),
    remark: deployForm.remark,
  })
  message.success('部署成功')
  showDeployModal.value = false
}
</script>

<style scoped>
.deployment-manage-page { display: flex; flex-direction: column; gap: 16px; }
.stats-cards { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
.stat-card { text-align: center; }
.filter-row { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
</style>
