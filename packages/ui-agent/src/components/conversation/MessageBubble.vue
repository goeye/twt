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
        <div class="message__bubble" :class="{ 'message__bubble--note': isNote, 'message__bubble--media-only': isMediaOnlyMessage }">
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
            <button v-if="contentType === 'html' && parsedMessage.quoted" class="message__action-btn" title="查看引用内容" @click="quotedExpanded = !quotedExpanded">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="4" cy="8" r="1.2" fill="currentColor"/><circle cx="8" cy="8" r="1.2" fill="currentColor"/><circle cx="12" cy="8" r="1.2" fill="currentColor"/></svg>
            </button>
          </div>
          <div v-if="contentType === 'html' && (parsedMessage.body?.trim() || parsedMessage.media.length > 0)" class="message__content-stack">
            <div v-if="parsedMessage.body && parsedMessage.body.trim()" class="message__text-block">
              <div class="message__html-content" v-html="parsedMessage.body" />
            </div>
            <div v-else-if="parsedMessage.media.length === 0" class="message__empty-body">（无邮件内容）</div>

            <div
              v-if="parsedMessage.media.length > 0"
              class="message__media-section"
              :class="{ 'message__media-section--standalone': !(parsedMessage.body && parsedMessage.body.trim()) }"
            >
              <div class="message__media-grid" :class="{ 'message__media-grid--single': parsedMessage.media.length === 1 }">
                <button
                  v-for="item in parsedMessage.media"
                  :key="item.id"
                  type="button"
                  class="message__media-thumb"
                  :class="{
                    'message__media-thumb--video': item.type === 'video',
                    'message__media-thumb--video-loading': isVideoThumbLoading(item),
                  }"
                  @click="openMediaPreview(item)"
                >
                  <img
                    v-if="item.type === 'image' && !failedThumbIds.has(item.id)"
                    :src="item.thumbnailSrc"
                    :alt="item.alt"
                    class="message__media-thumb-image"
                    loading="lazy"
                    @error="markThumbFailed(item.id)"
                  />
                  <template v-else-if="item.type === 'video' && !failedThumbIds.has(item.id)">
                    <!-- 始终渲染 video 元素以触发 loadeddata/error -->
                    <video
                      :src="item.src"
                      class="message__media-thumb-video"
                      :class="{ 'message__media-thumb-video--hidden': videoThumbStatus[item.id] === 'loaded' }"
                      muted
                      playsinline
                      preload="auto"
                      @loadstart="handleVideoThumbLoadStart(item.id)"
                      @loadeddata="handleVideoThumbLoaded(item.id)"
                      @error="markThumbFailed(item.id)"
                    />
                    <!-- 有 poster 时显示图片封面，加载完成后隐藏 -->
                    <img
                      v-if="item.thumbnailSrc"
                      :src="item.thumbnailSrc"
                      :alt="item.alt"
                      class="message__media-thumb-image"
                      :class="{ 'message__media-thumb-image--hidden': videoThumbStatus[item.id] === 'loaded' }"
                      loading="lazy"
                      @error="markThumbFailed(item.id)"
                    />
                    <!-- 加载中覆盖层 -->
                    <div
                      v-if="isVideoThumbLoading(item)"
                      class="message__video-loading message__video-loading--overlay"
                    >
                      <span class="message__video-loading-icon" aria-hidden="true">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M8 6.5v11l9-5.5-9-5.5Z" fill="currentColor"/></svg>
                      </span>
                      <span class="message__preview-spinner message__preview-spinner--inverse"></span>
                      <span class="message__video-loading-text">加载视频预览中...</span>
                    </div>
                  </template>
                  <div v-else class="message__media-thumb-placeholder" :class="{ 'message__media-thumb-placeholder--video': item.type === 'video' }">
                    <span class="message__media-thumb-placeholder-icon" aria-hidden="true">
                      <svg v-if="item.type === 'video'" width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M8 6.5v11l9-5.5-9-5.5Z" fill="currentColor"/></svg>
                      <svg v-else width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M5 7.5A2.5 2.5 0 0 1 7.5 5h9A2.5 2.5 0 0 1 19 7.5v9a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 5 16.5v-9Z" stroke="currentColor" stroke-width="1.6"/><circle cx="9" cy="10" r="1.5" fill="currentColor"/><path d="m8 16 3-3 2 2 3-4 2 5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    </span>
                  </div>
                  <span
                    v-if="item.type === 'video' && !isVideoThumbLoading(item)"
                    class="message__media-thumb-badge"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M8 6.5v11l9-5.5-9-5.5Z" fill="currentColor"/></svg>
                    <span>视频</span>
                  </span>
                  <span
                    v-if="item.type === 'video' && !isVideoThumbLoading(item)"
                    class="message__media-thumb-play"
                    aria-hidden="true"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M8 6.5v11l9-5.5-9-5.5Z" fill="currentColor"/></svg>
                  </span>
                </button>
              </div>
            </div>
          </div>
          <span v-else>{{ content }}</span>

          <!-- 引用内容区域 -->
          <div v-if="parsedMessage.quoted" class="message__quoted-section">
            <button
              v-if="!quotedExpanded"
              class="message__quoted-toggle"
              @click="quotedExpanded = true"
            >
              ...
            </button>
            <div v-if="quotedExpanded" class="message__quoted-content">
              <div class="message__quoted-inner" v-html="parsedMessage.quoted" />
              <button class="message__quoted-collapse" @click="quotedExpanded = false">收起</button>
            </div>
          </div>

          <div v-if="parsedMessage.attachments.length > 0" class="message__attachments">
            <button
              v-for="(att, idx) in parsedMessage.attachments"
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
              <button type="button" class="message__translation-retry" @click="$emit('retry-translation')">重试</button>
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

  <Teleport to="body">
    <div v-if="previewMedia" class="message__preview-overlay" @click.self="closeMediaPreview">
      <button type="button" class="message__preview-close" aria-label="关闭预览" @click="closeMediaPreview">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
      </button>
      <div class="message__preview-dialog">
        <div
          v-if="previewStatus === 'loading' && previewMedia?.type !== 'video'"
          class="message__preview-state"
        >
          <span class="message__preview-spinner"></span>
          <span>加载中...</span>
        </div>
        <div
          v-else-if="previewStatus === 'error'"
          class="message__preview-state message__preview-state--error"
          :class="{ 'message__preview-state--video-error': previewMedia?.type === 'video' }"
        >
          <strong>{{ previewMedia?.type === "video" ? "加载失败" : "图片预览失败" }}</strong>
          <div class="message__preview-actions">
            <button type="button" class="message__preview-retry" @click="retryMediaPreview">重试</button>
          </div>
        </div>
        <img
          v-if="previewMedia.type === 'image'"
          :key="`image-${previewAttempt}`"
          :src="previewMedia.src"
          :alt="previewMedia.alt"
          class="message__preview-content"
          :class="{ 'message__preview-content--hidden': previewStatus !== 'loaded' }"
          @load="handlePreviewLoaded"
          @error="handlePreviewError"
        />
        <video
          v-else
          ref="previewVideoRef"
          :key="`video-${previewAttempt}`"
          class="message__preview-content"
          :class="{ 'message__preview-content--hidden': previewStatus === 'error' }"
          autoplay
          controls
          playsinline
          preload="auto"
          @loadstart="handlePreviewVideoLoadStart"
          @loadeddata="handlePreviewVideoLoaded"
          @playing="handlePreviewVideoPlaying"
          @error="handlePreviewError"
        >
          <source :src="previewMedia.src" @error="handlePreviewError" />
        </video>
        <div
          v-if="previewMedia.type === 'video' && previewStatus === 'loading'"
          class="message__preview-video-loading"
        >
          <div class="message__video-loading">
            <span class="message__preview-spinner message__preview-spinner--inverse"></span>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from "vue";
import type { MessageTranslation } from "../../types";

interface ParsedMediaItem {
  id: string;
  type: "image" | "video";
  src: string;
  thumbnailSrc: string;
  alt: string;
}

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
const failedThumbIds = ref(new Set<string>());
const videoThumbStatus = ref<Record<string, "loading" | "loaded" | "error">>({});
const previewMedia = ref<ParsedMediaItem | null>(null);
const previewStatus = ref<"loading" | "loaded" | "error">("loading");
const previewAttempt = ref(0);
const previewVideoRef = ref<HTMLVideoElement | null>(null);

const VIDEO_THUMB_TIMEOUT_MS = 7000;
const PREVIEW_VIDEO_TIMEOUT_MS = 7000;
const PREVIEW_FAKE_LOADING_MS = 800;
const videoThumbTimeouts = new Map<string, number>();
let previewVideoTimeoutId: number | null = null;
let previewRevealTimeoutId: number | null = null;
let previewLoadingStartedAt = 0;

function getPlainText(): string {
  if (props.contentType === 'html') {
    const doc = new DOMParser().parseFromString(props.content, 'text/html');
    // 移除图片和附件区域，只保留纯文本用于翻译
    for (const mediaNode of Array.from(doc.body.querySelectorAll('img, video, source'))) {
      mediaNode.remove();
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
  'thead', 'tbody', 'span', 'div', 'hr', 'img', 'video', 'source',
]);
const ALLOWED_ATTRS = new Set(['href', 'src', 'alt', 'target', 'width', 'height', 'style', 'poster', 'preload', 'playsinline', 'controls']);

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

interface ParsedAttachment {
  name: string;
  size: string;
  icon: string;
  ext: string;
  rawHtml: string;
}

function extractMedia(html: string): { body: string; media: ParsedMediaItem[] } {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const media: ParsedMediaItem[] = [];

  Array.from(doc.body.querySelectorAll('img, video')).forEach((node, index) => {
    if (node.tagName === 'IMG') {
      const img = node as HTMLImageElement;
      const src = img.getAttribute('src')?.trim() ?? '';
      if (!src) return;

      media.push({
        id: `image-${index}-${src}`,
        type: 'image',
        src,
        thumbnailSrc: src,
        alt: img.getAttribute('alt')?.trim() || '图片预览'
      });
      img.remove();
      return;
    }

    const video = node as HTMLVideoElement;
    const src = video.getAttribute('src')?.trim() || video.querySelector('source')?.getAttribute('src')?.trim() || '';
    if (!src) return;

    media.push({
      id: `video-${index}-${src}`,
      type: 'video',
      src,
      thumbnailSrc: video.getAttribute('poster')?.trim() || '',
      alt: video.getAttribute('title')?.trim() || '视频预览'
    });
    video.remove();
  });

  return { body: doc.body.innerHTML, media };
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

function markThumbFailed(id: string) {
  clearVideoThumbTimeout(id);
  const nextFailedIds = new Set(failedThumbIds.value);
  nextFailedIds.add(id);
  failedThumbIds.value = nextFailedIds;
  videoThumbStatus.value = {
    ...videoThumbStatus.value,
    [id]: 'error',
  };
}

function handleVideoThumbLoadStart(id: string) {
  videoThumbStatus.value = {
    ...videoThumbStatus.value,
    [id]: 'loading',
  };
  clearVideoThumbTimeout(id);
  videoThumbTimeouts.set(
    id,
    window.setTimeout(() => {
      if ((videoThumbStatus.value[id] ?? 'loading') === 'loading') {
        markThumbFailed(id);
      }
    }, VIDEO_THUMB_TIMEOUT_MS)
  );
}

function handleVideoThumbLoaded(id: string) {
  clearVideoThumbTimeout(id);
  videoThumbStatus.value = {
    ...videoThumbStatus.value,
    [id]: 'loaded',
  };
}

function isVideoThumbLoading(item: ParsedMediaItem) {
  return item.type === 'video'
    && !failedThumbIds.value.has(item.id)
    && (videoThumbStatus.value[item.id] ?? 'loading') !== 'loaded';
}

function openMediaPreview(item: ParsedMediaItem) {
  clearPreviewPendingTimers();
  previewMedia.value = item;
  previewStatus.value = 'loading';
  previewAttempt.value += 1;
  if (item.type === 'video') {
    previewLoadingStartedAt = Date.now();
    schedulePreviewVideoTimeout();
  }
}

function closeMediaPreview() {
  clearPreviewPendingTimers();
  previewLoadingStartedAt = 0;
  previewMedia.value = null;
}

function retryMediaPreview() {
  if (!previewMedia.value) return;
  clearPreviewPendingTimers();
  previewStatus.value = 'loading';
  previewAttempt.value += 1;
  if (previewMedia.value.type === 'video') {
    previewLoadingStartedAt = Date.now();
    schedulePreviewVideoTimeout();
  }
}

function handlePreviewVideoLoadStart() {
  if (previewMedia.value?.type !== 'video') return;
  previewStatus.value = 'loading';
  if (!previewLoadingStartedAt) {
    previewLoadingStartedAt = Date.now();
  }
  schedulePreviewVideoTimeout();
}

function handlePreviewLoaded() {
  clearPreviewVideoTimeout();
  const remainingLoadingMs = previewMedia.value?.type === 'video'
    ? Math.max(0, PREVIEW_FAKE_LOADING_MS - (Date.now() - previewLoadingStartedAt))
    : 0;

  clearPreviewRevealTimeout();

  if (remainingLoadingMs === 0) {
    previewLoadingStartedAt = 0;
    previewStatus.value = 'loaded';
    return;
  }

  previewRevealTimeoutId = window.setTimeout(() => {
    previewRevealTimeoutId = null;
    previewLoadingStartedAt = 0;
    previewStatus.value = 'loaded';
  }, remainingLoadingMs);
}

async function handlePreviewVideoLoaded() {
  if (!previewVideoRef.value) return;

  try {
    await previewVideoRef.value.play();
  } catch {
    // If autoplay is blocked, show the video so users can start it manually.
    handlePreviewLoaded();
  }
}

function handlePreviewVideoPlaying() {
  handlePreviewLoaded();
}

function handlePreviewError() {
  clearPreviewPendingTimers();
  previewLoadingStartedAt = 0;
  previewStatus.value = 'error';
}

function clearVideoThumbTimeout(id: string) {
  const timeoutId = videoThumbTimeouts.get(id);
  if (timeoutId !== undefined) {
    window.clearTimeout(timeoutId);
    videoThumbTimeouts.delete(id);
  }
}

function clearPreviewVideoTimeout() {
  if (previewVideoTimeoutId !== null) {
    window.clearTimeout(previewVideoTimeoutId);
    previewVideoTimeoutId = null;
  }
}

function clearPreviewRevealTimeout() {
  if (previewRevealTimeoutId !== null) {
    window.clearTimeout(previewRevealTimeoutId);
    previewRevealTimeoutId = null;
  }
}

function clearPreviewPendingTimers() {
  clearPreviewVideoTimeout();
  clearPreviewRevealTimeout();
}

function schedulePreviewVideoTimeout() {
  clearPreviewVideoTimeout();
  previewVideoTimeoutId = window.setTimeout(() => {
    if (previewStatus.value === 'loading' && previewMedia.value?.type === 'video') {
      previewStatus.value = 'error';
    }
  }, PREVIEW_VIDEO_TIMEOUT_MS);
}

onBeforeUnmount(() => {
  clearPreviewPendingTimers();
  videoThumbTimeouts.forEach((timeoutId) => window.clearTimeout(timeoutId));
  videoThumbTimeouts.clear();
});

const parsedMessage = computed(() => {
  if (props.contentType !== 'html') return { body: props.content, attachments: [] as ParsedAttachment[], quoted: '', media: [] as ParsedMediaItem[] };
  const sanitized = sanitizeHtml(props.content);
  // 提取引用内容
  const { body, quoted } = extractQuotedContent(sanitized);
  // 提取媒体
  const { body: mediaRemovedBody, media } = extractMedia(body);
  // 提取附件
  const result = extractAttachments(mediaRemovedBody);
  return { ...result, quoted, media };
});

const isMediaOnlyMessage = computed(() => {
  if (props.contentType !== "html") return false;
  const hasTextBody = Boolean(parsedMessage.value.body && parsedMessage.value.body.trim());
  return !hasTextBody && parsedMessage.value.media.length > 0 && parsedMessage.value.attachments.length === 0 && !parsedMessage.value.quoted;
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

.message__bubble--media-only {
  background: transparent !important;
  border: 0;
  padding: 0;
}

.message--customer .message__bubble {
  background: #ffffff;
}

.message--highlighted .message__bubble {
  background: rgba(47, 107, 255, 0.08);
  box-shadow: 0 0 0 2px rgba(47, 107, 255, 0.2);
}

.message--highlighted .message__bubble--media-only {
  background: transparent;
  box-shadow: none;
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

.message__content-stack {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.message__text-block {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.message__empty-body {
  color: var(--agent-color-text-tertiary, #9ca3af);
  font-size: var(--agent-font-size-sm, 13px);
  font-style: italic;
}

.message__media-section {
  border-top: 1px solid rgba(148, 163, 184, 0.22);
  padding-top: 12px;
}

.message__media-section--standalone {
  border-top: 0;
  padding-top: 0;
}

.message__media-grid {
  display: grid;
  gap: 8px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.message__media-grid--single {
  grid-template-columns: minmax(0, 220px);
}

.message__media-thumb {
  background: transparent;
  border: 1px solid var(--agent-color-border-default);
  border-radius: 12px;
  cursor: pointer;
  min-height: 132px;
  overflow: hidden;
  padding: 0;
  position: relative;
  transition: border-color 0.15s ease, transform 0.15s ease, box-shadow 0.15s ease;
}

.message__media-thumb:hover {
  border-color: var(--agent-color-brand-primary);
  box-shadow: 0 8px 20px rgba(47, 107, 255, 0.12);
  transform: translateY(-1px);
}

.message__media-thumb--video-loading {
  background:
    linear-gradient(180deg, rgba(15, 23, 42, 0.94), rgba(30, 41, 59, 0.98)),
    radial-gradient(circle at top, rgba(59, 130, 246, 0.2), transparent 58%);
}

.message__media-thumb-image {
  display: block;
  height: 100%;
  object-fit: cover;
  width: 100%;
}

.message__media-thumb-image--hidden {
  display: none;
}

.message__media-thumb-video {
  background: transparent;
  display: block;
  height: 100%;
  object-fit: cover;
  pointer-events: auto;
  width: 100%;
}

.message__media-thumb-video--hidden {
  display: none;
}

.message__video-loading {
  align-items: center;
  display: flex;
  flex-direction: column;
  gap: 12px;
  justify-content: center;
  text-align: center;
}

.message__video-loading--overlay {
  backdrop-filter: blur(6px);
  background:
    linear-gradient(180deg, rgba(15, 23, 42, 0.9), rgba(30, 41, 59, 0.94)),
    radial-gradient(circle at top, rgba(59, 130, 246, 0.22), transparent 58%);
  inset: 0;
  padding: 16px;
  position: absolute;
}

.message__video-loading-icon {
  align-items: center;
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 999px;
  color: #f8fafc;
  display: inline-flex;
  height: 48px;
  justify-content: center;
  width: 48px;
}

.message__video-loading-text {
  color: #e2e8f0;
  font-size: var(--agent-font-size-sm);
  font-weight: var(--agent-font-weight-medium);
}

.message__media-thumb-placeholder {
  align-items: center;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(247, 248, 250, 0.98));
  color: var(--agent-color-text-tertiary);
  display: flex;
  height: 100%;
  justify-content: center;
  min-height: 132px;
  padding: 16px;
}

.message__media-thumb-placeholder--video {
  background:
    linear-gradient(180deg, rgba(15, 23, 42, 0.92), rgba(30, 41, 59, 0.96)),
    radial-gradient(circle at top, rgba(96, 165, 250, 0.18), transparent 55%);
  color: #f8fafc;
}

.message__media-thumb-placeholder-icon {
  align-items: center;
  background: rgba(255, 255, 255, 0.78);
  border: 1px solid rgba(148, 163, 184, 0.18);
  border-radius: 999px;
  color: inherit;
  display: inline-flex;
  height: 52px;
  justify-content: center;
  width: 52px;
}

.message__media-thumb-placeholder--video .message__media-thumb-placeholder-icon {
  background: rgba(255, 255, 255, 0.12);
  border-color: rgba(255, 255, 255, 0.16);
}

.message__media-thumb-badge {
  align-items: center;
  background: rgba(15, 23, 42, 0.72);
  border-radius: 999px;
  color: #fff;
  display: inline-flex;
  font-size: 11px;
  font-weight: var(--agent-font-weight-medium);
  gap: 4px;
  left: 10px;
  padding: 4px 8px;
  position: absolute;
  top: 10px;
}

.message__media-thumb-play {
  align-items: center;
  backdrop-filter: blur(8px);
  background: rgba(15, 23, 42, 0.68);
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 999px;
  color: #fff;
  display: inline-flex;
  height: 42px;
  justify-content: center;
  left: 50%;
  pointer-events: none;
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 42px;
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
  text-decoration: none;
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

.message__preview-overlay {
  align-items: center;
  background: rgba(15, 23, 42, 0.72);
  display: flex;
  inset: 0;
  justify-content: center;
  padding: 32px;
  position: fixed;
  z-index: calc(var(--agent-z-modal, 1000) + 10);
}

.message__preview-dialog {
  align-items: center;
  background: transparent;
  border-radius: 20px;
  box-shadow: none;
  display: flex;
  justify-content: center;
  max-height: min(80vh, 760px);
  max-width: min(80vw, 1080px);
  min-height: 240px;
  min-width: min(80vw, 420px);
  overflow: visible;
  padding: 0;
  position: relative;
}

.message__preview-close {
  align-items: center;
  background: rgba(255, 255, 255, 0.92);
  border: 0;
  border-radius: 999px;
  color: #111827;
  cursor: pointer;
  display: inline-flex;
  height: 40px;
  justify-content: center;
  position: absolute;
  right: 24px;
  top: 24px;
  width: 40px;
  z-index: 1;
}

.message__preview-content {
  display: block;
  max-height: calc(80vh - 48px);
  max-width: calc(80vw - 48px);
  object-fit: contain;
}

.message__preview-content--hidden {
  display: none;
}

.message__preview-video-loading {
  align-items: center;
  backdrop-filter: blur(6px);
  background:
    linear-gradient(180deg, rgba(15, 23, 42, 0.72), rgba(30, 41, 59, 0.8)),
    radial-gradient(circle at top, rgba(59, 130, 246, 0.16), transparent 58%);
  border-radius: 20px;
  display: flex;
  inset: 0;
  justify-content: center;
  pointer-events: none;
  position: absolute;
}

.message__preview-state {
  align-items: center;
  background: rgba(255, 255, 255, 0.96);
  border: 1px solid rgba(229, 230, 235, 0.9);
  border-radius: 20px;
  box-shadow: 0 24px 60px rgba(15, 23, 42, 0.24);
  color: var(--agent-color-text-secondary);
  display: flex;
  flex-direction: column;
  gap: 12px;
  justify-content: center;
  min-height: 220px;
  min-width: 280px;
  padding: 28px 32px;
}

.message__preview-state--error {
  color: var(--agent-color-text-primary);
}

.message__preview-state--video-error {
  background:
    linear-gradient(180deg, rgba(15, 23, 42, 0.94), rgba(30, 41, 59, 0.98)),
    radial-gradient(circle at top, rgba(59, 130, 246, 0.2), transparent 58%);
  border-color: rgba(248, 250, 252, 0.12);
  color: #e2e8f0;
}

.message__preview-actions {
  display: flex;
  gap: 12px;
}

.message__preview-spinner {
  animation: spin 1s linear infinite;
  border: 3px solid rgba(47, 107, 255, 0.16);
  border-radius: 50%;
  border-top-color: var(--agent-color-brand-primary, #2f6bff);
  display: inline-block;
  height: 28px;
  width: 28px;
}

.message__preview-spinner--inverse {
  border-color: rgba(255, 255, 255, 0.18);
  border-top-color: #ffffff;
}

.message__preview-retry {
  background: var(--agent-color-brand-primary);
  border: 0;
  border-radius: 999px;
  color: #fff;
  cursor: pointer;
  font-size: var(--agent-font-size-sm);
  padding: 8px 16px;
}
</style>
