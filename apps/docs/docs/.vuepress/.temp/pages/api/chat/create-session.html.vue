<template><div><h1 id="创建单聊" tabindex="-1">创建单聊 <a class="header-anchor" href="#创建单聊">¶</a></h1>
<p>创建一个单聊会话。</p>
<h2 id="请求" tabindex="-1">请求 <a class="header-anchor" href="#请求">¶</a></h2>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text" data-title="text"><pre v-pre><code><span class="line">POST https://apichat.twt.com/openapi/zxlt/fqlt_dl</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><h3 id="header-参数" tabindex="-1">Header 参数 <a class="header-anchor" href="#header-参数">¶</a></h3>
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
<h3 id="body-参数" tabindex="-1">Body 参数 <a class="header-anchor" href="#body-参数">¶</a></h3>
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
<td><code v-pre>sbs</code></td>
<td>string</td>
<td>是</td>
<td>客户标识，用户唯一标识，1-64 字符</td>
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
<td><code v-pre>kefu_id</code></td>
<td>string</td>
<td>是</td>
<td>客服 ID，客服端-团队-客服列表查看</td>
</tr>
<tr>
<td><code v-pre>ip</code></td>
<td>string</td>
<td>否</td>
<td>用户 IP，可在客户详情查看该客户 IP 信息</td>
</tr>
<tr>
<td><code v-pre>sbs_mc</code></td>
<td>string</td>
<td>否</td>
<td>访客姓名，客户姓名，1-30 字符，如果为空系统生成</td>
</tr>
<tr>
<td><code v-pre>content</code></td>
<td>string</td>
<td>否</td>
<td>单聊创建成功后发送的消息内容，1-2000 字符</td>
</tr>
<tr>
<td><code v-pre>kefu_show_chat</code></td>
<td>string</td>
<td>否</td>
<td>客服是否显示会话。1 是，0 否（默认 0）。该参数只有在生成新会话时才有效，如果是已存在的单聊，则默认按 1 的逻辑处理</td>
</tr>
</tbody>
</table>
<h3 id="请求示例" tabindex="-1">请求示例 <a class="header-anchor" href="#请求示例">¶</a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre v-pre><code><span class="line"><span class="token function">curl</span> <span class="token parameter variable">--location</span> <span class="token parameter variable">--request</span> POST <span class="token string">'https://apichat.twt.com/openapi/zxlt/fqlt_dl'</span> <span class="token punctuation">\</span></span>
<span class="line"><span class="token parameter variable">--header</span> <span class="token string">'x-chat-signature: 7ac03ccc306902234f3b40cbe797fcb0f'</span> <span class="token punctuation">\</span></span>
<span class="line"><span class="token parameter variable">--header</span> <span class="token string">'Accept: application/json'</span> <span class="token punctuation">\</span></span>
<span class="line"><span class="token parameter variable">--header</span> <span class="token string">'Content-Type: application/json'</span> <span class="token punctuation">\</span></span>
<span class="line">--data-raw <span class="token string">'{</span>
<span class="line">    "appid": "string",</span>
<span class="line">    "sbs": "string",</span>
<span class="line">    "timestamp": 0,</span>
<span class="line">    "ranstr": "string",</span>
<span class="line">    "kefu_id": "string",</span>
<span class="line">    "ip": "string",</span>
<span class="line">    "sbs_mc": "string",</span>
<span class="line">    "content": "string"</span>
<span class="line">}'</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="返回响应" tabindex="-1">返回响应 <a class="header-anchor" href="#返回响应">¶</a></h2>
<h3 id="_200-成功" tabindex="-1">200 成功 <a class="header-anchor" href="#_200-成功">¶</a></h3>
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
<div class="language-json line-numbers-mode" data-highlighter="prismjs" data-ext="json" data-title="json"><pre v-pre><code><span class="line"><span class="token punctuation">{</span></span>
<span class="line">  <span class="token property">"code"</span><span class="token operator">:</span> <span class="token number">1</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token property">"msg"</span><span class="token operator">:</span> <span class="token string">"ok"</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token property">"data"</span><span class="token operator">:</span> <span class="token string">""</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></div></template>


