<template>
  <SiteHeader />
  <RouterView />
  <SiteFooter />
</template>

<script setup lang="ts">
import { RouterView } from "vue-router";
import SiteHeader from "./components/layout/SiteHeader.vue";
import SiteFooter from "./components/layout/SiteFooter.vue";
</script>
