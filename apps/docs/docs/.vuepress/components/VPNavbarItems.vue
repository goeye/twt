<script setup lang="ts">
import { computed, ref } from 'vue'
import { useData } from '@theme/useData'
import { useNavbarConfig } from '@theme/useNavbarConfig'
import { useNavbarRepo } from '@theme/useNavbarRepo'
import { useNavbarSelectLanguage } from '@theme/useNavbarSelectLanguage'
import { DeviceType, useUpdateDeviceStatus } from '@theme/useUpdateDeviceStatus'
import VPAutoLink from '@theme/VPAutoLink.vue'
import VPNavbarDropdown from '@theme/VPNavbarDropdown.vue'

const { themeLocale } = useData()
const navbarConfig = useNavbarConfig()
const navbarSelectLanguage = useNavbarSelectLanguage()
const navbarRepo = useNavbarRepo()

const isMobile = ref(false)

const navbarLabel = computed(
  () => themeLocale.value.navbarLabel ?? 'site navigation',
)

// 顺序：语言切换 → TWT.com（navbarConfig）→ repo
const navbarLinks = computed(() => [
  ...navbarSelectLanguage.value,
  ...navbarConfig.value,
  ...navbarRepo.value,
])

useUpdateDeviceStatus(
  DeviceType.Mobile,
  (mobileDesktopBreakpoint: number): void => {
    isMobile.value = window.innerWidth < mobileDesktopBreakpoint
  },
)
</script>

<template>
  <nav
    v-if="navbarLinks.length"
    class="vp-navbar-items"
    :aria-label="navbarLabel"
  >
    <div v-for="item in navbarLinks" :key="item.text" class="vp-navbar-item">
      <VPNavbarDropdown
        v-if="'children' in item"
        :class="{ mobile: isMobile }"
        :config="item"
      />
      <VPAutoLink v-else :config="item" />
    </div>
  </nav>
</template>
