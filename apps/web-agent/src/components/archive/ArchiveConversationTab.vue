<template>
  <section class="files-page__card agent-panel">
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

        <label class="archive-field">
          <select v-model="draftFilters.channelType" class="archive-field__control archive-field__control--select">
            <option value="all">来源渠道</option>
            <option value="web">Web</option>
            <option value="email">Email</option>
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
              <th>来源渠道</th>
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
              <!-- 2a. 会话标题列 -->
              <td>
                <button type="button" class="archive-link" @click="openConversation(row)">{{ row.title }}</button>
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
                    v-for="(agent, idx) in row.staffAgents.slice(0, 3)"
                    :key="agent.name"
                    class="archive-staff-avatars__item"
                    :style="{ background: agent.avatarColor, zIndex: 10 - idx }"
                    :title="agent.name"
                  >
                    <img v-if="agent.avatarUrl" :src="agent.avatarUrl" class="archive-staff-avatars__img" />
                    <span v-else>{{ agent.avatarText }}</span>
                  </span>
                  <span v-if="row.staffAgents.length > 3" class="archive-staff-avatars__overflow">
                    <span class="archive-staff-avatars__dot" /><span class="archive-staff-avatars__dot" />
                  </span>
                </div>
                <span v-else>–</span>
                <!-- Staff panel (inline below cell) -->
                <div v-if="staffPanelRowId === row.id" class="archive-staff-panel" @click.stop>
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
              <td>{{ row.channelType === 'email' ? 'Email' : 'Web' }}</td>
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
                  <template v-if="row.channelType === 'email'">
                    <button v-if="row.status === 'queueing' && isAdmin" type="button" class="archive-action-menu__item" @click="assignConversation(row)">分配会话</button>
                    <button v-if="row.status === 'queueing' && !isAdmin" type="button" class="archive-action-menu__item" @click="confirmAssignToSelf(row)">分配给我</button>
                    <button type="button" class="archive-action-menu__item" @click="openConversation(row)">查看会话</button>
                  </template>
                  <template v-else-if="row.status === 'queueing'">
                    <button v-if="isAdmin" type="button" class="archive-action-menu__item" @click="assignConversation(row)">分配会话</button>
                    <button v-else type="button" class="archive-action-menu__item" @click="confirmAssignToSelf(row)">分配给我</button>
                    <button type="button" class="archive-action-menu__item" @click="openConversation(row)">查看会话</button>
                  </template>
                  <template v-else>
                    <button type="button" class="archive-action-menu__item" @click="handleTakeoverOrAssign(row)">{{ row.owner === aiAgentArchiveName ? '接管会话' : '分配会话' }}</button>
                    <button type="button" class="archive-action-menu__item" @click="openConversation(row)">查看会话</button>
                  </template>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </section>

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
    :assign-label="getDrawerAssignLabel(previewConversation)"
    :editable="false"
    @assign="previewConversation && handleDrawerAssign(previewConversation)"
    @close="closeConversationDrawer"
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
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, ref } from "vue";
import { AgentIcon } from "@twt/ui-agent";
import ArchiveAssignModal from "./ArchiveAssignModal.vue";
import ArchiveConversationDrawer from "./ArchiveConversationDrawer.vue";
import {
  type StaffAgent,
  type ArchiveAgent,
  type ArchivePreviewMessage,
  archiveAgentPool,
  ownerPool,
  aiAgentArchiveName,
  getArchiveAgentProfile,
  formatDateTime,
  formatDuration,
  buildDurationPayload
} from "../../lib/archiveUtils";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type SearchField = "visitorName" | "title" | "customerIdentifier" | "visitorAlias";
type ConversationStatus = "pending-reply" | "queueing" | "processing" | "replied" | "closed";
type ConversationRating = "none" | "satisfied";
type SortKey = "startedAt" | "acceptedAt";
type SortOrder = "asc" | "desc";

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
  channelType: "web" | "email";
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
  channelType?: "web" | "email";
}

interface FilterState {
  searchField: SearchField;
  keyword: string;
  tag: string;
  owner: string;
  status: "all" | ConversationStatus;
  rating: "all" | ConversationRating;
  channelType: "all" | "web" | "email";
  startedDate: string;
}

/* ------------------------------------------------------------------ */
/*  Emits                                                              */
/* ------------------------------------------------------------------ */

const emit = defineEmits<{
  (e: "toast", message: string): void;
}>();

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

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

/* ------------------------------------------------------------------ */
/*  Data builders                                                      */
/* ------------------------------------------------------------------ */

const createDefaultFilters = (): FilterState => ({
  searchField: "visitorName",
  keyword: "",
  tag: "all",
  owner: "all",
  status: "all",
  rating: "all",
  channelType: "all",
  startedDate: ""
});

const buildStaffAgents = (seed: ConversationSeed, index: number): StaffAgent[] => {
  const agents: StaffAgent[] = [];
  if (seed.staffAgents) return seed.staffAgents;

  if (seed.aiAgentHandled) {
    const profile = getArchiveAgentProfile(aiAgentArchiveName);
    agents.push({
      name: aiAgentArchiveName,
      avatarText: profile.avatarText,
      avatarColor: profile.avatarColor,
      avatarUrl: profile.avatarUrl,
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
    aiAgentHandled: seed.aiAgentHandled ?? false,
    channelType: seed.channelType ?? (index % 6 === 0 ? "email" : "web")
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

/* ------------------------------------------------------------------ */
/*  Refs                                                               */
/* ------------------------------------------------------------------ */

const draftFilters = reactive<FilterState>(createDefaultFilters());
const appliedFilters = ref<FilterState>(createDefaultFilters());
const sortKey = ref<SortKey>("startedAt");
const sortOrder = ref<SortOrder>("desc");
const openActionMenuId = ref<string | null>(null);
const previewConversationId = ref<string | null>(null);
const assignModalOpen = ref(false);
const assignKeyword = ref("");
const pendingAssignConversationId = ref<string | null>(null);

// Tag popover
const tagPopoverRowId = ref<string | null>(null);
const tagSearchKeyword = ref("");

// Staff panel (inline)
const staffPanelRowId = ref<string | null>(null);

// Admin mode
const isAdmin = ref(true);

// Confirm dialog
const confirmDialogOpen = ref(false);
const confirmDialogTitle = ref("");
const confirmDialogDesc = ref("");
const confirmDialogCallback = ref<(() => void) | null>(null);

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

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

/* ------------------------------------------------------------------ */
/*  Computed                                                           */
/* ------------------------------------------------------------------ */

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
    if (filters.channelType !== "all" && row.channelType !== filters.channelType) {
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

const filteredTagPool = computed(() => {
  const keyword = tagSearchKeyword.value.trim().toLowerCase();
  if (!keyword) return allTagPool;
  return allTagPool.filter(t => t.toLowerCase().includes(keyword));
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

/* ------------------------------------------------------------------ */
/*  Methods                                                            */
/* ------------------------------------------------------------------ */

const toggleStaffPanel = (rowId: string) => {
  staffPanelRowId.value = staffPanelRowId.value === rowId ? null : rowId;
};

const closeStaffPanel = () => {
  staffPanelRowId.value = null;
};

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

// Tag popover methods
const openTagPopover = (rowId: string) => {
  tagPopoverRowId.value = tagPopoverRowId.value === rowId ? null : rowId;
  tagSearchKeyword.value = "";
};

const closeTagPopover = () => {
  tagPopoverRowId.value = null;
  tagSearchKeyword.value = "";
};

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

const getDrawerAssignLabel = (row: ConversationRecord | null): string => {
  if (!row) return "分配会话";
  if (row.channelType === "email") {
    return row.status === "queueing" ? "分配会话" : "进入会话";
  }
  return row.owner === aiAgentArchiveName ? "接管会话" : "分配会话";
};

const handleDrawerAssign = (row: ConversationRecord) => {
  if (row.channelType === "email" && row.status !== "queueing") {
    // "进入会话" — 跳转到会话
    closeConversationDrawer();
    emit("toast", "进入会话功能开发中");
    return;
  }
  assignConversation(row);
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

/* ------------------------------------------------------------------ */
/*  Global click handler                                               */
/* ------------------------------------------------------------------ */

onMounted(() => {
  const handleGlobalClick = () => {
    closeActionMenu();
    closeTagPopover();
    closeStaffPanel();
  };
  window.addEventListener("click", handleGlobalClick);
  onBeforeUnmount(() => {
    window.removeEventListener("click", handleGlobalClick);
  });
});
</script>

<style scoped>
.files-page__card,
.files-page__placeholder {
  background: #ffffff;
  border-radius: var(--agent-radius-xl);
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
  grid-template-columns: minmax(160px, 200px) minmax(160px, 200px) minmax(200px, 260px) 92px 92px;
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
  display: flex;
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

.files-page__table-scroll {
  flex: 1;
  min-height: 0;
  overflow: auto;
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
  display: inline-flex;
  flex-shrink: 0;
  gap: 3px;
  height: 28px;
  justify-content: center;
  margin-left: -8px;
  width: 28px;
}

.archive-staff-avatars__dot {
  background: #8d99ab;
  border-radius: 50%;
  display: block;
  height: 4px;
  width: 4px;
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

.archive-channel-badge {
  border-radius: 999px;
  display: inline-block;
  font-size: var(--agent-font-size-xs);
  font-weight: var(--agent-font-weight-medium);
  line-height: 1;
  padding: 3px 8px;
}

.archive-channel-badge--web {
  background: #e8f0ff;
  color: #2f6bff;
}

.archive-channel-badge--email {
  background: #fef3cd;
  color: #b45309;
}
</style>
