<template>
  <div class="session-info-page">
    <!-- 导航栏 -->
    <div class="nav-bar">
      <button class="nav-back" @click="router.back()">
        <svg width="10" height="18" viewBox="0 0 10 18" fill="none">
          <path d="M9 1L1 9L9 17" stroke="#222" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>
      <span class="nav-title">会话详情</span>
      <span class="nav-placeholder" />
    </div>

    <!-- Segment 切换 -->
    <div class="segment-wrap">
      <div class="segment">
        <button
          class="segment-item"
          :class="{ 'segment-item--active': activeTab === 'visitor' }"
          @click="activeTab = 'visitor'"
        >访客信息</button>
        <button
          class="segment-item"
          :class="{ 'segment-item--active': activeTab === 'session' }"
          @click="activeTab = 'session'"
        >会话信息</button>
      </div>
    </div>

    <!-- 内容区域 -->
    <div class="content-area">
      <!-- 访客信息 -->
      <div v-if="activeTab === 'visitor'" class="tab-content">
        <p class="section-label">基础信息</p>
        <div class="card">
          <div class="card-row">
            <span class="card-label">姓名</span>
            <span class="card-value">Visitor13</span>
            <svg class="card-arrow" width="7" height="10" viewBox="0 0 7 10" fill="none"><path d="M1 1L5 5L1 9" stroke="#C0C4CC" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" /></svg>
          </div>
          <div class="card-divider" />
          <div class="card-row">
            <span class="card-label">访客ID</span>
            <span class="card-value">14</span>
          </div>
          <div class="card-divider" />
          <div class="card-row">
            <span class="card-label">电话</span>
            <span class="card-value">-</span>
            <svg class="card-arrow" width="7" height="10" viewBox="0 0 7 10" fill="none"><path d="M1 1L5 5L1 9" stroke="#C0C4CC" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" /></svg>
          </div>
          <div class="card-divider" />
          <div class="card-row">
            <span class="card-label">邮箱</span>
            <span class="card-value">-</span>
            <svg class="card-arrow" width="7" height="10" viewBox="0 0 7 10" fill="none"><path d="M1 1L5 5L1 9" stroke="#C0C4CC" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" /></svg>
          </div>
        </div>

        <p class="section-label">附加信息</p>
        <div class="card">
          <div class="card-row">
            <span class="card-label">起点页面</span>
            <span class="card-value card-value--link">www.example.com/pricing</span>
            <svg class="card-arrow" width="7" height="10" viewBox="0 0 7 10" fill="none"><path d="M1 1L5 5L1 9" stroke="#C0C4CC" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" /></svg>
          </div>
          <div class="card-divider" />
          <div class="card-row">
            <span class="card-label">会话总数</span>
            <span class="card-value">3 会话</span>
          </div>
        </div>

        <div class="section-label-row">
          <p class="section-label">访问轨迹</p>
          <span class="section-more">查看更多 ›</span>
        </div>
        <div class="card">
          <div class="timeline-item">
            <div class="timeline-dot timeline-dot--active" />
            <div class="timeline-body">
              <p class="timeline-title">TWT Chat | AI Customer Service | 2...</p>
              <p class="timeline-url">https://www.twt.com/chat</p>
              <p class="timeline-meta">2025-10-10 12:12 &nbsp; 6m 29s</p>
            </div>
          </div>
          <div class="timeline-item">
            <div class="timeline-dot" />
            <div class="timeline-body">
              <p class="timeline-title">Features & Capabilities | TWT Chat |...</p>
              <p class="timeline-url">https://www.twt.com/chat/features</p>
              <p class="timeline-meta">2025-10-10 10:23 &nbsp; 6m 29s</p>
            </div>
          </div>
        </div>

        <p class="section-label">设备信息</p>
        <div class="card">
          <div class="card-row">
            <span class="card-label">IP地址</span>
            <span class="card-value">23.123.13.234</span>
          </div>
          <div class="card-divider" />
          <div class="card-row">
            <span class="card-label">操作系统</span>
            <span class="card-value">15.5 (24F74)</span>
          </div>
          <div class="card-divider" />
          <div class="card-row">
            <span class="card-label">浏览器</span>
            <span class="card-value">Chrome 130.0.0.0</span>
          </div>
        </div>
      </div>

      <!-- 会话信息 -->
      <div v-if="activeTab === 'session'" class="tab-content">
        <p class="section-label">基础信息</p>
        <div class="card">
          <div class="card-row">
            <span class="card-label">会话ID</span>
            <span class="card-value">34</span>
          </div>
          <div class="card-divider" />
          <div class="card-row">
            <span class="card-label">会话标题</span>
            <span class="card-value card-value--ellipsis">这是个很长很长的标题显示…</span>
            <svg class="card-arrow" width="7" height="10" viewBox="0 0 7 10" fill="none"><path d="M1 1L5 5L1 9" stroke="#C0C4CC" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" /></svg>
          </div>
          <div class="card-divider" />
          <div class="card-row">
            <span class="card-label">访客ID</span>
            <span class="card-value">13</span>
          </div>
          <div class="card-divider" />
          <div class="card-row">
            <span class="card-label">发起时间</span>
            <span class="card-value">2025-07-24 12:12:12</span>
          </div>
          <div class="card-divider" />
          <div class="card-row">
            <span class="card-label">接待时间</span>
            <span class="card-value">2025-07-24 12:12:12</span>
          </div>
        </div>

        <div class="section-label-row">
          <p class="section-label">服务客服</p>
          <button class="section-action" @click="handleAddAgent">+ 添加</button>
        </div>
        <div class="card">
          <template v-for="(agent, idx) in serviceAgents" :key="agent.name">
            <div class="card-divider" v-if="idx > 0" />
            <div class="agent-row">
              <img v-if="agent.avatar" :src="agent.avatar" class="agent-avatar" />
              <div v-else class="agent-avatar-color" :style="{ background: agent.color }">
                <span class="agent-avatar-char">{{ agent.initial }}</span>
              </div>
              <div class="agent-info">
                <span class="agent-name">{{ agent.name }}</span>
                <span v-if="agent.badge" class="agent-badge">{{ agent.badge }}</span>
              </div>
            </div>
          </template>
          <div class="card-divider" />
          <button class="transfer-btn" @click="handleTransfer">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 2L10 6L6 10" stroke="#105eff" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M10 6H2" stroke="#105eff" stroke-width="1.4" stroke-linecap="round" />
              <path d="M14 2V14" stroke="#105eff" stroke-width="1.4" stroke-linecap="round" />
            </svg>
            <span>转移会话</span>
          </button>
        </div>
      </div>
    </div>
    <!-- Toast -->
    <Transition name="toast">
      <div v-if="toastText" class="toast">{{ toastText }}</div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();
const activeTab = ref<"visitor" | "session">((route.query.tab as string) === "session" ? "session" : "visitor");

interface ServiceAgent {
  name: string;
  initial: string;
  color: string;
  avatar?: string;
  badge?: string;
}

const serviceAgents = ref<ServiceAgent[]>([
  { name: "李维利", initial: "李", color: "#f5a623", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face", badge: "会话负责人" },
  { name: "马未果", initial: "马", color: "#f5a623", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face" },
]);

onMounted(() => {
  const raw = sessionStorage.getItem("addedAgents");
  if (raw) {
    sessionStorage.removeItem("addedAgents");
    const added: ServiceAgent[] = JSON.parse(raw);
    const existNames = new Set(serviceAgents.value.map(a => a.name));
    for (const a of added) {
      if (!existNames.has(a.name)) {
        serviceAgents.value.push(a);
      }
    }
  }
});

const toastText = ref("");
let toastTimer: ReturnType<typeof setTimeout> | null = null;

function showToast(text: string) {
  if (toastTimer) clearTimeout(toastTimer);
  toastText.value = text;
  toastTimer = setTimeout(() => { toastText.value = ""; }, 2000);
}

function handleAddAgent() {
  const id = route.params.id || '1';
  router.push(`/session/${id}/add-agent`);
}

function handleTransfer() {
  const id = route.params.id || '1';
  router.push(`/session/${id}/transfer`);
}
</script>

<style scoped>
.session-info-page {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #f5f7f9;
}

/* 导航栏 */
.nav-bar {
  display: flex;
  align-items: center;
  height: 44px;
  padding: 0 16px;
  margin-top: env(safe-area-inset-top, 44px);
  background: #fff;
  flex-shrink: 0;
}

.nav-back {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  -webkit-tap-highlight-color: transparent;
}

.nav-title {
  flex: 1;
  font-size: 17px;
  font-weight: 500;
  color: #000;
  text-align: center;
}

.nav-placeholder {
  width: 24px;
  flex-shrink: 0;
}

/* Segment */
.segment-wrap {
  padding: 16px 16px 0;
  background: #f5f7f9;
  flex-shrink: 0;
}

.segment {
  display: flex;
  height: 44px;
  padding: 4px;
  background: rgba(160, 169, 182, 0.11);
  border: 0.5px solid rgba(226, 232, 239, 0.45);
  border-radius: 60px;
}

.segment-item {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: #222;
  border-radius: 50px;
  -webkit-tap-highlight-color: transparent;
}

.segment-item--active {
  background: #fff;
  font-weight: 500;
}

/* 内容区域 */
.content-area {
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  padding-bottom: calc(16px + env(safe-area-inset-bottom, 0px));
}

.tab-content {
  padding: 0 16px;
}

/* 区块标签 */
.section-label {
  font-size: 12px;
  color: #75869c;
  margin: 16px 0 8px;
  padding-left: 4px;
}

.section-label-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-right: 4px;
}

.section-label-row .section-label {
  margin-bottom: 8px;
}

.section-more {
  font-size: 12px;
  color: #75869c;
}

.section-action {
  font-size: 12px;
  color: #105eff;
  -webkit-tap-highlight-color: transparent;
}

/* 卡片 */
.card {
  background: #fff;
  border-radius: 20px;
  overflow: hidden;
}

.card-row {
  display: flex;
  align-items: center;
  min-height: 46px;
  padding: 0 20px;
}

.card-label {
  font-size: 16px;
  color: #222;
  flex-shrink: 0;
}

.card-value {
  flex: 1;
  font-size: 14px;
  color: #647491;
  text-align: right;
  margin-left: 16px;
  min-width: 0;
}

.card-value--link {
  color: #1155cc;
}

.card-value--ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.card-arrow {
  flex-shrink: 0;
  margin-left: 6px;
}

.card-divider {
  height: 1px;
  background: #f0f2f5;
  margin: 0 20px;
}

/* 时间轴 */
.timeline-item {
  display: flex;
  gap: 12px;
  padding: 14px 20px;
}

.timeline-item + .timeline-item {
  border-top: 1px solid #f0f2f5;
}

.timeline-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #c0c4cc;
  flex-shrink: 0;
  margin-top: 6px;
}

.timeline-dot--active {
  background: #34c759;
}

.timeline-body {
  flex: 1;
  min-width: 0;
}

.timeline-title {
  font-size: 16px;
  color: #222;
  line-height: 22px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.timeline-url {
  font-size: 14px;
  color: #1155cc;
  line-height: 20px;
  margin-top: 2px;
}

.timeline-meta {
  font-size: 12px;
  color: #647491;
  line-height: 18px;
  margin-top: 2px;
}

/* 客服行 */
.agent-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 20px;
}

.agent-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}

.agent-avatar-color {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.agent-avatar-char {
  font-size: 14px;
  font-weight: 500;
  color: #fff;
}

.agent-info {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
}

.agent-name {
  font-size: 16px;
  color: #222;
}

.agent-badge {
  display: inline-flex;
  align-items: center;
  height: 16px;
  padding: 0 4px;
  background: rgba(16, 94, 255, 0.15);
  border-radius: 4px;
  font-size: 10px;
  font-weight: 500;
  color: #105eff;
  white-space: nowrap;
}

.agent-id {
  font-size: 14px;
  color: #647491;
  flex-shrink: 0;
}

/* 转移会话按钮 */
.transfer-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  width: 100%;
  height: 46px;
  font-size: 14px;
  color: #105eff;
  -webkit-tap-highlight-color: transparent;
}

.transfer-btn:active {
  background: #f5f7f9;
}

/* Toast */
.toast {
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.75);
  color: #fff;
  font-size: 14px;
  padding: 10px 24px;
  border-radius: 8px;
  z-index: 200;
  pointer-events: none;
}

.toast-enter-active,
.toast-leave-active {
  transition: opacity 0.2s;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
}
</style>
