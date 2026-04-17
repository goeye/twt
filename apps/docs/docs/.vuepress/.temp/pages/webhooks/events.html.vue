<template><div><h1 id="事件类型" tabindex="-1">事件类型</h1>
<p>当前系统支持以下 Webhook 事件类型。</p>
<h2 id="unreplied-访客消息未回复" tabindex="-1">UNREPLIED - 访客消息未回复</h2>
<table>
<thead>
<tr>
<th>字段</th>
<th>值</th>
</tr>
</thead>
<tbody>
<tr>
<td>事件名称</td>
<td><code v-pre>UNREPLIED</code></td>
</tr>
<tr>
<td>触发条件</td>
<td>访客消息超时未回复</td>
</tr>
<tr>
<td>首次触发</td>
<td>自定义</td>
</tr>
<tr>
<td>后续触发</td>
<td>自定义</td>
</tr>
<tr>
<td>停止条件</td>
<td>客服回复 或 推送次数 &gt;= 4 次</td>
</tr>
</tbody>
</table>
<h3 id="content-字段说明" tabindex="-1">content 字段说明</h3>
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
<td><code v-pre>subject</code></td>
<td>string</td>
<td>会话标题</td>
<td><code v-pre>New Conversation</code></td>
</tr>
<tr>
<td><code v-pre>visitor_name</code></td>
<td>string</td>
<td>访客姓名</td>
<td><code v-pre>Visitor15</code></td>
</tr>
<tr>
<td><code v-pre>created_at</code></td>
<td>number</td>
<td>消息创建时间</td>
<td><code v-pre>1765439652</code></td>
</tr>
<tr>
<td><code v-pre>message_content</code></td>
<td>string</td>
<td>消息内容</td>
<td><code v-pre>1</code></td>
</tr>
<tr>
<td><code v-pre>property_name</code></td>
<td>string</td>
<td>项目名称</td>
<td><code v-pre>test</code></td>
</tr>
<tr>
<td><code v-pre>visitor_nickname</code></td>
<td>string</td>
<td>访客备注名</td>
<td><code v-pre>VIP</code></td>
</tr>
<tr>
<td><code v-pre>sbs</code></td>
<td>string</td>
<td>客户标识</td>
<td><code v-pre>234442313</code></td>
</tr>
<tr>
<td><code v-pre>status</code></td>
<td>string</td>
<td>状态（1: 待回复 2: 排队中 3: 待处理 4: 已回复）</td>
<td><code v-pre>1</code></td>
</tr>
<tr>
<td><code v-pre>push_times</code></td>
<td>number</td>
<td>推送次数</td>
<td><code v-pre>4</code></td>
</tr>
<tr>
<td><code v-pre>time_sec</code></td>
<td>number</td>
<td>超时时间（秒）</td>
<td><code v-pre>289</code></td>
</tr>
<tr>
<td><code v-pre>assigned_agent_nickname</code></td>
<td>string</td>
<td>服务客服名称</td>
<td><code v-pre>ctccccd</code></td>
</tr>
</tbody>
</table>
<h3 id="完整示例" tabindex="-1">完整示例</h3>
<div class="language-json line-numbers-mode" data-highlighter="prismjs" data-ext="json" data-title="json"><pre v-pre><code><span class="line"><span class="token punctuation">{</span></span>
<span class="line">  <span class="token property">"created_at"</span><span class="token operator">:</span> <span class="token number">1765439941</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token property">"event"</span><span class="token operator">:</span> <span class="token string">"UNREPLIED"</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token property">"webhook_id"</span><span class="token operator">:</span> <span class="token string">"58946f5f583edd94f5cf87e3534d04fb"</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token property">"content"</span><span class="token operator">:</span> <span class="token punctuation">[</span></span>
<span class="line">    <span class="token punctuation">{</span></span>
<span class="line">      <span class="token property">"subject"</span><span class="token operator">:</span> <span class="token string">"New Conversation"</span><span class="token punctuation">,</span></span>
<span class="line">      <span class="token property">"visitor_name"</span><span class="token operator">:</span> <span class="token string">"Visitor15"</span><span class="token punctuation">,</span></span>
<span class="line">      <span class="token property">"created_at"</span><span class="token operator">:</span> <span class="token number">1765439652</span><span class="token punctuation">,</span></span>
<span class="line">      <span class="token property">"message_content"</span><span class="token operator">:</span> <span class="token string">"1"</span><span class="token punctuation">,</span></span>
<span class="line">      <span class="token property">"property_name"</span><span class="token operator">:</span> <span class="token string">"test"</span><span class="token punctuation">,</span></span>
<span class="line">      <span class="token property">"visitor_nickname"</span><span class="token operator">:</span> <span class="token string">"visitor nickname"</span><span class="token punctuation">,</span></span>
<span class="line">      <span class="token property">"sbs"</span><span class="token operator">:</span> <span class="token string">""</span><span class="token punctuation">,</span></span>
<span class="line">      <span class="token property">"status"</span><span class="token operator">:</span> <span class="token string">"1"</span><span class="token punctuation">,</span></span>
<span class="line">      <span class="token property">"push_times"</span><span class="token operator">:</span> <span class="token number">4</span><span class="token punctuation">,</span></span>
<span class="line">      <span class="token property">"time_sec"</span><span class="token operator">:</span> <span class="token number">289</span><span class="token punctuation">,</span></span>
<span class="line">      <span class="token property">"assigned_agent_nickname"</span><span class="token operator">:</span> <span class="token string">"ctccccd"</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line">  <span class="token punctuation">]</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="应用场景" tabindex="-1">应用场景</h3>
<ul>
<li>自动转接到其他客服</li>
<li>触发邮件/短信通知提醒客服</li>
<li>记录超时工单用于绩效考核</li>
</ul>
<div class="hint-container tip">
<p class="hint-container-title">提示</p>
<p>后续将支持更多事件类型，请关注 <a href="/changelog" target="_blank" rel="noopener noreferrer">更新日志</a> 获取最新动态。</p>
</div>
</div></template>


