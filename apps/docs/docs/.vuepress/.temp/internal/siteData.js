export const siteData = JSON.parse("{\"base\":\"/docs/\",\"lang\":\"zh-CN\",\"title\":\"TWT Chat 开发者文档\",\"description\":\"TWT Chat 开发者接入文档 - 网站小部件、聊天页面、Webhooks、开放 API\",\"head\":[],\"locales\":{}}")

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept()
  if (__VUE_HMR_RUNTIME__.updateSiteData) {
    __VUE_HMR_RUNTIME__.updateSiteData(siteData)
  }
}

if (import.meta.hot) {
  import.meta.hot.accept(({ siteData }) => {
    __VUE_HMR_RUNTIME__.updateSiteData(siteData)
  })
}
