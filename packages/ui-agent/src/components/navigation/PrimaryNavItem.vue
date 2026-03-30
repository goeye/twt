<template>
  <button
    class="nav-item"
    :class="{ 'nav-item--active': active, 'nav-item--expanded': expanded }"
    type="button"
    :aria-label="label"
    :title="label"
    @click="$emit('select')"
  >
    <span class="nav-item__icon">
      <AgentIcon :name="icon" :size="18" />
    </span>
    <span v-if="expanded" class="nav-item__label">{{ label }}</span>
    <span v-if="badge && badge > 0" class="nav-item__badge">{{ badge }}</span>
  </button>
</template>

<script setup lang="ts">
import AgentIcon from "../icon/AgentIcon.vue";

defineProps<{
  icon: string;
  label?: string;
  badge?: number;
  active?: boolean;
  expanded?: boolean;
}>();

defineEmits<{
  (e: "select"): void;
}>();
</script>

<style scoped>
.nav-item {
  --nav-item-size: var(--nav-rail-item-size, 30px);
  --nav-item-icon-offset: var(
    --nav-rail-expanded-icon-offset,
    calc((var(--agent-layout-nav-rail-width) - var(--nav-item-size)) / 2 - var(--agent-space-4))
  );
  align-items: center;
  background: transparent;
  border: 0;
  border-radius: var(--agent-radius-md);
  color: var(--agent-color-text-secondary);
  cursor: pointer;
  display: inline-flex;
  height: var(--nav-item-size);
  justify-content: center;
  margin: 0 auto;
  position: relative;
  width: var(--nav-item-size);
}

.nav-item:hover {
  background: var(--agent-color-bg-muted);
}

.nav-item--active {
  background: var(--agent-color-brand-soft);
  color: var(--agent-color-brand-primary);
}

.nav-item--active:hover {
  background: var(--agent-color-brand-soft);
}

.nav-item__icon {
  align-items: center;
  display: inline-flex;
  flex-shrink: 0;
  height: var(--nav-item-size);
  justify-content: center;
  width: var(--nav-item-size);
}

.nav-item__badge {
  background: var(--agent-color-status-error);
  border-radius: 10px;
  color: #fff;
  font-size: 10px;
  line-height: 14px;
  min-width: 14px;
  padding: 0 4px;
  position: absolute;
  right: -4px;
  top: -4px;
}

.nav-item__label {
  color: inherit;
  font-size: 13px;
  font-weight: 500;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Expanded state */
.nav-item--expanded {
  gap: var(--nav-rail-expanded-label-gap, var(--agent-space-8));
  height: var(--nav-item-size);
  justify-content: flex-start;
  margin: 0;
  padding: 0 var(--agent-space-8) 0 var(--nav-item-icon-offset);
  width: 100%;
}

.nav-item--expanded .nav-item__badge {
  position: static;
  margin-left: auto;
}
</style>
