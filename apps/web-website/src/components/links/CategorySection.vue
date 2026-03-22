<template>
  <section class="category-section" :id="`cat-${category.slug}`">
    <h2 class="links-section-title">
      <span class="icon">{{ category.icon }}</span>
      {{ category.name }}
    </h2>

    <!-- Sub-category tabs -->
    <div v-if="category.subCategories.length" class="links-sub-tabs">
      <button
        class="links-sub-tab"
        :class="{ 'links-sub-tab--active': activeSubId === null }"
        @click="activeSubId = null"
      >全部</button>
      <button
        v-for="sub in category.subCategories"
        :key="sub.id"
        class="links-sub-tab"
        :class="{ 'links-sub-tab--active': activeSubId === sub.id }"
        @click="activeSubId = sub.id"
      >{{ sub.name }}</button>
    </div>

    <div class="links-grid">
      <ResourceCard
        v-for="r in filteredResources"
        :key="r.id"
        :resource="r"
      />
    </div>

    <div v-if="!filteredResources.length" class="category-section__empty">
      暂无资源
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import type { Category, ResourceCard as ResourceCardType } from "../../types";
import ResourceCard from "./ResourceCard.vue";

const props = defineProps<{
  category: Category;
  resources: ResourceCardType[];
}>();

const activeSubId = ref<number | null>(null);

const filteredResources = computed(() => {
  if (activeSubId.value === null) return props.resources;
  return props.resources.filter((r) => r.subCategoryId === activeSubId.value);
});
</script>

<style scoped>
.category-section {
  margin-bottom: var(--links-space-32);
}

.category-section__empty {
  padding: var(--links-space-32);
  text-align: center;
  color: var(--links-color-text-muted);
  font-size: var(--links-font-size-md);
}
</style>
