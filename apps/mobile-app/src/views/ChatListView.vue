<template>
  <div class="chat-list-page">
    <!-- 顶部渐变背景 -->
    <div class="page-bg" />

    <!-- 页面头部 -->
    <div class="page-header">
      <h1 class="page-title">聊天</h1>
      <button class="btn-add" @click="handleAdd">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <circle cx="10" cy="10" r="9" stroke="#222" stroke-width="1.5" />
          <path d="M10 6V14M6 10H14" stroke="#222" stroke-width="1.5" stroke-linecap="round" />
        </svg>
      </button>
    </div>

    <!-- 筛选标签 -->
    <div class="filter-tabs">
      <button
        v-for="tab in filterTabs"
        :key="tab.key"
        class="filter-tab"
        :class="{ 'filter-tab--active': activeFilter === tab.key }"
        @click="activeFilter = tab.key"
      >
        {{ tab.label }} ({{ tab.count }})
      </button>
    </div>

    <!-- 聊天列表卡片 -->
    <div class="chat-list-card">
      <div class="chat-list">
        <div
          v-for="item in filteredChats"
          :key="item.id"
          class="chat-item"
          @click="handleChatClick(item)"
        >
        <!-- 头像 -->
        <div class="chat-avatar" v-if="item.type === 'single'">
          <img :src="item.avatar" :alt="item.name" class="avatar-img" />
        </div>
        <div class="chat-avatar" v-else-if="item.type === 'letter'">
          <div class="avatar-letter" :style="{ background: item.avatarColor }">
            {{ item.avatarLetter }}
          </div>
        </div>
        <div class="chat-avatar" v-else-if="item.type === 'group'">
          <div class="avatar-group" :class="{ 'avatar-group--small': item.avatars!.length > 4 }">
            <img
              v-for="(av, idx) in item.avatars!.slice(0, item.avatars!.length > 4 ? 5 : 4)"
              :key="idx"
              :src="av"
              class="avatar-group-item"
            />
          </div>
        </div>

        <!-- 内容 -->
        <div class="chat-content">
          <div class="chat-top-row">
            <div class="chat-name-row">
              <span class="chat-name">{{ item.name }}</span>
              <span v-if="item.tag" class="chat-tag">{{ item.tag }}</span>
            </div>
            <span class="chat-time">{{ item.time }}</span>
          </div>
          <div class="chat-bottom-row">
            <p class="chat-message">
              <span v-if="item.atMe" class="chat-at">[有人@我]</span>
              <span>{{ item.lastMessage }}</span>
            </p>
            <span v-if="item.unread" class="chat-unread" />
          </div>
        </div>
      </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

interface ChatItem {
  id: number;
  name: string;
  lastMessage: string;
  time: string;
  type: "single" | "group" | "letter";
  avatar?: string;
  avatars?: string[];
  avatarLetter?: string;
  avatarColor?: string;
  tag?: string;
  atMe?: boolean;
  unread?: boolean;
  category: "internal" | "external";
}

const activeFilter = ref("all");

const filterTabs = [
  { key: "all", label: "全部", count: 5 },
  { key: "internal", label: "内部", count: 2 },
  { key: "external", label: "外部", count: 3 }
];

const chatList = ref<ChatItem[]>([
  {
    id: 1,
    name: "客服主管-粒粒",
    lastMessage: " Visitor10: @Wang 好的",
    time: "06:56",
    type: "single",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&fit=crop&crop=face",
    tag: "内部",
    atMe: true,
    unread: true,
    category: "internal"
  },
  {
    id: 2,
    name: "Visitor10",
    lastMessage: "Visitor10: 双12大促进行中",
    time: "10/28 06:56",
    type: "letter",
    avatarLetter: "V",
    avatarColor: "#4ecdc4",
    category: "external"
  },
  {
    id: 3,
    name: "Leo，小闪，客服一号…",
    lastMessage: "小闪: 限时8折",
    time: "2024/10/28 06:56",
    type: "group",
    avatars: [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=96&h=96&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=96&h=96&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=96&h=96&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=96&h=96&fit=crop&crop=face"
    ],
    category: "internal"
  },
  {
    id: 4,
    name: "吴妄言，妮妮，客服-李文",
    lastMessage: "吴妄言发起了群聊",
    time: "06:56",
    type: "group",
    avatars: [
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=96&h=96&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=96&h=96&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=96&h=96&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=96&h=96&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=96&h=96&fit=crop&crop=face"
    ],
    category: "external"
  },
  {
    id: 5,
    name: "徐知夏",
    lastMessage: "下午来一下",
    time: "06:56",
    type: "single",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=96&h=96&fit=crop&crop=face",
    unread: true,
    category: "external"
  },
  {
    id: 6,
    name: "Leo，小闪，客服一号…",
    lastMessage: "小闪: 限时8折",
    time: "2024/12/31",
    type: "group",
    avatars: [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=96&h=96&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=96&h=96&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=96&h=96&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=96&h=96&fit=crop&crop=face"
    ],
    category: "external"
  }
]);

const filteredChats = computed(() => {
  if (activeFilter.value === "all") return chatList.value;
  return chatList.value.filter(
    (c) => c.category === (activeFilter.value === "internal" ? "internal" : "external")
  );
});

function handleAdd() {
  // placeholder
}

function handleChatClick(_item: ChatItem) {
  // placeholder
}
</script>

<style scoped>
.chat-list-page {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
}

/* 顶部渐变背景 */
.page-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 240px;
  background: linear-gradient(
    180deg,
    rgba(200, 225, 255, 0.5) 0%,
    rgba(245, 247, 249, 0) 100%
  );
  pointer-events: none;
  z-index: 0;
}

/* ���部 */
.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  padding-top: calc(env(safe-area-inset-top, 44px) + 16px);
  position: relative;
  z-index: 1;
}

.page-title {
  font-size: 24px;
  font-weight: 500;
  color: #222;
  line-height: 1.2;
}

.btn-add {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

/* 筛选标签 */
.filter-tabs {
  display: flex;
  gap: 8px;
  padding: 16px 15px 12px;
  position: relative;
  z-index: 1;
}

.filter-tab {
  height: 30px;
  padding: 5px 12px;
  border-radius: 200px;
  font-size: 14px;
  font-weight: 400;
  color: #222;
  background: #fff;
  white-space: nowrap;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  transition: background var(--agent-motion-fast) ease;
}

.filter-tab--active {
  background: rgba(16, 94, 255, 0.08);
  font-weight: 500;
}

/* 聊天列表卡片容器 */
.chat-list-card {
  flex: 1;
  margin: 0 10px;
  background: rgba(255, 255, 255, 0.85);
  border-radius: 20px 20px 0 0;
  overflow: hidden;
  position: relative;
  z-index: 1;
  box-shadow: 0 -2px 20px rgba(0, 0, 0, 0.03);
}

/* 聊天列表 */
.chat-list {
  height: 100%;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  padding: 4px 16px;
}

.chat-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

/* 头像 */
.chat-avatar {
  flex-shrink: 0;
  width: 48px;
  height: 48px;
}

.avatar-img {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
}

.avatar-letter {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 18px;
  font-weight: 500;
}

/* 群组头像 - 4人 (2x2) */
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

/* 群组头像 - 5人+ 更小的格子 */
.avatar-group--small {
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(2, 1fr);
}

.avatar-group--small .avatar-group-item:nth-child(n + 4) {
  grid-row: 2;
}

/* 内容区 */
.chat-content {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.chat-top-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.chat-name-row {
  display: flex;
  align-items: center;
  gap: 4px;
  min-width: 0;
  flex: 1;
}

.chat-name {
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

.chat-time {
  flex-shrink: 0;
  font-size: 12px;
  color: rgba(100, 116, 145, 0.5);
  white-space: nowrap;
}

.chat-bottom-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.chat-message {
  flex: 1;
  font-size: 13px;
  color: #647491;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.4;
}

.chat-at {
  color: #fd9100;
  font-weight: 600;
}

.chat-unread {
  flex-shrink: 0;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #f53f3f;
}
</style>
