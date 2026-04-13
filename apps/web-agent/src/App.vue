<template>
  <AgentAppShell :key="currentShellRenderKey" :hide-subnav="isHomeRoute">
    <template #nav-rail>
      <PrimaryNavRail :active-key="activeMainNav" :items="mainNavItems" @select="handleMainNavSelect">
        <template #brand="{ expanded }">
          <div v-if="expanded" class="brand-expanded-wrap" @mouseenter="openProjectSwitcherHover" @mouseleave="closeProjectSwitcherHover">
            <div class="brand-expanded">
              <span class="brand-expanded__glyph">
                <button type="button" class="brand-mark" :aria-label="`${tenant.name} 品牌`">{{ tenant.name.charAt(0) }}</button>
              </span>
              <span class="brand-expanded__name">{{ tenant.displayName }}</span>
              <AgentIcon name="chevron-down" :size="14" class="brand-expanded__arrow" />
            </div>
            <div v-if="projectSwitcherOpen" class="project-switcher-panel" @click.stop>
              <div v-if="!projectManageOpen">
                <div class="project-switcher-panel__header">
                  <h4 class="project-switcher-panel__title">切换项目</h4>
                  <button type="button" class="project-switcher-panel__manage-btn" @click="projectManageOpen = true">管理</button>
                </div>
                <div class="project-switcher-panel__list">
                  <button type="button" class="project-item" :class="{ 'project-item--active': project.id === currentProjectId }" v-for="project in projects" :key="project.id" @click="switchProject(project.id)">
                    <div class="project-item__avatar" :style="{ background: project.color }">{{ project.name.charAt(0) }}</div>
                    <span class="project-item__meta">
                      <span class="project-item__name">{{ project.name }}</span>
                      <span class="project-item__role">{{ project.role }}</span>
                    </span>
                    <span v-if="project.id === currentProjectId" class="project-item__check-badge"></span>
                  </button>
                </div>
                <button type="button" class="project-switcher-panel__add-btn">
                  <AgentIcon name="plus" :size="16" />
                  <span>添加项目</span>
                </button>
              </div>
              <div v-else>
                <div class="project-switcher-panel__header">
                  <h4 class="project-switcher-panel__title">切换项目</h4>
                  <button type="button" class="project-switcher-panel__manage-btn" @click="projectManageOpen = false">完成</button>
                </div>
                <div class="project-switcher-panel__list">
                  <div class="project-manage-item" v-for="project in projects" :key="project.id">
                    <div class="project-manage-item__info">
                      <div class="project-item__avatar" :style="{ background: project.color }">{{ project.name.charAt(0) }}</div>
                      <span class="project-item__meta">
                        <span class="project-item__name">{{ project.name }}</span>
                        <span class="project-item__role">{{ project.role }}</span>
                      </span>
                      <AgentIcon v-if="project.id === currentProjectId" name="check" :size="16" class="project-item__check" />
                    </div>
                    <button v-if="project.id !== currentProjectId" type="button" class="project-manage-item__exit-btn" @click="exitProject(project.id)">退出</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <button v-else type="button" class="brand-mark" :aria-label="`${tenant.name} 品牌`">{{ tenant.name.charAt(0) }}</button>
        </template>
        <template #footer="{ expanded }">
          <div class="rail-footer" :class="{ 'rail-footer--expanded': expanded }">
            <!-- 调试工具：服务版本 & 角色权限切换 -->
              <div class="plan-switcher-wrap" :class="{ 'plan-switcher-wrap--expanded': expanded }" @mouseenter="expanded && openPlanSwitcherHover()" @mouseleave="expanded && closePlanSwitcherHover()">
                <button type="button" class="rail-footer__icon plan-switcher-trigger" aria-label="切换服务版本" @click.stop="!expanded && (planSwitcherOpen = !planSwitcherOpen)">
                  <span class="rail-footer__glyph">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M8 1l2.35 4.76L16 6.53l-4 3.9.94 5.5L8 13.27l-4.94 2.66.94-5.5-4-3.9 5.65-.77L8 1z" fill="currentColor" />
                    </svg>
                  </span>
                  <span v-if="expanded" class="rail-footer__label">服务版本</span>
                </button>
                <span v-if="!expanded" class="plan-switcher__badge" :class="planSwitcherClass">{{ planSwitcherLabel }}</span>
                <div v-if="planSwitcherOpen" class="plan-switcher-panel" @click.stop>
                  <h4 class="plan-switcher-panel__title">切换服务版本</h4>
                  <p class="plan-switcher-panel__desc">仅供开发调试，快速预览不同版本下的功能限制</p>
                  <div class="plan-switcher-panel__options">
                    <button type="button" class="plan-switcher-option" :class="{ 'plan-switcher-option--active': effectiveLevel === 'pro' && !currentPlan.isExpired }" @click="switchToPro">
                      <span class="plan-switcher-option__badge plan-switcher-option__badge--pro">PRO</span>
                      <span class="plan-switcher-option__label">专业版</span>
                      <span class="plan-switcher-option__hint">所有功能可用</span>
                    </button>
                    <button type="button" class="plan-switcher-option" :class="{ 'plan-switcher-option--active': effectiveLevel === 'free' && !currentPlan.isExpired }" @click="switchToFree">
                      <span class="plan-switcher-option__badge plan-switcher-option__badge--free">FREE</span>
                      <span class="plan-switcher-option__label">免费版</span>
                      <span class="plan-switcher-option__hint">部分功能受限</span>
                    </button>
                    <button type="button" class="plan-switcher-option" :class="{ 'plan-switcher-option--active': currentPlan.isExpired }" @click="switchToExpired">
                      <span class="plan-switcher-option__badge plan-switcher-option__badge--expired">过期</span>
                      <span class="plan-switcher-option__label">专业版已过期</span>
                      <span class="plan-switcher-option__hint">部分功能受限</span>
                    </button>
                  </div>
                </div>
              </div>
              <div class="perm-switcher-wrap" :class="{ 'perm-switcher-wrap--expanded': expanded }" @mouseenter="expanded && openPermSwitcherHover()" @mouseleave="expanded && closePermSwitcherHover()">
                <button type="button" class="rail-footer__icon perm-switcher-trigger" aria-label="切换角色权限" @click.stop="!expanded && (permSwitcherOpen = !permSwitcherOpen)">
                  <span class="rail-footer__glyph">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M8 1L3 4v4c0 3.5 2.1 6.4 5 7.5 2.9-1.1 5-4 5-7.5V4L8 1z" stroke="currentColor" stroke-width="1.5" fill="none" />
                    </svg>
                  </span>
                  <span v-if="expanded" class="rail-footer__label">角色权限</span>
                </button>
                <span v-if="!expanded" class="perm-switcher__badge" :class="'perm-switcher__badge--' + currentMockRole">{{ currentMockRoleLabel }}</span>
                <div v-if="permSwitcherOpen" class="perm-switcher-panel" @click.stop>
                  <h4 class="perm-switcher-panel__title">切换角色权限</h4>
                  <p class="perm-switcher-panel__desc">仅供开发调试，模拟不同角色的权限</p>
                  <div class="perm-switcher-panel__options">
                    <button type="button" class="plan-switcher-option" :class="{ 'plan-switcher-option--active': currentMockRole === 'admin' }" @click="switchPermRole('admin')">
                      <span class="plan-switcher-option__badge plan-switcher-option__badge--pro">ALL</span>
                      <span class="plan-switcher-option__label">管理员</span>
                      <span class="plan-switcher-option__hint">所有权限</span>
                    </button>
                    <button type="button" class="plan-switcher-option" :class="{ 'plan-switcher-option--active': currentMockRole === 'agent' }" @click="switchPermRole('agent')">
                      <span class="plan-switcher-option__badge plan-switcher-option__badge--free">CS</span>
                      <span class="plan-switcher-option__label">成员</span>
                      <span class="plan-switcher-option__hint">基础权限</span>
                    </button>
                    <button type="button" class="plan-switcher-option" :class="{ 'plan-switcher-option--active': currentMockRole === 'limited' }" @click="switchPermRole('limited')">
                      <span class="plan-switcher-option__badge plan-switcher-option__badge--expired">LT</span>
                      <span class="plan-switcher-option__label">受限</span>
                      <span class="plan-switcher-option__hint">仅档案查看</span>
                    </button>
                  </div>
                </div>
              </div>
            <button type="button" class="rail-footer__icon" aria-label="帮助中心">
              <span class="rail-footer__glyph">
                <AgentIcon name="help" :size="16" />
              </span>
              <span v-if="expanded" class="rail-footer__label">支持</span>
            </button>
            <button type="button" class="rail-footer__icon" :class="{ 'rail-footer__icon--active': isSettingsRoute }" aria-label="设置" @click="openSettingsPage">
              <span class="rail-footer__glyph">
                <AgentIcon name="settings" :size="16" />
              </span>
              <span v-if="expanded" class="rail-footer__label">设置</span>
            </button>
            <div class="profile-card-wrap" :class="{ 'profile-card-wrap--expanded': expanded }" @mouseenter="expanded && openProfileCardHover()" @mouseleave="expanded && closeProfileCardHover()">
              <button type="button" class="rail-footer__profile" aria-label="当前客服账号">
                <span class="rail-footer__glyph rail-footer__glyph--avatar">
                  <span class="rail-footer__profile-avatar" aria-hidden="true"></span>
                </span>
                <span v-if="expanded" class="rail-footer__label">个人资料</span>
              </button>
              <div v-if="expanded && profileCardOpen" class="profile-card-panel" @click.stop>
                <div class="profile-card-panel__header">
                  <div class="profile-card-panel__identity">
                    <span class="profile-card-panel__avatar">{{ getInitial(profileDisplayName) }}</span>
                    <span class="profile-card-panel__meta">
                      <span class="profile-card-panel__name">{{ profileDisplayName }}</span>
                      <span class="profile-card-panel__role">{{ profileRoleLabel }}</span>
                    </span>
                  </div>
                </div>
                <div class="profile-card-panel__section">
                  <div class="profile-card-panel__status">
                    <span class="profile-card-panel__status-info">
                      <span class="profile-card-panel__status-dot" :class="{ 'profile-card-panel__status-dot--offline': !profileOnline }"></span>
                      <span class="profile-card-panel__status-label">{{ profileOnline ? "在线" : "离线" }}</span>
                    </span>
                    <button type="button" class="profile-card-panel__switch" :class="{ 'profile-card-panel__switch--on': profileOnline }" @click="profileOnline = !profileOnline">
                      <span class="profile-card-panel__switch-thumb"></span>
                    </button>
                  </div>
                </div>
                <div class="profile-card-panel__section">
                  <button type="button" class="profile-card-panel__action" @click="handleProfileAction('account')">我的账号</button>
                  <button type="button" class="profile-card-panel__action" @click="handleProfileAction('password')">修改密码</button>
                </div>
                <div class="profile-card-panel__section">
                  <button type="button" class="profile-card-panel__action" @click="handleProfileAction('notification')">通知设置</button>
                  <button type="button" class="profile-card-panel__action profile-card-panel__action--with-arrow" @click="handleProfileAction('language')">
                    <span>语言</span>
                    <AgentIcon name="chevron-right" :size="14" class="profile-card-panel__action-arrow" />
                  </button>
                </div>
                <div class="profile-card-panel__section">
                  <button type="button" class="profile-card-panel__action profile-card-panel__action--danger" @click="handleProfileAction('logout')">退出</button>
                </div>
              </div>
            </div>
          </div>
        </template>
      </PrimaryNavRail>
    </template>

    <template #sub-nav>
      <SessionQueueNav
        v-if="isConversationRoute"
        :key="currentSubnavRenderKey"
        title="消息"
        :active-key="activeQueueKey"
        :groups="queueGroups"
        @select="handleQueueSelect"
        @group-action="handleQueueGroupAction"
      />
      <ArchiveSubNav
        v-else-if="isFilesRoute"
        :key="currentSubnavRenderKey"
        title="档案"
        :active-key="activeFilesNavKey"
        :items="filesNavItems"
        @select="handleFilesNavSelect"
      />
      <ArchiveSubNav
        v-else-if="isVisitorsRoute"
        :key="currentSubnavRenderKey"
        title="访客"
        :active-key="activeVisitorsNavKey"
        :items="visitorsNavItems"
        @select="handleVisitorsNavSelect"
      />
      <ArchiveSubNav
        v-else-if="isCustomerRoute"
        :key="currentSubnavRenderKey"
        title="客户"
        :active-key="activeCustomerNavKey"
        :items="customerNavItems"
        @select="handleCustomerNavSelect"
      />
      <AiSettingsNav
        v-else-if="isAiAgentRoute"
        :key="currentSubnavRenderKey"
        title="AI Agent"
        :active-key="activeAiNavKey"
        :groups="aiNavGroups"
        @select="handleAiNavSelect"
      />
      <AiSettingsNav
        v-else-if="isSettingsRoute"
        :key="currentSubnavRenderKey"
        title="设置"
        variant="settings"
        :active-key="activeSettingsNavKey"
        :groups="settingsNavGroups"
        @select="handleSettingsNavSelect"
      />
      <AiSettingsNav
        v-else-if="isReportRoute"
        :key="currentSubnavRenderKey"
        title="报表"
        :active-key="activeReportNavKey"
        :groups="reportNavGroups"
        @select="handleReportNavSelect"
      />
      <AiSettingsNav
        v-else-if="isCampaignRoute"
        :key="currentSubnavRenderKey"
        title="营销"
        :active-key="activeCampaignNavKey"
        :groups="campaignNavGroups"
        @select="handleCampaignNavSelect"
      />
      <section v-else class="module-subnav">
        <h2 class="module-subnav__title">{{ currentModuleLabel }}</h2>
        <p class="module-subnav__hint">模块导航开发中</p>
      </section>
    </template>

    <section v-if="isConversationRoute" :key="currentContentRenderKey" class="session-page agent-panel">
      <aside class="inbox-pane">
        <header class="inbox-pane__header">
          <div class="inbox-pane__title-row">
            <button type="button" class="inbox-pane__back" aria-label="返回">‹</button>
            <h1 class="inbox-pane__title">{{ activeQueueEmoji }} {{ activeQueueLabel }}</h1>
          </div>

          <div class="inbox-pane__search-row">
            <SearchComboWithTag
              v-model="searchKeyword"
              v-model:selected-field="searchFieldType"
              :options="searchFieldOptionsFormatted"
              @search="handleSearch"
            />
          </div>

          <div class="inbox-pane__filter-row">
            <div class="inbox-pane__chips">
              <button type="button" class="filter-chip" :class="{ 'filter-chip--active': sessionFilterType === 'all' }" @click="sessionFilterType = 'all'">全部 {{ filterCounts.all }}</button>
              <template v-if="showSessionCategoryFilter">
                <button type="button" class="filter-chip" :class="{ 'filter-chip--active': sessionFilterType === 'visitor' }" @click="sessionFilterType = 'visitor'">访客 {{ filterCounts.visitor }}</button>
                <button type="button" class="filter-chip" :class="{ 'filter-chip--active': sessionFilterType === 'customer' }" @click="sessionFilterType = 'customer'">客户 {{ filterCounts.customer }}</button>
              </template>
            </div>
            <div class="inbox-pane__row-actions">
              <div class="inbox-pane__filter-btn-wrapper" @mouseenter="showFilterPanel" @mouseleave="hideFilterPanel">
                <button type="button" class="inbox-pane__filter-icon-btn" :class="{ 'inbox-pane__filter-icon-btn--active': hasActiveFilter }" aria-label="筛选">
                  <AgentIcon name="filter" :size="14" />
                  <span v-if="hasActiveFilter" class="inbox-pane__filter-badge"></span>
                </button>
                <div v-if="filterPanelVisible" class="inbox-filter-panel" @click.stop>
                  <div class="inbox-filter-panel__section">
                    <div class="inbox-filter-panel__label">排序</div>
                    <div class="inbox-filter-panel__chips">
                      <button type="button" class="filter-chip" :class="{ 'filter-chip--active': sortOrder === 'desc' }" @click="sortOrder = 'desc'">倒序</button>
                      <button type="button" class="filter-chip" :class="{ 'filter-chip--active': sortOrder === 'asc' }" @click="sortOrder = 'asc'">正序</button>
                    </div>
                  </div>
                  <template v-if="showOnlineSessionFilter">
                    <div class="inbox-filter-panel__section">
                      <div class="inbox-filter-panel__label">访客在线状态</div>
                      <div class="inbox-filter-panel__chips">
                        <button type="button" class="filter-chip" :class="{ 'filter-chip--active': draftFilter.visitorOnline === null }" @click="draftFilter.visitorOnline = null">全部</button>
                        <button type="button" class="filter-chip" :class="{ 'filter-chip--active': draftFilter.visitorOnline === true }" @click="draftFilter.visitorOnline = true">在线</button>
                        <button type="button" class="filter-chip" :class="{ 'filter-chip--active': draftFilter.visitorOnline === false }" @click="draftFilter.visitorOnline = false">离线</button>
                      </div>
                    </div>
                    <div class="inbox-filter-panel__section">
                      <div class="inbox-filter-panel__label">渠道</div>
                      <div class="inbox-filter-panel__chips">
                        <button v-for="ch in [{ key: 'web', label: '网页' }, { key: 'widget', label: '网页插件' }, { key: 'email', label: 'Email' }]" :key="ch.key" type="button" class="filter-chip" :class="{ 'filter-chip--active': draftFilter.channelTypes.includes(ch.key) }" @click="draftFilter.channelTypes.includes(ch.key) ? draftFilter.channelTypes = draftFilter.channelTypes.filter(c => c !== ch.key) : draftFilter.channelTypes.push(ch.key)">{{ ch.label }}</button>
                      </div>
                    </div>
                    <div class="inbox-filter-panel__section">
                      <div class="inbox-filter-panel__label">访客标签</div>
                      <div class="inbox-filter-panel__select-wrapper">
                        <div class="inbox-filter-panel__select-trigger" :class="{ 'inbox-filter-panel__select-trigger--has-value': draftFilter.visitorTagIds.length }" @click.stop="visitorTagDropdownOpen = !visitorTagDropdownOpen" @mouseenter="visitorTagTriggerHover = true" @mouseleave="visitorTagTriggerHover = false">
                          <span>{{ formatTagTriggerText(draftFilter.visitorTagIds, globalVisitorTags) }}</span>
                          <button v-if="visitorTagTriggerHover && draftFilter.visitorTagIds.length" type="button" class="inbox-filter-panel__select-clear" @click.stop="draftFilter.visitorTagIds = []">✕</button>
                          <AgentIcon v-else name="chevron-down" :size="12" />
                        </div>
                        <div v-if="visitorTagDropdownOpen" class="inbox-filter-panel__select-dropdown">
                          <label v-for="t in globalVisitorTags" :key="t.id" class="inbox-filter-panel__select-option">
                            <input type="checkbox" :value="t.id" v-model="draftFilter.visitorTagIds" />
                            <span>{{ t.name }}</span>
                          </label>
                        </div>
                      </div>
                    </div>
                    <div class="inbox-filter-panel__section">
                      <div class="inbox-filter-panel__label">会话标签</div>
                      <div class="inbox-filter-panel__select-wrapper">
                        <div class="inbox-filter-panel__select-trigger" :class="{ 'inbox-filter-panel__select-trigger--has-value': draftFilter.conversationTagIds.length }" @click.stop="conversationTagDropdownOpen = !conversationTagDropdownOpen" @mouseenter="conversationTagTriggerHover = true" @mouseleave="conversationTagTriggerHover = false">
                          <span>{{ formatTagTriggerText(draftFilter.conversationTagIds, globalConversationTags) }}</span>
                          <button v-if="conversationTagTriggerHover && draftFilter.conversationTagIds.length" type="button" class="inbox-filter-panel__select-clear" @click.stop="draftFilter.conversationTagIds = []">✕</button>
                          <AgentIcon v-else name="chevron-down" :size="12" />
                        </div>
                        <div v-if="conversationTagDropdownOpen" class="inbox-filter-panel__select-dropdown">
                          <label v-for="t in globalConversationTags" :key="t.id" class="inbox-filter-panel__select-option">
                            <input type="checkbox" :value="t.id" v-model="draftFilter.conversationTagIds" />
                            <span>{{ t.name }}</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </template>
                  <div class="inbox-filter-panel__footer">
                    <button type="button" class="agent-btn agent-btn--ghost inbox-filter-panel__reset" @click="draftFilter = { visitorOnline: null, visitorTagIds: [], conversationTagIds: [], channelTypes: [] }; sortOrder = 'desc'">重置</button>
                    <button type="button" class="agent-btn agent-btn--primary inbox-filter-panel__confirm" @click="applyFilter">确认</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div class="inbox-pane__list agent-scroll">
          <SessionListItem
            v-for="item in visibleSessions"
            :key="item.id"
            :active="item.id === activeSessionId"
            :avatar-color="item.avatarColor"
            :avatar-text="item.avatarText"
            :channel-type="item.channelType"
            :customer-name="item.customerName"
            :preview="sessionMatchResults.has(item.id) && sessionMatchResults.get(item.id)!.matchCount === 1 ? sessionMatchResults.get(item.id)!.firstMatchContent : item.preview"
            :is-note-preview="(messageMap[item.id] ?? []).at(-1)?.isNote === true"
            :match-count="sessionMatchResults.has(item.id) && sessionMatchResults.get(item.id)!.matchCount > 1 ? sessionMatchResults.get(item.id)!.matchCount : undefined"
            :keyword="searchKeyword.trim() ? searchKeyword : undefined"
            :unread-count="item.unreadCount"
            :updated-at="item.updatedAt"
            :show-online-status="item.channelType === 'web'"
            :online="item.visitorOnline ?? false"
            @click="handleSessionItemClick(item.id)"
          />
          <p v-if="visibleSessions.length === 0" class="inbox-pane__empty">暂无符合条件的会话</p>
        </div>
      </aside>

      <section class="chat-pane">
        <ConversationHeader
          class="chat-pane__header"
          :channel-type="activeSession?.channelType"
          :closed="isClosedSession"
          :editable="!isAiSession && !isClosedSession && activeSession?.channelType !== 'email'"
          :is-processing="isProcessingSession"
          :title="activeSessionTitle"
          :can-collaborate="canCollaborate && !isAiSession"
          :show-collaborate-actions="!isAiSession"
          :show-pending-action="!isAiSession"
          :show-close-action="!isAiSession"
          :mode="chatHeaderMode"
          @close="handleOpenCloseSession"
          @invite="handleOpenInvite"
          @mark-pending="handleMarkPending"
          @remove-pending="handleRemovePending"
          @close-email="handleOpenCloseEmailSession"
          @transfer="handleOpenTransfer"
          @update:title="updateSessionTitle"
          @start-group-chat="showTopToast('发起群聊功能开发中')"
          @add-member="showTopToast('添加成员功能开发中')"
          @delete-chat="showTopToast('删除聊天功能开发中')"
        />

        <div ref="chatStreamRef" class="chat-pane__stream agent-scroll">
          <p class="chat-pane__start-time">开始时间 {{ activeSession?.startedAt ?? '--' }}</p>

          <MessageBubble
            v-for="message in activeMessages"
            :key="message.id"
            :data-message-id="message.id"
            :avatar-color="message.avatarColor"
            :avatar-text="message.avatarText"
            :avatar-url="message.avatarUrl"
            :content="message.content"
            :content-type="message.contentType"
            :subject="message.subject"
            :role="message.displayRole"
            :sender="message.displaySender"
            :time="message.time"
            :show-actions="true"
            :channel-type="activeSession?.channelType ?? 'web'"
            :translation-languages="translationLanguages"
            :send-status="message.sendStatus"
            :translation="message.translation"
            :highlighted="searchMatchIds.includes(message.id) && searchMatchIds[currentSearchIndex] === message.id"
            :is-note="message.isNote"
            @reply="showTopToast('回复功能开发中')"
            @copy="showTopToast('已复制到剪贴板')"
            @translate="showTopToast('翻译功能开发中')"
            @revoke="handleRevokeMessage(message.id)"
            @retry="showTopToast('重新发送开发中')"
            @retry-translation="handleRetryTranslation(message.id, message.content)"
          />
        </div>

        <div v-if="isAiSession" class="ai-takeover-bar">
          <button type="button" class="agent-btn ai-takeover-bar__assign-btn" @click="handleOpenAiAssign">分配会话</button>
          <button type="button" class="agent-btn agent-btn--primary" @click="handleOpenTakeoverAiSession">接管会话</button>
        </div>

        <div v-else-if="isQueueingSession && !isQueueingSessionClaimed" class="queue-claim-bar">
          <button type="button" class="agent-btn queue-claim-bar__assign-btn" @click="handleOpenQueueAssign">分配会话</button>
          <button type="button" class="agent-btn agent-btn--primary" @click="handleClaimQueueSession">领取会话</button>
        </div>

        <div v-else-if="isClosedSession && activeSession?.channelType !== 'email'" class="chat-pane__closed">
          <span class="chat-pane__closed-tag">会话已结束</span>
        </div>

        <div v-else-if="isClosedSession && activeSession?.channelType === 'email'" class="chat-pane__closed">
          <button type="button" class="agent-btn agent-btn--primary chat-pane__reopen-btn" @click="handleReopenEmailSession">重新开启</button>
        </div>

        <div v-else-if="isClosedSession && activeSession?.channelType === 'telegram'" class="chat-pane__closed">
          <button type="button" class="agent-btn agent-btn--primary chat-pane__reopen-btn" @click="handleReopenTelegramSession">重新开启</button>
        </div>

        <div v-else-if="activeSession?.channelType === 'email'" class="chat-pane__composer-wrap">
          <EmailComposer
            ref="emailComposerRef"
            v-model="emailComposerBody"
            class="chat-pane__composer"
            :to="activeSession?.email ?? ''"
            :from-options="activeSessionFromOptions"
            :selected-from="selectedFromEmail"
            :show-translate="false"
            :quick-reply-categories="quickReplyCategories"
            :session-id="activeSessionId"
            @update:selected-from="selectedFromEmail = $event"
            @attachment="track(TrackEvent.ATTACHMENT)"
            @emoji="track(TrackEvent.EMOJI); showTopToast('表情面板开发中')"
            @toast="showTopToast"
            @send="handleSendEmail"
            @send-and-pending="handleSendEmailAndPending"
            @send-and-resolve="handleSendEmailAndClose"
            @quick-reply-settings="showTopToast('快捷回复设置开发中')"
            @copilot="showTopToast('Copilot推荐开发中')"
          />
        </div>

        <template v-else>
          <div id="chat-above-composer" class="chat-pane__above-composer"></div>

          <div class="chat-pane__composer-wrap">
            <MessageComposer
              v-model="composerText"
              class="chat-pane__composer"
              :show-polish="canUse(FEATURES.TEXT_POLISH)"
              :show-translate="canUse(FEATURES.WRITE_TRANSLATE) || canUse(FEATURES.CHAT_TRANSLATE)"
              :quick-reply-categories="quickReplyCategories"
              :session-id="activeSessionId"
              placeholder="发消息或输入 / 选择快捷回复"
              @attachment="track(TrackEvent.ATTACHMENT); showTopToast('附件功能开发中')"
              @emoji="track(TrackEvent.EMOJI); showTopToast('表情面板开发中')"
              @quick-reply-settings="showTopToast('快捷回复设置开发中')"
              @polish="track(TrackEvent.POLISH); showTopToast('润色功能开发中')"
              @translate="track(TrackEvent.TRANSLATE); showTopToast('翻译功能开发中')"
              @send="handleSend"
            />
          </div>
        </template>
      </section>

      <aside :key="currentDetailRenderKey" class="detail-pane">
        <header class="detail-pane__topbar">
          <div class="detail-pane__tabs">
            <button
              v-for="tab in detailTabs"
              :key="tab.key"
              type="button"
              class="detail-pane__tab"
              :class="{ 'detail-pane__tab--active': activeDetailTab === tab.key }"
              @click="activeDetailTab = tab.key"
            >
              {{ tab.label }}
            </button>
          </div>
          <button type="button" class="detail-pane__dock-btn" aria-label="面板操作" />
        </header>
        <div class="detail-pane__content agent-scroll">
          <section v-for="section in activeInfoSections" :key="section.key" class="detail-section">
            <button type="button" class="detail-section__header" @click="toggleDetailSection(section.key)">
              <span class="detail-section__title">{{ section.title }}</span>
              <AgentIcon :name="isDetailSectionCollapsed(section.key) ? 'chevron-right' : 'chevron-down'" :size="14" />
            </button>

            <div v-show="!isDetailSectionCollapsed(section.key)" class="detail-section__body">
              <dl v-if="section.type === 'fields'" class="detail-section__fields">
                <div v-for="field in section.fields" :key="field.key" class="detail-section__field">
                  <dt>{{ field.label }}</dt>
                  <dd>{{ field.value }}</dd>
                </div>
              </dl>

              <div v-else-if="section.type === 'agents'" class="detail-section__agents">
                <div v-for="agent in section.agents" :key="agent.key" class="detail-agent-row">
                  <span class="detail-agent-row__avatar" :style="{ background: agent.avatarColor }">{{ agent.avatarText }}</span>
                  <span class="detail-agent-row__name">{{ agent.name }}</span>
                  <span v-if="agent.role === 'owner'" class="detail-agent-row__badge detail-agent-row__badge--owner">会话负责人</span>
                  <span class="detail-agent-row__count">{{ agent.messageCount }}</span>
                </div>
              </div>

              <button v-else-if="section.type === 'tags'" type="button" class="detail-section__add-tag">
                +
              </button>

              <ul v-else class="detail-section__timeline">
                <li v-for="item in section.timeline" :key="item.key" class="timeline-item">
                  <span class="timeline-item__dot" :class="item.dotClass ?? ''" />
                  <div class="timeline-item__main">
                    <p class="timeline-item__title">
                      <span>{{ item.label }}</span>
                      <a href="#" @click.prevent>{{ item.link }}</a>
                    </p>
                    <p class="timeline-item__meta">{{ item.time }}&nbsp;&nbsp;{{ item.duration }}</p>
                  </div>
                </li>
                <li v-if="section.moreText" class="timeline-item timeline-item--more">{{ section.moreText }}</li>
              </ul>
            </div>
          </section>
        </div>
      </aside>
    </section>

    <HomeRoutePage v-else-if="isHomeRoute" :key="currentContentRenderKey" />
    <FilesRoutePage v-else-if="isFilesRoute" :key="currentContentRenderKey" :active-key="activeFilesNavKey" @toast="showTopToast" @navigate-to-session="handleNavigateToInbox($event.queueKey)" />
    <VisitorsRoutePage v-else-if="isVisitorsRoute" :key="currentContentRenderKey" :active-key="activeVisitorsNavKey" @toast="showTopToast" @navigate-to-inbox="handleNavigateToInbox" />
    <CustomerRoutePage v-else-if="isCustomerRoute" :key="currentContentRenderKey" :active-key="activeCustomerNavKey" @toast="showTopToast" />

    <template v-else-if="isSettingsRoute">
      <WidgetCustomizePage
        v-if="activeSettingsNavKey === 'customize'"
        :key="currentContentRenderKey"
        @toast="showTopToast"
      />
      <SettingsRoutePage v-else :key="currentContentRenderKey" :active-key="activeSettingsNavKey" @toast="showTopToast" />
    </template>
    <AiAgentRoutePage
      v-else-if="isAiAgentRoute"
      :key="currentContentRenderKey"
      :active-key="activeAiNavKey"
      @toast="showTopToast"
      @nav-change="handleAiNavSelect"
    />
    <ReportRoutePage v-else-if="isReportRoute" :key="currentContentRenderKey" :active-key="activeReportNavKey" />
    <template v-else-if="isCampaignRoute">
      <CampaignRoutePage v-if="activeCampaignNavKey === 'campaign-chatting'" :key="`${currentContentRenderKey}-chatting`" @toast="showTopToast" />
      <ProactiveCampaignRoutePage v-if="activeCampaignNavKey === 'campaign-proactive'" :key="`${currentContentRenderKey}-proactive`" ref="proactiveCampaignPageRef" @toast="showTopToast" @dirty-change="handleProactiveCampaignDirtyChange" />
    </template>

    <section v-else :key="currentContentRenderKey" class="agent-content-page module-page">
      <header class="agent-content-header">
        <h1 class="agent-content-title">{{ currentModuleLabel }}</h1>
        <p class="agent-content-subtitle">该模块页面开发中，已可通过左侧导航进行路由切换。</p>
      </header>
      <section class="module-placeholder agent-panel">
        <p>当前路径：{{ route.path }}</p>
      </section>
    </section>

    <TransferModal
      :open="transferModalOpen"
      :keyword="transferKeyword"
      :agents="transferableAgents"
      @close="transferModalOpen = false"
      @update:keyword="transferKeyword = $event"
      @confirm="handleRequestTransfer"
    />

    <BaseModal :open="confirmTransferModalOpen" title="确认转移" @close="handleCloseConfirmTransfer">
      <div class="confirm-transfer-modal">
        <p class="confirm-transfer-modal__description">
          转移后你将自动移出当前会话
        </p>
      </div>

      <template #footer>
        <span />
        <div class="confirm-transfer-modal__footer-actions">
          <button class="agent-btn agent-btn--ghost" type="button" @click="handleCloseConfirmTransfer">取消</button>
          <button
            class="agent-btn agent-btn--primary"
            type="button"
            :disabled="!pendingTransferAgent"
            @click="handleConfirmTransfer"
          >
            确认
          </button>
        </div>
      </template>
    </BaseModal>

    <BaseModal
      :open="confirmTakeoverModalOpen"
      title="确认接管"
      max-width="500px"
      :show-close="false"
      @close="handleCloseTakeoverAiSession"
    >
      <div class="confirm-takeover-modal">
        <p class="confirm-takeover-modal__description">确认接管该会话吗？</p>
      </div>

      <template #footer>
        <span />
        <div class="confirm-takeover-modal__footer-actions">
          <button class="agent-btn agent-btn--ghost" type="button" @click="handleCloseTakeoverAiSession">取消</button>
          <button class="agent-btn agent-btn--primary" type="button" @click="handleConfirmTakeoverAiSession">确认</button>
        </div>
      </template>
    </BaseModal>

    <BaseModal
      :open="confirmClaimModalOpen"
      title="确认领取"
      max-width="500px"
      :show-close="false"
      @close="handleCloseClaimModal"
    >
      <div class="confirm-takeover-modal">
        <p class="confirm-takeover-modal__description">确认领取该会话吗？</p>
      </div>

      <template #footer>
        <span />
        <div class="confirm-takeover-modal__footer-actions">
          <button class="agent-btn agent-btn--ghost" type="button" @click="handleCloseClaimModal">取消</button>
          <button class="agent-btn agent-btn--primary" type="button" @click="handleConfirmClaimSession">确认</button>
        </div>
      </template>
    </BaseModal>

    <ArchiveAssignModal
      :open="aiAssignModalOpen"
      :keyword="aiAssignKeyword"
      :agents="aiAssignableAgents"
      @close="aiAssignModalOpen = false"
      @confirm="handleAiAssignConfirm"
      @update:keyword="aiAssignKeyword = $event"
    />

    <ArchiveAssignModal
      :open="queueAssignModalOpen"
      :keyword="queueAssignKeyword"
      :agents="queueAssignableAgents"
      @close="queueAssignModalOpen = false"
      @confirm="handleQueueAssignConfirm"
      @update:keyword="queueAssignKeyword = $event"
    />

    <InviteModal
      :open="inviteModalOpen"
      :keyword="inviteKeyword"
      :agents="invitableAgents"
      @close="inviteModalOpen = false"
      @update:keyword="inviteKeyword = $event"
      @confirm="handleConfirmInvite"
    />

    <StartChatModal
      :open="startChatModalOpen"
      :candidates="startChatCandidates"
      :pinned-contact="startChatPinnedContact"
      @close="startChatModalOpen = false"
      @confirm="handleStartChatConfirm"
    />

    <BaseModal
      :open="closeSessionModalOpen"
      title="结束会话"
      max-width="500px"
      :show-close="false"
      @close="closeSessionModalOpen = false"
    >
      <div class="confirm-close-modal">
        <p class="confirm-close-modal__description">确认结束该会话吗？</p>
      </div>

      <template #footer>
        <span />
        <div class="confirm-close-modal__footer-actions">
          <button class="agent-btn agent-btn--ghost" type="button" @click="closeSessionModalOpen = false">取消</button>
          <button class="agent-btn agent-btn--danger" type="button" @click="handleConfirmCloseSession">确认结束</button>
        </div>
      </template>
    </BaseModal>

    <BaseModal
      :open="closeEmailSessionModalOpen"
      title="结束会话"
      max-width="500px"
      :show-close="false"
      @close="closeEmailSessionModalOpen = false"
    >
      <div class="confirm-close-modal">
        <p class="confirm-close-modal__description">确认结束该会话吗？</p>
      </div>

      <template #footer>
        <span />
        <div class="confirm-close-modal__footer-actions">
          <button class="agent-btn agent-btn--ghost" type="button" @click="closeEmailSessionModalOpen = false">取消</button>
          <button class="agent-btn agent-btn--danger" type="button" @click="handleConfirmCloseEmailSession">确认结束</button>
        </div>
      </template>
    </BaseModal>

    <AgentToast :message="toastMessage" :visible="showToast" :type="toastType" />

    <FeatureLockedModal
      :open="upgradeModalState.visible"
      :is-admin="upgradeModalState.isAdmin"
      :feature-name="upgradeModalState.featureName"
      :feature-description="upgradeModalState.featureDescription"
      @close="closeUpgradeModal"
    />

    <PermissionChangedModal
      :open="permModalState.visible"
      @confirm="handlePermissionChangedConfirm"
    />

    <VersionUpdateModal
      :open="versionState.hasUpdate"
      :notes="versionState.notes"
      @dismiss="dismissUpdate"
      @refresh="doRefresh"
    />

    <SearchMatchDialog
      :open="searchMatchDialogVisible"
      :messages="searchMatchDialogMessages"
      :keyword="searchKeyword"
      @select="handleSelectMatchedMessage"
      @close="handleCloseMatchDialog"
    />
  </AgentAppShell>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useTenant } from "@twt/branding";
import ArchiveSubNav from "./components/ArchiveSubNav.vue";
import ArchiveAssignModal from "./components/archive/ArchiveAssignModal.vue";
import AiAgentRoutePage from "./views/AiAgentRoutePage.vue";
import CampaignRoutePage from "./views/CampaignRoutePage.vue";
import CustomerRoutePage from "./views/CustomerRoutePage.vue";
import FilesRoutePage from "./views/FilesRoutePage.vue";
import HomeRoutePage from "./views/HomeRoutePage.vue";
import StartChatModal from "./components/StartChatModal.vue";

import ProactiveCampaignRoutePage from "./views/ProactiveCampaignRoutePage.vue";
import ReportRoutePage from "./views/ReportRoutePage.vue";
import SettingsRoutePage from "./views/SettingsRoutePage.vue";
import VisitorsRoutePage from "./views/VisitorsRoutePage.vue";
import WidgetCustomizePage from "./views/WidgetCustomizePage.vue";
import { loadStoredAiAgentSettings, resolveAiAgentProfile } from "./lib/aiAgentSettings";
import { track, TrackEvent } from "./lib/tracker";
import { usePlan } from "./composables/usePlan";

const tenant = useTenant();
import { FEATURES } from "./lib/plan";
import { usePermission } from "./composables/usePermission";
import { useVersionCheck } from "./composables/useVersionCheck";
import { useTranslation } from "./composables/useTranslation";
import { extractKWIC } from "./lib/archiveUtils";
import {
  AgentAppShell,
  AiSettingsNav,
  BaseModal,
  FeatureLockedModal,
  PermissionChangedModal,
  VersionUpdateModal,
  AgentIcon,
  AgentToast,
  ConversationHeader,
  InviteModal,
  MessageBubble,
  MessageComposer,
  EmailComposer,
  PrimaryNavRail,
  SessionListItem,
  SessionQueueNav,
  TransferModal,
  SearchMatchDialog,
  SearchComboWithTag,
  type MessageItem,
  type NavItem,
  type SessionItem,
  type SessionQueueGroup,
  type QuickReplyCategory
} from "@twt/ui-agent";

const { upgradeModalState, closeUpgradeModal, currentPlan, effectiveLevel, setPlanLevel, setExpired, canUse } = usePlan();

const {
  modalState: permModalState,
  permissions: currentPermissions,
  currentMockRole,
  currentMockRoleLabel,
  canShowNavItem,
  canShowSettingsGroup,
  canAccessRoute,
  closePermissionChangedModal,
  showPermissionChangedModal,
  setMockRole,
} = usePermission();

const { versionState, doRefresh, dismissUpdate } = useVersionCheck();

const { getSessionSwitch, setSessionSwitch, autoTranslateMessages, retryTranslation } = useTranslation();

const permSwitcherOpen = ref(false);

// 项目切换
const projectSwitcherOpen = ref(false);
const projectManageOpen = ref(false);
const currentProjectId = ref("1");
let projectHoverTimer: ReturnType<typeof setTimeout> | null = null;

const projects = ref([
  { id: "1", name: "TWT Chat", role: "超级管理员", color: "#FF6B35" },
  { id: "2", name: "研发线上验收项目", role: "主管", color: "#4ECDC4" },
  { id: "3", name: "test-1", role: "客服", color: "#556FB5" }
]);

const openProjectSwitcherHover = () => {
  if (projectHoverTimer) clearTimeout(projectHoverTimer);
  projectHoverTimer = setTimeout(() => {
    projectSwitcherOpen.value = true;
    projectManageOpen.value = false;
  }, 200);
};

const closeProjectSwitcherHover = () => {
  if (projectHoverTimer) clearTimeout(projectHoverTimer);
  projectHoverTimer = setTimeout(() => {
    if (!projectManageOpen.value) {
      projectSwitcherOpen.value = false;
    }
  }, 200);
};

const switchProject = (id: string) => {
  currentProjectId.value = id;
  projectSwitcherOpen.value = false;
  showTopToast(`已切换到 ${projects.value.find(p => p.id === id)?.name}`);
};

const exitProject = (id: string) => {
  const project = projects.value.find(p => p.id === id);
  showTopToast(`已退出项目 ${project?.name}`);
};

// 权限变化时，如果当前页面已无权限，立即弹窗
watch(currentPermissions, () => {
  const routeName = typeof route.name === "string" ? route.name : "";
  if (!canAccessRoute(routeName)) {
    showPermissionChangedModal();
  }
});

const planSwitcherOpen = ref(false);
const profileCardOpen = ref(false);
const profileOnline = ref(true);
let planHoverTimer: ReturnType<typeof setTimeout> | null = null;
let permHoverTimer: ReturnType<typeof setTimeout> | null = null;
let profileHoverTimer: ReturnType<typeof setTimeout> | null = null;
const profileDisplayName = "tuski";

const openPlanSwitcherHover = () => {
  planHoverTimer = setTimeout(() => { planSwitcherOpen.value = true; }, 220);
};
const closePlanSwitcherHover = () => {
  if (planHoverTimer) { clearTimeout(planHoverTimer); planHoverTimer = null; }
  planSwitcherOpen.value = false;
};
const openPermSwitcherHover = () => {
  permHoverTimer = setTimeout(() => { permSwitcherOpen.value = true; }, 220);
};
const closePermSwitcherHover = () => {
  if (permHoverTimer) { clearTimeout(permHoverTimer); permHoverTimer = null; }
  permSwitcherOpen.value = false;
};

const openProfileCardHover = () => {
  if (profileHoverTimer) clearTimeout(profileHoverTimer);
  profileHoverTimer = setTimeout(() => {
    profileCardOpen.value = true;
  }, 180);
};

const closeProfileCardHover = () => {
  if (profileHoverTimer) {
    clearTimeout(profileHoverTimer);
    profileHoverTimer = null;
  }
  profileCardOpen.value = false;
};

const profileRoleLabel = computed(() => {
  if (currentMockRole.value === "admin") return "超级管理员";
  if (currentMockRole.value === "agent") return "客服";
  return "受限客服";
});

const handleProfileAction = (action: "account" | "password" | "notification" | "language" | "logout") => {
  const actionTextMap = {
    account: "我的账号功能开发中",
    password: "修改密码功能开发中",
    notification: "通知设置功能开发中",
    language: "语言设置功能开发中",
    logout: "退出登录功能开发中"
  } as const;
  profileCardOpen.value = false;
  showTopToast(actionTextMap[action]);
};

const planSwitcherLabel = computed(() => {
  if (currentPlan.isExpired) return '过期';
  return currentPlan.level === 'pro' ? 'PRO' : 'FREE';
});

const planSwitcherClass = computed(() => {
  if (currentPlan.isExpired) return 'plan-switcher__badge--expired';
  return currentPlan.level === 'pro' ? 'plan-switcher__badge--pro' : 'plan-switcher__badge--free';
});

const switchToPro = () => {
  setPlanLevel('pro');
  planSwitcherOpen.value = false;
};

const switchToFree = () => {
  setPlanLevel('free');
  planSwitcherOpen.value = false;
};

const switchToExpired = () => {
  setPlanLevel('pro');
  setExpired(true);
  planSwitcherOpen.value = false;
};

const handlePermissionChangedConfirm = () => {
  closePermissionChangedModal();
  router.push({ name: "home" });
};

const switchPermRole = (role: 'admin' | 'agent' | 'limited') => {
  setMockRole(role);
  permSwitcherOpen.value = false;
};

type DetailTabKey = "visitor" | "session";
type AiAgentNavKey = "doc-knowledge" | "faq" | "copilot-settings" | "ai-agent-config";
type SettingsNavKey = "install" | "website-code" | "customize" | "email" | "telegram" | "agents" | "roles" | "team" | "quick-reply" | "personal-reply" | "idle-conversation" | "visitor-tags" | "conversation-tags" | "blacklist" | "trusted-domains" | "dev-settings" | "webhooks";
type CampaignNavKey = "campaign-chatting" | "campaign-proactive";
type ReportNavKey = "data-overview" | "ai-agent-report" | "evaluation-analysis";
type FilesNavKey = "all-conversations" | "all-chats";
type VisitorsNavKey = "online-visitors" | "all-visitors";
type CustomerNavKey = "online-customer" | "all-customer";

type ProactiveCampaignPageExpose = {
  requestNavigation: (action: () => void) => boolean;
  hasUnsavedChanges: () => boolean;
};

interface AgentEntry {
  id: string;
  name: string;
  online: boolean;
  avatarText: string;
  avatarColor: string;
}

type StartChatContactType = "visitor" | "customer" | "agent" | "manual";

interface StartChatContact {
  id: string;
  type: StartChatContactType;
  name: string;
  avatarText: string;
  avatarColor: string;
  online?: boolean;
  visitorId?: string;
  email?: string;
  phone?: string;
  sourceSessionId?: string;
}

interface DisplayMessage extends MessageItem {
  displayRole: "agent" | "customer" | "system";
  displaySender: string;
  avatarText?: string;
  avatarColor?: string;
  avatarUrl?: string;
}

const agentPool: AgentEntry[] = [
  { id: "ag-1", name: "客服主管", online: true, avatarText: "主", avatarColor: "linear-gradient(135deg, #2f6bff 0%, #69a1ff 100%)" },
  { id: "ag-2", name: "王珂", online: true, avatarText: "王", avatarColor: "linear-gradient(135deg, #7f6bff 0%, #a259ff 100%)" },
  { id: "ag-3", name: "刘昊", online: true, avatarText: "刘", avatarColor: "linear-gradient(135deg, #ff7d00 0%, #ffb15d 100%)" },
  { id: "ag-4", name: "陈悦", online: true, avatarText: "陈", avatarColor: "linear-gradient(135deg, #00c2b8 0%, #00a0cc 100%)" },
  { id: "ag-5", name: "李想", online: true, avatarText: "李", avatarColor: "linear-gradient(135deg, #00b578 0%, #00a66f 100%)" },
  { id: "ag-6", name: "张明", online: false, avatarText: "张", avatarColor: "#a7b0c0" },
  { id: "ag-7", name: "林晓", online: false, avatarText: "林", avatarColor: "#a7b0c0" }
];

const currentAgentName = "客服主管";

const translationLanguages = [
  { label: "英语", value: "en" },
  { label: "西班牙语", value: "es" },
  { label: "法语", value: "fr" },
  { label: "德语", value: "de" },
  { label: "葡萄牙语", value: "pt" },
  { label: "俄语", value: "ru" },
  { label: "简体中文", value: "zh-CN" },
  { label: "繁体中文", value: "zh-TW" },
  { label: "日语", value: "ja" },
  { label: "韩语", value: "ko" },
  { label: "越南语", value: "vi" },
  { label: "泰语", value: "th" },
  { label: "印度尼西亚语", value: "id" },
  { label: "马来语", value: "ms" },
];

const getAgentAvatarText = (name: string) => agentPool.find((a) => a.name === name)?.avatarText ?? name.slice(0, 1);
const getAgentAvatarColor = (name: string) => agentPool.find((a) => a.name === name)?.avatarColor ?? "#a7b0c0";

function getFeedbackLabel(feedback?: "satisfied" | "neutral" | "unsatisfied" | null): string {
  if (feedback === "satisfied") return "满意";
  if (feedback === "neutral") return "一般";
  if (feedback === "unsatisfied") return "不满意";
  return "暂无评价";
}

function getInitial(name: string): string {
  if (!name) return '?';
  const first = name.trim()[0];
  return /[a-zA-Z]/.test(first) ? first.toUpperCase() : first;
}

interface ConversationSession extends SessionItem {
  queueKey: string;
  tag: "访客" | "VIP" | "客户";
  avatarText: string;
  avatarColor: string;
  channel: string;
  channelType?: "web" | "widget" | "email" | "telegram";
  remarkName?: string;
  visitorOnline?: boolean;
  fromEmail?: string;
  telegramUserId?: number;
  telegramUsername?: string;
  telegramFirstName?: string;
  telegramLastName?: string;
  visitorName: string;
  visitorId: string;
  phone: string;
  email: string;
  entryPage: string;
  visitStats: string;
  deviceIp: string;
  os: string;
  browser: string;
  startedAt: string;
  acceptedAt: string;
  assignee: string;
  assistants: string[];
  closed?: boolean;
  claimed?: boolean;
  visitorFeedback?: "satisfied" | "neutral" | "unsatisfied" | null;
  isGroupChat?: boolean;
  visitorTagIds?: string[];
  conversationTagIds?: string[];
}

interface DetailField {
  key: string;
  label: string;
  value: string;
}

interface AgentInfoItem {
  key: string;
  name: string;
  avatarText: string;
  avatarColor: string;
  role: "owner" | "assistant";
  messageCount: number;
}

interface TimelineItem {
  key: string;
  label: string;
  link: string;
  time: string;
  duration: string;
  dotClass?: string;
}

interface InfoSection {
  key: string;
  title: string;
  type: "fields" | "tags" | "timeline" | "agents";
  fields?: DetailField[];
  agents?: AgentInfoItem[];
  timeline?: TimelineItem[];
  moreText?: string;
}

const mainNavItemsBase: NavItem[] = [
  { key: "home", label: "首页", icon: "home" },
  { key: "conversation", label: "消息", icon: "conversation" },
  { key: "files", label: "档案", icon: "files" },
  { key: "visitors", label: "访客", icon: "visitors" },
  { key: "customer", label: "客户", icon: "customer" },
  { key: "campaign", label: "营销", icon: "campaign" },
  { key: "report", label: "报表", icon: "report" },
  { key: "ai-agent", label: "AI Agent", icon: "ai-agent" }
];

const navRoutePathMap: Record<string, string> = {
  home: "/home",
  conversation: "/conversation",
  files: "/files",
  visitors: "/visitors",
  customer: "/customer",
  campaign: "/campaign",
  report: "/report",
  "ai-agent": "/ai-agent"
};

const defaultQueueKey = "pending-reply";
const defaultAiNavKey: AiAgentNavKey = "copilot-settings";
const defaultSettingsNavKey: SettingsNavKey = "install";
const defaultCampaignNavKey: CampaignNavKey = "campaign-chatting";
const defaultReportNavKey: ReportNavKey = "data-overview";
const defaultFilesNavKey: FilesNavKey = "all-conversations";
const defaultVisitorsNavKey: VisitorsNavKey = "online-visitors";
const defaultCustomerNavKey: CustomerNavKey = "online-customer";

const validAiNavKeys: AiAgentNavKey[] = ["doc-knowledge", "faq", "copilot-settings", "ai-agent-config"];
const validCampaignNavKeys: CampaignNavKey[] = ["campaign-chatting", "campaign-proactive"];
const validReportNavKeys: ReportNavKey[] = ["data-overview", "ai-agent-report", "evaluation-analysis"];
const validFilesNavKeys: FilesNavKey[] = ["all-conversations", "all-chats"];
const validVisitorsNavKeys: VisitorsNavKey[] = ["online-visitors", "all-visitors"];
const validCustomerNavKeys: CustomerNavKey[] = ["online-customer", "all-customer"];

const settingsNavGroupsBase = [
  {
    key: "channel-group",
    title: "渠道",
    leadingEmoji: "⚙️",
    items: [
      {
        key: "live-chat",
        label: "网页",
        children: [
          { key: "website-code", label: "网站代码" },
          { key: "install", label: "聊天页面" },
          { key: "customize", label: "自定义" }
        ]
      },
      { key: "email", label: "Email" },
      { key: "telegram", label: "Telegram" }
    ]
  },
  {
    key: "team-group",
    title: "团队",
    leadingEmoji: "👩‍💻",
    items: [
      { key: "agents", label: "成员" },
      { key: "roles", label: "角色" },
      { key: "team", label: "成员设置" }
    ]
  },
  {
    key: "quick-reply-group",
    title: "快捷回复",
    leadingEmoji: "↩️",
    items: [
      { key: "quick-reply", label: "公共回复" },
      { key: "personal-reply", label: "个人回复" }
    ]
  },
  {
    key: "tags-group",
    title: "标签",
    leadingEmoji: "🏷️",
    items: [
      { key: "visitor-tags", label: "访客标签" },
      { key: "conversation-tags", label: "会话标签" }
    ]
  },
  {
    key: "security-group",
    title: "安全",
    leadingEmoji: "🔒",
    items: [
      { key: "blacklist", label: "黑名单" },
      { key: "trusted-domains", label: "信任域名" }
    ]
  },
  {
    key: "dev-settings-group",
    title: "开发设置",
    leadingEmoji: "💻",
    items: [
      { key: "dev-settings", label: "开发设置" },
      { key: "webhooks", label: "Webhooks" }
    ]
  }
];

const settingsNavGroups = computed(() =>
  settingsNavGroupsBase.filter((group) => canShowSettingsGroup(group.key))
);

const validSettingsNavKeys = computed<SettingsNavKey[]>(() =>
  settingsNavGroups.value.flatMap((group) =>
    group.items.flatMap((item: any) =>
      item.children ? item.children.map((c: any) => c.key as SettingsNavKey) : [item.key as SettingsNavKey]
    )
  )
);

const campaignNavGroups = [
  {
    key: "campaign",
    title: "",
    items: [
      { key: "campaign-chatting", label: "群发消息", icon: "campaign" },
      { key: "campaign-proactive", label: "主动营销", icon: "campaign" }
    ]
  }
];

const filesNavItems = [
  { key: "all-conversations", label: "会话记录", icon: "book" },
  { key: "all-chats", label: "聊天记录", icon: "conversation" }
];

const visitorsNavItems = [
  { key: "online-visitors", label: "在线访客", icon: "visitors" },
  { key: "all-visitors", label: "全部访客", icon: "customer" }
];

const customerNavItems = [
  { key: "online-customer", label: "在线客户", icon: "visitors" },
  { key: "all-customer", label: "全部客户", icon: "customer" }
];

const aiNavGroups = [
  {
    key: "knowledge",
    title: "知识库",
    items: [
      { key: "faq", label: "常见问题", leadingEmoji: "👩‍💻" },
      { key: "doc-knowledge", label: "文档知识", leadingEmoji: "📖" }
    ]
  },
  {
    key: "ai-settings",
    title: "AI设置",
    items: [
      { key: "copilot-settings", label: "Copilot", leadingEmoji: "💡" },
      { key: "ai-agent-config", label: "Autopilot", leadingEmoji: "🤖" }
    ]
  }
];

const reportNavGroups = [
  {
    key: "report-group",
    title: "",
    items: [
      { key: "data-overview", label: "人工客服", leadingEmoji: "📈" },
      { key: "ai-agent-report", label: "Autopilot", leadingEmoji: "🤖" },
      { key: "evaluation-analysis", label: "会话评价", leadingEmoji: "😊" }
    ]
  }
];

const queueGroupSeed: SessionQueueGroup[] = [
  {
    key: "online-session",
    title: "在线会话",
    items: [
      { key: "pending-reply", label: "待回复", leadingEmoji: "👋" },
      { key: "queueing", label: "排队中", leadingEmoji: "⌛" },
      { key: "processing", label: "待处理", leadingEmoji: "📝" },
      { key: "resolved", label: "已回复", leadingEmoji: "↩️" },
      { key: "all-online", label: "全部", leadingEmoji: "🗂️" }
    ]
  },
  {
    key: "online-chat",
    title: "在线聊天",
    actions: [{ key: "start-chat", label: "发起聊天", text: "+" }],
    items: [{ key: "chat-room", label: "聊天", leadingEmoji: "💬" }]
  },
  {
    key: "ai-agent",
    title: "Autopilot",
    items: [{ key: "ai-agent-queue", label: "Autopilot", leadingEmoji: "🤖" }]
  }
];

const detailTabs: Array<{ key: DetailTabKey; label: string }> = [
  { key: "visitor", label: "访客信息" },
  { key: "session", label: "会话信息" }
];

const NO_REPLY_RE = /^(no[-_]?reply|do[-_]?not[-_]?reply|mailer-daemon)@/i;

function isNoReplyEmail(addr: string): boolean {
  return NO_REPLY_RE.test(addr);
}

function isNoReplySession(s: ConversationSession): boolean {
  return s.channelType === "email" && !!s.email && isNoReplyEmail(s.email);
}

const allSessions = ref<ConversationSession[]>([
  {
    id: "s-6001",
    queueKey: "pending-reply",
    customerName: "了解铂金会员权益",
    preview: "我刚买的套餐，权益什么时候生效？",
    updatedAt: "19:34",
    unreadCount: 2,
    tag: "客户",
    avatarText: "J",
    avatarColor: "linear-gradient(135deg, #1aa3e8 0%, #2f6bff 100%)",
    channel: "官网入口",
    channelType: "web",
    remarkName: "Jenny",
    visitorOnline: true,
    visitorName: "微微",
    visitorId: "449868",
    phone: "18133093890",
    email: "aidanswang@gmail.com",
    entryPage: "https://www.twt.com/shop/vip-plan",
    visitStats: "3 会话，1 聊天",
    deviceIp: "192.169.0.23",
    os: "Windows 11",
    browser: "Chrome 133",
    startedAt: "10:30",
    acceptedAt: "10:31",
    assignee: "客服主管",
    assistants: [],
    visitorFeedback: "satisfied"
  },
  {
    id: "s-6002",
    queueKey: "pending-reply",
    customerName: "续费折扣咨询",
    preview: "企业版续费有季度折扣吗？",
    updatedAt: "12:23",
    unreadCount: 1,
    tag: "VIP",
    avatarText: "E",
    avatarColor: "linear-gradient(135deg, #7f6bff 0%, #a259ff 100%)",
    channel: "活动落地页",
    channelType: "web",
    remarkName: "",
    visitorOnline: true,
    visitorName: "Ella",
    visitorId: "552108",
    phone: "18677774561",
    email: "ella.vip@demo.com",
    entryPage: "https://www.twt.com/pricing/pro",
    visitStats: "6 会话，2 聊天",
    deviceIp: "10.16.88.102",
    os: "macOS 15",
    browser: "Safari 19",
    startedAt: "12:00",
    acceptedAt: "12:01",
    assignee: "王珂",
    assistants: []
  },
  {
    id: "s-6003",
    queueKey: "queueing",
    customerName: "发票抬头修改",
    preview: "系统里改完抬头还是旧的，帮忙看下",
    updatedAt: "11:10",
    unreadCount: 3,
    tag: "访客",
    avatarText: "Q",
    avatarColor: "linear-gradient(135deg, #00b578 0%, #00a66f 100%)",
    channel: "客服入口",
    channelType: "web",
    remarkName: "秦先生",
    visitorOnline: false,
    visitorName: "秦川",
    visitorId: "418022",
    phone: "13902099876",
    email: "qinchuan@example.com",
    entryPage: "https://www.twt.com/help/billing",
    visitStats: "1 会话，1 聊天",
    deviceIp: "172.26.19.6",
    os: "Android 16",
    browser: "Edge 133",
    startedAt: "11:08",
    acceptedAt: "--",
    assignee: "排队中",
    assistants: []
  },
  {
    id: "s-6004",
    queueKey: "processing",
    customerName: "接口限流报错",
    preview: "最近接口 429 比例突然上升",
    updatedAt: "09:10",
    unreadCount: 0,
    tag: "VIP",
    avatarText: "R",
    avatarColor: "linear-gradient(135deg, #ff7d00 0%, #ffb15d 100%)",
    channel: "控制台工单",
    channelType: "widget",
    remarkName: "Rita VIP",
    visitorOnline: true,
    visitorName: "Rita",
    visitorId: "321900",
    phone: "15800110022",
    email: "rita@team.io",
    entryPage: "https://console.twt.com/api/monitor",
    visitStats: "4 会话，5 聊天",
    deviceIp: "10.0.12.91",
    os: "Ubuntu 24.04",
    browser: "Firefox 135",
    startedAt: "08:58",
    acceptedAt: "09:00",
    assignee: "刘昊",
    assistants: []
  },
  {
    id: "s-6005",
    queueKey: "resolved",
    customerName: "订单退款进度",
    preview: "已经提交 3 天了，状态还是处理中",
    updatedAt: "昨天",
    unreadCount: 0,
    tag: "客户",
    avatarText: "M",
    avatarColor: "linear-gradient(135deg, #00c2b8 0%, #00a0cc 100%)",
    channel: "邮件链接",
    channelType: "web",
    remarkName: "",
    visitorOnline: false,
    visitorName: "Mia",
    visitorId: "901177",
    phone: "13799220031",
    email: "mia.order@demo.com",
    entryPage: "https://www.twt.com/order/refund",
    visitStats: "2 会话，0 聊天",
    deviceIp: "100.65.44.11",
    os: "iOS 19",
    browser: "Mobile Safari",
    startedAt: "昨天 18:22",
    acceptedAt: "昨天 18:24",
    assignee: "陈悦",
    assistants: []
  },
  {
    id: "s-6006",
    queueKey: "chat-room",
    customerName: "活动报名咨询",
    preview: "今天直播回放什么时候开放？",
    updatedAt: "06:56",
    unreadCount: 1,
    tag: "访客",
    avatarText: "L",
    avatarColor: "linear-gradient(135deg, #2f6bff 0%, #69a1ff 100%)",
    channel: "社媒私信",
    channelType: "widget",
    remarkName: "",
    visitorOnline: true,
    visitorName: "Leo",
    visitorId: "883209",
    phone: "18621004482",
    email: "leo.chat@demo.com",
    entryPage: "https://www.twt.com/events/live-02",
    visitStats: "5 会话，8 聊天",
    deviceIp: "192.168.7.200",
    os: "HarmonyOS Next",
    browser: "WebView",
    startedAt: "06:50",
    acceptedAt: "06:52",
    assignee: "李想",
    assistants: []
  },
  {
    id: "s-7001",
    queueKey: "ai-agent-queue",
    customerName: "配送时间咨询",
    preview: "下单后多久能收到？有加急选项吗？",
    updatedAt: "20:15",
    unreadCount: 0,
    tag: "访客",
    avatarText: "T",
    avatarColor: "linear-gradient(135deg, #f59e0b 0%, #f97316 100%)",
    channel: "网页插件",
    channelType: "widget",
    remarkName: "",
    visitorOnline: true,
    visitorName: "Tom",
    visitorId: "770201",
    phone: "13512345678",
    email: "tom@demo.com",
    entryPage: "https://www.twt.com/shop/delivery",
    visitStats: "1 会话，0 聊天",
    deviceIp: "10.0.5.88",
    os: "Windows 11",
    browser: "Chrome 133",
    startedAt: "20:10",
    acceptedAt: "20:10",
    assignee: "智能助手",
    assistants: []
  },
  {
    id: "s-7002",
    queueKey: "ai-agent-queue",
    customerName: "账户安全设置",
    preview: "我想开启两步验证，在哪里设置？",
    updatedAt: "20:02",
    unreadCount: 0,
    tag: "客户",
    avatarText: "S",
    avatarColor: "linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)",
    channel: "官网入口",
    channelType: "web",
    remarkName: "",
    visitorOnline: false,
    visitorName: "Sarah",
    visitorId: "880334",
    phone: "18900998877",
    email: "sarah@demo.com",
    entryPage: "https://www.twt.com/account/security",
    visitStats: "2 会话，1 聊天",
    deviceIp: "192.168.1.55",
    os: "macOS 15",
    browser: "Safari 19",
    startedAt: "19:58",
    acceptedAt: "19:58",
    assignee: "智能助手",
    assistants: []
  },
  {
    id: "s-email-01",
    queueKey: "pending-reply",
    customerName: "产品报价询问",
    preview: "Hi, I would like to get a quote for the enterprise plan...",
    updatedAt: "16:45",
    unreadCount: 1,
    tag: "客户",
    avatarText: "M",
    avatarColor: "linear-gradient(135deg, #e85d1a 0%, #ff8c42 100%)",
    channel: "邮件",
    channelType: "email",
    fromEmail: "sales@company.gmail.com",
    visitorName: "Michael Brown",
    visitorId: "770201",
    phone: "",
    email: "michael.brown@acme.com",
    entryPage: "",
    visitStats: "1 会话",
    deviceIp: "",
    os: "",
    browser: "",
    startedAt: "16:30",
    acceptedAt: "16:31",
    assignee: "王珂",
    assistants: []
  },
  {
    id: "s-email-02",
    queueKey: "resolved",
    customerName: "Re: 技术支持请求 #4892",
    preview: "Thank you for the quick response, the issue has been...",
    updatedAt: "14:20",
    unreadCount: 0,
    tag: "VIP",
    avatarText: "S",
    avatarColor: "linear-gradient(135deg, #16a34a 0%, #4ade80 100%)",
    channel: "邮件",
    channelType: "email",
    fromEmail: "support@company.gmail.com",
    visitorName: "Sarah Johnson",
    visitorId: "770202",
    phone: "",
    email: "sarah.johnson@techcorp.io",
    entryPage: "",
    visitStats: "3 会话",
    deviceIp: "",
    os: "",
    browser: "",
    startedAt: "13:00",
    acceptedAt: "13:02",
    assignee: "客服主管",
    assistants: []
  },
  {
    id: "s-email-03",
    queueKey: "processing",
    customerName: "账单地址变更请求",
    preview: "Could you please update our billing address to...",
    updatedAt: "11:30",
    unreadCount: 1,
    tag: "客户",
    avatarText: "D",
    avatarColor: "linear-gradient(135deg, #6366f1 0%, #818cf8 100%)",
    channel: "邮件",
    channelType: "email",
    fromEmail: "billing@company.gmail.com",
    visitorName: "David Wilson",
    visitorId: "770203",
    phone: "",
    email: "david.wilson@globalinc.com",
    entryPage: "",
    visitStats: "2 会话",
    deviceIp: "",
    os: "",
    browser: "",
    startedAt: "11:15",
    acceptedAt: "11:16",
    assignee: "刘昊",
    assistants: []
  },
  {
    id: "s-email-04",
    queueKey: "pending-reply",
    customerName: "Alex Chen",
    preview: "（无邮件内容）",
    updatedAt: "08:30",
    unreadCount: 1,
    tag: "访客",
    avatarText: "AC",
    avatarColor: "linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)",
    channel: "邮件",
    channelType: "email" as const,
    fromEmail: "support@company.gmail.com",
    visitorName: "Alex Chen",
    visitorId: "770204",
    phone: "",
    email: "alex.chen@startup.io",
    entryPage: "",
    visitStats: "1 会话",
    deviceIp: "",
    os: "",
    browser: "",
    startedAt: "08:30",
    acceptedAt: "08:30",
    assignee: "客服主管",
    assistants: []
  },
  {
    id: "s-email-05",
    queueKey: "replied",
    customerName: "Emma Rodriguez",
    preview: "Thanks for the update! I've reviewed the changes and...",
    updatedAt: "15:30",
    unreadCount: 0,
    tag: "VIP",
    avatarText: "ER",
    avatarColor: "linear-gradient(135deg, #f59e0b 0%, #f97316 100%)",
    channel: "邮件",
    channelType: "email" as const,
    fromEmail: "support@company.gmail.com",
    visitorName: "Emma Rodriguez",
    visitorId: "770205",
    phone: "+1 415-555-0188",
    email: "emma.r@enterprise.com",
    entryPage: "",
    visitStats: "5 会话",
    deviceIp: "198.51.100.42",
    os: "macOS 14",
    browser: "Safari 18",
    startedAt: "10:00",
    acceptedAt: "10:05",
    assignee: "王珂",
    assistants: ["客服主管"]
  },
  {
    id: "s-email-noreply-01",
    queueKey: "pending-reply",
    customerName: "System Notification",
    preview: "This is an automated message, please do not reply.",
    updatedAt: "08:10",
    unreadCount: 1,
    tag: "访客",
    avatarText: "N",
    avatarColor: "linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)",
    channel: "邮件",
    channelType: "email",
    fromEmail: "support@company.gmail.com",
    visitorName: "No Reply",
    visitorId: "999999",
    phone: "",
    email: "noreply@notifications.example.com",
    entryPage: "",
    visitStats: "1 会话",
    deviceIp: "",
    os: "",
    browser: "",
    startedAt: "08:10",
    acceptedAt: "08:10",
    assignee: "系统",
    assistants: []
  },
  {
    id: "s-telegram-01",
    queueKey: "pending-reply",
    customerName: "Telegram 会话",
    preview: "Hello! I have a question about your pricing plans",
    updatedAt: "17:25",
    unreadCount: 2,
    tag: "访客",
    avatarText: "JD",
    avatarColor: "linear-gradient(135deg, #0088cc 0%, #229ed9 100%)",
    channel: "Telegram",
    channelType: "telegram" as const,
    telegramUserId: 123456789,
    telegramUsername: "johndoe",
    telegramFirstName: "John",
    telegramLastName: "Doe",
    visitorName: "John Doe",
    visitorId: "tg-123456789",
    phone: "",
    email: "",
    entryPage: "",
    visitStats: "1 会话",
    deviceIp: "",
    os: "Telegram",
    browser: "",
    startedAt: "17:20",
    acceptedAt: "17:21",
    assignee: "陈悦",
    assistants: []
  },
  {
    id: "s-telegram-02",
    queueKey: "resolved",
    customerName: "Telegram 会话",
    preview: "Thanks for your help! Problem solved 👍",
    updatedAt: "15:40",
    unreadCount: 0,
    tag: "客户",
    avatarText: "AS",
    avatarColor: "linear-gradient(135deg, #0088cc 0%, #229ed9 100%)",
    channel: "Telegram",
    channelType: "telegram" as const,
    telegramUserId: 987654321,
    telegramUsername: "alice_smith",
    telegramFirstName: "Alice",
    telegramLastName: "Smith",
    visitorName: "Alice Smith",
    visitorId: "tg-987654321",
    phone: "",
    email: "",
    entryPage: "",
    visitStats: "3 会话",
    deviceIp: "",
    os: "Telegram",
    browser: "",
    startedAt: "14:30",
    acceptedAt: "14:31",
    assignee: "王珂",
    assistants: [],
    visitorFeedback: "satisfied"
  },
  {
    id: "s-telegram-03",
    queueKey: "processing",
    customerName: "Telegram 会话",
    preview: "Can you send me the invoice for last month?",
    updatedAt: "13:15",
    unreadCount: 1,
    tag: "VIP",
    avatarText: "MJ",
    avatarColor: "linear-gradient(135deg, #0088cc 0%, #229ed9 100%)",
    channel: "Telegram",
    channelType: "telegram" as const,
    telegramUserId: 555666777,
    telegramUsername: "mike_johnson",
    telegramFirstName: "Mike",
    telegramLastName: "Johnson",
    visitorName: "Mike Johnson",
    visitorId: "tg-555666777",
    phone: "",
    email: "",
    entryPage: "",
    visitStats: "5 会话",
    deviceIp: "",
    os: "Telegram",
    browser: "",
    startedAt: "13:00",
    acceptedAt: "13:01",
    assignee: "刘昊",
    assistants: []
  }
]);

const displaySessions = computed(() => allSessions.value.filter((s) => !isNoReplySession(s)));

const messageMap = ref<Record<string, MessageItem[]>>({
  "s-6001": [
    {
      id: "m-100",
      role: "system",
      sender: "系统",
      content: " ",
      time: "10:30"
    },
    {
      id: "m-101",
      role: "customer",
      sender: "微微",
      content: "我昨天买的东西还没到，是不是出什么问题了？",
      time: "10:32"
    },
    {
      id: "m-102",
      role: "agent",
      sender: "客服主管",
      content: "已帮你核对物流状态，包裹正在派送中，预计今晚 20:00 前送达。",
      time: "10:33"
    },
    {
      id: "m-103",
      role: "customer",
      sender: "微微",
      content: "好的，那我的铂金会员权益什么时候能生效？我刚买的套餐。",
      time: "10:35"
    },
    {
      id: "m-104",
      role: "agent",
      sender: "客服主管",
      content: "铂金会员权益在支付成功后 24 小时内自动激活，您的套餐已于昨天 15:00 购买，今天应该已经生效了。",
      time: "10:36"
    },
    {
      id: "m-105",
      role: "customer",
      sender: "微微",
      content: "我看了一下，套餐里说包含专属客服通道，怎么使用？",
      time: "10:38"
    },
    {
      id: "m-106",
      role: "agent",
      sender: "客服主管",
      content: "专属客服通道会在您下次登录时自动开启，届时页面右下角会出现金色的铂金专属入口，响应时间在 30 秒以内。",
      time: "10:39"
    },
    {
      id: "m-107",
      role: "customer",
      sender: "微微",
      content: "套餐到期后会自动续费吗？",
      time: "10:41"
    },
    {
      id: "m-108",
      role: "agent",
      sender: "客服主管",
      content: "不会自动续费，到期前 7 天会通过短信和站内信提醒您，您可以手动选择续费或更换其他套餐。",
      time: "10:42"
    },
    {
      id: "m-109",
      role: "system",
      sender: "系统",
      content: "访客提交了评价：满意",
      time: "10:43"
    },
    {
      id: "m-110",
      role: "agent",
      sender: "客服主管",
      content: "客户情绪较敏感，后续跟进时注意措辞，避免提及物流延误细节。",
      time: "10:44",
      isNote: true
    }
  ],
  "s-6002": [
    {
      id: "m-201",
      role: "customer",
      sender: "Ella",
      content: "企业版续费如果一次付一年有优惠吗？",
      time: "12:20"
    }
  ],
  "s-6003": [
    {
      id: "m-301",
      role: "customer",
      sender: "秦川",
      content: "发票抬头我改了两次，下载下来还是老公司名。",
      time: "11:09"
    }
  ],
  "s-6004": [
    {
      id: "m-401",
      role: "customer",
      sender: "Rita",
      content: "API 在高峰期频繁 429，想确认是否平台限流策略调整。",
      time: "09:08"
    },
    {
      id: "m-402",
      role: "agent",
      sender: "刘昊",
      content: "我们正在排查，请提供最近 10 分钟的请求 ID 样本。",
      time: "09:09"
    },
    {
      id: "m-403",
      role: "customer",
      sender: "Rita",
      content: "这是请求 ID 列表：req_8a3f、req_9b2c、req_7d4e，都是 429 响应。",
      time: "09:12"
    },
    {
      id: "m-404",
      role: "agent",
      sender: "刘昊",
      content: "已定位到问题，你们的请求触发了新上线的速率限制规则，每秒请求上限从 100 调整为 50。建议在客户端加入请求队列和指数退避重试。",
      time: "09:18"
    },
    {
      id: "m-405",
      role: "customer",
      sender: "Rita",
      content: "这个限流调整有通知吗？我们完全不知道请求上限变了。",
      time: "09:20"
    },
    {
      id: "m-406",
      role: "agent",
      sender: "刘昊",
      content: "非常抱歉，这次限流调整确实通知不到位，我已反馈给产品团队。短期内可以为您的账户临时提升到每秒 80 次请求，您看是否可以？",
      time: "09:22"
    }
  ],
  "s-6005": [
    {
      id: "m-501",
      role: "agent",
      sender: "陈悦",
      content: "退款申请已提交财务，预计 1-2 个工作日原路退回。",
      time: "昨天 18:30"
    },
    {
      id: "m-502",
      role: "customer",
      sender: "张明",
      content: "好的，退款到账后会有通知吗？",
      time: "昨天 18:32"
    },
    {
      id: "m-503",
      role: "agent",
      sender: "陈悦",
      content: "会的，退款成功后系统会自动发送短信和邮件通知，请留意查收。",
      time: "昨天 18:33"
    }
  ],
  "s-6006": [
    {
      id: "m-601",
      role: "customer",
      sender: "Leo",
      content: "今天直播回放几点能看？",
      time: "06:54"
    },
    {
      id: "m-602",
      role: "agent",
      sender: "客服主管",
      content: "直播回放一般在结束后 2 小时内上架，今天的直播预计下午 3 点结束，回放大约 5 点可以观看。",
      time: "07:01"
    }
  ],
  "s-7001": [
    {
      id: "m-701",
      role: "customer",
      sender: "Tom",
      content: "下单后多久能收到？有加急选项吗？",
      time: "20:11"
    },
    {
      id: "m-702",
      role: "bot",
      sender: "智能助手",
      content: "您好！标准配送一般在下单后 3-5 个工作日内送达。如果您需要加急，可以在结算时选择「加急配送」选项，预计 1-2 个工作日送达，需额外支付 15 元运费。",
      time: "20:11"
    },
    {
      id: "m-703",
      role: "customer",
      sender: "Tom",
      content: "加急配送支持哪些地区？",
      time: "20:13"
    },
    {
      id: "m-704",
      role: "bot",
      sender: "智能助手",
      content: "加急配送目前覆盖全国主要城市（含直辖市、省会城市及大部分地级市）。偏远地区暂不支持加急，但标准配送仍可正常使用。您可以在下单页面输入收货地址后，系统会自动判断是否支持加急。",
      time: "20:14"
    }
  ],
  "s-7002": [
    {
      id: "m-801",
      role: "customer",
      sender: "Sarah",
      content: "我想开启两步验证，在哪里设置？",
      time: "19:59"
    },
    {
      id: "m-802",
      role: "bot",
      sender: "智能助手",
      content: "您好！开启两步验证的步骤如下：\n1. 登录后进入「账户设置」页面\n2. 点击「安全设置」\n3. 找到「两步验证」，点击「开启」\n4. 选择验证方式（短信或认证器应用）\n5. 按提示完成绑定即可\n\n如果遇到问题，可以随时联系我。",
      time: "20:00"
    }
  ],
  "s-email-01": [
    {
      id: "m-email-02",
      role: "customer",
      sender: "Michael Brown",
      content: "<p>Hi,</p><p>I would like to get a quote for the <strong>enterprise plan</strong> for our company. We have approximately 50 customer service agents and handle around 2,000 conversations per day.</p><p>Could you also provide information about:</p><ul><li>API integration options</li><li>Custom branding capabilities</li><li>SLA guarantees</li></ul><p>Looking forward to your response.</p><p>Best regards,<br/>Michael Brown<br/>VP of Customer Success, Acme Corp</p>",
      time: "16:30",
      contentType: "html",
      subject: "Enterprise Plan Quote Request",
      fromEmail: "michael.brown@acme.com",
      toEmail: "support@company.gmail.com"
    },
    {
      id: "m-email-03",
      role: "agent",
      sender: "王珂",
      content: "<p>Hi Michael,</p><p>Thank you for your interest in our Enterprise Plan! Based on your requirements (50 agents, ~2,000 conversations/day), here is the pricing breakdown:</p><table style=\"border-collapse:collapse;width:100%;margin:12px 0;font-size:13px;\"><tr style=\"background:#f0f5ff;\"><th style=\"border:1px solid #d0d8e8;padding:8px 12px;text-align:left;\">Feature</th><th style=\"border:1px solid #d0d8e8;padding:8px 12px;text-align:left;\">Details</th><th style=\"border:1px solid #d0d8e8;padding:8px 12px;text-align:right;\">Price</th></tr><tr><td style=\"border:1px solid #d0d8e8;padding:8px 12px;\">Enterprise License (50 seats)</td><td style=\"border:1px solid #d0d8e8;padding:8px 12px;\">Unlimited conversations</td><td style=\"border:1px solid #d0d8e8;padding:8px 12px;text-align:right;\">$4,500/mo</td></tr><tr><td style=\"border:1px solid #d0d8e8;padding:8px 12px;\">API Integration Module</td><td style=\"border:1px solid #d0d8e8;padding:8px 12px;\">REST + Webhook + SDK</td><td style=\"border:1px solid #d0d8e8;padding:8px 12px;text-align:right;\">Included</td></tr><tr><td style=\"border:1px solid #d0d8e8;padding:8px 12px;\">Custom Branding</td><td style=\"border:1px solid #d0d8e8;padding:8px 12px;\">Logo, colors, domain</td><td style=\"border:1px solid #d0d8e8;padding:8px 12px;text-align:right;\">Included</td></tr><tr><td style=\"border:1px solid #d0d8e8;padding:8px 12px;\">SLA Guarantee</td><td style=\"border:1px solid #d0d8e8;padding:8px 12px;\">99.9% uptime, 1h response</td><td style=\"border:1px solid #d0d8e8;padding:8px 12px;text-align:right;\">Included</td></tr></table><p>Here is a preview of the Enterprise Dashboard:</p><img src=\"https://placehold.co/560x300/eef4ff/2f6bff?text=Enterprise+Dashboard+Preview\" alt=\"Enterprise Dashboard\" style=\"max-width:100%;border-radius:8px;margin:8px 0;border:1px solid #e0e6ed;\" /><p>Would you like to schedule a demo call to discuss further? We also offer a <strong>10% annual discount</strong> for yearly billing.</p><p>Best regards,<br/>Wang Ke<br/>Sales Team</p>",
      time: "17:15",
      contentType: "html",
      subject: "Re: Enterprise Plan Quote Request",
      fromEmail: "support@company.gmail.com",
      toEmail: "michael.brown@acme.com"
    },
    {
      id: "m-email-04",
      role: "customer",
      sender: "Michael Brown",
      content: "<p>Hi Wang,</p><p>Thanks for the detailed breakdown! The pricing looks reasonable. I have a few follow-up questions:</p><p>1. Can you confirm the data migration support? We have about <strong>150,000 historical conversations</strong> to import.</p><p>2. What's the typical onboarding timeline?</p><blockquote style=\"border-left:3px solid #d0d8e8;padding-left:12px;color:#75869c;margin:12px 0;\">On Wed, Mar 27, 2026 at 5:15 PM Wang Ke &lt;support@company.gmail.com&gt; wrote:<br/><br/>Thank you for your interest in our Enterprise Plan! Based on your requirements (50 agents, ~2,000 conversations/day), here is the pricing breakdown: $4,500/mo for Enterprise License...</blockquote><p>Best,<br/>Michael</p>",
      time: "18:02",
      contentType: "html",
      subject: "Re: Enterprise Plan Quote Request",
      fromEmail: "michael.brown@acme.com",
      toEmail: "support@company.gmail.com"
    },
    {
      id: "m-email-05",
      role: "agent",
      sender: "王珂",
      content: "<p>Hi Michael,</p><p>Great questions! Let me address each one:</p><p><strong>Data Migration:</strong> Absolutely! 150K conversations is well within our capabilities. Our team will handle the full import with zero downtime. Typical timeline is 3-5 business days.</p><p><strong>Onboarding Timeline:</strong> Usually 2-3 weeks from contract signing to go-live, including migration, training, and custom branding setup.</p><p>I'd suggest we set up a 30-min call this week. How does Thursday 2pm PST work for you?</p><blockquote style=\"border-left:3px solid #d0d8e8;padding-left:12px;color:#75869c;margin:12px 0;\">On Wed, Mar 27, 2026 at 6:02 PM Michael Brown &lt;michael.brown@acme.com&gt; wrote:<br/><br/>Thanks for the detailed breakdown! The pricing looks reasonable. I have a few follow-up questions: 1. Can you confirm the data migration support? We have about 150,000 historical conversations to import...</blockquote><p>Best regards,<br/>Wang Ke</p>",
      time: "18:45",
      contentType: "html",
      subject: "Re: Enterprise Plan Quote Request",
      fromEmail: "support@company.gmail.com",
      toEmail: "michael.brown@acme.com"
    }
  ],
  "s-email-02": [
    {
      id: "m-email-11",
      role: "customer",
      sender: "Sarah Johnson",
      content: "<p>Hi Support Team,</p><p>We're experiencing an issue with the <strong>webhook integration</strong>. The events are not being delivered to our endpoint since yesterday.</p><p>Error details:</p><blockquote>HTTP 503 - Service Unavailable on POST /api/webhooks/twt</blockquote><p>Our endpoint URL: <a href=\"#\">https://api.techcorp.io/webhooks/twt</a></p><p>Ticket reference: #4892</p><p>Thanks,<br/>Sarah</p>",
      time: "13:00",
      contentType: "html",
      subject: "技术支持请求 #4892",
      fromEmail: "sarah.johnson@techcorp.io",
      toEmail: "support@company.gmail.com"
    },
    {
      id: "m-email-12",
      role: "agent",
      sender: "客服主管",
      content: "<p>Hi Sarah,</p><p>Thank you for reporting this issue. I've checked our webhook delivery logs and found the root cause:</p><p>Your SSL certificate expired on March 17th, which is causing the 503 errors. Please renew your certificate and the webhook deliveries will resume automatically.</p><p>Here is a screenshot from our delivery log dashboard:</p><img src=\"https://placehold.co/540x260/fff4f4/d63031?text=Webhook+Delivery+Failures+-+SSL+Expired\" alt=\"Webhook delivery log\" style=\"max-width:100%;border-radius:8px;margin:8px 0;border:1px solid #e0e6ed;\" /><p>We've queued all missed events and they will be re-delivered once your endpoint is accessible again.</p><p>Best regards,<br/>Support Team</p>",
      time: "13:45",
      contentType: "html",
      subject: "Re: 技术支持请求 #4892",
      fromEmail: "support@company.gmail.com",
      toEmail: "sarah.johnson@techcorp.io"
    },
    {
      id: "m-email-13",
      role: "customer",
      sender: "Sarah Johnson",
      content: "<p>Hi,</p><p>Thank you for the quick response! You were right - the SSL certificate had expired. We've renewed it and the webhooks are working again.</p><p>Much appreciated! You can close this ticket.</p><blockquote style=\"border-left:3px solid #d0d8e8;padding-left:12px;color:#75869c;margin:12px 0;\">On Wed, Mar 27, 2026 at 1:45 PM Support Team &lt;support@company.gmail.com&gt; wrote:<br/><br/>Thank you for reporting this issue. I've checked our webhook delivery logs and found the root cause: Your SSL certificate expired on March 17th, which is causing the 503 errors...</blockquote><p>Best,<br/>Sarah</p>",
      time: "14:20",
      contentType: "html",
      subject: "Re: 技术支持请求 #4892",
      fromEmail: "sarah.johnson@techcorp.io",
      toEmail: "support@company.gmail.com"
    }
  ],
  "s-email-03": [
    {
      id: "m-email-20",
      role: "customer",
      sender: "David Wilson",
      content: "<p>Hi,</p><p>We recently moved our headquarters. Could you please update our billing address on file to:</p><p><strong>GlobalInc Ltd.</strong><br/>350 Market Street, Suite 800<br/>San Francisco, CA 94105<br/>United States</p><p>Please confirm once updated. Thank you!</p><p>Best regards,<br/>David Wilson<br/>Finance Department, GlobalInc</p>",
      time: "11:15",
      contentType: "html",
      subject: "账单地址变更请求",
      fromEmail: "david.wilson@globalinc.com",
      toEmail: "billing@company.gmail.com"
    }
  ],
  "s-email-04": [
    {
      id: "m-email-30",
      role: "customer" as const,
      sender: "Alex Chen",
      content: "",
      time: "08:30",
      contentType: "html" as const,
      subject: "Partnership Inquiry",
      fromEmail: "alex.chen@startup.io",
      toEmail: "support@company.gmail.com"
    },
    {
      id: "m-email-31",
      role: "agent",
      sender: "客服主管",
      content: "<p>Hi Alex,</p><p>We received your email but it appears the content was empty. Could you please resend your inquiry?</p><p>Best regards,<br/>Support Team</p>",
      time: "08:45",
      contentType: "html",
      subject: "Re: Partnership Inquiry",
      fromEmail: "support@company.gmail.com",
      toEmail: "alex.chen@startup.io"
    }
  ],
  "s-email-05": [
    {
      id: "m-email-40",
      role: "customer",
      sender: "Emma Rodriguez",
      content: "<p>Hi Team,</p><p>We'd like to upgrade our current plan from Professional to Enterprise. Here are our requirements:</p><ul><li>100 agent seats (currently at 25)</li><li>Custom SSO integration with Okta</li><li>Dedicated account manager</li><li>Priority support SLA (30-min response time)</li></ul><p>Our current contract ends on April 30th. Can we start the transition process now?</p><p>Thanks,<br/>Emma Rodriguez<br/>VP of Operations, Enterprise Corp</p>",
      time: "10:00",
      contentType: "html",
      subject: "Plan Upgrade Request - Enterprise Corp",
      fromEmail: "emma.r@enterprise.com",
      toEmail: "support@company.gmail.com"
    },
    {
      id: "m-email-41",
      role: "agent",
      sender: "王珂",
      content: "<p>Hi Emma,</p><p>Thank you for choosing to upgrade! I've reviewed your requirements and here's what we can offer:</p><p><strong>Enterprise Plan (100 seats):</strong></p><table style=\"border-collapse:collapse;width:100%;margin:12px 0;font-size:13px;\"><tr style=\"background:#f0f5ff;\"><th style=\"border:1px solid #d0d8e8;padding:8px 12px;text-align:left;\">Item</th><th style=\"border:1px solid #d0d8e8;padding:8px 12px;text-align:right;\">Monthly</th></tr><tr><td style=\"border:1px solid #d0d8e8;padding:8px 12px;\">Enterprise License (100 seats)</td><td style=\"border:1px solid #d0d8e8;padding:8px 12px;text-align:right;\">$8,500</td></tr><tr><td style=\"border:1px solid #d0d8e8;padding:8px 12px;\">Okta SSO Integration</td><td style=\"border:1px solid #d0d8e8;padding:8px 12px;text-align:right;\">Included</td></tr><tr><td style=\"border:1px solid #d0d8e8;padding:8px 12px;\">Dedicated Account Manager</td><td style=\"border:1px solid #d0d8e8;padding:8px 12px;text-align:right;\">Included</td></tr><tr><td style=\"border:1px solid #d0d8e8;padding:8px 12px;\">Priority SLA (30-min)</td><td style=\"border:1px solid #d0d8e8;padding:8px 12px;text-align:right;\">$500</td></tr></table><p>We can start the transition immediately and run both plans in parallel until April 30th at no extra cost.</p><p>Shall I proceed with generating the contract?</p><p>Best regards,<br/>Wang Ke<br/>Enterprise Sales</p>",
      time: "11:30",
      contentType: "html",
      subject: "Re: Plan Upgrade Request - Enterprise Corp",
      fromEmail: "support@company.gmail.com",
      toEmail: "emma.r@enterprise.com"
    },
    {
      id: "m-email-42",
      role: "customer",
      sender: "Emma Rodriguez",
      content: "<p>Hi Wang,</p><p>The pricing looks good! A couple of questions before we sign:</p><ol><li>Is the 30-min SLA available 24/7 or only during business hours?</li><li>Can we add more seats mid-contract if needed?</li><li>What's the data retention policy for Enterprise?</li></ol><blockquote style=\"border-left:3px solid #d0d8e8;padding-left:12px;color:#75869c;margin:12px 0;\">On Thu, Mar 28, 2026 at 11:30 AM Wang Ke &lt;support@company.gmail.com&gt; wrote:<br/><br/>Thank you for choosing to upgrade! I've reviewed your requirements and here's what we can offer:<br/><br/><strong>Enterprise Plan (100 seats):</strong><br/>Enterprise License (100 seats) — $8,500/mo<br/>Okta SSO Integration — Included<br/>Dedicated Account Manager — Included<br/>Priority SLA (30-min) — $500/mo<br/><br/>We can start the transition immediately and run both plans in parallel until April 30th at no extra cost.<br/>Shall I proceed with generating the contract?</blockquote><p>Thanks,<br/>Emma</p>",
      time: "13:15",
      contentType: "html",
      subject: "Re: Plan Upgrade Request - Enterprise Corp",
      fromEmail: "emma.r@enterprise.com",
      toEmail: "support@company.gmail.com"
    },
    {
      id: "m-email-43",
      role: "agent",
      sender: "王珂",
      content: "<p>Hi Emma,</p><p>Great questions! Here are the answers:</p><p><strong>1. SLA Coverage:</strong> The 30-min Priority SLA is 24/7/365, including holidays. Our global support team ensures round-the-clock coverage.</p><p><strong>2. Adding Seats:</strong> Yes, you can add seats at any time during the contract period. Additional seats are prorated based on the remaining contract term.</p><p><strong>3. Data Retention:</strong> Enterprise plan includes <strong>unlimited data retention</strong>. All conversation history, files, and analytics data are preserved indefinitely.</p><p>I'll prepare the contract draft and send it over by tomorrow morning. Please also let me know your preferred Okta admin contact for the SSO setup.</p><blockquote style=\"border-left:3px solid #d0d8e8;padding-left:12px;color:#75869c;margin:12px 0;\">On Thu, Mar 28, 2026 at 1:15 PM Emma Rodriguez &lt;emma.r@enterprise.com&gt; wrote:<br/><br/>The pricing looks good! A couple of questions before we sign:<br/>1. Is the 30-min SLA available 24/7 or only during business hours?<br/>2. Can we add more seats mid-contract if needed?<br/>3. What's the data retention policy for Enterprise?<br/><br/><blockquote style=\"border-left:3px solid #ccc;padding-left:10px;color:#999;margin:8px 0;\">On Thu, Mar 28, 2026 at 11:30 AM Wang Ke &lt;support@company.gmail.com&gt; wrote:<br/><br/>Thank you for choosing to upgrade! Enterprise License (100 seats) — $8,500/mo...</blockquote></blockquote><p>Best regards,<br/>Wang Ke</p>",
      time: "14:00",
      contentType: "html",
      subject: "Re: Plan Upgrade Request - Enterprise Corp",
      fromEmail: "support@company.gmail.com",
      toEmail: "emma.r@enterprise.com"
    },
    {
      id: "m-email-44",
      role: "customer",
      sender: "Emma Rodriguez",
      content: "<p>Hi Wang,</p><p>Thanks for the update! I've reviewed the changes and everything looks perfect. Here's our Okta admin contact for SSO setup:</p><p><strong>James Liu</strong> — <a href=\"mailto:james.liu@enterprise.com\">james.liu@enterprise.com</a><br/>IT Director, Enterprise Corp</p><p>Please send the contract to my email and CC our legal team at <a href=\"mailto:legal@enterprise.com\">legal@enterprise.com</a>.</p><p>Looking forward to the upgrade!</p><blockquote style=\"border-left:3px solid #d0d8e8;padding-left:12px;color:#75869c;margin:12px 0;\">On Thu, Mar 28, 2026 at 2:00 PM Wang Ke &lt;support@company.gmail.com&gt; wrote:<br/><br/>Great questions! Here are the answers:<br/><br/>1. SLA Coverage: The 30-min Priority SLA is 24/7/365, including holidays.<br/>2. Adding Seats: Yes, you can add seats at any time during the contract period.<br/>3. Data Retention: Enterprise plan includes unlimited data retention.<br/><br/>I'll prepare the contract draft and send it over by tomorrow morning.<br/><br/><blockquote style=\"border-left:3px solid #ccc;padding-left:10px;color:#999;margin:8px 0;\">On Thu, Mar 28, 2026 at 1:15 PM Emma Rodriguez &lt;emma.r@enterprise.com&gt; wrote:<br/><br/>The pricing looks good! A couple of questions before we sign:<br/>1. Is the 30-min SLA available 24/7 or only during business hours?<br/>2. Can we add more seats mid-contract if needed?<br/><br/><blockquote style=\"border-left:3px solid #ccc;padding-left:10px;color:#999;margin:8px 0;\">On Thu, Mar 28, 2026 at 11:30 AM Wang Ke wrote:<br/><br/>Thank you for choosing to upgrade! Enterprise License (100 seats) — $8,500/mo...</blockquote></blockquote></blockquote><p>Best,<br/>Emma</p>",
      time: "15:30",
      contentType: "html",
      subject: "Re: Plan Upgrade Request - Enterprise Corp",
      fromEmail: "emma.r@enterprise.com",
      toEmail: "support@company.gmail.com"
    }
  ],
  "s-telegram-01": [
    {
      id: "m-tg-001",
      role: "system",
      sender: "系统",
      content: " ",
      time: "17:20"
    },
    {
      id: "m-tg-002",
      role: "customer",
      sender: "John Doe",
      content: "Hello! I have a question about your pricing plans",
      time: "17:21"
    },
    {
      id: "m-tg-003",
      role: "customer",
      sender: "John Doe",
      content: "Do you offer discounts for annual subscriptions?",
      time: "17:22"
    },
    {
      id: "m-tg-004",
      role: "agent",
      sender: "陈悦",
      content: "Hi John! Yes, we offer a 10% discount for annual subscriptions. Would you like me to send you the detailed pricing?",
      time: "17:23"
    },
    {
      id: "m-tg-005",
      role: "customer",
      sender: "John Doe",
      content: "Yes please! Also, can I upgrade from monthly to annual later?",
      time: "17:25"
    }
  ],
  "s-telegram-02": [
    {
      id: "m-tg-101",
      role: "system",
      sender: "系统",
      content: " ",
      time: "14:30"
    },
    {
      id: "m-tg-102",
      role: "customer",
      sender: "Alice Smith",
      content: "Hi, I'm having trouble connecting my Telegram bot to your API",
      time: "14:31"
    },
    {
      id: "m-tg-103",
      role: "customer",
      sender: "Alice Smith",
      content: "Getting error 401 - Unauthorized",
      time: "14:31"
    },
    {
      id: "m-tg-104",
      role: "agent",
      sender: "王珂",
      content: "Hi Alice! Let me help you with that. Can you confirm you're using the correct API token from your dashboard?",
      time: "14:32"
    },
    {
      id: "m-tg-105",
      role: "customer",
      sender: "Alice Smith",
      content: "Oh wait, I was using the test token instead of the production one 🤦‍♀️",
      time: "14:33"
    },
    {
      id: "m-tg-106",
      role: "agent",
      sender: "王珂",
      content: "No worries! That's a common mistake. Make sure to use the production token from Settings > API Keys.",
      time: "14:34"
    },
    {
      id: "m-tg-107",
      role: "customer",
      sender: "Alice Smith",
      content: "It works now! Thanks for your help! Problem solved 👍",
      time: "15:40"
    },
    {
      id: "m-tg-108",
      role: "agent",
      sender: "王珂",
      content: "Great! Feel free to reach out if you need anything else. Have a great day!",
      time: "15:41"
    }
  ],
  "s-telegram-03": [
    {
      id: "m-tg-201",
      role: "system",
      sender: "系统",
      content: " ",
      time: "13:00"
    },
    {
      id: "m-tg-202",
      role: "customer",
      sender: "Mike Johnson",
      content: "Can you send me the invoice for last month?",
      time: "13:01"
    },
    {
      id: "m-tg-203",
      role: "agent",
      sender: "刘昊",
      content: "Sure! Let me pull that up for you. Can you confirm your account email?",
      time: "13:02"
    },
    {
      id: "m-tg-204",
      role: "customer",
      sender: "Mike Johnson",
      content: "mike.johnson@company.com",
      time: "13:03"
    },
    {
      id: "m-tg-205",
      role: "agent",
      sender: "刘昊",
      content: "Found it! I'll send the invoice to your email in a moment. It's for $4,500 covering March 2026.",
      time: "13:15"
    }
  ]
});

const router = useRouter();
const route = useRoute();

// 监听路由变化，同步状态
watch(() => route.name, (newRouteName) => {
  if (newRouteName && typeof newRouteName === "string") {
    syncRouteScopedState(newRouteName, { forceDefault: true });
  }
}, { immediate: false });

const activeMainNav = computed(() => {
  const routeName = currentRouteName.value;
  // 设置页面也应该高亮设置图标
  if (routeName === "settings") {
    return "settings";
  }
  // 其他路由返回对应的 key
  return routeName || "conversation";
});
const activeQueueKey = ref("pending-reply");
const activeSessionId = ref("s-6001");

// 监听会话切换,自动翻译未翻译的消息
watch(activeSessionId, async (newSessionId) => {
  if (!newSessionId) return;

  const switchEnabled = getSessionSwitch(newSessionId);
  if (!switchEnabled) return;

  const messages = messageMap.value[newSessionId] || [];
  if (messages.length === 0) return;

  await autoTranslateMessages(
    newSessionId,
    messages,
    'zh-CN',
    (messageId, translation) => {
      const sessionMessages = messageMap.value[newSessionId];
      if (!sessionMessages) return;

      const message = sessionMessages.find(m => m.id === messageId);
      if (message) {
        message.translation = translation;
      }
    }
  );
});

// 重试翻译
async function handleRetryTranslation(messageId: string, content: string) {
  if (!activeSessionId.value) return;

  await retryTranslation(
    messageId,
    content,
    'zh-CN',
    (translation) => {
      const sessionMessages = messageMap.value[activeSessionId.value];
      if (!sessionMessages) return;

      const message = sessionMessages.find(m => m.id === messageId);
      if (message) {
        message.translation = translation;
      }
    }
  );
}

const searchKeyword = ref("");
const appliedSearchKeyword = ref(""); // 实际应用的搜索关键词，只在触发搜索时更新
const searchMatchDialogVisible = ref(false);
const searchMatchDialogMessages = ref<Array<{
  id: string;
  sender: string;
  content: string;
  time: string;
  avatarText?: string;
  avatarColor?: string;
  avatarUrl?: string;
}>>([]);
const pendingSessionId = ref("");
const composerText = ref("");
const emailComposerBody = ref("");
const emailComposerSubject = ref("");
const emailComposerRef = ref<InstanceType<typeof EmailComposer>>();
const selectedFromEmail = ref("support@company.gmail.com");
const connectedGmailAccounts = ref(["support@company.gmail.com", "sales@company.gmail.com"]);

const quickReplyCategories = ref<QuickReplyCategory[]>([
  {
    key: "public",
    label: "公共回复",
    type: "group",
    items: [
      { id: "1", tag: "/1123", reply: "You're welcome, please let me know if there's anything else I can help you!", images: [] },
      { id: "2", tag: "/1", reply: "想要在手机放一个 AI 助手，选项不少，但要么像个「高级复读机」，要么是信息的搬运工——天知道，我想要的是一个能真干活的助手，一个除了能说还能动手的「创意合伙人」。今年你应该也感觉到了，AI 正在从「能聊」变成「能干」。OpenAI 搞了个 Atlas，Google 即将发布的 Gemini 3.0 让 AI 直接操作电脑……大家都在玩同一个方向：让说话变成操作，让对话变成动作。", images: [{ url: "/mock/ai-assistant.png", name: "ai-assistant.png" }] },
      { id: "3", tag: "/123", reply: "Thank you for your patience. We have processed your request and you should receive a confirmation email shortly.", images: [] },
      { id: "4", tag: "/hello", reply: "Hello! Welcome to our support center. How can I help you today?", images: [{ url: "/mock/welcome1.png", name: "welcome1.png" }, { url: "/mock/welcome2.png", name: "welcome2.png" }] },
    ],
  },
  {
    key: "personal",
    label: "个人回复",
    type: "group",
    items: [],
  },
  { key: "tag-1123", label: "/1123", type: "tag", items: [{ id: "1", tag: "/1123", reply: "You're welcome, please let me know if there's anything else I can help you!", images: [] }] },
  { key: "tag-1", label: "/1", type: "tag", items: [{ id: "2", tag: "/1", reply: "想要在手机放一个 AI 助手，选项不少，但要么像个「高级复读机」，要么是信息的搬运工——天知道，我想要的是一个能真干活的助手，一个除了能说还能动手的「创意合伙人」。", images: [{ url: "/mock/ai-assistant.png", name: "ai-assistant.png" }] }] },
  { key: "tag-123", label: "/123", type: "tag", items: [{ id: "3", tag: "/123", reply: "Thank you for your patience. We have processed your request and you should receive a confirmation email shortly.", images: [] }] },
  { key: "tag-hello", label: "/hello", type: "tag", items: [{ id: "4", tag: "/hello", reply: "Hello! Welcome to our support center. How can I help you today?", images: [{ url: "/mock/welcome1.png", name: "welcome1.png" }, { url: "/mock/welcome2.png", name: "welcome2.png" }] }] },
]);
const activeDetailTab = ref<DetailTabKey>("visitor");
const collapsedDetailSections = ref<string[]>([]);
const activeSettingsNavKey = ref<SettingsNavKey>("install");
const activeAiNavKey = ref<AiAgentNavKey>("copilot-settings");
const activeCampaignNavKey = ref<CampaignNavKey>("campaign-chatting");
const activeReportNavKey = ref<ReportNavKey>("data-overview");
const activeFilesNavKey = ref<FilesNavKey>("all-conversations");
const activeVisitorsNavKey = ref<VisitorsNavKey>("online-visitors");
const activeCustomerNavKey = ref<CustomerNavKey>("online-customer");
const proactiveCampaignPageRef = ref<ProactiveCampaignPageExpose | null>(null);
const aiAgentProfile = ref(resolveAiAgentProfile());
const proactiveCampaignDirty = ref(false);
const allowProactiveCampaignRouteLeaveOnce = ref(false);
const showToast = ref(false);
const toastMessage = ref("");
const toastType = ref<"success" | "error">("success");
let toastTimer: number | undefined;

const transferModalOpen = ref(false);
const transferKeyword = ref("");
const confirmTransferModalOpen = ref(false);
const confirmTakeoverModalOpen = ref(false);
const confirmClaimModalOpen = ref(false);
const pendingTransferAgentId = ref<string | null>(null);

const inviteModalOpen = ref(false);
const inviteKeyword = ref("");
const startChatModalOpen = ref(false);
const closeSessionModalOpen = ref(false);
const closeEmailSessionModalOpen = ref(false);
const aiAssignModalOpen = ref(false);
const aiAssignKeyword = ref("");
const queueAssignModalOpen = ref(false);
const queueAssignKeyword = ref("");

const hasCustomerIdentity = ref(true);
type SessionFilterType = "all" | "visitor" | "customer";
const sessionFilterType = ref<SessionFilterType>("all");

type SearchFieldType = "all" | "visitorName" | "visitorAlias" | "agentName" | "title" | "conversationRecord" | "customerIdentifier";
const searchFieldType = ref<SearchFieldType>("all");
const searchFieldDropdownVisible = ref(false);
const searchFieldWrapRef = ref<HTMLElement | null>(null);

const searchFieldOptions = computed<Array<{ key: SearchFieldType; label: string }>>(() => {
  const options: Array<{ key: SearchFieldType; label: string }> = [
    { key: "all", label: "全部" },
    { key: "visitorName", label: "访客姓名" },
    { key: "visitorAlias", label: "访客备注名" },
  ];

  if (isChatRoom.value) {
    options.push({ key: "agentName", label: "客服姓名" });
  }

  options.push(
    { key: "title", label: isChatRoom.value ? "聊天标题" : "会话标题" },
    { key: "conversationRecord", label: "沟通记录" },
    { key: "customerIdentifier", label: "客户标识" },
  );

  return options;
});

const searchFieldOptionsFormatted = computed(() =>
  searchFieldOptions.value.map(opt => ({ value: opt.key, label: opt.label }))
);

function handleSearch() {
  // 触发搜索时更新实际应用的关键词
  appliedSearchKeyword.value = searchKeyword.value;
}

function selectSearchField(key: SearchFieldType) {
  searchFieldType.value = key;
  searchFieldDropdownVisible.value = false;
}

type SortOrderType = "desc" | "asc";
const sortOrder = ref<SortOrderType>("desc");
const sortDropdownVisible = ref(false);

// 全局标签数据（原型用静态数据模拟）
const globalVisitorTags = ref([
  { id: "vt1", name: "高价值" },
  { id: "vt2", name: "潜在客户" },
  { id: "vt3", name: "已流失" },
]);
const globalConversationTags = ref([
  { id: "ct1", name: "投诉" },
  { id: "ct2", name: "咨询" },
  { id: "ct3", name: "售后" },
]);

// filter 面板状态
const filterPanelVisible = ref(false);
let filterPanelTimer: ReturnType<typeof setTimeout> | null = null;
interface SessionFilter {
  visitorOnline: boolean | null;
  visitorTagIds: string[];
  conversationTagIds: string[];
  channelTypes: string[];
}
const activeFilter = ref<SessionFilter>({
  visitorOnline: null,
  visitorTagIds: [],
  conversationTagIds: [],
  channelTypes: [],
});
const draftFilter = ref<SessionFilter>({
  visitorOnline: null,
  visitorTagIds: [],
  conversationTagIds: [],
  channelTypes: [],
});
const visitorTagDropdownOpen = ref(false);
const conversationTagDropdownOpen = ref(false);
const visitorTagTriggerHover = ref(false);
const conversationTagTriggerHover = ref(false);

function formatTagTriggerText(tagIds: string[], tagList: { id: string; name: string }[]) {
  if (tagIds.length === 0) return '请选择';
  const selectedTags = tagList.filter(t => tagIds.includes(t.id));
  if (selectedTags.length <= 2) return selectedTags.map(t => t.name).join('、');
  const visible = selectedTags.slice(0, 2).map(t => t.name).join('、');
  return `${visible} +${selectedTags.length - 2}`;
}
const hasActiveFilter = computed(() =>
  activeFilter.value.visitorOnline !== null ||
  activeFilter.value.visitorTagIds.length > 0 ||
  activeFilter.value.conversationTagIds.length > 0 ||
  activeFilter.value.channelTypes.length > 0
);

function showFilterPanel() {
  if (filterPanelTimer) clearTimeout(filterPanelTimer);
  draftFilter.value = { ...activeFilter.value, visitorTagIds: [...activeFilter.value.visitorTagIds], conversationTagIds: [...activeFilter.value.conversationTagIds], channelTypes: [...activeFilter.value.channelTypes] };
  filterPanelVisible.value = true;
}

function hideFilterPanel() {
  filterPanelTimer = setTimeout(() => {
    filterPanelVisible.value = false;
    visitorTagDropdownOpen.value = false;
    conversationTagDropdownOpen.value = false;
  }, 150);
}

function applyFilter() {
  activeFilter.value = { ...draftFilter.value, visitorTagIds: [...draftFilter.value.visitorTagIds], conversationTagIds: [...draftFilter.value.conversationTagIds], channelTypes: [...draftFilter.value.channelTypes] };
  filterPanelVisible.value = false;
}
let sortDropdownTimer: ReturnType<typeof setTimeout> | null = null;

function showSortDropdown() {
  if (sortDropdownTimer) clearTimeout(sortDropdownTimer);
  sortDropdownVisible.value = true;
}

function hideSortDropdown() {
  sortDropdownTimer = setTimeout(() => {
    sortDropdownVisible.value = false;
  }, 150);
}

const queueGroups = computed(() =>
  queueGroupSeed.map((group) => ({
    ...group,
    items: group.items.map((item) => ({
      ...item,
      count: displaySessions.value.filter((session) => session.queueKey === item.key).length
    }))
  }))
);

const validQueueKeys = queueGroupSeed.flatMap((group) => group.items.map((item) => item.key));

const canCollaborate = computed(() => activeSession.value?.queueKey !== "queueing" || activeSession.value?.claimed === true);

const transferableAgents = computed(() => {
  const keyword = transferKeyword.value.trim().toLowerCase();
  return agentPool
    .filter((a) => a.name !== currentAgentName)
    .filter((a) => keyword.length === 0 || a.name.toLowerCase().includes(keyword))
    .sort((a, b) => (a.online === b.online ? 0 : a.online ? -1 : 1))
    .map((a) => ({ id: a.id, name: a.name, online: a.online, avatarText: a.avatarText, avatarColor: a.avatarColor }));
});

const pendingTransferAgent = computed(() => {
  if (!pendingTransferAgentId.value) {
    return null;
  }
  return agentPool.find((agent) => agent.id === pendingTransferAgentId.value) ?? null;
});

const invitableAgents = computed(() => {
  const session = activeSession.value;
  if (!session) return [];
  const inSession = new Set([session.assignee, ...session.assistants]);
  const keyword = inviteKeyword.value.trim().toLowerCase();
  return agentPool
    .filter((a) => !inSession.has(a.name))
    .filter((a) => keyword.length === 0 || a.name.toLowerCase().includes(keyword))
    .sort((a, b) => (a.online === b.online ? 0 : a.online ? -1 : 1))
    .map((a) => ({ id: a.id, name: a.name, online: a.online, avatarText: a.avatarText, avatarColor: a.avatarColor }));
});

const aiAssignableAgents = computed(() => {
  const keyword = aiAssignKeyword.value.trim().toLowerCase();
  return agentPool
    .filter((a) => keyword.length === 0 || a.name.toLowerCase().includes(keyword))
    .sort((a, b) => (a.online === b.online ? 0 : a.online ? -1 : 1))
    .map((a) => ({ id: a.id, name: a.name, online: a.online, avatarText: a.avatarText, avatarColor: a.avatarColor }));
});

const queueAssignableAgents = computed(() => {
  const keyword = queueAssignKeyword.value.trim().toLowerCase();
  return agentPool
    .filter((a) => keyword.length === 0 || a.name.toLowerCase().includes(keyword))
    .sort((a, b) => (a.online === b.online ? 0 : a.online ? -1 : 1))
    .map((a) => ({ id: a.id, name: a.name, online: a.online, avatarText: a.avatarText, avatarColor: a.avatarColor }));
});

const startChatVisitorCandidates: StartChatContact[] = [
  { id: "visitor:56", type: "visitor", name: "Visitor56", avatarText: "VI", avatarColor: "#9fc4ee", online: false, visitorId: "56" },
  { id: "visitor:123-a", type: "visitor", name: "123", avatarText: "12", avatarColor: "#c6e48b", online: false, visitorId: "123-a" },
  { id: "visitor:54", type: "visitor", name: "Visitor54", avatarText: "VI", avatarColor: "#bedf7f", online: false, visitorId: "54" },
  { id: "visitor:53", type: "visitor", name: "Visitor53", avatarText: "VI", avatarColor: "#93e0c2", online: false, visitorId: "53" },
  { id: "visitor:123-b", type: "visitor", name: "123", avatarText: "12", avatarColor: "#c6e48b", online: false, visitorId: "123-b" },
  { id: "visitor:51", type: "visitor", name: "Visitor51", avatarText: "VI", avatarColor: "#df97d9", online: false, visitorId: "51" },
  { id: "visitor:50", type: "visitor", name: "Visitor50", avatarText: "VI", avatarColor: "#9be3df", online: false, visitorId: "50" },
  { id: "visitor:49", type: "visitor", name: "Visitor49", avatarText: "VI", avatarColor: "#93e0c2", online: false, visitorId: "49" },
  { id: "visitor:48", type: "visitor", name: "Visitor48", avatarText: "VI", avatarColor: "#9f9ff0", online: false, visitorId: "48" }
];

const startChatCustomerCandidates: StartChatContact[] = [
  { id: "customer:tuski", type: "customer", name: "tuski", avatarText: "T", avatarColor: "#d3a272", online: false, visitorId: "customer-tuski" },
  { id: "customer:jack", type: "customer", name: "Jack", avatarText: "J", avatarColor: "#8ab4ff", online: false, visitorId: "customer-jack" },
  { id: "customer:linda", type: "customer", name: "Linda", avatarText: "L", avatarColor: "#98d8aa", online: false, visitorId: "customer-linda" },
  { id: "customer:zoe", type: "customer", name: "Zoe", avatarText: "Z", avatarColor: "#f7b267", online: false, visitorId: "customer-zoe" }
];

const startChatPinnedContact: StartChatContact = startChatCustomerCandidates[0];

const startChatCandidates = computed<StartChatContact[]>(() => {
  const agents = agentPool
    .filter((agent) => agent.name !== currentAgentName)
    .map<StartChatContact>((agent) => ({
      id: `agent:${agent.id}`,
      type: "agent",
      name: agent.name,
      avatarText: agent.avatarText,
      avatarColor: agent.avatarColor,
      online: agent.online
    }));

  return [...startChatVisitorCandidates, ...startChatCustomerCandidates, ...agents];
});

const conversationBadgeCount = computed(() => {
  const queueKeys = queueGroupSeed.flatMap((group) => group.items.map((item) => item.key));
  return displaySessions.value.filter((session) => queueKeys.includes(session.queueKey)).length;
});

const mainNavItems = computed<NavItem[]>(() =>
  mainNavItemsBase
    .filter((item) => canShowNavItem(item.key))
    .map((item) => {
      if (item.key !== "conversation") {
        return item;
      }
      return {
        ...item,
        badge: conversationBadgeCount.value
      };
    })
);

const currentRouteName = computed(() => (typeof route.name === "string" ? route.name : ""));
const isHomeRoute = computed(() => currentRouteName.value === "home");
const isConversationRoute = computed(() => currentRouteName.value === "conversation");
const isFilesRoute = computed(() => currentRouteName.value === "files");
const isAiAgentRoute = computed(() => currentRouteName.value === "ai-agent");
const isSettingsRoute = computed(() => currentRouteName.value === "settings");
const isCampaignRoute = computed(() => currentRouteName.value === "campaign");
const isReportRoute = computed(() => currentRouteName.value === "report");
const isVisitorsRoute = computed(() => currentRouteName.value === "visitors");
const isCustomerRoute = computed(() => currentRouteName.value === "customer");

const isAiSession = computed(() => activeSession.value?.queueKey === "ai-agent-queue");
const isQueueingSession = computed(() => activeSession.value?.queueKey === "queueing");
const isQueueingSessionClaimed = computed(() => isQueueingSession.value && activeSession.value?.claimed === true);
const isProcessingSession = computed(() => activeSession.value?.queueKey === "processing");
const isClosedSession = computed(() => activeSession.value?.closed === true);
const isChatRoom = computed(() => activeQueueKey.value === "chat-room");

const currentSubnavRenderKey = computed(() => `subnav-${currentRouteName.value}`);
const currentShellRenderKey = computed(() => `shell-${currentRouteName.value}`);

const currentContentRenderKey = computed(() => {
  if (isConversationRoute.value) return `view-conversation-${activeQueueKey.value}`;
  if (isFilesRoute.value) return `view-files-${activeFilesNavKey.value}`;
  if (isVisitorsRoute.value) return `view-visitors-${activeVisitorsNavKey.value}`;
  if (isCustomerRoute.value) return `view-customer-${activeCustomerNavKey.value}`;
  if (isSettingsRoute.value) return `view-settings-${activeSettingsNavKey.value}`;
  if (isAiAgentRoute.value) return `view-ai-agent-${activeAiNavKey.value}`;
  if (isReportRoute.value) return `view-report-${activeReportNavKey.value}`;
  if (isCampaignRoute.value) return `view-campaign-${activeCampaignNavKey.value}`;
  return `view-${currentRouteName.value}`;
});

const currentDetailRenderKey = computed(() => `detail-${activeQueueKey.value}-${activeSessionId.value}-${activeDetailTab.value}`);

const chatHeaderMode = computed<"conversation" | "single-chat" | "group-chat">(() => {
  if (!isChatRoom.value) return "conversation";
  return activeSession.value?.isGroupChat ? "group-chat" : "single-chat";
});

const currentModuleLabel = computed(() => {
  if (isSettingsRoute.value) {
    return "设置";
  }
  const item = mainNavItemsBase.find((entry) => entry.key === currentRouteName.value);
  return item?.label ?? "模块";
});

// 从 seed 派生，避免与 queueGroupSeed 漂移；新增队列类型时自动包含
const onlineQueueKeys = queueGroupSeed.find(g => g.key === "online-session")!.items.filter(i => i.key !== "all-online").map(i => i.key);
const queueSessionList = computed(() => activeQueueKey.value === "all-online"
  ? displaySessions.value.filter((s) => onlineQueueKeys.includes(s.queueKey))
  : displaySessions.value.filter((s) => s.queueKey === activeQueueKey.value));

watch(activeQueueKey, () => { sessionFilterType.value = "all"; searchFieldType.value = "all"; searchKeyword.value = ""; appliedSearchKeyword.value = ""; });

const filterCounts = computed(() => {
  const list = queueSessionList.value;
  return {
    all: list.length,
    visitor: list.filter((s) => s.tag === "访客").length,
    customer: list.filter((s) => s.tag === "客户" || s.tag === "VIP").length,
  };
});

const showSessionCategoryFilter = computed(() => {
  if (!hasCustomerIdentity.value) return false;
  // 需与 queueGroupSeed online-session items 保持同步（含 all-online）
  const keys = ["all-online", "pending-reply", "queueing", "processing", "resolved", "ai-agent-queue"];

  return keys.includes(activeQueueKey.value);
});

const showFilterButton = computed(() =>
  ["pending-reply", "queueing", "processing", "resolved", "all-online", "chat-room", "ai-agent-queue"].includes(activeQueueKey.value)
);

const showOnlineSessionFilter = computed(() =>
  ["pending-reply", "queueing", "processing", "resolved", "all-online", "chat-room", "ai-agent-queue"].includes(activeQueueKey.value)
);

const sessionMatchResults = computed(() => {
  const results = new Map<string, { matchedIds: string[]; firstMatchContent: string; matchCount: number }>();
  const keyword = appliedSearchKeyword.value.trim();
  if (!keyword) return results;
  const field = searchFieldType.value;
  if (field !== "all" && field !== "conversationRecord") return results;
  const lowerKeyword = keyword.toLowerCase();
  for (const session of queueSessionList.value) {
    const messages = messageMap.value[session.id] ?? [];
    const matchedIds: string[] = [];
    let firstContent = "";
    for (const msg of messages) {
      if (msg.role === "system") continue;
      if (msg.contentType === "html") continue;
      if (msg.content.toLowerCase().includes(lowerKeyword)) {
        matchedIds.push(msg.id);
        if (!firstContent) {
          const kwic = extractKWIC(msg.content, keyword);
          firstContent = (kwic.hasPrefix ? "..." : "") + kwic.snippet + (kwic.hasSuffix ? "..." : "");
        }
      }
    }
    if (matchedIds.length > 0) {
      results.set(session.id, { matchedIds, firstMatchContent: firstContent, matchCount: matchedIds.length });
      continue;
    }
    if (messages.length === 0 && session.preview.toLowerCase().includes(lowerKeyword)) {
      const kwic = extractKWIC(session.preview, keyword);
      results.set(session.id, {
        matchedIds: [],
        firstMatchContent: (kwic.hasPrefix ? "..." : "") + kwic.snippet + (kwic.hasSuffix ? "..." : ""),
        matchCount: 1
      });
    }
  }
  return results;
});

const visibleSessions = computed(() => {
  const keyword = appliedSearchKeyword.value.trim().toLowerCase();
  const f = activeFilter.value;
  return queueSessionList.value.filter((session) => {
    if (sessionFilterType.value === "visitor" && session.tag !== "访客") return false;
    if (sessionFilterType.value === "customer" && session.tag !== "客户" && session.tag !== "VIP") return false;
    if (f.visitorOnline !== null && session.visitorOnline !== f.visitorOnline) return false;
    if (f.channelTypes.length > 0 && !f.channelTypes.includes(session.channelType ?? "")) return false;
    if (f.visitorTagIds.length > 0 && !f.visitorTagIds.some(id => (session.visitorTagIds ?? []).includes(id))) return false;
    if (f.conversationTagIds.length > 0 && !f.conversationTagIds.some(id => (session.conversationTagIds ?? []).includes(id))) return false;
    if (keyword.length === 0) return true;
    const field = searchFieldType.value;
    if (field === "customerIdentifier") return session.visitorId.toLowerCase().includes(keyword);
    if (field === "visitorName") return session.visitorName.toLowerCase().includes(keyword);
    if (field === "visitorAlias") return (session.remarkName ?? "").toLowerCase().includes(keyword);
    if (field === "agentName") return (session.assignee ?? "").toLowerCase().includes(keyword);
    if (field === "title") return session.customerName.toLowerCase().includes(keyword);
    if (field === "conversationRecord") return sessionMatchResults.value.has(session.id);
    if (field === "all") {
      return (
        session.visitorId.toLowerCase().includes(keyword) ||
        session.visitorName.toLowerCase().includes(keyword) ||
        (session.remarkName ?? "").toLowerCase().includes(keyword) ||
        (isChatRoom.value && (session.assignee ?? "").toLowerCase().includes(keyword)) ||
        session.customerName.toLowerCase().includes(keyword) ||
        sessionMatchResults.value.has(session.id)
      );
    }
    return (
      session.customerName.toLowerCase().includes(keyword) ||
      session.preview.toLowerCase().includes(keyword)
    );
  });
});

const activeSession = computed(() => {
  const inVisible = visibleSessions.value.find((item) => item.id === activeSessionId.value);
  if (inVisible) {
    return inVisible;
  }
  const fallback = queueSessionList.value.find((item) => item.id === activeSessionId.value);
  if (fallback) {
    return fallback;
  }
  return visibleSessions.value[0] ?? queueSessionList.value[0] ?? allSessions.value[0];
});

const activeSessionFromOptions = computed(() => {
  const session = activeSession.value;
  if (!session || session.channelType !== "email") return [];
  const from = session.fromEmail;
  if (from && connectedGmailAccounts.value.includes(from)) return connectedGmailAccounts.value;
  return [];
});

// 搜索导航
const chatStreamRef = ref<HTMLElement | null>(null);
const currentSearchIndex = ref(0);

const searchMatchIds = computed(() => {
  const session = activeSession.value;
  if (!session) return [] as string[];
  const result = sessionMatchResults.value.get(session.id);
  return result?.matchedIds ?? [];
});

const isSearchNavVisible = computed(() => searchMatchIds.value.length > 1 && !searchMatchDialogVisible.value);

function scrollToMessage(messageId: string) {
  nextTick(() => {
    const el = chatStreamRef.value?.querySelector(`[data-message-id="${messageId}"]`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  });
}

function goToPrevMatch() {
  if (searchMatchIds.value.length === 0) return;
  currentSearchIndex.value = (currentSearchIndex.value - 1 + searchMatchIds.value.length) % searchMatchIds.value.length;
  scrollToMessage(searchMatchIds.value[currentSearchIndex.value]);
}

function goToNextMatch() {
  if (searchMatchIds.value.length === 0) return;
  currentSearchIndex.value = (currentSearchIndex.value + 1) % searchMatchIds.value.length;
  scrollToMessage(searchMatchIds.value[currentSearchIndex.value]);
}

function handleSessionItemClick(sessionId: string) {
  const matchResult = sessionMatchResults.value.get(sessionId);

  if (!matchResult || matchResult.matchCount <= 1) {
    activeSessionId.value = sessionId;
    if (matchResult && matchResult.matchedIds.length === 1) {
      currentSearchIndex.value = 0;
      scrollToMessage(matchResult.matchedIds[0]);
    }
    return;
  }

  const session = allSessions.value.find(s => s.id === sessionId);
  if (!session) return;

  const messages = messageMap.value[sessionId] ?? [];
  searchMatchDialogMessages.value = matchResult.matchedIds
    .map(id => messages.find(m => m.id === id))
    .filter(Boolean)
    .map(msg => {
      if (msg.role === "customer") {
        return {
          id: msg.id,
          sender: msg.sender,
          content: msg.content,
          time: msg.time,
          avatarText: getInitial(session.remarkName || session.visitorName),
          avatarColor: session.avatarColor
        };
      }
      if (msg.role === "bot") {
        return {
          id: msg.id,
          sender: aiAgentProfile.value.name,
          content: msg.content,
          time: msg.time,
          avatarText: aiAgentProfile.value.avatarText,
          avatarColor: aiAgentProfile.value.avatarColor,
          avatarUrl: aiAgentProfile.value.avatarUrl
        };
      }
      return {
        id: msg.id,
        sender: msg.sender,
        content: msg.content,
        time: msg.time,
        avatarText: getAgentAvatarText(msg.sender),
        avatarColor: getAgentAvatarColor(msg.sender)
      };
    });

  pendingSessionId.value = sessionId;
  searchMatchDialogVisible.value = true;
}

function handleSelectMatchedMessage(messageId: string) {
  searchMatchDialogVisible.value = false;
  activeSessionId.value = pendingSessionId.value;

  nextTick(() => {
    const matchResult = sessionMatchResults.value.get(pendingSessionId.value);
    if (matchResult) {
      currentSearchIndex.value = matchResult.matchedIds.indexOf(messageId);
      scrollToMessage(messageId);
    }
  });
}

function handleCloseMatchDialog() {
  searchMatchDialogVisible.value = false;
  pendingSessionId.value = "";
  searchMatchDialogMessages.value = [];
}

watch(activeSessionId, () => {
  currentSearchIndex.value = 0;
  if (searchMatchIds.value.length > 0) {
    scrollToMessage(searchMatchIds.value[0]);
  }
});


const activeMessages = computed<DisplayMessage[]>(() => {
  const session = activeSession.value;
  if (!session) {
    return [];
  }

  return (messageMap.value[session.id] ?? []).map((message) => {
    if (message.role === "system") {
      return {
        ...message,
        displayRole: "system",
        displaySender: message.sender
      };
    }

    if (message.role === "customer") {
      return {
        ...message,
        displayRole: "customer",
        displaySender: message.sender,
        avatarText: getInitial(session.remarkName || session.visitorName),
        avatarColor: session.avatarColor
      };
    }

    if (message.role === "bot") {
      return {
        ...message,
        displayRole: "agent",
        displaySender: aiAgentProfile.value.name,
        avatarText: aiAgentProfile.value.avatarText,
        avatarColor: aiAgentProfile.value.avatarColor,
        avatarUrl: aiAgentProfile.value.avatarUrl
      };
    }

    return {
      ...message,
      displayRole: "agent",
      displaySender: message.sender,
      avatarText: getAgentAvatarText(message.sender),
      avatarColor: getAgentAvatarColor(message.sender)
    };
  });
});

const activeSessionTitle = computed(() => {
  const session = activeSession.value;
  if (!session) return "会话详情";
  if (session.channelType === "email") {
    const messages = messageMap.value[session.id] ?? [];
    const firstWithSubject = messages.find(m => m.subject);
    if (firstWithSubject?.subject) return firstWithSubject.subject;
    if (session.remarkName) return session.remarkName;
    if (session.visitorName) return session.visitorName;
    if (session.email) return session.email;
    return "邮件会话";
  }
  return session.customerName ?? "会话详情";
});

// 当切换到 email 会话时，自动填充 subject
watch(() => activeSession.value?.id, (id) => {
  if (!id) return;
  const session = activeSession.value;
  if (session?.channelType === "email") {
    const messages = messageMap.value[id] ?? [];
    const lastWithSubject = [...messages].reverse().find(m => m.subject);
    emailComposerSubject.value = lastWithSubject?.subject ? `Re: ${lastWithSubject.subject.replace(/^Re:\s*/i, "")}` : "";
  }
}, { immediate: true });

const activeQueueLabel = computed(() => {
  for (const group of queueGroups.value) {
    const item = group.items.find((entry) => entry.key === activeQueueKey.value);
    if (item) {
      return item.label;
    }
  }
  return "收件箱";
});

const activeQueueEmoji = computed(() => {
  for (const group of queueGroups.value) {
    const item = group.items.find((entry) => entry.key === activeQueueKey.value);
    if (item) {
      return item.leadingEmoji ?? "👋";
    }
  }
  return "👋";
});

const activeInfoSections = computed<InfoSection[]>(() => {
  if (!activeSession.value) {
    return [];
  }

  if (activeDetailTab.value === "session") {
    return [
      {
        key: "session-basic",
        title: "基础信息",
        type: "fields",
        fields: [
          { key: "session-id", label: "会话ID", value: activeSession.value.id },
          { key: "session-title", label: "会话标题", value: activeSession.value.customerName },
          { key: "session-start", label: "发起时间", value: activeSession.value.startedAt },
          { key: "session-accept", label: "接待时间", value: activeSession.value.acceptedAt },
          { key: "session-feedback", label: "会话评价", value: getFeedbackLabel(activeSession.value.visitorFeedback) }
        ]
      },
      {
        key: "session-tag",
        title: "会话标签",
        type: "tags"
      },
      {
        key: "session-service",
        title: "服务客服",
        type: "agents",
        agents: [
          {
            key: "session-owner",
            name: getConversationAgentName(activeSession.value, activeSession.value.assignee),
            avatarText: getConversationAgentAvatarText(activeSession.value, activeSession.value.assignee),
            avatarColor: getConversationAgentAvatarColor(activeSession.value, activeSession.value.assignee),
            role: "owner",
            messageCount: getConversationAgentMessageCount(activeSession.value, activeSession.value.assignee)
          },
          ...activeSession.value.assistants.map((name, i) => ({
            key: `session-assistant-${i}`,
            name: getConversationAgentName(activeSession.value!, name),
            avatarText: getConversationAgentAvatarText(activeSession.value!, name),
            avatarColor: getConversationAgentAvatarColor(activeSession.value!, name),
            role: "assistant" as const,
            messageCount: getConversationAgentMessageCount(activeSession.value!, name)
          }))
        ]
      }
    ];
  }

  const isEmailSession = activeSession.value.channelType === "email";
  const channelLabel: Record<string, string> = { web: "Web", widget: "网页插件", email: "Email" };

  const sections: InfoSection[] = [
    {
      key: "visitor-basic",
      title: "基础信息",
      type: "fields",
      fields: [
        { key: "visitor-alias", label: "备注名", value: "需要进群的客户" },
        { key: "visitor-name", label: "姓名", value: activeSession.value.visitorName },
        { key: "visitor-phone", label: "电话", value: activeSession.value.phone || "-" },
        { key: "visitor-email", label: "邮箱", value: activeSession.value.email || "-" }
      ]
    },
    {
      key: "visitor-tag",
      title: "访客标签",
      type: "tags"
    },
    {
      key: "visitor-customer",
      title: "客户信息",
      type: "fields",
      fields: [{ key: "visitor-bind", label: "关联客户", value: "123456" }]
    },
    {
      key: "visitor-extra",
      title: "附加信息",
      type: "fields",
      fields: [
        ...(isEmailSession ? [{ key: "visitor-entry", label: "起点页面", value: activeSession.value.entryPage || "–" }] : [{ key: "visitor-entry", label: "起点页面", value: activeSession.value.entryPage }]),
        { key: "visitor-channel", label: "来源渠道", value: channelLabel[activeSession.value.channelType ?? "web"] ?? "Web" },
        { key: "visitor-stat", label: "会话总数", value: "6 个会话" }
      ]
    }
  ];

  // 访问轨迹：web 访客有数据，email 访客显示空区块
  sections.push({
    key: "visitor-trace",
    title: "访问轨迹",
    type: "timeline",
    timeline: isEmailSession ? [] : [
      {
        key: "trace-1",
        label: "Chat with us",
        link: "https://visitorchat.twt.com/...",
        time: "2026-02-24 16:09",
        duration: "1天 2小时 30分",
        dotClass: "timeline-item__dot--active"
      },
      {
        key: "trace-2",
        label: "Chat with us",
        link: "https://visitorchat.twt.com/...",
        time: "2026-02-05 19:34",
        duration: "1分 14秒"
      },
      {
        key: "trace-3",
        label: "Chat with us",
        link: "https://visitorchat.twt.com/...",
        time: "2026-02-05 19:34",
        duration: "3秒"
      }
    ],
    moreText: isEmailSession ? undefined : "查看更多"
  });

  // 设备信息：email 访客字段为空但仍展示区块
  sections.push({
    key: "visitor-device",
    title: "设备信息",
    type: "fields",
    fields: [
      { key: "visitor-ip", label: "IP 地址", value: activeSession.value.deviceIp || "-" },
      { key: "visitor-os", label: "操作系统", value: activeSession.value.os || "-" },
      { key: "visitor-browser", label: "浏览器", value: activeSession.value.browser || "-" }
    ]
  });

  return sections;
});

const isDetailSectionCollapsed = (key: string) => collapsedDetailSections.value.includes(key);

const toggleDetailSection = (key: string) => {
  if (isDetailSectionCollapsed(key)) {
    collapsedDetailSections.value = collapsedDetailSections.value.filter((item) => item !== key);
    return;
  }
  collapsedDetailSections.value = [...collapsedDetailSections.value, key];
};

const handleProactiveCampaignDirtyChange = (dirty: boolean) => {
  proactiveCampaignDirty.value = dirty;
};

const requestProactiveCampaignNavigation = (action: () => void) => {
  const guard = proactiveCampaignPageRef.value;
  if (!guard) {
    action();
    return;
  }
  guard.requestNavigation(action);
};

const resolveScopedKey = <T extends string>(current: string, validKeys: readonly T[], fallback: T): T => (
  validKeys.includes(current as T) ? (current as T) : fallback
);

const getDefaultSettingsKey = () => validSettingsNavKeys.value[0] ?? defaultSettingsNavKey;

const syncRouteScopedState = (
  routeName: string,
  options: { forceDefault?: boolean } = {}
) => {
  if (routeName === "conversation") {
    activeQueueKey.value = options.forceDefault
      ? defaultQueueKey
      : resolveScopedKey(activeQueueKey.value, validQueueKeys, defaultQueueKey);
    if (options.forceDefault) {
      searchKeyword.value = "";
      appliedSearchKeyword.value = "";
    }
    return;
  }

  if (routeName === "files") {
    activeFilesNavKey.value = options.forceDefault
      ? defaultFilesNavKey
      : resolveScopedKey(activeFilesNavKey.value, validFilesNavKeys, defaultFilesNavKey);
    return;
  }

  if (routeName === "visitors") {
    activeVisitorsNavKey.value = options.forceDefault
      ? defaultVisitorsNavKey
      : resolveScopedKey(activeVisitorsNavKey.value, validVisitorsNavKeys, defaultVisitorsNavKey);
    return;
  }

  if (routeName === "customer") {
    activeCustomerNavKey.value = options.forceDefault
      ? defaultCustomerNavKey
      : resolveScopedKey(activeCustomerNavKey.value, validCustomerNavKeys, defaultCustomerNavKey);
    return;
  }

  if (routeName === "ai-agent") {
    activeAiNavKey.value = options.forceDefault
      ? defaultAiNavKey
      : resolveScopedKey(activeAiNavKey.value, validAiNavKeys, defaultAiNavKey);
    return;
  }

  if (routeName === "settings") {
    const fallbackKey = getDefaultSettingsKey();
    activeSettingsNavKey.value = options.forceDefault
      ? fallbackKey
      : resolveScopedKey(activeSettingsNavKey.value, validSettingsNavKeys.value, fallbackKey);
    return;
  }

  if (routeName === "report") {
    activeReportNavKey.value = options.forceDefault
      ? defaultReportNavKey
      : resolveScopedKey(activeReportNavKey.value, validReportNavKeys, defaultReportNavKey);
    return;
  }

  if (routeName === "campaign") {
    activeCampaignNavKey.value = options.forceDefault
      ? defaultCampaignNavKey
      : resolveScopedKey(activeCampaignNavKey.value, validCampaignNavKeys, defaultCampaignNavKey);
  }
};

const handleMainNavSelect = (key: string) => {
  const nextPath = navRoutePathMap[key];
  if (!nextPath) {
    return;
  }
  if (route.path === nextPath) {
    return;
  }
  router.push(nextPath);
};

const openSettingsPage = () => {
  syncRouteScopedState("settings", { forceDefault: true });
  router.push("/settings");
};

const handleNavigateToInbox = (queueKey: string) => {
  activeQueueKey.value = queueKey;
  syncRouteScopedState("conversation", { forceDefault: false });
  if (route.path !== "/conversation") {
    router.push("/conversation");
  }
};

const handleSettingsNavSelect = (key: string) => {
  const nextKey = key as SettingsNavKey;
  if (!validSettingsNavKeys.value.includes(nextKey)) {
    return;
  }
  if (activeSettingsNavKey.value === nextKey) {
    return;
  }
  activeSettingsNavKey.value = nextKey;
};

const handleAiNavSelect = (key: string) => {
  if (!validAiNavKeys.includes(key as AiAgentNavKey)) {
    return;
  }

  activeAiNavKey.value = key as AiAgentNavKey;
};

const handleCampaignNavSelect = (key: string) => {
  if (validCampaignNavKeys.includes(key as CampaignNavKey)) {
    if (activeCampaignNavKey.value === key) return;
    if (activeCampaignNavKey.value === "campaign-proactive") {
      requestProactiveCampaignNavigation(() => {
        activeCampaignNavKey.value = key as CampaignNavKey;
      });
      return;
    }
    activeCampaignNavKey.value = key as CampaignNavKey;
  }
};

const handleReportNavSelect = (key: string) => {
  if (validReportNavKeys.includes(key as ReportNavKey)) {
    activeReportNavKey.value = key as ReportNavKey;
  }
};

const handleQueueGroupAction = ({ groupKey, actionKey }: { groupKey: string; actionKey: string }) => {
  if (groupKey === "online-chat" && actionKey === "start-chat") {
    startChatModalOpen.value = true;
  }
};

const handleQueueSelect = (key: string) => {
  activeQueueKey.value = resolveScopedKey(key, validQueueKeys, defaultQueueKey);
  searchKeyword.value = "";
  appliedSearchKeyword.value = "";
};

const handleFilesNavSelect = (key: string) => {
  if (validFilesNavKeys.includes(key as FilesNavKey)) {
    activeFilesNavKey.value = key as FilesNavKey;
  }
};

const handleVisitorsNavSelect = (key: string) => {
  if (validVisitorsNavKeys.includes(key as VisitorsNavKey)) {
    activeVisitorsNavKey.value = key as VisitorsNavKey;
  }
};

const handleCustomerNavSelect = (key: string) => {
  if (validCustomerNavKeys.includes(key as CustomerNavKey)) {
    activeCustomerNavKey.value = key as CustomerNavKey;
  }
};

const refreshAiAgentProfile = () => {
  aiAgentProfile.value = resolveAiAgentProfile(loadStoredAiAgentSettings());
};

const getConversationAgentName = (session: ConversationSession, name: string) => {
  if (session.queueKey === "ai-agent-queue" && name === session.assignee) {
    return aiAgentProfile.value.name;
  }

  return name;
};

const getConversationAgentAvatarText = (session: ConversationSession, name: string) => {
  if (session.queueKey === "ai-agent-queue" && name === session.assignee) {
    return aiAgentProfile.value.avatarText;
  }

  return getAgentAvatarText(name);
};

const getConversationAgentAvatarColor = (session: ConversationSession, name: string) => {
  if (session.queueKey === "ai-agent-queue" && name === session.assignee) {
    return aiAgentProfile.value.avatarColor;
  }

  return getAgentAvatarColor(name);
};

const getConversationAgentMessageCount = (session: ConversationSession, name: string) => {
  const history = messageMap.value[session.id] ?? [];

  if (session.queueKey === "ai-agent-queue" && name === session.assignee) {
    return history.filter((message) => message.role === "bot").length;
  }

  return history.filter((message) => message.role === "agent" && message.sender === name).length;
};

const updateSessionTitle = (nextTitle: string) => {
  const currentSession = activeSession.value;
  if (!currentSession) {
    return;
  }
  allSessions.value = allSessions.value.map((session) => {
    if (session.id !== currentSession.id) {
      return session;
    }
    return {
      ...session,
      customerName: nextTitle
    };
  });
};

const sendPushNotification = (title: string, body: string) => {
  if (!("Notification" in window) || Notification.permission !== "granted") return;
  new Notification(title, { body, icon: "/favicon.ico" });
};

const closePlanSwitcher = () => { planSwitcherOpen.value = false; };

const closeTagDropdowns = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  if (!target.closest('.inbox-filter-panel__select-wrapper')) {
    visitorTagDropdownOpen.value = false;
    conversationTagDropdownOpen.value = false;
  }
  if (searchFieldWrapRef.value && !searchFieldWrapRef.value.contains(target)) {
    searchFieldDropdownVisible.value = false;
  }
};

onMounted(() => {
  refreshAiAgentProfile();
  if ("Notification" in window && Notification.permission === "default") {
    Notification.requestPermission();
  }
  document.addEventListener("click", closePlanSwitcher);
  document.addEventListener("click", closeTagDropdowns);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", closePlanSwitcher);
  document.removeEventListener("click", closeTagDropdowns);
});

watch(
  () => route.fullPath,
  () => {
    refreshAiAgentProfile();
  }
);

const showTopToast = (message: string, type: "success" | "error" = "success") => {
  toastMessage.value = message;
  toastType.value = type;
  showToast.value = true;

  if (toastTimer) {
    window.clearTimeout(toastTimer);
  }
  toastTimer = window.setTimeout(() => {
    showToast.value = false;
  }, 1500);
};

const handleOpenTransfer = () => {
  transferKeyword.value = "";
  pendingTransferAgentId.value = null;
  confirmTransferModalOpen.value = false;
  transferModalOpen.value = true;
};

const handleOpenInvite = () => {
  inviteKeyword.value = "";
  inviteModalOpen.value = true;
};

const findExistingChatRoom = (contact: StartChatContact) => {
  if (contact.type === "manual") {
    return null;
  }

  return allSessions.value.find((session) => {
    if (session.queueKey !== "chat-room") {
      return false;
    }

    if (contact.visitorId) {
      return session.visitorId === contact.visitorId;
    }

    if (contact.email) {
      return session.email === contact.email;
    }

    return session.customerName === contact.name;
  }) ?? null;
};

const buildStartChatSession = (contacts: StartChatContact[]) => {
  const now = new Date();
  const time = now.toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit", hour12: false });
  const first = contacts[0];
  const sourceSession = first?.sourceSessionId
    ? allSessions.value.find((session) => session.id === first.sourceSessionId) ?? null
    : null;
  const isGroupChat = contacts.length > 1;
  const names = contacts.map((contact) => contact.name);
  const title = isGroupChat
    ? `${names.slice(0, 3).join("、")}${contacts.length > 3 ? ` 等${contacts.length}人` : ""}`
    : first.name;
  const preview = isGroupChat
    ? `群聊已创建，成员：${names.join("、")}`
    : `已发起与${first.name}的聊天`;
  const channel = first.type === "agent" ? "内部聊天" : "发起聊天";
  const sessionId = `s-chat-${now.getTime()}`;

  const session: ConversationSession = {
    id: sessionId,
    queueKey: "chat-room",
    customerName: title,
    preview,
    updatedAt: time,
    unreadCount: 0,
    tag: first.type === "visitor" ? "访客" : "客户",
    avatarText: isGroupChat ? "群" : first.avatarText,
    avatarColor: isGroupChat ? "linear-gradient(135deg, #7c3aed 0%, #60a5fa 100%)" : first.avatarColor,
    channel,
    channelType: sourceSession?.channelType === "email" ? "web" : sourceSession?.channelType ?? "web",
    remarkName: isGroupChat ? `${contacts.length}人群聊` : first.name,
    visitorOnline: contacts.some((contact) => contact.online),
    visitorName: title,
    visitorId: isGroupChat ? `group-${now.getTime()}` : first.visitorId ?? `manual-${now.getTime()}`,
    phone: isGroupChat ? "" : first.phone ?? "",
    email: isGroupChat ? "" : first.email ?? "",
    entryPage: sourceSession?.entryPage ?? "",
    visitStats: isGroupChat ? `${contacts.length} 人群聊` : sourceSession?.visitStats ?? "0 会话，0 聊天",
    deviceIp: sourceSession?.deviceIp ?? "",
    os: sourceSession?.os ?? "",
    browser: sourceSession?.browser ?? "",
    startedAt: time,
    acceptedAt: time,
    assignee: currentAgentName,
    assistants: [],
    claimed: true,
    isGroupChat
  };

  const initialMessage: MessageItem = {
    id: `m-${sessionId}-created`,
    role: "system",
    sender: "系统",
    content: preview,
    time
  };

  return { session, initialMessage };
};

const handleStartChatConfirm = (contacts: StartChatContact[]) => {
  const effectiveContacts = contacts.filter((contact) => contact.id !== startChatPinnedContact.id);

  if (effectiveContacts.length === 0) {
    return;
  }

  if (effectiveContacts.length === 1) {
    const existingSession = findExistingChatRoom(effectiveContacts[0]);
    if (existingSession) {
      activeQueueKey.value = "chat-room";
      activeSessionId.value = existingSession.id;
      searchKeyword.value = "";
      appliedSearchKeyword.value = "";
      startChatModalOpen.value = false;
      showTopToast(`已打开与 ${effectiveContacts[0].name} 的聊天`);
      return;
    }
  }

  const { session, initialMessage } = buildStartChatSession(effectiveContacts);

  allSessions.value = [session, ...allSessions.value];
  messageMap.value = {
    ...messageMap.value,
    [session.id]: [initialMessage]
  };

  activeQueueKey.value = "chat-room";
  activeSessionId.value = session.id;
  searchKeyword.value = "";
  appliedSearchKeyword.value = "";
  startChatModalOpen.value = false;
  showTopToast(effectiveContacts.length > 1 ? "群聊已创建" : "聊天已创建");
};

const handleRequestTransfer = (id: string) => {
  const nextOwner = agentPool.find((agent) => agent.id === id);
  if (!nextOwner) return;
  pendingTransferAgentId.value = nextOwner.id;
  transferModalOpen.value = false;
  confirmTransferModalOpen.value = true;
};

const handleCloseConfirmTransfer = () => {
  confirmTransferModalOpen.value = false;
  pendingTransferAgentId.value = null;
};

const handleConfirmTransfer = () => {
  const session = activeSession.value;
  const pendingId = pendingTransferAgentId.value;
  if (!session) return;
  if (!pendingId) return;
  track(TrackEvent.TRANSFER_SESSION);
  const newOwner = agentPool.find((a) => a.id === pendingId);
  if (!newOwner) return;

  const now = new Date();
  const time = now.toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit", hour12: false });
  const sysMsg: MessageItem = {
    id: `m-${session.id}-transfer-${now.getTime()}`,
    role: "system",
    sender: "系统",
    content: `${currentAgentName}已将会话转移给${newOwner.name}`,
    time
  };
  messageMap.value = {
    ...messageMap.value,
    [session.id]: [...(messageMap.value[session.id] ?? []), sysMsg]
  };

  allSessions.value = allSessions.value.filter((s) => s.id !== session.id);
  transferModalOpen.value = false;
  confirmTransferModalOpen.value = false;
  pendingTransferAgentId.value = null;
  sendPushNotification(session.customerName, `${currentAgentName}已将会话转移给你`);
  showTopToast("转移会话成功");
};

const handleConfirmInvite = (ids: string[]) => {
  const session = activeSession.value;
  if (!session || ids.length === 0) return;
  track(TrackEvent.ADD_AGENT);

  const invitees = ids.map((id) => agentPool.find((a) => a.id === id)).filter((a): a is AgentEntry => !!a);
  if (invitees.length === 0) return;

  allSessions.value = allSessions.value.map((s) => {
    if (s.id !== session.id) return s;
    return { ...s, assistants: [...s.assistants, ...invitees.map((i) => i.name)] };
  });

  const now = new Date();
  const time = now.toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit", hour12: false });
  const names = invitees.map((i) => i.name).join(",");
  const sysMsg: MessageItem = {
    id: `m-${session.id}-invite-${now.getTime()}`,
    role: "system",
    sender: "系统",
    content: `${currentAgentName}邀请${names}加入会话`,
    time
  };
  messageMap.value = {
    ...messageMap.value,
    [session.id]: [...(messageMap.value[session.id] ?? []), sysMsg]
  };

  inviteModalOpen.value = false;
  sendPushNotification(session.customerName, `${currentAgentName}邀请你加入会话`);
  showTopToast("邀请成功");
};

const handleOpenTakeoverAiSession = () => {
  if (!activeSession.value) return;
  confirmTakeoverModalOpen.value = true;
};

const handleCloseTakeoverAiSession = () => {
  confirmTakeoverModalOpen.value = false;
};

const handleConfirmTakeoverAiSession = () => {
  const session = activeSession.value;
  if (!session) return;
  track(TrackEvent.TAKEOVER_AI);

  const now = new Date();
  const time = now.toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit", hour12: false });
  const sysMsg: MessageItem = {
    id: `m-${session.id}-takeover-${now.getTime()}`,
    role: "system",
    sender: "系统",
    content: `${aiAgentProfile.value.name}已将会话转移给${currentAgentName}`,
    time
  };
  messageMap.value = {
    ...messageMap.value,
    [session.id]: [...(messageMap.value[session.id] ?? []), sysMsg]
  };

  allSessions.value = allSessions.value.map((s) => {
    if (s.id !== session.id) return s;
    return { ...s, queueKey: "pending-reply", assignee: currentAgentName };
  });

  confirmTakeoverModalOpen.value = false;
  if (activeQueueKey.value !== "all-online") activeQueueKey.value = "pending-reply";
  showTopToast("接管成功");
};

const handleOpenAiAssign = () => {
  if (!activeSession.value) return;
  aiAssignKeyword.value = "";
  aiAssignModalOpen.value = true;
};

const handleAiAssignConfirm = (agentId: string) => {
  const session = activeSession.value;
  const agent = agentPool.find((a) => a.id === agentId);
  if (!session || !agent) return;

  allSessions.value = allSessions.value.filter((s) => s.id !== session.id);
  aiAssignModalOpen.value = false;

  const aiSessions = allSessions.value.filter((s) => s.queueKey === "ai-agent-queue");
  if (aiSessions.length > 0) {
    activeSessionId.value = aiSessions[0].id;
  } else if (activeQueueKey.value !== "all-online") {
    activeQueueKey.value = "pending-reply";
  }

  showTopToast("会话分配成功");
};

const handleClaimQueueSession = () => {
  confirmClaimModalOpen.value = true;
};

const handleCloseClaimModal = () => {
  confirmClaimModalOpen.value = false;
};

const handleConfirmClaimSession = () => {
  const session = activeSession.value;
  if (!session) return;

  allSessions.value = allSessions.value.map((s) => {
    if (s.id !== session.id) return s;
    return { ...s, claimed: true, assignee: currentAgentName };
  });

  confirmClaimModalOpen.value = false;
  showTopToast("领取会话成功");
};

const handleOpenQueueAssign = () => {
  if (!activeSession.value) return;
  queueAssignKeyword.value = "";
  queueAssignModalOpen.value = true;
};

const handleQueueAssignConfirm = (agentId: string) => {
  const session = activeSession.value;
  const agent = agentPool.find((a) => a.id === agentId);
  if (!session || !agent) return;

  allSessions.value = allSessions.value.filter((s) => s.id !== session.id);
  queueAssignModalOpen.value = false;

  const queueSessions = allSessions.value.filter((s) => s.queueKey === "queueing");
  if (queueSessions.length > 0) {
    activeSessionId.value = queueSessions[0].id;
  } else if (activeQueueKey.value !== "all-online") {
    activeQueueKey.value = "pending-reply";
  }

  showTopToast("会话分配成功");
};

const handleSend = (isNote: boolean = false, attachments: { name: string; size: number; objectUrl: string }[] = []) => {
  const text = composerText.value.trim();
  if (!text && attachments.length === 0) return;
  if (!activeSession.value) return;
  track(TrackEvent.SEND_MESSAGE);

  const now = new Date();
  const time = now.toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit", hour12: false });

  // 构建附件 HTML
  let content = text;
  let contentType: 'text' | 'html' = 'text';
  if (attachments.length > 0) {
    const attHtml = attachments.map(a => {
      const ext = (a.name.split('.').pop() || '').toUpperCase();
      const isImage = /\.(png|jpg|jpeg|gif|webp|svg)$/i.test(a.name);
      if (isImage) return `<img src="${a.objectUrl}" alt="${a.name}" style="max-width:100%;border-radius:8px;" />`;
      return `<div style="display:inline-flex;align-items:center;gap:8px;padding:8px 12px;background:#f5f7fa;border:1px solid #e5e6eb;border-radius:8px;font-size:13px;">📎 ${a.name}</div>`;
    }).join('');
    content = text ? `<p>${text}</p>${attHtml}` : attHtml;
    contentType = 'html';
  }

  const nextMessage: MessageItem = {
    id: `m-${activeSession.value.id}-${now.getTime()}`,
    role: "agent",
    sender: "客服主管",
    content,
    time,
    contentType,
    ...(isNote ? { isNote: true } : {})
  };

  const history = messageMap.value[activeSession.value.id] ?? [];
  messageMap.value = { ...messageMap.value, [activeSession.value.id]: [...history, nextMessage] };
  composerText.value = "";
};

const handleSendEmail = () => {
  const composer = emailComposerRef.value;
  const hasSendableContent = composer?.hasSendableContent?.() ?? false;
  const html = emailComposerBody.value.trim();
  if (!activeSession.value || !hasSendableContent || !html) return false;
  track(TrackEvent.SEND_MESSAGE);

  const now = new Date();
  const time = now.toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit", hour12: false });

  // 拼接附件 HTML 到邮件末尾
  const attachments = emailComposerRef.value?.getAttachments?.() ?? [];
  const fileEmojiMap: Record<string, string> = { pdf: '\u{1F4C4}', doc: '\u{1F4DD}', docx: '\u{1F4DD}', xls: '\u{1F4CA}', xlsx: '\u{1F4CA}', csv: '\u{1F4CA}', zip: '\u{1F4E6}', rar: '\u{1F4E6}', '7z': '\u{1F4E6}' };
  const fmtSize = (b: number) => b < 1024 ? b + ' B' : b < 1024 * 1024 ? (b / 1024).toFixed(1) + ' KB' : (b / (1024 * 1024)).toFixed(1) + ' MB';
  let contentHtml = html;
  if (attachments.length > 0) {
    const attHtmlParts = attachments.map(att => {
      const ext = att.name.split('.').pop()?.toLowerCase() || '';
      const emoji = fileEmojiMap[ext] || '\u{1F4CE}';
      return `<div style="padding:var(--agent-space-8) 0;font-size:var(--agent-font-size-sm);">${emoji} ${att.name} <span style="color:var(--agent-color-text-tertiary);margin-left:var(--agent-space-4);">${fmtSize(att.size)}</span></div>`;
    });
    contentHtml += attHtmlParts.join('');
  }

  const nextMessage: MessageItem = {
    id: `m-${activeSession.value.id}-${now.getTime()}`,
    role: "agent",
    sender: "客服主管",
    content: contentHtml,
    time,
    contentType: "html",
    subject: emailComposerSubject.value ? `Re: ${emailComposerSubject.value}` : "",
    fromEmail: selectedFromEmail.value,
    toEmail: activeSession.value.email,
    sendStatus: "sending"
  };

  const history = messageMap.value[activeSession.value.id] ?? [];
  messageMap.value = {
    ...messageMap.value,
    [activeSession.value.id]: [...history, nextMessage]
  };

  // 模拟发送完成
  const msgId = nextMessage.id;
  const sessionId = activeSession.value.id;
  setTimeout(() => {
    const msgs = messageMap.value[sessionId];
    if (msgs) {
      messageMap.value = {
        ...messageMap.value,
        [sessionId]: msgs.map(m => m.id === msgId ? { ...m, sendStatus: "sent" as const } : m)
      };
    }
  }, 1500);

  emailComposerBody.value = "";
  emailComposerRef.value?.clearAttachments?.();
  return true;
};

const handleSendEmailAndPending = () => {
  if (!handleSendEmail()) return;
  markSessionAsPending();
  showTopToast("已发送并标记为待处理");
};

const handleSendEmailAndClose = () => {
  if (!handleSendEmail()) return;
  handleOpenCloseEmailSession();
};

const markSessionAsPending = () => {
  if (!activeSession.value || activeSession.value.queueKey === "processing") return;
  allSessions.value = allSessions.value.map((s) => {
    if (s.id !== activeSession.value!.id) return s;
    return { ...s, queueKey: "processing" };
  });
  if (activeQueueKey.value !== "all-online") activeQueueKey.value = "processing";
};

const removeSessionFromPending = () => {
  if (!activeSession.value || activeSession.value.queueKey !== "processing") return;
  allSessions.value = allSessions.value.map((s) => {
    if (s.id !== activeSession.value!.id) return s;
    return { ...s, queueKey: "pending-reply" };
  });
  if (activeQueueKey.value !== "all-online") activeQueueKey.value = "pending-reply";
};

const handleMarkPending = () => {
  markSessionAsPending();
  showTopToast("已标记为待处理");
};

const handleRemovePending = () => {
  removeSessionFromPending();
  showTopToast("已取消待处理");
};

const handleOpenCloseEmailSession = () => {
  closeEmailSessionModalOpen.value = true;
};

const handleConfirmCloseEmailSession = () => {
  if (!activeSession.value) return;
  activeSession.value.closed = true;
  closeEmailSessionModalOpen.value = false;
  showTopToast("会话已结束");
};

const handleReopenEmailSession = () => {
  if (!activeSession.value) return;
  activeSession.value.closed = false;
  showTopToast("会话已重新开启");
};

const handleReopenTelegramSession = () => {
  if (!activeSession.value) return;
  activeSession.value.closed = false;
  showTopToast("Telegram 会话已重新开启");
};

const handleRevokeMessage = (messageId: string) => {
  if (!activeSessionId.value) return;

  const messages = messageMap.value[activeSessionId.value];
  if (!messages) return;

  const messageIndex = messages.findIndex(m => m.id === messageId);
  if (messageIndex === -1) return;

  const message = messages[messageIndex];

  // 只允许撤回客服发送的消息
  if (message.role !== 'agent') {
    showTopToast('只能撤回自己发送的消息');
    return;
  }

  // 模拟撤回：将消息标记为已撤回
  messages[messageIndex] = {
    ...message,
    content: '消息已撤回',
    contentType: 'text',
    revoked: true
  };

  // 如果是 Telegram 渠道，提示会调用 Telegram API 删除消息
  if (activeSession.value?.channelType === 'telegram') {
    showTopToast('消息已撤回（Telegram 中已删除）');
  } else {
    showTopToast('消息已撤回');
  }
};

const handleOpenCloseSession = () => {
  closeSessionModalOpen.value = true;
};

const handleConfirmCloseSession = () => {
  if (!activeSession.value) return;
  track(TrackEvent.CLOSE_SESSION);
  allSessions.value = allSessions.value.map((s) => {
    if (s.id !== activeSession.value!.id) return s;
    return { ...s, closed: true };
  });
  closeSessionModalOpen.value = false;
  showTopToast("会话结束成功");
};


const removeProactiveCampaignRouteGuard = router.beforeEach((to, from) => {
  if (allowProactiveCampaignRouteLeaveOnce.value) {
    allowProactiveCampaignRouteLeaveOnce.value = false;
    return true;
  }
  if (to.fullPath === from.fullPath) {
    return true;
  }
  if (from.name !== "campaign" || activeCampaignNavKey.value !== "campaign-proactive" || !proactiveCampaignDirty.value) {
    return true;
  }
  requestProactiveCampaignNavigation(() => {
    allowProactiveCampaignRouteLeaveOnce.value = true;
    router.push(to.fullPath);
  });
  return false;
});

watch(
  visibleSessions,
  (list) => {
    if (list.length === 0) {
      return;
    }

    // 会话仍在队列中（只是被搜索过滤掉了），不切换右侧面板
    const stillInQueue = queueSessionList.value.some((item) => item.id === activeSessionId.value);
    if (stillInQueue) return;

    // 会话真正消失（转接/关闭等），自动切换到第一个可见会话
    const stillExists = list.some((item) => item.id === activeSessionId.value);
    if (!stillExists) {
      activeSessionId.value = list[0].id;
    }
  },
  { immediate: true }
);

watch(
  () => route.name,
  (name) => {
    if (typeof name === "string") {
      syncRouteScopedState(name);
    }
  },
  { immediate: true }
);

watch(
  validSettingsNavKeys,
  () => {
    if (isSettingsRoute.value) {
      syncRouteScopedState("settings");
    }
  },
  { immediate: true }
);

onBeforeUnmount(() => {
  removeProactiveCampaignRouteGuard();
  if (toastTimer) {
    window.clearTimeout(toastTimer);
  }
  if (profileHoverTimer) {
    clearTimeout(profileHoverTimer);
  }
  if (planHoverTimer) {
    clearTimeout(planHoverTimer);
  }
  if (permHoverTimer) {
    clearTimeout(permHoverTimer);
  }
  if (projectHoverTimer) {
    clearTimeout(projectHoverTimer);
  }
});
</script>

<style scoped>
:deep(.agent-shell__main) {
  padding-left: 0;
}

.brand-mark {
  align-items: center;
  background: var(--agent-color-brand-primary);
  border: 0;
  border-radius: var(--agent-radius-md);
  color: var(--agent-color-bg-panel);
  cursor: pointer;
  display: inline-flex;
  flex-shrink: 0;
  font-size: var(--agent-font-size-xs);
  font-weight: var(--agent-font-weight-semibold);
  height: var(--agent-space-24);
  justify-content: center;
  width: var(--agent-space-24);
}

.brand-expanded-wrap {
  position: relative;
  width: 100%;
}

.brand-expanded {
  align-items: center;
  cursor: pointer;
  display: flex;
  gap: var(--nav-rail-expanded-label-gap, var(--agent-space-8));
  min-height: var(--nav-rail-item-size, 30px);
  padding: 0 var(--agent-space-8) 0 var(--nav-rail-expanded-icon-offset, var(--agent-space-4));
  width: 100%;
  border-radius: var(--agent-radius-md);
  transition: background var(--agent-motion-fast);
}

.brand-expanded__glyph {
  align-items: center;
  display: inline-flex;
  flex: 0 0 var(--nav-rail-item-size, 30px);
  height: var(--nav-rail-item-size, 30px);
  justify-content: center;
  width: var(--nav-rail-item-size, 30px);
}

.brand-expanded:hover {
  background: var(--agent-color-bg-muted);
}

.brand-expanded__name {
  color: var(--agent-color-text-primary);
  font-size: var(--agent-font-size-sm);
  font-weight: var(--agent-font-weight-semibold);
  white-space: nowrap;
}

.brand-expanded__arrow {
  color: var(--agent-color-text-secondary);
  margin-left: auto;
}

.project-switcher-panel {
  position: absolute;
  top: 100%;
  left: 0;
  width: 320px;
  background: #fff;
  border: 1px solid var(--agent-color-border-default);
  border-radius: var(--agent-radius-lg);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  margin-top: var(--agent-space-8);
  padding: var(--agent-space-12);
  z-index: 100;
}

.project-switcher-panel__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--agent-space-12);
}

.project-switcher-panel__title {
  font-size: var(--agent-font-size-base);
  font-weight: var(--agent-font-weight-semibold);
  color: var(--agent-color-text-primary);
  margin: 0;
}

.project-switcher-panel__manage-btn {
  background: transparent;
  border: 0;
  color: var(--agent-color-text-secondary);
  cursor: pointer;
  font-size: var(--agent-font-size-sm);
  padding: 0;
}

.project-switcher-panel__manage-btn:hover {
  color: var(--agent-color-text-primary);
}

.project-switcher-panel__list {
  display: flex;
  flex-direction: column;
  gap: var(--agent-space-4);
  margin-bottom: var(--agent-space-12);
}

.project-item {
  display: flex;
  align-items: center;
  gap: var(--agent-space-12);
  padding: var(--agent-space-8);
  background: transparent;
  border: 0;
  border-radius: var(--agent-radius-md);
  cursor: pointer;
  width: 100%;
  text-align: left;
  transition: background var(--agent-motion-fast);
}

.project-item:hover {
  background: var(--agent-color-bg-muted);
}

.project-item--active {
  background: var(--agent-color-bg-muted);
}

.project-item__avatar {
  width: 32px;
  height: 32px;
  border-radius: var(--agent-radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: var(--agent-font-size-sm);
  font-weight: var(--agent-font-weight-semibold);
  flex-shrink: 0;
}

.project-item__name {
  display: block;
  font-size: var(--agent-font-size-sm);
  font-weight: var(--agent-font-weight-medium);
  color: var(--agent-color-text-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.project-item__meta {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.project-item__role {
  color: var(--agent-color-text-secondary);
  display: block;
  font-size: var(--agent-font-size-xs);
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.project-item__check {
  color: var(--agent-color-brand-primary);
  flex-shrink: 0;
}

.project-item__check-badge {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--agent-color-brand-primary);
  flex-shrink: 0;
  position: relative;
}

.project-item__check-badge::after {
  content: '';
  position: absolute;
  left: 5px;
  top: 3px;
  width: 4px;
  height: 7px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.project-switcher-panel__add-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--agent-space-8);
  width: 100%;
  padding: var(--agent-space-8);
  background: transparent;
  border: 1px dashed var(--agent-color-border-default);
  border-radius: var(--agent-radius-md);
  color: var(--agent-color-text-secondary);
  cursor: pointer;
  font-size: var(--agent-font-size-sm);
  transition: all var(--agent-motion-fast);
}

.project-switcher-panel__add-btn:hover {
  border-color: var(--agent-color-brand-primary);
  color: var(--agent-color-brand-primary);
}

.project-manage-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--agent-space-8);
  border-radius: var(--agent-radius-md);
}

.project-manage-item__info {
  display: flex;
  align-items: center;
  gap: var(--agent-space-12);
  flex: 1;
  min-width: 0;
}

.project-manage-item__exit-btn {
  background: transparent;
  border: 0;
  color: var(--agent-color-status-error);
  cursor: pointer;
  font-size: var(--agent-font-size-sm);
  padding: var(--agent-space-4) var(--agent-space-8);
  border-radius: var(--agent-radius-sm);
  transition: background var(--agent-motion-fast);
}

.project-manage-item__exit-btn:hover {
  background: rgba(239, 68, 68, 0.1);
}

.rail-footer {
  align-items: center;
  display: flex;
  flex-direction: column;
  gap: var(--agent-space-8);
}

.rail-footer--expanded {
  align-items: stretch;
  gap: var(--agent-space-8);
}

.rail-footer__icon {
  align-items: center;
  background: transparent;
  border: 0;
  border-radius: var(--agent-radius-md);
  color: var(--agent-color-text-secondary);
  cursor: pointer;
  display: inline-flex;
  height: var(--nav-rail-item-size, 30px);
  justify-content: center;
  width: var(--nav-rail-item-size, 30px);
}

.rail-footer__glyph {
  align-items: center;
  display: inline-flex;
  flex-shrink: 0;
  height: var(--nav-rail-item-size, 30px);
  justify-content: center;
  width: var(--nav-rail-item-size, 30px);
}

.rail-footer--expanded .rail-footer__icon {
  gap: var(--nav-rail-expanded-label-gap, var(--agent-space-8));
  height: var(--nav-rail-item-size, 30px);
  justify-content: flex-start;
  padding: 0 var(--agent-space-8) 0 var(--nav-rail-expanded-icon-offset, var(--agent-space-4));
  width: 100%;
}

.rail-footer--expanded .rail-footer__glyph {
  flex: 0 0 var(--nav-rail-item-size, 30px);
  height: var(--nav-rail-item-size, 30px);
  width: var(--nav-rail-item-size, 30px);
}

.rail-footer__icon:hover {
  background: var(--agent-color-bg-muted);
}

.rail-footer__icon--active {
  background: var(--agent-color-brand-soft);
  color: var(--agent-color-brand-primary);
}

.rail-footer__icon--active .rail-footer__label {
  color: var(--agent-color-brand-primary);
}

.rail-footer__label {
  color: var(--agent-color-text-secondary);
  font-size: 13px;
  font-weight: 500;
  white-space: nowrap;
}

.profile-card-wrap {
  position: relative;
}

.profile-card-wrap--expanded {
  width: 100%;
}

.rail-footer__profile {
  align-items: center;
  background: transparent;
  border: 0;
  border-radius: var(--agent-radius-md);
  color: var(--agent-color-text-secondary);
  cursor: pointer;
  display: inline-flex;
  height: var(--nav-rail-item-size, 30px);
  justify-content: center;
  padding: 0;
  position: relative;
  width: var(--nav-rail-item-size, 30px);
}

.rail-footer--expanded .rail-footer__profile {
  gap: var(--nav-rail-expanded-label-gap, var(--agent-space-8));
  height: var(--nav-rail-item-size, 30px);
  justify-content: flex-start;
  padding: 0 var(--agent-space-8) 0 var(--nav-rail-expanded-icon-offset, var(--agent-space-4));
  width: 100%;
}

.rail-footer__glyph--avatar {
  position: relative;
}

.rail-footer__profile-avatar {
  background: radial-gradient(circle at 30% 25%, #f8dfb8 0%, #d4986f 48%, #8b6042 100%);
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  display: block;
  height: var(--agent-space-24);
  width: var(--agent-space-24);
}

.rail-footer__glyph--avatar::after {
  background: var(--agent-color-status-success);
  border: 2px solid var(--agent-color-bg-panel);
  border-radius: 50%;
  bottom: -1px;
  content: "";
  height: 9px;
  position: absolute;
  right: -1px;
  width: 9px;
}

.rail-footer--expanded .rail-footer__profile-avatar {
  height: 22px;
  width: 22px;
}

.rail-footer--expanded .rail-footer__profile:hover {
  background: var(--agent-color-bg-muted);
}

.rail-footer--expanded .rail-footer__glyph--avatar::after {
  display: none;
}

.profile-card-panel {
  background: var(--agent-color-bg-panel);
  border: 1px solid var(--agent-color-border-default);
  border-radius: 24px;
  bottom: -10px;
  box-shadow: var(--agent-shadow-lg);
  left: calc(100% + 12px);
  padding: var(--agent-space-12);
  position: absolute;
  width: 260px;
  z-index: var(--agent-z-dropdown);
}

.profile-card-panel::before {
  bottom: 0;
  content: "";
  left: -12px;
  position: absolute;
  top: 0;
  width: 12px;
}

.profile-card-panel__header {
  padding-bottom: var(--agent-space-12);
}

.profile-card-panel__identity {
  align-items: center;
  display: flex;
  gap: var(--agent-space-12);
}

.profile-card-panel__avatar {
  align-items: center;
  background: linear-gradient(135deg, #ffb57d 0%, #c47550 100%);
  border-radius: 50%;
  color: #fff;
  display: inline-flex;
  flex-shrink: 0;
  font-size: var(--agent-font-size-md);
  font-weight: var(--agent-font-weight-semibold);
  height: 52px;
  justify-content: center;
  text-transform: uppercase;
  width: 52px;
}

.profile-card-panel__meta {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.profile-card-panel__name {
  color: var(--agent-color-text-primary);
  display: block;
  font-size: var(--agent-font-size-md);
  font-weight: var(--agent-font-weight-regular);
  line-height: 1.4;
}

.profile-card-panel__role {
  color: var(--agent-color-text-tertiary);
  display: block;
  font-size: var(--agent-font-size-md);
  font-weight: var(--agent-font-weight-regular);
  line-height: 1.4;
}

.profile-card-panel__section {
  border-top: 1px solid var(--agent-color-border-default);
  padding: var(--agent-space-12) 0 0;
}

.profile-card-panel__section + .profile-card-panel__section {
  margin-top: var(--agent-space-12);
}

.profile-card-panel__status {
  align-items: center;
  display: flex;
  justify-content: space-between;
}

.profile-card-panel__status-info {
  align-items: center;
  display: inline-flex;
  gap: 10px;
}

.profile-card-panel__status-dot {
  background: #55c667;
  border-radius: 50%;
  height: 10px;
  width: 10px;
}

.profile-card-panel__status-dot--offline {
  background: var(--agent-color-text-disabled);
}

.profile-card-panel__status-label {
  color: var(--agent-color-text-primary);
  font-size: var(--agent-font-size-md);
  font-weight: var(--agent-font-weight-regular);
  line-height: 1.4;
}

.profile-card-panel__switch {
  align-items: center;
  background: var(--agent-color-text-disabled);
  border: 0;
  border-radius: 999px;
  cursor: pointer;
  display: inline-flex;
  height: 32px;
  justify-content: flex-start;
  padding: 4px;
  transition: background var(--agent-motion-fast);
  width: 58px;
}

.profile-card-panel__switch--on {
  background: var(--agent-color-brand-primary);
}

.profile-card-panel__switch-thumb {
  background: var(--agent-color-bg-panel);
  border-radius: 50%;
  display: block;
  height: 24px;
  transform: translateX(0);
  transition: transform var(--agent-motion-fast);
  width: 24px;
}

.profile-card-panel__switch--on .profile-card-panel__switch-thumb {
  transform: translateX(26px);
}

.profile-card-panel__action {
  align-items: center;
  background: transparent;
  border: 0;
  border-radius: var(--agent-radius-md);
  color: var(--agent-color-text-primary);
  cursor: pointer;
  display: flex;
  font-size: var(--agent-font-size-sm);
  font-weight: var(--agent-font-weight-regular);
  justify-content: space-between;
  line-height: 1.4;
  padding: 6px 0;
  text-align: left;
  width: 100%;
}

.profile-card-panel__action:hover {
  color: var(--agent-color-brand-primary);
}

.profile-card-panel__action--with-arrow {
  color: var(--agent-color-text-primary);
}

.profile-card-panel__action-arrow {
  color: var(--agent-color-text-tertiary);
}

.profile-card-panel__action--danger {
  color: var(--agent-color-text-primary);
}

/* 版本切换器 */
.plan-switcher-wrap {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.plan-switcher-wrap--expanded {
  align-items: stretch;
  gap: 0;
}

.plan-switcher-trigger {
  color: #f5a623;
}

.plan-switcher__badge {
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.5px;
  line-height: 1;
  padding: 2px 4px;
  border-radius: 3px;
  text-align: center;
  pointer-events: none;
}

.plan-switcher__badge--pro {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: #fff;
}

.plan-switcher__badge--free {
  background: var(--agent-color-bg-muted);
  color: var(--agent-color-text-secondary);
}

.plan-switcher__badge--expired {
  background: #fff0f0;
  color: #e53e3e;
}

.plan-switcher-panel {
  background: var(--agent-color-bg-panel);
  border: 1px solid var(--agent-color-border-default);
  border-radius: var(--agent-radius-lg);
  box-shadow: var(--agent-shadow-lg);
  left: calc(100% + 8px);
  padding: 16px;
  position: absolute;
  bottom: -20px;
  width: 220px;
  z-index: var(--agent-z-dropdown);
}

.plan-switcher-panel::before {
  content: "";
  position: absolute;
  top: 0;
  left: -12px;
  bottom: 0;
  width: 12px;
}

.plan-switcher-panel__title {
  color: var(--agent-color-text-primary);
  font-size: 13px;
  font-weight: 600;
  margin: 0 0 4px;
}

.plan-switcher-panel__desc {
  color: #75869c;
  font-size: 11px;
  line-height: 1.4;
  margin: 0 0 12px;
}

.plan-switcher-panel__options {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.plan-switcher-option {
  align-items: center;
  background: var(--agent-color-bg-muted);
  border: 1.5px solid transparent;
  border-radius: var(--agent-radius-md);
  cursor: pointer;
  display: grid;
  gap: 0 8px;
  grid-template-columns: 40px 1fr;
  grid-template-rows: auto auto;
  padding: 8px 10px;
  text-align: left;
  transition: border-color 0.15s;
}

.plan-switcher-option:hover {
  border-color: var(--agent-color-brand-primary);
}

.plan-switcher-option--active {
  background: #eef3ff;
  border-color: var(--agent-color-brand-primary);
}

.plan-switcher-option__badge {
  border-radius: 4px;
  font-size: 10px;
  font-weight: 700;
  grid-row: 1 / 3;
  letter-spacing: 0.3px;
  line-height: 1;
  padding: 4px 6px;
  text-align: center;
}

.plan-switcher-option__badge--pro {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: #fff;
}

.plan-switcher-option__badge--free {
  background: #e8ecf1;
  color: #5a6a7e;
}

.plan-switcher-option__badge--expired {
  background: #fff0f0;
  color: #e53e3e;
}

.plan-switcher-option__label {
  color: var(--agent-color-text-primary);
  font-size: 13px;
  font-weight: 500;
  line-height: 1.3;
}

.plan-switcher-option__hint {
  color: #75869c;
  font-size: 11px;
  line-height: 1.3;
}

/* 权限切换器 */
.perm-switcher-wrap {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.perm-switcher-wrap--expanded {
  align-items: stretch;
  gap: 0;
}

.perm-switcher-trigger {
  color: #43a047;
}

.perm-switcher__badge {
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.3px;
  line-height: 1;
  padding: 2px 4px;
  border-radius: 3px;
  text-align: center;
  pointer-events: none;
  max-width: 36px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.perm-switcher__badge--admin {
  background: linear-gradient(135deg, #43a047, #2e7d32);
  color: #fff;
}

.perm-switcher__badge--agent {
  background: var(--agent-color-bg-muted);
  color: var(--agent-color-text-secondary);
}

.perm-switcher__badge--limited {
  background: #fff0f0;
  color: #e53e3e;
}

.perm-switcher-panel {
  background: var(--agent-color-bg-panel);
  border: 1px solid var(--agent-color-border-default);
  border-radius: var(--agent-radius-lg);
  box-shadow: var(--agent-shadow-lg);
  left: calc(100% + 8px);
  padding: 16px;
  position: absolute;
  bottom: -20px;
  width: 220px;
  z-index: var(--agent-z-dropdown);
}

.perm-switcher-panel::before {
  content: "";
  position: absolute;
  top: 0;
  left: -12px;
  bottom: 0;
  width: 12px;
}

.perm-switcher-panel__title {
  color: var(--agent-color-text-primary);
  font-size: 13px;
  font-weight: 600;
  margin: 0 0 4px;
}

.perm-switcher-panel__desc {
  color: #75869c;
  font-size: 11px;
  line-height: 1.4;
  margin: 0 0 12px;
}

.perm-switcher-panel__options {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.session-page {
  border-radius: var(--agent-radius-xl);
  display: grid;
  gap: 0;
  grid-template-columns: minmax(320px, var(--agent-layout-inbox-pane-width)) minmax(520px, 1fr) minmax(280px, var(--agent-layout-detail-pane-width));
  height: 100%;
  min-width: 0;
  overflow: hidden;
}

.inbox-pane {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-width: 0;
  overflow: hidden;
}

.inbox-pane__header {
  display: flex;
  flex-direction: column;
  gap: var(--agent-space-12);
  padding: var(--agent-space-16);
}

.inbox-pane__title-row {
  align-items: center;
  display: flex;
  gap: var(--agent-space-12);
}

.inbox-pane__back {
  align-items: center;
  background: var(--agent-color-bg-muted);
  border: 1px solid var(--agent-color-border-default);
  border-radius: 999px;
  color: var(--agent-color-text-secondary);
  cursor: pointer;
  display: inline-flex;
  font-size: var(--agent-font-size-xl);
  height: 28px;
  justify-content: center;
  line-height: 1;
  width: 28px;
}

.inbox-pane__title {
  color: #222222;
  font-size: 20px;
  font-weight: var(--agent-font-weight-semibold);
  line-height: 1.2;
  margin: 0;
}

.inbox-pane__search-row {
  display: block;
}

.inbox-pane__search-box {
  align-items: center;
  background: var(--agent-color-bg-muted);
  border: 1px solid var(--agent-color-border-default);
  border-radius: var(--agent-radius-md);
  display: flex;
  overflow: visible;
  position: relative;
}

.inbox-pane__search-box .agent-input {
  background: transparent;
  border: 0;
  flex: 1;
  min-width: 0;
  padding-right: 12px;
}

.inbox-pane__search-input {
  padding-right: 12px;
}

.inbox-pane__search-field-wrap {
  flex-shrink: 0;
  position: relative;
}

.inbox-pane__search-field-btn {
  align-items: center;
  background: transparent;
  border: 0;
  color: var(--agent-color-text-secondary);
  cursor: pointer;
  display: inline-flex;
  font-size: var(--agent-font-size-sm);
  gap: 4px;
  height: 36px;
  outline: none;
  padding: 0 10px;
  white-space: nowrap;
}

.inbox-pane__search-field-btn:hover {
  color: var(--agent-color-text-primary);
}

.inbox-pane__search-divider {
  background: var(--agent-color-border-default);
  flex-shrink: 0;
  height: 16px;
  width: 1px;
}

.inbox-pane__search-field-dropdown {
  background: #fff;
  border-radius: var(--agent-radius-lg);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.12);
  left: 0;
  min-width: 160px;
  padding: var(--agent-space-8) 0;
  position: absolute;
  top: calc(100% + 6px);
  z-index: var(--agent-z-dropdown);
}

.inbox-pane__search-field-option {
  align-items: center;
  background: transparent;
  border: 0;
  color: var(--agent-color-text-primary);
  cursor: pointer;
  display: flex;
  font-size: var(--agent-font-size-md);
  gap: var(--agent-space-8);
  justify-content: space-between;
  line-height: 1.4;
  padding: 10px var(--agent-space-16);
  text-align: left;
  transition: background-color var(--agent-motion-fast) ease;
  white-space: nowrap;
  width: 100%;
}

.inbox-pane__search-field-option:hover {
  background: var(--agent-color-bg-panel);
}

.inbox-pane__search-field-check {
  display: inline-flex;
  flex-shrink: 0;
}

.inbox-pane__filter-row {
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: var(--agent-space-8);
  justify-content: space-between;
}

.inbox-pane__row-actions {
  align-items: center;
  display: flex;
  gap: 2px;
}

.inbox-pane__chips {
  display: flex;
  flex-wrap: wrap;
  gap: var(--agent-space-8);
}

.filter-chip {
  background: var(--agent-color-bg-muted);
  border: 1px solid transparent;
  border-radius: 999px;
  color: var(--agent-color-text-secondary);
  cursor: pointer;
  font-size: var(--agent-font-size-sm);
  font-weight: var(--agent-font-weight-medium);
  line-height: 1;
  padding: 9px var(--agent-space-12);
}

.filter-chip--active {
  background: var(--agent-color-brand-soft);
  border-color: #bfd4ff;
  color: var(--agent-color-brand-primary);
}

.inbox-pane__filter-icon-btn {
  align-items: center;
  background: transparent;
  border: 0;
  color: var(--agent-color-text-secondary);
  cursor: pointer;
  display: inline-flex;
  height: 30px;
  justify-content: center;
  width: 30px;
}

.inbox-pane__sort-wrapper {
  position: relative;
}

.inbox-pane__sort-dropdown {
  background: #ffffff;
  border-radius: var(--agent-radius-lg);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  min-width: 100px;
  padding: var(--agent-space-8);
  position: absolute;
  right: 0;
  top: calc(100% + 4px);
  z-index: var(--agent-z-dropdown);
}

.inbox-pane__sort-option {
  background: transparent;
  border: 0;
  border-radius: var(--agent-radius-md);
  color: var(--agent-color-text-primary);
  cursor: pointer;
  display: block;
  font-size: var(--agent-font-size-md);
  padding: var(--agent-space-8) var(--agent-space-12);
  text-align: left;
  width: 100%;
}

.inbox-pane__sort-option:hover {
  background: var(--agent-color-bg-panel);
}

.inbox-pane__sort-option--selected {
  color: var(--agent-color-brand-primary);
}

.inbox-filter-panel {
  background: #ffffff;
  border-radius: var(--agent-radius-lg);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
  display: flex;
  flex-direction: column;
  gap: var(--agent-space-12);
  min-width: 220px;
  padding: var(--agent-space-12) var(--agent-space-16);
  position: absolute;
  right: 0;
  top: calc(100% + 4px);
  z-index: var(--agent-z-dropdown);
}

.inbox-pane__filter-btn-wrapper {
  position: relative;
}

.inbox-filter-panel__section {
  display: flex;
  flex-direction: column;
  gap: var(--agent-space-8);
}

.inbox-filter-panel__label {
  color: var(--agent-color-text-tertiary);
  font-size: 11px;
  font-weight: var(--agent-font-weight-medium);
}

.inbox-filter-panel__chips {
  display: flex;
  flex-wrap: wrap;
  gap: var(--agent-space-8);
}

.inbox-filter-panel__footer {
  display: flex;
  gap: var(--agent-space-8);
  justify-content: flex-end;
  padding-top: var(--agent-space-4);
}

.inbox-filter-panel__reset {
  font-size: 12px;
  padding: 4px 12px;
}

.inbox-filter-panel__confirm {
  font-size: 12px;
  padding: 4px 12px;
}

.inbox-filter-panel__select-wrapper {
  position: relative;
}

.inbox-filter-panel__select-trigger {
  align-items: center;
  background: var(--agent-color-bg-muted);
  border: 1px solid var(--agent-color-border-default);
  border-radius: var(--agent-radius-md);
  color: var(--agent-color-text-primary);
  cursor: pointer;
  display: flex;
  font-size: 12px;
  justify-content: space-between;
  padding: 5px 8px;
}

.inbox-filter-panel__select-trigger span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.inbox-filter-panel__select-dropdown {
  background: #ffffff;
  border-radius: var(--agent-radius-md);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  display: flex;
  flex-direction: column;
  left: 0;
  min-width: 100%;
  padding: var(--agent-space-4) 0;
  position: absolute;
  top: calc(100% + 4px);
  z-index: calc(var(--agent-z-dropdown) + 1);
}

.inbox-filter-panel__select-option {
  align-items: center;
  cursor: pointer;
  display: flex;
  font-size: 12px;
  gap: var(--agent-space-8);
  padding: 6px 12px;
}

.inbox-filter-panel__select-option:hover {
  background: var(--agent-color-bg-panel);
}

.inbox-pane__filter-icon-btn--active {
  color: var(--agent-color-brand-primary);
}

.inbox-pane__filter-badge {
  background: var(--agent-color-status-error);
  border-radius: 50%;
  height: 6px;
  position: absolute;
  right: 2px;
  top: 2px;
  width: 6px;
}

.inbox-filter-panel__select-clear {
  align-items: center;
  background: transparent;
  border: 0;
  color: var(--agent-color-text-tertiary);
  cursor: pointer;
  display: inline-flex;
  font-size: 14px;
  height: 16px;
  justify-content: center;
  line-height: 1;
  padding: 0;
  width: 16px;
}

.inbox-filter-panel__select-clear:hover {
  color: var(--agent-color-text-primary);
}

.inbox-pane__filter-icon-btn {
  position: relative;
}

.inbox-pane__list {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: var(--agent-space-8);
  min-height: 0;
  padding: var(--agent-space-12);
}

.inbox-pane__empty {
  color: var(--agent-color-text-tertiary);
  font-size: var(--agent-font-size-sm);
  margin: var(--agent-space-20) 0 0;
  text-align: center;
}

.chat-pane {
  border-left: 1px solid var(--agent-color-border-default);
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
  min-width: 0;
  overflow: hidden;
}

.chat-pane__header {
  border: 0;
  border-bottom: 1px solid var(--agent-color-border-default);
  border-radius: 0;
  box-shadow: none;
}

.chat-search-nav {
  display: flex;
  justify-content: flex-end;
  padding-bottom: var(--agent-space-4);
  position: sticky;
  top: 0;
  z-index: 1;
}

.chat-search-nav__pill {
  align-items: center;
  background: #fff;
  border: 1px solid var(--agent-color-border-default);
  border-radius: 999px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  display: inline-flex;
  gap: 2px;
  padding: 4px 6px;
}

.chat-search-nav__text {
  color: var(--agent-color-text-secondary);
  font-size: var(--agent-font-size-xs);
  line-height: 1;
  padding: 0 4px;
  white-space: nowrap;
}

.chat-search-nav__arrow {
  align-items: center;
  background: transparent;
  border: 0;
  border-radius: 50%;
  color: var(--agent-color-text-tertiary);
  cursor: pointer;
  display: inline-flex;
  height: 22px;
  justify-content: center;
  transition: background-color var(--agent-motion-fast) ease, color var(--agent-motion-fast) ease;
  width: 22px;
}

.chat-search-nav__arrow:hover {
  background: var(--agent-color-bg-muted);
  color: var(--agent-color-text-primary);
}

.chat-pane__stream {
  background: var(--agent-color-bg-page);
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: var(--agent-space-12);
  min-height: 0;
  padding: var(--agent-space-16);
}

.chat-pane__above-composer {
  background: var(--agent-color-bg-page);
  flex-shrink: 0;
  padding: 0 var(--agent-space-16);
}

.chat-pane__start-time {
  color: var(--agent-color-text-tertiary);
  font-size: var(--agent-font-size-xs);
  margin: 0;
  text-align: center;
}

.chat-pane__composer-wrap {
  background: var(--agent-color-bg-page);
  flex-shrink: 0;
  padding: 12px var(--agent-space-16) var(--agent-space-16);
}

.chat-pane__composer {
  flex-shrink: 0;
}

.ai-takeover-bar {
  align-items: center;
  background: #f0fdf4;
  border-top: 1px solid var(--agent-color-border-default);
  display: flex;
  gap: var(--agent-space-12);
  justify-content: center;
  padding: var(--agent-space-20) var(--agent-space-16);
}

.ai-takeover-bar__assign-btn {
  background: var(--agent-color-bg-panel);
  border-color: var(--agent-color-brand-primary);
  color: var(--agent-color-brand-primary);
}

.ai-takeover-bar__assign-btn:hover {
  background: var(--agent-color-brand-bg-hover);
}

.queue-claim-bar {
  align-items: center;
  background: var(--agent-color-bg-panel);
  border-top: 1px solid var(--agent-color-border-default);
  display: flex;
  gap: var(--agent-space-12);
  justify-content: center;
  padding: var(--agent-space-20) var(--agent-space-16);
}

.queue-claim-bar__assign-btn {
  background: var(--agent-color-bg-panel);
  border-color: var(--agent-color-brand-primary);
  color: var(--agent-color-brand-primary);
}

.queue-claim-bar__assign-btn:hover {
  background: var(--agent-color-brand-bg-hover);
}

.chat-pane__closed {
  align-items: center;
  border-top: 1px solid var(--agent-color-border-default);
  display: flex;
  justify-content: center;
  padding: var(--agent-space-24) var(--agent-space-16);
}

.chat-pane__closed-tag {
  border: 1px solid var(--agent-color-border-default);
  border-radius: 20px;
  color: var(--agent-color-text-primary);
  font-size: var(--agent-font-size-sm);
  padding: 6px 20px;
}

.chat-pane__reopen-btn {
  border-radius: 20px;
  font-size: var(--agent-font-size-sm);
  padding: 6px 20px;
}

.ai-takeover-bar__text {
  color: var(--agent-color-text-secondary);
  font-size: var(--agent-font-size-sm);
  font-weight: var(--agent-font-weight-medium);
}

.detail-pane {
  border-left: 1px solid var(--agent-color-border-default);
  display: flex;
  flex-direction: column;
  height: 100%;
  min-width: 0;
  overflow: hidden;
}

.detail-pane__topbar {
  align-items: center;
  border-bottom: 1px solid var(--agent-color-border-default);
  display: flex;
  justify-content: space-between;
  min-height: 56px;
  padding: 0 var(--agent-space-12);
}

.detail-pane__tabs {
  display: flex;
  gap: 2px;
}

.detail-pane__tab {
  background: transparent;
  border: 0;
  color: #222222;
  cursor: pointer;
  font-size: var(--agent-font-size-sm);
  font-weight: var(--agent-font-weight-semibold);
  height: 56px;
  padding: 0 10px;
  position: relative;
}

.detail-pane__tab--active {
  color: var(--agent-color-brand-primary);
}

.detail-pane__tab--active::after {
  background: var(--agent-color-brand-primary);
  border-radius: 2px;
  bottom: 0;
  content: "";
  height: 2px;
  left: 10px;
  position: absolute;
  right: 10px;
}

.detail-pane__dock-btn {
  background: transparent;
  border: 1px solid var(--agent-color-border-default);
  border-radius: var(--agent-radius-sm);
  cursor: pointer;
  height: 18px;
  position: relative;
  width: 18px;
}

.detail-pane__dock-btn::before {
  border: 1px solid var(--agent-color-text-secondary);
  content: "";
  height: 8px;
  left: 4px;
  position: absolute;
  top: 4px;
  width: 8px;
}

.detail-pane__content {
  flex: 1;
  min-height: 0;
  padding: 6px var(--agent-space-16) var(--agent-space-16);
}

.detail-section {
  padding: 6px 0;
}

.detail-section:last-child {
  border-bottom: 0;
}

.detail-section__header {
  align-items: center;
  background: transparent;
  border: 0;
  color: #222222;
  cursor: pointer;
  display: inline-flex;
  justify-content: space-between;
  line-height: 1.2;
  padding: 6px 0;
  width: 100%;
}

.detail-section__title {
  font-size: 14px;
  font-weight: var(--agent-font-weight-semibold);
}

.detail-section__body {
  padding: 4px 0 2px;
}

.detail-section__fields {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 0;
}

.detail-section__field {
  align-items: baseline;
  display: grid;
  gap: var(--agent-space-8);
  grid-template-columns: 84px 1fr;
}

.detail-section__field dt {
  color: #7e8999;
  font-size: var(--agent-font-size-sm);
}

.detail-section__field dd {
  color: #222222;
  font-size: 14px;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.detail-section__agents {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.detail-agent-row {
  align-items: center;
  display: flex;
  gap: var(--agent-space-8);
  padding: 4px 0;
}

.detail-agent-row__avatar {
  align-items: center;
  border-radius: 50%;
  color: #fff;
  display: inline-flex;
  flex-shrink: 0;
  font-size: 12px;
  font-weight: var(--agent-font-weight-semibold);
  height: 30px;
  justify-content: center;
  width: 30px;
}

.detail-agent-row__name {
  color: var(--agent-color-text-primary);
  flex: 1;
  font-size: var(--agent-font-size-sm);
  font-weight: var(--agent-font-weight-medium);
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.detail-agent-row__badge {
  border-radius: 4px;
  flex-shrink: 0;
  font-size: 11px;
  font-weight: var(--agent-font-weight-medium);
  padding: 2px 6px;
}

.detail-agent-row__badge--owner {
  background: var(--agent-color-brand-bg-hover);
  color: var(--agent-color-brand-primary);
}

.detail-agent-row__count {
  color: var(--agent-color-text-secondary);
  flex-shrink: 0;
  font-size: var(--agent-font-size-sm);
  font-variant-numeric: tabular-nums;
}

.detail-section__add-tag {
  align-items: center;
  background: #f2f4f8;
  border: 1px solid #e7ebf0;
  border-radius: 999px;
  color: #8d98a9;
  cursor: pointer;
  display: inline-flex;
  font-size: 16px;
  height: 28px;
  justify-content: center;
  width: 28px;
}

.detail-section__timeline {
  display: flex;
  flex-direction: column;
  gap: 10px;
  list-style: none;
  margin: 0;
  padding: 0;
}

.timeline-item {
  display: flex;
  gap: var(--agent-space-8);
}

.timeline-item__dot {
  background: #c6ccd8;
  border-radius: 50%;
  display: inline-block;
  flex-shrink: 0;
  height: 8px;
  margin-top: 6px;
  width: 8px;
}

.timeline-item__dot--active {
  background: #57c878;
}

.timeline-item__main {
  min-width: 0;
}

.timeline-item__title {
  color: #222222;
  display: flex;
  font-size: var(--agent-font-size-sm);
  gap: 6px;
  margin: 0;
}

.timeline-item__title a {
  color: var(--agent-color-brand-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.timeline-item__meta {
  color: #93a0b2;
  font-size: var(--agent-font-size-sm);
  margin: 2px 0 0;
}

.timeline-item--more {
  color: #222222;
  font-size: var(--agent-font-size-sm);
  padding-left: 16px;
}

.module-subnav {
  display: flex;
  flex-direction: column;
  gap: var(--agent-space-8);
  height: 100%;
  padding: var(--agent-space-24) var(--agent-space-16);
}

.module-subnav__title {
  color: var(--agent-color-text-primary);
  font-size: var(--agent-font-size-xl);
  font-weight: var(--agent-font-weight-semibold);
  margin: 0;
}

.module-subnav__hint {
  color: var(--agent-color-text-tertiary);
  font-size: var(--agent-font-size-sm);
  margin: 0;
}

.module-page {
  justify-content: center;
}

.module-placeholder {
  align-items: center;
  display: flex;
  justify-content: center;
  min-height: 220px;
}

.confirm-transfer-modal {
  display: flex;
  flex-direction: column;
  gap: var(--agent-space-8);
}

.confirm-transfer-modal__description {
  color: var(--agent-color-text-primary);
  font-size: var(--agent-font-size-sm);
  line-height: 1.6;
  margin: 0;
}

.confirm-transfer-modal__footer-actions {
  display: flex;
  gap: var(--agent-space-8);
}

.confirm-takeover-modal {
  display: flex;
  flex-direction: column;
  gap: var(--agent-space-8);
}

.confirm-takeover-modal__description {
  color: var(--agent-color-text-secondary);
  font-size: var(--agent-font-size-sm);
  line-height: 1.6;
  margin: 0;
}

.confirm-takeover-modal__footer-actions {
  display: flex;
  gap: var(--agent-space-8);
}

.confirm-close-modal {
  display: flex;
  flex-direction: column;
  gap: var(--agent-space-8);
}

.confirm-close-modal__description {
  color: #75869c;
  font-size: var(--agent-font-size-sm);
  line-height: 1.6;
  margin: 0;
}

.confirm-close-modal__footer-actions {
  display: flex;
  gap: var(--agent-space-8);
}

.confirm-close-modal__footer-actions .agent-btn--danger {
  background: var(--agent-color-status-error);
  border-color: var(--agent-color-status-error);
  color: #ffffff;
}

.settings-page {
  gap: var(--agent-space-16);
}

.settings-card {
  border-radius: var(--agent-radius-lg);
  display: flex;
  flex-direction: column;
  gap: var(--agent-space-12);
  padding: var(--agent-space-16);
}

.settings-card__title-row {
  align-items: center;
  display: flex;
  justify-content: space-between;
}

.settings-code {
  background: var(--agent-color-bg-muted);
  border: 1px solid var(--agent-color-border-default);
  border-radius: var(--agent-radius-md);
  color: var(--agent-color-text-primary);
  font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
  font-size: 12px;
  line-height: 1.5;
  margin: 0;
  overflow: auto;
  padding: var(--agent-space-12);
}

.settings-table {
  border-collapse: collapse;
  width: 100%;
}

.settings-table th,
.settings-table td {
  border-bottom: 1px solid var(--agent-color-border-default);
  font-size: var(--agent-font-size-sm);
  padding: 10px 0;
  text-align: left;
}

.settings-table th {
  color: var(--agent-color-text-tertiary);
  font-weight: var(--agent-font-weight-medium);
}

.team-status-pill {
  background: var(--agent-color-bg-muted);
  border-radius: 999px;
  color: var(--agent-color-text-secondary);
  font-size: 12px;
  padding: 4px 8px;
}

.team-status-pill--online {
  background: rgba(0, 181, 120, 0.12);
  color: var(--agent-color-status-success);
}

.quick-reply-editor {
  display: grid;
  gap: var(--agent-space-12);
  grid-template-columns: 1fr auto;
}

.quick-reply-list {
  display: flex;
  flex-direction: column;
  gap: var(--agent-space-8);
  list-style: none;
  margin: 0;
  padding: 0;
}

.quick-reply-item {
  align-items: center;
  background: var(--agent-color-bg-muted);
  border: 1px solid var(--agent-color-border-default);
  border-radius: var(--agent-radius-md);
  display: flex;
  gap: var(--agent-space-12);
  justify-content: space-between;
  padding: 10px var(--agent-space-12);
}

.quick-reply-item__text {
  background: transparent;
  border: 0;
  color: var(--agent-color-text-primary);
  cursor: pointer;
  font-size: var(--agent-font-size-sm);
  line-height: 1.4;
  padding: 0;
  text-align: left;
}

.quick-reply-item__remove {
  background: transparent;
  border: 0;
  color: var(--agent-color-status-error);
  cursor: pointer;
  font-size: var(--agent-font-size-sm);
  padding: 0;
}

@media (max-width: 1680px) {
  .session-page {
    grid-template-columns: minmax(300px, 340px) minmax(460px, 1fr) minmax(260px, 300px);
  }
}

@media (max-width: 1440px) {
  .session-page {
    grid-template-columns: minmax(280px, 320px) minmax(380px, 1fr) minmax(240px, 280px);
  }

  .inbox-pane__title {
    font-size: 20px;
  }
}

@media (max-width: 1280px) {
  .session-page {
    grid-template-columns: minmax(260px, 300px) minmax(340px, 1fr) minmax(220px, 260px);
  }

  .inbox-pane__title {
    font-size: 18px;
  }
}

@media (max-width: 1100px) {
  .session-page {
    grid-template-columns: minmax(228px, 260px) minmax(300px, 1fr) minmax(200px, 228px);
  }

  .detail-pane__content {
    padding-left: var(--agent-space-12);
    padding-right: var(--agent-space-12);
  }

  .detail-section__field {
    grid-template-columns: 72px 1fr;
  }

  .detail-pane__tab {
    padding: 0 8px;
  }
}

@media (max-width: 980px) {
  .session-page {
    grid-template-columns: minmax(210px, 236px) minmax(280px, 1fr) minmax(180px, 210px);
  }

  .inbox-pane__header,
  .chat-pane__stream {
    padding-left: var(--agent-space-12);
    padding-right: var(--agent-space-12);
  }

  .chat-pane__above-composer,
  .chat-pane__composer-wrap {
    padding-left: var(--agent-space-12);
    padding-right: var(--agent-space-12);
  }

  .detail-pane__topbar {
    padding: 0 var(--agent-space-8);
  }

  .detail-section__field {
    gap: var(--agent-space-6);
    grid-template-columns: 64px 1fr;
  }
}
</style>
