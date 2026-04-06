<template>
  <div class="reseller-manage-page">
    <a-card title="代理商管理">
      <template #extra>
        <a-button type="primary" @click="showAddModal = true">
          <template #icon><PlusOutlined /></template>
          新增代理商
        </a-button>
      </template>

      <a-table
        :columns="columns"
        :data-source="resellers"
        :pagination="{ pageSize: 10 }"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'status'">
            <a-tag :color="getStatusColor(record.status)">
              {{ getStatusText(record.status) }}
            </a-tag>
          </template>
          <template v-if="column.key === 'action'">
            <a-space>
              <a-button size="small" @click="handleView(record)">查看</a-button>
              <a-button size="small" @click="handleEdit(record)">编辑</a-button>
              <a-button
                size="small"
                :danger="record.status === 'active'"
                @click="handleToggleStatus(record)"
              >
                {{ record.status === 'active' ? '停用' : '启用' }}
              </a-button>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>

    <a-modal
      v-model:open="showAddModal"
      title="新增代理商"
      @ok="handleAdd"
    >
      <p>新增代理商功能开发中...</p>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { message } from 'ant-design-vue'
import { PlusOutlined } from '@ant-design/icons-vue'

const showAddModal = ref(false)

const columns = [
  { title: '代理商 ID', dataIndex: 'id', key: 'id' },
  { title: '代理商名称', dataIndex: 'name', key: 'name' },
  { title: '联系人', dataIndex: 'contact', key: 'contact' },
  { title: '邮箱', dataIndex: 'email', key: 'email' },
  { title: '项目数', dataIndex: 'projectCount', key: 'projectCount' },
  { title: '状态', dataIndex: 'status', key: 'status' },
  { title: '创建时间', dataIndex: 'createdAt', key: 'createdAt' },
  { title: '操作', key: 'action' },
]

const resellers = ref([
  {
    key: '1',
    id: 'reseller-demo',
    name: 'Demo 客服',
    contact: '张三',
    email: 'demo@example.com',
    projectCount: 12,
    status: 'active',
    createdAt: '2026-01-15',
  },
  {
    key: '2',
    id: 'reseller-test',
    name: 'Test 客服',
    contact: '李四',
    email: 'test@example.com',
    projectCount: 5,
    status: 'inactive',
    createdAt: '2026-02-20',
  },
])

function getStatusColor(status: string) {
  return status === 'active' ? 'green' : 'red'
}

function getStatusText(status: string) {
  return status === 'active' ? '启用' : '停用'
}

function handleView(record: any) {
  message.info(`查看代理商：${record.name}`)
}

function handleEdit(record: any) {
  message.info(`编辑代理商：${record.name}`)
}

function handleToggleStatus(record: any) {
  record.status = record.status === 'active' ? 'inactive' : 'active'
  message.success(`已${record.status === 'active' ? '启用' : '停用'}代理商`)
}

function handleAdd() {
  showAddModal.value = false
  message.success('新增代理商功能开发中...')
}
</script>

<style scoped>
.reseller-manage-page {
  background: #fff;
  padding: 24px;
  min-height: calc(100vh - 112px);
}
</style>
