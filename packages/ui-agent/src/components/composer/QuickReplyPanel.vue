<template>
  <div ref="panelRef" class="quick-reply-panel">
    <header class="quick-reply-panel__header">
      <span class="quick-reply-panel__title">快捷回复</span>
      <div class="quick-reply-panel__header-actions">
        <button type="button" class="quick-reply-panel__icon-btn" aria-label="设置" @click="$emit('settings')">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M6.86 1.33h2.28l.32 1.92a5.3 5.3 0 0 1 1.32.76l1.84-.72 1.14 1.98-1.52 1.2a5.5 5.5 0 0 1 0 1.06l1.52 1.2-1.14 1.98-1.84-.72c-.4.32-.84.57-1.32.76l-.32 1.92H6.86l-.32-1.92a5.3 5.3 0 0 1-1.32-.76l-1.84.72-1.14-1.98 1.52-1.2a5.5 5.5 0 0 1 0-1.06l-1.52-1.2 1.14-1.98 1.84.72c.4-.32.84-.57 1.32-.76l.32-1.92ZM8 5.67a2.33 2.33 0 1 0 0 4.66 2.33 2.33 0 0 0 0-4.66Z" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        <button type="button" class="quick-reply-panel__icon-btn" aria-label="关闭" @click="$emit('close')">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </button>
      </div>
    </header>

    <div class="quick-reply-panel__body">
      <aside class="quick-reply-panel__sidebar">
        <template v-for="(cat, idx) in categories" :key="cat.key">
          <div v-if="cat.type === 'tag' && idx > 0 && categories[idx - 1]?.type === 'group'" class="quick-reply-panel__divider" />
          <button
            type="button"
            class="quick-reply-panel__cat-item"
            :class="{ 'quick-reply-panel__cat-item--active': activeCategoryKey === cat.key }"
            @click="activeCategoryKey = cat.key"
          >
            <span class="quick-reply-panel__cat-label">{{ cat.label }}</span>
            <span class="quick-reply-panel__cat-count">{{ cat.items.length }}</span>
          </button>
        </template>
      </aside>

      <main class="quick-reply-panel__content">
        <div
          v-for="item in activeItems"
          :key="item.id"
          class="quick-reply-panel__item"
          @click="$emit('select', item)"
        >
          <span v-if="item.images.length > 0" class="quick-reply-panel__item-img">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <rect x="1" y="2" width="12" height="10" rx="1.5" stroke="currentColor" stroke-width="1.2"/>
              <circle cx="4.5" cy="5.5" r="1" stroke="currentColor" stroke-width="0.8"/>
              <path d="M1 10l3-3 2 2 3-4 4 5" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span class="quick-reply-panel__item-img-count">{{ item.images.length }}</span>
          </span>
          <span class="quick-reply-panel__item-text">{{ item.reply }}</span>
        </div>
        <div v-if="activeItems.length === 0" class="quick-reply-panel__empty">暂无内容</div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import type { QuickReplyItem, QuickReplyCategory } from "../../types";

const props = defineProps<{
  categories: QuickReplyCategory[];
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "settings"): void;
  (e: "select", item: QuickReplyItem): void;
}>();

const panelRef = ref<HTMLDivElement>();
const activeCategoryKey = ref(props.categories[0]?.key ?? "");

const activeItems = computed(() => {
  const cat = props.categories.find((c) => c.key === activeCategoryKey.value);
  return cat?.items ?? [];
});

function handleClickOutside(e: MouseEvent) {
  if (panelRef.value && !panelRef.value.contains(e.target as Node)) {
    // 不关闭如果点击的是快捷回复按钮本身（由父组件 toggle）
    const target = e.target as HTMLElement;
    if (target.closest('[aria-label="快捷回复"]')) return;
    emit("close");
  }
}

onMounted(() => {
  setTimeout(() => {
    document.addEventListener("mousedown", handleClickOutside);
  }, 0);
});

onBeforeUnmount(() => {
  document.removeEventListener("mousedown", handleClickOutside);
});
</script>

<style scoped>
.quick-reply-panel {
  background: #ffffff;
  border: 1px solid var(--agent-color-border-default);
  border-radius: var(--agent-radius-lg);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.12);
  display: flex;
  flex-direction: column;
  height: 340px;
  left: 0;
  overflow: hidden;
  position: absolute;
  right: 0;
  bottom: 100%;
  z-index: var(--agent-z-dropdown);
}

.quick-reply-panel__header {
  align-items: center;
  border-bottom: 1px solid var(--agent-color-border-default);
  display: flex;
  flex-shrink: 0;
  justify-content: space-between;
  padding: 10px 14px;
}

.quick-reply-panel__title {
  color: var(--agent-color-text-primary);
  font-size: var(--agent-font-size-base);
  font-weight: var(--agent-font-weight-semibold);
}

.quick-reply-panel__header-actions {
  align-items: center;
  display: flex;
  gap: 4px;
}

.quick-reply-panel__icon-btn {
  align-items: center;
  background: transparent;
  border: 0;
  border-radius: var(--agent-radius-sm);
  color: var(--agent-color-text-secondary);
  cursor: pointer;
  display: inline-flex;
  height: 28px;
  justify-content: center;
  width: 28px;
}

.quick-reply-panel__icon-btn:hover {
  background: var(--agent-color-bg-muted);
  color: var(--agent-color-text-primary);
}

.quick-reply-panel__body {
  display: flex;
  flex: 1;
  min-height: 0;
}

.quick-reply-panel__sidebar {
  border-right: 1px solid var(--agent-color-border-default);
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  overflow-y: auto;
  padding: 6px;
  width: 160px;
}

.quick-reply-panel__divider {
  background: var(--agent-color-border-default);
  height: 1px;
  margin: 4px 8px;
}

.quick-reply-panel__cat-item {
  align-items: center;
  background: transparent;
  border: 0;
  border-radius: var(--agent-radius-md);
  color: var(--agent-color-text-primary);
  cursor: pointer;
  display: flex;
  font-size: var(--agent-font-size-sm);
  gap: 8px;
  justify-content: space-between;
  padding: 8px 10px;
  text-align: left;
  width: 100%;
}

.quick-reply-panel__cat-item:hover {
  background: var(--agent-color-bg-muted);
}

.quick-reply-panel__cat-item--active {
  background: #e8eeff;
  color: var(--agent-color-brand-primary);
  font-weight: var(--agent-font-weight-medium);
}

.quick-reply-panel__cat-label {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.quick-reply-panel__cat-count {
  color: var(--agent-color-text-tertiary);
  flex-shrink: 0;
  font-size: var(--agent-font-size-xs);
  font-weight: var(--agent-font-weight-semibold);
}

.quick-reply-panel__cat-item--active .quick-reply-panel__cat-count {
  color: var(--agent-color-brand-primary);
}

.quick-reply-panel__content {
  flex: 1;
  min-width: 0;
  overflow-y: auto;
  padding: 6px;
}

.quick-reply-panel__item {
  align-items: flex-start;
  border-radius: var(--agent-radius-md);
  cursor: pointer;
  display: flex;
  gap: 6px;
  line-height: 1.5;
  padding: 8px 10px;
}

.quick-reply-panel__item:hover {
  background: var(--agent-color-bg-muted);
}

.quick-reply-panel__item-img {
  align-items: center;
  color: var(--agent-color-text-secondary);
  display: inline-flex;
  flex-shrink: 0;
  gap: 2px;
  margin-top: 2px;
}

.quick-reply-panel__item-img-count {
  color: var(--agent-color-text-tertiary);
  font-size: var(--agent-font-size-xs);
}

.quick-reply-panel__item-text {
  color: var(--agent-color-text-primary);
  display: -webkit-box;
  font-size: var(--agent-font-size-sm);
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

.quick-reply-panel__empty {
  align-items: center;
  color: var(--agent-color-text-tertiary);
  display: flex;
  font-size: var(--agent-font-size-sm);
  height: 100%;
  justify-content: center;
}
</style>
