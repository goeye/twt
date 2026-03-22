<template>
  <section class="featured-section" v-if="resources.length">
    <h2 class="links-section-title">
      <span class="icon">&#11088;</span>
      精选推荐
    </h2>
    <div class="links-grid">
      <ResourceCard
        v-for="r in resources"
        :key="r.id"
        :resource="r"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import type { ResourceCard as ResourceCardType } from "../../types";
import ResourceCard from "./ResourceCard.vue";

defineProps<{ resources: ResourceCardType[] }>();
</script>

<style scoped>
.featured-section {
  margin-bottom: var(--links-space-32);
  padding: var(--links-space-20);
  background: linear-gradient(135deg, #fff7e6 0%, #e6f4ff 100%);
  border-radius: var(--links-radius-lg);
}
</style>
