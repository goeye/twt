<template>
  <a-layout style="min-height: 100vh">
    <a-layout-sider v-model:collapsed="collapsed" :trigger="null" collapsible :width="220">
      <div class="logo">
        <span v-if="!collapsed" class="logo__text">TWT 管理后台</span>
        <span v-else class="logo__text">T</span>
      </div>
      <a-menu
        v-model:selectedKeys="selectedKeys"
        theme="dark"
        mode="inline"
      >
        <a-menu-item key="resellers" @click="$router.push('/resellers')">
          <template #icon><TeamOutlined /></template>
          <span>代理商管理</span>
        </a-menu-item>
        <a-menu-item key="platform" @click="$router.push('/platform')">
          <template #icon><SettingOutlined /></template>
          <span>平台配置</span>
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
  TeamOutlined,
  SettingOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from '@ant-design/icons-vue'

const collapsed = ref(false)
const route = useRoute()

const selectedKeys = computed(() => {
  if (route.path === '/resellers') return ['resellers']
  if (route.path === '/platform') return ['platform']
  return ['resellers']
})

const currentTitle = computed(() => {
  if (route.path === '/resellers') return '代理商管理'
  if (route.path === '/platform') return '平台配置'
  return 'TWT 管理后台'
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
