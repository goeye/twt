<template>
  <section class="files-page">
    <section v-if="activeKey === 'all-conversations'" class="files-page__card agent-panel">
      <header class="files-page__header">
        <h1 class="files-page__title">会话记录</h1>
        <label class="archive-admin-toggle">
          <input type="checkbox" v-model="isAdmin" class="archive-admin-toggle__checkbox" />
          <span class="archive-admin-toggle__label">管理员视角</span>
        </label>
      </header>

      <section class="files-page__summary summary-banner">
        <div class="summary-banner__stats">
          <article v-for="item in summaryStats" :key="item.key" class="summary-banner__item">
            <p class="summary-banner__value">{{ item.value }}</p>
            <p class="summary-banner__label">{{ item.label }}</p>
          </article>
        </div>

        <div class="summary-banner__visual" aria-hidden="true">
          <div class="summary-banner__ring summary-banner__ring--outer" />
          <div class="summary-banner__ring summary-banner__ring--inner" />
          <div class="summary-banner__planet" />
          <div class="summary-banner__bubble summary-banner__bubble--left" />
          <div class="summary-banner__bubble summary-banner__bubble--right" />
          <div class="summary-banner__spark summary-banner__spark--one" />
          <div class="summary-banner__spark summary-banner__spark--two" />
        </div>
      </section>

      <section class="files-page__filters archive-filters">
        <div class="archive-filters__row archive-filters__row--primary">
          <label class="archive-field archive-field--compact">
            <select v-model="draftFilters.searchField" class="archive-field__control archive-field__control--select">
              <option value="visitorName">访客姓名</option>
              <option value="title">会话标题</option>
              <option value="customerIdentifier">客户标识</option>
              <option value="visitorAlias">访客备注名</option>
            </select>
            <AgentIcon class="archive-field__suffix" name="chevron-down" :size="14" />
          </label>

          <label class="archive-field archive-field--search">
            <AgentIcon class="archive-field__prefix" name="search" :size="16" />
            <input v-model.trim="draftFilters.keyword" class="archive-field__control" placeholder="请输入" />
          </label>

          <label class="archive-field">
            <select v-model="draftFilters.tag" class="archive-field__control archive-field__control--select">
              <option value="all">标签</option>
              <option v-for="option in tagOptions" :key="option" :value="option">{{ option }}</option>
            </select>
            <AgentIcon class="archive-field__suffix" name="chevron-down" :size="14" />
          </label>

          <label class="archive-field">
            <select v-model="draftFilters.owner" class="archive-field__control archive-field__control--select">
              <option value="all">会话负责人</option>
              <option v-for="option in ownerOptions" :key="option" :value="option">{{ option }}</option>
            </select>
            <AgentIcon class="archive-field__suffix" name="chevron-down" :size="14" />
          </label>

          <label class="archive-field">
            <select v-model="draftFilters.status" class="archive-field__control archive-field__control--select">
              <option value="all">状态</option>
              <option v-for="option in statusOptions" :key="option.value" :value="option.value">{{ option.label }}</option>
            </select>
            <AgentIcon class="archive-field__suffix" name="chevron-down" :size="14" />
          </label>
        </div>

        <div class="archive-filters__row archive-filters__row--secondary">
          <label class="archive-field">
            <select v-model="draftFilters.rating" class="archive-field__control archive-field__control--select">
              <option value="all">访客评价</option>
              <option value="satisfied">满意</option>
              <option value="none">未评价</option>
            </select>
            <AgentIcon class="archive-field__suffix" name="chevron-down" :size="14" />
          </label>

          <label class="archive-field archive-field--date">
            <input v-model="draftFilters.startedDate" class="archive-field__native-date" type="date" />
            <span
              class="archive-field__control archive-field__date-display"
              :class="{ 'archive-field__date-display--placeholder': !draftFilters.startedDate }"
            >
              {{ draftFilters.startedDate || '发起时间' }}
            </span>
            <AgentIcon class="archive-field__suffix" name="calendar" :size="16" />
          </label>

          <button type="button" class="agent-btn agent-btn--primary files-page__search-btn" @click="applyFilters">搜索</button>
          <button type="button" class="agent-btn agent-btn--ghost files-page__reset-btn" @click="resetFilters">重置</button>
        </div>
      </section>

      <section class="files-page__table-wrap">
        <div class="files-page__table-scroll agent-scroll" @scroll="closeStaffPanel">
          <table class="archive-table">
            <thead>
              <tr>
                <th>会话标题</th>
                <th>访客姓名</th>
                <th>客户标识</th>
                <th>访客备注名</th>
                <th>状态</th>
                <th>消息数量</th>
                <th>会话负责人</th>
                <th>服务客服</th>
                <th>标签</th>
                <th>
                  <button type="button" class="archive-sort" @click="toggleSort('startedAt')">
                    <span>发起时间</span>
                    <span class="archive-sort__arrows">
                      <span
                        class="archive-sort__arrow archive-sort__arrow--up"
                        :class="{ 'archive-sort__arrow--active': sortKey === 'startedAt' && sortOrder === 'asc' }"
                      />
                      <span
                        class="archive-sort__arrow archive-sort__arrow--down"
                        :class="{ 'archive-sort__arrow--active': sortKey === 'startedAt' && sortOrder === 'desc' }"
                      />
                    </span>
                  </button>
                </th>
                <th>
                  <button type="button" class="archive-sort" @click="toggleSort('acceptedAt')">
                    <span>接待时间</span>
                    <span class="archive-sort__arrows">
                      <span
                        class="archive-sort__arrow archive-sort__arrow--up"
                        :class="{ 'archive-sort__arrow--active': sortKey === 'acceptedAt' && sortOrder === 'asc' }"
                      />
                      <span
                        class="archive-sort__arrow archive-sort__arrow--down"
                        :class="{ 'archive-sort__arrow--active': sortKey === 'acceptedAt' && sortOrder === 'desc' }"
                      />
                    </span>
                  </button>
                </th>
                <th>服务时长</th>
                <th>访客评价</th>
                <th class="archive-table__actions-head">操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="visibleRows.length === 0">
                <td colspan="14" class="archive-table__empty">暂无符合条件的会话</td>
              </tr>
              <tr v-for="row in visibleRows" v-else :key="row.id">
                <!-- 2a. 会话标题列: inline edit -->
                <td>
                  <div v-if="editingRowId === row.id" class="archive-title-edit">
                    <input
                      ref="editTitleInputRef"
                      v-model="editDraftTitle"
                      class="agent-input archive-title-edit__input"
                      @blur="confirmEditTitle"
                      @keydown.enter.prevent="confirmEditTitle"
                      @keydown.esc.prevent="cancelEditTitle"
                    />
                  </div>
                  <span v-else class="archive-title-cell">
                    <button type="button" class="archive-link" @click="openConversation(row)">{{ row.title }}</button>
                    <button type="button" class="archive-title-cell__edit-btn" aria-label="编辑标题" @click.stop="startEditTitle(row)">
                      <AgentIcon name="edit" :size="13" />
                    </button>
                  </span>
                </td>
                <td>{{ row.visitorName }}</td>
                <td>{{ row.customerIdentifier }}</td>
                <td>{{ row.visitorAlias }}</td>
                <td>
                  <span class="archive-status" :class="`archive-status--${row.status}`">{{ statusLabelMap[row.status] }}</span>
                </td>
                <td class="archive-table__number">{{ row.messageCount }}</td>
                <!-- 2e. 会话负责人列: avatar + name -->
                <td>
                  <span v-if="row.owner !== '–'" class="archive-owner-cell">
                    <span
                      class="archive-owner-cell__avatar"
                      :style="{ background: getArchiveAgentProfile(row.owner).avatarColor }"
                    >
                      <img v-if="getArchiveAgentProfile(row.owner).avatarUrl" :src="getArchiveAgentProfile(row.owner).avatarUrl" class="archive-owner-cell__avatar-img" />
                      <span v-else>{{ getArchiveAgentProfile(row.owner).avatarText }}</span>
                    </span>
                    <span>{{ row.owner }}</span>
                  </span>
                  <span v-else>–</span>
                </td>
                <!-- 2c. 服务客服列: avatar stacking -->
                <td class="archive-staff-cell">
                  <div v-if="row.staffAgents.length > 0" class="archive-staff-avatars" @click.stop="toggleStaffPanel(row.id)">
                    <span
                      v-for="(agent, idx) in row.staffAgents.slice(0, 4)"
                      :key="agent.name"
                      class="archive-staff-avatars__item"
                      :style="{ background: agent.avatarColor, zIndex: 10 - idx }"
                      :title="agent.name"
                    >
                      <img v-if="agent.avatarUrl" :src="agent.avatarUrl" class="archive-staff-avatars__img" />
                      <span v-else>{{ agent.avatarText }}</span>
                    </span>
                    <span v-if="row.staffAgents.length > 4" class="archive-staff-avatars__overflow">+{{ row.staffAgents.length - 4 }}</span>
                  </div>
                  <span v-else>–</span>
                  <!-- Staff panel (inline below cell) -->
                  <div v-if="staffPanelRowId === row.id" class="archive-staff-panel" @click.stop>
                    <div class="archive-staff-panel__header">
                      <span class="archive-staff-panel__title">服务客服列表</span>
                    </div>
                    <ul class="archive-staff-panel__list">
                      <li v-for="agent in row.staffAgents" :key="agent.name" class="archive-staff-panel__item">
                        <span class="archive-staff-panel__avatar" :style="{ background: agent.avatarColor }">
                          <img v-if="agent.avatarUrl" :src="agent.avatarUrl" class="archive-staff-panel__avatar-img" />
                          <span v-else>{{ agent.avatarText }}</span>
                        </span>
                        <span class="archive-staff-panel__name">{{ agent.name }}</span>
                        <span v-if="agent.name === row.owner" class="archive-staff-panel__owner-tag">会话负责人</span>
                      </li>
                    </ul>
                  </div>
                </td>
                <!-- 2b. 标签列: tag chips + popover -->
                <td class="archive-tag-cell">
                  <div class="archive-tag-group" @click.stop="openTagPopover(row.id)">
                    <span v-if="row.tags.length === 0" class="archive-tag archive-tag--empty">–</span>
                    <span v-for="t in row.tags" v-else :key="t" class="archive-tag">{{ t }}</span>
                  </div>
                  <div v-if="tagPopoverRowId === row.id" class="archive-tag-popover" @click.stop>
                    <div class="archive-tag-popover__search">
                      <input v-model.trim="tagSearchKeyword" class="archive-tag-popover__input" placeholder="搜索或创建标签" @keydown.enter.prevent="createAndAddTag(row.id)" />
                    </div>
                    <div class="archive-tag-popover__list agent-scroll">
                      <label v-for="t in filteredTagPool" :key="t" class="archive-tag-popover__option">
                        <input type="checkbox" :checked="row.tags.includes(t)" @change="toggleRowTag(row.id, t)" />
                        <span>{{ t }}</span>
                      </label>
                      <p v-if="filteredTagPool.length === 0 && tagSearchKeyword" class="archive-tag-popover__empty">
                        按回车创建「{{ tagSearchKeyword }}」
                      </p>
                    </div>
                  </div>
                </td>
                <td>{{ row.startedAtLabel }}</td>
                <td>{{ row.acceptedAtLabel }}</td>
                <td>{{ row.serviceDuration }}</td>
                <td>{{ row.rating === 'satisfied' ? '满意' : '–' }}</td>
                <!-- 操作列: all actions in dropdown -->
                <td class="archive-table__actions-cell">
                  <button
                    type="button"
                    class="archive-action-btn"
                    aria-label="更多操作"
                    @click.stop="toggleActionMenu(row.id)"
                  >
                    <span />
                    <span />
                    <span />
                  </button>

                  <div v-if="openActionMenuId === row.id" class="archive-action-menu" @click.stop>
                    <template v-if="row.status === 'queueing'">
                      <button v-if="isAdmin" type="button" class="archive-action-menu__item" @click="assignConversation(row)">分配会话</button>
                      <button v-else type="button" class="archive-action-menu__item" @click="confirmAssignToSelf(row)">分配给我</button>
                    </template>
                    <template v-else>
                      <button type="button" class="archive-action-menu__item" @click="handleTakeoverOrAssign(row)">{{ row.owner === aiAgentArchiveName ? '接管会话' : '分配会话' }}</button>
                    </template>
                    <button type="button" class="archive-action-menu__item" @click="openConversation(row)">查看会话</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </section>

    <section v-else-if="activeKey === 'all-chats'" class="files-page__card agent-panel">
      <header class="files-page__header">
        <h1 class="files-page__title">聊天记录</h1>
      </header>

      <section class="files-page__summary summary-banner">
        <div class="summary-banner__stats summary-banner__stats--chat">
          <article v-for="item in chatSummaryStats" :key="item.key" class="summary-banner__item">
            <p class="summary-banner__value">{{ item.value }}</p>
            <p class="summary-banner__label">{{ item.label }}</p>
          </article>
        </div>

        <div class="summary-banner__visual" aria-hidden="true">
          <div class="summary-banner__ring summary-banner__ring--outer" />
          <div class="summary-banner__ring summary-banner__ring--inner" />
          <div class="summary-banner__planet" />
          <div class="summary-banner__bubble summary-banner__bubble--left" />
          <div class="summary-banner__bubble summary-banner__bubble--right" />
          <div class="summary-banner__spark summary-banner__spark--one" />
          <div class="summary-banner__spark summary-banner__spark--two" />
        </div>
      </section>

      <section class="files-page__filters archive-filters">
        <div class="archive-filters__row archive-filters__row--chat-primary">
          <label class="archive-field archive-field--compact">
            <select v-model="chatDraftFilters.searchField" class="archive-field__control archive-field__control--select">
              <option value="title">聊天标题</option>
              <option value="owner">群主</option>
            </select>
            <AgentIcon class="archive-field__suffix" name="chevron-down" :size="14" />
          </label>

          <label class="archive-field archive-field--search">
            <AgentIcon class="archive-field__prefix" name="search" :size="16" />
            <input v-model.trim="chatDraftFilters.keyword" class="archive-field__control" placeholder="请输入" />
          </label>

          <label class="archive-field">
            <select v-model="chatDraftFilters.messageCount" class="archive-field__control archive-field__control--select">
              <option value="all">消息数量</option>
              <option value="0">0 条</option>
              <option value="1-10">1-10 条</option>
              <option value="10+">10 条以上</option>
            </select>
            <AgentIcon class="archive-field__suffix" name="chevron-down" :size="14" />
          </label>

          <label class="archive-field">
            <select v-model="chatDraftFilters.owner" class="archive-field__control archive-field__control--select">
              <option value="all">群主</option>
              <option v-for="opt in chatOwnerOptions" :key="opt" :value="opt">{{ opt }}</option>
            </select>
            <AgentIcon class="archive-field__suffix" name="chevron-down" :size="14" />
          </label>

          <label class="archive-field">
            <select v-model="chatDraftFilters.chatType" class="archive-field__control archive-field__control--select">
              <option value="all">类型</option>
              <option value="single">单聊</option>
              <option value="group">群聊</option>
            </select>
            <AgentIcon class="archive-field__suffix" name="chevron-down" :size="14" />
          </label>
        </div>

        <div class="archive-filters__row archive-filters__row--chat-secondary">
          <label class="archive-field">
            <select v-model="chatDraftFilters.status" class="archive-field__control archive-field__control--select">
              <option value="all">状态</option>
              <option value="active">活跃</option>
              <option value="dissolved">解散</option>
            </select>
            <AgentIcon class="archive-field__suffix" name="chevron-down" :size="14" />
          </label>

          <label class="archive-field">
            <select v-model="chatDraftFilters.category" class="archive-field__control archive-field__control--select">
              <option value="all">分类</option>
              <option value="external">外部</option>
              <option value="internal">内部</option>
            </select>
            <AgentIcon class="archive-field__suffix" name="chevron-down" :size="14" />
          </label>

          <label class="archive-field archive-field--date">
            <input v-model="chatDraftFilters.startedDate" class="archive-field__native-date" type="date" />
            <span
              class="archive-field__control archive-field__date-display"
              :class="{ 'archive-field__date-display--placeholder': !chatDraftFilters.startedDate }"
            >
              {{ chatDraftFilters.startedDate || '发起时间' }}
            </span>
            <AgentIcon class="archive-field__suffix" name="calendar" :size="16" />
          </label>

          <label class="archive-field archive-field--date">
            <input v-model="chatDraftFilters.updatedDate" class="archive-field__native-date" type="date" />
            <span
              class="archive-field__control archive-field__date-display"
              :class="{ 'archive-field__date-display--placeholder': !chatDraftFilters.updatedDate }"
            >
              {{ chatDraftFilters.updatedDate || '最后更新时间' }}
            </span>
            <AgentIcon class="archive-field__suffix" name="calendar" :size="16" />
          </label>

          <button type="button" class="agent-btn agent-btn--primary files-page__search-btn" @click="applyChatFilters">搜索</button>
          <button type="button" class="agent-btn agent-btn--ghost files-page__reset-btn" @click="resetChatFilters">重置</button>
        </div>
      </section>

      <section class="files-page__table-wrap">
        <div class="files-page__table-scroll agent-scroll" @scroll="closeChatMemberPanel">
          <table class="archive-table">
            <thead>
              <tr>
                <th>聊天标题</th>
                <th>类型</th>
                <th>状态</th>
                <th>分类</th>
                <th>
                  <button type="button" class="archive-sort" @click="toggleChatSort('messageCount')">
                    <span>消息数量</span>
                    <span class="archive-sort__arrows">
                      <span
                        class="archive-sort__arrow archive-sort__arrow--up"
                        :class="{ 'archive-sort__arrow--active': chatSortKey === 'messageCount' && chatSortOrder === 'asc' }"
                      />
                      <span
                        class="archive-sort__arrow archive-sort__arrow--down"
                        :class="{ 'archive-sort__arrow--active': chatSortKey === 'messageCount' && chatSortOrder === 'desc' }"
                      />
                    </span>
                  </button>
                </th>
                <th>群主</th>
                <th>访客成员</th>
                <th>客服成员</th>
                <th>
                  <button type="button" class="archive-sort" @click="toggleChatSort('startedAt')">
                    <span>发起时间</span>
                    <span class="archive-sort__arrows">
                      <span
                        class="archive-sort__arrow archive-sort__arrow--up"
                        :class="{ 'archive-sort__arrow--active': chatSortKey === 'startedAt' && chatSortOrder === 'asc' }"
                      />
                      <span
                        class="archive-sort__arrow archive-sort__arrow--down"
                        :class="{ 'archive-sort__arrow--active': chatSortKey === 'startedAt' && chatSortOrder === 'desc' }"
                      />
                    </span>
                  </button>
                </th>
                <th>
                  <button type="button" class="archive-sort" @click="toggleChatSort('updatedAt')">
                    <span>最后更新时间</span>
                    <span class="archive-sort__arrows">
                      <span
                        class="archive-sort__arrow archive-sort__arrow--up"
                        :class="{ 'archive-sort__arrow--active': chatSortKey === 'updatedAt' && chatSortOrder === 'asc' }"
                      />
                      <span
                        class="archive-sort__arrow archive-sort__arrow--down"
                        :class="{ 'archive-sort__arrow--active': chatSortKey === 'updatedAt' && chatSortOrder === 'desc' }"
                      />
                    </span>
                  </button>
                </th>
                <th class="archive-table__actions-head">操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="visibleChatRows.length === 0">
                <td colspan="11" class="archive-table__empty">暂无符合条件的聊天</td>
              </tr>
              <tr v-for="row in paginatedChatRows" v-else :key="row.id">
                <td><button type="button" class="archive-link" @click="openChatDrawer(row)">{{ row.title }}</button></td>
                <td>{{ row.chatType === 'single' ? '单聊' : '群聊' }}</td>
                <td>
                  <span class="chat-status" :class="'chat-status--' + row.status">{{ row.status === 'active' ? '活跃' : '解散' }}</span>
                </td>
                <td>{{ row.category === 'external' ? '外部' : '内部' }}</td>
                <td class="archive-table__number">{{ row.messageCount === 0 ? '\u2013' : row.messageCount }}</td>
                <!-- 群主: avatar + name (不可点击) -->
                <td>
                  <span v-if="row.ownerMember" class="archive-owner-cell">
                    <span
                      class="archive-owner-cell__avatar"
                      :style="{ background: row.ownerMember.avatarColor }"
                    >
                      <img v-if="row.ownerMember.avatarUrl" :src="row.ownerMember.avatarUrl" class="archive-owner-cell__avatar-img" />
                      <span v-else>{{ row.ownerMember.avatarText }}</span>
                    </span>
                    <span>{{ row.owner }}</span>
                  </span>
                  <span v-else>{{ row.owner }}</span>
                </td>
                <!-- 访客成员: avatar stacking + inline panel (shared) -->
                <td class="archive-staff-cell">
                  <div v-if="row.visitorMembers.length > 0" class="archive-staff-avatars" @click.stop="toggleChatMemberPanel(row.id)">
                    <span
                      v-for="(member, idx) in row.visitorMembers.slice(0, 4)"
                      :key="member.name"
                      class="archive-staff-avatars__item"
                      :style="{ background: member.avatarColor, zIndex: 10 - idx }"
                      :title="member.name"
                    >
                      <img v-if="member.avatarUrl" :src="member.avatarUrl" class="archive-staff-avatars__img" />
                      <span v-else>{{ member.avatarText }}</span>
                    </span>
                    <span v-if="row.visitorMembers.length > 4" class="archive-staff-avatars__overflow">+{{ row.visitorMembers.length - 4 }}</span>
                  </div>
                  <span v-else class="archive-table__number">–</span>
                  <div v-if="chatMemberPanelRowId === row.id" class="archive-staff-panel" @click.stop>
                    <div class="archive-staff-panel__header">
                      <span class="archive-staff-panel__title">成员列表</span>
                    </div>
                    <ul class="archive-staff-panel__list">
                      <li v-if="row.ownerMember" class="archive-staff-panel__item">
                        <span class="archive-staff-panel__avatar" :style="{ background: row.ownerMember.avatarColor }">
                          <img v-if="row.ownerMember.avatarUrl" :src="row.ownerMember.avatarUrl" class="archive-staff-panel__avatar-img" />
                          <span v-else>{{ row.ownerMember.avatarText }}</span>
                        </span>
                        <span class="archive-staff-panel__name">{{ row.ownerMember.name }}</span>
                        <span class="archive-staff-panel__owner-tag">群主</span>
                      </li>
                      <li v-for="member in row.staffMembers" :key="'s-' + member.name" class="archive-staff-panel__item">
                        <span class="archive-staff-panel__avatar" :style="{ background: member.avatarColor }">
                          <img v-if="member.avatarUrl" :src="member.avatarUrl" class="archive-staff-panel__avatar-img" />
                          <span v-else>{{ member.avatarText }}</span>
                        </span>
                        <span class="archive-staff-panel__name">{{ member.name }}</span>
                        <span class="archive-staff-panel__staff-tag">客服</span>
                      </li>
                      <li v-for="member in row.visitorMembers" :key="'v-' + member.name" class="archive-staff-panel__item">
                        <span class="archive-staff-panel__avatar" :style="{ background: member.avatarColor }">
                          <img v-if="member.avatarUrl" :src="member.avatarUrl" class="archive-staff-panel__avatar-img" />
                          <span v-else>{{ member.avatarText }}</span>
                        </span>
                        <span class="archive-staff-panel__name">{{ member.name }}</span>
                      </li>
                    </ul>
                  </div>
                </td>
                <!-- 客服成员: avatar stacking (opens same panel) -->
                <td class="archive-staff-cell">
                  <div v-if="row.staffMembers.length > 0" class="archive-staff-avatars" @click.stop="toggleChatMemberPanel(row.id)">
                    <span
                      v-for="(member, idx) in row.staffMembers.slice(0, 4)"
                      :key="member.name"
                      class="archive-staff-avatars__item"
                      :style="{ background: member.avatarColor, zIndex: 10 - idx }"
                      :title="member.name"
                    >
                      <img v-if="member.avatarUrl" :src="member.avatarUrl" class="archive-staff-avatars__img" />
                      <span v-else>{{ member.avatarText }}</span>
                    </span>
                    <span v-if="row.staffMembers.length > 4" class="archive-staff-avatars__overflow">+{{ row.staffMembers.length - 4 }}</span>
                  </div>
                  <span v-else class="archive-table__number">{{ row.staffCount }}</span>
                </td>
                <td>{{ row.startedAtLabel }}</td>
                <td>{{ row.updatedAtLabel }}</td>
                <td class="archive-table__actions-cell">
                  <button
                    type="button"
                    class="archive-action-btn"
                    aria-label="更多操作"
                    @click.stop="toggleChatActionMenu(row.id)"
                  >
                    <span />
                    <span />
                    <span />
                  </button>

                  <div v-if="openChatActionMenuId === row.id" class="archive-action-menu" @click.stop>
                    <button type="button" class="archive-action-menu__item" @click="openChatDrawer(row)">查看聊天</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <footer class="chat-pagination">
        <span class="chat-pagination__total">总条数：{{ visibleChatRows.length }}</span>
        <div class="chat-pagination__controls">
          <button
            type="button"
            class="chat-pagination__arrow"
            :disabled="chatCurrentPage <= 1"
            @click="chatCurrentPage = Math.max(1, chatCurrentPage - 1)"
          >&lt;</button>
          <button
            v-for="pg in chatTotalPages"
            :key="pg"
            type="button"
            class="chat-pagination__page"
            :class="{ 'chat-pagination__page--active': pg === chatCurrentPage }"
            @click="chatCurrentPage = pg"
          >{{ pg }}</button>
          <button
            type="button"
            class="chat-pagination__arrow"
            :disabled="chatCurrentPage >= chatTotalPages"
            @click="chatCurrentPage = Math.min(chatTotalPages, chatCurrentPage + 1)"
          >&gt;</button>
        </div>
        <label class="chat-pagination__size">
          <select v-model="chatPageSize" class="chat-pagination__size-select">
            <option :value="20">20 条/页</option>
            <option :value="50">50 条/页</option>
            <option :value="100">100 条/页</option>
          </select>
          <AgentIcon class="chat-pagination__size-icon" name="chevron-down" :size="12" />
        </label>
      </footer>
    </section>

    <!-- Chat record drawer -->
    <ArchiveConversationDrawer
      :open="Boolean(chatDrawerRow)"
      :title="chatDrawerRow?.title ?? ''"
      :messages="chatDrawerMessages"
      assign-label="查看详情"
      :editable="false"
      @assign="handleChatDrawerAssign"
      @close="closeChatDrawer"
    />

    <!-- Confirm dialog -->
    <Teleport to="body">
      <div v-if="confirmDialogOpen" class="archive-confirm-overlay" @click="closeConfirmDialog">
        <div class="archive-confirm-dialog" @click.stop>
          <h3 class="archive-confirm-dialog__title">{{ confirmDialogTitle }}</h3>
          <p class="archive-confirm-dialog__desc">{{ confirmDialogDesc }}</p>
          <div class="archive-confirm-dialog__actions">
            <button type="button" class="agent-btn agent-btn--ghost archive-confirm-dialog__btn" @click="closeConfirmDialog">取 消</button>
            <button type="button" class="agent-btn agent-btn--primary archive-confirm-dialog__btn" @click="handleConfirmDialog">确 认</button>
          </div>
        </div>
      </div>
    </Teleport>

    <ArchiveConversationDrawer
      :open="Boolean(previewConversation)"
      :title="previewConversation?.title ?? ''"
      :messages="previewConversationMessages"
      :assign-label="previewConversation?.owner === aiAgentArchiveName ? '接管会话' : '分配会话'"
      :editable="true"
      @assign="previewConversation && assignConversation(previewConversation)"
      @close="closeConversationDrawer"
      @edit-title="previewConversation && startEditTitle(previewConversation)"
      @update:title="handleDrawerTitleUpdate"
    />

    <ArchiveAssignModal
      :open="assignModalOpen"
      :keyword="assignKeyword"
      :conversation-title="pendingAssignConversation?.title ?? ''"
      :agents="assignableAgents"
      :modal-title="pendingAssignConversation?.owner === aiAgentArchiveName ? '接管会话' : '分配会话'"
      :action-label="pendingAssignConversation?.owner === aiAgentArchiveName ? '接管' : ''"
      @close="closeAssignModal"
      @confirm="handleAssignConfirm"
      @update:keyword="assignKeyword = $event"
    />
  </section>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref } from "vue";
import { AgentIcon } from "@twt/ui-agent";
import ArchiveAssignModal from "../components/archive/ArchiveAssignModal.vue";
import ArchiveConversationDrawer from "../components/archive/ArchiveConversationDrawer.vue";
import { loadStoredAiAgentSettings, resolveAiAgentProfile } from "../lib/aiAgentSettings";

type FilesPageKey = "all-conversations" | "all-chats";
type SearchField = "visitorName" | "title" | "customerIdentifier" | "visitorAlias";
type ConversationStatus = "pending-reply" | "queueing" | "processing" | "replied" | "closed";
type ConversationRating = "none" | "satisfied";
type SortKey = "startedAt" | "acceptedAt";
type SortOrder = "asc" | "desc";

interface StaffAgent {
  name: string;
  avatarText: string;
  avatarColor: string;
  avatarUrl?: string;
  role?: string;
}

interface ConversationRecord {
  id: string;
  title: string;
  visitorName: string;
  customerIdentifier: string;
  visitorAlias: string;
  status: ConversationStatus;
  messageCount: number;
  owner: string;
  staffCount: number;
  tag: string;
  tags: string[];
  staffAgents: StaffAgent[];
  startedAtLabel: string;
  startedAtValue: number;
  acceptedAtLabel: string;
  acceptedAtValue: number | null;
  serviceDuration: string;
  rating: ConversationRating;
  aiAgentHandled: boolean;
}

interface ConversationSeed {
  title?: string;
  visitorName?: string;
  customerIdentifier?: string;
  visitorAlias?: string;
  status: ConversationStatus;
  messageCount?: number;
  owner?: string;
  staffCount?: number;
  tag?: string;
  tags?: string[];
  staffAgents?: StaffAgent[];
  startedAtLabel?: string;
  acceptedAtLabel?: string;
  startedAtValue?: number;
  acceptedAtValue?: number | null;
  serviceDuration?: string;
  rating?: ConversationRating;
  aiAgentHandled?: boolean;
}

interface ArchiveAgent {
  id: string;
  name: string;
  online: boolean;
  avatarText: string;
  avatarColor: string;
}

interface ArchivePreviewMessage {
  id: string;
  role: "agent" | "customer" | "system";
  sender: string;
  content: string;
  time: string;
  avatarText?: string;
  avatarColor?: string;
  avatarUrl?: string;
}

interface FilterState {
  searchField: SearchField;
  keyword: string;
  tag: string;
  owner: string;
  status: "all" | ConversationStatus;
  rating: "all" | ConversationRating;
  startedDate: string;
}

const props = withDefaults(
  defineProps<{
    activeKey?: FilesPageKey;
  }>(),
  {
    activeKey: "all-conversations"
  }
);

const emit = defineEmits<{
  (e: "toast", message: string): void;
}>();

const statusLabelMap: Record<ConversationStatus, string> = {
  "pending-reply": "待回复",
  queueing: "排队中",
  processing: "待处理",
  replied: "已回复",
  closed: "已关闭"
};

const statusOptions = [
  { value: "pending-reply", label: "待回复" },
  { value: "queueing", label: "排队中" },
  { value: "processing", label: "待处理" },
  { value: "replied", label: "已回复" },
  { value: "closed", label: "已关闭" }
] as const;

const ownerPool = ["客服主管", "王珂", "刘昊", "陈悦", "李想"];
const aiAgentProfile = resolveAiAgentProfile(loadStoredAiAgentSettings());
const aiAgentArchiveName = aiAgentProfile.name;
const archiveAgentPool: ArchiveAgent[] = [
  { id: "ag-1", name: "客服主管", online: true, avatarText: "主", avatarColor: "linear-gradient(135deg, #2f6bff 0%, #69a1ff 100%)" },
  { id: "ag-2", name: "王珂", online: true, avatarText: "王", avatarColor: "linear-gradient(135deg, #7f6bff 0%, #a259ff 100%)" },
  { id: "ag-3", name: "刘昊", online: true, avatarText: "刘", avatarColor: "linear-gradient(135deg, #ff7d00 0%, #ffb15d 100%)" },
  { id: "ag-4", name: "陈悦", online: true, avatarText: "陈", avatarColor: "linear-gradient(135deg, #00c2b8 0%, #00a0cc 100%)" },
  { id: "ag-5", name: "李想", online: true, avatarText: "李", avatarColor: "linear-gradient(135deg, #00b578 0%, #00a66f 100%)" },
  { id: "ag-6", name: "张明", online: false, avatarText: "张", avatarColor: "#a7b0c0" },
  { id: "ag-7", name: "林晓", online: false, avatarText: "林", avatarColor: "#a7b0c0" }
];
const titlePool = [
  "新的会话",
  "General Inquiry",
  "活动报名咨询",
  "续费折扣咨询",
  "订单退款进度",
  "接口限流报错",
  "发票抬头修改",
  "会员权益咨询",
  "物流进度咨询",
  "合作方案沟通"
];
const tagPool = ["–", "高意向", "VIP", "续费", "退款", "活动"];
const allTagPool = ["有购买意向", "外部推荐", "广告投放", "待跟进", "情绪稳定", "放弃购买", "高意向", "VIP", "续费", "退款", "活动", "AI Agent"];
const aliasPool = ["–", "需要 进群的客户", "重点回访客户", "需要二次联系", "老客户跟进"];
const visitorPool = [
  "Visitor34",
  "Visitor13514",
  "Visitor50",
  "Visitor49",
  "Visitor27",
  "Visitor18",
  "Visitor62",
  "Visitor89",
  "Visitor120",
  "Visitor43",
  "Visitor26",
  "Visitor55",
  "Visitor72",
  "Visitor11",
  "Visitor64",
  "Visitor96",
  "Visitor40",
  "Visitor108",
  "Visitor77",
  "Visitor13",
  "Visitor59",
  "Visitor118",
  "Visitor23",
  "Visitor80",
  "Visitor68",
  "Visitor15",
  "Visitor93",
  "Visitor36",
  "Visitor81",
  "Visitor44",
  "Visitor29",
  "Visitor101",
  "Visitor57",
  "Visitor14",
  "Visitor87",
  "Visitor31",
  "Visitor73",
  "Visitor98",
  "Visitor66"
];

const createDefaultFilters = (): FilterState => ({
  searchField: "visitorName",
  keyword: "",
  tag: "all",
  owner: "all",
  status: "all",
  rating: "all",
  startedDate: ""
});

const draftFilters = reactive<FilterState>(createDefaultFilters());
const appliedFilters = ref<FilterState>(createDefaultFilters());
const sortKey = ref<SortKey>("startedAt");
const sortOrder = ref<SortOrder>("desc");
const openActionMenuId = ref<string | null>(null);
const previewConversationId = ref<string | null>(null);
const assignModalOpen = ref(false);
const assignKeyword = ref("");
const pendingAssignConversationId = ref<string | null>(null);

// Title inline editing
const editingRowId = ref<string | null>(null);
const editDraftTitle = ref("");
const editTitleInputRef = ref<HTMLInputElement | null>(null);

// Tag popover
const tagPopoverRowId = ref<string | null>(null);
const tagSearchKeyword = ref("");

// Staff panel (inline)
const staffPanelRowId = ref<string | null>(null);

const toggleStaffPanel = (rowId: string) => {
  staffPanelRowId.value = staffPanelRowId.value === rowId ? null : rowId;
};

const closeStaffPanel = () => {
  staffPanelRowId.value = null;
};

// Admin mode
const isAdmin = ref(true);

// Confirm dialog
const confirmDialogOpen = ref(false);
const confirmDialogTitle = ref("");
const confirmDialogDesc = ref("");
const confirmDialogCallback = ref<(() => void) | null>(null);

const formatDateTime = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hour = String(date.getHours()).padStart(2, "0");
  const minute = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day} ${hour}:${minute}`;
};

const formatDuration = (minutes: number, seconds?: number) => {
  if (seconds && seconds > 0) {
    return `${seconds}秒`;
  }

  const days = Math.floor(minutes / (24 * 60));
  const hours = Math.floor((minutes % (24 * 60)) / 60);
  const remainMinutes = minutes % 60;
  const parts: string[] = [];

  if (days > 0) parts.push(`${days}天`);
  if (hours > 0) parts.push(`${hours}小时`);
  if (remainMinutes > 0 || parts.length === 0) parts.push(`${remainMinutes}分`);

  return parts.join(" ");
};

const buildDurationPayload = (index: number) => {
  if (index % 11 === 0) {
    return { minutes: 11 * 24 * 60 + 49 };
  }
  if (index % 9 === 0) {
    return { minutes: 29 * 24 * 60 + 7 * 60 + 46 };
  }
  if (index % 7 === 0) {
    return { minutes: 31 * 24 * 60 + 60 + 6 };
  }
  if (index % 5 === 0) {
    return { minutes: 0, seconds: 20 };
  }
  if (index % 4 === 0) {
    return { minutes: 0, seconds: 4 };
  }
  if (index % 3 === 0) {
    return { minutes: 0, seconds: 3 };
  }
  return { minutes: 11 * 24 * 60 + 3 * 60 + 58 };
};

const getArchiveAgentProfile = (name: string) => {
  if (name === aiAgentArchiveName) {
    return {
      avatarText: aiAgentProfile.avatarText,
      avatarColor: aiAgentProfile.avatarColor,
      avatarUrl: aiAgentProfile.avatarUrl
    };
  }

  const agent = archiveAgentPool.find((item) => item.name === name);
  const fallbackText = name.slice(0, 1) || "客";
  return {
    avatarText: agent?.avatarText ?? fallbackText,
    avatarColor: agent?.avatarColor ?? "linear-gradient(135deg, #2f6bff 0%, #69a1ff 100%)",
    avatarUrl: ""
  };
};

const buildStaffAgents = (seed: ConversationSeed, index: number): StaffAgent[] => {
  const agents: StaffAgent[] = [];
  if (seed.staffAgents) return seed.staffAgents;

  if (seed.aiAgentHandled) {
    agents.push({
      name: aiAgentArchiveName,
      avatarText: aiAgentProfile.avatarText,
      avatarColor: aiAgentProfile.avatarColor,
      avatarUrl: aiAgentProfile.avatarUrl,
      role: "AI Agent"
    });
  }

  const ownerName = seed.owner ?? (seed.status === "pending-reply" || seed.status === "queueing" || seed.status === "processing" ? "–" : ownerPool[index % ownerPool.length]);
  if (ownerName !== "–" && ownerName !== aiAgentArchiveName) {
    const profile = getArchiveAgentProfile(ownerName);
    agents.push({
      name: ownerName,
      avatarText: profile.avatarText,
      avatarColor: profile.avatarColor,
      role: "客服"
    });
  }

  // Add extra staff for variety — ensure some rows have 4+ agents
  const extrasCount = index % 12 === 0 ? 4 : index % 4 === 0 ? 2 : index % 6 === 0 ? 1 : 0;
  for (let i = 0; i < extrasCount; i++) {
    const extraName = ownerPool[(index + i + 2) % ownerPool.length];
    if (!agents.find(a => a.name === extraName)) {
      const profile = getArchiveAgentProfile(extraName);
      agents.push({ name: extraName, avatarText: profile.avatarText, avatarColor: profile.avatarColor, role: "客服" });
    }
  }

  return agents;
};

const createRecord = (index: number, seed: ConversationSeed): ConversationRecord => {
  const startedAt =
    seed.startedAtValue ?? new Date("2026-02-24T20:08:00").getTime() - index * (11 * 60 + 37) * 60 * 1000;

  const duration = buildDurationPayload(index + 1);
  const defaultAcceptedAtValue =
    seed.status === "pending-reply" || seed.status === "queueing" || seed.status === "processing"
      ? null
      : startedAt + ((duration.seconds ?? 0) * 1000 + duration.minutes * 60 * 1000);

  return {
    id: `archive-${index + 1}`,
    title: seed.title ?? titlePool[index % titlePool.length],
    visitorName: seed.visitorName ?? visitorPool[index % visitorPool.length],
    customerIdentifier:
      seed.customerIdentifier ?? (index % 5 === 0 ? `VIP-${String(2000 + index).padStart(4, "0")}` : "–"),
    visitorAlias: seed.visitorAlias ?? aliasPool[index % aliasPool.length],
    status: seed.status,
    messageCount: seed.messageCount ?? ((index * 7) % 79) + 1,
    owner: seed.owner ?? (seed.status === "pending-reply" || seed.status === "queueing" || seed.status === "processing" ? "–" : ownerPool[index % ownerPool.length]),
    staffCount:
      seed.staffCount ?? (seed.status === "pending-reply" || seed.status === "queueing" || seed.status === "processing" ? 0 : 1),
    tag: seed.tag ?? tagPool[index % tagPool.length],
    tags: seed.tags ?? (seed.tag && seed.tag !== "–" ? [seed.tag] : (tagPool[index % tagPool.length] !== "–" ? [tagPool[index % tagPool.length]] : [])),
    staffAgents: buildStaffAgents(seed, index),
    startedAtLabel: seed.startedAtLabel ?? formatDateTime(new Date(startedAt)),
    startedAtValue: startedAt,
    acceptedAtLabel:
      seed.acceptedAtLabel ??
      (seed.status === "pending-reply" || seed.status === "queueing" || seed.status === "processing"
        ? "–"
        : formatDateTime(new Date(seed.acceptedAtValue ?? defaultAcceptedAtValue ?? startedAt))),
    acceptedAtValue: seed.acceptedAtValue ?? defaultAcceptedAtValue,
    serviceDuration:
      seed.serviceDuration ??
      (seed.status === "pending-reply" || seed.status === "queueing" || seed.status === "processing"
        ? "–"
        : formatDuration(duration.minutes, duration.seconds)),
    rating: seed.rating ?? (index % 8 === 0 ? "satisfied" : "none"),
    aiAgentHandled: seed.aiAgentHandled ?? false
  };
};

const presetSeeds: ConversationSeed[] = [
  {
    title: "AI Agent - 配送时间咨询",
    visitorName: "Tom",
    customerIdentifier: "AI-7001",
    visitorAlias: "AI 接待会话",
    status: "replied",
    messageCount: 4,
    owner: aiAgentArchiveName,
    staffCount: 1,
    tag: "AI Agent",
    tags: ["AI Agent", "有购买意向"],
    startedAtLabel: "2026-02-24 20:10",
    startedAtValue: new Date("2026-02-24T20:10:00").getTime(),
    acceptedAtLabel: "2026-02-24 20:10",
    acceptedAtValue: new Date("2026-02-24T20:10:00").getTime(),
    serviceDuration: "4分",
    rating: "none",
    aiAgentHandled: true
  },
  {
    title: "AI Agent - 退货流程咨询",
    visitorName: "Visitor96",
    customerIdentifier: "AI-7002",
    visitorAlias: "AI 转人工客户",
    status: "replied",
    messageCount: 6,
    owner: "王珂",
    staffCount: 1,
    tag: "AI Agent",
    tags: ["AI Agent", "待跟进"],
    startedAtLabel: "2026-02-24 19:50",
    startedAtValue: new Date("2026-02-24T19:50:00").getTime(),
    acceptedAtLabel: "2026-02-24 19:55",
    acceptedAtValue: new Date("2026-02-24T19:55:00").getTime(),
    serviceDuration: "5分",
    rating: "satisfied",
    aiAgentHandled: true
  },
  {
    title: "AI Agent - 会员权益咨询",
    visitorName: "Visitor40",
    customerIdentifier: "AI-7003",
    visitorAlias: "VIP 客户",
    status: "replied",
    messageCount: 3,
    owner: aiAgentArchiveName,
    staffCount: 1,
    tag: "VIP",
    tags: ["VIP", "外部推荐"],
    startedAtLabel: "2026-02-24 20:05",
    startedAtValue: new Date("2026-02-24T20:05:00").getTime(),
    acceptedAtLabel: "2026-02-24 20:05",
    acceptedAtValue: new Date("2026-02-24T20:05:00").getTime(),
    serviceDuration: "3分",
    rating: "none",
    aiAgentHandled: true
  },
  {
    title: "新的会话",
    visitorName: "Visitor34",
    customerIdentifier: "–",
    visitorAlias: "需要 进群的客户",
    status: "queueing",
    messageCount: 1,
    owner: "–",
    staffCount: 0,
    tag: "–",
    startedAtLabel: "2026-02-24 20:08",
    startedAtValue: new Date("2026-02-24T20:08:00").getTime(),
    acceptedAtLabel: "–",
    acceptedAtValue: null,
    serviceDuration: "–",
    rating: "none"
  },
  {
    title: "General Inquiry",
    visitorName: "Visitor34",
    customerIdentifier: "–",
    visitorAlias: "需要 进群的客户",
    status: "replied",
    messageCount: 78,
    owner: "客服主管",
    staffCount: 1,
    tag: "–",
    startedAtLabel: "2026-02-24 17:13",
    startedAtValue: new Date("2026-02-24T17:13:00").getTime(),
    acceptedAtLabel: "2026-02-24 17:13",
    acceptedAtValue: new Date("2026-02-24T17:13:00").getTime(),
    serviceDuration: "11天 49分",
    rating: "none"
  },
  {
    title: "新的会话",
    visitorName: "Visitor13514",
    customerIdentifier: "–",
    visitorAlias: "–",
    status: "closed",
    messageCount: 2,
    owner: "客服主管",
    staffCount: 1,
    tag: "–",
    startedAtLabel: "2026-02-05 19:36",
    startedAtValue: new Date("2026-02-05T19:36:00").getTime(),
    acceptedAtLabel: "2026-02-05 19:36",
    acceptedAtValue: new Date("2026-02-05T19:36:04").getTime(),
    serviceDuration: "4秒",
    rating: "satisfied"
  },
  {
    title: "新的会话",
    visitorName: "Visitor50",
    customerIdentifier: "–",
    visitorAlias: "–",
    status: "closed",
    messageCount: 1,
    owner: "客服主管",
    staffCount: 1,
    tag: "–",
    startedAtLabel: "2026-02-05 18:04",
    startedAtValue: new Date("2026-02-05T18:04:00").getTime(),
    acceptedAtLabel: "2026-02-05 18:05",
    acceptedAtValue: new Date("2026-02-05T18:05:03").getTime(),
    serviceDuration: "3秒",
    rating: "satisfied"
  },
  {
    title: "新的会话",
    visitorName: "Visitor34",
    customerIdentifier: "–",
    visitorAlias: "需要 进群的客户",
    status: "replied",
    messageCount: 2,
    owner: "客服主管",
    staffCount: 1,
    tag: "–",
    startedAtLabel: "2026-02-04 16:59",
    startedAtValue: new Date("2026-02-04T16:59:00").getTime(),
    acceptedAtLabel: "2026-02-06 10:16",
    acceptedAtValue: new Date("2026-02-06T10:16:00").getTime(),
    serviceDuration: "29天 7小时 46分",
    rating: "none"
  },
  {
    title: "新的会话",
    visitorName: "Visitor34",
    customerIdentifier: "–",
    visitorAlias: "需要 进群的客户",
    status: "replied",
    messageCount: 2,
    owner: "客服主管",
    staffCount: 1,
    tag: "–",
    startedAtLabel: "2026-02-04 16:56",
    startedAtValue: new Date("2026-02-04T16:56:00").getTime(),
    acceptedAtLabel: "2026-02-04 16:56",
    acceptedAtValue: new Date("2026-02-04T16:56:00").getTime(),
    serviceDuration: "31天 1小时 6分",
    rating: "none"
  },
  {
    title: "新的会话",
    visitorName: "Visitor34",
    customerIdentifier: "–",
    visitorAlias: "需要 进群的客户",
    status: "closed",
    messageCount: 2,
    owner: "客服主管",
    staffCount: 1,
    tag: "–",
    startedAtLabel: "2026-02-04 16:41",
    startedAtValue: new Date("2026-02-04T16:41:00").getTime(),
    acceptedAtLabel: "2026-02-04 16:41",
    acceptedAtValue: new Date("2026-02-04T16:41:20").getTime(),
    serviceDuration: "20秒",
    rating: "none"
  },
  {
    title: "新的会话",
    visitorName: "Visitor49",
    customerIdentifier: "–",
    visitorAlias: "–",
    status: "replied",
    messageCount: 7,
    owner: "客服主管",
    staffCount: 1,
    tag: "–",
    startedAtLabel: "2026-02-03 16:32",
    startedAtValue: new Date("2026-02-03T16:32:00").getTime(),
    acceptedAtLabel: "2026-02-07 11:47",
    acceptedAtValue: new Date("2026-02-07T11:47:00").getTime(),
    serviceDuration: "28天 6小时 15分",
    rating: "none"
  },
  {
    title: "新的会话",
    visitorName: "Visitor18",
    customerIdentifier: "–",
    visitorAlias: "–",
    status: "pending-reply",
    messageCount: 3,
    owner: "–",
    staffCount: 0,
    tag: "VIP",
    startedAtLabel: "2026-02-02 18:02",
    startedAtValue: new Date("2026-02-02T18:02:00").getTime(),
    acceptedAtLabel: "–",
    acceptedAtValue: null,
    serviceDuration: "–",
    rating: "none"
  },
  {
    title: "新的会话",
    visitorName: "Visitor62",
    customerIdentifier: "VIP-2038",
    visitorAlias: "老客户跟进",
    status: "replied",
    messageCount: 9,
    owner: "王珂",
    staffCount: 1,
    tag: "续费",
    startedAtLabel: "2026-01-30 10:21",
    startedAtValue: new Date("2026-01-30T10:21:00").getTime(),
    acceptedAtLabel: "2026-02-24 17:16",
    acceptedAtValue: new Date("2026-02-24T17:16:00").getTime(),
    serviceDuration: "11天 46分",
    rating: "none"
  }
];

const targetStatusCount: Record<ConversationStatus, number> = {
  "pending-reply": 2,
  queueing: 10,
  processing: 0,
  replied: 49,
  closed: 6
};

const buildRemainingStatuses = () => {
  const remainingCount = { ...targetStatusCount };

  for (const seed of presetSeeds) {
    remainingCount[seed.status] -= 1;
  }

  const order: ConversationStatus[] = ["replied", "queueing", "replied", "replied", "closed", "queueing", "pending-reply"];
  const items: ConversationStatus[] = [];

  while (items.length < 67 - presetSeeds.length) {
    for (const status of order) {
      if (remainingCount[status] > 0) {
        items.push(status);
        remainingCount[status] -= 1;
      }
      if (items.length >= 67 - presetSeeds.length) {
        break;
      }
    }
  }

  return items;
};

const allRows = ref<ConversationRecord[]>([
  ...presetSeeds.map((seed, index) => createRecord(index, seed)),
  ...buildRemainingStatuses().map((status, index) =>
    createRecord(index + presetSeeds.length, {
      status,
      visitorAlias: status === "queueing" || status === "pending-reply" ? aliasPool[(index + 1) % aliasPool.length] : aliasPool[(index + 2) % aliasPool.length],
      rating: status === "closed" && index % 2 === 0 ? "satisfied" : "none"
    })
  )
]);

const tagOptions = computed(() => [...new Set(allRows.value.map((row) => row.tag).filter((value) => value !== "–"))]);
const ownerOptions = computed(() => [...new Set(allRows.value.map((row) => row.owner).filter((value) => value !== "–"))]);

const summaryStats = computed(() => {
  const uniqueVisitors = new Set(allRows.value.map((row) => row.visitorName)).size;
  return [
    { key: "total", label: "总会话数", value: allRows.value.length },
    { key: "pending-reply", label: "待回复", value: allRows.value.filter((row) => row.status === "pending-reply").length },
    { key: "queueing", label: "排队中", value: allRows.value.filter((row) => row.status === "queueing").length },
    { key: "processing", label: "待处理", value: allRows.value.filter((row) => row.status === "processing").length },
    { key: "replied", label: "已回复", value: allRows.value.filter((row) => row.status === "replied").length },
    { key: "closed", label: "已关闭", value: allRows.value.filter((row) => row.status === "closed").length },
    { key: "visitor", label: "访客数量", value: uniqueVisitors }
  ];
});

const visibleRows = computed(() => {
  const filters = appliedFilters.value;
  const keyword = filters.keyword.trim().toLowerCase();

  const rows = allRows.value.filter((row) => {
    const fieldValue = String(row[filters.searchField]).toLowerCase();
    if (keyword && !fieldValue.includes(keyword)) {
      return false;
    }
    if (filters.tag !== "all" && row.tag !== filters.tag) {
      return false;
    }
    if (filters.owner !== "all" && row.owner !== filters.owner) {
      return false;
    }
    if (filters.status !== "all" && row.status !== filters.status) {
      return false;
    }
    if (filters.rating !== "all" && row.rating !== filters.rating) {
      return false;
    }
    if (filters.startedDate && !row.startedAtLabel.startsWith(filters.startedDate)) {
      return false;
    }
    return true;
  });

  return [...rows].sort((left, right) => {
    const leftValue = sortKey.value === "startedAt" ? left.startedAtValue : left.acceptedAtValue;
    const rightValue = sortKey.value === "startedAt" ? right.startedAtValue : right.acceptedAtValue;

    if (leftValue === null && rightValue === null) return 0;
    if (leftValue === null) return 1;
    if (rightValue === null) return -1;

    return sortOrder.value === "asc" ? leftValue - rightValue : rightValue - leftValue;
  });
});

const previewConversation = computed(() => allRows.value.find((row) => row.id === previewConversationId.value) ?? null);
const pendingAssignConversation = computed(() => allRows.value.find((row) => row.id === pendingAssignConversationId.value) ?? null);
const assignableAgents = computed(() => {
  const keyword = assignKeyword.value.trim().toLowerCase();
  return archiveAgentPool
    .filter((agent) => keyword.length === 0 || agent.name.toLowerCase().includes(keyword))
    .sort((left, right) => (left.online === right.online ? 0 : left.online ? -1 : 1));
});

const getVisitorAvatarProfile = (name: string) => ({
  avatarText: name.slice(0, 1).toUpperCase() || "访",
  avatarColor: "linear-gradient(135deg, #64748b 0%, #94a3b8 100%)"
});

const toTime = (label: string) => {
  if (!label || label === "–") {
    return "--:--";
  }

  const parts = label.split(" ");
  return label.includes(" ") ? parts[parts.length - 1] ?? label : label;
};

const getVisitorQuestion = (row: ConversationRecord) => {
  if (row.title.includes("配送") || row.title.includes("物流")) {
    return "下单后多久能收到？有加急选项吗？";
  }
  if (row.title.includes("退款")) {
    return "退款已经提交几天了，想确认一下目前进度。";
  }
  if (row.title.includes("发票")) {
    return "发票抬头我改过了，但下载出来还是旧的。";
  }
  if (row.title.includes("活动") || row.title.includes("报名")) {
    return "我想确认一下活动报名后的后续安排。";
  }
  if (row.title.includes("Inquiry")) {
    return "Hi, I have a few questions about your service plan.";
  }
  return `我想咨询一下「${row.title}」这个问题。`;
};

const getAgentReply = (row: ConversationRecord) => {
  if (row.owner === aiAgentArchiveName) {
    return "您好，标准配送通常在 3-5 个工作日送达；若收货地址支持加急，结算页会显示加急配送选项。";
  }
  if (row.title.includes("退款")) {
    return "您好，已为您核实，退款申请目前仍在财务审核中，预计 1-2 个工作日到账。";
  }
  if (row.title.includes("发票")) {
    return "已收到，我先帮您核对发票配置和缓存状态，请稍等。";
  }
  return `您好，已收到您关于「${row.title}」的咨询，我先帮您核查一下。`;
};

const previewConversationMessages = computed<ArchivePreviewMessage[]>(() => {
  const row = previewConversation.value;
  if (!row) {
    return [];
  }

  const visitor = getVisitorAvatarProfile(row.visitorName);
  const owner = row.owner !== "–" ? getArchiveAgentProfile(row.owner) : null;
  const startTime = toTime(row.startedAtLabel);
  const acceptTime = row.acceptedAtLabel !== "–" ? toTime(row.acceptedAtLabel) : startTime;

  if (row.owner === aiAgentArchiveName) {
    return [
      {
        id: `${row.id}-c1`,
        role: "customer",
        sender: row.visitorName,
        content: "下单后多久能收到？有加急选项吗？",
        time: startTime,
        avatarText: visitor.avatarText,
        avatarColor: visitor.avatarColor
      },
      {
        id: `${row.id}-a1`,
        role: "agent",
        sender: aiAgentArchiveName,
        content: "您好！标准配送一般在 3-5 个工作日内送达。如果地址支持加急，结算页会显示「加急配送」选项。",
        time: acceptTime,
        avatarText: owner?.avatarText,
        avatarColor: owner?.avatarColor,
        avatarUrl: owner?.avatarUrl
      },
      {
        id: `${row.id}-c2`,
        role: "customer",
        sender: row.visitorName,
        content: "加急配送支持哪些地区？",
        time: acceptTime,
        avatarText: visitor.avatarText,
        avatarColor: visitor.avatarColor
      },
      {
        id: `${row.id}-a2`,
        role: "agent",
        sender: aiAgentArchiveName,
        content: "目前覆盖大部分主要城市。您在下单页输入地址后，系统会自动判断是否支持加急配送。",
        time: acceptTime,
        avatarText: owner?.avatarText,
        avatarColor: owner?.avatarColor,
        avatarUrl: owner?.avatarUrl
      }
    ];
  }

  if (row.owner === "–") {
    return [
      {
        id: `${row.id}-sys`,
        role: "system",
        sender: "系统",
        content: "当前会话尚未分配客服",
        time: startTime
      },
      {
        id: `${row.id}-c1`,
        role: "customer",
        sender: row.visitorName,
        content: getVisitorQuestion(row),
        time: startTime,
        avatarText: visitor.avatarText,
        avatarColor: visitor.avatarColor
      }
    ];
  }

  const messages: ArchivePreviewMessage[] = [
    {
      id: `${row.id}-c1`,
      role: "customer",
      sender: row.visitorName,
      content: getVisitorQuestion(row),
      time: startTime,
      avatarText: visitor.avatarText,
      avatarColor: visitor.avatarColor
    },
    {
      id: `${row.id}-a1`,
      role: "agent",
      sender: row.owner,
      content: getAgentReply(row),
      time: acceptTime,
      avatarText: owner?.avatarText,
      avatarColor: owner?.avatarColor,
      avatarUrl: owner?.avatarUrl
    }
  ];

  if (row.status === "replied") {
    messages.push({
      id: `${row.id}-c2`,
      role: "customer",
      sender: row.visitorName,
      content: "好的，明白了，谢谢。",
      time: acceptTime,
      avatarText: visitor.avatarText,
      avatarColor: visitor.avatarColor
    });
  }

  if (row.status === "closed") {
    messages.push({
      id: `${row.id}-sys2`,
      role: "system",
      sender: "系统",
      content: "会话已结束",
      time: acceptTime
    });
  }

  return messages;
});

const applyFilters = () => {
  appliedFilters.value = { ...draftFilters };
  openActionMenuId.value = null;
};

const resetFilters = () => {
  const nextFilters = createDefaultFilters();
  Object.assign(draftFilters, nextFilters);
  appliedFilters.value = nextFilters;
  sortKey.value = "startedAt";
  sortOrder.value = "desc";
  openActionMenuId.value = null;
};

const toggleSort = (key: SortKey) => {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === "desc" ? "asc" : "desc";
    return;
  }
  sortKey.value = key;
  sortOrder.value = "desc";
};

const toggleActionMenu = (rowId: string) => {
  openActionMenuId.value = openActionMenuId.value === rowId ? null : rowId;
};

const closeActionMenu = () => {
  openActionMenuId.value = null;
};

const assignConversation = (row: ConversationRecord) => {
  closeActionMenu();
  pendingAssignConversationId.value = row.id;
  assignKeyword.value = "";
  assignModalOpen.value = true;
};

const openConversation = (row: ConversationRecord) => {
  closeActionMenu();
  previewConversationId.value = row.id;
};

// Title editing methods
const startEditTitle = (row: ConversationRecord) => {
  editingRowId.value = row.id;
  editDraftTitle.value = row.title;
  nextTick(() => {
    editTitleInputRef.value?.focus();
  });
};

const confirmEditTitle = () => {
  const nextTitle = editDraftTitle.value.trim();
  if (!nextTitle || !editingRowId.value) {
    cancelEditTitle();
    return;
  }
  allRows.value = allRows.value.map((row) =>
    row.id === editingRowId.value ? { ...row, title: nextTitle } : row
  );
  editingRowId.value = null;
  editDraftTitle.value = "";
  emit("toast", "保存成功");
};

const cancelEditTitle = () => {
  editingRowId.value = null;
  editDraftTitle.value = "";
};

const handleDrawerTitleUpdate = (newTitle: string) => {
  if (!previewConversationId.value) return;
  allRows.value = allRows.value.map((row) =>
    row.id === previewConversationId.value ? { ...row, title: newTitle } : row
  );
  emit("toast", "保存成功");
};

// Tag popover methods
const openTagPopover = (rowId: string) => {
  tagPopoverRowId.value = tagPopoverRowId.value === rowId ? null : rowId;
  tagSearchKeyword.value = "";
};

const closeTagPopover = () => {
  tagPopoverRowId.value = null;
  tagSearchKeyword.value = "";
};

const filteredTagPool = computed(() => {
  const keyword = tagSearchKeyword.value.trim().toLowerCase();
  if (!keyword) return allTagPool;
  return allTagPool.filter(t => t.toLowerCase().includes(keyword));
});

const toggleRowTag = (rowId: string, tagName: string) => {
  allRows.value = allRows.value.map((row) => {
    if (row.id !== rowId) return row;
    const has = row.tags.includes(tagName);
    const nextTags = has ? row.tags.filter(t => t !== tagName) : [...row.tags, tagName];
    return { ...row, tags: nextTags, tag: nextTags[0] ?? "–" };
  });
};

const createAndAddTag = (rowId: string) => {
  const tagName = tagSearchKeyword.value.trim();
  if (!tagName) return;
  if (!allTagPool.includes(tagName)) {
    allTagPool.push(tagName);
  }
  toggleRowTag(rowId, tagName);
  tagSearchKeyword.value = "";
};

// Assign to self
const assignToSelf = (row: ConversationRecord) => {
  const selfAgent = archiveAgentPool[0]; // 客服主管
  const now = new Date();
  allRows.value = allRows.value.map((r) => {
    if (r.id !== row.id) return r;
    return {
      ...r,
      owner: selfAgent.name,
      staffCount: Math.max(r.staffCount, 1),
      staffAgents: r.staffAgents.find(a => a.name === selfAgent.name)
        ? r.staffAgents
        : [...r.staffAgents, { name: selfAgent.name, avatarText: selfAgent.avatarText, avatarColor: selfAgent.avatarColor, role: "客服" }],
      acceptedAtLabel: r.acceptedAtLabel === "–" ? formatDateTime(now) : r.acceptedAtLabel,
      acceptedAtValue: r.acceptedAtValue ?? now.getTime(),
      status: r.status === "queueing" ? "pending-reply" : r.status
    };
  });
  emit("toast", `已将会话分配给${selfAgent.name}`);
};

// Confirm dialog methods
const openConfirmDialog = (title: string, desc: string, callback: () => void) => {
  confirmDialogTitle.value = title;
  confirmDialogDesc.value = desc;
  confirmDialogCallback.value = callback;
  confirmDialogOpen.value = true;
};

const closeConfirmDialog = () => {
  confirmDialogOpen.value = false;
  confirmDialogTitle.value = "";
  confirmDialogDesc.value = "";
  confirmDialogCallback.value = null;
};

const handleConfirmDialog = () => {
  confirmDialogCallback.value?.();
  closeConfirmDialog();
};

// Non-admin: "分配给我" with confirmation
const confirmAssignToSelf = (row: ConversationRecord) => {
  closeActionMenu();
  openConfirmDialog("确认分配", "确定把该会话分配给我吗？", () => {
    assignToSelf(row);
  });
};

// "接管会话" / "分配会话" with role-based logic
const handleTakeoverOrAssign = (row: ConversationRecord) => {
  closeActionMenu();
  if (row.owner === aiAgentArchiveName) {
    // 接管会话
    if (isAdmin.value) {
      // Admin: open assign modal to choose agent
      pendingAssignConversationId.value = row.id;
      assignKeyword.value = "";
      assignModalOpen.value = true;
    } else {
      // Non-admin: confirm takeover to self
      openConfirmDialog("确认接管", "确认接管该会话吗？", () => {
        assignToSelf(row);
      });
    }
  } else {
    // 分配会话
    assignConversation(row);
  }
};

const closeConversationDrawer = () => {
  previewConversationId.value = null;
};

const closeAssignModal = () => {
  assignModalOpen.value = false;
  assignKeyword.value = "";
  pendingAssignConversationId.value = null;
};

const handleAssignConfirm = (agentId: string) => {
  const rowId = pendingAssignConversationId.value;
  const agent = archiveAgentPool.find((item) => item.id === agentId);
  if (!rowId || !agent) {
    return;
  }

  const now = new Date();
  const acceptedAtLabel = formatDateTime(now);
  const acceptedAtValue = now.getTime();

  allRows.value = allRows.value.map((row) => {
    if (row.id !== rowId) {
      return row;
    }

    return {
      ...row,
      owner: agent.name,
      staffCount: Math.max(row.staffCount, 1),
      staffAgents: row.staffAgents.find(a => a.name === agent.name)
        ? row.staffAgents
        : [...row.staffAgents, { name: agent.name, avatarText: agent.avatarText, avatarColor: agent.avatarColor, role: "客服" }],
      acceptedAtLabel: row.acceptedAtLabel === "–" ? acceptedAtLabel : row.acceptedAtLabel,
      acceptedAtValue: row.acceptedAtValue ?? acceptedAtValue,
      status: row.status === "queueing" ? "pending-reply" : row.status
    };
  });

  closeAssignModal();
  emit("toast", `已将会话分配给${agent.name}`);
};

// --- All Chats (所有聊天) ---

type ChatSearchField = "title" | "owner";
type ChatType = "single" | "group";
type ChatStatus = "active" | "dissolved";
type ChatCategory = "external" | "internal";
type ChatSortKey = "messageCount" | "startedAt" | "updatedAt";

interface ChatMember {
  name: string;
  avatarText: string;
  avatarColor: string;
  avatarUrl?: string;
  role: "owner" | "staff" | "visitor";
  online?: boolean;
  nickname?: string;
  email?: string;
  // visitor-specific fields
  alias?: string;
  phone?: string;
  relatedCustomer?: string;
  landingPage?: string;
  sessionCount?: number;
  visitHistory?: { title: string; url: string; time: string; duration: string; online: boolean }[];
  ip?: string;
  os?: string;
  browser?: string;
}

interface ChatRecord {
  id: string;
  title: string;
  chatType: ChatType;
  status: ChatStatus;
  category: ChatCategory;
  messageCount: number;
  owner: string;
  visitorCount: number;
  staffCount: number;
  ownerMember: ChatMember | null;
  visitorMembers: ChatMember[];
  staffMembers: ChatMember[];
  startedAtLabel: string;
  startedAtValue: number;
  updatedAtLabel: string;
  updatedAtValue: number;
}

interface ChatFilterState {
  searchField: ChatSearchField;
  keyword: string;
  messageCount: string;
  owner: string;
  chatType: string;
  status: string;
  category: string;
  startedDate: string;
  updatedDate: string;
}

const createDefaultChatFilters = (): ChatFilterState => ({
  searchField: "title",
  keyword: "",
  messageCount: "all",
  owner: "all",
  chatType: "all",
  status: "all",
  category: "all",
  startedDate: "",
  updatedDate: ""
});

const chatDraftFilters = reactive<ChatFilterState>(createDefaultChatFilters());
const appliedChatFilters = ref<ChatFilterState>(createDefaultChatFilters());
const chatSortKey = ref<ChatSortKey>("startedAt");
const chatSortOrder = ref<SortOrder>("desc");
const openChatActionMenuId = ref<string | null>(null);
const chatCurrentPage = ref(1);
const chatPageSize = ref(20);

// Chat drawer (聊天记录面板)
const chatDrawerRowId = ref<string | null>(null);

// Chat member panel (inline, shared for visitor and staff columns)
const chatMemberPanelRowId = ref<string | null>(null);

const visitorAvatarColors = [
  "linear-gradient(135deg, #ff6b6b 0%, #ff9a76 100%)",
  "linear-gradient(135deg, #ffa726 0%, #ffcc80 100%)",
  "linear-gradient(135deg, #66bb6a 0%, #a5d6a7 100%)",
  "linear-gradient(135deg, #42a5f5 0%, #90caf9 100%)",
  "linear-gradient(135deg, #ab47bc 0%, #ce93d8 100%)",
  "linear-gradient(135deg, #ef5350 0%, #ef9a9a 100%)",
  "linear-gradient(135deg, #26c6da 0%, #80deea 100%)"
];

const buildChatOwnerMember = (ownerName: string): ChatMember | null => {
  if (!ownerName || ownerName === "–") return null;
  const profile = getArchiveAgentProfile(ownerName);
  const agent = archiveAgentPool.find(a => a.name === ownerName);
  return {
    name: ownerName,
    avatarText: profile.avatarText,
    avatarColor: profile.avatarColor,
    avatarUrl: profile.avatarUrl || undefined,
    role: "owner",
    online: agent?.online ?? true,
    nickname: ownerName,
    email: `${ownerName.replace(/\s/g, "").toLowerCase()}@company.com`
  };
};

const buildChatVisitorMembers = (count: number, chatId: string): ChatMember[] => {
  const members: ChatMember[] = [];
  const aliasPool = ["需要进群的客户", "重点回访客户", "需要二次联系", "老客户跟进", "VIP客户"];
  const namePool = ["微微", "小明", "Alice", "张三", "李四"];
  const phonePool = ["18133093890", "13800138000", "15912345678", "17600001111", "13566778899"];
  const emailPool = ["aidanswang@gmail.com", "xiaoming@qq.com", "alice@outlook.com", "zhangsan@163.com", "lisi@gmail.com"];
  const osPool = ["Windows 11", "macOS 14", "Windows 10", "Ubuntu 22.04", "macOS 15"];
  const browserPool = ["Chrome 133", "Safari 18", "Firefox 128", "Edge 131", "Chrome 132"];
  const ipPool = ["192.169.0.23", "10.0.1.55", "172.16.0.102", "192.168.1.88", "10.10.5.12"];

  for (let i = 0; i < count; i++) {
    const idx = (chatId.charCodeAt(chatId.length - 1) + i) % visitorAvatarColors.length;
    const visitorNum = (i + 1) * 10 + parseInt(chatId.replace(/\D/g, "") || "0") % 100;
    const seed = (visitorNum + i) % 5;
    members.push({
      name: `Visitor${visitorNum}`,
      avatarText: `V${i + 1}`,
      avatarColor: visitorAvatarColors[idx],
      role: "visitor",
      online: i % 3 !== 2,
      nickname: namePool[seed],
      email: emailPool[seed],
      alias: aliasPool[seed],
      phone: phonePool[seed],
      relatedCustomer: `${100000 + visitorNum}`,
      landingPage: "https://www.twt.com/sho...",
      sessionCount: 3 + (visitorNum % 8),
      visitHistory: [
        { title: "Chat with us", url: "https://visitorchat.twt.com...", time: "2026-02-24 16:09", duration: "1天 2小时 30分", online: true },
        { title: "Chat with us", url: "https://visitorchat.twt.com...", time: "2026-02-05 19:34", duration: "1分 14秒", online: false },
        { title: "Chat with us", url: "https://visitorchat.twt.com...", time: "2026-02-05 19:34", duration: "3秒", online: false }
      ],
      ip: ipPool[seed],
      os: osPool[seed],
      browser: browserPool[seed]
    });
  }
  return members;
};

const buildChatStaffMembers = (count: number, ownerName: string, chatIndex: number): ChatMember[] => {
  const members: ChatMember[] = [];
  for (let i = 0; i < count; i++) {
    const agentName = ownerPool[(chatIndex + i) % ownerPool.length];
    if (agentName === ownerName) continue;
    const profile = getArchiveAgentProfile(agentName);
    const agent = archiveAgentPool.find(a => a.name === agentName);
    members.push({
      name: agentName,
      avatarText: profile.avatarText,
      avatarColor: profile.avatarColor,
      role: "staff",
      online: agent?.online ?? true,
      nickname: agentName,
      email: `${agentName.replace(/\s/g, "").toLowerCase()}@company.com`
    });
    if (members.length >= count) break;
  }
  // Fill remaining if we skipped owner
  while (members.length < count) {
    const agentName = ownerPool[(chatIndex + members.length + count) % ownerPool.length];
    if (agentName !== ownerName && !members.find(m => m.name === agentName)) {
      const profile = getArchiveAgentProfile(agentName);
      const agent = archiveAgentPool.find(a => a.name === agentName);
      members.push({
        name: agentName,
        avatarText: profile.avatarText,
        avatarColor: profile.avatarColor,
        role: "staff",
        online: agent?.online ?? true,
        nickname: agentName,
        email: `${agentName.replace(/\s/g, "").toLowerCase()}@company.com`
      });
    } else {
      break;
    }
  }
  return members;
};

const allChatRows = ref<ChatRecord[]>([
  {
    id: "chat-1",
    title: "\u771F\u9F99\u4E0EVisitor19\u7684\u804A\u5929",
    chatType: "single",
    status: "active",
    category: "external",
    messageCount: 0,
    owner: "\u771F\u9F99",
    visitorCount: 1,
    staffCount: 1,
    ownerMember: buildChatOwnerMember("\u771F\u9F99"),
    visitorMembers: buildChatVisitorMembers(1, "chat-1"),
    staffMembers: buildChatStaffMembers(1, "\u771F\u9F99", 0),
    startedAtLabel: "2026-03-09 17:20:45",
    startedAtValue: new Date("2026-03-09T17:20:45").getTime(),
    updatedAtLabel: "2026-03-09 17:20:45",
    updatedAtValue: new Date("2026-03-09T17:20:45").getTime()
  },
  {
    id: "chat-2",
    title: "1\u597D\u70E6\u597D\u70E6\u597D\u70E6\u662F\u4E39\u6C5F\u53E3\u5E02\u7684...",
    chatType: "single",
    status: "active",
    category: "internal",
    messageCount: 0,
    owner: "1\u597D\u70E6\u597D\u70E6\u597D...",
    visitorCount: 0,
    staffCount: 2,
    ownerMember: buildChatOwnerMember("1\u597D\u70E6\u597D\u70E6\u597D..."),
    visitorMembers: [],
    staffMembers: buildChatStaffMembers(2, "1\u597D\u70E6\u597D\u70E6\u597D...", 1),
    startedAtLabel: "2026-03-09 14:18:24",
    startedAtValue: new Date("2026-03-09T14:18:24").getTime(),
    updatedAtLabel: "2026-03-09 14:18:24",
    updatedAtValue: new Date("2026-03-09T14:18:24").getTime()
  },
  {
    id: "chat-3",
    title: "\u771F\u9F99\u4E0EVisitor3\u7684\u804A\u5929",
    chatType: "single",
    status: "active",
    category: "external",
    messageCount: 0,
    owner: "\u771F\u9F99",
    visitorCount: 1,
    staffCount: 1,
    ownerMember: buildChatOwnerMember("\u771F\u9F99"),
    visitorMembers: buildChatVisitorMembers(1, "chat-3"),
    staffMembers: buildChatStaffMembers(1, "\u771F\u9F99", 2),
    startedAtLabel: "2026-03-06 10:25:15",
    startedAtValue: new Date("2026-03-06T10:25:15").getTime(),
    updatedAtLabel: "2026-03-06 10:25:15",
    updatedAtValue: new Date("2026-03-06T10:25:15").getTime()
  }
]);

const chatOwnerOptions = computed(() => [...new Set(allChatRows.value.map((r) => r.owner))]);

const chatSummaryStats = computed(() => {
  const total = allChatRows.value.length;
  const single = allChatRows.value.filter((r) => r.chatType === "single").length;
  const group = allChatRows.value.filter((r) => r.chatType === "group").length;
  const active = allChatRows.value.filter((r) => r.status === "active").length;
  const dissolved = allChatRows.value.filter((r) => r.status === "dissolved").length;
  return [
    { key: "total", label: "\u603B\u804A\u5929\u6570", value: total },
    { key: "single", label: "\u5355\u804A\u6570", value: single },
    { key: "group", label: "\u7FA4\u804A\u6570", value: group },
    { key: "active", label: "\u6D3B\u8DC3", value: active },
    { key: "dissolved", label: "\u89E3\u6563", value: dissolved }
  ];
});

const visibleChatRows = computed(() => {
  const filters = appliedChatFilters.value;
  const keyword = filters.keyword.trim().toLowerCase();

  const rows = allChatRows.value.filter((row) => {
    if (keyword) {
      const fieldValue = String(row[filters.searchField]).toLowerCase();
      if (!fieldValue.includes(keyword)) return false;
    }
    if (filters.chatType !== "all" && row.chatType !== filters.chatType) return false;
    if (filters.status !== "all" && row.status !== filters.status) return false;
    if (filters.category !== "all" && row.category !== filters.category) return false;
    if (filters.owner !== "all" && row.owner !== filters.owner) return false;
    if (filters.messageCount !== "all") {
      if (filters.messageCount === "0" && row.messageCount !== 0) return false;
      if (filters.messageCount === "1-10" && (row.messageCount < 1 || row.messageCount > 10)) return false;
      if (filters.messageCount === "10+" && row.messageCount <= 10) return false;
    }
    if (filters.startedDate && !row.startedAtLabel.startsWith(filters.startedDate)) return false;
    if (filters.updatedDate && !row.updatedAtLabel.startsWith(filters.updatedDate)) return false;
    return true;
  });

  return [...rows].sort((a, b) => {
    let aVal: number;
    let bVal: number;
    if (chatSortKey.value === "messageCount") {
      aVal = a.messageCount;
      bVal = b.messageCount;
    } else if (chatSortKey.value === "updatedAt") {
      aVal = a.updatedAtValue;
      bVal = b.updatedAtValue;
    } else {
      aVal = a.startedAtValue;
      bVal = b.startedAtValue;
    }
    return chatSortOrder.value === "asc" ? aVal - bVal : bVal - aVal;
  });
});

const chatTotalPages = computed(() => Math.max(1, Math.ceil(visibleChatRows.value.length / chatPageSize.value)));

const paginatedChatRows = computed(() => {
  const start = (chatCurrentPage.value - 1) * chatPageSize.value;
  return visibleChatRows.value.slice(start, start + chatPageSize.value);
});

const applyChatFilters = () => {
  appliedChatFilters.value = { ...chatDraftFilters };
  chatCurrentPage.value = 1;
  openChatActionMenuId.value = null;
};

const resetChatFilters = () => {
  const next = createDefaultChatFilters();
  Object.assign(chatDraftFilters, next);
  appliedChatFilters.value = next;
  chatSortKey.value = "startedAt";
  chatSortOrder.value = "desc";
  chatCurrentPage.value = 1;
  openChatActionMenuId.value = null;
};

const toggleChatSort = (key: ChatSortKey) => {
  if (chatSortKey.value === key) {
    chatSortOrder.value = chatSortOrder.value === "desc" ? "asc" : "desc";
    return;
  }
  chatSortKey.value = key;
  chatSortOrder.value = "desc";
};

const toggleChatActionMenu = (rowId: string) => {
  openChatActionMenuId.value = openChatActionMenuId.value === rowId ? null : rowId;
};

const closeChatActionMenu = () => {
  openChatActionMenuId.value = null;
};

const chatDrawerRow = computed(() => allChatRows.value.find(r => r.id === chatDrawerRowId.value) ?? null);

const chatDrawerMessages = computed<ArchivePreviewMessage[]>(() => {
  const row = chatDrawerRow.value;
  if (!row) return [];

  const ownerProfile = row.ownerMember
    ? { avatarText: row.ownerMember.avatarText, avatarColor: row.ownerMember.avatarColor, avatarUrl: row.ownerMember.avatarUrl }
    : { avatarText: "客", avatarColor: "linear-gradient(135deg, #2f6bff 0%, #69a1ff 100%)", avatarUrl: undefined };

  const visitorProfile = row.visitorMembers.length > 0
    ? { avatarText: row.visitorMembers[0].avatarText, avatarColor: row.visitorMembers[0].avatarColor }
    : { avatarText: "V", avatarColor: "linear-gradient(135deg, #ff6b6b 0%, #ff9a76 100%)" };

  return [
    ...(row.visitorMembers.length > 0 ? [{
      id: `${row.id}-v1`,
      role: "customer" as const,
      sender: row.visitorMembers[0].name,
      content: "你好，请问有人在吗？",
      time: row.startedAtLabel.split(" ")[1] || "10:00",
      avatarText: visitorProfile.avatarText,
      avatarColor: visitorProfile.avatarColor
    }] : []),
    {
      id: `${row.id}-a1`,
      role: "agent" as const,
      sender: row.owner,
      content: "你好，请问有什么可以帮您？",
      time: row.startedAtLabel.split(" ")[1] || "10:01",
      avatarText: ownerProfile.avatarText,
      avatarColor: ownerProfile.avatarColor,
      avatarUrl: ownerProfile.avatarUrl
    }
  ];
});

const openChatDrawer = (row: ChatRecord) => {
  closeChatActionMenu();
  chatDrawerRowId.value = row.id;
};

const closeChatDrawer = () => {
  chatDrawerRowId.value = null;
};

const handleChatDrawerAssign = () => {
  if (chatDrawerRow.value) {
    emit("toast", "\u67E5\u770B\u804A\u5929\u201C" + chatDrawerRow.value.title + "\u201D");
  }
};

const toggleChatMemberPanel = (rowId: string) => {
  chatMemberPanelRowId.value = chatMemberPanelRowId.value === rowId ? null : rowId;
};

const closeChatMemberPanel = () => {
  chatMemberPanelRowId.value = null;
};

const openChat = (row: ChatRecord) => {
  closeChatActionMenu();
  emit("toast", "\u67E5\u770B\u804A\u5929\u201C" + row.title + "\u201D");
};

onMounted(() => {
  const handleGlobalClick = () => {
    closeActionMenu();
    closeChatActionMenu();
    closeTagPopover();
    closeStaffPanel();
    closeChatMemberPanel();
  };
  window.addEventListener("click", handleGlobalClick);
  onBeforeUnmount(() => {
    window.removeEventListener("click", handleGlobalClick);
  });
});
</script>

<style scoped>
.files-page {
  height: 100%;
}

.files-page__card,
.files-page__placeholder {
  background: #ffffff;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  gap: 22px;
  height: 100%;
  min-height: 0;
  padding: 24px 32px 28px;
}

.files-page__header {
  align-items: center;
  display: flex;
  justify-content: space-between;
}

.files-page__title {
  color: #222222;
  font-size: 20px;
  font-weight: var(--agent-font-weight-semibold);
  line-height: 1.2;
  margin: 0;
}

.summary-banner {
  align-items: stretch;
  background: linear-gradient(90deg, #eef4ff 0%, #edf5ff 66%, #eef5ff 100%);
  border-radius: 30px;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 380px;
  min-height: 194px;
  overflow: hidden;
  position: relative;
}

.summary-banner__stats {
  display: grid;
  gap: 18px 20px;
  grid-template-columns: repeat(7, minmax(80px, 1fr));
  padding: 36px 32px;
}

.summary-banner__value {
  color: #222222;
  font-size: 34px;
  font-weight: 600;
  line-height: 1;
  margin: 0 0 14px;
  text-align: center;
}

.summary-banner__label {
  color: #4c5563;
  font-size: 16px;
  line-height: 1.3;
  margin: 0;
  text-align: center;
}

.summary-banner__visual {
  min-height: 194px;
  position: relative;
}

.summary-banner__ring {
  border: 1px solid rgba(164, 203, 255, 0.6);
  border-radius: 50%;
  position: absolute;
}

.summary-banner__ring--outer {
  height: 320px;
  right: -86px;
  top: 24px;
  width: 320px;
}

.summary-banner__ring--inner {
  height: 256px;
  right: -12px;
  top: 54px;
  width: 256px;
}

.summary-banner__planet {
  background: radial-gradient(circle at 34% 30%, #ffffff 0%, #a8c1ff 38%, #7198ff 62%, #dce8ff 100%);
  border-radius: 50%;
  box-shadow: 0 16px 30px rgba(96, 142, 255, 0.2);
  height: 82px;
  left: 150px;
  position: absolute;
  top: 66px;
  width: 82px;
}

.summary-banner__planet::before,
.summary-banner__planet::after {
  background: rgba(255, 255, 255, 0.85);
  border-radius: 50%;
  content: "";
  position: absolute;
}

.summary-banner__planet::before {
  height: 32px;
  left: -34px;
  top: 12px;
  width: 32px;
}

.summary-banner__planet::after {
  height: 40px;
  right: -36px;
  top: 18px;
  width: 40px;
}

.summary-banner__bubble {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  box-shadow: 0 8px 18px rgba(95, 141, 255, 0.12);
  position: absolute;
}

.summary-banner__bubble--left {
  height: 18px;
  left: 118px;
  top: 102px;
  width: 18px;
}

.summary-banner__bubble--right {
  height: 24px;
  left: 262px;
  top: 74px;
  width: 24px;
}

.summary-banner__spark {
  background: linear-gradient(135deg, #65f0d0 0%, #9dd2ff 100%);
  border-radius: 8px;
  position: absolute;
  transform: rotate(-16deg);
}

.summary-banner__spark--one {
  height: 26px;
  right: 82px;
  top: 100px;
  width: 22px;
}

.summary-banner__spark--two {
  height: 18px;
  right: 136px;
  top: 58px;
  width: 18px;
}

.archive-filters {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.archive-filters__row {
  display: grid;
  gap: 16px;
}

.archive-filters__row--primary {
  grid-template-columns: 140px minmax(220px, 1fr) repeat(3, minmax(180px, 1fr));
}

.archive-filters__row--secondary {
  align-items: center;
  grid-template-columns: minmax(180px, 220px) minmax(220px, 280px) 92px 92px;
}

.archive-field {
  position: relative;
}

.archive-field__control {
  appearance: none;
  background: #ffffff;
  border: 1px solid #dce3ed;
  border-radius: 12px;
  color: #2d3640;
  font-size: 14px;
  height: 44px;
  outline: none;
  padding: 0 14px;
  transition: border-color var(--agent-motion-fast) ease, box-shadow var(--agent-motion-fast) ease;
  width: 100%;
}

.archive-field__control:focus {
  border-color: var(--agent-color-brand-primary);
  box-shadow: 0 0 0 3px rgba(47, 107, 255, 0.08);
}

.archive-field__control--select {
  padding-right: 40px;
}

.archive-field--search .archive-field__control {
  padding-left: 42px;
}

.archive-field__prefix,
.archive-field__suffix {
  color: #97a3b4;
  pointer-events: none;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
}

.archive-field__prefix {
  left: 14px;
}

.archive-field__suffix {
  right: 14px;
}

.archive-field--date {
  position: relative;
}

.archive-field__native-date {
  cursor: pointer;
  inset: 0;
  opacity: 0;
  position: absolute;
  width: 100%;
  z-index: 2;
}

.archive-field__native-date::-webkit-calendar-picker-indicator {
  cursor: pointer;
  height: 100%;
  margin: 0;
  width: 100%;
}

.archive-field__date-display {
  align-items: center;
  display: flex;
  padding-right: 40px;
}

.archive-field__date-display--placeholder {
  color: #97a3b4;
}

.files-page__search-btn,
.files-page__reset-btn {
  height: 44px;
  justify-self: start;
  width: 92px;
}

.files-page__table-wrap {
  border: 1px solid #e3e8f0;
  border-radius: 18px;
  display: flex;
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

.files-page__table-scroll {
  flex: 1;
  min-height: 0;
}

.archive-table {
  border-collapse: separate;
  border-spacing: 0;
  min-width: 1760px;
  width: 100%;
}

.archive-table th,
.archive-table td {
  border-bottom: 1px solid #edf1f5;
  color: #2d3640;
  font-size: 14px;
  line-height: 1.45;
  padding: 18px 22px;
  text-align: left;
  white-space: nowrap;
}

.archive-table th {
  background: #f3f6fa;
  color: #222222;
  font-size: 15px;
  font-weight: var(--agent-font-weight-semibold);
  position: sticky;
  top: 0;
  z-index: 20;
}

.archive-table tbody tr:nth-child(even) td {
  background: #fafbfd;
}

.archive-table__number {
  font-variant-numeric: tabular-nums;
  text-align: center;
}

.archive-table__actions-head,
.archive-table__actions-cell {
  text-align: center;
}

.archive-table__actions-cell {
  position: relative;
}

.archive-table__empty {
  color: #97a3b4;
  padding: 42px 0;
  text-align: center;
}

.archive-link {
  background: transparent;
  border: 0;
  color: #2d3640;
  cursor: pointer;
  font: inherit;
  padding: 0;
  text-decoration: underline;
  text-underline-offset: 3px;
}

.archive-status {
  display: inline-flex;
  font-weight: var(--agent-font-weight-medium);
}

.archive-status--pending-reply {
  color: #2f6bff;
}

.archive-status--queueing {
  color: #ff7a1a;
}

.archive-status--processing {
  color: #8f9aae;
}

.archive-status--replied {
  color: #27c35a;
}

.archive-status--closed {
  color: #8e9cb1;
}

.archive-sort {
  align-items: center;
  background: transparent;
  border: 0;
  color: inherit;
  cursor: pointer;
  display: inline-flex;
  font: inherit;
  gap: 10px;
  padding: 0;
}

.archive-sort__arrows {
  display: inline-flex;
  flex-direction: column;
  gap: 2px;
}

.archive-sort__arrow {
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  height: 0;
  opacity: 0.5;
  transition: opacity var(--agent-motion-fast) ease;
  width: 0;
}

.archive-sort__arrow--up {
  border-bottom: 6px solid #b7bfcc;
}

.archive-sort__arrow--down {
  border-top: 6px solid #b7bfcc;
}

.archive-sort__arrow--active {
  opacity: 1;
}

.archive-action-btn {
  align-items: center;
  background: #f5f7fa;
  border: 0;
  border-radius: 999px;
  cursor: pointer;
  display: inline-flex;
  flex-direction: column;
  gap: 3px;
  height: 34px;
  justify-content: center;
  width: 34px;
}

.archive-action-btn span {
  background: #222222;
  border-radius: 50%;
  display: inline-block;
  height: 3px;
  width: 3px;
}

.archive-action-menu {
  background: #ffffff;
  border: 1px solid #edf1f5;
  border-radius: 20px;
  box-shadow: 0 18px 40px rgba(20, 32, 64, 0.12);
  display: flex;
  flex-direction: column;
  min-width: 142px;
  overflow: hidden;
  position: absolute;
  right: 14px;
  top: calc(100% - 4px);
  z-index: 3;
}

.archive-action-menu__item {
  background: #ffffff;
  border: 0;
  color: #2d3640;
  cursor: pointer;
  font-size: 14px;
  padding: 16px 20px;
  text-align: left;
}

.archive-action-menu__item:hover {
  background: #f7f9fc;
}

/* Title cell with hover edit */
.archive-title-cell {
  align-items: center;
  display: inline-flex;
  gap: 6px;
}

.archive-title-cell__edit-btn {
  align-items: center;
  background: transparent;
  border: 0;
  border-radius: 6px;
  color: #97a3b4;
  cursor: pointer;
  display: inline-flex;
  height: 24px;
  justify-content: center;
  opacity: 0;
  padding: 0;
  transition: opacity var(--agent-motion-fast) ease, color var(--agent-motion-fast) ease;
  width: 24px;
}

.archive-title-cell:hover .archive-title-cell__edit-btn {
  opacity: 1;
}

.archive-title-cell__edit-btn:hover {
  color: var(--agent-color-brand-primary);
}

.archive-title-edit {
  align-items: center;
  display: flex;
  gap: 8px;
}

.archive-title-edit__input {
  border: 1px solid #dce3ed;
  border-radius: 8px;
  font-size: 14px;
  height: 32px;
  min-width: 140px;
  outline: none;
  padding: 0 10px;
}

.archive-title-edit__input:focus {
  border-color: var(--agent-color-brand-primary);
  box-shadow: 0 0 0 2px rgba(47, 107, 255, 0.08);
}

.archive-title-edit__action {
  font-size: 13px;
  height: 30px;
  padding: 0 12px;
}

.files-page__placeholder {
  justify-content: center;
}

.files-page__placeholder-text {
  color: #97a3b4;
  font-size: 14px;
  margin: 0;
}

@media (max-width: 1440px) {
  .files-page__card,
  .files-page__placeholder {
    padding-left: 24px;
    padding-right: 24px;
  }

  .summary-banner {
    grid-template-columns: minmax(0, 1fr) 320px;
  }

  .summary-banner__stats {
    grid-template-columns: repeat(4, minmax(90px, 1fr));
  }

  .summary-banner__item:last-child {
    grid-column: auto;
  }

  .archive-filters__row--primary {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

.summary-banner__stats--chat {
  grid-template-columns: repeat(5, minmax(80px, 1fr));
}

.archive-filters__row--chat-primary {
  grid-template-columns: 140px minmax(220px, 1fr) repeat(3, minmax(160px, 1fr));
}

.archive-filters__row--chat-secondary {
  align-items: center;
  grid-template-columns: minmax(160px, 200px) minmax(160px, 200px) minmax(200px, 260px) minmax(200px, 260px) 92px 92px;
}

.chat-status {
  display: inline-flex;
  font-weight: var(--agent-font-weight-medium);
}

.chat-status--active {
  color: #27c35a;
}

.chat-status--dissolved {
  color: #8e9cb1;
}

.chat-pagination {
  align-items: center;
  display: flex;
  gap: 16px;
  justify-content: flex-end;
  padding-top: 4px;
}

.chat-pagination__total {
  color: #4c5563;
  font-size: 14px;
  margin-right: auto;
}

.chat-pagination__controls {
  align-items: center;
  display: flex;
  gap: 6px;
}

.chat-pagination__arrow {
  align-items: center;
  background: #ffffff;
  border: 1px solid #dce3ed;
  border-radius: 8px;
  color: #4c5563;
  cursor: pointer;
  display: inline-flex;
  font-size: 14px;
  height: 32px;
  justify-content: center;
  width: 32px;
}

.chat-pagination__arrow:disabled {
  color: #c7cdd6;
  cursor: not-allowed;
  opacity: 0.6;
}

.chat-pagination__page {
  align-items: center;
  background: #ffffff;
  border: 1px solid #dce3ed;
  border-radius: 8px;
  color: #4c5563;
  cursor: pointer;
  display: inline-flex;
  font-size: 14px;
  height: 32px;
  justify-content: center;
  min-width: 32px;
  padding: 0 8px;
}

.chat-pagination__page--active {
  background: var(--agent-color-brand-primary);
  border-color: var(--agent-color-brand-primary);
  color: #ffffff;
}

.chat-pagination__size {
  position: relative;
}

.chat-pagination__size-select {
  appearance: none;
  background: #ffffff;
  border: 1px solid #dce3ed;
  border-radius: 8px;
  color: #4c5563;
  cursor: pointer;
  font-size: 14px;
  height: 32px;
  outline: none;
  padding: 0 28px 0 12px;
}

.chat-pagination__size-icon {
  color: #97a3b4;
  pointer-events: none;
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
}

@media (max-width: 1440px) {
  .archive-filters__row--chat-primary {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .archive-filters__row--chat-secondary {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

/* Tag chip styles */
.archive-tag-cell {
  position: relative;
}

.archive-tag-group {
  cursor: pointer;
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.archive-tag {
  background: rgba(47, 107, 255, 0.08);
  border: 1px solid rgba(47, 107, 255, 0.18);
  border-radius: 12px;
  color: #2f6bff;
  display: inline-block;
  font-size: 12px;
  line-height: 1;
  max-width: 100px;
  overflow: hidden;
  padding: 4px 10px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.archive-tag--empty {
  background: transparent;
  border-color: transparent;
  color: #97a3b4;
}

/* Tag popover */
.archive-tag-popover {
  background: #ffffff;
  border: 1px solid #edf1f5;
  border-radius: 14px;
  box-shadow: 0 12px 32px rgba(20, 32, 64, 0.14);
  left: 0;
  max-height: 320px;
  min-width: 220px;
  position: absolute;
  top: calc(100% + 4px);
  z-index: 10;
}

.archive-tag-popover__search {
  border-bottom: 1px solid #edf1f5;
  padding: 10px 12px;
}

.archive-tag-popover__input {
  appearance: none;
  background: #f7f9fc;
  border: 1px solid #dce3ed;
  border-radius: 8px;
  font-size: 13px;
  height: 34px;
  outline: none;
  padding: 0 10px;
  width: 100%;
}

.archive-tag-popover__input:focus {
  border-color: var(--agent-color-brand-primary);
}

.archive-tag-popover__list {
  max-height: 240px;
  overflow-y: auto;
  padding: 6px 4px;
}

.archive-tag-popover__option {
  align-items: center;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  font-size: 13px;
  gap: 8px;
  padding: 8px 10px;
}

.archive-tag-popover__option:hover {
  background: #f7f9fc;
}

.archive-tag-popover__option input[type="checkbox"] {
  accent-color: var(--agent-color-brand-primary);
  cursor: pointer;
  height: 16px;
  width: 16px;
}

.archive-tag-popover__empty {
  color: #97a3b4;
  font-size: 13px;
  margin: 0;
  padding: 10px 12px;
}

/* Staff avatar stacking */
.archive-staff-avatars {
  align-items: center;
  cursor: pointer;
  display: inline-flex;
}

.archive-staff-avatars__item {
  align-items: center;
  border: 2px solid #ffffff;
  border-radius: 50%;
  color: #ffffff;
  display: inline-flex;
  flex-shrink: 0;
  font-size: 11px;
  font-weight: 600;
  height: 28px;
  justify-content: center;
  margin-left: -8px;
  overflow: hidden;
  position: relative;
  width: 28px;
}

.archive-staff-avatars__item:first-child {
  margin-left: 0;
}

.archive-staff-avatars__img {
  border-radius: 50%;
  height: 100%;
  object-fit: cover;
  width: 100%;
}

.archive-staff-avatars__overflow {
  align-items: center;
  background: #e8ecf1;
  border: 2px solid #ffffff;
  border-radius: 50%;
  color: #4c5563;
  display: inline-flex;
  flex-shrink: 0;
  font-size: 11px;
  font-weight: 600;
  height: 28px;
  justify-content: center;
  margin-left: -8px;
  width: 28px;
}

/* Staff cell with inline panel */
.archive-staff-cell {
  position: relative;
}

.archive-staff-panel {
  background: #ffffff;
  border: 1px solid #e5e9f0;
  border-radius: 14px;
  box-shadow: 0 6px 24px rgba(15, 23, 42, 0.12);
  left: 0;
  min-width: 240px;
  position: absolute;
  top: calc(100% + 4px);
  z-index: var(--agent-z-dropdown, 50);
}

.archive-staff-panel__header {
  border-bottom: 1px solid #edf1f5;
  padding: 12px 16px;
}

.archive-staff-panel__title {
  color: #222222;
  font-size: 14px;
  font-weight: 600;
}

.archive-staff-panel__list {
  list-style: none;
  margin: 0;
  max-height: 240px;
  overflow-y: auto;
  padding: 8px 10px;
}

.archive-staff-panel__item {
  align-items: center;
  border-radius: 10px;
  display: flex;
  gap: 10px;
  padding: 8px 10px;
}

.archive-staff-panel__item:hover {
  background: #f7f9fc;
}

.archive-staff-panel__avatar {
  align-items: center;
  border-radius: 50%;
  color: #ffffff;
  display: inline-flex;
  flex-shrink: 0;
  font-size: 12px;
  font-weight: 600;
  height: 30px;
  justify-content: center;
  overflow: hidden;
  width: 30px;
}

.archive-staff-panel__avatar-img {
  border-radius: 50%;
  height: 100%;
  object-fit: cover;
  width: 100%;
}

.archive-staff-panel__name {
  color: #1a1a1a;
  flex: 1;
  font-size: 13px;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.archive-staff-panel__owner-tag {
  background: #eef3ff;
  border-radius: 6px;
  color: var(--agent-color-brand-primary, #2f6bff);
  flex-shrink: 0;
  font-size: 11px;
  font-weight: 500;
  padding: 2px 8px;
}

.archive-staff-panel__staff-tag {
  background: #f0faf4;
  border-radius: 6px;
  color: #16a34a;
  flex-shrink: 0;
  font-size: 11px;
  font-weight: 500;
  padding: 2px 8px;
}

/* Owner cell with avatar */
.archive-owner-cell {
  align-items: center;
  display: inline-flex;
  gap: 8px;
}

.archive-owner-cell__avatar {
  align-items: center;
  border-radius: 50%;
  color: #ffffff;
  display: inline-flex;
  flex-shrink: 0;
  font-size: 11px;
  font-weight: 600;
  height: 24px;
  justify-content: center;
  overflow: hidden;
  width: 24px;
}

.archive-owner-cell__avatar-img {
  border-radius: 50%;
  height: 100%;
  object-fit: cover;
  width: 100%;
}

/* Staff drawer */
.archive-staff-drawer-overlay {
  background: rgba(0, 0, 0, 0.25);
  bottom: 0;
  left: 0;
  position: fixed;
  right: 0;
  top: 0;
  z-index: var(--agent-z-modal, 100);
}

.archive-staff-drawer {
  background: #ffffff;
  border-radius: 20px 0 0 20px;
  box-shadow: -8px 0 30px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  height: 100%;
  max-width: 380px;
  position: absolute;
  right: 0;
  top: 0;
  width: 380px;
}

.archive-staff-drawer__header {
  align-items: center;
  border-bottom: 1px solid #edf1f5;
  display: flex;
  justify-content: space-between;
  padding: 20px 24px;
}

.archive-staff-drawer__title {
  color: #222222;
  font-size: 17px;
  font-weight: var(--agent-font-weight-semibold);
  margin: 0;
}

.archive-staff-drawer__close {
  background: transparent;
  border: 0;
  color: #97a3b4;
  cursor: pointer;
  font-size: 22px;
  height: 32px;
  line-height: 1;
  padding: 0;
  width: 32px;
}

.archive-staff-drawer__close:hover {
  color: #222222;
}

.archive-staff-drawer__list {
  flex: 1;
  list-style: none;
  margin: 0;
  overflow-y: auto;
  padding: 12px 16px;
}

.archive-staff-drawer__item {
  align-items: center;
  border-radius: 12px;
  display: flex;
  gap: 12px;
  padding: 12px;
}

.archive-staff-drawer__item:hover {
  background: #f7f9fc;
}

.archive-staff-drawer__avatar {
  align-items: center;
  border-radius: 50%;
  color: #ffffff;
  display: inline-flex;
  flex-shrink: 0;
  font-size: 14px;
  font-weight: 600;
  height: 36px;
  justify-content: center;
  overflow: hidden;
  width: 36px;
}

.archive-staff-drawer__avatar-img {
  border-radius: 50%;
  height: 100%;
  object-fit: cover;
  width: 100%;
}

.archive-staff-drawer__info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.archive-staff-drawer__name {
  color: #222222;
  font-size: 14px;
  font-weight: var(--agent-font-weight-medium);
}

.archive-staff-drawer__owner-tag {
  background: rgba(47, 107, 255, 0.08);
  border: 1px solid rgba(47, 107, 255, 0.18);
  border-radius: 12px;
  color: #2f6bff;
  font-size: 12px;
  margin-left: auto;
  padding: 3px 10px;
  white-space: nowrap;
}

.archive-staff-drawer__staff-tag {
  background: rgba(0, 181, 120, 0.08);
  border: 1px solid rgba(0, 181, 120, 0.18);
  border-radius: 12px;
  color: #00b578;
  font-size: 12px;
  margin-left: auto;
  padding: 3px 10px;
  white-space: nowrap;
}

.archive-staff-drawer__item--clickable {
  cursor: pointer;
}

/* Avatar wrap with online dot */
.archive-staff-drawer__avatar-wrap {
  flex-shrink: 0;
  position: relative;
}

.archive-staff-drawer__online-dot {
  border: 2px solid #ffffff;
  border-radius: 50%;
  bottom: 0;
  height: 12px;
  position: absolute;
  right: 0;
  width: 12px;
}

.archive-staff-drawer__online-dot--on {
  background: #22c55e;
}

.archive-staff-drawer__online-dot--off {
  background: #d1d5db;
}

/* Back button */
.chat-member-detail-header .archive-staff-drawer__title {
  flex: 1;
  text-align: left;
}

.chat-member-back {
  align-items: center;
  background: transparent;
  border: 0;
  color: #4c5563;
  cursor: pointer;
  display: inline-flex;
  height: 32px;
  justify-content: center;
  padding: 0;
  width: 32px;
}

.chat-member-back:hover {
  color: #222222;
}

.chat-member-back__icon {
  display: block;
  transform: rotate(90deg);
}

/* Member detail panel — staff */
.chat-member-detail {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-height: 0;
  overflow-y: auto;
  padding: 0 24px 24px;
}

.chat-member-detail--visitor {
  overflow: hidden;
  padding: 0;
}

.chat-member-detail__profile {
  align-items: center;
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 32px;
}

.chat-member-detail__avatar-wrap {
  position: relative;
}

.chat-member-detail__avatar {
  align-items: center;
  border-radius: 50%;
  color: #ffffff;
  display: inline-flex;
  flex-shrink: 0;
  font-size: 24px;
  font-weight: 600;
  height: 72px;
  justify-content: center;
  overflow: hidden;
  width: 72px;
}

.chat-member-detail__avatar-img {
  border-radius: 50%;
  height: 100%;
  object-fit: cover;
  width: 100%;
}

.chat-member-detail__online-dot {
  border: 3px solid #ffffff;
  border-radius: 50%;
  bottom: 2px;
  height: 16px;
  position: absolute;
  right: 2px;
  width: 16px;
}

.chat-member-detail__online-dot--on {
  background: #22c55e;
}

.chat-member-detail__online-dot--off {
  background: #d1d5db;
}

.chat-member-detail__name {
  color: #222222;
  font-size: 16px;
  font-weight: 600;
}

.chat-member-detail__section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.chat-member-detail__section-title {
  align-items: center;
  color: #222222;
  display: flex;
  font-size: 15px;
  font-weight: 600;
  gap: 8px;
  margin: 0;
}

.chat-member-detail__section-icon {
  color: #222222;
  font-size: 14px;
}

.chat-member-detail__fields {
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding-left: 4px;
}

.chat-member-detail__field {
  align-items: baseline;
  display: flex;
  gap: 16px;
}

.chat-member-detail__label {
  color: #222222;
  flex-shrink: 0;
  font-size: 14px;
  width: 80px;
}

.chat-member-detail__value {
  color: #222222;
  font-size: 14px;
  word-break: break-all;
}

.chat-member-detail__scroll {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 0 20px 20px;
}

/* Visitor collapsible sections */
.chat-visitor-section {
  border-bottom: 1px solid #f0f2f5;
}

.chat-visitor-section__header {
  align-items: center;
  background: transparent;
  border: 0;
  cursor: pointer;
  display: flex;
  font-size: 14px;
  font-weight: 600;
  justify-content: space-between;
  padding: 14px 0;
  width: 100%;
}

.chat-visitor-section__title {
  color: #222222;
}

.chat-visitor-section__arrow {
  color: #97a3b4;
}

.chat-visitor-section__body {
  padding: 0 0 14px;
}

/* Visitor field rows */
.chat-visitor-field {
  align-items: baseline;
  display: flex;
  gap: 12px;
  padding: 6px 0;
}

.chat-visitor-field__label {
  color: #75869c;
  flex-shrink: 0;
  font-size: 13px;
  width: 64px;
}

.chat-visitor-field__value {
  color: #222222;
  font-size: 13px;
  word-break: break-all;
}

.chat-visitor-field__value--link {
  color: #75869c;
}

/* Visitor tag add button */
.chat-visitor-tag-add {
  align-items: center;
  border: 1px dashed #d1d5db;
  border-radius: 6px;
  color: #97a3b4;
  cursor: pointer;
  display: inline-flex;
  font-size: 16px;
  height: 28px;
  justify-content: center;
  width: 28px;
}

/* Visit history */
.chat-visitor-visit {
  padding: 6px 0;
}

.chat-visitor-visit__row {
  align-items: center;
  display: flex;
  gap: 6px;
}

.chat-visitor-visit__dot {
  border-radius: 50%;
  flex-shrink: 0;
  height: 8px;
  width: 8px;
}

.chat-visitor-visit__dot--on {
  background: #22c55e;
}

.chat-visitor-visit__dot--off {
  background: #d1d5db;
}

.chat-visitor-visit__title {
  color: #222222;
  font-size: 13px;
  white-space: nowrap;
}

.chat-visitor-visit__url {
  color: var(--agent-color-brand-primary, #2f6bff);
  font-size: 13px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.chat-visitor-visit__meta {
  color: #97a3b4;
  font-size: 12px;
  padding-left: 14px;
  padding-top: 2px;
}

.chat-visitor-visit__more {
  background: transparent;
  border: 0;
  color: #75869c;
  cursor: pointer;
  font-size: 13px;
  padding: 8px 0 0;
}

.chat-visitor-visit__more:hover {
  color: var(--agent-color-brand-primary, #2f6bff);
}

/* Admin toggle */
.archive-admin-toggle {
  align-items: center;
  cursor: pointer;
  display: inline-flex;
  font-size: 13px;
  gap: 6px;
  user-select: none;
}

.archive-admin-toggle__checkbox {
  accent-color: var(--agent-color-brand-primary);
  cursor: pointer;
  height: 16px;
  width: 16px;
}

.archive-admin-toggle__label {
  color: #4c5563;
}

/* Confirm dialog */
.archive-confirm-overlay {
  align-items: center;
  background: rgba(0, 0, 0, 0.35);
  bottom: 0;
  display: flex;
  justify-content: center;
  left: 0;
  position: fixed;
  right: 0;
  top: 0;
  z-index: var(--agent-z-modal, 100);
}

.archive-confirm-dialog {
  background: #ffffff;
  border-radius: 20px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15);
  max-width: 400px;
  padding: 28px 32px 24px;
  width: 90%;
}

.archive-confirm-dialog__title {
  color: #222222;
  font-size: 17px;
  font-weight: var(--agent-font-weight-semibold);
  margin: 0 0 10px;
}

.archive-confirm-dialog__desc {
  color: #75869C;
  font-size: 14px;
  line-height: 1.5;
  margin: 0 0 24px;
}

.archive-confirm-dialog__actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.archive-confirm-dialog__btn {
  font-size: 14px;
  height: 38px;
  min-width: 72px;
  padding: 0 20px;
}
</style>
