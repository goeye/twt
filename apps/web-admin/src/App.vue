<template>
  <a-layout style="min-height: 100vh">
    <a-layout-sider v-model:collapsed="collapsed" :trigger="null" collapsible :width="220">
      <div class="logo">
        <span v-if="!collapsed" class="logo__text">TWT 运营后台</span>
        <span v-else class="logo__text">T</span>
      </div>
      <a-menu
        v-model:selectedKeys="selectedKeys"
        v-model:openKeys="openKeys"
        theme="dark"
        mode="inline"
      >
        <a-menu-item key="home" disabled>
          <template #icon><DashboardOutlined /></template>
          <span>控制台</span>
        </a-menu-item>

        <a-sub-menu key="data">
          <template #icon><BarChartOutlined /></template>
          <template #title>数据看板</template>
          <a-menu-item key="dashboard" @click="$router.push('/dashboard')">数据看板</a-menu-item>
          <a-menu-item key="feature-stats" @click="$router.push('/feature-stats')">会话功能统计</a-menu-item>
        </a-sub-menu>

        <a-sub-menu key="prompt" disabled>
          <template #icon><FileTextOutlined /></template>
          <template #title>提示词管理</template>
        </a-sub-menu>

        <a-sub-menu key="project" disabled>
          <template #icon><ProjectOutlined /></template>
          <template #title>项目管理</template>
        </a-sub-menu>

        <a-sub-menu key="compliance" disabled>
          <template #icon><SafetyOutlined /></template>
          <template #title>合规管理</template>
        </a-sub-menu>

        <a-sub-menu key="resource" disabled>
          <template #icon><CloudServerOutlined /></template>
          <template #title>资源管理</template>
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
      </a-layout-header>

      <a-layout-content class="admin-content">
        <router-view />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useRoute } from "vue-router";
import {
  DashboardOutlined,
  BarChartOutlined,
  FileTextOutlined,
  ProjectOutlined,
  SafetyOutlined,
  CloudServerOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from "@ant-design/icons-vue";

const collapsed = ref(false);
const openKeys = ref<string[]>(["data"]);

const route = useRoute();

function routeToKey(path: string): string {
  if (path === "/feature-stats") return "feature-stats";
  return "dashboard";
}

const selectedKeys = ref<string[]>([routeToKey(route.path)]);

watch(
  () => route.path,
  (path) => {
    selectedKeys.value = [routeToKey(path)];
  }
);
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

.admin-content {
  margin: 24px;
}
</style>
