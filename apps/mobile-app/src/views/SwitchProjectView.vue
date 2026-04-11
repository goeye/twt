<template>
  <div class="switch-project-page">
    <!-- 顶部导航栏 -->
    <div class="nav-bar">
      <button class="back-btn" @click="handleBack">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M11 14L6 9L11 4" stroke="#222" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>
    </div>

    <!-- 内容区域 -->
    <div class="content">
      <!-- 标题和说明 -->
      <div class="header-section">
        <h1 class="title">轻触头像以切换项目</h1>
        <p class="desc">如果你已加入多个项目，可以在此添加后进行快捷切换</p>
      </div>

      <!-- 项目列表 -->
      <div class="project-list">
        <!-- 当前项目 -->
        <div class="project-item current-project">
          <div class="project-avatar">
            <img
              src="https://www.figma.com/api/mcp/asset/1c677829-df38-4b0e-9a6c-048d6317403d"
              alt="项目图标"
              class="avatar-img"
            />
          </div>
          <div class="project-info">
            <span class="project-name">够上信息科技（合肥）有限公司很长</span>
            <span class="project-role">管理员</span>
          </div>
          <div class="check-icon">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <circle cx="9" cy="9" r="9" fill="#00B578"/>
              <path d="M5 9L8 12L13 6" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        </div>

        <!-- 添加项目 -->
        <div class="project-item add-project" @click="handleAddProject">
          <div class="project-avatar add-avatar">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M6 1V11M1 6H11" stroke="#75869C" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </div>
          <div class="project-info">
            <span class="project-name">添加项目</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();

function handleBack() {
  router.back();
}

function handleAddProject() {
  // TODO: 实现添加项目逻辑
  console.log('添加项目');
}
</script>

<style scoped>
.switch-project-page {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #f5f7f9;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

/* 导航栏 */
.nav-bar {
  display: flex;
  align-items: center;
  padding: 0 24px;
  height: 44px;
  margin-top: env(safe-area-inset-top, 44px);
}

.back-btn {
  width: 18px;
  height: 18px;
  padding: 0;
  background: none;
  border: none;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 内容区域 */
.content {
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

/* 标题区域 */
.header-section {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.title {
  font-size: 22px;
  font-weight: 500;
  color: #222;
  line-height: 31px;
}

.desc {
  font-size: 14px;
  color: #75869c;
  line-height: 20px;
}

/* 项目列表 */
.project-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* 项目卡片 */
.project-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: #fff;
  border: 0.5px solid #e2e8ef;
  border-radius: 18px;
  min-height: 72px;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

.project-avatar {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: #fff;
  overflow: hidden;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.add-avatar {
  background: #f5f7f9;
}

.project-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.project-name {
  font-size: 16px;
  font-weight: 500;
  color: #222;
  line-height: 22px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.project-role {
  font-size: 12px;
  color: #75869c;
  line-height: 17px;
}

.check-icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

/* 添加项目样式 */
.add-project .project-info {
  justify-content: center;
}
</style>
