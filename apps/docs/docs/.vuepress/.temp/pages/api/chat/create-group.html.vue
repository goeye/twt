<template><div><h1 id="创建群聊-批量" tabindex="-1">创建群聊-批量 <a class="header-anchor" href="#创建群聊-批量">¶</a></h1>
<p>批量创建多个群聊会话。</p>
<h2 id="请求" tabindex="-1">请求 <a class="header-anchor" href="#请求">¶</a></h2>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text" data-title="text"><pre v-pre><code><span class="line">POST https://apichat.twt.com/openapi/zxlt/fqlt_ql_batch</span>
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
<td>群聊信息列表</td>
</tr>
</tbody>
</table>
<h4 id="u-info-对象字段" tabindex="-1">u_info 对象字段 <a class="header-anchor" href="#u-info-对象字段">¶</a></h4>
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
<td><code v-pre>item</code></td>
<td>array[object]</td>
<td>是</td>
<td>群成员列表</td>
</tr>
<tr>
<td><code v-pre>qlmc</code></td>
<td>string</td>
<td>否</td>
<td>群聊名称，1-30 字符</td>
</tr>
<tr>
<td><code v-pre>content</code></td>
<td>string</td>
<td>否</td>
<td>创建群聊后发送的一条消息，1-2000 字符</td>
</tr>
</tbody>
</table>
<h4 id="item-对象字段-群成员" tabindex="-1">item 对象字段（群成员） <a class="header-anchor" href="#item-对象字段-群成员">¶</a></h4>
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
<td><code v-pre>u_lx</code></td>
<td>string</td>
<td>是</td>
<td>用户类型</td>
</tr>
<tr>
<td><code v-pre>uid</code></td>
<td>integer</td>
<td>是</td>
<td>用户 ID</td>
</tr>
</tbody>
</table>
<h3 id="请求示例" tabindex="-1">请求示例 <a class="header-anchor" href="#请求示例">¶</a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre v-pre><code><span class="line"><span class="token function">curl</span> <span class="token parameter variable">--location</span> <span class="token parameter variable">--request</span> POST <span class="token string">'https://apichat.twt.com/openapi/zxlt/fqlt_ql_batch'</span> <span class="token punctuation">\</span></span>
<span class="line"><span class="token parameter variable">--header</span> <span class="token string">'x-chat-signature: 7ac03ccc306902234f3b40cbe797fcb0f'</span> <span class="token punctuation">\</span></span>
<span class="line"><span class="token parameter variable">--header</span> <span class="token string">'Accept: application/json'</span> <span class="token punctuation">\</span></span>
<span class="line"><span class="token parameter variable">--header</span> <span class="token string">'Content-Type: application/json'</span> <span class="token punctuation">\</span></span>
<span class="line">--data-raw <span class="token string">'{</span>
<span class="line">    "appid": "string",</span>
<span class="line">    "timestamp": 0,</span>
<span class="line">    "ranstr": "string",</span>
<span class="line">    "u_info": [</span>
<span class="line">        {</span>
<span class="line">            "item": [</span>
<span class="line">                {</span>
<span class="line">                    "u_lx": "string",</span>
<span class="line">                    "uid": 0</span>
<span class="line">                }</span>
<span class="line">            ],</span>
<span class="line">            "qlmc": "string",</span>
<span class="line">            "content": "string"</span>
<span class="line">        }</span>
<span class="line">    ]</span>
<span class="line">}'</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="返回响应" tabindex="-1">返回响应 <a class="header-anchor" href="#返回响应">¶</a></h2>
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
<td>array[object]</td>
<td>是</td>
<td>返回数据</td>
</tr>
</tbody>
</table>
<h4 id="data-对象字段" tabindex="-1">data 对象字段 <a class="header-anchor" href="#data-对象字段">¶</a></h4>
<table>
<thead>
<tr>
<th>参数名</th>
<th>类型</th>
<th>说明</th>
</tr>
</thead>
<tbody>
<tr>
<td><code v-pre>chat_id</code></td>
<td>string</td>
<td>群聊 ID</td>
</tr>
<tr>
<td><code v-pre>uid</code></td>
<td>string</td>
<td>群主 UID</td>
</tr>
</tbody>
</table>
<div class="language-json line-numbers-mode" data-highlighter="prismjs" data-ext="json" data-title="json"><pre v-pre><code><span class="line"><span class="token punctuation">{</span></span>
<span class="line">  <span class="token property">"code"</span><span class="token operator">:</span> <span class="token number">1</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token property">"msg"</span><span class="token operator">:</span> <span class="token string">"ok"</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token property">"data"</span><span class="token operator">:</span> <span class="token punctuation">[</span></span>
<span class="line">    <span class="token punctuation">{</span></span>
<span class="line">      <span class="token property">"chat_id"</span><span class="token operator">:</span> <span class="token string">"1841"</span><span class="token punctuation">,</span></span>
<span class="line">      <span class="token property">"uid"</span><span class="token operator">:</span> <span class="token string">"10005"</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line">  <span class="token punctuation">]</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></div></template>


