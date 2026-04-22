<template>
  <div class="version-manage-page">
    <a-card class="filter-card">
      <div class="filter-row">
        <a-input v-model:value="keyword" placeholder="搜索版本号" style="width: 200px" allow-clear>
          <template #prefix><SearchOutlined /></template>
        </a-input>
        <div style="margin-left: auto">
          <a-button type="primary" @click="showPublishModal = true">
            <template #icon><PlusOutlined /></template>
            发布新版本
          </a-button>
        </div>
      </div>
    </a-card>

    <div class="version-cards">
      <a-card v-for="v in filteredVersions" :key="v.version" class="version-card">
        <template #title>
          <div class="version-title">
            <span class="version-number">{{ v.version }}</span>
            <a-tag v-if="v.isLatest" color="blue">最新版本</a-tag>
            <span class="version-date">{{ v.releaseDate }}</span>
          </div>
        </template>
        <template #extra>
          <span class="customer-count">{{ v.customerCount }} 个客户使用</span>
        </template>

        <div class="changelog">
          <div v-for="(line, i) in v.changelog.split('\n')" :key="i" class="changelog-item">
            {{ line }}
          </div>
        </div>

        <template #actions>
          <a-button size="small" @click="handlePushUpgrade(v)">推送升级</a-button>
          <a-button size="small">查看详情</a-button>
        </template>
      </a-card>
    </div>

    <!-- 发布弹窗 -->
    <a-modal v-model:open="showPublishModal" title="发布新版本" @ok="handlePublish">
      <a-form :model="publishForm" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }">
        <a-form-item label="版本号" required>
          <a-input v-model:value="publishForm.version" placeholder="v2.4.0" />
        </a-form-item>
        <a-form-item label="更新日志" required>
          <a-textarea v-model:value="publishForm.changelog" :rows="5" placeholder="每行一条更新内容" />
        </a-form-item>
        <a-form-item label="发布说明">
          <a-textarea v-model:value="publishForm.notes" :rows="3" />
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 推送升级弹窗 -->
    <a-modal v-model:open="showPushModal" :title="'推送升级 - ' + pushVersion" @ok="handlePushSubmit">
      <p style="margin-bottom: 16px; color: #6b7280">选择要推送升级通知的客户：</p>
      <a-checkbox-group v-model:value="pushTargets" style="width: 100%">
        <div v-for="c in upgradableCustomers" :key="c.id" class="push-customer-item">
          <a-checkbox :value="c.id">
            {{ c.name }}
            <span style="color: #6b7280; font-size: 12px; margin-left: 8px">当前 {{ c.currentVersion }}</span>
          </a-checkbox>
        </div>
      </a-checkbox-group>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { message } from 'ant-design-vue'
import { SearchOutlined, PlusOutlined } from '@ant-design/icons-vue'
import { versionsData, type VersionInfo } from '../mock/deploymentsData'
import { customersData } from '../mock/customersData'

const versions = ref<VersionInfo[]>([...versionsData])
const keyword = ref('')
const showPublishModal = ref(false)
const showPushModal = ref(false)
const pushVersion = ref('')
const pushTargets = ref<string[]>([])

const filteredVersions = computed(() => {
  if (!keyword.value) return versions.value
  return versions.value.filter(v => v.version.includes(keyword.value))
})

const upgradableCustomers = computed(() =>
  customersData.filter(c => c.deployStatus === 'running' && c.currentVersion !== pushVersion.value)
)

const publishForm = reactive({ version: '', changelog: '', notes: '' })

function handlePushUpgrade(v: VersionInfo) {
  pushVersion.value = v.version
  pushTargets.value = []
  showPushModal.value = true
}

function handlePushSubmit() {
  if (pushTargets.value.length === 0) { message.error('请选择客户'); return }
  message.success(`已向 ${pushTargets.value.length} 个客户推送升级通知`)
  showPushModal.value = false
}

function handlePublish() {
  if (!publishForm.version || !publishForm.changelog) { message.error('请填写版本号和更新日志'); return }
  versions.value.forEach(v => v.isLatest = false)
  versions.value.unshift({
    key: String(versions.value.length + 1),
    version: publishForm.version,
    releaseDate: new Date().toISOString().split('T')[0],
    changelog: publishForm.changelog,
    customerCount: 0,
    isLatest: true,
  })
  message.success('版本发布成功')
  showPublishModal.value = false
  publishForm.version = ''; publishForm.changelog = ''; publishForm.notes = ''
}
</script>

<style scoped>
.version-manage-page { display: flex; flex-direction: column; gap: 16px; }
.filter-row { display: flex; align-items: center; gap: 12px; }
.version-cards { display: flex; flex-direction: column; gap: 16px; }
.version-title { display: flex; align-items: center; gap: 12px; }
.version-number { font-size: 18px; font-weight: 600; }
.version-date { font-size: 13px; color: #6b7280; margin-left: auto; font-weight: 400; }
.customer-count { font-size: 13px; color: #6b7280; }
.changelog { display: flex; flex-direction: column; gap: 6px; }
.changelog-item { font-size: 14px; color: #374151; padding-left: 16px; position: relative; }
.changelog-item::before { content: ''; position: absolute; left: 0; top: 8px; width: 6px; height: 6px; border-radius: 50%; background: #6366f1; }
.push-customer-item { padding: 8px 0; border-bottom: 1px solid #f3f4f6; }
</style>
