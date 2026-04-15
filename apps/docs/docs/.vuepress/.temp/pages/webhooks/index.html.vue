<template><div><h1 id="webhooks" tabindex="-1">Webhooks <a class="header-anchor" href="#webhooks">#</a></h1>
<p>将 TWT Chat 平台的事件实时推送至你的外部服务，实现业务流程自动化。</p>
<h2 id="能做什么" tabindex="-1">能做什么 <a class="header-anchor" href="#能做什么">#</a></h2>
<ul>
<li>实时接收聊天事件（如访客消息超时未回复、新会话创建等）</li>
<li>验证请求签名，确保推送来源可信</li>
<li>订阅指定事件类型，过滤无关通知</li>
</ul>
<h2 id="怎么做" tabindex="-1">怎么做 <a class="header-anchor" href="#怎么做">#</a></h2>
<ol>
<li><a href="./setup">配置指南</a> — 在后台设置 Webhook URL 和事件订阅</li>
<li><a href="./signature">签名校验</a> — 验证每条推送请求的来源</li>
<li><a href="./events">事件类型</a> — 查看支持的事件及触发条件</li>
<li><a href="./payload">请求体结构</a> — 解析推送请求的字段格式</li>
</ol>
<h2 id="能获得什么" tabindex="-1">能获得什么 <a class="header-anchor" href="#能获得什么">#</a></h2>
<ul>
<li>聊天事件驱动 CRM 更新、工单创建、消息通知等业务流程</li>
<li>无需轮询，事件发生时立即触发你的服务</li>
<li>与现有业务系统低耦合集成</li>
</ul>
</div></template>


