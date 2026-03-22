<template>
  <div class="banner-page">
    <div class="section-block">
      <div style="margin-bottom: 16px">
        <a-button type="primary" @click="handleAdd">
          <template #icon><PlusOutlined /></template>
          新增 Banner
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
          <template v-if="column.dataIndex === 'imageUrl'">
            <img :src="record.imageUrl" :alt="record.altText" style="height: 40px; border-radius: 4px" />
          </template>
          <template v-if="column.dataIndex === 'status'">
            <a-tag :color="record.status === 'active' ? 'green' : 'default'">
              {{ record.status === "active" ? "启用" : "禁用" }}
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

    <!-- 新增/编辑弹窗 -->
    <a-modal
      v-model:open="modalVisible"
      :title="editingId ? '编辑 Banner' : '新增 Banner'"
      @ok="handleModalOk"
      @cancel="modalVisible = false"
    >
      <a-form :label-col="{ span: 5 }" :wrapper-col="{ span: 18 }" style="margin-top: 16px">
        <a-form-item label="标题" required>
          <a-input v-model:value="formData.altText" placeholder="请输入 Banner 标题" />
        </a-form-item>
        <a-form-item label="图片地址" required>
          <a-input v-model:value="formData.imageUrl" placeholder="请输入图片 URL" />
        </a-form-item>
        <a-form-item label="链接地址" required>
          <a-input v-model:value="formData.linkUrl" placeholder="请输入跳转链接" />
        </a-form-item>
        <a-form-item label="排序">
          <a-input-number v-model:value="formData.order" :min="1" style="width: 120px" />
        </a-form-item>
        <a-form-item label="状态">
          <a-switch v-model:checked="formData.active" checked-children="启用" un-checked-children="禁用" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { message } from "ant-design-vue";
import { PlusOutlined } from "@ant-design/icons-vue";
import { bannersData, type BannerRecord } from "../mock/bannersData";

const dataSource = ref<BannerRecord[]>([...bannersData]);

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

const modalVisible = ref(false);
const editingId = ref<number | null>(null);
const formData = reactive({
  altText: "",
  imageUrl: "",
  linkUrl: "",
  order: 1,
  active: true,
});

function nowStr() {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
}

function handleAdd() {
  editingId.value = null;
  formData.altText = "";
  formData.imageUrl = "";
  formData.linkUrl = "";
  formData.order = dataSource.value.length + 1;
  formData.active = true;
  modalVisible.value = true;
}

function handleEdit(record: BannerRecord) {
  editingId.value = record.id;
  formData.altText = record.altText;
  formData.imageUrl = record.imageUrl;
  formData.linkUrl = record.linkUrl;
  formData.order = record.order;
  formData.active = record.status === "active";
  modalVisible.value = true;
}

function handleModalOk() {
  if (!formData.altText.trim()) {
    message.warning("请输入标题");
    return;
  }
  if (!formData.imageUrl.trim()) {
    message.warning("请输入图片地址");
    return;
  }

  if (editingId.value) {
    const idx = dataSource.value.findIndex((r) => r.id === editingId.value);
    if (idx !== -1) {
      dataSource.value[idx] = {
        ...dataSource.value[idx],
        altText: formData.altText.trim(),
        imageUrl: formData.imageUrl.trim(),
        linkUrl: formData.linkUrl.trim(),
        order: formData.order,
        status: formData.active ? "active" : "inactive",
      };
    }
    message.success("编辑成功");
  } else {
    const maxId = dataSource.value.reduce((m, r) => Math.max(m, r.id), 0);
    dataSource.value.unshift({
      id: maxId + 1,
      altText: formData.altText.trim(),
      imageUrl: formData.imageUrl.trim(),
      linkUrl: formData.linkUrl.trim(),
      order: formData.order,
      status: formData.active ? "active" : "inactive",
      createdAt: nowStr(),
    });
    message.success("新增成功");
  }
  modalVisible.value = false;
}

function handleDelete(record: BannerRecord) {
  dataSource.value = dataSource.value.filter((r) => r.id !== record.id);
  message.success("删除成功");
}

const columns = [
  { title: "缩略图", dataIndex: "imageUrl", width: 100 },
  { title: "标题", dataIndex: "altText", width: 200 },
  { title: "链接地址", dataIndex: "linkUrl", ellipsis: true },
  { title: "排序", dataIndex: "order", width: 80 },
  { title: "状态", dataIndex: "status", width: 80 },
  { title: "创建时间", dataIndex: "createdAt", width: 180 },
  { title: "操作", dataIndex: "action", width: 120 },
];
</script>

<style scoped>
.banner-page {
  display: flex;
  flex-direction: column;
}

.section-block {
  background: #fff;
  border-radius: 8px;
  padding: 24px;
}
</style>
