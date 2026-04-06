import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      redirect: '/resellers',
    },
    {
      path: '/resellers',
      component: () => import('../views/ResellerManagePage.vue'),
      meta: { title: '代理商管理' },
    },
    {
      path: '/platform',
      component: () => import('../views/PlatformConfigPage.vue'),
      meta: { title: '平台配置' },
    },
  ],
})

export default router
