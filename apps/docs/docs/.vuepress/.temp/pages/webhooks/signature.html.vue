<template><div><h1 id="签名校验" tabindex="-1">签名校验</h1>
<p>每个 Webhook 请求都携带签名，你应在接收端验证签名以确保请求来自 TWT Chat。</p>
<h2 id="签名算法" tabindex="-1">签名算法</h2>
<ul>
<li><strong>算法</strong>：HMAC-SHA256</li>
<li><strong>密钥</strong>：你的 AppSecret</li>
<li><strong>签名对象</strong>：请求体原文（raw body）</li>
<li><strong>签名结果</strong>：Hex 编码（小写）</li>
</ul>
<p>签名值通过请求头 <code v-pre>X-Chat-Signature</code> 传递。</p>
<h2 id="校验流程" tabindex="-1">校验流程</h2>
<ol>
<li>从请求头中获取 <code v-pre>X-Chat-Signature</code> 的值</li>
<li>使用 AppSecret 对请求体原文进行 HMAC-SHA256 计算</li>
<li>将计算结果（Hex 小写）与 <code v-pre>X-Chat-Signature</code> 比较</li>
<li>一致则验证通过，否则拒绝该请求</li>
</ol>
<h2 id="代码示例" tabindex="-1">代码示例</h2>
<h3 id="php" tabindex="-1">PHP</h3>
<div class="language-php line-numbers-mode" data-highlighter="prismjs" data-ext="php" data-title="php"><pre v-pre><code><span class="line"><span class="token php language-php"><span class="token delimiter important">&lt;?php</span></span>
<span class="line"><span class="token variable">$rawBody</span> <span class="token operator">=</span> <span class="token function">file_get_contents</span><span class="token punctuation">(</span><span class="token string single-quoted-string">'php://input'</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token variable">$appSecret</span> <span class="token operator">=</span> <span class="token string single-quoted-string">'YOUR_APP_SECRET'</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token variable">$signature</span> <span class="token operator">=</span> <span class="token function">hash_hmac</span><span class="token punctuation">(</span><span class="token string single-quoted-string">'sha256'</span><span class="token punctuation">,</span> <span class="token variable">$rawBody</span><span class="token punctuation">,</span> <span class="token variable">$appSecret</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line"><span class="token variable">$headerSignature</span> <span class="token operator">=</span> <span class="token variable">$_SERVER</span><span class="token punctuation">[</span><span class="token string single-quoted-string">'HTTP_X_CHAT_SIGNATURE'</span><span class="token punctuation">]</span> <span class="token operator">??</span> <span class="token string single-quoted-string">''</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token function">hash_equals</span><span class="token punctuation">(</span><span class="token variable">$signature</span><span class="token punctuation">,</span> <span class="token variable">$headerSignature</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token comment">// 验证通过</span></span>
<span class="line"><span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token comment">// 验证失败，拒绝请求</span></span>
<span class="line">    <span class="token function">http_response_code</span><span class="token punctuation">(</span><span class="token number">403</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token keyword">exit</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="python-3" tabindex="-1">Python 3</h3>
<div class="language-python line-numbers-mode" data-highlighter="prismjs" data-ext="py" data-title="py"><pre v-pre><code><span class="line"><span class="token keyword">import</span> hmac</span>
<span class="line"><span class="token keyword">import</span> hashlib</span>
<span class="line"></span>
<span class="line">raw_body <span class="token operator">=</span> request<span class="token punctuation">.</span>get_data<span class="token punctuation">(</span>as_text<span class="token operator">=</span><span class="token boolean">True</span><span class="token punctuation">)</span></span>
<span class="line">app_secret <span class="token operator">=</span> <span class="token string">'YOUR_APP_SECRET'</span></span>
<span class="line"></span>
<span class="line">signature <span class="token operator">=</span> hmac<span class="token punctuation">.</span>new<span class="token punctuation">(</span></span>
<span class="line">    app_secret<span class="token punctuation">.</span>encode<span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span></span>
<span class="line">    raw_body<span class="token punctuation">.</span>encode<span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span></span>
<span class="line">    hashlib<span class="token punctuation">.</span>sha256</span>
<span class="line"><span class="token punctuation">)</span><span class="token punctuation">.</span>hexdigest<span class="token punctuation">(</span><span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line">header_signature <span class="token operator">=</span> request<span class="token punctuation">.</span>headers<span class="token punctuation">.</span>get<span class="token punctuation">(</span><span class="token string">'X-Chat-Signature'</span><span class="token punctuation">,</span> <span class="token string">''</span><span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">if</span> hmac<span class="token punctuation">.</span>compare_digest<span class="token punctuation">(</span>signature<span class="token punctuation">,</span> header_signature<span class="token punctuation">)</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token comment"># 验证通过</span></span>
<span class="line">    <span class="token keyword">pass</span></span>
<span class="line"><span class="token keyword">else</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token comment"># 验证失败</span></span>
<span class="line">    abort<span class="token punctuation">(</span><span class="token number">403</span><span class="token punctuation">)</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="node-js" tabindex="-1">Node.js</h3>
<div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre v-pre><code><span class="line"><span class="token keyword">const</span> crypto <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">'crypto'</span><span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">const</span> rawBody <span class="token operator">=</span> req<span class="token punctuation">.</span>body <span class="token comment">// 需要原始字符串，非解析后的对象</span></span>
<span class="line"><span class="token keyword">const</span> appSecret <span class="token operator">=</span> <span class="token string">'YOUR_APP_SECRET'</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">const</span> signature <span class="token operator">=</span> crypto</span>
<span class="line">  <span class="token punctuation">.</span><span class="token function">createHmac</span><span class="token punctuation">(</span><span class="token string">'sha256'</span><span class="token punctuation">,</span> appSecret<span class="token punctuation">)</span></span>
<span class="line">  <span class="token punctuation">.</span><span class="token function">update</span><span class="token punctuation">(</span>rawBody<span class="token punctuation">)</span></span>
<span class="line">  <span class="token punctuation">.</span><span class="token function">digest</span><span class="token punctuation">(</span><span class="token string">'hex'</span><span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">const</span> headerSignature <span class="token operator">=</span> req<span class="token punctuation">.</span>headers<span class="token punctuation">[</span><span class="token string">'x-chat-signature'</span><span class="token punctuation">]</span> <span class="token operator">||</span> <span class="token string">''</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">if</span> <span class="token punctuation">(</span>signature <span class="token operator">===</span> headerSignature<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">  <span class="token comment">// 验证通过</span></span>
<span class="line"><span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span></span>
<span class="line">  <span class="token comment">// 验证失败</span></span>
<span class="line">  res<span class="token punctuation">.</span><span class="token function">status</span><span class="token punctuation">(</span><span class="token number">403</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">end</span><span class="token punctuation">(</span><span class="token punctuation">)</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="go" tabindex="-1">Go</h3>
<div class="language-go line-numbers-mode" data-highlighter="prismjs" data-ext="go" data-title="go"><pre v-pre><code><span class="line"><span class="token keyword">import</span> <span class="token punctuation">(</span></span>
<span class="line">    <span class="token string">"crypto/hmac"</span></span>
<span class="line">    <span class="token string">"crypto/sha256"</span></span>
<span class="line">    <span class="token string">"encoding/hex"</span></span>
<span class="line"><span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">func</span> <span class="token function">verifySignature</span><span class="token punctuation">(</span>rawBody <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token builtin">byte</span><span class="token punctuation">,</span> appSecret<span class="token punctuation">,</span> headerSignature <span class="token builtin">string</span><span class="token punctuation">)</span> <span class="token builtin">bool</span> <span class="token punctuation">{</span></span>
<span class="line">    mac <span class="token operator">:=</span> hmac<span class="token punctuation">.</span><span class="token function">New</span><span class="token punctuation">(</span>sha256<span class="token punctuation">.</span>New<span class="token punctuation">,</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token function">byte</span><span class="token punctuation">(</span>appSecret<span class="token punctuation">)</span><span class="token punctuation">)</span></span>
<span class="line">    mac<span class="token punctuation">.</span><span class="token function">Write</span><span class="token punctuation">(</span>rawBody<span class="token punctuation">)</span></span>
<span class="line">    expected <span class="token operator">:=</span> hex<span class="token punctuation">.</span><span class="token function">EncodeToString</span><span class="token punctuation">(</span>mac<span class="token punctuation">.</span><span class="token function">Sum</span><span class="token punctuation">(</span><span class="token boolean">nil</span><span class="token punctuation">)</span><span class="token punctuation">)</span></span>
<span class="line">    <span class="token keyword">return</span> hmac<span class="token punctuation">.</span><span class="token function">Equal</span><span class="token punctuation">(</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token function">byte</span><span class="token punctuation">(</span>expected<span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token function">byte</span><span class="token punctuation">(</span>headerSignature<span class="token punctuation">)</span><span class="token punctuation">)</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="java-jdk-8" tabindex="-1">Java (JDK 8+)</h3>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java" data-title="java"><pre v-pre><code><span class="line"><span class="token keyword">import</span> <span class="token import"><span class="token namespace">javax<span class="token punctuation">.</span>crypto<span class="token punctuation">.</span></span><span class="token class-name">Mac</span></span><span class="token punctuation">;</span></span>
<span class="line"><span class="token keyword">import</span> <span class="token import"><span class="token namespace">javax<span class="token punctuation">.</span>crypto<span class="token punctuation">.</span>spec<span class="token punctuation">.</span></span><span class="token class-name">SecretKeySpec</span></span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line"><span class="token class-name">String</span> rawBody <span class="token operator">=</span> <span class="token comment">// 获取请求体原文</span></span>
<span class="line"><span class="token class-name">String</span> appSecret <span class="token operator">=</span> <span class="token string">"YOUR_APP_SECRET"</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line"><span class="token class-name">Mac</span> mac <span class="token operator">=</span> <span class="token class-name">Mac</span><span class="token punctuation">.</span><span class="token function">getInstance</span><span class="token punctuation">(</span><span class="token string">"HmacSHA256"</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">mac<span class="token punctuation">.</span><span class="token function">init</span><span class="token punctuation">(</span><span class="token keyword">new</span> <span class="token class-name">SecretKeySpec</span><span class="token punctuation">(</span>appSecret<span class="token punctuation">.</span><span class="token function">getBytes</span><span class="token punctuation">(</span><span class="token string">"UTF-8"</span><span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token string">"HmacSHA256"</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token keyword">byte</span><span class="token punctuation">[</span><span class="token punctuation">]</span> hash <span class="token operator">=</span> mac<span class="token punctuation">.</span><span class="token function">doFinal</span><span class="token punctuation">(</span>rawBody<span class="token punctuation">.</span><span class="token function">getBytes</span><span class="token punctuation">(</span><span class="token string">"UTF-8"</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line"><span class="token class-name">StringBuilder</span> sb <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">StringBuilder</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">byte</span> b <span class="token operator">:</span> hash<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">    sb<span class="token punctuation">.</span><span class="token function">append</span><span class="token punctuation">(</span><span class="token class-name">String</span><span class="token punctuation">.</span><span class="token function">format</span><span class="token punctuation">(</span><span class="token string">"%02x"</span><span class="token punctuation">,</span> b<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"><span class="token class-name">String</span> signature <span class="token operator">=</span> sb<span class="token punctuation">.</span><span class="token function">toString</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line"><span class="token comment">// 与请求头中的 X-Chat-Signature 比较</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></div></template>


