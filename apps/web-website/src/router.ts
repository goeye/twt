import { createRouter, createWebHistory } from "vue-router";
import { developerDocsHref } from "./constants/developerDocs";

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
      path: "/updates",
      name: "updates",
      component: () => import("./views/UpdatesPage.vue"),
      meta: {
        marketing: true,
      },
    },
    {
      path: "/help-center",
      name: "help-center",
      component: () => import("./views/HelpCenterPage.vue"),
      meta: {
        marketing: true,
      },
    },
    {
      path: "/developer-docs",
      name: "developer-docs",
      beforeEnter() {
        if (typeof window !== "undefined") {
          window.location.replace(developerDocsHref);
        }

        return false;
      },
      meta: {
        marketing: true,
      },
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
    {
      path: "/email-previews/autopilot-launch",
      name: "email-preview-autopilot",
      component: () => import("./views/EmailPreviewAutopilotPage.vue"),
    },
    {
      path: "/link",
      name: "link",
      component: () => import("./views/LinkPage.vue"),
      meta: { marketing: true },
    },
    { path: "/:pathMatch(.*)*", redirect: "/" },
  ],
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) return savedPosition;
    return { top: 0 };
  },
});

export default router;
