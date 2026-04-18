<script setup lang="ts">
import { computed, ref, resolveComponent, useTemplateRef } from 'vue'
import { useData } from '@theme/useData'
import { DeviceType, useUpdateDeviceStatus } from '@theme/useUpdateDeviceStatus'
import VPNavbarBrand from '@theme/VPNavbarBrand.vue'
import VPNavbarItems from '@theme/VPNavbarItems.vue'
import VPToggleColorModeButton from '@theme/VPToggleColorModeButton.vue'
import VPToggleSidebarButton from '@theme/VPToggleSidebarButton.vue'

defineEmits<{ toggleSidebar: [] }>()

const SearchBox = resolveComponent('SearchBox')

const { themeLocale } = useData()
const navbar = useTemplateRef<HTMLElement | null>('navbar')
const navbarBrand = useTemplateRef<HTMLElement | null>('navbar-brand')
const linksWrapperMaxWidth = ref(0)
const linksWrapperStyle = computed(() => {
  if (!linksWrapperMaxWidth.value) return {}
  return { maxWidth: `${linksWrapperMaxWidth.value}px` }
})

const getCssValue = (el: HTMLElement | null, property: string): number => {
  const val = el?.ownerDocument.defaultView?.getComputedStyle(el, null)[property as keyof CSSStyleDeclaration]
  const num = Number.parseInt(val as string, 10)
  return Number.isNaN(num) ? 0 : num
}

useUpdateDeviceStatus(DeviceType.Mobile, (mobileDesktopBreakpoint: number): void => {
  const navbarHorizontalPadding =
    getCssValue(navbar.value, 'paddingLeft') + getCssValue(navbar.value, 'paddingRight')
  linksWrapperMaxWidth.value =
    window.innerWidth < mobileDesktopBreakpoint
      ? 0
      : navbar.value!.offsetWidth - navbarHorizontalPadding - (navbarBrand.value?.offsetWidth ?? 0)
})
</script>

<template>
  <header ref="navbar" class="vp-navbar" vp-navbar>
    <VPToggleSidebarButton @toggle="$emit('toggleSidebar')" />
    <span ref="navbar-brand">
      <VPNavbarBrand />
    </span>
    <div class="vp-navbar-items-wrapper" :style="linksWrapperStyle">
      <component :is="SearchBox" />
      <VPNavbarItems class="vp-hide-mobile" />
      <VPToggleColorModeButton v-if="themeLocale.colorModeSwitch" />
    </div>
  </header>
</template>
