<template>
  <div class="domain-page">
    <div class="page-header">
      <h2>域名绑定</h2>
      <p class="page-desc">绑定自定义域名，配置 DNS 和 SSL 证书</p>
    </div>

    <div class="domain-section">
      <div class="section-header">
        <h3 class="section-title">已绑定域名</h3>
        <button class="btn btn--primary" @click="showAddModal = true">+ 添加域名</button>
      </div>

      <div class="domain-list">
        <div v-for="domain in domains" :key="domain.id" class="domain-card">
          <div class="domain-card__header">
            <div class="domain-info">
              <h4 class="domain-name">{{ domain.name }}</h4>
              <span class="status-badge" :class="`status-badge--${domain.status}`">
                {{ getStatusLabel(domain.status) }}
              </span>
            </div>
            <button class="btn-icon" @click="deleteDomain(domain)">×</button>
          </div>
          <div class="domain-card__body">
            <div class="domain-detail">
              <span class="label">DNS 状态：</span>
              <span :class="domain.dnsVerified ? 'success' : 'warning'">
                {{ domain.dnsVerified ? '已验证' : '待验证' }}
              </span>
            </div>
            <div class="domain-detail">
              <span class="label">SSL 证书：</span>
              <span :class="domain.sslEnabled ? 'success' : 'warning'">
                {{ domain.sslEnabled ? '已启用' : '未启用' }}
              </span>
            </div>
            <div class="domain-detail">
              <span class="label">添加时间：</span>
              <span>{{ domain.createdAt }}</span>
            </div>
          </div>
          <div v-if="!domain.dnsVerified" class="domain-card__footer">
            <div class="dns-instruction">
              <p><strong>DNS 配置说明：</strong></p>
              <p>请在您的域名服务商处添加以下 CNAME 记录：</p>
              <div class="dns-record">
                <div class="dns-row">
                  <span class="dns-label">记录类型：</span>
                  <code>CNAME</code>
                </div>
                <div class="dns-row">
                  <span class="dns-label">主机记录：</span>
                  <code>{{ domain.name }}</code>
                </div>
                <div class="dns-row">
                  <span class="dns-label">记录值：</span>
                  <code>{{ domain.cnameTarget }}</code>
                </div>
              </div>
              <button class="btn btn--secondary btn--small" @click="verifyDNS(domain)">验证 DNS</button>
            </div>
          </div>
        </div>

        <div v-if="domains.length === 0" class="empty-state">
          <div class="empty-state__icon">🌐</div>
          <div class="empty-state__text">暂无绑定域名</div>
          <button class="btn btn--primary" @click="showAddModal = true">添加域名</button>
        </div>
      </div>
    </div>

    <div v-if="showAddModal" class="modal-overlay" @click.self="showAddModal = false">
      <div class="modal">
        <div class="modal__header">
          <h3>添加自定义域名</h3>
          <button class="btn-icon" @click="showAddModal = false">×</button>
        </div>
        <div class="modal__body">
          <div class="form-group">
            <label>域名</label>
            <input
              v-model="newDomain"
              type="text"
              placeholder="例如：chat.example.com"
              class="form-input"
            />
            <span class="form-hint">请输入完整的域名，包括子域名</span>
          </div>
        </div>
        <div class="modal__footer">
          <button class="btn btn--secondary" @click="showAddModal = false">取消</button>
          <button class="btn btn--primary" @click="addDomain">添加</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Domain {
  id: string
  name: string
  status: 'active' | 'pending' | 'failed'
  dnsVerified: boolean
  sslEnabled: boolean
  cnameTarget: string
  createdAt: string
}

const showAddModal = ref(false)
const newDomain = ref('')

const domains = ref<Domain[]>([
  {
    id: '1',
    name: 'chat.example.com',
    status: 'active',
    dnsVerified: true,
    sslEnabled: true,
    cnameTarget: 'reseller.twt.com',
    createdAt: '2026-03-15',
  },
])

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    active: '正常',
    pending: '待配置',
    failed: '失败',
  }
  return labels[status] || status
}

const addDomain = () => {
  if (!newDomain.value.trim()) {
    alert('请输入域名')
    return
  }
  domains.value.push({
    id: String(Date.now()),
    name: newDomain.value,
    status: 'pending',
    dnsVerified: false,
    sslEnabled: false,
    cnameTarget: 'reseller.twt.com',
    createdAt: new Date().toISOString().split('T')[0],
  })
  newDomain.value = ''
  showAddModal.value = false
}

const verifyDNS = (domain: Domain) => {
  alert('DNS 验证成功！')
  domain.dnsVerified = true
  domain.status = 'active'
  domain.sslEnabled = true
}

const deleteDomain = (domain: Domain) => {
  if (confirm(`确定要删除域名 ${domain.name} 吗？`)) {
    domains.value = domains.value.filter(d => d.id !== domain.id)
  }
}
</script>

<style scoped>
.domain-page { padding: 24px; max-width: 1200px; }
.page-header { margin-bottom: 32px; }
.page-header h2 { margin: 0 0 8px 0; font-size: 24px; font-weight: 600; color: #111827; }
.page-desc { margin: 0; color: #6b7280; font-size: 14px; }
.section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
.section-title { margin: 0; font-size: 18px; font-weight: 600; color: #111827; }
.domain-list { display: flex; flex-direction: column; gap: 16px; }
.domain-card { background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden; }
.domain-card__header { display: flex; justify-content: space-between; align-items: center; padding: 20px 24px; border-bottom: 1px solid #e5e7eb; }
.domain-info { display: flex; align-items: center; gap: 12px; }
.domain-name { margin: 0; font-size: 18px; font-weight: 600; color: #111827; }
.domain-card__body { padding: 20px 24px; display: flex; flex-direction: column; gap: 12px; }
.domain-detail { display: flex; align-items: center; gap: 8px; font-size: 14px; }
.label { color: #6b7280; }
.success { color: #10b981; font-weight: 500; }
.warning { color: #f59e0b; font-weight: 500; }
.domain-card__footer { padding: 20px 24px; background: #f9fafb; border-top: 1px solid #e5e7eb; }
.dns-instruction { font-size: 14px; }
.dns-instruction p { margin: 0 0 12px 0; color: #374151; }
.dns-record { background: #fff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; margin-bottom: 16px; }
.dns-row { display: flex; align-items: center; gap: 12px; margin-bottom: 8px; }
.dns-row:last-child { margin-bottom: 0; }
.dns-label { color: #6b7280; min-width: 80px; }
code { background: #f3f4f6; padding: 4px 8px; border-radius: 4px; font-family: monospace; font-size: 13px; color: #111827; }
.status-badge { display: inline-block; padding: 4px 8px; border-radius: 6px; font-size: 12px; font-weight: 500; }
.status-badge--active { background: #d1fae5; color: #065f46; }
.status-badge--pending { background: #fef3c7; color: #92400e; }
.btn { padding: 10px 20px; border-radius: 8px; font-size: 14px; font-weight: 500; cursor: pointer; border: none; }
.btn--primary { background: #6366f1; color: #fff; }
.btn--secondary { background: #fff; border: 1px solid #d1d5db; color: #374151; }
.btn--small { padding: 6px 12px; font-size: 13px; }
.btn-icon { width: 32px; height: 32px; border: 1px solid #d1d5db; border-radius: 6px; background: #fff; color: #6b7280; font-size: 20px; cursor: pointer; }
.empty-state { padding: 60px 20px; text-align: center; background: #f9fafb; border: 1px dashed #d1d5db; border-radius: 12px; }
.empty-state__icon { font-size: 48px; margin-bottom: 12px; }
.empty-state__text { color: #6b7280; font-size: 14px; margin-bottom: 16px; }
.modal-overlay { position: fixed; inset: 0; background: rgba(0, 0, 0, 0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; }
.modal { background: #fff; border-radius: 12px; width: 90%; max-width: 500px; }
.modal__header { display: flex; justify-content: space-between; align-items: center; padding: 20px 24px; border-bottom: 1px solid #e5e7eb; }
.modal__header h3 { margin: 0; font-size: 18px; font-weight: 600; }
.modal__body { padding: 24px; }
.modal__footer { display: flex; justify-content: flex-end; gap: 12px; padding: 16px 24px; border-top: 1px solid #e5e7eb; }
.form-group label { display: block; margin-bottom: 8px; font-size: 14px; font-weight: 500; color: #374151; }
.form-input { width: 100%; padding: 10px 12px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 14px; }
.form-hint { display: block; margin-top: 6px; font-size: 12px; color: #6b7280; }
</style>
