<template>
  <div class="website-config-page">
    <div class="page-header">
      <h2>官网配置</h2>
      <p class="page-desc">配置您的品牌官网内容，包括首页、功能介绍、页脚等</p>
    </div>

    <!-- 首页配置 -->
    <div class="config-section">
      <h3 class="section-title">首页配置</h3>
      <div class="config-card">
        <div class="form-group">
          <label>首页标题</label>
          <input
            v-model="config.heroTitle"
            type="text"
            placeholder="例如：专业的客服解决方案"
            class="form-input"
          />
        </div>
        <div class="form-group">
          <label>首页副标题</label>
          <input
            v-model="config.heroSubtitle"
            type="text"
            placeholder="例如：为企业提供智能客服平台"
            class="form-input"
          />
        </div>
      </div>
    </div>

    <!-- 功能列表 -->
    <div class="config-section">
      <div class="section-header">
        <h3 class="section-title">功能列表</h3>
        <button class="btn btn--secondary" @click="addFeature">+ 添加功能</button>
      </div>
      <div class="features-list">
        <div v-for="(feature, index) in config.features" :key="index" class="feature-item">
          <div class="feature-item__number">{{ index + 1 }}</div>
          <div class="feature-item__content">
            <div class="form-group">
              <label>功能标题</label>
              <input
                v-model="feature.title"
                type="text"
                placeholder="例如：多渠道支持"
                class="form-input"
              />
            </div>
            <div class="form-group">
              <label>功能描述</label>
              <textarea
                v-model="feature.description"
                placeholder="例如：整合网页、邮件、社交媒体等多种沟通渠道"
                class="form-textarea"
                rows="2"
              ></textarea>
            </div>
            <div class="form-group">
              <label>图标名称</label>
              <input
                v-model="feature.icon"
                type="text"
                placeholder="例如：channel"
                class="form-input"
              />
            </div>
          </div>
          <button class="feature-item__remove" @click="removeFeature(index)">删除</button>
        </div>
        <div v-if="config.features.length === 0" class="empty-state">
          <div class="empty-state__text">暂无功能，点击"添加功能"按钮添加</div>
        </div>
      </div>
    </div>

    <!-- 页脚配置 -->
    <div class="config-section">
      <h3 class="section-title">页脚配置</h3>
      <div class="config-card">
        <div class="form-group">
          <label>公司名称</label>
          <input
            v-model="config.footer.companyName"
            type="text"
            placeholder="例如：某某科技有限公司"
            class="form-input"
          />
        </div>
        <div class="form-group">
          <label>页脚链接</label>
          <div class="links-list">
            <div v-for="(link, index) in config.footer.links" :key="index" class="link-item">
              <input
                v-model="link.label"
                type="text"
                placeholder="链接名称"
                class="form-input form-input--small"
              />
              <input
                v-model="link.url"
                type="text"
                placeholder="链接地址"
                class="form-input form-input--small"
              />
              <button class="btn-icon" @click="removeLink(index)">×</button>
            </div>
          </div>
          <button class="btn btn--secondary btn--small" @click="addLink">+ 添加链接</button>
        </div>
      </div>
    </div>

    <!-- 操作按钮 -->
    <div class="action-bar">
      <button class="btn btn--secondary" @click="resetConfig">重置</button>
      <button class="btn btn--primary" @click="saveConfig">保存配置</button>
    </div>

    <!-- 预览提示 -->
    <div class="preview-tip">
      <div class="preview-tip__icon">💡</div>
      <div class="preview-tip__content">
        <strong>提示：</strong>保存后，您可以访问官网查看实际效果。配置会立即生效。
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useTenant } from '@twt/branding'

const tenant = useTenant()

interface Feature {
  title: string
  description: string
  icon: string
}

interface FooterLink {
  label: string
  url: string
}

interface WebsiteConfig {
  heroTitle: string
  heroSubtitle: string
  features: Feature[]
  footer: {
    companyName: string
    links: FooterLink[]
  }
}

// 从租户配置初始化
const config = ref<WebsiteConfig>({
  heroTitle: tenant.website.heroTitle,
  heroSubtitle: tenant.website.heroSubtitle,
  features: [...tenant.website.features],
  footer: {
    companyName: tenant.website.footer.companyName,
    links: [...tenant.website.footer.links],
  },
})

const addFeature = () => {
  config.value.features.push({
    title: '',
    description: '',
    icon: '',
  })
}

const removeFeature = (index: number) => {
  config.value.features.splice(index, 1)
}

const addLink = () => {
  config.value.footer.links.push({
    label: '',
    url: '',
  })
}

const removeLink = (index: number) => {
  config.value.footer.links.splice(index, 1)
}

const resetConfig = () => {
  if (confirm('确定要重置配置吗？所有未保存的修改将丢失。')) {
    config.value = {
      heroTitle: tenant.website.heroTitle,
      heroSubtitle: tenant.website.heroSubtitle,
      features: [...tenant.website.features],
      footer: {
        companyName: tenant.website.footer.companyName,
        links: [...tenant.website.footer.links],
      },
    }
  }
}

const saveConfig = () => {
  // 验证
  if (!config.value.heroTitle || !config.value.heroSubtitle) {
    alert('请填写首页标题和副标题')
    return
  }
  if (!config.value.footer.companyName) {
    alert('请填写公司名称')
    return
  }

  // 保存配置（实际应该调用 API）
  console.log('保存配置：', config.value)
  alert('配置已保存！')
}
</script>

<style scoped>
.website-config-page {
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

.form-input--small {
  width: auto;
  flex: 1;
}

.form-textarea {
  resize: vertical;
}

.features-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.feature-item {
  display: flex;
  gap: 16px;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 20px;
}

.feature-item__number {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #6366f1;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  flex-shrink: 0;
}

.feature-item__content {
  flex: 1;
}

.feature-item__remove {
  padding: 6px 12px;
  border: 1px solid #ef4444;
  border-radius: 6px;
  background: #fff;
  color: #ef4444;
  font-size: 14px;
  cursor: pointer;
  align-self: flex-start;
}

.feature-item__remove:hover {
  background: #fef2f2;
}

.links-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 12px;
}

.link-item {
  display: flex;
  gap: 12px;
  align-items: center;
}

.btn-icon {
  width: 32px;
  height: 32px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: #fff;
  color: #6b7280;
  font-size: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}

.btn-icon:hover {
  background: #f9fafb;
  color: #ef4444;
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

.btn--small {
  padding: 6px 12px;
  font-size: 13px;
}

.action-bar {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid #e5e7eb;
}

.preview-tip {
  display: flex;
  gap: 12px;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 12px;
  padding: 16px;
  margin-top: 24px;
}

.preview-tip__icon {
  font-size: 24px;
}

.preview-tip__content {
  color: #1e40af;
  font-size: 14px;
  line-height: 1.6;
}

.empty-state {
  padding: 40px 20px;
  text-align: center;
  background: #f9fafb;
  border: 1px dashed #d1d5db;
  border-radius: 12px;
}

.empty-state__text {
  color: #6b7280;
  font-size: 14px;
}
</style>
