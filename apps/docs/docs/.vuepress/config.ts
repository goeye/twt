import { viteBundler } from '@vuepress/bundler-vite'
import { defaultTheme } from '@vuepress/theme-default'
import { defineUserConfig } from 'vuepress'

export default defineUserConfig({
  base: '/docs/',
  dest: 'dist',
  bundler: viteBundler(),
  lang: 'zh-CN',
  title: 'TWT Chat 开发者文档',
  description: 'TWT Chat 开发者文档 - 3 分钟接入在线客服，支持网站小部件、聊天页面、REST API、Webhooks',

  theme: defaultTheme({
    siteTitle: false,
    navbar: [
      { text: 'TWT.com', link: 'https://twt.com' },
    ],
    sidebar: [
      {
        text: '快速开始',
        children: [
          '/guide/README.md',
          '/guide/quickstart.md',
          '/widget/examples.md',
        ],
      },
      {
        text: '网站小部件',
        collapsible: true,
        collapsed: false,
        children: [
          '/widget/README.md',
          '/widget/installation.md',
          '/widget/configuration.md',
          '/widget/javascript-api.md',
        ],
      },
      {
        text: '聊天页面',
        collapsible: true,
        collapsed: true,
        children: [
          '/chat-page/README.md',
          '/chat-page/direct-link.md',
          '/chat-page/self-hosted.md',
          '/chat-page/parameters.md',
        ],
      },
      {
        text: '开放 API',
        collapsible: true,
        collapsed: true,
        children: [
          '/api/README.md',
          '/api/authentication.md',
          {
            text: '在线聊天',
            collapsible: true,
            collapsed: true,
            children: [
              '/api/chat/create-session.md',
              '/api/chat/create-session-batch.md',
              '/api/chat/create-group.md',
              '/api/chat/delete-session.md',
              '/api/chat/dissolve-group.md',
              '/api/chat/dissolve-group-batch.md',
            ],
          },
          '/api/error-codes.md',
        ],
      },
      {
        text: 'Webhooks',
        collapsible: true,
        collapsed: true,
        children: [
          '/webhooks/README.md',
          '/webhooks/setup.md',
          '/webhooks/signature.md',
          '/webhooks/events.md',
          '/webhooks/payload.md',
        ],
      },
    ],
    sidebarDepth: 0,
    editLink: false,
    lastUpdated: false,
    contributors: false,
    notFound: ['页面不存在', '这里什么都没有'],
    backToHome: '返回首页',
  }),

  markdown: {
    anchor: {
      permalink: false,
    },
    toc: {
      level: [2, 3],
    },
  },
})
