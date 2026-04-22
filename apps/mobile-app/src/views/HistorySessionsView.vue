<template>
  <div class="history-sessions-page">
    <div class="page-bg" />

    <!-- 导航栏 -->
    <div class="nav-bar">
      <button class="nav-back" @click="router.back()">
        <svg width="10" height="18" viewBox="0 0 10 18" fill="none">
          <path d="M9 1L1 9L9 17" stroke="#222" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>
      <span class="nav-title">历史会话</span>
      <RouterLink to="/archive" class="nav-action">进入档案</RouterLink>
    </div>

    <!-- 会话列表 -->
    <div class="session-list">
      <div
        v-for="item in sessionList"
        :key="item.id"
        class="session-card"
        @click="handleSessionClick(item)"
      >
        <div class="session-title">{{ item.title }}</div>
        <div v-if="item.agentName" class="session-agent">
          <span class="agent-avatar" :style="{ background: item.avatarColor || '#2f6bff' }">{{ item.agentName[0] }}</span>
          <span class="agent-name">{{ item.agentName }}</span>
        </div>
        <div v-if="item.tags.length" class="session-tags">
          <span v-for="(tag, i) in item.tags.slice(0, 3)" :key="i" class="tag-chip">{{ tag }}</span>
          <span v-if="item.tags.length > 3" class="tag-chip tag-chip--more">+{{ item.tags.length - 3 }}</span>
        </div>
        <div class="session-footer">
          <span class="status-badge" :class="`status-badge--${item.statusType}`">{{ item.status }}</span>
          <span v-if="item.createdAt" class="session-time">{{ item.createdAt }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

interface SessionItem {
  id: number;
  title: string;
  status: string;
  statusType: "replied" | "queuing" | "closed" | "pending";
  agentName?: string;
  avatarColor?: string;
  createdAt?: string;
  tags: string[];
}

const sessionList = ref<SessionItem[]>([
  {
    id: 1,
    title: "反馈API Key格式错误",
    status: "排队中",
    statusType: "queuing",
    agentName: "张伟",
    createdAt: "2026-02-14 14:52",
    tags: [],
  },
  {
    id: 2,
    title: "这是一个很长的会话标题这是全部显示...",
    status: "已回复",
    statusType: "replied",
    agentName: "李昭宁",
    createdAt: "2025-02-14 14:56",
    tags: ["有购买意向", "价格敏感", "全部显示/折叠"],
  },
  {
    id: 3,
    title: "已回复",
    status: "已回复",
    statusType: "replied",
    agentName: "粒粒",
    createdAt: "2025-01-02 02:48",
    tags: [],
  },
  {
    id: 4,
    title: "新会话",
    status: "已关闭",
    statusType: "closed",
    agentName: "粒粒",
    createdAt: "2025-12-28 19:01",
    tags: [],
  },
]);

function handleSessionClick(item: SessionItem) {
  router.push({
    path: `/archive/session/${item.id}`,
    query: { status: item.statusType },
  });
}
</script>

<style scoped>
.history-sessions-page {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
  background: #f5f7f9;
}

.page-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 200px;
  background: linear-gradient(180deg, rgba(200, 225, 255, 0.5) 0%, rgba(245, 247, 249, 0) 100%);
  pointer-events: none;
  z-index: 0;
}

.nav-bar {
  display: flex;
  align-items: center;
  padding: 0 20px;
  padding-top: calc(env(safe-area-inset-top, 44px) + 12px);
  height: calc(env(safe-area-inset-top, 44px) + 56px);
  position: relative;
  z-index: 1;
}

.nav-back {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  -webkit-tap-highlight-color: transparent;
}

.nav-title {
  flex: 1;
  font-size: 18px;
  font-weight: 600;
  color: #222;
  margin-left: 4px;
}

.nav-action {
  font-size: 14px;
  color: #105eff;
  text-decoration: none;
  white-space: nowrap;
  -webkit-tap-highlight-color: transparent;
}

.session-list {
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  padding: 8px 20px 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  position: relative;
  z-index: 1;
}

.session-card {
  background: #fff;
  border-radius: 16px;
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

.session-title {
  font-size: 15px;
  font-weight: 600;
  color: #222;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.session-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.session-time {
  color: #93a0b2;
  font-size: 12px;
  white-space: nowrap;
}

.status-badge {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 22px;
  padding: 0 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
}

.status-badge--closed {
  background: #f0f2f5;
  color: #7e8999;
}

.status-badge--replied {
  background: #e8f0ff;
  color: #2f6bff;
}

.status-badge--queuing {
  background: #fff3e0;
  color: #e65100;
}

.status-badge--pending {
  background: #ffece8;
  color: #d4380d;
}

.session-agent {
  display: flex;
  align-items: center;
  gap: 8px;
}

.agent-avatar {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 12px;
  font-weight: 600;
  flex-shrink: 0;
}

.agent-name {
  font-size: 13px;
  color: #647491;
}

.session-tags {
  display: flex;
  gap: 6px;
  flex-wrap: nowrap;
  overflow: hidden;
}

.tag-chip {
  display: inline-flex;
  align-items: center;
  height: 24px;
  padding: 0 10px;
  background: #f4f5fb;
  border-radius: 8px;
  font-size: 12px;
  color: #555;
  white-space: nowrap;
  flex-shrink: 0;
}
</style>
