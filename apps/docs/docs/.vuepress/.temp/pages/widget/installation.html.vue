<template><div><h1 id="基础安装" tabindex="-1">基础安装</h1>
<p>在你网站的每个页面上嵌入 TWT Chat 聊天小部件。</p>
<h2 id="安装步骤" tabindex="-1">安装步骤</h2>
<p>在每个网页的 <code v-pre>&lt;/body&gt;</code> 标签之前，复制并粘贴以下代码：</p>
<div class="language-html line-numbers-mode" data-highlighter="prismjs" data-ext="html" data-title="html"><pre v-pre><code><span class="line"><span class="token comment">&lt;!-- Start of TWT Chat code --></span></span>
<span class="line"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>script</span><span class="token punctuation">></span></span><span class="token script"><span class="token language-javascript"></span>
<span class="line">  window<span class="token punctuation">.</span>TWTChatWidget <span class="token operator">=</span> window<span class="token punctuation">.</span>TWTChatWidget <span class="token operator">||</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token literal-property property">_q</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token function-variable function">on</span><span class="token operator">:</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">      <span class="token keyword">this</span><span class="token punctuation">.</span>_q<span class="token punctuation">.</span><span class="token function">push</span><span class="token punctuation">(</span><span class="token punctuation">[</span><span class="token string">"on"</span><span class="token punctuation">,</span> <span class="token class-name">Array</span><span class="token punctuation">.</span>prototype<span class="token punctuation">.</span><span class="token function">slice</span><span class="token punctuation">.</span><span class="token function">call</span><span class="token punctuation">(</span>arguments<span class="token punctuation">)</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token punctuation">}</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">  window<span class="token punctuation">.</span>__twt__config <span class="token operator">=</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token literal-property property">appid</span><span class="token operator">:</span> <span class="token string">"你的APPID"</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token literal-property property">icon</span><span class="token operator">:</span> <span class="token string">"1"</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token punctuation">}</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">  <span class="token punctuation">(</span><span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">n<span class="token punctuation">,</span> t</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token keyword">var</span> e <span class="token operator">=</span> <span class="token punctuation">{</span></span>
<span class="line">      <span class="token function-variable function">init</span><span class="token operator">:</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">var</span> n <span class="token operator">=</span> t<span class="token punctuation">.</span><span class="token function">createElement</span><span class="token punctuation">(</span><span class="token string">"script"</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        n<span class="token punctuation">.</span>async <span class="token operator">=</span> <span class="token operator">!</span><span class="token number">0</span><span class="token punctuation">;</span></span>
<span class="line">        n<span class="token punctuation">.</span>type <span class="token operator">=</span> <span class="token string">"text/javascript"</span><span class="token punctuation">;</span></span>
<span class="line">        n<span class="token punctuation">.</span>src <span class="token operator">=</span> <span class="token string">"https://visitorchat.twt.com/install/core.js?version=v1.2"</span><span class="token punctuation">;</span></span>
<span class="line">        t<span class="token punctuation">.</span>head<span class="token punctuation">.</span><span class="token function">appendChild</span><span class="token punctuation">(</span>n<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">      <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token punctuation">}</span><span class="token punctuation">;</span></span>
<span class="line">    e<span class="token punctuation">.</span><span class="token function">init</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">(</span>window<span class="token punctuation">,</span> document<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>script</span><span class="token punctuation">></span></span></span>
<span class="line"><span class="token comment">&lt;!-- End of TWT Chat code --></span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="hint-container tip">
<p class="hint-container-title">提示</p>
<p>你可以在 TWT Chat 后台的 <strong>设置 &gt; 安装 &gt; 网站代码</strong> 页面直接复制已填入 <code v-pre>appid</code> 的代码。</p>
</div>
<h2 id="配置字段说明" tabindex="-1">配置字段说明</h2>
<table>
<thead>
<tr>
<th>字段</th>
<th>类型</th>
<th>必填</th>
<th>说明</th>
</tr>
</thead>
<tbody>
<tr>
<td><code v-pre>appid</code></td>
<td>string</td>
<td>是</td>
<td>应用唯一标识，在后台获取</td>
</tr>
<tr>
<td><code v-pre>lang</code></td>
<td>string</td>
<td>否</td>
<td>界面语言，可选 <code v-pre>zh-cn</code>、<code v-pre>zh-tw</code>、<code v-pre>en</code></td>
</tr>
<tr>
<td><code v-pre>theme</code></td>
<td>string</td>
<td>否</td>
<td>主题模式，可选 <code v-pre>light</code>、<code v-pre>dark</code></td>
</tr>
<tr>
<td><code v-pre>icon</code></td>
<td>string</td>
<td>否</td>
<td>浮窗图标样式，<code v-pre>&quot;1&quot;</code> 显示默认图标，<code v-pre>&quot;2&quot;</code> 隐藏图标</td>
</tr>
<tr>
<td><code v-pre>sbs</code></td>
<td>string</td>
<td>否</td>
<td>用户唯一标识</td>
</tr>
<tr>
<td><code v-pre>sbs_mm</code></td>
<td>string</td>
<td>否</td>
<td>用户签名</td>
</tr>
<tr>
<td><code v-pre>ranstr</code></td>
<td>string</td>
<td>否</td>
<td>随机字符串（建议 16 位以上）</td>
</tr>
<tr>
<td><code v-pre>name</code></td>
<td>string</td>
<td>否</td>
<td>用户姓名</td>
</tr>
<tr>
<td><code v-pre>nickname</code></td>
<td>string</td>
<td>否</td>
<td>用户备注名</td>
</tr>
<tr>
<td><code v-pre>email</code></td>
<td>string</td>
<td>否</td>
<td>用户邮箱</td>
</tr>
<tr>
<td><code v-pre>phone</code></td>
<td>string</td>
<td>否</td>
<td>用户电话</td>
</tr>
</tbody>
</table>
<p>关于客户信息字段的详细说明，请参阅 <a href="/chat-page/parameters" target="_blank" rel="noopener noreferrer">URL 参数与客户信息</a>。</p>
</div></template>


