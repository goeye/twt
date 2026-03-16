<template>
  <div class="alerts-page">
    <div class="section-block">
      <div class="section-header">
        <h3 class="section-heading" style="margin-bottom: 0">预警提示</h3>
        <div class="section-filters">
          <a-range-picker
            v-model:value="dateRange"
            format="YYYY-MM-DD"
            :presets="rangePresets"
            :disabled-date="disabledDate"
            style="width: 280px"
          />
          <a-select v-model:value="categoryFilter" style="width: 140px">
            <a-select-option v-for="opt in alertCategoryOptions" :key="opt.value" :value="opt.value">
              {{ opt.label }}
            </a-select-option>
          </a-select>
          <a-button type="primary" @click="handleSearch">搜索</a-button>
          <a-button @click="handleReset">重置</a-button>
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
          <template v-if="column.dataIndex === 'category'">
            <a-tag :color="alertCategoryColorMap[record.category as AlertCategory]">
              {{ alertCategoryLabelMap[record.category as AlertCategory] }}
            </a-tag>
          </template>
        </template>
      </a-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import dayjs, { type Dayjs } from "dayjs";
import {
  alertsData,
  alertCategoryOptions,
  alertCategoryLabelMap,
  alertCategoryColorMap,
  type AlertRecord,
  type AlertCategory,
} from "../mock/alertsData";

const today = dayjs();
const dateRange = ref<[Dayjs, Dayjs]>([today.subtract(6, "d"), today]);
const categoryFilter = ref("all");

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
  if (categoryFilter.value !== "all") {
    data = data.filter((r) => r.category === categoryFilter.value);
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
  categoryFilter.value = "all";
  pagination.value.current = 1;
};

const columns = [
  { title: "会话ID", dataIndex: "sessionId", width: 150 },
  { title: "访客", dataIndex: "visitor", width: 120 },
  { title: "触发规则", dataIndex: "triggerRule", width: 160 },
  { title: "风控分类", dataIndex: "category", width: 120 },
  { title: "触发时间", dataIndex: "triggerTime", width: 180 },
  { title: "预警内容", dataIndex: "alertContent" },
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

.section-heading {
  font-size: 16px;
  font-weight: 600;
  color: #222;
  margin-bottom: 16px;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.section-filters {
  display: flex;
  align-items: center;
  gap: 12px;
}
</style>
