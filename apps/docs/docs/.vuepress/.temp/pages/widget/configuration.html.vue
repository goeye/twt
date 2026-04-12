<template><div><h1 id="配置项参考" tabindex="-1">配置项参考 <a class="header-anchor" href="#配置项参考">#</a></h1>
<p>基础安装后即可使用默认聊天功能。如需自定义，可参考以下配置调整聊天组件的外观和行为。</p>
<h2 id="隐藏默认图标" tabindex="-1">隐藏默认图标 <a class="header-anchor" href="#隐藏默认图标">#</a></h2>
<p>将 <code v-pre>icon</code> 设置为 <code v-pre>&quot;2&quot;</code> 可隐藏右下角默认浮窗图标，然后通过自定义按钮触发聊天窗口。</p>
<div class="hint-container tip">
<p class="hint-container-title">注意</p>
<p><code v-pre>button</code> 需要替换为对应触发元素的 ID。</p>
</div>
<div class="language-html line-numbers-mode" data-highlighter="prismjs" data-ext="html" data-title="html"><pre v-pre><code><span class="line"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>script</span><span class="token punctuation">></span></span><span class="token script"><span class="token language-javascript"></span>
<span class="line"><span class="token comment">// Hide default badge</span></span>
<span class="line"><span class="token keyword">if</span> <span class="token punctuation">(</span>window<span class="token punctuation">.</span>__twt__config<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">  window<span class="token punctuation">.</span>__twt__config<span class="token punctuation">.</span>icon <span class="token operator">=</span> <span class="token string">'2'</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"><span class="token comment">// Customize the trigger for the visitor chat window</span></span>
<span class="line">document<span class="token punctuation">.</span><span class="token function">getElementById</span><span class="token punctuation">(</span><span class="token string">'button'</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">addEventListener</span><span class="token punctuation">(</span><span class="token string">'click'</span><span class="token punctuation">,</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">  <span class="token keyword">if</span> <span class="token punctuation">(</span>window<span class="token punctuation">.</span>__twt__api <span class="token operator">&amp;&amp;</span> window<span class="token punctuation">.</span>__twt__api<span class="token punctuation">.</span>open<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">    window<span class="token punctuation">.</span>__twt__api<span class="token punctuation">.</span><span class="token function">open</span><span class="token punctuation">(</span><span class="token punctuation">)</span></span>
<span class="line">  <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span><span class="token punctuation">)</span></span>
<span class="line"></span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>script</span><span class="token punctuation">></span></span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="监听未读消息数" tabindex="-1">监听未读消息数 <a class="header-anchor" href="#监听未读消息数">#</a></h2>
<p>通过自定义事件监听未读消息数变化，可用于在自定义按钮上显示未读角标。</p>
<div class="hint-container warning">
<p class="hint-container-title">注意</p>
<p>此代码需放在 SDK 安装脚本之后。</p>
</div>
<div class="language-html line-numbers-mode" data-highlighter="prismjs" data-ext="html" data-title="html"><pre v-pre><code><span class="line"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>script</span><span class="token punctuation">></span></span><span class="token script"><span class="token language-javascript"></span>
<span class="line">window<span class="token punctuation">.</span><span class="token function">addEventListener</span><span class="token punctuation">(</span><span class="token string">'__twt__custom_event'</span><span class="token punctuation">,</span> <span class="token punctuation">(</span><span class="token parameter">e</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span></span>
<span class="line">  console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">'Unread message count:'</span><span class="token punctuation">,</span> e<span class="token punctuation">.</span>detail<span class="token punctuation">.</span>unread<span class="token punctuation">)</span></span>
<span class="line"><span class="token punctuation">}</span><span class="token punctuation">)</span></span>
<span class="line"></span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>script</span><span class="token punctuation">></span></span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="动态设置语言" tabindex="-1">动态设置语言 <a class="header-anchor" href="#动态设置语言">#</a></h2>
<p>在运行时切换聊天组件的界面语言，无需重新加载页面。</p>
<p>支持的语言代码：<code v-pre>zh-cn</code>（简体中文）、<code v-pre>zh-tw</code>（繁体中文）、<code v-pre>en</code>（英文）。</p>
<div class="language-html line-numbers-mode" data-highlighter="prismjs" data-ext="html" data-title="html"><pre v-pre><code><span class="line"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>script</span><span class="token punctuation">></span></span><span class="token script"><span class="token language-javascript"></span>
<span class="line"><span class="token comment">// lang: zh-cn | zh-tw | en</span></span>
<span class="line">document<span class="token punctuation">.</span><span class="token function">getElementById</span><span class="token punctuation">(</span><span class="token string">'button'</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">addEventListener</span><span class="token punctuation">(</span><span class="token string">'click'</span><span class="token punctuation">,</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">  <span class="token keyword">if</span> <span class="token punctuation">(</span>window<span class="token punctuation">.</span>__twt__api <span class="token operator">&amp;&amp;</span> window<span class="token punctuation">.</span>__twt__api<span class="token punctuation">.</span>setLanguage<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">    window<span class="token punctuation">.</span>__twt__api<span class="token punctuation">.</span><span class="token function">setLanguage</span><span class="token punctuation">(</span><span class="token string">'{lang}'</span><span class="token punctuation">)</span></span>
<span class="line">  <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span><span class="token punctuation">)</span></span>
<span class="line"></span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>script</span><span class="token punctuation">></span></span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="接入内部系统的客户信息" tabindex="-1">接入内部系统的客户信息 <a class="header-anchor" href="#接入内部系统的客户信息">#</a></h2>
<p>将你系统中已登录用户的信息同步到 TWT Chat，客服在工作台中可直接查看访客身份。</p>
<h3 id="方式一-静态设置-页面加载时" tabindex="-1">方式一：静态设置（页面加载时） <a class="header-anchor" href="#方式一-静态设置-页面加载时">#</a></h3>
<p>在页面加载时通过 <code v-pre>window.__twt__config</code> 设置客户信息。需要在页面加载时设置，否则无法生效。</p>
<div class="language-html line-numbers-mode" data-highlighter="prismjs" data-ext="html" data-title="html"><pre v-pre><code><span class="line"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>script</span><span class="token punctuation">></span></span><span class="token script"><span class="token language-javascript"></span>
<span class="line"><span class="token keyword">if</span> <span class="token punctuation">(</span>window<span class="token punctuation">.</span>__twt__config<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">  <span class="token comment">// 用户唯一标识</span></span>
<span class="line">  window<span class="token punctuation">.</span>__twt__config<span class="token punctuation">.</span>sbs <span class="token operator">=</span> <span class="token string">'{sbs}'</span></span>
<span class="line">  <span class="token comment">// 用户签名</span></span>
<span class="line">  <span class="token comment">// sbs_mm 生成规则: md5(md5(sbs + '_' + AppSecret) + '_' + ranstr)</span></span>
<span class="line">  <span class="token comment">// 注: md5 结果为小写 32 位</span></span>
<span class="line">  <span class="token comment">// AppSecret 是生成 sbs_mm 的必要参数，请在开发设置中生成，并妥善保存，避免泄露。</span></span>
<span class="line">  window<span class="token punctuation">.</span>__twt__config<span class="token punctuation">.</span>sbs_mm <span class="token operator">=</span> <span class="token string">'{sbs_mm}'</span></span>
<span class="line">  <span class="token comment">// 随机字符串（建议 16 位以上）</span></span>
<span class="line">  window<span class="token punctuation">.</span>__twt__config<span class="token punctuation">.</span>ranstr <span class="token operator">=</span> <span class="token string">'{ranstr}'</span></span>
<span class="line">  <span class="token comment">// 用户姓名</span></span>
<span class="line">  window<span class="token punctuation">.</span>__twt__config<span class="token punctuation">.</span>name <span class="token operator">=</span> <span class="token string">'{name}'</span></span>
<span class="line">  <span class="token comment">// 用户备注名</span></span>
<span class="line">  window<span class="token punctuation">.</span>__twt__config<span class="token punctuation">.</span>nickname <span class="token operator">=</span> <span class="token string">'{nickname}'</span></span>
<span class="line">  <span class="token comment">// 用户邮箱</span></span>
<span class="line">  window<span class="token punctuation">.</span>__twt__config<span class="token punctuation">.</span>email <span class="token operator">=</span> <span class="token string">'{email}'</span></span>
<span class="line">  <span class="token comment">// 用户电话</span></span>
<span class="line">  window<span class="token punctuation">.</span>__twt__config<span class="token punctuation">.</span>phone <span class="token operator">=</span> <span class="token string">'{phone}'</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>script</span><span class="token punctuation">></span></span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="方式二-动态设置-加载后调用" tabindex="-1">方式二：动态设置（加载后调用） <a class="header-anchor" href="#方式二-动态设置-加载后调用">#</a></h3>
<p>通过 <code v-pre>login</code> 方法动态设置客户信息，适用于先无感登录、在 SDK 加载后再设置的场景。</p>
<div class="language-html line-numbers-mode" data-highlighter="prismjs" data-ext="html" data-title="html"><pre v-pre><code><span class="line"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>script</span><span class="token punctuation">></span></span><span class="token script"><span class="token language-javascript"></span>
<span class="line"><span class="token keyword">if</span> <span class="token punctuation">(</span>window<span class="token punctuation">.</span>__twt__api <span class="token operator">&amp;&amp;</span> window<span class="token punctuation">.</span>__twt__api<span class="token punctuation">.</span>login<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">  window<span class="token punctuation">.</span>__twt__api<span class="token punctuation">.</span><span class="token function">login</span><span class="token punctuation">(</span><span class="token punctuation">{</span>sbs<span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token punctuation">{</span>sbs_mm<span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token punctuation">{</span>ranstr<span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token punctuation">{</span>name<span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token punctuation">{</span>nickname<span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token punctuation">{</span>email<span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token punctuation">{</span>phone<span class="token punctuation">}</span><span class="token punctuation">)</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>script</span><span class="token punctuation">></span></span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="sbs-mm-签名生成规则" tabindex="-1">sbs_mm 签名生成规则 <a class="header-anchor" href="#sbs-mm-签名生成规则">#</a></h3>
<p><code v-pre>sbs_mm</code> 用于验证用户身份，需在<strong>服务端</strong>生成：</p>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text" data-title="text"><pre v-pre><code><span class="line">sbs_mm = md5( md5(sbs + '_' + AppSecret) + '_' + ranstr )</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><table>
<thead>
<tr>
<th>步骤</th>
<th>操作</th>
<th>示例</th>
</tr>
</thead>
<tbody>
<tr>
<td>1</td>
<td>拼接 <code v-pre>sbs</code> + <code v-pre>_</code> + <code v-pre>AppSecret</code></td>
<td><code v-pre>1001_your_app_secret</code></td>
</tr>
<tr>
<td>2</td>
<td>对步骤 1 结果取 MD5（小写 32 位）</td>
<td><code v-pre>a1b2c3d4...</code></td>
</tr>
<tr>
<td>3</td>
<td>拼接步骤 2 结果 + <code v-pre>_</code> + <code v-pre>ranstr</code></td>
<td><code v-pre>a1b2c3d4..._random16string</code></td>
</tr>
<tr>
<td>4</td>
<td>对步骤 3 结果取 MD5（小写 32 位）</td>
<td><code v-pre>最终 sbs_mm 值</code></td>
</tr>
</tbody>
</table>
<div class="hint-container caution">
<p class="hint-container-title">安全警告</p>
<p><code v-pre>AppSecret</code> 是生成 <code v-pre>sbs_mm</code> 的必要参数，请在 <strong>开发设置</strong> 中生成。务必在服务端完成签名计算，切勿将 <code v-pre>AppSecret</code> 暴露到前端代码中。</p>
</div>
</div></template>


