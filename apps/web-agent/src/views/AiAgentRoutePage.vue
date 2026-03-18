<template>
  <section class="agent-content-page ai-agent-page">
    <template v-if="resolvedActiveKey === 'copilot-settings'">
      <header class="agent-content-header">
        <h1 class="agent-content-title">Copilot设置</h1>
        <p class="agent-content-subtitle">使用 Copilot 工具在客服对话中提供智能辅助功能。</p>
      </header>

      <CopilotPromoBanner
        v-if="showBanner"
        title="以智能驱动服务，助力业务增长"
        description="通过 Copilot 提升响应速度与服务满意度。将每一次咨询转化为高质量的互动，让智能客服成为你业务转化的核心驱动力。"
        @close="showBanner = false"
        @learn="emitToast('文档功能开发中')"
      />

      <div class="ai-agent-page__list">
        <CopilotSettingItem
          v-for="item in copilotSettings"
          :key="item.key"
          :description="item.description"
          :locked="!!copilotFeatureMap[item.key] && !canUse(copilotFeatureMap[item.key])"
          :model-value="item.enabled"
          :title="item.title"
          @update:model-value="updateCopilotSetting(item.key, $event)"
        />
      </div>
    </template>

    <template v-else-if="resolvedActiveKey === 'ai-agent-config'">
      <header class="agent-content-header agent-config-header">
        <div class="agent-config-header__content">
          <div class="agent-config-header__title-row">
            <h1 class="agent-content-title">AI Agent</h1>
            <span class="agent-config-header__status" :class="agentEnabled && agentFeatureAvailable ? 'agent-config-header__status--active' : 'agent-config-header__status--inactive'">
              {{ agentEnabled && agentFeatureAvailable ? '已开启' : '已关闭' }}
            </span>
          </div>
          <p class="agent-content-subtitle">开启后，AI Agent 将自动回复访客咨询，根据知识库内容智能回复，并在需要时转接人工客服</p>
        </div>

        <div class="agent-config-header__actions">
          <button
            type="button"
            class="agent-btn"
            :class="agentEnabled && agentFeatureAvailable ? 'agent-btn--ghost' : 'agent-btn--primary'"
            @click="toggleAgentLiveStatus"
          >
            {{ launchActionLabel }}
          </button>
        </div>
      </header>

      <div v-if="!agentFeatureAvailable" class="ai-agent-locked-hint agent-panel">
        <p class="ai-agent-locked-hint__text">当前服务版本不支持 AI Agent，请升级到专业版后使用</p>
      </div>

      <template v-else>

      <nav class="config-tabs">
        <button
          type="button"
          class="config-tabs__item"
          :class="{ 'config-tabs__item--active': configTab === 'deploy' }"
          @click="configTab = 'deploy'"
        >部署</button>
        <button
          type="button"
          class="config-tabs__item"
          :class="{ 'config-tabs__item--active': configTab === 'settings' }"
          @click="configTab = 'settings'"
        >设置</button>
      </nav>

      <AiAgentDeployFlow
        v-if="configTab === 'deploy'"
        :sections="deployLifecycleSections"
        :open-card-key="openLifecycleCard"
        :visitor-audience="visitorAudience"
        :agent-response-mode="agentResponseMode"
        :show-message-agent-label="showMessageAgentLabel"
        :bot-avatar-url="botAvatarUrl"
        :bot-name="botName"
        :bot-name-touched="botNameTouched"
        :bot-intro="botIntro"
        :selected-tone="selectedTone"
        :default-language="defaultLanguage"
        :reply-mode="replyMode"
        :knowledge-doc-count="knowledgeDocCount"
        :unsupported-question-message="unsupportedQuestionMessage"
        :unsupported-message-touched="unsupportedMessageTouched"
        :transfer-enabled="transferEnabled"
        :transfer-message="transferMessage"
        :transfer-message-touched="transferMessageTouched"
        :offline-message="offlineMessage"
        :offline-message-touched="offlineMessageTouched"
        :follow-up-enabled="followUpEnabled"
        :follow-up-message="followUpMessage"
        :follow-up-message-touched="followUpMessageTouched"
        :idle-hours="idleHours"
        :idle-minutes="idleMinutes"
        :idle-seconds="idleSeconds"
        :avatar-fallback-text="avatarFallbackText"
        @toggle-card="toggleLifecycleCard"
        @update:field="handleDeployFieldUpdate"
        @update:touched="handleDeployTouchedUpdate"
        @trigger-avatar-select="triggerBotAvatarSelect"
        @nav-change="emit('nav-change', $event)"
        @auto-save="autoSave"
      />

      <div v-else-if="configTab === 'settings'" class="settings-panel">
        <div class="settings-section agent-panel">
          <h3 class="settings-section__title">基本信息</h3>
          <p class="settings-section__desc"> </p>

          <div class="settings-form">
            <div class="form-row">
              <div class="form-row__label">
                <span class="form-row__name">
                  头像
                  <span class="form-row__help-wrap">
                    <button type="button" class="form-row__help-icon" tabindex="-1">?</button>
                    <span class="form-row__tooltip">头像不会在访客端进行展示</span>
                  </span>
                </span>
                <span class="form-row__desc">设置 AI Agent 的头像，用于会话列表中展示</span>
              </div>
              <div class="form-row__control form-row__control--stack">
                <div class="bot-avatar-upload">
                  <div class="bot-avatar-upload__preview" :class="{ 'bot-avatar-upload__preview--image': Boolean(botAvatarUrl) }">
                    <img v-if="botAvatarUrl" :src="botAvatarUrl" alt="AI Agent 头像" class="bot-avatar-upload__image" />
                    <span v-else class="bot-avatar-upload__fallback">{{ avatarFallbackText }}</span>
                  </div>
                  <div class="bot-avatar-upload__actions">
                    <button type="button" class="agent-btn agent-btn--ghost" @click="triggerBotAvatarSelect">
                      {{ botAvatarUrl ? '重新上传' : '上传头像' }}
                    </button>
                  </div>
                  <input
                    ref="avatarInputRef"
                    type="file"
                    accept="image/png,image/jpeg,image/jpg"
                    class="bot-avatar-upload__input"
                    @change="handleAvatarFileChange"
                  />
                </div>
              </div>
            </div>

            <div class="form-row">
              <div class="form-row__label">
                <span class="form-row__name">
                  昵称
                  <span class="form-row__help-wrap">
                    <button type="button" class="form-row__help-icon" tabindex="-1">?</button>
                    <span class="form-row__tooltip">昵称不会在访客端进行展示</span>
                  </span>
                </span>
                <span class="form-row__desc">当访客询问"你是谁"时，AI Agent 会使用这个昵称</span>
              </div>
              <div class="form-row__control">
                <input
                  v-model="botName"
                  class="agent-input"
                  :class="{ 'agent-input--error': botNameTouched && !botName.trim() }"
                  maxlength="64"
                  placeholder="请输入昵称"
                  @blur="botNameTouched = true; autoSave()"
                />
                <p v-if="botNameTouched && !botName.trim()" class="form-row__error">请输入昵称</p>
              </div>
            </div>

            <div class="form-row">
              <div class="form-row__label">
                <span class="form-row__name">业务简介</span>
                <span class="form-row__desc">描述你的业务和服务范围，AI Agent 会据此生成更贴合场景的回答</span>
              </div>
              <div class="form-row__control">
                <textarea
                  v-model="botIntro"
                  class="agent-input form-row__textarea"
                  rows="5"
                  maxlength="2000"
                  placeholder="例如：我们是一家 SaaS 软件服务商，提供产品功能咨询、账户管理、订阅与计费、技术故障排查等支持。请用专业友好的语气解答客户问题，无法解决时引导联系人工客服。"
                  @blur="autoSave"
                />
              </div>
            </div>
          </div>
        </div>

        <div class="settings-section agent-panel">
          <h3 class="settings-section__title">回复风格</h3>
          <p class="settings-section__desc"> </p>

          <div class="settings-form">
            <div class="form-row">
              <div class="form-row__label">
                <span class="form-row__name">回复语气</span>
                <span class="form-row__desc">设置 AI Agent 的表达风格，保证对外沟通体验一致</span>
              </div>
              <div class="form-row__control">
                <div class="bot-chips-group">
                  <button
                    v-for="tone in toneOptions"
                    :key="tone.value"
                    type="button"
                    class="bot-chip"
                    :class="{ 'bot-chip--active': selectedTone === tone.value }"
                    @click="selectedTone = tone.value; autoSave()"
                  >{{ tone.label }}</button>
                </div>
              </div>
            </div>

            <div class="form-row">
              <div class="form-row__label">
                <span class="form-row__name">默认语言</span>
                <span class="form-row__desc">当 AI Agent 无法判断访客语言时，将使用该语言进行回复</span>
              </div>
              <div class="form-row__control">
                <select v-model="defaultLanguage" class="agent-input" @change="autoSave">
                  <option
                    v-for="language in languageOptions"
                    :key="language.value"
                    :value="language.value"
                  >{{ language.label }}</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      </template>
    </template>

    <template v-else-if="resolvedActiveKey === 'doc-knowledge'">
      <header class="agent-content-header doc-knowledge-header">
        <h1 class="agent-content-title">文档知识</h1>
        <button type="button" class="agent-btn agent-btn--primary" @click="guardedDocAdd">
          <span class="doc-knowledge-header__add-icon">+</span>
          添加
        </button>
      </header>

      <div v-if="showDocBanner" class="doc-banner">
        <button type="button" class="doc-banner__close" @click="showDocBanner = false">&times;</button>
        <div class="doc-banner__content">
          <h3 class="doc-banner__title">搭建专属业务知识库</h3>
          <p class="doc-banner__desc">将分散的文档集中沉淀。Copilot 将学习这些知识并自动生成回复建议，确保团队对外口径一致，提升服务效率。</p>
          <a class="doc-banner__link" href="javascript:void(0)" @click.prevent="emitToast('文档功能开发中')">
            <span class="doc-banner__link-icon">&#x1F4D6;</span>
            学习使用知识库
          </a>
        </div>
        <div class="doc-banner__illustration">
          <svg width="160" height="120" viewBox="0 0 160 120" fill="none">
            <circle cx="110" cy="50" r="50" fill="#d4e4ff" opacity="0.5"/>
            <circle cx="130" cy="70" r="35" fill="#b8d4ff" opacity="0.4"/>
            <rect x="30" y="30" width="60" height="70" rx="8" fill="#e0ecff" stroke="#a0c4ff" stroke-width="1.5"/>
            <rect x="40" y="45" width="40" height="4" rx="2" fill="#7aafff"/>
            <rect x="40" y="55" width="30" height="4" rx="2" fill="#a0c4ff"/>
            <rect x="40" y="65" width="35" height="4" rx="2" fill="#a0c4ff"/>
            <circle cx="120" cy="40" r="18" fill="#e8f0ff" stroke="#7aafff" stroke-width="1.5"/>
            <path d="M114 40l4 4 8-8" stroke="#2f6bff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
      </div>

      <div class="doc-search">
        <div class="doc-search__input-wrap">
          <input
            v-model="docSearchQuery"
            class="agent-input doc-search__input"
            placeholder="搜索名称"
          />
          <span class="doc-search__icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </span>
        </div>
      </div>

      <div class="doc-table-wrap">
        <table class="doc-table">
          <thead>
            <tr>
              <th class="doc-table__th doc-table__th--name">名称</th>
              <th class="doc-table__th doc-table__th--type">类型</th>
              <th class="doc-table__th doc-table__th--time">更新时间</th>
              <th class="doc-table__th doc-table__th--status">训练状态</th>
              <th class="doc-table__th doc-table__th--action">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in filteredDocList" :key="item.id" class="doc-table__row">
              <td class="doc-table__td doc-table__td--name">{{ item.name }}</td>
              <td class="doc-table__td">{{ item.type }}</td>
              <td class="doc-table__td">{{ item.updatedAt }}</td>
              <td class="doc-table__td">
                <span class="doc-status">
                  <span class="doc-status__dot" :class="'doc-status__dot--' + item.statusType"></span>
                  {{ item.statusLabel }}
                </span>
              </td>
              <td class="doc-table__td doc-table__td--action">
                <button type="button" class="doc-action-btn" @click="guardedDocAction">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <circle cx="8" cy="3" r="1.5"/>
                    <circle cx="8" cy="8" r="1.5"/>
                    <circle cx="8" cy="13" r="1.5"/>
                  </svg>
                </button>
              </td>
            </tr>
            <tr v-if="filteredDocList.length === 0">
              <td colspan="5" class="doc-table__empty">暂无数据</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="doc-pagination">
        <span class="doc-pagination__total">总条数：{{ filteredDocList.length }}</span>
        <div class="doc-pagination__pages">
          <button type="button" class="doc-pagination__btn" disabled>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <span class="doc-pagination__current">1</span>
          <button type="button" class="doc-pagination__btn" disabled>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>
        <div class="doc-pagination__size">
          20 条/页
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
        </div>
      </div>
    </template>

    <template v-else-if="resolvedActiveKey === 'faq'">
      <header class="agent-content-header doc-knowledge-header">
        <h1 class="agent-content-title">常见问题</h1>
        <button type="button" class="agent-btn agent-btn--primary" @click="guardedFaqAdd">
          <span class="doc-knowledge-header__add-icon">+</span>
          添加
        </button>
      </header>

      <div v-if="showFaqBanner" class="doc-banner">
        <button type="button" class="doc-banner__close" @click="showFaqBanner = false">&times;</button>
        <div class="doc-banner__content">
          <h3 class="doc-banner__title">搭建专属业务知识库</h3>
          <p class="doc-banner__desc">将分散的常见问题集中沉淀。Copilot 将学习这些知识并自动生成回复建议，确保团队对外口径一致，提升服务效率。</p>
          <a class="doc-banner__link" href="javascript:void(0)" @click.prevent="emitToast('文档功能开发中')">
            <span class="doc-banner__link-icon">&#x1F4D6;</span>
            学习使用知识库
          </a>
        </div>
        <div class="doc-banner__illustration">
          <svg width="160" height="120" viewBox="0 0 160 120" fill="none">
            <circle cx="110" cy="50" r="50" fill="#d4e4ff" opacity="0.5"/>
            <circle cx="130" cy="70" r="35" fill="#b8d4ff" opacity="0.4"/>
            <rect x="30" y="30" width="60" height="70" rx="8" fill="#e0ecff" stroke="#a0c4ff" stroke-width="1.5"/>
            <rect x="40" y="45" width="40" height="4" rx="2" fill="#7aafff"/>
            <rect x="40" y="55" width="30" height="4" rx="2" fill="#a0c4ff"/>
            <rect x="40" y="65" width="35" height="4" rx="2" fill="#a0c4ff"/>
            <circle cx="120" cy="40" r="18" fill="#e8f0ff" stroke="#7aafff" stroke-width="1.5"/>
            <path d="M114 40l4 4 8-8" stroke="#2f6bff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
      </div>

      <div class="doc-search">
        <div class="doc-search__input-wrap">
          <input
            v-model="faqSearchQuery"
            class="agent-input doc-search__input"
            placeholder="搜索问题"
          />
          <span class="doc-search__icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </span>
        </div>
      </div>

      <div class="doc-table-wrap">
        <table class="doc-table">
          <thead>
            <tr>
              <th class="doc-table__th faq-table__th--question">问题</th>
              <th class="doc-table__th faq-table__th--answer">回答内容</th>
              <th class="doc-table__th faq-table__th--time">更新时间</th>
              <th class="doc-table__th faq-table__th--status">训练状态</th>
              <th class="doc-table__th doc-table__th--action">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in filteredFaqList" :key="item.id" class="doc-table__row">
              <td class="doc-table__td doc-table__td--name">{{ item.question }}</td>
              <td class="doc-table__td doc-table__td--name">{{ item.answer }}</td>
              <td class="doc-table__td">{{ item.updatedAt }}</td>
              <td class="doc-table__td">
                <span class="doc-status">
                  <span class="doc-status__dot" :class="'doc-status__dot--' + item.statusType"></span>
                  {{ item.statusLabel }}
                </span>
              </td>
              <td class="doc-table__td doc-table__td--action">
                <button type="button" class="doc-action-btn" @click="guardedFaqAction">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <circle cx="8" cy="3" r="1.5"/>
                    <circle cx="8" cy="8" r="1.5"/>
                    <circle cx="8" cy="13" r="1.5"/>
                  </svg>
                </button>
              </td>
            </tr>
            <tr v-if="filteredFaqList.length === 0">
              <td colspan="5" class="doc-table__empty">暂无数据</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="doc-pagination">
        <span class="doc-pagination__total">总条数：{{ filteredFaqList.length }}</span>
        <div class="doc-pagination__pages">
          <button type="button" class="doc-pagination__btn" disabled>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <span class="doc-pagination__current">1</span>
          <button type="button" class="doc-pagination__btn" disabled>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>
        <div class="doc-pagination__size">
          20 条/页
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
        </div>
      </div>
    </template>

    <AiAgentImageCropModal
      :open="cropModalOpen"
      :image-src="cropImageSource"
      @close="cropModalOpen = false"
      @confirm="handleCroppedImage"
    />
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { CopilotPromoBanner, CopilotSettingItem } from "@twt/ui-agent";
import { FEATURES } from "../lib/plan";
import { usePlan } from "../composables/usePlan";
import {
  type StoredAiAgentSettings,
  loadStoredAiAgentSettings,
  persistStoredAiAgentSettings
} from "../lib/aiAgentSettings";
import AiAgentDeployFlow from "../components/ai-agent/AiAgentDeployFlow.vue";
import AiAgentImageCropModal from "../components/ai-agent/AiAgentImageCropModal.vue";

type AiAgentNavKey = "doc-knowledge" | "faq" | "copilot-settings" | "ai-agent-config";

type AudienceType = "all" | "visitor" | "customer";
type LifecycleSectionKey = "entry" | "answering" | "fallback" | "idle";
type LifecycleCardKey =
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

interface CopilotSetting {
  key: string;
  title: string;
  description: string;
  enabled: boolean;
}

interface LifecycleCard {
  key: LifecycleCardKey;
  title: string;
  summary: string;
  badge?: string;
  badgeTone?: "warning" | "default";
}

interface LifecycleSection {
  key: LifecycleSectionKey;
  title: string;
  icon: "customer" | "ai-agent" | "service" | "calendar";
  cards: LifecycleCard[];
}


const props = defineProps<{
  activeKey: AiAgentNavKey;
}>();

const emit = defineEmits<{
  (e: "toast", message: string): void;
  (e: "nav-change", key: string): void;
}>();

const AVATAR_MAX_SIZE = 10 * 1024 * 1024; // 10MB

type ConfigTab = "deploy" | "settings";

const showBanner = ref(true);
const showDocBanner = ref(true);
const docSearchQuery = ref("");

interface DocKnowledgeItem {
  id: number;
  name: string;
  type: string;
  updatedAt: string;
  statusType: "success" | "pending" | "error";
  statusLabel: string;
}

const docKnowledgeList = ref<DocKnowledgeItem[]>([
  { id: 1, name: "word修订记录.docx", type: "文件", updatedAt: "2026-01-28 11:48", statusType: "success", statusLabel: "已完成" },
  { id: 2, name: "SaaS 行业自动回复 FAQ 模板.docx", type: "文件", updatedAt: "2026-01-12 19:19", statusType: "success", statusLabel: "已完成" },
  { id: 3, name: "https://www.baidu.com", type: "网页", updatedAt: "2025-12-31 16:26", statusType: "success", statusLabel: "已完成" }
]);

const filteredDocList = computed(() => {
  const query = docSearchQuery.value.trim().toLowerCase();
  if (!query) return docKnowledgeList.value;
  return docKnowledgeList.value.filter((item) => item.name.toLowerCase().includes(query));
});

const showFaqBanner = ref(true);
const faqSearchQuery = ref("");

interface FaqItem {
  id: number;
  question: string;
  answer: string;
  updatedAt: string;
  statusType: "success" | "pending" | "error";
  statusLabel: string;
}

const faqList = ref<FaqItem[]>([
  { id: 1, question: "退款吗?", answer: "不退款", updatedAt: "2026-03-17 15:12", statusType: "pending", statusLabel: "待训练" }
]);

const filteredFaqList = computed(() => {
  const query = faqSearchQuery.value.trim().toLowerCase();
  if (!query) return faqList.value;
  return faqList.value.filter((item) => item.question.toLowerCase().includes(query) || item.answer.toLowerCase().includes(query));
});

const { canUse, guardFeature } = usePlan();

const agentFeatureAvailable = computed(() => canUse(FEATURES.AI_AGENT));
const configTab = ref<ConfigTab>("deploy");
const openLifecycleCard = ref<LifecycleCardKey | null>(null);
const agentEnabled = ref(canUse(FEATURES.AI_AGENT));

/** 知识库门控 */
const guardedDocAdd = () => {
  if (!guardFeature(FEATURES.DOC_KNOWLEDGE)) return;
  emitToast('功能开发中');
};
const guardedDocAction = () => {
  if (!guardFeature(FEATURES.DOC_KNOWLEDGE)) return;
  emitToast('功能开发中');
};
const guardedFaqAdd = () => {
  if (!guardFeature(FEATURES.FAQ_KNOWLEDGE)) return;
  emitToast('功能开发中');
};
const guardedFaqAction = () => {
  if (!guardFeature(FEATURES.FAQ_KNOWLEDGE)) return;
  emitToast('功能开发中');
};

/** Copilot 设置项 key → 功能 key 映射 */
const copilotFeatureMap: Record<string, string> = {
  "auto-suggest": FEATURES.COPILOT_SMART_REPLY,
  "chat-translation": FEATURES.CHAT_TRANSLATE,
  "side-translation": FEATURES.WRITE_TRANSLATE,
  "text-polish": FEATURES.TEXT_POLISH,
};

const copilotSettings = ref<CopilotSetting[]>([
  { key: "auto-suggest", title: "自动推荐回复", description: "针对访客咨询，自动生成推荐回复。", enabled: canUse(FEATURES.COPILOT_SMART_REPLY) },
  { key: "chat-translation", title: "聊天翻译", description: "访客发送的消息将被自动翻译。", enabled: canUse(FEATURES.CHAT_TRANSLATE) },
  { key: "side-translation", title: "边写边译", description: "客服发送的消息将被自动翻译。", enabled: canUse(FEATURES.WRITE_TRANSLATE) },
  {
    key: "text-polish",
    title: "文本润色",
    description: "借助 AI 优化客服回复内容，支持润色、丰富内容、精简内容等。",
    enabled: canUse(FEATURES.TEXT_POLISH)
  }
]);

const botAvatarUrl = ref("");
const botName = ref("AI Agent");
const botIntro = ref("");
const selectedTone = ref("friendly");
const defaultLanguage = ref("en");
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

const audienceLabelMap: Record<AudienceType, string> = {
  all: "全部",
  visitor: "访客",
  customer: "客户"
};

const responseModeLabelMap: Record<string, string> = {
  always: "始终由 AI Agent 回复",
  "offline-only": "仅客服离线时"
};

const replyModeLabelMap: Record<string, string> = {
  strict: "严格模式",
  creative: "发散模式"
};

const agentResponseMode = ref("always");
const visitorAudience = ref<AudienceType>("all");
const showMessageAgentLabel = ref(true);
const visitorInactiveMinutes = ref(10);
const idleHours = ref(0);
const idleMinutes = ref(10);
const idleSeconds = ref(0);
const followUpEnabled = ref(false);
const followUpMessage = ref("你好，请问还有什么可以帮你的吗？如果没有其他问题，会话将在稍后自动关闭。");
const followUpMessageTouched = ref(false);
const replyMode = ref("strict");
const transferEnabled = ref(false);
const offlineMessage = ref("当前客服不在线。你可以先留下问题或联系方式，我们会尽快与你联系。");
const transferMessage = ref("正在为你转接人工客服，请稍候");
const unsupportedQuestionMessage = ref("抱歉，我暂时无法处理这类内容，请用文字描述或换个问题");

const knowledgeDocCount = ref(3);

const avatarInputRef = ref<HTMLInputElement | null>(null);
const cropModalOpen = ref(false);
const cropImageSource = ref("");
const botNameTouched = ref(false);
const transferMessageTouched = ref(false);
const offlineMessageTouched = ref(false);
const unsupportedMessageTouched = ref(false);

const emitToast = (message: string) => {
  emit("toast", message);
};

const resolvedActiveKey = computed<AiAgentNavKey>(() => {
  if (props.activeKey === "doc-knowledge" || props.activeKey === "faq" || props.activeKey === "ai-agent-config") {
    return props.activeKey;
  }
  return "copilot-settings";
});

const activeSectionLabel = computed(() => {
  if (resolvedActiveKey.value === "doc-knowledge") return "文档知识";
  if (resolvedActiveKey.value === "faq") return "常见问题";
  return "Copilot设置";
});

const avatarFallbackText = computed(() => "🤖");

const idleSummaryText = computed(() => {
  const parts: string[] = [];
  if (idleHours.value > 0) parts.push(`${idleHours.value} 时`);
  if (idleMinutes.value > 0) parts.push(`${idleMinutes.value} 分`);
  if (idleSeconds.value > 0) parts.push(`${idleSeconds.value} 秒`);
  return parts.length > 0 ? `${parts.join(" ")}后自动关闭会话` : "0 秒后自动关闭会话";
});

const getToneLabel = (tone: string) => toneOptions.find((item) => item.value === tone)?.label ?? toneOptions[0].label;

const getLanguageLabel = (languageCode: string) => languageOptions.find((item) => item.value === languageCode)?.label ?? languageCode;

const resolveAudienceType = (value: unknown): AudienceType => {
  if (value === "visitor" || value === "customer") {
    return value;
  }

  return "all";
};


const lifecycleSections = computed<LifecycleSection[]>(() => {
  const hasIntro = botIntro.value.trim().length > 0;
  const hasUnsupportedReply = unsupportedQuestionMessage.value.trim().length > 0;
  const hasTransferReply = transferMessage.value.trim().length > 0;
  const hasOfflineReply = offlineMessage.value.trim().length > 0;
  const botLabel = botName.value.trim() || "未设置昵称";

  return [
    {
      key: "entry",
      title: "当访客发送第一条消息",
      icon: "customer",
      cards: [
        {
          key: "entry-routing",
          title: "AI Agent 将回复",
          summary: `${audienceLabelMap[visitorAudience.value]} · ${responseModeLabelMap[agentResponseMode.value] ?? responseModeLabelMap.always}`
        },
        {
          key: "entry-visibility",
          title: "AI Agent 标签",
          summary: showMessageAgentLabel.value ? "显示" : "不显示"
        }
      ]
    },
    {
      key: "answering",
      title: "当 AI Agent 回复访客",
      icon: "ai-agent",
      cards: [
        {
          key: "identity-profile",
          title: "AI 如何介绍自己",
          summary: `${botLabel} · ${hasIntro ? "已设置业务简介" : "未设置业务简介"}`,
          badge: botName.value.trim() ? undefined : "需要补充",
          badgeTone: botName.value.trim() ? undefined : "warning"
        },
        {
          key: "identity-style",
          title: "AI 使用什么语气和语言",
          summary: `${getToneLabel(selectedTone.value)} · ${getLanguageLabel(defaultLanguage.value)}`
        },
        {
          key: "answering-mode",
          title: "回复模式",
          summary: replyModeLabelMap[replyMode.value] ?? replyModeLabelMap.strict
        },
        {
          key: "answering-knowledge",
          title: "关联知识库",
          summary: `已关联 ${knowledgeDocCount.value} 篇知识库文档`
        }
      ]
    },
    {
      key: "fallback",
      title: "当 AI Agent 无法解决会话",
      icon: "service",
      cards: [
        {
          key: "answering-unsupported",
          title: "兜底回复",
          summary: hasUnsupportedReply ? " " : " ",
          badge: hasUnsupportedReply ? undefined : "需要补充",
          badgeTone: hasUnsupportedReply ? undefined : "warning"
        },
        {
          key: "fallback-transfer",
          title: "转人工",
          summary: transferEnabled.value
            ? (hasTransferReply ? "允许" : "不允许")
            : (hasOfflineReply ? "不允许" : "允许"),
          badge: (transferEnabled.value && !hasTransferReply) || !hasOfflineReply ? "需要补充" : undefined,
          badgeTone: (transferEnabled.value && !hasTransferReply) || !hasOfflineReply ? "warning" : undefined
        }
      ]
    },
    {
      key: "idle",
      title: "访客不活跃",
      icon: "calendar",
      cards: [
        {
          key: "idle-followup",
          title: "跟进",
          summary: followUpEnabled.value ? "5 分钟后发送跟进消息" : "不跟进"
        },
        {
          key: "idle-autoclose",
          title: "自动关闭会话",
          summary: idleSummaryText.value
        }
      ]
    }
  ];
});

const deployLifecycleSections = computed<LifecycleSection[]>(() =>
  lifecycleSections.value.map((section) => {
    if (section.key !== "answering") return section;
    return {
      ...section,
      cards: section.cards.filter((c) => c.key !== "identity-profile" && c.key !== "identity-style")
    };
  })
);

const getCurrentSettings = (): StoredAiAgentSettings => ({
  agentEnabled: agentEnabled.value,
  agentResponseMode: agentResponseMode.value,
  visitorAudience: visitorAudience.value,
  showMessageAgentLabel: showMessageAgentLabel.value,
  botAvatarUrl: botAvatarUrl.value,
  botName: botName.value,
  botIntro: botIntro.value,
  selectedTone: selectedTone.value,
  defaultLanguage: defaultLanguage.value,
  visitorInactiveMinutes: visitorInactiveMinutes.value,
  idleHours: idleHours.value,
  idleMinutes: idleMinutes.value,
  idleSeconds: idleSeconds.value,
  followUpEnabled: followUpEnabled.value,
  followUpMessage: followUpMessage.value,
  replyMode: replyMode.value,
  transferEnabled: transferEnabled.value,
  offlineMessage: offlineMessage.value,
  transferMessage: transferMessage.value,
  unsupportedQuestionMessage: unsupportedQuestionMessage.value
});

let lastSnapshot = "";

const autoSave = () => {
  const snapshot = JSON.stringify(getCurrentSettings());
  if (snapshot === lastSnapshot) return;
  lastSnapshot = snapshot;
  persistStoredAiAgentSettings(getCurrentSettings());
  emitToast("保存成功");
};

const loadAgentSettings = () => {
  const settings = loadStoredAiAgentSettings();

  if (typeof settings.agentEnabled === "boolean") agentEnabled.value = settings.agentEnabled;
  if (typeof settings.agentResponseMode === "string") agentResponseMode.value = settings.agentResponseMode;
  if (typeof settings.visitorAudience === "string") visitorAudience.value = resolveAudienceType(settings.visitorAudience);
  if (typeof settings.showMessageAgentLabel === "boolean") showMessageAgentLabel.value = settings.showMessageAgentLabel;
  if (typeof settings.botAvatarUrl === "string") botAvatarUrl.value = settings.botAvatarUrl;
  if (typeof settings.botName === "string") botName.value = settings.botName;
  if (typeof settings.botIntro === "string") botIntro.value = settings.botIntro;
  if (typeof settings.selectedTone === "string") selectedTone.value = settings.selectedTone;
  if (typeof settings.defaultLanguage === "string") defaultLanguage.value = settings.defaultLanguage;
  if (typeof settings.visitorInactiveMinutes === "number") {
    visitorInactiveMinutes.value = settings.visitorInactiveMinutes;
  } else if (typeof settings.visitorInactiveHours === "number") {
    visitorInactiveMinutes.value = settings.visitorInactiveHours * 60;
  }
  if (typeof settings.idleHours === "number") idleHours.value = settings.idleHours;
  if (typeof settings.idleMinutes === "number") idleMinutes.value = settings.idleMinutes;
  if (typeof settings.idleSeconds === "number") idleSeconds.value = settings.idleSeconds;
  if (typeof settings.followUpEnabled === "boolean") followUpEnabled.value = settings.followUpEnabled;
  if (typeof settings.followUpMessage === "string") followUpMessage.value = settings.followUpMessage;
  if (typeof settings.replyMode === "string") replyMode.value = settings.replyMode;
  if (typeof settings.transferEnabled === "boolean") transferEnabled.value = settings.transferEnabled;
  if (typeof settings.offlineMessage === "string") offlineMessage.value = settings.offlineMessage;
  if (typeof settings.transferMessage === "string") transferMessage.value = settings.transferMessage;
  if (typeof settings.unsupportedQuestionMessage === "string") {
    unsupportedQuestionMessage.value = settings.unsupportedQuestionMessage;
  }
};

const launchActionLabel = computed(() => (agentEnabled.value && agentFeatureAvailable.value ? "暂停 AI Agent" : "开启 AI Agent"));

const toggleLifecycleCard = (key: LifecycleCardKey) => {
  openLifecycleCard.value = openLifecycleCard.value === key ? null : key;
};

const toggleAgentLiveStatus = () => {
  if (!guardFeature(FEATURES.AI_AGENT)) return;
  agentEnabled.value = !agentEnabled.value;
  const settings = getCurrentSettings();
  persistStoredAiAgentSettings(settings);
  lastSnapshot = JSON.stringify(settings);
  emitToast(agentEnabled.value ? "AI Agent 已开启" : "AI Agent 已暂停");
};

const updateCopilotSetting = (key: string, next: boolean) => {
  const featureKey = copilotFeatureMap[key];
  if (featureKey && !guardFeature(featureKey)) return;
  copilotSettings.value = copilotSettings.value.map((item) => {
    if (item.key !== key) return item;
    return { ...item, enabled: next };
  });
  emit("toast", next ? "设置已开启" : "设置已关闭");
};

const triggerBotAvatarSelect = () => {
  avatarInputRef.value?.click();
};

const readFileAsDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(new Error("read-failed"));
    reader.readAsDataURL(file);
  });

const handleAvatarFileChange = async (event: Event) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  input.value = "";

  if (!file) {
    return;
  }

  if (!file.type.startsWith("image/")) {
    emitToast("请上传图片文件");
    return;
  }

  const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
  if (!allowedTypes.includes(file.type)) {
    emitToast("仅支持 JPG、JPEG、PNG 格式的图片");
    return;
  }

  if (file.size > AVATAR_MAX_SIZE) {
    emitToast("图片大小不能超过 10MB");
    return;
  }

  try {
    cropImageSource.value = await readFileAsDataUrl(file);
    cropModalOpen.value = true;
  } catch {
    emitToast("头像读取失败，请重试");
  }
};

const handleCroppedImage = (dataUrl: string) => {
  botAvatarUrl.value = dataUrl;
  cropModalOpen.value = false;
  cropImageSource.value = "";
  autoSave();
};

const handleDeployFieldUpdate = (field: string, value: unknown) => {
  if (!guardFeature(FEATURES.AI_AGENT)) return;
  const fieldMap: Record<string, { ref: { value: unknown } }> = {
    visitorAudience: { ref: visitorAudience },
    agentResponseMode: { ref: agentResponseMode },
    showMessageAgentLabel: { ref: showMessageAgentLabel },
    botName: { ref: botName },
    botIntro: { ref: botIntro },
    selectedTone: { ref: selectedTone },
    defaultLanguage: { ref: defaultLanguage },
    replyMode: { ref: replyMode },
    unsupportedQuestionMessage: { ref: unsupportedQuestionMessage },
    transferEnabled: { ref: transferEnabled },
    transferMessage: { ref: transferMessage },
    offlineMessage: { ref: offlineMessage },
    followUpEnabled: { ref: followUpEnabled },
    followUpMessage: { ref: followUpMessage },
    idleHours: { ref: idleHours },
    idleMinutes: { ref: idleMinutes },
    idleSeconds: { ref: idleSeconds }
  };
  const entry = fieldMap[field];
  if (entry) entry.ref.value = value;
};

const handleDeployTouchedUpdate = (field: string, value: boolean) => {
  const touchedMap: Record<string, { value: boolean }> = {
    botNameTouched: botNameTouched,
    unsupportedMessageTouched: unsupportedMessageTouched,
    transferMessageTouched: transferMessageTouched,
    offlineMessageTouched: offlineMessageTouched,
    followUpMessageTouched: followUpMessageTouched
  };
  const entry = touchedMap[field];
  if (entry) entry.value = value;
};

onMounted(() => {
  loadAgentSettings();
  lastSnapshot = JSON.stringify(getCurrentSettings());
});
</script>

<style scoped>
.ai-agent-locked-hint {
  color: #75869c;
  font-size: 14px;
  line-height: 1.6;
  margin: 0 24px;
  padding: 24px;
  text-align: center;
}

.ai-agent-locked-hint__text {
  margin: 0;
}

.ai-agent-page {
  background: #fff;
  border: 1px solid var(--agent-color-border-default);
  border-radius: var(--agent-radius-xl);
  gap: var(--agent-space-16);
}

.ai-agent-page > * {
  width: 100%;
}

.ai-agent-page__list {
  display: flex;
  flex-direction: column;
  gap: var(--agent-space-16);
}

.ai-agent-page__placeholder {
  align-items: flex-start;
  display: flex;
  flex-direction: column;
  gap: var(--agent-space-12);
  justify-content: center;
  min-height: 240px;
  padding: var(--agent-space-24);
}

.agent-config-header {
  align-items: center;
  flex-direction: row;
  justify-content: space-between;
}

.agent-config-header__content {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: var(--agent-space-8);
  min-width: 0;
}

.agent-config-header__title-row {
  align-items: center;
  display: flex;
  gap: 12px;
}

.agent-config-header__status {
  align-items: center;
  border-radius: 999px;
  display: inline-flex;
  font-size: 12px;
  font-weight: var(--agent-font-weight-medium);
  line-height: 1;
  padding: 4px 10px;
}

.agent-config-header__status--active {
  background: #e8f7ef;
  color: #137a49;
}

.agent-config-header__status--inactive {
  background: #feecec;
  color: #c53030;
}

.agent-config-header__actions {
  align-items: center;
  display: flex;
  flex-shrink: 0;
  gap: 12px;
}

.config-tabs {
  border-bottom: 1px solid var(--agent-color-border-default);
  display: flex;
  gap: 0;
}

.config-tabs__item {
  background: transparent;
  border: 0;
  border-bottom: 2px solid transparent;
  color: var(--agent-color-text-tertiary);
  cursor: pointer;
  font-size: 15px;
  font-weight: var(--agent-font-weight-medium);
  padding: 12px 20px;
  transition: color var(--agent-motion-fast), border-color var(--agent-motion-fast);
}

.config-tabs__item:hover {
  color: var(--agent-color-text-primary);
}

.config-tabs__item--active {
  border-bottom-color: var(--agent-color-brand-primary);
  color: var(--agent-color-brand-primary);
}

.settings-panel {
  display: flex;
  flex-direction: column;
  gap: var(--agent-space-20);
}

.settings-section {
  display: flex;
  flex-direction: column;
  gap: var(--agent-space-4);
  padding: var(--agent-space-24);
}

.settings-section__title {
  color: var(--agent-color-text-primary);
  font-size: 16px;
  font-weight: var(--agent-font-weight-semibold);
  line-height: 1.5;
  margin: 0;
}

.settings-section__desc {
  color: var(--agent-color-text-tertiary);
  font-size: var(--agent-font-size-sm);
  line-height: 1.5;
  margin: 0 0 var(--agent-space-16);
}

.settings-form {
  display: flex;
  flex-direction: column;
  gap: var(--agent-space-24);
}

.settings-form .form-row + .form-row {
  border-top: 1px solid var(--agent-color-border-default);
  padding-top: var(--agent-space-24);
}


.form-row {
  align-items: flex-start;
  display: flex;
  gap: var(--agent-space-24);
}

.form-row__label {
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  gap: 4px;
  padding-top: 8px;
  width: 220px;
}

.form-row__name {
  align-items: center;
  color: var(--agent-color-text-primary);
  display: flex;
  font-size: var(--agent-font-size-sm);
  font-weight: var(--agent-font-weight-medium);
  gap: 4px;
}

.form-row__help-wrap {
  display: inline-flex;
  position: relative;
}

.form-row__help-icon {
  align-items: center;
  background: transparent;
  border: 1px solid var(--agent-color-border-default);
  border-radius: 50%;
  color: var(--agent-color-text-tertiary);
  cursor: default;
  display: inline-flex;
  font-size: 11px;
  font-weight: var(--agent-font-weight-semibold);
  height: 16px;
  justify-content: center;
  line-height: 1;
  padding: 0;
  width: 16px;
}

.form-row__tooltip {
  background: var(--agent-color-text-primary);
  border-radius: var(--agent-radius-sm);
  color: #fff;
  font-size: 12px;
  font-weight: var(--agent-font-weight-regular, 400);
  left: 50%;
  line-height: 1.5;
  opacity: 0;
  padding: 6px 10px;
  pointer-events: none;
  position: absolute;
  top: calc(100% + 6px);
  transform: translateX(-50%);
  transition: opacity var(--agent-motion-fast);
  white-space: nowrap;
  z-index: var(--agent-z-dropdown);
}

.form-row__help-wrap:hover .form-row__tooltip {
  opacity: 1;
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
  min-height: 120px;
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

/* ─── 文档知识页面 ─── */
.doc-knowledge-header {
  align-items: center;
  flex-direction: row;
  justify-content: space-between;
}

.doc-knowledge-header .agent-btn--primary {
  align-items: center;
  display: inline-flex;
  gap: 4px;
  white-space: nowrap;
}

.doc-knowledge-header__add-icon {
  font-size: 18px;
  line-height: 1;
}

.doc-banner {
  background: linear-gradient(135deg, #eef4ff 0%, #f0f4ff 60%, #e8ecff 100%);
  border-radius: var(--agent-radius-lg);
  display: flex;
  overflow: hidden;
  padding: 24px 28px;
  position: relative;
}

.doc-banner__close {
  background: none;
  border: 0;
  color: var(--agent-color-text-tertiary);
  cursor: pointer;
  font-size: 20px;
  line-height: 1;
  padding: 0;
  position: absolute;
  right: 16px;
  top: 12px;
}

.doc-banner__close:hover {
  color: var(--agent-color-text-secondary);
}

.doc-banner__content {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
}

.doc-banner__title {
  color: var(--agent-color-text-primary);
  font-size: 16px;
  font-weight: var(--agent-font-weight-semibold);
  line-height: 1.5;
  margin: 0;
}

.doc-banner__desc {
  color: var(--agent-color-text-secondary);
  font-size: var(--agent-font-size-sm);
  line-height: 1.6;
  margin: 0;
}

.doc-banner__link {
  align-items: center;
  color: var(--agent-color-brand-primary);
  display: inline-flex;
  font-size: var(--agent-font-size-sm);
  gap: 4px;
  margin-top: 4px;
  text-decoration: none;
}

.doc-banner__link:hover {
  text-decoration: underline;
}

.doc-banner__link-icon {
  font-size: 16px;
}

.doc-banner__illustration {
  align-items: center;
  display: flex;
  flex-shrink: 0;
  justify-content: center;
  width: 180px;
}

.doc-search {
  display: flex;
}

.doc-search__input-wrap {
  position: relative;
  width: 280px;
}

.doc-search__input {
  padding-right: 36px;
  width: 100%;
}

.doc-search__icon {
  align-items: center;
  color: var(--agent-color-text-tertiary);
  display: flex;
  height: 100%;
  pointer-events: none;
  position: absolute;
  right: 12px;
  top: 0;
}

.doc-table-wrap {
  background: #fff;
  border: 1px solid var(--agent-color-border-default);
  border-radius: var(--agent-radius-md);
  overflow: hidden;
}

.doc-table {
  border-collapse: collapse;
  table-layout: fixed;
  width: 100%;
}

.doc-table__th {
  background: #fafbfc;
  border-bottom: 1px solid var(--agent-color-border-default);
  color: var(--agent-color-text-primary);
  font-size: var(--agent-font-size-sm);
  font-weight: var(--agent-font-weight-semibold);
  padding: 12px 16px;
  text-align: left;
}

.doc-table__th--name {
  width: 40%;
}

.doc-table__th--type {
  width: 12%;
}

.doc-table__th--time {
  width: 18%;
}

.doc-table__th--status {
  width: 18%;
}

.doc-table__th--action {
  text-align: center;
  width: 12%;
}

.doc-table__row:not(:last-child) .doc-table__td {
  border-bottom: 1px solid var(--agent-color-border-default);
}

.doc-table__td {
  color: var(--agent-color-text-primary);
  font-size: var(--agent-font-size-sm);
  padding: 14px 16px;
}

.doc-table__td--name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.doc-table__td--action {
  text-align: center;
}

.doc-table__empty {
  color: var(--agent-color-text-tertiary);
  font-size: var(--agent-font-size-sm);
  padding: 40px 16px;
  text-align: center;
}

.doc-status {
  align-items: center;
  display: inline-flex;
  gap: 6px;
}

.doc-status__dot {
  border-radius: 50%;
  display: inline-block;
  height: 8px;
  width: 8px;
}

.doc-status__dot--success {
  background: #52c41a;
}

.doc-status__dot--pending {
  background: #faad14;
}

.doc-status__dot--error {
  background: #ff4d4f;
}

.doc-action-btn {
  align-items: center;
  background: none;
  border: 0;
  border-radius: var(--agent-radius-sm);
  color: var(--agent-color-text-tertiary);
  cursor: pointer;
  display: inline-flex;
  justify-content: center;
  padding: 4px;
}

.doc-action-btn:hover {
  background: var(--agent-color-bg-muted);
  color: var(--agent-color-text-secondary);
}

.faq-table__th--question {
  width: 22%;
}

.faq-table__th--answer {
  width: 30%;
}

.faq-table__th--time {
  width: 20%;
}

.faq-table__th--status {
  width: 16%;
}

.doc-pagination {
  align-items: center;
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  padding: 8px 0;
}

.doc-pagination__total {
  color: var(--agent-color-text-secondary);
  font-size: var(--agent-font-size-sm);
}

.doc-pagination__pages {
  align-items: center;
  display: flex;
  gap: 8px;
}

.doc-pagination__btn {
  align-items: center;
  background: none;
  border: 1px solid var(--agent-color-border-default);
  border-radius: var(--agent-radius-sm);
  color: var(--agent-color-text-tertiary);
  cursor: pointer;
  display: inline-flex;
  height: 32px;
  justify-content: center;
  width: 32px;
}

.doc-pagination__btn:disabled {
  cursor: not-allowed;
  opacity: 0.4;
}

.doc-pagination__btn:not(:disabled):hover {
  border-color: var(--agent-color-brand-primary);
  color: var(--agent-color-brand-primary);
}

.doc-pagination__current {
  align-items: center;
  background: var(--agent-color-brand-primary);
  border-radius: var(--agent-radius-sm);
  color: #fff;
  display: inline-flex;
  font-size: var(--agent-font-size-sm);
  height: 32px;
  justify-content: center;
  min-width: 32px;
  padding: 0 8px;
}

.doc-pagination__size {
  align-items: center;
  border: 1px solid var(--agent-color-border-default);
  border-radius: var(--agent-radius-sm);
  color: var(--agent-color-text-secondary);
  display: inline-flex;
  font-size: var(--agent-font-size-sm);
  gap: 4px;
  height: 32px;
  padding: 0 10px;
}

@media (max-width: 1280px) {
  .ai-agent-page__placeholder {
    padding: var(--agent-space-16);
  }

  .form-row {
    flex-direction: column;
    gap: var(--agent-space-8);
  }

  .form-row__label {
    padding-top: 0;
    width: auto;
  }

  .bot-avatar-upload {
    align-items: flex-start;
    flex-direction: column;
  }

  .agent-config-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .agent-config-header__actions {
    width: 100%;
  }
}
</style>
