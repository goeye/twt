<template>
  <div class="ma-app">
    <router-view />
    <TabBar />
  </div>
</template>

<script setup lang="ts">
import TabBar from "./components/TabBar.vue";
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
