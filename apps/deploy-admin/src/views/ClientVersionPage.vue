<template>
  <div class="client-version-page">
    <a-card class="filter-card">
      <div class="filter-row">
        <a-select v-model:value="platformFilter" placeholder="平台" style="width: 140px" allow-clear>
          <a-select-option value="macos">macOS</a-select-option>
          <a-select-option value="windows">Windows</a-select-option>
          <a-select-option value="ios">iOS</a-select-option>
          <a-select-option value="android">Android</a-select-option>
        </a-select>
        <a-input v-model:value="keyword" placeholder="搜索版本号" style="width: 200px" allow-clear>
          <template #prefix><SearchOutlined /></template>
        </a-input>
        <div style="margin-left: auto">
          <a-button type="primary" @click="showPublishModal = true">
            <template #icon><PlusOutlined /></template>
            发布客户端版本
          </a-button>
        </div>
      </div>
    </a-card>

    <div class="version-cards">
      <a-card v-for="v in filteredVersions" :key="v.key" class="version-card">
        <template #title>
          <div class="version-title">
            <span class="version-number">{{ v.version }}</span>
            <a-tag :color="getPlatformColor(v.platform)">{{ getPlatformText(v.platform) }}</a-tag>
            <a-tag v-if="v.isLatest" color="blue">最新</a-tag>
            <span class="version-date">{{ v.releaseDate }}</span>
          </div>
        </template>
        <template #extra>
          <span class="min-server">要求服务端 >= {{ v.minServerVersion }}</span>
        </template>

        <div class="changelog">
          <div v-for="(line, i) in v.changelog.split('\n')" :key="i" class="changelog-item">
            {{ line }}
          </div>
        </div>

        <template #actions>
          <a-button size="small" @click="handleCopyDownloadUrl(v)">复制下载链接</a-button>
        </template>
      </a-card>
    </div>

    <a-modal v-model:open="showPublishModal" title="发布客户端版本" width="640px" @ok="handlePublish">
      <a-form :model="publishForm" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }">
        <a-form-item label="平台" required>
          <a-checkbox-group v-model:value="publishForm.platforms">
            <a-checkbox value="macos">macOS</a-checkbox>
            <a-checkbox value="windows">Windows</a-checkbox>
            <a-checkbox value="ios">iOS</a-checkbox>
            <a-checkbox value="android">Android</a-checkbox>
          </a-checkbox-group>
        </a-form-item>
        <a-form-item label="版本号" required>
          <a-input v-model:value="publishForm.version" placeholder="v2.4.0" />
        </a-form-item>
        <a-form-item label="最低服务端版本" required>
          <a-input v-model:value="publishForm.minServerVersion" placeholder="v2.2.0" />
        </a-form-item>
        <a-form-item label="更新日志" required>
          <a-textarea v-model:value="publishForm.changelog" :rows="4" placeholder="每行一条更新内容" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { message } from 'ant-design-vue'
import { SearchOutlined, PlusOutlined } from '@ant-design/icons-vue'
import { clientVersionsData, type ClientVersion, type ClientPlatform } from '../mock/deploymentsData'

const versions = ref<ClientVersion[]>([...clientVersionsData])
const keyword = ref('')
const platformFilter = ref<string | undefined>(undefined)
const showPublishModal = ref(false)

const filteredVersions = computed(() => {
  let result = versions.value
  if (platformFilter.value) result = result.filter(v => v.platform === platformFilter.value)
  if (keyword.value) result = result.filter(v => v.version.includes(keyword.value))
  return result.sort((a, b) => b.releaseDate.localeCompare(a.releaseDate))
})

const publishForm = reactive({
  platforms: [] as string[],
  version: '',
  minServerVersion: '',
  changelog: '',
})

function getPlatformColor(p: ClientPlatform) {
  return { macos: 'purple', windows: 'blue', ios: 'orange', android: 'green' }[p]
}
function getPlatformText(p: ClientPlatform) {
  return { macos: 'macOS', windows: 'Windows', ios: 'iOS', android: 'Android' }[p]
}

function handleCopyDownloadUrl(v: ClientVersion) {
  navigator.clipboard?.writeText(v.downloadUrl)
  message.success('下载链接已复制')
}

function handlePublish() {
  if (!publishForm.platforms.length || !publishForm.version || !publishForm.changelog) {
    message.error('请填写完整信息'); return
  }
  const extMap: Record<string, string> = { macos: '.dmg', windows: '.exe', ios: '.ipa', android: '.apk' }
  for (const platform of publishForm.platforms) {
    versions.value.forEach(v => { if (v.platform === platform) v.isLatest = false })
    versions.value.unshift({
      key: String(Date.now()) + platform,
      version: publishForm.version,
      platform: platform as ClientPlatform,
      releaseDate: new Date().toISOString().split('T')[0],
      changelog: publishForm.changelog,
      downloadUrl: `/releases/link-${platform === 'macos' || platform === 'windows' ? 'desktop' : 'mobile'}-${publishForm.version}${extMap[platform]}`,
      minServerVersion: publishForm.minServerVersion,
      isLatest: true,
    })
  }
  message.success(`已发布 ${publishForm.platforms.length} 个平台的客户端 ${publishForm.version}`)
  showPublishModal.value = false
  publishForm.platforms = []; publishForm.version = ''; publishForm.changelog = ''; publishForm.minServerVersion = ''
}
</script>

<style scoped>
.client-version-page { display: flex; flex-direction: column; gap: 16px; }
.filter-row { display: flex; align-items: center; gap: 12px; }
.version-cards { display: flex; flex-direction: column; gap: 16px; }
.version-title { display: flex; align-items: center; gap: 12px; }
.version-number { font-size: 18px; font-weight: 600; }
.version-date { font-size: 13px; color: #6b7280; margin-left: auto; font-weight: 400; }
.min-server { font-size: 13px; color: #6b7280; }
.changelog { display: flex; flex-direction: column; gap: 6px; }
.changelog-item { font-size: 14px; color: #374151; padding-left: 16px; position: relative; }
.changelog-item::before { content: ''; position: absolute; left: 0; top: 8px; width: 6px; height: 6px; border-radius: 50%; background: #6366f1; }
</style>
