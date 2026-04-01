<template><div><h1 id="url-参数说明" tabindex="-1">URL 参数说明 <a class="header-anchor" href="#url-参数说明">¶</a></h1>
<p>通过 URL 参数可以自定义聊天页面的语言，以及将你系统中的客户信息同步到 TWT Chat。</p>
<h2 id="语言参数" tabindex="-1">语言参数 <a class="header-anchor" href="#语言参数">¶</a></h2>
<p>在链接末尾追加 <code v-pre>?lang=</code> 参数切换界面语言：</p>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text" data-title="text"><pre v-pre><code><span class="line">https://visitorchat.twt.com/direct/{你的APPID}?lang=en</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><table>
<thead>
<tr>
<th>代码</th>
<th>语言</th>
</tr>
</thead>
<tbody>
<tr>
<td><code v-pre>zh-cn</code></td>
<td>简体中文（默认）</td>
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
<h2 id="客户信息参数" tabindex="-1">客户信息参数 <a class="header-anchor" href="#客户信息参数">¶</a></h2>
<p>将内部系统的客户信息传入聊天页面，客服可在工作台中查看访客的身份信息。</p>
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
<td><code v-pre>sbs</code></td>
<td>string</td>
<td>用户唯一标识</td>
</tr>
<tr>
<td><code v-pre>sbs_mm</code></td>
<td>string</td>
<td>用户签名</td>
</tr>
<tr>
<td><code v-pre>ranstr</code></td>
<td>string</td>
<td>随机字符串（建议 16 位以上）</td>
</tr>
<tr>
<td><code v-pre>name</code></td>
<td>string</td>
<td>用户姓名</td>
</tr>
<tr>
<td><code v-pre>nickname</code></td>
<td>string</td>
<td>用户备注名</td>
</tr>
<tr>
<td><code v-pre>email</code></td>
<td>string</td>
<td>用户邮箱</td>
</tr>
<tr>
<td><code v-pre>phone</code></td>
<td>string</td>
<td>用户电话</td>
</tr>
</tbody>
</table>
<h3 id="sbs-mm-生成规则" tabindex="-1">sbs_mm 生成规则 <a class="header-anchor" href="#sbs-mm-生成规则">¶</a></h3>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text" data-title="text"><pre v-pre><code><span class="line">sbs_mm = md5( md5(sbs + '_' + AppSecret) + '_' + ranstr )</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><ul>
<li>MD5 结果为<strong>小写 32 位</strong></li>
<li><code v-pre>AppSecret</code> 是生成 <code v-pre>sbs_mm</code> 的必要参数，请在 <strong>开发设置</strong> 中生成，并妥善保存，避免泄露</li>
</ul>
<h3 id="完整示例" tabindex="-1">完整示例 <a class="header-anchor" href="#完整示例">¶</a></h3>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text" data-title="text"><pre v-pre><code><span class="line">https://visitorchat.twt.com/direct/8cba81d468aac01b4f15f8ea4ef33677?sbs={sbs}&amp;sbs_mm={sbs_mm}&amp;ranstr={ranstr}&amp;name={name}&amp;nickname={nickname}&amp;email={email}&amp;phone={phone}</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><div class="hint-container caution">
<p class="hint-container-title">安全警告</p>
<p><code v-pre>sbs_mm</code> 签名必须在服务端生成，切勿将 <code v-pre>AppSecret</code> 暴露到前端代码或 URL 中。</p>
</div>
</div></template>


