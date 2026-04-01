# 签名校验

每个 Webhook 请求都携带签名，你应在接收端验证签名以确保请求来自 TWT Chat。

## 签名算法

- **算法**：HMAC-SHA256
- **密钥**：你的 AppSecret
- **签名对象**：请求体原文（raw body）
- **签名结果**：Hex 编码（小写）

签名值通过请求头 `X-Chat-Signature` 传递。

## 校验流程

1. 从请求头中获取 `X-Chat-Signature` 的值
2. 使用 AppSecret 对请求体原文进行 HMAC-SHA256 计算
3. 将计算结果（Hex 小写）与 `X-Chat-Signature` 比较
4. 一致则验证通过，否则拒绝该请求

## 代码示例

### PHP

```php
<?php
$rawBody = file_get_contents('php://input');
$appSecret = 'YOUR_APP_SECRET';
$signature = hash_hmac('sha256', $rawBody, $appSecret);

$headerSignature = $_SERVER['HTTP_X_CHAT_SIGNATURE'] ?? '';

if (hash_equals($signature, $headerSignature)) {
    // 验证通过
} else {
    // 验证失败，拒绝请求
    http_response_code(403);
    exit;
}
```

### Python 3

```python
import hmac
import hashlib

raw_body = request.get_data(as_text=True)
app_secret = 'YOUR_APP_SECRET'

signature = hmac.new(
    app_secret.encode(),
    raw_body.encode(),
    hashlib.sha256
).hexdigest()

header_signature = request.headers.get('X-Chat-Signature', '')

if hmac.compare_digest(signature, header_signature):
    # 验证通过
    pass
else:
    # 验证失败
    abort(403)
```

### Node.js

```javascript
const crypto = require('crypto')

const rawBody = req.body // 需要原始字符串，非解析后的对象
const appSecret = 'YOUR_APP_SECRET'

const signature = crypto
  .createHmac('sha256', appSecret)
  .update(rawBody)
  .digest('hex')

const headerSignature = req.headers['x-chat-signature'] || ''

if (signature === headerSignature) {
  // 验证通过
} else {
  // 验证失败
  res.status(403).end()
}
```

### Go

```go
import (
    "crypto/hmac"
    "crypto/sha256"
    "encoding/hex"
)

func verifySignature(rawBody []byte, appSecret, headerSignature string) bool {
    mac := hmac.New(sha256.New, []byte(appSecret))
    mac.Write(rawBody)
    expected := hex.EncodeToString(mac.Sum(nil))
    return hmac.Equal([]byte(expected), []byte(headerSignature))
}
```

### Java (JDK 8+)

```java
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

String rawBody = // 获取请求体原文
String appSecret = "YOUR_APP_SECRET";

Mac mac = Mac.getInstance("HmacSHA256");
mac.init(new SecretKeySpec(appSecret.getBytes("UTF-8"), "HmacSHA256"));
byte[] hash = mac.doFinal(rawBody.getBytes("UTF-8"));

StringBuilder sb = new StringBuilder();
for (byte b : hash) {
    sb.append(String.format("%02x", b));
}
String signature = sb.toString();

// 与请求头中的 X-Chat-Signature 比较
```
