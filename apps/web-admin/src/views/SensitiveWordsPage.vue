<template>
  <div class="sensitive-words-page">
    <div class="section-block">
      <div class="filter-bar">
        <div class="filter-left">
          <span class="filter-label">分类</span>
          <a-select v-model:value="categoryFilter" style="width: 160px">
            <a-select-option v-for="opt in categoryOptions" :key="opt.value" :value="opt.value">
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
        <a-button type="primary" @click="handleAdd">
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
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'category'">
            {{ categoryLabelMap[record.category as SensitiveCategory] }}
          </template>
          <template v-if="column.dataIndex === 'action'">
            <a style="margin-right: 12px" @click="handleEdit(record)">编辑</a>
            <a style="color: #ff4d4f" @click="handleDelete(record)">删除</a>
          </template>
        </template>
      </a-table>
    </div>

    <!-- 新增 / 编辑弹窗 -->
    <a-modal
      v-model:open="modalVisible"
      :title="isEdit ? '编辑敏感词' : '新增敏感词'"
      @ok="handleModalOk"
      @cancel="handleModalCancel"
    >
      <a-form :label-col="{ span: 5 }" :wrapper-col="{ span: 18 }" style="margin-top: 16px">
        <a-form-item label="敏感词">
          <a-input v-model:value="formData.word" placeholder="请输入敏感词" />
        </a-form-item>
        <a-form-item label="分类">
          <a-select v-model:value="formData.category" placeholder="请选择分类">
            <a-select-option v-for="opt in categoryOptions.slice(1)" :key="opt.value" :value="opt.value">
              {{ opt.label }}
            </a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from "vue";
import { message, Modal } from "ant-design-vue";
import { SearchOutlined, ReloadOutlined, PlusOutlined } from "@ant-design/icons-vue";
import {
  sensitiveWordsData as initialData,
  categoryOptions,
  categoryLabelMap,
  type SensitiveWordRecord,
  type SensitiveCategory,
} from "../mock/sensitiveWordsData";

/* ---- 数据源（可变） ---- */
const dataSource = ref<SensitiveWordRecord[]>([...initialData]);

/* ---- 筛选 ---- */
const categoryFilter = ref("all");

const filteredData = computed(() => {
  let data = dataSource.value;
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
  categoryFilter.value = "all";
  pagination.value.current = 1;
};

/* ---- 新增 / 编辑 ---- */
const modalVisible = ref(false);
const isEdit = ref(false);
const editingId = ref<number | null>(null);

const formData = reactive({
  word: "",
  category: "fund" as SensitiveCategory,
});

function resetForm() {
  formData.word = "";
  formData.category = "fund";
}

function handleAdd() {
  isEdit.value = false;
  editingId.value = null;
  resetForm();
  modalVisible.value = true;
}

function handleEdit(record: SensitiveWordRecord) {
  isEdit.value = true;
  editingId.value = record.id;
  formData.word = record.word;
  formData.category = record.category;
  modalVisible.value = true;
}

function handleModalOk() {
  if (!formData.word.trim()) {
    message.warning("请输入敏感词");
    return;
  }

  if (isEdit.value && editingId.value !== null) {
    const idx = dataSource.value.findIndex((r) => r.id === editingId.value);
    if (idx !== -1) {
      dataSource.value[idx] = {
        ...dataSource.value[idx],
        word: formData.word.trim(),
        category: formData.category,
      };
    }
    message.success("编辑成功");
  } else {
    const maxId = dataSource.value.reduce((m, r) => Math.max(m, r.id), 0);
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, "0");
    const ts = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
    dataSource.value.unshift({
      id: maxId + 1,
      word: formData.word.trim(),
      category: formData.category,
      creator: "傅晓康",
      createdAt: ts,
    });
    message.success("新增成功");
  }

  modalVisible.value = false;
}

function handleModalCancel() {
  modalVisible.value = false;
}

/* ---- 删除 ---- */
function handleDelete(record: SensitiveWordRecord) {
  Modal.confirm({
    title: "确认删除",
    content: `确定删除敏感词「${record.word}」吗？`,
    okText: "确定",
    cancelText: "取消",
    okButtonProps: { danger: true },
    onOk() {
      dataSource.value = dataSource.value.filter((r) => r.id !== record.id);
      message.success("删除成功");
    },
  });
}

/* ---- 表格列 ---- */
const columns = [
  { title: "敏感词", dataIndex: "word", width: 160 },
  { title: "分类", dataIndex: "category", width: 120 },
  { title: "创建人", dataIndex: "creator", width: 100 },
  { title: "创建时间", dataIndex: "createdAt", width: 180 },
  { title: "操作", dataIndex: "action", width: 140 },
];
</script>

<style scoped>
.sensitive-words-page {
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
