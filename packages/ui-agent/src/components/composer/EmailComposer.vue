<template>
  <section class="email-composer">
    <!-- 无可用邮箱时显示禁用提示 -->
    <div v-if="fromOptions.length === 0" class="email-composer__disabled-overlay">
      <svg class="email-composer__disabled-icon" width="40" height="40" viewBox="0 0 40 40" fill="none">
        <rect x="5" y="10" width="30" height="20" rx="3" stroke="#c5cdd8" stroke-width="2" fill="none"/>
        <path d="M5 13l15 10 15-10" stroke="#c5cdd8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <p class="email-composer__disabled-title">暂无可用的发件邮箱</p>
      <p class="email-composer__disabled-hint">请先在 <strong>渠道 > Email</strong> 中添加邮箱后再回复</p>
    </div>

    <template v-else>
    <QuickReplyPanel
      v-if="showQuickReply && quickReplyCategories && quickReplyCategories.length > 0"
      :categories="quickReplyCategories"
      @close="handleQuickReplyClose"
      @settings="$emit('quick-reply-settings')"
      @select="handleQuickReplySelect"
    />
    <div class="email-composer__header">
      <div class="email-composer__field">
        <label class="email-composer__label">To:</label>
        <span class="email-composer__value">{{ to }}</span>
      </div>
      <div class="email-composer__field">
        <label class="email-composer__label">From:</label>
        <select
          class="email-composer__from-select"
          :value="selectedFrom"
          @change="$emit('update:selectedFrom', ($event.target as HTMLSelectElement).value)"
        >
          <option v-for="email in fromOptions" :key="email" :value="email">{{ email }}</option>
        </select>
      </div>
    </div>

    <div class="email-composer__toolbar">
      <div class="email-composer__tools">
        <button class="email-composer__tool-btn" type="button" aria-label="加粗" @click="execFormat('bold')">
          <AgentIcon name="bold" :size="14" />
        </button>
        <button class="email-composer__tool-btn" type="button" aria-label="斜体" @click="execFormat('italic')">
          <AgentIcon name="italic" :size="14" />
        </button>
        <button class="email-composer__tool-btn" type="button" aria-label="下划线" @click="execFormat('underline')">
          <AgentIcon name="underline" :size="14" />
        </button>
        <span class="email-composer__divider" />
        <button class="email-composer__tool-btn" type="button" aria-label="有序列表" @click="execFormat('insertOrderedList')">
          <AgentIcon name="list-ordered" :size="14" />
        </button>
        <button class="email-composer__tool-btn" type="button" aria-label="无序列表" @click="execFormat('insertUnorderedList')">
          <AgentIcon name="list-unordered" :size="14" />
        </button>
        <button class="email-composer__tool-btn" type="button" aria-label="链接" @click="insertLink">
          <AgentIcon name="link" :size="14" />
        </button>
        <span class="email-composer__divider" />
        <button class="tool-icon" type="button" aria-label="附件" @click="triggerFileSelect">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
        </button>
        <button class="tool-icon" type="button" aria-label="图片" @click="triggerImageSelect">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
        </button>
        <button class="tool-icon" type="button" aria-label="表情" @click="$emit('emoji')">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>
        </button>
        <button v-if="showTranslate" class="tool-icon" type="button" aria-label="翻译" @click="$emit('translate')">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
        </button>
        <span class="email-composer__divider" />
        <button class="tool-icon" type="button" aria-label="快捷回复" @click="toggleQuickReply">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><line x1="8" y1="9" x2="16" y2="9"/><line x1="8" y1="13" x2="13" y2="13"/></svg>
        </button>
        <button class="tool-icon" type="button" aria-label="Copilot推荐" @click="$emit('copilot')">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a4 4 0 0 1 4 4v2a4 4 0 0 1-8 0V6a4 4 0 0 1 4-4z"/><path d="M16 14H8a4 4 0 0 0-4 4v2h16v-2a4 4 0 0 0-4-4z"/><circle cx="12" cy="6" r="1"/></svg>
        </button>
      </div>
    </div>

    <input
      ref="fileInputRef"
      type="file"
      multiple
      accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.zip,.rar,.7z,.txt"
      style="display: none"
      @change="handleFileSelect"
    />

    <input
      ref="imageInputRef"
      type="file"
      multiple
      accept="image/*"
      style="display: none"
      @change="handleImageSelect"
    />

    <div class="email-composer__editor-wrap">
      <div
        ref="editorRef"
        class="email-composer__editor"
        contenteditable="true"
        :data-placeholder="placeholder"
        @input="handleInput"
        @keydown="handleKeydown"
      />
    </div>

    <div v-if="fileAttachments.length > 0" class="email-composer__attachments">
      <div v-for="(file, idx) in fileAttachments" :key="idx" class="email-composer__att-card">
        <span class="email-composer__att-icon">{{ fileEmoji(file.name) }}</span>
        <span class="email-composer__att-name">{{ file.name }}</span>
        <span class="email-composer__att-size">{{ formatSize(file.size) }}</span>
        <button type="button" class="email-composer__att-remove" @click="removeAttachment(idx)">&times;</button>
      </div>
    </div>

    <div class="email-composer__footer">
      <div class="email-composer__split-btn">
        <button class="email-composer__send-btn" type="button" :disabled="isSendDisabled" @click="handlePrimarySend">发送</button>
        <button class="email-composer__split-arrow" type="button" :disabled="isSendDisabled" @click.stop="toggleSendMenu">
          <svg width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
      </div>
      <div v-if="sendMenuOpen" class="email-composer__send-menu">
        <button type="button" @click="handleMenuSend">发送</button>
        <button type="button" @click="handleMenuSendPending">发送并标记为待处理</button>
        <button type="button" @click="handleMenuSendResolve">发送并结束</button>
      </div>
    </div>
    </template>
  </section>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from "vue";
import AgentIcon from "../icon/AgentIcon.vue";
import QuickReplyPanel from "./QuickReplyPanel.vue";
import type { QuickReplyItem, QuickReplyCategory } from "../../types";

interface FileAttachment {
  name: string;
  size: number;
  objectUrl: string;
}

const props = withDefaults(defineProps<{
  to: string;
  fromOptions: string[];
  selectedFrom: string;
  modelValue: string;
  placeholder?: string;
  disabled?: boolean;
  showTranslate?: boolean;
  quickReplyCategories?: QuickReplyCategory[];
}>(), {
  placeholder: "发消息或输入 / 选择快捷回复",
  showTranslate: true,
});

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
  (e: "update:selectedFrom", value: string): void;
  (e: "emoji"): void;
  (e: "attachment"): void;
  (e: "translate"): void;
  (e: "toast", message: string): void;
  (e: "send"): void;
  (e: "send-and-pending"): void;
  (e: "send-and-resolve"): void;
  (e: "quick-reply-settings"): void;
  (e: "copilot"): void;
}>();

const MAX_TEXT_LENGTH = 2000;
const MAX_ATTACHMENTS = 10;
const MAX_UPLOAD_BYTES = 20 * 1024 * 1024;

const editorRef = ref<HTMLDivElement>();
const fileInputRef = ref<HTMLInputElement>();
const imageInputRef = ref<HTMLInputElement>();
const sendMenuOpen = ref(false);
const fileAttachments = reactive<FileAttachment[]>([]);
const canSend = ref(false);
const textLimitReached = ref(false);
const showQuickReply = ref(false);
const isSendDisabled = computed(() => props.disabled || !canSend.value);

function fileEmoji(name: string): string {
  const ext = name.split('.').pop()?.toLowerCase() || '';
  if (['pdf'].includes(ext)) return '\u{1F4C4}';
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

function triggerFileSelect() {
  emit('attachment');
  fileInputRef.value?.click();
}

function triggerImageSelect() {
  imageInputRef.value?.click();
}

function handleImageSelect(e: Event) {
  const input = e.target as HTMLInputElement;
  if (!input.files) return;

  let exceededFileSize = false;
  for (const file of Array.from(input.files)) {
    if (file.size > MAX_UPLOAD_BYTES) {
      exceededFileSize = true;
      continue;
    }
    if (file.type.startsWith('image/')) {
      insertImage(file);
    }
  }
  if (exceededFileSize) {
    emit("toast", "图片大小不能超过20MB");
  }
  input.value = '';
  syncEditorState();
}

function escapeHtml(text: string): string {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function placeCaretAtEnd(el: HTMLElement) {
  const selection = window.getSelection();
  if (!selection) return;
  const range = document.createRange();
  range.selectNodeContents(el);
  range.collapse(false);
  selection.removeAllRanges();
  selection.addRange(range);
}

function getEditorTextContent(): string {
  if (!editorRef.value) return "";
  const walker = document.createTreeWalker(editorRef.value, NodeFilter.SHOW_TEXT);
  let text = "";
  let currentNode: Node | null = walker.nextNode();
  while (currentNode) {
    text += currentNode.textContent ?? "";
    currentNode = walker.nextNode();
  }
  return text;
}

function trimEditorTextToLimit(): boolean {
  if (!editorRef.value) return false;

  const walker = document.createTreeWalker(editorRef.value, NodeFilter.SHOW_TEXT);
  let remaining = MAX_TEXT_LENGTH;
  let exceeded = false;
  let currentNode: Node | null = walker.nextNode();

  while (currentNode) {
    const textNode = currentNode as Text;
    const value = textNode.textContent ?? "";
    if (value.length > 0) {
      if (remaining <= 0) {
        textNode.textContent = "";
        exceeded = true;
      } else if (value.length > remaining) {
        textNode.textContent = value.slice(0, remaining);
        remaining = 0;
        exceeded = true;
      } else {
        remaining -= value.length;
      }
    }
    currentNode = walker.nextNode();
  }

  return exceeded;
}

function syncEditorState() {
  if (!editorRef.value) {
    canSend.value = false;
    emit("update:modelValue", "");
    return;
  }

  const hasText = getEditorTextContent().trim().length > 0;
  const hasImage = editorRef.value.querySelector("img") !== null;
  canSend.value = hasText || hasImage;
  emit("update:modelValue", editorRef.value.innerHTML);
}

function insertImage(file: File) {
  const url = URL.createObjectURL(file);
  const safeName = escapeHtml(file.name);
  const imageHtml = `<p><br></p><img src="${url}" alt="${safeName}" style="max-width:100%;border-radius:4px;margin:4px 0;cursor:nwse-resize;" /><p><br></p>`;

  if (!editorRef.value) return;
  editorRef.value.focus();
  placeCaretAtEnd(editorRef.value);
  document.execCommand("insertHTML", false, imageHtml);
  handleInput();
}

function handleFileSelect(e: Event) {
  const input = e.target as HTMLInputElement;
  if (!input.files) return;

  let reachedAttachmentLimit = false;
  let exceededFileSize = false;

  for (const file of Array.from(input.files)) {
    if (file.size > MAX_UPLOAD_BYTES) {
      exceededFileSize = true;
      continue;
    }

    if (file.type.startsWith('image/')) {
      insertImage(file);
    } else {
      if (fileAttachments.length >= MAX_ATTACHMENTS) {
        reachedAttachmentLimit = true;
        continue;
      }
      fileAttachments.push({
        name: file.name,
        size: file.size,
        objectUrl: URL.createObjectURL(file),
      });
    }
  }

  if (exceededFileSize) {
    emit("toast", "附件和图片大小不能超过20MB");
  }
  if (reachedAttachmentLimit) {
    emit("toast", `最多添加${MAX_ATTACHMENTS}个附件`);
  }

  input.value = '';
  syncEditorState();
}

function removeAttachment(idx: number) {
  const removed = fileAttachments.splice(idx, 1);
  if (removed.length) URL.revokeObjectURL(removed[0].objectUrl);
}

function getAttachments(): FileAttachment[] {
  return [...fileAttachments];
}

function clearAttachments() {
  for (const att of fileAttachments) URL.revokeObjectURL(att.objectUrl);
  fileAttachments.splice(0, fileAttachments.length);
}

function hasSendableContent() {
  return canSend.value;
}

function toggleQuickReply() {
  showQuickReply.value = !showQuickReply.value;
}

function handleQuickReplySelect(item: QuickReplyItem) {
  if (!editorRef.value) return;
  editorRef.value.innerHTML = "";
  // 插入文本内容
  const textHtml = escapeHtml(item.reply).replace(/\n/g, "<br>");
  editorRef.value.innerHTML = textHtml;
  // 如有图片追加到末尾
  for (const img of item.images) {
    const safeName = escapeHtml(img.name);
    editorRef.value.insertAdjacentHTML(
      "beforeend",
      `<p><br></p><img src="${img.url}" alt="${safeName}" style="max-width:100%;border-radius:4px;margin:4px 0;" />`
    );
  }
  placeCaretAtEnd(editorRef.value);
  syncEditorState();
  showQuickReply.value = false;
}

function handleQuickReplyClose() {
  showQuickReply.value = false;
}

defineExpose({ getAttachments, clearAttachments, hasSendableContent });

const toggleSendMenu = () => {
  if (isSendDisabled.value) return;
  sendMenuOpen.value = !sendMenuOpen.value;
};

const closeSendMenu = () => {
  sendMenuOpen.value = false;
};

const handlePrimarySend = () => {
  if (isSendDisabled.value) return;
  sendMenuOpen.value = false;
  emit("send");
};

const handleMenuSend = () => {
  if (isSendDisabled.value) return;
  sendMenuOpen.value = false;
  emit("send");
};

const handleMenuSendPending = () => {
  if (isSendDisabled.value) return;
  sendMenuOpen.value = false;
  emit("send-and-pending");
};

const handleMenuSendResolve = () => {
  if (isSendDisabled.value) return;
  sendMenuOpen.value = false;
  emit("send-and-resolve");
};

function handleInput() {
  if (!editorRef.value) return;

  const exceeded = trimEditorTextToLimit();
  if (exceeded) {
    placeCaretAtEnd(editorRef.value);
    if (!textLimitReached.value) {
      emit("toast", `文本最多支持${MAX_TEXT_LENGTH}字符`);
    }
  }
  textLimitReached.value = exceeded;
  if (!exceeded) {
    textLimitReached.value = false;
  }

  // 检测 / 触发快捷回复
  const text = getEditorTextContent();
  if (text === "/" && props.quickReplyCategories && props.quickReplyCategories.length > 0) {
    showQuickReply.value = true;
  }

  syncEditorState();
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
    e.preventDefault();
    if (isSendDisabled.value) return;
    emit("send");
  }
}

function execFormat(command: string) {
  document.execCommand(command, false);
  editorRef.value?.focus();
}

function insertLink() {
  const url = prompt("输入链接地址：", "https://");
  if (url) {
    document.execCommand("createLink", false, url);
    editorRef.value?.focus();
  }
}

watch(() => props.modelValue, (val) => {
  if (editorRef.value && editorRef.value.innerHTML !== val) {
    editorRef.value.innerHTML = val;
    syncEditorState();
  }
});

onMounted(() => {
  if (editorRef.value && props.modelValue) {
    editorRef.value.innerHTML = props.modelValue;
  }
  syncEditorState();
  document.addEventListener("click", closeSendMenu);

  // 图片 resize：点击图片后拖拽调整大小
  if (editorRef.value) {
    let resizingImg: HTMLImageElement | null = null;
    let startX = 0;
    let startWidth = 0;

    editorRef.value.addEventListener("mousedown", (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "IMG") {
        e.preventDefault();
        resizingImg = target as HTMLImageElement;
        startX = e.clientX;
        startWidth = resizingImg.offsetWidth;
        resizingImg.style.outline = "2px solid var(--agent-color-brand-primary, #2f6bff)";
      }
    });

    document.addEventListener("mousemove", (e: MouseEvent) => {
      if (!resizingImg) return;
      const delta = e.clientX - startX;
      const newWidth = Math.max(50, startWidth + delta);
      resizingImg.style.width = newWidth + "px";
      resizingImg.style.height = "auto";
    });

    document.addEventListener("mouseup", () => {
      if (resizingImg) {
        resizingImg.style.outline = "";
        resizingImg = null;
        syncEditorState();
      }
    });
  }
});

onBeforeUnmount(() => {
  document.removeEventListener("click", closeSendMenu);
});
</script>

<style scoped>
.email-composer {
  background: transparent;
  display: flex;
  flex-direction: column;
  position: relative;
}

.email-composer__disabled-overlay {
  align-items: center;
  display: flex;
  flex-direction: column;
  gap: 8px;
  justify-content: center;
  min-height: 160px;
  padding: 24px;
}

.email-composer__disabled-icon {
  margin-bottom: 4px;
  opacity: 0.6;
}

.email-composer__disabled-title {
  color: var(--agent-color-text-primary);
  font-size: var(--agent-font-size-sm);
  font-weight: var(--agent-font-weight-semibold);
  margin: 0;
}

.email-composer__disabled-hint {
  color: #75869c;
  font-size: var(--agent-font-size-xs);
  margin: 0;
}

.email-composer__header {
  border-bottom: 1px solid var(--agent-color-border-default);
  display: flex;
  flex-direction: column;
  gap: 0;
  padding: 8px 12px;
}

.email-composer__field {
  align-items: center;
  display: flex;
  gap: 8px;
  min-height: 32px;
}

.email-composer__field + .email-composer__field {
  border-top: 1px solid var(--agent-color-border-light, #f0f2f5);
}

.email-composer__label {
  color: var(--agent-color-text-secondary);
  flex-shrink: 0;
  font-size: var(--agent-font-size-sm);
  min-width: 56px;
}

.email-composer__value {
  color: var(--agent-color-text-primary);
  font-size: var(--agent-font-size-sm);
}

.email-composer__from-select {
  background: transparent;
  border: 1px solid var(--agent-color-border-default);
  border-radius: var(--agent-radius-sm);
  color: var(--agent-color-text-primary);
  cursor: pointer;
  font-size: var(--agent-font-size-sm);
  height: 28px;
  outline: none;
  padding: 0 8px;
}

.email-composer__from-select:focus {
  border-color: var(--agent-color-brand-primary);
}

.email-composer__subject-input {
  background: transparent;
  border: 0;
  color: var(--agent-color-text-primary);
  flex: 1;
  font-size: var(--agent-font-size-sm);
  outline: none;
  padding: 0;
}

.email-composer__subject-input::placeholder {
  color: #a6afbd;
}

.email-composer__toolbar {
  border-bottom: 1px solid var(--agent-color-border-default);
  display: flex;
  padding: 4px 12px;
}

.email-composer__tools {
  align-items: center;
  display: flex;
  gap: 2px;
}

.email-composer__tool-btn {
  align-items: center;
  background: transparent;
  border: 0;
  border-radius: var(--agent-radius-sm);
  color: var(--agent-color-text-secondary);
  cursor: pointer;
  display: inline-flex;
  height: 28px;
  justify-content: center;
  width: 28px;
}

.email-composer__tool-btn:hover {
  background: var(--agent-color-bg-muted);
  color: var(--agent-color-text-primary);
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

.email-composer__divider {
  background: var(--agent-color-border-default);
  height: 16px;
  margin: 0 4px;
  width: 1px;
}

.email-composer__editor-wrap {
  position: relative;
}

.email-composer__editor {
  color: var(--agent-color-text-primary);
  font-family: inherit;
  font-size: var(--agent-font-size-sm);
  line-height: 1.6;
  min-height: 120px;
  outline: none;
  overflow-y: auto;
  padding: 10px 12px;
}

.email-composer__editor:empty::before {
  color: #a6afbd;
  content: attr(data-placeholder);
  pointer-events: none;
}

.email-composer__attachments {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 0 12px 8px;
}

.email-composer__att-card {
  align-items: center;
  background: var(--agent-color-bg-muted, #f5f7fa);
  border: 1px solid var(--agent-color-border-default);
  border-radius: var(--agent-radius-md);
  display: inline-flex;
  font-size: var(--agent-font-size-sm);
  gap: 6px;
  padding: 6px 10px;
}

.email-composer__att-icon {
  font-size: 16px;
  line-height: 1;
}

.email-composer__att-name {
  color: var(--agent-color-text-primary);
  max-width: 160px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.email-composer__att-size {
  color: var(--agent-color-text-tertiary);
  flex-shrink: 0;
  font-size: var(--agent-font-size-xs);
}

.email-composer__att-remove {
  background: transparent;
  border: 0;
  color: var(--agent-color-text-tertiary);
  cursor: pointer;
  font-size: 16px;
  line-height: 1;
  padding: 0 2px;
}

.email-composer__att-remove:hover {
  color: var(--agent-color-status-error, #ef4444);
}

.email-composer__footer {
  align-items: center;
  display: flex;
  justify-content: flex-end;
  padding: 8px 12px;
  position: relative;
}

.email-composer__split-btn {
  display: inline-flex;
}

.email-composer__send-btn {
  align-items: center;
  background: #f0f3f8;
  border: 0;
  border-radius: 10px 0 0 10px;
  color: #9ca8ba;
  cursor: pointer;
  display: inline-flex;
  font-size: var(--agent-font-size-lg);
  font-weight: var(--agent-font-weight-semibold);
  height: 36px;
  justify-content: center;
  min-width: 62px;
  padding: 0 14px;
}

.email-composer__send-btn:enabled {
  background: var(--agent-color-brand-primary);
  color: #ffffff;
}

.email-composer__split-arrow {
  align-items: center;
  background: #f0f3f8;
  border: 0;
  border-left: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 0 10px 10px 0;
  color: #9ca8ba;
  cursor: pointer;
  display: inline-flex;
  height: 36px;
  justify-content: center;
  width: 30px;
}

.email-composer__split-arrow:enabled {
  background: var(--agent-color-brand-primary);
  border-left-color: rgba(255, 255, 255, 0.3);
  color: #ffffff;
}

.email-composer__send-menu {
  background: #ffffff;
  border: 1px solid var(--agent-color-border-default);
  border-radius: var(--agent-radius-md);
  bottom: calc(100% + 4px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  min-width: 200px;
  position: absolute;
  right: 12px;
  z-index: var(--agent-z-dropdown);
}

.email-composer__send-menu button {
  background: transparent;
  border: 0;
  color: var(--agent-color-text-primary);
  cursor: pointer;
  font-size: var(--agent-font-size-sm);
  padding: 10px 14px;
  text-align: left;
  white-space: nowrap;
}

.email-composer__send-menu button:hover {
  background: var(--agent-color-bg-muted);
}

.email-composer__send-menu button:first-child {
  border-radius: var(--agent-radius-md) var(--agent-radius-md) 0 0;
}

.email-composer__send-menu button:last-child {
  border-radius: 0 0 var(--agent-radius-md) var(--agent-radius-md);
}
</style>
