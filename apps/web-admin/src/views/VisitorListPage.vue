<template>
  <div class="page-container">
    <!-- 筛选区域 -->
    <div class="filter-bar">
      <div class="filter-row">
        <span class="filter-label">姓名：</span>
        <a-input v-model:value="filters.name" placeholder="请输入" style="width: 150px" />

        <span class="filter-label">邮箱：</span>
        <a-input v-model:value="filters.email" placeholder="请输入" style="width: 150px" />

        <span class="filter-label">客户标识：</span>
        <a-select v-model:value="filters.customerLabel" style="width: 120px">
          <a-select-option value="">无标识</a-select-option>
          <a-select-option value="有标识">有标识</a-select-option>
        </a-select>

        <span class="filter-label">电话：</span>
        <a-input v-model:value="filters.phone" placeholder="请输入" style="width: 150px" />

        <span class="filter-label">来源渠道：</span>
        <a-select v-model:value="filters.sourceChannel" style="width: 120px">
          <a-select-option value="">全部</a-select-option>
          <a-select-option value="web">web</a-select-option>
          <a-select-option value="网页插件">网页插件</a-select-option>
          <a-select-option value="Email">Email</a-select-option>
        </a-select>
      </div>

      <div class="filter-row">
        <span class="filter-label">首次访问：</span>
        <a-range-picker v-model:value="filters.firstVisit" :placeholder="['开始时间', '结束时间']" style="width: 240px" />

        <span class="filter-label">最后访问：</span>
        <a-range-picker v-model:value="filters.lastVisit" :placeholder="['开始时间', '结束时间']" style="width: 240px" />

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
          <template v-if="column.key === 'customerLabel'">
            {{ record.customerLabel || '-' }}
          </template>
          <template v-else-if="column.key === 'email'">
            {{ record.email || '-' }}
          </template>
          <template v-else-if="column.key === 'phone'">
            {{ record.phone || '-' }}
          </template>
          <template v-else-if="column.key === 'sourceUrl'">
            <a :href="record.sourceUrl" target="_blank" style="color: #1890ff">{{ record.sourceUrl }}</a>
          </template>
          <template v-else-if="column.key === 'action'">
            <a style="color: #1890ff" @click="showDetail(record)">详情</a>
          </template>
        </template>
      </a-table>
    </div>

    <!-- 详情弹窗 -->
    <a-modal
      v-model:open="detailVisible"
      title="访客详情"
      :footer="null"
      width="600px"
    >
      <a-collapse v-model:activeKey="activeKeys" :bordered="false" ghost>
        <a-collapse-panel key="basic" header="基础信息">
          <div class="detail-row">
            <span class="detail-label">姓名</span>
            <span class="detail-value">{{ currentVisitor?.name }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">客户标识</span>
            <span class="detail-value">{{ currentVisitor?.customerLabel || '-' }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">电话</span>
            <span class="detail-value">{{ currentVisitor?.phone || '-' }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">邮箱</span>
            <span class="detail-value">{{ currentVisitor?.email || '-' }}</span>
          </div>
        </a-collapse-panel>

        <a-collapse-panel key="additional" header="附加信息">
          <div class="detail-row">
            <span class="detail-label">起始页面</span>
            <a :href="currentVisitor?.sourceUrl" target="_blank" style="color: #1890ff">{{ currentVisitor?.sourceUrl }}</a>
          </div>
          <div class="detail-row">
            <span class="detail-label">来源渠道</span>
            <span class="detail-value">{{ currentVisitor?.sourceChannel }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">会话总数</span>
            <span class="detail-value">{{ currentVisitor?.sessionCount }} 个会话</span>
          </div>
        </a-collapse-panel>

        <a-collapse-panel key="track" header="访问轨迹">
          <div v-for="(track, index) in currentVisitor?.tracks" :key="index" class="track-item">
            <div style="display: flex; align-items: center; gap: 8px">
              <span :style="{ width: '8px', height: '8px', borderRadius: '50%', background: track.online ? '#52c41a' : '#d9d9d9' }"></span>
              <div style="flex: 1">
                <div style="font-weight: 500; color: #222">{{ track.title }}</div>
                <a :href="track.url" target="_blank" style="color: #1890ff; font-size: 12px">{{ track.url }}</a>
              </div>
            </div>
            <div style="color: #999; font-size: 12px; margin-top: 4px">{{ track.time }} · {{ track.duration }}</div>
          </div>
          <a style="color: #1890ff; font-size: 14px; margin-top: 12px; display: inline-block">查看更多</a>
        </a-collapse-panel>

        <a-collapse-panel key="device" header="设备信息">
          <div class="detail-row">
            <span class="detail-label">IP 地址</span>
            <span class="detail-value">{{ currentVisitor?.ip }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">操作系统</span>
            <span class="detail-value">{{ currentVisitor?.os }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">浏览器</span>
            <span class="detail-value">{{ currentVisitor?.browser }}</span>
          </div>
        </a-collapse-panel>
      </a-collapse>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { SearchOutlined, ReloadOutlined } from "@ant-design/icons-vue";
import { visitorsData } from "../mock/visitorsData";

const route = useRoute();

const detailVisible = ref(false);
const currentVisitor = ref<any>(null);
const activeKeys = ref(['basic', 'additional', 'track', 'device']);

const filters = ref({
  name: "",
  email: "",
  customerLabel: "",
  phone: "",
  sourceChannel: "",
  firstVisit: null as any,
  lastVisit: null as any,
});

const pagination = ref({
  current: 1,
  pageSize: 10,
  total: visitorsData.length,
  showSizeChanger: true,
  showTotal: (total: number) => `共 ${total} 条`,
});

const columns = [
  { title: "姓名", dataIndex: "name", key: "name", width: 120 },
  { title: "客户标识", key: "customerLabel", width: 120 },
  { title: "邮箱", key: "email", width: 180 },
  { title: "电话", key: "phone", width: 120 },
  { title: "来源渠道", dataIndex: "sourceChannel", key: "sourceChannel", width: 100 },
  { title: "首次访问", dataIndex: "firstVisit", key: "firstVisit", width: 160, sorter: true },
  { title: "最后访问", dataIndex: "lastVisit", key: "lastVisit", width: 160, sorter: true },
  { title: "访问轨迹数", dataIndex: "trackCount", key: "trackCount", width: 100 },
  { title: "来源url", key: "sourceUrl", width: 200 },
  { title: "操作", key: "action", width: 80, fixed: "right" },
];

const displayData = computed(() => {
  let data = visitorsData;
  const type = route.query.type;

  if (type === 'visitor') {
    data = data.filter(v => !v.customerLabel);
  } else if (type === 'customer') {
    data = data.filter(v => v.customerLabel);
  }

  const start = (pagination.value.current - 1) * pagination.value.pageSize;
  const end = start + pagination.value.pageSize;
  return data.slice(start, end);
});

function handleSearch() {
  pagination.value.current = 1;
}

function handleReset() {
  filters.value = {
    name: "",
    email: "",
    customerLabel: "",
    phone: "",
    sourceChannel: "",
    firstVisit: null,
    lastVisit: null,
  };
  pagination.value.current = 1;
}

function handleTableChange(pag: any) {
  pagination.value.current = pag.current;
  pagination.value.pageSize = pag.pageSize;
}

function showDetail(record: any) {
  currentVisitor.value = record;
  detailVisible.value = true;
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
  margin-bottom: 16px;
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

.detail-row {
  display: flex;
  padding: 8px 0;
}

.detail-label {
  width: 100px;
  color: #75869c;
  font-size: 14px;
}

.detail-value {
  flex: 1;
  color: #222;
  font-size: 14px;
}

.track-item {
  padding: 12px 0;
}

:deep(.ant-collapse) {
  background: transparent;
}

:deep(.ant-collapse-item) {
  border-bottom: none !important;
}

:deep(.ant-collapse-header) {
  font-weight: 500;
  color: #222;
  padding: 12px 0 !important;
}

:deep(.ant-collapse-content) {
  background: transparent;
  border-top: none;
}

:deep(.ant-collapse-content-box) {
  padding: 0 0 12px 0;
}
</style>
