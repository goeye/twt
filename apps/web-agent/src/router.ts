import { h } from "vue";
import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router";
import { usePermission } from "./composables/usePermission";

const EmptyRouteView = {
  name: "EmptyRouteView",
  render: () => h("div")
};

const routes: RouteRecordRaw[] = [
  { path: "/", redirect: "/home" },
  { path: "/home", name: "home", component: EmptyRouteView },
  { path: "/conversation", name: "conversation", component: EmptyRouteView },
  { path: "/files", name: "files", component: EmptyRouteView },
  { path: "/visitors", name: "visitors", component: EmptyRouteView },
  { path: "/customer", name: "customer", component: EmptyRouteView },
  { path: "/campaign", name: "campaign", component: EmptyRouteView },
  { path: "/report", name: "report", component: EmptyRouteView },
  { path: "/ai-agent", name: "ai-agent", component: EmptyRouteView },
  { path: "/settings", name: "settings", component: EmptyRouteView },
  { path: "/:pathMatch(.*)*", redirect: "/conversation" }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

// 路由守卫：同步检查目标路由权限（权限数据已在内存中，无需异步刷新）
router.beforeEach((to) => {
  const { canAccessRoute, showPermissionChangedModal } = usePermission();

  const routeName = typeof to.name === "string" ? to.name : "";
  if (!canAccessRoute(routeName)) {
    showPermissionChangedModal();
    return { name: "home" };
  }

  return true;
});

export default router;
