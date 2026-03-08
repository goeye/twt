<template>
  <div class="cw-minimized">
    <button type="button" class="cw-fab" aria-label="打开聊天" @click="$router.push('/sessions')">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.cw-minimized {
  align-items: flex-end;
  display: flex;
  height: 100%;
  justify-content: flex-end;
  padding: 20px;
}

.cw-fab {
  align-items: center;
  background: var(--agent-color-brand-primary);
  border: none;
  border-radius: 50%;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.18);
  color: #fff;
  cursor: pointer;
  display: flex;
  height: 56px;
  justify-content: center;
  transition: transform 0.2s;
  width: 56px;
}

.cw-fab:hover {
  transform: scale(1.08);
}
</style>
