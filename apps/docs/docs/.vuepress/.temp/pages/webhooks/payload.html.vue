<template><div><h1 id="请求体结构" tabindex="-1">请求体结构</h1>
<p>每个 Webhook 请求都遵循统一的结构规范。</p>
<h2 id="请求头" tabindex="-1">请求头</h2>
<p>每个 Webhook 请求至少包含以下两个请求头：</p>
<table>
<thead>
<tr>
<th>请求头</th>
<th>说明</th>
<th>示例</th>
</tr>
</thead>
<tbody>
<tr>
<td><code v-pre>Content-Type</code></td>
<td>内容类型</td>
<td><code v-pre>application/json</code></td>
</tr>
<tr>
<td><code v-pre>X-Chat-Signature</code></td>
<td>HMAC-SHA256 签名</td>
<td><code v-pre>4ecdcaf813c422d34413671b2ed68e0a6e69ea8496d34ab40bd33cef26571e70</code></td>
</tr>
</tbody>
</table>
<h2 id="请求体" tabindex="-1">请求体</h2>
<p>请求体为 JSON 格式，所有事件共享以下基础字段：</p>
<table>
<thead>
<tr>
<th>参数名</th>
<th>类型</th>
<th>说明</th>
<th>参数示例</th>
</tr>
</thead>
<tbody>
<tr>
<td><code v-pre>created_at</code></td>
<td>number</td>
<td>Webhook 发送日期（时间戳）</td>
<td><code v-pre>1765439941</code></td>
</tr>
<tr>
<td><code v-pre>event</code></td>
<td>string</td>
<td>事件名称</td>
<td><code v-pre>UNREPLIED</code></td>
</tr>
<tr>
<td><code v-pre>webhook_id</code></td>
<td>string</td>
<td>唯一的 Webhook ID</td>
<td><code v-pre>58946f5f583edd94f5cf87e3534d04fb</code></td>
</tr>
<tr>
<td><code v-pre>content</code></td>
<td>array</td>
<td>包含特定事件数据的对象</td>
<td>—</td>
</tr>
</tbody>
</table>
<p><code v-pre>content</code> 数组中的字段根据事件类型不同而不同，详见 <a href="./events">事件类型</a>。</p>
<h2 id="响应要求" tabindex="-1">响应要求</h2>
<p>你的接收端应在 <strong>5 秒内</strong> 返回 HTTP <code v-pre>200</code> 状态码，表示已成功接收。</p>
<p>如果返回非 200 状态码或超时，系统将进行重试。</p>
</div></template>


