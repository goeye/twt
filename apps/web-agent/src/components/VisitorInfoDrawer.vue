<template>
  <Teleport to="body">
    <transition name="visitor-drawer">
      <div v-if="open && visitor" class="visitor-drawer-layer">
        <div class="visitor-drawer-layer__mask" @click="$emit('close')" />

        <aside class="visitor-drawer" @click.stop>
          <header class="visitor-drawer__header">
            <div class="visitor-drawer__header-left">
              <button v-if="view !== 'main'" type="button" class="visitor-drawer__back" aria-label="返回" @click="goBack">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
              </button>
              <template v-if="view === 'detail' && isEditingDetailTitle">
                <input
                  ref="detailTitleInputRef"
                  v-model="draftDetailTitle"
                  class="vd-detail-title-input"
                  @blur="saveDetailTitle"
                  @keydown.enter.prevent="saveDetailTitle"
                  @keydown.esc.prevent="cancelEditDetailTitle"
                />
              </template>
              <template v-else>
                <h2 class="visitor-drawer__title">{{ viewTitle }}</h2>
                <button
                  v-if="view === 'detail'"
                  type="button"
                  class="vd-detail-edit-btn"
                  aria-label="编辑会话标题"
                  @click="startEditDetailTitle"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                </button>
              </template>
            </div>
            <div class="visitor-drawer__header-right">
              <template v-if="view === 'detail'">
                <button
                  type="button"
                  class="vd-nav-btn"
                  :class="{ 'vd-nav-btn--disabled': !hasPrevSession }"
                  :disabled="!hasPrevSession"
                  aria-label="上一个会话"
                  @click="goToPrevSession"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"/></svg>
                </button>
                <button
                  type="button"
                  class="vd-nav-btn"
                  :class="{ 'vd-nav-btn--disabled': !hasNextSession }"
                  :disabled="!hasNextSession"
                  aria-label="下一个会话"
                  @click="goToNextSession"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                </button>
              </template>              <RouterLink
                v-if="view === 'sessions'"
                :to="{ path: '/files', query: { tab: 'all-conversations' } }"
                class="visitor-drawer__archive-link"
                @click="$emit('close')"
              >
                进入档案
              </RouterLink>
              <div v-if="view === 'main'" class="vd-more-wrap">
                <button type="button" class="vd-more-btn" aria-label="更多操作">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/></svg>
                </button>
                <div class="vd-more-dropdown">
                  <button type="button" class="vd-more-dropdown__item">发起聊天</button>
                  <button type="button" class="vd-more-dropdown__item">创建会话</button>
                </div>
              </div>
              <button type="button" class="visitor-drawer__close" aria-label="关闭" @click="$emit('close')">
                <span>&times;</span>
              </button>
            </div>
          </header>

          <!-- 主视图 -->
          <template v-if="view === 'main'">
            <div class="visitor-drawer__content agent-scroll">
            <!-- 基础信息 -->
            <section class="vd-section">
              <button type="button" class="vd-section__header" @click="toggleSection('basic')">
                <span class="vd-section__title">基础信息</span>
                <svg :class="['vd-section__arrow', { 'vd-section__arrow--collapsed': isSectionCollapsed('basic') }]" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
              </button>
              <div v-show="!isSectionCollapsed('basic')" class="vd-section__body">
                <dl class="vd-fields">
                  <div class="vd-field">
                    <dt>备注名</dt>
                    <dd>{{ visitor.remark || '–' }}</dd>
                  </div>
                  <div class="vd-field">
                    <dt>姓名</dt>
                    <dd>{{ visitor.name }}</dd>
                  </div>
                  <div class="vd-field">
                    <dt>电话</dt>
                    <dd>{{ visitor.phone || '–' }}</dd>
                  </div>
                  <div class="vd-field">
                    <dt>邮箱</dt>
                    <dd>{{ visitor.email || '–' }}</dd>
                  </div>
                </dl>
              </div>
            </section>

            <!-- 访客标签 -->
            <section class="vd-section">
              <button type="button" class="vd-section__header" @click="toggleSection('tags')">
                <span class="vd-section__title">访客标签</span>
                <svg :class="['vd-section__arrow', { 'vd-section__arrow--collapsed': isSectionCollapsed('tags') }]" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
              </button>
              <div v-show="!isSectionCollapsed('tags')" class="vd-section__body">
                <div class="vd-tags">
                  <span v-for="tag in visitor.tags" :key="tag" class="vd-tag">{{ tag }}</span>
                  <button type="button" class="vd-add-tag">+</button>
                </div>
              </div>
            </section>

            <!-- 客户信息（仅客户列表来源时显示） -->
            <section v-if="visitor.customerId" class="vd-section">
              <button type="button" class="vd-section__header" @click="toggleSection('customer')">
                <span class="vd-section__title">客户信息</span>
                <svg :class="['vd-section__arrow', { 'vd-section__arrow--collapsed': isSectionCollapsed('customer') }]" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
              </button>
              <div v-show="!isSectionCollapsed('customer')" class="vd-section__body">
                <dl class="vd-fields">
                  <div class="vd-field">
                    <dt>关联客户</dt>
                    <dd>{{ visitor.customerId }}</dd>
                  </div>
                </dl>
              </div>
            </section>

            <!-- 附加信息 -->
            <section class="vd-section">
              <button type="button" class="vd-section__header" @click="toggleSection('extra')">
                <span class="vd-section__title">附加信息</span>
                <svg :class="['vd-section__arrow', { 'vd-section__arrow--collapsed': isSectionCollapsed('extra') }]" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
              </button>
              <div v-show="!isSectionCollapsed('extra')" class="vd-section__body">
                <dl class="vd-fields">
                  <div class="vd-field">
                    <dt>起始页面</dt>
                    <dd class="vd-field__link">{{ visitor.entryPage || '–' }}</dd>
                  </div>
                  <div class="vd-field">
                    <dt>来源渠道</dt>
                    <dd>{{ channelLabel[visitor.channelType] || 'Web' }}</dd>
                  </div>
                  <div class="vd-field">
                    <dt>会话总数</dt>
                    <dd><button type="button" class="vd-session-count-link" @click="view = 'sessions'">{{ visitor.sessionCount.split(' ')[0] }}</button> 个会话</dd>
                  </div>
                </dl>
              </div>
            </section>

            <!-- 访问轨迹 -->
            <section class="vd-section">
              <button type="button" class="vd-section__header" @click="toggleSection('trace')">
                <span class="vd-section__title">访问轨迹</span>
                <svg :class="['vd-section__arrow', { 'vd-section__arrow--collapsed': isSectionCollapsed('trace') }]" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
              </button>
              <div v-show="!isSectionCollapsed('trace')" class="vd-section__body">
                <ul v-if="visitor.channelType !== 'email'" class="vd-timeline">
                  <li class="vd-timeline-item">
                    <span class="vd-timeline-item__dot vd-timeline-item__dot--active" />
                    <div class="vd-timeline-item__main">
                      <p class="vd-timeline-item__title">
                        <span>Chat with us</span>
                        <a href="#" @click.prevent>https://visitorchat.twt.com/...</a>
                      </p>
                      <p class="vd-timeline-item__meta">2026-03-17 16:09&nbsp;&nbsp;1天 2小时 30分</p>
                    </div>
                  </li>
                  <li class="vd-timeline-item">
                    <span class="vd-timeline-item__dot" />
                    <div class="vd-timeline-item__main">
                      <p class="vd-timeline-item__title">
                        <span>Chat with us</span>
                        <a href="#" @click.prevent>https://visitorchat.twt.com/...</a>
                      </p>
                      <p class="vd-timeline-item__meta">2026-03-15 19:34&nbsp;&nbsp;1分 14秒</p>
                    </div>
                  </li>
                  <li class="vd-timeline-item">
                    <span class="vd-timeline-item__dot" />
                    <div class="vd-timeline-item__main">
                      <p class="vd-timeline-item__title">
                        <span>Chat with us</span>
                        <a href="#" @click.prevent>https://visitorchat.twt.com/...</a>
                      </p>
                      <p class="vd-timeline-item__meta">2026-03-15 19:34&nbsp;&nbsp;3秒</p>
                    </div>
                  </li>
                  <li class="vd-timeline-item vd-timeline-item--more">查看更多</li>
                </ul>
                <p v-else class="vd-empty-hint">暂无访问轨迹</p>
              </div>
            </section>

            <!-- 设备信息 -->
            <section class="vd-section">
              <button type="button" class="vd-section__header" @click="toggleSection('device')">
                <span class="vd-section__title">设备信息</span>
                <svg :class="['vd-section__arrow', { 'vd-section__arrow--collapsed': isSectionCollapsed('device') }]" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
              </button>
              <div v-show="!isSectionCollapsed('device')" class="vd-section__body">
                <dl class="vd-fields">
                  <div class="vd-field">
                    <dt>IP 地址</dt>
                    <dd>{{ visitor.ip || '–' }}</dd>
                  </div>
                  <div class="vd-field">
                    <dt>操作系统</dt>
                    <dd>{{ visitor.os || '–' }}</dd>
                  </div>
                  <div class="vd-field">
                    <dt>浏览器</dt>
                    <dd>{{ visitor.browser || '–' }}</dd>
                  </div>
                </dl>
              </div>
            </section>
          </div>
          </template>

          <!-- 会话列表视图 -->
          <div v-else-if="view === 'sessions'" class="visitor-drawer__content agent-scroll">
            <div
              v-for="item in mockSessions"
              :key="item.id"
              class="vd-session-card"
              @click="openSessionDetail(item)"
            >
              <div class="vd-session-card__title">{{ item.title }}</div>
              <div class="vd-session-card__meta">
                <template v-if="item.agentName">
                  <span class="vd-session-card__agent-avatar">{{ item.agentName[0] }}</span>
                  <span class="vd-session-card__agent">{{ item.agentName }}</span>
                </template>
              </div>
              <div v-if="item.tags.length" class="vd-session-card__tags">
                <span v-for="(tag, i) in item.tags.slice(0, 3)" :key="i" class="vd-session-card__tag">{{ tag }}</span>
              </div>
              <div class="vd-session-card__footer">
                <span class="vd-session-card__badge" :class="`vd-session-card__badge--${item.statusType}`">{{ item.status }}</span>
                <span v-if="item.createdAt" class="vd-session-card__time">{{ item.createdAt }}</span>
              </div>
            </div>
          </div>

          <!-- 会话详情视图 -->
          <template v-else-if="view === 'detail' && activeSession">
            <div class="visitor-drawer__content agent-scroll vd-detail-messages">
              <div
                v-for="msg in activeSession.messages"
                :key="msg.id"
                class="vd-msg"
                :class="`vd-msg--${msg.role}`"
              >
                <template v-if="msg.role === 'system'">
                  <div class="vd-msg__system">{{ msg.content }}</div>
                </template>
                <template v-else>
                  <span class="vd-msg__avatar" :style="{ background: msg.avatarColor }">{{ msg.avatarText }}</span>
                  <div class="vd-msg__body">
                    <div class="vd-msg__meta"><span>{{ msg.sender }}</span><span>{{ msg.time }}</span></div>
                    <div class="vd-msg__bubble">{{ msg.content }}</div>
                  </div>
                </template>
              </div>
            </div>
            <footer class="vd-detail-footer">
              <template v-if="activeSession.statusType === 'queueing'">
                <div class="vd-detail-footer__dual">
                  <button type="button" class="vd-detail-footer__btn vd-detail-footer__btn--assign">分配会话</button>
                  <button type="button" class="vd-detail-footer__btn vd-detail-footer__btn--primary">领取会话</button>
                </div>
              </template>
              <template v-else-if="activeSession.statusType === 'pending'">
                <div class="vd-detail-footer__dual">
                  <button type="button" class="vd-detail-footer__btn vd-detail-footer__btn--assign">分配会话</button>
                  <button type="button" class="vd-detail-footer__btn vd-detail-footer__btn--primary">进入会话</button>
                </div>
              </template>
              <template v-else>
                <button type="button" class="vd-detail-footer__btn vd-detail-footer__btn--full">进入会话</button>
              </template>
            </footer>
          </template>
        </aside>
      </div>
    </transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, watch } from "vue";

export interface VisitorDrawerData {
  name: string;
  remark: string;
  email: string;
  phone: string;
  tags: string[];
  channelType: "web" | "widget" | "email";
  entryPage?: string;
  sessionCount: string;
  ip: string;
  os: string;
  browser: string;
  customerId?: string;
}

interface SessionItem {
  id: number;
  title: string;
  status: string;
  statusType: string;
  agentName?: string;
  createdAt?: string;
  tags: string[];
  messages: { id: string; role: "agent" | "customer" | "system"; sender: string; content: string; time: string; avatarText?: string; avatarColor?: string }[];
}

const props = defineProps<{
  open: boolean;
  visitor: VisitorDrawerData | null;
}>();

defineEmits<{
  (e: "close"): void;
}>();

const channelLabel: Record<string, string> = { web: "Web", widget: "网页插件", email: "Email" };
const collapsedSections = ref<string[]>([]);
const view = ref<"main" | "sessions" | "detail">("main");
const activeSession = ref<SessionItem | null>(null);

const viewTitle = computed(() => {
  if (view.value === "sessions") return "历史会话";
  if (view.value === "detail") return activeSession.value?.title ?? "会话详情";
  return "访客详情";
});

const goBack = () => {
  if (view.value === "detail") { isEditingDetailTitle.value = false; view.value = "sessions"; return; }
  view.value = "main";
};

const openSessionDetail = (item: SessionItem) => {
  activeSession.value = item;
  view.value = "detail";
};

const activeSessionIndex = computed(() => {
  if (!activeSession.value) return -1;
  return mockSessions.findIndex((s) => s.id === activeSession.value!.id);
});
const hasPrevSession = computed(() => activeSessionIndex.value > 0);
const hasNextSession = computed(() => activeSessionIndex.value >= 0 && activeSessionIndex.value < mockSessions.length - 1);

const goToPrevSession = () => {
  const idx = activeSessionIndex.value;
  if (idx > 0) activeSession.value = mockSessions[idx - 1];
};

const goToNextSession = () => {
  const idx = activeSessionIndex.value;
  if (idx >= 0 && idx < mockSessions.length - 1) activeSession.value = mockSessions[idx + 1];
};

const isEditingDetailTitle = ref(false);
const draftDetailTitle = ref("");
const detailTitleInputRef = ref<HTMLInputElement | null>(null);

const startEditDetailTitle = () => {
  if (!activeSession.value) return;
  draftDetailTitle.value = activeSession.value.title;
  isEditingDetailTitle.value = true;
  nextTick(() => detailTitleInputRef.value?.focus());
};

const saveDetailTitle = () => {
  const next = draftDetailTitle.value.trim();
  if (next && activeSession.value && next !== activeSession.value.title) {
    activeSession.value.title = next;
  }
  isEditingDetailTitle.value = false;
};

const cancelEditDetailTitle = () => {
  isEditingDetailTitle.value = false;
};

watch(() => props.open, (v) => { if (!v) { view.value = "main"; activeSession.value = null; isEditingDetailTitle.value = false; } });

const isSectionCollapsed = (key: string) => collapsedSections.value.includes(key);
const toggleSection = (key: string) => {
  if (isSectionCollapsed(key)) { collapsedSections.value = collapsedSections.value.filter((i) => i !== key); return; }
  collapsedSections.value = [...collapsedSections.value, key];
};

const mockSessions: SessionItem[] = [
  {
    id: 1, title: "反馈API Key格式错误", status: "排队中", statusType: "queueing", agentName: "张伟", createdAt: "2026-02-14 14:52", tags: [],
    messages: [
      { id: "s1m1", role: "system", sender: "", content: "", time: "" },
      { id: "s1m2", role: "customer", sender: "访客", content: "你好，API Key 格式不对", time: "14:52", avatarText: "访", avatarColor: "#8d98a9" },
    ]
  },
  {
    id: 2, title: "这是一个很长的会话标题这是全部显示...", status: "已回复", statusType: "replied", agentName: "李昭宁", createdAt: "2025-02-14 14:56", tags: ["有购买意向", "价格敏感", "全部显示/折叠"],
    messages: [
      { id: "s2m1", role: "system", sender: "", content: "会话开始", time: "" },
      { id: "s2m2", role: "customer", sender: "访客", content: "请问你们有哪些套餐？", time: "10:15", avatarText: "访", avatarColor: "#8d98a9" },
      { id: "s2m3", role: "agent", sender: "李昭宁", content: "我们有免费版、专业版和企业版三种套餐", time: "10:16", avatarText: "李", avatarColor: "#2f6bff" },
    ]
  },
  {
    id: 3, title: "已回复", status: "已回复", statusType: "replied", agentName: "粒粒", createdAt: "2025-01-02 02:48", tags: [],
    messages: [
      { id: "s3m1", role: "system", sender: "", content: "会话开始", time: "" },
      { id: "s3m2", role: "customer", sender: "访客", content: "你好", time: "02:48", avatarText: "访", avatarColor: "#8d98a9" },
    ]
  },
  {
    id: 4, title: "新会话", status: "已关闭", statusType: "closed", agentName: "粒粒", createdAt: "2025-12-28 19:01", tags: [],
    messages: [
      { id: "s4m1", role: "system", sender: "", content: "会话开始", time: "" },
      { id: "s4m2", role: "customer", sender: "访客", content: "你好", time: "19:01", avatarText: "访", avatarColor: "#8d98a9" },
      { id: "s4m3", role: "system", sender: "", content: "会话已关闭", time: "" },
    ]
  },
];
</script>

<style scoped>
.visitor-drawer-layer {
  inset: 0;
  pointer-events: auto;
  position: fixed;
  z-index: 90;
}

.visitor-drawer-layer__mask {
  background: rgba(15, 23, 42, 0.08);
  inset: 0;
  position: absolute;
}

.visitor-drawer {
  background: #f5f6f8;
  border: 1px solid #cdd9f1;
  border-radius: 16px 0 0 16px;
  box-shadow: -8px 0 24px rgba(15, 23, 42, 0.10);
  display: flex;
  flex-direction: column;
  height: 100%;
  max-width: min(400px, 100vw);
  padding: 18px 20px 20px;
  position: absolute;
  right: 0;
  top: 0;
  width: 400px;
}

.visitor-drawer__header {
  align-items: center;
  display: flex;
  gap: 16px;
  justify-content: space-between;
  margin-bottom: 8px;
}

.visitor-drawer__title {
  color: #222222;
  font-size: 17px;
  font-weight: 600;
  line-height: 1.3;
  margin: 0;
}

.visitor-drawer__close {
  align-items: center;
  background: transparent;
  border: 0;
  border-radius: 999px;
  color: #111111;
  cursor: pointer;
  display: inline-flex;
  flex-shrink: 0;
  font-size: 22px;
  font-weight: 500;
  height: 30px;
  justify-content: center;
  line-height: 1;
  width: 30px;
}

.visitor-drawer__close:hover {
  background: rgba(17, 17, 17, 0.06);
}

.visitor-drawer__header-right {
  align-items: center;
  display: flex;
  gap: 8px;
}

.visitor-drawer__archive-link {
  color: var(--agent-color-brand-primary, #2F6BFF);
  font-size: 13px;
  text-decoration: none;
  white-space: nowrap;
}

.visitor-drawer__archive-link:hover {
  text-decoration: underline;
}

.visitor-drawer__content {
  flex: 1;
  min-height: 0;
  padding: 6px 0;
}

/* Sections */
.vd-section {
  padding: 6px 0;
}

.vd-section__header {
  align-items: center;
  background: transparent;
  border: 0;
  color: #222222;
  cursor: pointer;
  display: inline-flex;
  justify-content: space-between;
  line-height: 1.2;
  padding: 6px 0;
  width: 100%;
}

.vd-section__title {
  font-size: 14px;
  font-weight: var(--agent-font-weight-semibold);
}

.vd-section__arrow {
  color: #8d98a9;
  flex-shrink: 0;
  transition: transform 0.15s ease;
}

.vd-section__arrow--collapsed {
  transform: rotate(-90deg);
}

.vd-section__body {
  padding: 4px 0 2px;
}

/* Fields */
.vd-fields {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 0;
}

.vd-field {
  align-items: baseline;
  display: grid;
  gap: var(--agent-space-8);
  grid-template-columns: 84px 1fr;
}

.vd-field dt {
  color: #7e8999;
  font-size: var(--agent-font-size-sm);
}

.vd-field dd {
  color: #222222;
  font-size: 14px;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.vd-field__link {
  color: var(--agent-color-brand-primary);
}

/* Tags */
.vd-tags {
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.vd-tag {
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

.vd-add-tag {
  align-items: center;
  background: #f2f4f8;
  border: 1px solid #e7ebf0;
  border-radius: 999px;
  color: #8d98a9;
  cursor: pointer;
  display: inline-flex;
  font-size: 16px;
  height: 28px;
  justify-content: center;
  width: 28px;
}

.vd-add-tag:hover {
  background: #eaecf1;
}

/* Timeline */
.vd-timeline {
  display: flex;
  flex-direction: column;
  gap: 10px;
  list-style: none;
  margin: 0;
  padding: 0;
}

.vd-timeline-item {
  display: flex;
  gap: var(--agent-space-8);
}

.vd-timeline-item__dot {
  background: #c6ccd8;
  border-radius: 50%;
  display: inline-block;
  flex-shrink: 0;
  height: 8px;
  margin-top: 6px;
  width: 8px;
}

.vd-timeline-item__dot--active {
  background: #57c878;
}

.vd-timeline-item__main {
  min-width: 0;
}

.vd-timeline-item__title {
  color: #222222;
  display: flex;
  font-size: var(--agent-font-size-sm);
  gap: 6px;
  margin: 0;
}

.vd-timeline-item__title a {
  color: var(--agent-color-brand-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.vd-timeline-item__meta {
  color: #93a0b2;
  font-size: var(--agent-font-size-sm);
  margin: 2px 0 0;
}

.vd-timeline-item--more {
  color: #222222;
  cursor: pointer;
  font-size: var(--agent-font-size-sm);
  padding-left: 16px;
}

.vd-empty-hint {
  color: #93a0b2;
  font-size: var(--agent-font-size-sm);
  margin: 0;
}

/* Transition */
.visitor-drawer-enter-active,
.visitor-drawer-leave-active {
  transition: opacity 0.2s ease;
}

.visitor-drawer-enter-active .visitor-drawer,
.visitor-drawer-leave-active .visitor-drawer {
  transition: transform 0.24s ease;
}

.visitor-drawer-enter-from,
.visitor-drawer-leave-to {
  opacity: 0;
}

.visitor-drawer-enter-from .visitor-drawer,
.visitor-drawer-leave-to .visitor-drawer {
  transform: translateX(100%);
}

@media (max-width: 600px) {
  .visitor-drawer {
    border-radius: 0;
    padding: 16px 14px 14px;
    width: 100vw;
  }
}

/* Header back button */
.visitor-drawer__header-left {
  align-items: center;
  display: flex;
  gap: 6px;
  min-width: 0;
}

.visitor-drawer__back {
  align-items: center;
  background: transparent;
  border: 0;
  border-radius: 999px;
  color: #222;
  cursor: pointer;
  display: inline-flex;
  flex-shrink: 0;
  height: 28px;
  justify-content: center;
  width: 28px;
}

.visitor-drawer__back:hover {
  background: rgba(17, 17, 17, 0.06);
}

/* Session count link */
.vd-session-count-link {
  background: transparent;
  border: 0;
  border-bottom: 1px solid #222;
  color: #222;
  cursor: pointer;
  font-size: 14px;
  line-height: 1.4;
  padding: 0;
}

.vd-session-count-link:hover {
  color: var(--agent-color-brand-primary);
  border-bottom-color: var(--agent-color-brand-primary);
}

/* Session list cards */
.vd-session-card {
  background: #fff;
  border: 1px solid #e7ebf0;
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 10px;
  padding: 12px 14px;
}

.vd-session-card:hover {
  border-color: #c5d0e0;
}

.vd-session-card__title {
  color: #222;
  font-size: 14px;
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.vd-session-card__meta {
  align-items: center;
  color: #7e8999;
  display: flex;
  font-size: 12px;
  gap: 8px;
  min-width: 0;
}

.vd-session-card__agent-avatar {
  align-items: center;
  background: #2f6bff;
  border-radius: 50%;
  color: #fff;
  display: inline-flex;
  flex-shrink: 0;
  font-size: 11px;
  font-weight: 600;
  height: 20px;
  justify-content: center;
  width: 20px;
}

.vd-session-card__footer {
  align-items: center;
  display: flex;
  gap: 8px;
  justify-content: space-between;
}

.vd-session-card__badge {
  border-radius: 4px;
  flex-shrink: 0;
  font-size: 11px;
  padding: 2px 7px;
}

.vd-session-card__badge--closed { background: #f0f2f5; color: #7e8999; }
.vd-session-card__badge--active { background: #e8f0ff; color: #2f6bff; }
.vd-session-card__badge--queueing { background: #fff3e0; color: #e65100; }
.vd-session-card__badge--pending { background: #ffece8; color: #d4380d; }
.vd-session-card__badge--replied { background: #e8f0ff; color: #2f6bff; }

.vd-session-card__time {
  color: #93a0b2;
  font-size: 11px;
  white-space: nowrap;
}

.vd-session-card__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.vd-session-card__tag {
  background: rgba(47, 107, 255, 0.08);
  border: 1px solid rgba(47, 107, 255, 0.18);
  border-radius: 10px;
  color: #2f6bff;
  font-size: 11px;
  padding: 2px 8px;
}

/* Detail messages */
.vd-detail-messages {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 4px 0 8px;
}

.vd-msg {
  align-items: flex-start;
  display: flex;
  gap: 8px;
}

.vd-msg--agent {
  flex-direction: row-reverse;
}

.vd-msg--system {
  justify-content: center;
}

.vd-msg__system {
  color: #93a0b2;
  font-size: 12px;
  text-align: center;
}

.vd-msg__avatar {
  align-items: center;
  border-radius: 50%;
  color: #fff;
  display: inline-flex;
  flex-shrink: 0;
  font-size: 12px;
  font-weight: 600;
  height: 34px;
  justify-content: center;
  width: 34px;
}

.vd-msg__body {
  display: flex;
  flex-direction: column;
  gap: 4px;
  max-width: calc(100% - 46px);
}

.vd-msg--agent .vd-msg__body {
  align-items: flex-end;
}

.vd-msg__meta {
  color: #93a0b2;
  display: flex;
  font-size: 12px;
  gap: 6px;
}

.vd-msg__bubble {
  background: #f0f2f5;
  border-radius: 12px;
  color: #222;
  font-size: 14px;
  line-height: 1.5;
  padding: 8px 12px;
  white-space: pre-wrap;
  word-break: break-word;
}

.vd-msg--agent .vd-msg__bubble {
  background: rgba(47, 107, 255, 0.1);
}

/* Detail footer */
.vd-detail-footer {
  padding-top: 8px;
}

.vd-detail-footer__dual {
  display: flex;
  gap: 10px;
}

.vd-detail-footer__btn {
  border-radius: 22px;
  cursor: pointer;
  flex: 1;
  font-size: 15px;
  font-weight: 600;
  height: 48px;
}

.vd-detail-footer__btn--primary {
  background: var(--agent-color-brand-primary);
  border: 1px solid var(--agent-color-brand-primary);
  color: #fff;
}

.vd-detail-footer__btn--assign {
  background: #f5f6f8;
  border: 1px solid #e7ebf0;
  color: var(--agent-color-brand-primary);
}

.vd-detail-footer__btn--full {
  background: #f5f6f8;
  border: 1px solid #e7ebf0;
  color: var(--agent-color-brand-primary);
  width: 100%;
}

/* More dropdown */
.vd-more-wrap {
  position: relative;
}

.vd-more-btn {
  align-items: center;
  background: transparent;
  border: 0;
  border-radius: 999px;
  color: #555;
  cursor: pointer;
  display: inline-flex;
  flex-shrink: 0;
  height: 30px;
  justify-content: center;
  width: 30px;
}

.vd-more-btn:hover {
  background: rgba(17, 17, 17, 0.06);
}

.vd-more-dropdown {
  background: #fff;
  border: 1px solid #e7ebf0;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(15, 23, 42, 0.12);
  display: none;
  min-width: 120px;
  padding: 4px 0;
  position: absolute;
  right: 0;
  top: 100%;
  z-index: 10;
}

.vd-more-wrap:hover .vd-more-dropdown {
  display: block;
}

.vd-more-dropdown__item {
  background: transparent;
  border: 0;
  color: #222;
  cursor: pointer;
  display: block;
  font-size: 13px;
  line-height: 1.4;
  padding: 8px 16px;
  text-align: left;
  white-space: nowrap;
  width: 100%;
}

.vd-more-dropdown__item:hover {
  background: #f5f6f8;
}

/* Detail nav buttons */
.vd-nav-btn {
  align-items: center;
  background: transparent;
  border: 0;
  border-radius: 999px;
  color: #555;
  cursor: pointer;
  display: inline-flex;
  flex-shrink: 0;
  height: 30px;
  justify-content: center;
  width: 30px;
}

.vd-nav-btn:hover {
  background: rgba(17, 17, 17, 0.06);
}

.vd-nav-btn--disabled {
  color: #ccc;
  cursor: not-allowed;
  opacity: 0.4;
}

.vd-nav-btn--disabled:hover {
  background: transparent;
}

/* Detail title edit */
.vd-detail-edit-btn {
  align-items: center;
  background: transparent;
  border: 0;
  border-radius: 999px;
  color: #8d98a9;
  cursor: pointer;
  display: inline-flex;
  flex-shrink: 0;
  height: 24px;
  justify-content: center;
  width: 24px;
}

.vd-detail-edit-btn:hover {
  background: rgba(17, 17, 17, 0.06);
  color: #555;
}

.vd-detail-title-input {
  background: #fff;
  border: 1px solid var(--agent-color-brand-primary, #2f6bff);
  border-radius: 6px;
  color: #222;
  font-size: 17px;
  font-weight: 600;
  line-height: 1.3;
  min-width: 0;
  outline: none;
  padding: 2px 8px;
  width: 100%;
}
</style>
