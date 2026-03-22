<template>
  <article class="resource-card" @click="handleClick">
    <div class="resource-card__header">
      <img
        class="resource-card__logo"
        :src="resource.logo"
        :alt="resource.name"
        loading="lazy"
      />
      <div class="resource-card__info">
        <div class="resource-card__name-row">
          <a
            :href="cardHref"
            class="resource-card__name"
            @click.stop
          >{{ resource.name }}</a>
          <ResourceTag
            v-for="tag in resource.tags"
            :key="tag"
            :tag="tag"
          />
        </div>
        <p class="resource-card__desc">{{ resource.shortDesc }}</p>
      </div>
    </div>
    <div class="resource-card__footer">
      <div class="resource-card__stars">
        <span
          v-for="i in 5"
          :key="i"
          class="star"
          :class="{ 'star--filled': i <= resource.rating }"
        >&#9733;</span>
      </div>
    </div>

    <!-- Hover tooltip -->
    <div class="resource-card__tooltip">
      <strong>{{ resource.name }}</strong>
      <p>{{ resource.shortDesc }}</p>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import type { ResourceCard } from "../../types";
import ResourceTag from "./ResourceTag.vue";

const props = defineProps<{ resource: ResourceCard }>();
const router = useRouter();

const cardHref = computed(() => {
  if (props.resource.link.type === "external") {
    return props.resource.link.url;
  }
  return `/links/${props.resource.link.slug}`;
});

function handleClick() {
  if (props.resource.link.type === "external") {
    window.open(props.resource.link.url, "_blank", "noopener,noreferrer");
  } else {
    router.push(`/links/${props.resource.link.slug}`);
  }
}
</script>

<style scoped>
.resource-card {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: var(--links-space-8);
  padding: var(--links-space-16);
  background: var(--links-color-bg-card);
  border: 1px solid var(--links-color-border);
  border-radius: var(--links-radius-md);
  cursor: pointer;
  transition: box-shadow var(--links-motion-base), transform var(--links-motion-base);
}

.resource-card:hover {
  box-shadow: var(--links-shadow-card-hover);
  transform: translateY(-2px);
}

.resource-card__header {
  display: flex;
  gap: var(--links-space-12);
}

.resource-card__logo {
  width: 48px;
  height: 48px;
  border-radius: var(--links-radius-sm);
  object-fit: contain;
  flex-shrink: 0;
}

.resource-card__info {
  flex: 1;
  min-width: 0;
}

.resource-card__name-row {
  display: flex;
  align-items: center;
  gap: var(--links-space-4);
  flex-wrap: wrap;
}

.resource-card__name {
  font-size: var(--links-font-size-md);
  font-weight: 600;
  color: var(--links-color-text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.resource-card__name:hover {
  color: var(--links-color-primary);
}

.resource-card__desc {
  font-size: var(--links-font-size-sm);
  color: var(--links-color-text-secondary);
  margin-top: var(--links-space-4);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.resource-card__footer {
  margin-top: auto;
}

.resource-card__stars {
  display: flex;
  gap: 1px;
}

.star {
  font-size: 14px;
  color: var(--links-color-star-empty);
}

.star--filled {
  color: var(--links-color-star);
}

/* Hover tooltip */
.resource-card__tooltip {
  position: absolute;
  bottom: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.85);
  color: #fff;
  padding: var(--links-space-8) var(--links-space-12);
  border-radius: var(--links-radius-sm);
  font-size: var(--links-font-size-sm);
  white-space: nowrap;
  max-width: 280px;
  opacity: 0;
  pointer-events: none;
  transition: opacity var(--links-motion-fast);
  z-index: 10;
}

.resource-card__tooltip strong {
  display: block;
  margin-bottom: 2px;
}

.resource-card__tooltip p {
  white-space: normal;
  line-height: 1.4;
}

.resource-card:hover .resource-card__tooltip {
  opacity: 1;
}
</style>
