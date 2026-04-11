<template>
  <div class="edit-title-page">
    <!-- 导航栏 -->
    <div class="nav-bar">
      <button class="back-btn" @click="handleBack">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M11 14L6 9L11 4" stroke="#222" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>
      <span class="nav-title">修改会话标题</span>
      <span class="nav-placeholder" />
    </div>

    <!-- 内容区域 -->
    <div class="content">
      <!-- 输入框 -->
      <div class="input-wrapper">
        <input
          v-model="title"
          type="text"
          class="title-input"
          placeholder="请输入会话标题"
          maxlength="50"
        />
        <button v-if="title" class="clear-btn" @click="title = ''">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="8" fill="#C0C4CC"/>
            <path d="M5 5L11 11M11 5L5 11" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </button>
      </div>

      <!-- 保存按钮 -->
      <button class="save-btn" @click="handleSave">
        保存
      </button>
    </div>

    <!-- Toast -->
    <Transition name="toast">
      <div v-if="toastText" class="toast">{{ toastText }}</div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();

// 从路由参数或 sessionStorage 获取当前标题
const currentTitle = ref("这是个很长很长的标题显示…");
const title = ref(currentTitle.value);

const toastText = ref("");
let toastTimer: ReturnType<typeof setTimeout> | null = null;

function showToast(text: string) {
  if (toastTimer) clearTimeout(toastTimer);
  toastText.value = text;
  toastTimer = setTimeout(() => { toastText.value = ""; }, 2000);
}

function handleBack() {
  router.back();
}

function handleSave() {
  if (!title.value.trim()) {
    showToast("会话标题不能为空");
    return;
  }

  // TODO: 保存标题到后端
  showToast("保存成功");

  // 延迟返回，让用户看到 toast
  setTimeout(() => {
    router.back();
  }, 1000);
}
</script>

<style scoped>
.edit-title-page {
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
  height: 44px;
  padding: 0 24px;
  margin-top: env(safe-area-inset-top, 44px);
  background: #fff;
  flex-shrink: 0;
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

.nav-title {
  flex: 1;
  font-size: 17px;
  font-weight: 500;
  color: #000;
  text-align: center;
}

.nav-placeholder {
  width: 18px;
  flex-shrink: 0;
}

/* 内容区域 */
.content {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* 输入框 */
.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  background: #fff;
  border: 0.5px solid #e2e8ef;
  border-radius: 18px;
  height: 56px;
  padding: 0 16px;
}

.title-input {
  flex: 1;
  font-size: 16px;
  color: #222;
  border: none;
  outline: none;
  background: transparent;
  padding-right: 8px;
}

.title-input::placeholder {
  color: #c0c4cc;
}

.clear-btn {
  width: 16px;
  height: 16px;
  padding: 0;
  background: none;
  border: none;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.clear-btn:active {
  opacity: 0.7;
}

/* 保存按钮 */
.save-btn {
  width: 100%;
  height: 52px;
  background: #105eff;
  border-radius: 18px;
  font-size: 16px;
  font-weight: 500;
  color: #fff;
  border: none;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  margin-top: 44px;
}

.save-btn:active {
  opacity: 0.8;
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
