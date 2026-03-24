<template>
  <div class="dict-page">
    <div class="section-block">
      <div style="margin-bottom: 16px">
        <a-button type="primary" @click="handleAdd">
          <template #icon><PlusOutlined /></template>
          新增词库
        </a-button>
      </div>

      <a-table
        :columns="columns"
        :data-source="dataSource"
        :pagination="pagination"
        row-key="id"
        size="middle"
        @change="handleTableChange"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'wordCount'">
            {{ record.words.length }}
          </template>
          <template v-if="column.dataIndex === 'action'">
            <a style="margin-right: 12px" @click="handleManage(record)">管理</a>
            <a-popconfirm
              title="确定清空吗？"
              ok-text="确定"
              cancel-text="取消"
              @confirm="handleClear(record)"
            >
              <a style="color: #ff4d4f">清空</a>
            </a-popconfirm>
          </template>
        </template>
      </a-table>
    </div>

    <!-- 新增词库弹窗 -->
    <a-modal
      v-model:open="modalVisible"
      title="新增词库"
      @ok="handleModalOk"
      @cancel="modalVisible = false"
    >
      <a-form :label-col="{ span: 5 }" :wrapper-col="{ span: 18 }" style="margin-top: 16px">
        <a-form-item label="词库名称" required>
          <a-input v-model:value="formData.name" placeholder="请输入词库名称" />
        </a-form-item>
        <a-form-item label="词库">
          <a-textarea
            v-model:value="formData.words"
            placeholder="批量输入，一行一个"
            :rows="6"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { message } from "ant-design-vue";
import { PlusOutlined } from "@ant-design/icons-vue";
import {
  dictionaryData as initialData,
  type DictionaryRecord,
} from "../mock/sensitiveWordsData";

const router = useRouter();

/* ---- 数据源 ---- */
const dataSource = ref<DictionaryRecord[]>([...initialData]);

/* ---- 分页 ---- */
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

/* ---- 新增词库 ---- */
const modalVisible = ref(false);
const formData = reactive({ name: "", words: "" });

function handleAdd() {
  formData.name = "";
  formData.words = "";
  modalVisible.value = true;
}

function nowStr() {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
}

function handleModalOk() {
  if (!formData.name.trim()) {
    message.warning("请输入词库名称");
    return;
  }
  const ts = nowStr();
  const lines = formData.words
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  const maxId = dataSource.value.reduce((m, r) => Math.max(m, r.id), 0);
  const newDict: DictionaryRecord = {
    id: maxId + 1,
    name: formData.name.trim(),
    words: lines.map((text, i) => ({ id: i + 1, text, createdAt: ts })),
    creator: "傅晓康",
    createdAt: ts,
    updatedAt: ts,
  };
  dataSource.value.unshift(newDict);
  message.success("新增成功");
  modalVisible.value = false;
}

/* ---- 管理 ---- */
function handleManage(record: DictionaryRecord) {
  router.push(`/compliance/sensitive-words/${record.id}`);
}

/* ---- 清空 ---- */
function handleClear(record: DictionaryRecord) {
  const idx = dataSource.value.findIndex((r) => r.id === record.id);
  if (idx !== -1) {
    dataSource.value[idx] = { ...dataSource.value[idx], words: [], updatedAt: nowStr() };
  }
  message.success("清空成功");
}

/* ---- 表格列 ---- */
const columns = [
  { title: "词库名称", dataIndex: "name", width: 200 },
  { title: "词数量", dataIndex: "wordCount", width: 100 },
  { title: "创建人", dataIndex: "creator", width: 100 },
  { title: "创建时间", dataIndex: "createdAt", width: 180 },
  { title: "更新时间", dataIndex: "updatedAt", width: 180 },
  { title: "操作", dataIndex: "action", width: 140 },
];
</script>

<style scoped>
.dict-page {
  display: flex;
  flex-direction: column;
}

.section-block {
  background: #fff;
  border-radius: 8px;
  padding: 24px;
}
</style>
