<template>
  <div class="page-container">
    <!-- 筛选区域 -->
    <div class="filter-bar">
      <div class="filter-row">
        <span class="filter-label">聊天标题：</span>
        <a-input v-model:value="filters.title" placeholder="请输入" style="width: 150px" />

        <span class="filter-label">项目名称：</span>
        <a-input v-model:value="filters.projectName" placeholder="请输入" style="width: 150px" />

        <span class="filter-label">项目ID：</span>
        <a-input v-model:value="filters.projectId" placeholder="请输入" style="width: 150px" />

        <span class="filter-label">类型：</span>
        <a-select v-model:value="filters.type" style="width: 120px">
          <a-select-option value="">全部</a-select-option>
          <a-select-option value="单聊">单聊</a-select-option>
          <a-select-option value="群聊">群聊</a-select-option>
        </a-select>

        <span class="filter-label">状态：</span>
        <a-select v-model:value="filters.status" style="width: 120px">
          <a-select-option value="">全部</a-select-option>
          <a-select-option value="活跃">活跃</a-select-option>
          <a-select-option value="解散">解散</a-select-option>
        </a-select>

        <span class="filter-label">分类：</span>
        <a-select v-model:value="filters.category" style="width: 120px">
          <a-select-option value="">全部</a-select-option>
          <a-select-option value="外部">外部</a-select-option>
          <a-select-option value="内部">内部</a-select-option>
        </a-select>

        <span class="filter-label">群主：</span>
        <a-input v-model:value="filters.groupOwner" placeholder="请输入" style="width: 150px" />
      </div>

      <div class="filter-row">
        <span class="filter-label">发起时间：</span>
        <a-range-picker v-model:value="filters.createTime" :placeholder="['开始时间', '结束时间']" style="width: 240px" />

        <span class="filter-label">最后更新时间：</span>
        <a-range-picker v-model:value="filters.lastUpdateTime" :placeholder="['开始时间', '结束时间']" style="width: 240px" />

        <span class="filter-label">删除状态：</span>
        <a-select v-model:value="filters.deleteStatus" style="width: 120px">
          <a-select-option value="">全部</a-select-option>
          <a-select-option value="删除">删除</a-select-option>
          <a-select-option value="正常">正常</a-select-option>
        </a-select>

        <div style="margin-left: auto; display: flex; gap: 12px">
          <a-button type="primary" @click="handleSearch">
            <template #icon><SearchOutlined /></template>
            搜索
          </a-button>
          <a-button @click="handleReset">
            <template #icon><ReloadOutlined /></template>
            重置
          </a-button>
        </div>
      </div>
    </div>

    <!-- 数据表格 -->
    <div class="section-block">
      <a-table
        :columns="columns"
        :data-source="displayData"
        :pagination="pagination"
        :scroll="{ x: 1600 }"
        @change="handleTableChange"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'title'">
            <div class="text-ellipsis">{{ record.title }}</div>
          </template>
          <template v-else-if="column.key === 'projectName'">
            <div class="text-ellipsis">{{ record.projectName }}</div>
          </template>
          <template v-else-if="column.key === 'groupOwner'">
            <div class="text-ellipsis">{{ record.groupOwner }}</div>
          </template>
          <template v-else-if="column.key === 'status'">
            <span style="color: #52c41a">{{ record.status }}</span>
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
import { chatsData } from "../mock/chatsData";

const route = useRoute();

const filters = ref({
  title: "",
  projectName: "",
  projectId: "",
  type: "",
  status: "",
  category: "",
  groupOwner: "",
  createTime: null as any,
  lastUpdateTime: null as any,
  deleteStatus: "",
});

const pagination = ref({
  current: 1,
  pageSize: 10,
  total: chatsData.length,
  showSizeChanger: true,
  showTotal: (total: number) => `共 ${total} 条`,
});

const columns = [
  { title: "聊天标题", key: "title", width: 200 },
  { title: "项目名称", key: "projectName", width: 150 },
  { title: "项目ID", dataIndex: "projectId", key: "projectId", width: 80 },
  { title: "类型", dataIndex: "type", key: "type", width: 80 },
  { title: "状态", key: "status", width: 80 },
  { title: "分类", dataIndex: "category", key: "category", width: 80 },
  { title: "消息数量", dataIndex: "messageCount", key: "messageCount", width: 100 },
  { title: "群主", key: "groupOwner", width: 150 },
  { title: "访客数量", dataIndex: "visitorCount", key: "visitorCount", width: 100 },
  { title: "客服数量", dataIndex: "clientCount", key: "clientCount", width: 100 },
  { title: "发起时间", dataIndex: "createTime", key: "createTime", width: 160, sorter: true },
  { title: "最后更新时间", dataIndex: "lastUpdateTime", key: "lastUpdateTime", width: 160, sorter: true },
  { title: "删除状态", dataIndex: "deleteStatus", key: "deleteStatus", width: 100 },
];

const displayData = computed(() => {
  const start = (pagination.value.current - 1) * pagination.value.pageSize;
  const end = start + pagination.value.pageSize;
  return chatsData.slice(start, end);
});

function handleSearch() {
  pagination.value.current = 1;
}

function handleReset() {
  filters.value = {
    title: "",
    projectName: "",
    projectId: "",
    type: "",
    status: "",
    category: "",
    groupOwner: "",
    createTime: null,
    lastUpdateTime: null,
    deleteStatus: "",
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

