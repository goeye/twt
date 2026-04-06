<template>
  <div class="platform-config-page">
    <a-card title="平台配置">
      <a-form
        :model="formState"
        :label-col="{ span: 4 }"
        :wrapper-col="{ span: 16 }"
      >
        <a-form-item label="平台名称">
          <a-input v-model:value="formState.platformName" />
        </a-form-item>

        <a-form-item label="默认分成比例">
          <a-input-number
            v-model:value="formState.defaultCommissionRate"
            :min="0"
            :max="100"
            :step="1"
            addon-after="%"
          />
        </a-form-item>

        <a-form-item label="Stripe 配置">
          <a-input v-model:value="formState.stripeApiKey" placeholder="Stripe API Key" />
        </a-form-item>

        <a-form-item label="邮件配置">
          <a-input v-model:value="formState.smtpHost" placeholder="SMTP Host" style="margin-bottom: 8px" />
          <a-input v-model:value="formState.smtpPort" placeholder="SMTP Port" />
        </a-form-item>

        <a-form-item :wrapper-col="{ offset: 4, span: 16 }">
          <a-button type="primary" @click="handleSave">
            <template #icon><SaveOutlined /></template>
            保存配置
          </a-button>
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { message } from 'ant-design-vue'
import { SaveOutlined } from '@ant-design/icons-vue'

const formState = reactive({
  platformName: 'TWT Chat',
  defaultCommissionRate: 30,
  stripeApiKey: '',
  smtpHost: '',
  smtpPort: '',
})

function handleSave() {
  message.success('平台配置已保存')
}
</script>

<style scoped>
.platform-config-page {
  background: #fff;
  padding: 24px;
  min-height: calc(100vh - 112px);
}
</style>
