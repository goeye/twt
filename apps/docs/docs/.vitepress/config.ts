import { defineConfig } from 'vitepress'

export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? '/docs/' : '/',
  title: 'TWT Chat 开发者文档',
  description: 'TWT Chat 开发者文档 - 3 分钟接入在线客服',

  locales: {
    root: {
      label: '简体中文',
      lang: 'zh-CN',
      themeConfig: {
        nav: [{ text: 'TWT.com', link: 'https://twt.com' }],
        sidebar: [
          { text: '介绍', link: '/guide/' },
          {
            text: '网站小部件',
            collapsed: false,
            items: [
              { text: '功能说明', link: '/widget/' },
              { text: '3 分钟接入', link: '/widget/installation' },
              { text: '配置项参考', link: '/widget/configuration' },
              { text: '示例项目', link: '/widget/examples' },
              { text: 'JavaScript API', link: '/widget/javascript-api' },
            ],
          },
          {
            text: '聊天页面',
            collapsed: true,
            items: [
              { text: '功能说明', link: '/chat-page/' },
              { text: '直接链接', link: '/chat-page/direct-link' },
              { text: '自托管部署', link: '/chat-page/self-hosted' },
              { text: 'URL 参数说明', link: '/chat-page/parameters' },
            ],
          },
          {
            text: '开放 API',
            collapsed: true,
            items: [
              { text: '功能说明', link: '/api/' },
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
          {
            text: 'Webhooks',
            collapsed: true,
            items: [
              { text: '功能说明', link: '/webhooks/' },
              { text: '配置指南', link: '/webhooks/setup' },
              { text: '签名校验', link: '/webhooks/signature' },
              { text: '事件类型', link: '/webhooks/events' },
              { text: '事件负载', link: '/webhooks/payload' },
            ],
          },
        ],
      },
    },
    en: {
      label: 'English',
      lang: 'en-US',
      themeConfig: {
        nav: [{ text: 'TWT.com', link: 'https://twt.com' }],
        sidebar: [{ text: 'Overview', link: '/en/guide/' }],
      },
    },
    'zh-TW': {
      label: '繁體中文',
      lang: 'zh-TW',
      themeConfig: {
        nav: [{ text: 'TWT.com', link: 'https://twt.com' }],
        sidebar: [{ text: '概覽', link: '/zh-TW/guide/' }],
      },
    },
  },

  themeConfig: {
    search: { provider: 'local' },
    outline: { level: [2, 3], label: '目录' },
  },
})
