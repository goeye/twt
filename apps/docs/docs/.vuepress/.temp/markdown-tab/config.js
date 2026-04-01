import { CodeTabs } from "/Users/pg133/Downloads/TWT/TWT/twt/node_modules/.pnpm/@vuepress+plugin-markdown-tab@2.0.0-rc.71_markdown-it@14.1.1_typescript@5.9.3_vuepress@_34f766ebd81db70ebd8b507a0e924740/node_modules/@vuepress/plugin-markdown-tab/lib/client/components/CodeTabs.js";
import { Tabs } from "/Users/pg133/Downloads/TWT/TWT/twt/node_modules/.pnpm/@vuepress+plugin-markdown-tab@2.0.0-rc.71_markdown-it@14.1.1_typescript@5.9.3_vuepress@_34f766ebd81db70ebd8b507a0e924740/node_modules/@vuepress/plugin-markdown-tab/lib/client/components/Tabs.js";
import "/Users/pg133/Downloads/TWT/TWT/twt/node_modules/.pnpm/@vuepress+plugin-markdown-tab@2.0.0-rc.71_markdown-it@14.1.1_typescript@5.9.3_vuepress@_34f766ebd81db70ebd8b507a0e924740/node_modules/@vuepress/plugin-markdown-tab/lib/client/styles/vars.css";

export default {
  enhance: ({ app }) => {
    app.component("CodeTabs", CodeTabs);
    app.component("Tabs", Tabs);
  },
};
