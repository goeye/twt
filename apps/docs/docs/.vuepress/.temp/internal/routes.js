export const redirects = JSON.parse("{}")

export const routes = Object.fromEntries([
  ["/", { loader: () => import(/* webpackChunkName: "index.html" */"/Users/pg133/Downloads/TWT/TWT/twt/apps/docs/docs/index.md"), meta: {"title":""} }],
  ["/why-twt-chat.html", { loader: () => import(/* webpackChunkName: "why-twt-chat.html" */"/Users/pg133/Downloads/TWT/TWT/twt/apps/docs/docs/why-twt-chat.md"), meta: {"title":"为什么选择 TWT Chat"} }],
  ["/api/", { loader: () => import(/* webpackChunkName: "api_index.html" */"/Users/pg133/Downloads/TWT/TWT/twt/apps/docs/docs/api/README.md"), meta: {"title":"功能说明"} }],
  ["/api/authentication.html", { loader: () => import(/* webpackChunkName: "api_authentication.html" */"/Users/pg133/Downloads/TWT/TWT/twt/apps/docs/docs/api/authentication.md"), meta: {"title":"鉴权与签名"} }],
  ["/api/error-codes.html", { loader: () => import(/* webpackChunkName: "api_error-codes.html" */"/Users/pg133/Downloads/TWT/TWT/twt/apps/docs/docs/api/error-codes.md"), meta: {"title":"错误码参考"} }],
  ["/chat-page/", { loader: () => import(/* webpackChunkName: "chat-page_index.html" */"/Users/pg133/Downloads/TWT/TWT/twt/apps/docs/docs/chat-page/README.md"), meta: {"title":"功能说明"} }],
  ["/chat-page/direct-link.html", { loader: () => import(/* webpackChunkName: "chat-page_direct-link.html" */"/Users/pg133/Downloads/TWT/TWT/twt/apps/docs/docs/chat-page/direct-link.md"), meta: {"title":"直接链接"} }],
  ["/chat-page/parameters.html", { loader: () => import(/* webpackChunkName: "chat-page_parameters.html" */"/Users/pg133/Downloads/TWT/TWT/twt/apps/docs/docs/chat-page/parameters.md"), meta: {"title":"URL 参数说明"} }],
  ["/chat-page/self-hosted.html", { loader: () => import(/* webpackChunkName: "chat-page_self-hosted.html" */"/Users/pg133/Downloads/TWT/TWT/twt/apps/docs/docs/chat-page/self-hosted.md"), meta: {"title":"自托管部署"} }],
  ["/webhooks/", { loader: () => import(/* webpackChunkName: "webhooks_index.html" */"/Users/pg133/Downloads/TWT/TWT/twt/apps/docs/docs/webhooks/README.md"), meta: {"title":"功能说明"} }],
  ["/webhooks/events.html", { loader: () => import(/* webpackChunkName: "webhooks_events.html" */"/Users/pg133/Downloads/TWT/TWT/twt/apps/docs/docs/webhooks/events.md"), meta: {"title":"事件类型"} }],
  ["/webhooks/payload.html", { loader: () => import(/* webpackChunkName: "webhooks_payload.html" */"/Users/pg133/Downloads/TWT/TWT/twt/apps/docs/docs/webhooks/payload.md"), meta: {"title":"请求体结构"} }],
  ["/webhooks/setup.html", { loader: () => import(/* webpackChunkName: "webhooks_setup.html" */"/Users/pg133/Downloads/TWT/TWT/twt/apps/docs/docs/webhooks/setup.md"), meta: {"title":"配置指南"} }],
  ["/webhooks/signature.html", { loader: () => import(/* webpackChunkName: "webhooks_signature.html" */"/Users/pg133/Downloads/TWT/TWT/twt/apps/docs/docs/webhooks/signature.md"), meta: {"title":"签名校验"} }],
  ["/guide/", { loader: () => import(/* webpackChunkName: "guide_index.html" */"/Users/pg133/Downloads/TWT/TWT/twt/apps/docs/docs/guide/README.md"), meta: {"title":"TWT Chat 开发者文档"} }],
  ["/guide/quickstart.html", { loader: () => import(/* webpackChunkName: "guide_quickstart.html" */"/Users/pg133/Downloads/TWT/TWT/twt/apps/docs/docs/guide/quickstart.md"), meta: {"title":"3 分钟接入"} }],
  ["/widget/", { loader: () => import(/* webpackChunkName: "widget_index.html" */"/Users/pg133/Downloads/TWT/TWT/twt/apps/docs/docs/widget/README.md"), meta: {"title":"功能说明"} }],
  ["/widget/examples.html", { loader: () => import(/* webpackChunkName: "widget_examples.html" */"/Users/pg133/Downloads/TWT/TWT/twt/apps/docs/docs/widget/examples.md"), meta: {"title":"示例项目"} }],
  ["/widget/installation.html", { loader: () => import(/* webpackChunkName: "widget_installation.html" */"/Users/pg133/Downloads/TWT/TWT/twt/apps/docs/docs/widget/installation.md"), meta: {"title":"3 分钟接入"} }],
  ["/widget/javascript-api.html", { loader: () => import(/* webpackChunkName: "widget_javascript-api.html" */"/Users/pg133/Downloads/TWT/TWT/twt/apps/docs/docs/widget/javascript-api.md"), meta: {"title":"JavaScript API"} }],
  ["/zh-TW/guide/", { loader: () => import(/* webpackChunkName: "zh-TW_guide_index.html" */"/Users/pg133/Downloads/TWT/TWT/twt/apps/docs/docs/zh-TW/guide/README.md"), meta: {"title":"概覽"} }],
  ["/api/chat/", { loader: () => import(/* webpackChunkName: "api_chat_index.html" */"/Users/pg133/Downloads/TWT/TWT/twt/apps/docs/docs/api/chat/README.md"), meta: {"title":"在线聊天"} }],
  ["/api/chat/create-group.html", { loader: () => import(/* webpackChunkName: "api_chat_create-group.html" */"/Users/pg133/Downloads/TWT/TWT/twt/apps/docs/docs/api/chat/create-group.md"), meta: {"title":"创建群聊-批量"} }],
  ["/api/chat/create-session-batch.html", { loader: () => import(/* webpackChunkName: "api_chat_create-session-batch.html" */"/Users/pg133/Downloads/TWT/TWT/twt/apps/docs/docs/api/chat/create-session-batch.md"), meta: {"title":"创建单聊-批量"} }],
  ["/api/chat/create-session.html", { loader: () => import(/* webpackChunkName: "api_chat_create-session.html" */"/Users/pg133/Downloads/TWT/TWT/twt/apps/docs/docs/api/chat/create-session.md"), meta: {"title":"创建单聊"} }],
  ["/api/chat/delete-session.html", { loader: () => import(/* webpackChunkName: "api_chat_delete-session.html" */"/Users/pg133/Downloads/TWT/TWT/twt/apps/docs/docs/api/chat/delete-session.md"), meta: {"title":"删除单聊"} }],
  ["/api/chat/dissolve-group-batch.html", { loader: () => import(/* webpackChunkName: "api_chat_dissolve-group-batch.html" */"/Users/pg133/Downloads/TWT/TWT/twt/apps/docs/docs/api/chat/dissolve-group-batch.md"), meta: {"title":"批量解散群聊"} }],
  ["/api/chat/dissolve-group.html", { loader: () => import(/* webpackChunkName: "api_chat_dissolve-group.html" */"/Users/pg133/Downloads/TWT/TWT/twt/apps/docs/docs/api/chat/dissolve-group.md"), meta: {"title":"解散群聊"} }],
  ["/en/guide/", { loader: () => import(/* webpackChunkName: "en_guide_index.html" */"/Users/pg133/Downloads/TWT/TWT/twt/apps/docs/docs/en/guide/README.md"), meta: {"title":"Overview"} }],
  ["/404.html", { loader: () => import(/* webpackChunkName: "404.html" */"/Users/pg133/Downloads/TWT/TWT/twt/apps/docs/docs/.vuepress/.temp/pages/404.html.vue"), meta: {"title":""} }],
]);

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept()
  __VUE_HMR_RUNTIME__.updateRoutes?.(routes)
  __VUE_HMR_RUNTIME__.updateRedirects?.(redirects)
}

if (import.meta.hot) {
  import.meta.hot.accept((m) => {
    __VUE_HMR_RUNTIME__.updateRoutes?.(m.routes)
    __VUE_HMR_RUNTIME__.updateRedirects?.(m.redirects)
  })
}
