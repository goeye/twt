<template>
  <div class="add-tags-page">
    <!-- 导航栏 -->
    <div class="nav-bar">
      <button class="nav-back" @click="router.back()">
        <svg width="10" height="18" viewBox="0 0 10 18" fill="none">
          <path d="M9 1L1 9L9 17" stroke="#222" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>
      <span class="nav-title">{{ pageTitle }}</span>
      <span class="nav-placeholder" />
    </div>

    <!-- 内容 -->
    <div class="content-area">
      <div class="card">
        <!-- 搜索框 -->
        <div class="search-bar">
          <svg class="search-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <circle cx="9" cy="9" r="6.5" stroke="rgba(100,116,145,0.5)" stroke-width="1.4" />
            <path d="M14 14L17 17" stroke="rgba(100,116,145,0.5)" stroke-width="1.4" stroke-linecap="round" />
          </svg>
          <input v-model="searchText" class="search-input" type="text" placeholder="搜索/创建标签" />
        </div>

        <!-- 标签列表 -->
        <div class="tag-list">
          <label
            v-for="tag in filteredTags"
            :key="tag.id"
            class="tag-row"
          >
            <span class="tag-name">{{ tag.name }}</span>
            <span
              class="checkbox"
              :class="{ 'checkbox--checked': selected.has(tag.id) }"
              @click="toggleSelect(tag.id)"
            >
              <svg v-if="selected.has(tag.id)" width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 6L5 9L10 3" stroke="#fff" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </span>
          </label>
        </div>
      </div>
    </div>

    <!-- 底部按钮 -->
    <div class="bottom-bar">
      <button class="confirm-btn" @click="handleConfirm">完成</button>
    </div>

    <!-- Toast -->
    <Transition name="toast">
      <div v-if="toastText" class="toast">{{ toastText }}</div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();

const tagType = (route.query.type as string) || 'visitor';
const pageTitle = computed(() => tagType === 'visitor' ? '添加访客标签' : '添加会话标签');
const storageKey = computed(() => tagType === 'visitor' ? 'visitorTags' : 'sessionTags');

interface Tag {
  id: number;
  name: string;
}

const tags = ref<Tag[]>([
  { id: 1, name: "有购买意向" },
  { id: 2, name: "外部推荐" },
  { id: 3, name: "广告投放" },
  { id: 4, name: "待跟进" },
  { id: 5, name: "这里是一个超长字段的tag黑名单标签展示" },
  { id: 6, name: "SVIP" },
  { id: 7, name: "价格敏感" },
  { id: 8, name: "视频电话咨询客户已预约需演示核心功能" },
]);

const searchText = ref("");
const selected = ref(new Set<number>());
const toastText = ref("");

// 从 sessionStorage 读取已选标签
const existingTags = sessionStorage.getItem(storageKey.value);
if (existingTags) {
  const tagIds = JSON.parse(existingTags) as number[];
  selected.value = new Set(tagIds);
}

const filteredTags = computed(() => {
  const kw = searchText.value.trim().toLowerCase();
  if (!kw) return tags.value;
  return tags.value.filter(t => t.name.toLowerCase().includes(kw));
});

const selectedTags = computed(() => {
  return tags.value.filter(t => selected.value.has(t.id));
});

function toggleSelect(id: number) {
  const s = new Set(selected.value);
  if (s.has(id)) s.delete(id);
  else s.add(id);
  selected.value = s;
}

function handleConfirm() {
  const tagIds = Array.from(selected.value);
  sessionStorage.setItem(storageKey.value, JSON.stringify(tagIds));

  toastText.value = "保存成功";
  setTimeout(() => {
    toastText.value = "";
    router.back();
  }, 1200);
}
</script>

<style scoped>
.add-tags-page {
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
}

.card {
  background: #fff;
  border-radius: 20px;
  padding: 20px;
}

/* 搜索框 */
.search-bar {
  display: flex;
  align-items: center;
  height: 36px;
  background: #f5f7f9;
  border-radius: 60px;
  padding: 0 12px;
  gap: 4px;
  margin-bottom: 5px;
}

.search-icon {
  flex-shrink: 0;
}

.search-input {
  flex: 1;
  font-size: 14px;
  color: #222;
  border: none;
  outline: none;
  background: transparent;
  min-width: 0;
}

.search-input::placeholder {
  color: rgba(100, 116, 145, 0.5);
}

/* 标签列表 */
.tag-list {
  display: flex;
  flex-direction: column;
}

.tag-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 54px;
  padding: 16px 0;
  border-bottom: 1px solid #f0f2f5;
}

.tag-row:last-child {
  border-bottom: none;
}

.tag-name {
  flex: 1;
  font-size: 16px;
  color: #222;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-right: 12px;
}

/* 复选框 */
.checkbox {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 2px solid #e2e8ef;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  -webkit-tap-highlight-color: transparent;
}

.checkbox--checked {
  background: #105eff;
  border-color: #105eff;
}

/* 底部按钮 */
.bottom-bar {
  flex-shrink: 0;
  background: #fff;
  padding: 16px 24px;
  padding-bottom: calc(16px + env(safe-area-inset-bottom, 0px));
  box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.04);
}

.confirm-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 52px;
  background: #105eff;
  border-radius: 16px;
  font-size: 16px;
  font-weight: 500;
  color: #fff;
  -webkit-tap-highlight-color: transparent;
}

.confirm-btn:active {
  opacity: 0.85;
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
