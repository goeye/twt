<template>
  <article class="message" :class="`message--${role}`">
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
          <p v-if="subject" class="message__subject">{{ subject }}</p>
          <div v-if="contentType === 'html'" class="message__html-content" v-html="sanitizedContent" />
          <span v-else>{{ content }}</span>
        </div>
      </div>
    </template>
  </article>
</template>

<script setup lang="ts">
import { computed } from "vue";

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
  }>(),
  {
    avatarText: "?",
    avatarColor: "linear-gradient(135deg, #2f6bff 0%, #69a1ff 100%)",
    avatarUrl: "",
    contentType: "text",
  }
);

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
</style>
