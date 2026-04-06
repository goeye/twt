<template>
  <div class="reseller-manage-page">
    <!-- 数据统计卡片 -->
    <div class="stats-cards">
      <a-card class="stat-card">
        <a-statistic title="代理商总数" :value="stats.total" />
      </a-card>
      <a-card class="stat-card">
        <a-statistic title="待审核" :value="stats.pending" />
      </a-card>
      <a-card class="stat-card">
        <a-statistic title="已启用" :value="stats.active" />
      </a-card>
      <a-card class="stat-card">
        <a-statistic title="已停用" :value="stats.inactive" />
      </a-card>
    </div>

    <!-- 筛选区域 -->
    <a-card class="filter-card">
      <div class="filter-row">
        <a-input
          v-model:value="filters.keyword"
          placeholder="搜索代理商名称/ID/邮箱"
          style="width: 240px"
          allow-clear
        >
          <template #prefix><SearchOutlined /></template>
        </a-input>

        <a-select v-model:value="filters.status" placeholder="状态" style="width: 120px" allow-clear>
          <a-select-option value="pending">待审核</a-select-option>
          <a-select-option value="active">已启用</a-select-option>
          <a-select-option value="inactive">已停用</a-select-option>
          <a-select-option value="rejected">已拒绝</a-select-option>
        </a-select>

        <a-range-picker
          v-model:value="filters.dateRange"
          :placeholder="['创建开始时间', '创建结束时间']"
          style="width: 280px"
        />

        <a-button @click="handleSearch">
          <template #icon><SearchOutlined /></template>
          搜索
        </a-button>
        <a-button @click="handleReset">
          <template #icon><ReloadOutlined /></template>
          重置
        </a-button>

        <div style="margin-left: auto">
          <a-button type="primary" @click="showAddModal = true">
            <template #icon><PlusOutlined /></template>
            新增代理商
          </a-button>
        </div>
      </div>
    </a-card>

    <!-- 代理商列表 -->
    <a-card>
      <a-table
        :columns="columns"
        :data-source="filteredResellers"
        :pagination="pagination"
        :loading="loading"
        @change="handleTableChange"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'name'">
            <a @click="handleView(record)">{{ record.name }}</a>
          </template>
          <template v-else-if="column.key === 'status'">
            <a-tag :color="getStatusColor(record.status)">
              {{ getStatusText(record.status) }}
            </a-tag>
          </template>
          <template v-else-if="column.key === 'commissionRate'">
            {{ record.commissionRate }}%
          </template>
          <template v-else-if="column.key === 'totalRevenue'">
            ¥{{ record.totalRevenue.toLocaleString() }}
          </template>
          <template v-else-if="column.key === 'action'">
            <a-space>
              <a-button size="small" @click="handleView(record)">查看</a-button>
              <a-button v-if="record.status === 'pending'" size="small" type="primary" @click="handleApprove(record)">
                审核
              </a-button>
              <a-button v-else size="small" @click="handleEdit(record)">编辑</a-button>
              <a-button
                v-if="record.status === 'active' || record.status === 'inactive'"
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

    <!-- 新增代理商弹窗 -->
    <a-modal
      v-model:open="showAddModal"
      title="新增代理商"
      width="600px"
      @ok="handleAdd"
    >
      <a-form
        :model="addForm"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 16 }"
      >
        <a-form-item label="代理商 ID" required>
          <a-input v-model:value="addForm.id" placeholder="reseller-xxx" />
        </a-form-item>
        <a-form-item label="代理商名称" required>
          <a-input v-model:value="addForm.name" />
        </a-form-item>
        <a-form-item label="联系人" required>
          <a-input v-model:value="addForm.contact" />
        </a-form-item>
        <a-form-item label="邮箱" required>
          <a-input v-model:value="addForm.email" type="email" />
        </a-form-item>
        <a-form-item label="手机号">
          <a-input v-model:value="addForm.phone" />
        </a-form-item>
        <a-form-item label="分成比例">
          <a-input-number
            v-model:value="addForm.commissionRate"
            :min="0"
            :max="100"
            addon-after="%"
            style="width: 100%"
          />
        </a-form-item>
        <a-form-item label="备注">
          <a-textarea v-model:value="addForm.remark" :rows="3" />
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 审核弹窗 -->
    <a-modal
      v-model:open="showApproveModal"
      title="审核代理商"
      @ok="handleApproveSubmit"
    >
      <a-form :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }">
        <a-form-item label="代理商名称">
          <span>{{ currentReseller?.name }}</span>
        </a-form-item>
        <a-form-item label="联系人">
          <span>{{ currentReseller?.contact }}</span>
        </a-form-item>
        <a-form-item label="邮箱">
          <span>{{ currentReseller?.email }}</span>
        </a-form-item>
        <a-form-item label="审核结果" required>
          <a-radio-group v-model:value="approveForm.result">
            <a-radio value="approve">通过</a-radio>
            <a-radio value="reject">拒绝</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item v-if="approveForm.result === 'approve'" label="分成比例">
          <a-input-number
            v-model:value="approveForm.commissionRate"
            :min="0"
            :max="100"
            addon-after="%"
            style="width: 100%"
          />
        </a-form-item>
        <a-form-item label="审核备注">
          <a-textarea v-model:value="approveForm.remark" :rows="3" />
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 编辑弹窗 -->
    <a-modal
      v-model:open="showEditModal"
      title="编辑代理商"
      width="600px"
      @ok="handleEditSubmit"
    >
      <a-form
        :model="editForm"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 16 }"
      >
        <a-form-item label="代理商 ID">
          <span>{{ editForm.id }}</span>
        </a-form-item>
        <a-form-item label="代理商名称" required>
          <a-input v-model:value="editForm.name" />
        </a-form-item>
        <a-form-item label="联系人" required>
          <a-input v-model:value="editForm.contact" />
        </a-form-item>
        <a-form-item label="邮箱" required>
          <a-input v-model:value="editForm.email" type="email" />
        </a-form-item>
        <a-form-item label="手机号">
          <a-input v-model:value="editForm.phone" />
        </a-form-item>
        <a-form-item label="分成比例">
          <a-input-number
            v-model:value="editForm.commissionRate"
            :min="0"
            :max="100"
            addon-after="%"
            style="width: 100%"
          />
        </a-form-item>
        <a-form-item label="备注">
          <a-textarea v-model:value="editForm.remark" :rows="3" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import {
  PlusOutlined,
  SearchOutlined,
  ReloadOutlined,
} from '@ant-design/icons-vue'
import { resellersData, type Reseller } from '../mock/resellersData'

const router = useRouter()
const loading = ref(false)
const showAddModal = ref(false)
const showApproveModal = ref(false)
const showEditModal = ref(false)
const currentReseller = ref<Reseller | null>(null)

// 筛选条件
const filters = reactive({
  keyword: '',
  status: undefined as string | undefined,
  dateRange: null as any,
})

// 数据统计
const stats = computed(() => {
  return {
    total: resellers.value.length,
    pending: resellers.value.filter(r => r.status === 'pending').length,
    active: resellers.value.filter(r => r.status === 'active').length,
    inactive: resellers.value.filter(r => r.status === 'inactive').length,
  }
})

// 表格列定义
const columns = [
  { title: '代理商 ID', dataIndex: 'id', key: 'id', width: 140 },
  { title: '代理商名称', dataIndex: 'name', key: 'name', width: 150 },
  { title: '联系人', dataIndex: 'contact', key: 'contact', width: 100 },
  { title: '邮箱', dataIndex: 'email', key: 'email', width: 180 },
  { title: '手机号', dataIndex: 'phone', key: 'phone', width: 120 },
  { title: '项目数', dataIndex: 'projectCount', key: 'projectCount', width: 80 },
  { title: '分成比例', key: 'commissionRate', width: 100 },
  { title: '总收入', key: 'totalRevenue', width: 120 },
  { title: '状态', key: 'status', width: 100 },
  { title: '创建时间', dataIndex: 'createdAt', key: 'createdAt', width: 120 },
  { title: '操作', key: 'action', width: 200, fixed: 'right' },
]

// 代理商数据
const resellers = ref<Reseller[]>([...resellersData])

// 分页配置
const pagination = ref({
  current: 1,
  pageSize: 10,
  total: resellers.value.length,
  showSizeChanger: true,
  showTotal: (total: number) => `共 ${total} 条`,
})

// 过滤后的数据
const filteredResellers = computed(() => {
  let result = resellers.value

  // 关键词搜索
  if (filters.keyword) {
    const keyword = filters.keyword.toLowerCase()
    result = result.filter(r =>
      r.name.toLowerCase().includes(keyword) ||
      r.id.toLowerCase().includes(keyword) ||
      r.email.toLowerCase().includes(keyword)
    )
  }

  // 状态筛选
  if (filters.status) {
    result = result.filter(r => r.status === filters.status)
  }

  pagination.value.total = result.length
  return result
})

// 新增表单
const addForm = reactive({
  id: '',
  name: '',
  contact: '',
  email: '',
  phone: '',
  commissionRate: 30,
  remark: '',
})

// 审核表单
const approveForm = reactive({
  result: 'approve',
  commissionRate: 30,
  remark: '',
})

// 编辑表单
const editForm = reactive({
  id: '',
  name: '',
  contact: '',
  email: '',
  phone: '',
  commissionRate: 30,
  remark: '',
})

function getStatusColor(status: string) {
  const colors: Record<string, string> = {
    pending: 'orange',
    active: 'green',
    inactive: 'red',
    rejected: 'default',
  }
  return colors[status] || 'default'
}

function getStatusText(status: string) {
  const texts: Record<string, string> = {
    pending: '待审核',
    active: '已启用',
    inactive: '已停用',
    rejected: '已拒绝',
  }
  return texts[status] || status
}

function handleSearch() {
  pagination.value.current = 1
}

function handleReset() {
  filters.keyword = ''
  filters.status = undefined
  filters.dateRange = null
  pagination.value.current = 1
}

function handleTableChange(pag: any) {
  pagination.value.current = pag.current
  pagination.value.pageSize = pag.pageSize
}

function handleView(record: any) {
  router.push(`/resellers/${record.id}`)
}

function handleApprove(record: any) {
  currentReseller.value = record
  approveForm.result = 'approve'
  approveForm.commissionRate = 30
  approveForm.remark = ''
  showApproveModal.value = true
}

function handleApproveSubmit() {
  if (!currentReseller.value) return

  if (approveForm.result === 'approve') {
    currentReseller.value.status = 'active'
    currentReseller.value.commissionRate = approveForm.commissionRate
    message.success('审核通过')
  } else {
    currentReseller.value.status = 'rejected'
    message.success('已拒绝')
  }

  showApproveModal.value = false
  currentReseller.value = null
}

function handleEdit(record: any) {
  editForm.id = record.id
  editForm.name = record.name
  editForm.contact = record.contact
  editForm.email = record.email
  editForm.phone = record.phone
  editForm.commissionRate = record.commissionRate
  editForm.remark = record.remark
  showEditModal.value = true
}

function handleEditSubmit() {
  const reseller = resellers.value.find(r => r.id === editForm.id)
  if (reseller) {
    reseller.name = editForm.name
    reseller.contact = editForm.contact
    reseller.email = editForm.email
    reseller.phone = editForm.phone
    reseller.commissionRate = editForm.commissionRate
    reseller.remark = editForm.remark
    message.success('编辑成功')
  }
  showEditModal.value = false
}

function handleToggleStatus(record: any) {
  record.status = record.status === 'active' ? 'inactive' : 'active'
  message.success(`已${record.status === 'active' ? '启用' : '停用'}代理商`)
}

function handleAdd() {
  if (!addForm.id || !addForm.name || !addForm.contact || !addForm.email) {
    message.error('请填写必填项')
    return
  }

  resellers.value.push({
    key: String(resellers.value.length + 1),
    id: addForm.id,
    name: addForm.name,
    contact: addForm.contact,
    email: addForm.email,
    phone: addForm.phone,
    projectCount: 0,
    commissionRate: addForm.commissionRate,
    totalRevenue: 0,
    status: 'active',
    createdAt: new Date().toISOString().split('T')[0],
    remark: addForm.remark,
  })

  message.success('新增代理商成功')
  showAddModal.value = false

  // 重置表单
  addForm.id = ''
  addForm.name = ''
  addForm.contact = ''
  addForm.email = ''
  addForm.phone = ''
  addForm.commissionRate = 30
  addForm.remark = ''
}
</script>

<style scoped>
.reseller-manage-page {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.stats-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.stat-card {
  text-align: center;
}

.filter-card {
  background: #fff;
}

.filter-row {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}
</style>
