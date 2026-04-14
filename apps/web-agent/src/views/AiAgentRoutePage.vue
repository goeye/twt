<template>
  <section class="agent-content-page ai-agent-page" @click="closeKnowledgeActionMenus">
    <template v-if="resolvedActiveKey === 'copilot-settings'">
      <header class="agent-content-header">
        <h1 class="agent-content-title">Copilot</h1>
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
            <h1 class="agent-content-title">Autopilot</h1>
            <span class="agent-config-header__status" :class="agentEnabled && agentFeatureAvailable ? 'agent-config-header__status--active' : 'agent-config-header__status--inactive'">
              {{ agentEnabled && agentFeatureAvailable ? '已开启' : '已关闭' }}
            </span>
          </div>
          <p class="agent-content-subtitle">开启后，Autopilot 将根据知识库内容自动智能回复访客咨询，并在需要时转接人工客服，保障服务连续性</p>
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
                    <span class="form-row__tooltip">用于客服工作台会话列表中展示</span>
                  </span>
                </span>
              </div>
              <div class="form-row__control">
                <div class="bot-avatar-row">
                  <button
                    type="button"
                    class="bot-avatar-item"
                    :class="{ 'bot-avatar-item--image': Boolean(botAvatarUrl) }"
                    :disabled="!agentFeatureAvailable"
                    @click="triggerBotAvatarSelect"
                  >
                    <img v-if="botAvatarUrl" :src="botAvatarUrl" alt="Autopilot 头像" class="bot-avatar-item__image" />
                    <span v-else class="bot-avatar-item__fallback">{{ avatarFallbackText }}</span>
                    <span v-if="botAvatarUrl" class="bot-avatar-item__overlay">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M10 4v12M4 10h12" stroke="#fff" stroke-width="2" stroke-linecap="round"/>
                      </svg>
                    </span>
                  </button>
                  <input
                    ref="avatarInputRef"
                    type="file"
                    accept="image/png,image/jpeg,image/jpg"
                    class="bot-avatar-row__input"
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
                    <span class="form-row__tooltip">用于客服工作台会话列表中展示</span>
                  </span>
                </span>
              </div>
              <div class="form-row__control">
                <input
                  v-model="botName"
                  class="agent-input"
                  :class="{ 'agent-input--error': botNameTouched && !botName.trim() }"
                  maxlength="64"
                  placeholder="请输入昵称"
                  @input="guardSettingsInput($event)"
                  @blur="botNameTouched = true; autoSave()"
                />
                <p v-if="botNameTouched && !botName.trim()" class="form-row__error">请输入昵称</p>
              </div>
            </div>

            <div class="form-row">
              <div class="form-row__label">
                <span class="form-row__name">业务简介</span>
              </div>
              <div class="form-row__control">
                <textarea
                  v-model="botIntro"
                  class="agent-input form-row__textarea"
                  rows="3"
                  maxlength="2000"
                  placeholder="例如：我们是一家 SaaS 软件服务商，提供产品功能咨询、账户管理、订阅与计费、技术故障排查等支持。请用专业友好的语气解答客户问题，无法解决时引导联系人工客服。"
                  @input="guardSettingsInput($event)"
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
              </div>
              <div class="form-row__control">
                <select v-model="selectedTone" class="agent-input" :disabled="!agentFeatureAvailable" @change="autoSave">
                  <option
                    v-for="tone in toneOptions"
                    :key="tone.value"
                    :value="tone.value"
                  >{{ tone.label }}</option>
                </select>
              </div>
            </div>

            <div class="form-row">
              <div class="form-row__label">
                <span class="form-row__name">
                  默认语言
                  <span class="form-row__help-wrap">
                    <button type="button" class="form-row__help-icon" tabindex="-1">?</button>
                    <span class="form-row__tooltip">Autopilot 会检测访客语言并使用该语言进行回复，当无法判断访客语言时，将使用默认进行回复</span>
                  </span>
                </span>
              </div>
              <div class="form-row__control">
                <select v-model="defaultLanguage" class="agent-input" :disabled="!agentFeatureAvailable" @change="autoSave">
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
                <div class="doc-table__actions">
                  <button type="button" class="doc-action-btn" @click.stop="toggleDocActionMenu(item.id)">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                      <circle cx="8" cy="3" r="1.5"/>
                      <circle cx="8" cy="8" r="1.5"/>
                      <circle cx="8" cy="13" r="1.5"/>
                    </svg>
                  </button>
                  <div v-if="activeDocActionId === item.id" class="doc-table__dropdown" @click.stop>
                    <button
                      v-if="item.type === '文件'"
                      type="button"
                      class="doc-table__dropdown-item"
                      @click="handleDocAction('preview', item)"
                    >预览</button>
                    <button
                      v-else
                      type="button"
                      class="doc-table__dropdown-item"
                      @click="handleDocAction('edit', item)"
                    >编辑</button>
                    <button
                      type="button"
                      class="doc-table__dropdown-item doc-table__dropdown-item--danger"
                      @click="handleDocAction('delete', item)"
                    >删除</button>
                  </div>
                </div>
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
          <p class="doc-banner__desc">将分散的常见问题集中沉淀。AI Agent 将学习这些知识并自动生成回复建议，确保团队对外口径一致，提升服务效率。</p>
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
                <div class="doc-table__actions">
                  <button type="button" class="doc-action-btn" @click.stop="toggleFaqActionMenu(item.id)">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                      <circle cx="8" cy="3" r="1.5"/>
                      <circle cx="8" cy="8" r="1.5"/>
                      <circle cx="8" cy="13" r="1.5"/>
                    </svg>
                  </button>
                  <div v-if="activeFaqActionId === item.id" class="doc-table__dropdown" @click.stop>
                    <button
                      type="button"
                      class="doc-table__dropdown-item"
                      @click="handleFaqAction('edit', item)"
                    >编辑</button>
                    <button
                      type="button"
                      class="doc-table__dropdown-item doc-table__dropdown-item--danger"
                      @click="handleFaqAction('delete', item)"
                    >删除</button>
                  </div>
                </div>
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

    <teleport to="body">
      <div v-if="showFaqAddModal" class="faq-confirm-overlay" @click.self="closeFaqAddModal">
        <div class="faq-add-modal">
          <button type="button" class="faq-add-modal__close" @click="closeFaqAddModal">&times;</button>
          <h3 class="faq-add-modal__title">添加问题</h3>

          <div class="faq-add-modal__field">
            <label class="faq-add-modal__label"><span class="faq-add-modal__required">*</span> 提问</label>
            <input v-model="faqAddQuestion" class="agent-input faq-add-modal__input" placeholder="请输入" />
          </div>

          <div class="faq-add-modal__field">
            <label class="faq-add-modal__label">相似问题</label>
            <div class="faq-add-modal__similar-row">
              <input v-model="faqAddSimilarInput" class="agent-input faq-add-modal__input" placeholder="添加相似问题" @keydown.enter.prevent="addSimilarQuestion" />
              <button type="button" class="agent-btn faq-add-modal__similar-btn" @click="addSimilarQuestion">+ 添加</button>
            </div>
            <div v-if="faqAddSimilarList.length > 0" class="faq-add-modal__similar-list">
              <div v-for="(item, idx) in faqAddSimilarList" :key="idx" class="faq-add-modal__similar-item">
                <span class="faq-add-modal__similar-text">{{ item }}</span>
                <button type="button" class="faq-add-modal__similar-del" @click="faqAddSimilarList.splice(idx, 1)">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                </button>
              </div>
            </div>
          </div>

          <div class="faq-add-modal__field">
            <label class="faq-add-modal__label"><span class="faq-add-modal__required">*</span> 回答</label>
            <textarea v-model="faqAddAnswer" class="agent-input faq-add-modal__textarea" placeholder="请输入" rows="5" />
          </div>

          <button
            type="button"
            class="agent-btn agent-btn--primary faq-add-modal__save"
            :disabled="!faqAddQuestion.trim() || !faqAddAnswer.trim()"
            @click="saveFaqAdd"
          >保存</button>
        </div>
      </div>

      <div v-if="faqDeleteConfirm" class="faq-confirm-overlay" @click.self="faqDeleteConfirm = null">
        <div class="faq-confirm-modal">
          <h3 class="faq-confirm-modal__title">删除常见问题</h3>
          <p class="faq-confirm-modal__body">
            该常见问题已关联 {{ faqDeleteConfirm.linkedNames.length }} 个快捷入口，删除后将同步删除所有关联内容，是否确认删除？
          </p>
          <div class="faq-confirm-modal__footer">
            <button class="agent-btn" @click="faqDeleteConfirm = null">取消</button>
            <button class="agent-btn agent-btn--danger" @click="doDeleteFaq(faqDeleteConfirm!.item.id)">确认删除</button>
          </div>
        </div>
      </div>
    </teleport>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { CopilotPromoBanner, CopilotSettingItem } from "@twt/ui-agent";
import { getWidgetQuickAccessItems, useTenant } from "@twt/branding";
import { FEATURES } from "../lib/plan";
import { usePlan } from "../composables/usePlan";
import {
  type StoredAiAgentSettings,
  loadStoredAiAgentSettings,
  persistStoredAiAgentSettings
} from "../lib/aiAgentSettings";
import { type FaqItem, loadFaqList, saveFaqList, getQuickAccessByFaqId, saveQuickAccessEntries } from "../lib/faqData";
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
  type: "文件" | "文章";
  updatedAt: string;
  statusType: "success" | "pending" | "error";
  statusLabel: string;
}

const docKnowledgeList = ref<DocKnowledgeItem[]>([
  { id: 1, name: "word修订记录.docx", type: "文件", updatedAt: "2026-01-28 11:48", statusType: "success", statusLabel: "已完成" },
  { id: 2, name: "SaaS 行业自动回复 FAQ 模板.docx", type: "文件", updatedAt: "2026-01-12 19:19", statusType: "success", statusLabel: "已完成" },
  { id: 3, name: "新手引导文章：如何配置客服入口", type: "文章", updatedAt: "2025-12-31 16:26", statusType: "success", statusLabel: "已完成" }
]);

const filteredDocList = computed(() => {
  const query = docSearchQuery.value.trim().toLowerCase();
  if (!query) return docKnowledgeList.value;
  return docKnowledgeList.value.filter((item) => item.name.toLowerCase().includes(query));
});

const showFaqBanner = ref(true);
const faqSearchQuery = ref("");
const showFaqAddModal = ref(false);
const faqAddQuestion = ref("");
const faqAddAnswer = ref("");
const faqAddSimilarInput = ref("");
const faqAddSimilarList = ref<string[]>([]);

const faqList = ref<FaqItem[]>(loadFaqList());

const faqDeleteConfirm = ref<{ item: FaqItem; linkedNames: string[] } | null>(null);
const tenant = useTenant();

const getLinkedQuickAccessNames = (faqId: number): string[] => {
  const localEntries = getQuickAccessByFaqId(faqId);
  const tenantEntries = getWidgetQuickAccessItems(tenant)
    .filter((item) => item.actionType === "message" && item.faqId === String(faqId))
    .map((item) => ({ id: item.id, label: item.label, faqId: String(faqId) }));
  const seen = new Set<string>();

  return [...localEntries, ...tenantEntries]
    .filter((entry) => {
      const key = `${entry.id}:${entry.faqId}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .map((entry) => entry.label);
};

const filteredFaqList = computed(() => {
  const query = faqSearchQuery.value.trim().toLowerCase();
  if (!query) return faqList.value;
  return faqList.value.filter((item) => item.question.toLowerCase().includes(query) || item.answer.toLowerCase().includes(query));
});

const { canUse, guardFeature } = usePlan();
const activeDocActionId = ref<number | null>(null);
const activeFaqActionId = ref<number | null>(null);

const agentFeatureAvailable = computed(() => canUse(FEATURES.AI_AGENT));
const configTab = ref<ConfigTab>("deploy");
const openLifecycleCard = ref<LifecycleCardKey | null>(null);
const agentEnabled = ref(canUse(FEATURES.AI_AGENT));

/** 知识库门控 */
const guardedDocAdd = () => {
  if (!guardFeature(FEATURES.DOC_KNOWLEDGE)) return;
  emitToast('功能开发中');
};
const guardedFaqAdd = () => {
  if (!guardFeature(FEATURES.FAQ_KNOWLEDGE)) return;
  faqAddQuestion.value = "";
  faqAddAnswer.value = "";
  faqAddSimilarInput.value = "";
  faqAddSimilarList.value = [];
  showFaqAddModal.value = true;
};

const closeFaqAddModal = () => {
  showFaqAddModal.value = false;
};

const addSimilarQuestion = () => {
  const val = faqAddSimilarInput.value.trim();
  if (!val) return;
  faqAddSimilarList.value.push(val);
  faqAddSimilarInput.value = "";
};

const saveFaqAdd = () => {
  if (!faqAddQuestion.value.trim() || !faqAddAnswer.value.trim()) return;
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  const updatedAt = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`;
  const newItem: FaqItem = {
    id: Date.now(),
    question: faqAddQuestion.value.trim(),
    answer: faqAddAnswer.value.trim(),
    updatedAt,
    statusType: "pending",
    statusLabel: "训练中"
  };
  faqList.value = [newItem, ...faqList.value];
  saveFaqList(faqList.value);
  showFaqAddModal.value = false;
  emitToast("添加成功");
};

const closeKnowledgeActionMenus = () => {
  activeDocActionId.value = null;
  activeFaqActionId.value = null;
};

const toggleDocActionMenu = (id: number) => {
  if (!guardFeature(FEATURES.DOC_KNOWLEDGE)) return;
  activeFaqActionId.value = null;
  activeDocActionId.value = activeDocActionId.value === id ? null : id;
};

const toggleFaqActionMenu = (id: number) => {
  if (!guardFeature(FEATURES.FAQ_KNOWLEDGE)) return;
  activeDocActionId.value = null;
  activeFaqActionId.value = activeFaqActionId.value === id ? null : id;
};

const handleDocAction = (action: "preview" | "edit" | "delete", item: DocKnowledgeItem) => {
  closeKnowledgeActionMenus();
  if (!guardFeature(FEATURES.DOC_KNOWLEDGE)) return;
  if (action === "delete") {
    docKnowledgeList.value = docKnowledgeList.value.filter((doc) => doc.id !== item.id);
    emitToast("删除成功");
    return;
  }
  emitToast(action === "preview" ? "预览功能开发中" : "编辑功能开发中");
};

const handleFaqAction = (action: "edit" | "delete", item: FaqItem) => {
  closeKnowledgeActionMenus();
  if (!guardFeature(FEATURES.FAQ_KNOWLEDGE)) return;
  if (action === "delete") {
    const linkedNames = getLinkedQuickAccessNames(item.id);
    if (linkedNames.length > 0) {
      faqDeleteConfirm.value = { item, linkedNames };
      return;
    }
    doDeleteFaq(item.id);
    return;
  }
  emitToast("编辑功能开发中");
};

const doDeleteFaq = (id: number) => {
  faqList.value = faqList.value.filter((faq) => faq.id !== id);
  saveFaqList(faqList.value);
  const allEntries: { id: string; label: string; faqId: string }[] = JSON.parse(localStorage.getItem("twt_quick_access_items") || "[]");
  saveQuickAccessEntries(allEntries.filter(e => e.faqId !== String(id)));
  faqDeleteConfirm.value = null;
  emitToast("删除成功");
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
const botName = ref("Autopilot");
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
  { value: "en", label: "English" },
  { value: "es", label: "Español" },
  { value: "fr", label: "Français" },
  { value: "de", label: "Deutsch" },
  { value: "pt", label: "Português" },
  { value: "ru", label: "Русский" },
  { value: "zh-CN", label: "简体中文" },
  { value: "zh-TW", label: "繁體中文" },
  { value: "ja", label: "日本語" },
  { value: "ko", label: "한국어" },
  { value: "vi", label: "Tiếng Việt" },
  { value: "th", label: "ภาษาไทย" },
  { value: "id", label: "Bahasa Indonesia" },
  { value: "ms", label: "Bahasa Melayu" }
];

const audienceLabelMap: Record<AudienceType, string> = {
  all: "全部访客",
  visitor: "仅访客",
  customer: "仅客户"
};

const responseModeLabelMap: Record<string, string> = {
  always: "始终回复",
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
  return "Copilot";
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
      title: "当访客发送消息时",
      icon: "customer",
      cards: [
        {
          key: "entry-routing",
          title: "Autopilot 将回复",
          summary: `${audienceLabelMap[visitorAudience.value]} · ${responseModeLabelMap[agentResponseMode.value] ?? responseModeLabelMap.always}`
        },
        {
          key: "entry-visibility",
          title: "Autopilot 标签",
          summary: showMessageAgentLabel.value ? "显示" : "不显示"
        }
      ]
    },
    {
      key: "answering",
      title: "当 Autopilot 回复访客",
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
          summary: replyModeLabelMap[replyMode.value] ?? replyModeLabelMap.strict,
          description: "Autopilot 会结合知识库、业务简介、语气和语言设置来组织回复"
        },
        {
          key: "answering-knowledge",
          title: "关联知识库",
          summary: `已关联 ${knowledgeDocCount.value} 篇知识库文档`,
          description: "Autopilot 需要充足的知识库内容来准确回答访客问题。请确保已添加并审核相关内容"
        }
      ]
    },
    {
      key: "fallback",
      title: "当 Autopilot 无法解答时",
      icon: "service",
      cards: [
        {
          key: "answering-unsupported",
          title: "兜底回复",
          summary: "",
          description: "当访客发送图片、文件或涉及敏感信息时，Autopilot 如何回复",
          badge: hasUnsupportedReply ? undefined : "需要补充",
          badgeTone: hasUnsupportedReply ? undefined : "warning"
        },
        {
          key: "fallback-transfer",
          title: "转接人工",
          summary: transferEnabled.value
            ? (hasTransferReply ? "已开启" : "未开启")
            : (hasOfflineReply ? "未开启" : "已开启"),
          description: "当访客要求转人工时，是否允许转接到人工客服",
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
          title: "主动跟进",
          summary: followUpEnabled.value ? "5 分钟后发送跟进消息" : "未开启",
          description: "当访客 5 分钟未回复时，Autopilot 自动发送一条跟进消息"
        },
        {
          key: "idle-autoclose",
          title: "关闭会话",
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

const launchActionLabel = computed(() => (agentEnabled.value && agentFeatureAvailable.value ? "关闭 Autopilot" : "开启 Autopilot"));

const toggleLifecycleCard = (key: LifecycleCardKey) => {
  openLifecycleCard.value = openLifecycleCard.value === key ? null : key;
};

const toggleAgentLiveStatus = () => {
  if (!guardFeature(FEATURES.AI_AGENT)) return;
  agentEnabled.value = !agentEnabled.value;
  const settings = getCurrentSettings();
  persistStoredAiAgentSettings(settings);
  lastSnapshot = JSON.stringify(settings);
  emitToast(agentEnabled.value ? "Autopilot 已开启" : "Autopilot 已关闭");
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
  if (!guardFeature(FEATURES.AI_AGENT)) return;
  avatarInputRef.value?.click();
};

const guardSettingsInput = (event: Event) => {
  if (!guardFeature(FEATURES.AI_AGENT)) {
    const settings = loadStoredAiAgentSettings();
    botName.value = settings.botName ?? "Autopilot";
    botIntro.value = settings.botIntro ?? "";
    (event.target as HTMLElement)?.blur();
  }
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
  border: 1px solid var(--agent-color-border-default);
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  gap: var(--agent-space-4);
  overflow: visible;
  padding: 20px var(--agent-space-24);
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
  padding-top: var(--agent-space-16);
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
  width: 280px;
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
  z-index: 9999;
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

.form-row__hint {
  color: var(--agent-color-text-tertiary);
  font-size: var(--agent-font-size-xs);
  line-height: 1.5;
  margin-top: 8px;
}

.agent-input--error {
  border-color: #e53e3e;
}

.bot-avatar-row {
  align-items: center;
  display: flex;
  gap: var(--agent-space-12);
  position: relative;
}

.bot-avatar-row__input {
  display: none;
}

.bot-avatar-item {
  align-items: center;
  border: 0;
  border-radius: 12px;
  cursor: pointer;
  display: inline-flex;
  flex-shrink: 0;
  height: 48px;
  justify-content: center;
  overflow: hidden;
  position: relative;
  width: 48px;
}

.bot-avatar-item:not(.bot-avatar-item--add):not(.bot-avatar-item--reupload) {
  background: linear-gradient(135deg, #00b578, #00c2b8);
}

.bot-avatar-item--image {
  background: #eef2f8;
}

.bot-avatar-item__image {
  height: 100%;
  object-fit: cover;
  width: 100%;
}

.bot-avatar-item__fallback {
  color: #fff;
  font-size: 18px;
  font-weight: 600;
}

.bot-avatar-item--reupload {
  background: transparent;
  cursor: pointer;
  padding: 0;
}

.bot-avatar-item--reupload .bot-avatar-item__image {
  display: block;
}

.bot-avatar-item__overlay {
  align-items: center;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 12px;
  display: flex;
  inset: 0;
  justify-content: center;
  position: absolute;
}

.bot-avatar-item--add {
  background: #f4f5fb;
  border: 1px dashed var(--agent-color-border-default);
  cursor: pointer;
  padding: 0;
}

.bot-avatar-item--add:hover {
  border-color: var(--agent-color-brand-primary);
}

.bot-avatar-item--add:disabled,
.bot-avatar-item--reupload:disabled {
  cursor: not-allowed;
  opacity: 0.5;
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
  overflow: visible;
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

.doc-table__actions {
  display: inline-flex;
  position: relative;
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

.doc-table__dropdown {
  background: #fff;
  border: 1px solid var(--agent-color-border-default);
  border-radius: 12px;
  box-shadow: 0 12px 32px rgba(15, 23, 42, 0.12);
  display: flex;
  flex-direction: column;
  min-width: 112px;
  padding: 6px;
  position: absolute;
  right: 0;
  top: calc(100% + 6px);
  z-index: var(--agent-z-dropdown);
}

.doc-table__dropdown-item {
  background: transparent;
  border: 0;
  border-radius: 8px;
  color: var(--agent-color-text-primary);
  cursor: pointer;
  font-size: var(--agent-font-size-sm);
  padding: 8px 10px;
  text-align: left;
  white-space: nowrap;
}

.doc-table__dropdown-item:hover {
  background: var(--agent-color-bg-muted);
}

.doc-table__dropdown-item--danger {
  color: #e53e3e;
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

  .agent-config-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .agent-config-header__actions {
    width: 100%;
  }
}

.faq-add-modal {
  background: #fff;
  border-radius: var(--agent-radius-lg);
  display: flex;
  flex-direction: column;
  gap: var(--agent-space-20);
  max-width: 460px;
  padding: var(--agent-space-24);
  position: relative;
  width: 90%;
}

.faq-add-modal__close {
  background: none;
  border: 0;
  color: var(--agent-color-text-tertiary);
  cursor: pointer;
  font-size: 20px;
  line-height: 1;
  padding: 0;
  position: absolute;
  right: 16px;
  top: 16px;
}

.faq-add-modal__close:hover {
  color: var(--agent-color-text-primary);
}

.faq-add-modal__title {
  font-size: 18px;
  font-weight: var(--agent-font-weight-semibold);
  margin: 0;
}

.faq-add-modal__field {
  display: flex;
  flex-direction: column;
  gap: var(--agent-space-8);
}

.faq-add-modal__label {
  align-items: center;
  color: var(--agent-color-text-primary);
  display: flex;
  font-size: var(--agent-font-size-sm);
  font-weight: var(--agent-font-weight-medium);
  gap: 4px;
}

.faq-add-modal__required {
  color: #e53e3e;
}

.faq-add-modal__input {
  width: 100%;
}

.faq-add-modal__textarea {
  min-height: 100px;
  resize: vertical;
  width: 100%;
}

.faq-add-modal__similar-row {
  display: flex;
  gap: var(--agent-space-8);
}

.faq-add-modal__similar-row .agent-input {
  flex: 1;
}

.faq-add-modal__similar-btn {
  flex-shrink: 0;
  white-space: nowrap;
}

.faq-add-modal__similar-list {
  background: var(--agent-color-bg-muted);
  border-radius: var(--agent-radius-md);
  display: flex;
  flex-direction: column;
  gap: var(--agent-space-8);
  min-height: 60px;
  padding: var(--agent-space-12);
}

.faq-add-modal__similar-item {
  align-items: center;
  background: #fff;
  border-radius: var(--agent-radius-md);
  display: flex;
  gap: var(--agent-space-8);
  padding: 8px 12px;
}

.faq-add-modal__similar-text {
  flex: 1;
  font-size: var(--agent-font-size-sm);
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.faq-add-modal__similar-del {
  background: none;
  border: 0;
  color: var(--agent-color-text-tertiary);
  cursor: pointer;
  display: inline-flex;
  flex-shrink: 0;
  padding: 2px;
}

.faq-add-modal__similar-del:hover {
  color: var(--agent-color-text-primary);
}

.faq-add-modal__save {
  width: 100%;
}

.faq-add-modal__save:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.faq-confirm-overlay {
  align-items: center;
  background: rgba(0, 0, 0, 0.4);
  bottom: 0;
  display: flex;
  justify-content: center;
  left: 0;
  position: fixed;
  right: 0;
  top: 0;
  z-index: var(--agent-z-modal, 200);
}

.faq-confirm-modal {
  background: #fff;
  border-radius: var(--agent-radius-lg);
  max-width: 400px;
  padding: var(--agent-space-24);
  width: 90%;
}

.faq-confirm-modal__title {
  font-size: var(--agent-font-size-md);
  font-weight: var(--agent-font-weight-semibold);
  margin: 0 0 var(--agent-space-12);
}

.faq-confirm-modal__body {
  color: var(--agent-color-text-secondary);
  font-size: var(--agent-font-size-sm);
  margin: 0 0 var(--agent-space-8);
}

.faq-confirm-modal__list {
  color: var(--agent-color-text-primary);
  font-size: var(--agent-font-size-sm);
  margin: 0 0 var(--agent-space-20);
  padding-left: var(--agent-space-16);
}

.faq-confirm-modal__footer {
  display: flex;
  gap: var(--agent-space-8);
  justify-content: flex-end;
}
</style>
