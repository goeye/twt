<template>
  <section class="files-page">
    <ArchiveConversationTab v-if="activeKey === 'all-conversations'" @toast="emit('toast', $event)" />
    <ArchiveChatTab v-else-if="activeKey === 'all-chats'" @toast="emit('toast', $event)" />
  </section>
</template>

<script setup lang="ts">
import ArchiveConversationTab from "../components/archive/ArchiveConversationTab.vue";
import ArchiveChatTab from "../components/archive/ArchiveChatTab.vue";

type FilesPageKey = "all-conversations" | "all-chats";

withDefaults(
  defineProps<{
    activeKey?: FilesPageKey;
  }>(),
  {
    activeKey: "all-conversations"
  }
);

const emit = defineEmits<{
  (e: "toast", message: string): void;
}>();
</script>

<style scoped>
.files-page {
  height: 100%;
}
</style>
