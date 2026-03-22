<template>
  <div class="category-page">
    <div class="section-block">
      <div style="margin-bottom: 16px">
        <a-button type="primary" @click="handleAdd">
          <template #icon><PlusOutlined /></template>
          新增分类
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
          <template v-if="column.dataIndex === 'icon'">
            <span style="font-size: 20px">{{ record.icon }}</span>
          </template>
          <template v-if="column.dataIndex === 'subCount'">
            {{ record.subCategories.length }}
          </template>
          <template v-if="column.dataIndex === 'action'">
            <a style="margin-right: 12px" @click="handleEdit(record)">编辑</a>
            <a style="margin-right: 12px" @click="handleManageSubs(record)">子分类</a>
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

    <!-- 新增/编辑分类弹窗 -->
    <a-modal
      v-model:open="modalVisible"
      :title="editingId ? '编辑分类' : '新增分类'"
      @ok="handleModalOk"
      @cancel="modalVisible = false"
    >
      <a-form :label-col="{ span: 5 }" :wrapper-col="{ span: 18 }" style="margin-top: 16px">
        <a-form-item label="分类名称" required>
          <a-input v-model:value="formData.name" placeholder="请输入分类名称" />
        </a-form-item>
        <a-form-item label="图标">
          <a-input v-model:value="formData.icon" placeholder="请输入 emoji 图标" />
        </a-form-item>
        <a-form-item label="Slug" required>
          <a-input v-model:value="formData.slug" placeholder="URL 标识，如 network" />
        </a-form-item>
        <a-form-item label="排序">
          <a-input-number v-model:value="formData.order" :min="1" style="width: 120px" />
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 子分类管理弹窗 -->
    <a-modal
      v-model:open="subModalVisible"
      :title="`管理子分类 - ${subModalCatName}`"
      :footer="null"
      width="600px"
    >
      <div style="margin-bottom: 12px; display: flex; gap: 8px">
        <a-input
          v-model:value="newSubName"
          placeholder="输入子分类名称"
          style="flex: 1"
          @pressEnter="handleAddSub"
        />
        <a-button type="primary" @click="handleAddSub">添加</a-button>
      </div>
      <a-table
        :columns="subColumns"
        :data-source="subDataSource"
        :pagination="false"
        row-key="id"
        size="small"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'action'">
            <a-popconfirm
              title="确定删除吗？"
              ok-text="确定"
              cancel-text="取消"
              @confirm="handleDeleteSub(record.id)"
            >
              <a style="color: #ff4d4f">删除</a>
            </a-popconfirm>
          </template>
        </template>
      </a-table>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { message } from "ant-design-vue";
import { PlusOutlined } from "@ant-design/icons-vue";
import {
  linkCategoriesData as initialData,
  type CategoryRecord,
  type SubCategoryRecord,
} from "../mock/linkCategoriesData";

const dataSource = ref<CategoryRecord[]>([...initialData]);

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

/* ---- 分类 CRUD ---- */
const modalVisible = ref(false);
const editingId = ref<number | null>(null);
const formData = reactive({ name: "", icon: "", slug: "", order: 1 });

function nowStr() {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
}

function handleAdd() {
  editingId.value = null;
  formData.name = "";
  formData.icon = "";
  formData.slug = "";
  formData.order = dataSource.value.length + 1;
  modalVisible.value = true;
}

function handleEdit(record: CategoryRecord) {
  editingId.value = record.id;
  formData.name = record.name;
  formData.icon = record.icon;
  formData.slug = record.slug;
  formData.order = record.order;
  modalVisible.value = true;
}

function handleModalOk() {
  if (!formData.name.trim()) {
    message.warning("请输入分类名称");
    return;
  }
  if (!formData.slug.trim()) {
    message.warning("请输入 Slug");
    return;
  }

  if (editingId.value) {
    const idx = dataSource.value.findIndex((r) => r.id === editingId.value);
    if (idx !== -1) {
      dataSource.value[idx] = {
        ...dataSource.value[idx],
        name: formData.name.trim(),
        icon: formData.icon.trim(),
        slug: formData.slug.trim(),
        order: formData.order,
      };
    }
    message.success("编辑成功");
  } else {
    const maxId = dataSource.value.reduce((m, r) => Math.max(m, r.id), 0);
    dataSource.value.unshift({
      id: maxId + 1,
      name: formData.name.trim(),
      icon: formData.icon.trim(),
      slug: formData.slug.trim(),
      order: formData.order,
      subCategories: [],
      createdAt: nowStr(),
    });
    message.success("新增成功");
  }
  modalVisible.value = false;
}

function handleDelete(record: CategoryRecord) {
  dataSource.value = dataSource.value.filter((r) => r.id !== record.id);
  message.success("删除成功");
}

/* ---- 子分类管理 ---- */
const subModalVisible = ref(false);
const subModalCatName = ref("");
const subDataSource = ref<SubCategoryRecord[]>([]);
const newSubName = ref("");
let currentCatId = 0;

function handleManageSubs(record: CategoryRecord) {
  currentCatId = record.id;
  subModalCatName.value = record.name;
  subDataSource.value = [...record.subCategories];
  newSubName.value = "";
  subModalVisible.value = true;
}

function handleAddSub() {
  if (!newSubName.value.trim()) {
    message.warning("请输入子分类名称");
    return;
  }
  const maxId = subDataSource.value.reduce((m, r) => Math.max(m, r.id), 0);
  subDataSource.value.push({ id: maxId + 1, name: newSubName.value.trim() });
  syncSubsBack();
  newSubName.value = "";
  message.success("新增成功");
}

function handleDeleteSub(id: number) {
  subDataSource.value = subDataSource.value.filter((r) => r.id !== id);
  syncSubsBack();
  message.success("删除成功");
}

function syncSubsBack() {
  const cat = dataSource.value.find((c) => c.id === currentCatId);
  if (cat) {
    cat.subCategories = [...subDataSource.value];
  }
}

/* ---- 表格列 ---- */
const columns = [
  { title: "图标", dataIndex: "icon", width: 60 },
  { title: "分类名称", dataIndex: "name", width: 160 },
  { title: "Slug", dataIndex: "slug", width: 160 },
  { title: "子分类数", dataIndex: "subCount", width: 100 },
  { title: "排序", dataIndex: "order", width: 80 },
  { title: "创建时间", dataIndex: "createdAt", width: 180 },
  { title: "操作", dataIndex: "action", width: 180 },
];

const subColumns = [
  { title: "ID", dataIndex: "id", width: 60 },
  { title: "名称", dataIndex: "name" },
  { title: "操作", dataIndex: "action", width: 80 },
];
</script>

<style scoped>
.category-page {
  display: flex;
  flex-direction: column;
}

.section-block {
  background: #fff;
  border-radius: 8px;
  padding: 24px;
}
</style>
