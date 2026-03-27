<template>
  <div class="page-container">
    <!-- 筛选区域 -->
    <div class="filter-bar">
      <div class="filter-row">
        <span class="filter-label">域名授权：</span>
        <a-input v-model:value="filters.domain" placeholder="请输入" style="width: 200px" />

        <span class="filter-label">项目ID：</span>
        <a-input v-model:value="filters.projectId" placeholder="请输入" style="width: 150px" />

        <span class="filter-label">项目名称：</span>
        <a-input v-model:value="filters.projectName" placeholder="请输入" style="width: 150px" />

        <span class="filter-label">接入状态：</span>
        <a-select v-model:value="filters.accessStatus" style="width: 120px">
          <a-select-option value="">全部</a-select-option>
          <a-select-option value="已接入">已接入</a-select-option>
          <a-select-option value="已休眠">已休眠</a-select-option>
        </a-select>

        <span class="filter-label">语言环境：</span>
        <a-select v-model:value="filters.language" style="width: 120px">
          <a-select-option value="">全部</a-select-option>
          <a-select-option value="简体中文">简体中文</a-select-option>
          <a-select-option value="繁体中文">繁体中文</a-select-option>
          <a-select-option value="English">English</a-select-option>
        </a-select>
      </div>

      <div class="filter-row">
        <span class="filter-label">接入时间：</span>
        <a-range-picker v-model:value="filters.accessTime" :placeholder="['开始时间', '结束时间']" style="width: 240px" />

        <div style="margin-left: auto; display: flex; gap: 12px">
          <a-button type="primary" @click="handleSearch">
            <template #icon><SearchOutlined /></template>
            搜索
          </a-button>
          <a-button @click="handleReset">
            <template #icon><ReloadOutlined /></template>
            重置
          </a-button>
          <a-button>导出</a-button>
        </div>
      </div>
    </div>

    <!-- 数据表格 -->
    <div class="section-block">
      <a-table
        :columns="columns"
        :data-source="displayData"
        :pagination="pagination"
        @change="handleTableChange"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'domain'">
            <a :href="record.domain" target="_blank" style="color: #1890ff">{{ record.domain }}</a>
          </template>
          <template v-else-if="column.key === 'projectName'">
            <div class="text-ellipsis">{{ record.projectName }}</div>
          </template>
          <template v-else-if="column.key === 'lastVisitorMessageTime'">
            {{ record.lastVisitorMessageTime }}
          </template>
        </template>
      </a-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { SearchOutlined, ReloadOutlined } from "@ant-design/icons-vue";
import { domainsData } from "../mock/domainsData";

const route = useRoute();

const filters = ref({
  domain: "",
  projectId: "",
  projectName: "",
  accessStatus: "",
  language: "",
  accessTime: null as any,
});

const pagination = ref({
  current: 1,
  pageSize: 10,
  total: domainsData.length,
  showSizeChanger: true,
  showTotal: (total: number) => `共 ${total} 条`,
});

const columns = [
  { title: "域名", key: "domain", width: 250 },
  { title: "项目名称", key: "projectName", width: 200 },
  { title: "项目id", dataIndex: "projectId", key: "projectId", width: 100 },
  { title: "接入状态", dataIndex: "accessStatus", key: "accessStatus", width: 100 },
  { title: "访客数", dataIndex: "visitorCount", key: "visitorCount", width: 100, sorter: true },
  { title: "会话窗口打开数", dataIndex: "sessionWindowOpenCount", key: "sessionWindowOpenCount", width: 150, sorter: true },
  { title: "会话数", dataIndex: "sessionCount", key: "sessionCount", width: 100, sorter: true },
  { title: "会话独立访客数", dataIndex: "sessionIndependentVisitorCount", key: "sessionIndependentVisitorCount", width: 150, sorter: true },
  { title: "接入时间", dataIndex: "accessTime", key: "accessTime", width: 120 },
  { title: "最近访客消息时间", key: "lastVisitorMessageTime", width: 150 },
];

const displayData = computed(() => {
  const start = (pagination.value.current - 1) * pagination.value.pageSize;
  const end = start + pagination.value.pageSize;
  return domainsData.slice(start, end);
});

function handleSearch() {
  pagination.value.current = 1;
}

function handleReset() {
  filters.value = {
    domain: "",
    projectId: "",
    projectName: "",
    accessStatus: "",
    language: "",
    accessTime: null,
  };
  pagination.value.current = 1;
}

function handleTableChange(pag: any) {
  pagination.value.current = pag.current;
  pagination.value.pageSize = pag.pageSize;
}

onMounted(() => {
  const projectId = route.query.projectId;
  if (projectId) {
    filters.value.projectId = String(projectId);
  }
});
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

:deep(.ant-table-thead > tr > th) {
  white-space: nowrap;
}

.text-ellipsis {
  max-width: 12em;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>

