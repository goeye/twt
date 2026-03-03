<template>
  <section class="detail-panel">
    <article v-for="section in sections" :key="section.key" class="detail-section agent-panel">
      <header class="detail-section__header">
        <h3 class="agent-title">{{ section.title }}</h3>
      </header>
      <dl class="detail-section__fields">
        <div v-for="field in section.fields" :key="field.key" class="detail-field">
          <dt>{{ field.label }}</dt>
          <dd>{{ field.value }}</dd>
        </div>
      </dl>
    </article>
  </section>
</template>

<script setup lang="ts">
interface DetailField {
  key: string;
  label: string;
  value: string;
}

interface DetailSection {
  key: string;
  title: string;
  fields: DetailField[];
}

defineProps<{
  sections: DetailSection[];
}>();
</script>

<style scoped>
.detail-panel {
  display: flex;
  flex-direction: column;
  gap: var(--agent-space-12);
  height: 100%;
}

.detail-section {
  padding: var(--agent-space-12);
}

.detail-section__fields {
  display: flex;
  flex-direction: column;
  gap: var(--agent-space-8);
  margin: var(--agent-space-12) 0 0;
}

.detail-field {
  display: grid;
  gap: var(--agent-space-4);
  grid-template-columns: 88px 1fr;
}

.detail-field dt {
  color: var(--agent-color-text-tertiary);
  font-size: var(--agent-font-size-xs);
}

.detail-field dd {
  color: var(--agent-color-text-primary);
  font-size: var(--agent-font-size-sm);
  margin: 0;
}
</style>
