export const themeData = JSON.parse("{\"logo\":\"/images/logo.png\",\"navbar\":false,\"sidebar\":[{\"text\":\"快速开始\",\"children\":[\"/guide/README.md\",\"/guide/quickstart.md\"]},{\"text\":\"网站小部件\",\"children\":[\"/widget/README.md\",\"/widget/installation.md\",\"/widget/configuration.md\",\"/widget/javascript-api.md\"]},{\"text\":\"聊天页面\",\"children\":[\"/chat-page/README.md\",\"/chat-page/direct-link.md\",\"/chat-page/self-hosted.md\",\"/chat-page/parameters.md\"]},{\"text\":\"Webhooks\",\"children\":[\"/webhooks/README.md\",\"/webhooks/setup.md\",\"/webhooks/signature.md\",\"/webhooks/events.md\",\"/webhooks/payload.md\"]},{\"text\":\"开放 API\",\"children\":[\"/api/README.md\",\"/api/authentication.md\",{\"text\":\"在线聊天\",\"children\":[\"/api/chat/README.md\",\"/api/chat/create-session.md\",\"/api/chat/create-session-batch.md\",\"/api/chat/create-group.md\",\"/api/chat/delete-session.md\",\"/api/chat/dissolve-group.md\",\"/api/chat/dissolve-group-batch.md\"]},\"/api/error-codes.md\"]}],\"sidebarDepth\":0,\"editLink\":false,\"lastUpdated\":true,\"lastUpdatedText\":\"最后更新\",\"contributors\":false,\"notFound\":[\"页面不存在\",\"这里什么都没有\"],\"backToHome\":\"返回首页\",\"locales\":{\"/\":{\"selectLanguageName\":\"English\"}},\"colorMode\":\"auto\",\"colorModeSwitch\":true,\"repo\":null,\"selectLanguageText\":\"Languages\",\"selectLanguageAriaLabel\":\"Select language\",\"editLinkText\":\"Edit this page\",\"contributorsText\":\"Contributors\",\"openInNewWindow\":\"open in new window\",\"toggleColorMode\":\"toggle color mode\",\"toggleSidebar\":\"toggle sidebar\"}")

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
