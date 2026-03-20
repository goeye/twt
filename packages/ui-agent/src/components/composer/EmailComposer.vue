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
        <button class="tool-icon" type="button" aria-label="附件" @click="triggerFileSelect">📎</button>
        <button class="tool-icon" type="button" aria-label="表情" @click="$emit('emoji')">☺</button>
        <button v-if="showTranslate" class="tool-icon" type="button" aria-label="翻译" @click="$emit('translate')">🌐</button>
      </div>
    </div>

    <input
      ref="fileInputRef"
      type="file"
      multiple
      style="display: none"
      @change="handleFileSelect"
    />

    <div
      ref="editorRef"
      class="email-composer__editor"
      contenteditable="true"
      :data-placeholder="placeholder"
      @input="handleInput"
      @keydown="handleKeydown"
    />

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
        <button class="email-composer__send-btn" type="button" :disabled="disabled" @click="$emit('send')">发送</button>
        <button class="email-composer__split-arrow" type="button" :disabled="disabled" @click.stop="toggleSendMenu">
          <svg width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
      </div>
      <div v-if="sendMenuOpen" class="email-composer__send-menu">
        <button type="button" @click="handleMenuSend">发送</button>
        <button type="button" @click="handleMenuSendPending">发送并标记为待处理</button>
        <button type="button" @click="handleMenuSendResolve">发送并标记为已解决</button>
      </div>
    </div>
    </template>
  </section>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount, reactive } from "vue";
import AgentIcon from "../icon/AgentIcon.vue";

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
}>(), {
  placeholder: "输入邮件正文...",
  showTranslate: true,
});

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
  (e: "update:selectedFrom", value: string): void;
  (e: "emoji"): void;
  (e: "attachment"): void;
  (e: "translate"): void;
  (e: "send"): void;
  (e: "send-and-pending"): void;
  (e: "send-and-resolve"): void;
}>();

const editorRef = ref<HTMLDivElement>();
const fileInputRef = ref<HTMLInputElement>();
const sendMenuOpen = ref(false);
const fileAttachments = reactive<FileAttachment[]>([]);

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

function handleFileSelect(e: Event) {
  const input = e.target as HTMLInputElement;
  if (!input.files) return;
  for (const file of Array.from(input.files)) {
    if (file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      document.execCommand('insertHTML', false, `<img src="${url}" alt="${file.name}" style="max-width:100%;border-radius:4px;margin:4px 0;" />`);
      editorRef.value?.focus();
      handleInput();
    } else {
      fileAttachments.push({
        name: file.name,
        size: file.size,
        objectUrl: URL.createObjectURL(file),
      });
    }
  }
  input.value = '';
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

defineExpose({ getAttachments, clearAttachments });

const toggleSendMenu = () => {
  sendMenuOpen.value = !sendMenuOpen.value;
};

const closeSendMenu = () => {
  sendMenuOpen.value = false;
};

const handleMenuSend = () => {
  sendMenuOpen.value = false;
  emit("send");
};

const handleMenuSendPending = () => {
  sendMenuOpen.value = false;
  emit("send-and-pending");
};

const handleMenuSendResolve = () => {
  sendMenuOpen.value = false;
  emit("send-and-resolve");
};

function handleInput() {
  if (editorRef.value) {
    emit("update:modelValue", editorRef.value.innerHTML);
  }
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
    e.preventDefault();
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
  }
});

onMounted(() => {
  if (editorRef.value && props.modelValue) {
    editorRef.value.innerHTML = props.modelValue;
  }
  document.addEventListener("click", closeSendMenu);
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
  color: var(--agent-color-text-primary);
  cursor: pointer;
  display: inline-flex;
  font-size: 16px;
  height: 28px;
  justify-content: center;
  width: 28px;
}

.tool-icon:hover {
  background: var(--agent-color-bg-muted);
}

.email-composer__divider {
  background: var(--agent-color-border-default);
  height: 16px;
  margin: 0 4px;
  width: 1px;
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
  border-top: 1px solid var(--agent-color-border-default);
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 8px 12px;
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
