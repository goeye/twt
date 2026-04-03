<template>
  <div class="email-preview-page">
    <div class="preview-header">
      <h1>Autopilot Launch Email Preview</h1>
      <div class="lang-tabs">
        <button
          v-for="lang in langs"
          :key="lang.key"
          :class="['lang-tab', { active: currentLang === lang.key }]"
          @click="currentLang = lang.key"
        >
          {{ lang.label }}
        </button>
      </div>
      <a :href="emailUrl" target="_blank" class="open-link">打开原始 HTML</a>
    </div>
    <div class="preview-canvas">
      <iframe :src="emailUrl" frameborder="0"></iframe>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';

type LangKey = 'zh-cn' | 'en' | 'zh-tw';

const route = useRoute();

const langs = [
  { key: 'zh-cn' as LangKey, label: '简体中文' },
  { key: 'en' as LangKey, label: 'English' },
  { key: 'zh-tw' as LangKey, label: '繁體中文' },
];

const currentLang = ref<LangKey>('zh-cn');

const emailUrl = computed(() => {
  return `/emails/autopilot-launch-v1-6-2.${currentLang.value}.html`;
});

onMounted(() => {
  const langParam = route.query.lang as LangKey;
  if (langParam && langs.some(l => l.key === langParam)) {
    currentLang.value = langParam;
  }
});
</script>

<style scoped>
.email-preview-page {
  min-height: 100vh;
  background: #f5f5f5;
  padding: 24px;
}

.preview-header {
  max-width: 1200px;
  margin: 0 auto 24px;
  background: white;
  padding: 20px 24px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.preview-header h1 {
  margin: 0 0 16px;
  font-size: 20px;
  font-weight: 600;
  color: #333;
}

.lang-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

.lang-tab {
  padding: 8px 16px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  color: #666;
  transition: all 0.2s;
}

.lang-tab:hover {
  border-color: #1890ff;
  color: #1890ff;
}

.lang-tab.active {
  background: #1890ff;
  border-color: #1890ff;
  color: white;
}

.open-link {
  display: inline-block;
  color: #1890ff;
  text-decoration: none;
  font-size: 14px;
}

.open-link:hover {
  text-decoration: underline;
}

.preview-canvas {
  max-width: 1200px;
  margin: 0 auto;
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  overflow: hidden;
}

.preview-canvas iframe {
  width: 100%;
  height: 800px;
  display: block;
}
</style>
