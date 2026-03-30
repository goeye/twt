<template>
  <div class="api-docs-list-page">
    <div class="section-block">
      <div class="filter-bar">
        <div class="filter-left">
          <span class="filter-label">状态</span>
          <a-select
            v-model:value="filterStatus"
            placeholder="全部状态"
            allow-clear
            style="width: 140px"
          >
            <a-select-option value="published">已发布</a-select-option>
            <a-select-option value="draft">草稿</a-select-option>
          </a-select>

          <span class="filter-label">关键词</span>
          <a-input
            v-model:value="filterKeyword"
            placeholder="搜索标题 / Slug / 侧边栏名称"
            allow-clear
            style="width: 260px"
          />
        </div>

        <div class="filter-right">
          <a-button type="primary" @click="handleSearch">
            <template #icon><SearchOutlined /></template>
            搜索
          </a-button>
          <a-button @click="handleReset">重置</a-button>
        </div>
      </div>

      <div class="page-toolbar">
        <a-button type="primary" @click="handleAdd">
          <template #icon><PlusOutlined /></template>
          新增 API 文档
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
          <template v-if="column.dataIndex === 'status'">
            <a-tag :color="record.status === 'published' ? 'green' : 'orange'">
              {{ record.status === "published" ? "已发布" : "草稿" }}
            </a-tag>
          </template>

          <template v-if="column.dataIndex === 'sectionCount'">
            {{ record.sections.length }}
          </template>

          <template v-if="column.dataIndex === 'action'">
            <a style="margin-right: 12px" @click="handleEdit(record)">编辑</a>
            <a-popconfirm
              title="确定删除这篇 API 文档吗？"
              ok-text="确定"
              cancel-text="取消"
              @confirm="handleDelete(record)"
            >
              <a style="color: #ff4d4f">删除</a>
            </a-popconfirm>
          </template>
        </template>
      </a-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { message } from "ant-design-vue";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons-vue";
import { apiDocsData, type ApiDocRecord } from "../mock/apiDocsData";

const router = useRouter();
const dataSource = ref<ApiDocRecord[]>([...apiDocsData]);

const filterStatus = ref<ApiDocRecord["status"] | undefined>(undefined);
const filterKeyword = ref("");

const filteredData = computed(() => {
  let list = dataSource.value;

  if (filterStatus.value) {
    list = list.filter((item) => item.status === filterStatus.value);
  }

  const keyword = filterKeyword.value.trim().toLowerCase();
  if (keyword) {
    list = list.filter((item) =>
      [item.title, item.slug, item.navLabel, item.summary]
        .join(" ")
        .toLowerCase()
        .includes(keyword)
    );
  }

  return list;
});

const pagination = ref({
  current: 1,
  pageSize: 10,
  showTotal: (total: number) => `共 ${total} 条`,
  showSizeChanger: true,
  showQuickJumper: true,
  pageSizeOptions: ["10", "20", "50"],
});

const columns = [
  { title: "文档标题", dataIndex: "title", width: 220 },
  { title: "Slug", dataIndex: "slug", width: 180 },
  { title: "菜单名称", dataIndex: "navLabel", width: 140 },
  { title: "文档分组", dataIndex: "groupTitle", width: 140 },
  { title: "章节数", dataIndex: "sectionCount", width: 90 },
  { title: "状态", dataIndex: "status", width: 90 },
  { title: "更新时间", dataIndex: "updatedAt", width: 180 },
  { title: "操作", dataIndex: "action", width: 120 },
];

function handleSearch() {
  pagination.value.current = 1;
}

function handleReset() {
  filterStatus.value = undefined;
  filterKeyword.value = "";
  pagination.value.current = 1;
}

function handleTableChange(pag: { current: number; pageSize: number }) {
  pagination.value.current = pag.current;
  pagination.value.pageSize = pag.pageSize;
}

function handleAdd() {
  router.push("/content/api-docs/new");
}

function handleEdit(record: ApiDocRecord) {
  router.push(`/content/api-docs/${record.id}`);
}

function handleDelete(record: ApiDocRecord) {
  const idx = apiDocsData.findIndex((item) => item.id === record.id);
  if (idx !== -1) {
    apiDocsData.splice(idx, 1);
  }

  dataSource.value = [...apiDocsData];
  message.success("删除成功");
}
</script>

<style scoped>
.api-docs-list-page {
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
  flex-wrap: wrap;
  gap: 8px;
}

.filter-left {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.filter-right {
  display: flex;
  gap: 12px;
}

.filter-label {
  font-size: 14px;
  color: #666;
}

.page-toolbar {
  margin-bottom: 16px;
}
</style>
