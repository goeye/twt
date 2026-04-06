<template>
  <div class="brand-config-page">
    <a-card title="品牌配置">
      <a-form
        :model="formState"
        :label-col="{ span: 4 }"
        :wrapper-col="{ span: 16 }"
      >
        <a-form-item label="品牌名称" required>
          <a-input v-model:value="formState.name" placeholder="请输入品牌名称" />
        </a-form-item>

        <a-form-item label="显示名称" required>
          <a-input v-model:value="formState.displayName" placeholder="请输入显示名称" />
        </a-form-item>

        <a-form-item label="品牌 Logo" required>
          <a-upload
            v-model:file-list="logoFileList"
            list-type="picture-card"
            :max-count="1"
            :before-upload="beforeUpload"
          >
            <div v-if="!formState.logo">
              <PlusOutlined />
              <div style="margin-top: 8px">上传 Logo</div>
            </div>
          </a-upload>
          <div v-if="formState.logo" style="margin-top: 8px">
            <img :src="formState.logo" style="max-width: 200px" />
          </div>
        </a-form-item>

        <a-form-item label="Favicon" required>
          <a-upload
            v-model:file-list="faviconFileList"
            list-type="picture-card"
            :max-count="1"
            :before-upload="beforeUpload"
          >
            <div v-if="!formState.favicon">
              <PlusOutlined />
              <div style="margin-top: 8px">上传 Favicon</div>
            </div>
          </a-upload>
        </a-form-item>

        <a-form-item label="主题颜色" required>
          <a-input
            v-model:value="formState.primaryColor"
            type="color"
            style="width: 100px"
          />
          <span style="margin-left: 12px; color: #666">{{ formState.primaryColor }}</span>
        </a-form-item>

        <a-form-item label="法律实体名称" required>
          <a-input v-model:value="formState.legalName" placeholder="请输入法律实体名称" />
        </a-form-item>

        <a-form-item label="功能开关">
          <a-space direction="vertical">
            <a-checkbox v-model:checked="formState.features.hideOriginalBrand">
              隐藏原始品牌
            </a-checkbox>
            <a-checkbox v-model:checked="formState.features.customEmailTemplate">
              自定义邮件模板
            </a-checkbox>
            <a-checkbox v-model:checked="formState.features.customDomain">
              自定义域名
            </a-checkbox>
            <a-checkbox v-model:checked="formState.features.independentApp">
              独立 APP
            </a-checkbox>
          </a-space>
        </a-form-item>

        <a-form-item :wrapper-col="{ offset: 4, span: 16 }">
          <a-space>
            <a-button type="primary" @click="handleSave">
              <template #icon><SaveOutlined /></template>
              保存配置
            </a-button>
            <a-button @click="handlePreview">
              <template #icon><EyeOutlined /></template>
              预览效果
            </a-button>
          </a-space>
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { message } from 'ant-design-vue'
import { PlusOutlined, SaveOutlined, EyeOutlined } from '@ant-design/icons-vue'
import { useTenant } from '@twt/branding'

const tenant = useTenant()

const formState = reactive({
  name: tenant.name,
  displayName: tenant.displayName,
  logo: tenant.logo,
  favicon: tenant.favicon,
  primaryColor: tenant.primaryColor,
  legalName: tenant.legalName,
  features: {
    hideOriginalBrand: tenant.features.hideOriginalBrand,
    customEmailTemplate: tenant.features.customEmailTemplate,
    customDomain: tenant.features.customDomain,
    independentApp: tenant.features.independentApp,
  },
})

const logoFileList = ref([])
const faviconFileList = ref([])

function beforeUpload(file: File) {
  const isImage = file.type.startsWith('image/')
  if (!isImage) {
    message.error('只能上传图片文件！')
    return false
  }
  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isLt2M) {
    message.error('图片大小不能超过 2MB！')
    return false
  }

  // 读取文件并转换为 data URI
  const reader = new FileReader()
  reader.onload = (e) => {
    if (logoFileList.value.length > 0) {
      formState.logo = e.target?.result as string
    } else if (faviconFileList.value.length > 0) {
      formState.favicon = e.target?.result as string
    }
  }
  reader.readAsDataURL(file)

  return false // 阻止自动上传
}

function handleSave() {
  // 这里应该调用 API 保存配置
  // 原型阶段，直接保存到 localStorage
  localStorage.setItem('brandConfig', JSON.stringify(formState))
  message.success('品牌配置已保存')
}

function handlePreview() {
  message.info('预览功能开发中...')
}
</script>

<style scoped>
.brand-config-page {
  background: #fff;
  padding: 24px;
  min-height: calc(100vh - 112px);
}
</style>
