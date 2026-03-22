<template>
  <div class="banner-carousel" v-if="banners.length">
    <div class="banner-carousel__track" ref="trackRef">
      <a
        v-for="banner in banners"
        :key="banner.id"
        :href="banner.linkUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="banner-carousel__item"
      >
        <img :src="banner.imageUrl" :alt="banner.altText" loading="lazy" />
      </a>
    </div>
    <button
      v-if="canScrollLeft"
      class="banner-carousel__btn banner-carousel__btn--left"
      @click="scrollBy(-1)"
      aria-label="向左滚动"
    >&lsaquo;</button>
    <button
      v-if="canScrollRight"
      class="banner-carousel__btn banner-carousel__btn--right"
      @click="scrollBy(1)"
      aria-label="向右滚动"
    >&rsaquo;</button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import type { Banner } from "../../types";

defineProps<{ banners: Banner[] }>();

const trackRef = ref<HTMLElement | null>(null);
const canScrollLeft = ref(false);
const canScrollRight = ref(true);

function updateScrollState() {
  const el = trackRef.value;
  if (!el) return;
  canScrollLeft.value = el.scrollLeft > 0;
  canScrollRight.value = el.scrollLeft + el.clientWidth < el.scrollWidth - 1;
}

function scrollBy(direction: number) {
  const el = trackRef.value;
  if (!el) return;
  el.scrollBy({ left: direction * 400, behavior: "smooth" });
}

onMounted(() => {
  const el = trackRef.value;
  if (el) {
    el.addEventListener("scroll", updateScrollState, { passive: true });
    updateScrollState();
  }
});

onUnmounted(() => {
  trackRef.value?.removeEventListener("scroll", updateScrollState);
});
</script>

<style scoped>
.banner-carousel {
  position: relative;
  margin-bottom: var(--links-space-24);
}

.banner-carousel__track {
  display: flex;
  gap: var(--links-space-16);
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.banner-carousel__track::-webkit-scrollbar {
  display: none;
}

.banner-carousel__item {
  flex: 0 0 calc(33.333% - 11px);
  min-width: 300px;
  scroll-snap-align: start;
  border-radius: var(--links-radius-md);
  overflow: hidden;
  display: block;
}

.banner-carousel__item img {
  width: 100%;
  height: 160px;
  object-fit: cover;
}

.banner-carousel__btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: var(--links-color-text-primary);
  transition: background var(--links-motion-fast);
  z-index: 2;
}

.banner-carousel__btn:hover {
  background: #fff;
}

.banner-carousel__btn--left {
  left: -12px;
}

.banner-carousel__btn--right {
  right: -12px;
}

@media (max-width: 768px) {
  .banner-carousel__item {
    flex: 0 0 calc(50% - 8px);
    min-width: 240px;
  }
}
</style>
