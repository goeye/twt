<template><div><h1 id="开放-api" tabindex="-1">开放 API <a class="header-anchor" href="#开放-api">#</a></h1>
<p>通过 REST API 与 TWT Chat 平台进行深度集成，管理会话、发送消息、同步客户数据。</p>
<h2 id="能做什么" tabindex="-1">能做什么 <a class="header-anchor" href="#能做什么">#</a></h2>
<ul>
<li>服务端创建单聊或群聊会话，支持批量操作</li>
<li>删除/解散会话，清理历史数据</li>
<li>通过 HMAC-SHA256 签名鉴权，保障接口安全</li>
</ul>
<h2 id="怎么做" tabindex="-1">怎么做 <a class="header-anchor" href="#怎么做">#</a></h2>
<ol>
<li><a href="./authentication">鉴权与签名</a> — 生成请求签名，所有接口必读</li>
<li>在线聊天接口 — <a href="/api/chat/create-session" target="_blank" rel="noopener noreferrer">创建单聊</a>、<a href="/api/chat/create-session-batch" target="_blank" rel="noopener noreferrer">批量创建</a>、<a href="/api/chat/create-group" target="_blank" rel="noopener noreferrer">创建群聊</a>、<a href="/api/chat/delete-session" target="_blank" rel="noopener noreferrer">删除/解散</a></li>
<li><a href="./error-codes">错误码参考</a> — 统一错误响应格式</li>
</ol>
<p><strong>Base URL：</strong> <code v-pre>https://apichat.twt.com</code>，HTTPS，JSON 格式。</p>
<h2 id="能获得什么" tabindex="-1">能获得什么 <a class="header-anchor" href="#能获得什么">#</a></h2>
<ul>
<li>将 TWT Chat 嵌入业务系统工作流，自动化会话管理</li>
<li>服务端主动发起会话，无需等待访客触发</li>
<li>与 CRM、工单系统深度集成</li>
</ul>
<div class="hint-container tip">
<p class="hint-container-title">还没有账号？</p>
<p><a href="https://twt.com" target="_blank" rel="noopener noreferrer">免费注册 TWT Chat</a> 获取 API Key，3 分钟完成接入。</p>
</div>
</div></template>


