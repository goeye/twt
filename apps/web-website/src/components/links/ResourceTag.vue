<template>
  <span class="resource-tag" :class="`resource-tag--${tagClass}`">{{ tag }}</span>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { ResourceTag } from "../../types";

const props = defineProps<{ tag: ResourceTag }>();

const tagClass = computed(() => {
  const map: Record<ResourceTag, string> = {
    "推荐": "featured",
    TOP: "top",
    NEW: "new",
    "优": "quality",
  };
  return map[props.tag] ?? "default";
});
</script>

<style scoped>
.resource-tag {
  display: inline-block;
  padding: 1px 6px;
  border-radius: 3px;
  font-size: var(--links-font-size-xs);
  font-weight: 500;
  line-height: 18px;
  white-space: nowrap;
}

.resource-tag--featured {
  color: var(--links-color-tag-featured);
  background: var(--links-color-tag-featured-bg);
}

.resource-tag--top {
  color: var(--links-color-tag-top);
  background: var(--links-color-tag-top-bg);
}

.resource-tag--new {
  color: var(--links-color-tag-new);
  background: var(--links-color-tag-new-bg);
}

.resource-tag--quality {
  color: var(--links-color-tag-quality);
  background: var(--links-color-tag-quality-bg);
}
</style>
