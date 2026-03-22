<template>
  <section class="widget-customize">
    <!-- Left: Settings Panel -->
    <div class="wc-settings agent-scroll">
      <header class="wc-settings__header">
        <div class="wc-settings__header-top">
          <div>
            <h1 class="wc-settings__title">自定义</h1>
            <p class="wc-settings__subtitle">设置你的聊天小部件功能和显示</p>
          </div>
          <div class="wc-global-lang">
            <select v-model="globalLang" class="wc-global-lang__select">
              <option v-for="lang in contentLangTabs" :key="lang.key" :value="lang.key">{{ lang.label }}</option>
            </select>
          </div>
        </div>
      </header>

      <!-- Tab Bar -->
      <div class="wc-tabs">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          type="button"
          class="wc-tabs__item"
          :class="{ 'wc-tabs__item--active': activeTab === tab.key }"
          @click="switchTab(tab.key)"
        >
          {{ tab.label }}
        </button>
      </div>

      <!-- Appearance Tab -->
      <div v-if="activeTab === 'appearance'" class="wc-tab-content">
        <!-- Accordion: Brand Identity -->
        <article class="wc-accordion" :class="{ 'wc-accordion--open': openSection === 'brand' }">
          <button type="button" class="wc-accordion__trigger" @click="toggleSection('brand')">
            <div class="wc-accordion__trigger-text">
              <h3 class="wc-card__title">品牌标识</h3>
              <p class="wc-card__desc">自定义小部件显示的品牌信息</p>
            </div>
            <span class="wc-accordion__chevron" />
          </button>
          <div v-if="openSection === 'brand'" class="wc-accordion__body">
            <div class="wc-brand-row">
              <div class="wc-logo-wrap" @click="triggerLogoUpload">
                <img :src="settings.brandLogoUrl" class="wc-logo-wrap__img" alt="品牌Logo" />
                <div class="wc-logo-wrap__overlay">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" />
                  </svg>
                  <span>替换</span>
                </div>
                <input ref="logoFileInput" type="file" accept="image/png,image/jpeg,image/jpg" class="wc-logo-wrap__file" @change="handleLogoFileChange" />
              </div>
              <div class="wc-brand-input-group">
                <label class="wc-label">品牌名称</label>
                <input v-model="settings.brandName" class="agent-input wc-input" placeholder="输入品牌名称..." @blur="autoSave" />
              </div>
            </div>
          </div>
        </article>

        <!-- Accordion: Widget Position -->
        <article class="wc-accordion" :class="{ 'wc-accordion--open': openSection === 'position' }">
          <button type="button" class="wc-accordion__trigger" @click="toggleSection('position')">
            <div class="wc-accordion__trigger-text">
              <h3 class="wc-card__title">小部件位置</h3>
              <p class="wc-card__desc">设置聊天小部件在网页上的位置</p>
            </div>
            <span class="wc-accordion__chevron" />
          </button>
          <div v-if="openSection === 'position'" class="wc-accordion__body">
            <div class="wc-field-row">
              <label class="wc-label">小部件位置</label>
              <select v-model="settings.widgetPosition" class="agent-input wc-input wc-select" @change="autoSave">
                <option value="bottom-right">右下角</option>
                <option value="bottom-left">左下角</option>
              </select>
            </div>
            <div class="wc-offset-row">
              <div class="wc-offset-field">
                <label class="wc-label">距离底部 (px)</label>
                <input v-model.number="settings.positionOffsetY" type="number" min="20" max="200" class="agent-input wc-input" @blur="autoSave" />
              </div>
              <div class="wc-offset-field">
                <label class="wc-label">{{ settings.widgetPosition === 'bottom-left' ? '距离左边' : '距离右边' }} (px)</label>
                <input v-model.number="settings.positionOffsetX" type="number" min="20" max="200" class="agent-input wc-input" @blur="autoSave" />
              </div>
            </div>
          </div>
        </article>

        <!-- Accordion: Quick Access -->
        <article class="wc-accordion" :class="{ 'wc-accordion--open': openSection === 'quickAccess' }">
          <button type="button" class="wc-accordion__trigger" @click="toggleSection('quickAccess')">
            <div class="wc-accordion__trigger-text">
              <h3 class="wc-card__title">快捷入口</h3>
              <p class="wc-card__desc">访客在聊天和会话过程中，可看到你配置的快捷入口，并支持点击跳转</p>
            </div>
            <span class="wc-accordion__chevron" />
          </button>
          <div v-if="openSection === 'quickAccess'" class="wc-accordion__body">
              <div class="wc-quick-tags">
                <button type="button" class="wc-quick-tag wc-quick-tag--add" @click="addQuickAccess">
                  <span class="wc-quick-tag__add-icon" aria-hidden="true">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round" /></svg>
                  </span>
                  <span class="wc-quick-tag__label">添加</span>
                </button>
                <div v-for="item in settings.quickAccessItems" :key="item.id" class="wc-quick-tag">
                  <span class="wc-quick-tag__icon" aria-hidden="true">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M4 7h16v10H4z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" /><path d="M4 8l8 6 8-6" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" /></svg>
                  </span>
                  <span class="wc-quick-tag__label">{{ item.label }}</span>
                  <span class="wc-quick-tag__edit" aria-hidden="true">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M4 20h4l10-10-4-4L4 16v4z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" /><path d="M13 7l4 4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" /></svg>
                  </span>
                  <button type="button" class="wc-quick-tag__remove" @click="removeQuickAccess(item.id)">
                    <svg width="8" height="8" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" /></svg>
                  </button>
                </div>
              </div>
          </div>
        </article>

        <article class="wc-accordion" :class="{ 'wc-accordion--open': openSection === 'display' }">
          <button type="button" class="wc-accordion__trigger" @click="toggleSection('display')">
            <div class="wc-accordion__trigger-text">
              <h3 class="wc-card__title">官方标识</h3>
              <p class="wc-card__desc">控制聊天小部件底部 Powered by Chat 标识的展示</p>
            </div>
            <span class="wc-accordion__chevron" />
          </button>
          <div v-if="openSection === 'display'" class="wc-accordion__body">
            <div class="wc-switch-row">
              <div class="wc-switch-row__text">
                <span class="wc-switch-label">隐藏官方标识</span>
              </div>
              <AgentSwitch :model-value="settings.hideBrandLogo" @update:model-value="toggleHideBrandLogo" />
            </div>
          </div>
        </article>

      </div>

      <!-- Content Tab -->
      <div v-else-if="activeTab === 'content'" class="wc-tab-content">
        <article v-for="block in autoReplyBlocks" :key="block.key" class="wc-accordion" :class="{ 'wc-accordion--open': openSection === block.key }">
          <button type="button" class="wc-accordion__trigger" @click="toggleSection(block.key)">
            <div class="wc-accordion__trigger-text">
              <h3 class="wc-card__title">{{ block.title }}</h3>
              <p class="wc-card__desc">{{ block.desc }}</p>
            </div>
            <AgentSwitch v-model="autoReplyToggles[block.key]" @click.stop @update:model-value="autoSave" />
            <span class="wc-accordion__chevron" />
          </button>
          <div v-if="openSection === block.key && autoReplyToggles[block.key]" class="wc-accordion__body">
              <div class="wc-rich-editor">
                <textarea
                  v-model="autoReplyTexts[block.key][globalLang]"
                  class="wc-rich-editor__textarea"
                  rows="4"
                  @blur="autoSave"
                />
                <div class="wc-rich-editor__images-area">
                  <div v-for="(img, idx) in autoReplyImages[block.key][globalLang]" :key="idx" class="wc-reply-images__item">
                    <img :src="img" class="wc-reply-images__thumb" alt="" />
                    <button type="button" class="wc-reply-images__remove" @click="removeReplyImage(block.key, globalLang, idx)">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" /></svg>
                    </button>
                  </div>
                  <button v-if="autoReplyImages[block.key][globalLang].length < 10" type="button" class="wc-reply-images__add" @click="triggerReplyImageUpload(block.key)">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round" /></svg>
                  </button>
                </div>
              </div>
              <p class="wc-upload-hint">支持png、jpg、jpeg格式图片，单张图片小于2MB，最多上传10张</p>
          </div>
        </article>

        <!-- Visitor Feedback -->
        <article class="wc-accordion" :class="{ 'wc-accordion--open': openSection === 'visitorFeedback' }">
          <button type="button" class="wc-accordion__trigger" @click="toggleSection('visitorFeedback')">
            <div class="wc-accordion__trigger-text">
              <h3 class="wc-card__title">访客评价</h3>
              <p class="wc-card__desc">主动或自动关闭会话后，系统自动邀请访客评价</p>
            </div>
            <AgentSwitch v-model="feedbackEnabled" @click.stop @update:model-value="autoSave" />
            <span class="wc-accordion__chevron" />
          </button>
          <div v-if="openSection === 'visitorFeedback' && feedbackEnabled" class="wc-accordion__body">
              <div class="wc-rich-editor">
                <textarea
                  v-model="feedbackTitles[globalLang]"
                  class="wc-rich-editor__textarea"
                  rows="3"
                  placeholder="请输入评价标题..."
                  @blur="autoSave"
                />
              </div>
          </div>
        </article>

      </div>

      <!-- Form Tab -->
      <div v-else-if="activeTab === 'form'" class="wc-tab-content">
        <article class="wc-accordion" :class="{ 'wc-accordion--open': openSection === 'sessionForm' }">
          <button type="button" class="wc-accordion__trigger" @click="toggleSection('sessionForm')">
            <div class="wc-accordion__trigger-text">
              <h3 class="wc-card__title">会话前表单</h3>
              <p class="wc-card__desc">在访客开始会话之前收集必要的信息，帮助客服更好地提供服务</p>
            </div>
            <AgentSwitch v-model="settings.enableSessionForm" @click.stop @update:model-value="autoSave" />
            <span class="wc-accordion__chevron" />
          </button>
          <div v-if="openSection === 'sessionForm' && settings.enableSessionForm" class="wc-accordion__body">
            <div class="wc-form-title-row">
              <label class="wc-label">表单标题</label>
              <input v-model="settings.formTitle[globalLang]" class="agent-input wc-input" placeholder="Welcome! Please fill in the information..." @blur="autoSave" />
            </div>
            <div class="wc-form-fields-section">
              <label class="wc-label">表单字段</label>
              <div class="wc-form-fields">
                <div v-for="(field, idx) in settings.formFields" :key="field.id" class="wc-form-field-row">
                  <span class="wc-drag-handle">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                      <circle cx="8" cy="5" r="1.5" fill="currentColor" /><circle cx="16" cy="5" r="1.5" fill="currentColor" />
                      <circle cx="8" cy="12" r="1.5" fill="currentColor" /><circle cx="16" cy="12" r="1.5" fill="currentColor" />
                      <circle cx="8" cy="19" r="1.5" fill="currentColor" /><circle cx="16" cy="19" r="1.5" fill="currentColor" />
                    </svg>
                  </span>
                  <span class="wc-form-field-label">{{ field.label[globalLang] }}</span>
                  <input v-model="field.placeholder[globalLang]" class="agent-input wc-input wc-form-field-placeholder" placeholder="占位符文字..." @blur="autoSave" />
                  <label class="wc-checkbox-label">
                    <input type="checkbox" v-model="field.required" class="wc-checkbox" @change="autoSave" />
                    必填
                  </label>
                  <div class="wc-form-field-delete-wrap">
                    <button type="button" class="wc-form-field-delete" @click="toggleDeleteConfirm(idx)">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                      </svg>
                    </button>
                    <div v-if="deleteConfirmIdx === idx" class="wc-popconfirm">
                      <p class="wc-popconfirm__text">确定删除该字段吗？</p>
                      <div class="wc-popconfirm__actions">
                        <button type="button" class="wc-popconfirm__btn wc-popconfirm__btn--cancel" @click="deleteConfirmIdx = null">取消</button>
                        <button type="button" class="wc-popconfirm__btn wc-popconfirm__btn--confirm" @click="confirmRemoveFormField(idx)">确定</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <button type="button" class="wc-add-field-btn" @click="addFormField">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round" /></svg>
                添加字段
              </button>
            </div>
          </div>
        </article>

      </div>

      <!-- General Tab -->
      <div v-else-if="activeTab === 'general'" class="wc-tab-content">
        <article class="wc-accordion" :class="{ 'wc-accordion--open': openSection === 'sessionFeatures' }">
          <button type="button" class="wc-accordion__trigger" @click="toggleSection('sessionFeatures')">
            <div class="wc-accordion__trigger-text">
              <h3 class="wc-card__title">会话功能</h3>
            </div>
            <span class="wc-accordion__chevron" />
          </button>
          <div v-if="openSection === 'sessionFeatures'" class="wc-accordion__body">
            <div class="wc-session-feature-card">
              <div class="wc-session-feature-card__header">
                <div class="wc-session-feature-card__text">
                  <span class="wc-session-feature-card__title">发起会话</span>
                  <span class="wc-session-feature-card__desc">开启后，聊天小部件中显示新的会话按钮，访客可主动发起咨询；关闭后入口隐藏</span>
                </div>
                <AgentSwitch v-model="settings.enableStartSession" @update:model-value="autoSave" />
              </div>
              <div v-if="settings.enableStartSession" class="wc-session-feature-card__panel">
                <label class="wc-session-feature-limit">
                  <input v-model="settings.limitStartSessionCount" type="checkbox" class="wc-session-feature-limit__checkbox" @change="autoSave" />
                  <div class="wc-session-feature-limit__text">
                    <span class="wc-session-feature-limit__title">限制访客发起会话数上限</span>
                    <span class="wc-session-feature-limit__desc">设置访客可同时发起的未结束会话的最大数量</span>
                  </div>
                </label>
                <div v-if="settings.limitStartSessionCount" class="wc-session-feature-limit__controls">
                  <label class="wc-session-feature-limit__field">
                    <span class="wc-session-feature-limit__field-label">最大会话数</span>
                    <div class="wc-session-feature-limit__stepper">
                      <div class="wc-session-feature-limit__input-wrap">
                        <input
                          v-model.number="settings.maxStartSessionCount"
                          type="number"
                          min="1"
                          max="99"
                          class="wc-session-feature-limit__input"
                          @blur="normalizeStartSessionCount(); autoSave()"
                        />
                      </div>
                      <span class="wc-session-feature-limit__unit">个</span>
                    </div>
                  </label>
                </div>
                <div v-if="settings.limitStartSessionCount" class="wc-session-feature-limit__notice">
                  <span class="wc-session-feature-limit__notice-icon" aria-hidden="true">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="currentColor" /><path d="M12 7v6" stroke="#fff" stroke-width="2" stroke-linecap="round" /><circle cx="12" cy="16.5" r="1" fill="#fff" /></svg>
                  </span>
                  <span>注意：启用限制后，如果访客删除未结束的会话，该会话仍会占用额度，可能导致访客无法发起新的会话。建议关闭"删除会话"功能，禁止访客删除会话。</span>
                </div>
              </div>
            </div>
            <div class="wc-divider" />
            <div class="wc-switch-row">
              <div class="wc-switch-row__text">
                <span class="wc-switch-label">删除会话</span>
                <span class="wc-switch-desc">开启后，访客会话列表显示删除按钮，访客可删除会话</span>
              </div>
              <AgentSwitch v-model="settings.enableDeleteSession" @update:model-value="autoSave" />
            </div>
            <div class="wc-divider" />
            <div class="wc-switch-row">
              <div class="wc-switch-row__text">
                <span class="wc-switch-label">主动结束会话</span>
                <span class="wc-switch-desc">开启后，访客在删除会话时可选择主动结束会话</span>
              </div>
              <AgentSwitch v-model="settings.enableEndSession" @update:model-value="autoSave" />
            </div>
            <div class="wc-divider" />
            <div class="wc-switch-row">
              <div class="wc-switch-row__text">
                <span class="wc-switch-label">排队提醒</span>
                <span class="wc-switch-desc">开启后，访客发送消息进入排队时，聊天顶部将显示当前排队位置；AI Agent 接待的会话不生效</span>
              </div>
              <AgentSwitch v-model="settings.showQueuePosition" @update:model-value="autoSave" />
            </div>
          </div>
        </article>

        <article class="wc-accordion" :class="{ 'wc-accordion--open': openSection === 'visitorInactive' }">
          <button type="button" class="wc-accordion__trigger" @click="toggleSection('visitorInactive')">
            <div class="wc-accordion__trigger-text">
              <h3 class="wc-card__title">访客不活跃</h3>
            </div>
            <AgentSwitch v-model="settings.enableVisitorInactive" @click.stop @update:model-value="autoSave" />
            <span class="wc-accordion__chevron" />
          </button>
          <div v-if="openSection === 'visitorInactive' && settings.enableVisitorInactive" class="wc-accordion__body">
            <div class="wc-visitor-inactive-row">
              <div class="wc-visitor-inactive-row__text">
                <span>当访客超过</span>
                <TimeDurationInput v-model="settings.visitorInactiveSeconds" @update:model-value="autoSave" />
                <span>未回复客服消息时，会话会自动关闭</span>
              </div>
            </div>
            <div class="wc-inactive-pending-panel">
              <label class="wc-session-feature-limit">
                <input v-model="settings.visitorInactiveIncludePending" type="checkbox" class="wc-session-feature-limit__checkbox" @change="autoSave" />
                <div class="wc-session-feature-limit__text">
                  <span class="wc-session-feature-limit__title">包含待处理会话</span>
                  <span class="wc-session-feature-limit__desc">开启后，待处理状态的会话也会因访客不活跃而自动关闭</span>
                </div>
              </label>
            </div>
          </div>
        </article>

        <article class="wc-accordion" :class="{ 'wc-accordion--open': openSection === 'msgStatus' }">
          <button type="button" class="wc-accordion__trigger" @click="toggleSection('msgStatus')">
            <div class="wc-accordion__trigger-text">
              <h3 class="wc-card__title">消息与状态</h3>
            </div>
            <span class="wc-accordion__chevron" />
          </button>
          <div v-if="openSection === 'msgStatus'" class="wc-accordion__body">
            <div class="wc-switch-row">
              <div class="wc-switch-row__text">
                <span class="wc-switch-label">已读回执</span>
                <span class="wc-switch-desc">访客可在会话和聊天中看到客服是否已读其消息</span>
              </div>
              <AgentSwitch v-model="settings.enableReadReceipt" @update:model-value="autoSave" />
            </div>
            <div class="wc-divider" />
            <div class="wc-switch-row">
              <div class="wc-switch-row__text">
                <span class="wc-switch-label">客服在线状态（聊天）</span>
                <span class="wc-switch-desc">开启后，访客可在单聊中看到客服的在线状态</span>
              </div>
              <AgentSwitch v-model="settings.showAgentOnlineStatus" @update:model-value="autoSave" />
            </div>
            <div class="wc-divider" />
            <div class="wc-switch-row">
              <div class="wc-switch-row__text">
                <span class="wc-switch-label">展示客服信息</span>
                <span class="wc-switch-desc">开启后，访客端会话列表和会话详情将展示当前负责客服的头像和昵称</span>
              </div>
              <AgentSwitch v-model="settings.showAgentInfoToVisitor" @update:model-value="autoSave" />
            </div>
          </div>
        </article>

        <div class="wc-general-setting-card">
          <div class="wc-general-setting-card__text">
            <span class="wc-switch-label">隐藏联系我们</span>
            <span class="wc-switch-desc">开启后，App 端我的页面将不显示"联系我们"入口</span>
          </div>
          <AgentSwitch :model-value="settings.hideContactUs" @update:model-value="toggleHideContactUs" />
        </div>

      </div>
    </div>

    <!-- Right: Preview Panel -->
    <div class="wc-preview">
      <header class="wc-preview__header">
        <select v-model="previewMode" class="agent-input wc-preview-select">
          <option value="sessionList">首页</option>
          <option value="chat">消息</option>
          <option value="form">表单</option>
          <option value="minimized">最小化</option>
        </select>
      </header>

      <div class="wc-preview__canvas">
        <div class="wc-preview__page-mock">
          <div class="wc-mock-bar wc-mock-bar--long" />
          <div class="wc-mock-bar wc-mock-bar--medium" />
          <div class="wc-mock-bar wc-mock-bar--short" />
          <div class="wc-mock-block" />
          <div class="wc-mock-bar wc-mock-bar--medium" />
        </div>

        <!-- Session List Preview (like image#3) -->
        <div v-if="previewMode === 'sessionList'" class="wc-widget wc-widget--tall" :style="widgetPositionStyle">
          <div class="wc-widget__header">
            <div class="wc-widget__header-left">
              <img :src="settings.brandLogoUrl" class="wc-widget__avatar-img" alt="" />
              <span class="wc-widget__brand-name">{{ settings.brandName || 'TWT' }}</span>
            </div>
            <button type="button" class="wc-widget__close-btn" aria-label="最小化" @click="minimizeWidget">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" /></svg>
            </button>
          </div>
          <div class="wc-widget__session-list">
            <div
              v-for="session in previewSessionItems"
              :key="session.id"
              class="wc-session-item"
              :class="{ 'wc-session-item--deletable': settings.enableDeleteSession }"
            >
              <button
                v-if="settings.enableDeleteSession"
                type="button"
                class="wc-session-item__delete"
                :aria-label="`删除${session.name}会话`"
                @click.stop="openDeleteSessionPreview(session.id)"
              >
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none"><path d="M18 6 6 18M6 6l12 12" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" /></svg>
              </button>
              <template v-if="settings.showAgentInfoToVisitor">
                <img :src="DEFAULT_AVATAR" class="wc-session-item__avatar-img" alt="" />
              </template>
              <div v-else class="wc-session-item__avatar" :style="{ background: session.avatarColor }">{{ session.avatarLabel }}</div>
              <div class="wc-session-item__body">
                <div class="wc-session-item__top">
                  <span class="wc-session-item__name">{{ settings.showAgentInfoToVisitor ? '与客服小李的会话' : session.name }}</span>
                  <span class="wc-session-item__time">{{ session.time }}</span>
                </div>
                <div class="wc-session-item__bottom">
                  <span class="wc-session-item__msg">{{ session.message }}</span>
                  <span v-if="session.unread > 0" class="wc-session-item__badge">{{ session.unread }}</span>
                </div>
              </div>
            </div>
          </div>
          <div v-if="settings.enableStartSession" class="wc-widget__new-session-btn">新的会话</div>
          <div v-if="!settings.hideBrandLogo" class="wc-widget__footer">Powered by <strong>Chat</strong></div>
          <div v-if="deleteSessionPreviewModalOpen" class="wc-widget__dialog-mask" @click="closeDeleteSessionPreview">
            <div class="wc-widget__dialog" @click.stop>
              <div class="wc-widget__dialog-head">
                <h4 class="wc-widget__dialog-title">删除会话</h4>
                <button type="button" class="wc-widget__dialog-close" aria-label="关闭删除会话弹窗" @click="closeDeleteSessionPreview">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M18 6 6 18M6 6l12 12" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" /></svg>
                </button>
              </div>
              <label v-if="settings.enableEndSession" class="wc-widget__dialog-option">
                <input v-model="deleteSessionPreviewEndChecked" type="checkbox" class="wc-widget__dialog-checkbox" />
                <span>同时结束会话</span>
              </label>
              <div class="wc-widget__dialog-actions">
                <button type="button" class="wc-widget__dialog-btn wc-widget__dialog-btn--ghost" @click="closeDeleteSessionPreview">取消</button>
                <button type="button" class="wc-widget__dialog-btn wc-widget__dialog-btn--primary" @click="confirmDeleteSessionPreview">确认</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Chat Preview Widget -->
        <div v-else-if="previewMode === 'chat'" class="wc-widget wc-widget--tall" :style="widgetPositionStyle">
          <div class="wc-widget__header wc-widget__header--chat">
            <div class="wc-widget__header-left">
              <span class="wc-widget__back-btn">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>
              </span>
              <div class="wc-widget__chat-avatar-wrap">
                <img v-if="showChatPreviewAgentAvatar" :src="DEFAULT_AVATAR" class="wc-widget__chat-avatar-img" alt="默认头像" />
                <div v-else class="wc-widget__chat-avatar">?</div>
                <span v-if="showChatPreviewOnlineStatus" class="wc-widget__chat-avatar-status" />
              </div>
              <span class="wc-widget__chat-title">{{ chatPreviewHeaderTitle }}</span>
            </div>
            <button type="button" class="wc-widget__close-btn" aria-label="最小化" @click="minimizeWidget">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" /></svg>
            </button>
          </div>
          <template v-if="openSection === 'visitorFeedback' && feedbackEnabled">
            <div class="wc-widget__feedback-area">
              <div class="wc-widget__feedback-card">
                <p class="wc-widget__feedback-title">{{ feedbackPreviewTitle }}</p>
                <div class="wc-widget__feedback-options">
                  <div class="wc-widget__feedback-option">
                    <span class="wc-widget__feedback-emoji">😊</span>
                    <span class="wc-widget__feedback-label">满意</span>
                  </div>
                  <div class="wc-widget__feedback-option">
                    <span class="wc-widget__feedback-emoji">😐</span>
                    <span class="wc-widget__feedback-label">一般</span>
                  </div>
                  <div class="wc-widget__feedback-option">
                    <span class="wc-widget__feedback-emoji">😞</span>
                    <span class="wc-widget__feedback-label">不满意</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="wc-widget__session-ended-btn">会话已结束，请重新咨询</div>
          </template>

          <!-- Normal chat preview -->
          <template v-else>
            <div v-if="settings.showQueuePosition" class="wc-widget__queue-banner">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" class="wc-widget__queue-banner-icon"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" /><path d="M12 7v5l3 3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>
              <span>正在排队中，您前面还有 3 位访客</span>
            </div>
            <div class="wc-widget__messages">
              <template v-if="showChatPreviewMessage">
                <div v-if="showChatPreviewTextBubble" class="wc-widget__msg" :class="isMsgStatusPreview ? 'wc-widget__msg--visitor' : 'wc-widget__msg--agent'">
                  <span class="wc-widget__msg-time">10:32</span>
                  <div class="wc-widget__msg-bubble">
                    {{ chatPreviewMessageText }}
                  </div>
                  <span
                    v-if="isMsgStatusPreview && settings.enableReadReceipt"
                    class="wc-widget__read-receipt wc-widget__read-receipt--status"
                    aria-label="已读回执"
                  >
                    <svg width="20" height="12" viewBox="0 0 20 12" fill="none" class="wc-widget__read-receipt-icon">
                      <path d="M1.5 6.2L4.4 9l5-5.3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
                      <path d="M8.2 6.2L11.1 9l5-5.3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                  </span>
                </div>
                <div v-if="!isMsgStatusPreview" v-for="(src, idx) in chatPreviewImages" :key="idx" class="wc-widget__msg wc-widget__msg--agent">
                  <img :src="src" class="wc-widget__msg-img" alt="" />
                </div>
              </template>
            </div>
            <div v-if="showQuickAccessPreview && settings.quickAccessItems.length > 0" class="wc-widget__quick-access">
              <span v-for="item in settings.quickAccessItems" :key="item.id" class="wc-widget__qa-tag">{{ item.label }}</span>
            </div>
            <div class="wc-widget__input-area">
              <div class="wc-widget__input-box" />
              <div class="wc-widget__input-toolbar">
                <div class="wc-widget__toolbar-icons">
                  <span class="wc-widget__toolbar-icon">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" /><path d="M19 10v2a7 7 0 01-14 0v-2M12 19v4M8 23h8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" /></svg>
                  </span>
                  <span class="wc-widget__toolbar-icon">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" /></svg>
                  </span>
                  <span class="wc-widget__toolbar-icon wc-widget__toolbar-icon--bg">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.6" /><path d="M8 14s1.5 2 4 2 4-2 4-2" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" /><circle cx="9" cy="9" r="1" fill="currentColor" /><circle cx="15" cy="9" r="1" fill="currentColor" /></svg>
                  </span>
                </div>
                <span class="wc-widget__send-btn">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>
                </span>
              </div>
            </div>
          </template>

          <div v-if="!settings.hideBrandLogo" class="wc-widget__footer">Powered by <strong>Chat</strong></div>
        </div>

        <!-- Form Preview Widget -->
        <div v-else-if="previewMode === 'form'" class="wc-widget wc-widget--tall" :style="widgetPositionStyle">
          <div class="wc-widget__header wc-widget__header--chat">
            <div class="wc-widget__header-left">
              <span class="wc-widget__back-btn">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>
              </span>
              <div class="wc-widget__chat-avatar">?</div>
              <span class="wc-widget__chat-title">新的会话</span>
            </div>
            <button type="button" class="wc-widget__close-btn" aria-label="最小化" @click="minimizeWidget">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" /></svg>
            </button>
          </div>
          <div class="wc-widget__messages">
            <div class="wc-widget__msg wc-widget__msg--agent">
              <span class="wc-widget__msg-time">10:32</span>
              <div class="wc-widget__form-card">
                <p class="wc-widget__form-card-title">{{ settings.formTitle[globalLang] || '请留下您的联系方式，以便我们与您联系：' }}</p>
                <div class="wc-widget__form-card-fields">
                  <div v-for="field in settings.formFields" :key="field.id" class="wc-widget__form-card-field">
                    <label class="wc-widget__form-card-label">
                      <span v-if="field.required" class="wc-widget__form-card-required">*</span>{{ field.label[globalLang] }}
                    </label>
                    <div class="wc-widget__form-card-input">{{ field.placeholder[globalLang] }}</div>
                  </div>
                </div>
                <div class="wc-widget__form-card-submit">提交</div>
              </div>
            </div>
          </div>
          <div v-if="!settings.hideBrandLogo" class="wc-widget__footer">Powered by <strong>Chat</strong></div>
        </div>

        <!-- Minimized Preview -->
        <div v-else class="wc-widget-fab" :style="widgetPositionStyle" @click="restoreWidget">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </div>
      </div>
    </div>

    <!-- Hidden file input for reply image upload -->
    <input ref="replyImageInput" type="file" accept="image/png,image/jpeg,image/jpg" style="display:none" @change="handleReplyImageChange" />

    <!-- Image Crop Modal -->
    <teleport to="body">
      <div v-if="cropModalOpen" class="wc-crop-overlay" @click.self="cropModalOpen = false">
        <div class="wc-crop-modal">
          <h3 class="wc-crop-modal__title">裁剪图片</h3>
          <div class="wc-crop-modal__canvas">
            <img v-if="cropImageSrc" ref="cropImgEl" :src="cropImageSrc" class="wc-crop-modal__img" alt="裁剪预览" />
          </div>
          <div class="wc-crop-modal__actions">
            <button type="button" class="agent-btn agent-btn--ghost" @click="cropModalOpen = false">取消</button>
            <button type="button" class="agent-btn agent-btn--primary" @click="applyCrop">确认</button>
          </div>
        </div>
      </div>
    </teleport>
  </section>
</template>

<script setup lang="ts">
import { reactive, ref, computed, watch } from "vue";
import { AgentSwitch, TimeDurationInput } from "@twt/ui-agent";
import { FEATURES } from "../lib/plan";
import { usePlan } from "../composables/usePlan";

interface QuickAccessItem {
  id: string;
  label: string;
  url: string;
}

type LangKey = "en" | "zh-cn" | "zh-tw";

interface FormField {
  id: string;
  type: "name" | "phone" | "email" | "text" | "select";
  label: Record<LangKey, string>;
  placeholder: Record<LangKey, string>;
  required: boolean;
}

interface PreviewSessionItem {
  id: string;
  name: string;
  message: string;
  time: string;
  unread: number;
  avatarLabel: string;
  avatarColor: string;
}

type TabKey = "appearance" | "content" | "form" | "general";
type PreviewMode = "sessionList" | "chat" | "form" | "minimized";
type SectionKey = "brand" | "position" | "display" | "quickAccess"
  | "welcome" | "end" | "sessionOffline" | "chatOffline"
  | "visitorFeedback"
  | "sessionForm" | "msgStatus" | "sessionFeatures" | null;

const DEFAULT_AVATAR = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='184' height='184' viewBox='0 0 184 184'%3E%3Ccircle cx='92' cy='92' r='90' fill='%23C9CED8' stroke='%23F5F7FA' stroke-width='4'/%3E%3Ccircle cx='92' cy='68' r='30' fill='%23EEF1F5'/%3E%3Cpath d='M28 156c10-28 34-46 64-46s54 18 64 46' fill='%23EEF1F5'/%3E%3C/svg%3E";
const DEFAULT_LOGO = "data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20width%3D%2764%27%20height%3D%2764%27%20viewBox%3D%270%200%2064%2064%27%3E%3Crect%20width%3D%2764%27%20height%3D%2764%27%20fill%3D%27%232563EB%27%2F%3E%3Cpath%20d%3D%27M24%2018h14c6%200%2010%204%2010%2010v8c0%206-4%2010-10%2010h-6l-8%206v-6h-2c-6%200-10-4-10-10V28c0-6%204-10%2010-10z%27%20fill%3D%27none%27%20stroke%3D%27white%27%20stroke-width%3D%274%27%20stroke-linecap%3D%27round%27%20stroke-linejoin%3D%27round%27%2F%3E%3Cpath%20d%3D%27M24%2028h0.01M32%2028h0.01M40%2028h0.01%27%20stroke%3D%27white%27%20stroke-width%3D%274%27%20stroke-linecap%3D%27round%27%2F%3E%3Cpath%20d%3D%27M16%2017l2.5%202.5L22%2016%27%20stroke%3D%27white%27%20stroke-width%3D%273%27%20stroke-linecap%3D%27round%27%20stroke-linejoin%3D%27round%27%2F%3E%3C%2Fsvg%3E";

const emit = defineEmits<{
  (e: "toast", message: string): void;
}>();

const emitToast = (msg: string) => emit("toast", msg);

const autoSave = () => {
  emitToast("保存成功");
};

const { guardFeature } = usePlan();

const toggleHideBrandLogo = (val: boolean) => {
  if (val && !guardFeature(FEATURES.HIDE_BRANDING)) return;
  settings.hideBrandLogo = val;
  autoSave();
};

const toggleHideContactUs = (val: boolean) => {
  if (val && !guardFeature(FEATURES.HIDE_CONTACT)) return;
  settings.hideContactUs = val;
  autoSave();
};

const tabs: { key: TabKey; label: string }[] = [
  { key: "appearance", label: "外观" },
  { key: "content", label: "内容" },
  { key: "form", label: "会话表单" },
  { key: "general", label: "常规" }
];

const contentLangTabs = [
  { key: "en", label: "English" },
  { key: "zh-cn", label: "简体中文" },
  { key: "zh-tw", label: "繁体中文" }
];

type AutoReplyKey = "welcome" | "end" | "sessionOffline" | "chatOffline";

const autoReplyBlocks: { key: AutoReplyKey; title: string; desc: string; placeholder: string }[] = [
  { key: "welcome", title: "欢迎语", desc: "当访客发起会话时，系统自动发送一条欢迎语消息", placeholder: "Hello, is there anything I can help you with?" },
  { key: "end", title: "结束语", desc: "当会话被客服主动结束或自动结束时，系统自动发送一条结束语", placeholder: "Thank you for your inquiry. Have a great day!" },
  { key: "sessionOffline", title: "会话离线自动回复", desc: "当访客发送消息时，若全部客服不在线，系统将自动发送一条离线回复", placeholder: "Our agents are currently offline..." },
  { key: "chatOffline", title: "单聊离线自动回复", desc: "客服与访客的单聊中，当客服不在线时，系统将自动发送一条离线回复", placeholder: "The agent is currently offline..." }
];

const activeTab = ref<TabKey>("appearance");
const globalLang = ref<LangKey>("en");
const previewMode = ref<PreviewMode>("sessionList");
const previewModeBeforeMinimize = ref<PreviewMode>("sessionList");
const openSection = ref<SectionKey>("brand");

const autoReplyToggles = reactive<Record<AutoReplyKey, boolean>>({
  welcome: true, end: true, sessionOffline: true, chatOffline: true
});

const autoReplyTexts = reactive<Record<AutoReplyKey, Record<LangKey, string>>>({
  welcome: { en: "Hello, is there anything I can help you with?", "zh-cn": "你好！有什么可以帮您的吗？", "zh-tw": "你好！有什麼可以幫您的嗎？" },
  end: { en: "Thank you for your inquiry. Have a great day!", "zh-cn": "感谢您的咨询，祝您生活愉快！", "zh-tw": "感謝您的諮詢，祝您生活愉快！" },
  sessionOffline: { en: "Our agents are currently offline. We will reply as soon as we are back.", "zh-cn": "当前客服不在线，我们会在上线后第一时间回复您。", "zh-tw": "當前客服不在線，我們會在上線後第一時間回覆您。" },
  chatOffline: { en: "The agent is currently offline. Please try again later or leave your contact info.", "zh-cn": "客服暂时不在线，请稍后再试或留下您的联系方式。", "zh-tw": "客服暫時不在線，請稍後再試或留下您的聯繫方式。" }
});

const feedbackEnabled = ref(true);
const feedbackTitles = reactive<Record<LangKey, string>>({
  en: "Please evaluate our service",
  "zh-cn": "请对我们的服务进行评价",
  "zh-tw": "請對我們的服務進行評價"
});

const autoReplyImages = reactive<Record<AutoReplyKey, Record<LangKey, string[]>>>({
  welcome: { en: [], "zh-cn": [], "zh-tw": [] },
  end: { en: [], "zh-cn": [], "zh-tw": [] },
  sessionOffline: { en: [], "zh-cn": [], "zh-tw": [] },
  chatOffline: { en: [], "zh-cn": [], "zh-tw": [] }
});

const replyImageInput = ref<HTMLInputElement>();
const uploadingReplyKey = ref<AutoReplyKey>("welcome");

const triggerReplyImageUpload = (key: AutoReplyKey) => {
  uploadingReplyKey.value = key;
  replyImageInput.value?.click();
};

const handleReplyImageChange = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file) return;
  if (file.size > 2 * 1024 * 1024) {
    emitToast("图片大小不能超过2MB");
    (e.target as HTMLInputElement).value = "";
    return;
  }
  const key = uploadingReplyKey.value;
  const lang = globalLang.value;
  if (autoReplyImages[key][lang].length >= 10) {
    emitToast("最多上传10张图片");
    (e.target as HTMLInputElement).value = "";
    return;
  }
  const reader = new FileReader();
  reader.onload = () => {
    autoReplyImages[key][lang].push(reader.result as string);
    autoSave();
  };
  reader.readAsDataURL(file);
  (e.target as HTMLInputElement).value = "";
};

const removeReplyImage = (key: AutoReplyKey, lang: LangKey, idx: number) => {
  autoReplyImages[key][lang].splice(idx, 1);
  autoSave();
};

const chatPreviewImages = computed(() => {
  const key = activeAutoReplyKey.value;
  const lang = globalLang.value;
  return autoReplyImages[key][lang];
});

// Section -> preview mapping (null = don't change)
const sectionToPreview: Partial<Record<NonNullable<SectionKey>, PreviewMode | null>> = {
  brand: "sessionList",
  position: "minimized",
  display: "sessionList",
  quickAccess: "chat",
  welcome: "chat",
  end: "chat",
  sessionOffline: "chat",
  chatOffline: "chat",
  visitorFeedback: "chat",
  sessionForm: "form",
  msgStatus: "chat",
  sessionFeatures: "sessionList"
};

const toggleSection = (key: SectionKey) => {
  openSection.value = openSection.value === key ? null : key;
  if (openSection.value) {
    const target = sectionToPreview[openSection.value];
    if (target !== undefined && target !== null) {
      previewMode.value = target;
    }
  }
};

const defaultSections: Record<TabKey, SectionKey> = {
  appearance: "brand",
  content: "welcome",
  form: "sessionForm",
  general: "sessionFeatures"
};

const applyTabSwitch = (key: TabKey) => {
  activeTab.value = key;
  openSection.value = defaultSections[key];
  if (openSection.value) {
    const target = sectionToPreview[openSection.value];
    if (target !== undefined && target !== null) {
      previewMode.value = target;
    }
  }
};

const switchTab = (key: TabKey) => {
  if (activeTab.value === key) {
    return;
  }
  applyTabSwitch(key);
};

// Computed: which auto-reply message to show in chat preview
const autoReplyKeys: AutoReplyKey[] = ["welcome", "end", "sessionOffline", "chatOffline"];
const activeAutoReplyKey = computed<AutoReplyKey>(() => {
  if (openSection.value && autoReplyKeys.includes(openSection.value as AutoReplyKey)) {
    return openSection.value as AutoReplyKey;
  }
  return "welcome";
});

const showQuickAccessPreview = computed(() => openSection.value === "quickAccess");
const isMsgStatusPreview = computed(() => openSection.value === "msgStatus");
const showChatPreviewMessage = computed(() => !showQuickAccessPreview.value);

const chatPreviewAgentMsg = computed(() => {
  const key = activeAutoReplyKey.value;
  const lang = globalLang.value;
  return autoReplyTexts[key][lang];
});

const showChatPreviewTextBubble = computed(() => {
  if (isMsgStatusPreview.value) {
    return true;
  }
  return chatPreviewAgentMsg.value.trim().length > 0;
});

const chatPreviewMessageText = computed(() => {
  if (isMsgStatusPreview.value) {
    return "您好，我想确认一下订单物流进度。";
  }
  return chatPreviewAgentMsg.value;
});

const showChatPreviewAgentAvatar = computed(() => {
  return previewMode.value === "chat" && (activeAutoReplyKey.value === "chatOffline" || isMsgStatusPreview.value);
});

const chatPreviewHeaderTitle = computed(() => {
  if (settings.showAgentInfoToVisitor) return "与客服小李的会话";
  return showChatPreviewAgentAvatar.value ? "聊天" : "新的会话";
});

const feedbackPreviewTitle = computed(() => {
  return feedbackTitles[globalLang.value] || feedbackTitles.en;
});

const settings = reactive({
  brandName: "项目名称",
  brandLogoUrl: DEFAULT_LOGO,
  widgetPosition: "bottom-right" as "bottom-right" | "bottom-left",
  positionOffsetX: 20,
  positionOffsetY: 20,
  hideBrandLogo: false,
  quickAccessItems: [
    { id: "qa-1", label: "帮助中心", url: "#" },
    { id: "qa-2", label: "常见问题", url: "#" }
  ] as QuickAccessItem[],
  enableSessionForm: true,
  formTitle: {
    en: "Welcome! Please fill in the information.",
    "zh-cn": "欢迎！请填写以下信息。",
    "zh-tw": "歡迎！請填寫以下資訊。"
  } as Record<LangKey, string>,
  formFields: [
    { id: "f-1", type: "name", label: { en: "Name", "zh-cn": "姓名", "zh-tw": "姓名" }, placeholder: { en: "Enter your name", "zh-cn": "请输入姓名", "zh-tw": "請輸入姓名" }, required: true },
    { id: "f-2", type: "email", label: { en: "Email", "zh-cn": "邮箱", "zh-tw": "郵箱" }, placeholder: { en: "Enter your email", "zh-cn": "请输入邮箱", "zh-tw": "請輸入郵箱" }, required: true },
    { id: "f-3", type: "phone", label: { en: "Phone", "zh-cn": "电话", "zh-tw": "電話" }, placeholder: { en: "Enter your phone", "zh-cn": "请输入电话", "zh-tw": "請輸入電話" }, required: false }
  ] as FormField[],
  enableReadReceipt: true,
  showAgentOnlineStatus: true,
  hideContactUs: false,
  enableStartSession: true,
  limitStartSessionCount: true,
  maxStartSessionCount: 3,
  enableDeleteSession: false,
  enableEndSession: false,
  enableVisitorInactive: true,
  visitorInactiveSeconds: 7200,
  visitorInactiveIncludePending: true,
  showAgentInfoToVisitor: false,
  showQueuePosition: false
});

const showChatPreviewOnlineStatus = computed(() => {
  return isMsgStatusPreview.value && settings.showAgentOnlineStatus;
});

const previewSessionItems: PreviewSessionItem[] = [
  { id: "preview-session-2", name: "Lily", message: "Can you help me check the order status?", time: "09:46", unread: 0, avatarLabel: "L", avatarColor: "#7C3AED" }
];

const deleteSessionPreviewTargetId = ref<string | null>(null);
const deleteSessionPreviewEndChecked = ref(false);

const deleteSessionPreviewModalOpen = computed(() => deleteSessionPreviewTargetId.value !== null);

const deleteSessionPreviewTarget = computed(() => {
  return previewSessionItems.find((item) => item.id === deleteSessionPreviewTargetId.value) ?? null;
});

const normalizeStartSessionCount = () => {
  const nextValue = Number(settings.maxStartSessionCount);
  if (!Number.isFinite(nextValue)) {
    settings.maxStartSessionCount = 1;
    return;
  }
  settings.maxStartSessionCount = Math.min(99, Math.max(1, Math.round(nextValue)));
};

const openDeleteSessionPreview = (id: string) => {
  if (!settings.enableDeleteSession) {
    return;
  }
  deleteSessionPreviewTargetId.value = id;
  deleteSessionPreviewEndChecked.value = false;
};

const closeDeleteSessionPreview = () => {
  deleteSessionPreviewTargetId.value = null;
  deleteSessionPreviewEndChecked.value = false;
};

const confirmDeleteSessionPreview = () => {
  closeDeleteSessionPreview();
};

const minimizeWidget = () => {
  previewModeBeforeMinimize.value = previewMode.value;
  previewMode.value = "minimized";
};

const restoreWidget = () => {
  previewMode.value = previewModeBeforeMinimize.value;
};

const widgetPositionStyle = computed(() => {
  const isLeft = settings.widgetPosition === "bottom-left";
  const clamp = (v: number) => Math.min(200, Math.max(20, v));
  return {
    bottom: `${clamp(settings.positionOffsetY)}px`,
    [isLeft ? "left" : "right"]: `${clamp(settings.positionOffsetX)}px`,
    [isLeft ? "right" : "left"]: "auto"
  };
});

// Logo upload & crop
const logoFileInput = ref<HTMLInputElement>();
const cropModalOpen = ref(false);
const cropImageSrc = ref("");
const cropImgEl = ref<HTMLImageElement>();

const triggerLogoUpload = () => {
  logoFileInput.value?.click();
};

const handleLogoFileChange = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file) return;
  if (file.size > 2 * 1024 * 1024) {
    emitToast("图片大小不能超过2MB");
    return;
  }
  const reader = new FileReader();
  reader.onload = () => {
    cropImageSrc.value = reader.result as string;
    cropModalOpen.value = true;
  };
  reader.readAsDataURL(file);
  // reset so re-selecting same file triggers change
  (e.target as HTMLInputElement).value = "";
};

const applyCrop = () => {
  if (!cropImgEl.value) return;
  const img = cropImgEl.value;
  const canvas = document.createElement("canvas");
  const size = Math.min(img.naturalWidth, img.naturalHeight);
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const sx = (img.naturalWidth - size) / 2;
  const sy = (img.naturalHeight - size) / 2;
  ctx.drawImage(img, sx, sy, size, size, 0, 0, 128, 128);
  settings.brandLogoUrl = canvas.toDataURL("image/png");
  cropModalOpen.value = false;
  autoSave();
};

let qaCounter = 3;
const addQuickAccess = () => {
  const id = `qa-${qaCounter++}`;
  settings.quickAccessItems.push({ id, label: `入口${settings.quickAccessItems.length + 1}`, url: "#" });
  autoSave();
};

const removeQuickAccess = (id: string) => {
  settings.quickAccessItems = settings.quickAccessItems.filter(i => i.id !== id);
  autoSave();
};

let fieldCounter = 4;
const addFormField = () => {
  const id = `f-${fieldCounter++}`;
  settings.formFields.push({ id, type: "text", label: { en: "Custom Field", "zh-cn": "自定义字段", "zh-tw": "自定義欄位" }, placeholder: { en: "Please enter...", "zh-cn": "请输入...", "zh-tw": "請輸入..." }, required: false });
  autoSave();
};

const deleteConfirmIdx = ref<number | null>(null);

const toggleDeleteConfirm = (idx: number) => {
  deleteConfirmIdx.value = deleteConfirmIdx.value === idx ? null : idx;
};

const confirmRemoveFormField = (idx: number) => {
  settings.formFields.splice(idx, 1);
  deleteConfirmIdx.value = null;
  autoSave();
};


watch(
  () => settings.enableDeleteSession,
  (enabled) => {
    if (!enabled) {
      closeDeleteSessionPreview();
    }
  }
);

watch(
  () => settings.enableEndSession,
  (enabled) => {
    if (!enabled) {
      deleteSessionPreviewEndChecked.value = false;
    }
  }
);

watch(previewMode, (mode) => {
  if (mode !== "sessionList") {
    closeDeleteSessionPreview();
  }
  if (mode !== "minimized") {
    previewModeBeforeMinimize.value = mode;
  }
});
</script>

<style scoped>
.widget-customize {
  display: grid;
  grid-template-columns: 1fr 1fr;
  height: 100%;
  overflow: hidden;
}

/* ── Settings Panel ── */
.wc-settings {
  border-right: 1px solid var(--agent-color-border-default);
  display: flex;
  flex-direction: column;
  gap: var(--agent-space-16);
  overflow-y: auto;
  padding: var(--agent-space-24);
}

.wc-settings__header {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.wc-settings__header-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--agent-space-12);
}

.wc-settings__title {
  color: var(--agent-color-text-primary);
  font-size: 20px;
  font-weight: var(--agent-font-weight-semibold);
  margin: 0;
}

.wc-settings__subtitle {
  color: var(--agent-color-text-tertiary);
  font-size: var(--agent-font-size-sm);
  margin: 0;
}

/* Global Language Switch */
.wc-global-lang {
  flex-shrink: 0;
}

.wc-global-lang__select {
  appearance: none;
  background: #fff;
  border: 1px solid var(--agent-color-border-default);
  border-radius: var(--agent-radius-md);
  color: var(--agent-color-text-primary);
  cursor: pointer;
  font-size: var(--agent-font-size-sm);
  font-weight: var(--agent-font-weight-semibold);
  outline: none;
  padding: 8px 28px 8px 12px;
  background-image: url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%236B7280' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 10px center;
  transition: border-color 0.15s, box-shadow 0.15s;
}

.wc-global-lang__select:hover {
  border-color: var(--agent-color-brand-primary);
}

.wc-global-lang__select:focus {
  border-color: var(--agent-color-brand-primary);
  box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.12);
}

/* Tabs */
.wc-tabs {
  border-bottom: 1px solid var(--agent-color-border-default);
  display: flex;
  gap: 0;
}

.wc-tabs__item {
  background: transparent;
  border: 0;
  color: var(--agent-color-text-secondary);
  cursor: pointer;
  font-size: var(--agent-font-size-sm);
  font-weight: var(--agent-font-weight-medium);
  padding: 10px 16px;
  position: relative;
  transition: color 0.15s;
}

.wc-tabs__item:hover {
  color: var(--agent-color-text-primary);
}

.wc-tabs__item--active {
  color: var(--agent-color-brand-primary);
}

.wc-tabs__item--active::after {
  background: var(--agent-color-brand-primary);
  border-radius: 2px 2px 0 0;
  bottom: 0;
  content: "";
  height: 2px;
  left: 16px;
  position: absolute;
  right: 16px;
}

/* Tab Content */
.wc-tab-content {
  display: flex;
  flex-direction: column;
  gap: var(--agent-space-12);
}

/* ── Accordion ── */
.wc-accordion {
  background: var(--agent-color-bg-panel);
  border: 1px solid var(--agent-color-border-default);
  border-radius: 14px;
  overflow: hidden;
  transition: border-color 0.2s;
}

.wc-accordion--open {
  border-color: var(--agent-color-brand-primary);
}

.wc-accordion__trigger {
  align-items: center;
  background: transparent;
  border: 0;
  cursor: pointer;
  display: flex;
  gap: var(--agent-space-12);
  padding: 16px var(--agent-space-20);
  text-align: left;
  width: 100%;
}

.wc-accordion__trigger-text {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.wc-accordion__chevron {
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 6px solid var(--agent-color-text-tertiary);
  flex-shrink: 0;
  transition: transform 0.2s;
}

.wc-accordion--open .wc-accordion__chevron {
  transform: rotate(180deg);
}

.wc-accordion__body {
  display: flex;
  flex-direction: column;
  gap: var(--agent-space-16);
  padding: var(--agent-space-20);
}

.wc-card__title {
  color: var(--agent-color-text-primary);
  font-size: var(--agent-font-size-md);
  font-weight: var(--agent-font-weight-semibold);
  margin: 0;
}

.wc-card__desc {
  color: var(--agent-color-text-tertiary);
  font-size: var(--agent-font-size-sm);
  line-height: 1.5;
  margin: 0;
}

/* Brand row */
.wc-brand-row {
  align-items: flex-start;
  display: flex;
  gap: var(--agent-space-16);
}

.wc-logo-wrap {
  border-radius: 50%;
  cursor: pointer;
  flex-shrink: 0;
  height: 64px;
  overflow: hidden;
  position: relative;
  width: 64px;
}

.wc-logo-wrap__img {
  display: block;
  height: 100%;
  object-fit: cover;
  width: 100%;
}

.wc-logo-wrap__overlay {
  align-items: center;
  background: rgba(0, 0, 0, 0.5);
  bottom: 0;
  color: #fff;
  display: flex;
  flex-direction: column;
  font-size: 11px;
  gap: 2px;
  justify-content: center;
  left: 0;
  opacity: 0;
  position: absolute;
  right: 0;
  top: 0;
  transition: opacity 0.2s;
}

.wc-logo-wrap:hover .wc-logo-wrap__overlay {
  opacity: 1;
}

.wc-logo-wrap__file {
  display: none;
}

.wc-brand-input-group {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 6px;
}

.wc-label {
  color: var(--agent-color-text-secondary);
  font-size: var(--agent-font-size-sm);
  font-weight: var(--agent-font-weight-medium);
}

.wc-input {
  border-radius: 10px;
  font-size: var(--agent-font-size-sm);
  padding: 8px 12px;
}

/* Position */
.wc-field-row {
  align-items: center;
  display: flex;
  gap: var(--agent-space-12);
}

.wc-field-row .wc-label {
  flex-shrink: 0;
  margin-bottom: 0;
}

.wc-select {
  flex: 1;
  max-width: 200px;
  cursor: pointer;
  appearance: auto;
}

.wc-offset-row {
  display: grid;
  gap: var(--agent-space-12);
  grid-template-columns: 1fr 1fr;
}

.wc-offset-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

/* Switch row */
.wc-switch-row {
  align-items: center;
  display: flex;
  gap: var(--agent-space-12);
  justify-content: space-between;
}

.wc-switch-row__text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.wc-visitor-inactive-row {
  align-items: center;
  display: flex;
  gap: var(--agent-space-12);
  justify-content: space-between;
}

.wc-visitor-inactive-row__text {
  align-items: center;
  color: var(--agent-color-text-primary);
  display: flex;
  flex-wrap: wrap;
  font-size: 14px;
  gap: 8px;
}

.wc-session-feature-card {
  border: 1px solid var(--agent-color-border-default);
  border-radius: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px 24px 24px;
}

.wc-session-feature-card__header {
  align-items: flex-start;
  display: flex;
  gap: 16px;
  justify-content: space-between;
}

.wc-session-feature-card__text {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
}

.wc-session-feature-card__title {
  color: var(--agent-color-text-primary);
  font-size: 14px;
  font-weight: 600;
}

.wc-session-feature-card__desc {
  color: #98a2b3;
  font-size: 14px;
  line-height: 1.6;
}

.wc-session-feature-card__panel {
  border: 1px solid var(--agent-color-border-default);
  border-radius: 18px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 18px 18px 24px;
}

.wc-inactive-pending-panel {
  border: 1px solid var(--agent-color-border-default);
  border-radius: 18px;
  margin-top: 12px;
  padding: 18px 18px 20px;
}

.wc-session-feature-limit {
  align-items: flex-start;
  cursor: pointer;
  display: flex;
  gap: 12px;
}

.wc-session-feature-limit__checkbox {
  accent-color: #2563eb;
  height: 16px;
  margin-top: 2px;
  width: 16px;
}

.wc-session-feature-limit__text {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.wc-session-feature-limit__title {
  color: var(--agent-color-text-primary);
  font-size: 14px;
  font-weight: 600;
  line-height: 1.5;
}

.wc-session-feature-limit__desc {
  color: #98a2b3;
  font-size: 14px;
  line-height: 1.6;
}

.wc-session-feature-limit__controls {
  padding-left: 30px;
}

.wc-session-feature-limit__field {
  align-items: center;
  display: inline-flex;
  gap: 18px;
}

.wc-session-feature-limit__field-label {
  color: var(--agent-color-text-primary);
  font-size: 14px;
  font-weight: 500;
}

.wc-session-feature-limit__stepper {
  align-items: center;
  display: inline-flex;
  gap: 10px;
}

.wc-session-feature-limit__input-wrap {
  align-items: center;
  background: #fff;
  border: 1px solid var(--agent-color-border-default);
  border-radius: 10px;
  display: inline-flex;
  gap: 8px;
  height: 40px;
  padding: 0 12px;
  transition: border-color 0.2s;
}

.wc-session-feature-limit__input-wrap:focus-within {
  border-color: var(--agent-color-brand-primary);
}

.wc-session-feature-limit__input {
  appearance: textfield;
  background: transparent;
  border: 0;
  color: var(--agent-color-text-primary);
  font-size: 14px;
  height: 40px;
  outline: none;
  padding: 0;
  text-align: center;
  width: 44px;
}

.wc-session-feature-limit__input::-webkit-outer-spin-button,
.wc-session-feature-limit__input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.wc-session-feature-limit__unit {
  color: var(--agent-color-text-secondary);
  font-size: 14px;
}

.wc-session-feature-limit__notice {
  align-items: flex-start;
  background: #fff3f2;
  border-radius: 14px;
  color: #f04438;
  display: flex;
  font-size: 14px;
  gap: 10px;
  line-height: 1.75;
  margin-left: 30px;
  padding: 12px 14px;
}

.wc-session-feature-limit__notice-icon {
  align-items: center;
  display: inline-flex;
  flex-shrink: 0;
  height: 18px;
  justify-content: center;
  margin-top: 3px;
  width: 18px;
}

.wc-general-setting-card {
  align-items: center;
  background: var(--agent-color-bg-panel);
  border: 1px solid var(--agent-color-border-default);
  border-radius: 24px;
  display: flex;
  gap: var(--agent-space-16);
  justify-content: space-between;
  padding: 22px 24px;
}

.wc-general-setting-card__text {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
}

.wc-switch-label {
  color: var(--agent-color-text-primary);
  font-size: var(--agent-font-size-sm);
  font-weight: var(--agent-font-weight-medium);
}

.wc-switch-desc {
  color: var(--agent-color-text-tertiary);
  font-size: var(--agent-font-size-xs);
  line-height: 1.4;
}

.wc-divider {
  background: var(--agent-color-border-default);
  height: 1px;
}

/* Quick access tags */
.wc-quick-tags {
  align-items: center;
  background: #f5f7fb;
  border-radius: 14px;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  min-height: 56px;
  padding: 14px 16px;
}

.wc-quick-tag {
  align-items: center;
  background: #ffffff;
  border: 0;
  border-radius: 12px;
  color: #111827;
  display: inline-flex;
  font-size: 14px;
  gap: 8px;
  line-height: 1;
  min-height: 38px;
  padding: 9px 14px 9px 12px;
  position: relative;
}

.wc-quick-tag--add {
  background: rgba(255, 255, 255, 0.72);
  color: #4b5563;
  cursor: pointer;
  padding-right: 16px;
  transition: background 0.15s ease, color 0.15s ease;
}

.wc-quick-tag--add:hover {
  background: #ffffff;
  color: #111827;
}

.wc-quick-tag__add-icon,
.wc-quick-tag__icon {
  align-items: center;
  border-radius: 999px;
  display: inline-flex;
  flex-shrink: 0;
  height: 20px;
  justify-content: center;
  width: 20px;
}

.wc-quick-tag__add-icon {
  background: #eef1f6;
  color: #98a2b3;
}

.wc-quick-tag__icon {
  background: #fff0eb;
  color: #f97316;
}

.wc-quick-tag__label {
  white-space: nowrap;
}

.wc-quick-tag__edit {
  align-items: center;
  color: #111827;
  display: inline-flex;
}

.wc-quick-tag__remove {
  align-items: center;
  background: #c7ccd6;
  border: 2px solid #ffffff;
  border-radius: 999px;
  color: #ffffff;
  cursor: pointer;
  display: inline-flex;
  height: 16px;
  justify-content: center;
  padding: 0;
  position: absolute;
  right: -6px;
  top: -6px;
  transition: background 0.15s ease;
  width: 16px;
}

.wc-quick-tag__remove:hover {
  background: #9ca3af;
}

/* Reply section */
.wc-reply-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.wc-reply-section__label {
  color: var(--agent-color-text-primary);
  font-size: var(--agent-font-size-sm);
  font-weight: var(--agent-font-weight-semibold);
}

/* Rich editor */
.wc-rich-editor {
  border: 1px solid var(--agent-color-border-default);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: border-color 0.15s;
}

.wc-rich-editor:focus-within { border-color: var(--agent-color-brand-primary); }

.wc-rich-editor__textarea {
  background: transparent;
  border: 0;
  color: var(--agent-color-text-primary);
  font-family: inherit;
  font-size: var(--agent-font-size-sm);
  line-height: 1.6;
  outline: none;
  padding: 14px 16px 8px;
  resize: none;
}

.wc-upload-hint {
  color: var(--agent-color-text-tertiary);
  font-size: var(--agent-font-size-xs);
  line-height: 1.4;
  margin: 0;
}

.wc-rich-editor__images-area {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 6px 16px 12px;
}

.wc-reply-images__item {
  position: relative;
}

.wc-reply-images__thumb {
  border: 1px solid var(--agent-color-border-default);
  border-radius: 8px;
  display: block;
  height: 64px;
  object-fit: cover;
  width: 64px;
}

.wc-reply-images__remove {
  align-items: center;
  background: rgba(0, 0, 0, 0.5);
  border: 0;
  border-radius: 50%;
  color: #fff;
  cursor: pointer;
  display: inline-flex;
  height: 18px;
  justify-content: center;
  position: absolute;
  right: -4px;
  top: -4px;
  width: 18px;
}

.wc-reply-images__remove:hover {
  background: rgba(0, 0, 0, 0.7);
}

.wc-reply-images__add {
  align-items: center;
  background: var(--agent-color-bg-muted);
  border: 1px dashed var(--agent-color-border-default);
  border-radius: 8px;
  color: var(--agent-color-text-tertiary);
  cursor: pointer;
  display: inline-flex;
  height: 64px;
  justify-content: center;
  transition: border-color 0.15s, color 0.15s;
  width: 64px;
}

.wc-reply-images__add:hover {
  border-color: var(--agent-color-brand-primary);
  color: var(--agent-color-brand-primary);
}

/* Form fields */
.wc-form-title-row {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.wc-form-fields-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.wc-form-fields {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.wc-form-field-row {
  align-items: center;
  background: var(--agent-color-bg-muted);
  border-radius: 10px;
  display: flex;
  gap: 8px;
  padding: 8px 10px;
}

.wc-drag-handle {
  color: var(--agent-color-text-tertiary);
  cursor: grab;
  display: inline-flex;
  flex-shrink: 0;
}

.wc-form-field-label {
  color: var(--agent-color-text-primary);
  flex-shrink: 0;
  font-size: var(--agent-font-size-xs);
  font-weight: var(--agent-font-weight-medium);
  min-width: 36px;
}

.wc-form-field-placeholder {
  flex: 1;
  min-width: 0;
  padding: 4px 8px;
}

.wc-checkbox-label {
  align-items: center;
  color: var(--agent-color-text-secondary);
  display: inline-flex;
  flex-shrink: 0;
  font-size: var(--agent-font-size-xs);
  gap: 4px;
  white-space: nowrap;
}

.wc-checkbox {
  accent-color: var(--agent-color-brand-primary);
  height: 14px;
  width: 14px;
}

.wc-form-field-delete {
  background: transparent;
  border: 0;
  color: var(--agent-color-text-tertiary);
  cursor: pointer;
  display: inline-flex;
  flex-shrink: 0;
  padding: 0;
  transition: color 0.15s;
}

.wc-form-field-delete:hover { color: var(--agent-color-status-error); }

.wc-form-field-delete-wrap {
  position: relative;
  flex-shrink: 0;
}

.wc-popconfirm {
  position: absolute;
  right: 0;
  top: calc(100% + 6px);
  z-index: var(--agent-z-dropdown, 100);
  background: #fff;
  border: 1px solid var(--agent-color-border-default);
  border-radius: var(--agent-radius-md);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  padding: 12px 14px;
  white-space: nowrap;
}

.wc-popconfirm__text {
  margin: 0 0 10px;
  font-size: var(--agent-font-size-sm);
  color: var(--agent-color-text-primary);
}

.wc-popconfirm__actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.wc-popconfirm__btn {
  border: 0;
  border-radius: var(--agent-radius-sm);
  cursor: pointer;
  font-size: 12px;
  line-height: 1;
  padding: 5px 12px;
}

.wc-popconfirm__btn--cancel {
  background: var(--agent-color-bg-secondary, #f5f5f5);
  color: var(--agent-color-text-secondary);
}

.wc-popconfirm__btn--cancel:hover {
  background: var(--agent-color-bg-tertiary, #e8e8e8);
}

.wc-popconfirm__btn--confirm {
  background: var(--agent-color-status-error, #e53e3e);
  color: #fff;
}

.wc-popconfirm__btn--confirm:hover {
  opacity: 0.9;
}

.wc-add-field-btn {
  align-items: center;
  align-self: flex-start;
  background: transparent;
  border: 1px dashed var(--agent-color-border-default);
  border-radius: 8px;
  color: var(--agent-color-text-secondary);
  cursor: pointer;
  display: inline-flex;
  font-size: var(--agent-font-size-xs);
  gap: 4px;
  padding: 6px 14px;
  transition: border-color 0.15s, color 0.15s;
}

.wc-add-field-btn:hover {
  border-color: var(--agent-color-brand-primary);
  color: var(--agent-color-brand-primary);
}

/* ── Preview Panel ── */
.wc-preview {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.wc-preview__header {
  align-items: center;
  border-bottom: 1px solid var(--agent-color-border-default);
  display: flex;
  gap: 12px;
  padding: 14px var(--agent-space-24);
}

.wc-preview__title {
  color: var(--agent-color-text-secondary);
  font-size: var(--agent-font-size-sm);
}

.wc-preview-select {
  border-radius: 8px;
  font-size: var(--agent-font-size-sm);
  padding: 6px 10px;
  width: auto;
}

/* Canvas */
.wc-preview__canvas {
  background:
    linear-gradient(90deg, var(--agent-color-border-default) 1px, transparent 1px),
    linear-gradient(var(--agent-color-border-default) 1px, transparent 1px);
  background-color: #f7f8fa;
  background-size: 32px 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  overflow: hidden;
  position: relative;
}

.wc-preview__page-mock {
  display: flex;
  flex-direction: column;
  gap: 14px;
  left: 40px;
  position: absolute;
  right: 40px;
  top: 40px;
  opacity: 0.5;
}

.wc-mock-bar {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 6px;
  height: 14px;
}

.wc-mock-bar--long { width: 70%; }
.wc-mock-bar--medium { width: 50%; }
.wc-mock-bar--short { width: 30%; }

.wc-mock-block {
  background: rgba(0, 0, 0, 0.04);
  border-radius: 10px;
  height: 80px;
  width: 60%;
}

/* Widget */
.wc-widget {
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.14);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: absolute;
  width: 320px;
}

.wc-widget--tall {
  max-height: calc(100% - 40px);
  min-height: 600px;
}

.wc-widget__header {
  align-items: center;
  background: #fff;
  color: var(--agent-color-text-primary);
  display: flex;
  flex-shrink: 0;
  justify-content: space-between;
  padding: 14px 16px;
}

.wc-widget__close-btn {
  align-items: center;
  background: none;
  border: none;
  border-radius: 50%;
  color: var(--agent-color-text-secondary, #666);
  cursor: pointer;
  display: flex;
  flex-shrink: 0;
  height: 28px;
  justify-content: center;
  transition: background 0.15s, color 0.15s;
  width: 28px;
}

.wc-widget__close-btn:hover {
  background: var(--agent-color-bg-hover, rgba(0, 0, 0, 0.06));
  color: var(--agent-color-text-primary, #333);
}

.wc-widget__header-left {
  align-items: center;
  display: flex;
  gap: 10px;
  min-width: 0;
}

.wc-widget__chat-avatar-wrap {
  display: inline-flex;
  flex-shrink: 0;
  position: relative;
}

.wc-widget__avatar-img {
  border-radius: 50%;
  flex-shrink: 0;
  height: 34px;
  object-fit: cover;
  width: 34px;
}

.wc-widget__header-info {
  align-items: center;
  display: flex;
  gap: 6px;
}

.wc-widget__back-btn {
  align-items: center;
  color: var(--agent-color-text-secondary);
  display: inline-flex;
}

.wc-widget__chat-avatar {
  align-items: center;
  background: #42b4f5;
  border-radius: 50%;
  color: #fff;
  display: flex;
  font-size: 12px;
  height: 28px;
  justify-content: center;
  width: 28px;
}

.wc-widget__chat-avatar-img {
  border-radius: 50%;
  display: block;
  flex-shrink: 0;
  height: 28px;
  object-fit: cover;
  width: 28px;
}

.wc-widget__chat-title {
  font-size: 13px;
  font-weight: var(--agent-font-weight-semibold);
}

.wc-widget__chat-avatar-status {
  background: #22c55e;
  border: 2px solid #fff;
  border-radius: 50%;
  bottom: -1px;
  height: 10px;
  position: absolute;
  right: -1px;
  width: 10px;
}

.wc-widget__online-indicator {
  background: #f04438;
  border-radius: 50%;
  flex-shrink: 0;
  height: 10px;
  width: 10px;
}

.wc-widget__brand-name {
  font-size: 13px;
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.wc-widget__online-dot {
  background: #4ade80;
  border: 2px solid rgba(255, 255, 255, 0.5);
  border-radius: 50%;
  display: inline-block;
  height: 8px;
  width: 8px;
}

.wc-widget__header-actions {
  display: flex;
  gap: 10px;
  flex-shrink: 0;
}

.wc-widget__header-btn {
  cursor: pointer;
  font-size: 16px;
  line-height: 1;
  opacity: 0.7;
}

.wc-widget__header-btn--dots {
  font-size: 20px;
  font-weight: 700;
  letter-spacing: 1px;
}

/* Session list */
.wc-widget__session-list {
  background: #fff;
  display: flex;
  flex: 1;
  flex-direction: column;
  overflow-y: auto;
  padding: 8px 0;
}

.wc-session-item {
  align-items: center;
  display: flex;
  gap: 12px;
  padding: 12px 26px;
  position: relative;
  transition: background 0.15s;
}

.wc-session-item:hover {
  background: #f8f9fb;
}

.wc-session-item__avatar {
  align-items: center;
  border-radius: 50%;
  color: #fff;
  display: flex;
  flex-shrink: 0;
  font-size: 16px;
  font-weight: 700;
  height: 42px;
  justify-content: center;
  width: 42px;
}

.wc-session-item__avatar-img {
  border-radius: 50%;
  flex-shrink: 0;
  height: 42px;
  object-fit: cover;
  width: 42px;
}

.wc-session-item__body {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.wc-session-item__top {
  align-items: center;
  display: flex;
  justify-content: space-between;
}

.wc-session-item__name {
  color: var(--agent-color-text-primary);
  font-size: 14px;
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.wc-session-item__time {
  color: var(--agent-color-text-tertiary);
  flex-shrink: 0;
  font-size: 12px;
}

.wc-session-item__bottom {
  align-items: center;
  display: flex;
  justify-content: space-between;
}

.wc-session-item__msg {
  color: var(--agent-color-text-tertiary);
  font-size: 13px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.wc-session-item__badge {
  align-items: center;
  background: #f04438;
  border-radius: 999px;
  color: #fff;
  display: inline-flex;
  flex-shrink: 0;
  font-size: 11px;
  font-weight: 600;
  height: 20px;
  justify-content: center;
  min-width: 20px;
  padding: 0 5px;
}

.wc-session-item__delete {
  align-items: center;
  background: transparent;
  border: none;
  color: #98a2b3;
  cursor: pointer;
  display: inline-flex;
  height: 20px;
  justify-content: center;
  left: 4px;
  opacity: 0;
  padding: 0;
  pointer-events: none;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  transition: opacity 0.15s, color 0.15s;
  width: 20px;
}

.wc-session-item--deletable:hover .wc-session-item__delete,
.wc-session-item__delete--visible {
  opacity: 1;
  pointer-events: auto;
}

.wc-session-item__delete:hover {
  color: #f04438;
}

.wc-widget__new-session-btn {
  background: var(--agent-color-brand-primary);
  border-radius: 999px;
  color: #fff;
  cursor: pointer;
  flex-shrink: 0;
  font-size: 14px;
  font-weight: 600;
  margin: 10px 16px 14px;
  padding: 14px;
  text-align: center;
}

/* Messages */
.wc-widget__queue-banner {
  align-items: center;
  background: #eef4ff;
  color: #2f6bff;
  display: flex;
  flex-shrink: 0;
  font-size: 11px;
  font-weight: 500;
  gap: 6px;
  justify-content: center;
  padding: 8px 12px;
}

.wc-widget__queue-banner-icon {
  flex-shrink: 0;
}

.wc-widget__messages {
  background: #f5f5f5;
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 10px;
  min-height: 160px;
  padding: 14px;
}

.wc-widget__msg {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.wc-widget__msg--visitor { align-items: flex-end; }

.wc-widget__msg-time {
  color: var(--agent-color-text-tertiary);
  font-size: 10px;
  line-height: 1;
}

.wc-widget__msg-bubble {
  background: #fff;
  border-radius: 12px;
  color: var(--agent-color-text-primary);
  font-size: 12px;
  line-height: 1.5;
  max-width: 200px;
  padding: 8px 12px;
}

.wc-widget__msg-img {
  border-radius: 8px;
  display: block;
  height: 80px;
  object-fit: cover;
  width: 80px;
}

.wc-widget__msg-bubble--visitor {
  background: var(--agent-color-brand-primary);
  color: #fff;
}

.wc-widget__msg-tag {
  background: rgba(47, 107, 255, 0.1);
  border-radius: 4px;
  color: var(--agent-color-brand-primary);
  display: block;
  font-size: 10px;
  font-weight: 600;
  margin-bottom: 4px;
  padding: 1px 5px;
  width: fit-content;
}

.wc-widget__read-receipt {
  color: var(--agent-color-text-tertiary);
  font-size: 10px;
  text-align: right;
}

.wc-widget__read-receipt--status {
  color: #2f6bff;
  display: inline-flex;
  margin-top: 2px;
  text-align: left;
}

.wc-widget__read-receipt-icon {
  display: block;
}

/* Quick access in widget */
.wc-widget__quick-access {
  background: #fff;
  border-top: 1px solid var(--agent-color-border-default);
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  padding: 8px 14px;
}

.wc-widget__qa-tag {
  background: #f0f2f5;
  border-radius: 999px;
  color: var(--agent-color-text-secondary);
  font-size: 10px;
  padding: 3px 10px;
}

/* Input area */
.wc-widget__input-area {
  background: transparent;
  border: 0;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  gap: 12px;
  margin: 0 8px 8px;
  padding: 12px 0 8px;
}

.wc-widget__input-box {
  color: rgba(100, 116, 145, 0.5);
  font-size: 12px;
  line-height: 1.4;
  min-height: 1px;
  padding: 0 14px;
}

.wc-widget__input-toolbar {
  align-items: center;
  display: flex;
  justify-content: space-between;
  padding: 0 8px;
}

.wc-widget__toolbar-icons {
  align-items: center;
  display: flex;
}

.wc-widget__toolbar-icon {
  align-items: center;
  border-radius: 10px;
  color: #4a5568;
  display: inline-flex;
  height: 34px;
  justify-content: center;
  width: 34px;
}

.wc-widget__toolbar-icon--bg {
  background: #f5f7f9;
  border-radius: 9px;
}

.wc-widget__send-btn {
  align-items: center;
  background: #f2f4f8;
  border-radius: 50%;
  color: #8c96a6;
  display: inline-flex;
  flex-shrink: 0;
  height: 32px;
  justify-content: center;
  width: 32px;
}

/* Footer */
.wc-widget__footer {
  background: #fff;
  color: var(--agent-color-text-tertiary);
  flex-shrink: 0;
  font-size: 10px;
  padding: 6px;
  text-align: center;
}

.wc-widget__dialog-mask {
  align-items: center;
  background: rgba(15, 23, 42, 0.24);
  display: flex;
  inset: 0;
  justify-content: center;
  padding: 20px;
  position: absolute;
  z-index: 2;
}

.wc-widget__dialog {
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.2);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  max-width: 272px;
  padding: 18px;
  width: 100%;
}

.wc-widget__dialog-head {
  align-items: center;
  display: flex;
  justify-content: center;
  position: relative;
  width: 100%;
}

.wc-widget__dialog-title {
  color: var(--agent-color-text-primary);
  font-size: 16px;
  font-weight: 600;
  margin: 0;
}

.wc-widget__dialog-close {
  align-items: center;
  background: transparent;
  border: 0;
  border-radius: 999px;
  color: #98a2b3;
  cursor: pointer;
  display: inline-flex;
  height: 24px;
  justify-content: center;
  padding: 0;
  position: absolute;
  right: 0;
  width: 24px;
}

.wc-widget__dialog-option {
  align-items: center;
  color: var(--agent-color-text-primary);
  display: inline-flex;
  font-size: 14px;
  gap: 8px;
}

.wc-widget__dialog-checkbox {
  accent-color: var(--agent-color-brand-primary);
  height: 16px;
  width: 16px;
}

.wc-widget__dialog-actions {
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  width: 100%;
}

.wc-widget__dialog-btn {
  border: 1px solid transparent;
  border-radius: 10px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  padding: 10px 0;
}

.wc-widget__dialog-btn--ghost {
  background: #f2f4f7;
  color: var(--agent-color-text-secondary);
}

.wc-widget__dialog-btn--primary {
  background: #f04438;
  color: #fff;
}

/* Feedback preview */
.wc-widget__feedback-area {
  background: linear-gradient(180deg, #e8f0fe 0%, #f5f8ff 100%);
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: 16px;
}

.wc-widget__feedback-card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  padding: 18px 16px;
}

.wc-widget__feedback-title {
  color: var(--agent-color-text-primary);
  font-size: 12px;
  font-weight: var(--agent-font-weight-semibold);
  margin: 0;
  text-align: center;
}

.wc-widget__feedback-options {
  display: flex;
  gap: 24px;
  justify-content: center;
}

.wc-widget__feedback-option {
  align-items: center;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.wc-widget__feedback-emoji {
  font-size: 26px;
  line-height: 1;
  filter: grayscale(0.8);
  transition: filter 0.15s;
}

.wc-widget__feedback-option:hover .wc-widget__feedback-emoji {
  filter: grayscale(0);
}

.wc-widget__feedback-label {
  color: var(--agent-color-text-secondary);
  font-size: 10px;
}

.wc-widget__session-ended-btn {
  background: #e8f0fe;
  border-radius: 8px;
  color: var(--agent-color-brand-primary);
  font-size: 12px;
  font-weight: var(--agent-font-weight-medium);
  margin: 0 12px 10px;
  padding: 10px;
  text-align: center;
}

/* Form card (inside chat message) */
.wc-widget__form-card {
  background: #fff;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 24px 20px;
  width: 100%;
}

.wc-widget__form-card-title {
  color: #222;
  font-size: 12px;
  line-height: 1.6;
  margin: 0;
}

.wc-widget__form-card-fields {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.wc-widget__form-card-field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.wc-widget__form-card-label {
  color: #222;
  font-size: 11px;
  line-height: 1.4;
}

.wc-widget__form-card-required {
  color: #ff382e;
  font-weight: 500;
  margin-right: 2px;
}

.wc-widget__form-card-input {
  background: #fff;
  border: 1px solid #e2e8ef;
  border-radius: 12px;
  color: #222;
  font-size: 11px;
  height: 34px;
  line-height: 34px;
  padding: 0 12px;
}

.wc-widget__form-card-submit {
  background: var(--agent-color-brand-primary);
  border-radius: 12px;
  color: #fff;
  font-size: 12px;
  font-weight: 600;
  padding: 10px;
  text-align: center;
}

/* Minimized FAB */
.wc-widget-fab {
  align-items: center;
  background: var(--agent-color-brand-primary);
  border-radius: 50%;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.18);
  color: #fff;
  cursor: pointer;
  display: flex;
  height: 56px;
  justify-content: center;
  position: absolute;
  transition: transform 0.2s;
  width: 56px;
}

.wc-widget-fab:hover {
  transform: scale(1.08);
}

/* ── Crop Modal ── */
.wc-crop-overlay {
  align-items: center;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  inset: 0;
  justify-content: center;
  position: fixed;
  z-index: var(--agent-z-modal, 1000);
}

.wc-crop-modal {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  gap: var(--agent-space-16);
  max-width: 420px;
  padding: var(--agent-space-24);
  width: 90vw;
}

.wc-crop-modal__title {
  color: var(--agent-color-text-primary);
  font-size: var(--agent-font-size-md);
  font-weight: var(--agent-font-weight-semibold);
  margin: 0;
}

.wc-crop-modal__canvas {
  align-items: center;
  background: var(--agent-color-bg-muted);
  border-radius: 12px;
  display: flex;
  justify-content: center;
  min-height: 200px;
  overflow: hidden;
  padding: var(--agent-space-16);
}

.wc-crop-modal__img {
  border-radius: 8px;
  max-height: 280px;
  max-width: 100%;
  object-fit: contain;
}

.wc-crop-modal__actions {
  display: flex;
  gap: var(--agent-space-12);
  justify-content: flex-end;
}

/* Responsive */
@media (max-width: 900px) {
  .widget-customize {
    grid-template-columns: 1fr;
    grid-template-rows: 1fr 1fr;
  }
}
</style>
