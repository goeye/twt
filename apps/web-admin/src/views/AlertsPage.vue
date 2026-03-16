<template>
  <div class="alerts-page">
    <div class="section-block">
      <div class="filter-bar">
        <div class="filter-left">
          <span class="filter-label">日期范围</span>
          <a-range-picker
            v-model:value="dateRange"
            format="YYYY-MM-DD"
            :presets="rangePresets"
            :disabled-date="disabledDate"
            style="width: 280px"
          />
          <span class="filter-label">项目名称</span>
          <a-input
            v-model:value="projectNameFilter"
            placeholder="请输入项目名称"
            style="width: 160px"
            allow-clear
          />
          <span class="filter-label">项目ID</span>
          <a-input
            v-model:value="projectIdFilter"
            placeholder="请输入项目ID"
            style="width: 140px"
            allow-clear
          />
          <span class="filter-label">类型</span>
          <a-select v-model:value="typeFilter" style="width: 100px">
            <a-select-option v-for="opt in alertTypeOptions" :key="opt.value" :value="opt.value">
              {{ opt.label }}
            </a-select-option>
          </a-select>
        </div>
        <div class="filter-right">
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

      <a-table
        :columns="columns"
        :data-source="filteredData"
        :pagination="pagination"
        row-key="id"
        size="middle"
        @change="handleTableChange"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'type'">
            {{ record.type === 'session' ? '会话' : '聊天' }}
          </template>
          <template v-if="column.dataIndex === 'sender'">
            <a-tag :color="record.senderRole === 'visitor' ? 'green' : 'blue'" :bordered="false">
              {{ record.senderRole === 'visitor' ? '访客' : '客服' }}
            </a-tag>
            {{ record.sender }}
          </template>
        </template>
      </a-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { SearchOutlined, ReloadOutlined } from "@ant-design/icons-vue";
import dayjs, { type Dayjs } from "dayjs";
import {
  alertsData,
  alertTypeOptions,
  type AlertRecord,
} from "../mock/alertsData";

const today = dayjs();
const dateRange = ref<[Dayjs, Dayjs]>([today.subtract(6, "d"), today]);
const projectNameFilter = ref("");
const projectIdFilter = ref("");
const typeFilter = ref("all");

const rangePresets = ref([
  { label: "昨天", value: [today.subtract(1, "d"), today.subtract(1, "d")] as [Dayjs, Dayjs] },
  { label: "近7天", value: [today.subtract(6, "d"), today] as [Dayjs, Dayjs] },
  { label: "近30天", value: [today.subtract(29, "d"), today] as [Dayjs, Dayjs] },
  { label: "本月", value: [today.startOf("month"), today] as [Dayjs, Dayjs] },
  { label: "上月", value: [today.subtract(1, "month").startOf("month"), today.subtract(1, "month").endOf("month")] as [Dayjs, Dayjs] },
]);

const disabledDate = (current: Dayjs) => {
  return current && (current.isAfter(today, "day") || current.isBefore(today.subtract(1, "year"), "day"));
};

const filteredData = computed(() => {
  let data: AlertRecord[] = alertsData;
  if (dateRange.value && dateRange.value[0] && dateRange.value[1]) {
    const start = dateRange.value[0].startOf("day");
    const end = dateRange.value[1].endOf("day");
    data = data.filter((r) => {
      const t = dayjs(r.triggerTime);
      return t.isAfter(start) && t.isBefore(end);
    });
  }
  const pn = projectNameFilter.value.trim().toLowerCase();
  if (pn) {
    data = data.filter((r) => r.projectName.toLowerCase().includes(pn));
  }
  const pid = projectIdFilter.value.trim();
  if (pid) {
    data = data.filter((r) => String(r.projectId).includes(pid));
  }
  if (typeFilter.value !== "all") {
    data = data.filter((r) => r.type === typeFilter.value);
  }
  return data;
});

const pagination = ref({
  current: 1,
  pageSize: 20,
  showTotal: (total: number) => `共 ${total} 条`,
  showSizeChanger: true,
  showQuickJumper: true,
  pageSizeOptions: ["10", "20", "50"],
});

const handleTableChange = (pag: any) => {
  pagination.value.current = pag.current;
  pagination.value.pageSize = pag.pageSize;
};

const handleSearch = () => {
  pagination.value.current = 1;
};

const handleReset = () => {
  dateRange.value = [today.subtract(6, "d"), today];
  projectNameFilter.value = "";
  projectIdFilter.value = "";
  typeFilter.value = "all";
  pagination.value.current = 1;
};

const columns = [
  { title: "文本内容", dataIndex: "content" },
  { title: "类型", dataIndex: "type", width: 80 },
  { title: "发送人", dataIndex: "sender", width: 120 },
  { title: "会话/聊天标题", dataIndex: "sessionTitle", width: 160 },
  { title: "项目名称", dataIndex: "projectName", width: 120 },
  { title: "项目ID", dataIndex: "projectId", width: 100 },
  { title: "触发时间", dataIndex: "triggerTime", width: 180 },
];
</script>

<style scoped>
.alerts-page {
  display: flex;
  flex-direction: column;
}

.section-block {
  background: #fff;
  border-radius: 8px;
  padding: 24px;
}

.filter-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.filter-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.filter-label {
  font-size: 14px;
  color: #333;
  white-space: nowrap;
}

.filter-right {
  display: flex;
  align-items: center;
  gap: 12px;
}
</style>
