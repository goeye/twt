<template>
  <div class="pagination">
    <button class="agent-btn agent-btn--ghost" type="button" :disabled="page <= 1" @click="$emit('update:page', page - 1)">
      上一页
    </button>
    <span class="agent-muted">第 {{ page }} / {{ totalPages }} 页</span>
    <button
      class="agent-btn agent-btn--ghost"
      type="button"
      :disabled="page >= totalPages"
      @click="$emit('update:page', page + 1)"
    >
      下一页
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  page: number;
  totalPages: number;
}>();

defineEmits<{
  (e: "update:page", value: number): void;
}>();
</script>

<style scoped>
.pagination {
  align-items: center;
  display: flex;
  gap: var(--agent-space-12);
  justify-content: flex-end;
}
</style>
