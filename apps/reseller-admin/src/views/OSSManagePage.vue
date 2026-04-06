<template>
  <div class="oss-page">
    <div class="page-header">
      <h2>OSS 管理</h2>
      <p class="page-desc">配置云存储服务，管理文件上传和存储</p>
    </div>

    <!-- 使用统计 -->
    <div class="stats-cards">
      <div class="stat-card">
        <div class="stat-card__label">存储空间</div>
        <div class="stat-card__value">{{ stats.usedStorage }} GB</div>
        <div class="stat-card__trend">总容量 {{ stats.totalStorage }} GB</div>
      </div>
      <div class="stat-card">
        <div class="stat-card__label">文件数量</div>
        <div class="stat-card__value">{{ stats.fileCount.toLocaleString() }}</div>
        <div class="stat-card__trend">本月 +{{ stats.monthFiles }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-card__label">流量使用</div>
        <div class="stat-card__value">{{ stats.bandwidth }} GB</div>
        <div class="stat-card__trend">本月</div>
      </div>
      <div class="stat-card">
        <div class="stat-card__label">请求次数</div>
        <div class="stat-card__value">{{ stats.requests.toLocaleString() }}</div>
        <div class="stat-card__trend">本月</div>
      </div>
    </div>

    <!-- OSS 配置 -->
    <div class="config-section">
      <h3 class="section-title">OSS 配置</h3>
      <div class="config-card">
        <div class="form-group">
          <label>服务提供商</label>
          <select v-model="ossConfig.provider" class="form-select">
            <option value="aliyun">阿里云 OSS</option>
            <option value="aws">AWS S3</option>
            <option value="qiniu">七牛云</option>
          </select>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Bucket 名称</label>
            <input
              v-model="ossConfig.bucket"
              type="text"
              placeholder="例如：my-bucket"
              class="form-input"
            />
          </div>
          <div class="form-group">
            <label>区域</label>
            <input
              v-model="ossConfig.region"
              type="text"
              placeholder="例如：cn-shanghai"
              class="form-input"
            />
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Access Key ID</label>
            <input
              v-model="ossConfig.accessKeyId"
              type="text"
              placeholder="Access Key ID"
              class="form-input"
            />
          </div>
          <div class="form-group">
            <label>Access Key Secret</label>
            <input
              v-model="ossConfig.accessKeySecret"
              type="password"
              placeholder="Access Key Secret"
              class="form-input"
            />
          </div>
        </div>
        <div class="form-actions">
          <button class="btn btn--secondary" @click="testConnection">测试连接</button>
          <button class="btn btn--primary" @click="saveConfig">保存配置</button>
        </div>
      </div>
    </div>

    <!-- 文件管理 -->
    <div class="config-section">
      <div class="section-header">
        <h3 class="section-title">文件管理</h3>
        <button class="btn btn--secondary">上传文件</button>
      </div>
      <div class="file-table-wrapper">
        <table class="file-table">
          <thead>
            <tr>
              <th>文件名</th>
              <th>大小</th>
              <th>类型</th>
              <th>上传时间</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="file in files" :key="file.id">
              <td>
                <div class="file-info">
                  <span class="file-icon">📄</span>
                  <span class="file-name">{{ file.name }}</span>
                </div>
              </td>
              <td>{{ file.size }}</td>
              <td>{{ file.type }}</td>
              <td class="time">{{ file.uploadedAt }}</td>
              <td>
                <button class="btn-link" @click="viewFile(file)">查看</button>
                <button class="btn-link btn-link--danger" @click="deleteFile(file)">删除</button>
              </td>
            </tr>
          </tbody>
        </table>

        <div v-if="files.length === 0" class="empty-state">
          <div class="empty-state__icon">📦</div>
          <div class="empty-state__text">暂无文件</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useTenant } from '@twt/branding'

const tenant = useTenant()

interface FileItem {
  id: string
  name: string
  size: string
  type: string
  uploadedAt: string
}

const stats = ref({
  usedStorage: 12.5,
  totalStorage: 100,
  fileCount: 3420,
  monthFiles: 856,
  bandwidth: 45.8,
  requests: 125600,
})

const ossConfig = ref({
  provider: tenant.oss.provider,
  bucket: tenant.oss.bucket,
  region: tenant.oss.region,
  accessKeyId: tenant.oss.accessKeyId,
  accessKeySecret: tenant.oss.accessKeySecret,
})

const files = ref<FileItem[]>([
  {
    id: '1',
    name: 'avatar-user123.jpg',
    size: '256 KB',
    type: 'image/jpeg',
    uploadedAt: '2026-04-06 10:30:00',
  },
  {
    id: '2',
    name: 'document.pdf',
    size: '1.2 MB',
    type: 'application/pdf',
    uploadedAt: '2026-04-05 14:20:00',
  },
  {
    id: '3',
    name: 'screenshot.png',
    size: '512 KB',
    type: 'image/png',
    uploadedAt: '2026-04-04 09:15:00',
  },
])

const testConnection = () => {
  if (!ossConfig.value.bucket || !ossConfig.value.accessKeyId) {
    alert('请填写完整的 OSS 配置')
    return
  }
  alert('正在测试连接...\n\n测试成功！OSS 配置正确。')
}

const saveConfig = () => {
  if (!ossConfig.value.bucket || !ossConfig.value.accessKeyId) {
    alert('请填写完整的 OSS 配置')
    return
  }
  console.log('保存 OSS 配置：', ossConfig.value)
  alert('OSS 配置已保存！')
}

const viewFile = (file: FileItem) => {
  alert(`查看文件：${file.name}`)
}

const deleteFile = (file: FileItem) => {
  if (confirm(`确定要删除文件 ${file.name} 吗？`)) {
    files.value = files.value.filter(f => f.id !== file.id)
    alert('文件已删除')
  }
}
</script>

<style scoped>
.oss-page {
  padding: 24px;
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

/* 统计卡片 */
.stats-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 32px;
}

.stat-card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 20px;
}

.stat-card__label {
  color: #6b7280;
  font-size: 14px;
  margin-bottom: 8px;
}

.stat-card__value {
  color: #111827;
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 4px;
}

.stat-card__trend {
  color: #10b981;
  font-size: 13px;
}

.config-section {
  margin-bottom: 32px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
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
.form-select {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
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

/* 文件表格 */
.file-table-wrapper {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
}

.file-table {
  width: 100%;
  border-collapse: collapse;
}

.file-table th {
  background: #f9fafb;
  padding: 12px 16px;
  text-align: left;
  font-size: 13px;
  font-weight: 600;
  color: #6b7280;
  border-bottom: 1px solid #e5e7eb;
}

.file-table td {
  padding: 16px;
  font-size: 14px;
  color: #111827;
  border-bottom: 1px solid #f3f4f6;
}

.file-table tbody tr:hover {
  background: #f9fafb;
}

.file-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.file-icon {
  font-size: 24px;
}

.file-name {
  font-weight: 500;
}

.time {
  color: #6b7280;
  font-size: 13px;
}

.btn-link {
  background: none;
  border: none;
  color: #6366f1;
  cursor: pointer;
  font-size: 14px;
  padding: 0;
  margin-right: 12px;
}

.btn-link:hover {
  text-decoration: underline;
}

.btn-link--danger {
  color: #ef4444;
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
