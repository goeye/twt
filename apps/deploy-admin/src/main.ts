import { createApp } from 'vue'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'
import App from './App.vue'
import router from './router'
import { loadTenantConfig, provideTenant } from '@twt/branding'

loadTenantConfig().then((tenant) => {
  const app = createApp(App)
  provideTenant(app, tenant)
  app.use(Antd)
  app.use(router)
  app.mount('#app')
})
