<template>
  <BaseModal class="start-chat-modal-dialog" :open="open" title="发起聊天" max-width="684px" @close="handleClose">
    <div class="start-chat-modal">
      <section class="start-chat-modal__left-pane">
        <div class="start-chat-modal__search-wrap">
          <AgentIcon name="search" :size="20" class="start-chat-modal__search-icon" />
          <input
            v-model="keyword"
            type="text"
            class="agent-input start-chat-modal__search-input"
            placeholder="搜索"
          />
          <button
            v-if="showFilterButton"
            type="button"
            class="start-chat-modal__filter-btn"
            :class="{ 'start-chat-modal__filter-btn--active': hasActiveFilter }"
            aria-label="筛选"
            @click="filterPanelOpen = !filterPanelOpen"
          >
            <AgentIcon name="filter" :size="18" />
          </button>
        </div>

        <div class="start-chat-modal__tabs">
          <button
            v-for="tab in tabs"
            :key="tab.key"
            type="button"
            class="start-chat-modal__tab"
            :class="{ 'start-chat-modal__tab--active': activeTab === tab.key }"
            @click="handleTabChange(tab.key)"
          >
            <span>{{ tab.label }}</span>
            <AgentIcon v-if="tab.key === 'manual'" name="help" :size="16" class="start-chat-modal__tab-help" />
          </button>
        </div>

        <div class="start-chat-modal__pane-body">
          <div v-show="activeTab !== 'manual'" class="start-chat-modal__candidate-list agent-scroll">
            <button
              v-for="candidate in visibleCandidates"
              :key="candidate.id"
              type="button"
              class="start-chat-modal__candidate-row"
              :aria-pressed="isSelected(candidate.id)"
              @click="toggleCandidate(candidate)"
            >
              <span class="start-chat-modal__checkbox" :class="{ 'start-chat-modal__checkbox--selected': isSelected(candidate.id) }">
                <AgentIcon v-if="isSelected(candidate.id)" name="check" :size="18" class="start-chat-modal__checkbox-icon" />
              </span>

              <span class="start-chat-modal__avatar" :style="{ background: candidate.avatarColor }">{{ candidate.avatarText }}</span>

              <span class="start-chat-modal__candidate-name">{{ candidate.name }}</span>
            </button>

            <div v-if="visibleCandidates.length === 0" class="start-chat-modal__empty">
              暂无可选择的对象
            </div>
          </div>

          <div v-show="activeTab === 'manual'" class="start-chat-modal__manual-pane">
            <textarea
              id="start-chat-manual-input"
              v-model="manualText"
              class="agent-input start-chat-modal__manual-input"
              placeholder="请输入客户标识，一行一个，最多支持99个，超出部分将自动忽略"
            />
            <p class="start-chat-modal__manual-tip">支持客户标识、邮箱或手机号，一行一个，识别后会自动加入右侧已选列表。</p>
            <button
              type="button"
              class="agent-btn agent-btn--primary start-chat-modal__manual-submit"
              :disabled="manualText.trim().length === 0"
              @click="appendManualEntries"
            >
              开始识别
            </button>
          </div>

          <!-- 筛选面板 -->
          <Teleport to="body">
            <div v-if="filterPanelOpen" class="start-chat-filter-mask" @click="filterPanelOpen = false" />
            <Transition name="start-chat-filter-fade">
              <div v-if="filterPanelOpen" class="start-chat-filter-panel">
                <div class="start-chat-filter-panel__body agent-scroll">
                  <div class="start-chat-filter-panel__section">
                    <p class="start-chat-filter-panel__label">在线状态</p>
                    <div class="start-chat-filter-panel__options">
                      <button
                        type="button"
                        class="start-chat-filter-panel__option"
                        :class="{ 'start-chat-filter-panel__option--selected': draftFilter.online === true }"
                        @click="draftFilter.online = draftFilter.online === true ? null : true"
                      >在线</button>
                      <button
                        type="button"
                        class="start-chat-filter-panel__option"
                        :class="{ 'start-chat-filter-panel__option--selected': draftFilter.online === false }"
                        @click="draftFilter.online = draftFilter.online === false ? null : false"
                      >不在线</button>
                    </div>
                  </div>

                  <div class="start-chat-filter-panel__section">
                    <p class="start-chat-filter-panel__label">邮箱</p>
                    <div class="start-chat-filter-panel__options">
                      <button
                        type="button"
                        class="start-chat-filter-panel__option"
                        :class="{ 'start-chat-filter-panel__option--selected': draftFilter.hasEmail === true }"
                        @click="draftFilter.hasEmail = draftFilter.hasEmail === true ? null : true"
                      >有邮箱</button>
                      <button
                        type="button"
                        class="start-chat-filter-panel__option"
                        :class="{ 'start-chat-filter-panel__option--selected': draftFilter.hasEmail === false }"
                        @click="draftFilter.hasEmail = draftFilter.hasEmail === false ? null : false"
                      >无邮箱</button>
                    </div>
                  </div>

                  <div class="start-chat-filter-panel__section">
                    <p class="start-chat-filter-panel__label">电话</p>
                    <div class="start-chat-filter-panel__options">
                      <button
                        type="button"
                        class="start-chat-filter-panel__option"
                        :class="{ 'start-chat-filter-panel__option--selected': draftFilter.hasPhone === true }"
                        @click="draftFilter.hasPhone = draftFilter.hasPhone === true ? null : true"
                      >有电话</button>
                      <button
                        type="button"
                        class="start-chat-filter-panel__option"
                        :class="{ 'start-chat-filter-panel__option--selected': draftFilter.hasPhone === false }"
                        @click="draftFilter.hasPhone = draftFilter.hasPhone === false ? null : false"
                      >无电话</button>
                    </div>
                  </div>

                  <div class="start-chat-filter-panel__section">
                    <p class="start-chat-filter-panel__label">发起过会话</p>
                    <div class="start-chat-filter-panel__options">
                      <button
                        type="button"
                        class="start-chat-filter-panel__option"
                        :class="{ 'start-chat-filter-panel__option--selected': draftFilter.hasSession === true }"
                        @click="draftFilter.hasSession = draftFilter.hasSession === true ? null : true"
                      >是</button>
                      <button
                        type="button"
                        class="start-chat-filter-panel__option"
                        :class="{ 'start-chat-filter-panel__option--selected': draftFilter.hasSession === false }"
                        @click="draftFilter.hasSession = draftFilter.hasSession === false ? null : false"
                      >否</button>
                    </div>
                  </div>

                  <div class="start-chat-filter-panel__section">
                    <p class="start-chat-filter-panel__label">标签</p>
                    <div class="start-chat-filter-panel__tag-selector">
                      <button
                        type="button"
                        class="start-chat-filter-panel__tag-trigger"
                        :class="{ 'start-chat-filter-panel__tag-trigger--has-value': draftFilter.tags.length > 0 }"
                        @click="tagSelectorOpen = !tagSelectorOpen"
                        @mouseenter="hoveredTagField = true"
                        @mouseleave="hoveredTagField = false"
                      >
                        <span>{{ selectedTagsDisplay }}</span>
                        <button
                          v-if="draftFilter.tags.length > 0 && hoveredTagField"
                          type="button"
                          class="start-chat-filter-panel__tag-clear"
                          @click.stop="draftFilter.tags = []"
                        >×</button>
                        <AgentIcon v-else name="chevron-down" :size="14" />
                      </button>
                    </div>
                  </div>

                  <div class="start-chat-filter-panel__section">
                    <p class="start-chat-filter-panel__label">首次访问时间</p>
                    <button
                      type="button"
                      class="start-chat-filter-panel__date-trigger"
                      :class="{ 'start-chat-filter-panel__date-trigger--has-value': draftFilter.firstVisitStart || draftFilter.firstVisitEnd }"
                      @click="toggleDatePicker('firstVisit')"
                      @mouseenter="hoveredDateField = 'firstVisit'"
                      @mouseleave="hoveredDateField = null"
                    >
                      <span class="start-chat-filter-panel__date-trigger-text">
                        {{ formatDateRange(draftFilter.firstVisitStart, draftFilter.firstVisitEnd) || '请选择' }}
                      </span>
                      <button
                        v-if="(draftFilter.firstVisitStart || draftFilter.firstVisitEnd) && hoveredDateField === 'firstVisit'"
                        type="button"
                        class="start-chat-filter-panel__date-clear"
                        @click.stop="clearDateRange('firstVisit')"
                      >×</button>
                      <AgentIcon v-else name="calendar" :size="16" class="start-chat-filter-panel__date-trigger-icon" />
                    </button>
                  </div>

                  <div class="start-chat-filter-panel__section">
                    <p class="start-chat-filter-panel__label">最后访问时间</p>
                    <button
                      type="button"
                      class="start-chat-filter-panel__date-trigger"
                      :class="{ 'start-chat-filter-panel__date-trigger--has-value': draftFilter.lastVisitStart || draftFilter.lastVisitEnd }"
                      @click="toggleDatePicker('lastVisit')"
                      @mouseenter="hoveredDateField = 'lastVisit'"
                      @mouseleave="hoveredDateField = null"
                    >
                      <span class="start-chat-filter-panel__date-trigger-text">
                        {{ formatDateRange(draftFilter.lastVisitStart, draftFilter.lastVisitEnd) || '请选择' }}
                      </span>
                      <button
                        v-if="(draftFilter.lastVisitStart || draftFilter.lastVisitEnd) && hoveredDateField === 'lastVisit'"
                        type="button"
                        class="start-chat-filter-panel__date-clear"
                        @click.stop="clearDateRange('lastVisit')"
                      >×</button>
                      <AgentIcon v-else name="calendar" :size="16" class="start-chat-filter-panel__date-trigger-icon" />
                    </button>
                  </div>
                </div>

                <div class="start-chat-filter-panel__footer">
                  <button type="button" class="agent-btn agent-btn--ghost start-chat-filter-panel__btn" @click="handleFilterReset">重置</button>
                  <button type="button" class="agent-btn agent-btn--primary start-chat-filter-panel__btn" @click="handleFilterConfirm">确认</button>
                </div>
              </div>
            </Transition>
          </Teleport>

          <!-- 日期选择器独立弹窗 -->
          <Teleport to="body">
            <div v-if="activeDatePicker" class="start-chat-calendar-mask" @click="activeDatePicker = null" />
            <Transition name="start-chat-filter-fade">
              <div v-if="activeDatePicker" class="start-chat-calendar-popup">
                <div class="start-chat-calendar-popup__header">
                  <span class="start-chat-calendar-popup__title">{{ activeDatePicker === 'firstVisit' ? '首次访问时间' : '最后访问时间' }}</span>
                  <button type="button" class="start-chat-calendar-popup__close" @click="activeDatePicker = null">x</button>
                </div>
                <div class="start-chat-calendar-popup__grid">
                  <div class="start-chat-calendar-popup__month">
                    <div class="start-chat-calendar-popup__nav">
                      <button type="button" class="start-chat-calendar-popup__nav-btn" @click="shiftMonth(-12)">&laquo;</button>
                      <button type="button" class="start-chat-calendar-popup__nav-btn" @click="shiftMonth(-1)">&lsaquo;</button>
                      <span class="start-chat-calendar-popup__month-title">{{ calLeftYear }}年 {{ calLeftMonth }}月</span>
                    </div>
                    <div class="start-chat-calendar-popup__weekdays">
                      <span v-for="d in weekDays" :key="d">{{ d }}</span>
                    </div>
                    <div class="start-chat-calendar-popup__days">
                      <button
                        v-for="day in calLeftDays"
                        :key="day.key"
                        type="button"
                        class="start-chat-calendar-popup__day"
                        :class="dayClasses(day, activeDatePicker)"
                        :disabled="day.disabled || day.outside"
                        @click="handleDayClick(day, activeDatePicker!)"
                        @mouseenter="handleDayHover(day)"
                      >{{ day.outside ? '' : day.day }}</button>
                    </div>
                  </div>
                  <div class="start-chat-calendar-popup__month">
                    <div class="start-chat-calendar-popup__nav">
                      <span class="start-chat-calendar-popup__month-title">{{ calRightYear }}年 {{ calRightMonth }}月</span>
                      <button type="button" class="start-chat-calendar-popup__nav-btn" :disabled="isNextMonthDisabled" @click="shiftMonth(1)">&rsaquo;</button>
                      <button type="button" class="start-chat-calendar-popup__nav-btn" :disabled="isNextYearDisabled" @click="shiftMonth(12)">&raquo;</button>
                    </div>
                    <div class="start-chat-calendar-popup__weekdays">
                      <span v-for="d in weekDays" :key="d">{{ d }}</span>
                    </div>
                    <div class="start-chat-calendar-popup__days">
                      <button
                        v-for="day in calRightDays"
                        :key="day.key"
                        type="button"
                        class="start-chat-calendar-popup__day"
                        :class="dayClasses(day, activeDatePicker)"
                        :disabled="day.disabled || day.outside"
                        @click="handleDayClick(day, activeDatePicker!)"
                        @mouseenter="handleDayHover(day)"
                      >{{ day.outside ? '' : day.day }}</button>
                    </div>
                  </div>
                </div>
              </div>
            </Transition>
          </Teleport>

          <!-- 标签选择弹窗 -->
          <Teleport to="body">
            <div v-if="tagSelectorOpen" class="start-chat-tag-mask" @click="tagSelectorOpen = false" />
            <Transition name="start-chat-filter-fade">
              <div v-if="tagSelectorOpen" class="start-chat-tag-popup" @click.stop>
                <div class="start-chat-tag-popup__header">
                  <input
                    v-model="tagSearchKeyword"
                    type="text"
                    class="start-chat-tag-popup__search"
                    placeholder="搜索标签"
                  />
                </div>
                <div class="start-chat-tag-popup__list">
                  <label
                    v-for="tag in filteredTagPool"
                    :key="tag"
                    class="start-chat-tag-popup__item"
                  >
                    <span>{{ tag }}</span>
                    <input
                      type="checkbox"
                      :checked="draftFilter.tags.includes(tag)"
                      @change="toggleTag(tag)"
                    />
                  </label>
                  <div v-if="filteredTagPool.length === 0" class="start-chat-tag-popup__empty">
                    暂无匹配标签
                  </div>
                </div>
              </div>
            </Transition>
          </Teleport>
        </div>
      </section>

      <aside class="start-chat-modal__right-pane">
        <p class="start-chat-modal__selected-title">已选择（{{ selectedContacts.length }}）</p>

        <div class="start-chat-modal__pane-body">
          <div class="start-chat-modal__selected-list agent-scroll">
            <div
              v-for="contact in selectedContacts"
              :key="contact.id"
              class="start-chat-modal__selected-item"
              :class="{ 'start-chat-modal__selected-item--fixed': isPinned(contact.id) }"
            >
              <span class="start-chat-modal__selected-main">
                <span class="start-chat-modal__avatar start-chat-modal__avatar--selected" :style="{ background: contact.avatarColor }">
                  {{ contact.avatarText }}
                </span>
                <span class="start-chat-modal__selected-name">{{ contact.name }}</span>
              </span>

              <button
                v-if="!isPinned(contact.id)"
                type="button"
                class="start-chat-modal__selected-remove"
                aria-label="删除联系人"
                @click.stop="removeSelected(contact.id)"
              >
                ×
              </button>
            </div>

            <div v-if="selectedContacts.length === 0" class="start-chat-modal__empty start-chat-modal__empty--selected">
              选择访客、客户、客服，或者手动输入联系人
            </div>
          </div>
        </div>
      </aside>
    </div>

    <template #footer>
      <span />
      <div class="start-chat-modal__footer-actions">
        <button type="button" class="agent-btn agent-btn--ghost" @click="handleClose">取消</button>
        <button
          type="button"
          class="agent-btn agent-btn--primary"
          :disabled="selectedContacts.length === 0"
          @click="handleConfirm"
        >
          确定
        </button>
      </div>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from "vue";
import { AgentIcon, BaseModal } from "@twt/ui-agent";

type StartChatTabKey = "visitor" | "customer" | "agent" | "manual";

interface StartChatCandidate {
  id: string;
  type: StartChatTabKey;
  name: string;
  avatarText: string;
  avatarColor: string;
  online?: boolean;
  visitorId?: string;
  email?: string;
  phone?: string;
  sourceSessionId?: string;
}

interface CandidateFilter {
  online: boolean | null;
  hasEmail: boolean | null;
  hasPhone: boolean | null;
  hasSession: boolean | null;
  firstVisitStart: string;
  firstVisitEnd: string;
  lastVisitStart: string;
  lastVisitEnd: string;
  tags: string[];
}

const createEmptyFilter = (): CandidateFilter => ({
  online: null,
  hasEmail: null,
  hasPhone: null,
  hasSession: null,
  firstVisitStart: "",
  firstVisitEnd: "",
  lastVisitStart: "",
  lastVisitEnd: "",
  tags: []
});

const props = defineProps<{
  open: boolean;
  candidates: StartChatCandidate[];
  pinnedContact?: StartChatCandidate | null;
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "confirm", contacts: StartChatCandidate[]): void;
}>();

const tabs: Array<{ key: StartChatTabKey; label: string }> = [
  { key: "visitor", label: "访客" },
  { key: "customer", label: "客户" },
  { key: "agent", label: "客服" },
  { key: "manual", label: "手动输入" }
];

const activeTab = ref<StartChatTabKey>("visitor");
const keyword = ref("");
const manualText = ref("");
const selectedContacts = ref<StartChatCandidate[]>([]);

const filterPanelOpen = ref(false);
const activeFilter = reactive<CandidateFilter>(createEmptyFilter());
const draftFilter = reactive<CandidateFilter>(createEmptyFilter());
const hoveredDateField = ref<DatePickerTarget | null>(null);
const hoveredTagField = ref(false);
const tagSelectorOpen = ref(false);
const tagSearchKeyword = ref("");

const tagPool = ["VIP", "普通", "潜在客户", "重要客户", "新客户"];

const selectedTagsDisplay = computed(() => {
  if (draftFilter.tags.length === 0) return "请选择";
  if (draftFilter.tags.length === 1) return draftFilter.tags[0];
  if (draftFilter.tags.length === 2) return draftFilter.tags.join("、");
  return `${draftFilter.tags[0]}、${draftFilter.tags[1]} +${draftFilter.tags.length - 2}`;
});

const filteredTagPool = computed(() => {
  if (!tagSearchKeyword.value) return tagPool;
  return tagPool.filter(tag => tag.includes(tagSearchKeyword.value));
});

const showFilterButton = computed(() => activeTab.value === "visitor" || activeTab.value === "customer");

const hasActiveFilter = computed(() =>
  activeFilter.online !== null ||
  activeFilter.hasEmail !== null ||
  activeFilter.hasPhone !== null ||
  activeFilter.hasSession !== null ||
  activeFilter.firstVisitStart !== "" ||
  activeFilter.firstVisitEnd !== "" ||
  activeFilter.lastVisitStart !== "" ||
  activeFilter.lastVisitEnd !== "" ||
  activeFilter.tags.length > 0
);

const handleTabChange = (key: StartChatTabKey) => {
  activeTab.value = key;
  filterPanelOpen.value = false;
};

const handleFilterReset = () => {
  Object.assign(draftFilter, createEmptyFilter());
  activeDatePicker.value = null;
};

const handleFilterConfirm = () => {
  Object.assign(activeFilter, draftFilter);
  filterPanelOpen.value = false;
  activeDatePicker.value = null;
  tagSelectorOpen.value = false;
};

const toggleTag = (tag: string) => {
  const index = draftFilter.tags.indexOf(tag);
  if (index > -1) {
    draftFilter.tags.splice(index, 1);
  } else {
    draftFilter.tags.push(tag);
  }
};

const clearDateRange = (target: DatePickerTarget) => {
  const startKey = target === "firstVisit" ? "firstVisitStart" : "lastVisitStart";
  const endKey = target === "firstVisit" ? "firstVisitEnd" : "lastVisitEnd";
  draftFilter[startKey] = "";
  draftFilter[endKey] = "";
};

// ---- 日期范围选择器 ----

type DatePickerTarget = "firstVisit" | "lastVisit";

interface CalendarDay {
  key: string;
  date: string; // YYYY-MM-DD
  day: number;
  outside: boolean;
  disabled: boolean;
}

const weekDays = ["一", "二", "三", "四", "五", "六", "日"];
const activeDatePicker = ref<DatePickerTarget | null>(null);
const calBaseDate = ref(new Date());
const datePickerPhase = ref<"start" | "end">("start");
const hoveredDate = ref("");

const todayStr = computed(() => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
});

const calLeftYear = computed(() => calBaseDate.value.getFullYear());
const calLeftMonth = computed(() => calBaseDate.value.getMonth() + 1);
const calRightYear = computed(() => {
  const d = new Date(calBaseDate.value);
  d.setMonth(d.getMonth() + 1);
  return d.getFullYear();
});
const calRightMonth = computed(() => {
  const d = new Date(calBaseDate.value);
  d.setMonth(d.getMonth() + 1);
  return d.getMonth() + 1;
});

const isNextMonthDisabled = computed(() => {
  const now = new Date();
  return calRightYear.value > now.getFullYear() || (calRightYear.value === now.getFullYear() && calRightMonth.value >= now.getMonth() + 1);
});

const isNextYearDisabled = computed(() => {
  const now = new Date();
  const target = new Date(calBaseDate.value);
  target.setMonth(target.getMonth() + 13);
  return target > now;
});

const buildMonthDays = (year: number, month: number): CalendarDay[] => {
  const firstDay = new Date(year, month - 1, 1);
  let startWeekday = firstDay.getDay();
  if (startWeekday === 0) startWeekday = 7;
  const daysInMonth = new Date(year, month, 0).getDate();
  const days: CalendarDay[] = [];

  for (let i = 1; i < startWeekday; i++) {
    days.push({ key: `pad-before-${i}`, date: "", day: 0, outside: true, disabled: true });
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    days.push({ key: dateStr, date: dateStr, day: d, outside: false, disabled: dateStr > todayStr.value });
  }

  const remaining = 7 - (days.length % 7);
  if (remaining < 7) {
    for (let i = 0; i < remaining; i++) {
      days.push({ key: `pad-after-${i}`, date: "", day: 0, outside: true, disabled: true });
    }
  }

  return days;
};

const calLeftDays = computed(() => buildMonthDays(calLeftYear.value, calLeftMonth.value));
const calRightDays = computed(() => buildMonthDays(calRightYear.value, calRightMonth.value));

const shiftMonth = (offset: number) => {
  const d = new Date(calBaseDate.value);
  d.setMonth(d.getMonth() + offset);
  calBaseDate.value = d;
};

const toggleDatePicker = (target: DatePickerTarget) => {
  if (activeDatePicker.value === target) {
    activeDatePicker.value = null;
    return;
  }
  activeDatePicker.value = target;
  datePickerPhase.value = "start";
  hoveredDate.value = "";
  const now = new Date();
  calBaseDate.value = new Date(now.getFullYear(), now.getMonth() - 1, 1);
};

const handleDayClick = (day: CalendarDay, target: DatePickerTarget) => {
  if (day.outside || day.disabled) return;
  const startKey = target === "firstVisit" ? "firstVisitStart" : "lastVisitStart";
  const endKey = target === "firstVisit" ? "firstVisitEnd" : "lastVisitEnd";

  if (datePickerPhase.value === "start") {
    draftFilter[startKey] = day.date;
    draftFilter[endKey] = "";
    datePickerPhase.value = "end";
    hoveredDate.value = "";
  } else {
    const start = draftFilter[startKey];
    if (day.date === start) {
      // 禁止选择单个日期，丢弃选择
      draftFilter[startKey] = "";
      draftFilter[endKey] = "";
      datePickerPhase.value = "start";
      hoveredDate.value = "";
      activeDatePicker.value = null;
      return;
    }
    if (day.date < start) {
      draftFilter[startKey] = day.date;
      draftFilter[endKey] = start;
    } else {
      draftFilter[endKey] = day.date;
    }
    datePickerPhase.value = "start";
    hoveredDate.value = "";
    activeDatePicker.value = null;
  }
};

const handleDayHover = (day: CalendarDay) => {
  if (datePickerPhase.value === "end" && !day.outside && !day.disabled) {
    hoveredDate.value = day.date;
  }
};

const dayClasses = (day: CalendarDay, target: DatePickerTarget) => {
  if (day.outside) return {};
  const startKey = target === "firstVisit" ? "firstVisitStart" : "lastVisitStart";
  const endKey = target === "firstVisit" ? "firstVisitEnd" : "lastVisitEnd";
  const start = draftFilter[startKey];
  const end = draftFilter[endKey];
  const isStart = day.date === start;
  const isEnd = day.date === end;
  const isToday = day.date === todayStr.value;

  let inRange = false;
  if (start && end) {
    inRange = day.date > start && day.date < end;
  } else if (start && !end && hoveredDate.value && datePickerPhase.value === "end") {
    const effectiveEnd = hoveredDate.value >= start ? hoveredDate.value : start;
    const effectiveStart = hoveredDate.value >= start ? start : hoveredDate.value;
    inRange = day.date > effectiveStart && day.date < effectiveEnd;
  }

  return {
    "start-chat-calendar-popup__day--today": isToday,
    "start-chat-calendar-popup__day--selected": isStart || isEnd,
    "start-chat-calendar-popup__day--in-range": inRange,
    "start-chat-calendar-popup__day--range-start": isStart && (end || hoveredDate.value),
    "start-chat-calendar-popup__day--range-end": isEnd || (datePickerPhase.value === "end" && day.date === hoveredDate.value && hoveredDate.value >= start)
  };
};

const formatDateRange = (start: string, end: string): string => {
  if (!start && !end) return "";
  const fmt = (s: string) => {
    const [y, m, d] = s.split("-");
    return `${y}/${m}/${d}`;
  };
  if (start && end) return `${fmt(start)} - ${fmt(end)}`;
  if (start) return fmt(start);
  return fmt(end);
};

const matchesFilter = (candidate: StartChatCandidate): boolean => {
  if (activeFilter.online !== null) {
    if (activeFilter.online && !candidate.online) return false;
    if (!activeFilter.online && candidate.online) return false;
  }
  if (activeFilter.hasEmail !== null) {
    const has = !!candidate.email;
    if (activeFilter.hasEmail !== has) return false;
  }
  if (activeFilter.hasPhone !== null) {
    const has = !!candidate.phone;
    if (activeFilter.hasPhone !== has) return false;
  }
  if (activeFilter.tags.length > 0) {
    const candidateTags = candidate.tags || [];
    const hasMatchingTag = activeFilter.tags.some(tag => candidateTags.includes(tag));
    if (!hasMatchingTag) return false;
  }
  return true;
};

const visibleCandidates = computed(() => {
  const search = keyword.value.trim().toLowerCase();
  const applyFilter = showFilterButton.value && hasActiveFilter.value;
  return props.candidates.filter((candidate) => {
    if (candidate.type !== activeTab.value) {
      return false;
    }

    if (search.length > 0 && !candidate.name.toLowerCase().includes(search)) {
      return false;
    }

    if (applyFilter && !matchesFilter(candidate)) {
      return false;
    }

    return true;
  });
});

const isSelected = (id: string) => selectedContacts.value.some((candidate) => candidate.id === id);
const isPinned = (id: string) => props.pinnedContact?.id === id;

const toggleCandidate = (candidate: StartChatCandidate) => {
  if (isSelected(candidate.id)) {
    if (isPinned(candidate.id)) {
      return;
    }
    removeSelected(candidate.id);
    return;
  }
  selectedContacts.value = [...selectedContacts.value, candidate];
};

const removeSelected = (id: string) => {
  if (isPinned(id)) {
    return;
  }
  selectedContacts.value = selectedContacts.value.filter((candidate) => candidate.id !== id);
};

const buildManualCandidate = (value: string): StartChatCandidate => ({
  id: `manual:${value.toLowerCase()}`,
  type: "manual",
  name: value,
  avatarText: getInitial(value),
  avatarColor: "linear-gradient(135deg, #94a3b8 0%, #64748b 100%)"
});

const appendManualEntries = () => {
  const entries = manualText.value
    .split(/[\n,，;；]/)
    .map((item) => item.trim())
    .filter(Boolean)
    .map(buildManualCandidate)
    .filter((candidate, index, list) => list.findIndex((item) => item.id === candidate.id) === index)
    .filter((candidate) => !isSelected(candidate.id));

  if (entries.length === 0) {
    return;
  }

  selectedContacts.value = [...selectedContacts.value, ...entries];
  manualText.value = "";
};

const resetState = () => {
  activeTab.value = "visitor";
  keyword.value = "";
  manualText.value = "";
  filterPanelOpen.value = false;
  activeDatePicker.value = null;
  Object.assign(activeFilter, createEmptyFilter());
  Object.assign(draftFilter, createEmptyFilter());
  selectedContacts.value = props.pinnedContact ? [props.pinnedContact] : [];
};

const handleClose = () => {
  resetState();
  emit("close");
};

const handleConfirm = () => {
  if (selectedContacts.value.length === 0) {
    return;
  }
  emit("confirm", [...selectedContacts.value]);
};

watch(
  () => props.open,
  (open) => {
    if (open) {
      resetState();
    }
  }
);

watch(filterPanelOpen, (open) => {
  if (open) {
    Object.assign(draftFilter, activeFilter);
  }
});

function getInitial(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) {
    return "?";
  }
  const first = trimmed[0];
  return /[a-zA-Z]/.test(first) ? first.toUpperCase() : first;
}
</script>

<style>
.modal-mask:has(.start-chat-modal) {
  background: rgba(15, 23, 42, 0.28);
  padding: 32px;
}

.modal-card:has(.start-chat-modal) {
  border: 1px solid #e7edf5;
  border-radius: 30px;
  box-shadow: 0 20px 56px rgba(15, 23, 42, 0.14);
  box-sizing: border-box;
  display: grid;
  grid-template-rows: 66px minmax(0, 1fr) 74px;
  height: 540px;
  max-height: calc(100vh - 48px);
  max-width: 684px !important;
  overflow: hidden;
  width: min(684px, calc(100vw - 32px));
}

.modal-card:has(.start-chat-modal) > .modal-card__header {
  box-sizing: border-box;
  padding: 18px 24px 14px;
}

.modal-card:has(.start-chat-modal) > .modal-card__body {
  box-sizing: border-box;
  min-height: 0;
  overflow: hidden;
  padding: 0 24px;
}

.modal-card:has(.start-chat-modal) > .modal-card__footer {
  box-sizing: border-box;
  padding: 0 24px 22px;
}

.modal-card:has(.start-chat-modal) .agent-title {
  color: #111827;
  font-size: 22px;
  font-weight: 700;
  letter-spacing: 0.01em;
}

.modal-card:has(.start-chat-modal) .close-btn {
  align-items: center;
  border-radius: 999px;
  color: #111827;
  display: inline-flex;
  font-size: 26px;
  font-weight: 400;
  height: 30px;
  justify-content: center;
  line-height: 1;
  padding: 0;
  width: 30px;
}

.modal-card:has(.start-chat-modal) .close-btn:hover {
  background: rgba(15, 23, 42, 0.04);
}

.start-chat-modal {
  align-items: stretch;
  display: grid;
  flex: 1 1 auto;
  gap: 24px;
  grid-template-columns: 320px minmax(0, 1fr);
  height: 100%;
  min-height: 0;
  overflow: hidden;
}

.start-chat-modal__left-pane {
  border-right: 1px solid #edf2f7;
  display: grid;
  gap: 14px;
  grid-template-rows: 42px auto minmax(0, 1fr);
  height: 100%;
  min-height: 0;
  overflow: hidden;
  padding-right: 24px;
}

.start-chat-modal__right-pane {
  display: grid;
  gap: 14px;
  grid-template-rows: auto minmax(0, 1fr);
  height: 100%;
  min-height: 0;
  min-width: 0;
  overflow: hidden;
  padding-top: 2px;
}

.start-chat-modal__search-wrap {
  align-items: center;
  background: #ffffff;
  border: 1px solid #dbe4f0;
  border-radius: 12px;
  display: flex;
  gap: 10px;
  height: 42px;
  padding: 0 14px;
}

.start-chat-modal__search-icon {
  color: #a1afc3;
  flex-shrink: 0;
}

.start-chat-modal__search-input {
  background: transparent;
  border: 0;
  box-shadow: none;
  color: #111827;
  flex: 1;
  font-size: 14px;
  font-weight: 500;
  height: 100%;
  min-width: 0;
  padding: 0;
}

.start-chat-modal__search-input::placeholder {
  color: #b1bccb;
}

.start-chat-modal__search-input:focus {
  box-shadow: none;
}

.start-chat-modal__filter-btn {
  align-items: center;
  background: transparent;
  border: 0;
  border-radius: 8px;
  color: #a1afc3;
  cursor: pointer;
  display: inline-flex;
  flex-shrink: 0;
  height: 30px;
  justify-content: center;
  padding: 0;
  transition: color 0.18s ease, background-color 0.18s ease;
  width: 30px;
}

.start-chat-modal__filter-btn:hover {
  background: #f5f8fc;
  color: #4e5969;
}

.start-chat-modal__filter-btn--active {
  color: #2f6bff;
}

.start-chat-modal__filter-btn--active:hover {
  background: #e8f0ff;
  color: #2f6bff;
}

.start-chat-modal__tabs {
  display: flex;
  flex-wrap: nowrap;
  gap: 8px;
  min-width: 0;
  overflow: hidden;
}

.start-chat-modal__pane-body {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  height: 100%;
  min-height: 0;
  overflow: hidden;
  position: relative;
}

.start-chat-modal__tab {
  align-items: center;
  background: transparent;
  border: 0;
  border-radius: 10px;
  color: #344054;
  cursor: pointer;
  display: inline-flex;
  flex: 0 0 auto;
  font-size: 13px;
  font-weight: 600;
  gap: 4px;
  height: 34px;
  justify-content: center;
  padding: 0 12px;
  transition: background-color 0.18s ease, color 0.18s ease;
  white-space: nowrap;
}

.start-chat-modal__tab:hover {
  background: #f5f8fc;
}

.start-chat-modal__tab--active {
  background: #e8f0ff;
  color: #2f6bff;
}

.start-chat-modal__tab-help {
  color: #91a3c0;
}

.start-chat-modal__candidate-list,
.start-chat-modal__selected-list,
.start-chat-modal__manual-pane {
  -ms-overflow-style: none;
  min-height: 0;
  scrollbar-width: none;
}

.start-chat-modal__candidate-list::-webkit-scrollbar,
.start-chat-modal__selected-list::-webkit-scrollbar,
.start-chat-modal__manual-pane::-webkit-scrollbar {
  display: none;
  height: 0;
  width: 0;
}

.start-chat-modal__candidate-list {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  gap: 4px;
  height: 100%;
  min-height: 0;
  overflow: auto;
  padding-right: 4px;
}

.start-chat-modal__candidate-row {
  align-items: center;
  background: transparent;
  border: 0;
  border-radius: 14px;
  cursor: pointer;
  display: grid;
  gap: 10px;
  grid-template-columns: 20px 36px minmax(0, 1fr);
  min-height: 44px;
  padding: 0 4px 0 2px;
  text-align: left;
  transition: background-color 0.18s ease;
  width: 100%;
}

.start-chat-modal__candidate-row:hover {
  background: #f7faff;
}

.start-chat-modal__checkbox {
  align-items: center;
  background: transparent;
  border: 1.5px solid #d7e0ec;
  border-radius: 999px;
  color: transparent;
  display: inline-flex;
  height: 20px;
  justify-content: center;
  width: 20px;
}

.start-chat-modal__checkbox--selected {
  color: #2f6bff;
}

.start-chat-modal__checkbox-icon {
  display: block;
}

.start-chat-modal__avatar {
  align-items: center;
  border-radius: 999px;
  color: #ffffff;
  display: inline-flex;
  flex-shrink: 0;
  font-size: 14px;
  font-weight: 700;
  height: 36px;
  justify-content: center;
  min-width: 36px;
  padding: 0 8px;
}

.start-chat-modal__avatar--selected {
  font-size: 13px;
  height: 28px;
  min-width: 28px;
}

.start-chat-modal__candidate-name,
.start-chat-modal__selected-name {
  color: #111827;
  font-size: 14px;
  font-weight: 600;
  line-height: 1.3;
}

.start-chat-modal__candidate-name {
  min-width: 0;
}

.start-chat-modal__manual-pane {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  gap: 10px;
  height: 100%;
  min-height: 0;
  min-width: 0;
  overflow: hidden;
  padding-right: 4px;
}

.start-chat-modal__manual-input {
  border: 1px solid #dbe4f0;
  border-radius: 14px;
  box-shadow: none;
  color: #111827;
  flex: 1 1 0;
  font-size: 14px;
  line-height: 1.6;
  min-height: 0;
  padding: 14px;
  resize: none;
}

.start-chat-modal__manual-input::placeholder {
  color: #b1bccb;
}

.start-chat-modal__manual-tip {
  color: #667085;
  font-size: 12px;
  line-height: 1.5;
  margin: 0;
}

.start-chat-modal__manual-submit {
  align-self: flex-start;
  border-radius: 12px;
  font-size: 13px;
  height: 36px;
  padding: 0 16px;
}

.start-chat-modal__selected-title {
  color: #111827;
  font-size: 16px;
  font-weight: 700;
  line-height: 1.25;
  margin: 2px 0 0;
}

.start-chat-modal__selected-list {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  gap: 8px;
  height: 100%;
  min-height: 0;
  overflow: auto;
  padding-right: 4px;
}

.start-chat-modal__selected-item {
  align-items: center;
  background: #f4f6fb;
  border-radius: 14px;
  display: flex;
  justify-content: space-between;
  min-height: 42px;
  padding: 7px 10px;
  width: 100%;
}

.start-chat-modal__selected-item--fixed {
  padding-right: 10px;
}

.start-chat-modal__selected-main {
  align-items: center;
  display: inline-flex;
  gap: 8px;
  min-width: 0;
}

.start-chat-modal__selected-name {
  font-size: 13px;
}

.start-chat-modal__selected-remove {
  align-items: center;
  background: transparent;
  border: 0;
  border-radius: 999px;
  color: #98a2b3;
  cursor: pointer;
  display: inline-flex;
  font-size: 18px;
  height: 22px;
  justify-content: center;
  line-height: 1;
  padding: 0;
  width: 22px;
}

.start-chat-modal__selected-remove:hover {
  background: #e8edf5;
  color: #475467;
}

.start-chat-modal__footer-actions {
  display: flex;
  gap: 8px;
}

.start-chat-modal__footer-actions .agent-btn {
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  height: 36px;
  justify-content: center;
  min-width: 72px;
  padding: 0 14px;
}

.start-chat-modal__footer-actions .agent-btn--ghost {
  border-color: #d5deea;
  color: #344054;
}

.start-chat-modal__footer-actions .agent-btn--primary {
  box-shadow: 0 10px 30px rgba(47, 107, 255, 0.18);
}

.start-chat-modal__empty {
  align-items: center;
  background: #fafbfd;
  border: 1px dashed #dde5ef;
  border-radius: 14px;
  color: #98a2b3;
  display: flex;
  flex: 1 1 auto;
  font-size: 13px;
  height: 100%;
  justify-content: center;
  min-height: 0;
  text-align: center;
}

.start-chat-modal__empty--selected {
  padding: 0 14px;
}

/* ---- Filter Panel ---- */

.start-chat-filter-mask {
  inset: 0;
  position: fixed;
  z-index: 1250;
}

.start-chat-filter-panel {
  background: #ffffff;
  border: 1px solid #e7edf5;
  border-radius: 20px;
  box-shadow: 0 18px 48px rgba(15, 23, 42, 0.14);
  display: flex;
  flex-direction: column;
  left: 50%;
  max-height: 460px;
  overflow: hidden;
  position: fixed;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 320px;
  z-index: 1260;
}

.start-chat-filter-panel__body {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  gap: 20px;
  min-height: 0;
  overflow: auto;
  padding: 20px 20px 8px;
}

.start-chat-filter-panel__body::-webkit-scrollbar {
  display: none;
}

.start-chat-filter-panel__section {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.start-chat-filter-panel__label {
  color: #2f6bff;
  font-size: 14px;
  font-weight: 600;
  margin: 0;
}

.start-chat-filter-panel__options {
  display: grid;
  gap: 10px;
  grid-template-columns: 1fr 1fr;
}

.start-chat-filter-panel__option {
  align-items: center;
  background: #f4f6fb;
  border: 1.5px solid transparent;
  border-radius: 12px;
  color: #1f2329;
  cursor: pointer;
  display: inline-flex;
  font-size: 14px;
  font-weight: 600;
  height: 42px;
  justify-content: center;
  padding: 0 12px;
  transition: background-color 0.18s ease, border-color 0.18s ease, color 0.18s ease;
}

.start-chat-filter-panel__option:hover {
  background: #edf2fa;
}

.start-chat-filter-panel__option--selected {
  background: #e8f0ff;
  border-color: #2f6bff;
  color: #2f6bff;
}

.start-chat-filter-panel__option--selected:hover {
  background: #dde8ff;
}

.start-chat-filter-panel__date-trigger {
  align-items: center;
  background: #f4f6fb;
  border: 1.5px solid transparent;
  border-radius: 12px;
  color: #b1bccb;
  cursor: pointer;
  display: flex;
  font-size: 13px;
  font-weight: 500;
  gap: 8px;
  height: 42px;
  justify-content: space-between;
  padding: 0 12px;
  transition: border-color 0.18s ease;
  width: 100%;
}

.start-chat-filter-panel__date-trigger--has-value {
  color: #1f2329;
}

.start-chat-filter-panel__date-trigger:hover {
  border-color: #dbe4f0;
}

.start-chat-filter-panel__date-trigger-text {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.start-chat-filter-panel__date-trigger-icon {
  color: #98a2b3;
  flex-shrink: 0;
}

.start-chat-filter-panel__date-clear {
  align-items: center;
  background: transparent;
  border: 0;
  border-radius: 50%;
  color: #98a2b3;
  cursor: pointer;
  display: inline-flex;
  flex-shrink: 0;
  font-size: 18px;
  height: 20px;
  justify-content: center;
  line-height: 1;
  padding: 0;
  transition: background-color 0.18s ease, color 0.18s ease;
  width: 20px;
}

.start-chat-filter-panel__date-clear:hover {
  background: #e8edf5;
  color: #475467;
}

/* ---- Calendar Popup (独立弹窗，位于筛选面板上方) ---- */

.start-chat-calendar-mask {
  inset: 0;
  position: fixed;
  z-index: 1270;
}

.start-chat-calendar-popup {
  background: #ffffff;
  border: 1px solid #e7edf5;
  border-radius: 20px;
  box-shadow: 0 20px 56px rgba(15, 23, 42, 0.16);
  left: 50%;
  padding: 20px;
  position: fixed;
  top: 50%;
  transform: translate(-50%, calc(-50% - 40px));
  width: 520px;
  z-index: 1280;
}

.start-chat-calendar-popup__header {
  align-items: center;
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
}

.start-chat-calendar-popup__title {
  color: #2f6bff;
  font-size: 15px;
  font-weight: 700;
}

.start-chat-calendar-popup__close {
  align-items: center;
  background: transparent;
  border: 0;
  border-radius: 999px;
  color: #98a2b3;
  cursor: pointer;
  display: inline-flex;
  font-size: 18px;
  height: 28px;
  justify-content: center;
  line-height: 1;
  width: 28px;
}

.start-chat-calendar-popup__close:hover {
  background: #f5f8fc;
  color: #475467;
}

.start-chat-calendar-popup__grid {
  display: grid;
  gap: 20px;
  grid-template-columns: 1fr 1fr;
}

.start-chat-calendar-popup__nav {
  align-items: center;
  display: flex;
  gap: 4px;
  justify-content: center;
  margin-bottom: 10px;
}

.start-chat-calendar-popup__month-title {
  color: #1f2329;
  flex: 1;
  font-size: 14px;
  font-weight: 600;
  text-align: center;
}

.start-chat-calendar-popup__nav-btn {
  align-items: center;
  background: transparent;
  border: 0;
  border-radius: 6px;
  color: #667085;
  cursor: pointer;
  display: inline-flex;
  font-size: 16px;
  height: 28px;
  justify-content: center;
  line-height: 1;
  width: 28px;
}

.start-chat-calendar-popup__nav-btn:hover:not(:disabled) {
  background: #f5f8fc;
  color: #1f2329;
}

.start-chat-calendar-popup__nav-btn:disabled {
  color: #d0d5dd;
  cursor: not-allowed;
}

.start-chat-calendar-popup__weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  margin-bottom: 4px;
}

.start-chat-calendar-popup__weekdays span {
  color: #667085;
  font-size: 12px;
  font-weight: 600;
  padding: 4px 0;
  text-align: center;
}

.start-chat-calendar-popup__days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
}

.start-chat-calendar-popup__day {
  align-items: center;
  background: transparent;
  border: 0;
  border-radius: 8px;
  color: #1f2329;
  cursor: pointer;
  display: inline-flex;
  font-size: 13px;
  height: 32px;
  justify-content: center;
  transition: background-color 0.12s ease, color 0.12s ease;
  width: 100%;
}

.start-chat-calendar-popup__day:hover:not(:disabled) {
  background: #f5f8fc;
}

.start-chat-calendar-popup__day:disabled {
  color: #d0d5dd;
  cursor: not-allowed;
}

.start-chat-calendar-popup__day--today {
  border: 1px solid #2f6bff;
  color: #2f6bff;
}

.start-chat-calendar-popup__day--selected {
  background: #2f6bff !important;
  color: #ffffff !important;
}

.start-chat-calendar-popup__day--in-range {
  background: #e8f0ff;
  border-radius: 0;
}

.start-chat-calendar-popup__day--range-start {
  border-radius: 8px 0 0 8px;
}

.start-chat-calendar-popup__day--range-end {
  border-radius: 0 8px 8px 0;
}

.start-chat-filter-panel__footer {
  border-top: 1px solid #edf2f7;
  display: grid;
  gap: 12px;
  grid-template-columns: 1fr 1fr;
  padding: 16px 20px;
}

.start-chat-filter-panel__btn {
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  height: 42px;
  justify-content: center;
  width: 100%;
}

.start-chat-filter-panel__footer .agent-btn--ghost {
  border-color: #d5deea;
  color: #344054;
}

.start-chat-filter-panel__footer .agent-btn--primary {
  box-shadow: 0 10px 30px rgba(47, 107, 255, 0.18);
}

.start-chat-filter-fade-enter-active,
.start-chat-filter-fade-leave-active {
  transition: opacity 0.18s ease;
}

.start-chat-filter-fade-enter-from,
.start-chat-filter-fade-leave-to {
  opacity: 0;
}

@media (max-width: 1180px) {
  .modal-card:has(.start-chat-modal) {
    height: 540px;
    max-height: calc(100vh - 24px);
    width: min(684px, calc(100vw - 24px));
  }

  .modal-card:has(.start-chat-modal) > .modal-card__header {
    padding: 22px 24px 14px;
  }

  .modal-card:has(.start-chat-modal) > .modal-card__body {
    padding: 0 24px;
  }

  .modal-card:has(.start-chat-modal) > .modal-card__footer {
    padding: 0 24px 22px;
  }

  .modal-card:has(.start-chat-modal) .agent-title {
    font-size: 22px;
  }

  .start-chat-modal {
    gap: 24px;
    grid-template-columns: 320px minmax(0, 1fr);
  }

  .start-chat-modal__left-pane {
    padding-right: 24px;
  }
}

@media (max-width: 768px) {
  .modal-mask:has(.start-chat-modal) {
    padding: 12px;
  }

  .modal-card:has(.start-chat-modal) {
    border-radius: 24px;
    height: 540px;
    max-height: calc(100vh - 24px);
    width: calc(100vw - 24px);
  }

  .modal-card:has(.start-chat-modal) > .modal-card__header {
    padding: 24px 20px 16px;
  }

  .modal-card:has(.start-chat-modal) > .modal-card__body {
    padding: 0 20px;
  }

  .modal-card:has(.start-chat-modal) > .modal-card__footer {
    padding: 0 20px 20px;
  }

  .modal-card:has(.start-chat-modal) .agent-title {
    font-size: 20px;
  }

  .start-chat-modal {
    gap: 16px;
    grid-template-columns: minmax(0, 1fr);
  }

  .start-chat-modal__left-pane {
    border-bottom: 1px solid #edf2f7;
    border-right: 0;
    gap: 12px;
    grid-template-rows: 42px auto minmax(0, 1fr);
    padding-bottom: 16px;
    padding-right: 0;
  }

  .start-chat-modal__right-pane {
    gap: 12px;
    grid-template-rows: auto minmax(0, 1fr);
  }

  .start-chat-modal__search-wrap {
    border-radius: 16px;
    height: 42px;
    padding: 0 18px;
  }

  .start-chat-modal__search-input {
    font-size: 14px;
  }

  .start-chat-modal__tabs {
    gap: 8px;
  }

  .start-chat-modal__tab {
    border-radius: 14px;
    font-size: 13px;
    height: 34px;
    padding: 0 12px;
  }

  .start-chat-modal__candidate-row {
    gap: 10px;
    grid-template-columns: 20px 36px minmax(0, 1fr);
    min-height: 42px;
  }

  .start-chat-modal__checkbox {
    height: 20px;
    width: 20px;
  }

  .start-chat-modal__avatar {
    font-size: 14px;
    height: 36px;
    min-width: 36px;
  }

  .start-chat-modal__avatar--selected {
    height: 28px;
    min-width: 28px;
  }

  .start-chat-modal__candidate-name,
  .start-chat-modal__selected-name {
    font-size: 14px;
  }

  .start-chat-modal__selected-title {
    font-size: 16px;
  }

  .start-chat-modal__selected-item {
    border-radius: 14px;
    min-height: 42px;
    padding: 7px 10px;
  }

  .start-chat-modal__manual-input {
    font-size: 14px;
    min-height: 0;
    padding: 14px;
  }

  .start-chat-modal__manual-tip {
    font-size: 12px;
  }

  .start-chat-modal__manual-submit,
  .start-chat-modal__footer-actions .agent-btn {
    border-radius: 16px;
    font-size: 14px;
    height: 36px;
  }

  .start-chat-modal__footer-actions .agent-btn {
    min-width: 72px;
    padding: 0 14px;
  }

  .start-chat-filter-panel {
    width: calc(100vw - 48px);
  }
}

/* 标签选择弹窗 */
.start-chat-tag-mask {
  background: transparent;
  inset: 0;
  position: fixed;
  z-index: 1270;
}

.start-chat-tag-popup {
  background: #fff;
  border: 1px solid var(--agent-color-border-default);
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  left: 50%;
  max-height: 400px;
  max-width: 320px;
  position: fixed;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 90%;
  z-index: 1271;
}

.start-chat-tag-popup__header {
  border-bottom: 1px solid var(--agent-color-border-default);
  padding: 12px;
}

.start-chat-tag-popup__search {
  border: 1px solid var(--agent-color-border-default);
  border-radius: 8px;
  font-size: 14px;
  padding: 8px 12px;
  width: 100%;
}

.start-chat-tag-popup__list {
  max-height: 300px;
  overflow-y: auto;
  padding: 8px;
}

.start-chat-tag-popup__item {
  align-items: center;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  gap: 8px;
  padding: 10px 12px;
}

.start-chat-tag-popup__item:hover {
  background: var(--agent-color-bg-secondary);
}

.start-chat-tag-popup__item input[type="checkbox"] {
  cursor: pointer;
}

.start-chat-tag-popup__empty {
  color: var(--agent-color-text-tertiary);
  font-size: 14px;
  padding: 20px;
  text-align: center;
}

.start-chat-filter-panel__tag-trigger {
  align-items: center;
  background: #fff;
  border: 1px solid var(--agent-color-border-default);
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  font-size: 14px;
  gap: 8px;
  justify-content: space-between;
  padding: 8px 12px;
  width: 100%;
}

.start-chat-filter-panel__tag-trigger--has-value {
  border-color: var(--agent-color-brand-primary);
  color: var(--agent-color-brand-primary);
}

.start-chat-filter-panel__tag-clear {
  align-items: center;
  background: transparent;
  border: 0;
  border-radius: 50%;
  color: #9ca3af;
  cursor: pointer;
  display: flex;
  font-size: 18px;
  height: 20px;
  justify-content: center;
  line-height: 1;
  padding: 0;
  width: 20px;
}

.start-chat-filter-panel__tag-clear:hover {
  background: #f3f4f6;
  color: #6b7280;
}
</style>
