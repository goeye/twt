import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "./styles/reset.css";
import "./styles/tokens.css";
import "./styles/global.css";
import { loadTenantConfig, provideTenant } from "@twt/branding";

async function bootstrap() {
  // 加载租户配置
  const tenantConfig = await loadTenantConfig();

  // 创建 Vue 应用
  const app = createApp(App);

  // 提供租户配置
  provideTenant(app, tenantConfig);

  // 注入 CSS 变量（覆盖默认主题色）
  document.documentElement.style.setProperty(
    "--brand-primary",
    tenantConfig.primaryColor
  );

  // 设置页面标题和 favicon
  document.title = tenantConfig.website.heroTitle || tenantConfig.displayName;

  const favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
  if (favicon) {
    favicon.href = tenantConfig.favicon;
  }

  // 注册插件
  app.use(router);

  // 挂载应用
  app.mount("#app");
}

bootstrap();
