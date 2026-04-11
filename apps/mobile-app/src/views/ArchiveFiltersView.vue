<template>
  <div class="filters-page">
    <!-- 导航栏 -->
    <div class="nav-bar">
      <button class="nav-back" @click="router.back()">
        <svg width="10" height="18" viewBox="0 0 10 18" fill="none">
          <path d="M9 1L1 9L9 17" stroke="#222" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>
      <span class="nav-title">全部筛选</span>
      <span class="nav-placeholder" />
    </div>

    <!-- 内容区域 -->
    <div class="content-area">
      <!-- 标签 -->
      <div class="filter-section">
        <div class="filter-section-header">
          <span class="filter-section-title">标签</span>
          <span class="filter-section-hint">请选择</span>
          <svg class="filter-section-arrow" width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M2 4L5 7L8 4" stroke="#C0C4CC" stroke-width="1.2" stroke-linecap="round" />
          </svg>
        </div>
      </div>

      <!-- 会话负责人 -->
      <div class="filter-section">
        <div class="filter-section-header">
          <span class="filter-section-title">会话负责人</span>
          <span class="filter-section-hint">请选择</span>
          <svg class="filter-section-arrow" width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M2 4L5 7L8 4" stroke="#C0C4CC" stroke-width="1.2" stroke-linecap="round" />
          </svg>
        </div>
      </div>

      <!-- 状态 -->
      <div class="filter-section">
        <p class="filter-section-title">状态</p>
        <div class="filter-chips">
          <button
            v-for="status in statusOptions"
            :key="status"
            class="filter-chip"
            :class="{ 'filter-chip--active': selectedStatus === status }"
            @click="selectedStatus = status"
          >
            {{ status }}
          </button>
        </div>
      </div>

      <!-- 访客评价 -->
      <div class="filter-section">
        <p class="filter-section-title">访客评价</p>
        <div class="filter-chips">
          <button
            v-for="rating in ratingOptions"
            :key="rating"
            class="filter-chip"
            :class="{ 'filter-chip--active': selectedRating === rating }"
            @click="selectedRating = rating"
          >
            {{ rating }}
          </button>
        </div>
      </div>

      <!-- 发起时间 -->
      <div class="filter-section">
        <div class="filter-section-header">
          <span class="filter-section-title">发起时间</span>
          <span class="filter-section-hint">请选择</span>
          <svg class="filter-section-arrow" width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M2 4L5 7L8 4" stroke="#C0C4CC" stroke-width="1.2" stroke-linecap="round" />
          </svg>
        </div>
      </div>
    </div>

    <!-- 底部按钮 -->
    <div class="bottom-bar">
      <button class="bottom-btn bottom-btn--secondary" @click="handleReset">重置</button>
      <button class="bottom-btn bottom-btn--primary" @click="handleConfirm">确定</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const statusOptions = ["不限", "待回复", "排队中", "待处理", "已回复", "已关闭"];
const ratingOptions = ["不限", "满意", "一般", "不满意"];

const selectedStatus = ref("不限");
const selectedRating = ref("不限");

function handleReset() {
  selectedStatus.value = "不限";
  selectedRating.value = "不限";
}

function handleConfirm() {
  console.log("筛选条件:", {
    status: selectedStatus.value,
    rating: selectedRating.value
  });
  router.back();
}
</script>

<style scoped>
.filters-page {
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
  color: #222;
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
  gap: 20px;
}

/* 筛选区块 */
.filter-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.filter-section-header {
  display: flex;
  align-items: center;
  height: 20px;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

.filter-section-title {
  font-size: 14px;
  font-weight: 500;
  color: #222;
}

.filter-section-hint {
  margin-left: auto;
  font-size: 12px;
  color: #75869c;
  margin-right: 4px;
}

.filter-section-arrow {
  transform: rotate(-90deg);
  flex-shrink: 0;
}

/* 筛选按钮组 */
.filter-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.filter-chip {
  flex: 1;
  min-width: calc(25% - 9px);
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  border-radius: 10px;
  font-size: 14px;
  color: #222;
  -webkit-tap-highlight-color: transparent;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 0 4px;
}

.filter-chip:active {
  opacity: 0.7;
}

.filter-chip--active {
  background: rgba(16, 94, 255, 0.1);
  color: #105eff;
  font-weight: 600;
}

/* 底部按钮 */
.bottom-bar {
  flex-shrink: 0;
  background: #fff;
  padding: 16px;
  padding-bottom: calc(16px + env(safe-area-inset-bottom, 0px));
  display: flex;
  gap: 12px;
}

.bottom-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 48px;
  border-radius: 16px;
  font-size: 16px;
  font-weight: 500;
  -webkit-tap-highlight-color: transparent;
}

.bottom-btn--secondary {
  background: #fff;
  color: #222;
}

.bottom-btn--secondary:active {
  background: #f5f7f9;
}

.bottom-btn--primary {
  background: #105eff;
  color: #fff;
}

.bottom-btn--primary:active {
  opacity: 0.85;
}
</style>
