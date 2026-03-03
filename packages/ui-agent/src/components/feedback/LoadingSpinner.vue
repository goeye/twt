<template>
  <span class="spinner" aria-label="loading" />
</template>

<style scoped>
.spinner {
  animation: spin 0.8s linear infinite;
  border: 2px solid var(--agent-color-border-default);
  border-top-color: var(--agent-color-brand-primary);
  border-radius: 50%;
  display: inline-block;
  height: 14px;
  width: 14px;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
