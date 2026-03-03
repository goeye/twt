<template>
  <section class="table-wrap" :class="{ 'agent-panel': !bare }">
    <table class="agent-table">
      <thead>
        <tr>
          <th v-for="col in columns" :key="String(col.key)" :style="col.width ? `width: ${col.width}` : undefined">
            {{ col.title }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="rows.length === 0">
          <td :colspan="columns.length">
            <slot name="empty" />
          </td>
        </tr>
        <tr v-for="(row, index) in rows" v-else :key="index">
          <td v-for="col in columns" :key="String(col.key)">
            <slot :name="`cell-${String(col.key)}`" :value="getCellValue(row, col.key)" :row="row">
              {{ getCellValue(row, col.key) }}
            </slot>
          </td>
        </tr>
      </tbody>
    </table>
  </section>
</template>

<script setup lang="ts" generic="T extends Record<string, unknown>">
import type { TableColumn } from "../../types";

defineProps<{
  columns: TableColumn<T>[];
  rows: T[];
  bare?: boolean;
}>();

const getCellValue = (row: T, key: TableColumn<T>["key"]) => {
  const value = row[key as keyof T];
  if (value === null || value === undefined) return "";
  return String(value);
};
</script>

<style scoped>
.table-wrap {
  overflow: hidden;
}

.agent-table {
  border-collapse: collapse;
  width: 100%;
}

.agent-table th,
.agent-table td {
  border-bottom: 1px solid var(--agent-color-border-default);
  font-size: var(--agent-font-size-sm);
  padding: 10px 12px;
  text-align: left;
}

.agent-table th {
  background: var(--agent-color-bg-muted);
  color: var(--agent-color-text-secondary);
  font-weight: var(--agent-font-weight-medium);
}

.agent-table td {
  color: var(--agent-color-text-primary);
}
</style>
