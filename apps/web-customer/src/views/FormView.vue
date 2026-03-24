<template>
  <div class="cw-form">
    <header class="cw-form-header">
      <div class="cw-form-header__left">
        <button type="button" class="cw-form-header__back" @click="$router.push('/sessions')">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>
        </button>
        <div class="cw-form-header__avatar" :style="{ background: avatarGradient }">{{ avatarText }}</div>
        <div class="cw-form-header__title-block">
          <span class="cw-form-header__title">{{ displayName }}</span>
          <span class="cw-form-header__subtitle">新的会话</span>
        </div>
      </div>
      <button type="button" class="cw-form-header__close" aria-label="最小化" @click="$router.push('/minimized')">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" /></svg>
      </button>
    </header>

    <div class="cw-form-messages">
      <div class="cw-form-msg">
        <span class="cw-form-msg__time">10:32</span>
        <div class="cw-form-card">
          <div class="cw-form-card__meta">
            <span class="cw-form-card__chip">{{ agentStatusLabel }}</span>
            <span class="cw-form-card__chip">{{ languageLabel }}</span>
            <span class="cw-form-card__chip">{{ toneLabel }}</span>
          </div>
          <p class="cw-form-card__title">{{ introText }}</p>
          <p class="cw-form-card__desc">请先填写基础信息，我们会根据当前 Autopilot 配置开始接待。</p>
          <div class="cw-form-card__fields">
            <div v-for="field in formFields" :key="field.id" class="cw-form-field">
              <label class="cw-form-field__label">
                <span v-if="field.required" class="cw-form-field__required">*</span>{{ field.label }}
              </label>
              <input
                v-model="field.value"
                class="cw-form-field__input"
                :placeholder="field.placeholder"
              />
            </div>
          </div>
          <button type="button" class="cw-form-card__submit" @click="handleSubmit">开始会话</button>
        </div>
      </div>
    </div>

    <div class="cw-footer">Powered by <strong>Chat</strong></div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import {
  getAgentIntro,
  getAvatarGradient,
  getAvatarText,
  getLanguageLabel,
  getToneLabel,
  loadAiAgentDemoSettings,
  type AiAgentDemoSettings
} from "../lib/aiAgentDemo";

const router = useRouter();
const agentSettings = ref<AiAgentDemoSettings>(loadAiAgentDemoSettings());

const formFields = ref([
  { id: "f-1", label: "姓名", placeholder: "Enter your name", required: true, value: "" },
  { id: "f-2", label: "邮箱", placeholder: "Enter your email", required: true, value: "" },
  { id: "f-3", label: "电话", placeholder: "Enter your phone", required: false, value: "" }
]);

const displayName = computed(() => agentSettings.value.botName);
const avatarText = computed(() => getAvatarText(agentSettings.value.botName));
const avatarGradient = computed(() => getAvatarGradient(agentSettings.value.botName));
const introText = computed(() => getAgentIntro(agentSettings.value));
const languageLabel = computed(() => getLanguageLabel(agentSettings.value.defaultLanguage));
const toneLabel = computed(() => getToneLabel(agentSettings.value.selectedTone));
const agentStatusLabel = computed(() => (agentSettings.value.agentEnabled ? "Autopilot 已开启" : "人工客服接待"));

const handleSubmit = () => {
  router.push("/chat/new");
};
</script>

<style scoped>
.cw-form {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.cw-form-header {
  align-items: center;
  background: #fff;
  border-bottom: 1px solid var(--agent-color-border-default);
  display: flex;
  flex-shrink: 0;
  justify-content: space-between;
  padding: 14px 16px;
}

.cw-form-header__left {
  align-items: center;
  display: flex;
  gap: 10px;
  min-width: 0;
}

.cw-form-header__back {
  align-items: center;
  background: none;
  border: none;
  color: var(--agent-color-text-secondary);
  cursor: pointer;
  display: inline-flex;
  padding: 0;
}

.cw-form-header__avatar {
  align-items: center;
  border-radius: 50%;
  color: #fff;
  display: flex;
  font-size: 12px;
  font-weight: 700;
  height: 28px;
  justify-content: center;
  width: 28px;
}

.cw-form-header__title-block {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.cw-form-header__title {
  color: var(--agent-color-text-primary);
  font-size: 13px;
  font-weight: 600;
}

.cw-form-header__subtitle {
  color: var(--agent-color-text-tertiary);
  font-size: 10px;
  line-height: 1.4;
}

.cw-form-header__close {
  align-items: center;
  background: none;
  border: none;
  border-radius: 50%;
  color: var(--agent-color-text-secondary);
  cursor: pointer;
  display: flex;
  flex-shrink: 0;
  height: 28px;
  justify-content: center;
  transition: background 0.15s, color 0.15s;
  width: 28px;
}

.cw-form-header__close:hover {
  background: var(--agent-color-bg-hover, rgba(0, 0, 0, 0.06));
  color: var(--agent-color-text-primary);
}

.cw-form-messages {
  background: #f5f5f5;
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 10px;
  overflow-y: auto;
  padding: 14px;
}

.cw-form-msg {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.cw-form-msg__time {
  color: var(--agent-color-text-tertiary);
  font-size: 10px;
  line-height: 1;
}

.cw-form-card {
  background: #fff;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 24px 20px;
  width: 100%;
}

.cw-form-card__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.cw-form-card__chip {
  background: rgba(47, 107, 255, 0.08);
  border: 1px solid rgba(47, 107, 255, 0.12);
  border-radius: 999px;
  color: var(--agent-color-brand-primary);
  font-size: 10px;
  font-weight: 600;
  padding: 4px 8px;
}

.cw-form-card__title {
  color: #222;
  font-size: 12px;
  line-height: 1.7;
  margin: 0;
}

.cw-form-card__desc {
  color: var(--agent-color-text-secondary);
  font-size: 11px;
  line-height: 1.6;
  margin: 0;
}

.cw-form-card__fields {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.cw-form-field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.cw-form-field__label {
  color: #222;
  font-size: 11px;
  line-height: 1.4;
}

.cw-form-field__required {
  color: #ff382e;
  font-weight: 500;
  margin-right: 2px;
}

.cw-form-field__input {
  background: #fff;
  border: 1px solid #e2e8ef;
  border-radius: 12px;
  color: #222;
  font-size: 11px;
  height: 34px;
  outline: none;
  padding: 0 12px;
  transition: border-color 0.15s;
}

.cw-form-field__input:focus {
  border-color: var(--agent-color-brand-primary);
}

.cw-form-card__submit {
  background: var(--agent-color-brand-primary);
  border: none;
  border-radius: 12px;
  color: #fff;
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
  padding: 10px;
  text-align: center;
  transition: opacity 0.15s;
}

.cw-form-card__submit:hover {
  opacity: 0.92;
}

.cw-footer {
  background: #fff;
  color: var(--agent-color-text-tertiary);
  flex-shrink: 0;
  font-size: 10px;
  padding: 6px;
  text-align: center;
}
</style>
