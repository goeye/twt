<template>
  <article
    class="message"
    :class="`message--${role}`"
    @mouseenter="hovered = true"
    @mouseleave="hovered = false; moreMenuOpen = false; translatePanelOpen = false"
  >
    <template v-if="role === 'system'">
      <div class="message__system">{{ content }}</div>
    </template>

    <template v-else>
      <span class="message__avatar" :style="{ background: avatarUrl ? undefined : avatarColor }">
        <img v-if="avatarUrl" :src="avatarUrl" alt="" class="message__avatar-image" />
        <span v-else>{{ avatarText }}</span>
      </span>
      <div class="message__main">
        <header class="message__meta">
          <span class="message__sender">{{ sender }}</span>
          <time>{{ time }}</time>
        </header>

        <div class="message__bubble">
          <!-- 非邮件会话：完整工具栏 -->
          <div
            v-if="showActions && hovered && role !== 'system' && role !== 'bot' && channelType !== 'email'"
            class="message__actions"
          >
            <button class="message__action-btn" title="回复" @click="$emit('reply')">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6.5 3.5L2.5 7L6.5 10.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M3 7H10C11.6569 7 13 8.3431 13 10V12.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>
            <button class="message__action-btn" title="复制" @click="handleCopy">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="5.5" y="5.5" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.3"/><path d="M10.5 5.5V4C10.5 3.17157 9.82843 2.5 9 2.5H4C3.17157 2.5 2.5 3.17157 2.5 4V9C2.5 9.82843 3.17157 10.5 4 10.5H5.5" stroke="currentColor" stroke-width="1.3"/></svg>
            </button>
            <button class="message__action-btn" title="翻译" @click.stop="translatePanelOpen = !translatePanelOpen; moreMenuOpen = false">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6.5" stroke="currentColor" stroke-width="1.3"/><path d="M2 8h12M8 1.5c-1.5 2-2.5 4-2.5 6.5s1 4.5 2.5 6.5c1.5-2 2.5-4 2.5-6.5s-1-4.5-2.5-6.5z" stroke="currentColor" stroke-width="1.3"/></svg>
            </button>
            <div class="message__action-more-wrap">
              <button class="message__action-btn" title="更多" @click.stop="moreMenuOpen = !moreMenuOpen; translatePanelOpen = false">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="4" cy="8" r="1.2" fill="currentColor"/><circle cx="8" cy="8" r="1.2" fill="currentColor"/><circle cx="12" cy="8" r="1.2" fill="currentColor"/></svg>
              </button>
              <div v-if="moreMenuOpen" class="message__action-menu">
                <button v-if="role === 'agent'" class="message__action-menu-item" @click="handleMenuAction('revoke')">撤回</button>
              </div>
            </div>
            <!-- 非邮件翻译面板：定位在 bubble 旁 -->
            <div v-if="translatePanelOpen && translationLanguages.length > 0" class="message__translate-panel" :class="`message__translate-panel--${role}`">
              <div class="message__translate-lang-list">
                <button
                  v-for="lang in translationLanguages"
                  :key="lang.value"
                  class="message__translate-lang-item"
                  :class="{ 'message__translate-lang-item--active': selectedTranslateLang === lang.value }"
                  @click="selectedTranslateLang = lang.value"
                >{{ lang.label }}</button>
              </div>
              <div v-if="selectedTranslateLang" class="message__translate-result">
                <p class="message__translate-result-text">{{ getPlainText().slice(0, 100) }}... ({{ selectedTranslateLang }} 翻译)</p>
              </div>
            </div>
          </div>

          <!-- 邮件会话：只显示翻译按钮，hover 展示语言面板 -->
          <div
            v-if="showActions && hovered && role !== 'system' && role !== 'bot' && channelType === 'email'"
            class="message__actions"
          >
            <div
              class="message__translate-trigger"
              @mouseenter="translatePanelOpen = true"
              @mouseleave="translatePanelOpen = false"
            >
              <button class="message__action-btn" title="翻译">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6.5" stroke="currentColor" stroke-width="1.3"/><path d="M2 8h12M8 1.5c-1.5 2-2.5 4-2.5 6.5s1 4.5 2.5 6.5c1.5-2 2.5-4 2.5-6.5s-1-4.5-2.5-6.5z" stroke="currentColor" stroke-width="1.3"/></svg>
              </button>
              <!-- 邮件翻译面板：定位在翻译图标旁 -->
              <div v-if="translatePanelOpen && translationLanguages.length > 0" class="message__email-translate-panel" :class="`message__email-translate-panel--${role}`">
                <div class="message__email-translate-inner">
                  <div class="message__translate-lang-list">
                    <button
                      v-for="lang in translationLanguages"
                      :key="lang.value"
                      class="message__translate-lang-item"
                      :class="{ 'message__translate-lang-item--active': selectedTranslateLang === lang.value }"
                      @click="selectedTranslateLang = lang.value"
                    >{{ lang.label }}</button>
                  </div>
                  <div v-if="selectedTranslateLang" class="message__translate-result">
                    <p class="message__translate-result-text">{{ getPlainText().slice(0, 100) }}... ({{ selectedTranslateLang }} 翻译)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-if="contentType === 'html'" class="message__html-content" v-html="parsedEmail.body" />
          <span v-else>{{ content }}</span>
          <div v-if="parsedEmail.attachments.length > 0" class="message__attachments">
            <div v-for="(att, idx) in parsedEmail.attachments" :key="idx" class="message__attachment" v-html="att" />
          </div>
        </div>
      </div>
    </template>
  </article>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";

const props = withDefaults(
  defineProps<{
    role: "agent" | "customer" | "system" | "bot";
    sender: string;
    content: string;
    time: string;
    avatarText?: string;
    avatarColor?: string;
    avatarUrl?: string;
    contentType?: 'text' | 'html';
    subject?: string;
    showActions?: boolean;
    channelType?: 'web' | 'email';
    translationLanguages?: { label: string; value: string }[];
  }>(),
  {
    avatarText: "?",
    avatarColor: "linear-gradient(135deg, #2f6bff 0%, #69a1ff 100%)",
    avatarUrl: "",
    contentType: "text",
    showActions: false,
    channelType: "web",
    translationLanguages: () => [],
  }
);

const emit = defineEmits<{
  (e: 'reply'): void;
  (e: 'copy'): void;
  (e: 'translate'): void;
  (e: 'revoke'): void;
}>();

const hovered = ref(false);
const moreMenuOpen = ref(false);
const translatePanelOpen = ref(false);
const selectedTranslateLang = ref("");

function getPlainText(): string {
  if (props.contentType === 'html') {
    const doc = new DOMParser().parseFromString(props.content, 'text/html');
    return doc.body.textContent || '';
  }
  return props.content;
}

async function handleCopy() {
  try {
    await navigator.clipboard.writeText(getPlainText());
  } catch {
    // fallback: ignore
  }
  emit('copy');
}

function handleMenuAction(action: 'translate' | 'revoke') {
  moreMenuOpen.value = false;
  emit(action);
}

const ALLOWED_TAGS = new Set([
  'p', 'br', 'strong', 'em', 'b', 'i', 'u', 'ol', 'ul', 'li', 'a',
  'blockquote', 'h1', 'h2', 'h3', 'h4', 'table', 'tr', 'td', 'th',
  'thead', 'tbody', 'span', 'div', 'hr', 'img',
]);
const ALLOWED_ATTRS = new Set(['href', 'src', 'alt', 'target', 'width', 'height', 'style']);

function sanitizeHtml(html: string): string {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  function walk(node: Node): void {
    for (const child of Array.from(node.childNodes)) {
      if (child.nodeType !== Node.ELEMENT_NODE) {
        continue;
      }

      const el = child as Element;
      if (!ALLOWED_TAGS.has(el.tagName.toLowerCase())) {
        const children = Array.from(el.childNodes);
        el.replaceWith(...children);
        for (const nestedChild of children) {
          walk(nestedChild);
        }
        continue;
      }
      for (const attr of Array.from(el.attributes)) {
        if (!ALLOWED_ATTRS.has(attr.name.toLowerCase())) {
          el.removeAttribute(attr.name);
        }
      }
      if (el.tagName === 'A') {
        el.setAttribute('target', '_blank');
        el.setAttribute('rel', 'noopener noreferrer');
      }
      walk(el);
    }
  }
  walk(doc.body);
  return doc.body.innerHTML;
}

const sanitizedContent = computed(() => {
  if (props.contentType !== 'html') return props.content;
  return sanitizeHtml(props.content);
});

function extractAttachments(html: string): { body: string; attachments: string[] } {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const attachments: string[] = [];
  for (const div of Array.from(doc.body.children)) {
    if (div.tagName !== 'DIV') continue;
    const text = div.textContent || '';
    if (/[\u{1F4C4}\u{1F4CB}\u{1F4CE}\u{1F4C1}]/u.test(text) && /\d+(\.\d+)?\s*(MB|KB|GB|B)\b/i.test(text)) {
      attachments.push(div.outerHTML);
      div.remove();
    }
  }
  return { body: doc.body.innerHTML, attachments };
}

const parsedEmail = computed(() => {
  if (props.contentType !== 'html') return { body: props.content, attachments: [] as string[] };
  const sanitized = sanitizeHtml(props.content);
  return extractAttachments(sanitized);
});
</script>

<style scoped>
.message {
  display: flex;
  gap: var(--agent-space-8);
  max-width: 80%;
}

.message--customer {
  align-self: flex-start;
}

.message--agent {
  align-self: flex-end;
  flex-direction: row-reverse;
}

.message--system {
  align-self: center;
  max-width: 100%;
}

.message__avatar {
  align-items: center;
  border-radius: 50%;
  color: #ffffff;
  display: inline-flex;
  flex-shrink: 0;
  font-size: 11px;
  font-weight: var(--agent-font-weight-semibold);
  height: 32px;
  justify-content: center;
  margin-top: 2px;
  overflow: hidden;
  width: 32px;
}

.message__avatar-image {
  display: block;
  height: 100%;
  object-fit: cover;
  width: 100%;
}

.message__main {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
  position: relative;
}

.message__meta {
  color: var(--agent-color-text-tertiary);
  display: flex;
  font-size: var(--agent-font-size-xs);
  gap: var(--agent-space-8);
}

.message--agent .message__meta {
  justify-content: flex-end;
}

.message__sender {
  color: var(--agent-color-text-secondary);
}

.message__bubble {
  border: 1px solid var(--agent-color-border-default);
  border-radius: var(--agent-radius-lg);
  color: var(--agent-color-text-primary);
  font-size: var(--agent-font-size-sm);
  line-height: 1.5;
  padding: 10px var(--agent-space-12);
  position: relative;
  white-space: pre-wrap;
}

.message--customer .message__bubble {
  background: #ffffff;
}

.message--agent .message__bubble {
  background: #eef4ff;
}

.message--bot {
  align-self: flex-start;
}

.message--bot .message__bubble {
  background: #f0fdf4;
}

.message__system {
  color: var(--agent-color-text-tertiary);
  font-size: var(--agent-font-size-xs);
  text-align: center;
}

.message__subject {
  border-bottom: 1px solid var(--agent-color-border-default);
  font-weight: var(--agent-font-weight-semibold);
  margin: 0 0 8px;
  padding-bottom: 6px;
}

.message__html-content {
  line-height: 1.6;
  overflow-wrap: break-word;
  word-break: break-word;
}

.message__html-content :deep(p) {
  margin: 0 0 8px;
}

.message__html-content :deep(p:last-child) {
  margin-bottom: 0;
}

.message__html-content :deep(a) {
  color: var(--agent-color-brand-primary);
  text-decoration: underline;
}

.message__html-content :deep(blockquote) {
  border-left: 3px solid var(--agent-color-border-default);
  color: var(--agent-color-text-secondary);
  margin: 8px 0;
  padding-left: 12px;
}

.message__html-content :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: var(--agent-radius-sm);
}

.message__attachments {
  border-top: 1px solid var(--agent-color-border-default);
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 10px;
  padding-top: 10px;
}

.message__attachment :deep(div) {
  font-size: 13px;
}

/* --- Action toolbar --- */
.message__actions {
  display: flex;
  align-items: center;
  gap: 2px;
  background: #ffffff;
  border: 1px solid var(--agent-color-border-default);
  border-radius: var(--agent-radius-md);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  padding: 2px;
  position: absolute;
  bottom: 100%;
  margin-bottom: 4px;
  width: fit-content;
  z-index: 1;
}

.message--customer .message__actions {
  left: 0;
}

.message--agent .message__actions {
  right: 0;
}

.message__action-btn {
  align-items: center;
  background: transparent;
  border: none;
  border-radius: var(--agent-radius-sm);
  color: var(--agent-color-text-secondary);
  cursor: pointer;
  display: inline-flex;
  height: 28px;
  justify-content: center;
  padding: 0;
  width: 28px;
}

.message__action-btn:hover {
  background: var(--agent-color-bg-secondary);
  color: var(--agent-color-text-primary);
}

.message__action-more-wrap {
  position: relative;
}

.message__action-menu {
  background: #ffffff;
  border: 1px solid var(--agent-color-border-default);
  border-radius: var(--agent-radius-md);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  min-width: 80px;
  padding: 4px;
  position: absolute;
  right: 0;
  top: calc(100% + 4px);
  z-index: var(--agent-z-dropdown);
}

.message__action-menu-item {
  background: transparent;
  border: none;
  border-radius: var(--agent-radius-sm);
  color: var(--agent-color-text-primary);
  cursor: pointer;
  font-size: var(--agent-font-size-sm);
  padding: 6px 12px;
  text-align: left;
  white-space: nowrap;
}

.message__action-menu-item:hover {
  background: var(--agent-color-bg-secondary);
}

/* --- 翻译面板 --- */
.message__translate-panel {
  background: #ffffff;
  border: 1px solid var(--agent-color-border-default);
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  max-height: 360px;
  overflow-y: auto;
  padding: 4px;
  position: absolute;
  top: 0;
  width: 160px;
  z-index: 2;
}

.message__translate-panel--customer {
  left: calc(100% + 8px);
}

.message__translate-panel--agent {
  right: calc(100% + 8px);
}

.message__translate-lang-list {
  display: flex;
  flex-direction: column;
}

.message__translate-lang-item {
  background: transparent;
  border: 0;
  border-radius: 6px;
  color: var(--agent-color-text-primary);
  cursor: pointer;
  font-size: var(--agent-font-size-sm);
  padding: 10px 14px;
  text-align: left;
  white-space: nowrap;
}

.message__translate-lang-item:hover {
  background: var(--agent-color-bg-muted);
}

.message__translate-lang-item--active {
  background: var(--agent-color-bg-secondary);
  color: var(--agent-color-brand-primary);
  font-weight: var(--agent-font-weight-medium);
}

.message__translate-result {
  border-top: 1px solid var(--agent-color-border-default);
  margin-top: 4px;
  padding: 10px 14px 6px;
}

.message__translate-result-text {
  color: var(--agent-color-text-secondary);
  font-size: var(--agent-font-size-xs);
  line-height: 1.5;
  margin: 0;
  white-space: pre-wrap;
}

/* --- 邮件翻译触发区和面板 --- */
.message__translate-trigger {
  position: relative;
}

.message__email-translate-panel {
  position: absolute;
  top: -4px;
  z-index: var(--agent-z-dropdown);
}

.message__email-translate-inner {
  background: #ffffff;
  border: 1px solid var(--agent-color-border-default);
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  max-height: 360px;
  overflow-y: auto;
  padding: 4px;
  width: 160px;
}

.message__email-translate-panel > .message__translate-lang-list,
.message__email-translate-panel > .message__translate-result {
  background: #ffffff;
  border: 1px solid var(--agent-color-border-default);
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  max-height: 360px;
  overflow-y: auto;
  padding: 4px;
}

/* 访客消息：语言面板在翻译图标的右侧 */
.message__email-translate-panel--customer {
  left: 100%;
  padding-left: 6px;
}

/* 客服消息：语言面板在翻译图标的左侧 */
.message__email-translate-panel--agent {
  right: 100%;
  padding-right: 6px;
}
</style>
