<template>
  <div class="ma-app">
    <router-view />
    <TabBar v-if="showTabBar" />
    <VersionUpdateModal
      :open="versionState.hasUpdate"
      :notes="versionState.notes"
      @dismiss="dismissUpdate"
      @refresh="doRefresh"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import TabBar from "./components/TabBar.vue";
import VersionUpdateModal from "./components/VersionUpdateModal.vue";
import { useVersionCheck } from "./composables/useVersionCheck";

const route = useRoute();
const showTabBar = computed(() => !route.meta.hideTabBar);

const { versionState, doRefresh, dismissUpdate } = useVersionCheck();
</script>

<style scoped>
.ma-app {
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;
  background: #f5f7f9;
}
</style>
