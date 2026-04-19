export const siteData = JSON.parse("{\"base\":\"/docs/\",\"lang\":\"en-US\",\"title\":\"\",\"description\":\"\",\"head\":[],\"locales\":{\"/\":{\"lang\":\"zh-CN\",\"title\":\"TWT Chat 开发者文档\"},\"/en/\":{\"lang\":\"en-US\",\"title\":\"TWT Chat Developer Docs\"},\"/zh-TW/\":{\"lang\":\"zh-TW\",\"title\":\"TWT Chat 開發者文件\"}}}")

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept()
  __VUE_HMR_RUNTIME__.updateSiteData?.(siteData)
}

if (import.meta.hot) {
  import.meta.hot.accept((m) => {
    __VUE_HMR_RUNTIME__.updateSiteData?.(m.siteData)
  })
}
