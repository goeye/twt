<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  screenMenu?: boolean
}>()

const open = ref(false)
const activeLocale = ref('简体中文')

const locales = [
  { label: 'English', value: 'en' },
  { label: '简体中文', value: 'zh-CN' },
  { label: '繁体中文', value: 'zh-TW' },
]

function selectLocale(label: string) {
  activeLocale.value = label
  open.value = false
}
</script>

<template>
  <div
    class="doc-language-switch"
    :class="{
      'doc-language-switch--open': open,
      'doc-language-switch--screen-menu': screenMenu,
    }"
    @mouseenter="open = true"
    @mouseleave="open = false"
  >
    <button
      type="button"
      class="doc-language-switch__trigger"
      aria-label="切换语言"
      :aria-expanded="open"
      aria-haspopup="menu"
    >
      <span class="doc-language-switch__icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" focusable="false">
          <path d="m5 8 6 6" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.85" />
          <path d="m4 14 6-6 2-3" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.85" />
          <path d="M2 5h12" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.85" />
          <path d="M7 2h1" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.85" />
          <path d="m22 22-5-10-5 10" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.85" />
          <path d="M14 18h6" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.85" />
        </svg>
      </span>
      <span v-if="screenMenu" class="doc-language-switch__screen-label">{{ activeLocale }}</span>
    </button>

    <div v-if="open" class="doc-language-switch__menu" role="menu" aria-label="语言列表">
      <button
        v-for="locale in locales"
        :key="locale.value"
        type="button"
        class="doc-language-switch__option"
        :class="{ 'doc-language-switch__option--active': locale.label === activeLocale }"
        role="menuitemradio"
        :aria-checked="locale.label === activeLocale"
        @click="selectLocale(locale.label)"
      >
        <span>{{ locale.label }}</span>
        <span v-if="locale.label === activeLocale" class="doc-language-switch__check" aria-hidden="true">
          <svg viewBox="0 0 16 16" focusable="false">
            <path d="m3.5 8.5 2.5 2.5 6-6" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" />
          </svg>
        </span>
      </button>
    </div>
  </div>
</template>
