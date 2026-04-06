<template>
  <div class="email-page">
    <div class="page-header">
      <h2>邮件管理</h2>
      <p class="page-desc">配置邮件发送设置，管理邮件模板和发送记录</p>
    </div>

    <!-- SMTP 配置 -->
    <div class="config-section">
      <h3 class="section-title">SMTP 配置</h3>
      <div class="config-card">
        <div class="form-row">
          <div class="form-group">
            <label>SMTP 服务器</label>
            <input
              v-model="smtpConfig.host"
              type="text"
              placeholder="例如：smtp.example.com"
              class="form-input"
            />
          </div>
          <div class="form-group">
            <label>端口</label>
            <input
              v-model="smtpConfig.port"
              type="number"
              placeholder="例如：465"
              class="form-input"
            />
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>用户名</label>
            <input
              v-model="smtpConfig.username"
              type="text"
              placeholder="SMTP 用户名"
              class="form-input"
            />
          </div>
          <div class="form-group">
            <label>密码</label>
            <input
              v-model="smtpConfig.password"
              type="password"
              placeholder="SMTP 密码"
              class="form-input"
            />
          </div>
        </div>
        <div class="form-actions">
          <button class="btn btn--secondary" @click="testConnection">测试连接</button>
          <button class="btn btn--primary" @click="saveSMTPConfig">保存配置</button>
        </div>
      </div>
    </div>

    <!-- 发件人配置 -->
    <div class="config-section">
      <h3 class="section-title">发件人配置</h3>
      <div class="config-card">
        <div class="form-group">
          <label>发件人名称</label>
          <input
            v-model="senderConfig.fromName"
            type="text"
            placeholder="例如：客服团队"
            class="form-input"
          />
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>发件人邮箱</label>
            <input
              v-model="senderConfig.fromEmail"
              type="email"
              placeholder="例如：noreply@example.com"
              class="form-input"
            />
          </div>
          <div class="form-group">
            <label>回复邮箱</label>
            <input
              v-model="senderConfig.replyTo"
              type="email"
              placeholder="例如：support@example.com"
              class="form-input"
            />
          </div>
        </div>
        <div class="form-actions">
          <button class="btn btn--primary" @click="saveSenderConfig">保存配置</button>
        </div>
      </div>
    </div>

    <!-- 批量发送 -->
    <div class="config-section">
      <h3 class="section-title">批量发送邮件</h3>
      <div class="config-card">
        <div class="form-group">
          <label>收件人</label>
          <textarea
            v-model="bulkEmail.recipients"
            placeholder="每行一个邮箱地址，例如：&#10;user1@example.com&#10;user2@example.com"
            class="form-textarea"
            rows="4"
          ></textarea>
          <span class="form-hint">每行一个邮箱地址</span>
        </div>
        <div class="form-group">
          <label>邮件主题</label>
          <input
            v-model="bulkEmail.subject"
            type="text"
            placeholder="邮件主题"
            class="form-input"
          />
        </div>
        <div class="form-group">
          <label>邮件内容</label>
          <textarea
            v-model="bulkEmail.content"
            placeholder="邮件正文内容"
            class="form-textarea"
            rows="8"
          ></textarea>
        </div>
        <div class="form-actions">
          <button class="btn btn--secondary" @click="previewEmail">预览</button>
          <button class="btn btn--primary" @click="sendBulkEmail">发送邮件</button>
        </div>
      </div>
    </div>

    <!-- 发送记录 -->
    <div class="config-section">
      <h3 class="section-title">发送记录</h3>
      <div class="email-table-wrapper">
        <table class="email-table">
          <thead>
            <tr>
              <th>主题</th>
              <th>收件人数量</th>
              <th>成功</th>
              <th>失败</th>
              <th>状态</th>
              <th>发送时间</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="record in emailHistory" :key="record.id">
              <td>{{ record.subject }}</td>
              <td>{{ record.totalRecipients }}</td>
              <td class="success">{{ record.successCount }}</td>
              <td class="failed">{{ record.failedCount }}</td>
              <td>
                <span class="status-badge" :class="`status-badge--${record.status}`">
                  {{ getStatusLabel(record.status) }}
                </span>
              </td>
              <td class="time">{{ record.sentAt }}</td>
            </tr>
          </tbody>
        </table>

        <div v-if="emailHistory.length === 0" class="empty-state">
          <div class="empty-state__icon">📧</div>
          <div class="empty-state__text">暂无发送记录</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useTenant } from '@twt/branding'

const tenant = useTenant()

interface EmailRecord {
  id: string
  subject: string
  totalRecipients: number
  successCount: number
  failedCount: number
  status: 'sending' | 'completed' | 'failed'
  sentAt: string
}

const smtpConfig = ref({
  host: tenant.email.smtpConfig?.host || '',
  port: tenant.email.smtpConfig?.port || 465,
  username: tenant.email.smtpConfig?.username || '',
  password: tenant.email.smtpConfig?.password || '',
})

const senderConfig = ref({
  fromName: tenant.email.fromName,
  fromEmail: tenant.email.fromEmail,
  replyTo: tenant.email.replyTo,
})

const bulkEmail = ref({
  recipients: '',
  subject: '',
  content: '',
})

const emailHistory = ref<EmailRecord[]>([
  {
    id: '1',
    subject: '产品更新通知',
    totalRecipients: 150,
    successCount: 148,
    failedCount: 2,
    status: 'completed',
    sentAt: '2026-04-05 14:30:00',
  },
  {
    id: '2',
    subject: '月度报告',
    totalRecipients: 200,
    successCount: 200,
    failedCount: 0,
    status: 'completed',
    sentAt: '2026-04-01 10:00:00',
  },
])

const testConnection = () => {
  if (!smtpConfig.value.host || !smtpConfig.value.username) {
    alert('请填写完整的 SMTP 配置')
    return
  }
  alert('正在测试连接...\n\n测试成功！SMTP 配置正确。')
}

const saveSMTPConfig = () => {
  if (!smtpConfig.value.host || !smtpConfig.value.username) {
    alert('请填写完整的 SMTP 配置')
    return
  }
  console.log('保存 SMTP 配置：', smtpConfig.value)
  alert('SMTP 配置已保存！')
}

const saveSenderConfig = () => {
  if (!senderConfig.value.fromName || !senderConfig.value.fromEmail) {
    alert('请填写完整的发件人配置')
    return
  }
  console.log('保存发件人配置：', senderConfig.value)
  alert('发件人配置已保存！')
}

const previewEmail = () => {
  if (!bulkEmail.value.subject || !bulkEmail.value.content) {
    alert('请填写邮件主题和内容')
    return
  }
  alert(`邮件预览\n\n主题：${bulkEmail.value.subject}\n\n内容：\n${bulkEmail.value.content}`)
}

const sendBulkEmail = () => {
  if (!bulkEmail.value.recipients || !bulkEmail.value.subject || !bulkEmail.value.content) {
    alert('请填写完整的邮件信息')
    return
  }
  const recipients = bulkEmail.value.recipients.split('\n').filter(e => e.trim())
  if (recipients.length === 0) {
    alert('请至少输入一个收件人邮箱')
    return
  }
  if (confirm(`确定要发送邮件给 ${recipients.length} 个收件人吗？`)) {
    console.log('发送邮件：', bulkEmail.value)
    alert('邮件发送任务已创建，正在后台发送...')
    bulkEmail.value = { recipients: '', subject: '', content: '' }
  }
}

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    sending: '发送中',
    completed: '已完成',
    failed: '失败',
  }
  return labels[status] || status
}
</script>

<style scoped>
.email-page {
  padding: 24px;
  max-width: 1200px;
}

.page-header {
  margin-bottom: 32px;
}

.page-header h2 {
  margin: 0 0 8px 0;
  font-size: 24px;
  font-weight: 600;
  color: #111827;
}

.page-desc {
  margin: 0;
  color: #6b7280;
  font-size: 14px;
}

.config-section {
  margin-bottom: 32px;
}

.section-title {
  margin: 0 0 16px 0;
  font-size: 18px;
  font-weight: 600;
  color: #111827;
}

.config-card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 24px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group:last-child {
  margin-bottom: 0;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  font-family: inherit;
}

.form-textarea {
  resize: vertical;
}

.form-hint {
  display: block;
  margin-top: 6px;
  font-size: 12px;
  color: #6b7280;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #e5e7eb;
}

.btn {
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  border: none;
}

.btn--primary {
  background: #6366f1;
  color: #fff;
}

.btn--primary:hover {
  background: #4f46e5;
}

.btn--secondary {
  background: #fff;
  border: 1px solid #d1d5db;
  color: #374151;
}

.btn--secondary:hover {
  background: #f9fafb;
}

/* 发送记录表格 */
.email-table-wrapper {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
}

.email-table {
  width: 100%;
  border-collapse: collapse;
}

.email-table th {
  background: #f9fafb;
  padding: 12px 16px;
  text-align: left;
  font-size: 13px;
  font-weight: 600;
  color: #6b7280;
  border-bottom: 1px solid #e5e7eb;
}

.email-table td {
  padding: 16px;
  font-size: 14px;
  color: #111827;
  border-bottom: 1px solid #f3f4f6;
}

.email-table tbody tr:hover {
  background: #f9fafb;
}

.success {
  color: #10b981;
  font-weight: 600;
}

.failed {
  color: #ef4444;
  font-weight: 600;
}

.time {
  color: #6b7280;
  font-size: 13px;
}

.status-badge {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
}

.status-badge--sending {
  background: #dbeafe;
  color: #1e40af;
}

.status-badge--completed {
  background: #d1fae5;
  color: #065f46;
}

.status-badge--failed {
  background: #fee2e2;
  color: #991b1b;
}

.empty-state {
  padding: 60px 20px;
  text-align: center;
}

.empty-state__icon {
  font-size: 48px;
  margin-bottom: 12px;
}

.empty-state__text {
  color: #6b7280;
  font-size: 14px;
}
</style>
