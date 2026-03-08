import { createRouter, createWebHashHistory } from "vue-router";

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: "/", redirect: "/sessions" },
    { path: "/sessions", name: "sessions", component: () => import("./views/SessionListView.vue") },
    { path: "/chat/:id?", name: "chat", component: () => import("./views/ChatView.vue") },
    { path: "/form", name: "form", component: () => import("./views/FormView.vue") },
    { path: "/minimized", name: "minimized", component: () => import("./views/MinimizedView.vue") }
  ]
});

export default router;
