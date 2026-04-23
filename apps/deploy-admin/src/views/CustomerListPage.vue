<template>
  <div class="customer-list-page">
    <!-- 统计卡片 -->
    <div class="stats-cards">
      <a-card class="stat-card">
        <a-statistic title="客户总数" :value="stats.total" />
      </a-card>
      <a-card class="stat-card">
        <a-statistic title="运行中" :value="stats.running" />
      </a-card>
      <a-card class="stat-card">
        <a-statistic title="待部署" :value="stats.pending" />
      </a-card>
      <a-card class="stat-card">
        <a-statistic title="已暂停/下线" :value="stats.inactive" />
      </a-card>
    </div>

    <!-- 筛选 -->
    <a-card class="filter-card">
      <div class="filter-row">
        <a-input
          v-model:value="filters.keyword"
          placeholder="搜索客户名称/ID/域名"
          style="width: 240px"
          allow-clear
        >
          <template #prefix><SearchOutlined /></template>
        </a-input>
        <a-select v-model:value="filters.deployStatus" placeholder="部署状态" style="width: 120px" allow-clear>
          <a-select-option value="pending">待部署</a-select-option>
          <a-select-option value="running">运行中</a-select-option>
          <a-select-option value="suspended">已暂停</a-select-option>
          <a-select-option value="offline">已下线</a-select-option>
        </a-select>
        <a-select v-model:value="filters.plan" placeholder="服务版本" style="width: 120px" allow-clear>
          <a-select-option value="标准版">标准版</a-select-option>
          <a-select-option value="专业版">专业版</a-select-option>
          <a-select-option value="企业版">企业版</a-select-option>
        </a-select>
        <a-button @click="handleReset">
          <template #icon><ReloadOutlined /></template>
          重置
        </a-button>
        <div style="margin-left: auto">
          <a-button type="primary" @click="showAddModal = true">
            <template #icon><PlusOutlined /></template>
            新增客户
          </a-button>
        </div>
      </div>
    </a-card>

    <!-- 客户列表 -->
    <a-card>
      <a-table
        :columns="columns"
        :data-source="filteredCustomers"
        :pagination="pagination"
        :scroll="{ x: 1400 }"
        @change="handleTableChange"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'name'">
            <a @click="handleView(record)">{{ record.name }}</a>
          </template>
          <template v-else-if="column.key === 'deployStatus'">
            <a-tag :color="getStatusColor(record.deployStatus)">
              {{ getStatusText(record.deployStatus) }}
            </a-tag>
          </template>
          <template v-else-if="column.key === 'licenseExpiry'">
            <span :style="{ color: isExpiringSoon(record.licenseExpiry) ? '#ef4444' : undefined }">
              {{ record.licenseExpiry }}
            </span>
          </template>
          <template v-else-if="column.key === 'agents'">
            {{ record.activeAgents }}/{{ record.maxAgents }}
          </template>
          <template v-else-if="column.key === 'services'">
            <div class="service-indicators">
              <a-tooltip title="OSS">
                <span class="indicator" :class="'indicator--' + record.serviceConfig.oss.status">O</span>
              </a-tooltip>
              <a-tooltip title="邮件">
                <span class="indicator" :class="'indicator--' + record.serviceConfig.email.status">E</span>
              </a-tooltip>
              <a-tooltip title="短信">
                <span class="indicator" :class="'indicator--' + record.serviceConfig.sms.status">S</span>
              </a-tooltip>
            </div>
          </template>
          <template v-else-if="column.key === 'action'">
            <a-space>
              <a-button size="small" @click="handleView(record)">查看</a-button>
              <a-button size="small" @click="handleEdit(record)">编辑</a-button>
              <a-dropdown>
                <a-button size="small">更多</a-button>
                <template #overlay>
                  <a-menu>
                    <a-menu-item v-if="record.deployStatus === 'pending'" @click="handleDeploy(record)">执行部署</a-menu-item>
                    <a-menu-item v-if="record.deployStatus === 'running'" @click="handleSuspend(record)">暂停服务</a-menu-item>
                    <a-menu-item v-if="record.deployStatus === 'suspended'" @click="handleResume(record)">恢复服务</a-menu-item>
                    <a-menu-item v-if="record.deployStatus !== 'offline'" danger @click="handleOffline(record)">下线</a-menu-item>
                  </a-menu>
                </template>
              </a-dropdown>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>

    <!-- 新增客户弹窗 -->
    <a-modal v-model:open="showAddModal" title="新增客户" width="640px" @ok="handleAdd">
      <a-form :model="addForm" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }">
        <a-form-item label="客户名称" required>
          <a-input v-model:value="addForm.name" />
        </a-form-item>
        <a-form-item label="联系人" required>
          <a-input v-model:value="addForm.contact" />
        </a-form-item>
        <a-form-item label="邮箱" required>
          <a-input v-model:value="addForm.email" type="email" />
        </a-form-item>
        <a-form-item label="手机号">
          <a-input v-model:value="addForm.phone" />
        </a-form-item>
        <a-form-item label="服务版本" required>
          <a-select v-model:value="addForm.plan">
            <a-select-option value="标准版">标准版</a-select-option>
            <a-select-option value="专业版">专业版</a-select-option>
            <a-select-option value="企业版">企业版</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="绑定域名" required>
          <a-input v-model:value="addForm.domain" placeholder="chat.customer.com" />
        </a-form-item>
        <a-form-item label="服务器 IP" required>
          <a-input v-model:value="addForm.serverIp" placeholder="47.96.xx.xx" />
        </a-form-item>
        <a-form-item label="坐席上限">
          <a-input-number v-model:value="addForm.maxAgents" :min="1" :max="500" style="width: 100%" />
        </a-form-item>
        <a-form-item label="备注">
          <a-textarea v-model:value="addForm.remark" :rows="3" />
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 编辑弹窗 -->
    <a-modal v-model:open="showEditModal" title="编辑客户" width="640px" @ok="handleEditSubmit">
      <a-form :model="editForm" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }">
        <a-form-item label="客户 ID">
          <span>{{ editForm.id }}</span>
        </a-form-item>
        <a-form-item label="客户名称" required>
          <a-input v-model:value="editForm.name" />
        </a-form-item>
        <a-form-item label="联系人" required>
          <a-input v-model:value="editForm.contact" />
        </a-form-item>
        <a-form-item label="邮箱" required>
          <a-input v-model:value="editForm.email" type="email" />
        </a-form-item>
        <a-form-item label="手机号">
          <a-input v-model:value="editForm.phone" />
        </a-form-item>
        <a-form-item label="绑定域名">
          <a-input v-model:value="editForm.domain" />
        </a-form-item>
        <a-form-item label="坐席上限">
          <a-input-number v-model:value="editForm.maxAgents" :min="1" :max="500" style="width: 100%" />
        </a-form-item>
        <a-form-item label="备注">
          <a-textarea v-model:value="editForm.remark" :rows="3" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { PlusOutlined, SearchOutlined, ReloadOutlined } from '@ant-design/icons-vue'
import { customersData, type Customer } from '../mock/customersData'

const router = useRouter()
const showAddModal = ref(false)
const showEditModal = ref(false)
const customers = ref<Customer[]>([...customersData])

const filters = reactive({
  keyword: '',
  deployStatus: undefined as string | undefined,
  plan: undefined as string | undefined,
})

const stats = computed(() => ({
  total: customers.value.length,
  running: customers.value.filter(c => c.deployStatus === 'running').length,
  pending: customers.value.filter(c => c.deployStatus === 'pending').length,
  inactive: customers.value.filter(c => c.deployStatus === 'suspended' || c.deployStatus === 'offline').length,
}))

const filteredCustomers = computed(() => {
  let result = customers.value
  if (filters.keyword) {
    const kw = filters.keyword.toLowerCase()
    result = result.filter(c => c.name.toLowerCase().includes(kw) || c.id.toLowerCase().includes(kw) || c.domain.toLowerCase().includes(kw))
  }
  if (filters.deployStatus) result = result.filter(c => c.deployStatus === filters.deployStatus)
  if (filters.plan) result = result.filter(c => c.plan === filters.plan)
  pagination.value.total = result.length
  return result
})

const columns = [
  { title: '客户名称', key: 'name', width: 120 },
  { title: '域名', dataIndex: 'domain', key: 'domain', width: 180 },
  { title: '服务器 IP', dataIndex: 'serverIp', key: 'serverIp', width: 130 },
  { title: '状态', key: 'deployStatus', width: 90 },
  { title: '版本', dataIndex: 'currentVersion', key: 'currentVersion', width: 80 },
  { title: '版本', dataIndex: 'plan', key: 'plan', width: 80 },
  { title: '坐席', key: 'agents', width: 80 },
  { title: 'License 到期', key: 'licenseExpiry', width: 120 },
  { title: '服务状态', key: 'services', width: 100 },
  { title: '操作', key: 'action', width: 180, fixed: 'right' as const },
]

const pagination = ref({
  current: 1, pageSize: 10, total: customers.value.length,
  showSizeChanger: true, showTotal: (total: number) => `共 ${total} 条`,
})

const addForm = reactive({
  name: '', contact: '', email: '', phone: '',
  plan: '专业版', domain: '', serverIp: '', maxAgents: 20, remark: '',
})

const editForm = reactive({
  id: '', name: '', contact: '', email: '', phone: '',
  domain: '', maxAgents: 20, remark: '',
})

function getStatusColor(status: string) {
  const map: Record<string, string> = { pending: 'orange', running: 'green', suspended: 'red', offline: 'default' }
  return map[status] || 'default'
}
function getStatusText(status: string) {
  const map: Record<string, string> = { pending: '待部署', running: '运行中', suspended: '已暂停', offline: '已下线' }
  return map[status] || status
}
function isExpiringSoon(date: string) {
  const exp = new Date(date)
  const now = new Date()
  const diff = exp.getTime() - now.getTime()
  return diff > 0 && diff < 90 * 24 * 60 * 60 * 1000
}

function handleReset() {
  filters.keyword = ''
  filters.deployStatus = undefined
  filters.plan = undefined
}
function handleTableChange(pag: any) {
  pagination.value.current = pag.current
  pagination.value.pageSize = pag.pageSize
}
function handleView(record: Customer) { router.push(`/customers/${record.id}`) }
function handleEdit(record: Customer) {
  editForm.id = record.id
  editForm.name = record.name
  editForm.contact = record.contact
  editForm.email = record.email
  editForm.phone = record.phone
  editForm.domain = record.domain
  editForm.maxAgents = record.maxAgents
  editForm.remark = record.remark
  showEditModal.value = true
}
function handleEditSubmit() {
  const c = customers.value.find(c => c.id === editForm.id)
  if (c) {
    c.name = editForm.name; c.contact = editForm.contact; c.email = editForm.email
    c.phone = editForm.phone; c.domain = editForm.domain; c.maxAgents = editForm.maxAgents
    c.remark = editForm.remark
    message.success('编辑成功')
  }
  showEditModal.value = false
}
function handleAdd() {
  if (!addForm.name || !addForm.contact || !addForm.email || !addForm.domain || !addForm.serverIp) {
    message.error('请填写必填项'); return
  }
  const id = `cust-${String(customers.value.length + 1).padStart(3, '0')}`
  customers.value.push({
    key: String(customers.value.length + 1), id, name: addForm.name,
    contact: addForm.contact, email: addForm.email, phone: addForm.phone,
    deployStatus: 'pending', currentVersion: '-',
    domain: addForm.domain, serverIp: addForm.serverIp,
    maxAgents: addForm.maxAgents, activeAgents: 0,
    licenseKey: '', licenseExpiry: '', plan: addForm.plan,
    serviceConfig: {
      oss: { provider: '', bucket: '', region: '', status: 'unconfigured' },
      email: { provider: '', fromEmail: '', status: 'unconfigured' },
      sms: { provider: '', status: 'unconfigured' },
    },
    createdAt: new Date().toISOString().split('T')[0], remark: addForm.remark,
  })
  message.success('新增客户成功')
  showAddModal.value = false
  addForm.name = ''; addForm.contact = ''; addForm.email = ''; addForm.phone = ''
  addForm.domain = ''; addForm.serverIp = ''; addForm.maxAgents = 20; addForm.remark = ''
}
function handleDeploy(record: Customer) {
  record.deployStatus = 'running'; record.currentVersion = 'v2.3.1'
  message.success(`${record.name} 部署成功`)
}
function handleSuspend(record: Customer) {
  record.deployStatus = 'suspended'; record.activeAgents = 0
  message.success(`${record.name} 已暂停`)
}
function handleResume(record: Customer) {
  record.deployStatus = 'running'
  message.success(`${record.name} 已恢复`)
}
function handleOffline(record: Customer) {
  record.deployStatus = 'offline'; record.activeAgents = 0
  message.success(`${record.name} 已下线`)
}
</script>

<style scoped>
.customer-list-page { display: flex; flex-direction: column; gap: 16px; }
.stats-cards { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
.stat-card { text-align: center; }
.filter-row { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
.service-indicators { display: flex; gap: 4px; }
.indicator {
  display: inline-flex; align-items: center; justify-content: center;
  width: 22px; height: 22px; border-radius: 4px; font-size: 11px; font-weight: 600; color: #fff;
}
.indicator--connected { background: #10b981; }
.indicator--disconnected { background: #ef4444; }
.indicator--unconfigured { background: #d1d5db; color: #6b7280; }
</style>
