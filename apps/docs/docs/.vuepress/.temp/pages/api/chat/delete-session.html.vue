<template><div><h1 id="删除单聊" tabindex="-1">删除单聊 <a class="header-anchor" href="#删除单聊">#</a></h1>
<blockquote>
<p><strong>POST</strong> <code v-pre>https://apichat.twt.com/openapi/zxlt/del_zxlt_dl</code> -- 需要签名鉴权</p>
</blockquote>
<p>删除一个单聊会话。</p>
<h2 id="请求" tabindex="-1">请求 <a class="header-anchor" href="#请求">#</a></h2>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text" data-title="text"><pre v-pre><code><span class="line">POST https://apichat.twt.com/openapi/zxlt/del_zxlt_dl</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><h3 id="header-参数" tabindex="-1">Header 参数 <a class="header-anchor" href="#header-参数">#</a></h3>
<table>
<thead>
<tr>
<th>参数名</th>
<th>类型</th>
<th>必填</th>
<th>说明</th>
</tr>
</thead>
<tbody>
<tr>
<td><code v-pre>x-chat-signature</code></td>
<td>string</td>
<td>是</td>
<td>HMAC-SHA256 签名</td>
</tr>
<tr>
<td><code v-pre>Accept</code></td>
<td>string</td>
<td>否</td>
<td>默认值：<code v-pre>application/json</code></td>
</tr>
<tr>
<td><code v-pre>Content-Type</code></td>
<td>string</td>
<td>是</td>
<td><code v-pre>application/json</code></td>
</tr>
</tbody>
</table>
<h3 id="body-参数" tabindex="-1">Body 参数 <a class="header-anchor" href="#body-参数">#</a></h3>
<table>
<thead>
<tr>
<th>参数名</th>
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
<td>应用标识，客服端-设置-开发设置查看</td>
</tr>
<tr>
<td><code v-pre>timestamp</code></td>
<td>integer</td>
<td>是</td>
<td>发起请求的时间戳</td>
</tr>
<tr>
<td><code v-pre>ranstr</code></td>
<td>string</td>
<td>是</td>
<td>随机字符串</td>
</tr>
<tr>
<td><code v-pre>u_info</code></td>
<td>array[object]</td>
<td>是</td>
<td>用户信息列表</td>
</tr>
</tbody>
</table>
<h4 id="u-info-对象字段" tabindex="-1">u_info 对象字段 <a class="header-anchor" href="#u-info-对象字段">#</a></h4>
<table>
<thead>
<tr>
<th>参数名</th>
<th>类型</th>
<th>必填</th>
<th>说明</th>
</tr>
</thead>
<tbody>
<tr>
<td><code v-pre>kefu_id</code></td>
<td>integer</td>
<td>是</td>
<td>客服 ID，客服端-团队-客服列表查看</td>
</tr>
<tr>
<td><code v-pre>sbs</code></td>
<td>string</td>
<td>是</td>
<td>客户标识，用户唯一标识，1-64 字符</td>
</tr>
</tbody>
</table>
<h3 id="请求示例" tabindex="-1">请求示例 <a class="header-anchor" href="#请求示例">#</a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre v-pre><code><span class="line"><span class="token function">curl</span> <span class="token parameter variable">-X</span> POST <span class="token string">'https://apichat.twt.com/openapi/zxlt/del_zxlt_dl'</span> <span class="token punctuation">\</span></span>
<span class="line"><span class="token parameter variable">-H</span> <span class="token string">'x-chat-signature: 4ecdcaf813c422d34413671b2ed68e0a6e69ea8496d34ab40bd33cef26571e70'</span> <span class="token punctuation">\</span></span>
<span class="line"><span class="token parameter variable">-H</span> <span class="token string">'Content-Type: application/json'</span> <span class="token punctuation">\</span></span>
<span class="line"><span class="token parameter variable">-d</span> <span class="token string">'{</span>
<span class="line">    "appid": "1b621280becdb0fa3d3e041ff69e1e1f",</span>
<span class="line">    "timestamp": 1712899200,</span>
<span class="line">    "ranstr": "4ad0faec14a58112",</span>
<span class="line">    "u_info": [</span>
<span class="line">        {</span>
<span class="line">            "kefu_id": 10078,</span>
<span class="line">            "sbs": "user_1001"</span>
<span class="line">        }</span>
<span class="line">    ]</span>
<span class="line">}'</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="返回响应" tabindex="-1">返回响应 <a class="header-anchor" href="#返回响应">#</a></h2>
<h3 id="_200-成功" tabindex="-1">200 成功 <a class="header-anchor" href="#_200-成功">#</a></h3>
<table>
<thead>
<tr>
<th>参数名</th>
<th>类型</th>
<th>必填</th>
<th>说明</th>
</tr>
</thead>
<tbody>
<tr>
<td><code v-pre>code</code></td>
<td>integer</td>
<td>是</td>
<td>1 正常，-1 失败</td>
</tr>
<tr>
<td><code v-pre>msg</code></td>
<td>string</td>
<td>是</td>
<td>失败时的错误信息</td>
</tr>
<tr>
<td><code v-pre>data</code></td>
<td>string</td>
<td>是</td>
<td>返回数据</td>
</tr>
</tbody>
</table>
<p>成功响应：</p>
<div class="language-json line-numbers-mode" data-highlighter="prismjs" data-ext="json" data-title="json"><pre v-pre><code><span class="line"><span class="token punctuation">{</span></span>
<span class="line">  <span class="token property">"code"</span><span class="token operator">:</span> <span class="token number">1</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token property">"msg"</span><span class="token operator">:</span> <span class="token string">"ok"</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token property">"data"</span><span class="token operator">:</span> <span class="token string">""</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>失败响应：</p>
<div class="language-json line-numbers-mode" data-highlighter="prismjs" data-ext="json" data-title="json"><pre v-pre><code><span class="line"><span class="token punctuation">{</span></span>
<span class="line">  <span class="token property">"code"</span><span class="token operator">:</span> <span class="token number">-1</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token property">"msg"</span><span class="token operator">:</span> <span class="token string">"会话不存在"</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token property">"data"</span><span class="token operator">:</span> <span class="token string">""</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></div></template>


