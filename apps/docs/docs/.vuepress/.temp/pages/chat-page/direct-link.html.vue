<template><div><h1 id="直接链接" tabindex="-1">直接链接</h1>
<p>将聊天页面链接发给客户，打开即可开始对话。无需网站部署，适用于邮件、App、社交媒体等渠道。</p>
<h2 id="链接格式" tabindex="-1">链接格式</h2>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text" data-title="text"><pre v-pre><code><span class="line">https://visitorchat.twt.com/direct/{你的APPID}</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><h2 id="使用场景" tabindex="-1">使用场景</h2>
<ul>
<li><strong>邮件签名</strong>：在客服邮件底部附上聊天链接</li>
<li><strong>App 内嵌</strong>：通过 WebView 打开聊天页面</li>
<li><strong>社交媒体</strong>：在公众号菜单、微博简介等位置放置链接</li>
<li><strong>二维码</strong>：将链接生成二维码供线下扫码使用</li>
</ul>
<h2 id="自定义语言" tabindex="-1">自定义语言</h2>
<p>在链接末尾追加 <code v-pre>?lang=</code> 参数即可切换界面语言：</p>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text" data-title="text"><pre v-pre><code><span class="line">https://visitorchat.twt.com/direct/{你的APPID}?lang=en</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>支持的语言代码：</p>
<table>
<thead>
<tr>
<th>代码</th>
<th>语言</th>
</tr>
</thead>
<tbody>
<tr>
<td><code v-pre>zh-cn</code></td>
<td>简体中文</td>
</tr>
<tr>
<td><code v-pre>zh-tw</code></td>
<td>繁体中文</td>
</tr>
<tr>
<td><code v-pre>en</code></td>
<td>英文</td>
</tr>
</tbody>
</table>
</div></template>


