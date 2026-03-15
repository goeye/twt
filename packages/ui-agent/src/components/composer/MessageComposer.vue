<template>
  <section class="composer">
    <div class="composer__toolbar">
      <div class="composer__tools">
        <button class="tool-icon" type="button" aria-label="表情" @click="$emit('emoji')">☺</button>
        <button class="tool-icon" type="button" aria-label="快捷回复" @click="$emit('quick-reply')">💬</button>
        <button class="tool-icon" type="button" aria-label="附件" @click="$emit('attachment')">📎</button>
        <button class="tool-icon" type="button" aria-label="润色" @click="$emit('polish')">✨</button>
        <button class="tool-icon" type="button" aria-label="机器人">🤖</button>
        <button class="tool-icon" type="button" aria-label="翻译" @click="$emit('translate')">🌐</button>
      </div>
    </div>

    <textarea
      class="composer__textarea"
      :placeholder="placeholder"
      :value="modelValue"
      @input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
    />

    <div class="composer__footer">
      <button class="composer__send-btn" type="button" :disabled="disabled" @click="$emit('send')">发送</button>
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: string;
  placeholder?: string;
  disabled?: boolean;
}>();

defineEmits<{
  (e: "update:modelValue", value: string): void;
  (e: "emoji"): void;
  (e: "attachment"): void;
  (e: "quick-reply"): void;
  (e: "polish"): void;
  (e: "translate"): void;
  (e: "send"): void;
}>();
</script>

<style scoped>
.composer {
  background: transparent;
  display: flex;
  flex-direction: column;
  gap: var(--agent-space-8);
  padding: 10px 12px;
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
  color: var(--agent-color-text-primary);
  cursor: pointer;
  display: inline-flex;
  font-size: 16px;
  height: 26px;
  justify-content: center;
  width: 26px;
}

.tool-icon:hover {
  background: var(--agent-color-bg-muted);
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
