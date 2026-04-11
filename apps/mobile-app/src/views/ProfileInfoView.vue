<template>
  <div class="profile-info-page">
    <!-- 导航栏 -->
    <div class="nav-bar">
      <button class="nav-back" @click="router.back()">
        <svg width="10" height="18" viewBox="0 0 10 18" fill="none">
          <path d="M9 1L1 9L9 17" stroke="#222" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>
      <span class="nav-title">个人信息</span>
      <span class="nav-placeholder" />
    </div>

    <!-- 内容区域 -->
    <div class="content-area">
      <div class="card">
        <!-- 头像 -->
        <div class="info-row">
          <span class="info-label">头像</span>
          <div class="info-value-row">
            <img :src="avatarUrl" class="avatar" />
            <svg class="info-arrow" width="7" height="10" viewBox="0 0 7 10" fill="none">
              <path d="M1 1L5 5L1 9" stroke="#C0C4CC" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </div>
        </div>
        <div class="info-divider" />

        <!-- 姓名 -->
        <div class="info-row">
          <span class="info-label">姓名</span>
          <div class="info-value-row">
            <span class="info-value">{{ name }}</span>
            <svg class="info-arrow" width="7" height="10" viewBox="0 0 7 10" fill="none">
              <path d="M1 1L5 5L1 9" stroke="#C0C4CC" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </div>
        </div>
        <div class="info-divider" />

        <!-- 昵称 -->
        <div class="info-row">
          <span class="info-label">昵称</span>
          <div class="info-value-row">
            <span class="info-value info-value--ellipsis">{{ nickname }}</span>
            <svg class="info-arrow" width="7" height="10" viewBox="0 0 7 10" fill="none">
              <path d="M1 1L5 5L1 9" stroke="#C0C4CC" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </div>
        </div>
        <div class="info-divider" />

        <!-- 邮箱 -->
        <div class="info-row">
          <span class="info-label">邮箱</span>
          <div class="info-value-row">
            <span class="info-value">{{ email }}</span>
          </div>
        </div>
      </div>

      <!-- 修改密码 -->
      <div class="card card--single">
        <div class="info-row">
          <span class="info-label">修改密码</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const avatarUrl = ref("https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face");
const name = ref("李微利");
const nickname = ref("客服主管-宇宙无敌好看粒颗…");
const email = ref("aidanwang@gmail.com");
</script>

<style scoped>
.profile-info-page {
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

/* 内容区域 */
.content-area {
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* 卡片 */
.card {
  background: #fff;
  border-radius: 20px;
  padding: 0 20px;
}

.card--single {
  padding: 0;
}

/* 信息行 */
.info-row {
  display: flex;
  align-items: center;
  min-height: 54px;
  padding: 16px 0;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

.card--single .info-row {
  padding: 16px 20px;
}

.info-label {
  font-size: 16px;
  color: #222;
  flex-shrink: 0;
}

.info-value-row {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  min-width: 0;
}

.info-value {
  font-size: 14px;
  color: #75869c;
  text-align: right;
}

.info-value--ellipsis {
  max-width: 195px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.info-arrow {
  flex-shrink: 0;
}

.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}

/* 分隔线 */
.info-divider {
  height: 0.5px;
  background: #f0f2f5;
  margin: 0;
}
</style>
