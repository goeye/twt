<template>
  <section class="files-page__card agent-panel">
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

        <label class="archive-field archive-field--search-combo">
          <select v-model="chatDraftFilters.searchField" class="archive-field__combo-select">
            <option value="visitorName">访客姓名</option>
            <option value="visitorAlias">访客备注名</option>
            <option value="staffName">客服姓名</option>
            <option value="title">聊天标题</option>
            <option value="conversationRecord">沟通记录</option>
            <option value="customerIdentifier">客户标识</option>
          </select>
          <AgentIcon class="archive-field__combo-arrow" name="chevron-down" :size="12" />
          <span class="archive-field__combo-divider"></span>
          <AgentIcon class="archive-field__combo-search-icon" name="search" :size="15" />
          <input v-model.trim="chatDraftFilters.keyword" class="archive-field__combo-input" placeholder="请输入" />
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
              <td>
                <button
                  v-if="canManageArchiveChat"
                  type="button"
                  class="archive-link"
                  @click="openChatDrawer(row)"
                >
                  {{ row.title }}
                </button>
                <span v-else class="archive-link archive-link--static">{{ row.title }}</span>
                <button
                  v-if="canManageArchiveChat && chatMatchResults.has(row.id)"
                  type="button"
                  class="archive-match-count"
                  @click.stop="openChatMatchList(row)"
                >
                  {{ chatMatchResults.get(row.id)!.matchedIds.length }}条相关记录
                </button>
              </td>
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
                    v-for="(member, idx) in row.visitorMembers.slice(0, 3)"
                    :key="member.name"
                    class="archive-staff-avatars__item"
                    :style="{ background: member.avatarColor, zIndex: 10 - idx }"
                    :title="member.name"
                  >
                    <img v-if="member.avatarUrl" :src="member.avatarUrl" class="archive-staff-avatars__img" />
                    <span v-else>{{ member.avatarText }}</span>
                  </span>
                  <span v-if="row.visitorMembers.length > 3" class="archive-staff-avatars__overflow">
                    <span class="archive-staff-avatars__dot" /><span class="archive-staff-avatars__dot" />
                  </span>
                </div>
                <span v-else class="archive-table__number">–</span>
                <div v-if="chatMemberPanelRowId === row.id" class="archive-staff-panel" @click.stop>
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
                    v-for="(member, idx) in row.staffMembers.slice(0, 3)"
                    :key="member.name"
                    class="archive-staff-avatars__item"
                    :style="{ background: member.avatarColor, zIndex: 10 - idx }"
                    :title="member.name"
                  >
                    <img v-if="member.avatarUrl" :src="member.avatarUrl" class="archive-staff-avatars__img" />
                    <span v-else>{{ member.avatarText }}</span>
                  </span>
                  <span v-if="row.staffMembers.length > 3" class="archive-staff-avatars__overflow">
                    <span class="archive-staff-avatars__dot" /><span class="archive-staff-avatars__dot" />
                  </span>
                </div>
                <span v-else class="archive-table__number">{{ row.staffCount }}</span>
              </td>
              <td>{{ row.startedAtLabel }}</td>
              <td>{{ row.updatedAtLabel }}</td>
              <td class="archive-table__actions-cell">
                <button
                  v-if="canManageArchiveChat"
                  type="button"
                  class="archive-action-btn"
                  aria-label="更多操作"
                  @click.stop="toggleChatActionMenu(row.id)"
                >
                  <span />
                  <span />
                  <span />
                </button>

                <div v-if="canManageArchiveChat && openChatActionMenuId === row.id" class="archive-action-menu" @click.stop>
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
    :open="Boolean(canManageArchiveChat && chatDrawerRow)"
    :title="chatDrawerRow?.title ?? ''"
    :messages="chatDrawerMessages"
    assign-label="查看详情"
    :editable="false"
    @assign="handleChatDrawerAssign"
    @close="closeChatDrawer"
  />

  <ArchiveMessageListDrawer
    :open="chatMatchListDrawerVisible"
    :messages="chatMatchListDrawerMessages"
    :keyword="appliedChatFilters.keyword"
    @select="handleSelectChatMatchedMessage"
    @close="handleCloseChatMatchListDrawer"
  />
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, ref } from "vue";
import { AgentIcon } from "@twt/ui-agent";
import { usePermission } from "../../composables/usePermission";
import ArchiveConversationDrawer from "./ArchiveConversationDrawer.vue";
import ArchiveMessageListDrawer from "./ArchiveMessageListDrawer.vue";
import {
  type ArchivePreviewMessage,
  archiveAgentPool,
  ownerPool,
  getArchiveAgentProfile,
  extractKWIC
} from "../../lib/archiveUtils";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type ChatSearchField = "all" | "visitorName" | "visitorAlias" | "staffName" | "title" | "customerIdentifier";
type ChatType = "single" | "group";
type ChatStatus = "active" | "dissolved";
type ChatCategory = "external" | "internal";
type ChatSortKey = "messageCount" | "startedAt" | "updatedAt";
type SortOrder = "asc" | "desc";

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

/* ------------------------------------------------------------------ */
/*  Emits                                                              */
/* ------------------------------------------------------------------ */

const emit = defineEmits<{
  (e: "toast", message: string): void;
}>();

const { hasPermission } = usePermission();

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const visitorAvatarColors = [
  "linear-gradient(135deg, #ff6b6b 0%, #ff9a76 100%)",
  "linear-gradient(135deg, #ffa726 0%, #ffcc80 100%)",
  "linear-gradient(135deg, #66bb6a 0%, #a5d6a7 100%)",
  "linear-gradient(135deg, #42a5f5 0%, #90caf9 100%)",
  "linear-gradient(135deg, #ab47bc 0%, #ce93d8 100%)",
  "linear-gradient(135deg, #ef5350 0%, #ef9a9a 100%)",
  "linear-gradient(135deg, #26c6da 0%, #80deea 100%)"
];

/* ------------------------------------------------------------------ */
/*  Data builders                                                      */
/* ------------------------------------------------------------------ */

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

/* ------------------------------------------------------------------ */
/*  Filter defaults                                                    */
/* ------------------------------------------------------------------ */

const createDefaultChatFilters = (): ChatFilterState => ({
  searchField: "visitorName",
  keyword: "",
  messageCount: "all",
  owner: "all",
  chatType: "all",
  status: "all",
  category: "all",
  startedDate: "",
  updatedDate: ""
});

/* ------------------------------------------------------------------ */
/*  Reactive state                                                     */
/* ------------------------------------------------------------------ */

const chatDraftFilters = reactive<ChatFilterState>(createDefaultChatFilters());
const appliedChatFilters = ref<ChatFilterState>(createDefaultChatFilters());
const chatSortKey = ref<ChatSortKey>("startedAt");
const chatSortOrder = ref<SortOrder>("desc");
const openChatActionMenuId = ref<string | null>(null);
const chatCurrentPage = ref(1);
const chatPageSize = ref(20);

// Chat drawer (聊天记录面板)
const chatDrawerRowId = ref<string | null>(null);
const chatMatchListDrawerVisible = ref(false);
const chatMatchListDrawerMessages = ref<any[]>([]);
const pendingChatId = ref<string>("");


// Chat member panel (inline, shared for visitor and staff columns)
const chatMemberPanelRowId = ref<string | null>(null);
const currentArchiveAgentName = "客服主管";

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

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

const hasArchiveChatAccess = computed(() => hasPermission("archive-chat"));
const canManageArchiveChat = computed(() => hasPermission("archive-chat-manage"));
const canViewPersonalArchiveChatData = computed(() => hasPermission("archive-chat-scope-personal"));
const canViewAllArchiveChatData = computed(() => hasPermission("archive-chat-scope-all"));

const scopedChatRows = computed(() => {
  if (!hasArchiveChatAccess.value) {
    return [];
  }

  if (canViewAllArchiveChatData.value) {
    return allChatRows.value;
  }

  if (!canViewPersonalArchiveChatData.value) {
    return [];
  }

  return allChatRows.value.filter((row) => (
    row.owner === currentArchiveAgentName ||
    row.staffMembers.some((member) => member.name === currentArchiveAgentName)
  ));
});

/* ------------------------------------------------------------------ */
/*  Computed                                                           */
/* ------------------------------------------------------------------ */

const chatOwnerOptions = computed(() => [...new Set(scopedChatRows.value.map((r) => r.owner))]);

const chatSummaryStats = computed(() => {
  const total = scopedChatRows.value.length;
  const single = scopedChatRows.value.filter((r) => r.chatType === "single").length;
  const group = scopedChatRows.value.filter((r) => r.chatType === "group").length;
  const active = scopedChatRows.value.filter((r) => r.status === "active").length;
  const dissolved = scopedChatRows.value.filter((r) => r.status === "dissolved").length;
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

  const rows = scopedChatRows.value.filter((row) => {
    if (keyword) {
      if (filters.searchField === "conversationRecord") {
        const texts: string[] = [];
        if (row.visitorMembers.length > 0) texts.push("你好，请问有人在吗？");
        texts.push("你好，请问有什么可以帮您？");
        if (!texts.some((t) => t.toLowerCase().includes(keyword))) return false;
      } else if (filters.searchField === "all") {
        const titleMatch = String(row.title).toLowerCase().includes(keyword);
        const visitorNameMatch = row.visitorMembers.some(m => m.name.toLowerCase().includes(keyword));
        const visitorAliasMatch = row.visitorMembers.some(m => (m.alias || "").toLowerCase().includes(keyword));
        const staffNameMatch = row.staffMembers.some(m => m.name.toLowerCase().includes(keyword));
        const customerIdentifierMatch = row.visitorMembers.some(m => (m.relatedCustomer || "").toLowerCase().includes(keyword));
        const texts: string[] = [];
        if (row.visitorMembers.length > 0) texts.push("你好，请问有人在吗？");
        texts.push("你好，请问有什么可以帮您？");
        const conversationRecordMatch = texts.some((t) => t.toLowerCase().includes(keyword));
        if (!titleMatch && !visitorNameMatch && !visitorAliasMatch && !staffNameMatch && !customerIdentifierMatch && !conversationRecordMatch) {
          return false;
        }
      } else if (filters.searchField === "visitorName") {
        if (!row.visitorMembers.some(m => m.name.toLowerCase().includes(keyword))) return false;
      } else if (filters.searchField === "visitorAlias") {
        if (!row.visitorMembers.some(m => (m.alias || "").toLowerCase().includes(keyword))) return false;
      } else if (filters.searchField === "staffName") {
        if (!row.staffMembers.some(m => m.name.toLowerCase().includes(keyword))) return false;
      } else if (filters.searchField === "customerIdentifier") {
        if (!row.visitorMembers.some(m => (m.relatedCustomer || "").toLowerCase().includes(keyword))) return false;
      } else {
        const fieldValue = String(row[filters.searchField]).toLowerCase();
        if (!fieldValue.includes(keyword)) return false;
      }
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

const chatDrawerRow = computed(() => allChatRows.value.find(r => r.id === chatDrawerRowId.value) ?? null);

function getChatMessages(row: ChatRecord): ArchivePreviewMessage[] {
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
}

const chatMatchResults = computed(() => {
  const results = new Map<string, { matchedIds: string[]; matchedMessages: any[]; firstSnippet: string }>();
  const filters = appliedChatFilters.value;
  const keyword = filters.keyword.trim();
  if (!keyword || (filters.searchField !== "conversationRecord" && filters.searchField !== "all")) return results;

  for (const row of visibleChatRows.value) {
    const messages = getChatMessages(row);
    const matchedIds: string[] = [];
    const matchedMessages: any[] = [];
    let firstSnippet = "";

    for (const msg of messages) {
      if (msg.content.toLowerCase().includes(keyword.toLowerCase())) {
        matchedIds.push(msg.id);
        matchedMessages.push(msg);
        if (!firstSnippet) {
          const kwic = extractKWIC(msg.content, keyword);
          firstSnippet = (kwic.hasPrefix ? "..." : "") + kwic.snippet + (kwic.hasSuffix ? "..." : "");
        }
      }
    }

    if (matchedIds.length > 0) {
      results.set(row.id, { matchedIds, matchedMessages, firstSnippet });
    }
  }

  return results;
});

const chatDrawerMessages = computed<ArchivePreviewMessage[]>(() => {
  const row = chatDrawerRow.value;
  if (!row) return [];
  return getChatMessages(row);
});

/* ------------------------------------------------------------------ */
/*  Methods                                                            */
/* ------------------------------------------------------------------ */

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

const openChatDrawer = (row: ChatRecord) => {
  closeChatActionMenu();
  chatDrawerRowId.value = row.id;
};

const openChatMatchList = (row: ChatRecord) => {
  const matchResult = chatMatchResults.value.get(row.id);
  if (!matchResult) return;

  chatMatchListDrawerMessages.value = matchResult.matchedMessages;
  pendingChatId.value = row.id;
  chatMatchListDrawerVisible.value = true;
};

const handleSelectChatMatchedMessage = (messageId: string) => {
  chatMatchListDrawerVisible.value = false;
  chatDrawerRowId.value = pendingChatId.value;
};

const handleCloseChatMatchListDrawer = () => {
  chatMatchListDrawerVisible.value = false;
  pendingChatId.value = "";
  chatMatchListDrawerMessages.value = [];
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

/* ------------------------------------------------------------------ */
/*  Global click handler                                               */
/* ------------------------------------------------------------------ */

onMounted(() => {
  const handleGlobalClick = () => {
    closeChatActionMenu();
    closeChatMemberPanel();
  };
  window.addEventListener("click", handleGlobalClick);
  onBeforeUnmount(() => {
    window.removeEventListener("click", handleGlobalClick);
  });
});
</script>

<style scoped>
.files-page__card {
  background: #ffffff;
  border-radius: 18px;
  display: flex;
  flex-direction: column;
  gap: 0;
  height: 100%;
  min-height: 0;
  overflow: hidden;
  padding: 18px 18px 0;
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
  margin: 0 0 16px;
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

.summary-banner__stats--chat {
  grid-template-columns: repeat(5, minmax(80px, 1fr));
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
  padding: 0 0 12px;
}

.archive-filters__row {
  display: grid;
  gap: 16px;
}

.archive-filters__row--chat-primary {
  grid-template-columns: minmax(320px, 1.5fr) repeat(3, minmax(160px, 1fr));
}

.archive-filters__row--chat-secondary {
  align-items: center;
  grid-template-columns: minmax(160px, 200px) minmax(160px, 200px) minmax(200px, 260px) minmax(200px, 260px) 92px 92px;
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

.archive-field--search-combo {
  align-items: center;
  background: var(--agent-color-bg-panel);
  border: 1px solid var(--agent-color-border-default);
  border-radius: 12px;
  display: flex;
  height: 44px;
  overflow: hidden;
  position: relative;
  transition: border-color var(--agent-motion-fast) ease, box-shadow var(--agent-motion-fast) ease;
}

.archive-field--search-combo:focus-within {
  border-color: var(--agent-color-brand-primary);
  box-shadow: 0 0 0 3px rgba(47, 107, 255, 0.08);
}

.archive-field__combo-select {
  appearance: none;
  background: transparent;
  border: 0;
  color: var(--agent-color-text-secondary);
  cursor: pointer;
  flex-shrink: 0;
  font-size: 14px;
  height: 100%;
  outline: none;
  padding: 0 28px 0 14px;
}

.archive-field__combo-arrow {
  color: var(--agent-color-text-tertiary);
  flex-shrink: 0;
  margin-left: -22px;
  pointer-events: none;
}

.archive-field__combo-divider {
  background: var(--agent-color-border-default);
  flex-shrink: 0;
  height: 18px;
  margin: 0 4px;
  width: 1px;
}

.archive-field__combo-search-icon {
  color: var(--agent-color-text-tertiary);
  flex-shrink: 0;
  margin-left: 8px;
}

.archive-field__combo-input {
  background: transparent;
  border: 0;
  color: var(--agent-color-text-primary);
  flex: 1;
  font-size: 14px;
  min-width: 0;
  outline: none;
  padding: 0 14px 0 8px;
}

.archive-field__combo-input::placeholder {
  color: var(--agent-color-text-tertiary);
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

.archive-link--static {
  cursor: default;
  display: inline;
  text-decoration: none;
}

.archive-match-count {
  background: transparent;
  border: 0;
  color: var(--agent-color-brand-primary);
  cursor: pointer;
  display: block;
  font-size: var(--agent-font-size-xs);
  margin-top: 4px;
  padding: 0;
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
  padding: 12px 0;
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

@media (max-width: 1440px) {
  .files-page__card {
    padding-left: 18px;
    padding-right: 18px;
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

  .archive-filters__row--chat-primary {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .archive-filters__row--chat-secondary {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
</style>
