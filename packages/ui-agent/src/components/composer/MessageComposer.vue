<template>
  <section class="composer">
    <QuickReplyPanel
      v-if="showQuickReply && quickReplyCategories && quickReplyCategories.length > 0"
      :categories="quickReplyCategories"
      @close="showQuickReply = false"
      @settings="$emit('quick-reply-settings')"
      @select="handleQuickReplySelect"
    />
    <div class="composer__toolbar">
      <div class="composer__tools">
        <button class="tool-icon" type="button" aria-label="表情" @click="$emit('emoji')">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>
        </button>
        <button class="tool-icon" type="button" aria-label="快捷回复" @click="toggleQuickReply">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><line x1="8" y1="9" x2="16" y2="9"/><line x1="8" y1="13" x2="13" y2="13"/></svg>
        </button>
        <button class="tool-icon" type="button" aria-label="附件" @click="$emit('attachment')">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
        </button>
        <button v-if="showPolish" class="tool-icon" type="button" aria-label="润色" @click="$emit('polish')">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
        </button>
        <button class="tool-icon" type="button" aria-label="机器人">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a4 4 0 0 1 4 4v2a4 4 0 0 1-8 0V6a4 4 0 0 1 4-4z"/><path d="M16 14H8a4 4 0 0 0-4 4v2h16v-2a4 4 0 0 0-4-4z"/><circle cx="12" cy="6" r="1"/></svg>
        </button>
        <button v-if="showTranslate" class="tool-icon" type="button" aria-label="翻译" @click="$emit('translate')">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
        </button>
      </div>
    </div>

    <div class="composer__textarea-wrap">
      <textarea
        class="composer__textarea"
        :placeholder="placeholder"
        :value="modelValue"
        @input="handleTextareaInput"
      />
    </div>

    <div class="composer__footer">
      <button class="composer__send-btn" type="button" :disabled="disabled" @click="$emit('send')">发送</button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from "vue";
import QuickReplyPanel from "./QuickReplyPanel.vue";
import type { QuickReplyItem, QuickReplyCategory } from "../../types";

const props = withDefaults(defineProps<{
  modelValue: string;
  placeholder?: string;
  disabled?: boolean;
  showPolish?: boolean;
  showTranslate?: boolean;
  quickReplyCategories?: QuickReplyCategory[];
}>(), {
  showPolish: true,
  showTranslate: true,
});

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
  (e: "emoji"): void;
  (e: "attachment"): void;
  (e: "polish"): void;
  (e: "translate"): void;
  (e: "send"): void;
  (e: "quick-reply-settings"): void;
}>();

const showQuickReply = ref(false);

function toggleQuickReply() {
  showQuickReply.value = !showQuickReply.value;
}

function handleTextareaInput(e: Event) {
  const value = (e.target as HTMLTextAreaElement).value;
  emit("update:modelValue", value);

  if (value === "/" && props.quickReplyCategories && props.quickReplyCategories.length > 0) {
    showQuickReply.value = true;
  }
}

function handleQuickReplySelect(item: QuickReplyItem) {
  emit("update:modelValue", item.reply);
  showQuickReply.value = false;
}
</script>

<style scoped>
.composer {
  background: transparent;
  display: flex;
  flex-direction: column;
  gap: var(--agent-space-8);
  padding: 10px 12px;
  position: relative;
}

.composer__toolbar {
  align-items: center;
  display: flex;
  justify-content: space-between;
}

.composer__tools {
  display: flex;
  gap: 2px;
}

.tool-icon {
  align-items: center;
  background: transparent;
  border: 0;
  border-radius: var(--agent-radius-sm);
  color: var(--agent-color-text-secondary, #75869c);
  cursor: pointer;
  display: inline-flex;
  height: 28px;
  justify-content: center;
  width: 28px;
}

.tool-icon:hover {
  background: var(--agent-color-bg-muted);
  color: var(--agent-color-text-primary);
}

.composer__textarea-wrap {
  position: relative;
}

.composer__textarea {
  background: transparent;
  border: 0;
  color: var(--agent-color-text-primary);
  font-family: inherit;
  font-size: var(--agent-font-size-sm);
  line-height: 1.5;
  min-height: 122px;
  outline: none;
  padding: 2px 0;
  resize: none;
  width: 100%;
}

.composer__textarea::placeholder {
  color: #a6afbd;
}

.composer__footer {
  align-items: center;
  display: flex;
  justify-content: flex-end;
}

.composer__send-btn {
  align-items: center;
  background: #f0f3f8;
  border: 0;
  border-radius: 10px;
  color: #9ca8ba;
  cursor: pointer;
  display: inline-flex;
  font-size: var(--agent-font-size-lg);
  font-weight: var(--agent-font-weight-semibold);
  height: 36px;
  justify-content: center;
  min-width: 74px;
  padding: 0 14px;
}

.composer__send-btn:enabled {
  background: var(--agent-color-brand-primary);
  color: #ffffff;
}
</style>
