<template>
  <div class="prompt-page">
    <div class="section-block">
      <!-- 筛选栏 -->
      <div class="filter-bar">
        <div class="filter-left">
          <span class="filter-label">场景：</span>
          <a-select v-model:value="selectedScene" style="width: 200px" @change="handleFilter">
            <a-select-option value="">全部</a-select-option>
            <a-select-option v-for="s in scenes" :key="s" :value="s">{{ s }}</a-select-option>
          </a-select>
        </div>
        <div class="filter-right">
          <a-button type="primary" @click="handleSearch">
            <template #icon><SearchOutlined /></template>
            搜索
          </a-button>
          <a-button @click="handleReset">重置</a-button>
        </div>
      </div>

      <!-- 表格 -->
      <a-table
        :columns="columns"
        :data-source="filteredData"
        :pagination="pagination"
        row-key="id"
        size="middle"
        @change="handleTableChange"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'systemPrompt'">
            <div class="text-ellipsis">{{ truncateText(record.systemPrompt, 12) }}</div>
          </template>
          <template v-if="column.dataIndex === 'userPrompt'">
            <div class="text-ellipsis">{{ truncateText(record.userPrompt, 12) }}</div>
          </template>
          <template v-if="column.dataIndex === 'action'">
            <a @click="handleEdit(record)">编辑</a>
          </template>
        </template>
      </a-table>
    </div>

    <!-- 编辑提示词弹窗 -->
    <a-modal
      v-model:open="editVisible"
      title="编辑提示词"
      width="800px"
      @ok="handleSave"
      @cancel="editVisible = false"
    >
      <div style="margin: 16px 0; display: flex; align-items: center; gap: 16px">
        <span style="color: #666; font-size: 14px">场景</span>
        <span style="color: #333; font-size: 14px">{{ editForm.scene }}</span>
      </div>

      <div style="margin: 16px 0">
        <div style="margin-bottom: 8px; color: #666; font-size: 14px">
          <span style="color: #ff4d4f; margin-right: 4px">*</span>system prompt
        </div>
        <a-textarea
          v-model:value="editForm.systemPrompt"
          :rows="12"
          placeholder="请输入 system prompt"
        />
      </div>

      <div style="margin: 16px 0">
        <div style="margin-bottom: 8px; color: #666; font-size: 14px">
          <span style="color: #ff4d4f; margin-right: 4px">*</span>user prompt
        </div>
        <a-textarea
          v-model:value="editForm.userPrompt"
          :rows="8"
          placeholder="请输入 user prompt"
        />
      </div>

      <template #footer>
        <a-button @click="editVisible = false">取消</a-button>
        <a-button type="primary" @click="handleSave">确定</a-button>
      </template>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from "vue";
import { message } from "ant-design-vue";
import { SearchOutlined } from "@ant-design/icons-vue";
import { promptData, type PromptRecord } from "../mock/promptData";

const selectedScene = ref("");
const dataSource = ref<PromptRecord[]>([...promptData]);
const editVisible = ref(false);
const editForm = reactive({
  id: 0,
  scene: "",
  systemPrompt: "",
  userPrompt: "",
});

const scenes = computed(() => {
  const set = new Set(dataSource.value.map((r) => r.scene));
  return Array.from(set);
});

const filteredData = computed(() => {
  if (!selectedScene.value) return dataSource.value;
  return dataSource.value.filter((r) => r.scene === selectedScene.value);
});

const pagination = ref({
  current: 1,
  pageSize: 10,
  total: filteredData.value.length,
  showTotal: (total: number) => `共 ${total} 条`,
  showSizeChanger: true,
  pageSizeOptions: ["10", "20", "50"],
});

function handleFilter() {
  pagination.value.current = 1;
  pagination.value.total = filteredData.value.length;
}

function handleSearch() {
  handleFilter();
}

function handleReset() {
  selectedScene.value = "";
  handleFilter();
}

function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
}

function handleTableChange(pag: any) {
  pagination.value.current = pag.current;
  pagination.value.pageSize = pag.pageSize;
}

function handleEdit(record: PromptRecord) {
  editForm.id = record.id;
  editForm.scene = record.scene;
  editForm.systemPrompt = record.systemPrompt;
  editForm.userPrompt = record.userPrompt;
  editVisible.value = true;
}

function handleSave() {
  if (!editForm.systemPrompt.trim() || !editForm.userPrompt.trim()) {
    message.warning("请填写完整信息");
    return;
  }
  const idx = dataSource.value.findIndex((r) => r.id === editForm.id);
  if (idx !== -1) {
    dataSource.value[idx] = {
      ...dataSource.value[idx],
      systemPrompt: editForm.systemPrompt,
      userPrompt: editForm.userPrompt,
      updatedAt: new Date().toISOString().split("T")[0],
    };
  }
  message.success("保存成功");
  editVisible.value = false;
}

const columns = [
  { title: "场景", dataIndex: "scene", width: 120 },
  { title: "system prompt", dataIndex: "systemPrompt", width: 300 },
  { title: "user prompt", dataIndex: "userPrompt", width: 300 },
  { title: "更新日期", dataIndex: "updatedAt", width: 120, sorter: true },
  { title: "更新人", dataIndex: "updater", width: 100 },
  { title: "操作", dataIndex: "action", width: 80 },
];
</script>

<style scoped>
.prompt-page {
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
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.filter-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-label {
  color: #666;
  font-size: 14px;
}

.filter-right {
  display: flex;
  gap: 8px;
}

.text-ellipsis {
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
