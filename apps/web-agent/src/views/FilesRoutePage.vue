<template>
  <section class="files-page">
    <ArchiveConversationTab v-if="resolvedActiveKey === 'all-conversations'" @toast="emit('toast', $event)" />
    <ArchiveChatTab v-else @toast="emit('toast', $event)" />
  </section>
</template>

<script setup lang="ts">
import { computed } from "vue";
import ArchiveConversationTab from "../components/archive/ArchiveConversationTab.vue";
import ArchiveChatTab from "../components/archive/ArchiveChatTab.vue";

type FilesPageKey = "all-conversations" | "all-chats";

const emit = defineEmits<{
  (e: "toast", message: string): void;
}>();

const props = withDefaults(
  defineProps<{
    activeKey?: FilesPageKey;
  }>(),
  {
    activeKey: "all-conversations"
  }
);

const resolvedActiveKey = computed<FilesPageKey>(() => (
  props.activeKey === "all-chats" ? "all-chats" : "all-conversations"
));
</script>

<style scoped>
.files-page {
  background: #fff;
}
</style>
