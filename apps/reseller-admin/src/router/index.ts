import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      redirect: '/dashboard',
    },
    {
      path: '/dashboard',
      component: () => import('../views/DashboardPage.vue'),
      meta: { title: '数据看板' },
    },
    {
      path: '/brand',
      component: () => import('../views/BrandConfigPage.vue'),
      meta: { title: '品牌配置' },
    },
    {
      path: '/website',
      component: () => import('../views/WebsiteConfigPage.vue'),
      meta: { title: '官网配置' },
    },
    {
      path: '/projects',
      component: () => import('../views/ProjectManagePage.vue'),
      meta: { title: '项目管理' },
    },
    {
      path: '/orders',
      component: () => import('../views/OrderManagePage.vue'),
      meta: { title: '订单管理' },
    },
    {
      path: '/commission',
      component: () => import('../views/CommissionManagePage.vue'),
      meta: { title: '佣金管理' },
    },
    {
      path: '/email',
      component: () => import('../views/EmailManagePage.vue'),
      meta: { title: '邮件管理' },
    },
    {
      path: '/oss',
      component: () => import('../views/OSSManagePage.vue'),
      meta: { title: 'OSS 管理' },
    },
    {
      path: '/domain',
      component: () => import('../views/DomainBindPage.vue'),
      meta: { title: '域名绑定' },
    },
  ],
})

export default router
