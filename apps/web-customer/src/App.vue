<template>
  <div class="cw-app">
    <router-view />
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.cw-app {
  display: flex;
  flex-direction: column;
  height: 100%;
  max-width: 420px;
  margin: 0 auto;
  background: #fff;
  box-shadow: 0 0 40px rgba(0, 0, 0, 0.08);
  position: relative;
  overflow: visible;
}
</style>
