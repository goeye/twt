<template>
  <Teleport to="body">
    <transition name="visitor-drawer">
      <div v-if="open && visitor" class="visitor-drawer-layer">
        <div class="visitor-drawer-layer__mask" @click="$emit('close')" />

        <aside class="visitor-drawer" @click.stop>
          <header class="visitor-drawer__header">
            <h2 class="visitor-drawer__title">访客详情</h2>
            <button type="button" class="visitor-drawer__close" aria-label="关闭" @click="$emit('close')">
              <span>&times;</span>
            </button>
          </header>

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
                    <dd>{{ visitor.sessionCount }}</dd>
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
        </aside>
      </div>
    </transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref } from "vue";

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

defineProps<{
  open: boolean;
  visitor: VisitorDrawerData | null;
}>();

defineEmits<{
  (e: "close"): void;
}>();

const channelLabel: Record<string, string> = { web: "Web", widget: "网页插件", email: "Email" };

const collapsedSections = ref<string[]>([]);

const isSectionCollapsed = (key: string) => collapsedSections.value.includes(key);

const toggleSection = (key: string) => {
  if (isSectionCollapsed(key)) {
    collapsedSections.value = collapsedSections.value.filter((item) => item !== key);
    return;
  }
  collapsedSections.value = [...collapsedSections.value, key];
};
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
</style>
