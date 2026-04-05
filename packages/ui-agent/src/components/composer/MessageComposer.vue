<template>
  <section class="composer" :class="{ 'composer--note': noteMode }">
    <!-- 顶部模式选择行 -->
    <div class="composer__mode-bar">
      <div class="composer__mode-wrap" ref="modeWrapRef">
        <button class="composer__mode-btn" type="button" @click="modeMenuOpen = !modeMenuOpen">
          <svg v-if="!noteMode" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          <svg v-else width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
          <span>{{ noteMode ? '备注' : '回复' }}</span>
        </button>
        <div v-if="modeMenuOpen" class="composer__mode-menu">
          <button class="composer__mode-item" :class="{ 'composer__mode-item--active': !noteMode }" type="button" @click="setMode(false)">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            回复
          </button>
          <button class="composer__mode-item" :class="{ 'composer__mode-item--active': noteMode }" type="button" @click="setMode(true)">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
            备注
          </button>
        </div>
      </div>
    </div>
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
        <button class="tool-icon" type="button" aria-label="附件" @click="fileInputRef?.click()">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
        </button>
        <button v-if="showPolish" class="tool-icon" type="button" aria-label="润色" @click="$emit('polish')">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
        </button>
        <button class="tool-icon" type="button" aria-label="机器人" v-if="!noteMode">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a4 4 0 0 1 4 4v2a4 4 0 0 1-8 0V6a4 4 0 0 1 4-4z"/><path d="M16 14H8a4 4 0 0 0-4 4v2h16v-2a4 4 0 0 0-4-4z"/><circle cx="12" cy="6" r="1"/></svg>
        </button>
        <button v-if="showTranslate && !noteMode" class="tool-icon" type="button" aria-label="翻译" @click="$emit('translate')">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
        </button>
      </div>
    </div>

    <div class="composer__textarea-wrap">
      <div v-if="attachments.length > 0" class="composer__attachments">
        <div v-for="(file, idx) in attachments" :key="idx" class="composer__att-card" :class="{ 'composer__att-card--image': file.isImage }">
          <img v-if="file.isImage" :src="file.objectUrl" class="composer__att-thumb" :alt="file.name" />
          <template v-else>
            <span class="composer__att-icon">{{ fileEmoji(file.name) }}</span>
            <span class="composer__att-name">{{ file.name }}</span>
            <span class="composer__att-size">{{ formatSize(file.size) }}</span>
          </template>
          <button type="button" class="composer__att-remove" @click="removeAttachment(idx)">&times;</button>
        </div>
      </div>
      <textarea
        class="composer__textarea"
        :placeholder="noteMode ? '添加内部备注，仅客服可见…' : placeholder"
        :value="modelValue"
        @input="handleTextareaInput"
      />
    </div>

    <div class="composer__footer">
      <button class="composer__send-btn" type="button" :disabled="!modelValue.trim() && attachments.length === 0" @click="$emit('send', noteMode, attachments)">{{ noteMode ? '添加备注' : '发送' }}</button>
    </div>
    <input ref="fileInputRef" type="file" multiple style="display:none" @change="handleFileSelect" />
  </section>
</template>

<script setup lang="ts">
import { ref, watch, reactive, onMounted, onBeforeUnmount } from "vue";
import QuickReplyPanel from "./QuickReplyPanel.vue";
import type { QuickReplyItem, QuickReplyCategory } from "../../types";

const props = withDefaults(defineProps<{
  modelValue: string;
  placeholder?: string;
  disabled?: boolean;
  showPolish?: boolean;
  showTranslate?: boolean;
  quickReplyCategories?: QuickReplyCategory[];
  sessionId?: string;
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
  (e: "send", isNote: boolean, attachments: FileAttachment[]): void;
  (e: "quick-reply-settings"): void;
  (e: "mode-change", mode: "reply" | "note"): void;
}>();

const showQuickReply = ref(false);
const modeMenuOpen = ref(false);
const modeWrapRef = ref<HTMLElement | null>(null);
const fileInputRef = ref<HTMLInputElement | null>(null);

interface FileAttachment { name: string; size: number; objectUrl: string; isImage?: boolean; }
const attachments = reactive<FileAttachment[]>([]);
const MAX_ATTACHMENTS = 10;
const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

function fileEmoji(name: string): string {
  const ext = name.split('.').pop()?.toLowerCase() || '';
  if (ext === 'pdf') return '\u{1F4C4}';
  if (['doc', 'docx'].includes(ext)) return '\u{1F4DD}';
  if (['xls', 'xlsx', 'csv'].includes(ext)) return '\u{1F4CA}';
  if (['zip', 'rar', '7z'].includes(ext)) return '\u{1F4E6}';
  return '\u{1F4CE}';
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

function handleFileSelect(e: Event) {
  const input = e.target as HTMLInputElement;
  if (!input.files) return;
  for (const file of Array.from(input.files)) {
    if (file.size > MAX_UPLOAD_BYTES) continue;
    if (attachments.length >= MAX_ATTACHMENTS) break;
    attachments.push({
      name: file.name,
      size: file.size,
      objectUrl: URL.createObjectURL(file),
      isImage: file.type.startsWith('image/'),
    });
  }
  input.value = '';
}

function removeAttachment(idx: number) {
  const removed = attachments.splice(idx, 1);
  if (removed.length) URL.revokeObjectURL(removed[0].objectUrl);
}

function clearAttachments() {
  for (const a of attachments) URL.revokeObjectURL(a.objectUrl);
  attachments.splice(0, attachments.length);
}

function storageKey(id: string) {
  return `composer-mode:${id}`;
}

const noteMode = ref(
  props.sessionId ? localStorage.getItem(storageKey(props.sessionId)) === "note" : false
);

watch(() => props.sessionId, (id) => {
  noteMode.value = id ? localStorage.getItem(storageKey(id)) === "note" : false;
});

watch(noteMode, (val) => {
  emit("mode-change", val ? "note" : "reply");
  if (props.sessionId) {
    if (val) {
      localStorage.setItem(storageKey(props.sessionId), "note");
    } else {
      localStorage.removeItem(storageKey(props.sessionId));
    }
  }
});

function setMode(isNote: boolean) {
  noteMode.value = isNote;
  modeMenuOpen.value = false;
}

function handleClickOutside(e: MouseEvent) {
  if (modeWrapRef.value && !modeWrapRef.value.contains(e.target as Node)) {
    modeMenuOpen.value = false;
  }
}

onMounted(() => document.addEventListener("mousedown", handleClickOutside));
onBeforeUnmount(() => document.removeEventListener("mousedown", handleClickOutside));

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
  transition: background var(--agent-motion-fast);
}

.composer--note {
  background: var(--agent-color-status-warning-bg);
}

.composer__mode-bar {
  border-bottom: 1px solid var(--agent-color-border-default);
  padding-bottom: 6px;
}

.composer__mode-wrap {
  display: inline-block;
  position: relative;
}

.composer__mode-btn {
  align-items: center;
  background: transparent;
  border: 0;
  border-radius: var(--agent-radius-sm);
  color: var(--agent-color-text-secondary);
  cursor: pointer;
  display: inline-flex;
  font-size: var(--agent-font-size-sm);
  gap: 4px;
  height: 28px;
  outline: none;
  padding: 0 4px;
}

.composer__mode-btn:hover {
  color: var(--agent-color-text-primary);
}

.composer__mode-menu {
  background: #ffffff;
  border: 1px solid var(--agent-color-border-default);
  border-radius: var(--agent-radius-md);
  box-shadow: var(--agent-shadow-sm);
  display: flex;
  flex-direction: column;
  left: 0;
  min-width: 110px;
  padding: 4px;
  position: absolute;
  top: calc(100% + 4px);
  z-index: var(--agent-z-dropdown);
}

.composer__mode-item {
  align-items: center;
  background: transparent;
  border: 0;
  border-radius: var(--agent-radius-sm);
  color: var(--agent-color-text-primary);
  cursor: pointer;
  display: flex;
  font-size: var(--agent-font-size-sm);
  gap: var(--agent-space-8);
  padding: 7px 10px;
  text-align: left;
}

.composer__mode-item:hover {
  background: var(--agent-color-bg-muted);
}

.composer__mode-item--active {
  color: var(--agent-color-brand-primary);
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

.composer--note .tool-icon:hover {
  background: rgba(0, 0, 0, 0.06);
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
  gap: var(--agent-space-8);
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

.composer__attachments {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding-bottom: var(--agent-space-8);
}

.composer__att-card {
  align-items: center;
  background: var(--agent-color-bg-muted);
  border: 1px solid var(--agent-color-border-default);
  border-radius: var(--agent-radius-md);
  display: inline-flex;
  font-size: var(--agent-font-size-sm);
  gap: 6px;
  padding: 6px 10px;
}

.composer__att-icon { font-size: 16px; line-height: 1; }

.composer__att-name {
  color: var(--agent-color-text-primary);
  max-width: 160px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.composer__att-size {
  color: var(--agent-color-text-tertiary);
  flex-shrink: 0;
  font-size: var(--agent-font-size-xs);
}

.composer__att-remove {
  background: transparent;
  border: 0;
  color: var(--agent-color-text-tertiary);
  cursor: pointer;
  font-size: 16px;
  line-height: 1;
  padding: 0 2px;
}

.composer__att-remove:hover { color: var(--agent-color-status-error); }

.composer__att-card--image {
  background: transparent;
  border: 0;
  padding: 0;
  position: relative;
}

.composer__att-thumb {
  border-radius: var(--agent-radius-md);
  display: block;
  height: 64px;
  object-fit: cover;
  width: 64px;
}

.composer__att-card--image .composer__att-remove {
  background: rgba(0,0,0,0.5);
  border-radius: 50%;
  color: #fff;
  font-size: 12px;
  height: 18px;
  line-height: 18px;
  padding: 0;
  position: absolute;
  right: -6px;
  text-align: center;
  top: -6px;
  width: 18px;
}
</style>
