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
    },
    {
      path: "/session/:id",
      name: "SessionDetail",
      component: () => import("./views/SessionDetailView.vue"),
      meta: { hideTabBar: true }
    },
    {
      path: "/session/:id/info",
      name: "SessionInfo",
      component: () => import("./views/SessionInfoView.vue"),
      meta: { hideTabBar: true }
    },
    {
      path: "/session/:id/add-agent",
      name: "AddAgent",
      component: () => import("./views/AddAgentView.vue"),
      meta: { hideTabBar: true }
    },
    {
      path: "/session/:id/transfer",
      name: "TransferSession",
      component: () => import("./views/TransferSessionView.vue"),
      meta: { hideTabBar: true }
    }
  ]
});

export default router;
