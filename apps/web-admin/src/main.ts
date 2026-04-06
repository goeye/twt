import { createApp } from "vue";
import Antd from "ant-design-vue";
import App from "./App.vue";
import router from "./router";
import "ant-design-vue/dist/reset.css";
import "./styles.css";
import { loadTenantConfig, provideTenant } from "@twt/branding";

async function bootstrap() {
  // 加载租户配置
  const tenantConfig = await loadTenantConfig();

  // 创建 Vue 应用
  const app = createApp(App);

  // 提供租户配置
  provideTenant(tenantConfig);

  // 注入 CSS 变量（覆盖默认主题色）
  document.documentElement.style.setProperty(
    "--admin-color-brand-primary",
    tenantConfig.primaryColor
  );

  // 设置页面标题和 favicon
  document.title = `${tenantConfig.displayName} - 运营后台`;

  const favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
  if (favicon) {
    favicon.href = tenantConfig.favicon;
  }

  // 注册插件
  app.use(Antd);
  app.use(router);

  // 挂载应用
  app.mount("#app");
}

bootstrap();
