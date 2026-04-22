import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import DocLanguageSwitch from './components/DocLanguageSwitch.vue'
import DocLayout from './components/DocLayout.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  Layout: DocLayout,
  enhanceApp({ app }) {
    app.component('DocLanguageSwitch', DocLanguageSwitch)
  },
} satisfies Theme
