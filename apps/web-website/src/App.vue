<template>
  <SiteHeader v-if="!route.meta.marketing" />
  <RouterView />
  <SiteFooter v-if="!route.meta.marketing" />
  <VersionUpdateModal :open="versionState.hasUpdate" :notes="versionState.notes" @refresh="doRefresh" />
</template>

<script setup lang="ts">
import { RouterView, useRoute } from "vue-router";
import SiteHeader from "./components/layout/SiteHeader.vue";
import SiteFooter from "./components/layout/SiteFooter.vue";
import VersionUpdateModal from "./components/VersionUpdateModal.vue";
import { useVersionCheck } from "./composables/useVersionCheck";

const route = useRoute();
const { versionState, doRefresh } = useVersionCheck();
</script>
