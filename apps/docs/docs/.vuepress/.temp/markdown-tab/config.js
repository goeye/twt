import { CodeTabs } from "/Users/pg133/Downloads/TWT/TWT/twt/node_modules/.pnpm/@vuepress+plugin-markdown-tab@2.0.0-rc.128_@vuepress+bundler-vite@2.0.0-rc.28_@types+no_962b303ed1146486b4d30e1178f24ced/node_modules/@vuepress/plugin-markdown-tab/dist/client/components/CodeTabs.js";
import { Tabs } from "/Users/pg133/Downloads/TWT/TWT/twt/node_modules/.pnpm/@vuepress+plugin-markdown-tab@2.0.0-rc.128_@vuepress+bundler-vite@2.0.0-rc.28_@types+no_962b303ed1146486b4d30e1178f24ced/node_modules/@vuepress/plugin-markdown-tab/dist/client/components/Tabs.js";

export default {
  enhance: ({ app }) => {
    app.component("CodeTabs", CodeTabs);
    app.component("Tabs", Tabs);
  },
};
