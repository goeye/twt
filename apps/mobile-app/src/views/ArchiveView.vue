<template>
  <div class="archive-page">
    <div class="page-bg" />

    <!-- 页面标题 / Tab 切换 -->
    <div class="page-header">
      <div class="header-tabs">
        <span
          class="header-tab"
          :class="{ 'header-tab--active': activeTab === 'session' }"
          @click="activeTab = 'session'"
        >会话记录</span>
        <span
          class="header-tab"
          :class="{ 'header-tab--active': activeTab === 'chat' }"
          @click="activeTab = 'chat'"
        >聊天记录</span>
      </div>
    </div>

    <!-- 搜索栏 -->
    <div class="search-bar">
      <div class="search-field-select" @click="showFieldSheet = true">
        <span class="search-field-label">{{ currentSearchField }}</span>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M3 4.5L6 7.5L9 4.5" stroke="#222" stroke-width="1.2" stroke-linecap="round" />
        </svg>
      </div>
      <div class="search-divider" />
      <svg class="search-icon" width="14" height="14" viewBox="0 0 14 14" fill="none">
        <circle cx="6" cy="6" r="5" stroke="rgba(100,116,145,0.5)" stroke-width="1.5" />
        <path d="M10 10L13 13" stroke="rgba(100,116,145,0.5)" stroke-width="1.5" stroke-linecap="round" />
      </svg>
      <input class="search-input" type="text" placeholder="请输入" />
    </div>

    <!-- 筛选行 -->
    <div class="filter-row">
      <div class="filter-chips">
        <template v-if="activeTab === 'session'">
          <button v-for="f in sessionFilters" :key="f" class="filter-chip" @click="handleFilterClick(f)">
            {{ f }}
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M3 4.5L6 7.5L9 4.5" stroke="#222" stroke-width="1.2" stroke-linecap="round" />
            </svg>
          </button>
        </template>
        <template v-else>
          <button v-for="f in chatFilters" :key="f" class="filter-chip" @click="handleFilterClick(f)">
            {{ f }}
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M3 4.5L6 7.5L9 4.5" stroke="#222" stroke-width="1.2" stroke-linecap="round" />
            </svg>
          </button>
        </template>
      </div>
      <div class="filter-actions">
        <button class="filter-action-btn" @click="showSortSheet = true">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M4 2V14M4 2L2 4M4 2L6 4M12 14V2M12 14L10 12M12 14L14 12" stroke="#222" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>
        <button class="filter-action-btn" @click="goToAllFilters">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M2 4H14L10 9V13L6 14V9L2 4Z" stroke="#222" stroke-width="1.2" stroke-linejoin="round" />
          </svg>
        </button>
      </div>
    </div>

    <!-- 列表 -->
    <div class="archive-list">
      <!-- 会话记录 -->
      <template v-if="activeTab === 'session'">
        <div v-for="item in sessionList" :key="item.id" class="session-card" @click="handleSessionClick(item)">
          <div class="session-top">
            <span class="session-title">{{ item.title }}</span>
            <span class="status-badge" :class="`status-badge--${item.statusType}`">{{ item.status }}</span>
          </div>
          <div class="session-people">
            <template v-if="item.agentAvatar">
              <img :src="item.agentAvatar" class="people-avatar" />
              <span class="people-name">{{ item.agentName }}</span>
            </template>
            <span class="people-visitor">访客：{{ item.visitor }}</span>
          </div>
          <div v-if="item.tags.length" class="session-tags">
            <span v-for="(tag, i) in item.tags.slice(0, 3)" :key="i" class="tag-chip">{{ tag }}</span>
            <span v-if="item.tags.length > 3" class="tag-chip">+{{ item.tags.length - 3 }}</span>
          </div>
        </div>
      </template>

      <!-- 聊天记录 -->
      <template v-else>
        <div v-for="item in chatRecordList" :key="item.id" class="chat-record-card" @click="handleChatClick(item)">
          <div class="chat-record-avatar" v-if="item.avatarType === 'duo'">
            <img :src="item.avatar1" class="duo-avatar duo-avatar--main" />
            <img :src="item.avatar2" class="duo-avatar duo-avatar--sub" />
          </div>
          <div class="chat-record-avatar" v-else>
            <div class="avatar-group">
              <img v-for="(av, i) in item.avatars!.slice(0, 4)" :key="i" :src="av" class="avatar-group-item" />
            </div>
          </div>
          <div class="chat-record-content">
            <div class="chat-record-name-row">
              <span class="chat-record-name">{{ item.name }}</span>
              <span v-if="item.tag" class="chat-tag">{{ item.tag }}</span>
            </div>
            <span class="chat-record-msg">{{ item.lastMessage }}</span>
          </div>
        </div>
      </template>
    </div>

    <!-- 搜索字段选择弹窗 -->
    <Transition name="sheet">
      <div v-if="showFieldSheet" class="sheet-overlay" @click.self="showFieldSheet = false">
        <div class="sheet">
          <div class="sheet-options">
            <button
              v-for="field in searchFieldOptions"
              :key="field"
              class="sheet-option"
              @click="selectSearchField(field)"
            >
              {{ field }}
            </button>
          </div>
          <button class="sheet-cancel" @click="showFieldSheet = false">取消</button>
        </div>
      </div>
    </Transition>

    <!-- 状态筛选弹窗 -->
    <Transition name="sheet">
      <div v-if="showStatusSheet" class="sheet-overlay" @click.self="showStatusSheet = false">
        <div class="sheet">
          <div class="sheet-options">
            <button
              v-for="status in statusOptions"
              :key="status"
              class="sheet-option"
              @click="selectStatus(status)"
            >
              {{ status }}
            </button>
          </div>
          <button class="sheet-cancel" @click="showStatusSheet = false">取消</button>
        </div>
      </div>
    </Transition>

    <!-- 标签筛选弹窗 -->
    <Transition name="sheet">
      <div v-if="showTagSheet" class="sheet-overlay" @click.self="showTagSheet = false">
        <div class="sheet">
          <div class="sheet-options">
            <button
              v-for="tag in tagOptions"
              :key="tag"
              class="sheet-option"
              :class="{ 'sheet-option--selected': selectedTags.has(tag) }"
              @click="toggleTag(tag)"
            >
              <span>{{ tag }}</span>
              <span v-if="selectedTags.has(tag)" class="sheet-option-check">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <circle cx="9" cy="9" r="8" fill="#105eff" stroke="#105eff" stroke-width="2" />
                  <path d="M5 9L8 12L13 6" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </span>
              <span v-else class="sheet-option-check">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <circle cx="9" cy="9" r="8" stroke="#e2e8ef" stroke-width="2" />
                </svg>
              </span>
            </button>
          </div>
          <div class="sheet-actions">
            <button class="sheet-action-btn sheet-action-btn--secondary" @click="resetTags">重置</button>
            <button class="sheet-action-btn sheet-action-btn--primary" @click="confirmTags">确定</button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- 访客评价筛选弹窗 -->
    <Transition name="sheet">
      <div v-if="showRatingSheet" class="sheet-overlay" @click.self="showRatingSheet = false">
        <div class="sheet">
          <div class="sheet-options">
            <button
              v-for="rating in ratingOptions"
              :key="rating"
              class="sheet-option"
              @click="selectRating(rating)"
            >
              {{ rating }}
            </button>
          </div>
          <button class="sheet-cancel" @click="showRatingSheet = false">取消</button>
        </div>
      </div>
    </Transition>

    <!-- 排序筛选弹窗 -->
    <Transition name="sheet">
      <div v-if="showSortSheet" class="sheet-overlay" @click.self="showSortSheet = false">
        <div class="sheet">
          <div class="sheet-options">
            <button
              v-for="sort in (activeTab === 'session' ? sortOptions : chatSortOptions)"
              :key="sort"
              class="sheet-option"
              @click="selectSort(sort)"
            >
              {{ sort }}
            </button>
          </div>
          <button class="sheet-cancel" @click="showSortSheet = false">取消</button>
        </div>
      </div>
    </Transition>

    <!-- 消息数量筛选弹窗 -->
    <Transition name="sheet">
      <div v-if="showMessageCountSheet" class="sheet-overlay" @click.self="showMessageCountSheet = false">
        <div class="sheet sheet--message-count">
          <div class="message-count-header">
            <button class="message-count-close" @click="showMessageCountSheet = false">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M6 6L18 18M18 6L6 18" stroke="#222" stroke-width="2" stroke-linecap="round" />
              </svg>
            </button>
            <span class="message-count-title">消息数量</span>
            <span class="message-count-placeholder" />
          </div>
          <div class="message-count-content">
            <div class="message-count-label">消息数量范围</div>
            <div class="message-count-inputs">
              <input
                v-model.number="messageCountMin"
                type="number"
                class="message-count-input"
                placeholder="最小值"
              />
              <span class="message-count-separator">-</span>
              <input
                v-model.number="messageCountMax"
                type="number"
                class="message-count-input"
                placeholder="不限"
              />
            </div>
          </div>
          <div class="message-count-actions">
            <button class="message-count-btn message-count-btn--secondary" @click="resetMessageCount">重置</button>
            <button class="message-count-btn message-count-btn--primary" @click="confirmMessageCount">确定</button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const activeTab = ref<"session" | "chat">("session");
const showFieldSheet = ref(false);
const showStatusSheet = ref(false);
const showTagSheet = ref(false);
const showRatingSheet = ref(false);
const showSortSheet = ref(false);
const showMessageCountSheet = ref(false);
const currentSearchField = ref("访客姓名");
const selectedTags = ref(new Set<string>());
const messageCountMin = ref<number | null>(null);
const messageCountMax = ref<number | null>(null);

const sessionFilters = ["状态", "标签", "访客评价"];
const chatFilters = ["类型", "分类", "消息数量"];

const statusOptions = ["不限", "待回复", "排队中", "待处理", "已回复", "已关闭"];
const tagOptions = ["有购买意向", "外部推荐", "广告投放", "待跟进", "情绪稳定"];
const ratingOptions = ["不限", "满意", "一般", "不满意"];
const sortOptions = ["默认排序", "按发起时间", "按接待时间"];

// 聊天记录筛选选项
const chatTypeOptions = ["聊天标题", "参与人", "消息内容"];
const chatCategoryOptions = ["全部", "内部", "外部"];
const chatSortOptions = ["默认排序", "按最后消息时间"];

const searchFieldOptions = computed(() => {
  return activeTab.value === "session"
    ? ["访客姓名", "访客备注名", "会话标题"]
    : ["聊天标题", "参与人", "消息内容"];
});

interface SessionItem {
  id: number;
  title: string;
  status: string;
  statusType: "replied" | "queuing" | "closed" | "pending" | "processing";
  agentAvatar?: string;
  agentName?: string;
  visitor: string;
  tags: string[];
}

interface ChatRecordItem {
  id: number;
  name: string;
  lastMessage: string;
  avatarType: "duo" | "group";
  avatar1?: string;
  avatar2?: string;
  avatars?: string[];
  tag?: string;
}

const sessionList = ref<SessionItem[]>([
  {
    id: 1,
    title: "咨询支付问题",
    status: "已回复",
    statusType: "replied",
    agentAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=48&h=48&fit=crop&crop=face",
    agentName: "客服-李昭宁",
    visitor: "Visitor9",
    tags: ["有购买意向", "价格敏感", "视频电话咨询客户已预约需演示核心功能"]
  },
  {
    id: 2,
    title: "反馈API Key格式错误",
    status: "排队中",
    statusType: "queuing",
    visitor: "Visitor9",
    tags: ["价格敏感"]
  },
  {
    id: 3,
    title: "这是一个很长的会话标题这是…",
    status: "已关闭",
    statusType: "closed",
    agentAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=48&h=48&fit=crop&crop=face",
    agentName: "AlienWang",
    visitor: "Visitor11",
    tags: ["价格敏感"]
  },
  {
    id: 4,
    title: "咨询业务问题",
    status: "待回复",
    statusType: "pending",
    agentAvatar: "data:image/svg+xml,%3Csvg width='48' height='48' viewBox='0 0 48 48' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='48' height='48' rx='24' fill='%23105EFF'/%3E%3Cpath d='M24 14C18.48 14 14 18.48 14 24C14 29.52 18.48 34 24 34C29.52 34 34 29.52 34 24C34 18.48 29.52 14 24 14ZM24 20C25.1 20 26 20.9 26 22C26 23.1 25.1 24 24 24C22.9 24 22 23.1 22 22C22 20.9 22.9 20 24 20ZM24 30C21.58 30 19.5 28.58 18.5 26.5C18.68 24.83 21.67 24 24 24C26.33 24 29.32 24.83 29.5 26.5C28.5 28.58 26.42 30 24 30Z' fill='white'/%3E%3C/svg%3E",
    agentName: "Autopilot",
    visitor: "Visitor5",
    tags: []
  }
]);

const chatRecordList = ref<ChatRecordItem[]>([
  {
    id: 1,
    name: "这是个超长昵称与李文娟的对话",
    lastMessage: "现在退款政策是什么？",
    avatarType: "duo",
    avatar1: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face",
    avatar2: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop&crop=face",
    tag: "内部"
  },
  {
    id: 2,
    name: "反馈API Key格式错误",
    lastMessage: "聊天最后一天数据",
    avatarType: "group",
    avatars: [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=48&h=48&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=48&h=48&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=48&h=48&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=48&h=48&fit=crop&crop=face"
    ]
  },
  {
    id: 3,
    name: "背景色",
    lastMessage: "#F1F8FD",
    avatarType: "group",
    avatars: [
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=48&h=48&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=48&h=48&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=48&h=48&fit=crop&crop=face"
    ]
  }
]);

function selectSearchField(field: string) {
  currentSearchField.value = field;
  showFieldSheet.value = false;
}

function handleFilterClick(filterName: string) {
  if (activeTab.value === "session") {
    // 会话记录筛选
    if (filterName === "状态") {
      showStatusSheet.value = true;
    } else if (filterName === "标签") {
      showTagSheet.value = true;
    } else if (filterName === "访客评价") {
      showRatingSheet.value = true;
    }
  } else {
    // 聊天记录筛选
    if (filterName === "类型") {
      showStatusSheet.value = true; // 复用状态弹窗，显示类型选项
    } else if (filterName === "分类") {
      showTagSheet.value = true; // 复用标签弹窗，显示分类选项
    } else if (filterName === "消息数量") {
      showMessageCountSheet.value = true;
    }
  }
}

function selectStatus(status: string) {
  console.log("选择状态:", status);
  showStatusSheet.value = false;
}

function toggleTag(tag: string) {
  const tags = new Set(selectedTags.value);
  if (tags.has(tag)) {
    tags.delete(tag);
  } else {
    tags.add(tag);
  }
  selectedTags.value = tags;
}

function resetTags() {
  selectedTags.value = new Set();
}

function confirmTags() {
  console.log("选择标签:", Array.from(selectedTags.value));
  showTagSheet.value = false;
}

function selectRating(rating: string) {
  console.log("选择评价:", rating);
  showRatingSheet.value = false;
}

function selectSort(sort: string) {
  console.log("选择排序:", sort);
  showSortSheet.value = false;
}

function resetMessageCount() {
  messageCountMin.value = null;
  messageCountMax.value = null;
}

function confirmMessageCount() {
  console.log("消息数量范围:", messageCountMin.value, "-", messageCountMax.value);
  showMessageCountSheet.value = false;
}

function goToAllFilters() {
  if (activeTab.value === "session") {
    router.push("/archive/filters");
  } else {
    router.push("/archive/chat-filters");
  }
}

function handleSessionClick(item: SessionItem) {
  router.push({
    path: `/archive/session/${item.id}`,
    query: { status: item.statusType }
  });
}

function handleChatClick(item: ChatRecordItem) {
  router.push(`/archive/chat/${item.id}`);
}
</script>

<style scoped>
.archive-page {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
}

.page-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 240px;
  background: linear-gradient(180deg, rgba(200, 225, 255, 0.5) 0%, rgba(245, 247, 249, 0) 100%);
  pointer-events: none;
  z-index: 0;
}

/* 头部 Tab */
.page-header {
  padding: 0 20px;
  padding-top: calc(env(safe-area-inset-top, 44px) + 16px);
  position: relative;
  z-index: 1;
}

.header-tabs {
  display: flex;
  align-items: baseline;
  gap: 16px;
  min-height: 29px;
}

.header-tab {
  font-size: 18px;
  font-weight: 500;
  color: #222;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  white-space: nowrap;
}

.header-tab--active {
  font-size: 24px;
}

/* 搜索栏 */
.search-bar {
  display: flex;
  align-items: center;
  height: 44px;
  margin: 14px 20px 0;
  background: #fff;
  border-radius: 34px;
  padding: 0 16px;
  position: relative;
  z-index: 1;
}

.search-field-select {
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  flex-shrink: 0;
}

.search-field-label {
  font-size: 14px;
  font-weight: 500;
  color: #222;
  white-space: nowrap;
}

.search-divider {
  width: 0.5px;
  height: 12px;
  background: #c9cdd4;
  margin: 0 12px;
  flex-shrink: 0;
}

.search-icon {
  flex-shrink: 0;
  margin-right: 8px;
}

.search-input {
  flex: 1;
  font-size: 14px;
  color: #222;
  min-width: 0;
}

.search-input::placeholder {
  color: rgba(100, 116, 145, 0.5);
}

/* 筛选行 */
.filter-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px 8px;
  position: relative;
  z-index: 1;
}

.filter-chips {
  display: flex;
  gap: 24px;
}

.filter-chip {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  color: #222;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  white-space: nowrap;
}

.filter-actions {
  display: flex;
  gap: 16px;
}

.filter-action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  cursor: pointer;
}

/* 列表 */
.archive-list {
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  padding: 0 20px 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  position: relative;
  z-index: 1;
}

/* === 会话记录卡片 === */
.session-card {
  background: #fff;
  border-radius: 20px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

.session-top {
  display: flex;
  align-items: center;
  gap: 16px;
}

.session-title {
  flex: 1;
  font-size: 16px;
  font-weight: 500;
  color: #222;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 状态 badge */
.status-badge {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 20px;
  width: 48px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
}

.status-badge--replied {
  color: #07be38;
  border: 0.5px solid rgba(7, 190, 56, 0.5);
}

.status-badge--queuing {
  color: #ff7810;
  border: 0.5px solid rgba(255, 120, 16, 0.5);
}

.status-badge--closed {
  color: rgba(100, 116, 145, 0.8);
  border: 0.5px solid rgba(100, 116, 145, 0.5);
}

.status-badge--pending {
  color: #ff3010;
  border: 0.5px solid rgba(255, 48, 16, 0.5);
}

.status-badge--processing {
  color: #105eff;
  border: 0.5px solid rgba(16, 94, 255, 0.5);
}

.session-people {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #222;
  flex-wrap: wrap;
}

.people-avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}

.people-name {
  white-space: nowrap;
}

.people-visitor {
  white-space: nowrap;
}

.session-tags {
  display: flex;
  gap: 8px;
  flex-wrap: nowrap;
  overflow: hidden;
}

.tag-chip {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 24px;
  padding: 2px 8px;
  background: #f4f5fb;
  border-radius: 8px;
  font-size: 12px;
  color: #222;
  white-space: nowrap;
  flex-shrink: 0;
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* === 聊天记录卡片 === */
.chat-record-card {
  background: #fff;
  border-radius: 20px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

.chat-record-avatar {
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  position: relative;
}

/* 双人头像 */
.duo-avatar {
  border-radius: 50%;
  object-fit: cover;
  position: absolute;
}

.duo-avatar--main {
  width: 40px;
  height: 40px;
  top: 0;
  left: 0;
  z-index: 1;
}

.duo-avatar--sub {
  width: 28px;
  height: 28px;
  bottom: 0;
  right: 0;
  z-index: 2;
  border: 2px solid #fff;
}

/* 群组头像 */
.avatar-group {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  overflow: hidden;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  background: #e0e0e0;
}

.avatar-group-item {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.chat-record-content {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.chat-record-name-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.chat-record-name {
  font-size: 16px;
  font-weight: 500;
  color: #222;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.chat-tag {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  height: 16px;
  padding: 1px 5px;
  border-radius: 6px;
  border: 0.5px solid #8cb2ff;
  font-size: 10px;
  font-weight: 500;
  color: #0367ff;
  white-space: nowrap;
}

.chat-record-msg {
  font-size: 13px;
  color: #647491;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>

<style scoped>
/* 底部弹窗 */
.sheet-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 100;
  display: flex;
  align-items: flex-end;
}

.sheet {
  width: 100%;
  background: #fff;
  border-radius: 20px 20px 0 0;
  padding-bottom: env(safe-area-inset-bottom, 0px);
  display: flex;
  flex-direction: column;
}

.sheet-options {
  display: flex;
  flex-direction: column;
}

.sheet-option {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  height: 56px;
  font-size: 16px;
  color: #222;
  border-bottom: 0.5px solid #f0f2f5;
  -webkit-tap-highlight-color: transparent;
  padding: 0 20px;
}

.sheet-option:first-child {
  border-radius: 20px 20px 0 0;
}

.sheet-option:active {
  background: #f5f7f9;
}

.sheet-cancel {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 56px;
  font-size: 16px;
  color: #222;
  margin-top: 8px;
  background: #f5f7f9;
  -webkit-tap-highlight-color: transparent;
}

.sheet-cancel:active {
  opacity: 0.7;
}

.sheet-cancel:active {
  opacity: 0.7;
}

/* 标签选择特殊样式 */
.sheet-option--selected {
  background: #f5f7f9;
}

.sheet-option-check {
  margin-left: auto;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 底部操作按钮 */
.sheet-actions {
  display: flex;
  gap: 12px;
  padding: 16px;
  background: #fff;
}

.sheet-action-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 48px;
  border-radius: 16px;
  font-size: 16px;
  font-weight: 500;
  -webkit-tap-highlight-color: transparent;
}

.sheet-action-btn--secondary {
  background: #fff;
  color: #222;
}

.sheet-action-btn--secondary:active {
  background: #f5f7f9;
}

.sheet-action-btn--primary {
  background: #105eff;
  color: #fff;
}

.sheet-action-btn--primary:active {
  opacity: 0.85;
}

/* 弹窗过渡 */
.sheet-enter-active,
.sheet-leave-active {
  transition: opacity 0.25s;
}

.sheet-enter-active .sheet,
.sheet-leave-active .sheet {
  transition: transform 0.25s ease-out;
}

.sheet-enter-from,
.sheet-leave-to {
  opacity: 0;
}

.sheet-enter-from .sheet,
.sheet-leave-to .sheet {
  transform: translateY(100%);
}

/* 消息数量弹窗特殊样式 */
.sheet--message-count {
  padding: 0;
}

.message-count-header {
  display: flex;
  align-items: center;
  height: 56px;
  padding: 0 16px;
  border-bottom: 0.5px solid #f0f2f5;
}

.message-count-close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  -webkit-tap-highlight-color: transparent;
}

.message-count-title {
  flex: 1;
  font-size: 16px;
  font-weight: 500;
  color: #222;
  text-align: center;
}

.message-count-placeholder {
  width: 24px;
}

.message-count-content {
  padding: 24px 20px;
}

.message-count-label {
  font-size: 14px;
  color: #75869c;
  margin-bottom: 12px;
}

.message-count-inputs {
  display: flex;
  align-items: center;
  gap: 12px;
}

.message-count-input {
  flex: 1;
  height: 44px;
  background: #f5f7f9;
  border-radius: 8px;
  padding: 0 12px;
  font-size: 14px;
  color: #222;
  text-align: center;
}

.message-count-input::placeholder {
  color: #c0c4cc;
}

.message-count-separator {
  font-size: 16px;
  color: #222;
}

.message-count-actions {
  display: flex;
  gap: 12px;
  padding: 16px 20px;
  padding-bottom: calc(16px + env(safe-area-inset-bottom, 0px));
}

.message-count-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 48px;
  border-radius: 16px;
  font-size: 16px;
  font-weight: 500;
  -webkit-tap-highlight-color: transparent;
}

.message-count-btn--secondary {
  background: #f5f7f9;
  color: #222;
}

.message-count-btn--secondary:active {
  opacity: 0.7;
}

.message-count-btn--primary {
  background: #105eff;
  color: #fff;
}

.message-count-btn--primary:active {
  opacity: 0.85;
}
</style>
