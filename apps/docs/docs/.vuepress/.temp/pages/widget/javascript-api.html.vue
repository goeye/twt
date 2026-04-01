<template><div><h1 id="javascript-api" tabindex="-1">JavaScript API <a class="header-anchor" href="#javascript-api">¶</a></h1>
<p>TWT Chat SDK 加载完成后，会在 <code v-pre>window</code> 上挂载 <code v-pre>__twt__api</code> 对象，提供程序化控制聊天组件的能力。</p>
<h2 id="聊天窗口控制" tabindex="-1">聊天窗口控制 <a class="header-anchor" href="#聊天窗口控制">¶</a></h2>
<h3 id="open" tabindex="-1">open() <a class="header-anchor" href="#open">¶</a></h3>
<p>打开聊天窗口。</p>
<div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre v-pre><code><span class="line">window<span class="token punctuation">.</span>__twt__api<span class="token punctuation">.</span><span class="token function">open</span><span class="token punctuation">(</span><span class="token punctuation">)</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><h3 id="close" tabindex="-1">close() <a class="header-anchor" href="#close">¶</a></h3>
<p>关闭聊天窗口。</p>
<div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre v-pre><code><span class="line">window<span class="token punctuation">.</span>__twt__api<span class="token punctuation">.</span><span class="token function">close</span><span class="token punctuation">(</span><span class="token punctuation">)</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><h2 id="语言设置" tabindex="-1">语言设置 <a class="header-anchor" href="#语言设置">¶</a></h2>
<h3 id="setlanguage-lang" tabindex="-1">setLanguage(lang) <a class="header-anchor" href="#setlanguage-lang">¶</a></h3>
<p>动态切换界面语言，无需重新加载页面。</p>
<ul>
<li><strong>参数</strong>：<code v-pre>lang</code> — 语言代码，可选 <code v-pre>zh-cn</code>、<code v-pre>zh-tw</code>、<code v-pre>en</code></li>
</ul>
<div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre v-pre><code><span class="line">window<span class="token punctuation">.</span>__twt__api<span class="token punctuation">.</span><span class="token function">setLanguage</span><span class="token punctuation">(</span><span class="token string">'en'</span><span class="token punctuation">)</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><h2 id="用户身份" tabindex="-1">用户身份 <a class="header-anchor" href="#用户身份">¶</a></h2>
<h3 id="login-sbs-sbs-mm-ranstr-name-nickname-email-phone" tabindex="-1">login(sbs, sbs_mm, ranstr, name, nickname, email, phone) <a class="header-anchor" href="#login-sbs-sbs-mm-ranstr-name-nickname-email-phone">¶</a></h3>
<p>动态设置客户信息，适用于 SDK 加载后再登录的场景。</p>
<div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre v-pre><code><span class="line">window<span class="token punctuation">.</span>__twt__api<span class="token punctuation">.</span><span class="token function">login</span><span class="token punctuation">(</span></span>
<span class="line">  <span class="token string">'1001'</span><span class="token punctuation">,</span>           <span class="token comment">// sbs - 用户唯一标识</span></span>
<span class="line">  <span class="token string">'a1b2c3d4...'</span><span class="token punctuation">,</span>    <span class="token comment">// sbs_mm - 用户签名</span></span>
<span class="line">  <span class="token string">'random16str'</span><span class="token punctuation">,</span>    <span class="token comment">// ranstr - 随机字符串</span></span>
<span class="line">  <span class="token string">'张三'</span><span class="token punctuation">,</span>           <span class="token comment">// name - 用户姓名</span></span>
<span class="line">  <span class="token string">'三哥'</span><span class="token punctuation">,</span>           <span class="token comment">// nickname - 备注名</span></span>
<span class="line">  <span class="token string">'zhang@test.com'</span><span class="token punctuation">,</span> <span class="token comment">// email - 邮箱</span></span>
<span class="line">  <span class="token string">'13800138000'</span>     <span class="token comment">// phone - 电话</span></span>
<span class="line"><span class="token punctuation">)</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>关于 <code v-pre>sbs_mm</code> 签名生成规则，请参阅 <a href="./configuration#sbs-mm-%E7%AD%BE%E5%90%8D%E7%94%9F%E6%88%90%E8%A7%84%E5%88%99">配置项参考 - sbs_mm 签名生成规则</a>。</p>
<h2 id="sdk-生命周期" tabindex="-1">SDK 生命周期 <a class="header-anchor" href="#sdk-生命周期">¶</a></h2>
<h3 id="isready" tabindex="-1">isReady() <a class="header-anchor" href="#isready">¶</a></h3>
<p>检查 SDK 是否已加载完成。</p>
<ul>
<li><strong>返回值</strong>：<code v-pre>boolean</code> — SDK 是否已就绪</li>
</ul>
<div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre v-pre><code><span class="line"><span class="token keyword">if</span> <span class="token punctuation">(</span>window<span class="token punctuation">.</span>__twt__api<span class="token punctuation">.</span><span class="token function">isReady</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">  console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">'SDK已加载完成'</span><span class="token punctuation">)</span></span>
<span class="line"><span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span></span>
<span class="line">  console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">'SDK未加载完成'</span><span class="token punctuation">)</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="onready-callback" tabindex="-1">onReady(callback) <a class="header-anchor" href="#onready-callback">¶</a></h3>
<p>注册 SDK 就绪回调（便捷方法）。回调函数会收到 API 对象作为参数。</p>
<div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre v-pre><code><span class="line"><span class="token keyword">if</span> <span class="token punctuation">(</span>window<span class="token punctuation">.</span>__twt__api<span class="token punctuation">.</span>onReady<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">  window<span class="token punctuation">.</span>__twt__api<span class="token punctuation">.</span><span class="token function">onReady</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span></span>
<span class="line">    console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">'SDK已加载完成'</span><span class="token punctuation">)</span></span>
<span class="line">    <span class="token comment">// TODO: 处理业务逻辑</span></span>
<span class="line">  <span class="token punctuation">}</span><span class="token punctuation">)</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="geterror" tabindex="-1">getError() <a class="header-anchor" href="#geterror">¶</a></h3>
<p>获取 SDK 错误信息。</p>
<ul>
<li><strong>返回值</strong>：<code v-pre>Object | null</code> — 错误对象或 <code v-pre>null</code></li>
</ul>
<div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre v-pre><code><span class="line">window<span class="token punctuation">.</span>__twt__api<span class="token punctuation">.</span><span class="token function">getError</span><span class="token punctuation">(</span><span class="token punctuation">)</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><h2 id="事件监听" tabindex="-1">事件监听 <a class="header-anchor" href="#事件监听">¶</a></h2>
<h3 id="sdk-加载完成事件" tabindex="-1">SDK 加载完成事件 <a class="header-anchor" href="#sdk-加载完成事件">¶</a></h3>
<div class="hint-container warning">
<p class="hint-container-title">注意</p>
<p>此代码需放在 SDK 安装脚本之后。</p>
</div>
<div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre v-pre><code><span class="line">window<span class="token punctuation">.</span><span class="token function">addEventListener</span><span class="token punctuation">(</span><span class="token string">'__twt__sdk_ready'</span><span class="token punctuation">,</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span></span>
<span class="line">  console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">'SDK已加载完成'</span><span class="token punctuation">)</span></span>
<span class="line"><span class="token punctuation">}</span><span class="token punctuation">)</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="未读消息数变化事件" tabindex="-1">未读消息数变化事件 <a class="header-anchor" href="#未读消息数变化事件">¶</a></h3>
<div class="hint-container warning">
<p class="hint-container-title">注意</p>
<p>此代码需放在 SDK 安装脚本之后。</p>
</div>
<div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre v-pre><code><span class="line">window<span class="token punctuation">.</span><span class="token function">addEventListener</span><span class="token punctuation">(</span><span class="token string">'__twt__custom_event'</span><span class="token punctuation">,</span> <span class="token punctuation">(</span><span class="token parameter">e</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span></span>
<span class="line">  console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">'Unread message count:'</span><span class="token punctuation">,</span> e<span class="token punctuation">.</span>detail<span class="token punctuation">.</span>unread<span class="token punctuation">)</span></span>
<span class="line"><span class="token punctuation">}</span><span class="token punctuation">)</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="api-一览" tabindex="-1">API 一览 <a class="header-anchor" href="#api-一览">¶</a></h2>
<table>
<thead>
<tr>
<th>方法</th>
<th>说明</th>
<th>返回值</th>
</tr>
</thead>
<tbody>
<tr>
<td><code v-pre>open()</code></td>
<td>打开聊天窗口</td>
<td>—</td>
</tr>
<tr>
<td><code v-pre>close()</code></td>
<td>关闭聊天窗口</td>
<td>—</td>
</tr>
<tr>
<td><code v-pre>setLanguage(lang)</code></td>
<td>切换界面语言</td>
<td>—</td>
</tr>
<tr>
<td><code v-pre>login(sbs, sbs_mm, ...)</code></td>
<td>动态设置客户信息</td>
<td>—</td>
</tr>
<tr>
<td><code v-pre>isReady()</code></td>
<td>检查 SDK 是否就绪</td>
<td><code v-pre>boolean</code></td>
</tr>
<tr>
<td><code v-pre>onReady(callback)</code></td>
<td>注册就绪回调</td>
<td>—</td>
</tr>
<tr>
<td><code v-pre>getError()</code></td>
<td>获取错误信息</td>
<td><code v-pre>Object | null</code></td>
</tr>
</tbody>
</table>
<table>
<thead>
<tr>
<th>事件名</th>
<th>说明</th>
<th>回调参数</th>
</tr>
</thead>
<tbody>
<tr>
<td><code v-pre>__twt__sdk_ready</code></td>
<td>SDK 加载完成</td>
<td>—</td>
</tr>
<tr>
<td><code v-pre>__twt__custom_event</code></td>
<td>未读消息数变化</td>
<td><code v-pre>e.detail.unread</code></td>
</tr>
</tbody>
</table>
</div></template>


