<template>
  <div class="lifecycle-flow">
    <section
      v-for="section in sections"
      :key="section.key"
      class="lifecycle-stage"
      :class="`lifecycle-stage--${section.key}`"
    >
      <header class="lifecycle-stage__header">
        <span class="lifecycle-stage__badge" :class="`lifecycle-stage__badge--${section.key}`">
          <AgentIcon :name="section.icon" :size="16" />
        </span>
        <h2 class="lifecycle-stage__title">{{ section.title }}</h2>
      </header>

      <div class="lifecycle-stage__cards">
        <article
          v-for="card in section.cards"
          :key="card.key"
          class="config-card agent-panel"
          :class="{ 'config-card--open': openCardKey === card.key }"
        >
          <button type="button" class="config-card__trigger" @click="emit('toggle-card', card.key)">
            <div class="config-card__heading">
              <div class="config-card__title-row">
                <h3 class="config-card__title">{{ card.title }}</h3>
                <span v-if="card.badge" class="config-card__status" :class="`config-card__status--${card.badgeTone ?? 'default'}`">
                  {{ card.badge }}
                </span>
                <p v-if="openCardKey !== card.key && card.summary" class="config-card__summary">{{ card.summary }}</p>
              </div>
              <p v-if="card.description && openCardKey === card.key" class="config-card__description">
                {{ card.description }}
              </p>
            </div>

            <AgentIcon
              class="config-card__chevron"
              :name="openCardKey === card.key ? 'chevron-down' : 'chevron-right'"
              :size="18"
            />
          </button>

          <div v-if="openCardKey === card.key" class="config-card__body">
            <template v-if="card.key === 'entry-routing'">
              <div class="form-row">
                <div class="form-row__label">
                  <span class="form-row__name">受众群体</span>
                  <span class="form-row__desc">Autopilot 的回复对象</span>
                </div>
                <div class="form-row__control">
                  <div class="radio-card-group">
                    <label
                      v-for="option in audienceOptions"
                      :key="option.value"
                      class="radio-card"
                      :class="{ 'radio-card--active': localVisitorAudience === option.value }"
                    >
                      <input
                        v-model="localVisitorAudience"
                        type="radio"
                        :value="option.value"
                        class="radio-card__input"
                        @change="emit('auto-save')"
                      />
                      <span class="radio-card__indicator" />
                      <span class="radio-card__label">{{ option.label }}</span>
                    </label>
                  </div>
                </div>
              </div>

              <div class="form-row">
                <div class="form-row__label">
                  <span class="form-row__name">回复时机</span>
                  <span class="form-row__desc">Autopilot 何时介入回复</span>
                </div>
                <div class="form-row__control">
                  <select v-model="localAgentResponseMode" class="agent-input" @change="emit('auto-save')">
                    <option value="always">始终回复</option>
                    <option value="offline-only">仅客服不在线时</option>
                  </select>
                </div>
              </div>
            </template>

            <template v-else-if="card.key === 'entry-visibility'">
              <div class="visibility-layout">
                <div class="visibility-layout__form">
                  <div class="form-row form-row--single">
                    <div class="form-row__control">
                      <div class="toggle-row">
                        <label class="agent-switch">
                          <input v-model="localShowMessageAgentLabel" type="checkbox" class="agent-switch__input" @change="emit('auto-save')" />
                          <span class="agent-switch__track" />
                        </label>
                        <span class="toggle-row__label">在消息气泡中显示标签</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="visibility-layout__preview">
                  <div class="bubble-preview">
                    <div class="bubble-preview__content">
                      <span class="bubble-preview__time">16:54</span>
                      <div class="bubble-preview__bubble">
                        Hi! How may I help you?
                        <span v-if="localShowMessageAgentLabel" class="bubble-preview__tag">Autopilot</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </template>

            <template v-else-if="card.key === 'identity-profile'">
              <div class="form-row">
                <div class="form-row__label">
                  <span class="form-row__name">头像</span>
                  <span class="form-row__desc">设置 Autopilot 的头像形象，用于会话列表和消息头像展示</span>
                </div>
                <div class="form-row__control form-row__control--stack">
                  <div class="bot-avatar-upload">
                    <div class="bot-avatar-upload__preview" :class="{ 'bot-avatar-upload__preview--image': Boolean(botAvatarUrl) }">
                      <img v-if="botAvatarUrl" :src="botAvatarUrl" alt="Autopilot 头像" class="bot-avatar-upload__image" />
                      <span v-else class="bot-avatar-upload__fallback">{{ avatarFallbackText }}</span>
                    </div>
                    <div class="bot-avatar-upload__actions">
                      <button type="button" class="agent-btn agent-btn--ghost" @click="emit('trigger-avatar-select')">
                        {{ botAvatarUrl ? '重新上传' : '上传头像' }}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div class="form-row">
                <div class="form-row__label">
                  <span class="form-row__name">昵称</span>
                  <span class="form-row__desc">当访客询问"你是谁"时，Autopilot 会优先使用这个身份名称</span>
                </div>
                <div class="form-row__control">
                  <input
                    v-model="localBotName"
                    class="agent-input"
                    :class="{ 'agent-input--error': botNameTouched && !botName.trim() }"
                    maxlength="64"
                    placeholder="请输入昵称"
                    @blur="emit('update:touched', 'botNameTouched', true); emit('auto-save')"
                  />
                  <p v-if="botNameTouched && !botName.trim()" class="form-row__error">请输入昵称</p>
                </div>
              </div>

              <div class="form-row">
                <div class="form-row__label">
                  <span class="form-row__name">业务简介</span>
                  <span class="form-row__desc">描述你的业务和服务范围，AI 会据此生成更贴合场景的回答</span>
                </div>
                <div class="form-row__control">
                  <textarea
                    v-model="localBotIntro"
                    class="agent-input form-row__textarea"
                    rows="5"
                    maxlength="2000"
                    placeholder="请输入"
                    @blur="emit('auto-save')"
                  />
                </div>
              </div>
            </template>

            <template v-else-if="card.key === 'identity-style'">
              <div class="form-row">
                <div class="form-row__label">
                  <span class="form-row__name">回复语气</span>
                  <span class="form-row__desc">统一 Autopilot 的表达风格，保证对外沟通体验一致</span>
                </div>
                <div class="form-row__control">
                  <div class="bot-chips-group">
                    <button
                      v-for="tone in toneOptions"
                      :key="tone.value"
                      type="button"
                      class="bot-chip"
                      :class="{ 'bot-chip--active': localSelectedTone === tone.value }"
                      @click="localSelectedTone = tone.value; emit('auto-save')"
                    >{{ tone.label }}</button>
                  </div>
                </div>
              </div>

              <div class="form-row">
                <div class="form-row__label">
                  <span class="form-row__name">默认语言</span>
                  <span class="form-row__desc">当系统无法判断访客语言时，将优先使用该语言回复</span>
                </div>
                <div class="form-row__control">
                  <select v-model="localDefaultLanguage" class="agent-input" @change="emit('auto-save')">
                    <option
                      v-for="language in languageOptions"
                      :key="language.value"
                      :value="language.value"
                    >{{ language.label }}</option>
                  </select>
                </div>
              </div>
            </template>

            <template v-else-if="card.key === 'answering-mode'">
              <div class="form-row form-row--single">
                <div class="form-row__control">
                  <select v-model="localReplyMode" class="agent-input" @change="emit('auto-save')">
                    <option value="strict">严格模式 — 仅使用知识库内容回复</option>
                    <option value="creative">发散模式 — 允许适度推理</option>
                  </select>
                </div>
              </div>
            </template>

            <template v-else-if="card.key === 'answering-knowledge'">
              <div class="knowledge-card">
                <div v-if="knowledgeDocCount === 0" class="knowledge-warning">
                  <p class="knowledge-warning__text">
                    当前未添加知识库，为获得更精准的回答，请添加相关内容。
                    <a class="knowledge-warning__link" @click.prevent="emit('nav-change', 'doc-knowledge')">去添加</a>
                  </p>
                </div>

                <div class="knowledge-actions">
                  <button
                    type="button"
                    class="agent-btn agent-btn--ghost"
                    @click="emit('nav-change', 'doc-knowledge')"
                  >
                    添加知识库
                  </button>

                  <p v-if="knowledgeDocCount > 0" class="knowledge-card__count">
                    已关联 {{ knowledgeDocCount }} 篇知识库文档
                  </p>
                </div>
              </div>
            </template>

            <template v-else-if="card.key === 'answering-unsupported'">
              <div class="form-row form-row--single">
                <div class="form-row__control">
                  <textarea
                    v-model="localUnsupportedQuestionMessage"
                    class="agent-input form-row__textarea"
                    :class="{ 'agent-input--error': unsupportedMessageTouched && !unsupportedQuestionMessage.trim() }"
                    rows="3"
                    maxlength="2000"
                    placeholder="请输入"
                    @blur="emit('update:touched', 'unsupportedMessageTouched', true); emit('auto-save')"
                  />
                  <p v-if="unsupportedMessageTouched && !unsupportedQuestionMessage.trim()" class="form-row__error">请输入回复内容</p>
                  <p class="form-row__hint">更新文案后，系统将自动同步翻译为其他已支持的语言</p>
                </div>
              </div>
            </template>

            <template v-else-if="card.key === 'fallback-transfer'">
              <div class="form-row form-row--single">
                <div class="form-row__control">
                  <div class="toggle-row">
                    <label class="agent-switch">
                      <input v-model="localTransferEnabled" type="checkbox" class="agent-switch__input" @change="emit('auto-save')" />
                      <span class="agent-switch__track" />
                    </label>
                    <span class="toggle-row__label">允许转接人工</span>
                  </div>
                </div>
              </div>

              <template v-if="localTransferEnabled">
                <div class="form-row form-row--single">
                  <div class="form-row__control form-row__control--stack">
                    <span class="form-row__name">转接提示语</span>
                    <textarea
                      v-model="localTransferMessage"
                      class="agent-input form-row__textarea"
                      :class="{ 'agent-input--error': transferMessageTouched && !transferMessage.trim() }"
                      rows="3"
                      maxlength="2000"
                      placeholder="请输入"
                      @blur="emit('update:touched', 'transferMessageTouched', true); emit('auto-save')"
                    />
                    <p v-if="transferMessageTouched && !transferMessage.trim()" class="form-row__error">请输入回复内容</p>
                    <p class="form-row__hint">更新文案后，系统将自动同步翻译为其他已支持的语言</p>
                  </div>
                </div>

                <div class="form-row form-row--single">
                  <div class="form-row__control form-row__control--stack">
                    <span class="form-row__name">客服离线提示</span>
                    <textarea
                      v-model="localOfflineMessage"
                      class="agent-input form-row__textarea"
                      :class="{ 'agent-input--error': offlineMessageTouched && !offlineMessage.trim() }"
                      rows="3"
                      maxlength="2000"
                      placeholder="请输入"
                      @blur="emit('update:touched', 'offlineMessageTouched', true); emit('auto-save')"
                    />
                    <p v-if="offlineMessageTouched && !offlineMessage.trim()" class="form-row__error">请输入回复内容</p>
                    <p class="form-row__hint">更新文案后，系统将自动同步翻译为其他已支持的语言</p>
                  </div>
                </div>
              </template>

              <template v-else>
                <div class="form-row form-row--single">
                  <div class="form-row__control form-row__control--stack">
                    <span class="form-row__name">不转接提示语</span>
                    <textarea
                      v-model="localOfflineMessage"
                      class="agent-input form-row__textarea"
                      :class="{ 'agent-input--error': offlineMessageTouched && !offlineMessage.trim() }"
                      rows="3"
                      maxlength="2000"
                      placeholder="请输入"
                      @blur="emit('update:touched', 'offlineMessageTouched', true); emit('auto-save')"
                    />
                    <p v-if="offlineMessageTouched && !offlineMessage.trim()" class="form-row__error">请输入回复内容</p>
                    <p class="form-row__hint">更新文案后，系统将自动同步翻译为其他已支持的语言</p>
                  </div>
                </div>
              </template>
            </template>

            <template v-else-if="card.key === 'idle-followup'">
              <div class="form-row form-row--single">
                <div class="form-row__control">
                  <div class="toggle-row">
                    <label class="agent-switch">
                      <input v-model="localFollowUpEnabled" type="checkbox" class="agent-switch__input" @change="emit('auto-save')" />
                      <span class="agent-switch__track" />
                    </label>
                    <div class="toggle-row__content">
                      <span class="toggle-row__label">发送跟进消息</span>
                      <span class="toggle-row__desc">开启后，访客 5 分钟未回复时自动发送跟进消息</span>
                    </div>
                  </div>
                </div>
              </div>

              <div v-if="localFollowUpEnabled" class="form-row form-row--single">
                <div class="form-row__control">
                  <textarea
                    v-model="localFollowUpMessage"
                    class="agent-input form-row__textarea"
                    :class="{ 'agent-input--error': followUpMessageTouched && !followUpMessage.trim() }"
                    rows="3"
                    maxlength="2000"
                    placeholder="请输入跟进消息内容"
                    @blur="emit('update:touched', 'followUpMessageTouched', true); emit('auto-save')"
                  />
                  <p v-if="followUpMessageTouched && !followUpMessage.trim()" class="form-row__error">请输入跟进消息内容</p>
                  <p class="form-row__hint">更新文案后，系统将自动同步翻译为其他已支持的语言</p>
                </div>
              </div>
            </template>

            <template v-else-if="card.key === 'idle-autoclose'">
              <div class="form-row form-row--single">
                <div class="form-row__control">
                  <div class="inactive-setting">
                    <span class="inactive-setting__text">当访客超过</span>
                    <input v-model.number="localIdleHours" type="number" class="agent-input inactive-setting__input" min="0" @blur="emit('auto-save')" />
                    <span class="inactive-setting__unit-label">时</span>
                    <input v-model.number="localIdleMinutes" type="number" class="agent-input inactive-setting__input" min="0" max="59" @blur="emit('auto-save')" />
                    <span class="inactive-setting__unit-label">分</span>
                    <input v-model.number="localIdleSeconds" type="number" class="agent-input inactive-setting__input" min="0" max="59" @blur="emit('auto-save')" />
                    <span class="inactive-setting__unit-label">秒</span>
                    <span class="inactive-setting__text">未回复时，自动关闭会话</span>
                  </div>
                  <p class="form-row__hint">若开启跟进消息，关闭时间将从跟进消息发送后开始计算</p>
                </div>
              </div>
            </template>

          </div>
        </article>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { AgentIcon } from "@twt/ui-agent";

// ── Types ────────────────────────────────────────────────────────────────────

export type AudienceType = "all" | "visitor" | "customer";
export type LifecycleSectionKey = "entry" | "answering" | "fallback" | "idle";
export type LifecycleCardKey =
  | "entry-routing"
  | "entry-visibility"
  | "identity-profile"
  | "identity-style"
  | "answering-mode"
  | "answering-knowledge"
  | "answering-unsupported"
  | "fallback-transfer"
  | "idle-autoclose"
  | "idle-followup";

export interface LifecycleCard {
  key: LifecycleCardKey;
  title: string;
  summary: string;
  description?: string;
  badge?: string;
  badgeTone?: "warning" | "default";
}

export interface LifecycleSection {
  key: LifecycleSectionKey;
  title: string;
  icon: "customer" | "ai-agent" | "service" | "calendar";
  cards: LifecycleCard[];
}

// ── Options arrays (local constants) ─────────────────────────────────────────

const audienceOptions: Array<{ label: string; value: AudienceType }> = [
  { label: "全部访客", value: "all" },
  { label: "仅访客", value: "visitor" },
  { label: "仅客户", value: "customer" }
];

const toneOptions = [
  { value: "friendly", label: "友好亲切" },
  { value: "professional", label: "专业严谨" },
  { value: "humorous", label: "幽默活泼" },
  { value: "concise", label: "简洁高效" }
];

const languageOptions = [
  { value: "en", label: "英语" },
  { value: "es", label: "西班牙语" },
  { value: "fr", label: "法语" },
  { value: "de", label: "德语" },
  { value: "pt", label: "葡萄牙语" },
  { value: "ru", label: "俄语" },
  { value: "zh-CN", label: "简体中文" },
  { value: "zh-TW", label: "繁体中文" },
  { value: "ja", label: "日语" },
  { value: "ko", label: "韩语" },
  { value: "vi", label: "越南语" },
  { value: "th", label: "泰语" },
  { value: "id", label: "印尼语" },
  { value: "ms", label: "马利西亚语" }
];

// ── Props ────────────────────────────────────────────────────────────────────

const props = defineProps<{
  sections: LifecycleSection[];
  openCardKey: LifecycleCardKey | null;
  visitorAudience: AudienceType;
  agentResponseMode: string;
  showMessageAgentLabel: boolean;
  botAvatarUrl: string;
  botName: string;
  botNameTouched: boolean;
  botIntro: string;
  selectedTone: string;
  defaultLanguage: string;
  replyMode: string;
  knowledgeDocCount: number;
  unsupportedQuestionMessage: string;
  unsupportedMessageTouched: boolean;
  transferEnabled: boolean;
  transferMessage: string;
  transferMessageTouched: boolean;
  offlineMessage: string;
  offlineMessageTouched: boolean;
  followUpEnabled: boolean;
  followUpMessage: string;
  followUpMessageTouched: boolean;
  idleHours: number;
  idleMinutes: number;
  idleSeconds: number;
  avatarFallbackText: string;
}>();

// ── Emits ────────────────────────────────────────────────────────────────────

const emit = defineEmits<{
  (e: "toggle-card", key: LifecycleCardKey): void;
  (e: "update:field", field: string, value: any): void;
  (e: "update:touched", field: string, value: boolean): void;
  (e: "trigger-avatar-select"): void;
  (e: "nav-change", key: string): void;
  (e: "auto-save"): void;
}>();

// ── Computed v-model wrappers ────────────────────────────────────────────────

const localVisitorAudience = computed({
  get: () => props.visitorAudience,
  set: (v) => emit("update:field", "visitorAudience", v)
});

const localAgentResponseMode = computed({
  get: () => props.agentResponseMode,
  set: (v) => emit("update:field", "agentResponseMode", v)
});

const localShowMessageAgentLabel = computed({
  get: () => props.showMessageAgentLabel,
  set: (v) => emit("update:field", "showMessageAgentLabel", v)
});

const localBotName = computed({
  get: () => props.botName,
  set: (v) => emit("update:field", "botName", v)
});

const localBotIntro = computed({
  get: () => props.botIntro,
  set: (v) => emit("update:field", "botIntro", v)
});

const localSelectedTone = computed({
  get: () => props.selectedTone,
  set: (v) => emit("update:field", "selectedTone", v)
});

const localDefaultLanguage = computed({
  get: () => props.defaultLanguage,
  set: (v) => emit("update:field", "defaultLanguage", v)
});

const localReplyMode = computed({
  get: () => props.replyMode,
  set: (v) => emit("update:field", "replyMode", v)
});

const localUnsupportedQuestionMessage = computed({
  get: () => props.unsupportedQuestionMessage,
  set: (v) => emit("update:field", "unsupportedQuestionMessage", v)
});

const localTransferEnabled = computed({
  get: () => props.transferEnabled,
  set: (v) => emit("update:field", "transferEnabled", v)
});

const localTransferMessage = computed({
  get: () => props.transferMessage,
  set: (v) => emit("update:field", "transferMessage", v)
});

const localOfflineMessage = computed({
  get: () => props.offlineMessage,
  set: (v) => emit("update:field", "offlineMessage", v)
});

const localFollowUpEnabled = computed({
  get: () => props.followUpEnabled,
  set: (v) => emit("update:field", "followUpEnabled", v)
});

const localFollowUpMessage = computed({
  get: () => props.followUpMessage,
  set: (v) => emit("update:field", "followUpMessage", v)
});

const localIdleHours = computed({
  get: () => props.idleHours,
  set: (v) => emit("update:field", "idleHours", v)
});

const localIdleMinutes = computed({
  get: () => props.idleMinutes,
  set: (v) => emit("update:field", "idleMinutes", v)
});

const localIdleSeconds = computed({
  get: () => props.idleSeconds,
  set: (v) => emit("update:field", "idleSeconds", v)
});
</script>

<style scoped>
.lifecycle-flow {
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.lifecycle-stage {
  padding-left: 56px;
  position: relative;
}

.lifecycle-stage:not(:last-of-type)::before {
  border-left: 1px dashed #d7dbe4;
  bottom: -28px;
  content: "";
  left: 19px;
  position: absolute;
  top: 46px;
}

.lifecycle-stage__header {
  align-items: center;
  display: flex;
  gap: 16px;
  margin: 0 0 16px -56px;
}

.lifecycle-stage__badge {
  align-items: center;
  border-radius: 12px;
  color: #18212f;
  display: inline-flex;
  flex-shrink: 0;
  height: 40px;
  justify-content: center;
  width: 40px;
}

.lifecycle-stage__badge--entry {
  background: #fee07c;
}

.lifecycle-stage__badge--answering {
  background: #1f1f1f;
  color: #ffffff;
}

.lifecycle-stage__badge--fallback {
  background: #bfead7;
}

.lifecycle-stage__badge--idle {
  background: #bfead7;
}

.lifecycle-stage__title {
  color: var(--agent-color-text-primary);
  font-size: 18px;
  font-weight: var(--agent-font-weight-medium);
  line-height: 1.45;
  margin: 0;
}

.lifecycle-stage__cards {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.config-card {
  overflow: hidden;
  padding: 0;
  transition: border-color var(--agent-motion-fast) ease, box-shadow var(--agent-motion-fast) ease;
}

.config-card--open {
  border-color: var(--agent-color-brand-primary);
  box-shadow: 0 10px 24px rgba(17, 24, 39, 0.06);
}

.config-card__trigger {
  align-items: center;
  background: transparent;
  border: 0;
  cursor: pointer;
  display: flex;
  gap: 16px;
  justify-content: space-between;
  min-height: 80px;
  padding: 0 24px;
  text-align: left;
  width: 100%;
}

.config-card__heading {
  color: var(--agent-color-text-primary);
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.config-card__title-row {
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.config-card__description {
  color: var(--agent-color-text-tertiary);
  font-size: var(--agent-font-size-sm);
  line-height: 1.6;
  margin: 0;
}

.config-card__title {
  color: var(--agent-color-text-primary);
  font-size: 16px;
  font-weight: var(--agent-font-weight-semibold);
  line-height: 1.5;
  margin: 0;
}

.config-card__summary {
  color: var(--agent-color-text-tertiary);
  font-size: 14px;
  line-height: 1.5;
  margin: 0;
}

.config-card__status {
  align-items: center;
  border-radius: 999px;
  display: inline-flex;
  font-size: 12px;
  font-weight: var(--agent-font-weight-medium);
  line-height: 1;
  padding: 6px 12px;
}

.config-card__status--default {
  background: #eef2f8;
  color: var(--agent-color-text-secondary);
}

.config-card__status--warning {
  background: #eef4ff;
  color: #1a56db;
}

.config-card__chevron {
  color: var(--agent-color-text-tertiary);
  flex-shrink: 0;
}

.config-card__body {
  border-top: 1px solid var(--agent-color-border-default);
  display: flex;
  flex-direction: column;
  gap: var(--agent-space-24);
  padding: 24px;
}

.card-description {
  color: var(--agent-color-text-tertiary);
  font-size: var(--agent-font-size-sm);
  line-height: 1.6;
  margin: 0 0 var(--agent-space-16);
}

.form-row {
  align-items: flex-start;
  display: flex;
  gap: var(--agent-space-24);
}

.config-card__body .form-row + .form-row {
  padding-top: var(--agent-space-16);
}

.form-row__label {
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  gap: 4px;
  padding-top: 8px;
  width: 280px;
}

.form-row__name {
  color: var(--agent-color-text-primary);
  font-size: var(--agent-font-size-sm);
  font-weight: var(--agent-font-weight-medium);
}

.form-row__desc {
  color: var(--agent-color-text-tertiary);
  font-size: var(--agent-font-size-xs);
  line-height: 1.5;
}

.form-row__control {
  flex: 1;
  max-width: 620px;
  min-width: 0;
}

.form-row__control--stack {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.form-row__control .agent-input {
  width: 100%;
}

.form-row__textarea {
  min-height: 80px;
  resize: vertical;
  width: 100%;
}

.form-row__error {
  color: #e53e3e;
  font-size: var(--agent-font-size-xs);
  line-height: 1.5;
  margin: 4px 0 0;
}

.agent-input--error {
  border-color: #e53e3e;
}

.setting-helper-stack {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.setting-callout {
  background: rgba(16, 94, 255, 0.05);
  border-radius: 12px;
  padding: 10px 16px;
}

.setting-callout--soft {
  background: rgba(16, 94, 255, 0.05);
}

.setting-callout__text {
  color: #222;
  font-size: var(--agent-font-size-sm);
  line-height: 1.6;
  margin: 0;
}

.setting-callout--soft .setting-callout__text {
  color: #222;
}

.setting-callout__highlight {
  color: #ff3a3a;
}

.knowledge-card {
  display: flex;
  flex-direction: column;
  gap: var(--agent-space-16);
}

.knowledge-actions {
  align-items: center;
  display: flex;
  gap: var(--agent-space-12);
}

.knowledge-card__action {
  align-self: flex-start;
  font-weight: var(--agent-font-weight-medium);
}

.knowledge-card__count {
  color: var(--agent-color-text-tertiary);
  font-size: var(--agent-font-size-sm);
  line-height: 1.5;
  margin: 0;
}

.knowledge-warning {
  background: rgba(255, 128, 26, 0.14);
  border-radius: 12px;
  padding: 10px 16px;
}

.knowledge-warning__text {
  color: #222;
  font-size: var(--agent-font-size-sm);
  line-height: 1.6;
  margin: 0;
}

.knowledge-warning__link {
  color: #105eff;
  cursor: pointer;
  text-decoration: none;
}

.knowledge-warning__link:hover {
  text-decoration: underline;
}

.radio-card-group {
  display: flex;
  gap: 12px;
}

.radio-card {
  align-items: center;
  border: 1px solid var(--agent-color-border-default);
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  flex: 1;
  gap: 8px;
  height: 36px;
  padding: 0 12px;
  transition: border-color var(--agent-motion-fast);
}

.radio-card--active {
  border-color: var(--agent-color-brand-primary);
}

.radio-card__input {
  height: 0;
  opacity: 0;
  position: absolute;
  width: 0;
}

.radio-card__indicator {
  border: 2px solid var(--agent-color-border-default);
  border-radius: 50%;
  display: inline-block;
  flex-shrink: 0;
  height: 16px;
  position: relative;
  width: 16px;
}

.radio-card--active .radio-card__indicator {
  border-color: var(--agent-color-brand-primary);
  border-width: 5px;
}

.radio-card__label {
  color: #222;
  font-size: 14px;
  white-space: nowrap;
}

.toggle-row {
  align-items: flex-start;
  display: flex;
  gap: 8px;
}

.toggle-row__content {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.toggle-row__label {
  color: var(--agent-color-text-primary);
  font-size: 14px;
  font-weight: var(--agent-font-weight-medium);
  line-height: 24px;
}

.toggle-row__desc {
  color: var(--agent-color-text-tertiary);
  font-size: 12px;
  line-height: 1.5;
}

.form-row__hint {
  color: var(--agent-color-text-tertiary);
  font-size: 12px;
  line-height: 1.5;
  margin-top: 8px;
}

.inactive-setting {
  align-items: center;
  color: var(--agent-color-text-primary);
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.inactive-setting__input {
  max-width: 72px;
  min-height: 38px;
  padding-left: 12px;
  padding-right: 12px;
  text-align: center;
}

.inactive-setting__unit-label {
  color: var(--agent-color-text-primary);
  font-size: var(--agent-font-size-sm);
  flex-shrink: 0;
}

.inactive-setting__unit {
  max-width: 100px;
  min-height: 38px;
}

.inactive-setting__text {
  color: var(--agent-color-text-primary);
  font-size: var(--agent-font-size-sm);
  line-height: 1.6;
}

.agent-switch {
  cursor: pointer;
  display: inline-flex;
  position: relative;
}

.agent-switch__input {
  height: 0;
  opacity: 0;
  position: absolute;
  width: 0;
}

.agent-switch__track {
  background: var(--agent-color-border-default);
  border-radius: 12px;
  display: inline-block;
  height: 24px;
  position: relative;
  transition: background var(--agent-motion-fast);
  width: 44px;
}

.agent-switch__track::after {
  background: #fff;
  border-radius: 50%;
  content: "";
  height: 20px;
  left: 2px;
  position: absolute;
  top: 2px;
  transition: transform var(--agent-motion-fast);
  width: 20px;
}

.agent-switch__input:checked + .agent-switch__track {
  background: var(--agent-color-brand-primary);
}

.agent-switch__input:checked + .agent-switch__track::after {
  transform: translateX(20px);
}

.bot-avatar-upload {
  align-items: center;
  display: flex;
  gap: var(--agent-space-12);
}

.bot-avatar-upload__preview {
  align-items: center;
  background: linear-gradient(135deg, #00b578, #00c2b8);
  border-radius: 50%;
  display: inline-flex;
  flex-shrink: 0;
  height: 64px;
  justify-content: center;
  overflow: hidden;
  position: relative;
  width: 64px;
}

.bot-avatar-upload__preview--image {
  background: #eef2f8;
}

.bot-avatar-upload__image {
  height: 100%;
  object-fit: cover;
  width: 100%;
}

.bot-avatar-upload__fallback {
  color: #ffffff;
  font-size: 18px;
  font-weight: 600;
}

.bot-avatar-upload__actions {
  align-items: flex-start;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.bot-avatar-upload__hint {
  color: var(--agent-color-text-tertiary);
  font-size: var(--agent-font-size-xs);
  line-height: 1.5;
  margin: 0;
}

.bot-avatar-upload__input {
  display: none;
}

.bot-chips-group {
  display: flex;
  flex-wrap: wrap;
  gap: var(--agent-space-8);
}

.bot-chip {
  background: var(--agent-color-bg-muted);
  border: 1px solid var(--agent-color-border-default);
  border-radius: 999px;
  color: var(--agent-color-text-secondary);
  cursor: pointer;
  font-size: var(--agent-font-size-sm);
  padding: 8px var(--agent-space-16);
  transition: all var(--agent-motion-fast);
}

.bot-chip:hover {
  border-color: var(--agent-color-brand-primary);
  color: var(--agent-color-brand-primary);
}

.bot-chip--active {
  background: var(--agent-color-brand-soft);
  border-color: var(--agent-color-brand-primary);
  color: var(--agent-color-brand-primary);
  font-weight: var(--agent-font-weight-medium);
}

.visibility-layout {
  display: flex;
  gap: var(--agent-space-24);
}

.visibility-layout__form {
  flex: 1;
  min-width: 0;
}

.visibility-layout__preview {
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  gap: 8px;
  width: 280px;
}

.bubble-preview__label {
  color: var(--agent-color-text-tertiary);
  font-size: var(--agent-font-size-xs);
  font-weight: var(--agent-font-weight-medium);
  margin: 0;
}

.bubble-preview {
  background: #f8f9fb;
  border: 1px solid var(--agent-color-border-default);
  border-radius: var(--agent-radius-lg);
  padding: 16px;
}

.bubble-preview__content {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.bubble-preview__time {
  color: var(--agent-color-text-tertiary);
  font-size: 11px;
  margin-bottom: 4px;
}

.bubble-preview__tag {
  color: #8a9ab5;
  display: block;
  font-size: 11px;
  line-height: 1;
  margin-top: 6px;
}

.bubble-preview__bubble {
  background: #ffffff;
  border: 1px solid #e8ecf1;
  border-radius: 0 12px 12px 12px;
  color: var(--agent-color-text-primary);
  font-size: 13px;
  line-height: 1.6;
  padding: 8px 12px;
}

@media (max-width: 1280px) {
  .lifecycle-stage {
    padding-left: 0;
  }

  .lifecycle-stage::before {
    display: none;
  }

  .lifecycle-stage__header {
    margin-left: 0;
  }

  .config-card__trigger {
    align-items: flex-start;
    min-height: 0;
    padding: 18px;
  }

  .config-card__body {
    padding: 18px;
  }

  .form-row {
    flex-direction: column;
    gap: var(--agent-space-8);
  }

  .form-row__label {
    padding-top: 0;
    width: auto;
  }

  .inactive-setting {
    align-items: flex-start;
  }

  .bot-avatar-upload {
    align-items: flex-start;
    flex-direction: column;
  }

  .visibility-layout {
    flex-direction: column;
  }

  .visibility-layout__preview {
    width: 100%;
  }
}
</style>
