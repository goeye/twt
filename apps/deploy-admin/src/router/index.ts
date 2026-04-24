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
      meta: { title: '数据看板', icon: 'dashboard' },
    },
    {
      path: '/customers',
      component: () => import('../views/CustomerListPage.vue'),
      meta: { title: '客户管理', icon: 'customers' },
    },
    {
      path: '/customers/:id',
      component: () => import('../views/CustomerDetailPage.vue'),
      meta: { title: '客户详情', icon: 'customers' },
    },
    {
      path: '/licenses',
      component: () => import('../views/LicenseManagePage.vue'),
      meta: { title: 'License 管理', icon: 'licenses' },
    },
    {
      path: '/deployments',
      component: () => import('../views/DeploymentManagePage.vue'),
      meta: { title: '部署管理', icon: 'deployments' },
    },
    {
      path: '/service-config',
      component: () => import('../views/ServiceConfigPage.vue'),
      meta: { title: '服务配置', icon: 'config' },
    },
    {
      path: '/versions',
      component: () => import('../views/VersionManagePage.vue'),
      meta: { title: '版本管理', icon: 'versions' },
    },
    {
      path: '/client-versions',
      component: () => import('../views/ClientVersionPage.vue'),
      meta: { title: '客户端版本', icon: 'client-versions' },
    },
  ],
})

export default router
