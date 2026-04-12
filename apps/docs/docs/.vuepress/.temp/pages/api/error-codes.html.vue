<template><div><h1 id="错误码参考" tabindex="-1">错误码参考 <a class="header-anchor" href="#错误码参考">#</a></h1>
<p>所有 API 遵循统一的响应格式。</p>
<h2 id="响应格式" tabindex="-1">响应格式 <a class="header-anchor" href="#响应格式">#</a></h2>
<div class="language-json line-numbers-mode" data-highlighter="prismjs" data-ext="json" data-title="json"><pre v-pre><code><span class="line"><span class="token punctuation">{</span></span>
<span class="line">  <span class="token property">"code"</span><span class="token operator">:</span> <span class="token number">1</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token property">"msg"</span><span class="token operator">:</span> <span class="token string">"ok"</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token property">"data"</span><span class="token operator">:</span> <span class="token string">""</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="业务状态码" tabindex="-1">业务状态码 <a class="header-anchor" href="#业务状态码">#</a></h2>
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
<h2 id="常见错误消息" tabindex="-1">常见错误消息 <a class="header-anchor" href="#常见错误消息">#</a></h2>
<p>当 <code v-pre>code</code> 为 <code v-pre>-1</code> 时，<code v-pre>msg</code> 字段会返回以下常见错误描述：</p>
<table>
<thead>
<tr>
<th>msg</th>
<th>说明</th>
<th>排查建议</th>
</tr>
</thead>
<tbody>
<tr>
<td><code v-pre>appid不存在</code></td>
<td>应用标识无效</td>
<td>检查 appid 是否正确，前往 设置 &gt; 开发设置 查看</td>
</tr>
<tr>
<td><code v-pre>签名校验失败</code></td>
<td>HMAC-SHA256 签名不匹配</td>
<td>检查 AppSecret 是否正确，确认 payload JSON 格式与签名时一致</td>
</tr>
<tr>
<td><code v-pre>timestamp已过期</code></td>
<td>请求时间戳超出有效范围</td>
<td>使用当前时间戳，确保服务器时间同步</td>
</tr>
<tr>
<td><code v-pre>参数缺失</code></td>
<td>必填参数未传</td>
<td>检查请求体是否包含所有必填字段</td>
</tr>
<tr>
<td><code v-pre>会话不存在</code></td>
<td>操作的会话 ID 无效</td>
<td>确认会话未被删除或解散</td>
</tr>
<tr>
<td><code v-pre>群聊不存在</code></td>
<td>操作的群聊 ID 无效</td>
<td>确认群聊未被解散</td>
</tr>
<tr>
<td><code v-pre>kefu_id不存在</code></td>
<td>客服 ID 无效</td>
<td>前往 团队 &gt; 客服列表 确认客服 ID</td>
</tr>
</tbody>
</table>
<div class="hint-container tip">
<p class="hint-container-title">排查建议</p>
<ul>
<li>签名问题：确保 JSON 不进行排序、不格式化（不 pretty print）、不 urlencode，使用压缩后的单行 JSON</li>
<li>时间戳问题：使用秒级时间戳，确保与服务器时间偏差不超过 5 分钟</li>
<li>详见 <a href="./authentication">鉴权与签名</a> 文档</li>
</ul>
</div>
</div></template>


