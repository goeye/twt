<template>
  <div class="agreements-page">
    <div class="section-block">
      <div class="filter-bar">
        <div class="filter-left">
          <span class="filter-label">协议语言</span>
          <a-select v-model:value="langFilter" style="width: 180px">
            <a-select-option v-for="opt in languageOptions" :key="opt.value" :value="opt.value">
              {{ opt.label }}
            </a-select-option>
          </a-select>
          <span class="filter-label">协议类型</span>
          <a-select v-model:value="typeFilter" style="width: 140px">
            <a-select-option v-for="opt in typeOptions" :key="opt.value" :value="opt.value">
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

      <div style="margin-bottom: 16px">
        <a-button type="primary" @click="() => {}">
          <template #icon><PlusOutlined /></template>
          新增
        </a-button>
      </div>

      <a-table
        :columns="columns"
        :data-source="filteredData"
        :pagination="pagination"
        row-key="id"
        size="middle"
        @change="handleTableChange"
      >
        <template #bodyCell="{ column }">
          <template v-if="column.dataIndex === 'action'">
            <a>修改</a>
          </template>
        </template>
      </a-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { SearchOutlined, ReloadOutlined, PlusOutlined } from "@ant-design/icons-vue";
import {
  agreementsData,
  languageOptions,
  typeOptions,
  type AgreementRecord,
} from "../mock/agreementsData";

const langFilter = ref("zh-CN");
const typeFilter = ref("all");

const filteredData = computed(() => {
  let data: AgreementRecord[] = agreementsData;
  const langLabel = languageOptions.find((o) => o.value === langFilter.value)?.label;
  if (langLabel) {
    data = data.filter((r) => r.language === langLabel);
  }
  if (typeFilter.value !== "all") {
    const typeLabel = typeOptions.find((o) => o.value === typeFilter.value)?.label;
    if (typeLabel) {
      data = data.filter((r) => r.type === typeLabel);
    }
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
  langFilter.value = "zh-CN";
  typeFilter.value = "all";
  pagination.value.current = 1;
};

const columns = [
  { title: "类型", dataIndex: "type", width: 140 },
  { title: "语言", dataIndex: "language", width: 120 },
  { title: "创建人", dataIndex: "creator", width: 100 },
  { title: "创建时间", dataIndex: "createdAt", width: 180 },
  { title: "操作", dataIndex: "action", width: 80 },
];
</script>

<style scoped>
.agreements-page {
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
