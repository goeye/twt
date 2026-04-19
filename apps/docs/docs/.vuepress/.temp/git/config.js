import { GitContributors } from "/Users/pg133/Downloads/TWT/TWT/twt/node_modules/.pnpm/@vuepress+plugin-git@2.0.0-rc.128_@vuepress+bundler-vite@2.0.0-rc.28_@types+node@25.3.3_426f4aac7eb10b881fe44905e58d71c7/node_modules/@vuepress/plugin-git/dist/client/components/GitContributors.js";
import { GitChangelog } from "/Users/pg133/Downloads/TWT/TWT/twt/node_modules/.pnpm/@vuepress+plugin-git@2.0.0-rc.128_@vuepress+bundler-vite@2.0.0-rc.28_@types+node@25.3.3_426f4aac7eb10b881fe44905e58d71c7/node_modules/@vuepress/plugin-git/dist/client/components/GitChangelog.js";

export default {
  enhance: ({ app }) => {
    app.component("GitContributors", GitContributors);
    app.component("GitChangelog", GitChangelog);
  },
};
