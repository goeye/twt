<template>
  <div class="ma-app">
    <router-view />
    <TabBar v-if="showTabBar" />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import TabBar from "./components/TabBar.vue";

const route = useRoute();
const showTabBar = computed(() => !route.meta.hideTabBar);
</script>

<style scoped>
.ma-app {
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;
  background: #f5f7f9;
}
</style>
