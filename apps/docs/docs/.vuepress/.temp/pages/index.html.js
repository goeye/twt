import comp from "/Users/pg133/Downloads/TWT/TWT/twt/apps/docs/docs/.vuepress/.temp/pages/index.html.vue"
const data = JSON.parse("{\"path\":\"/\",\"title\":\"TWT Chat 开发者文档\",\"lang\":\"zh-CN\",\"frontmatter\":{\"home\":true,\"title\":\"TWT Chat 开发者文档\",\"heroText\":\"TWT Chat 开发者文档\",\"tagline\":\"快速接入在线客服，为你的网站和应用添加实时聊天能力\",\"actions\":[{\"text\":\"快速开始\",\"link\":\"/guide/quickstart\",\"type\":\"primary\"},{\"text\":\"开放 API\",\"link\":\"/api/\",\"type\":\"secondary\"}],\"features\":[{\"title\":\"网站小部件\",\"details\":\"一行代码嵌入聊天组件到你的网站，支持自定义外观和行为\",\"link\":\"/widget/\"},{\"title\":\"聊天页面\",\"details\":\"生成独立聊天链接或自托管 HTML 页面，适用于邮件、App、社交媒体等场景\",\"link\":\"/chat-page/\"},{\"title\":\"Webhooks\",\"details\":\"实时接收平台事件推送，与你的业务系统无缝集成\",\"link\":\"/webhooks/\"},{\"title\":\"开放 API\",\"details\":\"通过 REST API 管理会话、发送消息，实现深度业务集成\",\"link\":\"/api/\"}]},\"headers\":[],\"git\":{},\"filePathRelative\":\"index.md\"}")
export { comp, data }

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept()
  if (__VUE_HMR_RUNTIME__.updatePageData) {
    __VUE_HMR_RUNTIME__.updatePageData(data)
  }
}

if (import.meta.hot) {
  import.meta.hot.accept(({ data }) => {
    __VUE_HMR_RUNTIME__.updatePageData(data)
  })
}
