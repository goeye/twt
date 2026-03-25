<template>
  <SiteHeader v-if="route.name !== 'about'" />
  <RouterView />
  <SiteFooter v-if="route.name !== 'about'" />
</template>

<script setup lang="ts">
import { RouterView, useRoute } from "vue-router";
import SiteHeader from "./components/layout/SiteHeader.vue";
import SiteFooter from "./components/layout/SiteFooter.vue";

const route = useRoute();
</script>
