<template>
  <section class="widget-customize" @click="closeAddFieldMenu">
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
                <button type="button" class="wc-quick-tag wc-quick-tag--add" @click="openQuickAccessModal">
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
                  <span class="wc-quick-tag__edit" aria-hidden="true" @click="editQuickAccess(item)">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M4 20h4l10-10-4-4L4 16v4z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" /><path d="M13 7l4 4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" /></svg>
                  </span>
                  <button type="button" class="wc-quick-tag__remove" @click="removeQuickAccess(item.id)">
                    <svg width="8" height="8" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" /></svg>
                  </button>
                </div>
              </div>
          </div>
        </article>

        <article class="wc-accordion" :class="{ 'wc-accordion--open': openSection === 'chatPageHero' }">
          <div class="wc-accordion__trigger wc-accordion__trigger--chat-page" @click="toggleSection('chatPageHero')">
            <div class="wc-accordion__trigger-text">
              <h3 class="wc-card__title">聊天页面</h3>
              <p class="wc-card__desc">设置聊天页面左侧的品牌介绍内容，关闭后聊天窗口将居中显示</p>
            </div>
            <AgentSwitch v-model="showChatPageHero" @click.stop @update:model-value="autoSave" />
            <span class="wc-accordion__chevron" />
          </div>
          <div v-if="openSection === 'chatPageHero' && showChatPageHero" class="wc-accordion__body">
            <div class="wc-form-title-row wc-form-title-row--inline wc-form-title-row--image">
              <label class="wc-label">图片</label>
              <div class="wc-form-title-row__content">
                <div class="wc-logo-wrap" @click="triggerChatPageHeroImageUpload">
                  <img :src="currentChatPageHeroImage" class="wc-logo-wrap__img" alt="聊天页面图片" />
                  <div class="wc-logo-wrap__overlay">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" />
                    </svg>
                    <span>替换</span>
                  </div>
                  <input
                    ref="chatPageHeroImageInputRef"
                    type="file"
                    accept="image/png,image/jpeg,image/jpg"
                    class="wc-logo-wrap__file"
                    @change="handleChatPageHeroImageChange"
                  />
                </div>
              </div>
            </div>

            <div class="wc-form-title-row wc-form-title-row--inline">
              <label class="wc-label">标题</label>
              <div class="wc-form-title-row__content">
                <input
                  v-model="chatPageHeroTitle[globalLang]"
                  class="agent-input wc-input"
                  placeholder="输入标题..."
                  @blur="autoSave"
                />
              </div>
            </div>

            <div class="wc-form-title-row wc-form-title-row--inline">
              <label class="wc-label">描述</label>
              <div class="wc-form-title-row__content">
                <div class="wc-rich-editor">
                  <textarea
                    v-model="chatPageHeroDesc[globalLang]"
                    class="wc-rich-editor__textarea wc-chat-page-hero__textarea"
                    rows="4"
                    placeholder="输入描述..."
                    @blur="autoSave"
                  />
                </div>
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
            <AgentSwitch :model-value="autoReplyToggles[block.key]" @click.stop @update:model-value="(enabled) => handleAutoReplyToggle(block.key, enabled)" />
          </button>
          <div v-if="openSection === block.key && autoReplyToggles[block.key]" class="wc-accordion__body">
              <div class="wc-rich-editor">
                <textarea
                  v-model="autoReplyTexts[block.key][globalLang]"
                  class="wc-rich-editor__textarea"
                  rows="4"
                  @blur="autoSave"
                />
                <div v-if="block.key === 'welcome'" class="wc-welcome-btns">
                  <label class="wc-modal__label">快捷按钮</label>
                  <div class="wc-welcome-btns__list">
                    <div v-for="btn in welcomeButtons[globalLang]" :key="btn.id" class="wc-welcome-btns__tag" @click="editWelcomeBtn(btn)">
                      <span class="wc-welcome-btns__tag-label">{{ btn.label }}</span>
                      <button type="button" class="wc-welcome-btns__remove" @click.stop="removeWelcomeBtn(btn.id)">
                        <svg width="8" height="8" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" /></svg>
                      </button>
                    </div>
                    <button v-if="welcomeButtons[globalLang].length < 5" type="button" class="wc-welcome-btns__add" @click="openWelcomeBtnModal">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round" /></svg>
                      <span>添加按钮</span>
                    </button>
                  </div>
                  <p class="wc-upload-hint">最多添加 5 个快捷按钮，访客点击后触发对应动作</p>
                </div>
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
              <h3 class="wc-card__title">会话评价</h3>
              <p class="wc-card__desc">会话评价作为快捷入口始终可见，评价需会话已创建且非排队中</p>
            </div>
            <AgentSwitch :model-value="feedbackEnabled" @click.stop @update:model-value="handleVisitorFeedbackToggle" />
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
        <article class="wc-accordion wc-accordion--form" :class="{ 'wc-accordion--open': openSection === 'sessionForm' }">
          <button type="button" class="wc-accordion__trigger" @click="toggleSection('sessionForm')">
            <div class="wc-accordion__trigger-text">
              <h3 class="wc-card__title">会话前表单</h3>
              <p class="wc-card__desc">在访客开始会话之前收集必要的信息，帮助客服更好地提供服务</p>
            </div>
            <AgentSwitch :model-value="settings.enableSessionForm" @click.stop @update:model-value="handleSessionFormToggle" />
          </button>
          <div v-if="openSection === 'sessionForm' && settings.enableSessionForm" class="wc-accordion__body">
            <div class="wc-form-title-row">
              <label class="wc-label">表单标题</label>
              <input v-model="settings.formTitle[globalLang]" class="agent-input wc-input" placeholder="欢迎！请填写以下信息。" @blur="autoSave" />
            </div>
            <div class="wc-form-fields-section">
              <label class="wc-label">表单字段</label>
              <div class="wc-form-fields">
                <div v-for="(field, idx) in settings.formFields" :key="field.id" class="wc-form-field-row">
                  <div class="wc-form-field-row__main">
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
                      <button type="button" class="wc-form-field-delete" @click="toggleDeleteConfirm('session', idx)">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                          <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                      </button>
                      <div v-if="isDeleteConfirmOpen('session', idx)" class="wc-popconfirm">
                        <p class="wc-popconfirm__text">确定删除该字段吗？</p>
                        <div class="wc-popconfirm__actions">
                          <button type="button" class="wc-popconfirm__btn wc-popconfirm__btn--cancel" @click="deleteConfirmKey = null">取消</button>
                          <button type="button" class="wc-popconfirm__btn wc-popconfirm__btn--confirm" @click="confirmRemoveFormField('session', idx)">确定</button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div v-if="field.type === 'select'" class="wc-form-select-panel">
                    <div v-for="(option, optionIdx) in field.options || []" :key="option.id" class="wc-form-select-option-row">
                      <span class="wc-form-select-option-row__line" aria-hidden="true" />
                      <span class="wc-form-select-option-row__label">选项</span>
                      <input
                        v-model="option.value[globalLang]"
                        class="agent-input wc-input wc-form-select-option-input"
                        placeholder="请输入选项"
                        @blur="autoSave"
                      />
                      <button
                        type="button"
                        class="wc-form-field-delete wc-form-select-option-delete"
                        :disabled="(field.options?.length || 0) <= 1"
                        @click="removeSelectOption('session', idx, optionIdx)"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                          <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                      </button>
                    </div>
                    <button type="button" class="wc-add-option-btn" @click="addSelectOption('session', idx)">
                      <span class="wc-add-option-btn__icon" aria-hidden="true">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" /></svg>
                      </span>
                      <span>添加选项</span>
                    </button>
                  </div>
                </div>
              </div>
              <div class="wc-add-field-wrap" @click.stop>
                <button
                  type="button"
                  class="wc-add-field-btn"
                  :class="{ 'wc-add-field-btn--active': activeAddFieldMenu === 'session' }"
                  @click.stop="toggleAddFieldMenu('session')"
                >
                  <span class="wc-add-field-btn__icon" aria-hidden="true">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" /></svg>
                  </span>
                  <span>添加字段</span>
                </button>
                <div v-if="activeAddFieldMenu === 'session'" class="wc-add-field-menu">
                  <button
                    v-for="option in formFieldOptions"
                    :key="`session-${option.type}`"
                    type="button"
                    class="wc-add-field-menu__item"
                    :class="{ 'wc-add-field-menu__item--disabled': isFormFieldOptionDisabled('session', option.type) }"
                    :disabled="isFormFieldOptionDisabled('session', option.type)"
                    @click.stop="addFormField('session', option.type)"
                  >
                    {{ option.label }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </article>

        <article class="wc-accordion wc-accordion--form" :class="{ 'wc-accordion--open': openSection === 'offlineForm' }">
          <button type="button" class="wc-accordion__trigger" @click="toggleSection('offlineForm')">
            <div class="wc-accordion__trigger-text">
              <h3 class="wc-card__title">全员离线表单</h3>
              <p class="wc-card__desc">当全部客服不在线时，访客可填写表单留下联系方式和问题</p>
            </div>
            <AgentSwitch v-model="settings.enableOfflineForm" @click.stop @update:model-value="autoSave" />
          </button>
          <div v-if="openSection === 'offlineForm' && settings.enableOfflineForm" class="wc-accordion__body">
            <div class="wc-form-title-row">
              <label class="wc-label">表单标题</label>
              <input v-model="settings.offlineFormTitle[globalLang]" class="agent-input wc-input" placeholder="当前客服均不在线，请留下您的联系方式和问题。" @blur="autoSave" />
            </div>
            <div class="wc-form-fields-section">
              <label class="wc-label">表单字段</label>
              <div class="wc-form-fields">
                <div v-for="(field, idx) in settings.offlineFormFields" :key="field.id" class="wc-form-field-row">
                  <div class="wc-form-field-row__main">
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
                      <button type="button" class="wc-form-field-delete" @click="toggleDeleteConfirm('offline', idx)">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                          <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                      </button>
                      <div v-if="isDeleteConfirmOpen('offline', idx)" class="wc-popconfirm">
                        <p class="wc-popconfirm__text">确定删除该字段吗？</p>
                        <div class="wc-popconfirm__actions">
                          <button type="button" class="wc-popconfirm__btn wc-popconfirm__btn--cancel" @click="deleteConfirmKey = null">取消</button>
                          <button type="button" class="wc-popconfirm__btn wc-popconfirm__btn--confirm" @click="confirmRemoveFormField('offline', idx)">确定</button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div v-if="field.type === 'select'" class="wc-form-select-panel">
                    <div v-for="(option, optionIdx) in field.options || []" :key="option.id" class="wc-form-select-option-row">
                      <span class="wc-form-select-option-row__line" aria-hidden="true" />
                      <span class="wc-form-select-option-row__label">选项</span>
                      <input
                        v-model="option.value[globalLang]"
                        class="agent-input wc-input wc-form-select-option-input"
                        placeholder="请输入选项"
                        @blur="autoSave"
                      />
                      <button
                        type="button"
                        class="wc-form-field-delete wc-form-select-option-delete"
                        :disabled="(field.options?.length || 0) <= 1"
                        @click="removeSelectOption('offline', idx, optionIdx)"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                          <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                      </button>
                    </div>
                    <button type="button" class="wc-add-option-btn" @click="addSelectOption('offline', idx)">
                      <span class="wc-add-option-btn__icon" aria-hidden="true">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" /></svg>
                      </span>
                      <span>添加选项</span>
                    </button>
                  </div>
                </div>
              </div>
              <div class="wc-add-field-wrap" @click.stop>
                <button
                  type="button"
                  class="wc-add-field-btn"
                  :class="{ 'wc-add-field-btn--active': activeAddFieldMenu === 'offline' }"
                  @click.stop="toggleAddFieldMenu('offline')"
                >
                  <span class="wc-add-field-btn__icon" aria-hidden="true">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" /></svg>
                  </span>
                  <span>添加字段</span>
                </button>
                <div v-if="activeAddFieldMenu === 'offline'" class="wc-add-field-menu">
                  <button
                    v-for="option in formFieldOptions"
                    :key="`offline-${option.type}`"
                    type="button"
                    class="wc-add-field-menu__item"
                    :class="{ 'wc-add-field-menu__item--disabled': isFormFieldOptionDisabled('offline', option.type) }"
                    :disabled="isFormFieldOptionDisabled('offline', option.type)"
                    @click.stop="addFormField('offline', option.type)"
                  >
                    {{ option.label }}
                  </button>
                </div>
              </div>
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
          </div>
        </article>

        <article class="wc-accordion" :class="{ 'wc-accordion--open': openSection === 'agentInfoDisplay' }">
          <button type="button" class="wc-accordion__trigger" @click="toggleSection('agentInfoDisplay')">
            <div class="wc-accordion__trigger-text">
              <h3 class="wc-card__title">会话标题</h3>
              <p class="wc-card__desc">设置访客端会话标题展示方式</p>
            </div>
            <span class="wc-accordion__chevron" />
          </button>
          <div v-if="openSection === 'agentInfoDisplay'" class="wc-accordion__body">
            <div class="wc-title-mode-options wc-title-mode-options--horizontal">
              <label class="wc-title-mode-option" :class="{ 'wc-title-mode-option--active': settings.sessionTitleMode === 'ai' }">
                <input v-model="settings.sessionTitleMode" type="radio" value="ai" class="wc-title-mode-option__radio" @change="autoSave" />
                <span class="wc-title-mode-option__indicator" />
                <div class="wc-title-mode-option__text">
                  <span class="wc-title-mode-option__title">AI 生成会话标题</span>
                  <span class="wc-title-mode-option__desc">由 AI 根据会话内容自动生成标题</span>
                </div>
              </label>
              <label class="wc-title-mode-option" :class="{ 'wc-title-mode-option--active': settings.sessionTitleMode === 'agent' }">
                <input v-model="settings.sessionTitleMode" type="radio" value="agent" class="wc-title-mode-option__radio" @change="autoSave" />
                <span class="wc-title-mode-option__indicator" />
                <div class="wc-title-mode-option__text">
                  <span class="wc-title-mode-option__title">客服信息</span>
                  <span class="wc-title-mode-option__desc">展示会话负责人信息</span>
                </div>
              </label>
            </div>
          </div>
        </article>

        <article class="wc-flat-card">
          <div class="wc-flat-card__text">
            <h3 class="wc-card__title">排队提醒</h3>
            <p class="wc-card__desc">访客进入排队时，消息顶部显示当前排队信息</p>
          </div>
          <AgentSwitch :model-value="settings.showQueuePosition" @update:model-value="handleQueueReminderToggle" />
        </article>

        <article class="wc-flat-card">
          <div class="wc-flat-card__text">
            <h3 class="wc-card__title">主动会话提醒</h3>
            <p class="wc-card__desc">客服主动创建会话时，在聊天图标上方展示消息气泡</p>
          </div>
          <AgentSwitch :model-value="settings.enableProactiveInvite" @update:model-value="handleProactiveInviteToggle" />
        </article>

        <article class="wc-accordion" :class="{ 'wc-accordion--open': openSection === 'visitorInactive' }">
          <button type="button" class="wc-accordion__trigger" @click="toggleSection('visitorInactive')">
            <div class="wc-accordion__trigger-text">
              <h3 class="wc-card__title">访客不活跃</h3>
            </div>
            <AgentSwitch :model-value="settings.enableVisitorInactive" @click.stop @update:model-value="handleVisitorInactiveToggle" />
          </button>
          <div v-if="openSection === 'visitorInactive' && settings.enableVisitorInactive" class="wc-accordion__body">
            <div class="wc-visitor-inactive-row">
              <div class="wc-visitor-inactive-row__text">
                <span>当访客超过</span>
                <TimeDurationInput v-model="settings.visitorInactiveSeconds" @update:model-value="autoSave" />
                <span>未回复客服消息时，会话会自动关闭</span>
              </div>
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
        <span class="wc-preview__title">预览</span>
        <select v-model="previewMode" class="agent-input wc-preview-select">
          <option value="sessionList">首页</option>
          <option value="chat">消息</option>
          <option value="form">表单</option>
          <option value="chatPage">聊天页面</option>
          <option value="minimized">最小化</option>
        </select>
      </header>

      <div class="wc-preview__canvas" :class="{ 'wc-preview__canvas--chat-page': previewMode === 'chatPage' }">
        <div v-if="previewMode !== 'chatPage'" class="wc-preview__page-mock">
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
              <span class="wc-widget__brand-name">{{ settings.brandName || tenant.name }}</span>
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
              <template v-if="settings.sessionTitleMode === 'agent'">
                <img :src="DEFAULT_AVATAR" class="wc-session-item__avatar-img" alt="" />
              </template>
              <div v-else class="wc-session-item__avatar" :style="{ background: session.avatarColor }">{{ session.avatarLabel }}</div>
              <div class="wc-session-item__body">
                <div class="wc-session-item__top">
                  <span class="wc-session-item__name">{{ settings.sessionTitleMode === 'agent' ? agentSessionTitles[globalLang] : aiGeneratedTitles[globalLang] }}</span>
                  <span class="wc-session-item__time">{{ session.time }}</span>
                </div>
                <div class="wc-session-item__bottom">
                  <span class="wc-session-item__msg">{{ sessionListMessages[globalLang] }}</span>
                  <span v-if="session.unread > 0" class="wc-session-item__badge">{{ session.unread }}</span>
                </div>
              </div>
            </div>
          </div>
          <div v-if="settings.enableStartSession" class="wc-widget__new-session-btn">{{ currentWidgetLocaleText.newConversation }}</div>
          <div v-if="!settings.hideBrandLogo" class="wc-widget__footer">Powered by <strong>Chat</strong></div>
          <div v-if="deleteSessionPreviewModalOpen" class="wc-widget__dialog-mask" @click="closeDeleteSessionPreview">
            <div class="wc-widget__dialog" @click.stop>
              <div class="wc-widget__dialog-head">
                <h4 class="wc-widget__dialog-title">{{ currentWidgetLocaleText.deleteSession }}</h4>
                <button type="button" class="wc-widget__dialog-close" aria-label="关闭删除会话弹窗" @click="closeDeleteSessionPreview">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M18 6 6 18M6 6l12 12" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" /></svg>
                </button>
              </div>
              <label v-if="settings.enableEndSession" class="wc-widget__dialog-option">
                <input v-model="deleteSessionPreviewEndChecked" type="checkbox" class="wc-widget__dialog-checkbox" />
                <span>{{ currentWidgetLocaleText.endSessionTogether }}</span>
              </label>
              <div class="wc-widget__dialog-actions">
                <button type="button" class="wc-widget__dialog-btn wc-widget__dialog-btn--ghost" @click="closeDeleteSessionPreview">{{ currentWidgetLocaleText.cancel }}</button>
                <button type="button" class="wc-widget__dialog-btn wc-widget__dialog-btn--primary" @click="confirmDeleteSessionPreview">{{ currentWidgetLocaleText.confirm }}</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Chat Preview Widget -->
        <div v-else-if="previewMode === 'chat'" class="wc-widget wc-widget--tall wc-widget--chat-preview" :style="widgetPositionStyle">
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

          <!-- Chat content -->
            <div class="wc-widget__messages">
              <div v-if="settings.showQueuePosition" class="wc-widget__queue-pill">
                <span>{{ queueTexts[globalLang].prefix }}<strong class="wc-widget__queue-pill-num">3</strong>{{ queueTexts[globalLang].suffix }}</span>
              </div>
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
                <div v-if="!isMsgStatusPreview && welcomePreviewButtons.length > 0 && activeAutoReplyKey === 'welcome'" class="wc-widget__welcome-btns">
                  <span v-for="btn in welcomePreviewButtons" :key="btn.id" class="wc-widget__welcome-btn">{{ btn.label }}</span>
                </div>
                <div v-if="!isMsgStatusPreview" v-for="(src, idx) in chatPreviewImages" :key="idx" class="wc-widget__msg wc-widget__msg--agent">
                  <img :src="src" class="wc-widget__msg-img" alt="" />
                </div>
              </template>
            </div>
            <div v-if="showPreviewActionStrip" class="wc-widget__action-strip">
              <div v-if="feedbackEnabled" class="wc-widget__action-pill wc-widget__action-pill--feedback">
                <span class="wc-widget__action-pill-icon wc-widget__action-pill-icon--image" aria-hidden="true">
                  <img :src="feedbackQuickAccessIcon" alt="" />
                </span>
                <span class="wc-widget__action-pill-label">{{ currentWidgetLocaleText.feedbackEntry }}</span>
              </div>
              <div v-for="item in (openSection === 'visitorFeedback' ? [] : previewQuickAccessItems)" :key="item.id" class="wc-widget__action-pill">
                <span
                  class="wc-widget__action-pill-icon"
                  :class="{
                    'wc-widget__action-pill-icon--image': isImageIcon(item.icon),
                    'wc-widget__action-pill-icon--emoji': item.icon && !isImageIcon(item.icon)
                  }"
                  aria-hidden="true"
                >
                  <img v-if="item.icon && isImageIcon(item.icon)" :src="item.icon" alt="" />
                  <span v-else>{{ item.icon || item.label.slice(0, 1) }}</span>
                </span>
                <span v-if="item.label" class="wc-widget__action-pill-label">{{ item.label }}</span>
              </div>
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
              <span class="wc-widget__chat-title">{{ currentWidgetLocaleText.newConversation }}</span>
            </div>
            <button type="button" class="wc-widget__close-btn" aria-label="最小化" @click="minimizeWidget">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" /></svg>
            </button>
          </div>
          <div class="wc-widget__messages">
            <div v-if="isOfflineFormPreview && previewOfflineFormMessage" class="wc-widget__msg wc-widget__msg--agent">
              <span class="wc-widget__msg-time">10:32</span>
              <div class="wc-widget__msg-bubble">
                {{ previewOfflineFormMessage }}
              </div>
            </div>
            <div class="wc-widget__msg wc-widget__msg--agent">
              <span class="wc-widget__msg-time">{{ isOfflineFormPreview ? '10:33' : '10:32' }}</span>
              <div v-if="previewFormEnabled" class="wc-widget__form-card">
                <div v-if="isOfflineFormPreview" class="wc-widget__form-scene-chip">{{ currentWidgetLocaleText.offlineChip }}</div>
                <p class="wc-widget__form-card-title">{{ previewFormTitle }}</p>
                <div class="wc-widget__form-card-fields">
                  <div v-for="field in previewFormFields" :key="field.id" class="wc-widget__form-card-field">
                    <label class="wc-widget__form-card-label">
                      <span v-if="field.required" class="wc-widget__form-card-required">*</span>{{ field.label[globalLang] }}
                    </label>
                    <div class="wc-widget__form-card-input">{{ field.placeholder[globalLang] }}</div>
                  </div>
                </div>
                <div class="wc-widget__form-card-submit">{{ currentWidgetLocaleText.submit }}</div>
              </div>
              <div v-else class="wc-widget__form-empty">
                <strong class="wc-widget__form-empty-title">{{ previewFormEmptyTitle }}</strong>
                <p class="wc-widget__form-empty-text">{{ previewFormEmptyText }}</p>
              </div>
            </div>
          </div>
          <div v-if="!settings.hideBrandLogo" class="wc-widget__footer">Powered by <strong>Chat</strong></div>
        </div>

        <div v-else-if="previewMode === 'chatPage'" class="wc-chat-page-preview" :class="{ 'wc-chat-page-preview--hero-hidden': !showChatPageHero }">
          <div v-if="showChatPageHero" class="wc-chat-page-preview__hero">
            <img :src="currentChatPageHeroImage" class="wc-chat-page-preview__hero-image" alt="聊天页面图片" />
            <h2 class="wc-chat-page-preview__hero-title">{{ chatPageHeroTitle[globalLang] }}</h2>
            <p class="wc-chat-page-preview__hero-desc">{{ chatPageHeroDesc[globalLang] }}</p>
          </div>

          <div class="wc-chat-page-preview__panel-wrap">
            <section class="wc-chat-page-preview__panel">
              <header class="wc-chat-page-preview__panel-head">
                <div class="wc-chat-page-preview__brand">
                  <img :src="settings.brandLogoUrl" class="wc-chat-page-preview__brand-logo" alt="" />
                  <span class="wc-chat-page-preview__brand-name">{{ settings.brandName || tenant.name }}</span>
                </div>
                <button type="button" class="wc-chat-page-preview__panel-menu" aria-label="更多">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <circle cx="6" cy="12" r="1.8" fill="currentColor" />
                    <circle cx="12" cy="12" r="1.8" fill="currentColor" />
                    <circle cx="18" cy="12" r="1.8" fill="currentColor" />
                  </svg>
                </button>
              </header>

              <div class="wc-chat-page-preview__session-list">
                <article v-for="item in chatPagePreviewItems" :key="item.id" class="wc-chat-page-preview__session-item">
                  <div class="wc-chat-page-preview__session-avatar">?</div>
                  <div class="wc-chat-page-preview__session-body">
                    <div class="wc-chat-page-preview__session-top">
                      <span class="wc-chat-page-preview__session-title">{{ item.title }}</span>
                      <span class="wc-chat-page-preview__session-time">{{ item.time }}</span>
                    </div>
                    <p class="wc-chat-page-preview__session-desc">{{ item.desc }}</p>
                  </div>
                </article>
              </div>

              <button type="button" class="wc-chat-page-preview__cta">{{ currentWidgetLocaleText.newConversation }}</button>
              <div v-if="!settings.hideBrandLogo" class="wc-chat-page-preview__footer">Powered by <strong>Chat</strong></div>
            </section>
          </div>
        </div>

        <!-- Minimized Preview -->
        <div v-else class="wc-widget-fab" :style="widgetPositionStyle" @click="restoreWidget">
          <div v-if="settings.enableProactiveInvite" class="wc-invite-bubble-wrap" @click.stop>
            <button type="button" class="wc-invite-bubble__close">&times;</button>
            <div class="wc-invite-bubble" :class="{ 'wc-invite-bubble--agent': settings.sessionTitleMode === 'agent' }">
              <template v-if="settings.sessionTitleMode === 'agent'">
                <img :src="DEFAULT_AVATAR" class="wc-invite-bubble__avatar" alt="" />
                <div class="wc-invite-bubble__agent-body">
                  <span class="wc-invite-bubble__agent-name">{{ proactiveInviteAgentName }}</span>
                  <p class="wc-invite-bubble__text">{{ proactiveInviteMessage }}</p>
                </div>
              </template>
              <p v-else class="wc-invite-bubble__text">{{ proactiveInviteMessage }}</p>
            </div>
          </div>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </div>
      </div>
    </div>

    <!-- Hidden file input for reply image upload -->
    <input ref="replyImageInput" type="file" accept="image/png,image/jpeg,image/jpg" style="display:none" @change="handleReplyImageChange" />

    <!-- Quick Access Modal -->
    <teleport to="body">
      <div v-if="quickAccessModalOpen" class="wc-modal-overlay" @click.self="closeQuickAccessModal">
        <div class="wc-modal">
          <div class="wc-modal__header">
            <h3 class="wc-modal__title">{{ quickAccessEditId ? '编辑快捷入口' : '新建快捷入口' }}</h3>
            <button type="button" class="wc-modal__close" @click="closeQuickAccessModal">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" /></svg>
            </button>
          </div>
          <div class="wc-modal__body">
            <div class="wc-modal__field">
              <label class="wc-modal__label">标题</label>
              <div class="wc-modal__dropdown-wrap">
                <input
                  v-model="quickAccessForm.title"
                  class="wc-modal__input"
                  placeholder="请输入标题"
                  autocomplete="off"
                  @click="openTitleDropdown"
                  @focus="openTitleDropdown"
                  @input="handleTitleInput"
                  @blur="handleTitleBlur"
                />
                <div v-if="titleDropdownOpen" class="wc-modal__dropdown">
                  <div
                    v-for="option in filteredTitleOptions"
                    :key="option"
                    class="wc-modal__dropdown-item"
                    @mousedown.prevent="selectTitle(option)"
                  >
                    {{ option }}
                  </div>
                  <div v-if="filteredTitleOptions.length === 0" class="wc-modal__dropdown-empty">
                    未找到匹配项
                  </div>
                </div>
              </div>
            </div>
            <div class="wc-modal__field">
              <label class="wc-modal__label">图标（非必填）</label>
              <div class="wc-modal__upload-row">
                <div class="wc-modal__upload" :class="{ 'has-icon': quickAccessForm.icon }" @click="quickAccessForm.icon ? null : triggerIconUpload()">
                  <template v-if="quickAccessForm.icon">
                    <div class="wc-modal__upload-preview-wrap">
                      <div v-if="quickAccessForm.icon.startsWith('data:')" class="wc-modal__upload-preview-img">
                        <img :src="quickAccessForm.icon" alt="图标" />
                      </div>
                      <div v-else class="wc-modal__upload-preview-emoji">{{ quickAccessForm.icon }}</div>
                      <button type="button" class="wc-modal__upload-remove" @click.stop="removeIcon">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" /></svg>
                      </button>
                    </div>
                  </template>
                  <div v-else class="wc-modal__upload-placeholder">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round" /></svg>
                  </div>
                  <input ref="iconFileInput" type="file" accept="image/png,image/jpeg,image/jpg" class="wc-modal__upload-input" @change="handleIconUpload" />
                </div>
                <p class="wc-modal__hint">支持 jpg、png格式，大小1MB以内，160x160</p>
              </div>
            </div>
            <div class="wc-modal__field">
              <label class="wc-modal__label">
                交互方式
                <span class="wc-modal__tooltip-trigger" @mouseenter="showTooltip = true" @mouseleave="showTooltip = false">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style="display: inline-block; vertical-align: middle; color: #98a2b3;">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5" />
                    <path d="M12 16v-4M12 8h.01" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                  </svg>
                  <div v-if="showTooltip" class="wc-modal__tooltip">
                    打开链接：访客点击后跳转到指定网页；复制文本：访客点击后复制指定内容；发送消息：访客点击后自动发送预设消息
                  </div>
                </span>
              </label>
              <div class="wc-modal__radio-group">
                <label class="wc-modal__radio">
                  <input v-model="quickAccessForm.actionType" type="radio" name="qa-action" value="link" />
                  <span>打开链接</span>
                </label>
                <label class="wc-modal__radio">
                  <input v-model="quickAccessForm.actionType" type="radio" name="qa-action" value="copy" />
                  <span>复制文本</span>
                </label>
                <label class="wc-modal__radio">
                  <input v-model="quickAccessForm.actionType" type="radio" name="qa-action" value="message" />
                  <span>发送消息</span>
                </label>
              </div>
            </div>
            <div :key="`qa-field-${quickAccessForm.actionType}`" class="wc-modal__field">
              <input
                v-if="quickAccessForm.actionType === 'link'"
                v-model="quickAccessForm.content"
                class="wc-modal__input"
                placeholder="请输入链接地址"
              />
              <input
                v-else-if="quickAccessForm.actionType === 'copy'"
                v-model="quickAccessForm.content"
                class="wc-modal__input"
                placeholder="请输入需要复制的文本"
              />
              <template v-else>
                <div v-if="faqOptions.length === 0" class="wc-modal__empty-banner">
                  <p class="wc-modal__empty-text">当前未添加常见问题  <a class="wc-modal__empty-link" @click="navigateToFaq">去添加</a></p>
                </div>
                <select
                  v-else
                  v-model="quickAccessForm.faqId"
                  class="wc-modal__input"
                >
                  <option value="" disabled>请选择常见问题</option>
                  <option v-for="faq in faqOptions" :key="faq.id" :value="faq.id">
                    {{ faq.title }}
                  </option>
                </select>
                <p v-if="quickAccessForm.faqId && !isFaqValid" class="wc-modal__error-hint">
                  所选常见问题已被删除，请重新选择
                </p>
              </template>
            </div>
          </div>
          <div class="wc-modal__footer">
            <button type="button" class="wc-modal__btn wc-modal__btn--primary" @click="confirmQuickAccess">确定</button>
          </div>
        </div>
      </div>
    </teleport>

    <!-- Welcome Button Modal -->
    <teleport to="body">
      <div v-if="welcomeBtnModalOpen" class="wc-modal-overlay" @click.self="closeWelcomeBtnModal">
        <div class="wc-modal">
          <div class="wc-modal__header">
            <h3 class="wc-modal__title">{{ welcomeBtnEditId ? '编辑快捷按钮' : '新建快捷按钮' }}</h3>
            <button type="button" class="wc-modal__close" @click="closeWelcomeBtnModal">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" /></svg>
            </button>
          </div>
          <div class="wc-modal__body">
            <div class="wc-modal__field">
              <label class="wc-modal__label">按钮名称</label>
              <input v-model="welcomeBtnForm.label" class="wc-modal__input" placeholder="请输入按钮名称" />
            </div>
            <div class="wc-modal__field">
              <label class="wc-modal__label">按钮动作</label>
              <div class="wc-modal__radio-group">
                <label class="wc-modal__radio">
                  <input v-model="welcomeBtnForm.actionType" type="radio" name="wb-action" value="link" />
                  <span>打开链接</span>
                </label>
                <label class="wc-modal__radio">
                  <input v-model="welcomeBtnForm.actionType" type="radio" name="wb-action" value="copy" />
                  <span>复制文本</span>
                </label>
                <label class="wc-modal__radio">
                  <input v-model="welcomeBtnForm.actionType" type="radio" name="wb-action" value="message" />
                  <span>发送消息</span>
                </label>
              </div>
            </div>
            <div :key="`wb-field-${welcomeBtnForm.actionType}`" class="wc-modal__field">
              <input
                v-if="welcomeBtnForm.actionType === 'link'"
                v-model="welcomeBtnForm.content"
                class="wc-modal__input"
                placeholder="请输入链接地址"
              />
              <input
                v-else-if="welcomeBtnForm.actionType === 'copy'"
                v-model="welcomeBtnForm.content"
                class="wc-modal__input"
                placeholder="请输入需要复制的文本"
              />
              <template v-else>
                <div v-if="faqOptions.length === 0" class="wc-modal__empty-banner">
                  <p class="wc-modal__empty-text">当前未添加常见问题  <a class="wc-modal__empty-link" @click="navigateToFaq">去添加</a></p>
                </div>
                <select
                  v-else
                  v-model="welcomeBtnForm.faqId"
                  class="wc-modal__input"
                >
                  <option value="" disabled>请选择常见问题</option>
                  <option v-for="faq in faqOptions" :key="faq.id" :value="faq.id">{{ faq.title }}</option>
                </select>
                <p v-if="welcomeBtnForm.faqId && !isWelcomeBtnFaqValid" class="wc-modal__error-hint">
                  所选常见问题已被删除，请重新选择
                </p>
              </template>
            </div>
          </div>
          <div class="wc-modal__footer">
            <button type="button" class="wc-modal__btn wc-modal__btn--primary" @click="confirmWelcomeBtn">确定</button>
          </div>
        </div>
      </div>
    </teleport>

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
      <div v-if="chatPageHeroCropModalOpen" class="wc-crop-overlay" @click.self="chatPageHeroCropModalOpen = false">
        <div class="wc-crop-modal">
          <h3 class="wc-crop-modal__title">裁剪图片</h3>
          <div class="wc-crop-modal__canvas">
            <img v-if="chatPageHeroCropImageSrc" ref="chatPageHeroCropImgEl" :src="chatPageHeroCropImageSrc" class="wc-crop-modal__img" alt="裁剪预览" />
          </div>
          <div class="wc-crop-modal__actions">
            <button type="button" class="agent-btn agent-btn--ghost" @click="chatPageHeroCropModalOpen = false">取消</button>
            <button type="button" class="agent-btn agent-btn--primary" @click="applyChatPageHeroImageCrop">确认</button>
          </div>
        </div>
      </div>
    </teleport>
  </section>
</template>

<script setup lang="ts">
import { reactive, ref, computed, watch } from "vue";
import { AgentSwitch, TimeDurationInput } from "@twt/ui-agent";
import {
  FEEDBACK_QUICK_ACCESS_ICON,
  getWidgetQuickAccessItems,
  type QuickAccessItem,
  useTenant
} from "@twt/branding";
import { FEATURES } from "../lib/plan";
import { usePlan } from "../composables/usePlan";
import { getFaqOptions, isFaqExists, saveQuickAccessEntries } from "../lib/faqData";

type LangKey = "en" | "zh-cn" | "zh-tw" | "ja" | "ko" | "de" | "fr" | "ru" | "pt";

interface FormField {
  id: string;
  type: "name" | "phone" | "email" | "text" | "select";
  label: Record<LangKey, string>;
  placeholder: Record<LangKey, string>;
  required: boolean;
  options?: Array<{
    id: string;
    value: Record<LangKey, string>;
  }>;
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
type PreviewMode = "sessionList" | "chat" | "form" | "chatPage" | "minimized";
type FormScenario = "session" | "offline";
type FormFieldType = FormField["type"];
type SectionKey = "brand" | "position" | "display" | "quickAccess"
  | "chatPageHero"
  | "welcome" | "end" | "sessionOffline" | "chatOffline"
  | "visitorFeedback"
  | "sessionForm" | "offlineForm" | "msgStatus" | "sessionFeatures"
  | "agentInfoDisplay" | "queueReminder" | "visitorInactive" | "proactiveInvite" | null;

const DEFAULT_AVATAR = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='184' height='184' viewBox='0 0 184 184'%3E%3Ccircle cx='92' cy='92' r='90' fill='%23C9CED8' stroke='%23F5F7FA' stroke-width='4'/%3E%3Ccircle cx='92' cy='68' r='30' fill='%23EEF1F5'/%3E%3Cpath d='M28 156c10-28 34-46 64-46s54 18 64 46' fill='%23EEF1F5'/%3E%3C/svg%3E";
const DEFAULT_LOGO = "data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20width%3D%2764%27%20height%3D%2764%27%20viewBox%3D%270%200%2064%2064%27%3E%3Crect%20width%3D%2764%27%20height%3D%2764%27%20fill%3D%27%232563EB%27%2F%3E%3Cpath%20d%3D%27M24%2018h14c6%200%2010%204%2010%2010v8c0%206-4%2010-10%2010h-6l-8%206v-6h-2c-6%200-10-4-10-10V28c0-6%204-10%2010-10z%27%20fill%3D%27none%27%20stroke%3D%27white%27%20stroke-width%3D%274%27%20stroke-linecap%3D%27round%27%20stroke-linejoin%3D%27round%27%2F%3E%3Cpath%20d%3D%27M24%2028h0.01M32%2028h0.01M40%2028h0.01%27%20stroke%3D%27white%27%20stroke-width%3D%274%27%20stroke-linecap%3D%27round%27%2F%3E%3Cpath%20d%3D%27M16%2017l2.5%202.5L22%2016%27%20stroke%3D%27white%27%20stroke-width%3D%273%27%20stroke-linecap%3D%27round%27%20stroke-linejoin%3D%27round%27%2F%3E%3C%2Fsvg%3E";
const emit = defineEmits<{
  (e: "toast", message: string): void;
}>();

const emitToast = (msg: string) => emit("toast", msg);

const syncQuickAccessEntries = () => {
  saveQuickAccessEntries(
    settings.quickAccessItems
      .filter(i => i.actionType === "message" && i.faqId)
      .map(i => ({ id: i.id, label: i.label, faqId: i.faqId! }))
  );
};

const autoSave = () => {
  syncQuickAccessEntries();
  emitToast("保存成功");
};

const { guardFeature } = usePlan();

const toggleHideBrandLogo = (val: boolean) => {
  if (val && !guardFeature(FEATURES.HIDE_BRANDING)) return;
  collapseOtherExpandedSetting();
  settings.hideBrandLogo = val;
  autoSave();
};

const toggleHideContactUs = (val: boolean) => {
  if (val && !guardFeature(FEATURES.HIDE_CONTACT)) return;
  collapseOtherExpandedSetting();
  settings.hideContactUs = val;
  autoSave();
};

const tabs: { key: TabKey; label: string }[] = [
  { key: "appearance", label: "外观" },
  { key: "content", label: "内容" },
  { key: "form", label: "会话表单" },
  { key: "general", label: "常规" }
];

const contentLangTabs: { key: LangKey; label: string }[] = [
  { key: "zh-cn", label: "简体中文" },
  { key: "en", label: "English" },
  { key: "zh-tw", label: "繁体中文" },
  { key: "ja", label: "日语" },
  { key: "ko", label: "韩语" },
  { key: "de", label: "德语" },
  { key: "fr", label: "法语" },
  { key: "ru", label: "俄语" },
  { key: "pt", label: "葡萄牙语" }
];

type AutoReplyKey = "welcome" | "end" | "sessionOffline" | "chatOffline";

const autoReplyBlocks: { key: AutoReplyKey; title: string; desc: string; placeholder: string }[] = [
  { key: "welcome", title: "欢迎语", desc: "当访客发起会话时，系统自动发送一条欢迎语消息", placeholder: "Hello, is there anything I can help you with?" },
  { key: "end", title: "结束语", desc: "当会话被客服主动结束或自动结束时，系统自动发送一条结束语", placeholder: "Thank you for your inquiry. Have a great day!" },
  { key: "sessionOffline", title: "会话离线自动回复", desc: "当访客发送消息时，若全部客服不在线，系统将自动发送一条离线回复", placeholder: "Our agents are currently offline..." },
  { key: "chatOffline", title: "单聊离线自动回复", desc: "客服与访客的单聊中，当客服不在线时，系统将自动发送一条离线回复", placeholder: "The agent is currently offline..." }
];

const activeTab = ref<TabKey>("appearance");
const globalLang = ref<LangKey>("zh-cn");
const previewMode = ref<PreviewMode>("sessionList");
const previewModeBeforeMinimize = ref<PreviewMode>("sessionList");
const formPreviewScenario = ref<FormScenario>("session");
const activeAddFieldMenu = ref<FormScenario | null>(null);
const openSection = ref<SectionKey>("brand");
const showChatPageHero = ref(true);
const chatPageHeroTitle = reactive<Record<LangKey, string>>({
  en: "Hello!",
  "zh-cn": "你好！",
  "zh-tw": "你好！",
  ja: "こんにちは！",
  ko: "안녕하세요!",
  de: "Hallo!",
  fr: "Bonjour !",
  ru: "Здравствуйте!",
  pt: "Ola!"
});
const chatPageHeroDesc = reactive<Record<LangKey, string>>({
  en: "Welcome to our chat page.\nNeed help? We'll assist you in real time.",
  "zh-cn": "欢迎来到我们的聊天页面。\n需要帮助？我们会为你实时解答与跟进。",
  "zh-tw": "歡迎來到我們的聊天頁面。\n需要幫助？我們會為你即時解答與跟進。",
  ja: "チャットページへようこそ。\nお困りのことがあれば、リアルタイムでサポートします。",
  ko: "채팅 페이지에 오신 것을 환영합니다.\n도움이 필요하시면 실시간으로 안내해 드리겠습니다.",
  de: "Willkommen auf unserer Chat-Seite.\nWenn Sie Hilfe brauchen, unterstuetzen wir Sie in Echtzeit.",
  fr: "Bienvenue sur notre page de chat.\nBesoin d'aide ? Nous vous accompagnerons en temps reel.",
  ru: "Добро пожаловать на нашу страницу чата.\nЕсли вам нужна помощь, мы ответим и поможем в реальном времени.",
  pt: "Bem-vindo a nossa pagina de chat.\nSe precisar de ajuda, vamos acompanhar voce em tempo real."
});
const chatPageHeroImage = reactive<Record<LangKey, string>>({
  en: "",
  "zh-cn": "",
  "zh-tw": "",
  ja: "",
  ko: "",
  de: "",
  fr: "",
  ru: "",
  pt: ""
});
const currentChatPageHeroImage = computed(() => chatPageHeroImage[globalLang.value] || settings.brandLogoUrl);

const formFieldOptions: { type: FormFieldType; label: string }[] = [
  { type: "name", label: "姓名" },
  { type: "phone", label: "电话" },
  { type: "email", label: "邮箱" },
  { type: "text", label: "输入框" },
  { type: "select", label: "下拉选择" }
];

const collapseOtherExpandedSetting = (currentSection: SectionKey = null) => {
  if (openSection.value && openSection.value !== currentSection) {
    openSection.value = null;
  }
};

const handleQueueReminderToggle = (enabled: boolean) => {
  collapseOtherExpandedSetting();
  settings.showQueuePosition = enabled;
  if (enabled) {
    previewMode.value = "chat";
  }
  autoSave();
};

const handleProactiveInviteToggle = (enabled: boolean) => {
  collapseOtherExpandedSetting();
  settings.enableProactiveInvite = enabled;
  if (enabled) {
    previewMode.value = "minimized";
  }
  autoSave();
};

const handleAutoReplyToggle = (key: AutoReplyKey, enabled: boolean) => {
  collapseOtherExpandedSetting(key);
  autoReplyToggles[key] = enabled;
  autoSave();
};

const handleVisitorFeedbackToggle = (enabled: boolean) => {
  collapseOtherExpandedSetting("visitorFeedback");
  feedbackEnabled.value = enabled;
  autoSave();
};

const handleSessionFormToggle = (enabled: boolean) => {
  collapseOtherExpandedSetting("sessionForm");
  settings.enableSessionForm = enabled;
  autoSave();
};

const handleVisitorInactiveToggle = (enabled: boolean) => {
  collapseOtherExpandedSetting("visitorInactive");
  settings.enableVisitorInactive = enabled;
  autoSave();
};

const autoReplyToggles = reactive<Record<AutoReplyKey, boolean>>({
  welcome: true, end: true, sessionOffline: true, chatOffline: true
});

const autoReplyTexts = reactive<Record<AutoReplyKey, Record<LangKey, string>>>({
  welcome: {
    en: "Hello! How can I help you?",
    "zh-cn": "你好！有什么可以帮您的吗？",
    "zh-tw": "你好！有什麼可以幫您的嗎？",
    ja: "こんにちは。どのようなご用件でしょうか？",
    ko: "안녕하세요. 무엇을 도와드릴까요?",
    de: "Hallo! Wie kann ich Ihnen helfen?",
    fr: "Bonjour ! Que puis-je faire pour vous aider ?",
    ru: "Здравствуйте! Чем я могу вам помочь?",
    pt: "Ola! Como posso ajudar voce?"
  },
  end: {
    en: "Thank you for your inquiry. Have a great day!",
    "zh-cn": "感谢您的咨询，祝您生活愉快！",
    "zh-tw": "感謝您的諮詢，祝您生活愉快！",
    ja: "お問い合わせありがとうございます。良い一日をお過ごしください。",
    ko: "문의해 주셔서 감사합니다. 좋은 하루 보내세요!",
    de: "Vielen Dank fuer Ihre Anfrage. Ich wuensche Ihnen einen schoenen Tag!",
    fr: "Merci pour votre demande. Excellente journee !",
    ru: "Спасибо за ваше обращение. Хорошего дня!",
    pt: "Obrigado pelo seu contato. Tenha um otimo dia!"
  },
  sessionOffline: {
    en: "Our agents are currently offline. We will reply as soon as we are back.",
    "zh-cn": "当前客服不在线，我们会在上线后第一时间回复您。",
    "zh-tw": "當前客服不在線，我們會在上線後第一時間回覆您。",
    ja: "現在、担当者は全員オフラインです。オンラインになり次第、できるだけ早く返信いたします。",
    ko: "현재 모든 상담원이 오프라인입니다. 온라인이 되는 즉시 최대한 빨리 답변드리겠습니다.",
    de: "Unsere Mitarbeiter sind derzeit offline. Wir antworten Ihnen, sobald wir wieder online sind.",
    fr: "Nos agents sont actuellement hors ligne. Nous vous repondrons des leur retour en ligne.",
    ru: "Сейчас все операторы офлайн. Мы ответим вам, как только снова будем онлайн.",
    pt: "No momento, nossos atendentes estao offline. Responderemos assim que estivermos online novamente."
  },
  chatOffline: {
    en: "The agent is currently offline. Please try again later or leave your contact info.",
    "zh-cn": "客服暂时不在线，请稍后再试或留下您的联系方式。",
    "zh-tw": "客服暫時不在線，請稍後再試或留下您的聯繫方式。",
    ja: "担当者は現在オフラインです。しばらくしてから再度お試しいただくか、連絡先を残してください。",
    ko: "상담원이 현재 오프라인입니다. 잠시 후 다시 시도하시거나 연락처를 남겨 주세요.",
    de: "Der Mitarbeiter ist derzeit offline. Bitte versuchen Sie es spaeter erneut oder hinterlassen Sie Ihre Kontaktdaten.",
    fr: "L'agent est actuellement hors ligne. Veuillez reessayer plus tard ou laisser vos coordonnees.",
    ru: "Оператор сейчас офлайн. Попробуйте позже или оставьте свои контакты.",
    pt: "O atendente esta offline no momento. Tente novamente mais tarde ou deixe suas informacoes de contato."
  }
});

const feedbackEnabled = ref(true);
const feedbackPreviewOpen = ref(false);
const feedbackTitles = reactive<Record<LangKey, string>>({
  en: "Please rate our service",
  "zh-cn": "请对我们的服务进行评价",
  "zh-tw": "請對我們的服務進行評價",
  ja: "当社のサービスをご評価ください",
  ko: "서비스를 평가해 주세요",
  de: "Bitte bewerten Sie unseren Service",
  fr: "Merci d'evaluer notre service",
  ru: "Пожалуйста, оцените наш сервис",
  pt: "Avalie nosso atendimento"
});

const autoReplyImages = reactive<Record<AutoReplyKey, Record<LangKey, string[]>>>({
  welcome: { en: [], "zh-cn": [], "zh-tw": [], ja: [], ko: [], de: [], fr: [], ru: [], pt: [] },
  end: { en: [], "zh-cn": [], "zh-tw": [], ja: [], ko: [], de: [], fr: [], ru: [], pt: [] },
  sessionOffline: { en: [], "zh-cn": [], "zh-tw": [], ja: [], ko: [], de: [], fr: [], ru: [], pt: [] },
  chatOffline: { en: [], "zh-cn": [], "zh-tw": [], ja: [], ko: [], de: [], fr: [], ru: [], pt: [] }
});

// Welcome Buttons
interface WelcomeButton {
  id: string;
  label: string;
  actionType: "link" | "copy" | "message";
  content: string;
  faqId?: string;
}

const welcomeButtons = reactive<Record<LangKey, WelcomeButton[]>>({
  en: [],
  "zh-cn": [],
  "zh-tw": [],
  ja: [],
  ko: [],
  de: [],
  fr: [],
  ru: [],
  pt: []
});

let welcomeBtnCounter = 1;
const welcomeBtnModalOpen = ref(false);
const welcomeBtnEditId = ref<string | null>(null);

const welcomeBtnForm = reactive({
  label: "",
  actionType: "link" as "link" | "copy" | "message",
  content: "",
  faqId: ""
});

const welcomePreviewButtons = computed(() => welcomeButtons[globalLang.value]);

const syncWelcomeBtnActionType = (actionType: "link" | "copy" | "message") => {
  if (actionType === "message") {
    welcomeBtnForm.content = "";
    if (welcomeBtnForm.faqId && !isFaqExists(welcomeBtnForm.faqId)) {
      welcomeBtnForm.faqId = "";
    }
    return;
  }

  welcomeBtnForm.faqId = "";
};

const openWelcomeBtnModal = () => {
  welcomeBtnEditId.value = null;
  welcomeBtnForm.label = "";
  welcomeBtnForm.actionType = "link";
  welcomeBtnForm.content = "";
  welcomeBtnForm.faqId = "";
  syncWelcomeBtnActionType(welcomeBtnForm.actionType);
  welcomeBtnModalOpen.value = true;
};

const closeWelcomeBtnModal = () => {
  welcomeBtnModalOpen.value = false;
  welcomeBtnEditId.value = null;
};

const editWelcomeBtn = (btn: WelcomeButton) => {
  welcomeBtnEditId.value = btn.id;
  welcomeBtnForm.label = btn.label;
  welcomeBtnForm.actionType = btn.actionType;
  welcomeBtnForm.content = btn.actionType === "message" ? "" : btn.content;
  welcomeBtnForm.faqId = btn.faqId || "";
  syncWelcomeBtnActionType(welcomeBtnForm.actionType);
  welcomeBtnModalOpen.value = true;
};

const confirmWelcomeBtn = () => {
  if (!welcomeBtnForm.label.trim()) {
    emitToast("请输入按钮名称");
    return;
  }
  if (welcomeBtnForm.actionType === "link" || welcomeBtnForm.actionType === "copy") {
    if (!welcomeBtnForm.content.trim()) {
      emitToast(welcomeBtnForm.actionType === "link" ? "请输入链接地址" : "请输入需要复制的文本");
      return;
    }
  } else if (welcomeBtnForm.actionType === "message") {
    if (faqOptions.value.length === 0) {
      emitToast("请先添加常见问题");
      return;
    }
    if (!welcomeBtnForm.faqId) {
      emitToast("请选择常见问题");
      return;
    }
    if (!isFaqExists(welcomeBtnForm.faqId)) {
      emitToast("所选常见问题已被删除，请重新选择");
      welcomeBtnForm.faqId = "";
      return;
    }
  }

  const lang = globalLang.value;
  const buttonContent = welcomeBtnForm.actionType === "message"
    ? faqOptions.value.find(faq => faq.id === welcomeBtnForm.faqId)?.title || ""
    : welcomeBtnForm.content.trim();
  const btnData: WelcomeButton = {
    id: welcomeBtnEditId.value || `wb-${welcomeBtnCounter++}`,
    label: welcomeBtnForm.label,
    actionType: welcomeBtnForm.actionType,
    content: buttonContent,
    faqId: welcomeBtnForm.faqId
  };

  if (welcomeBtnEditId.value) {
    const idx = welcomeButtons[lang].findIndex(b => b.id === welcomeBtnEditId.value);
    if (idx !== -1) welcomeButtons[lang][idx] = btnData;
  } else {
    welcomeButtons[lang].push(btnData);
  }
  closeWelcomeBtnModal();
  emitToast("保存成功");
};

const removeWelcomeBtn = (id: string) => {
  const lang = globalLang.value;
  const idx = welcomeButtons[lang].findIndex(b => b.id === id);
  if (idx !== -1) welcomeButtons[lang].splice(idx, 1);
};

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
  chatPageHero: "chatPage",
  quickAccess: "chat",
  welcome: "chat",
  end: "chat",
  sessionOffline: "chat",
  chatOffline: "chat",
  visitorFeedback: "chat",
  sessionForm: "form",
  offlineForm: "form",
  msgStatus: "chat",
  sessionFeatures: "sessionList",
  agentInfoDisplay: "sessionList",
  queueReminder: "chat",
  visitorInactive: "chat",
  proactiveInvite: "minimized"
};

const syncFormPreviewScenario = (section: SectionKey) => {
  if (section === "sessionForm") {
    formPreviewScenario.value = "session";
  }
  if (section === "offlineForm") {
    formPreviewScenario.value = "offline";
  }
};

const toggleSection = (key: SectionKey) => {
  closeAddFieldMenu();
  openSection.value = openSection.value === key ? null : key;
  if (openSection.value) {
    syncFormPreviewScenario(openSection.value);
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
  closeAddFieldMenu();
  activeTab.value = key;
  openSection.value = defaultSections[key];
  if (openSection.value) {
    syncFormPreviewScenario(openSection.value);
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
const showChatPreviewMessage = computed(() => !showQuickAccessPreview.value && openSection.value !== "visitorFeedback");
const feedbackQuickAccessIcon = FEEDBACK_QUICK_ACCESS_ICON;
const previewQuickAccessItems = computed(() => settings.quickAccessItems);
const showPreviewActionStrip = computed(() => {
  if (openSection.value === "visitorFeedback") {
    return feedbackEnabled.value;
  }

  if (showQuickAccessPreview.value) {
    return feedbackEnabled.value || previewQuickAccessItems.value.length > 0;
  }

  return false;
});

const isImageIcon = (icon?: string) => Boolean(icon && /^(data:image|https?:\/\/|\/)/.test(icon));

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

interface WidgetLocaleText {
  chatTitle: string;
  newConversation: string;
  visitorMessage: string;
  submit: string;
  offlineChip: string;
  feedbackEntry: string;
  sessionFormEmptyTitle: string;
  sessionFormEmptyText: string;
  offlineFormEmptyTitle: string;
  offlineFormEmptyText: string;
  proactiveInvite: string;
  deleteSession: string;
  endSessionTogether: string;
  cancel: string;
  confirm: string;
}

const widgetLocaleTexts: Record<LangKey, WidgetLocaleText> = {
  en: {
    chatTitle: "Chat",
    newConversation: "New conversation",
    visitorMessage: "Hello, I would like to check the delivery status of my order.",
    submit: "Submit",
    offlineChip: "All agents offline",
    feedbackEntry: "Session feedback",
    sessionFormEmptyTitle: "Pre-chat form is disabled",
    sessionFormEmptyText: "When enabled, visitors will complete the form before starting a new conversation so agents can understand their request faster.",
    offlineFormEmptyTitle: "Offline form is disabled",
    offlineFormEmptyText: "When enabled, visitors can leave their contact information and question while all agents are offline, and we will follow up once someone is back online.",
    proactiveInvite: "Hello, how can I help you?",
    deleteSession: "Delete conversation",
    endSessionTogether: "End conversation as well",
    cancel: "Cancel",
    confirm: "Confirm"
  },
  "zh-cn": {
    chatTitle: "聊天",
    newConversation: "新的会话",
    visitorMessage: "您好，我想确认一下订单物流进度。",
    submit: "提交",
    offlineChip: "客服全员离线",
    feedbackEntry: "会话评价",
    sessionFormEmptyTitle: "会话前表单未开启",
    sessionFormEmptyText: "开启后，访客发起新会话前会先填写表单，帮助客服更快了解诉求。",
    offlineFormEmptyTitle: "全员离线表单未开启",
    offlineFormEmptyText: "开启后，当全部客服离线时，访客可先留下联系方式与问题，我们会在客服上线后继续跟进。",
    proactiveInvite: "您好，有什么可以帮您？",
    deleteSession: "删除会话",
    endSessionTogether: "同时结束会话",
    cancel: "取消",
    confirm: "确认"
  },
  "zh-tw": {
    chatTitle: "聊天",
    newConversation: "新的會話",
    visitorMessage: "您好，我想確認一下訂單物流進度。",
    submit: "提交",
    offlineChip: "客服全員離線",
    feedbackEntry: "會話評價",
    sessionFormEmptyTitle: "會話前表單未開啟",
    sessionFormEmptyText: "開啟後，訪客發起新會話前會先填寫表單，幫助客服更快了解訴求。",
    offlineFormEmptyTitle: "全員離線表單未開啟",
    offlineFormEmptyText: "開啟後，當全部客服離線時，訪客可先留下聯繫方式與問題，我們會在客服上線後繼續跟進。",
    proactiveInvite: "您好，有什麼可以幫您？",
    deleteSession: "刪除會話",
    endSessionTogether: "同時結束會話",
    cancel: "取消",
    confirm: "確認"
  },
  ja: {
    chatTitle: "チャット",
    newConversation: "新しい会話",
    visitorMessage: "こんにちは。注文の配送状況を確認したいです。",
    submit: "送信",
    offlineChip: "担当者全員オフライン",
    feedbackEntry: "会話評価",
    sessionFormEmptyTitle: "事前フォームは無効です",
    sessionFormEmptyText: "有効にすると、訪問者は新しい会話を始める前にフォームへ入力し、担当者が要望をより早く把握できます。",
    offlineFormEmptyTitle: "オフラインフォームは無効です",
    offlineFormEmptyText: "有効にすると、全担当者がオフラインの間も訪問者は連絡先と質問を残せるため、担当者がオンライン復帰後に追って対応できます。",
    proactiveInvite: "こんにちは。何かお手伝いできますか？",
    deleteSession: "会話を削除",
    endSessionTogether: "同時に会話を終了",
    cancel: "キャンセル",
    confirm: "確認"
  },
  ko: {
    chatTitle: "채팅",
    newConversation: "새 대화",
    visitorMessage: "안녕하세요. 주문 배송 진행 상황을 확인하고 싶습니다.",
    submit: "제출",
    offlineChip: "전체 상담원 오프라인",
    feedbackEntry: "대화 평가",
    sessionFormEmptyTitle: "사전 상담 폼이 비활성화됨",
    sessionFormEmptyText: "활성화하면 방문자는 새 대화를 시작하기 전에 폼을 먼저 작성하여 상담원이 요청 사항을 더 빨리 파악할 수 있습니다.",
    offlineFormEmptyTitle: "오프라인 폼이 비활성화됨",
    offlineFormEmptyText: "활성화하면 모든 상담원이 오프라인일 때에도 방문자가 연락처와 문의 내용을 남길 수 있고, 상담원이 온라인이 되면 후속 대응할 수 있습니다.",
    proactiveInvite: "안녕하세요. 무엇을 도와드릴까요?",
    deleteSession: "대화 삭제",
    endSessionTogether: "대화도 함께 종료",
    cancel: "취소",
    confirm: "확인"
  },
  de: {
    chatTitle: "Chat",
    newConversation: "Neue Unterhaltung",
    visitorMessage: "Hallo, ich moechte den Lieferstatus meiner Bestellung pruefen.",
    submit: "Senden",
    offlineChip: "Alle Mitarbeiter offline",
    feedbackEntry: "Chatbewertung",
    sessionFormEmptyTitle: "Vorgespraechsformular deaktiviert",
    sessionFormEmptyText: "Wenn aktiviert, fuellen Besucher vor dem Start einer neuen Unterhaltung zuerst das Formular aus, damit Mitarbeiter ihr Anliegen schneller verstehen.",
    offlineFormEmptyTitle: "Offline-Formular deaktiviert",
    offlineFormEmptyText: "Wenn aktiviert, koennen Besucher ihre Kontaktdaten und Fragen hinterlassen, waehrend alle Mitarbeiter offline sind. Wir verfolgen das Anliegen weiter, sobald jemand wieder online ist.",
    proactiveInvite: "Hallo, wie kann ich Ihnen helfen?",
    deleteSession: "Unterhaltung loeschen",
    endSessionTogether: "Unterhaltung ebenfalls beenden",
    cancel: "Abbrechen",
    confirm: "Bestaetigen"
  },
  fr: {
    chatTitle: "Chat",
    newConversation: "Nouvelle conversation",
    visitorMessage: "Bonjour, je voudrais verifier l'avancement de la livraison de ma commande.",
    submit: "Envoyer",
    offlineChip: "Tous les agents hors ligne",
    feedbackEntry: "Evaluation de la conversation",
    sessionFormEmptyTitle: "Le formulaire avant chat est desactive",
    sessionFormEmptyText: "Une fois active, les visiteurs remplissent d'abord le formulaire avant d'ouvrir une nouvelle conversation, ce qui aide les agents a comprendre plus vite leur demande.",
    offlineFormEmptyTitle: "Le formulaire hors ligne est desactive",
    offlineFormEmptyText: "Une fois active, lorsque tous les agents sont hors ligne, les visiteurs peuvent laisser leurs coordonnees et leur question. Nous reprendrons le suivi des qu'un agent sera en ligne.",
    proactiveInvite: "Bonjour, comment puis-je vous aider ?",
    deleteSession: "Supprimer la conversation",
    endSessionTogether: "Terminer aussi la conversation",
    cancel: "Annuler",
    confirm: "Confirmer"
  },
  ru: {
    chatTitle: "Чат",
    newConversation: "Новый диалог",
    visitorMessage: "Здравствуйте, я хотел(а) бы уточнить статус доставки моего заказа.",
    submit: "Отправить",
    offlineChip: "Все операторы офлайн",
    feedbackEntry: "Оценка диалога",
    sessionFormEmptyTitle: "Форма перед чатом отключена",
    sessionFormEmptyText: "Если включить, перед началом нового диалога посетитель сначала заполнит форму, и оператор быстрее поймет его запрос.",
    offlineFormEmptyTitle: "Офлайн-форма отключена",
    offlineFormEmptyText: "Если включить, пока все операторы офлайн, посетитель сможет оставить контакты и вопрос, а мы продолжим работу с ним, как только кто-то снова выйдет в онлайн.",
    proactiveInvite: "Здравствуйте! Чем я могу вам помочь?",
    deleteSession: "Удалить диалог",
    endSessionTogether: "Одновременно завершить диалог",
    cancel: "Отмена",
    confirm: "Подтвердить"
  },
  pt: {
    chatTitle: "Chat",
    newConversation: "Nova conversa",
    visitorMessage: "Ola, gostaria de verificar o andamento da entrega do meu pedido.",
    submit: "Enviar",
    offlineChip: "Todos os atendentes offline",
    feedbackEntry: "Avaliacao da conversa",
    sessionFormEmptyTitle: "Formulario antes do chat desativado",
    sessionFormEmptyText: "Quando ativado, os visitantes preenchem o formulario antes de iniciar uma nova conversa, ajudando o atendente a entender a solicitacao mais rapidamente.",
    offlineFormEmptyTitle: "Formulario offline desativado",
    offlineFormEmptyText: "Quando ativado, enquanto todos os atendentes estiverem offline, os visitantes poderao deixar contato e pergunta, e faremos o acompanhamento assim que alguem voltar a ficar online.",
    proactiveInvite: "Ola! Como posso ajudar voce?",
    deleteSession: "Excluir conversa",
    endSessionTogether: "Encerrar a conversa tambem",
    cancel: "Cancelar",
    confirm: "Confirmar"
  }
};

const currentWidgetLocaleText = computed(() => widgetLocaleTexts[globalLang.value]);

const chatPagePreviewDescriptions: Record<LangKey, [string, string]> = {
  en: ["Phone 3123 · Email: 112@11.co...", "Need help with this order"],
  "zh-cn": ["电话 3123 · 131231邮箱: 112@11.co...", "比这个"],
  "zh-tw": ["電話 3123 · 131231郵箱: 112@11.co...", "比這個"],
  ja: ["電話 3123 ・ メール: 112@11.co...", "こちらについて"],
  ko: ["전화 3123 · 이메일: 112@11.co...", "이 내용입니다"],
  de: ["Telefon 3123 · E-Mail: 112@11.co...", "Zu diesem Fall"],
  fr: ["Telephone 3123 · E-mail : 112@11.co...", "A propos de ceci"],
  ru: ["Телефон 3123 · Почта: 112@11.co...", "По этому вопросу"],
  pt: ["Telefone 3123 · E-mail: 112@11.co...", "Sobre este caso"]
};

const chatPagePreviewItems = computed(() => {
  const [firstDesc, secondDesc] = chatPagePreviewDescriptions[globalLang.value];
  return [
    { id: "cp-1", title: currentWidgetLocaleText.value.newConversation, desc: firstDesc, time: "16:43" },
    { id: "cp-2", title: currentWidgetLocaleText.value.newConversation, desc: secondDesc, time: "04/15 22:19" }
  ];
});

const chatPreviewMessageText = computed(() => {
  if (isMsgStatusPreview.value) {
    return currentWidgetLocaleText.value.visitorMessage;
  }
  return chatPreviewAgentMsg.value;
});

const showChatPreviewAgentAvatar = computed(() => {
  return previewMode.value === "chat" && (activeAutoReplyKey.value === "chatOffline" || isMsgStatusPreview.value);
});

const chatPreviewHeaderTitle = computed(() => {
  if (settings.sessionTitleMode === "agent") return agentSessionTitles[globalLang.value];
  return showChatPreviewAgentAvatar.value ? currentWidgetLocaleText.value.chatTitle : currentWidgetLocaleText.value.newConversation;
});

const proactiveInviteAgentName = "Sarah";

const proactiveInviteTexts: Record<LangKey, string> = {
  en: "Hello, how can I help you?",
  "zh-cn": "您好，有什么可以帮您？",
  "zh-tw": "您好，有什麼可以幫您？"
};

const proactiveInviteMessage = computed(() => proactiveInviteTexts[globalLang.value]);

const tenant = useTenant();

const settings = reactive({
  brandName: tenant.displayName,
  brandLogoUrl: DEFAULT_LOGO,
  widgetPosition: "bottom-right" as "bottom-right" | "bottom-left",
  positionOffsetX: 20,
  positionOffsetY: 20,
  hideBrandLogo: false,
  quickAccessItems: getWidgetQuickAccessItems(tenant) as QuickAccessItem[],
  enableSessionForm: true,
  formTitle: {
    en: "Welcome! Please fill in the following information.",
    "zh-cn": "欢迎！请填写以下信息。",
    "zh-tw": "歡迎！請填寫以下資訊。",
    ja: "ようこそ。以下の情報をご入力ください。",
    ko: "환영합니다. 아래 정보를 입력해 주세요.",
    de: "Willkommen! Bitte fuellen Sie die folgenden Informationen aus.",
    fr: "Bienvenue ! Veuillez renseigner les informations suivantes.",
    ru: "Добро пожаловать! Пожалуйста, заполните следующую информацию.",
    pt: "Bem-vindo! Preencha as informacoes abaixo."
  } as Record<LangKey, string>,
  formFields: [
    {
      id: "f-1",
      type: "name",
      label: { en: "Name", "zh-cn": "姓名", "zh-tw": "姓名", ja: "お名前", ko: "이름", de: "Name", fr: "Nom", ru: "Имя", pt: "Nome" },
      placeholder: {
        en: "Please enter your name",
        "zh-cn": "请输入姓名",
        "zh-tw": "請輸入姓名",
        ja: "お名前を入力してください",
        ko: "이름을 입력해 주세요",
        de: "Bitte geben Sie Ihren Namen ein",
        fr: "Veuillez saisir votre nom",
        ru: "Введите ваше имя",
        pt: "Digite seu nome"
      },
      required: true
    },
    {
      id: "f-2",
      type: "email",
      label: { en: "Email", "zh-cn": "邮箱", "zh-tw": "郵箱", ja: "メールアドレス", ko: "이메일", de: "E-Mail", fr: "E-mail", ru: "Эл. почта", pt: "E-mail" },
      placeholder: {
        en: "Please enter your email",
        "zh-cn": "请输入邮箱",
        "zh-tw": "請輸入郵箱",
        ja: "メールアドレスを入力してください",
        ko: "이메일을 입력해 주세요",
        de: "Bitte geben Sie Ihre E-Mail ein",
        fr: "Veuillez saisir votre e-mail",
        ru: "Введите ваш e-mail",
        pt: "Digite seu e-mail"
      },
      required: true
    },
    {
      id: "f-3",
      type: "phone",
      label: { en: "Phone", "zh-cn": "电话", "zh-tw": "電話", ja: "電話番号", ko: "전화번호", de: "Telefon", fr: "Telephone", ru: "Телефон", pt: "Telefone" },
      placeholder: {
        en: "Please enter your phone number",
        "zh-cn": "请输入电话",
        "zh-tw": "請輸入電話",
        ja: "電話番号を入力してください",
        ko: "전화번호를 입력해 주세요",
        de: "Bitte geben Sie Ihre Telefonnummer ein",
        fr: "Veuillez saisir votre numero de telephone",
        ru: "Введите ваш номер телефона",
        pt: "Digite seu telefone"
      },
      required: false
    }
  ] as FormField[],
  enableOfflineForm: true,
  offlineFormTitle: {
    en: "Our agents are currently offline. Please leave your contact information and question, and we will get back to you as soon as possible.",
    "zh-cn": "当前客服均不在线，请留下您的联系方式和问题，我们会尽快联系您。",
    "zh-tw": "當前客服均不在線，請留下您的聯繫方式和問題，我們會儘快聯繫您。",
    ja: "現在、すべての担当者がオフラインです。ご連絡先とご質問を残してください。できるだけ早くご連絡いたします。",
    ko: "현재 모든 상담원이 오프라인입니다. 연락처와 문의 내용을 남겨 주시면 최대한 빨리 연락드리겠습니다.",
    de: "Derzeit sind alle Servicemitarbeiter offline. Bitte hinterlassen Sie Ihre Kontaktdaten und Ihr Anliegen, wir melden uns so schnell wie moeglich.",
    fr: "Tous nos agents sont actuellement hors ligne. Veuillez laisser vos coordonnees et votre question, nous vous contacterons des que possible.",
    ru: "Сейчас все операторы офлайн. Оставьте свои контакты и вопрос, и мы свяжемся с вами как можно скорее.",
    pt: "No momento, todos os atendentes estao offline. Deixe seu contato e sua duvida, e entraremos em contato o mais rapido possivel."
  } as Record<LangKey, string>,
  offlineFormFields: [
    {
      id: "of-1",
      type: "name",
      label: { en: "Name", "zh-cn": "姓名", "zh-tw": "姓名", ja: "お名前", ko: "이름", de: "Name", fr: "Nom", ru: "Имя", pt: "Nome" },
      placeholder: {
        en: "Please enter your name",
        "zh-cn": "请输入姓名",
        "zh-tw": "請輸入姓名",
        ja: "お名前を入力してください",
        ko: "이름을 입력해 주세요",
        de: "Bitte geben Sie Ihren Namen ein",
        fr: "Veuillez saisir votre nom",
        ru: "Введите ваше имя",
        pt: "Digite seu nome"
      },
      required: true
    },
    {
      id: "of-2",
      type: "phone",
      label: { en: "Phone", "zh-cn": "电话", "zh-tw": "電話", ja: "電話番号", ko: "전화번호", de: "Telefon", fr: "Telephone", ru: "Телефон", pt: "Telefone" },
      placeholder: {
        en: "Please enter your phone number",
        "zh-cn": "请输入电话",
        "zh-tw": "請輸入電話",
        ja: "電話番号を入力してください",
        ko: "전화번호를 입력해 주세요",
        de: "Bitte geben Sie Ihre Telefonnummer ein",
        fr: "Veuillez saisir votre numero de telephone",
        ru: "Введите ваш номер телефона",
        pt: "Digite seu telefone"
      },
      required: true
    },
    {
      id: "of-3",
      type: "email",
      label: { en: "Email", "zh-cn": "邮箱", "zh-tw": "郵箱", ja: "メールアドレス", ko: "이메일", de: "E-Mail", fr: "E-mail", ru: "Эл. почта", pt: "E-mail" },
      placeholder: {
        en: "Please enter your email",
        "zh-cn": "请输入邮箱",
        "zh-tw": "請輸入郵箱",
        ja: "メールアドレスを入力してください",
        ko: "이메일을 입력해 주세요",
        de: "Bitte geben Sie Ihre E-Mail ein",
        fr: "Veuillez saisir votre e-mail",
        ru: "Введите ваш e-mail",
        pt: "Digite seu e-mail"
      },
      required: false
    },
    {
      id: "of-4",
      type: "text",
      label: { en: "Question", "zh-cn": "问题", "zh-tw": "問題", ja: "ご質問", ko: "문의 내용", de: "Frage", fr: "Question", ru: "Вопрос", pt: "Pergunta" },
      placeholder: {
        en: "Please describe your question",
        "zh-cn": "请描述您的问题",
        "zh-tw": "請描述您的問題",
        ja: "ご質問内容を入力してください",
        ko: "문의 내용을 입력해 주세요",
        de: "Bitte beschreiben Sie Ihr Anliegen",
        fr: "Veuillez decrire votre question",
        ru: "Опишите ваш вопрос",
        pt: "Descreva sua duvida"
      },
      required: true
    }
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
  sessionTitleMode: "ai" as "ai" | "agent",
  showQueuePosition: false,
  enableProactiveInvite: false
});

const showChatPreviewOnlineStatus = computed(() => {
  return isMsgStatusPreview.value && settings.showAgentOnlineStatus;
});

const previewFormEnabled = computed(() => {
  return formPreviewScenario.value === "offline" ? settings.enableOfflineForm : settings.enableSessionForm;
});

const previewFormFields = computed(() => {
  return formPreviewScenario.value === "offline" ? settings.offlineFormFields : settings.formFields;
});

const previewFormTitle = computed(() => {
  const lang = globalLang.value;
  if (formPreviewScenario.value === "offline") {
    return settings.offlineFormTitle[lang] || settings.offlineFormTitle["zh-cn"];
  }
  return settings.formTitle[lang] || settings.formTitle["zh-cn"];
});

const isOfflineFormPreview = computed(() => formPreviewScenario.value === "offline");

const previewOfflineFormMessage = computed(() => {
  if (!isOfflineFormPreview.value) {
    return "";
  }
  return autoReplyTexts.sessionOffline[globalLang.value];
});

const previewFormEmptyTitle = computed(() => {
  return formPreviewScenario.value === "offline"
    ? currentWidgetLocaleText.value.offlineFormEmptyTitle
    : currentWidgetLocaleText.value.sessionFormEmptyTitle;
});

const previewFormEmptyText = computed(() => {
  return formPreviewScenario.value === "offline"
    ? currentWidgetLocaleText.value.offlineFormEmptyText
    : currentWidgetLocaleText.value.sessionFormEmptyText;
});

// AI生成的会话标题（多语言）
const aiGeneratedTitles: Record<LangKey, string> = {
  en: "Order Status Inquiry",
  "zh-cn": "订单状态咨询",
  "zh-tw": "訂單狀態諮詢",
  ja: "注文状況に関するお問い合わせ",
  ko: "주문 상태 문의",
  de: "Anfrage zum Bestellstatus",
  fr: "Demande sur le statut de la commande",
  ru: "Запрос о статусе заказа",
  pt: "Consulta sobre o status do pedido"
};

// 展示客服信息的标题（多语言）
const agentSessionTitles: Record<LangKey, string> = {
  en: "Chat with Agent Sarah",
  "zh-cn": "与 Sarah 的会话",
  "zh-tw": "與 Sarah 的會話",
  ja: "担当者 Sarah との会話",
  ko: "상담원 Sarah와의 대화",
  de: "Chat mit Agentin Sarah",
  fr: "Conversation avec l'agent Sarah",
  ru: "Диалог с оператором Sarah",
  pt: "Conversa com a atendente Sarah"
};

// 会话列表消息（多语言）
const sessionListMessages: Record<LangKey, string> = {
  en: "Hello, how can I help you?",
  "zh-cn": "您好，请问有什么可以帮助您的吗？",
  "zh-tw": "您好，請問有什麼可以幫助您的嗎？",
  ja: "こんにちは。どのようなご用件でしょうか？",
  ko: "안녕하세요. 무엇을 도와드릴까요?",
  de: "Hallo, wie kann ich Ihnen helfen?",
  fr: "Bonjour, que puis-je faire pour vous aider ?",
  ru: "Здравствуйте! Чем я могу вам помочь?",
  pt: "Ola! Como posso ajudar voce?"
};

// 排队信息文本（多语言）
const queueTexts: Record<LangKey, { prefix: string; suffix: string }> = {
  en: { prefix: "In queue, ", suffix: " visitors ahead" },
  "zh-cn": { prefix: "排队中，前面还有", suffix: "人" },
  "zh-tw": { prefix: "排隊中，前面還有", suffix: "人" },
  ja: { prefix: "順番待ち中。前にあと", suffix: "人います" },
  ko: { prefix: "대기 중, 앞에 ", suffix: "명" },
  de: { prefix: "In der Warteschlange, noch ", suffix: " Personen vor Ihnen" },
  fr: { prefix: "En file d'attente, encore ", suffix: " personnes devant vous" },
  ru: { prefix: "В очереди, впереди еще ", suffix: " чел." },
  pt: { prefix: "Na fila, ainda ha ", suffix: " pessoas na sua frente" }
};

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
const chatPageHeroImageInputRef = ref<HTMLInputElement>();
const chatPageHeroCropModalOpen = ref(false);
const chatPageHeroCropImageSrc = ref("");
const chatPageHeroCropImgEl = ref<HTMLImageElement>();
const chatPageHeroCropLang = ref<LangKey>("zh-cn");

// Quick Access Modal
const quickAccessModalOpen = ref(false);
const quickAccessEditId = ref<string | null>(null);
const iconFileInput = ref<HTMLInputElement>();
const titleDropdownOpen = ref(false);
const showTooltip = ref(false);
const titleOptions = ["Email", "Telephone", "Adress", "Telegram", "X", "Whatsapp", "Instagram"];

const titleIconMap: Record<string, string> = {
  "Email": "📧",
  "Telephone": "📞",
  "Adress": "📍",
  "Telegram": "✈️",
  "X": "✖️",
  "Whatsapp": "💬",
  "Instagram": "📷"
};

const defaultIcon = "🔗";

const quickAccessForm = reactive({
  title: "",
  icon: "",
  actionType: "link" as "link" | "copy" | "message",
  content: "",
  faqId: ""
});

// 常见问题列表（从 AI Agent 常见问题页面共享数据源获取）
const faqOptions = computed(() => getFaqOptions());

const isFaqValid = computed(() => {
  if (!quickAccessForm.faqId) return true;
  return isFaqExists(quickAccessForm.faqId);
});

const isWelcomeBtnFaqValid = computed(() => {
  if (!welcomeBtnForm.faqId) return true;
  return isFaqExists(welcomeBtnForm.faqId);
});

const filteredTitleOptions = computed(() => {
  const keyword = quickAccessForm.title.trim().toLowerCase();
  if (!keyword) {
    return titleOptions;
  }
  return titleOptions.filter(option => option.toLowerCase().includes(keyword));
});

const syncQuickAccessActionType = (actionType: "link" | "copy" | "message") => {
  if (actionType === "message") {
    quickAccessForm.content = "";
    if (quickAccessForm.faqId && !isFaqExists(quickAccessForm.faqId)) {
      quickAccessForm.faqId = "";
    }
    return;
  }

  quickAccessForm.faqId = "";
};

const openTitleDropdown = () => {
  titleDropdownOpen.value = true;
};

const handleTitleInput = () => {
  titleDropdownOpen.value = true;
};

const openQuickAccessModal = () => {
  quickAccessEditId.value = null;
  quickAccessForm.title = "";
  quickAccessForm.icon = "";
  quickAccessForm.actionType = "link";
  quickAccessForm.content = "";
  quickAccessForm.faqId = "";
  syncQuickAccessActionType(quickAccessForm.actionType);
  quickAccessModalOpen.value = true;
};

const closeQuickAccessModal = () => {
  quickAccessModalOpen.value = false;
  quickAccessEditId.value = null;
  titleDropdownOpen.value = false;
};

const navigateToFaq = () => {
  window.location.href = "/ai-agent?tab=faq";
};

const editQuickAccess = (item: QuickAccessItem) => {
  quickAccessEditId.value = item.id;
  quickAccessForm.title = item.label;
  quickAccessForm.icon = item.icon || "";
  quickAccessForm.actionType = item.actionType || "link";
  quickAccessForm.content = item.actionType === "message" ? "" : item.url;
  quickAccessForm.faqId = item.faqId || "";
  syncQuickAccessActionType(quickAccessForm.actionType);
  quickAccessModalOpen.value = true;
};

const selectTitle = (title: string) => {
  quickAccessForm.title = title;
  quickAccessForm.icon = titleIconMap[title] || defaultIcon;
  titleDropdownOpen.value = false;
};

const handleTitleBlur = () => {
  setTimeout(() => {
    titleDropdownOpen.value = false;
  }, 200);
};

const triggerIconUpload = () => {
  iconFileInput.value?.click();
};

const handleIconUpload = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file) return;
  if (file.size > 1024 * 1024) {
    emitToast("图片大小不能超过1MB");
    (e.target as HTMLInputElement).value = "";
    return;
  }
  const reader = new FileReader();
  reader.onload = () => {
    quickAccessForm.icon = reader.result as string;
  };
  reader.readAsDataURL(file);
  (e.target as HTMLInputElement).value = "";
};

const removeIcon = () => {
  quickAccessForm.icon = "";
};

const confirmQuickAccess = () => {
  if (!quickAccessForm.title.trim()) {
    emitToast("请输入标题");
    return;
  }

  if (quickAccessForm.actionType === "link" || quickAccessForm.actionType === "copy") {
    if (!quickAccessForm.content.trim()) {
      const msg = quickAccessForm.actionType === "link" ? "请输入链接地址" : "请输入需要复制的文本";
      emitToast(msg);
      return;
    }
  } else if (quickAccessForm.actionType === "message") {
    if (faqOptions.value.length === 0) {
      emitToast("请先添加常见问题");
      return;
    }
    if (!quickAccessForm.faqId) {
      emitToast("请选择常见问题");
      return;
    }
    if (!isFaqValid.value) {
      emitToast("所选常见问题已被删除，请重新选择");
      quickAccessForm.faqId = "";
      return;
    }
  }

  if (quickAccessEditId.value) {
    const messageContent = quickAccessForm.actionType === "message"
      ? faqOptions.value.find(faq => faq.id === quickAccessForm.faqId)?.title || quickAccessForm.title
      : quickAccessForm.content;
    const idx = settings.quickAccessItems.findIndex(i => i.id === quickAccessEditId.value);
    if (idx !== -1) {
      settings.quickAccessItems[idx] = {
        id: quickAccessEditId.value,
        label: quickAccessForm.title,
        url: messageContent,
        icon: quickAccessForm.icon,
        actionType: quickAccessForm.actionType,
        faqId: quickAccessForm.faqId
      };
    }
  } else {
    const messageContent = quickAccessForm.actionType === "message"
      ? faqOptions.value.find(faq => faq.id === quickAccessForm.faqId)?.title || quickAccessForm.title
      : quickAccessForm.content;
    const id = `qa-${qaCounter++}`;
    settings.quickAccessItems.push({
      id,
      label: quickAccessForm.title,
      url: messageContent,
      icon: quickAccessForm.icon,
      actionType: quickAccessForm.actionType,
      faqId: quickAccessForm.faqId
    });
  }
  syncQuickAccessEntries();
  closeQuickAccessModal();
  emitToast("保存成功");
};

const triggerLogoUpload = () => {
  logoFileInput.value?.click();
};

const triggerChatPageHeroImageUpload = () => {
  chatPageHeroImageInputRef.value?.click();
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

const handleChatPageHeroImageChange = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file) return;
  if (file.size > 2 * 1024 * 1024) {
    emitToast("图片大小不能超过2MB");
    (e.target as HTMLInputElement).value = "";
    return;
  }
  chatPageHeroCropLang.value = globalLang.value;
  const reader = new FileReader();
  reader.onload = () => {
    chatPageHeroCropImageSrc.value = reader.result as string;
    chatPageHeroCropModalOpen.value = true;
  };
  reader.readAsDataURL(file);
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

const applyChatPageHeroImageCrop = () => {
  if (!chatPageHeroCropImgEl.value) return;
  const img = chatPageHeroCropImgEl.value;
  const canvas = document.createElement("canvas");
  const size = Math.min(img.naturalWidth, img.naturalHeight);
  canvas.width = 320;
  canvas.height = 320;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const sx = (img.naturalWidth - size) / 2;
  const sy = (img.naturalHeight - size) / 2;
  ctx.drawImage(img, sx, sy, size, size, 0, 0, 320, 320);
  chatPageHeroImage[chatPageHeroCropLang.value] = canvas.toDataURL("image/png");
  chatPageHeroCropModalOpen.value = false;
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

let sessionFieldCounter = 4;
let offlineFieldCounter = 5;
let selectOptionCounter = 1;

const getFormFieldList = (scenario: FormScenario) => {
  return scenario === "offline" ? settings.offlineFormFields : settings.formFields;
};

const isSingleInstanceFieldType = (fieldType: FormFieldType) => {
  return fieldType === "name" || fieldType === "phone" || fieldType === "email";
};

const isFormFieldOptionDisabled = (scenario: FormScenario, fieldType: FormFieldType) => {
  if (!isSingleInstanceFieldType(fieldType)) {
    return false;
  }
  return getFormFieldList(scenario).some(field => field.type === fieldType);
};

const closeAddFieldMenu = () => {
  activeAddFieldMenu.value = null;
};

const toggleAddFieldMenu = (scenario: FormScenario) => {
  activeAddFieldMenu.value = activeAddFieldMenu.value === scenario ? null : scenario;
};

const createLocalizedFieldText = (
  label: Record<LangKey, string>,
  placeholder: Record<LangKey, string>
) => ({
  label,
  placeholder
});

const chineseNumerals = ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十"];

const createSelectOption = (index: number) => {
  const chineseSuffix = chineseNumerals[index] || `${index + 1}`;
  const numericSuffix = `${index + 1}`;
  return {
    id: `fo-${selectOptionCounter++}`,
    value: {
      en: `Option ${numericSuffix}`,
      "zh-cn": `选项${chineseSuffix}`,
      "zh-tw": `選項${chineseSuffix}`,
      ja: `オプション${numericSuffix}`,
      ko: `옵션 ${numericSuffix}`,
      de: `Option ${numericSuffix}`,
      fr: `Option ${numericSuffix}`,
      ru: `Вариант ${numericSuffix}`,
      pt: `Opcao ${numericSuffix}`
    }
  };
};

const createFormField = (id: string, fieldType: FormFieldType): FormField => {
  switch (fieldType) {
    case "name": {
      const localized = createLocalizedFieldText(
        { en: "Name", "zh-cn": "姓名", "zh-tw": "姓名", ja: "お名前", ko: "이름", de: "Name", fr: "Nom", ru: "Имя", pt: "Nome" },
        {
          en: "Please enter your name",
          "zh-cn": "请输入姓名",
          "zh-tw": "請輸入姓名",
          ja: "お名前を入力してください",
          ko: "이름을 입력해 주세요",
          de: "Bitte geben Sie Ihren Namen ein",
          fr: "Veuillez saisir votre nom",
          ru: "Введите ваше имя",
          pt: "Digite seu nome"
        }
      );
      return { id, type: "name", required: true, ...localized };
    }
    case "phone": {
      const localized = createLocalizedFieldText(
        { en: "Phone", "zh-cn": "电话", "zh-tw": "電話", ja: "電話番号", ko: "전화번호", de: "Telefon", fr: "Telephone", ru: "Телефон", pt: "Telefone" },
        {
          en: "Please enter your phone number",
          "zh-cn": "请输入电话",
          "zh-tw": "請輸入電話",
          ja: "電話番号を入力してください",
          ko: "전화번호를 입력해 주세요",
          de: "Bitte geben Sie Ihre Telefonnummer ein",
          fr: "Veuillez saisir votre numero de telephone",
          ru: "Введите ваш номер телефона",
          pt: "Digite seu telefone"
        }
      );
      return { id, type: "phone", required: true, ...localized };
    }
    case "email": {
      const localized = createLocalizedFieldText(
        { en: "Email", "zh-cn": "邮箱", "zh-tw": "郵箱", ja: "メールアドレス", ko: "이메일", de: "E-Mail", fr: "E-mail", ru: "Эл. почта", pt: "E-mail" },
        {
          en: "Please enter your email",
          "zh-cn": "请输入邮箱",
          "zh-tw": "請輸入郵箱",
          ja: "メールアドレスを入力してください",
          ko: "이메일을 입력해 주세요",
          de: "Bitte geben Sie Ihre E-Mail ein",
          fr: "Veuillez saisir votre e-mail",
          ru: "Введите ваш e-mail",
          pt: "Digite seu e-mail"
        }
      );
      return { id, type: "email", required: true, ...localized };
    }
    case "select": {
      const localized = createLocalizedFieldText(
        { en: "Dropdown", "zh-cn": "下拉选择", "zh-tw": "下拉選擇", ja: "ドロップダウン", ko: "드롭다운", de: "Auswahlfeld", fr: "Liste deroulante", ru: "Выпадающий список", pt: "Lista suspensa" },
        {
          en: "Please select",
          "zh-cn": "请选择",
          "zh-tw": "請選擇",
          ja: "選択してください",
          ko: "선택해 주세요",
          de: "Bitte waehlen Sie aus",
          fr: "Veuillez selectionner",
          ru: "Пожалуйста, выберите",
          pt: "Selecione"
        }
      );
      return { id, type: "select", required: false, options: [createSelectOption(0)], ...localized };
    }
    default: {
      const localized = createLocalizedFieldText(
        { en: "Text field", "zh-cn": "输入框", "zh-tw": "輸入框", ja: "入力欄", ko: "입력란", de: "Textfeld", fr: "Champ de texte", ru: "Текстовое поле", pt: "Campo de texto" },
        {
          en: "Please enter the content",
          "zh-cn": "请输入内容",
          "zh-tw": "請輸入內容",
          ja: "内容を入力してください",
          ko: "내용을 입력해 주세요",
          de: "Bitte geben Sie den Inhalt ein",
          fr: "Veuillez saisir le contenu",
          ru: "Введите содержимое",
          pt: "Digite o conteudo"
        }
      );
      return { id, type: "text", required: false, ...localized };
    }
  }
};

const addFormField = (scenario: FormScenario = "session", fieldType: FormFieldType = "text") => {
  if (isFormFieldOptionDisabled(scenario, fieldType)) {
    return;
  }
  const counter = scenario === "offline" ? offlineFieldCounter++ : sessionFieldCounter++;
  const id = `${scenario === "offline" ? "of" : "f"}-${counter}`;
  getFormFieldList(scenario).push(createFormField(id, fieldType));
  closeAddFieldMenu();
  autoSave();
};

const deleteConfirmKey = ref<string | null>(null);

const getDeleteConfirmKey = (scenario: FormScenario, idx: number) => `${scenario}:${idx}`;

const isDeleteConfirmOpen = (scenario: FormScenario, idx: number) => {
  return deleteConfirmKey.value === getDeleteConfirmKey(scenario, idx);
};

const toggleDeleteConfirm = (scenario: FormScenario, idx: number) => {
  const nextKey = getDeleteConfirmKey(scenario, idx);
  deleteConfirmKey.value = deleteConfirmKey.value === nextKey ? null : nextKey;
};

const confirmRemoveFormField = (scenario: FormScenario, idx: number) => {
  getFormFieldList(scenario).splice(idx, 1);
  deleteConfirmKey.value = null;
  autoSave();
};

const addSelectOption = (scenario: FormScenario, fieldIdx: number) => {
  const field = getFormFieldList(scenario)[fieldIdx];
  if (!field || field.type !== "select") {
    return;
  }
  if (!field.options) {
    field.options = [createSelectOption(0)];
  }
  field.options.push(createSelectOption(field.options.length));
  autoSave();
};

const removeSelectOption = (scenario: FormScenario, fieldIdx: number, optionIdx: number) => {
  const field = getFormFieldList(scenario)[fieldIdx];
  if (!field || field.type !== "select" || !field.options || field.options.length <= 1) {
    return;
  }
  field.options.splice(optionIdx, 1);
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

watch(
  () => quickAccessForm.actionType,
  (actionType) => {
    syncQuickAccessActionType(actionType);
  }
);

watch(
  () => welcomeBtnForm.actionType,
  (actionType) => {
    syncWelcomeBtnActionType(actionType);
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
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  height: 100%;
  overflow: hidden;
}

/* ── Settings Panel ── */
.wc-settings {
  border-right: 1px solid var(--agent-color-border-default);
  display: flex;
  flex-direction: column;
  gap: var(--agent-space-16);
  min-width: 0;
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

.wc-settings__channel-hint {
  background: var(--agent-color-brand-soft);
  border-radius: var(--agent-radius-sm);
  color: var(--agent-color-status-warning);
  font-size: var(--agent-font-size-xs);
  margin: 8px 0 0;
  padding: 6px 10px;
}

/* Global Language Switch */
.wc-global-lang {
  flex-shrink: 0;
}

.wc-global-lang__select {
  appearance: none;
  background: var(--agent-color-bg-panel);
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
.wc-flat-card {
  align-items: center;
  background: var(--agent-color-bg-panel);
  border: 1px solid var(--agent-color-border-default);
  border-radius: 14px;
  display: flex;
  gap: var(--agent-space-12);
  padding: var(--agent-space-16) var(--agent-space-20);
}

.wc-flat-card__text {
  flex: 1;
}

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

.wc-accordion--form .wc-accordion__trigger {
  gap: 10px;
  padding: 14px 18px;
}

.wc-accordion--form .wc-accordion__body {
  gap: 14px;
  padding: 16px 18px 18px;
}

.wc-accordion--form .wc-card__title {
  font-size: 15px;
}

.wc-accordion--form .wc-card__desc {
  font-size: 12px;
  line-height: 1.45;
}

.wc-accordion--form .wc-label {
  font-size: 12px;
}

.wc-accordion--form .wc-input {
  border-radius: 9px;
  font-size: 12px;
  padding: 7px 10px;
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

.wc-accordion__trigger--chat-page {
  user-select: none;
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
  color: var(--agent-color-text-tertiary);
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
  accent-color: var(--agent-color-brand-primary);
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
  color: var(--agent-color-text-tertiary);
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
  background: var(--agent-color-bg-panel);
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
  color: var(--agent-color-status-error);
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
  background: var(--agent-color-bg-muted);
  border-radius: 14px;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  min-height: 56px;
  padding: 14px 16px;
}

.wc-quick-tag {
  align-items: center;
  background: var(--agent-color-bg-panel);
  border: 0;
  border-radius: 12px;
  color: var(--agent-color-text-primary);
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
  color: var(--agent-color-text-secondary);
  cursor: pointer;
  padding-right: 16px;
  transition: background 0.15s ease, color 0.15s ease;
}

.wc-quick-tag--add:hover {
  background: var(--agent-color-bg-panel);
  color: var(--agent-color-text-primary);
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
  background: var(--agent-color-bg-muted);
  color: var(--agent-color-text-tertiary);
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
  color: var(--agent-color-text-primary);
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

.wc-chat-page-hero__textarea {
  min-height: 108px;
  padding-bottom: 14px;
  resize: vertical;
}

.wc-upload-hint {
  color: var(--agent-color-text-tertiary);
  font-size: var(--agent-font-size-xs);
  line-height: 1.4;
  margin: 0;
}

/* Welcome Buttons - Edit Area */
.wc-welcome-btns {
  margin: 12px 0;
}

.wc-welcome-btns__list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
}

.wc-welcome-btns__tag {
  align-items: center;
  border: 1px solid var(--agent-color-brand-primary);
  border-radius: 6px;
  color: var(--agent-color-brand-primary);
  cursor: pointer;
  display: flex;
  font-size: 13px;
  gap: 6px;
  padding: 6px 10px;
  transition: background 0.15s;
}

.wc-welcome-btns__tag:hover {
  background: rgba(59, 130, 246, 0.06);
}

.wc-welcome-btns__tag-label {
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.wc-welcome-btns__remove {
  align-items: center;
  background: none;
  border: none;
  color: var(--agent-color-brand-primary);
  cursor: pointer;
  display: flex;
  opacity: 0.6;
  padding: 0;
}

.wc-welcome-btns__remove:hover {
  opacity: 1;
}

.wc-welcome-btns__add {
  align-items: center;
  background: none;
  border: 1px dashed var(--agent-color-border-default);
  border-radius: 6px;
  color: var(--agent-color-text-tertiary);
  cursor: pointer;
  display: flex;
  font-size: 13px;
  gap: 4px;
  padding: 6px 12px;
  transition: all 0.15s;
}

.wc-welcome-btns__add:hover {
  border-color: var(--agent-color-brand-primary);
  color: var(--agent-color-brand-primary);
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
  gap: 4px;
}

.wc-form-title-row--inline {
  align-items: flex-start;
  flex-direction: row;
  gap: 16px;
}

.wc-form-title-row--inline .wc-label {
  flex-shrink: 0;
  line-height: 32px;
  width: 44px;
}

.wc-form-title-row__content {
  flex: 1;
  min-width: 0;
}

.wc-form-title-row__content .wc-input,
.wc-form-title-row__content .wc-rich-editor {
  width: 100%;
}

.wc-form-title-row--image {
  min-height: 64px;
}

.wc-form-fields-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.wc-form-fields {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.wc-form-field-row {
  background: var(--agent-color-bg-muted);
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 14px 16px;
}

.wc-form-field-row__main {
  align-items: center;
  display: grid;
  gap: 10px;
  grid-template-columns: 18px 84px minmax(0, 1fr) auto 16px;
  width: 100%;
}

.wc-drag-handle {
  color: #b3bccd;
  cursor: grab;
  display: inline-flex;
  flex-shrink: 0;
  justify-content: center;
  width: 18px;
}

.wc-drag-handle svg {
  height: 14px;
  width: 14px;
}

.wc-form-field-label {
  color: var(--agent-color-text-primary);
  flex-shrink: 0;
  font-size: 14px;
  font-weight: var(--agent-font-weight-semibold);
  line-height: 1.25;
  min-width: 0;
}

.wc-form-field-placeholder {
  flex: 1;
  border-color: #d8e0ec;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 500;
  height: 40px;
  line-height: 40px;
  min-width: 0;
  padding: 0 14px;
}

.wc-checkbox-label {
  align-items: center;
  color: var(--agent-color-text-primary);
  display: inline-flex;
  flex-shrink: 0;
  font-size: 13px;
  font-weight: var(--agent-font-weight-medium);
  gap: 5px;
  white-space: nowrap;
}

.wc-checkbox {
  appearance: none;
  background: var(--agent-color-bg-panel);
  border: 2px solid #d8e0ec;
  border-radius: 6px;
  cursor: pointer;
  height: 18px;
  margin: 0;
  position: relative;
  transition: border-color 0.15s, background 0.15s, box-shadow 0.15s;
  width: 18px;
}

.wc-checkbox:hover {
  border-color: #b9c7dc;
}

.wc-checkbox:checked {
  background: var(--agent-color-brand-primary);
  border-color: var(--agent-color-brand-primary);
}

.wc-checkbox:checked::after {
  border-bottom: 2px solid #fff;
  border-right: 2px solid #fff;
  content: "";
  height: 6px;
  left: 4px;
  position: absolute;
  top: 1px;
  transform: rotate(45deg);
  width: 4px;
}

.wc-checkbox:focus-visible {
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.16);
  outline: none;
}

.wc-form-field-delete {
  background: transparent;
  border: 0;
  color: #b7c0d0;
  cursor: pointer;
  display: inline-flex;
  flex-shrink: 0;
  padding: 0;
  transition: color 0.15s;
}

.wc-form-field-delete:hover { color: var(--agent-color-status-error); }

.wc-form-field-delete svg {
  height: 16px;
  width: 16px;
}

.wc-form-field-delete-wrap {
  position: relative;
  flex-shrink: 0;
}

.wc-form-select-panel {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-left: 112px;
  width: 100%;
}

.wc-form-select-option-row {
  align-items: center;
  display: flex;
  gap: 10px;
  width: 100%;
}

.wc-form-select-option-row__line {
  border-bottom: 1.5px solid #d7deea;
  border-left: 1.5px solid #d7deea;
  border-bottom-left-radius: 10px;
  display: inline-flex;
  flex-shrink: 0;
  height: 22px;
  width: 24px;
}

.wc-form-select-option-row__label {
  color: var(--agent-color-text-primary);
  flex-shrink: 0;
  font-size: 13px;
  font-weight: var(--agent-font-weight-medium);
  min-width: 36px;
}

.wc-form-select-option-input {
  flex: 1;
  border-color: #d8e0ec;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 500;
  height: 40px;
  line-height: 40px;
  min-width: 0;
  padding: 0 14px;
}

.wc-form-select-option-delete {
  align-items: center;
  color: #b7c0d0;
  display: inline-flex;
  justify-content: center;
}

.wc-form-select-option-delete:disabled {
  color: var(--agent-color-border-strong);
  cursor: not-allowed;
  opacity: 0.45;
}

.wc-add-option-btn {
  align-items: center;
  align-self: flex-start;
  background: var(--agent-color-bg-panel);
  border: 1px solid #d8e0ec;
  border-radius: 14px;
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.05);
  color: var(--agent-color-text-primary);
  cursor: pointer;
  display: inline-flex;
  font-size: 12px;
  font-weight: var(--agent-font-weight-semibold);
  gap: 6px;
  margin-left: 58px;
  padding: 8px 14px;
  transition: border-color 0.15s, transform 0.15s, box-shadow 0.15s;
}

.wc-add-option-btn:hover {
  border-color: var(--agent-color-brand-primary);
  box-shadow: 0 10px 18px rgba(37, 99, 235, 0.1);
  transform: translateY(-1px);
}

.wc-add-option-btn__icon {
  color: var(--agent-color-text-primary);
  display: inline-flex;
  flex-shrink: 0;
}

.wc-popconfirm {
  position: absolute;
  right: 0;
  top: calc(100% + 6px);
  z-index: var(--agent-z-dropdown, 100);
  background: var(--agent-color-bg-panel);
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
  background: var(--agent-color-bg-muted);
  color: var(--agent-color-text-secondary);
}

.wc-popconfirm__btn--cancel:hover {
  background: var(--agent-color-border-default);
}

.wc-popconfirm__btn--confirm {
  background: var(--agent-color-status-error);
  color: #fff;
}

.wc-popconfirm__btn--confirm:hover {
  opacity: 0.9;
}

.wc-add-field-wrap {
  align-self: flex-start;
  display: inline-flex;
  position: relative;
  z-index: 2;
}

.wc-add-field-btn {
  align-items: center;
  background: var(--agent-color-bg-panel);
  border: 1px solid var(--agent-color-brand-primary);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.1);
  color: var(--agent-color-brand-primary);
  cursor: pointer;
  display: inline-flex;
  font-size: 12px;
  font-weight: var(--agent-font-weight-semibold);
  gap: 6px;
  justify-content: center;
  line-height: 1;
  min-width: 100px;
  padding: 8px 12px;
  white-space: nowrap;
  transition: transform 0.15s, box-shadow 0.15s, background 0.15s;
}

.wc-add-field-btn:hover,
.wc-add-field-btn--active {
  background: var(--agent-color-brand-soft);
  box-shadow: 0 8px 18px rgba(37, 99, 235, 0.12);
  transform: translateY(-1px);
}

.wc-add-field-btn__icon {
  display: inline-flex;
  flex-shrink: 0;
}

.wc-add-field-menu {
  background: var(--agent-color-bg-panel);
  border: 1px solid var(--agent-color-border-default);
  border-radius: 12px;
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.1);
  display: flex;
  flex-direction: column;
  gap: 0;
  left: 0;
  min-width: 100%;
  padding: 4px;
  position: absolute;
  top: auto;
  bottom: calc(100% + 8px);
  width: max-content;
  z-index: var(--agent-z-dropdown, 100);
}

.wc-add-field-menu__item {
  align-items: center;
  background: transparent;
  border: 0;
  border-radius: 8px;
  color: var(--agent-color-text-primary);
  cursor: pointer;
  display: flex;
  font-size: 12px;
  font-weight: var(--agent-font-weight-medium);
  min-height: 30px;
  padding: 7px 10px;
  text-align: left;
  transition: background 0.15s, color 0.15s;
  white-space: nowrap;
  width: 100%;
}

.wc-add-field-menu__item:hover {
  background: var(--agent-color-brand-soft);
  color: var(--agent-color-text-primary);
}

.wc-add-field-menu__item--disabled,
.wc-add-field-menu__item:disabled {
  color: #9ea7b8;
  cursor: not-allowed;
}

.wc-add-field-menu__item--disabled:hover,
.wc-add-field-menu__item:disabled:hover {
  background: transparent;
}

/* ── Preview Panel ── */
.wc-preview {
  container-type: inline-size;
  display: flex;
  flex-direction: column;
  min-width: 0;
  overflow: hidden;
}

.wc-preview__header {
  align-items: center;
  border-bottom: 1px solid var(--agent-color-border-default);
  display: flex;
  gap: 8px;
  padding: 10px 16px;
}

.wc-preview__title {
  color: var(--agent-color-text-primary);
  font-size: 13px;
  font-weight: 600;
}

.wc-preview-select {
  border-radius: 8px;
  font-size: 12px;
  min-height: 32px;
  padding: 5px 10px;
  width: auto;
}

/* Canvas */
.wc-preview__canvas {
  background:
    linear-gradient(90deg, var(--agent-color-border-default) 1px, transparent 1px),
    linear-gradient(var(--agent-color-border-default) 1px, transparent 1px);
  background-color: var(--agent-color-bg-muted);
  background-size: 32px 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  min-width: 0;
  overflow: hidden;
  position: relative;
}

.wc-preview__canvas--chat-page {
  background: linear-gradient(180deg, #f7f9fc 0%, #f4f7fb 100%);
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

.wc-chat-page-preview {
  align-items: center;
  background: linear-gradient(180deg, #ffffff 0%, #fbfdff 100%);
  border: 1px solid rgba(218, 226, 238, 0.92);
  border-radius: 28px;
  box-shadow: 0 18px 48px rgba(15, 23, 42, 0.08);
  box-sizing: border-box;
  display: grid;
  gap: 44px;
  grid-template-columns: minmax(260px, 1fr) 322px;
  height: min(calc(100% - 72px), 712px);
  max-width: min(calc(100% - 72px), 1020px);
  min-width: 0;
  padding: 46px 40px;
  position: relative;
  width: min(calc(100% - 72px), 1020px);
}

.wc-chat-page-preview--hero-hidden {
  display: flex;
  justify-content: center;
}

.wc-chat-page-preview--hero-hidden .wc-chat-page-preview__panel-wrap {
  justify-content: center;
}

.wc-chat-page-preview__hero {
  align-self: center;
  display: flex;
  flex-direction: column;
  gap: 14px;
  justify-self: start;
  max-width: 372px;
  min-width: 0;
}

.wc-chat-page-preview__hero-image {
  border-radius: 50%;
  height: 64px;
  object-fit: cover;
  width: 64px;
}

.wc-chat-page-preview__hero-title {
  color: #121826;
  font-size: 30px;
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1.12;
  margin: 0;
}

.wc-chat-page-preview__hero-desc {
  color: #111827;
  font-size: 15px;
  line-height: 1.7;
  margin: 0;
  max-width: 372px;
  white-space: pre-line;
}

.wc-chat-page-preview__panel-wrap {
  display: flex;
  justify-content: flex-end;
  min-width: 0;
  width: 100%;
}

.wc-chat-page-preview__panel {
  background: #fff;
  border-radius: 24px;
  box-shadow: 0 20px 48px rgba(15, 23, 42, 0.11);
  display: flex;
  flex-direction: column;
  height: 602px;
  overflow: hidden;
  padding: 16px 14px 12px;
  width: 322px;
}

.wc-chat-page-preview__panel-head {
  align-items: center;
  display: flex;
  justify-content: space-between;
  padding: 0 0 6px;
}

.wc-chat-page-preview__brand {
  align-items: center;
  display: flex;
  gap: 9px;
  min-width: 0;
}

.wc-chat-page-preview__brand-logo {
  border-radius: 50%;
  height: 30px;
  object-fit: cover;
  width: 30px;
}

.wc-chat-page-preview__brand-name {
  color: #202939;
  font-size: 14px;
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.wc-chat-page-preview__panel-menu {
  align-items: center;
  background: transparent;
  border: 0;
  color: #111827;
  cursor: default;
  display: inline-flex;
  height: 22px;
  justify-content: center;
  padding: 0;
  width: 22px;
}

.wc-chat-page-preview__session-list {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 6px;
  padding: 14px 2px 0;
}

.wc-chat-page-preview__session-item {
  align-items: flex-start;
  display: flex;
  gap: 10px;
  padding: 7px 8px;
}

.wc-chat-page-preview__session-avatar {
  align-items: center;
  background: #1daaf3;
  border-radius: 50%;
  color: #fff;
  display: flex;
  flex-shrink: 0;
  font-size: 16px;
  font-weight: 700;
  height: 36px;
  justify-content: center;
  width: 36px;
}

.wc-chat-page-preview__session-body {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.wc-chat-page-preview__session-top {
  align-items: center;
  display: flex;
  gap: 8px;
  justify-content: space-between;
}

.wc-chat-page-preview__session-title {
  color: #111827;
  font-size: 12px;
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.wc-chat-page-preview__session-time {
  color: #7184a7;
  flex-shrink: 0;
  font-size: 10px;
}

.wc-chat-page-preview__session-desc {
  color: #7184a7;
  font-size: 11px;
  line-height: 1.4;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.wc-chat-page-preview__cta {
  align-items: center;
  background: linear-gradient(180deg, #2f6bff 0%, #235ae8 100%);
  border: 0;
  border-radius: 14px;
  color: #fff;
  cursor: default;
  display: inline-flex;
  font-size: 13px;
  font-weight: 600;
  height: 42px;
  justify-content: center;
  margin-top: auto;
  width: 100%;
}

.wc-chat-page-preview__footer {
  color: #94a3b8;
  font-size: 10px;
  padding-top: 12px;
  text-align: center;
}

@container (max-width: 860px) {
  .wc-chat-page-preview {
    gap: 28px;
    grid-template-columns: minmax(180px, 1fr) 280px;
    height: min(calc(100% - 48px), 620px);
    max-width: min(calc(100% - 48px), 820px);
    padding: 32px 28px;
    width: min(calc(100% - 48px), 820px);
  }

  .wc-chat-page-preview__hero {
    gap: 12px;
    max-width: 276px;
  }

  .wc-chat-page-preview__hero-image {
    height: 56px;
    width: 56px;
  }

  .wc-chat-page-preview__hero-title {
    font-size: 24px;
  }

  .wc-chat-page-preview__hero-desc {
    font-size: 13px;
    line-height: 1.65;
    max-width: 276px;
  }

  .wc-chat-page-preview__panel {
    border-radius: 22px;
    height: 520px;
    padding: 14px 12px 12px;
    width: 280px;
  }

  .wc-chat-page-preview__brand-logo {
    height: 28px;
    width: 28px;
  }

  .wc-chat-page-preview__brand-name {
    font-size: 13px;
  }

  .wc-chat-page-preview__session-list {
    gap: 4px;
    padding-top: 12px;
  }

  .wc-chat-page-preview__session-item {
    gap: 8px;
    padding: 6px;
  }

  .wc-chat-page-preview__session-avatar {
    font-size: 14px;
    height: 32px;
    width: 32px;
  }

  .wc-chat-page-preview__session-title {
    font-size: 11px;
  }

  .wc-chat-page-preview__session-time {
    font-size: 9px;
  }

  .wc-chat-page-preview__session-desc {
    font-size: 10px;
  }

  .wc-chat-page-preview__cta {
    font-size: 12px;
    height: 38px;
  }
}

@container (max-width: 720px) {
  .wc-chat-page-preview {
    gap: 20px;
    grid-template-columns: minmax(0, 1fr);
    height: min(calc(100% - 32px), 616px);
    max-width: min(calc(100% - 32px), 560px);
    padding: 24px 20px;
    width: min(calc(100% - 32px), 560px);
  }

  .wc-chat-page-preview__hero {
    justify-self: stretch;
    max-width: none;
  }

  .wc-chat-page-preview__hero-desc {
    max-width: none;
  }

  .wc-chat-page-preview__panel-wrap {
    justify-content: center;
  }

  .wc-chat-page-preview__panel {
    height: 428px;
    width: min(100%, 272px);
  }
}

@container (max-width: 560px) {
  .wc-chat-page-preview {
    border-radius: 22px;
    gap: 16px;
    height: min(calc(100% - 24px), 560px);
    max-width: min(calc(100% - 24px), 420px);
    padding: 18px 16px;
    width: min(calc(100% - 24px), 420px);
  }

  .wc-chat-page-preview__hero-image {
    height: 48px;
    width: 48px;
  }

  .wc-chat-page-preview__hero-title {
    font-size: 21px;
  }

  .wc-chat-page-preview__hero-desc {
    font-size: 12px;
  }

  .wc-chat-page-preview__panel {
    border-radius: 18px;
    height: 388px;
    width: min(100%, 248px);
  }

  .wc-chat-page-preview__cta {
    height: 36px;
  }
}

/* Widget */
.wc-widget {
  background: var(--agent-color-bg-panel);
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

.wc-widget--chat-preview {
  background: #f4f7fb;
}

.wc-widget__header {
  align-items: center;
  background: var(--agent-color-bg-panel);
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
  color: var(--agent-color-text-secondary);
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
  color: var(--agent-color-text-primary);
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
  background: var(--agent-color-status-error);
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
  background: var(--agent-color-bg-panel);
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
  background: var(--agent-color-bg-muted);
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
  background: var(--agent-color-status-error);
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
  color: var(--agent-color-text-tertiary);
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
  color: var(--agent-color-status-error);
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
.wc-title-mode-options {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.wc-title-mode-options--horizontal {
  flex-direction: row;
}

.wc-title-mode-options--horizontal .wc-title-mode-option {
  flex: 1;
}

.wc-title-mode-option {
  align-items: flex-start;
  border: 1.5px solid var(--agent-color-border-default);
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  gap: 10px;
  padding: 14px 16px;
  transition: border-color 0.15s, background 0.15s;
}

.wc-title-mode-option:hover {
  border-color: var(--agent-color-brand-primary);
}

.wc-title-mode-option--active {
  background: rgba(47, 107, 255, 0.04);
  border-color: var(--agent-color-brand-primary);
}

.wc-title-mode-option__radio {
  clip: rect(0 0 0 0);
  height: 1px;
  overflow: hidden;
  position: absolute;
  width: 1px;
}

.wc-title-mode-option__indicator {
  border: 2px solid var(--agent-color-border-strong);
  border-radius: 50%;
  flex-shrink: 0;
  height: 18px;
  margin-top: 1px;
  position: relative;
  transition: border-color 0.15s;
  width: 18px;
}

.wc-title-mode-option--active .wc-title-mode-option__indicator {
  border-color: var(--agent-color-brand-primary);
}

.wc-title-mode-option--active .wc-title-mode-option__indicator::after {
  background: var(--agent-color-brand-primary);
  border-radius: 50%;
  content: "";
  height: 8px;
  left: 50%;
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 8px;
}

.wc-title-mode-option__text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.wc-title-mode-option__title {
  color: var(--agent-color-text-primary);
  font-size: 13px;
  font-weight: 600;
}

.wc-title-mode-option__desc {
  color: var(--agent-color-text-tertiary);
  font-size: 12px;
  line-height: 1.5;
}

.wc-widget__queue-pill {
  align-self: center;
  background: var(--agent-color-bg-panel);
  border-radius: 999px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  color: var(--agent-color-text-secondary);
  font-size: 11px;
  font-weight: 500;
  margin-bottom: 10px;
  padding: 6px 14px;
  text-align: center;
}

.wc-widget__queue-pill-num {
  color: var(--agent-color-status-warning);
  font-weight: 700;
}

.wc-widget__messages {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 10px;
  min-height: 160px;
  padding: 14px;
}

.wc-widget--chat-preview .wc-widget__messages {
  background: transparent;
  padding: 14px 14px 12px;
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
  background: var(--agent-color-bg-panel);
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
  color: var(--agent-color-brand-primary);
  display: inline-flex;
  margin-top: 2px;
  text-align: left;
}

.wc-widget__read-receipt-icon {
  display: block;
}

/* Action strip */
.wc-widget__action-strip {
  background: transparent;
  box-sizing: border-box;
  display: flex;
  gap: 8px;
  max-width: 100%;
  overflow-x: auto;
  padding: 0 14px 8px;
  scrollbar-width: none;
  width: max-content;
}

.wc-widget__action-strip::-webkit-scrollbar {
  display: none;
}

.wc-widget__action-pill {
  align-items: center;
  background: #fff;
  border: 1px solid rgba(217, 226, 239, 0.92);
  border-radius: 999px;
  box-shadow: 0 4px 10px rgba(15, 23, 42, 0.04);
  color: #1f2937;
  display: inline-flex;
  flex: 0 0 auto;
  gap: 6px;
  min-height: 34px;
  padding: 4px 10px;
}

.wc-widget__action-pill-icon {
  align-items: center;
  background: #eef3ff;
  border-radius: 50%;
  color: #41516d;
  display: inline-flex;
  flex-shrink: 0;
  font-size: 14px;
  height: 20px;
  justify-content: center;
  overflow: hidden;
  width: 20px;
}

.wc-widget__action-pill-icon--image {
  background: transparent;
}

.wc-widget__action-pill-icon img {
  display: block;
  height: 100%;
  object-fit: cover;
  width: 100%;
}

.wc-widget__action-pill-label {
  color: #1f2937;
  font-size: 12px;
  font-weight: 500;
  line-height: 1;
  white-space: nowrap;
}

/* Welcome Buttons - Preview */
.wc-widget__welcome-btns {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  padding: 4px 14px 8px;
}

.wc-widget__welcome-btn {
  border: 1px solid var(--agent-color-brand-primary);
  border-radius: 999px;
  color: var(--agent-color-brand-primary);
  font-size: 10px;
  padding: 3px 10px;
  cursor: pointer;
  transition: background 0.15s;
}

.wc-widget__welcome-btn:hover {
  background: rgba(59, 130, 246, 0.08);
}

/* Input area */
.wc-widget__input-area {
  background: #fff;
  border: 1px solid #d9e2ef;
  border-radius: 24px;
  box-shadow: 0 12px 28px rgba(15, 23, 42, 0.05);
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  gap: 24px;
  margin: 0 14px 14px;
  min-height: 132px;
  padding: 16px 0 12px;
  width: auto;
}

.wc-widget__input-box {
  color: rgba(100, 116, 145, 0.5);
  font-size: 15px;
  line-height: 1.5;
  min-height: 30px;
  padding: 0 18px;
}

.wc-widget__input-box::before {
  content: "输入信息...";
}

.wc-widget__input-toolbar {
  align-items: center;
  display: flex;
  justify-content: space-between;
  padding: 0 14px;
}

.wc-widget__toolbar-icons {
  align-items: center;
  display: flex;
  gap: 8px;
}

.wc-widget__toolbar-icon {
  align-items: center;
  border-radius: 10px;
  color: #20283a;
  display: inline-flex;
  height: 38px;
  justify-content: center;
  width: 38px;
}

.wc-widget__toolbar-icon--bg {
  background: #f5f8fd;
}

.wc-widget__send-btn {
  align-items: center;
  background: #edf1f7;
  border-radius: 50%;
  color: #9aa7bc;
  display: inline-flex;
  flex-shrink: 0;
  height: 48px;
  justify-content: center;
  width: 48px;
}

/* Footer */
.wc-widget__footer {
  background: transparent;
  color: #8796b3;
  flex-shrink: 0;
  font-size: 12px;
  padding: 2px 6px 18px;
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
  background: var(--agent-color-bg-panel);
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
  color: var(--agent-color-text-tertiary);
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
  background: var(--agent-color-bg-muted);
  color: var(--agent-color-text-secondary);
}

.wc-widget__dialog-btn--primary {
  background: var(--agent-color-status-error);
  color: #fff;
}

.wc-widget__feedback-card-inline-title {
  color: var(--agent-color-text-primary);
  font-size: 12px;
  font-weight: 600;
  margin: 0;
  text-align: center;
}

.wc-widget__feedback-card-inline-options {
  display: flex;
  gap: 24px;
  justify-content: center;
}

.wc-widget__feedback-card-inline-option {
  align-items: center;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.wc-widget__feedback-card-inline-emoji {
  filter: grayscale(0.8);
  font-size: 26px;
  line-height: 1;
}

.wc-widget__feedback-card-inline-label {
  color: var(--agent-color-text-secondary);
  font-size: 10px;
}

/* Form card (inside chat message) */
.wc-widget__form-card {
  background: var(--agent-color-bg-panel);
  border-radius: 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 12px 12px 10px;
  width: 100%;
}

.wc-widget__form-card-title {
  color: var(--agent-color-text-primary);
  font-size: 11px;
  font-weight: 500;
  line-height: 1.45;
  margin: 0;
}

.wc-widget__form-scene-chip {
  align-self: flex-start;
  background: var(--agent-color-brand-soft);
  border-radius: 999px;
  color: var(--agent-color-brand-primary);
  font-size: 10px;
  font-weight: 600;
  line-height: 1;
  margin-bottom: 0;
  padding: 5px 8px;
}

.wc-widget__form-card-fields {
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.wc-widget__form-card-field {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.wc-widget__form-card-label {
  color: var(--agent-color-text-primary);
  font-size: 10px;
  font-weight: 500;
  line-height: 1.4;
}

.wc-widget__form-card-required {
  color: var(--agent-color-status-error);
  font-weight: 500;
  margin-right: 2px;
}

.wc-widget__form-card-input {
  background: var(--agent-color-bg-panel);
  border: 1px solid #d8e0ec;
  border-radius: 10px;
  color: var(--agent-color-text-primary);
  font-size: 11px;
  height: 32px;
  line-height: 32px;
  padding: 0 10px;
}

.wc-widget__form-card-submit {
  background: var(--agent-color-brand-primary);
  align-items: center;
  border-radius: 10px;
  color: #fff;
  display: flex;
  font-size: 11px;
  font-weight: 600;
  height: 32px;
  justify-content: center;
  text-align: center;
}

.wc-widget__form-empty {
  background: var(--agent-color-bg-panel);
  border-radius: 16px;
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.08);
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-width: 280px;
  padding: 18px 16px;
}

.wc-widget__form-empty-title {
  color: var(--agent-color-text-primary);
  font-size: 14px;
  font-weight: 600;
}

.wc-widget__form-empty-text {
  color: var(--agent-color-text-secondary);
  font-size: 13px;
  line-height: 1.6;
  margin: 0;
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

/* ── Quick Access Modal ── */
.wc-modal-overlay {
  align-items: center;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  inset: 0;
  justify-content: center;
  position: fixed;
  z-index: var(--agent-z-modal, 1000);
}

.wc-modal {
  background: var(--agent-color-bg-panel);
  border-radius: 16px;
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  max-width: 560px;
  width: 90vw;
}

.wc-modal__header {
  align-items: center;
  border-bottom: 1px solid var(--agent-color-border-default);
  display: flex;
  justify-content: space-between;
  padding: 20px 24px;
}

.wc-modal__title {
  color: var(--agent-color-text-primary);
  font-size: 16px;
  font-weight: 600;
  margin: 0;
}

.wc-modal__close {
  align-items: center;
  background: transparent;
  border: 0;
  border-radius: 50%;
  color: var(--agent-color-text-tertiary);
  cursor: pointer;
  display: inline-flex;
  height: 28px;
  justify-content: center;
  padding: 0;
  transition: background 0.15s, color 0.15s;
  width: 28px;
}

.wc-modal__close:hover {
  background: var(--agent-color-bg-hover);
  color: var(--agent-color-text-primary);
}

.wc-modal__body {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 24px;
}

.wc-modal__field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.wc-modal__dropdown-wrap {
  position: relative;
  width: 100%;
}

.wc-modal__dropdown {
  background: var(--agent-color-bg-panel);
  border: 1px solid var(--agent-color-border-default);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  left: 0;
  max-height: 200px;
  overflow-y: auto;
  position: absolute;
  right: 0;
  top: calc(100% + 4px);
  z-index: 10;
}

.wc-modal__dropdown-item {
  color: var(--agent-color-text-primary);
  cursor: pointer;
  font-size: 14px;
  padding: 10px 12px;
  transition: background 0.15s;
}

.wc-modal__dropdown-item:hover {
  background: var(--agent-color-bg-hover);
}

.wc-modal__dropdown-empty {
  color: var(--agent-color-text-tertiary);
  font-size: 14px;
  padding: 10px 12px;
}

.wc-modal__tooltip-trigger {
  align-items: center;
  display: inline-flex;
  margin-left: 6px;
  position: relative;
  vertical-align: middle;
}

.wc-modal__tooltip {
  background: rgba(15, 23, 42, 0.94);
  border-radius: 8px;
  bottom: calc(100% + 10px);
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.22);
  color: #fff;
  font-size: 12px;
  font-weight: 400;
  left: 50%;
  line-height: 1.6;
  max-width: calc(100vw - 48px);
  min-width: 280px;
  padding: 10px 12px;
  position: absolute;
  transform: translateX(-50%);
  width: 320px;
  white-space: normal;
  word-break: break-word;
  z-index: 1000;
}

.wc-modal__tooltip::after {
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 5px solid rgba(15, 23, 42, 0.94);
  content: "";
  left: 50%;
  position: absolute;
  top: 100%;
  transform: translateX(-50%);
}

.wc-modal__label {
  color: var(--agent-color-text-primary);
  font-size: 14px;
  font-weight: 500;
}

.wc-modal__input {
  background: var(--agent-color-bg-panel);
  border: 1px solid var(--agent-color-border-default);
  border-radius: 8px;
  color: var(--agent-color-text-primary);
  display: block;
  font-size: 14px;
  outline: none;
  padding: 10px 12px;
  transition: border-color 0.15s;
  width: 100%;
}

.wc-modal__input:focus {
  border-color: var(--agent-color-brand-primary);
}

.wc-modal__textarea {
  background: var(--agent-color-bg-panel);
  border: 1px solid var(--agent-color-border-default);
  border-radius: 8px;
  color: var(--agent-color-text-primary);
  display: block;
  font-size: 14px;
  outline: none;
  padding: 10px 12px;
  transition: border-color 0.15s;
  width: 100%;
  resize: vertical;
  font-family: inherit;
  line-height: 1.5;
}

.wc-modal__textarea:focus {
  border-color: var(--agent-color-brand-primary);
}

.wc-modal__upload-row {
  align-items: center;
  display: flex;
  gap: 12px;
}

.wc-modal__upload {
  align-items: center;
  background: var(--agent-color-bg-muted);
  border: 1px dashed var(--agent-color-border-default);
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  flex-shrink: 0;
  height: 40px;
  justify-content: center;
  position: relative;
  transition: border-color 0.15s;
  width: 40px;
}

.wc-modal__upload:hover {
  border-color: var(--agent-color-brand-primary);
}

.wc-modal__upload-preview {
  border-radius: 50%;
  height: 32px;
  object-fit: cover;
  width: 32px;
}

.wc-modal__upload-placeholder {
  color: var(--agent-color-text-tertiary);
}

.wc-modal__upload-input {
  display: none;
}

.wc-modal__upload.has-icon {
  cursor: default;
}

.wc-modal__upload.has-icon:hover {
  border-color: var(--agent-color-border-default);
}

.wc-modal__upload-preview-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.wc-modal__upload-preview-img {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  overflow: hidden;
}

.wc-modal__upload-preview-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.wc-modal__upload-preview-emoji {
  font-size: 24px;
  line-height: 1;
}

.wc-modal__upload-remove {
  position: absolute;
  top: -4px;
  right: -4px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--agent-color-status-error);
  border: 1px solid #fff;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: opacity 0.15s;
  padding: 0;
}

.wc-modal__upload-remove:hover {
  opacity: 0.8;
}

.wc-modal__hint {
  color: var(--agent-color-text-tertiary);
  font-size: 12px;
  margin: 0;
}

.wc-modal__error-hint {
  color: var(--agent-color-status-error);
  font-size: 12px;
  margin: 8px 0 0 0;
}

.wc-modal__empty-banner {
  background-color: #FFF7E6;
  border: 1px solid #FFD591;
  border-radius: var(--agent-radius-md);
  padding: 12px 16px;
  margin-bottom: 0;
}

.wc-modal__empty-text {
  color: var(--agent-color-text-primary);
  font-size: 14px;
  line-height: 1.5;
  margin: 0;
}

.wc-modal__empty-link {
  color: var(--agent-color-brand-primary);
  cursor: pointer;
  text-decoration: none;
}

.wc-modal__empty-link:hover {
  text-decoration: underline;
}

.wc-modal__radio-group {
  display: flex;
  gap: 24px;
}

.wc-modal__radio {
  align-items: center;
  cursor: pointer;
  display: flex;
  gap: 8px;
}

.wc-modal__radio input {
  accent-color: var(--agent-color-brand-primary);
  height: 16px;
  width: 16px;
}

.wc-modal__radio span {
  color: var(--agent-color-text-primary);
  font-size: 14px;
}

.wc-modal__tabs {
  display: flex;
  gap: 0;
  border: 1px solid var(--agent-color-border-default);
  border-radius: 6px;
  overflow: hidden;
  margin-bottom: 12px;
}

.wc-modal__tab {
  flex: 1;
  padding: 8px 16px;
  background: var(--agent-color-bg-panel);
  border: none;
  color: var(--agent-color-text-secondary);
  font-size: 14px;
  cursor: pointer;
  transition: all 0.15s;
  border-right: 1px solid var(--agent-color-border-default);
}

.wc-modal__tab:last-child {
  border-right: none;
}

.wc-modal__tab:hover {
  background: var(--agent-color-bg-muted);
}

.wc-modal__tab.is-active {
  background: var(--agent-color-brand-primary);
  color: #fff;
}

.wc-modal__input-group {
  display: flex;
  align-items: stretch;
  border: 1px solid var(--agent-color-border-default);
  border-radius: 6px;
  overflow: hidden;
  transition: border-color 0.15s;
}

.wc-modal__input-group:focus-within {
  border-color: var(--agent-color-brand-primary);
}

.wc-modal__input-prefix {
  padding: 0 12px;
  background: var(--agent-color-bg-muted);
  border: none;
  color: var(--agent-color-text-primary);
  font-size: 14px;
  cursor: pointer;
  white-space: nowrap;
  flex-shrink: 0;
}

.wc-modal__input-divider {
  width: 1px;
  background: var(--agent-color-border-default);
  flex-shrink: 0;
}

.wc-modal__input--merged {
  border: none;
  border-radius: 0;
  flex: 1;
}

.wc-modal__input--merged:focus {
  outline: none;
  box-shadow: none;
}

.wc-modal__footer {
  border-top: 1px solid var(--agent-color-border-default);
  display: flex;
  justify-content: flex-end;
  padding: 16px 24px;
}

.wc-modal__btn {
  border: 0;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  padding: 10px 24px;
  transition: opacity 0.15s;
  width: 100%;
}

.wc-modal__btn--primary {
  background: var(--agent-color-brand-primary);
  color: #fff;
}

.wc-modal__btn--primary:hover {
  opacity: 0.9;
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
  background: var(--agent-color-bg-panel);
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
.wc-invite-bubble-wrap {
  position: absolute;
  bottom: calc(100% + 12px);
  right: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 6px;
}
.wc-invite-bubble {
  background: #fff;
  border-radius: 12px;
  padding: 14px 18px;
  min-width: 300px;
  max-width: 320px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.10);
}
.wc-invite-bubble__close {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: rgba(100, 110, 130, 0.75);
  border: none;
  cursor: pointer;
  color: #fff;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}
.wc-invite-bubble--agent {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 12px 14px;
}
.wc-invite-bubble__avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  flex-shrink: 0;
}
.wc-invite-bubble__agent-body {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.wc-invite-bubble__agent-name {
  font-size: 12px;
  color: var(--agent-color-brand-primary);
  font-weight: var(--agent-font-weight-medium);
}
.wc-invite-bubble__text {
  font-size: 14px;
  color: var(--agent-color-text-primary);
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

@media (max-width: 900px) {
  .widget-customize {
    grid-template-columns: 1fr;
    grid-template-rows: 1fr 1fr;
  }
}
</style>
