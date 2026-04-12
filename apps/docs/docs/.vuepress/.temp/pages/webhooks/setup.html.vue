<template><div><h1 id="配置指南" tabindex="-1">配置指南 <a class="header-anchor" href="#配置指南">#</a></h1>
<p>在 TWT Chat 后台配置 Webhook，接收平台事件推送。</p>
<h2 id="前置条件" tabindex="-1">前置条件 <a class="header-anchor" href="#前置条件">#</a></h2>
<ol>
<li>在 <strong>开发设置</strong> 中生成 <code v-pre>AppSecret</code>（用于签名校验）</li>
<li>准备一个可公网访问的 HTTPS 接收地址</li>
</ol>
<h2 id="配置步骤" tabindex="-1">配置步骤 <a class="header-anchor" href="#配置步骤">#</a></h2>
<h3 id="_1-生成-appsecret" tabindex="-1">1. 生成 AppSecret <a class="header-anchor" href="#_1-生成-appsecret">#</a></h3>
<p>进入 <strong>设置 &gt; 开发设置</strong>，生成 AppSecret。此密钥用于对 Webhook 请求进行签名校验。</p>
<div class="hint-container warning">
<p class="hint-container-title">重要</p>
<p>请妥善保管 AppSecret，不要泄露到前端代码或公共仓库中。</p>
</div>
<h3 id="_2-填写-webhook-url" tabindex="-1">2. 填写 Webhook URL <a class="header-anchor" href="#_2-填写-webhook-url">#</a></h3>
<p>进入 <strong>设置 &gt; Webhooks</strong> 页面，输入接收事件通知的 URL 地址，点击「保存」。</p>
<div class="hint-container tip">
<p class="hint-container-title">注意</p>
<p>保存 URL 前需先完成签名校验配置，否则无法保存。</p>
</div>
<h3 id="_3-订阅事件" tabindex="-1">3. 订阅事件 <a class="header-anchor" href="#_3-订阅事件">#</a></h3>
<p>在 Webhooks 页面选择需要接收的事件类型，开启对应的开关。</p>
<p>当前支持的事件详见 <a href="./events">事件类型</a>。</p>
</div></template>


