<template>
  <div class="session-info-page">
    <div class="nav-bar">
      <button class="nav-back" @click="router.back()">
        <svg width="10" height="18" viewBox="0 0 10 18" fill="none">
          <path d="M9 1L1 9L9 17" stroke="#222" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>
      <span class="nav-title">会话详情</span>
      <span class="nav-placeholder" />
    </div>

    <div class="content-area">
      <!-- 会话信息 -->
      <p class="section-label">会话信息</p>
      <div class="card">
        <div class="card-row">
          <span class="card-label">会话标题</span>
          <span class="card-value card-value--ellipsis">-</span>
          <svg class="card-arrow" width="7" height="10" viewBox="0 0 7 10" fill="none"><path d="M1 1L5 5L1 9" stroke="#C0C4CC" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" /></svg>
        </div>
        <div class="card-divider" />
        <div class="card-row">
          <span class="card-label">状态</span>
          <span class="card-value card-value--closed">已关闭</span>
        </div>
        <div class="card-divider" />
        <div class="card-row">
          <span class="card-label">会话负责人</span>
          <div class="card-value card-value--agent">
            <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face" class="mini-avatar" />
            <span>tuski11111</span>
          </div>
        </div>
        <div class="card-divider" />
        <div class="card-row">
          <span class="card-label">消息数量</span>
          <span class="card-value">3</span>
        </div>
        <div class="card-divider" />
        <div class="card-row">
          <span class="card-label">服务客服</span>
          <span class="card-value">-</span>
        </div>
        <div class="card-divider" />
        <div class="card-row">
          <span class="card-label">访客评价</span>
          <span class="card-value">-</span>
        </div>
        <div class="card-divider" />
        <div class="card-row">
          <span class="card-label">标签</span>
          <span class="card-value">-</span>
          <svg class="card-arrow" width="7" height="10" viewBox="0 0 7 10" fill="none"><path d="M1 1L5 5L1 9" stroke="#C0C4CC" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" /></svg>
        </div>
      </div>

      <!-- 访客信息 -->
      <p class="section-label">访客信息</p>
      <div class="card">
        <div class="card-row">
          <span class="card-label">访客姓名</span>
          <span class="card-value">123</span>
        </div>
        <div class="card-divider" />
        <div class="card-row">
          <span class="card-label">客户标识</span>
          <span class="card-value">-</span>
        </div>
        <div class="card-divider" />
        <div class="card-row">
          <span class="card-label">访客备注名</span>
          <span class="card-value">-</span>
        </div>
      </div>

      <!-- 时间信息 -->
      <p class="section-label">时间信息</p>
      <div class="card">
        <div class="card-row">
          <span class="card-label">发起时间</span>
          <span class="card-value">-</span>
        </div>
        <div class="card-divider" />
        <div class="card-row">
          <span class="card-label">结束时间</span>
          <span class="card-value">-</span>
        </div>
        <div class="card-divider" />
        <div class="card-row">
          <span class="card-label">服务时长</span>
          <span class="card-value">50秒</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
const router = useRouter();
</script>

<style scoped>
.session-info-page {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #f5f7f9;
}

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

.content-area {
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  padding: 0 16px calc(16px + env(safe-area-inset-bottom, 0px));
}

.section-label {
  font-size: 12px;
  color: #75869c;
  margin: 16px 0 8px;
  padding-left: 4px;
}

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

.card-value--ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.card-value--closed {
  color: #105eff;
}

.card-value--agent {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 6px;
}

.mini-avatar {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  object-fit: cover;
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
</style>
