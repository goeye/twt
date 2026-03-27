<template>
  <div class="page-container">
    <!-- 筛选区域 -->
    <div class="filter-bar">
      <div class="filter-row">
        <span class="filter-label">会话标题：</span>
        <a-input v-model:value="filters.title" placeholder="请输入" style="width: 150px" />

        <span class="filter-label">访客：</span>
        <a-input v-model:value="filters.visitor" placeholder="请输入" style="width: 150px" />

        <span class="filter-label">访客备注名：</span>
        <a-input v-model:value="filters.visitorRemark" placeholder="请输入" style="width: 150px" />

        <span class="filter-label">客户标识：</span>
        <a-input v-model:value="filters.customerLabel" placeholder="请输入" style="width: 150px" />

        <span class="filter-label">项目名称：</span>
        <a-input v-model:value="filters.projectName" placeholder="请输入" style="width: 150px" />
      </div>

      <div class="filter-row">
        <span class="filter-label">项目ID：</span>
        <a-input v-model:value="filters.projectId" placeholder="请输入" style="width: 150px" />

        <span class="filter-label">状态：</span>
        <a-select v-model:value="filters.status" style="width: 120px">
          <a-select-option value="">全部</a-select-option>
          <a-select-option value="待回复">待回复</a-select-option>
          <a-select-option value="排队中">排队中</a-select-option>
          <a-select-option value="待处理">待处理</a-select-option>
          <a-select-option value="已回复">已回复</a-select-option>
          <a-select-option value="已结束">已结束</a-select-option>
        </a-select>

        <span class="filter-label">会话负责人：</span>
        <a-input v-model:value="filters.assignedStaff" placeholder="请输入" style="width: 150px" />

        <span class="filter-label">发起时间：</span>
        <a-range-picker v-model:value="filters.createTime" :placeholder="['开始时间', '结束时间']" style="width: 240px" />

        <span class="filter-label">访客评价：</span>
        <a-select v-model:value="filters.visitorRating" style="width: 120px">
          <a-select-option value="">全部</a-select-option>
          <a-select-option value="满意">满意</a-select-option>
          <a-select-option value="一般">一般</a-select-option>
          <a-select-option value="不满意">不满意</a-select-option>
        </a-select>
      </div>

      <div class="filter-row">
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
        :scroll="{ x: 1800 }"
        @change="handleTableChange"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'projectName'">
            <div class="text-ellipsis">{{ record.projectName }}</div>
          </template>
          <template v-else-if="column.key === 'assignedStaff'">
            <div class="text-ellipsis">{{ record.assignedStaff }}</div>
          </template>
          <template v-else-if="column.key === 'status'">
            <span :style="{ color: record.status === '已回复' ? '#52c41a' : record.status === '待回复' ? '#ff4d4f' : '' }">
              {{ record.status }}
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
import { SearchOutlined, ReloadOutlined } from "@ant-design/icons-vue";
import { sessionsData } from "../mock/sessionsData";

const route = useRoute();

const filters = ref({
  title: "",
  visitor: "",
  visitorRemark: "",
  customerLabel: "",
  projectName: "",
  projectId: "",
  status: "",
  assignedStaff: "",
  createTime: null as any,
  visitorRating: "",
  deleteStatus: "",
});

const pagination = ref({
  current: 1,
  pageSize: 10,
  total: sessionsData.length,
  showSizeChanger: true,
  showTotal: (total: number) => `共 ${total} 条`,
});

const columns = [
  { title: "会话ID", dataIndex: "id", key: "id", width: 80 },
  { title: "项目名称", dataIndex: "projectName", key: "projectName", width: 150 },
  { title: "项目ID", dataIndex: "projectId", key: "projectId", width: 80 },
  { title: "访客", dataIndex: "visitorName", key: "visitorName", width: 100 },
  { title: "客户标识", dataIndex: "customerLabel", key: "customerLabel", width: 100 },
  { title: "访客备注", dataIndex: "visitorRemark", key: "visitorRemark", width: 100 },
  { title: "状态", key: "status", width: 80 },
  { title: "消息数", dataIndex: "messageCount", key: "messageCount", width: 80 },
  { title: "负责人", dataIndex: "assignedStaff", key: "assignedStaff", width: 120 },
  { title: "客服数", dataIndex: "clientCount", key: "clientCount", width: 80 },
  { title: "标签", dataIndex: "tags", key: "tags", width: 80 },
  { title: "发起时间", dataIndex: "createTime", key: "createTime", width: 150, sorter: true },
  { title: "接待时间", dataIndex: "acceptTime", key: "acceptTime", width: 150, sorter: true },
  { title: "服务时长", dataIndex: "serviceDuration", key: "serviceDuration", width: 100 },
  { title: "访客评价", dataIndex: "visitorRating", key: "visitorRating", width: 80 },
  { title: "删除状态", dataIndex: "deleteStatus", key: "deleteStatus", width: 80 },
];

const displayData = computed(() => {
  const start = (pagination.value.current - 1) * pagination.value.pageSize;
  const end = start + pagination.value.pageSize;
  return sessionsData.slice(start, end);
});

function handleSearch() {
  pagination.value.current = 1;
}

function handleReset() {
  filters.value = {
    title: "",
    visitor: "",
    visitorRemark: "",
    customerLabel: "",
    projectName: "",
    projectId: "",
    status: "",
    assignedStaff: "",
    createTime: null,
    visitorRating: "",
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

