<template>
  <nav :class="['product-subnav', { 'product-subnav--pinned': isPinned }]">
    <div class="product-subnav__container">
      <div class="product-subnav__content">
        <div class="product-subnav__brand">
          <span class="product-subnav__icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M6 4.75A3.25 3.25 0 0 0 2.75 8v5A3.25 3.25 0 0 0 6 16.25h.65v3.1c0 .54.64.83 1.05.48l3.94-3.58H13A3.25 3.25 0 0 0 16.25 13V8A3.25 3.25 0 0 0 13 4.75H6Z" fill="url(#chat-gradient-primary)" />
              <path d="M11 8.75A3.25 3.25 0 0 1 14.25 5.5H18A3.25 3.25 0 0 1 21.25 8.75v4.5A3.25 3.25 0 0 1 18 16.5h-2.65l-2.87 2.61c-.41.37-1.07.08-1.07-.47v-2.89h-.16A3.25 3.25 0 0 1 8 12.5v-.25h5A3.5 3.5 0 0 0 16.5 8.75V8h-5.5v.75Z" fill="url(#chat-gradient-secondary)" />
              <defs>
                <linearGradient id="chat-gradient-primary" x1="2.75" y1="4.75" x2="16.25" y2="18.34" gradientUnits="userSpaceOnUse">
                  <stop stop-color="#44D2FF" />
                  <stop offset="1" stop-color="#1677FF" />
                </linearGradient>
                <linearGradient id="chat-gradient-secondary" x1="8" y1="5.5" x2="21.25" y2="18.1" gradientUnits="userSpaceOnUse">
                  <stop stop-color="#FFB54D" />
                  <stop offset="1" stop-color="#1677FF" />
                </linearGradient>
              </defs>
            </svg>
          </span>
          <span class="product-subnav__name">Chat</span>
        </div>

        <div class="product-subnav__actions">
          <div class="product-subnav__links">
            <a href="#" class="product-subnav__nav-link">下载</a>
            <a href="#" class="product-subnav__nav-link">功能介绍</a>
            <a href="#" class="product-subnav__nav-link">版本价格</a>

            <div class="product-subnav__dropdown">
              <button
                type="button"
                class="product-subnav__dropdown-trigger"
              >
                支持与帮助
                <svg class="product-subnav__arrow" width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </button>
              <div class="product-subnav__menu">
                <RouterLink to="/updates">产品动态</RouterLink>
                <RouterLink to="/help-center">帮助中心</RouterLink>
                <RouterLink to="/developer-docs">开发文档</RouterLink>
              </div>
            </div>
          </div>
          <a v-if="isPinned && showCta" href="#" class="product-subnav__cta">立即使用</a>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { RouterLink } from 'vue-router';

withDefaults(defineProps<{
  activeKey?: 'help-center' | 'developer-docs';
  showCta?: boolean;
}>(), {
  activeKey: undefined,
  showCta: true
});

const isPinned = ref(false);
const stickyThreshold = ref(64);

const getStickyThreshold = () => {
  if (typeof window === 'undefined') {
    return 64;
  }

  const headerHeight = getComputedStyle(document.documentElement)
    .getPropertyValue('--links-main-nav-height')
    .trim();

  return Number.parseFloat(headerHeight) || 64;
};

const syncStickyThreshold = () => {
  stickyThreshold.value = getStickyThreshold();
};

const updatePinnedState = () => {
  if (typeof window === 'undefined') {
    return;
  }

  isPinned.value = window.scrollY >= stickyThreshold.value;
};

onMounted(() => {
  syncStickyThreshold();
  updatePinnedState();
  window.addEventListener('scroll', updatePinnedState, { passive: true });
  window.addEventListener('resize', syncStickyThreshold, { passive: true });
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', updatePinnedState);
  window.removeEventListener('resize', syncStickyThreshold);
});
</script>

<style scoped>
.product-subnav {
  position: sticky;
  top: 0;
  z-index: 120;
  height: var(--links-product-nav-height);
  background: transparent;
  transition:
    background-color var(--links-motion-base),
    box-shadow var(--links-motion-base),
    border-color var(--links-motion-base),
    backdrop-filter var(--links-motion-base);
  border-bottom: 1px solid transparent;
}

.product-subnav--pinned {
  background: rgba(255, 255, 255, 0.96);
  border-bottom-color: rgba(232, 233, 240, 0.88);
  box-shadow: 0 12px 28px rgba(15, 23, 42, 0.06);
  backdrop-filter: blur(14px);
}

.product-subnav__container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 48px;
  height: 100%;
}

.product-subnav__content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 32px;
  height: 100%;
}

.product-subnav__brand {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
  flex-shrink: 0;
}

.product-subnav__icon {
  display: inline-flex;
  width: 28px;
  height: 28px;
}

.product-subnav__icon svg {
  width: 100%;
  height: 100%;
}

.product-subnav__name {
  font-size: 16px;
  line-height: 1;
  font-weight: 700;
  color: var(--links-color-text-primary);
}

.product-subnav__actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 24px;
  min-width: 0;
  flex: 1;
}

.product-subnav__links {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 32px;
  min-width: 0;
}

.product-subnav__nav-link,
.product-subnav__dropdown-trigger {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border: none;
  background: transparent;
  padding: 0;
  font: inherit;
  font-size: 14px;
  color: var(--links-color-text-primary);
  cursor: pointer;
  text-decoration: none;
  transition: color var(--links-motion-fast);
}

.product-subnav__nav-link:hover,
.product-subnav__dropdown-trigger:hover {
  color: var(--links-color-primary);
}

.product-subnav__dropdown {
  position: relative;
  display: flex;
  align-items: center;
}

.product-subnav__dropdown:hover::after,
.product-subnav__dropdown:focus-within::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  width: max(100%, 172px);
  height: 18px;
}

.product-subnav__arrow {
  transition: transform var(--links-motion-fast);
}

.product-subnav__dropdown:hover .product-subnav__arrow,
.product-subnav__dropdown:focus-within .product-subnav__arrow {
  transform: rotate(180deg);
}

.product-subnav__menu {
  display: none;
  position: absolute;
  top: calc(100% + 14px);
  left: 50%;
  transform: translateX(-50%);
  z-index: 1;
  min-width: 132px;
  flex-direction: column;
  border-radius: 12px;
  overflow: hidden;
  background: #fff;
  box-shadow: 0 16px 40px rgba(15, 23, 42, 0.12);
}

.product-subnav__dropdown:hover .product-subnav__menu,
.product-subnav__dropdown:focus-within .product-subnav__menu {
  display: flex;
}

.product-subnav__menu a {
  white-space: nowrap;
  padding: 10px 20px;
  font-size: 14px;
  color: var(--links-color-text-primary);
  text-decoration: none;
  background: #fff;
  transition:
    color var(--links-motion-fast),
    background-color var(--links-motion-fast);
}

.product-subnav__menu a:hover {
  color: var(--links-color-primary);
  background: var(--links-color-bg-page);
}

.product-subnav__cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  padding: 0 22px;
  border-radius: 999px;
  background: var(--links-color-primary);
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  box-shadow: 0 10px 24px rgba(22, 119, 255, 0.22);
  transition:
    transform var(--links-motion-fast),
    box-shadow var(--links-motion-fast),
    background-color var(--links-motion-fast);
}

.product-subnav__cta:hover {
  background: var(--links-color-primary-hover);
  box-shadow: 0 12px 28px rgba(22, 119, 255, 0.26);
  transform: translateY(-1px);
}

@media (max-width: 900px) {
  .product-subnav__container {
    padding: 0 24px;
  }

  .product-subnav__links {
    gap: 20px;
  }

  .product-subnav__cta {
    display: none;
  }
}

@media (max-width: 768px) {
  .product-subnav__container {
    padding: 0 16px;
  }

  .product-subnav__content {
    gap: 16px;
  }

  .product-subnav__actions {
    gap: 12px;
  }

  .product-subnav__links {
    gap: 14px;
    overflow-x: auto;
    scrollbar-width: none;
  }

  .product-subnav__links::-webkit-scrollbar {
    display: none;
  }

  .product-subnav__nav-link,
  .product-subnav__dropdown-trigger {
    font-size: 13px;
    white-space: nowrap;
  }

  .product-subnav__name {
    font-size: 15px;
  }
}
</style>
