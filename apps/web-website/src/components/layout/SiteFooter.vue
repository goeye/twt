<template>
  <footer class="site-footer">
    <div class="site-footer__inner">
      <p>&copy; {{ year }} TWT. All rights reserved.</p>
    </div>
  </footer>
</template>

<script setup lang="ts">
const year = new Date().getFullYear();
</script>

<style scoped>
.site-footer {
  border-top: 1px solid var(--links-color-border);
  background: #fff;
  padding: var(--links-space-24) 0;
}

.site-footer__inner {
  max-width: var(--links-content-max-width);
  margin: 0 auto;
  padding: 0 var(--links-space-24);
  text-align: center;
  font-size: var(--links-font-size-sm);
  color: var(--links-color-text-muted);
}
</style>
