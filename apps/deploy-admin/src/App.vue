<template>
  <a-layout style="min-height: 100vh">
    <a-layout-sider v-model:collapsed="collapsed" :trigger="null" collapsible :width="220">
      <div class="logo">
        <span v-if="!collapsed" class="logo__text">私有化部署管理</span>
        <span v-else class="logo__text">D</span>
      </div>
      <a-menu
        v-model:selectedKeys="selectedKeys"
        theme="dark"
        mode="inline"
      >
        <a-menu-item key="dashboard" @click="$router.push('/dashboard')">
          <template #icon><DashboardOutlined /></template>
          <span>数据看板</span>
        </a-menu-item>
        <a-menu-item key="customers" @click="$router.push('/customers')">
          <template #icon><TeamOutlined /></template>
          <span>客户管理</span>
        </a-menu-item>
        <a-menu-item key="licenses" @click="$router.push('/licenses')">
          <template #icon><SafetyCertificateOutlined /></template>
          <span>License 管理</span>
        </a-menu-item>
        <a-menu-item key="deployments" @click="$router.push('/deployments')">
          <template #icon><CloudServerOutlined /></template>
          <span>部署管理</span>
        </a-menu-item>
        <a-menu-item key="sms-config" @click="$router.push('/sms-config')">
          <template #icon><MessageOutlined /></template>
          <span>短信配置</span>
        </a-menu-item>
        <a-menu-item key="versions" @click="$router.push('/versions')">
          <template #icon><TagOutlined /></template>
          <span>版本管理</span>
        </a-menu-item>
        <a-menu-item key="client-versions" @click="$router.push('/client-versions')">
          <template #icon><MobileOutlined /></template>
          <span>客户端版本</span>
        </a-menu-item>
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
        <span class="header-title">{{ currentTitle }}</span>
      </a-layout-header>

      <a-layout-content class="admin-content">
        <router-view />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import {
  DashboardOutlined,
  TeamOutlined,
  SafetyCertificateOutlined,
  CloudServerOutlined,
  ApiOutlined,
  MessageOutlined,
  TagOutlined,
  MobileOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from '@ant-design/icons-vue'

const collapsed = ref(false)
const route = useRoute()

const selectedKeys = computed(() => {
  const path = route.path
  if (path === '/dashboard') return ['dashboard']
  if (path.startsWith('/customers')) return ['customers']
  if (path === '/licenses') return ['licenses']
  if (path === '/deployments') return ['deployments']
  if (path === '/sms-config') return ['sms-config']
  if (path === '/versions') return ['versions']
  if (path === '/client-versions') return ['client-versions']
  return ['dashboard']
})

const titleMap: Record<string, string> = {
  '/dashboard': '数据看板',
  '/customers': '客户管理',
  '/licenses': 'License 管理',
  '/deployments': '部署管理',
  '/sms-config': '短信配置',
  '/versions': '版本管理',
  '/client-versions': '客户端版本',
}

const currentTitle = computed(() => {
  if (route.path.startsWith('/customers/')) return '客户详情'
  return titleMap[route.path] || '私有化部署管理'
})
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
  color: #1890ff;
}

.header-title {
  font-size: 16px;
  font-weight: 500;
}

.admin-content {
  margin: 24px;
}
</style>
