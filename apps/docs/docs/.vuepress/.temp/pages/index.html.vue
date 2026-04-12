<template><div><h2 id="_3-分钟接入" tabindex="-1">3 分钟接入 <a class="header-anchor" href="#_3-分钟接入">¶</a></h2>
<p>将以下代码粘贴到你网站的 <code v-pre>&lt;/body&gt;</code> 标签之前，即可完成接入：</p>
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
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>三步完成：</strong></p>
<ol>
<li>登录 <a href="https://app.twt.com" target="_blank" rel="noopener noreferrer">TWT Chat 后台</a>，进入 <strong>设置 &gt; 网站代码</strong>，复制安装代码</li>
<li>将代码粘贴到网站每个页面的 <code v-pre>&lt;/body&gt;</code> 标签之前</li>
<li>刷新网页，页面右下角出现聊天浮窗图标</li>
</ol>
<div class="hint-container tip">
<p class="hint-container-title">开始使用</p>
<p>还没有账号？<a href="https://app.twt.com" target="_blank" rel="noopener noreferrer">免费注册 TWT Chat</a> 获取 API Key，3 分钟完成接入。</p>
</div>
</div></template>


