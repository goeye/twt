<template>
  <div class="session-page">
    <div class="page-bg" />

    <!-- 页面头部 -->
    <div class="page-header">
      <h1 class="page-title">会话</h1>
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
        {{ tab.label }}
        <span v-if="tab.badge" class="filter-badge">{{ tab.badge }}</span>
      </button>
    </div>

    <!-- 会话列表 -->
    <div class="session-list-card">
      <div class="session-list">
        <div
          v-for="item in filteredSessions"
          :key="item.id"
          class="session-item"
          @click="handleSessionClick(item)"
        >
          <!-- 头像 -->
          <div class="session-avatar-wrap">
            <div class="session-avatar" :style="{ background: item.avatarBg }">
              <span class="avatar-char">{{ item.avatarChar }}</span>
            </div>
            <span
              class="status-dot"
              :class="{ 'status-dot--online': item.online, 'status-dot--offline': !item.online }"
            />
          </div>

          <!-- 内容 -->
          <div class="session-content">
            <div class="session-top-row">
              <span class="session-title">{{ item.title }}</span>
              <span class="session-time">{{ item.time }}</span>
            </div>
            <div class="session-bottom-row">
              <div class="session-msg-wrap">
                <svg v-if="item.sendFailed" class="send-failed-icon" width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <circle cx="7" cy="7" r="6" fill="#F53F3F" />
                  <path d="M7 4V8" stroke="white" stroke-width="1.5" stroke-linecap="round" />
                  <circle cx="7" cy="10" r="0.75" fill="white" />
                </svg>
                <span class="session-msg">{{ item.lastMessage }}</span>
              </div>
              <span v-if="item.unread" class="unread-dot" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

interface SessionItem {
  id: number;
  title: string;
  lastMessage: string;
  time: string;
  avatarChar: string;
  avatarBg: string;
  online: boolean;
  unread?: boolean;
  sendFailed?: boolean;
  status: "pending" | "queuing" | "processing" | "replied";
}

const activeFilter = ref("pending");

const filterTabs = [
  { key: "pending", label: "待回复", badge: 1 },
  { key: "queuing", label: "排队中", badge: 0 },
  { key: "processing", label: "待处理", badge: 0 },
  { key: "replied", label: "已回复", badge: 0 }
];

const sessionList = ref<SessionItem[]>([
  {
    id: 1,
    title: "未知问题",
    lastMessage: "你好？",
    time: "06:56",
    avatarChar: "?",
    avatarBg: "#36c6d9",
    online: true,
    unread: true,
    status: "pending"
  },
  {
    id: 2,
    title: "了解域名金牌会员业务…",
    lastMessage: "已记录，专人跟进。",
    time: "06:56",
    avatarChar: "了",
    avatarBg: "#5b8ff9",
    online: true,
    status: "pending"
  },
  {
    id: 3,
    title: "未知问题",
    lastMessage: "快点接入客服",
    time: "06:56",
    avatarChar: "?",
    avatarBg: "#36c6d9",
    online: true,
    status: "queuing"
  },
  {
    id: 4,
    title: "未知问题",
    lastMessage: "[图片] [语音] [视频] [文件：文件名称.pdf]",
    time: "06:56",
    avatarChar: "?",
    avatarBg: "#36c6d9",
    online: true,
    status: "processing"
  },
  {
    id: 5,
    title: "了解��名金牌会员业务…",
    lastMessage: "已记录，专人跟进。",
    time: "06:56",
    avatarChar: "了",
    avatarBg: "#5b8ff9",
    online: true,
    status: "replied"
  },
  {
    id: 6,
    title: "未知问题",
    lastMessage: "快点接入客服",
    time: "06:56",
    avatarChar: "?",
    avatarBg: "#36c6d9",
    online: false,
    sendFailed: true,
    status: "pending"
  }
]);

const filteredSessions = computed(() => {
  if (activeFilter.value === "pending") return sessionList.value;
  return sessionList.value.filter((s) => s.status === activeFilter.value);
});

function handleSessionClick(item: SessionItem) {
  router.push(`/session/${item.id}`);
}
</script>

<style scoped>
.session-page {
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

.page-header {
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

/* 筛选标签 */
.filter-tabs {
  display: flex;
  gap: 8px;
  padding: 16px 15px 12px;
  position: relative;
  z-index: 1;
}

.filter-tab {
  position: relative;
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
  transition: background 0.12s ease;
}

.filter-tab--active {
  background: rgba(16, 94, 255, 0.08);
  font-weight: 500;
}

.filter-badge {
  position: absolute;
  top: -6px;
  right: -6px;
  min-width: 16px;
  height: 16px;
  border-radius: 8px;
  background: #f53f3f;
  color: #fff;
  font-size: 10px;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
  line-height: 1;
}

/* 列表卡片容器 */
.session-list-card {
  flex: 1;
  margin: 0 10px;
  background: rgba(255, 255, 255, 0.85);
  border-radius: 20px 20px 0 0;
  overflow: hidden;
  position: relative;
  z-index: 1;
  box-shadow: 0 -2px 20px rgba(0, 0, 0, 0.03);
}

.session-list {
  height: 100%;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  padding: 4px 16px;
}

.session-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

/* 头像 */
.session-avatar-wrap {
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  position: relative;
}

.session-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-char {
  font-size: 18px;
  font-weight: 500;
  color: #fff;
  text-align: center;
}

.status-dot {
  position: absolute;
  bottom: 2px;
  left: 2px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 2px solid #fff;
}

.status-dot--online {
  background: #00b578;
}

.status-dot--offline {
  background: #c9cdd4;
}

/* 内容 */
.session-content {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.session-top-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.session-title {
  flex: 1;
  font-size: 16px;
  color: #000;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.session-time {
  flex-shrink: 0;
  font-size: 12px;
  color: #647491;
  white-space: nowrap;
}

.session-bottom-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.session-msg-wrap {
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 4px;
}

.send-failed-icon {
  flex-shrink: 0;
}

.session-msg {
  font-size: 13px;
  color: #647491;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.unread-dot {
  flex-shrink: 0;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #f53f3f;
}
</style>
