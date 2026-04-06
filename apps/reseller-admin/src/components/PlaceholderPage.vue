<template>
  <div class="page-container">
    <a-card :title="title">
      <a-empty :description="`${title}功能开发中...`" />
    </a-card>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
}>()
</script>

<style scoped>
.page-container {
  background: #fff;
  padding: 24px;
  min-height: calc(100vh - 112px);
}
</style>
