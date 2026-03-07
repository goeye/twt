import { h } from "vue";
import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router";

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

export default createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});
