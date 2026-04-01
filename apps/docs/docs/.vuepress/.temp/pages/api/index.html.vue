<template><div><h1 id="开放-api" tabindex="-1">开放 API <a class="header-anchor" href="#开放-api">¶</a></h1>
<p>通过 REST API 与 TWT Chat 平台进行深度集成，管理会话、发送消息、同步客户数据。</p>
<h2 id="基本信息" tabindex="-1">基本信息 <a class="header-anchor" href="#基本信息">¶</a></h2>
<table>
<thead>
<tr>
<th>项目</th>
<th>说明</th>
</tr>
</thead>
<tbody>
<tr>
<td>Base URL</td>
<td><code v-pre>https://apichat.twt.com</code></td>
</tr>
<tr>
<td>协议</td>
<td>HTTPS</td>
</tr>
<tr>
<td>数据格式</td>
<td>JSON</td>
</tr>
<tr>
<td>字符编码</td>
<td>UTF-8</td>
</tr>
</tbody>
</table>
<h2 id="鉴权方式" tabindex="-1">鉴权方式 <a class="header-anchor" href="#鉴权方式">¶</a></h2>
<p>所有 API 请求需通过 HMAC-SHA256 签名鉴权，详见 <a href="./authentication">鉴权与签名</a>。</p>
<h2 id="api-模块" tabindex="-1">API 模块 <a class="header-anchor" href="#api-模块">¶</a></h2>
<h3 id="在线聊天" tabindex="-1">在线聊天 <a class="header-anchor" href="#在线聊天">¶</a></h3>
<table>
<thead>
<tr>
<th>接口</th>
<th>方法</th>
<th>说明</th>
</tr>
</thead>
<tbody>
<tr>
<td><a href="/api/chat/create-session" target="_blank" rel="noopener noreferrer">创建单聊</a></td>
<td>POST</td>
<td>创建单个聊天会话</td>
</tr>
<tr>
<td><a href="/api/chat/create-session-batch" target="_blank" rel="noopener noreferrer">创建单聊-批量</a></td>
<td>POST</td>
<td>批量创建单聊会话</td>
</tr>
<tr>
<td><a href="/api/chat/create-group" target="_blank" rel="noopener noreferrer">创建群聊-批量</a></td>
<td>POST</td>
<td>批量创建群聊会话</td>
</tr>
<tr>
<td><a href="/api/chat/delete-session" target="_blank" rel="noopener noreferrer">删除单聊</a></td>
<td>POST</td>
<td>删除单个聊天会话</td>
</tr>
<tr>
<td><a href="/api/chat/dissolve-group" target="_blank" rel="noopener noreferrer">解散群聊</a></td>
<td>POST</td>
<td>解散单个群聊</td>
</tr>
<tr>
<td><a href="/api/chat/dissolve-group-batch" target="_blank" rel="noopener noreferrer">批量解散群聊</a></td>
<td>POST</td>
<td>批量解散群聊</td>
</tr>
</tbody>
</table>
<h2 id="错误处理" tabindex="-1">错误处理 <a class="header-anchor" href="#错误处理">¶</a></h2>
<p>所有 API 遵循统一的错误响应格式，详见 <a href="./error-codes">错误码参考</a>。</p>
</div></template>


