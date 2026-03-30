<template>
  <div class="updates-page">
    <MarketingHeader :show-product-nav="false" />

    <div class="updates-container">
      <div class="product-nav">
        <div class="container">
          <div class="product-nav-content">
            <div class="product-logo">
              <span class="chat-icon">💬</span>
              <span class="product-name">Chat</span>
            </div>
            <div class="product-links">
              <a href="#">下载</a>
              <a href="#">功能介绍</a>
              <a href="#">版本价格</a>
              <div class="help-dropdown">
                <a href="#" class="help-trigger">帮助与支持 <svg class="arrow" width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></a>
                <div class="help-menu">
                  <a href="/updates" target="_blank">产品动态</a>
                  <a href="#">常见问题</a>
                  <a href="#">使用教程</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="updates-hero">
        <h1>👋 欢迎来到 Chat 帮助中心</h1>
        <p class="subtitle">在这里可以找到你想要的答案～</p>
      </div>

      <div class="updates-content">
        <div class="container">
          <div class="timeline">
            <div class="timeline-item" v-for="item in updates" :key="item.id">
              <div class="timeline-date">
                <span class="date-circle"></span>
                <span class="date-text">{{ item.date }}</span>
              </div>
              <div class="timeline-card">
                <h2>{{ item.title }}</h2>
                <div class="card-sections">
                  <div class="section-item" v-for="section in item.sections" :key="section.type">
                    <span class="section-tag">【{{ section.label }}】</span>
                    <span class="section-text">{{ section.text }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import MarketingHeader from '../components/layout/MarketingHeader.vue';

const updates = ref([
  {
    id: 1,
    title: '新增排队提醒设置，优化会话档案评价多选操作',
    date: '2026-03-27',
    sections: [
      { type: 'new', label: '新增', text: '自定义模块新增排队提醒，访客进入排队时，消息预览显示当前排队信息' },
      { type: 'optimize', label: '优化', text: '会话档案评价支持多选操作，新增标签与标题编辑能力，提升档案维护效率' }
    ]
  },
  {
    id: 2,
    title: '权限管理升级，新增角色权限配置与成员邀请记录查询',
    date: '2026-03-26',
    sections: [
      { type: 'new', label: '新增', text: '权限角色管理功能，支持按不同角色差异化配置操作权限' },
      { type: 'new', label: '新增', text: '成员列表新增邀请记录，可查看历史邀请详情、状态' }
    ]
  },
  {
    id: 3,
    title: '新增自定义聊天小部件，支持翻译非律宾英语，优化时间配置精度至秒级',
    date: '2026-03-20',
    sections: [
      { type: 'new', label: '新增', text: '新增自定义聊天小部件功能，支持自定义聊天小部件位置、内容、行为与品牌展示' },
      { type: 'new', label: '新增', text: '聊天翻译，边写边译支持翻译为非律宾英语' },
      { type: 'optimize', label: '优化', text: '系统内时间配置精度支持时、分、秒级设置，可以更精确的控制时间范围' }
    ]
  },
  {
    id: 4,
    title: '新增主动营销、@提及等功能，优化会话待处理交互',
    date: '2026-03-18',
    sections: [
      { type: 'new', label: '新增', text: '营销模块新增主动营销功能，支持创建定向营销活动，实现个性化消息推送与产品推广' },
      { type: 'new', label: '新增', text: '群聊新增 @成员提及功能' },
      { type: 'new', label: '新增', text: '客户接入 API 现已支持在客户标识之外，额外传入备注名、姓名、电话、邮箱' },
      { type: 'optimize', label: '优化', text: '优化会话"标记为待处理"交互：无需发送消息即可将会话标记为待处理，已标记的会话可通过历史消息能够得到理态' }
    ]
  },
  {
    id: 5,
    title: '新增在线会话客服转移与添加，新增访客/客户列表编辑功能',
    date: '2026-03-09',
    sections: [
      { type: 'new', label: '新增', text: '在线会话支持「会话转移」及「添加客服」' },
      { type: 'new', label: '新增', text: '访客列表、客户列表支持会话表中「访客信息」面板支持编辑功能' }
    ]
  }
]);
</script>

<style scoped>
.updates-page {
  min-height: 100vh;
  background: #fff;
}

.updates-container {
  background: #f5f7fa;
  min-height: calc(100vh - 64px);
}

/* 产品导航 */
.product-nav {
  height: 56px;
  background: transparent;
}

.product-nav .container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 48px;
}

.product-nav-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
}

.product-logo {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
}

.chat-icon {
  font-size: 20px;
}

.product-name {
  font-size: 16px;
  color: var(--links-color-text-primary);
}

.product-links {
  display: flex;
  gap: 32px;
  align-items: center;
}

.product-links a {
  color: var(--links-color-text-primary);
  text-decoration: none;
  font-size: 14px;
  transition: color var(--links-motion-fast);
}

.product-links a:hover {
  color: var(--links-color-primary);
}

/* 帮助与支持下拉菜单 */
.help-dropdown {
  position: relative;
}

.help-trigger {
  color: var(--links-color-text-primary);
  text-decoration: none;
  font-size: 14px;
  transition: color var(--links-motion-fast);
  cursor: pointer;
}

.help-trigger:hover {
  color: var(--links-color-primary);
}

.help-trigger .arrow {
  display: inline-block;
  transition: transform var(--links-motion-fast);
}

.help-dropdown:hover .help-trigger .arrow {
  transform: rotate(180deg);
}

.help-menu {
  display: none;
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  padding-top: 0;
}

.help-menu::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 0;
}

.help-dropdown:hover .help-menu {
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}

.help-menu a {
  white-space: nowrap;
  padding: 8px 20px;
  font-size: 14px;
  color: var(--links-color-text-primary);
  text-decoration: none;
  background: #fff;
  transition: all var(--links-motion-fast);
}

.help-menu a:first-child {
  border-radius: 8px 8px 0 0;
}

.help-menu a:last-child {
  border-radius: 0 0 8px 8px;
}

.help-menu a:hover {
  color: var(--links-color-primary);
  background: var(--links-color-bg-page);
}

.updates-hero {
  background: #f5f7fa;
  padding: 80px 24px;
  text-align: center;
  color: var(--links-color-text-primary);
}

.updates-hero h1 {
  font-size: 42px;
  font-weight: 600;
  margin-bottom: 16px;
}

.subtitle {
  font-size: 16px;
  color: var(--links-color-text-secondary);
}

.updates-content {
  padding: 64px 0;
  background: #fff;
}

.container {
  max-width: 900px;
  margin: 0 auto;
  padding: 0 24px;
}

.timeline {
  position: relative;
}

.timeline::before {
  content: '';
  position: absolute;
  right: 106px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: var(--links-color-border);
}

.timeline-item {
  display: flex;
  flex-direction: row-reverse;
  gap: 32px;
  margin-bottom: 48px;
  position: relative;
}

.timeline-date {
  width: 100px;
  flex-shrink: 0;
  text-align: left;
  padding-top: 4px;
  position: relative;
}

.date-circle {
  position: absolute;
  left: -7px;
  top: 8px;
  width: 12px;
  height: 12px;
  background: #fff;
  border: 3px solid var(--links-color-primary);
  border-radius: 50%;
  z-index: 1;
}

.date-text {
  display: block;
  font-size: 14px;
  color: var(--links-color-text-tertiary);
  line-height: 1.5;
}

.timeline-card {
  flex: 1;
}

.timeline-card h2 {
  font-size: 18px;
  font-weight: 600;
  color: var(--links-color-text-primary);
  margin-bottom: 16px;
  line-height: 1.5;
}

.card-sections {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.section-item {
  font-size: 14px;
  line-height: 1.8;
}

.section-tag {
  font-weight: 600;
  margin-right: 4px;
  color: var(--links-color-text-primary);
}

.section-text {
  color: var(--links-color-text-secondary);
}

@media (max-width: 768px) {
  .updates-hero h1 {
    font-size: 32px;
  }

  .timeline::before {
    right: 70px;
  }

  .timeline-date {
    width: 70px;
  }

  .date-circle {
    left: -18px;
  }

  .timeline-item {
    gap: 24px;
  }
}
</style>
