export const themeData = JSON.parse("{\"siteTitle\":false,\"locales\":{\"/\":{\"selectLanguageName\":\"简体中文\",\"selectLanguageText\":\"🌐\",\"navbar\":[{\"text\":\"TWT.com\",\"link\":\"https://twt.com\"}],\"sidebar\":[{\"text\":\"介绍\",\"link\":\"/guide/\"},{\"text\":\"网站小部件\",\"collapsible\":true,\"collapsed\":false,\"children\":[\"/widget/README.md\",\"/widget/installation.md\",\"/widget/javascript-api.md\"]},{\"text\":\"聊天页面\",\"collapsible\":true,\"collapsed\":true,\"children\":[\"/chat-page/README.md\",\"/chat-page/direct-link.md\",\"/chat-page/self-hosted.md\",\"/chat-page/parameters.md\"]},{\"text\":\"开放 API\",\"collapsible\":true,\"collapsed\":true,\"children\":[\"/api/README.md\",\"/api/authentication.md\",{\"text\":\"在线聊天\",\"collapsible\":true,\"collapsed\":true,\"children\":[\"/api/chat/create-session.md\",\"/api/chat/create-session-batch.md\",\"/api/chat/create-group.md\",\"/api/chat/delete-session.md\",\"/api/chat/dissolve-group.md\",\"/api/chat/dissolve-group-batch.md\"]},\"/api/error-codes.md\"]},{\"text\":\"Webhooks\",\"collapsible\":true,\"collapsed\":true,\"children\":[\"/webhooks/README.md\",\"/webhooks/setup.md\",\"/webhooks/signature.md\",\"/webhooks/events.md\",\"/webhooks/payload.md\"]}]},\"/en/\":{\"selectLanguageName\":\"English\",\"navbar\":[{\"text\":\"TWT.com\",\"link\":\"https://twt.com\"}],\"sidebar\":[{\"text\":\"Overview\",\"link\":\"/en/guide/\"}]},\"/zh-TW/\":{\"selectLanguageName\":\"繁體中文\",\"navbar\":[{\"text\":\"TWT.com\",\"link\":\"https://twt.com\"}],\"sidebar\":[{\"text\":\"概覽\",\"link\":\"/zh-TW/guide/\"}]}},\"sidebarDepth\":0,\"editLink\":false,\"lastUpdated\":false,\"contributors\":false,\"notFound\":[\"页面不存在\",\"这里什么都没有\"],\"backToHome\":\"返回首页\",\"colorMode\":\"auto\",\"colorModeSwitch\":true,\"navbar\":[],\"logo\":null,\"repo\":null,\"selectLanguageText\":\"Languages\",\"selectLanguageAriaLabel\":\"Select language\",\"sidebar\":\"heading\",\"editLinkText\":\"Edit this page\",\"contributorsText\":\"Contributors\",\"openInNewWindow\":\"open in new window\",\"toggleColorMode\":\"toggle color mode\",\"toggleSidebar\":\"toggle sidebar\"}")

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept()
  if (__VUE_HMR_RUNTIME__.updateThemeData) {
    __VUE_HMR_RUNTIME__.updateThemeData(themeData)
  }
}

if (import.meta.hot) {
  import.meta.hot.accept(({ themeData }) => {
    __VUE_HMR_RUNTIME__.updateThemeData(themeData)
  })
}
