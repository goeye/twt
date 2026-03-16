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
    {
      path: "/compliance/agreements",
      component: () => import("./views/AgreementsPage.vue"),
    },
    {
      path: "/compliance/sensitive-words",
      component: () => import("./views/SensitiveWordsPage.vue"),
    },
    {
      path: "/compliance/sensitive-words/:id",
      component: () => import("./views/DictDetailPage.vue"),
    },
    {
      path: "/compliance/alerts",
      component: () => import("./views/AlertsPage.vue"),
    },
  ],
});

export default router;
