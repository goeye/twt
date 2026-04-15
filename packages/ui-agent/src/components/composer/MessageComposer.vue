<template>
  <section class="composer" :class="{ 'composer--note': noteMode }">
    <Teleport defer to="#chat-above-composer">
      <!-- Copilot 推荐回复卡片 -->
      <CopilotPanel v-if="copilotOpen && !noteMode" :suggestion="MOCK_SUGGESTION" @send="handleCopilotSend" @close="copilotOpen = false" />
      <!-- 边写边译区域 -->
      <div v-if="liveTranslate && !noteMode" class="composer__live-translate">
        <div class="composer__live-lang-wrap" ref="liveLangWrapRef">
          <button class="composer__live-lang" type="button" @click="toggleLiveLangPanel">{{ currentLiveLang.code }}</button>
          <div v-if="liveLangPanelOpen" class="composer__lang-panel" ref="langPanelRef">
            <div class="composer__lang-hint">将输入内容翻译为</div>
            <button
              v-for="lang in LANGUAGES"
              :key="lang.code"
              class="composer__lang-item"
              :class="{ 'composer__lang-item--active': liveTranslateLang === lang.code }"
              type="button"
              @click="selectLang('live', lang.code)"
            >
              <span class="composer__lang-code">{{ lang.code }}</span>
              <span>{{ lang.name }}</span>
              <svg v-if="liveTranslateLang === lang.code" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </button>
          </div>
        </div>
        <textarea class="composer__live-input" v-model="liveTranslatedText" placeholder="翻译为…" rows="1" />
        <button v-if="liveTranslatedText.trim()" class="composer__live-send" type="button" @click="sendLiveTranslation">发送</button>
      </div>
    </Teleport>
    <QuickReplyPanel
      v-if="showQuickReply && quickReplyCategories && quickReplyCategories.length > 0"
      :categories="quickReplyCategories"
      @close="showQuickReply = false"
      @settings="$emit('quick-reply-settings')"
      @select="handleQuickReplySelect"
    />
    <div class="composer__toolbar">
      <div class="composer__tools">
        <div class="composer__mode-wrap" ref="modeWrapRef">
          <button class="composer__mode-btn" type="button" @click="modeMenuOpen = !modeMenuOpen">
            <span>{{ noteMode ? '备注' : '回复' }}</span>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
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
        <span class="composer__divider" />
        <button class="tool-icon" type="button" aria-label="表情" @click="$emit('emoji')">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>
        </button>
        <button class="tool-icon" type="button" data-tooltip="快捷回复" @click="toggleQuickReply">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><line x1="8" y1="9" x2="16" y2="9"/><line x1="8" y1="13" x2="13" y2="13"/></svg>
        </button>
        <button class="tool-icon" type="button" data-tooltip="上传文件" @click="fileInputRef?.click()">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
        </button>
        <button v-if="showPolish" class="tool-icon" type="button" data-tooltip="文本润色" @click="$emit('polish')">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
        </button>
        <div v-if="!noteMode" class="composer__copilot-wrap" ref="copilotBtnRef">
          <button class="tool-icon" :class="{ 'tool-icon--active': copilotOpen }" type="button" data-tooltip="Copilot 推荐回复" @click="toggleCopilot">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a4 4 0 0 1 4 4v2a4 4 0 0 1-8 0V6a4 4 0 0 1 4-4z"/><path d="M16 14H8a4 4 0 0 0-4 4v2h16v-2a4 4 0 0 0-4-4z"/><circle cx="12" cy="6" r="1"/></svg>
          </button>
        </div>
        <div v-if="showTranslate && !noteMode" class="composer__translate-wrap" ref="translateBtnRef">
          <button class="tool-icon" :class="{ 'tool-icon--active': translatePanelOpen }" type="button" data-tooltip="AI 翻译" @click="toggleTranslatePanel">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
          </button>
          <div v-if="translatePanelOpen" class="composer__translate-panel" ref="translatePanelRef">
            <div class="composer__translate-group">
              <div class="composer__translate-row">
                <span class="composer__translate-label">边写边译</span>
                <button class="composer__toggle" :class="{ 'composer__toggle--on': liveTranslate }" type="button" @click="liveTranslate = !liveTranslate" />
              </div>
              <div
                v-if="liveTranslate"
                class="composer__translate-row composer__translate-row--lang"
                @click="togglePanelLangMenu('live')"
              >
                <span class="composer__translate-label">翻译为</span>
                <span class="composer__translate-lang-val">{{ currentLiveLang.name }} <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg></span>
              </div>
            </div>
            <div class="composer__translate-divider" />
            <div class="composer__translate-group">
              <div class="composer__translate-row">
                <span class="composer__translate-label">聊天翻译</span>
                <button class="composer__toggle" :class="{ 'composer__toggle--on': chatTranslate }" type="button" @click="chatTranslate = !chatTranslate" />
              </div>
              <div
                v-if="chatTranslate"
                class="composer__translate-row composer__translate-row--lang"
                @click="togglePanelLangMenu('chat')"
              >
                <span class="composer__translate-label">翻译为</span>
                <span class="composer__translate-lang-val">{{ currentChatLang.name }} <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg></span>
              </div>
            </div>
          </div>
          <div v-if="panelLangMenu" class="composer__translate-flyout">
            <button
              v-for="lang in LANGUAGES"
              :key="`${panelLangMenu}-${lang.code}`"
              class="composer__translate-flyout-item"
              :class="{
                'composer__translate-flyout-item--active':
                  panelLangMenu === 'live' ? liveTranslateLang === lang.code : chatTranslateLang === lang.code
              }"
              type="button"
              @click.stop="selectLang(panelLangMenu, lang.code)"
            >
              {{ lang.name }}
            </button>
          </div>
        </div>
        <button v-if="!noteMode" class="tool-icon" type="button" data-tooltip="远程协助" @click="$emit('cobrowse')">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/><path d="M7 8l3 3-3 3"/><line x1="13" y1="11" x2="17" y2="11"/></svg>
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
        :placeholder="noteMode ? '添加备注，仅内部成员可见' : placeholder"
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
import { ref, watch, reactive, computed, onMounted, onBeforeUnmount } from "vue";
import QuickReplyPanel from "./QuickReplyPanel.vue";
import CopilotPanel from "./CopilotPanel.vue";
import type { QuickReplyItem, QuickReplyCategory } from "../../types";

type TranslationFeature = "live" | "chat";

interface ComposerTranslationSettings {
  liveTranslate: boolean;
  liveTranslateLang: string;
  chatTranslate: boolean;
  chatTranslateLang: string;
}

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

// 翻译相关
const LANGUAGES = [
  { code: 'en', name: '英语' },
  { code: 'es', name: '西班牙语' },
  { code: 'fr', name: '法语' },
  { code: 'de', name: '德语' },
  { code: 'pt', name: '葡萄牙语' },
  { code: 'ru', name: '俄语' },
  { code: 'zh-CN', name: '简体中文' },
  { code: 'zh-TW', name: '繁体中文' },
];
const translatePanelOpen = ref(false);
const panelLangMenu = ref<TranslationFeature | null>(null);
const liveLangPanelOpen = ref(false);
const liveTranslate = ref(false);
const chatTranslate = ref(true);
const liveTranslateLang = ref('en');
const chatTranslateLang = ref('zh-CN');
const liveTranslatedText = ref('');
const translateBtnRef = ref<HTMLElement | null>(null);
const translatePanelRef = ref<HTMLElement | null>(null);
const langPanelRef = ref<HTMLElement | null>(null);
const liveLangWrapRef = ref<HTMLElement | null>(null);

// Copilot
const MOCK_SUGGESTION = '感谢您的耐心等待！您的问题我已了解，请稍等片刻，我会尽快为您处理。';
const copilotOpen = ref(false);
const copilotBtnRef = ref<HTMLElement | null>(null);

function toggleCopilot() {
  copilotOpen.value = !copilotOpen.value;
}

function handleCopilotSend(text: string) {
  emit('update:modelValue', text);
  emit('send', false, []);
  copilotOpen.value = false;
}

const currentLiveLang = computed(() => LANGUAGES.find(l => l.code === liveTranslateLang.value) || LANGUAGES[0]);
const currentChatLang = computed(() => LANGUAGES.find(l => l.code === chatTranslateLang.value) || LANGUAGES[0]);

function getTranslationStorageKey(sessionId: string) {
  return `composer-translation:${sessionId}`;
}

function loadTranslationSettings(sessionId?: string): ComposerTranslationSettings {
  const defaults: ComposerTranslationSettings = {
    liveTranslate: false,
    liveTranslateLang: "en",
    chatTranslate: true,
    chatTranslateLang: "zh-CN",
  };

  if (!sessionId) return defaults;

  try {
    const raw = localStorage.getItem(getTranslationStorageKey(sessionId));
    if (!raw) return defaults;

    const parsed = JSON.parse(raw) as Partial<ComposerTranslationSettings>;
    return {
      liveTranslate: parsed.liveTranslate ?? defaults.liveTranslate,
      liveTranslateLang: parsed.liveTranslateLang ?? defaults.liveTranslateLang,
      chatTranslate: parsed.chatTranslate ?? defaults.chatTranslate,
      chatTranslateLang: parsed.chatTranslateLang ?? defaults.chatTranslateLang,
    };
  } catch {
    return defaults;
  }
}

function applyTranslationSettings(settings: ComposerTranslationSettings) {
  liveTranslate.value = settings.liveTranslate;
  liveTranslateLang.value = settings.liveTranslateLang;
  chatTranslate.value = settings.chatTranslate;
  chatTranslateLang.value = settings.chatTranslateLang;
}

function saveTranslationSettings(sessionId?: string) {
  if (!sessionId) return;

  try {
    const payload: ComposerTranslationSettings = {
      liveTranslate: liveTranslate.value,
      liveTranslateLang: liveTranslateLang.value,
      chatTranslate: chatTranslate.value,
      chatTranslateLang: chatTranslateLang.value,
    };
    localStorage.setItem(getTranslationStorageKey(sessionId), JSON.stringify(payload));
  } catch {
    // 静默失败
  }
}

function toggleTranslatePanel() {
  translatePanelOpen.value = !translatePanelOpen.value;
  if (!translatePanelOpen.value) panelLangMenu.value = null;
}

function togglePanelLangMenu(feature: TranslationFeature) {
  liveLangPanelOpen.value = false;
  panelLangMenu.value = panelLangMenu.value === feature ? null : feature;
}

function toggleLiveLangPanel() {
  panelLangMenu.value = null;
  liveLangPanelOpen.value = !liveLangPanelOpen.value;
}

function selectLang(feature: TranslationFeature, code: string) {
  if (feature === "live") {
    liveTranslateLang.value = code;
  } else {
    chatTranslateLang.value = code;
  }
  panelLangMenu.value = null;
  liveLangPanelOpen.value = false;
}

function sendLiveTranslation() {
  if (!liveTranslatedText.value.trim()) return;
  emit('send', false, []);
  liveTranslatedText.value = '';
  emit('update:modelValue', '');
}

// 模拟翻译：输入变化时更新边写边译内容
watch(() => props.modelValue, (val) => {
  if (!liveTranslate.value || !val.trim()) {
    liveTranslatedText.value = '';
    return;
  }
  // 模拟翻译结果（实际应调用翻译 API）
  liveTranslatedText.value = val;
});

watch(liveTranslateLang, () => {
  if (liveTranslate.value && props.modelValue.trim()) {
    liveTranslatedText.value = props.modelValue;
  }
});

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

function modeStorageKey(id: string) {
  return `composer-mode:${id}`;
}

const noteMode = ref(
  props.sessionId ? localStorage.getItem(modeStorageKey(props.sessionId)) === "note" : false
);

watch(() => props.sessionId, (id) => {
  noteMode.value = id ? localStorage.getItem(modeStorageKey(id)) === "note" : false;
  applyTranslationSettings(loadTranslationSettings(id));
}, { immediate: true });

watch(noteMode, (val) => {
  emit("mode-change", val ? "note" : "reply");
  if (props.sessionId) {
    if (val) {
      localStorage.setItem(modeStorageKey(props.sessionId), "note");
    } else {
      localStorage.removeItem(modeStorageKey(props.sessionId));
    }
  }
});

watch([liveTranslate, liveTranslateLang, chatTranslate, chatTranslateLang, () => props.sessionId], ([, , , , sessionId]) => {
  saveTranslationSettings(sessionId);
});

function setMode(isNote: boolean) {
  noteMode.value = isNote;
  modeMenuOpen.value = false;
}

function handleClickOutside(e: MouseEvent) {
  if (modeWrapRef.value && !modeWrapRef.value.contains(e.target as Node)) {
    modeMenuOpen.value = false;
  }
  if (
    translatePanelOpen.value &&
    translateBtnRef.value && !translateBtnRef.value.contains(e.target as Node) &&
    translatePanelRef.value && !translatePanelRef.value.contains(e.target as Node)
  ) {
    translatePanelOpen.value = false;
    panelLangMenu.value = null;
  }
  if (
    liveLangPanelOpen.value &&
    liveLangWrapRef.value && !liveLangWrapRef.value.contains(e.target as Node)
  ) {
    liveLangPanelOpen.value = false;
  }
  if (copilotOpen.value && copilotBtnRef.value && !copilotBtnRef.value.contains(e.target as Node)) {
    copilotOpen.value = false;
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
  background: #ffffff;
  border: 1px solid #d9e1ec;
  border-radius: 22px;
  box-shadow: 0 10px 28px rgba(15, 23, 42, 0.05);
  display: flex;
  flex-direction: column;
  gap: 0;
  min-height: 214px;
  padding: 12px 16px;
  position: relative;
  transition: background var(--agent-motion-fast), border-color var(--agent-motion-fast), box-shadow var(--agent-motion-fast);
}

.composer--note {
  background: linear-gradient(180deg, #fffaf1 0%, #fffef9 100%);
  border-color: #f0d7aa;
  box-shadow: 0 10px 24px rgba(211, 163, 61, 0.08);
}

.composer__mode-wrap {
  display: inline-block;
  position: relative;
}

.composer__mode-btn {
  align-items: center;
  background: transparent;
  border: 0;
  color: var(--agent-color-text-primary);
  cursor: pointer;
  display: inline-flex;
  font-size: var(--agent-font-size-sm);
  font-weight: var(--agent-font-weight-medium);
  gap: 4px;
  height: 30px;
  outline: none;
  padding: 0 8px;
}

.composer__mode-btn:hover {
  color: var(--agent-color-brand-primary);
}

.composer__mode-menu {
  background: #ffffff;
  border: 1px solid var(--agent-color-border-default);
  border-radius: var(--agent-radius-md);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  left: 0;
  min-width: 110px;
  padding: 4px;
  position: absolute;
  bottom: calc(100% + 6px);
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
  padding: 0 0 8px;
  position: relative;
}

.composer__tools {
  align-items: center;
  display: flex;
  gap: 4px;
}

.composer__divider {
  background: var(--agent-color-border-default);
  height: 16px;
  margin: 0 4px;
  width: 1px;
}

.tool-icon {
  align-items: center;
  background: transparent;
  border: 0;
  border-radius: 999px;
  color: var(--agent-color-text-secondary, #75869c);
  cursor: pointer;
  display: inline-flex;
  height: 30px;
  justify-content: center;
  width: 30px;
}

.tool-icon:hover {
  background: #f3f6fb;
  color: var(--agent-color-text-primary);
}

.composer--note .tool-icon:hover {
  background: rgba(214, 167, 73, 0.12);
}

.composer__textarea-wrap {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 8px;
  min-height: 0;
  padding: 0;
  position: relative;
}

.composer__textarea {
  background: transparent;
  border: 0;
  color: var(--agent-color-text-primary);
  flex: 1;
  font-family: inherit;
  font-size: var(--agent-font-size-sm);
  line-height: 1.5;
  min-height: 118px;
  outline: none;
  padding: 6px 0 0;
  resize: none;
  width: 100%;
}

.composer__textarea::placeholder {
  color: #a6afbd;
}

.composer__footer {
  align-items: center;
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  margin-top: auto;
  padding: 8px 0 0;
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

/* 翻译图标 wrap */
.composer__translate-wrap {
  position: relative;
}

/* 翻译面板 */
.composer__translate-panel {
  background: #fff;
  border: 1px solid var(--agent-color-border-default);
  border-radius: var(--agent-radius-lg);
  box-shadow: 0 4px 16px rgba(0,0,0,0.10);
  min-width: 220px;
  padding: 6px 0;
  position: absolute;
  bottom: calc(100% + 6px);
  left: 0;
  z-index: var(--agent-z-dropdown);
}

.composer__translate-row {
  align-items: center;
  display: flex;
  justify-content: space-between;
  padding: 10px 16px;
}

.composer__translate-group {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 4px 0;
}

.composer__translate-divider {
  background: var(--agent-color-border-default);
  height: 1px;
  margin: 4px 12px;
}

.composer__translate-row--lang {
  cursor: pointer;
}

.composer__translate-row--lang:hover {
  background: var(--agent-color-bg-muted);
}

.composer__translate-label {
  color: var(--agent-color-text-primary);
  font-size: var(--agent-font-size-sm);
}

.composer__translate-lang-val {
  align-items: center;
  color: var(--agent-color-brand-primary);
  display: inline-flex;
  font-size: var(--agent-font-size-sm);
  gap: 2px;
}

.composer__translate-flyout {
  background: #fff;
  border: 1px solid var(--agent-color-border-default);
  border-radius: var(--agent-radius-lg);
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.12);
  max-height: 320px;
  min-width: 180px;
  overflow-y: auto;
  padding: 8px 0;
  position: absolute;
  bottom: calc(100% + 6px);
  left: calc(100% + 12px);
  z-index: calc(var(--agent-z-dropdown) + 1);
}

.composer__translate-flyout-item {
  background: transparent;
  border: 0;
  color: var(--agent-color-text-primary);
  cursor: pointer;
  display: block;
  font-size: var(--agent-font-size-sm);
  padding: 12px 18px;
  text-align: left;
  width: 100%;
}

.composer__translate-flyout-item:hover {
  background: var(--agent-color-bg-muted);
}

.composer__translate-flyout-item--active {
  color: var(--agent-color-brand-primary);
  font-weight: var(--agent-font-weight-medium);
}

/* Toggle 开关 */
.composer__toggle {
  background: #d1d5db;
  border: 0;
  border-radius: 999px;
  cursor: pointer;
  height: 22px;
  outline: none;
  position: relative;
  transition: background var(--agent-motion-fast);
  width: 40px;
}

.composer__toggle::after {
  background: #fff;
  border-radius: 50%;
  content: '';
  height: 18px;
  left: 2px;
  position: absolute;
  top: 2px;
  transition: transform var(--agent-motion-fast);
  width: 18px;
}

.composer__toggle--on {
  background: var(--agent-color-brand-primary);
}

.composer__toggle--on::after {
  transform: translateX(18px);
}

/* 语言选择面板 */
.composer__lang-panel {
  background: #fff;
  border: 1px solid var(--agent-color-border-default);
  border-radius: var(--agent-radius-lg);
  box-shadow: 0 4px 16px rgba(0,0,0,0.10);
  bottom: 0;
  left: calc(100% + 4px);
  max-height: 320px;
  min-width: 200px;
  overflow-y: auto;
  padding: 8px 0;
  position: absolute;
  z-index: var(--agent-z-dropdown);
}

.composer__lang-hint {
  color: var(--agent-color-text-tertiary);
  font-size: var(--agent-font-size-xs);
  padding: 4px 16px 8px;
}

.composer__lang-item {
  align-items: center;
  background: transparent;
  border: 0;
  cursor: pointer;
  display: flex;
  font-size: var(--agent-font-size-sm);
  gap: 10px;
  padding: 9px 16px;
  text-align: left;
  width: 100%;
}

.composer__lang-item:hover {
  background: var(--agent-color-bg-muted);
}

.composer__lang-item--active {
  color: var(--agent-color-brand-primary);
}

.composer__lang-item svg {
  margin-left: auto;
}

.composer__lang-code {
  background: var(--agent-color-bg-muted);
  border: 1px solid var(--agent-color-border-default);
  border-radius: var(--agent-radius-sm);
  color: var(--agent-color-text-secondary);
  font-size: 11px;
  min-width: 32px;
  padding: 1px 5px;
  text-align: center;
}

/* 边写边译区域 */
.composer__live-translate {
  align-items: center;
  background: var(--agent-color-bg-muted);
  border-bottom: 1px solid var(--agent-color-border-default);
  display: flex;
  gap: 8px;
  padding: 8px 16px;
}
.composer__live-lang-wrap {
  flex-shrink: 0;
  position: relative;
}

.composer__live-lang {
  background: #fff;
  border: 1px solid var(--agent-color-border-default);
  border-radius: var(--agent-radius-sm);
  color: var(--agent-color-text-secondary);
  cursor: pointer;
  font-size: 11px;
  min-width: 32px;
  padding: 2px 6px;
  text-align: center;
}

.composer__live-lang:hover {
  border-color: var(--agent-color-brand-primary);
  color: var(--agent-color-brand-primary);
}

.composer__live-input {
  background: transparent;
  border: 0;
  color: var(--agent-color-text-primary);
  flex: 1;
  font-family: inherit;
  font-size: var(--agent-font-size-sm);
  line-height: 1.5;
  outline: none;
  resize: none;
}

.composer__live-input::placeholder {
  color: #a6afbd;
}

.composer__live-send {
  background: transparent;
  border: 0;
  color: var(--agent-color-brand-primary);
  cursor: pointer;
  flex-shrink: 0;
  font-size: var(--agent-font-size-sm);
  padding: 0 4px;
}

/* 工具图标激活态 */
.tool-icon--active {
  color: var(--agent-color-brand-primary) !important;
}

.composer__copilot-wrap {
  position: relative;
}

/* Tooltip */
.tool-icon[data-tooltip],
.composer__translate-wrap .tool-icon[data-tooltip] {
  position: relative;
}

.tool-icon[data-tooltip]::after {
  background: rgba(0,0,0,0.75);
  border-radius: var(--agent-radius-sm);
  bottom: calc(100% + 6px);
  color: #fff;
  content: attr(data-tooltip);
  font-size: 12px;
  left: 50%;
  opacity: 0;
  padding: 4px 8px;
  pointer-events: none;
  position: absolute;
  transform: translateX(-50%);
  transition: opacity var(--agent-motion-fast);
  white-space: nowrap;
  z-index: var(--agent-z-dropdown);
}

.tool-icon[data-tooltip]:hover::after {
  opacity: 1;
}
</style>

<style>
/* Teleport 内容样式（不能用 scoped） */
.composer__live-translate {
  align-items: center;
  background: var(--agent-color-bg-muted);
  border-bottom: 1px solid var(--agent-color-border-default);
  display: flex;
  gap: 8px;
  padding: 8px 16px;
}

.composer__live-lang-wrap {
  flex-shrink: 0;
  position: relative;
}

.composer__live-lang {
  background: #fff;
  border: 1px solid var(--agent-color-border-default);
  border-radius: var(--agent-radius-sm);
  color: var(--agent-color-text-secondary);
  cursor: pointer;
  font-size: 11px;
  min-width: 32px;
  padding: 2px 6px;
  text-align: center;
}

.composer__live-lang:hover {
  border-color: var(--agent-color-brand-primary);
  color: var(--agent-color-brand-primary);
}

.composer__live-input {
  background: transparent;
  border: 0;
  color: var(--agent-color-text-primary);
  flex: 1;
  font-family: inherit;
  font-size: 13px;
  line-height: 1.5;
  outline: none;
  resize: none;
}

.composer__live-input::placeholder { color: #a6afbd; }

.composer__live-send {
  background: transparent;
  border: 0;
  color: var(--agent-color-brand-primary);
  cursor: pointer;
  flex-shrink: 0;
  font-size: 13px;
  padding: 0 4px;
}

.composer__lang-panel {
  background: #fff;
  border: 1px solid var(--agent-color-border-default);
  border-radius: var(--agent-radius-lg);
  bottom: 0;
  box-shadow: 0 4px 16px rgba(0,0,0,0.10);
  left: calc(100% + 4px);
  max-height: 320px;
  min-width: 200px;
  overflow-y: auto;
  padding: 8px 0;
  position: absolute;
  z-index: 1000;
}

.composer__lang-hint {
  color: var(--agent-color-text-tertiary);
  font-size: 11px;
  padding: 4px 16px 8px;
}

.composer__lang-item {
  align-items: center;
  background: transparent;
  border: 0;
  cursor: pointer;
  display: flex;
  font-size: 13px;
  gap: 10px;
  padding: 9px 16px;
  text-align: left;
  width: 100%;
}

.composer__lang-item:hover { background: var(--agent-color-bg-muted); }
.composer__lang-item--active { color: var(--agent-color-brand-primary); }
.composer__lang-item svg { margin-left: auto; }

.composer__lang-code {
  background: var(--agent-color-bg-muted);
  border: 1px solid var(--agent-color-border-default);
  border-radius: var(--agent-radius-sm);
  color: var(--agent-color-text-secondary);
  font-size: 11px;
  min-width: 32px;
  padding: 1px 5px;
  text-align: center;
}
</style>
