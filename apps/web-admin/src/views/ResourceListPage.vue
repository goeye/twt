<template>
  <div class="resource-list-page">
    <div class="section-block">
      <!-- 筛选栏 -->
      <div class="filter-bar">
        <div class="filter-left">
          <span class="filter-label">分类</span>
          <a-select
            v-model:value="filterCategory"
            placeholder="全部分类"
            allow-clear
            style="width: 160px"
          >
            <a-select-option v-for="cat in categoryOptions" :key="cat.id" :value="cat.id">
              {{ cat.icon }} {{ cat.name }}
            </a-select-option>
          </a-select>

          <span class="filter-label">标签</span>
          <a-select
            v-model:value="filterTag"
            placeholder="全部标签"
            allow-clear
            style="width: 120px"
          >
            <a-select-option value="推荐">推荐</a-select-option>
            <a-select-option value="TOP">TOP</a-select-option>
            <a-select-option value="NEW">NEW</a-select-option>
            <a-select-option value="优">优</a-select-option>
          </a-select>

          <span class="filter-label">精选</span>
          <a-select
            v-model:value="filterFeatured"
            placeholder="全部"
            allow-clear
            style="width: 100px"
          >
            <a-select-option :value="true">是</a-select-option>
            <a-select-option :value="false">否</a-select-option>
          </a-select>

          <span class="filter-label">关键词</span>
          <a-input
            v-model:value="filterKeyword"
            placeholder="搜索名称/描述"
            allow-clear
            style="width: 180px"
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

      <div style="margin-bottom: 16px">
        <a-button type="primary" @click="handleAdd">
          <template #icon><PlusOutlined /></template>
          新增资源
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
          <template v-if="column.dataIndex === 'logo'">
            <img :src="record.logo" :alt="record.name" style="width: 32px; height: 32px; border-radius: 4px" />
          </template>
          <template v-if="column.dataIndex === 'categoryName'">
            {{ getCategoryName(record.categoryId) }}
          </template>
          <template v-if="column.dataIndex === 'tags'">
            <a-tag v-for="tag in record.tags" :key="tag" :color="tagColorMap[tag]" style="margin-right: 4px">
              {{ tag }}
            </a-tag>
            <span v-if="!record.tags.length" style="color: #bbb">-</span>
          </template>
          <template v-if="column.dataIndex === 'linkType'">
            <a-tag :color="record.link.type === 'external' ? 'blue' : 'green'">
              {{ record.link.type === "external" ? "外链" : "详情" }}
            </a-tag>
          </template>
          <template v-if="column.dataIndex === 'featured'">
            <a-tag :color="record.featured ? 'orange' : 'default'">
              {{ record.featured ? "是" : "否" }}
            </a-tag>
          </template>
          <template v-if="column.dataIndex === 'action'">
            <a style="margin-right: 12px" @click="handleEdit(record)">编辑</a>
            <a-popconfirm
              title="确定删除吗？"
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
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { message } from "ant-design-vue";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons-vue";
import {
  linkResourcesData as initialData,
  type ResourceRecord,
  type ResourceTag,
} from "../mock/linkResourcesData";
import { linkCategoriesData } from "../mock/linkCategoriesData";

const router = useRouter();
const dataSource = ref<ResourceRecord[]>([...initialData]);

const categoryOptions = linkCategoriesData;

const tagColorMap: Record<ResourceTag, string> = {
  "推荐": "orange",
  TOP: "red",
  NEW: "green",
  "优": "blue",
};

function getCategoryName(id: number) {
  return linkCategoriesData.find((c) => c.id === id)?.name ?? "-";
}

/* ---- 筛选 ---- */
const filterCategory = ref<number | undefined>(undefined);
const filterTag = ref<string | undefined>(undefined);
const filterFeatured = ref<boolean | undefined>(undefined);
const filterKeyword = ref("");

const filteredData = computed(() => {
  let list = dataSource.value;
  if (filterCategory.value != null) {
    list = list.filter((r) => r.categoryId === filterCategory.value);
  }
  if (filterTag.value) {
    list = list.filter((r) => r.tags.includes(filterTag.value as ResourceTag));
  }
  if (filterFeatured.value != null) {
    list = list.filter((r) => r.featured === filterFeatured.value);
  }
  const kw = filterKeyword.value.trim().toLowerCase();
  if (kw) {
    list = list.filter(
      (r) =>
        r.name.toLowerCase().includes(kw) ||
        r.shortDesc.toLowerCase().includes(kw)
    );
  }
  return list;
});

function handleSearch() {
  pagination.value.current = 1;
}

function handleReset() {
  filterCategory.value = undefined;
  filterTag.value = undefined;
  filterFeatured.value = undefined;
  filterKeyword.value = "";
  pagination.value.current = 1;
}

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

/* ---- 操作 ---- */
function handleAdd() {
  router.push("/links/resources/new");
}

function handleEdit(record: ResourceRecord) {
  router.push(`/links/resources/${record.id}`);
}

function handleDelete(record: ResourceRecord) {
  dataSource.value = dataSource.value.filter((r) => r.id !== record.id);
  message.success("删除成功");
}

/* ---- 表格列 ---- */
const columns = [
  { title: "Logo", dataIndex: "logo", width: 60 },
  { title: "名称", dataIndex: "name", width: 160 },
  { title: "分类", dataIndex: "categoryName", width: 100 },
  { title: "标签", dataIndex: "tags", width: 140 },
  { title: "评分", dataIndex: "rating", width: 60 },
  { title: "链接方式", dataIndex: "linkType", width: 80 },
  { title: "精选", dataIndex: "featured", width: 60 },
  { title: "更新时间", dataIndex: "updatedAt", width: 160 },
  { title: "操作", dataIndex: "action", width: 120 },
];
</script>

<style scoped>
.resource-list-page {
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
  color: #333;
  white-space: nowrap;
}
</style>
