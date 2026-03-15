import { createRouter, createWebHashHistory } from "vue-router";

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/",
      redirect: "/dashboard",
    },
    {
      path: "/dashboard",
      component: () => import("./views/DashboardPage.vue"),
    },
    {
      path: "/feature-stats",
      component: () => import("./views/FeatureStatsPage.vue"),
    },
  ],
});

export default router;
