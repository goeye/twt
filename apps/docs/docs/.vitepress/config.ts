import { defineConfig } from 'vitepress'

export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? '/docs/' : '/',
  title: 'TWT Chat 开发者文档',
  description: 'TWT Chat 开发者文档 - 3 分钟接入在线客服',

  themeConfig: {
    logo: '/twt-mark.svg',
    nav: [
      { component: 'DocLanguageSwitch' },
      { text: 'TWT.com', link: 'https://twt.com' },
    ],
    sidebar: [
      { text: '介绍', link: '/' },
      {
        text: '网站小部件',
        collapsed: true,
        link: '/widget/',
        items: [
          { text: '3 分钟接入', link: '/widget/installation' },
          { text: 'JavaScript API', link: '/widget/javascript-api' },
          { text: '示例项目', link: '/widget/examples' },
        ],
      },
      {
        text: '聊天页面',
        collapsed: true,
        link: '/chat-page/',
        items: [
          { text: '直接链接', link: '/chat-page/direct-link' },
          { text: '自托管部署', link: '/chat-page/self-hosted' },
          { text: '嵌入 WebView AppBridge', link: '/chat-page/webview-appbridge' },
          { text: 'URL 参数说明', link: '/chat-page/parameters' },
        ],
      },
      {
        text: 'Webhooks',
        collapsed: true,
        link: '/webhooks/',
        items: [
          { text: '配置指南', link: '/webhooks/setup' },
          { text: '签名校验', link: '/webhooks/signature' },
          { text: '事件类型', link: '/webhooks/events' },
          { text: '事件负载', link: '/webhooks/payload' },
        ],
      },
      {
        text: '开放 API',
        collapsed: true,
        link: '/api/',
        items: [
          { text: '鉴权与签名', link: '/api/authentication' },
          {
            text: '在线聊天',
            collapsed: true,
            items: [
              { text: '创建会话', link: '/api/chat/create-session' },
              { text: '批量创建会话', link: '/api/chat/create-session-batch' },
              { text: '创建群组', link: '/api/chat/create-group' },
              { text: '删除会话', link: '/api/chat/delete-session' },
              { text: '解散群组', link: '/api/chat/dissolve-group' },
              { text: '批量解散群组', link: '/api/chat/dissolve-group-batch' },
            ],
          },
          { text: '错误码参考', link: '/api/error-codes' },
        ],
      },
    ],
    search: { provider: 'local' },
    outline: { level: [2, 3], label: '' },
    docFooter: { prev: '上一页', next: '下一页' },
    footer: {
      copyright: 'Copyright © 2026 TWT',
    },
  },
})
