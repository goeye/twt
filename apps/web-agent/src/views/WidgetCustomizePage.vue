<template>
  <section class="widget-customize">
    <!-- Left: Settings Panel -->
    <div class="wc-settings agent-scroll">
      <header class="wc-settings__header">
        <h1 class="wc-settings__title">小部件设置</h1>
        <p class="wc-settings__subtitle">配置您的聊天小部件功能和显示选项</p>
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
                <input v-model="settings.brandName" class="agent-input wc-input" placeholder="输入品牌名称..." />
              </div>
            </div>
          </div>
        </article>

        <!-- Accordion: Widget Position -->
        <article class="wc-accordion" :class="{ 'wc-accordion--open': openSection === 'position' }">
          <button type="button" class="wc-accordion__trigger" @click="toggleSection('position')">
            <div class="wc-accordion__trigger-text">
              <h3 class="wc-card__title">小部件位置</h3>
              <p class="wc-card__desc">设置聊天小部件在页面上的位置</p>
            </div>
            <span class="wc-accordion__chevron" />
          </button>
          <div v-if="openSection === 'position'" class="wc-accordion__body">
            <div class="wc-position-choices">
              <button
                type="button"
                class="wc-position-card"
                :class="{ 'wc-position-card--active': settings.widgetPosition === 'bottom-left' }"
                @click="settings.widgetPosition = 'bottom-left'"
              >
                <div class="wc-position-thumb"><span class="wc-position-dot wc-position-dot--left" /></div>
                <span class="wc-position-card__label">左下角</span>
              </button>
              <button
                type="button"
                class="wc-position-card"
                :class="{ 'wc-position-card--active': settings.widgetPosition === 'bottom-right' }"
                @click="settings.widgetPosition = 'bottom-right'"
              >
                <div class="wc-position-thumb"><span class="wc-position-dot wc-position-dot--right" /></div>
                <span class="wc-position-card__label">右下角</span>
              </button>
            </div>
            <div class="wc-offset-row">
              <div class="wc-offset-field">
                <label class="wc-label">距离底部 (px)</label>
                <input v-model.number="settings.positionOffsetY" type="number" class="agent-input wc-input" />
              </div>
              <div class="wc-offset-field">
                <label class="wc-label">{{ settings.widgetPosition === 'bottom-left' ? '距离左边' : '距离右边' }} (px)</label>
                <input v-model.number="settings.positionOffsetX" type="number" class="agent-input wc-input" />
              </div>
            </div>
          </div>
        </article>

        <!-- Accordion: Display Settings -->
        <article class="wc-accordion" :class="{ 'wc-accordion--open': openSection === 'display' }">
          <button type="button" class="wc-accordion__trigger" @click="toggleSection('display')">
            <div class="wc-accordion__trigger-text">
              <h3 class="wc-card__title">显示设置</h3>
            </div>
            <span class="wc-accordion__chevron" />
          </button>
          <div v-if="openSection === 'display'" class="wc-accordion__body">
            <div class="wc-switch-row">
              <div class="wc-switch-row__text">
                <span class="wc-switch-label">隐藏官方标识</span>
                <span class="wc-switch-desc">隐藏小部件底部的官方品牌标识</span>
              </div>
              <AgentSwitch v-model="settings.hideBrandLogo" />
            </div>
          </div>
        </article>

        <!-- Accordion: Quick Access -->
        <article class="wc-accordion" :class="{ 'wc-accordion--open': openSection === 'quickAccess' }">
          <button type="button" class="wc-accordion__trigger" @click="toggleSection('quickAccess')">
            <div class="wc-accordion__trigger-text">
              <h3 class="wc-card__title">快捷入口</h3>
              <p class="wc-card__desc">访客在聊天和会话过程中，可看到您配置的快捷入口，并支持点击跳转</p>
            </div>
            <span class="wc-accordion__chevron" />
          </button>
          <div v-if="openSection === 'quickAccess'" class="wc-accordion__body">
            <div class="wc-lang-tabs">
              <button
                v-for="lang in langTabs"
                :key="lang.key"
                type="button"
                class="wc-lang-tab"
                :class="{ 'wc-lang-tab--active': activeLangTab === lang.key }"
                @click="activeLangTab = lang.key"
              >
                {{ lang.label }}
              </button>
            </div>
            <div class="wc-quick-tags">
              <button type="button" class="wc-quick-tag wc-quick-tag--add" @click="addQuickAccess">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round" /></svg>
                添加
              </button>
              <span v-for="item in settings.quickAccessItems" :key="item.id" class="wc-quick-tag">
                {{ item.label }}
                <button type="button" class="wc-quick-tag__remove" @click="removeQuickAccess(item.id)">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" /></svg>
                </button>
              </span>
            </div>
          </div>
        </article>

        <a class="wc-help-link" href="javascript:void(0)" @click="emitToast('帮助文档开发中')">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" />
            <path d="M9.5 9a2.5 2.5 0 0 1 5 0c0 1.5-2.5 2-2.5 3.5M12 17h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
          </svg>
          了解如何自定义您的小部件
        </a>
      </div>

      <!-- Content Tab -->
      <div v-else-if="activeTab === 'content'" class="wc-tab-content">
        <article v-for="block in autoReplyBlocks" :key="block.key" class="wc-accordion" :class="{ 'wc-accordion--open': openSection === block.key }">
          <button type="button" class="wc-accordion__trigger" @click="toggleSection(block.key)">
            <div class="wc-accordion__trigger-text">
              <h3 class="wc-card__title">{{ block.title }}</h3>
              <p class="wc-card__desc">{{ block.desc }}</p>
            </div>
            <AgentSwitch v-model="autoReplyToggles[block.key]" @click.stop />
            <span class="wc-accordion__chevron" />
          </button>
          <div v-if="openSection === block.key && autoReplyToggles[block.key]" class="wc-accordion__body">
            <div class="wc-reply-section">
              <span class="wc-reply-section__label">{{ block.title }}</span>
              <div class="wc-lang-tabs">
                <button
                  v-for="lang in contentLangTabs"
                  :key="lang.key"
                  type="button"
                  class="wc-lang-tab"
                  :class="{ 'wc-lang-tab--active': activeContentLangs[block.key] === lang.key }"
                  @click="activeContentLangs[block.key] = lang.key"
                >
                  {{ lang.label }}
                </button>
              </div>
            </div>
            <div class="wc-rich-editor">
              <textarea
                v-model="autoReplyTexts[block.key][activeContentLangs[block.key]]"
                class="wc-rich-editor__textarea"
                rows="4"
                :placeholder="block.placeholder"
              />
              <div class="wc-rich-editor__toolbar">
                <button type="button" class="wc-rich-editor__upload" @click="emitToast('图片上传功能开发中')">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round" /></svg>
                </button>
              </div>
            </div>
            <p class="wc-upload-hint">支持png、jpg、jpeg格式图片，单张图片小于2MB，最多上传10张</p>
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
            <AgentSwitch v-model="settings.enableSessionForm" @click.stop />
            <span class="wc-accordion__chevron" />
          </button>
          <div v-if="openSection === 'sessionForm' && settings.enableSessionForm" class="wc-accordion__body">
            <div class="wc-lang-tabs">
              <button
                v-for="lang in formLangTabs"
                :key="lang.key"
                type="button"
                class="wc-lang-tab"
                :class="{ 'wc-lang-tab--active': activeFormLang === lang.key }"
                @click="activeFormLang = lang.key"
              >
                {{ lang.label }}
              </button>
            </div>
            <div class="wc-form-title-row">
              <label class="wc-label">表单标题</label>
              <input v-model="settings.formTitle" class="agent-input wc-input" placeholder="Welcome! Please fill in the information..." />
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
                  <span class="wc-form-field-label">{{ field.label }}</span>
                  <input v-model="field.placeholder" class="agent-input wc-input wc-form-field-placeholder" placeholder="占位符文字..." />
                  <label class="wc-checkbox-label">
                    <input type="checkbox" v-model="field.required" class="wc-checkbox" />
                    必填
                  </label>
                  <button type="button" class="wc-form-field-delete" @click="removeFormField(idx)">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                  </button>
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
              <AgentSwitch v-model="settings.enableReadReceipt" />
            </div>
            <div class="wc-divider" />
            <div class="wc-switch-row">
              <div class="wc-switch-row__text">
                <span class="wc-switch-label">客服在线状态（聊天）</span>
                <span class="wc-switch-desc">开启后，访客可在单聊中看到客服的在线状态</span>
              </div>
              <AgentSwitch v-model="settings.showAgentOnlineStatus" />
            </div>
          </div>
        </article>

        <article class="wc-accordion" :class="{ 'wc-accordion--open': openSection === 'sessionFeatures' }">
          <button type="button" class="wc-accordion__trigger" @click="toggleSection('sessionFeatures')">
            <div class="wc-accordion__trigger-text">
              <h3 class="wc-card__title">会话功能</h3>
            </div>
            <span class="wc-accordion__chevron" />
          </button>
          <div v-if="openSection === 'sessionFeatures'" class="wc-accordion__body">
            <div class="wc-switch-row">
              <div class="wc-switch-row__text">
                <span class="wc-switch-label">发起会话</span>
                <span class="wc-switch-desc">开启后，聊天小部件中显示新的会话按钮，访客可主动发起咨询；关闭后入口隐藏</span>
              </div>
              <AgentSwitch v-model="settings.enableStartSession" />
            </div>
            <div class="wc-divider" />
            <div class="wc-switch-row">
              <div class="wc-switch-row__text">
                <span class="wc-switch-label">删除会话</span>
                <span class="wc-switch-desc">开启后，访客会话列表显示删除按钮，访客可删除会话</span>
              </div>
              <AgentSwitch v-model="settings.enableDeleteSession" />
            </div>
            <div class="wc-divider" />
            <div class="wc-switch-row">
              <div class="wc-switch-row__text">
                <span class="wc-switch-label">主动结束会话</span>
                <span class="wc-switch-desc">开启后，访客在删除会话时可选择主动结束会话</span>
              </div>
              <AgentSwitch v-model="settings.enableEndSession" />
            </div>
          </div>
        </article>
      </div>
    </div>

    <!-- Right: Preview Panel -->
    <div class="wc-preview">
      <header class="wc-preview__header">
        <div class="wc-preview__title-row">
          <span class="wc-preview__title">预览</span>
          <span class="wc-preview__sync">实时同步设置</span>
        </div>
        <select v-model="previewMode" class="agent-input wc-preview-select">
          <option value="sessionList">会话列表</option>
          <option value="chat">聊天</option>
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
            <div class="wc-widget__header-actions">
              <span class="wc-widget__header-btn wc-widget__header-btn--dots">···</span>
              <span class="wc-widget__header-btn">&times;</span>
            </div>
          </div>
          <div class="wc-widget__session-list">
            <div
              v-for="(s, i) in mockSessions"
              :key="i"
              class="wc-session-item"
              :class="{ 'wc-session-item--show-delete': settings.enableDeleteSession }"
              @mouseenter="hoveredSession = i"
              @mouseleave="hoveredSession = -1"
            >
              <!-- Delete button (visible on hover when enabled) -->
              <button
                v-if="settings.enableDeleteSession"
                type="button"
                class="wc-session-item__delete-btn"
                @click.stop="deleteConfirmSession = deleteConfirmSession === i ? -1 : i"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" />
                </svg>
              </button>
              <div class="wc-session-item__avatar" :style="{ background: s.color }">
                <span>{{ s.icon }}</span>
              </div>
              <div class="wc-session-item__body">
                <div class="wc-session-item__top">
                  <span class="wc-session-item__name">{{ s.name }}</span>
                  <span class="wc-session-item__time">{{ s.time }}</span>
                </div>
                <div class="wc-session-item__bottom">
                  <span class="wc-session-item__msg">{{ s.lastMsg }}</span>
                  <span v-if="s.badge" class="wc-session-item__badge">{{ s.badge }}</span>
                </div>
              </div>
              <!-- Delete confirmation popover -->
              <div v-if="deleteConfirmSession === i" class="wc-delete-popover">
                <button type="button" class="wc-delete-popover__item wc-delete-popover__item--danger">删除会话</button>
                <button v-if="settings.enableEndSession" type="button" class="wc-delete-popover__item wc-delete-popover__item--danger">结束并删除会话</button>
                <button type="button" class="wc-delete-popover__item" @click.stop="deleteConfirmSession = -1">取消</button>
              </div>
            </div>
          </div>
          <div v-if="settings.enableStartSession" class="wc-widget__new-session-btn">新的会话</div>
          <div v-if="!settings.hideBrandLogo" class="wc-widget__footer">技术支持 CHATWIDGET</div>
        </div>

        <!-- Chat Preview Widget -->
        <div v-else-if="previewMode === 'chat'" class="wc-widget wc-widget--tall" :style="widgetPositionStyle">
          <div class="wc-widget__header">
            <div class="wc-widget__header-left">
              <img :src="settings.brandLogoUrl" class="wc-widget__avatar-img" alt="" />
              <div class="wc-widget__header-info">
                <span class="wc-widget__brand-name">{{ settings.brandName || 'TWT' }}</span>
                <span v-if="settings.showAgentOnlineStatus" class="wc-widget__online-dot" />
              </div>
            </div>
            <div class="wc-widget__header-actions">
              <span class="wc-widget__header-btn">&#8211;</span>
              <span class="wc-widget__header-btn">&times;</span>
            </div>
          </div>
          <div class="wc-widget__messages">
            <div v-if="activeAutoReplyKey !== 'end'" class="wc-widget__msg wc-widget__msg--agent">
              <img :src="settings.brandLogoUrl" class="wc-widget__msg-avatar-img" alt="" />
              <div class="wc-widget__msg-bubble">
                <span class="wc-widget__msg-tag">{{ chatPreviewLabel }}</span>
                {{ chatPreviewAgentMsg }}
              </div>
            </div>
            <div class="wc-widget__msg wc-widget__msg--visitor">
              <div class="wc-widget__msg-bubble wc-widget__msg-bubble--visitor">你好，我想了解一下你们的产品</div>
            </div>
            <div v-if="settings.enableReadReceipt" class="wc-widget__read-receipt">已读</div>
            <div v-if="activeAutoReplyKey === 'end'" class="wc-widget__msg wc-widget__msg--agent">
              <img :src="settings.brandLogoUrl" class="wc-widget__msg-avatar-img" alt="" />
              <div class="wc-widget__msg-bubble">
                <span class="wc-widget__msg-tag">{{ chatPreviewLabel }}</span>
                {{ chatPreviewAgentMsg }}
              </div>
            </div>
          </div>
          <div v-if="settings.quickAccessItems.length > 0" class="wc-widget__quick-access">
            <span v-for="item in settings.quickAccessItems" :key="item.id" class="wc-widget__qa-tag">{{ item.label }}</span>
          </div>
          <div class="wc-widget__input-area">
            <span class="wc-widget__emoji-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" />
                <path d="M8 14s1.5 2 4 2 4-2 4-2" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                <circle cx="9" cy="9" r="1" fill="currentColor" /><circle cx="15" cy="9" r="1" fill="currentColor" />
              </svg>
            </span>
            <span class="wc-widget__input-placeholder">输入消息...</span>
            <span class="wc-widget__send-btn">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>
            </span>
          </div>
          <div v-if="!settings.hideBrandLogo" class="wc-widget__footer">技术支持 CHATWIDGET</div>
        </div>

        <!-- Form Preview Widget -->
        <div v-else-if="previewMode === 'form'" class="wc-widget wc-widget--tall" :style="widgetPositionStyle">
          <div class="wc-widget__header">
            <div class="wc-widget__header-left">
              <img :src="settings.brandLogoUrl" class="wc-widget__avatar-img" alt="" />
              <span class="wc-widget__brand-name">{{ settings.brandName || 'TWT' }}</span>
            </div>
            <div class="wc-widget__header-actions">
              <span class="wc-widget__header-btn">&#8211;</span>
              <span class="wc-widget__header-btn">&times;</span>
            </div>
          </div>
          <div class="wc-widget__form-body">
            <p class="wc-widget__form-title">{{ settings.formTitle || 'Welcome! Please fill in the information.' }}</p>
            <div v-for="field in settings.formFields" :key="field.id" class="wc-widget__form-field">
              <label class="wc-widget__form-label">
                {{ field.label }}
                <span v-if="field.required" class="wc-widget__required">*</span>
              </label>
              <div class="wc-widget__form-input">{{ field.placeholder }}</div>
            </div>
            <div class="wc-widget__form-submit">开始会话</div>
          </div>
          <div v-if="!settings.hideBrandLogo" class="wc-widget__footer">技术支持 CHATWIDGET</div>
        </div>

        <!-- Minimized Preview -->
        <div v-else class="wc-widget-fab" :style="widgetPositionStyle">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </div>
      </div>
    </div>

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
import { AgentSwitch } from "@twt/ui-agent";

interface QuickAccessItem {
  id: string;
  label: string;
  url: string;
}

interface FormField {
  id: string;
  type: "name" | "phone" | "email" | "text" | "select";
  label: string;
  placeholder: string;
  required: boolean;
}

type TabKey = "appearance" | "content" | "form" | "general";
type PreviewMode = "sessionList" | "chat" | "form" | "minimized";
type SectionKey = "brand" | "position" | "display" | "quickAccess"
  | "welcome" | "end" | "sessionOffline" | "chatOffline"
  | "sessionForm" | "msgStatus" | "sessionFeatures" | null;

const DEFAULT_LOGO = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='14' fill='%232F6BFF'/%3E%3Cpath d='M44 22H20a2 2 0 00-2 2v12a2 2 0 002 2h4l4 4 4-4h12a2 2 0 002-2V24a2 2 0 00-2-2z' fill='white' opacity='0.9'/%3E%3Ccircle cx='26' cy='30' r='2' fill='%232F6BFF'/%3E%3Ccircle cx='32' cy='30' r='2' fill='%232F6BFF'/%3E%3Ccircle cx='38' cy='30' r='2' fill='%232F6BFF'/%3E%3Cpath d='M46 18h2a2 2 0 012 2v1' stroke='white' stroke-width='1.5' stroke-linecap='round' fill='none' opacity='0.7'/%3E%3Cpath d='M48 17l-1-2M50 19l2-1' stroke='white' stroke-width='1.2' stroke-linecap='round' fill='none' opacity='0.5'/%3E%3C/svg%3E";

const emit = defineEmits<{
  (e: "toast", message: string): void;
}>();

const emitToast = (msg: string) => emit("toast", msg);

const tabs: { key: TabKey; label: string }[] = [
  { key: "appearance", label: "外观" },
  { key: "content", label: "内容" },
  { key: "form", label: "会话表单" },
  { key: "general", label: "常规" }
];

const langTabs = [
  { key: "list", label: "访问列表" },
  { key: "en", label: "英文" },
  { key: "zh-cn", label: "简体中文" }
];

const formLangTabs = [
  { key: "en", label: "英文" },
  { key: "zh-cn", label: "简体中文" },
  { key: "zh-tw", label: "繁体中文" }
];

const contentLangTabs = [
  { key: "en", label: "英文" },
  { key: "zh-cn", label: "简体中文" },
  { key: "zh-tw", label: "繁体中文" }
];

type AutoReplyKey = "welcome" | "end" | "sessionOffline" | "chatOffline";
type LangKey = "en" | "zh-cn" | "zh-tw";

const autoReplyBlocks: { key: AutoReplyKey; title: string; desc: string; placeholder: string }[] = [
  { key: "welcome", title: "欢迎语", desc: "当访客发起会话时，系统自动发送一条欢迎语消息", placeholder: "Hello, is there anything I can help you with?" },
  { key: "end", title: "结束语", desc: "会话结束时，系统自动发送一条告别消息", placeholder: "Thank you for your inquiry. Have a great day!" },
  { key: "sessionOffline", title: "会话离线自动回复", desc: "当客服不在线时，访客在会话中收到的自动回复", placeholder: "Our agents are currently offline..." },
  { key: "chatOffline", title: "单聊离线自动回复", desc: "当客服不在线时，访客在单聊中收到的自动回复", placeholder: "The agent is currently offline..." }
];

const activeTab = ref<TabKey>("appearance");
const activeLangTab = ref("list");
const activeFormLang = ref("en");
const previewMode = ref<PreviewMode>("sessionList");
const openSection = ref<SectionKey>("brand");

const activeContentLangs = reactive<Record<AutoReplyKey, LangKey>>({
  welcome: "en", end: "en", sessionOffline: "en", chatOffline: "en"
});

const autoReplyToggles = reactive<Record<AutoReplyKey, boolean>>({
  welcome: true, end: true, sessionOffline: true, chatOffline: true
});

const autoReplyTexts = reactive<Record<AutoReplyKey, Record<LangKey, string>>>({
  welcome: { en: "Hello, is there anything I can help you with?", "zh-cn": "你好！有什么可以帮您的吗？", "zh-tw": "你好！有什麼可以幫您的嗎？" },
  end: { en: "Thank you for your inquiry. Have a great day!", "zh-cn": "感谢您的咨询，祝您生活愉快！", "zh-tw": "感謝您的諮詢，祝您生活愉快！" },
  sessionOffline: { en: "Our agents are currently offline. We will reply as soon as we are back.", "zh-cn": "当前客服不在线，我们会在上线后第一时间回复您。", "zh-tw": "當前客服不在線，我們會在上線後第一時間回覆您。" },
  chatOffline: { en: "The agent is currently offline. Please try again later or leave your contact info.", "zh-cn": "客服暂时不在线，请稍后再试或留下您的联系方式。", "zh-tw": "客服暫時不在線，請稍後再試或留下您的聯繫方式。" }
});

// Section -> preview mapping (null = don't change)
const sectionToPreview: Partial<Record<NonNullable<SectionKey>, PreviewMode | null>> = {
  brand: "sessionList",
  position: "sessionList",
  display: "sessionList",
  quickAccess: "chat",
  welcome: "chat",
  end: "chat",
  sessionOffline: "chat",
  chatOffline: "chat",
  sessionForm: "form",
  msgStatus: null,
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
  general: "msgStatus"
};

const switchTab = (key: TabKey) => {
  activeTab.value = key;
  openSection.value = defaultSections[key];
  if (openSection.value) {
    const target = sectionToPreview[openSection.value];
    if (target !== undefined && target !== null) {
      previewMode.value = target;
    }
  }
};

// Computed: which auto-reply message to show in chat preview
const autoReplyKeys: AutoReplyKey[] = ["welcome", "end", "sessionOffline", "chatOffline"];
const activeAutoReplyKey = computed<AutoReplyKey>(() => {
  if (openSection.value && autoReplyKeys.includes(openSection.value as AutoReplyKey)) {
    return openSection.value as AutoReplyKey;
  }
  return "welcome";
});

const chatPreviewAgentMsg = computed(() => {
  const key = activeAutoReplyKey.value;
  const lang = activeContentLangs[key];
  return autoReplyTexts[key][lang] || "Hello!";
});

const chatPreviewLabel = computed(() => {
  const labels: Record<AutoReplyKey, string> = {
    welcome: "欢迎语",
    end: "结束语",
    sessionOffline: "会话离线回复",
    chatOffline: "单聊离线回复"
  };
  return labels[activeAutoReplyKey.value];
});

const settings = reactive({
  brandName: "够上信息科技（合肥）有限...",
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
  formTitle: "Welcome! Please fill in the information.",
  formFields: [
    { id: "f-1", type: "name", label: "姓名", placeholder: "Enter your name", required: true },
    { id: "f-2", type: "email", label: "邮箱", placeholder: "Enter your email", required: true },
    { id: "f-3", type: "phone", label: "电话", placeholder: "Enter your phone", required: false }
  ] as FormField[],
  enableReadReceipt: true,
  showAgentOnlineStatus: true,
  enableStartSession: true,
  enableDeleteSession: false,
  enableEndSession: false
});

const mockSessions = [
  { name: "新的会话", lastMsg: "你好？", time: "06:56", badge: 0, icon: "?", color: "#42b4f5" },
  { name: "了解域名金牌会员业务...", lastMsg: "已记录，专人跟进。", time: "06:56", badge: 1, icon: "了", color: "#f5a623" },
  { name: "未知问题", lastMsg: "快点接入客服", time: "06:56", badge: 4, icon: "?", color: "#42b4f5" }
];

const hoveredSession = ref(-1);
const deleteConfirmSession = ref(-1);

const widgetPositionStyle = computed(() => {
  const isLeft = settings.widgetPosition === "bottom-left";
  return {
    bottom: `${settings.positionOffsetY}px`,
    [isLeft ? "left" : "right"]: `${settings.positionOffsetX}px`,
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
  emitToast("Logo 已更新");
};

let qaCounter = 3;
const addQuickAccess = () => {
  const id = `qa-${qaCounter++}`;
  settings.quickAccessItems.push({ id, label: `入口${settings.quickAccessItems.length + 1}`, url: "#" });
};

const removeQuickAccess = (id: string) => {
  settings.quickAccessItems = settings.quickAccessItems.filter(i => i.id !== id);
};

let fieldCounter = 4;
const addFormField = () => {
  const id = `f-${fieldCounter++}`;
  settings.formFields.push({ id, type: "text", label: "自定义字段", placeholder: "请输入...", required: false });
};

const removeFormField = (idx: number) => {
  settings.formFields.splice(idx, 1);
};
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
  border-top: 1px solid var(--agent-color-border-default);
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
  border-radius: 14px;
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
.wc-position-choices {
  display: grid;
  gap: var(--agent-space-12);
  grid-template-columns: 1fr 1fr;
}

.wc-position-card {
  align-items: center;
  background: var(--agent-color-bg-panel);
  border: 2px solid var(--agent-color-border-default);
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px;
  transition: border-color 0.15s, background 0.15s;
}

.wc-position-card:hover {
  border-color: var(--agent-color-brand-primary);
}

.wc-position-card--active {
  background: rgba(47, 107, 255, 0.06);
  border-color: var(--agent-color-brand-primary);
}

.wc-position-thumb {
  background: var(--agent-color-bg-muted);
  border-radius: 6px;
  height: 48px;
  position: relative;
  width: 100%;
}

.wc-position-dot {
  background: var(--agent-color-brand-primary);
  border-radius: 50%;
  bottom: 6px;
  height: 8px;
  position: absolute;
  width: 8px;
}

.wc-position-dot--left { left: 6px; }
.wc-position-dot--right { right: 6px; }

.wc-position-card__label {
  color: var(--agent-color-text-secondary);
  font-size: var(--agent-font-size-sm);
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

/* Language tabs */
.wc-lang-tabs {
  border-bottom: 1px solid var(--agent-color-border-default);
  display: flex;
  gap: 0;
}

.wc-lang-tab {
  background: transparent;
  border: 0;
  color: var(--agent-color-text-tertiary);
  cursor: pointer;
  font-size: var(--agent-font-size-xs);
  font-weight: var(--agent-font-weight-medium);
  padding: 8px 12px;
  position: relative;
  transition: color 0.15s;
}

.wc-lang-tab:hover { color: var(--agent-color-text-primary); }

.wc-lang-tab--active { color: var(--agent-color-brand-primary); }

.wc-lang-tab--active::after {
  background: var(--agent-color-brand-primary);
  border-radius: 2px 2px 0 0;
  bottom: 0;
  content: "";
  height: 2px;
  left: 8px;
  position: absolute;
  right: 8px;
}

/* Quick access tags */
.wc-quick-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.wc-quick-tag {
  align-items: center;
  background: var(--agent-color-bg-muted);
  border: 1px solid var(--agent-color-border-default);
  border-radius: 999px;
  color: var(--agent-color-text-secondary);
  display: inline-flex;
  font-size: var(--agent-font-size-xs);
  gap: 6px;
  padding: 5px 12px;
}

.wc-quick-tag--add {
  border-style: dashed;
  cursor: pointer;
  transition: border-color 0.15s, color 0.15s;
}

.wc-quick-tag--add:hover {
  border-color: var(--agent-color-brand-primary);
  color: var(--agent-color-brand-primary);
}

.wc-quick-tag__remove {
  align-items: center;
  background: transparent;
  border: 0;
  color: var(--agent-color-text-tertiary);
  cursor: pointer;
  display: inline-flex;
  padding: 0;
  transition: color 0.15s;
}

.wc-quick-tag__remove:hover { color: var(--agent-color-status-error); }

/* Help link */
.wc-help-link {
  align-items: center;
  color: var(--agent-color-brand-primary);
  display: inline-flex;
  font-size: var(--agent-font-size-sm);
  gap: 6px;
  text-decoration: none;
}

.wc-help-link:hover { text-decoration: underline; }

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

.wc-rich-editor__toolbar {
  display: flex;
  padding: 6px 12px 12px;
}

.wc-rich-editor__upload {
  align-items: center;
  background: var(--agent-color-bg-muted);
  border: 0;
  border-radius: 10px;
  color: var(--agent-color-text-tertiary);
  cursor: pointer;
  display: inline-flex;
  height: 36px;
  justify-content: center;
  transition: background 0.15s, color 0.15s;
  width: 36px;
}

.wc-rich-editor__upload:hover {
  background: var(--agent-color-border-default);
  color: var(--agent-color-text-secondary);
}

.wc-upload-hint {
  color: var(--agent-color-text-tertiary);
  font-size: var(--agent-font-size-xs);
  line-height: 1.4;
  margin: 0;
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
  justify-content: space-between;
  padding: 14px var(--agent-space-24);
}

.wc-preview__title-row {
  align-items: baseline;
  display: flex;
  gap: 8px;
}

.wc-preview__title {
  color: var(--agent-color-text-primary);
  font-size: var(--agent-font-size-md);
  font-weight: var(--agent-font-weight-semibold);
}

.wc-preview__sync {
  color: var(--agent-color-text-tertiary);
  font-size: var(--agent-font-size-xs);
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
  min-height: 520px;
}

.wc-widget__header {
  align-items: center;
  background: var(--agent-color-brand-primary);
  color: #fff;
  display: flex;
  flex-shrink: 0;
  justify-content: space-between;
  padding: 14px 16px;
}

.wc-widget__header-left {
  align-items: center;
  display: flex;
  gap: 10px;
  min-width: 0;
}

.wc-widget__avatar-img {
  border-radius: 10px;
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
  padding: 12px 16px;
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

/* Session delete button */
.wc-session-item {
  position: relative;
}

.wc-session-item__delete-btn {
  align-items: center;
  background: rgba(0, 0, 0, 0.06);
  border: 0;
  border-radius: 50%;
  color: var(--agent-color-text-tertiary);
  cursor: pointer;
  display: none;
  flex-shrink: 0;
  height: 22px;
  justify-content: center;
  transition: color 0.15s, background 0.15s;
  width: 22px;
}

.wc-session-item--show-delete:hover .wc-session-item__delete-btn {
  display: inline-flex;
}

.wc-session-item__delete-btn:hover {
  background: rgba(240, 68, 56, 0.12);
  color: var(--agent-color-status-error);
}

/* Delete confirmation popover */
.wc-delete-popover {
  background: #fff;
  border: 1px solid var(--agent-color-border-default);
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
  display: flex;
  flex-direction: column;
  left: 30px;
  overflow: hidden;
  position: absolute;
  top: 100%;
  white-space: nowrap;
  z-index: 10;
}

.wc-delete-popover__item {
  background: transparent;
  border: 0;
  color: var(--agent-color-text-primary);
  cursor: default;
  font-size: 12px;
  padding: 9px 16px;
  text-align: left;
}

.wc-delete-popover__item:not(:last-child) {
  border-bottom: 1px solid var(--agent-color-border-default);
}

.wc-delete-popover__item--danger {
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
  align-items: flex-start;
  display: flex;
  gap: 8px;
}

.wc-widget__msg--visitor { flex-direction: row-reverse; }

.wc-widget__msg-avatar-img {
  border-radius: 8px;
  flex-shrink: 0;
  height: 26px;
  object-fit: cover;
  width: 26px;
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
  align-items: center;
  background: #fff;
  border-top: 1px solid var(--agent-color-border-default);
  display: flex;
  flex-shrink: 0;
  gap: 8px;
  padding: 10px 14px;
}

.wc-widget__emoji-btn {
  color: var(--agent-color-text-tertiary);
  display: inline-flex;
  flex-shrink: 0;
}

.wc-widget__input-placeholder {
  color: var(--agent-color-text-tertiary);
  flex: 1;
  font-size: 12px;
}

.wc-widget__send-btn {
  align-items: center;
  background: var(--agent-color-brand-primary);
  border-radius: 50%;
  color: #fff;
  display: inline-flex;
  flex-shrink: 0;
  height: 28px;
  justify-content: center;
  width: 28px;
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

/* Form preview */
.wc-widget__form-body {
  background: #fff;
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
}

.wc-widget__form-title {
  color: var(--agent-color-text-primary);
  font-size: 12px;
  line-height: 1.5;
  margin: 0;
}

.wc-widget__form-field {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.wc-widget__form-label {
  color: var(--agent-color-text-secondary);
  font-size: 11px;
  font-weight: 500;
}

.wc-widget__required { color: var(--agent-color-status-error); }

.wc-widget__form-input {
  background: #f5f5f5;
  border: 1px solid var(--agent-color-border-default);
  border-radius: 8px;
  color: var(--agent-color-text-tertiary);
  font-size: 11px;
  padding: 7px 10px;
}

.wc-widget__form-submit {
  background: var(--agent-color-brand-primary);
  border-radius: 10px;
  color: #fff;
  font-size: 12px;
  font-weight: 600;
  margin-top: 4px;
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
  display: flex;
  height: 56px;
  justify-content: center;
  position: absolute;
  width: 56px;
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
