<template>
  <div class="page-container">
    <!-- 筛选区域 -->
    <div class="filter-bar">
      <div class="filter-row">
        <span class="filter-label">项目名称：</span>
        <a-input v-model:value="filters.projectName" placeholder="请输入" style="width: 200px" />

        <span class="filter-label">服务版本：</span>
        <a-select v-model:value="filters.serviceVersion" style="width: 150px">
          <a-select-option value="">全部</a-select-option>
          <a-select-option value="专业版">专业版</a-select-option>
          <a-select-option value="免费版">免费版</a-select-option>
        </a-select>

        <span class="filter-label">是否付费：</span>
        <a-select v-model:value="filters.isPaid" style="width: 120px">
          <a-select-option value="">全部</a-select-option>
          <a-select-option value="yes">是</a-select-option>
          <a-select-option value="no">否</a-select-option>
        </a-select>

        <span class="filter-label">是否试用：</span>
        <a-select v-model:value="filters.isTrial" style="width: 120px">
          <a-select-option value="">全部</a-select-option>
          <a-select-option value="yes">是</a-select-option>
          <a-select-option value="no">否</a-select-option>
        </a-select>

        <span class="filter-label">最近消息时间：</span>
        <a-range-picker v-model:value="filters.lastMessageTime" :placeholder="['开始时间', '结束时间']" style="width: 240px" />
      </div>

      <div class="filter-row">
        <span class="filter-label">隐藏官方标识：</span>
        <a-select v-model:value="filters.hideOfficialMark" style="width: 120px">
          <a-select-option value="">全部</a-select-option>
          <a-select-option value="yes">是</a-select-option>
          <a-select-option value="no">否</a-select-option>
        </a-select>

        <span class="filter-label">站点状态：</span>
        <a-select v-model:value="filters.siteStatus" style="width: 120px">
          <a-select-option value="">全部</a-select-option>
          <a-select-option value="启用">启用</a-select-option>
          <a-select-option value="禁用">禁用</a-select-option>
        </a-select>

        <span class="filter-label">创建时间：</span>
        <a-range-picker v-model:value="filters.createTime" :placeholder="['开始时间', '结束时间']" style="width: 240px" />

        <span class="filter-label">到期时间：</span>
        <a-range-picker v-model:value="filters.expireTime" :placeholder="['开始时间', '结束时间']" style="width: 240px" />
      </div>

      <div class="filter-row">
        <span class="filter-label">首次付费时间：</span>
        <a-range-picker v-model:value="filters.firstPayTime" :placeholder="['开始时间', '结束时间']" style="width: 240px" />

        <span class="filter-label">最新付费时间：</span>
        <a-range-picker v-model:value="filters.lastRenewTime" :placeholder="['开始时间', '结束时间']" style="width: 240px" />

        <span class="filter-label">计数周期：</span>
        <a-range-picker v-model:value="filters.countPeriod" :placeholder="['开始时间', '结束时间']" style="width: 240px" />
      </div>

      <div class="filter-row">
        <span class="filter-label">创建人ID：</span>
        <a-input v-model:value="filters.creatorId" placeholder="请输入" style="width: 200px" />

        <span class="filter-label">语言环境：</span>
        <a-select v-model:value="filters.language" style="width: 120px">
          <a-select-option value="">全部</a-select-option>
          <a-select-option value="简体中文">简体中文</a-select-option>
          <a-select-option value="繁体中文">繁体中文</a-select-option>
          <a-select-option value="English">English</a-select-option>
        </a-select>

        <span class="filter-label">有效项目：</span>
        <a-select v-model:value="filters.hasValidProject" style="width: 120px">
          <a-select-option value="">全部</a-select-option>
          <a-select-option value="yes">是</a-select-option>
          <a-select-option value="no">否</a-select-option>
        </a-select>

        <span class="filter-label">代码接入：</span>
        <a-select v-model:value="filters.isCodeEntered" style="width: 120px">
          <a-select-option value="">全部</a-select-option>
          <a-select-option value="yes">是</a-select-option>
          <a-select-option value="no">否</a-select-option>
        </a-select>

        <span class="filter-label">项目id：</span>
        <a-input v-model:value="filters.projectId" placeholder="请输入" style="width: 150px" />

        <span class="filter-label">来源渠道：</span>
        <a-input v-model:value="filters.sourceChannel" placeholder="请输入" style="width: 150px" />
      </div>

      <div class="filter-row">
        <span class="filter-label">推广标识：</span>
        <a-input v-model:value="filters.utmSource" placeholder="请输入" style="width: 200px" />

        <div style="margin-left: auto; display: flex; gap: 12px">
          <a-button @click="handleSearch">
            <template #icon><SearchOutlined /></template>
            搜索
          </a-button>
          <a-button @click="handleReset">
            <template #icon><ReloadOutlined /></template>
            重置
          </a-button>
          <a-button type="primary">导出</a-button>
        </div>
      </div>
    </div>

    <!-- 数据表格 -->
    <div class="section-block">
      <a-table
        :columns="columns"
        :data-source="displayData"
        :pagination="pagination"
        :scroll="{ x: 4500 }"
        @change="handleTableChange"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'isPaid'">
            {{ record.isPaid ? '是' : '否' }}
          </template>
          <template v-else-if="column.key === 'firstPayTime'">
            {{ record.firstPayTime || '-' }}
          </template>
          <template v-else-if="column.key === 'lastRenewTime'">
            {{ record.lastRenewTime || '-' }}
          </template>
          <template v-else-if="column.key === 'creatorEmail'">
            <template v-if="revealedEmails.has(record.id)">
              {{ record.fullEmail }}
            </template>
            <template v-else>
              {{ record.creatorEmail }}
              <EyeOutlined style="color: #1890ff; margin-left: 4px; cursor: pointer" @click="revealedEmails.add(record.id)" />
            </template>
          </template>
          <template v-else-if="column.key === 'isCodeEntered'">
            {{ record.isCodeEntered ? '已接入' : '未接入' }}
          </template>
          <template v-else-if="column.key === 'connectedDomains'">
            <a v-if="record.connectedDomains > 0" style="color: #1890ff" @click="router.push({ path: '/project/domains', query: { projectId: record.id } })">{{ record.connectedDomains }}</a>
            <span v-else>-</span>
          </template>
          <template v-else-if="column.key === 'lastConsoleTime'">
            {{ record.lastConsoleTime || '-' }}
          </template>
          <template v-else-if="column.key === 'hasOfficialVerify'">
            {{ record.hasOfficialVerify ? '否' : '否' }}
          </template>
          <template v-else-if="column.key === 'clientCount'">
            <a style="color: #1890ff" @click="router.push({ path: '/project/clients', query: { projectId: record.id } })">{{ record.clientCount }}</a>
          </template>
          <template v-else-if="column.key === 'visitorCount'">
            <a style="color: #1890ff" @click="router.push({ path: '/project/visitors', query: { projectId: record.id, type: 'visitor' } })">{{ record.visitorCount }}</a>
          </template>
          <template v-else-if="column.key === 'customerCount'">
            <a style="color: #1890ff" @click="router.push({ path: '/project/visitors', query: { projectId: record.id, type: 'customer' } })">{{ record.customerCount }}</a>
          </template>
          <template v-else-if="column.key === 'sessionWindowOpenCount'">
            {{ record.sessionWindowOpenCount }}
          </template>
          <template v-else-if="column.key === 'sessionWindowIndependentOpenCount'">
            {{ record.sessionWindowIndependentOpenCount }}
          </template>
          <template v-else-if="column.key === 'sessionCount'">
            <a style="color: #1890ff" @click="router.push({ path: '/project/sessions', query: { projectId: record.id } })">{{ record.sessionCount }}</a>
          </template>
          <template v-else-if="column.key === 'chatDays'">
            <a style="color: #1890ff" @click="router.push({ path: '/project/chats', query: { projectId: record.id } })">{{ record.chatDays }}</a>
          </template>
          <template v-else-if="column.key === 'sessionIndependentVisitorCount'">
            <a style="color: #1890ff">{{ record.sessionIndependentVisitorCount }}</a>
          </template>
          <template v-else-if="column.key === 'hasValidProject'">
            {{ record.hasValidProject ? '是' : '否' }}
          </template>
          <template v-else-if="column.key === 'verifyTime'">
            {{ record.verifyTime || '-' }}
          </template>
          <template v-else-if="column.key === 'siteStatus'">
            <span :style="{ color: record.siteStatus === '启用' ? '#52c41a' : '#ff4d4f' }">
              {{ record.siteStatus }}
            </span>
          </template>
          <template v-else-if="column.key === 'action'">
            <div style="display: flex; align-items: center; gap: 8px">
              <a style="color: #ff4d4f">{{ record.siteStatus === '启用' ? '禁用' : '启用' }}</a>
              <a-dropdown>
                <a style="color: #1890ff">
                  更多 <DownOutlined />
                </a>
                <template #overlay>
                  <a-menu>
                    <a-menu-item>修改到期时间</a-menu-item>
                    <a-menu-item>修改坐席数</a-menu-item>
                    <a-menu-item>修改试用状态</a-menu-item>
                  </a-menu>
                </template>
              </a-dropdown>
            </div>
          </template>
        </template>
      </a-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from "vue";
import { useRouter } from "vue-router";
import { SearchOutlined, ReloadOutlined, EyeOutlined, DownOutlined } from "@ant-design/icons-vue";
import { projectsData } from "../mock/projectsData";
import type { Project } from "../mock/projectsData";
import type { TableProps } from "ant-design-vue";

const router = useRouter();
const revealedEmails = reactive(new Set<number>());

const filters = ref({
  projectName: "",
  serviceVersion: "",
  isPaid: "",
  isTrial: "",
  hideOfficialMark: "",
  lastMessageTime: null as any,
  siteStatus: "",
  createTime: null as any,
  expireTime: null as any,
  firstPayTime: null as any,
  lastRenewTime: null as any,
  countPeriod: null as any,
  creatorId: "",
  language: "",
  hasValidProject: "",
  isCodeEntered: "",
  projectId: "",
  sourceChannel: "",
  utmSource: "",
});

const pagination = ref({
  current: 1,
  pageSize: 10,
  total: projectsData.length,
  showSizeChanger: true,
  showTotal: (total: number) => `共 ${total} 条`,
});

const columns = [
  { title: "项目id", dataIndex: "id", key: "id", width: 80, fixed: "left" },
  { title: "项目名称", dataIndex: "name", key: "name", width: 150, fixed: "left" },
  { title: "服务版本", dataIndex: "serviceVersion", key: "serviceVersion", width: 140 },
  { title: "是否付费", key: "isPaid", width: 90 },
  { title: "首次付费时间", key: "firstPayTime", width: 120, sorter: true },
  { title: "最新付费时间", key: "lastRenewTime", width: 120, sorter: true },
  { title: "到期日期", dataIndex: "expireDate", key: "expireDate", width: 120, sorter: true },
  { title: "创建日期", dataIndex: "createDate", key: "createDate", width: 120, sorter: true },
  { title: "创建人ID", dataIndex: "creatorId", key: "creatorId", width: 110 },
  { title: "创建人邮箱", key: "creatorEmail", width: 160 },
  { title: "来源渠道", dataIndex: "sourceChannel", key: "sourceChannel", width: 100 },
  { title: "推广标识", dataIndex: "utmSource", key: "utmSource", width: 100 },
  { title: "是否代码接入", key: "isCodeEntered", width: 120 },
  { title: "已接入域名数", key: "connectedDomains", width: 120 },
  { title: "最近消息时间", key: "lastConsoleTime", width: 120, sorter: true },
  { title: "知识库数量", dataIndex: "knowledgeCount", key: "knowledgeCount", width: 110 },
  { title: "隐藏官方标识", key: "hasOfficialVerify", width: 120 },
  { title: "客服数", key: "clientCount", width: 80, sorter: true },
  { title: "访客数", key: "visitorCount", width: 80, sorter: true },
  { title: "客户数", key: "customerCount", width: 80, sorter: true },
  { title: "会话窗口打开数", key: "sessionWindowOpenCount", width: 140 },
  { title: "会话窗口访客独立打开数", key: "sessionWindowIndependentOpenCount", width: 200 },
  { title: "会话数", key: "sessionCount", width: 80, sorter: true },
  { title: "聊天数", key: "chatDays", width: 80, sorter: true },
  { title: "会话独立访客数", key: "sessionIndependentVisitorCount", width: 140, sorter: true },
  { title: "语言环境", dataIndex: "language", key: "language", width: 100 },
  {
    title: "Autopilot",
    key: "autopilotEnabled",
    width: 110,
    customRender: ({ record }: { record: Project }) => (record.autopilotEnabled ? "开启" : "关闭"),
  },
  {
    title: "会话前表单",
    key: "preSessionFormEnabled",
    width: 120,
    customRender: ({ record }: { record: Project }) => (record.preSessionFormEnabled ? "开启" : "关闭"),
  },
  {
    title: "全员离线表单",
    key: "offlineFormEnabled",
    width: 140,
    customRender: ({ record }: { record: Project }) => (record.offlineFormEnabled ? "开启" : "关闭"),
  },
  {
    title: "自动推荐回复",
    key: "autoReplySuggestionEnabled",
    width: 120,
    customRender: ({ record }: { record: Project }) => (record.autoReplySuggestionEnabled ? "开启" : "关闭"),
  },
  {
    title: "聊天翻译",
    key: "chatTranslationEnabled",
    width: 120,
    customRender: ({ record }: { record: Project }) => (record.chatTranslationEnabled ? "开启" : "关闭"),
  },
  {
    title: "边写边译",
    key: "writeTranslateEnabled",
    width: 120,
    customRender: ({ record }: { record: Project }) => (record.writeTranslateEnabled ? "开启" : "关闭"),
  },
  {
    title: "文本润色",
    key: "textPolishEnabled",
    width: 120,
    customRender: ({ record }: { record: Project }) => (record.textPolishEnabled ? "开启" : "关闭"),
  },
  {
    title: "会话评价",
    key: "sessionEvaluationEnabled",
    width: 120,
    customRender: ({ record }: { record: Project }) => (record.sessionEvaluationEnabled ? "开启" : "关闭"),
  },
  {
    title: "联系我们",
    key: "contactUsEnabled",
    width: 120,
    customRender: ({ record }: { record: Project }) => (record.contactUsEnabled ? "开启" : "关闭"),
  },
  { title: "有效项目", key: "hasValidProject", width: 90 },
  { title: "达标时间", key: "verifyTime", width: 120 },
  { title: "站点状态", key: "siteStatus", width: 90 },
  { title: "操作", key: "action", width: 100, fixed: "right" },
];

const displayData = computed(() => {
  const start = (pagination.value.current - 1) * pagination.value.pageSize;
  const end = start + pagination.value.pageSize;
  return projectsData.slice(start, end);
});

function handleSearch() {
  pagination.value.current = 1;
}

function handleReset() {
  filters.value = {
    projectName: "",
    serviceVersion: "",
    isPaid: "",
    isTrial: "",
  hideOfficialMark: "",
    lastMessageTime: null,
    siteStatus: "",
    createTime: null,
    expireTime: null,
    firstPayTime: null,
    lastRenewTime: null,
    countPeriod: null,
    creatorId: "",
    language: "",
    hasValidProject: "",
    isCodeEntered: "",
    projectId: "",
    sourceChannel: "",
    utmSource: "",
  };
  pagination.value.current = 1;
}

function handleTableChange(pag: any) {
  pagination.value.current = pag.current;
  pagination.value.pageSize = pag.pageSize;
}
</script>

<style scoped>
.page-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.filter-bar {
  background: #fff;
  padding: 20px;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.filter-row {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.filter-label {
  color: #666;
  font-size: 14px;
  white-space: nowrap;
}

.section-block {
  background: #fff;
  padding: 20px;
  border-radius: 4px;
}
</style>
