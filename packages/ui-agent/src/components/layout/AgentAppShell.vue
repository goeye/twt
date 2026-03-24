<template>
  <div
    class="agent-shell agent-reset"
    :class="{
      'agent-shell--with-detail': showDetail,
      'agent-shell--without-subnav': hideSubnav
    }"
  >
    <aside class="agent-shell__rail">
      <slot name="nav-rail" />
    </aside>
    <aside v-if="!hideSubnav" class="agent-shell__subnav">
      <slot name="sub-nav" />
    </aside>
    <main class="agent-shell__main">
      <slot />
    </main>
    <aside v-if="showDetail" class="agent-shell__detail">
      <slot name="detail-pane" />
    </aside>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  showDetail?: boolean;
  hideSubnav?: boolean;
}>();
</script>

<style scoped>
.agent-shell {
  background: var(--agent-color-bg-page);
  display: grid;
  grid-template-columns: var(--agent-layout-nav-rail-width) var(--agent-layout-sub-nav-width) minmax(560px, 1fr);
  height: 100vh;
  width: 100%;
}

.agent-shell--with-detail {
  grid-template-columns: var(--agent-layout-nav-rail-width) var(--agent-layout-sub-nav-width) minmax(560px, 1fr) var(
      --agent-layout-detail-pane-width
    );
}

.agent-shell--without-subnav {
  grid-template-columns: var(--agent-layout-nav-rail-width) minmax(560px, 1fr);
}

.agent-shell--without-subnav.agent-shell--with-detail {
  grid-template-columns: var(--agent-layout-nav-rail-width) minmax(560px, 1fr) var(--agent-layout-detail-pane-width);
}

.agent-shell__rail,
.agent-shell__subnav,
.agent-shell__main,
.agent-shell__detail {
  min-height: 0;
  min-width: 0;
}

.agent-shell__rail {
  background: var(--agent-color-bg-panel);
  border-right: 1px solid var(--agent-color-border-default);
  overflow: visible;
  position: relative;
  z-index: 3;
}

.agent-shell__subnav {
  background: var(--agent-color-bg-muted);
  position: relative;
  z-index: 2;
}

.agent-shell__main {
  background: var(--agent-color-bg-muted);
  overflow: hidden;
  padding: var(--agent-space-12);
  position: relative;
  z-index: 1;
}

.agent-shell__detail {
  background: var(--agent-color-bg-page);
  border-left: 1px solid var(--agent-color-border-default);
  padding: var(--agent-space-12);
  position: relative;
  z-index: 1;
}

@media (max-width: 1280px) {
  .agent-shell {
    grid-template-columns: var(--agent-layout-nav-rail-width) var(--agent-layout-sub-nav-width) minmax(420px, 1fr);
  }

  .agent-shell--with-detail {
    grid-template-columns: var(--agent-layout-nav-rail-width) var(--agent-layout-sub-nav-width) minmax(420px, 1fr);
  }

  .agent-shell--without-subnav {
    grid-template-columns: var(--agent-layout-nav-rail-width) minmax(420px, 1fr);
  }

  .agent-shell--without-subnav.agent-shell--with-detail {
    grid-template-columns: var(--agent-layout-nav-rail-width) minmax(420px, 1fr);
  }
}
</style>
