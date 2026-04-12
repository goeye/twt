<template><div><h1 id="_3-分钟接入" tabindex="-1">3 分钟接入 <a class="header-anchor" href="#_3-分钟接入">¶</a></h1>
<p>快速完成 TWT Chat 接入。</p>
<h2 id="第-1-步-获取安装代码" tabindex="-1">第 1 步：获取安装代码 <a class="header-anchor" href="#第-1-步-获取安装代码">¶</a></h2>
<p>登录 <a href="https://app.twt.com" target="_blank" rel="noopener noreferrer">TWT Chat 后台</a>，进入 <strong>设置 &gt; 网站代码</strong>，复制安装代码片段。</p>
<h2 id="第-2-步-粘贴到网页" tabindex="-1">第 2 步：粘贴到网页 <a class="header-anchor" href="#第-2-步-粘贴到网页">¶</a></h2>
<p>将代码粘贴到你网站每个页面的 <code v-pre>&lt;/body&gt;</code> 标签之前：</p>
<div class="language-html line-numbers-mode" data-highlighter="prismjs" data-ext="html" data-title="html"><pre v-pre><code><span class="line"><span class="token comment">&lt;!-- Start of TWT Chat code --></span></span>
<span class="line"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>script</span><span class="token punctuation">></span></span><span class="token script"><span class="token language-javascript"></span>
<span class="line">window<span class="token punctuation">.</span>__twt__config <span class="token operator">=</span> <span class="token punctuation">{</span></span>
<span class="line">  <span class="token literal-property property">appid</span><span class="token operator">:</span> <span class="token string">"你的APPID"</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token literal-property property">lang</span><span class="token operator">:</span> <span class="token string">"zh-cn"</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token literal-property property">theme</span><span class="token operator">:</span> <span class="token string">"light"</span></span>
<span class="line"><span class="token punctuation">}</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token punctuation">(</span><span class="token keyword">function</span><span class="token punctuation">(</span><span class="token parameter">n<span class="token punctuation">,</span> t</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">  <span class="token keyword">var</span> e <span class="token operator">=</span> <span class="token punctuation">{</span> <span class="token function-variable function">init</span><span class="token operator">:</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token keyword">var</span> n <span class="token operator">=</span> t<span class="token punctuation">.</span><span class="token function">createElement</span><span class="token punctuation">(</span><span class="token string">"script"</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    n<span class="token punctuation">.</span>async <span class="token operator">=</span> <span class="token operator">!</span><span class="token number">0</span><span class="token punctuation">;</span></span>
<span class="line">    n<span class="token punctuation">.</span>type <span class="token operator">=</span> <span class="token string">"text/javascript"</span><span class="token punctuation">;</span></span>
<span class="line">    n<span class="token punctuation">.</span>src <span class="token operator">=</span> <span class="token string">"https://visitorchat.twt.com/install/core.js?version=v1.2"</span><span class="token punctuation">;</span></span>
<span class="line">    t<span class="token punctuation">.</span>head<span class="token punctuation">.</span><span class="token function">appendChild</span><span class="token punctuation">(</span>n<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">  <span class="token punctuation">}</span><span class="token punctuation">}</span><span class="token punctuation">;</span></span>
<span class="line">  e<span class="token punctuation">.</span><span class="token function">init</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">(</span>window<span class="token punctuation">,</span> document<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>script</span><span class="token punctuation">></span></span></span>
<span class="line"><span class="token comment">&lt;!-- End of TWT Chat code --></span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="第-3-步-验证" tabindex="-1">第 3 步：验证 <a class="header-anchor" href="#第-3-步-验证">¶</a></h2>
<p>刷新网页，页面右下角应出现聊天浮窗图标。点击即可发起对话。</p>
<h2 id="下一步" tabindex="-1">下一步 <a class="header-anchor" href="#下一步">¶</a></h2>
<ul>
<li><a href="/widget/configuration" target="_blank" rel="noopener noreferrer">自定义配置</a> — 调整外观和行为</li>
<li><a href="/widget/javascript-api" target="_blank" rel="noopener noreferrer">JavaScript API</a> — 程序化控制聊天组件</li>
<li><a href="/chat-page/parameters" target="_blank" rel="noopener noreferrer">传递客户信息</a> — 将已登录用户信息同步到聊天</li>
</ul>
<div class="hint-container tip">
<p class="hint-container-title">开始使用</p>
<p>还没有账号？<a href="https://app.twt.com" target="_blank" rel="noopener noreferrer">免费注册 TWT Chat</a> 获取 API Key，3 分钟完成接入。</p>
</div>
</div></template>


