<template>
  <section class="files-page">
    <ArchiveConversationTab v-if="resolvedActiveKey === 'all-conversations'" @toast="emit('toast', $event)" @navigate-to-session="emit('navigate-to-session', $event)" />
    <ArchiveChatTab v-else @toast="emit('toast', $event)" />
  </section>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { usePermission } from "../composables/usePermission";
import ArchiveConversationTab from "../components/archive/ArchiveConversationTab.vue";
import ArchiveChatTab from "../components/archive/ArchiveChatTab.vue";

type FilesPageKey = "all-conversations" | "all-chats";

const emit = defineEmits<{
  (e: "toast", message: string): void;
  (e: "navigate-to-session", sessionInfo: { id: string; queueKey: string }): void;
}>();

const { hasPermission } = usePermission();

const props = withDefaults(
  defineProps<{
    activeKey?: FilesPageKey;
  }>(),
  {
    activeKey: "all-conversations"
  }
);

const availableKeys = computed<FilesPageKey[]>(() => {
  const keys: FilesPageKey[] = [];
  if (hasPermission("archive-conversation")) {
    keys.push("all-conversations");
  }
  if (hasPermission("archive-chat")) {
    keys.push("all-chats");
  }
  return keys.length > 0 ? keys : ["all-conversations"];
});

const resolvedActiveKey = computed<FilesPageKey>(() => {
  const nextKey = props.activeKey === "all-chats" ? "all-chats" : "all-conversations";
  return availableKeys.value.includes(nextKey) ? nextKey : availableKeys.value[0];
});
</script>

<style scoped>
.files-page {
  height: 100%;
}
</style>
