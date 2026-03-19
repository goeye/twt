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

        <a-sub-menu key="compliance">
          <template #icon><SafetyOutlined /></template>
          <template #title>合规管理</template>
          <a-menu-item key="agreements" @click="$router.push('/compliance/agreements')">协议管理</a-menu-item>
          <a-menu-item key="sensitive-words" @click="$router.push('/compliance/sensitive-words')">词库管理</a-menu-item>
          <a-menu-item key="alerts" @click="$router.push('/compliance/alerts')">预警列表</a-menu-item>
        </a-sub-menu>

        <a-sub-menu key="resource" disabled>
          <template #icon><CloudServerOutlined /></template>
          <template #title>资源管理</template>
        </a-sub-menu>
      </a-menu>
    </a-layout-sider>

    <a-layout>
      <!-- 顶部 Header：折叠按钮 + 面包屑 -->
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

      <!-- 页面标签栏 -->
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

    <!-- 版本更新弹窗 -->
    <a-modal
      :open="versionState.hasUpdate"
      title="发现新版本"
      :closable="false"
      :mask-closable="false"
      :footer="null"
      :width="420"
    >
      <p style="color: #75869c; margin-bottom: 16px">
        系统已更新，刷新页面即可使用最新功能
      </p>
      <div v-if="notesList.length" style="margin-bottom: 20px">
        <h4 style="font-size: 14px; font-weight: 600; margin-bottom: 8px">更新内容</h4>
        <ul style="padding-left: 18px; color: #4e5969; font-size: 13px">
          <li v-for="(note, i) in notesList" :key="i" style="margin-bottom: 4px">{{ note }}</li>
        </ul>
      </div>
      <div style="display: flex; justify-content: flex-end; gap: 12px">
        <a-button @click="dismissUpdate">稍后提醒</a-button>
        <a-button type="primary" @click="doRefresh">立即刷新</a-button>
      </div>
    </a-modal>
  </a-layout>
</template>

<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  DashboardOutlined,
  BarChartOutlined,
  FileTextOutlined,
  ProjectOutlined,
  SafetyOutlined,
  CloudServerOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  CloseOutlined,
} from "@ant-design/icons-vue";
import { dictionaryData } from "./mock/sensitiveWordsData";
import { useVersionCheck } from "./composables/useVersionCheck";

const { versionState, doRefresh, dismissUpdate } = useVersionCheck();

const notesList = computed(() => {
  if (!versionState.notes) return [];
  return versionState.notes
    .split("\n")
    .map((line) => line.replace(/^[a-f0-9]+ /, "").trim())
    .filter(Boolean);
});

const collapsed = ref(false);
const route = useRoute();
const router = useRouter();

/* ---- 路由元信息 ---- */
interface BreadcrumbItem {
  title: string;
  path?: string;
}

interface TabItem {
  title: string;
  path: string;
}

/** 静态路由 → 面包屑 */
const routeMeta: Record<string, { breadcrumbs: BreadcrumbItem[]; tabTitle: string }> = {
  "/dashboard": {
    breadcrumbs: [{ title: "数据看板" }, { title: "数据看板" }],
    tabTitle: "数据看板",
  },
  "/feature-stats": {
    breadcrumbs: [{ title: "数据看板", path: "/dashboard" }, { title: "会话功能统计" }],
    tabTitle: "会话功能统计",
  },
  "/compliance/agreements": {
    breadcrumbs: [{ title: "合规管理" }, { title: "协议管理" }],
    tabTitle: "协议管理",
  },
  "/compliance/sensitive-words": {
    breadcrumbs: [{ title: "合规管理" }, { title: "词库管理" }],
    tabTitle: "词库管理",
  },
  "/compliance/alerts": {
    breadcrumbs: [{ title: "合规管理" }, { title: "预警列表" }],
    tabTitle: "预警列表",
  },
};

function getRouteMeta(path: string): { breadcrumbs: BreadcrumbItem[]; tabTitle: string } {
  if (routeMeta[path]) return routeMeta[path];
  // 动态路由：词库详情 /compliance/sensitive-words/:id
  const dictMatch = path.match(/^\/compliance\/sensitive-words\/(\d+)$/);
  if (dictMatch) {
    const dictId = Number(dictMatch[1]);
    const dict = dictionaryData.find((d) => d.id === dictId);
    const name = dict?.name ?? "词库详情";
    return {
      breadcrumbs: [
        { title: "合规管理" },
        { title: "词库管理", path: "/compliance/sensitive-words" },
        { title: name },
      ],
      tabTitle: name,
    };
  }
  return { breadcrumbs: [{ title: "数据看板" }], tabTitle: "页面" };
}

/* ---- 面包屑 ---- */
const breadcrumbs = computed(() => getRouteMeta(route.path).breadcrumbs);

/* ---- 页面标签 ---- */
const tabs = ref<TabItem[]>([
  { title: getRouteMeta(route.path).tabTitle, path: route.path },
]);

function ensureTab(path: string) {
  if (!tabs.value.find((t) => t.path === path)) {
    tabs.value.push({ title: getRouteMeta(path).tabTitle, path });
  }
}

function switchTab(tab: TabItem) {
  if (tab.path !== route.path) {
    router.push(tab.path);
  }
}

function closeTab(tab: TabItem) {
  const idx = tabs.value.findIndex((t) => t.path === tab.path);
  if (idx === -1) return;
  tabs.value.splice(idx, 1);
  // 如果关闭的是当前激活的标签，切换到相邻标签
  if (tab.path === route.path && tabs.value.length > 0) {
    const next = tabs.value[Math.min(idx, tabs.value.length - 1)];
    router.push(next.path);
  }
}

/* ---- 侧边栏选中 ---- */
function routeToKey(path: string): string {
  if (path === "/feature-stats") return "feature-stats";
  if (path === "/compliance/agreements") return "agreements";
  if (path.startsWith("/compliance/sensitive-words")) return "sensitive-words";
  if (path === "/compliance/alerts") return "alerts";
  return "dashboard";
}

function routeToOpenKeys(path: string): string[] {
  if (path.startsWith("/compliance")) return ["compliance"];
  return ["data"];
}

const selectedKeys = ref<string[]>([routeToKey(route.path)]);
const openKeys = ref<string[]>(routeToOpenKeys(route.path));

watch(
  () => route.path,
  (path) => {
    selectedKeys.value = [routeToKey(path)];
    const needed = routeToOpenKeys(path);
    if (!openKeys.value.includes(needed[0])) {
      openKeys.value = [...openKeys.value, ...needed];
    }
    ensureTab(path);
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

.header-breadcrumb {
  font-size: 14px;
}

/* ---- 页面标签栏 ---- */
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
  color: #1890ff;
}

.tab-item--active {
  background: #1890ff;
  color: #fff;
  border-color: #1890ff;
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
