import { viteBundler } from '@vuepress/bundler-vite'
import { searchPlugin } from '@vuepress/plugin-search'
import { defaultTheme } from '@vuepress/theme-default'
import { defineUserConfig } from 'vuepress'
import { getDirname, path } from 'vuepress/utils'

const __dirname = getDirname(import.meta.url)

export default defineUserConfig({
  base: '/docs/',
  dest: 'dist',
  bundler: viteBundler(),

  locales: {
    '/': { lang: 'zh-CN', title: 'TWT Chat 开发者文档' },
    '/en/': { lang: 'en-US', title: 'TWT Chat Developer Docs' },
    '/zh-TW/': { lang: 'zh-TW', title: 'TWT Chat 開發者文件' },
  },

  plugins: [searchPlugin({})],
  theme: defaultTheme({
    siteTitle: false,
    locales: {
      '/': {
        selectLanguageName: '简体中文',
        selectLanguageText: '🌐',
        navbar: [{ text: 'TWT.com', link: 'https://twt.com' }],
        sidebar: [
          { text: '介绍', link: '/guide/' },
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
      },
      '/en/': {
        selectLanguageName: 'English',
        navbar: [{ text: 'TWT.com', link: 'https://twt.com' }],
        sidebar: [{ text: 'Overview', link: '/en/guide/' }],
      },
      '/zh-TW/': {
        selectLanguageName: '繁體中文',
        navbar: [{ text: 'TWT.com', link: 'https://twt.com' }],
        sidebar: [{ text: '概覽', link: '/zh-TW/guide/' }],
      },
    },
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
