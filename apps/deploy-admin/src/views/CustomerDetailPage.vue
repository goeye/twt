<template>
  <div class="customer-detail-page">
    <a-button @click="$router.back()" style="margin-bottom: 16px">
      <template #icon><ArrowLeftOutlined /></template>
      返回
    </a-button>

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
        <a-descriptions-item label="用户数">{{ customer.activeUsers }} / {{ customer.maxUsers }}</a-descriptions-item>
        <a-descriptions-item label="License 到期">
          <span :style="{ color: isExpiringSoon(customer.licenseExpiry) ? '#ef4444' : undefined, fontWeight: isExpiringSoon(customer.licenseExpiry) ? '600' : undefined }">
            {{ customer.licenseExpiry }}
          </span>
        </a-descriptions-item>
      </a-descriptions>
    </a-card>

    <a-card title="Registry 凭证" class="section-card">
      <a-descriptions :column="2" bordered>
        <a-descriptions-item label="Registry">{{ customer.registryCredential.registry }}</a-descriptions-item>
        <a-descriptions-item label="用户名">{{ customer.registryCredential.username }}</a-descriptions-item>
        <a-descriptions-item label="创建时间">{{ customer.registryCredential.createdAt }}</a-descriptions-item>
        <a-descriptions-item label="密码">
          <span v-if="!showPassword">********</span>
          <code v-else>{{ customer.registryCredential.password }}</code>
          <a-button size="small" type="link" @click="showPassword = !showPassword">
            {{ showPassword ? '隐藏' : '显示' }}
          </a-button>
        </a-descriptions-item>
      </a-descriptions>
    </a-card>

    <a-card title="服务配置状态" class="section-card">
      <div class="service-cards">
        <div class="service-card">
          <div class="service-card__header">
            <CloudOutlined style="font-size: 20px" />
            <span>文件存储</span>
            <a-tag :color="getServiceStatusColor(customer.serviceConfig.storage.status)" style="margin-left: auto">
              {{ getServiceStatusText(customer.serviceConfig.storage.status) }}
            </a-tag>
          </div>
          <div class="service-card__body">
            <div class="service-field"><span class="service-field__label">服务商</span><span>{{ customer.serviceConfig.storage.provider || '-' }}</span></div>
            <div class="service-field"><span class="service-field__label">Bucket</span><span>{{ customer.serviceConfig.storage.bucket || '-' }}</span></div>
            <div class="service-field"><span class="service-field__label">Region</span><span>{{ customer.serviceConfig.storage.region || '-' }}</span></div>
          </div>
        </div>
        <div class="service-card">
          <div class="service-card__header">
            <BellOutlined style="font-size: 20px" />
            <span>推送通知</span>
          </div>
          <div class="service-card__body">
            <div class="service-field">
              <span class="service-field__label">APNs (iOS)</span>
              <a-tag :color="getServiceStatusColor(customer.serviceConfig.push.apns)" size="small">
                {{ getServiceStatusText(customer.serviceConfig.push.apns) }}
              </a-tag>
            </div>
            <div class="service-field">
              <span class="service-field__label">FCM (Android)</span>
              <a-tag :color="getServiceStatusColor(customer.serviceConfig.push.fcm)" size="small">
                {{ getServiceStatusText(customer.serviceConfig.push.fcm) }}
              </a-tag>
            </div>
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
      </div>
    </a-card>

    <a-card title="License 信息" class="section-card">
      <a-descriptions :column="2" bordered>
        <a-descriptions-item label="License Key">
          <code>{{ customer.licenseKey || '-' }}</code>
        </a-descriptions-item>
        <a-descriptions-item label="到期时间">{{ customer.licenseExpiry || '-' }}</a-descriptions-item>
        <a-descriptions-item label="服务版本">{{ customer.plan }}</a-descriptions-item>
        <a-descriptions-item label="用户上限">{{ customer.maxUsers }}</a-descriptions-item>
      </a-descriptions>
    </a-card>

    <a-card class="section-card">
      <a-space>
        <a-button type="primary" @click="handleGenerateDeployFiles">生成部署文件</a-button>
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
import { ArrowLeftOutlined, CloudOutlined, MailOutlined, BellOutlined } from '@ant-design/icons-vue'
import { getCustomerById } from '../mock/customersData'

const route = useRoute()
const router = useRouter()
const customerId = route.params.id as string
const customerData = getCustomerById(customerId)
const showPassword = ref(false)

if (!customerData) {
  message.error('客户不存在')
  router.push('/customers')
}

const customer = ref(customerData || {
  id: customerId, name: '未知客户', contact: '-', email: '-', phone: '-',
  deployStatus: 'offline' as const,
  currentVersion: '-', domain: '-', serverIp: '-', maxUsers: 0, activeUsers: 0,
  licenseKey: '', licenseExpiry: '', plan: '-',
  serviceConfig: {
    storage: { provider: '', bucket: '', region: '', status: 'unconfigured' as const },
    push: { apns: 'unconfigured' as const, fcm: 'unconfigured' as const },
    email: { provider: '', fromEmail: '', status: 'unconfigured' as const },
  },
  registryCredential: { username: '', password: '', registry: '', createdAt: '' },
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
function handleGenerateDeployFiles() { message.success('部署文件已生成') }
function handleDeploy() {
  customer.value.deployStatus = 'running'
  customer.value.currentVersion = 'v2.3.1'
  message.success('部署成功')
}
function handleUpgrade() { message.info('升级功能开发中') }
function handleSuspend() {
  customer.value.deployStatus = 'suspended'
  customer.value.activeUsers = 0
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
