<template>
  <article
    class="message"
    :class="[`message--${role}`, { 'message--highlighted': highlighted }]"
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

        <div class="message__bubble-row">
        <div class="message__bubble" :class="{ 'message__bubble--note': isNote }">
          <!-- 非邮件会话：完整工具栏 -->
          <div
            v-if="showActions && hovered && role !== 'system' && role !== 'bot' && channelType !== 'email'"
            class="message__actions"
          >
            <button v-if="!isNote" class="message__action-btn" title="回复" @click="$emit('reply')">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6.5 3.5L2.5 7L6.5 10.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M3 7H10C11.6569 7 13 8.3431 13 10V12.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>
            <button class="message__action-btn" title="复制" @click="handleCopy">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="5.5" y="5.5" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.3"/><path d="M10.5 5.5V4C10.5 3.17157 9.82843 2.5 9 2.5H4C3.17157 2.5 2.5 3.17157 2.5 4V9C2.5 9.82843 3.17157 10.5 4 10.5H5.5" stroke="currentColor" stroke-width="1.3"/></svg>
            </button>
            <button v-if="!isNote" class="message__action-btn" title="翻译" @click.stop="translatePanelOpen = !translatePanelOpen; moreMenuOpen = false">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6.5" stroke="currentColor" stroke-width="1.3"/><path d="M2 8h12M8 1.5c-1.5 2-2.5 4-2.5 6.5s1 4.5 2.5 6.5c1.5-2 2.5-4 2.5-6.5s-1-4.5-2.5-6.5z" stroke="currentColor" stroke-width="1.3"/></svg>
            </button>
            <div v-if="!isNote" class="message__action-more-wrap">
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
            <!-- 查看原始邮件按钮 -->
            <button v-if="contentType === 'html' && parsedEmail.quoted" class="message__action-btn" title="查看引用内容" @click="quotedExpanded = !quotedExpanded">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="4" cy="8" r="1.2" fill="currentColor"/><circle cx="8" cy="8" r="1.2" fill="currentColor"/><circle cx="12" cy="8" r="1.2" fill="currentColor"/></svg>
            </button>
          </div>
          <div v-if="contentType === 'html' && parsedEmail.body && parsedEmail.body.trim()" class="message__html-content" v-html="parsedEmail.body" />
          <div v-else-if="contentType === 'html'" class="message__empty-body">（无邮件内容）</div>
          <span v-else>{{ content }}</span>

          <!-- 引用内容区域 -->
          <div v-if="parsedEmail.quoted" class="message__quoted-section">
            <button
              v-if="!quotedExpanded"
              class="message__quoted-toggle"
              @click="quotedExpanded = true"
            >
              ...
            </button>
            <div v-if="quotedExpanded" class="message__quoted-content">
              <div class="message__quoted-inner" v-html="parsedEmail.quoted" />
              <button class="message__quoted-collapse" @click="quotedExpanded = false">收起</button>
            </div>
          </div>

          <div v-if="parsedEmail.attachments.length > 0" class="message__attachments">
            <button
              v-for="(att, idx) in parsedEmail.attachments"
              :key="idx"
              type="button"
              class="message__attachment-card"
              @click="handleAttachmentClick(att)"
            >
              <span class="message__attachment-thumb" :data-ext="att.ext">{{ att.icon }}</span>
              <div class="message__attachment-info">
                <span class="message__attachment-name">{{ att.name }}</span>
                <span class="message__attachment-size">{{ att.size }}</span>
              </div>
            </button>
          </div>

          <!-- 翻译状态显示 -->
          <div v-if="translation && translation.status !== 'idle'" class="message__translation">
            <div v-if="translation.status === 'translating'" class="message__translation-loading">
              翻译中...
            </div>
            <div v-else-if="translation.status === 'completed'" class="message__translation-result">
              {{ translation.result }}
            </div>
            <div v-else-if="translation.status === 'failed'" class="message__translation-error">
              <span>翻译失败</span>
              <button type="button" class="message__translation-retry" @click="$emit('retry-translation')">点击重试</button>
            </div>
          </div>
        </div>
        <div v-if="sendStatus === 'sending'" class="message__send-status message__send-status--sending">
          <span class="message__sending-spinner" />
        </div>
        <button v-if="sendStatus === 'failed'" type="button" class="message__send-status message__send-status--failed" @click="$emit('retry')">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" stroke="#ef4444" stroke-width="1.5"/><line x1="8" y1="4.5" x2="8" y2="9" stroke="#ef4444" stroke-width="1.5" stroke-linecap="round"/><circle cx="8" cy="11.5" r="0.8" fill="#ef4444"/></svg>
        </button>
        </div>
      </div>
    </template>
  </article>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import type { MessageTranslation } from "../../types";

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
    sendStatus?: 'sending' | 'failed' | 'sent';
    translationLanguages?: { label: string; value: string }[];
    translation?: MessageTranslation;
    highlighted?: boolean;
    isNote?: boolean;
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
  (e: 'retry'): void;
  (e: 'retry-translation'): void;
}>();

const hovered = ref(false);
const moreMenuOpen = ref(false);
const translatePanelOpen = ref(false);
const selectedTranslateLang = ref("");
const quotedExpanded = ref(false);

function getPlainText(): string {
  if (props.contentType === 'html') {
    const doc = new DOMParser().parseFromString(props.content, 'text/html');
    // 移除图片和附件区域，只保留纯文本用于翻译
    for (const img of Array.from(doc.body.querySelectorAll('img'))) {
      img.remove();
    }
    // 移除附件 div（包含文件 emoji 和文件大小的 div）
    for (const div of Array.from(doc.body.children)) {
      if (div.tagName !== 'DIV') continue;
      const text = div.textContent || '';
      if (/[\u{1F4C4}\u{1F4CB}\u{1F4CE}\u{1F4C1}]/u.test(text) && /\d+(\.\d+)?\s*(MB|KB|GB|B)\b/i.test(text)) {
        div.remove();
      }
    }
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
        const attrName = attr.name.toLowerCase();
        if (!ALLOWED_ATTRS.has(attrName)) {
          el.removeAttribute(attr.name);
        } else if (attrName === 'href' || attrName === 'src') {
          const value = attr.value.trim().toLowerCase();
          if (value.startsWith('javascript:') || value.startsWith('data:') || value.startsWith('vbscript:')) {
            el.removeAttribute(attr.name);
          }
        } else if (attrName === 'style') {
          const styleValue = attr.value.toLowerCase();
          if (styleValue.includes('javascript:') || styleValue.includes('expression(')) {
            el.removeAttribute(attr.name);
          }
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

interface ParsedAttachment {
  name: string;
  size: string;
  icon: string;
  ext: string;
  rawHtml: string;
}

function getFileIcon(name: string): string {
  const ext = name.split('.').pop()?.toLowerCase() || '';
  if (ext === 'pdf') return '\u{1F4C4}';
  if (['doc', 'docx'].includes(ext)) return '\u{1F4DD}';
  if (['xls', 'xlsx', 'csv'].includes(ext)) return '\u{1F4CA}';
  if (['zip', 'rar', '7z'].includes(ext)) return '\u{1F4E6}';
  if (['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp'].includes(ext)) return '\u{1F5BC}';
  return '\u{1F4CE}';
}

function getFileExt(name: string): string {
  return (name.split('.').pop() || '').toUpperCase();
}

function extractQuotedContent(html: string): { body: string; quoted: string } {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  let quotedHtml = '';

  // 方法1：提取 blockquote 标签
  const blockquotes = doc.querySelectorAll('blockquote');
  if (blockquotes.length > 0) {
    quotedHtml = Array.from(blockquotes).map(bq => bq.outerHTML).join('');
    blockquotes.forEach(bq => bq.remove());
    return { body: doc.body.innerHTML, quoted: quotedHtml };
  }

  // 方法2：检测归属行（On ... wrote:）
  const bodyHtml = doc.body.innerHTML;
  const match = bodyHtml.match(/(On .+? wrote:|在 .+? 写道：|-----Original Message-----)/i);
  if (match && match.index !== undefined) {
    const splitIndex = match.index;
    return {
      body: bodyHtml.substring(0, splitIndex).trim(),
      quoted: bodyHtml.substring(splitIndex).trim()
    };
  }

  return { body: html, quoted: '' };
}

function extractAttachments(html: string): { body: string; attachments: ParsedAttachment[] } {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const attachments: ParsedAttachment[] = [];
  for (const div of Array.from(doc.body.children)) {
    if (div.tagName !== 'DIV') continue;
    const text = div.textContent || '';
    if (/[\u{1F4C4}\u{1F4CB}\u{1F4CE}\u{1F4C1}]/u.test(text) && /\d+(\.\d+)?\s*(MB|KB|GB|B)\b/i.test(text)) {
      // 提取附件名称和大小
      const nameEl = div.querySelector('div[style*="font-weight"]') || div.querySelector('div:first-child');
      const sizeEl = div.querySelector('div[style*="font-size: 11px"]') || div.querySelector('div:last-child');
      const fileName = nameEl?.textContent?.trim() || '未知文件';
      const fileSize = sizeEl?.textContent?.trim() || '';
      attachments.push({
        name: fileName,
        size: fileSize,
        icon: getFileIcon(fileName),
        ext: getFileExt(fileName),
        rawHtml: div.outerHTML,
      });
      div.remove();
    }
  }
  return { body: doc.body.innerHTML, attachments };
}

function handleAttachmentClick(att: ParsedAttachment) {
  // 模拟查看附件：在新窗口预览
  const previewWindow = window.open('', '_blank');
  if (previewWindow) {
    previewWindow.document.write(`
      <!DOCTYPE html>
      <html><head><title>${att.name}</title>
      <style>body{font-family:system-ui,-apple-system,sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;background:#f5f6f8;}
      .card{background:#fff;border-radius:16px;padding:40px;text-align:center;box-shadow:0 4px 24px rgba(0,0,0,.08)}
      .icon{font-size:64px;margin-bottom:16px}.name{font-size:18px;font-weight:600;color:#222;margin:0 0 8px}.size{font-size:14px;color:#75869c}</style>
      </head><body><div class="card"><div class="icon">${att.icon}</div><p class="name">${att.name}</p><p class="size">${att.size}</p></div></body></html>
    `);
    previewWindow.document.close();
  }
}

const parsedEmail = computed(() => {
  if (props.contentType !== 'html') return { body: props.content, attachments: [] as ParsedAttachment[], quoted: '' };
  const sanitized = sanitizeHtml(props.content);
  // 提取引用内容
  const { body, quoted } = extractQuotedContent(sanitized);
  // 提取附件
  const result = extractAttachments(body);
  return { ...result, quoted };
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

.message__bubble-row {
  align-items: flex-end;
  display: flex;
  gap: 6px;
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

.message--highlighted .message__bubble {
  background: rgba(47, 107, 255, 0.08);
  box-shadow: 0 0 0 2px rgba(47, 107, 255, 0.2);
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

.message__empty-body {
  color: var(--agent-color-text-tertiary, #9ca3af);
  font-size: var(--agent-font-size-sm, 13px);
  font-style: italic;
}

.message__send-status {
  align-items: center;
  align-self: flex-end;
  display: flex;
  margin-left: 6px;
}

.message__send-status--failed {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
}

.message__sending-spinner {
  animation: spin 1s linear infinite;
  border: 2px solid #e5e7eb;
  border-radius: 50%;
  border-top-color: var(--agent-color-brand-primary, #2f6bff);
  display: inline-block;
  height: 14px;
  width: 14px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
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

.message__attachment-card {
  align-items: center;
  background: var(--agent-color-bg-muted, #f5f7fa);
  border: 1px solid var(--agent-color-border-default);
  border-radius: var(--agent-radius-md);
  cursor: pointer;
  display: flex;
  font-family: inherit;
  gap: 10px;
  padding: 10px 12px;
  text-align: left;
  transition: background 0.15s, border-color 0.15s;
}

.message__attachment-card:hover {
  background: var(--agent-color-bg-secondary, #eef1f6);
  border-color: var(--agent-color-brand-primary);
}

.message__attachment-thumb {
  align-items: center;
  background: #ffffff;
  border: 1px solid var(--agent-color-border-default);
  border-radius: 6px;
  display: flex;
  flex-shrink: 0;
  font-size: 22px;
  height: 40px;
  justify-content: center;
  line-height: 1;
  width: 40px;
}

.message__attachment-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.message__attachment-name {
  color: var(--agent-color-text-primary);
  font-size: 13px;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.message__attachment-size {
  color: var(--agent-color-text-tertiary);
  font-size: 11px;
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

/* 引用内容区域 */
.message__quoted-section {
  margin-top: 8px;
}

.message__quoted-toggle {
  background: transparent;
  border: 0;
  color: var(--agent-color-text-tertiary);
  cursor: pointer;
  font-size: var(--agent-font-size-sm);
  padding: 0;
}

.message__quoted-toggle:hover {
  color: var(--agent-color-brand-primary);
}

.message__quoted-content {
  margin-top: 8px;
}

.message__quoted-inner {
  border-left: 3px solid var(--agent-color-border-default);
  color: var(--agent-color-text-secondary);
  font-size: var(--agent-font-size-xs);
  line-height: 1.5;
  padding-left: 12px;
}

.message__quoted-inner :deep(blockquote) {
  border-left: 2px solid var(--agent-color-border-light);
  margin: 4px 0;
  padding-left: 8px;
}

.message__quoted-collapse {
  background: transparent;
  border: 0;
  color: var(--agent-color-text-tertiary);
  cursor: pointer;
  font-size: var(--agent-font-size-xs);
  margin-top: 4px;
  padding: 0;
}

.message__quoted-collapse:hover {
  color: var(--agent-color-brand-primary);
}

/* 翻译状态 */
.message__translation {
  margin-top: var(--agent-space-8);
  padding-top: var(--agent-space-8);
  border-top: 1px solid var(--agent-color-border-light);
  font-size: var(--agent-font-size-sm);
}

.message__translation-loading {
  color: var(--agent-color-text-tertiary);
}

.message__translation-result {
  color: var(--agent-color-text-secondary);
  line-height: 1.5;
}

.message__translation-error {
  display: flex;
  align-items: center;
  gap: var(--agent-space-8);
  color: var(--agent-color-status-error);
}

.message__translation-retry {
  background: transparent;
  border: 0;
  color: var(--agent-color-brand-primary);
  cursor: pointer;
  font-size: var(--agent-font-size-sm);
  padding: 0;
  text-decoration: underline;
}

.message__bubble--note {
  background: var(--agent-color-status-warning-bg) !important;
}

.message__note-label {
  border: 1px solid var(--agent-color-border-default);
  border-radius: var(--agent-radius-sm);
  color: var(--agent-color-text-secondary);
  display: block;
  font-size: var(--agent-font-size-xs);
  margin-bottom: var(--agent-space-4);
  padding: 1px var(--agent-space-8);
  width: fit-content;
}

.message__translation-retry:hover {
  color: var(--agent-color-brand-hover);
}
</style>
