<template>
  <SiteHeader v-if="!route.meta.marketing" />
  <RouterView />
  <SiteFooter v-if="!route.meta.marketing" />
</template>

<script setup lang="ts">
import { RouterView, useRoute } from "vue-router";
import SiteHeader from "./components/layout/SiteHeader.vue";
import SiteFooter from "./components/layout/SiteFooter.vue";

const route = useRoute();
</script>
