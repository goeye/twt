<template>
  <button
    class="nav-item"
    :class="{ 'nav-item--active': active }"
    type="button"
    :aria-label="label"
    :title="label"
    @click="$emit('select')"
  >
    <span class="nav-item__icon">
      <AgentIcon :name="icon" :size="18" />
    </span>
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
}>();

defineEmits<{
  (e: "select"): void;
}>();
</script>

<style scoped>
.nav-item {
  align-items: center;
  background: transparent;
  border: 0;
  border-radius: var(--agent-radius-md);
  color: var(--agent-color-text-secondary);
  cursor: pointer;
  display: inline-flex;
  height: 30px;
  justify-content: center;
  margin: 0 auto;
  position: relative;
  width: 30px;
}

.nav-item:hover {
  background: var(--agent-color-bg-muted);
}

.nav-item--active {
  background: var(--agent-color-brand-soft);
  color: var(--agent-color-brand-primary);
}

.nav-item__icon {
  align-items: center;
  display: inline-flex;
  justify-content: center;
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
</style>
