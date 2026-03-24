<template>
  <nav
    class="nav-rail"
    :class="{ 'nav-rail--expanded': isExpanded }"
    @mouseenter="isExpanded = true"
    @mouseleave="isExpanded = false"
  >
    <div class="nav-rail__brand">
      <slot name="brand" :expanded="isExpanded">
        <div class="nav-rail__brand-text">{{ brandLabel }}</div>
      </slot>
    </div>
    <div class="nav-rail__items">
      <PrimaryNavItem
        v-for="item in items"
        :key="item.key"
        :active="item.key === activeKey"
        :badge="item.badge"
        :expanded="isExpanded"
        :icon="item.icon ?? 'home'"
        :label="item.label"
        @select="$emit('select', item.key)"
      />
    </div>
    <div class="nav-rail__footer">
      <slot name="footer" :expanded="isExpanded">
        <button type="button" class="avatar-btn">{{ avatarLabel }}</button>
      </slot>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { NavItem } from "../../types";
import PrimaryNavItem from "./PrimaryNavItem.vue";

withDefaults(
  defineProps<{
    items: NavItem[];
    activeKey: string;
    brandLabel?: string;
    avatarLabel?: string;
  }>(),
  {
    brandLabel: "TW",
    avatarLabel: "A"
  }
);

defineEmits<{
  (e: "select", key: string): void;
}>();

const isExpanded = ref(false);
</script>

<style scoped>
.nav-rail {
  bottom: 0;
  display: flex;
  flex-direction: column;
  gap: var(--agent-space-12);
  left: 0;
  padding: var(--agent-space-12) 0;
  position: absolute;
  top: 0;
  transition: width var(--agent-motion-base) ease, background var(--agent-motion-base) ease, box-shadow var(--agent-motion-base) ease;
  width: var(--agent-layout-nav-rail-width);
  z-index: 10;
}

.nav-rail--expanded {
  -webkit-backdrop-filter: blur(24px);
  backdrop-filter: blur(24px);
  background: rgba(255, 255, 255, 0.88);
  box-shadow: 4px 0 24px rgba(0, 0, 0, 0.06);
  width: 200px;
}

.nav-rail__brand {
  display: grid;
  place-items: center;
}

.nav-rail--expanded .nav-rail__brand {
  place-items: start;
  padding: 0 var(--agent-space-12);
}

.nav-rail__brand-text {
  color: var(--agent-color-brand-primary);
  font-size: 12px;
  font-weight: var(--agent-font-weight-semibold);
  text-align: center;
}

.nav-rail__items {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: var(--agent-space-4);
  padding: 0 var(--agent-space-4);
}

.nav-rail__footer {
  display: grid;
  place-items: center;
}

.nav-rail--expanded .nav-rail__footer {
  place-items: stretch;
  padding: 0 var(--agent-space-4);
}

.avatar-btn {
  background: var(--agent-color-bg-muted);
  border: 1px solid var(--agent-color-border-default);
  border-radius: 50%;
  color: var(--agent-color-text-primary);
  cursor: pointer;
  font-size: 12px;
  font-weight: var(--agent-font-weight-semibold);
  height: 24px;
  width: 24px;
}
</style>
