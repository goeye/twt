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

    <article class="wc-card agent-panel wc-custom">
      <h2 class="wc-card__title">自定义配置（可选）</h2>
      <p class="wc-card__desc">
        基础安装后即可使用默认聊天功能，如需自定义，可参考下方代码根据需要调整聊天组件的外观和行为
      </p>

      <section v-for="item in customCodeSections" :key="item.id" class="wc-section">
        <h3 class="wc-section__title">{{ item.id }}. {{ item.title }}</h3>
        <div class="wc-code-block">
          <pre><code v-text="item.code"></code></pre>
        </div>
      </section>
    </article>
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

interface CodeSection {
  id: number;
  title: string;
  code: string;
}

const customCodeSections: CodeSection[] = [
  {
    id: 1,
    title: "隐藏默认角标，使用自定义触发方式打开聊天窗口（注意：'button' 需要替换为对应触发元素的ID）",
    code: `<script>
// Hide default badge
if (window.__twt_config) {
  window.__twt_config.icon = '2'
}

// Customize the trigger for the visitor chat window
document.getElementById('button').addEventListener('click', function () {
  if (window.__twt__api && window.__twt__api.open) {
    window.__twt__api.open()
  }
})
${SE}`,
  },
  {
    id: 2,
    title: "监听获取未读消息数",
    code: `<!-- 注意：此代码需放在SDK安装脚本之前 -->
<script>
window.addEventListener('__twt__custom_event', (e) => {
  console.log('Unread message count:', e.detail.unread)
})
${SE}`,
  },
  {
    id: 3,
    title: "动态设置国际化语言",
    code: `<script>
// lang: zh-cn | zh-tw | en
document.getElementById('button').addEventListener('click', function () {
  if (window.__twt__api && window.__twt__api.setLanguage) {
    window.__twt__api.setLanguage('{lang}')
  }
})
${SE}`,
  },
  {
    id: 4,
    title: "接入内部系统的客户信息",
    code: `<script>
// 方式一：静态设置客户信息，需要在页面加载时设置，否则无法生效
if (window.__twt_config) {
  // 用户唯一标识
  window.__twt_config.sbs = '{sbs}'
  // 用户签名
  // sbs_mm生成规则：md5(md5(sbs + '_' + AppSecret) + '_' + ranstr);
  // 注：md5值为小写32位
  // 注意：AppSecret 是生成sbs_mm的必要参数，请在开发设置中生成，并妥善保存，避免泄露。
  window.__twt_config.sbs_mm = '{sbs_mm}'
  // 随机字符串（建议16位以上）
  window.__twt_config.ranstr = '{ranstr}'
  window.__twt_config.name = '{name}'
  window.__twt_config.nickname = '{nickname}'
  window.__twt_config.email = '{email}'
  window.__twt_config.phone = '{phone}'
}

// 方式二：动态设置客户信息，可用于无感登录，在加载后动态设置
if (window.__twt__api && window.__twt__api.login) {
  window.__twt__api.login({sbs}, {sbs_mm}, {ranstr}, {name}, {nickname}, {email}, {phone})
}
${SE}`,
  },
  {
    id: 5,
    title: "监听SDK已加载完成",
    code: `<!-- 注意：此代码需放在SDK安装脚本之前 -->
<script>
window.addEventListener('__twt__sdk_ready', () => {
  console.log('SDK已加载完成')
})
${SE}`,
  },
  {
    id: 6,
    title: "检查SDK是否已加载完成",
    code: `<script>
/**
 * 检查SDK是否已加载完成
 * @returns {boolean} SDK是否已就绪
 */
if (window.__twt__api.isReady()) {
  console.log('SDK已加载完成')
} else {
  console.log('SDK未加载完成')
}
${SE}`,
  },
  {
    id: 7,
    title: "获取SDK错误信息",
    code: `<script>
/**
 * 获取SDK错误信息
 * @returns {Object|null} 错误对象或null
 */
window.__twt__api.getError()
${SE}`,
  },
  {
    id: 8,
    title: "注册ready回调",
    code: `<script>
/**
 * 注册ready回调（建议方法）
 * @param {function} callback - 回调函数，接收api对象作为参数
 */
if (window.__twt__api.onReady) {
  window.__twt__api.onReady(() => {
    console.log('SDK加载完成')
    // TODO: 处理业务逻辑
  })
}
${SE}`,
  },
];
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
