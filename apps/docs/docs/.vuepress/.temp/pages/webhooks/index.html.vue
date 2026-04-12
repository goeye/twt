<template><div><h1 id="webhooks" tabindex="-1">Webhooks <a class="header-anchor" href="#webhooks">#</a></h1>
<p>通过 Webhook 将 TWT Chat 平台的事件实时推送至你的外部服务，实现业务流程自动化。</p>
<h2 id="工作原理" tabindex="-1">工作原理 <a class="header-anchor" href="#工作原理">#</a></h2>
<p>当特定事件发生时（如访客消息超时未回复），TWT Chat 会向你配置的 URL 发送 HTTP POST 请求，请求体中包含事件详情。</p>
<h2 id="文档目录" tabindex="-1">文档目录 <a class="header-anchor" href="#文档目录">#</a></h2>
<ul>
<li><a href="./setup">配置指南</a> — 设置 Webhook URL 和事件订阅</li>
<li><a href="./signature">签名校验</a> — 验证请求来源，确保安全</li>
<li><a href="./events">事件类型</a> — 支持的事件类型及触发条件</li>
<li><a href="./payload">请求体结构</a> — 请求头和请求体的字段说明</li>
</ul>
</div></template>


