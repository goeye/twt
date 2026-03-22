<template>
  <div class="detail-page" v-if="resource">
    <!-- 面包屑 -->
    <nav class="detail-breadcrumb">
      <ol>
        <li><router-link to="/links">资源导航</router-link></li>
        <li class="separator">/</li>
        <li class="current">{{ resource.name }}</li>
      </ol>
    </nav>

    <article class="detail-content">
      <!-- 主信息 -->
      <header class="detail-header">
        <img
          class="detail-header__logo"
          :src="resource.logo"
          :alt="resource.name"
        />
        <div class="detail-header__info">
          <div class="detail-header__title-row">
            <h1>{{ resource.name }}</h1>
            <ResourceTag v-for="tag in resource.tags" :key="tag" :tag="tag" />
          </div>
          <p class="detail-header__desc">{{ resource.shortDesc }}</p>
          <div class="detail-header__stars">
            <span
              v-for="i in 5"
              :key="i"
              class="star"
              :class="{ 'star--filled': i <= resource.rating }"
            >&#9733;</span>
          </div>
          <a
            v-if="externalUrl"
            :href="externalUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="detail-header__visit-btn"
          >立即访问</a>
        </div>
      </header>

      <!-- 详细描述 -->
      <section class="detail-body">
        <h2>详细介绍</h2>
        <div class="detail-body__text" v-html="resource.fullDesc"></div>
      </section>

      <!-- 截图 -->
      <section v-if="resource.screenshots.length" class="detail-screenshots">
        <h2>产品截图</h2>
        <div class="detail-screenshots__grid">
          <img
            v-for="(s, i) in resource.screenshots"
            :key="i"
            :src="s"
            :alt="`${resource.name} 截图 ${i + 1}`"
            loading="lazy"
          />
        </div>
      </section>
    </article>
  </div>

  <div v-else-if="loading" class="detail-loading">加载中...</div>
  <div v-else class="detail-not-found">
    <p>未找到该资源</p>
    <router-link to="/links">返回资源导航</router-link>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import type { ResourceDetail } from "../types";
import { fetchResourceBySlug, fetchResourceById } from "../mock";
import { useMeta } from "../composables/useMeta";
import ResourceTag from "../components/links/ResourceTag.vue";

const route = useRoute();
const router = useRouter();
const resource = ref<ResourceDetail | null>(null);
const loading = ref(true);

const metaTitle = computed(() => resource.value?.metaTitle ?? resource.value?.name ?? "资源详情");
const metaDesc = computed(() => resource.value?.metaDescription ?? resource.value?.shortDesc);
useMeta({ title: metaTitle, description: metaDesc });

const externalUrl = computed(() => {
  if (!resource.value) return null;
  if (resource.value.link.type === "external") return resource.value.link.url;
  return null;
});

onMounted(async () => {
  const slugOrId = route.params.slugOrId as string;
  // Check if it's an ID format like "1.html"
  const idMatch = slugOrId.match(/^(\d+)\.html$/);
  if (idMatch) {
    resource.value = await fetchResourceById(Number(idMatch[1]));
  } else {
    resource.value = await fetchResourceBySlug(slugOrId);
  }
  loading.value = false;

  if (!resource.value) {
    // Not found — could redirect or show error
  }
});
</script>

<style scoped>
.detail-page {
  max-width: 900px;
  margin: 0 auto;
  padding: var(--links-space-24);
}

.detail-breadcrumb ol {
  display: flex;
  align-items: center;
  gap: var(--links-space-8);
  font-size: var(--links-font-size-sm);
  color: var(--links-color-text-muted);
  margin-bottom: var(--links-space-24);
}

.detail-breadcrumb a {
  color: var(--links-color-primary);
}

.detail-breadcrumb a:hover {
  text-decoration: underline;
}

.detail-breadcrumb .current {
  color: var(--links-color-text-primary);
}

.detail-content {
  background: var(--links-color-bg-card);
  border-radius: var(--links-radius-lg);
  padding: var(--links-space-32);
  box-shadow: var(--links-shadow-card);
}

.detail-header {
  display: flex;
  gap: var(--links-space-24);
  padding-bottom: var(--links-space-24);
  border-bottom: 1px solid var(--links-color-border);
  margin-bottom: var(--links-space-24);
}

.detail-header__logo {
  width: 80px;
  height: 80px;
  border-radius: var(--links-radius-md);
  object-fit: contain;
  flex-shrink: 0;
}

.detail-header__info {
  flex: 1;
}

.detail-header__title-row {
  display: flex;
  align-items: center;
  gap: var(--links-space-8);
  flex-wrap: wrap;
}

.detail-header__title-row h1 {
  font-size: var(--links-font-size-2xl);
  font-weight: 700;
}

.detail-header__desc {
  margin-top: var(--links-space-8);
  color: var(--links-color-text-secondary);
  font-size: var(--links-font-size-md);
}

.detail-header__stars {
  margin-top: var(--links-space-8);
  display: flex;
  gap: 2px;
}

.star {
  font-size: 16px;
  color: var(--links-color-star-empty);
}

.star--filled {
  color: var(--links-color-star);
}

.detail-header__visit-btn {
  display: inline-block;
  margin-top: var(--links-space-16);
  padding: var(--links-space-8) var(--links-space-24);
  background: var(--links-color-primary);
  color: #fff;
  border-radius: var(--links-radius-sm);
  font-size: var(--links-font-size-md);
  font-weight: 500;
  transition: background var(--links-motion-fast);
}

.detail-header__visit-btn:hover {
  background: var(--links-color-primary-hover);
}

.detail-body h2,
.detail-screenshots h2 {
  font-size: var(--links-font-size-lg);
  font-weight: 600;
  margin-bottom: var(--links-space-12);
}

.detail-body__text {
  font-size: var(--links-font-size-md);
  color: var(--links-color-text-secondary);
  line-height: 1.8;
}

.detail-screenshots {
  margin-top: var(--links-space-24);
}

.detail-screenshots__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--links-space-16);
}

.detail-screenshots__grid img {
  border-radius: var(--links-radius-md);
  border: 1px solid var(--links-color-border);
}

.detail-loading,
.detail-not-found {
  text-align: center;
  padding: 80px var(--links-space-24);
  color: var(--links-color-text-muted);
  font-size: var(--links-font-size-lg);
}

.detail-not-found a {
  display: inline-block;
  margin-top: var(--links-space-16);
  color: var(--links-color-primary);
}
</style>
