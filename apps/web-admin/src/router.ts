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
      path: "/prompt/list",
      component: () => import("./views/PromptListPage.vue"),
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
    {
      path: "/links/banners",
      component: () => import("./views/BannerListPage.vue"),
    },
    {
      path: "/links/categories",
      component: () => import("./views/CategoryListPage.vue"),
    },
    {
      path: "/links/resources",
      component: () => import("./views/ResourceListPage.vue"),
    },
    {
      path: "/links/resources/:id",
      component: () => import("./views/ResourceEditPage.vue"),
    },
    {
      path: "/content/api-docs",
      component: () => import("./views/ApiDocsListPage.vue"),
    },
    {
      path: "/content/api-docs/:id",
      component: () => import("./views/ApiDocEditPage.vue"),
    },
    {
      path: "/project/list",
      component: () => import("./views/ProjectListPage.vue"),
    },
    {
      path: "/project/clients",
      component: () => import("./views/ClientListPage.vue"),
    },
    {
      path: "/project/sessions",
      component: () => import("./views/SessionListPage.vue"),
    },
    {
      path: "/project/chats",
      component: () => import("./views/ChatListPage.vue"),
    },
    {
      path: "/project/domains",
      component: () => import("./views/DomainListPage.vue"),
    },
    {
      path: "/project/visitors",
      component: () => import("./views/VisitorListPage.vue"),
    },
  ],
});

export default router;
