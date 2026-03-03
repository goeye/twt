<template>
  <div class="filter-bar agent-panel">
    <input
      class="agent-input"
      :value="keyword"
      placeholder="搜索"
      @input="$emit('update:keyword', ($event.target as HTMLInputElement).value)"
    />
    <select class="agent-input" :value="status" @change="$emit('update:status', ($event.target as HTMLSelectElement).value)">
      <option value="">全部状态</option>
      <option value="open">处理中</option>
      <option value="pending">待跟进</option>
      <option value="closed">已关闭</option>
    </select>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  keyword?: string;
  status?: string;
}>();

defineEmits<{
  (e: "update:keyword", value: string): void;
  (e: "update:status", value: string): void;
}>();
</script>

<style scoped>
.filter-bar {
  display: grid;
  gap: var(--agent-space-8);
  grid-template-columns: 1fr 180px;
  padding: var(--agent-space-12);
}
</style>
