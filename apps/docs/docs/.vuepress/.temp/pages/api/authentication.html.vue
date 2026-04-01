<template><div><h1 id="鉴权与签名" tabindex="-1">鉴权与签名 <a class="header-anchor" href="#鉴权与签名">¶</a></h1>
<p>所有开放 API 请求需通过 HMAC-SHA256 签名进行身份验证。</p>
<h2 id="签名算法" tabindex="-1">签名算法 <a class="header-anchor" href="#签名算法">¶</a></h2>
<table>
<thead>
<tr>
<th>项目</th>
<th>说明</th>
</tr>
</thead>
<tbody>
<tr>
<td>算法</td>
<td>HMAC-SHA256</td>
</tr>
<tr>
<td>签名函数</td>
<td><code v-pre>hash_hmac('sha256', payload, app_secret)</code></td>
</tr>
<tr>
<td>签名结果</td>
<td>Hex 编码（小写）</td>
</tr>
</tbody>
</table>
<h2 id="payload-规范" tabindex="-1">Payload 规范 <a class="header-anchor" href="#payload-规范">¶</a></h2>
<ul>
<li>payload 为<strong>原始 JSON 字符串</strong></li>
<li>JSON <strong>不进行排序</strong></li>
<li><strong>不进行格式化</strong>（不 pretty print）</li>
<li><strong>不进行</strong> urlencode</li>
<li>推荐使用压缩后的单行 JSON</li>
</ul>
<div class="hint-container warning">
<p class="hint-container-title">重要</p>
<p>JSON 字段顺序、空格、换行必须与签名时完全一致。签名放在请求头 <code v-pre>x-chat-signature</code> 中。</p>
</div>
<h2 id="代码示例" tabindex="-1">代码示例 <a class="header-anchor" href="#代码示例">¶</a></h2>
<h3 id="php" tabindex="-1">PHP <a class="header-anchor" href="#php">¶</a></h3>
<div class="language-php line-numbers-mode" data-highlighter="prismjs" data-ext="php" data-title="php"><pre v-pre><code><span class="line"><span class="token php language-php"><span class="token delimiter important">&lt;?php</span></span>
<span class="line"><span class="token variable">$payload</span> <span class="token operator">=</span></span>
<span class="line"><span class="token string single-quoted-string">'{"appid":"1b621280becdb0fa3d3e041ff69e1e1f","sbs":"1001","timestamp":1767772879,"ranstr":"4ad0faec14a58112","kefu_id":"10078","ip":""}'</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token variable">$appSecret</span> <span class="token operator">=</span> <span class="token string single-quoted-string">'YOUR_APP_SECRET'</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token variable">$sign</span> <span class="token operator">=</span> <span class="token function">hash_hmac</span><span class="token punctuation">(</span><span class="token string single-quoted-string">'sha256'</span><span class="token punctuation">,</span> <span class="token variable">$payload</span><span class="token punctuation">,</span> <span class="token variable">$appSecret</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token keyword">echo</span> <span class="token variable">$sign</span><span class="token punctuation">;</span></span>
<span class="line"></span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="python-3" tabindex="-1">Python 3 <a class="header-anchor" href="#python-3">¶</a></h3>
<div class="language-python line-numbers-mode" data-highlighter="prismjs" data-ext="py" data-title="py"><pre v-pre><code><span class="line"><span class="token keyword">import</span> hmac</span>
<span class="line"><span class="token keyword">import</span> hashlib</span>
<span class="line"></span>
<span class="line">payload <span class="token operator">=</span> <span class="token string">'{"appid":"1b621280becdb0fa3d3e041ff69e1e1f","sbs":"1001","timestamp":1767772879,"ranstr":"4ad0faec14a58112","kefu_id":"10078","ip":""}'</span></span>
<span class="line">app_secret <span class="token operator">=</span> <span class="token string">'YOUR_APP_SECRET'</span></span>
<span class="line"></span>
<span class="line">sign <span class="token operator">=</span> hmac<span class="token punctuation">.</span>new<span class="token punctuation">(</span></span>
<span class="line">    app_secret<span class="token punctuation">.</span>encode<span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span></span>
<span class="line">    payload<span class="token punctuation">.</span>encode<span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span></span>
<span class="line">    hashlib<span class="token punctuation">.</span>sha256</span>
<span class="line"><span class="token punctuation">)</span><span class="token punctuation">.</span>hexdigest<span class="token punctuation">(</span><span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">print</span><span class="token punctuation">(</span>sign<span class="token punctuation">)</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="go" tabindex="-1">Go <a class="header-anchor" href="#go">¶</a></h3>
<div class="language-go line-numbers-mode" data-highlighter="prismjs" data-ext="go" data-title="go"><pre v-pre><code><span class="line"><span class="token keyword">package</span> main</span>
<span class="line"></span>
<span class="line"><span class="token keyword">import</span> <span class="token punctuation">(</span></span>
<span class="line">    <span class="token string">"crypto/hmac"</span></span>
<span class="line">    <span class="token string">"crypto/sha256"</span></span>
<span class="line">    <span class="token string">"encoding/hex"</span></span>
<span class="line">    <span class="token string">"fmt"</span></span>
<span class="line"><span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">func</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">    payload <span class="token operator">:=</span> <span class="token string">`{"appid":"1b621280becdb0fa3d3e041ff69e1e1f","sbs":"1001","timestamp":1767772879,"ranstr":"4ad0faec14a58112","kefu_id":"10078","ip":""}`</span></span>
<span class="line">    appSecret <span class="token operator">:=</span> <span class="token string">"YOUR_APP_SECRET"</span></span>
<span class="line"></span>
<span class="line">    mac <span class="token operator">:=</span> hmac<span class="token punctuation">.</span><span class="token function">New</span><span class="token punctuation">(</span>sha256<span class="token punctuation">.</span>New<span class="token punctuation">,</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token function">byte</span><span class="token punctuation">(</span>appSecret<span class="token punctuation">)</span><span class="token punctuation">)</span></span>
<span class="line">    mac<span class="token punctuation">.</span><span class="token function">Write</span><span class="token punctuation">(</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token function">byte</span><span class="token punctuation">(</span>payload<span class="token punctuation">)</span><span class="token punctuation">)</span></span>
<span class="line">    sign <span class="token operator">:=</span> hex<span class="token punctuation">.</span><span class="token function">EncodeToString</span><span class="token punctuation">(</span>mac<span class="token punctuation">.</span><span class="token function">Sum</span><span class="token punctuation">(</span><span class="token boolean">nil</span><span class="token punctuation">)</span><span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line">    fmt<span class="token punctuation">.</span><span class="token function">Println</span><span class="token punctuation">(</span>sign<span class="token punctuation">)</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="java-jdk-8" tabindex="-1">Java (JDK 8+) <a class="header-anchor" href="#java-jdk-8">¶</a></h3>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java" data-title="java"><pre v-pre><code><span class="line"><span class="token keyword">import</span> <span class="token import"><span class="token namespace">javax<span class="token punctuation">.</span>crypto<span class="token punctuation">.</span></span><span class="token class-name">Mac</span></span><span class="token punctuation">;</span></span>
<span class="line"><span class="token keyword">import</span> <span class="token import"><span class="token namespace">javax<span class="token punctuation">.</span>crypto<span class="token punctuation">.</span>spec<span class="token punctuation">.</span></span><span class="token class-name">SecretKeySpec</span></span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">SignExample</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token class-name">String</span><span class="token punctuation">[</span><span class="token punctuation">]</span> args<span class="token punctuation">)</span> <span class="token keyword">throws</span> <span class="token class-name">Exception</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token class-name">String</span> payload <span class="token operator">=</span> <span class="token string">"{\"appid\":\"1b621280becdb0fa3d3e041ff69e1e1f\",\"sbs\":\"1001\",\"timestamp\":1767772879,\"ranstr\":\"4ad0faec14a58112\",\"kefu_id\":\"10078\",\"ip\":\"\"}"</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token class-name">String</span> appSecret <span class="token operator">=</span> <span class="token string">"YOUR_APP_SECRET"</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">        <span class="token class-name">Mac</span> mac <span class="token operator">=</span> <span class="token class-name">Mac</span><span class="token punctuation">.</span><span class="token function">getInstance</span><span class="token punctuation">(</span><span class="token string">"HmacSHA256"</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        mac<span class="token punctuation">.</span><span class="token function">init</span><span class="token punctuation">(</span><span class="token keyword">new</span> <span class="token class-name">SecretKeySpec</span><span class="token punctuation">(</span>appSecret<span class="token punctuation">.</span><span class="token function">getBytes</span><span class="token punctuation">(</span><span class="token string">"UTF-8"</span><span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token string">"HmacSHA256"</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token keyword">byte</span><span class="token punctuation">[</span><span class="token punctuation">]</span> hash <span class="token operator">=</span> mac<span class="token punctuation">.</span><span class="token function">doFinal</span><span class="token punctuation">(</span>payload<span class="token punctuation">.</span><span class="token function">getBytes</span><span class="token punctuation">(</span><span class="token string">"UTF-8"</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">        <span class="token class-name">StringBuilder</span> sb <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">StringBuilder</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">byte</span> b <span class="token operator">:</span> hash<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">            sb<span class="token punctuation">.</span><span class="token function">append</span><span class="token punctuation">(</span><span class="token class-name">String</span><span class="token punctuation">.</span><span class="token function">format</span><span class="token punctuation">(</span><span class="token string">"%02x"</span><span class="token punctuation">,</span> b<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line">        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span>sb<span class="token punctuation">.</span><span class="token function">toString</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="node-js" tabindex="-1">Node.js <a class="header-anchor" href="#node-js">¶</a></h3>
<div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre v-pre><code><span class="line"><span class="token keyword">const</span> crypto <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">'crypto'</span><span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">const</span> payload <span class="token operator">=</span> <span class="token string">'{"appid":"1b621280becdb0fa3d3e041ff69e1e1f","sbs":"1001","timestamp":1767772879,"ranstr":"4ad0faec14a58112","kefu_id":"10078","ip":""}'</span></span>
<span class="line"><span class="token keyword">const</span> appSecret <span class="token operator">=</span> <span class="token string">'YOUR_APP_SECRET'</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">const</span> sign <span class="token operator">=</span> crypto</span>
<span class="line">  <span class="token punctuation">.</span><span class="token function">createHmac</span><span class="token punctuation">(</span><span class="token string">'sha256'</span><span class="token punctuation">,</span> appSecret<span class="token punctuation">)</span></span>
<span class="line">  <span class="token punctuation">.</span><span class="token function">update</span><span class="token punctuation">(</span>payload<span class="token punctuation">)</span></span>
<span class="line">  <span class="token punctuation">.</span><span class="token function">digest</span><span class="token punctuation">(</span><span class="token string">'hex'</span><span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line">console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>sign<span class="token punctuation">)</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></div></template>


