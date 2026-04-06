import { createApp } from 'vue'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'
import App from './App.vue'
import router from './router'
import { loadTenantConfig, provideTenant } from '@twt/branding'

// 加载租户配置并启动应用
loadTenantConfig().then((tenant) => {
  const app = createApp(App)

  // 提供租户配置
  provideTenant(app, tenant)

  app.use(Antd)
  app.use(router)
  app.mount('#app')
})
