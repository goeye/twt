<template>
  <div class="empty-state">
    <p class="empty-state__title">{{ title }}</p>
    <p class="empty-state__desc">{{ description }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  description?: string;
}>();
</script>

<style scoped>
.empty-state {
  color: var(--agent-color-text-tertiary);
  display: grid;
  gap: var(--agent-space-4);
  place-items: center;
  text-align: center;
}

.empty-state__title {
  color: var(--agent-color-text-secondary);
  font-size: var(--agent-font-size-sm);
  margin: 0;
}

.empty-state__desc {
  font-size: var(--agent-font-size-xs);
  margin: 0;
}
</style>
