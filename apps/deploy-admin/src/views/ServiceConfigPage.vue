<template>
  <div class="service-config-page">
    <a-card class="filter-card">
      <div class="filter-row">
        <a-input v-model:value="keyword" placeholder="搜索客户名称" style="width: 240px" allow-clear>
          <template #prefix><SearchOutlined /></template>
        </a-input>
        <a-select v-model:value="serviceFilter" placeholder="服务类型" style="width: 140px" allow-clear>
          <a-select-option value="oss">OSS 存储</a-select-option>
          <a-select-option value="email">邮件服务</a-select-option>
          <a-select-option value="sms">短信服务</a-select-option>
        </a-select>
        <a-select v-model:value="statusFilter" placeholder="状态" style="width: 120px" allow-clear>
          <a-select-option value="connected">已连接</a-select-option>
          <a-select-option value="disconnected">已断开</a-select-option>
          <a-select-option value="unconfigured">未配置</a-select-option>
        </a-select>
      </div>
    </a-card>

    <!-- 客户服务配置卡片 -->
    <div class="customer-cards">
      <a-card v-for="customer in filteredCustomers" :key="customer.id" class="customer-config-card">
        <template #title>
          <div class="card-title-row">
            <span>{{ customer.name }}</span>
            <a-tag :color="customer.deployStatus === 'running' ? 'green' : 'default'" style="margin-left: 8px">
              {{ customer.deployStatus === 'running' ? '运行中' : customer.deployStatus }}
            </a-tag>
          </div>
        </template>
        <template #extra>
          <a-button size="small" @click="handleEditConfig(customer)">编辑配置</a-button>
        </template>

        <div class="service-grid">
          <!-- OSS -->
          <div class="service-item">
            <div class="service-item__header">
              <CloudOutlined />
              <span>OSS 存储</span>
              <a-tag :color="getServiceColor(customer.serviceConfig.oss.status)" size="small">
                {{ getServiceText(customer.serviceConfig.oss.status) }}
              </a-tag>
            </div>
            <div class="service-item__detail">
              <span>{{ customer.serviceConfig.oss.provider || '未配置' }}</span>
              <span v-if="customer.serviceConfig.oss.bucket">/ {{ customer.serviceConfig.oss.bucket }}</span>
            </div>
          </div>
          <!-- Email -->
          <div class="service-item">
            <div class="service-item__header">
              <MailOutlined />
              <span>邮件服务</span>
              <a-tag :color="getServiceColor(customer.serviceConfig.email.status)" size="small">
                {{ getServiceText(customer.serviceConfig.email.status) }}
              </a-tag>
            </div>
            <div class="service-item__detail">
              {{ customer.serviceConfig.email.fromEmail || '未配置' }}
            </div>
          </div>
          <!-- SMS -->
          <div class="service-item">
            <div class="service-item__header">
              <MessageOutlined />
              <span>短信服务</span>
              <a-tag :color="getServiceColor(customer.serviceConfig.sms.status)" size="small">
                {{ getServiceText(customer.serviceConfig.sms.status) }}
              </a-tag>
            </div>
            <div class="service-item__detail">
              {{ customer.serviceConfig.sms.provider || '未配置' }}
            </div>
          </div>
        </div>
      </a-card>
    </div>

    <!-- 编辑配置弹窗 -->
    <a-modal v-model:open="showEditModal" :title="'编辑服务配置 - ' + editingCustomerName" width="700px" @ok="handleSaveConfig">
      <a-tabs>
        <a-tab-pane key="oss" tab="OSS 存储">
          <a-form :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }">
            <a-form-item label="服务商">
              <a-select v-model:value="configForm.oss.provider">
                <a-select-option value="aliyun">阿里云 OSS</a-select-option>
                <a-select-option value="aws">AWS S3</a-select-option>
                <a-select-option value="qiniu">七牛云</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item label="Bucket"><a-input v-model:value="configForm.oss.bucket" /></a-form-item>
            <a-form-item label="Region"><a-input v-model:value="configForm.oss.region" /></a-form-item>
            <a-form-item label="Access Key ID"><a-input v-model:value="configForm.oss.accessKeyId" /></a-form-item>
            <a-form-item label="Access Key Secret"><a-input-password v-model:value="configForm.oss.accessKeySecret" /></a-form-item>
            <a-form-item :wrapper-col="{ offset: 6 }">
              <a-button @click="handleTestOss">测试连接</a-button>
            </a-form-item>
          </a-form>
        </a-tab-pane>
        <a-tab-pane key="email" tab="邮件服务">
          <a-form :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }">
            <a-form-item label="SMTP 主机"><a-input v-model:value="configForm.email.smtpHost" /></a-form-item>
            <a-form-item label="SMTP 端口"><a-input-number v-model:value="configForm.email.smtpPort" style="width: 100%" /></a-form-item>
            <a-form-item label="用户名"><a-input v-model:value="configForm.email.smtpUser" /></a-form-item>
            <a-form-item label="密码"><a-input-password v-model:value="configForm.email.smtpPassword" /></a-form-item>
            <a-form-item label="发件人名称"><a-input v-model:value="configForm.email.fromName" /></a-form-item>
            <a-form-item label="发件人邮箱"><a-input v-model:value="configForm.email.fromEmail" /></a-form-item>
            <a-form-item :wrapper-col="{ offset: 6 }">
              <a-button @click="handleTestEmail">发送测试邮件</a-button>
            </a-form-item>
          </a-form>
        </a-tab-pane>
        <a-tab-pane key="sms" tab="短信服务">
          <a-form :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }">
            <a-form-item label="服务商">
              <a-select v-model:value="configForm.sms.provider">
                <a-select-option value="twilio">Twilio</a-select-option>
                <a-select-option value="aliyun">阿里云短信</a-select-option>
                <a-select-option value="tencent">腾讯云短信</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item label="Access Key"><a-input v-model:value="configForm.sms.accessKey" /></a-form-item>
            <a-form-item label="Access Secret"><a-input-password v-model:value="configForm.sms.accessSecret" /></a-form-item>
            <a-form-item label="签名名称"><a-input v-model:value="configForm.sms.signName" /></a-form-item>
            <a-form-item :wrapper-col="{ offset: 6 }">
              <a-button @click="handleTestSms">发送测试短信</a-button>
            </a-form-item>
          </a-form>
        </a-tab-pane>
      </a-tabs>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { message } from 'ant-design-vue'
import { SearchOutlined, CloudOutlined, MailOutlined, MessageOutlined } from '@ant-design/icons-vue'
import { customersData, type Customer } from '../mock/customersData'

const customers = ref([...customersData])
const keyword = ref('')
const serviceFilter = ref<string | undefined>(undefined)
const statusFilter = ref<string | undefined>(undefined)
const showEditModal = ref(false)
const editingCustomerName = ref('')

const filteredCustomers = computed(() => {
  let result = customers.value
  if (keyword.value) {
    const kw = keyword.value.toLowerCase()
    result = result.filter(c => c.name.toLowerCase().includes(kw))
  }
  if (statusFilter.value) {
    result = result.filter(c => {
      if (serviceFilter.value) {
        return c.serviceConfig[serviceFilter.value as keyof typeof c.serviceConfig]?.status === statusFilter.value
      }
      return c.serviceConfig.oss.status === statusFilter.value ||
        c.serviceConfig.email.status === statusFilter.value ||
        c.serviceConfig.sms.status === statusFilter.value
    })
  }
  return result
})

const configForm = reactive({
  customerId: '',
  oss: { provider: 'aliyun', bucket: '', region: '', accessKeyId: '', accessKeySecret: '' },
  email: { smtpHost: '', smtpPort: 465, smtpUser: '', smtpPassword: '', fromName: '', fromEmail: '' },
  sms: { provider: 'twilio', accessKey: '', accessSecret: '', signName: '' },
})

function getServiceColor(s: string) { return { connected: 'green', disconnected: 'red', unconfigured: 'default' }[s] || 'default' }
function getServiceText(s: string) { return { connected: '已连接', disconnected: '已断开', unconfigured: '未配置' }[s] || s }

function handleEditConfig(customer: Customer) {
  editingCustomerName.value = customer.name
  configForm.customerId = customer.id
  configForm.oss.provider = customer.serviceConfig.oss.provider || 'aliyun'
  configForm.oss.bucket = customer.serviceConfig.oss.bucket
  configForm.oss.region = customer.serviceConfig.oss.region
  configForm.email.fromEmail = customer.serviceConfig.email.fromEmail
  configForm.sms.provider = customer.serviceConfig.sms.provider || 'twilio'
  showEditModal.value = true
}

function handleSaveConfig() {
  const c = customers.value.find(c => c.id === configForm.customerId)
  if (c) {
    if (configForm.oss.bucket) c.serviceConfig.oss = { ...c.serviceConfig.oss, provider: configForm.oss.provider, bucket: configForm.oss.bucket, region: configForm.oss.region, status: 'connected' }
    if (configForm.email.fromEmail) c.serviceConfig.email = { ...c.serviceConfig.email, fromEmail: configForm.email.fromEmail, status: 'connected' }
    if (configForm.sms.accessKey) c.serviceConfig.sms = { provider: configForm.sms.provider, status: 'connected' }
  }
  message.success('配置已保存')
  showEditModal.value = false
}

function handleTestOss() { message.success('OSS 连接测试成功') }
function handleTestEmail() { message.success('测试邮件已发送') }
function handleTestSms() { message.success('测试短信已发送') }
</script>

<style scoped>
.service-config-page { display: flex; flex-direction: column; gap: 16px; }
.filter-row { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
.customer-cards { display: flex; flex-direction: column; gap: 16px; }
.card-title-row { display: flex; align-items: center; }
.service-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
.service-item { border: 1px solid #e5e7eb; border-radius: 8px; padding: 12px; }
.service-item__header { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; font-weight: 500; }
.service-item__detail { font-size: 13px; color: #6b7280; }
</style>
