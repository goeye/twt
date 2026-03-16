<template>
  <div class="dict-detail-page">
    <div class="section-block">
      <div class="filter-bar">
        <div class="filter-left">
          <span class="filter-label">文本</span>
          <a-input
            v-model:value="searchText"
            placeholder="请输入文本"
            style="width: 240px"
            allow-clear
          />
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
        <a-button type="primary" @click="handleAdd">
          <template #icon><PlusOutlined /></template>
          添加
        </a-button>
      </div>

      <!-- 词列表 -->
      <a-table
        :columns="columns"
        :data-source="filteredData"
        :pagination="pagination"
        row-key="id"
        size="middle"
        @change="handleTableChange"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'action'">
            <a-popconfirm
              title="确定删除吗？"
              ok-text="确定"
              cancel-text="取消"
              @confirm="handleDeleteOne(record)"
            >
              <a style="color: #ff4d4f">删除</a>
            </a-popconfirm>
          </template>
        </template>
      </a-table>
    </div>

    <!-- 添加弹窗 -->
    <a-modal
      v-model:open="addModalVisible"
      title="添加词"
      @ok="handleAddOk"
      @cancel="addModalVisible = false"
    >
      <a-form :label-col="{ span: 4 }" :wrapper-col="{ span: 19 }" style="margin-top: 16px">
        <a-form-item label="词">
          <a-textarea
            v-model:value="addText"
            placeholder="批量输入，一行一个"
            :rows="6"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRoute } from "vue-router";
import { message } from "ant-design-vue";
import { SearchOutlined, ReloadOutlined, PlusOutlined } from "@ant-design/icons-vue";
import {
  dictionaryData,
  type WordRecord,
} from "../mock/sensitiveWordsData";

const route = useRoute();

/* ---- 获取当前词库 ---- */
const dictId = Number(route.params.id);
const dict = dictionaryData.find((d) => d.id === dictId);
const dataSource = ref<WordRecord[]>(dict ? [...dict.words] : []);

/* ---- 搜索 ---- */
const searchText = ref("");
const filteredData = computed(() => {
  const kw = searchText.value.trim().toLowerCase();
  if (!kw) return dataSource.value;
  return dataSource.value.filter((r) => r.text.toLowerCase().includes(kw));
});

function handleSearch() {
  pagination.value.current = 1;
}

function handleReset() {
  searchText.value = "";
  pagination.value.current = 1;
}

/* ---- 分页 ---- */
const pagination = ref({
  current: 1,
  pageSize: 10,
  showTotal: (total: number) => `共 ${total} 条数据`,
  showSizeChanger: true,
  pageSizeOptions: ["10", "20", "50"],
});

const handleTableChange = (pag: any) => {
  pagination.value.current = pag.current;
  pagination.value.pageSize = pag.pageSize;
};

/* ---- 添加 ---- */
const addModalVisible = ref(false);
const addText = ref("");

function handleAdd() {
  addText.value = "";
  addModalVisible.value = true;
}

function nowStr() {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
}

function handleAddOk() {
  const lines = addText.value.split("\n").map((l) => l.trim()).filter(Boolean);
  if (lines.length === 0) {
    message.warning("请输入至少一个词");
    return;
  }
  const ts = nowStr();
  const maxId = dataSource.value.reduce((m, r) => Math.max(m, r.id), 0);
  const newWords: WordRecord[] = lines.map((text, i) => ({
    id: maxId + 1 + i,
    text,
    createdAt: ts,
  }));
  dataSource.value.unshift(...newWords);
  // 同步到词库源数据
  if (dict) {
    dict.words = [...dataSource.value];
    dict.updatedAt = ts;
  }
  message.success("添加成功");
  addModalVisible.value = false;
}

/* ---- 删除 ---- */
function handleDeleteOne(record: WordRecord) {
  dataSource.value = dataSource.value.filter((r) => r.id !== record.id);
  if (dict) {
    dict.words = [...dataSource.value];
    dict.updatedAt = nowStr();
  }
  message.success("删除成功");
}

/* ---- 表格列 ---- */
const columns = [
  { title: "文本", dataIndex: "text" },
  { title: "创建时间", dataIndex: "createdAt", width: 180, sorter: (a: any, b: any) => a.createdAt.localeCompare(b.createdAt) },
  { title: "操作", dataIndex: "action", width: 100 },
];
</script>

<style scoped>
.dict-detail-page {
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
