<template>
  <section class="email-composer">
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
      <div class="email-composer__field">
        <label class="email-composer__label">Subject:</label>
        <input
          class="email-composer__subject-input"
          type="text"
          :value="subject"
          placeholder="邮件主题"
          @input="$emit('update:subject', ($event.target as HTMLInputElement).value)"
        />
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
        <button class="tool-icon" type="button" aria-label="附件" @click="$emit('attachment')">📎</button>
        <button class="tool-icon" type="button" aria-label="表情" @click="$emit('emoji')">☺</button>
        <button v-if="showTranslate" class="tool-icon" type="button" aria-label="翻译" @click="$emit('translate')">🌐</button>
      </div>
    </div>

    <div
      ref="editorRef"
      class="email-composer__editor"
      contenteditable="true"
      :data-placeholder="placeholder"
      @input="handleInput"
      @keydown="handleKeydown"
    />

    <div class="email-composer__footer">
      <button class="email-composer__send-btn" type="button" :disabled="disabled" @click="$emit('send')">发送</button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, nextTick } from "vue";
import AgentIcon from "../icon/AgentIcon.vue";

const props = withDefaults(defineProps<{
  to: string;
  fromOptions: string[];
  selectedFrom: string;
  subject: string;
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
  (e: "update:subject", value: string): void;
  (e: "emoji"): void;
  (e: "attachment"): void;
  (e: "translate"): void;
  (e: "send"): void;
}>();

const editorRef = ref<HTMLDivElement>();

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
});
</script>

<style scoped>
.email-composer {
  background: transparent;
  display: flex;
  flex-direction: column;
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

.email-composer__footer {
  align-items: center;
  display: flex;
  justify-content: flex-end;
  padding: 8px 12px;
}

.email-composer__send-btn {
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

.email-composer__send-btn:enabled {
  background: var(--agent-color-brand-primary);
  color: #ffffff;
}
</style>
