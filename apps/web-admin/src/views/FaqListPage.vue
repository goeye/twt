<template>
  <div class="faq-list-page">
    <div class="section-block">
      <!-- 筛选栏 -->
      <div class="filter-bar">
        <div class="filter-left">
          <span class="filter-label">语言环境</span>
          <a-select v-model:value="filterLang" style="width: 160px">
            <a-select-option value="zh-CN">简体中文</a-select-option>
            <a-select-option value="zh-TW">繁体中文</a-select-option>
            <a-select-option value="en-US">English</a-select-option>
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
          <template v-if="column.dataIndex === 'content'">
            <div class="content-cell" v-html="record.content"></div>
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

    <!-- 编辑弹窗 -->
    <a-modal
      v-model:open="modalVisible"
      title="修改"
      width="700px"
      :footer="null"
      @cancel="handleModalCancel"
    >
      <div class="modal-form">
        <div class="form-row">
          <label class="form-label required">语言</label>
          <a-select v-model:value="formData.lang" style="width: 100%">
            <a-select-option value="zh-CN">简体中文</a-select-option>
            <a-select-option value="zh-TW">繁体中文</a-select-option>
            <a-select-option value="en-US">English</a-select-option>
          </a-select>
        </div>
        <div class="form-row">
          <label class="form-label required">问题位置</label>
          <a-select v-model:value="formData.position" style="width: 100%">
            <a-select-option value="官网常见问题">官网常见问题</a-select-option>
            <a-select-option value="客服端常见问题">客服端常见问题</a-select-option>
          </a-select>
        </div>
        <div class="form-row">
          <label class="form-label required">标题</label>
          <a-input v-model:value="formData.title" placeholder="请输入标题" />
        </div>
        <div class="form-row">
          <label class="form-label required">内容</label>
          <a-textarea
            v-model:value="formData.content"
            placeholder="请输入内容，支持 HTML"
            :rows="6"
          />
        </div>
        <div class="form-row">
          <label class="form-label required">排序值</label>
          <div class="number-input">
            <button class="number-btn" @click="formData.sortOrder = Math.max(0, formData.sortOrder - 1)">−</button>
            <input v-model.number="formData.sortOrder" type="number" class="number-value" />
            <button class="number-btn" @click="formData.sortOrder++">+</button>
          </div>
        </div>
        <div class="modal-footer">
          <a-button @click="handleModalCancel">取消</a-button>
          <a-button type="primary" @click="handleModalOk">确定</a-button>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { message } from "ant-design-vue";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons-vue";

interface FaqRecord {
  id: number;
  title: string;
  content: string;
  lang: string;
  position: string;
  sortOrder: number;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
}

const mockData: FaqRecord[] = [
  {
    id: 1,
    title: "管理员是什么",
    content: "管理员是客服团队工作的最高角色。负责管理团队成员、监控数据、接待客户咨询。<a>aaa</a>",
    lang: "zh-CN",
    position: "官网常见问题",
    sortOrder: 90,
    createdAt: "2026-01-16 15:06:50",
    createdBy: "傅晓康",
    updatedAt: "2026-02-27 14:45:33",
  },
  {
    id: 2,
    title: "控制台和客服工作台区别",
    content: "控制台专注于全局管理（设置管理员、订阅）、客服工作台则负责客服业务执行（访客接待、团队协作管理）、普通客服仅能访问工作台。无法访问控制台。无主管、客服工作台与控制台。请注意：客服工作台与控制台是两个相对独立的系统",
    lang: "zh-CN",
    position: "官网常见问题",
    sortOrder: 80,
    createdAt: "2026-01-16 15:07:15",
    createdBy: "傅晓康",
    updatedAt: "2026-01-16 15:18:49",
  },
  {
    id: 3,
    title: "席位说明",
    content: "试用期内不限制座席数成员数。你可以从由出场选择功能。试用期结束后，坐席数将自动调整为1个。如需增加坐席数。坐席数将自动调整为1个。如需更多坐席数",
    lang: "zh-CN",
    position: "客服端常见问题",
    sortOrder: 70,
    createdAt: "2026-01-16 15:07:32",
    createdBy: "傅晓康",
    updatedAt: "2026-01-16 15:07:32",
  },
  {
    id: 4,
    title: "如何邀请团队成员",
    content: "管理员负责客服工作。在「团队」菜单下点「邀请成员」并输入邮箱地址发送邀请即可。受邀人通过邮件接收邀请。请确保常常余额充足。如需管理坐席元素。如需管理坐席元素",
    lang: "zh-CN",
    position: "客服端常见问题",
    sortOrder: 60,
    createdAt: "2026-01-16 15:07:49",
    createdBy: "傅晓康",
    updatedAt: "2026-01-16 15:07:49",
  },
  {
    id: 5,
    title: "如何安装聊天小部件",
    content: "前往客服工作台。复制「网站代码」并粘贴到你的网页底部</body>标签前。即可在网站右下角显示聊天小部件。",
    lang: "zh-CN",
    position: "官网常见问题",
    sortOrder: 50,
    createdAt: "2026-01-16 15:09:31",
    createdBy: "傅晓康",
    updatedAt: "2026-01-16 15:20:59",
  },
];

const dataSource = ref<FaqRecord[]>([...mockData]);
const filterLang = ref("zh-CN");

const filteredData = computed(() => {
  return dataSource.value.filter((item) => item.lang === filterLang.value);
});

const pagination = ref({
  current: 1,
  pageSize: 20,
  showTotal: (total: number) => `共 ${total} 条`,
  showSizeChanger: true,
  showQuickJumper: true,
  pageSizeOptions: ["10", "20", "50"],
});

const columns = [
  { title: "问题位置", dataIndex: "position", width: 140 },
  { title: "标题", dataIndex: "title", width: 200 },
  { title: "内容", dataIndex: "content", width: 400 },
  { title: "语言", dataIndex: "lang", width: 100 },
  { title: "排序值", dataIndex: "sortOrder", width: 80 },
  { title: "创建日期", dataIndex: "createdAt", width: 160 },
  { title: "创建人", dataIndex: "createdBy", width: 100 },
  { title: "更新时间", dataIndex: "updatedAt", width: 160 },
  { title: "操作", dataIndex: "action", width: 120, fixed: "right" },
];

const modalVisible = ref(false);
const modalTitle = ref("新增");
const formData = ref({
  id: 0,
  title: "",
  content: "",
  lang: "zh-CN",
  position: "官网常见问题",
  sortOrder: 0,
});

function handleSearch() {
  pagination.value.current = 1;
}

function handleReset() {
  filterLang.value = "zh-CN";
  pagination.value.current = 1;
}

function handleTableChange(pag: any) {
  pagination.value.current = pag.current;
  pagination.value.pageSize = pag.pageSize;
}

function handleAdd() {
  modalTitle.value = "新增";
  formData.value = {
    id: 0,
    title: "",
    content: "",
    lang: filterLang.value,
    position: "官网常见问题",
    sortOrder: 0,
  };
  modalVisible.value = true;
}

function handleEdit(record: FaqRecord) {
  modalTitle.value = "编辑";
  formData.value = {
    id: record.id,
    title: record.title,
    content: record.content,
    lang: record.lang,
    position: record.position,
    sortOrder: record.sortOrder,
  };
  modalVisible.value = true;
}

function handleDelete(record: FaqRecord) {
  dataSource.value = dataSource.value.filter((r) => r.id !== record.id);
  message.success("删除成功");
}

function handleModalOk() {
  if (!formData.value.title.trim()) {
    message.warning("请输入标题");
    return;
  }
  if (!formData.value.content.trim()) {
    message.warning("请输入内容");
    return;
  }

  if (formData.value.id === 0) {
    const newId = Math.max(...dataSource.value.map((d) => d.id), 0) + 1;
    dataSource.value.push({
      id: newId,
      title: formData.value.title,
      content: formData.value.content,
      lang: formData.value.lang,
      position: formData.value.position,
      sortOrder: formData.value.sortOrder,
      createdAt: new Date().toLocaleString("zh-CN"),
      createdBy: "当前用户",
      updatedAt: new Date().toLocaleString("zh-CN"),
    });
    message.success("新增成功");
  } else {
    const index = dataSource.value.findIndex((d) => d.id === formData.value.id);
    if (index !== -1) {
      dataSource.value[index] = {
        ...dataSource.value[index],
        title: formData.value.title,
        content: formData.value.content,
        lang: formData.value.lang,
        position: formData.value.position,
        sortOrder: formData.value.sortOrder,
        updatedAt: new Date().toLocaleString("zh-CN"),
      };
      message.success("编辑成功");
    }
  }
  modalVisible.value = false;
}

function handleModalCancel() {
  modalVisible.value = false;
}
</script>

<style scoped>
.faq-list-page {
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

.content-cell {
  max-width: 400px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.modal-form {
  padding: 20px 0;
}

.form-row {
  display: flex;
  align-items: flex-start;
  margin-bottom: 20px;
}

.form-label {
  width: 80px;
  flex-shrink: 0;
  padding-top: 5px;
  font-size: 14px;
  color: #333;
}

.form-label.required::before {
  content: "* ";
  color: #ff4d4f;
}

.form-row .a-input,
.form-row .a-select,
.form-row .a-textarea {
  flex: 1;
}

.number-input {
  display: flex;
  align-items: center;
  gap: 8px;
}

.number-btn {
  width: 32px;
  height: 32px;
  border: 1px solid #d9d9d9;
  background: #fff;
  border-radius: 4px;
  cursor: pointer;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.number-btn:hover {
  border-color: #1890ff;
  color: #1890ff;
}

.number-value {
  width: 80px;
  height: 32px;
  text-align: center;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 14px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid #f0f0f0;
}
</style>
