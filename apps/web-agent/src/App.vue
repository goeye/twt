<template>
  <AgentAppShell :show-detail="isConversationRoute" :hide-subnav="isHomeRoute">
    <template #nav-rail>
      <PrimaryNavRail :active-key="activeMainNav" :items="mainNavItems" @select="handleMainNavSelect">
        <template #brand="{ expanded }">
          <div v-if="expanded" class="brand-expanded">
            <button type="button" class="brand-mark" aria-label="TWT 品牌">T</button>
            <span class="brand-expanded__name">TWT Chat</span>
            <AgentIcon name="chevron-down" :size="14" class="brand-expanded__arrow" />
          </div>
          <button v-else type="button" class="brand-mark" aria-label="TWT 品牌">T</button>
        </template>
        <template #footer="{ expanded }">
          <div class="rail-footer" :class="{ 'rail-footer--expanded': expanded }">
            <div class="plan-switcher-wrap" :class="{ 'plan-switcher-wrap--expanded': expanded }" @mouseenter="expanded && openPlanSwitcherHover()" @mouseleave="expanded && closePlanSwitcherHover()">
              <button type="button" class="rail-footer__icon plan-switcher-trigger" aria-label="切换服务版本" @click.stop="!expanded && (planSwitcherOpen = !planSwitcherOpen)">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 1l2.35 4.76L16 6.53l-4 3.9.94 5.5L8 13.27l-4.94 2.66.94-5.5-4-3.9 5.65-.77L8 1z" fill="currentColor" />
                </svg>
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
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 1L3 4v4c0 3.5 2.1 6.4 5 7.5 2.9-1.1 5-4 5-7.5V4L8 1z" stroke="currentColor" stroke-width="1.5" fill="none" />
                </svg>
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
              <AgentIcon name="help" :size="16" />
              <span v-if="expanded" class="rail-footer__label">支持</span>
            </button>
            <button type="button" class="rail-footer__icon" aria-label="设置" @click="openSettingsPage">
              <AgentIcon name="settings" :size="16" />
              <span v-if="expanded" class="rail-footer__label">设置</span>
            </button>
            <button type="button" class="rail-footer__profile" aria-label="当前客服账号">
              <span v-if="expanded" class="rail-footer__label">个人资料</span>
            </button>
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

    <section v-if="isConversationRoute" :key="currentContentRenderKey" class="session-page">
      <aside class="inbox-pane agent-panel">
        <header class="inbox-pane__header">
          <div class="inbox-pane__title-row">
            <button type="button" class="inbox-pane__back" aria-label="返回">‹</button>
            <h1 class="inbox-pane__title">{{ activeQueueEmoji }} {{ activeQueueLabel }}</h1>
          </div>

          <div class="inbox-pane__search-row">
            <div class="inbox-pane__search-box">
              <input v-model="searchKeyword" class="agent-input inbox-pane__search-input" placeholder="搜索会话" />
              <button type="button" class="inbox-pane__search-icon-btn" aria-label="筛选">
                <AgentIcon name="filter" :size="14" />
              </button>
            </div>
          </div>

          <div class="inbox-pane__filter-row">
            <div class="inbox-pane__chips">
              <button type="button" class="filter-chip" :class="{ 'filter-chip--active': sessionFilterType === 'all' }" @click="sessionFilterType = 'all'">全部 {{ filterCounts.all }}</button>
              <template v-if="showSessionCategoryFilter">
                <button type="button" class="filter-chip" :class="{ 'filter-chip--active': sessionFilterType === 'visitor' }" @click="sessionFilterType = 'visitor'">访客 {{ filterCounts.visitor }}</button>
                <button type="button" class="filter-chip" :class="{ 'filter-chip--active': sessionFilterType === 'customer' }" @click="sessionFilterType = 'customer'">客户 {{ filterCounts.customer }}</button>
              </template>
            </div>
            <button type="button" class="inbox-pane__filter-icon-btn" aria-label="筛选">
              <AgentIcon name="filter" :size="14" />
            </button>
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
            :preview="item.preview"
            :unread-count="item.unreadCount"
            :updated-at="item.updatedAt"
            :show-online-status="item.channelType === 'web'"
            :online="item.visitorOnline ?? false"
            @click="activeSessionId = item.id"
          />
          <p v-if="visibleSessions.length === 0" class="inbox-pane__empty">暂无符合条件的会话</p>
        </div>
      </aside>

      <section class="chat-pane agent-panel">
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

        <div class="chat-pane__stream agent-scroll">
          <p class="chat-pane__start-time">开始时间 {{ activeSession?.startedAt ?? '--' }}</p>

          <MessageBubble
            v-for="message in activeMessages"
            :key="message.id"
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
            @reply="showTopToast('回复功能开发中')"
            @copy="showTopToast('已复制到剪贴板')"
            @translate="showTopToast('翻译功能开发中')"
            @revoke="showTopToast('撤回功能开发中')"
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

        <div v-else-if="isClosedSession" class="chat-pane__closed">
          <span class="chat-pane__closed-tag">会话已结束</span>
        </div>

        <EmailComposer
          v-else-if="activeSession?.channelType === 'email'"
          ref="emailComposerRef"
          v-model="emailComposerBody"
          class="chat-pane__composer"
          :to="activeSession?.email ?? ''"
          :from-options="activeSessionFromOptions"
          :selected-from="selectedFromEmail"
          :show-translate="canUse(FEATURES.WRITE_TRANSLATE) || canUse(FEATURES.CHAT_TRANSLATE)"
          :quick-reply-categories="quickReplyCategories"
          @update:selected-from="selectedFromEmail = $event"
          @attachment="track(TrackEvent.ATTACHMENT)"
          @emoji="track(TrackEvent.EMOJI); showTopToast('表情面板开发中')"
          @toast="showTopToast"
          @translate="track(TrackEvent.TRANSLATE); showTopToast('翻译功能开发中')"
          @send="handleSendEmail"
          @send-and-pending="handleSendEmailAndPending"
          @send-and-resolve="handleSendEmailAndClose"
          @quick-reply-settings="showTopToast('快捷回复设置开发中')"
          @copilot="showTopToast('Copilot推荐开发中')"
        />

        <MessageComposer
          v-else
          v-model="composerText"
          class="chat-pane__composer"
          :disabled="composerText.trim().length === 0"
          :show-polish="canUse(FEATURES.TEXT_POLISH)"
          :show-translate="canUse(FEATURES.WRITE_TRANSLATE) || canUse(FEATURES.CHAT_TRANSLATE)"
          :quick-reply-categories="quickReplyCategories"
          placeholder="发消息或输入 / 选择快捷回复"
          @attachment="track(TrackEvent.ATTACHMENT); showTopToast('附件功能开发中')"
          @emoji="track(TrackEvent.EMOJI); showTopToast('表情面板开发中')"
          @quick-reply-settings="showTopToast('快捷回复设置开发中')"
          @polish="track(TrackEvent.POLISH); showTopToast('润色功能开发中')"
          @translate="track(TrackEvent.TRANSLATE); showTopToast('翻译功能开发中')"
          @send="handleSend"
        />
      </section>
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
      <CampaignRoutePage v-show="activeCampaignNavKey === 'campaign-chatting'" :key="`${currentContentRenderKey}-chatting`" @toast="showTopToast" />
      <ProactiveCampaignRoutePage v-show="activeCampaignNavKey === 'campaign-proactive'" :key="`${currentContentRenderKey}-proactive`" ref="proactiveCampaignPageRef" @toast="showTopToast" @dirty-change="handleProactiveCampaignDirtyChange" />
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

    <template #detail-pane>
      <section v-if="isConversationRoute" :key="currentDetailRenderKey" class="detail-pane">
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
      </section>
    </template>

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
      title="确认分配"
      max-width="500px"
      :show-close="false"
      @close="handleCloseTakeoverAiSession"
    >
      <div class="confirm-takeover-modal">
        <p class="confirm-takeover-modal__description">确定把该会话分配给我吗？</p>
      </div>

      <template #footer>
        <span />
        <div class="confirm-takeover-modal__footer-actions">
          <button class="agent-btn agent-btn--ghost" type="button" @click="handleCloseTakeoverAiSession">取消</button>
          <button class="agent-btn agent-btn--primary" type="button" @click="handleConfirmTakeoverAiSession">确认</button>
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

    <AgentToast :message="toastMessage" :visible="showToast" />

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
  </AgentAppShell>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import ArchiveSubNav from "./components/ArchiveSubNav.vue";
import ArchiveAssignModal from "./components/archive/ArchiveAssignModal.vue";
import AiAgentRoutePage from "./views/AiAgentRoutePage.vue";
import CampaignRoutePage from "./views/CampaignRoutePage.vue";
import CustomerRoutePage from "./views/CustomerRoutePage.vue";
import FilesRoutePage from "./views/FilesRoutePage.vue";
import HomeRoutePage from "./views/HomeRoutePage.vue";
import ProactiveCampaignRoutePage from "./views/ProactiveCampaignRoutePage.vue";
import ReportRoutePage from "./views/ReportRoutePage.vue";
import SettingsRoutePage from "./views/SettingsRoutePage.vue";
import VisitorsRoutePage from "./views/VisitorsRoutePage.vue";
import WidgetCustomizePage from "./views/WidgetCustomizePage.vue";
import { loadStoredAiAgentSettings, resolveAiAgentProfile } from "./lib/aiAgentSettings";
import { track, TrackEvent } from "./lib/tracker";
import { usePlan } from "./composables/usePlan";
import { FEATURES } from "./lib/plan";
import { usePermission } from "./composables/usePermission";
import { useVersionCheck } from "./composables/useVersionCheck";
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

const permSwitcherOpen = ref(false);

// 权限变化时，如果当前页面已无权限，立即弹窗
watch(currentPermissions, () => {
  const routeName = typeof route.name === "string" ? route.name : "";
  if (!canAccessRoute(routeName)) {
    showPermissionChangedModal();
  }
});

const planSwitcherOpen = ref(false);
let planHoverTimer: ReturnType<typeof setTimeout> | null = null;
let permHoverTimer: ReturnType<typeof setTimeout> | null = null;

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
type SettingsNavKey = "install" | "website-code" | "customize" | "email" | "agents" | "roles" | "team" | "quick-reply" | "personal-reply" | "idle-conversation" | "visitor-tags" | "conversation-tags" | "blacklist" | "trusted-domains" | "dev-settings" | "webhooks";
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
  channelType?: "web" | "widget" | "email";
  remarkName?: string;
  visitorOnline?: boolean;
  fromEmail?: string;
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
  isGroupChat?: boolean;
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
        label: "在线会话",
        children: [
          { key: "website-code", label: "网站代码" },
          { key: "install", label: "聊天页面" },
          { key: "customize", label: "自定义" }
        ]
      },
      { key: "email", label: "Email" }
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
      { key: "doc-knowledge", label: "文档知识", leadingEmoji: "📖" },
      { key: "faq", label: "常见问题", leadingEmoji: "👩‍💻" }
    ]
  },
  {
    key: "ai-settings",
    title: "AI设置",
    items: [
      { key: "copilot-settings", label: "Copilot设置", leadingEmoji: "💡" },
      { key: "ai-agent-config", label: "AI Agent", leadingEmoji: "🤖" }
    ]
  }
];

const reportNavGroups = [
  {
    key: "report-group",
    title: "",
    items: [
      { key: "data-overview", label: "人工客服", leadingEmoji: "📈" },
      { key: "ai-agent-report", label: "AI Agent", leadingEmoji: "🤖" },
      { key: "evaluation-analysis", label: "会话评价分析", leadingEmoji: "😊" }
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
      { key: "resolved", label: "已回复", leadingEmoji: "↩️" }
    ]
  },
  {
    key: "online-chat",
    title: "在线聊天",
    items: [{ key: "chat-room", label: "聊天", leadingEmoji: "💬" }]
  },
  {
    key: "ai-agent",
    title: "AI Agent",
    items: [{ key: "ai-agent-queue", label: "AI Agent", leadingEmoji: "🤖" }]
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
    assistants: []
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
    channel: "官网入口",
    channelType: "web",
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
    channel: "帮助中心",
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
    }
  ],
  "s-6005": [
    {
      id: "m-501",
      role: "agent",
      sender: "陈悦",
      content: "退款申请已提交财务，预计 1-2 个工作日原路退回。",
      time: "昨天 18:30"
    }
  ],
  "s-6006": [
    {
      id: "m-601",
      role: "customer",
      sender: "Leo",
      content: "今天直播回放几点能看？",
      time: "06:54"
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
      content: "<p>Hi Wang,</p><p>Thanks for the detailed breakdown! The pricing looks reasonable. I have a few follow-up questions:</p><p>1. We noticed some UI differences in our current trial. Here is a screenshot of what we see:</p><img src=\"https://placehold.co/520x280/fff8f0/e85d1a?text=Trial+Dashboard+Screenshot\" alt=\"Trial Screenshot\" style=\"max-width:100%;border-radius:8px;margin:8px 0;border:1px solid #e0e6ed;\" /><p>2. Can you confirm the data migration support? We have about <strong>150,000 historical conversations</strong> to import.</p><p>I'm also attaching our company's security compliance checklist for your review.</p><div style=\"display:flex;align-items:center;gap:8px;padding:10px 14px;margin:10px 0;background:#f8f9fb;border:1px solid #e0e6ed;border-radius:8px;\"><span style=\"font-size:20px;\">📄</span><div><div style=\"font-size:13px;color:#222;font-weight:500;\">Acme_Security_Checklist_2026.pdf</div><div style=\"font-size:11px;color:#75869c;\">2.4 MB</div></div></div><p>Best,<br/>Michael</p>",
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
      content: "<p>Hi Michael,</p><p>Great questions! Let me address each one:</p><p><strong>1. UI Differences:</strong> The trial version uses our standard theme. With the Enterprise plan, you'll get full custom branding including your logo, color scheme, and custom domain (e.g., support.acme.com).</p><p><strong>2. Data Migration:</strong> Absolutely! 150K conversations is well within our migration capabilities. Our team will handle the full import with zero downtime. Typical timeline is 3-5 business days.</p><p><strong>3. Security Compliance:</strong> I've reviewed your checklist and prepared our compliance response document:</p><div style=\"display:flex;align-items:center;gap:8px;padding:10px 14px;margin:10px 0;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;\"><span style=\"font-size:20px;\">📋</span><div><div style=\"font-size:13px;color:#222;font-weight:500;\">TWT_SOC2_Compliance_Response.pdf</div><div style=\"font-size:11px;color:#75869c;\">1.8 MB</div></div></div><div style=\"display:flex;align-items:center;gap:8px;padding:10px 14px;margin:10px 0;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;\"><span style=\"font-size:20px;\">📄</span><div><div style=\"font-size:13px;color:#222;font-weight:500;\">Enterprise_Onboarding_Guide.pdf</div><div style=\"font-size:11px;color:#75869c;\">3.1 MB</div></div></div><p>I'd suggest we set up a 30-min call this week. How does Thursday 2pm PST work for you?</p><p>Best regards,<br/>Wang Ke</p>",
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
      content: "<p>Hi,</p><p>Thank you for the quick response! You were right - the SSL certificate had expired. We've renewed it and the webhooks are working again.</p><p>Here's a confirmation screenshot showing successful deliveries:</p><img src=\"https://placehold.co/540x200/f0fdf4/16a34a?text=Webhook+Deliveries+Resumed+-+200+OK\" alt=\"Webhooks working\" style=\"max-width:100%;border-radius:8px;margin:8px 0;border:1px solid #bbf7d0;\" /><p>Much appreciated! You can close this ticket.</p><p>Best,<br/>Sarah</p>",
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
  ]
});

const router = useRouter();
const route = useRoute();

const activeMainNav = ref("conversation");
const activeQueueKey = ref("pending-reply");
const activeSessionId = ref("s-6001");
const searchKeyword = ref("");
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
let toastTimer: number | undefined;

const transferModalOpen = ref(false);
const transferKeyword = ref("");
const confirmTransferModalOpen = ref(false);
const confirmTakeoverModalOpen = ref(false);
const pendingTransferAgentId = ref<string | null>(null);

const inviteModalOpen = ref(false);
const inviteKeyword = ref("");
const closeSessionModalOpen = ref(false);
const closeEmailSessionModalOpen = ref(false);
const aiAssignModalOpen = ref(false);
const aiAssignKeyword = ref("");
const queueAssignModalOpen = ref(false);
const queueAssignKeyword = ref("");

const hasCustomerIdentity = ref(true);
type SessionFilterType = "all" | "visitor" | "customer";
const sessionFilterType = ref<SessionFilterType>("all");

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

const queueSessionList = computed(() => displaySessions.value.filter((session) => session.queueKey === activeQueueKey.value));

watch(activeQueueKey, () => { sessionFilterType.value = "all"; });

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
  const keys = ["pending-reply", "queueing", "processing", "resolved", "ai-agent-queue"];
  return keys.includes(activeQueueKey.value);
});

const visibleSessions = computed(() => {
  const keyword = searchKeyword.value.trim().toLowerCase();
  return queueSessionList.value.filter((session) => {
    if (sessionFilterType.value === "visitor" && session.tag !== "访客") return false;
    if (sessionFilterType.value === "customer" && session.tag !== "客户" && session.tag !== "VIP") return false;
    return (
      keyword.length === 0 ||
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
    const lastWithSubject = [...messages].reverse().find(m => m.subject);
    return lastWithSubject?.subject ?? session.customerName ?? "邮件会话";
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
          { key: "session-accept", label: "接待时间", value: activeSession.value.acceptedAt }
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
  const channelLabel: Record<string, string> = { web: "Web", widget: "聊天插件", email: "Email" };

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
        ...(isEmailSession ? [] : [{ key: "visitor-entry", label: "起点页面", value: activeSession.value.entryPage }]),
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
  syncRouteScopedState(key, { forceDefault: true });
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

const handleQueueSelect = (key: string) => {
  activeQueueKey.value = resolveScopedKey(key, validQueueKeys, defaultQueueKey);
  searchKeyword.value = "";
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

onMounted(() => {
  refreshAiAgentProfile();
  if ("Notification" in window && Notification.permission === "default") {
    Notification.requestPermission();
  }
  document.addEventListener("click", closePlanSwitcher);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", closePlanSwitcher);
});

const closePlanSwitcher = () => { planSwitcherOpen.value = false; };

watch(
  () => route.fullPath,
  () => {
    refreshAiAgentProfile();
  }
);

const showTopToast = (message: string) => {
  toastMessage.value = message;
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
  activeQueueKey.value = "pending-reply";
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
  } else {
    activeQueueKey.value = "pending-reply";
  }

  showTopToast("会话分配成功");
};

const handleClaimQueueSession = () => {
  const session = activeSession.value;
  if (!session) return;

  allSessions.value = allSessions.value.map((s) => {
    if (s.id !== session.id) return s;
    return { ...s, claimed: true, assignee: currentAgentName };
  });

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
  } else {
    activeQueueKey.value = "pending-reply";
  }

  showTopToast("会话分配成功");
};

const handleSend = () => {
  const text = composerText.value.trim();
  if (!text || !activeSession.value) {
    return;
  }
  track(TrackEvent.SEND_MESSAGE);

  const now = new Date();
  const time = now.toLocaleTimeString("zh-CN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  });

  const nextMessage: MessageItem = {
    id: `m-${activeSession.value.id}-${now.getTime()}`,
    role: "agent",
    sender: "客服主管",
    content: text,
    time
  };

  const history = messageMap.value[activeSession.value.id] ?? [];
  messageMap.value = {
    ...messageMap.value,
    [activeSession.value.id]: [...history, nextMessage]
  };

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
      return `<div style="padding:6px 0;font-size:13px;">${emoji} ${att.name} <span style="color:#8c95a6;margin-left:4px;">${fmtSize(att.size)}</span></div>`;
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
    toEmail: activeSession.value.email
  };

  const history = messageMap.value[activeSession.value.id] ?? [];
  messageMap.value = {
    ...messageMap.value,
    [activeSession.value.id]: [...history, nextMessage]
  };

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
  activeQueueKey.value = "processing";
};

const removeSessionFromPending = () => {
  if (!activeSession.value || activeSession.value.queueKey !== "processing") return;
  allSessions.value = allSessions.value.map((s) => {
    if (s.id !== activeSession.value!.id) return s;
    return { ...s, queueKey: "pending-reply" };
  });
  activeQueueKey.value = "pending-reply";
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
  allSessions.value = allSessions.value.filter((s) => s.id !== activeSession.value!.id);
  closeEmailSessionModalOpen.value = false;
  showTopToast("会话已结束");
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
      if (name in navRoutePathMap) {
        activeMainNav.value = name;
      }
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
});
</script>

<style scoped>
:deep(.agent-shell__main) {
  padding-left: 0;
}

:deep(.agent-shell__detail) {
  padding-left: 0;
}

.brand-mark {
  align-items: center;
  background: linear-gradient(135deg, #2f6bff 0%, #00b5ff 100%);
  border: 0;
  border-radius: var(--agent-radius-md);
  color: #ffffff;
  cursor: pointer;
  display: inline-flex;
  flex-shrink: 0;
  font-size: 11px;
  font-weight: var(--agent-font-weight-semibold);
  height: 24px;
  justify-content: center;
  width: 24px;
}

.brand-expanded {
  align-items: center;
  display: flex;
  gap: 8px;
  padding: 0 4px;
  width: 100%;
}

.brand-expanded__name {
  color: var(--agent-color-text-primary);
  font-size: 14px;
  font-weight: var(--agent-font-weight-semibold);
  white-space: nowrap;
}

.brand-expanded__arrow {
  color: var(--agent-color-text-secondary);
  margin-left: auto;
}

.rail-footer {
  align-items: center;
  display: flex;
  flex-direction: column;
  gap: var(--agent-space-8);
}

.rail-footer--expanded {
  align-items: stretch;
  gap: 2px;
}

.rail-footer__icon {
  align-items: center;
  background: transparent;
  border: 0;
  border-radius: var(--agent-radius-md);
  color: var(--agent-color-text-secondary);
  cursor: pointer;
  display: inline-flex;
  height: 30px;
  justify-content: center;
  width: 30px;
}

.rail-footer--expanded .rail-footer__icon {
  gap: 10px;
  height: 36px;
  justify-content: flex-start;
  padding: 0 10px;
  width: 100%;
}

.rail-footer__icon:hover {
  background: var(--agent-color-bg-muted);
}

.rail-footer__label {
  color: var(--agent-color-text-secondary);
  font-size: 13px;
  font-weight: 500;
  white-space: nowrap;
}

.rail-footer__profile {
  background: radial-gradient(circle at 30% 25%, #f8dfb8 0%, #d4986f 48%, #8b6042 100%);
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  cursor: pointer;
  height: 30px;
  position: relative;
  width: 30px;
}

.rail-footer--expanded .rail-footer__profile {
  align-items: center;
  background: transparent;
  border: 0;
  border-radius: var(--agent-radius-md);
  display: flex;
  gap: 10px;
  height: 36px;
  padding: 0 10px;
  width: 100%;
}

.rail-footer--expanded .rail-footer__profile::before {
  background: radial-gradient(circle at 30% 25%, #f8dfb8 0%, #d4986f 48%, #8b6042 100%);
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  content: "";
  flex-shrink: 0;
  height: 22px;
  width: 22px;
}

.rail-footer--expanded .rail-footer__profile:hover {
  background: var(--agent-color-bg-muted);
}

.rail-footer__profile::after {
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

.rail-footer--expanded .rail-footer__profile::after {
  display: none;
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
  background: #fff;
  border: 1px solid var(--agent-color-border-default);
  border-radius: var(--agent-radius-lg);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
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
  background: #fff;
  border: 1px solid var(--agent-color-border-default);
  border-radius: var(--agent-radius-lg);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
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
  display: grid;
  gap: 0;
  grid-template-columns: var(--agent-layout-inbox-pane-width) minmax(580px, 1fr);
  height: 100%;
  min-width: 0;
}

.inbox-pane {
  border-radius: var(--agent-radius-xl) 0 0 var(--agent-radius-xl);
  border-right: 0;
  display: flex;
  flex-direction: column;
  height: 100%;
  min-width: 0;
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
  position: relative;
}

.inbox-pane__search-input {
  padding-right: 40px;
}

.inbox-pane__search-icon-btn {
  align-items: center;
  background: var(--agent-color-bg-muted);
  border: 1px solid var(--agent-color-border-default);
  border-radius: var(--agent-radius-sm);
  color: var(--agent-color-text-secondary);
  cursor: pointer;
  display: inline-flex;
  height: 24px;
  justify-content: center;
  position: absolute;
  right: 6px;
  top: 50%;
  transform: translateY(-50%);
  width: 24px;
}

.inbox-pane__filter-row {
  align-items: center;
  display: flex;
  justify-content: space-between;
}

.inbox-pane__chips {
  display: flex;
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
  background: var(--agent-color-bg-muted);
  border: 1px solid var(--agent-color-border-default);
  border-radius: var(--agent-radius-md);
  color: var(--agent-color-text-secondary);
  cursor: pointer;
  display: inline-flex;
  height: 30px;
  justify-content: center;
  width: 30px;
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
  border-radius: 0 var(--agent-radius-xl) var(--agent-radius-xl) 0;
  display: flex;
  flex-direction: column;
  min-height: 0;
  min-width: 0;
}

.chat-pane__header {
  border: 0;
  border-bottom: 1px solid var(--agent-color-border-default);
  border-radius: 0;
  box-shadow: none;
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

.chat-pane__start-time {
  color: var(--agent-color-text-tertiary);
  font-size: var(--agent-font-size-xs);
  margin: 0;
  text-align: center;
}

.chat-pane__composer {
  min-height: 196px;
  padding: 0 var(--agent-space-16) var(--agent-space-16);
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
  background: #ffffff;
  border-color: var(--agent-color-brand-primary);
  color: var(--agent-color-brand-primary);
}

.ai-takeover-bar__assign-btn:hover {
  background: rgba(47, 107, 255, 0.06);
}

.queue-claim-bar {
  align-items: center;
  background: #fff;
  border-top: 1px solid var(--agent-color-border-default);
  display: flex;
  gap: var(--agent-space-12);
  justify-content: center;
  padding: var(--agent-space-20) var(--agent-space-16);
}

.queue-claim-bar__assign-btn {
  background: #ffffff;
  border-color: var(--agent-color-brand-primary);
  color: var(--agent-color-brand-primary);
}

.queue-claim-bar__assign-btn:hover {
  background: rgba(47, 107, 255, 0.06);
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

.ai-takeover-bar__text {
  color: var(--agent-color-text-secondary);
  font-size: var(--agent-font-size-sm);
  font-weight: var(--agent-font-weight-medium);
}

.detail-pane {
  display: flex;
  flex-direction: column;
  height: 100%;
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
  background: rgba(47, 107, 255, 0.1);
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
    grid-template-columns: minmax(300px, var(--agent-layout-session-pane-width)) minmax(520px, 1fr);
  }

  .inbox-pane__title {
    font-size: 20px;
  }
}

@media (max-width: 1280px) {
  :deep(.agent-shell__detail) {
    display: none;
  }

  .session-page {
    grid-template-columns: minmax(280px, var(--agent-layout-session-pane-width)) minmax(360px, 1fr);
  }

  .inbox-pane__title {
    font-size: 28px;
  }
}

@media (max-width: 980px) {
  .session-page {
    grid-template-columns: 1fr;
  }

  .chat-pane {
    min-height: 62vh;
  }
}
</style>
