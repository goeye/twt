<template>
  <div class="customer-detail-page">
    <a-button @click="$router.back()" style="margin-bottom: 16px">
      <template #icon><ArrowLeftOutlined /></template>
      返回
    </a-button>

    <!-- 基本信息 -->
    <a-card title="基本信息" class="section-card">
      <a-descriptions :column="2" bordered>
        <a-descriptions-item label="客户 ID">{{ customer.id }}</a-descriptions-item>
        <a-descriptions-item label="客户名称">{{ customer.name }}</a-descriptions-item>
        <a-descriptions-item label="联系人">{{ customer.contact }}</a-descriptions-item>
        <a-descriptions-item label="邮箱">{{ customer.email }}</a-descriptions-item>
        <a-descriptions-item label="手机号">{{ customer.phone }}</a-descriptions-item>
        <a-descriptions-item label="创建时间">{{ customer.createdAt }}</a-descriptions-item>
        <a-descriptions-item label="备注" :span="2">{{ customer.remark || '-' }}</a-descriptions-item>
      </a-descriptions>
    </a-card>

    <!-- 部署信息 -->
    <a-card title="部署信息" class="section-card">
      <a-descriptions :column="2" bordered>
        <a-descriptions-item label="部署状态">
          <a-tag :color="getStatusColor(customer.deployStatus)">
            {{ getStatusText(customer.deployStatus) }}
          </a-tag>
        </a-descriptions-item>
        <a-descriptions-item label="当前版本">{{ customer.currentVersion }}</a-descriptions-item>
        <a-descriptions-item label="服务版本">{{ customer.plan }}</a-descriptions-item>
        <a-descriptions-item label="绑定域名">{{ customer.domain }}</a-descriptions-item>
        <a-descriptions-item label="服务器 IP">{{ customer.serverIp }}</a-descriptions-item>
        <a-descriptions-item label="坐席使用">{{ customer.activeAgents }} / {{ customer.maxAgents }}</a-descriptions-item>
        <a-descriptions-item label="License 到期">
          <span :style="{ color: isExpiringSoon(customer.licenseExpiry) ? '#ef4444' : undefined, fontWeight: isExpiringSoon(customer.licenseExpiry) ? '600' : undefined }">
            {{ customer.licenseExpiry }}
          </span>
        </a-descriptions-item>
      </a-descriptions>
    </a-card>

    <!-- 服务配置状态 -->
    <a-card title="服务配置状态" class="section-card">
      <div class="service-cards">
        <div class="service-card">
          <div class="service-card__header">
            <CloudOutlined style="font-size: 20px" />
            <span>OSS 存储</span>
            <a-tag :color="getServiceStatusColor(customer.serviceConfig.oss.status)" style="margin-left: auto">
              {{ getServiceStatusText(customer.serviceConfig.oss.status) }}
            </a-tag>
          </div>
          <div class="service-card__body">
            <div class="service-field"><span class="service-field__label">服务商</span><span>{{ customer.serviceConfig.oss.provider || '-' }}</span></div>
            <div class="service-field"><span class="service-field__label">Bucket</span><span>{{ customer.serviceConfig.oss.bucket || '-' }}</span></div>
            <div class="service-field"><span class="service-field__label">Region</span><span>{{ customer.serviceConfig.oss.region || '-' }}</span></div>
          </div>
        </div>
        <div class="service-card">
          <div class="service-card__header">
            <MailOutlined style="font-size: 20px" />
            <span>邮件服务</span>
            <a-tag :color="getServiceStatusColor(customer.serviceConfig.email.status)" style="margin-left: auto">
              {{ getServiceStatusText(customer.serviceConfig.email.status) }}
            </a-tag>
          </div>
          <div class="service-card__body">
            <div class="service-field"><span class="service-field__label">服务商</span><span>{{ customer.serviceConfig.email.provider || '-' }}</span></div>
            <div class="service-field"><span class="service-field__label">发件邮箱</span><span>{{ customer.serviceConfig.email.fromEmail || '-' }}</span></div>
          </div>
        </div>
        <div class="service-card">
          <div class="service-card__header">
            <MessageOutlined style="font-size: 20px" />
            <span>短信服务</span>
            <a-tag :color="getServiceStatusColor(customer.serviceConfig.sms.status)" style="margin-left: auto">
              {{ getServiceStatusText(customer.serviceConfig.sms.status) }}
            </a-tag>
          </div>
          <div class="service-card__body">
            <div class="service-field"><span class="service-field__label">服务商</span><span>{{ customer.serviceConfig.sms.provider || '-' }}</span></div>
          </div>
        </div>
      </div>
    </a-card>

    <!-- License 信息 -->
    <a-card title="License 信息" class="section-card">
      <a-descriptions :column="2" bordered>
        <a-descriptions-item label="License Key">
          <code>{{ customer.licenseKey || '-' }}</code>
        </a-descriptions-item>
        <a-descriptions-item label="到期时间">{{ customer.licenseExpiry || '-' }}</a-descriptions-item>
        <a-descriptions-item label="服务版本">{{ customer.plan }}</a-descriptions-item>
        <a-descriptions-item label="坐席上限">{{ customer.maxAgents }}</a-descriptions-item>
      </a-descriptions>
    </a-card>

    <!-- 操作按钮 -->
    <a-card class="section-card">
      <a-space>
        <a-button v-if="customer.deployStatus === 'pending'" type="primary" @click="handleDeploy">执行部署</a-button>
        <a-button v-if="customer.deployStatus === 'running'" @click="handleUpgrade">升级版本</a-button>
        <a-button v-if="customer.deployStatus === 'running'" danger @click="handleSuspend">暂停服务</a-button>
        <a-button v-if="customer.deployStatus === 'suspended'" type="primary" @click="handleResume">恢复服务</a-button>
        <a-button @click="handleRenewLicense">续期 License</a-button>
      </a-space>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { ArrowLeftOutlined, CloudOutlined, MailOutlined, MessageOutlined } from '@ant-design/icons-vue'
import { getCustomerById } from '../mock/customersData'

const route = useRoute()
const router = useRouter()
const customerId = route.params.id as string
const customerData = getCustomerById(customerId)

if (!customerData) {
  message.error('客户不存在')
  router.push('/customers')
}

const customer = ref(customerData || {
  id: customerId, name: '未知客户', contact: '-', email: '-', phone: '-',
  deployStatus: 'offline' as const,
  currentVersion: '-', domain: '-', serverIp: '-', maxAgents: 0, activeAgents: 0,
  licenseKey: '', licenseExpiry: '', plan: '-',
  serviceConfig: {
    oss: { provider: '', bucket: '', region: '', status: 'unconfigured' as const },
    email: { provider: '', fromEmail: '', status: 'unconfigured' as const },
    sms: { provider: '', status: 'unconfigured' as const },
  },
  createdAt: '-', remark: '', key: '0',
})

function getStatusColor(s: string) {
  return { pending: 'orange', running: 'green', suspended: 'red', offline: 'default' }[s] || 'default'
}
function getStatusText(s: string) {
  return { pending: '待部署', running: '运行中', suspended: '已暂停', offline: '已下线' }[s] || s
}
function getServiceStatusColor(s: string) {
  return { connected: 'green', disconnected: 'red', unconfigured: 'default' }[s] || 'default'
}
function getServiceStatusText(s: string) {
  return { connected: '已连接', disconnected: '已断开', unconfigured: '未配置' }[s] || s
}
function isExpiringSoon(date: string) {
  if (!date) return false
  const diff = new Date(date).getTime() - Date.now()
  return diff > 0 && diff < 90 * 24 * 60 * 60 * 1000
}
function handleDeploy() {
  customer.value.deployStatus = 'running'
  customer.value.currentVersion = 'v2.3.1'
  message.success('部署成功')
}
function handleUpgrade() { message.info('升级功能开发中') }
function handleSuspend() {
  customer.value.deployStatus = 'suspended'
  customer.value.activeAgents = 0
  message.success('已暂停服务')
}
function handleResume() {
  customer.value.deployStatus = 'running'
  message.success('已恢复服务')
}
function handleRenewLicense() { message.info('续期功能开发中') }
</script>

<style scoped>
.customer-detail-page { display: flex; flex-direction: column; gap: 16px; }
.section-card { background: #fff; }
.service-cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
.service-card { border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; }
.service-card__header {
  display: flex; align-items: center; gap: 8px; padding: 12px 16px;
  background: #f9fafb; border-bottom: 1px solid #e5e7eb; font-weight: 500;
}
.service-card__body { padding: 16px; display: flex; flex-direction: column; gap: 8px; }
.service-field { display: flex; justify-content: space-between; font-size: 13px; }
.service-field__label { color: #6b7280; }
</style>
