import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("./views/HomePage.vue"),
      meta: {
        marketing: true,
      },
    },
    {
      path: "/about",
      redirect: "/",
    },
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
    { path: "/:pathMatch(.*)*", redirect: "/" },
  ],
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) return savedPosition;
    return { top: 0 };
  },
});

export default router;
