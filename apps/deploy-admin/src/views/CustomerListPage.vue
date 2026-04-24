<template>
  <div class="customer-list-page">
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
          <template v-else-if="column.key === 'users'">
            {{ record.activeUsers }}/{{ record.maxUsers }}
          </template>
          <template v-else-if="column.key === 'services'">
            <div class="service-indicators">
              <a-tooltip title="文件存储">
                <span class="indicator" :class="'indicator--' + record.serviceConfig.storage.status">S</span>
              </a-tooltip>
              <a-tooltip title="APNs 推送">
                <span class="indicator" :class="'indicator--' + record.serviceConfig.push.apns">A</span>
              </a-tooltip>
              <a-tooltip title="FCM 推送">
                <span class="indicator" :class="'indicator--' + record.serviceConfig.push.fcm">F</span>
              </a-tooltip>
              <a-tooltip title="邮件">
                <span class="indicator" :class="'indicator--' + record.serviceConfig.email.status">E</span>
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
                    <a-menu-item @click="handleGenerateDeployFiles(record)">生成部署文件</a-menu-item>
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
          <a-input v-model:value="addForm.domain" placeholder="link.customer.com" />
        </a-form-item>
        <a-form-item label="服务器 IP" required>
          <a-input v-model:value="addForm.serverIp" placeholder="47.96.xx.xx" />
        </a-form-item>
        <a-form-item label="用户上限">
          <a-input-number v-model:value="addForm.maxUsers" :min="1" :max="10000" style="width: 100%" />
        </a-form-item>
        <a-form-item label="备注">
          <a-textarea v-model:value="addForm.remark" :rows="3" />
        </a-form-item>
      </a-form>
    </a-modal>

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
        <a-form-item label="用户上限">
          <a-input-number v-model:value="editForm.maxUsers" :min="1" :max="10000" style="width: 100%" />
        </a-form-item>
        <a-form-item label="备注">
          <a-textarea v-model:value="editForm.remark" :rows="3" />
        </a-form-item>
      </a-form>
    </a-modal>

    <a-modal v-model:open="showDeployFilesModal" title="生成部署文件" width="720px" :footer="null">
      <a-alert type="info" style="margin-bottom: 16px">
        <template #message>
          为 <strong>{{ deployFilesCustomer?.name }}</strong> 生成专属部署配置文件，客户可直接用于 Docker 部署。
        </template>
      </a-alert>
      <div class="deploy-files-preview">
        <a-tabs>
          <a-tab-pane key="env" tab=".env">
            <pre class="code-block">{{ generatedEnv }}</pre>
          </a-tab-pane>
          <a-tab-pane key="compose" tab="docker-compose.yml">
            <pre class="code-block">{{ generatedCompose }}</pre>
          </a-tab-pane>
          <a-tab-pane key="registry" tab="Registry 凭证">
            <div style="padding: 16px">
              <p><strong>Registry:</strong> {{ deployFilesCustomer?.registryCredential.registry }}</p>
              <p><strong>用户名:</strong> {{ deployFilesCustomer?.registryCredential.username }}</p>
              <p><strong>密码:</strong> {{ deployFilesCustomer?.registryCredential.password }}</p>
              <a-divider />
              <p style="color: #6b7280">客户执行以下命令登录：</p>
              <pre class="code-block">docker login {{ deployFilesCustomer?.registryCredential.registry }} -u {{ deployFilesCustomer?.registryCredential.username }}</pre>
            </div>
          </a-tab-pane>
        </a-tabs>
        <div style="margin-top: 16px; text-align: right">
          <a-button type="primary" @click="handleDownloadDeployFiles">下载部署文件包</a-button>
        </div>
      </div>
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
const showDeployFilesModal = ref(false)
const deployFilesCustomer = ref<Customer | null>(null)
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
  { title: '套餐', dataIndex: 'plan', key: 'plan', width: 80 },
  { title: '用户数', key: 'users', width: 100 },
  { title: 'License 到期', key: 'licenseExpiry', width: 120 },
  { title: '服务状态', key: 'services', width: 120 },
  { title: '操作', key: 'action', width: 200, fixed: 'right' as const },
]

const pagination = ref({
  current: 1, pageSize: 10, total: customers.value.length,
  showSizeChanger: true, showTotal: (total: number) => `共 ${total} 条`,
})

const addForm = reactive({
  name: '', contact: '', email: '', phone: '',
  plan: '专业版', domain: '', serverIp: '', maxUsers: 200, remark: '',
})

const editForm = reactive({
  id: '', name: '', contact: '', email: '', phone: '',
  domain: '', maxUsers: 200, remark: '',
})

const generatedEnv = computed(() => {
  const c = deployFilesCustomer.value
  if (!c) return ''
  return `# TWT-Link 私有化部署配置 - ${c.name}
# 生成时间: ${new Date().toISOString().split('T')[0]}

DOMAIN=${c.domain}
API_PORT=8080
IM_PORT=8443

DB_HOST=database
DB_PORT=5432
DB_NAME=twt_link
DB_USER=twt
DB_PASSWORD=<请设置数据库密码>

REDIS_HOST=redis
REDIS_PORT=6379

STORAGE_PROVIDER=${c.serviceConfig.storage.provider || '<请配置>'}
STORAGE_BUCKET=${c.serviceConfig.storage.bucket || '<请配置>'}
STORAGE_REGION=${c.serviceConfig.storage.region || '<请配置>'}
STORAGE_ACCESS_KEY=<请配置>
STORAGE_SECRET_KEY=<请配置>

LICENSE_KEY=${c.licenseKey}`
})

const generatedCompose = computed(() => {
  return `version: "3.8"
services:
  nginx:
    image: registry.twt-link.com/twt-link/nginx:latest
    ports:
      - "80:80"
      - "443:443"
    depends_on:
      - api-server
      - im-server
    restart: always

  api-server:
    image: registry.twt-link.com/twt-link/api-server:latest
    env_file: .env
    depends_on:
      - database
      - redis
    restart: always

  im-server:
    image: registry.twt-link.com/twt-link/im-server:latest
    env_file: .env
    ports:
      - "\${IM_PORT:-8443}:8443"
    depends_on:
      - redis
    restart: always

  database:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: \${DB_NAME}
      POSTGRES_USER: \${DB_USER}
      POSTGRES_PASSWORD: \${DB_PASSWORD}
    volumes:
      - pgdata:/var/lib/postgresql/data
    restart: always

  redis:
    image: redis:7-alpine
    restart: always

volumes:
  pgdata:`
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
  editForm.maxUsers = record.maxUsers
  editForm.remark = record.remark
  showEditModal.value = true
}
function handleEditSubmit() {
  const c = customers.value.find(c => c.id === editForm.id)
  if (c) {
    c.name = editForm.name; c.contact = editForm.contact; c.email = editForm.email
    c.phone = editForm.phone; c.domain = editForm.domain; c.maxUsers = editForm.maxUsers
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
    maxUsers: addForm.maxUsers, activeUsers: 0,
    licenseKey: '', licenseExpiry: '', plan: addForm.plan,
    serviceConfig: {
      storage: { provider: '', bucket: '', region: '', status: 'unconfigured' },
      push: { apns: 'unconfigured', fcm: 'unconfigured' },
      email: { provider: '', fromEmail: '', status: 'unconfigured' },
    },
    registryCredential: {
      username: addForm.name.toLowerCase().replace(/\s/g, ''),
      password: '********',
      registry: 'registry.twt-link.com',
      createdAt: new Date().toISOString().split('T')[0],
    },
    createdAt: new Date().toISOString().split('T')[0], remark: addForm.remark,
  })
  message.success('新增客户成功')
  showAddModal.value = false
  addForm.name = ''; addForm.contact = ''; addForm.email = ''; addForm.phone = ''
  addForm.domain = ''; addForm.serverIp = ''; addForm.maxUsers = 200; addForm.remark = ''
}
function handleGenerateDeployFiles(record: Customer) {
  deployFilesCustomer.value = record
  showDeployFilesModal.value = true
}
function handleDownloadDeployFiles() {
  message.success('部署文件包已生成，开始下载')
  showDeployFilesModal.value = false
}
function handleDeploy(record: Customer) {
  record.deployStatus = 'running'; record.currentVersion = 'v2.3.1'
  message.success(`${record.name} 部署成功`)
}
function handleSuspend(record: Customer) {
  record.deployStatus = 'suspended'; record.activeUsers = 0
  message.success(`${record.name} 已暂停`)
}
function handleResume(record: Customer) {
  record.deployStatus = 'running'
  message.success(`${record.name} 已恢复`)
}
function handleOffline(record: Customer) {
  record.deployStatus = 'offline'; record.activeUsers = 0
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
.deploy-files-preview { background: #f9fafb; border-radius: 8px; padding: 16px; }
.code-block {
  background: #1e1e1e; color: #d4d4d4; padding: 16px; border-radius: 6px;
  font-size: 13px; line-height: 1.6; overflow-x: auto; white-space: pre;
}
</style>
