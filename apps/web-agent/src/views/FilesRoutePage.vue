<template>
  <section class="files-page">
    <section v-if="activeKey === 'all-conversations'" class="files-page__card agent-panel">
      <header class="files-page__header">
        <h1 class="files-page__title">所有会话</h1>
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
        <div class="files-page__table-scroll agent-scroll">
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
                <th>客服数量</th>
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
                <td><button type="button" class="archive-link" @click="openConversation(row)">{{ row.title }}</button></td>
                <td><button type="button" class="archive-link" @click="openConversation(row)">{{ row.visitorName }}</button></td>
                <td>{{ row.customerIdentifier }}</td>
                <td>{{ row.visitorAlias }}</td>
                <td>
                  <span class="archive-status" :class="`archive-status--${row.status}`">{{ statusLabelMap[row.status] }}</span>
                </td>
                <td class="archive-table__number">{{ row.messageCount }}</td>
                <td>{{ row.owner }}</td>
                <td class="archive-table__number">{{ row.staffCount }}</td>
                <td>{{ row.tag }}</td>
                <td>{{ row.startedAtLabel }}</td>
                <td>{{ row.acceptedAtLabel }}</td>
                <td>{{ row.serviceDuration }}</td>
                <td>{{ row.rating === 'satisfied' ? '满意' : '–' }}</td>
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
                    <button type="button" class="archive-action-menu__item" @click="assignConversation(row)">分配会话</button>
                    <button type="button" class="archive-action-menu__item" @click="openConversation(row)">查看会话</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </section>

    <section v-else class="files-page__placeholder agent-panel">
      <h1 class="files-page__title">所有聊天</h1>
      <p class="files-page__placeholder-text">该子页面暂未实现，当前已完成“所有会话”页面。</p>
    </section>
  </section>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { AgentIcon } from "@twt/ui-agent";

type FilesPageKey = "all-conversations" | "all-chats";
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
  startedAtLabel: string;
  startedAtValue: number;
  acceptedAtLabel: string;
  acceptedAtValue: number | null;
  serviceDuration: string;
  rating: ConversationRating;
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
  startedAtLabel?: string;
  acceptedAtLabel?: string;
  startedAtValue?: number;
  acceptedAtValue?: number | null;
  serviceDuration?: string;
  rating?: ConversationRating;
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

const router = useRouter();

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
    rating: seed.rating ?? (index % 8 === 0 ? "satisfied" : "none")
  };
};

const presetSeeds: ConversationSeed[] = [
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

const allRows = [
  ...presetSeeds.map((seed, index) => createRecord(index, seed)),
  ...buildRemainingStatuses().map((status, index) =>
    createRecord(index + presetSeeds.length, {
      status,
      visitorAlias: status === "queueing" || status === "pending-reply" ? aliasPool[(index + 1) % aliasPool.length] : aliasPool[(index + 2) % aliasPool.length],
      rating: status === "closed" && index % 2 === 0 ? "satisfied" : "none"
    })
  )
];

const tagOptions = computed(() => [...new Set(allRows.map((row) => row.tag).filter((value) => value !== "–"))]);
const ownerOptions = computed(() => [...new Set(allRows.map((row) => row.owner).filter((value) => value !== "–"))]);

const summaryStats = computed(() => {
  const uniqueVisitors = new Set(allRows.map((row) => row.visitorName)).size;
  return [
    { key: "total", label: "总会话数", value: allRows.length },
    { key: "pending-reply", label: "待回复", value: allRows.filter((row) => row.status === "pending-reply").length },
    { key: "queueing", label: "排队中", value: allRows.filter((row) => row.status === "queueing").length },
    { key: "processing", label: "待处理", value: allRows.filter((row) => row.status === "processing").length },
    { key: "replied", label: "已回复", value: allRows.filter((row) => row.status === "replied").length },
    { key: "closed", label: "已关闭", value: allRows.filter((row) => row.status === "closed").length },
    { key: "visitor", label: "访客数量", value: uniqueVisitors }
  ];
});

const visibleRows = computed(() => {
  const filters = appliedFilters.value;
  const keyword = filters.keyword.trim().toLowerCase();

  const rows = allRows.filter((row) => {
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
  emit("toast", `已分配会话：${row.title}`);
};

const openConversation = (row: ConversationRecord) => {
  closeActionMenu();
  emit("toast", `正在查看会话：${row.title}`);
  router.push("/conversation");
};

onMounted(() => {
  window.addEventListener("click", closeActionMenu);
});

onBeforeUnmount(() => {
  window.removeEventListener("click", closeActionMenu);
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
  z-index: 2;
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
</style>
