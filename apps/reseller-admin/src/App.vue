<template>
  <a-layout style="min-height: 100vh">
    <a-layout-sider v-model:collapsed="collapsed" :trigger="null" collapsible :width="220">
      <div class="logo">
        <span v-if="!collapsed" class="logo__text">{{ tenant.displayName }}</span>
        <span v-else class="logo__text">{{ tenant.name.charAt(0) }}</span>
      </div>
      <a-menu
        v-model:selectedKeys="selectedKeys"
        v-model:openKeys="openKeys"
        theme="dark"
        mode="inline"
      >
        <a-menu-item key="dashboard" @click="$router.push('/dashboard')">
          <template #icon><DashboardOutlined /></template>
          <span>数据看板</span>
        </a-menu-item>

        <a-sub-menu key="config">
          <template #icon><SettingOutlined /></template>
          <template #title>配置管理</template>
          <a-menu-item key="brand" @click="$router.push('/brand')">品牌配置</a-menu-item>
          <a-menu-item key="website" @click="$router.push('/website')">官网配置</a-menu-item>
          <a-menu-item key="domain" @click="$router.push('/domain')">域名绑定</a-menu-item>
        </a-sub-menu>

        <a-sub-menu key="business">
          <template #icon><ProjectOutlined /></template>
          <template #title>业务管理</template>
          <a-menu-item key="projects" @click="$router.push('/projects')">项目管理</a-menu-item>
          <a-menu-item key="orders" @click="$router.push('/orders')">订单管理</a-menu-item>
          <a-menu-item key="commission" @click="$router.push('/commission')">佣金管理</a-menu-item>
        </a-sub-menu>

        <a-sub-menu key="service">
          <template #icon><CloudServerOutlined /></template>
          <template #title>服务配置</template>
          <a-menu-item key="email" @click="$router.push('/email')">邮件管理</a-menu-item>
          <a-menu-item key="oss" @click="$router.push('/oss')">OSS 管理</a-menu-item>
        </a-sub-menu>
      </a-menu>
    </a-layout-sider>

    <a-layout>
      <a-layout-header class="admin-header">
        <menu-unfold-outlined
          v-if="collapsed"
          class="trigger"
          @click="collapsed = false"
        />
        <menu-fold-outlined
          v-else
          class="trigger"
          @click="collapsed = true"
        />
        <a-breadcrumb class="header-breadcrumb">
          <a-breadcrumb-item v-for="(item, i) in breadcrumbs" :key="i">
            <router-link v-if="item.path && i < breadcrumbs.length - 1" :to="item.path">{{ item.title }}</router-link>
            <span v-else>{{ item.title }}</span>
          </a-breadcrumb-item>
        </a-breadcrumb>
      </a-layout-header>

      <div class="tab-bar">
        <div
          v-for="tab in tabs"
          :key="tab.path"
          class="tab-item"
          :class="{ 'tab-item--active': tab.path === route.path }"
          @click="switchTab(tab)"
        >
          <span class="tab-item__text">{{ tab.title }}</span>
          <CloseOutlined
            v-if="tabs.length > 1"
            class="tab-item__close"
            @click.stop="closeTab(tab)"
          />
        </div>
      </div>

      <a-layout-content class="admin-content">
        <router-view />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  DashboardOutlined,
  SettingOutlined,
  ProjectOutlined,
  CloudServerOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  CloseOutlined,
} from '@ant-design/icons-vue'
import { useTenant } from '@twt/branding'

const tenant = useTenant()
const collapsed = ref(false)
const route = useRoute()
const router = useRouter()

interface BreadcrumbItem {
  title: string
  path?: string
}

interface TabItem {
  title: string
  path: string
}

const routeMeta: Record<string, { breadcrumbs: BreadcrumbItem[]; tabTitle: string }> = {
  '/dashboard': {
    breadcrumbs: [{ title: '数据看板' }],
    tabTitle: '数据看板',
  },
  '/brand': {
    breadcrumbs: [{ title: '配置管理' }, { title: '品牌配置' }],
    tabTitle: '品牌配置',
  },
  '/website': {
    breadcrumbs: [{ title: '配置管理' }, { title: '官网配置' }],
    tabTitle: '官网配置',
  },
  '/domain': {
    breadcrumbs: [{ title: '配置管理' }, { title: '域名绑定' }],
    tabTitle: '域名绑定',
  },
  '/projects': {
    breadcrumbs: [{ title: '业务管理' }, { title: '项目管理' }],
    tabTitle: '项目管理',
  },
  '/orders': {
    breadcrumbs: [{ title: '业务管理' }, { title: '订单管理' }],
    tabTitle: '订单管理',
  },
  '/commission': {
    breadcrumbs: [{ title: '业务管理' }, { title: '佣金管理' }],
    tabTitle: '佣金管理',
  },
  '/email': {
    breadcrumbs: [{ title: '服务配置' }, { title: '邮件管理' }],
    tabTitle: '邮件管理',
  },
  '/oss': {
    breadcrumbs: [{ title: '服务配置' }, { title: 'OSS 管理' }],
    tabTitle: 'OSS 管理',
  },
}

function getRouteMeta(path: string): { breadcrumbs: BreadcrumbItem[]; tabTitle: string } {
  return routeMeta[path] || { breadcrumbs: [{ title: '数据看板' }], tabTitle: '页面' }
}

const breadcrumbs = computed(() => getRouteMeta(route.path).breadcrumbs)

const tabs = ref<TabItem[]>([
  { title: getRouteMeta(route.path).tabTitle, path: route.path },
])

function ensureTab(path: string) {
  if (!tabs.value.find((t) => t.path === path)) {
    tabs.value.push({ title: getRouteMeta(path).tabTitle, path })
  }
}

function switchTab(tab: TabItem) {
  if (tab.path !== route.path) {
    router.push(tab.path)
  }
}

function closeTab(tab: TabItem) {
  const idx = tabs.value.findIndex((t) => t.path === tab.path)
  if (idx === -1) return
  tabs.value.splice(idx, 1)
  if (tab.path === route.path && tabs.value.length > 0) {
    const next = tabs.value[Math.min(idx, tabs.value.length - 1)]
    router.push(next.path)
  }
}

function routeToKey(path: string): string {
  if (path === '/dashboard') return 'dashboard'
  if (path === '/brand') return 'brand'
  if (path === '/website') return 'website'
  if (path === '/domain') return 'domain'
  if (path === '/projects') return 'projects'
  if (path === '/orders') return 'orders'
  if (path === '/commission') return 'commission'
  if (path === '/email') return 'email'
  if (path === '/oss') return 'oss'
  return 'dashboard'
}

function routeToOpenKeys(path: string): string[] {
  if (path.startsWith('/brand') || path.startsWith('/website') || path.startsWith('/domain')) return ['config']
  if (path.startsWith('/projects') || path.startsWith('/orders') || path.startsWith('/commission')) return ['business']
  if (path.startsWith('/email') || path.startsWith('/oss')) return ['service']
  return []
}

const selectedKeys = ref<string[]>([routeToKey(route.path)])
const openKeys = ref<string[]>(routeToOpenKeys(route.path))

watch(
  () => route.path,
  (path) => {
    selectedKeys.value = [routeToKey(path)]
    const needed = routeToOpenKeys(path)
    if (needed.length && !openKeys.value.includes(needed[0])) {
      openKeys.value = [...openKeys.value, ...needed]
    }
    ensureTab(path)
  }
)
</script>

<style scoped>
.logo {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 18px;
  font-weight: 600;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.logo__text {
  white-space: nowrap;
  overflow: hidden;
}

.admin-header {
  background: #fff;
  padding: 0 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
}

.trigger {
  font-size: 18px;
  cursor: pointer;
  transition: color 0.3s;
}

.trigger:hover {
  color: v-bind('tenant.primaryColor');
}

.header-breadcrumb {
  font-size: 14px;
}

.tab-bar {
  display: flex;
  align-items: center;
  gap: 0;
  background: #fff;
  padding: 6px 16px 0;
  border-bottom: 1px solid #f0f0f0;
  flex-wrap: wrap;
}

.tab-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  font-size: 13px;
  color: #666;
  cursor: pointer;
  border: 1px solid #e8e8e8;
  border-bottom: none;
  border-radius: 4px 4px 0 0;
  margin-right: 4px;
  background: #fafafa;
  transition: all 0.2s;
  user-select: none;
}

.tab-item:hover {
  color: v-bind('tenant.primaryColor');
}

.tab-item--active {
  background: v-bind('tenant.primaryColor');
  color: #fff;
  border-color: v-bind('tenant.primaryColor');
}

.tab-item--active:hover {
  color: #fff;
}

.tab-item__text {
  white-space: nowrap;
}

.tab-item__close {
  font-size: 10px;
  opacity: 0.6;
  transition: opacity 0.2s;
}

.tab-item__close:hover {
  opacity: 1;
}

.admin-content {
  margin: 24px;
}
</style>
