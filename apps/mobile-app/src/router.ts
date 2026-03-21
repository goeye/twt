import { createRouter, createWebHashHistory } from "vue-router";

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/",
      redirect: "/chat"
    },
    {
      path: "/session",
      name: "Session",
      component: () => import("./views/SessionView.vue")
    },
    {
      path: "/chat",
      name: "Chat",
      component: () => import("./views/ChatListView.vue")
    },
    {
      path: "/archive",
      name: "Archive",
      component: () => import("./views/ArchiveView.vue")
    },
    {
      path: "/profile",
      name: "Profile",
      component: () => import("./views/ProfileView.vue")
    }
  ]
});

export default router;
