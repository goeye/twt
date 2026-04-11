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
      path: "/profile/info",
      name: "ProfileInfo",
      component: () => import("./views/ProfileInfoView.vue"),
      meta: { hideTabBar: true }
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
    },
    {
      path: "/session/:id/add-tags",
      name: "AddVisitorTags",
      component: () => import("./views/AddVisitorTagsView.vue"),
      meta: { hideTabBar: true }
    },
    {
      path: "/archive/session/:id",
      name: "ArchiveSessionDetail",
      component: () => import("./views/ArchiveSessionDetailView.vue"),
      meta: { hideTabBar: true }
    },
    {
      path: "/archive/filters",
      name: "ArchiveFilters",
      component: () => import("./views/ArchiveFiltersView.vue"),
      meta: { hideTabBar: true }
    },
    {
      path: "/archive/chat-filters",
      name: "ArchiveChatFilters",
      component: () => import("./views/ArchiveChatFiltersView.vue"),
      meta: { hideTabBar: true }
    },
    {
      path: "/settings",
      name: "Settings",
      component: () => import("./views/SettingsView.vue"),
      meta: { hideTabBar: true }
    },
    {
      path: "/settings/notification",
      name: "NotificationSettings",
      component: () => import("./views/NotificationSettingsView.vue"),
      meta: { hideTabBar: true }
    },
    {
      path: "/switch-project",
      name: "SwitchProject",
      component: () => import("./views/SwitchProjectView.vue"),
      meta: { hideTabBar: true }
    },
    {
      path: "/session/:id/edit-title",
      name: "EditSessionTitle",
      component: () => import("./views/EditSessionTitleView.vue"),
      meta: { hideTabBar: true }
    },
    {
      path: "/archive/chat/:id",
      name: "ArchiveChatDetail",
      component: () => import("./views/ArchiveChatDetailView.vue"),
      meta: { hideTabBar: true }
    }
  ]
});

export default router;
