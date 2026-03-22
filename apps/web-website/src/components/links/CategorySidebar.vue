<template>
  <aside class="category-sidebar">
    <!-- 搜索框 -->
    <div class="sidebar-search">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="请输入资源名称"
        class="sidebar-search__input"
      />
    </div>

    <!-- 分类列表 -->
    <nav class="sidebar-nav">
      <div
        v-for="cat in filteredCategories"
        :key="cat.id"
        class="sidebar-nav__group"
      >
        <button
          class="sidebar-nav__item"
          :class="{ 'sidebar-nav__item--active': activeId === cat.id }"
          @click="handleCategoryClick(cat)"
        >
          <span class="sidebar-nav__icon">{{ cat.icon }}</span>
          <span class="sidebar-nav__label">{{ cat.name }}</span>
          <span
            v-if="cat.subCategories.length"
            class="sidebar-nav__arrow"
            :class="{ 'sidebar-nav__arrow--open': expandedIds.has(cat.id) }"
          >&#9656;</span>
        </button>

        <!-- 子分类 -->
        <div
          v-if="cat.subCategories.length && expandedIds.has(cat.id)"
          class="sidebar-nav__children"
        >
          <button
            v-for="sub in cat.subCategories"
            :key="sub.id"
            class="sidebar-nav__child"
            @click="$emit('navigate', cat.id, sub.id)"
          >{{ sub.name }}</button>
        </div>
      </div>
    </nav>
  </aside>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import type { Category } from "../../types";

const props = defineProps<{
  categories: Category[];
  activeId: number;
}>();

const emit = defineEmits<{
  navigate: [categoryId: number, subCategoryId?: number];
}>();

const searchQuery = ref("");
const expandedIds = ref(new Set<number>());

const filteredCategories = computed(() => {
  const kw = searchQuery.value.trim().toLowerCase();
  if (!kw) return props.categories;
  return props.categories.filter((c) =>
    c.name.toLowerCase().includes(kw) ||
    c.subCategories.some((s) => s.name.toLowerCase().includes(kw))
  );
});

function handleCategoryClick(cat: Category) {
  if (cat.subCategories.length) {
    if (expandedIds.value.has(cat.id)) {
      expandedIds.value.delete(cat.id);
    } else {
      expandedIds.value.add(cat.id);
    }
  }
  emit("navigate", cat.id);
}
</script>

<style scoped>
.category-sidebar {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.sidebar-search {
  padding: var(--links-space-12);
  border-bottom: 1px solid var(--links-color-border);
}

.sidebar-search__input {
  width: 100%;
  padding: var(--links-space-8) var(--links-space-12);
  border: 1px solid var(--links-color-border);
  border-radius: var(--links-radius-sm);
  font-size: var(--links-font-size-sm);
  background: var(--links-color-bg-page);
  transition: border-color var(--links-motion-fast);
}

.sidebar-search__input:focus {
  border-color: var(--links-color-primary);
}

.sidebar-nav {
  flex: 1;
  overflow-y: auto;
  padding: var(--links-space-8) 0;
}

.sidebar-nav__item {
  display: flex;
  align-items: center;
  gap: var(--links-space-8);
  width: 100%;
  padding: var(--links-space-8) var(--links-space-16);
  font-size: var(--links-font-size-md);
  color: var(--links-color-text-primary);
  text-align: left;
  transition: background var(--links-motion-fast), color var(--links-motion-fast);
}

.sidebar-nav__item:hover {
  background: var(--links-color-primary-light);
  color: var(--links-color-primary);
}

.sidebar-nav__item--active {
  background: var(--links-color-primary-light);
  color: var(--links-color-primary);
  font-weight: 500;
}

.sidebar-nav__icon {
  font-size: 18px;
  flex-shrink: 0;
}

.sidebar-nav__label {
  flex: 1;
}

.sidebar-nav__arrow {
  font-size: 12px;
  color: var(--links-color-text-muted);
  transition: transform var(--links-motion-fast);
}

.sidebar-nav__arrow--open {
  transform: rotate(90deg);
}

.sidebar-nav__children {
  padding: var(--links-space-4) 0 var(--links-space-4) 44px;
}

.sidebar-nav__child {
  display: block;
  width: 100%;
  padding: var(--links-space-4) var(--links-space-12);
  font-size: var(--links-font-size-sm);
  color: var(--links-color-text-secondary);
  text-align: left;
  border-radius: var(--links-radius-sm);
  transition: color var(--links-motion-fast);
}

.sidebar-nav__child:hover {
  color: var(--links-color-primary);
}
</style>
