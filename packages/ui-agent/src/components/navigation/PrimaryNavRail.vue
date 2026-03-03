<template>
  <nav class="nav-rail">
    <div class="nav-rail__brand">
      <slot name="brand">
        <div class="nav-rail__brand-text">{{ brandLabel }}</div>
      </slot>
    </div>
    <div class="nav-rail__items">
      <PrimaryNavItem
        v-for="item in items"
        :key="item.key"
        :active="item.key === activeKey"
        :badge="item.badge"
        :icon="item.icon ?? 'home'"
        :label="item.label"
        @select="$emit('select', item.key)"
      />
    </div>
    <div class="nav-rail__footer">
      <slot name="footer">
        <button type="button" class="avatar-btn">{{ avatarLabel }}</button>
      </slot>
    </div>
  </nav>
</template>

<script setup lang="ts">
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
</script>

<style scoped>
.nav-rail {
  display: flex;
  flex-direction: column;
  gap: var(--agent-space-12);
  height: 100%;
  padding: var(--agent-space-12) 0;
}

.nav-rail__brand {
  display: grid;
  place-items: center;
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
  gap: var(--agent-space-8);
}

.nav-rail__footer {
  display: grid;
  place-items: center;
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
