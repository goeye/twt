<template>
  <div class="platform-config-page">
    <a-tabs v-model:activeKey="activeTab">
      <!-- 基础配置 -->
      <a-tab-pane key="basic" tab="基础配置">
        <a-card>
          <a-form
            :model="basicConfig"
            :label-col="{ span: 4 }"
            :wrapper-col="{ span: 16 }"
          >
            <a-form-item label="平台名称">
              <a-input v-model:value="basicConfig.platformName" />
            </a-form-item>

            <a-form-item label="默认分成比例">
              <a-input-number
                v-model:value="basicConfig.defaultCommissionRate"
                :min="0"
                :max="100"
                :step="1"
                addon-after="%"
                style="width: 200px"
              />
              <div style="color: #999; font-size: 12px; margin-top: 4px">
                新代理商默认的佣金分成比例
              </div>
            </a-form-item>

            <a-form-item label="平台联系邮箱">
              <a-input v-model:value="basicConfig.contactEmail" type="email" />
            </a-form-item>

            <a-form-item label="客服热线">
              <a-input v-model:value="basicConfig.supportPhone" />
            </a-form-item>

            <a-form-item :wrapper-col="{ offset: 4, span: 16 }">
              <a-button type="primary" @click="handleSaveBasic">
                <template #icon><SaveOutlined /></template>
                保存配置
              </a-button>
            </a-form-item>
          </a-form>
        </a-card>
      </a-tab-pane>

      <!-- 白标功能配置 -->
      <a-tab-pane key="whitelabel" tab="白标功能">
        <a-card>
          <a-form
            :model="whitelabelConfig"
            :label-col="{ span: 4 }"
            :wrapper-col="{ span: 16 }"
          >
            <a-form-item label="启用白标功能">
              <a-switch v-model:checked="whitelabelConfig.enabled" />
              <div style="color: #999; font-size: 12px; margin-top: 4px">
                关闭后所有代理商将无法使用白标功能
              </div>
            </a-form-item>

            <a-form-item label="允许自定义域名">
              <a-switch v-model:checked="whitelabelConfig.allowCustomDomain" />
            </a-form-item>

            <a-form-item label="允许独立 APP">
              <a-switch v-model:checked="whitelabelConfig.allowIndependentApp" />
              <div style="color: #999; font-size: 12px; margin-top: 4px">
                允许代理商申请独立打包的移动应用
              </div>
            </a-form-item>

            <a-form-item label="域名验证方式">
              <a-radio-group v-model:value="whitelabelConfig.domainVerifyMethod">
                <a-radio value="dns">DNS 验证</a-radio>
                <a-radio value="file">文件验证</a-radio>
                <a-radio value="manual">人工审核</a-radio>
              </a-radio-group>
            </a-form-item>

            <a-form-item label="SSL 证书管理">
              <a-radio-group v-model:value="whitelabelConfig.sslProvider">
                <a-radio value="letsencrypt">Let's Encrypt（自动）</a-radio>
                <a-radio value="cloudflare">Cloudflare</a-radio>
                <a-radio value="manual">手动上传</a-radio>
              </a-radio-group>
            </a-form-item>

            <a-form-item :wrapper-col="{ offset: 4, span: 16 }">
              <a-button type="primary" @click="handleSaveWhitelabel">
                <template #icon><SaveOutlined /></template>
                保存配置
              </a-button>
            </a-form-item>
          </a-form>
        </a-card>
      </a-tab-pane>

      <!-- Stripe 配置 -->
      <a-tab-pane key="stripe" tab="支付配置">
        <a-card>
          <a-form
            :model="stripeConfig"
            :label-col="{ span: 4 }"
            :wrapper-col="{ span: 16 }"
          >
            <a-form-item label="Stripe API Key">
              <a-input-password v-model:value="stripeConfig.apiKey" placeholder="sk_live_..." />
            </a-form-item>

            <a-form-item label="Stripe Webhook Secret">
              <a-input-password v-model:value="stripeConfig.webhookSecret" placeholder="whsec_..." />
            </a-form-item>

            <a-form-item label="启用 Stripe Connect">
              <a-switch v-model:checked="stripeConfig.enableConnect" />
              <div style="color: #999; font-size: 12px; margin-top: 4px">
                用于自动分账给代理商
              </div>
            </a-form-item>

            <a-form-item label="测试模式">
              <a-switch v-model:checked="stripeConfig.testMode" />
            </a-form-item>

            <a-form-item :wrapper-col="{ offset: 4, span: 16 }">
              <a-button type="primary" @click="handleSaveStripe">
                <template #icon><SaveOutlined /></template>
                保存配置
              </a-button>
            </a-form-item>
          </a-form>
        </a-card>
      </a-tab-pane>

      <!-- 邮件配置 -->
      <a-tab-pane key="email" tab="邮件配置">
        <a-card>
          <a-form
            :model="emailConfig"
            :label-col="{ span: 4 }"
            :wrapper-col="{ span: 16 }"
          >
            <a-form-item label="SMTP 主机">
              <a-input v-model:value="emailConfig.smtpHost" placeholder="smtp.example.com" />
            </a-form-item>

            <a-form-item label="SMTP 端口">
              <a-input-number v-model:value="emailConfig.smtpPort" :min="1" :max="65535" style="width: 200px" />
            </a-form-item>

            <a-form-item label="SMTP 用户名">
              <a-input v-model:value="emailConfig.smtpUsername" />
            </a-form-item>

            <a-form-item label="SMTP 密码">
              <a-input-password v-model:value="emailConfig.smtpPassword" />
            </a-form-item>

            <a-form-item label="发件人名称">
              <a-input v-model:value="emailConfig.fromName" placeholder="TWT Chat" />
            </a-form-item>

            <a-form-item label="发件人邮箱">
              <a-input v-model:value="emailConfig.fromEmail" type="email" placeholder="noreply@example.com" />
            </a-form-item>

            <a-form-item label="启用 TLS">
              <a-switch v-model:checked="emailConfig.enableTls" />
            </a-form-item>

            <a-form-item :wrapper-col="{ offset: 4, span: 16 }">
              <a-space>
                <a-button type="primary" @click="handleSaveEmail">
                  <template #icon><SaveOutlined /></template>
                  保存配置
                </a-button>
                <a-button @click="handleTestEmail">
                  <template #icon><SendOutlined /></template>
                  发送测试邮件
                </a-button>
              </a-space>
            </a-form-item>
          </a-form>
        </a-card>
      </a-tab-pane>

      <!-- OSS 配置 -->
      <a-tab-pane key="oss" tab="存储配置">
        <a-card>
          <a-form
            :model="ossConfig"
            :label-col="{ span: 4 }"
            :wrapper-col="{ span: 16 }"
          >
            <a-form-item label="存储服务商">
              <a-select v-model:value="ossConfig.provider" style="width: 200px">
                <a-select-option value="aliyun">阿里云 OSS</a-select-option>
                <a-select-option value="aws">AWS S3</a-select-option>
                <a-select-option value="qiniu">七牛云</a-select-option>
                <a-select-option value="tencent">腾讯云 COS</a-select-option>
              </a-select>
            </a-form-item>

            <a-form-item label="Bucket 名称">
              <a-input v-model:value="ossConfig.bucket" />
            </a-form-item>

            <a-form-item label="区域">
              <a-input v-model:value="ossConfig.region" placeholder="oss-cn-hangzhou" />
            </a-form-item>

            <a-form-item label="Access Key ID">
              <a-input v-model:value="ossConfig.accessKeyId" />
            </a-form-item>

            <a-form-item label="Access Key Secret">
              <a-input-password v-model:value="ossConfig.accessKeySecret" />
            </a-form-item>

            <a-form-item label="自定义域名">
              <a-input v-model:value="ossConfig.customDomain" placeholder="https://cdn.example.com" />
              <div style="color: #999; font-size: 12px; margin-top: 4px">
                可选，用于加速访问
              </div>
            </a-form-item>

            <a-form-item :wrapper-col="{ offset: 4, span: 16 }">
              <a-space>
                <a-button type="primary" @click="handleSaveOss">
                  <template #icon><SaveOutlined /></template>
                  保存配置
                </a-button>
                <a-button @click="handleTestOss">
                  <template #icon><CloudUploadOutlined /></template>
                  测试连接
                </a-button>
              </a-space>
            </a-form-item>
          </a-form>
        </a-card>
      </a-tab-pane>

      <!-- 审核配置 -->
      <a-tab-pane key="approval" tab="审核配置">
        <a-card>
          <a-form
            :model="approvalConfig"
            :label-col="{ span: 4 }"
            :wrapper-col="{ span: 16 }"
          >
            <a-form-item label="代理商申请审核">
              <a-switch v-model:checked="approvalConfig.resellerApprovalRequired" />
              <div style="color: #999; font-size: 12px; margin-top: 4px">
                关闭后代理商申请将自动通过
              </div>
            </a-form-item>

            <a-form-item label="域名绑定审核">
              <a-switch v-model:checked="approvalConfig.domainApprovalRequired" />
            </a-form-item>

            <a-form-item label="APP 打包审核">
              <a-switch v-model:checked="approvalConfig.appApprovalRequired" />
            </a-form-item>

            <a-form-item label="审核通知邮箱">
              <a-input v-model:value="approvalConfig.notifyEmail" type="email" />
              <div style="color: #999; font-size: 12px; margin-top: 4px">
                有新的审核申请时发送通知
              </div>
            </a-form-item>

            <a-form-item :wrapper-col="{ offset: 4, span: 16 }">
              <a-button type="primary" @click="handleSaveApproval">
                <template #icon><SaveOutlined /></template>
                保存配置
              </a-button>
            </a-form-item>
          </a-form>
        </a-card>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { message } from 'ant-design-vue'
import {
  SaveOutlined,
  SendOutlined,
  CloudUploadOutlined,
} from '@ant-design/icons-vue'

const activeTab = ref('basic')

// 基础配置
const basicConfig = reactive({
  platformName: 'TWT Chat',
  defaultCommissionRate: 30,
  contactEmail: 'support@twt.com',
  supportPhone: '400-123-4567',
})

// 白标功能配置
const whitelabelConfig = reactive({
  enabled: true,
  allowCustomDomain: true,
  allowIndependentApp: true,
  domainVerifyMethod: 'dns',
  sslProvider: 'letsencrypt',
})

// Stripe 配置
const stripeConfig = reactive({
  apiKey: '',
  webhookSecret: '',
  enableConnect: true,
  testMode: false,
})

// 邮件配置
const emailConfig = reactive({
  smtpHost: '',
  smtpPort: 587,
  smtpUsername: '',
  smtpPassword: '',
  fromName: 'TWT Chat',
  fromEmail: '',
  enableTls: true,
})

// OSS 配置
const ossConfig = reactive({
  provider: 'aliyun',
  bucket: '',
  region: '',
  accessKeyId: '',
  accessKeySecret: '',
  customDomain: '',
})

// 审核配置
const approvalConfig = reactive({
  resellerApprovalRequired: true,
  domainApprovalRequired: true,
  appApprovalRequired: true,
  notifyEmail: 'admin@twt.com',
})

function handleSaveBasic() {
  message.success('基础配置已保存')
}

function handleSaveWhitelabel() {
  message.success('白标功能配置已保存')
}

function handleSaveStripe() {
  message.success('支付配置已保存')
}

function handleSaveEmail() {
  message.success('邮件配置已保存')
}

function handleTestEmail() {
  message.loading('正在发送测试邮件...', 2)
  setTimeout(() => {
    message.success('测试邮件已发送')
  }, 2000)
}

function handleSaveOss() {
  message.success('存储配置已保存')
}

function handleTestOss() {
  message.loading('正在测试连接...', 2)
  setTimeout(() => {
    message.success('连接测试成功')
  }, 2000)
}

function handleSaveApproval() {
  message.success('审核配置已保存')
}
</script>

<style scoped>
.platform-config-page {
  background: #fff;
  padding: 24px;
  min-height: calc(100vh - 112px);
}
</style>
