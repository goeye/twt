import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: "/", redirect: "/links" },
    {
      path: "/links",
      name: "links-list",
      component: () => import("./views/LinksListPage.vue"),
    },
    {
      path: "/links/:slugOrId",
      name: "links-detail",
      component: () => import("./views/LinkDetailPage.vue"),
      props: true,
    },
    { path: "/:pathMatch(.*)*", redirect: "/links" },
  ],
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) return savedPosition;
    return { top: 0 };
  },
});

export default router;
