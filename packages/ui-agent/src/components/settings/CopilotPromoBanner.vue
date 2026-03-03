<template>
  <article class="copilot-banner">
    <button class="copilot-banner__close" type="button" aria-label="关闭" @click="$emit('close')">
      ×
    </button>

    <div class="copilot-banner__content">
      <h3 class="copilot-banner__title">{{ title }}</h3>
      <p class="copilot-banner__description">{{ description }}</p>
      <button class="copilot-banner__link" type="button" @click="$emit('learn')">
        <span class="copilot-banner__book" />
        <span>{{ ctaLabel }}</span>
      </button>
    </div>

    <div class="copilot-banner__visual" aria-hidden="true">
      <div class="copilot-banner__halo" />
      <div class="copilot-banner__pill" />
    </div>
  </article>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    title: string;
    description: string;
    ctaLabel?: string;
  }>(),
  {
    ctaLabel: "学习使用Copilot"
  }
);

defineEmits<{
  (e: "close"): void;
  (e: "learn"): void;
}>();
</script>

<style scoped>
.copilot-banner {
  background: linear-gradient(90deg, #e8f2ff 0%, #e6eefb 68%, #d8e4f8 100%);
  border-radius: var(--agent-radius-lg);
  display: grid;
  gap: var(--agent-space-16);
  grid-template-columns: minmax(320px, 1fr) 220px;
  overflow: hidden;
  padding: var(--agent-space-24);
  position: relative;
}

.copilot-banner__close {
  background: transparent;
  border: 0;
  color: var(--agent-color-text-tertiary);
  cursor: pointer;
  font-size: var(--agent-font-size-lg);
  line-height: 1;
  position: absolute;
  right: var(--agent-space-16);
  top: var(--agent-space-16);
}

.copilot-banner__content {
  display: flex;
  flex-direction: column;
  gap: var(--agent-space-12);
  min-width: 0;
}

.copilot-banner__title {
  color: var(--agent-color-text-primary);
  font-size: var(--agent-font-size-2xl);
  font-weight: var(--agent-font-weight-semibold);
  line-height: 1.3;
  margin: 0;
}

.copilot-banner__description {
  color: var(--agent-color-text-secondary);
  font-size: var(--agent-font-size-md);
  line-height: 1.6;
  margin: 0;
}

.copilot-banner__link {
  align-items: center;
  background: transparent;
  border: 0;
  color: var(--agent-color-brand-primary);
  cursor: pointer;
  display: inline-flex;
  font-size: var(--agent-font-size-lg);
  font-weight: var(--agent-font-weight-medium);
  gap: var(--agent-space-8);
  padding: 0;
}

.copilot-banner__book {
  background: currentColor;
  border-radius: 3px;
  display: inline-block;
  height: 14px;
  position: relative;
  width: 16px;
}

.copilot-banner__book::after {
  background: #cfe1ff;
  content: "";
  height: 14px;
  left: 7px;
  position: absolute;
  top: 0;
  width: 2px;
}

.copilot-banner__visual {
  align-items: center;
  display: grid;
  min-height: 140px;
  place-items: center;
  position: relative;
}

.copilot-banner__halo {
  border: 2px solid rgba(95, 133, 200, 0.14);
  border-radius: 50%;
  height: 196px;
  position: absolute;
  right: -40px;
  width: 300px;
}

.copilot-banner__pill {
  background: linear-gradient(180deg, #8fc4ff 0%, #5e97ff 52%, #4d7be0 100%);
  border-radius: 32px;
  box-shadow: 0 14px 34px rgba(49, 103, 200, 0.3);
  height: 108px;
  position: absolute;
  right: 68px;
  width: 82px;
}

.copilot-banner__pill::after {
  background: linear-gradient(180deg, #92c4ff 0%, #639cf8 56%, #4f7fdb 100%);
  border-radius: 32px;
  content: "";
  height: 108px;
  left: 96px;
  position: absolute;
  top: 0;
  width: 82px;
}

@media (max-width: 1280px) {
  .copilot-banner {
    grid-template-columns: 1fr;
    padding: var(--agent-space-16);
  }

  .copilot-banner__visual {
    display: none;
  }
}
</style>
