<template>
  <div class="page-container">
    <!-- 筛选区域 -->
    <div class="filter-bar">
      <div class="filter-row">
        <span class="filter-label">ID：</span>
        <a-input v-model:value="filters.id" placeholder="请输入" style="width: 150px" />

        <span class="filter-label">姓名：</span>
        <a-input v-model:value="filters.name" placeholder="请输入" style="width: 150px" />

        <span class="filter-label">项目名称：</span>
        <a-input v-model:value="filters.projectName" placeholder="请输入" style="width: 150px" />

        <span class="filter-label">项目ID：</span>
        <a-input v-model:value="filters.projectId" placeholder="请输入" style="width: 150px" />

        <span class="filter-label">昵称：</span>
        <a-input v-model:value="filters.nickname" placeholder="请输入" style="width: 150px" />
      </div>

      <div class="filter-row">
        <span class="filter-label">邮箱：</span>
        <a-input v-model:value="filters.email" placeholder="请输入" style="width: 200px" />

        <span class="filter-label">角色：</span>
        <a-select v-model:value="filters.role" style="width: 120px">
          <a-select-option value="">全部</a-select-option>
          <a-select-option value="客服">客服</a-select-option>
          <a-select-option value="管理员">管理员</a-select-option>
        </a-select>

        <span class="filter-label">创建时间：</span>
        <a-range-picker v-model:value="filters.createTime" :placeholder="['开始时间', '结束时间']" style="width: 240px" />

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
        @change="handleTableChange"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'email'">
            {{ record.email }}
            <EyeOutlined style="color: #1890ff; margin-left: 4px; cursor: pointer" />
          </template>
          <template v-else-if="column.key === 'status'">
            <span style="color: #ff4d4f">{{ record.status }}</span>
          </template>
          <template v-else-if="column.key === 'accountStatus'">
            <span :style="{ color: record.accountStatus === '启用' ? '#52c41a' : '' }">
              {{ record.accountStatus }}
            </span>
          </template>
        </template>
      </a-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { SearchOutlined, ReloadOutlined, EyeOutlined } from "@ant-design/icons-vue";
import { clientsData } from "../mock/clientsData";

const route = useRoute();

const filters = ref({
  id: "",
  name: "",
  projectName: "",
  projectId: "",
  nickname: "",
  email: "",
  role: "",
  createTime: null as any,
});

const pagination = ref({
  current: 1,
  pageSize: 10,
  total: clientsData.length,
  showSizeChanger: true,
  showTotal: (total: number) => `共 ${total} 条`,
});

const columns = [
  { title: "ID", dataIndex: "id", key: "id", width: 80 },
  { title: "姓名", dataIndex: "name", key: "name", width: 150 },
  { title: "项目名称", dataIndex: "projectName", key: "projectName", width: 150 },
  { title: "项目ID", dataIndex: "projectId", key: "projectId", width: 100 },
  { title: "昵称", dataIndex: "nickname", key: "nickname", width: 150 },
  { title: "邮箱", key: "email", width: 180 },
  { title: "角色", dataIndex: "role", key: "role", width: 100 },
  { title: "会话限制", dataIndex: "sessionLimit", key: "sessionLimit", width: 100 },
  { title: "状态", key: "status", width: 80 },
  { title: "账号状态", key: "accountStatus", width: 100 },
  { title: "创建时间", dataIndex: "createTime", key: "createTime", width: 180, sorter: true },
  { title: "最后访问时间", dataIndex: "lastLoginTime", key: "lastLoginTime", width: 180 },
];

const displayData = computed(() => {
  const start = (pagination.value.current - 1) * pagination.value.pageSize;
  const end = start + pagination.value.pageSize;
  return clientsData.slice(start, end);
});

function handleSearch() {
  pagination.value.current = 1;
}

function handleReset() {
  filters.value = {
    id: "",
    name: "",
    projectName: "",
    projectId: "",
    nickname: "",
    email: "",
    role: "",
    createTime: null,
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
</style>

