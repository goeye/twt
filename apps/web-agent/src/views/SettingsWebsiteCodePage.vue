<template>
  <div class="wc-page">
    <p class="wc-subtitle">在你的网站上安装小部件</p>

    <div class="wc-top">
      <article class="wc-card agent-panel">
        <h2 class="wc-card__title">基础安装</h2>
        <p class="wc-card__desc">
          在你网站每个页面上的 &lt;/body&gt; 标签之前复制并粘贴此代码。
        </p>
        <div class="wc-code-block">
          <pre><code v-text="baseInstallCode"></code></pre>
        </div>
      </article>

      <article class="wc-card agent-panel wc-aside">
        <h2 class="wc-card__title">如何安装</h2>
        <button type="button" class="wc-aside__link" @click="$emit('toast', '视频教程开发中')">
          查看视频安装教程
        </button>
        <div class="wc-video-thumb" @click="$emit('toast', '视频教程开发中')">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <circle cx="24" cy="24" r="20" fill="rgba(255,255,255,0.9)" />
            <path d="M20 16l12 8-12 8V16z" fill="#333" />
          </svg>
        </div>
      </article>
    </div>
  </div>
</template>

<script setup lang="ts">
defineEmits<{
  (e: "toast", message: string): void;
}>();

const SE = "<" + "/script>";

const baseInstallCode = `<!-- Start of TWT Chat code -->
<script>
window.__twt_config={appid:"3bd9ddb64538fac65f8e983767daf474",lang:"zh-cn",theme:"light",sbs:"",sbs_mm:"",ranstr:"",name:"",nickname:"",email:"",phone:"",icon:"1",position:{right:"80px",bottom:"80px"},};(function(){var en=init;(function(){var nt=document.createElement("script");n.src="https://fk-test.twt-test2.jishu666.com/install/core.js?version=1.2";t.head.appendChild(n)},e.init()}))(window,document);
${SE}
<!-- End of TWT Chat code -->`;
</script>

<style scoped>
.wc-page {
  display: flex;
  flex-direction: column;
  gap: var(--agent-space-16);
}

.wc-subtitle {
  color: var(--agent-color-text-secondary);
  font-size: var(--agent-font-size-sm);
  margin: 0;
}

.wc-top {
  align-items: start;
  display: grid;
  gap: var(--agent-space-16);
  grid-template-columns: 1fr 280px;
}

.wc-card {
  border-radius: 24px;
  display: flex;
  flex-direction: column;
  gap: var(--agent-space-16);
  padding: var(--agent-space-24);
}

.wc-card__title {
  color: var(--agent-color-text-primary);
  font-size: var(--agent-font-size-xl);
  font-weight: var(--agent-font-weight-semibold);
  line-height: 1.3;
  margin: 0;
}

.wc-card__desc {
  color: var(--agent-color-text-secondary);
  font-size: var(--agent-font-size-sm);
  line-height: 1.5;
  margin: 0;
}

.wc-code-block {
  background: var(--agent-color-bg-muted);
  border-radius: var(--agent-radius-lg);
  overflow-x: auto;
  padding: var(--agent-space-16) var(--agent-space-20);
}

.wc-code-block pre {
  margin: 0;
}

.wc-code-block code {
  color: var(--agent-color-text-primary);
  font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
  font-size: var(--agent-font-size-sm);
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-all;
}

/* Aside - 如何安装 */
.wc-aside {
  gap: var(--agent-space-12);
}

.wc-aside__link {
  background: none;
  border: 0;
  color: var(--agent-color-text-secondary);
  cursor: pointer;
  font-size: var(--agent-font-size-sm);
  padding: 0;
  text-align: left;
}

.wc-aside__link:hover {
  color: var(--agent-color-brand-primary);
}

.wc-video-thumb {
  align-items: center;
  aspect-ratio: 16 / 10;
  background: #1a1f2e;
  border-radius: var(--agent-radius-lg);
  cursor: pointer;
  display: flex;
  justify-content: center;
  overflow: hidden;
}

.wc-video-thumb:hover {
  opacity: 0.9;
}

/* Custom config sections */
.wc-custom {
  gap: var(--agent-space-20);
}

.wc-section {
  display: flex;
  flex-direction: column;
  gap: var(--agent-space-12);
}

.wc-section__title {
  color: var(--agent-color-text-primary);
  font-size: var(--agent-font-size-md);
  font-weight: var(--agent-font-weight-semibold);
  line-height: 1.5;
  margin: 0;
}

@media (max-width: 1280px) {
  .wc-top {
    grid-template-columns: 1fr;
  }

  .wc-card {
    border-radius: 16px;
    padding: var(--agent-space-16);
  }
}
</style>
