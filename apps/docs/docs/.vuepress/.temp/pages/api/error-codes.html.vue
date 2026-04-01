<template><div><h1 id="错误码参考" tabindex="-1">错误码参考 <a class="header-anchor" href="#错误码参考">¶</a></h1>
<p>所有 API 遵循统一的响应格式。</p>
<h2 id="响应格式" tabindex="-1">响应格式 <a class="header-anchor" href="#响应格式">¶</a></h2>
<div class="language-json line-numbers-mode" data-highlighter="prismjs" data-ext="json" data-title="json"><pre v-pre><code><span class="line"><span class="token punctuation">{</span></span>
<span class="line">  <span class="token property">"code"</span><span class="token operator">:</span> <span class="token number">1</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token property">"msg"</span><span class="token operator">:</span> <span class="token string">"ok"</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token property">"data"</span><span class="token operator">:</span> <span class="token string">""</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="业务状态码" tabindex="-1">业务状态码 <a class="header-anchor" href="#业务状态码">¶</a></h2>
<table>
<thead>
<tr>
<th>code</th>
<th>说明</th>
</tr>
</thead>
<tbody>
<tr>
<td><code v-pre>1</code></td>
<td>请求成功</td>
</tr>
<tr>
<td><code v-pre>-1</code></td>
<td>请求失败，具体原因见 <code v-pre>msg</code> 字段</td>
</tr>
</tbody>
</table>
<div class="hint-container tip">
<p class="hint-container-title">提示</p>
<p>当 <code v-pre>code</code> 为 <code v-pre>-1</code> 时，<code v-pre>msg</code> 字段会返回具体的错误描述信息。</p>
</div>
</div></template>


