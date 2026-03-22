<template>
  <div class="links-page">
    <div class="links-sidebar">
      <CategorySidebar
        :categories="categories"
        :activeId="activeId"
        @navigate="scrollToSection"
      />
    </div>

    <main class="links-main">
      <BannerCarousel :banners="bannerList" />
      <FeaturedSection :resources="featuredList" />

      <CategorySection
        v-for="cat in categories"
        :key="cat.id"
        :category="cat"
        :resources="resourceMap[cat.id] ?? []"
      />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import type { Banner, Category, ResourceCard } from "../types";
import {
  fetchBanners,
  fetchCategories,
  fetchFeatured,
  fetchResourcesByCategory,
} from "../mock";
import { useActiveCategory } from "../composables/useActiveCategory";
import { useMeta } from "../composables/useMeta";
import CategorySidebar from "../components/links/CategorySidebar.vue";
import BannerCarousel from "../components/links/BannerCarousel.vue";
import FeaturedSection from "../components/links/FeaturedSection.vue";
import CategorySection from "../components/links/CategorySection.vue";

useMeta({
  title: "资源导航 - TWT 跨境工具导航",
  description: "精选跨境电商、TikTok、支付金融等优质资源工具导航",
});

const bannerList = ref<Banner[]>([]);
const categories = ref<Category[]>([]);
const featuredList = ref<ResourceCard[]>([]);
const resourceMap = ref<Record<number, ResourceCard[]>>({});

const { activeId } = useActiveCategory(categories.value);

onMounted(async () => {
  const [banners, cats, featured] = await Promise.all([
    fetchBanners(),
    fetchCategories(),
    fetchFeatured(),
  ]);

  bannerList.value = banners;
  categories.value = cats;
  featuredList.value = featured;

  // Load resources for each category
  const map: Record<number, ResourceCard[]> = {};
  await Promise.all(
    cats.map(async (cat) => {
      map[cat.id] = await fetchResourcesByCategory(cat.id);
    })
  );
  resourceMap.value = map;
});

function scrollToSection(categoryId: number) {
  const cat = categories.value.find((c) => c.id === categoryId);
  if (!cat) return;
  const el = document.getElementById(`cat-${cat.slug}`);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}
</script>
