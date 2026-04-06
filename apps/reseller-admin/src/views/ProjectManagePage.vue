<template>
  <div class="project-page">
    <!-- 统计卡片 -->
    <div class="stats-cards">
      <div class="stat-card">
        <div class="stat-card__label">总项目数</div>
        <div class="stat-card__value">{{ stats.totalProjects }}</div>
        <div class="stat-card__trend">活跃 {{ stats.activeProjects }} 个</div>
      </div>
      <div class="stat-card">
        <div class="stat-card__label">总客服数</div>
        <div class="stat-card__value">{{ stats.totalAgents }}</div>
        <div class="stat-card__trend">在线 {{ stats.onlineAgents }} 人</div>
      </div>
      <div class="stat-card">
        <div class="stat-card__label">总会话数</div>
        <div class="stat-card__value">{{ stats.totalSessions }}</div>
        <div class="stat-card__trend">本月 +{{ stats.monthSessions }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-card__label">平均响应时间</div>
        <div class="stat-card__value">{{ stats.avgResponseTime }}s</div>
        <div class="stat-card__trend">较上月 -15%</div>
      </div>
    </div>

    <!-- 筛选栏 -->
    <div class="filter-bar">
      <div class="filter-bar__left">
        <select v-model="filters.status" class="filter-select">
          <option value="">全部状态</option>
          <option value="active">活跃</option>
          <option value="inactive">未激活</option>
          <option value="suspended">已暂停</option>
        </select>
        <select v-model="filters.plan" class="filter-select">
          <option value="">全部套餐</option>
          <option value="free">免费版</option>
          <option value="pro">专业版</option>
        </select>
        <input
          v-model="filters.search"
          type="text"
          placeholder="搜索项目名称、客户名称"
          class="filter-input"
        />
      </div>
    </div>

    <!-- 项目表格 -->
    <div class="project-table-wrapper">
      <table class="project-table">
        <thead>
          <tr>
            <th>项目名称</th>
            <th>客户名称</th>
            <th>套餐</th>
            <th>客服数</th>
            <th>会话数</th>
            <th>状态</th>
            <th>创建时间</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="project in filteredProjects" :key="project.id">
            <td>
              <div class="project-info">
                <div class="project-avatar" :style="{ background: project.color }">
                  {{ project.name.charAt(0) }}
                </div>
                <span class="project-name">{{ project.name }}</span>
              </div>
            </td>
            <td>{{ project.customerName }}</td>
            <td>
              <span class="plan-badge" :class="`plan-badge--${project.plan}`">
                {{ project.plan === 'free' ? '免费版' : '专业版' }}
              </span>
            </td>
            <td>{{ project.agentCount }}</td>
            <td>{{ project.sessionCount }}</td>
            <td>
              <span class="status-badge" :class="`status-badge--${project.status}`">
                {{ getStatusLabel(project.status) }}
              </span>
            </td>
            <td class="time">{{ project.createdAt }}</td>
            <td>
              <button class="btn-link" @click="viewProject(project)">查看</button>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="filteredProjects.length === 0" class="empty-state">
        <div class="empty-state__icon">📁</div>
        <div class="empty-state__text">暂无项目数据</div>
      </div>
    </div>

    <!-- 分页 -->
    <div class="pagination">
      <span class="pagination__info">共 {{ filteredProjects.length }} 条</span>
      <div class="pagination__controls">
        <button class="pagination__btn" :disabled="currentPage === 1" @click="currentPage--">上一页</button>
        <span class="pagination__current">{{ currentPage }}</span>
        <button class="pagination__btn" :disabled="currentPage >= totalPages" @click="currentPage++">下一页</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Project {
  id: string
  name: string
  customerName: string
  plan: 'free' | 'pro'
  agentCount: number
  sessionCount: number
  status: 'active' | 'inactive' | 'suspended'
  createdAt: string
  color: string
}

const stats = ref({
  totalProjects: 28,
  activeProjects: 24,
  totalAgents: 156,
  onlineAgents: 89,
  totalSessions: 3420,
  monthSessions: 856,
  avgResponseTime: 45,
})

const filters = ref({
  status: '',
  plan: '',
  search: '',
})

const currentPage = ref(1)
const pageSize = 20

// 模拟项目数据
const projects = ref<Project[]>([
  {
    id: '1',
    name: '客户A项目',
    customerName: '张三',
    plan: 'pro',
    agentCount: 12,
    sessionCount: 456,
    status: 'active',
    createdAt: '2026-01-15',
    color: '#6366f1',
  },
  {
    id: '2',
    name: '客户B项目',
    customerName: '李四',
    plan: 'pro',
    agentCount: 8,
    sessionCount: 234,
    status: 'active',
    createdAt: '2026-02-20',
    color: '#10b981',
  },
  {
    id: '3',
    name: '客户C项目',
    customerName: '王五',
    plan: 'free',
    agentCount: 3,
    sessionCount: 89,
    status: 'active',
    createdAt: '2026-03-10',
    color: '#f59e0b',
  },
  {
    id: '4',
    name: '客户D项目',
    customerName: '赵六',
    plan: 'pro',
    agentCount: 15,
    sessionCount: 678,
    status: 'active',
    createdAt: '2026-01-25',
    color: '#ec4899',
  },
  {
    id: '5',
    name: '客户E项目',
    customerName: '孙七',
    plan: 'free',
    agentCount: 2,
    sessionCount: 45,
    status: 'inactive',
    createdAt: '2026-04-01',
    color: '#8b5cf6',
  },
])

const filteredProjects = computed(() => {
  return projects.value.filter(project => {
    if (filters.value.status && project.status !== filters.value.status) return false
    if (filters.value.plan && project.plan !== filters.value.plan) return false
    if (filters.value.search) {
      const search = filters.value.search.toLowerCase()
      return (
        project.name.toLowerCase().includes(search) ||
        project.customerName.toLowerCase().includes(search)
      )
    }
    return true
  })
})

const totalPages = computed(() => Math.ceil(filteredProjects.value.length / pageSize))

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    active: '活跃',
    inactive: '未激活',
    suspended: '已暂停',
  }
  return labels[status] || status
}

const viewProject = (project: Project) => {
  alert(`查看项目：${project.name}`)
}
</script>

<style scoped>
.project-page {
  padding: 24px;
}

/* 统计卡片 */
.stats-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.stat-card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 20px;
}

.stat-card__label {
  color: #6b7280;
  font-size: 14px;
  margin-bottom: 8px;
}

.stat-card__value {
  color: #111827;
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 4px;
}

.stat-card__trend {
  color: #10b981;
  font-size: 13px;
}

/* 筛选栏 */
.filter-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  gap: 12px;
}

.filter-bar__left {
  display: flex;
  gap: 12px;
  flex: 1;
}

.filter-select {
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  background: #fff;
  cursor: pointer;
}

.filter-input {
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  flex: 1;
  max-width: 300px;
}

/* 项目表格 */
.project-table-wrapper {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 16px;
}

.project-table {
  width: 100%;
  border-collapse: collapse;
}

.project-table th {
  background: #f9fafb;
  padding: 12px 16px;
  text-align: left;
  font-size: 13px;
  font-weight: 600;
  color: #6b7280;
  border-bottom: 1px solid #e5e7eb;
}

.project-table td {
  padding: 16px;
  font-size: 14px;
  color: #111827;
  border-bottom: 1px solid #f3f4f6;
}

.project-table tbody tr:hover {
  background: #f9fafb;
}

.project-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.project-avatar {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: 600;
  font-size: 16px;
}

.project-name {
  font-weight: 500;
}

.time {
  color: #6b7280;
  font-size: 13px;
}

.plan-badge {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
}

.plan-badge--free {
  background: #f3f4f6;
  color: #6b7280;
}

.plan-badge--pro {
  background: #dbeafe;
  color: #1e40af;
}

.status-badge {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
}

.status-badge--active {
  background: #d1fae5;
  color: #065f46;
}

.status-badge--inactive {
  background: #f3f4f6;
  color: #6b7280;
}

.status-badge--suspended {
  background: #fee2e2;
  color: #991b1b;
}

.btn-link {
  background: none;
  border: none;
  color: #6366f1;
  cursor: pointer;
  font-size: 14px;
  padding: 0;
}

.btn-link:hover {
  text-decoration: underline;
}

/* 空状态 */
.empty-state {
  padding: 60px 20px;
  text-align: center;
}

.empty-state__icon {
  font-size: 48px;
  margin-bottom: 12px;
}

.empty-state__text {
  color: #6b7280;
  font-size: 14px;
}

/* 分页 */
.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.pagination__info {
  color: #6b7280;
  font-size: 14px;
}

.pagination__controls {
  display: flex;
  align-items: center;
  gap: 12px;
}

.pagination__btn {
  padding: 6px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: #fff;
  color: #374151;
  font-size: 14px;
  cursor: pointer;
}

.pagination__btn:hover:not(:disabled) {
  background: #f9fafb;
}

.pagination__btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination__current {
  color: #111827;
  font-size: 14px;
  font-weight: 500;
}
</style>
