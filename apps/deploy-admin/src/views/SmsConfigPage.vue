<template>
  <div class="sms-config-page">
    <a-card class="filter-card">
      <div class="filter-row">
        <a-input v-model:value="keyword" placeholder="搜索客户名称" style="width: 240px" allow-clear>
          <template #prefix><SearchOutlined /></template>
        </a-input>
        <a-select v-model:value="statusFilter" placeholder="状态" style="width: 140px" allow-clear>
          <a-select-option value="configured">已配置</a-select-option>
          <a-select-option value="unconfigured">未配置</a-select-option>
        </a-select>
      </div>
    </a-card>

    <a-card>
      <a-table :columns="columns" :data-source="filteredCustomers" :pagination="{ pageSize: 10 }" row-key="id">
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'provider'">
            {{ record.smsConfig.provider || '-' }}
          </template>
          <template v-if="column.dataIndex === 'accessKeyId'">
            <span v-if="record.smsConfig.accessKeyId">{{ maskKey(record.smsConfig.accessKeyId) }}</span>
            <span v-else>-</span>
          </template>
          <template v-if="column.dataIndex === 'signature'">
            {{ record.smsConfig.signature || '-' }}
          </template>
          <template v-if="column.dataIndex === 'status'">
            <a-tag :color="record.smsConfig.status === 'configured' ? 'green' : 'default'">
              {{ record.smsConfig.status === 'configured' ? '已配置' : '未配置' }}
            </a-tag>
          </template>
          <template v-if="column.dataIndex === 'action'">
            <a-button type="link" size="small" @click="handleEdit(record)">编辑</a-button>
          </template>
        </template>
      </a-table>
    </a-card>

    <a-modal v-model:open="showModal" :title="'短信配置 - ' + editingName" width="560px" @ok="handleSave">
      <a-form :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }" style="margin-top: 16px">
        <a-form-item label="短信服务商">
          <a-select v-model:value="form.provider">
            <a-select-option value="aliyun">阿里云短信</a-select-option>
            <a-select-option value="tencent">腾讯云短信</a-select-option>
            <a-select-option value="huawei">华为云短信</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="AccessKey ID">
          <a-input v-model:value="form.accessKeyId" />
        </a-form-item>
        <a-form-item label="AccessKey Secret">
          <a-input-password v-model:value="form.accessKeySecret" />
        </a-form-item>
        <a-form-item label="短信签名">
          <a-input v-model:value="form.signature" />
        </a-form-item>
        <a-form-item label="验证码模板 ID">
          <a-input v-model:value="form.templateId" />
        </a-form-item>
        <a-form-item :wrapper-col="{ offset: 6 }">
          <a-button @click="handleTestSms">发送测试短信</a-button>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { message } from 'ant-design-vue'
import { SearchOutlined } from '@ant-design/icons-vue'
import { customersData } from '../mock/customersData'

interface SmsConfig {
  provider: string
  accessKeyId: string
  accessKeySecret: string
  signature: string
  templateId: string
  status: 'configured' | 'unconfigured'
}

const smsDataMap: Record<string, SmsConfig> = {
  'cust-001': { provider: '阿里云短信', accessKeyId: 'LTAI5tR3x8Kp7mN2', accessKeySecret: '********', signature: '星辰科技', templateId: 'SMS_246810', status: 'configured' },
  'cust-002': { provider: '腾讯云短信', accessKeyId: 'AKIDz8krbsJ5yK', accessKeySecret: '********', signature: '蓝海金融', templateId: '1234567', status: 'configured' },
  'cust-003': { provider: '阿里云短信', accessKeyId: 'LTAI5tQw9Jp3kM8', accessKeySecret: '********', signature: '绿叶教育', templateId: 'SMS_135790', status: 'configured' },
  'cust-004': { provider: '', accessKeyId: '', accessKeySecret: '', signature: '', templateId: '', status: 'unconfigured' },
  'cust-005': { provider: '', accessKeyId: '', accessKeySecret: '', signature: '', templateId: '', status: 'unconfigured' },
  'cust-006': { provider: '', accessKeyId: '', accessKeySecret: '', signature: '', templateId: '', status: 'unconfigured' },
}

const customers = ref(customersData.map(c => ({
  ...c,
  smsConfig: smsDataMap[c.id] || { provider: '', accessKeyId: '', accessKeySecret: '', signature: '', templateId: '', status: 'unconfigured' as const },
})))

const keyword = ref('')
const statusFilter = ref<string | undefined>(undefined)
const showModal = ref(false)
const editingName = ref('')
const editingId = ref('')

const form = reactive({
  provider: 'aliyun',
  accessKeyId: '',
  accessKeySecret: '',
  signature: '',
  templateId: '',
})

const columns = [
  { title: '客户名称', dataIndex: 'name', width: 160 },
  { title: '短信服务商', dataIndex: 'provider', width: 140 },
  { title: 'AccessKey ID', dataIndex: 'accessKeyId', width: 180 },
  { title: '签名', dataIndex: 'signature', width: 120 },
  { title: '状态', dataIndex: 'status', width: 100 },
  { title: '操作', dataIndex: 'action', width: 80 },
]

const filteredCustomers = computed(() => {
  let result = customers.value
  if (keyword.value) {
    const kw = keyword.value.toLowerCase()
    result = result.filter(c => c.name.toLowerCase().includes(kw))
  }
  if (statusFilter.value) {
    result = result.filter(c => c.smsConfig.status === statusFilter.value)
  }
  return result
})

function maskKey(key: string) {
  if (key.length <= 6) return key
  return key.slice(0, 6) + '****'
}

function handleEdit(record: (typeof customers.value)[0]) {
  editingName.value = record.name
  editingId.value = record.id
  const cfg = record.smsConfig
  form.provider = cfg.provider || 'aliyun'
  form.accessKeyId = cfg.accessKeyId
  form.accessKeySecret = ''
  form.signature = cfg.signature
  form.templateId = cfg.templateId
  showModal.value = true
}

function handleSave() {
  const target = customers.value.find(c => c.id === editingId.value)
  if (target) {
    target.smsConfig.provider = form.provider
    target.smsConfig.accessKeyId = form.accessKeyId
    target.smsConfig.signature = form.signature
    target.smsConfig.templateId = form.templateId
    target.smsConfig.status = 'configured'
  }
  message.success('短信配置已保存')
  showModal.value = false
}

function handleTestSms() {
  message.success('测试短信已发送')
}
</script>

<style scoped>
.sms-config-page { display: flex; flex-direction: column; gap: 16px; }
.filter-row { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
</style>
