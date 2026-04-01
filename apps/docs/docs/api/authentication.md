# 鉴权与签名

所有开放 API 请求需通过 HMAC-SHA256 签名进行身份验证。

## 签名算法

| 项目 | 说明 |
| --- | --- |
| 算法 | HMAC-SHA256 |
| 签名函数 | `hash_hmac('sha256', payload, app_secret)` |
| 签名结果 | Hex 编码（小写） |

## Payload 规范

- payload 为**原始 JSON 字符串**
- JSON **不进行排序**
- **不进行格式化**（不 pretty print）
- **不进行** urlencode
- 推荐使用压缩后的单行 JSON

::: warning 重要
JSON 字段顺序、空格、换行必须与签名时完全一致。签名放在请求头 `x-chat-signature` 中。
:::

## 代码示例

### PHP

```php
<?php
$payload =
'{"appid":"1b621280becdb0fa3d3e041ff69e1e1f","sbs":"1001","timestamp":1767772879,"ranstr":"4ad0faec14a58112","kefu_id":"10078","ip":""}';
$appSecret = 'YOUR_APP_SECRET';
$sign = hash_hmac('sha256', $payload, $appSecret);
echo $sign;
```

### Python 3

```python
import hmac
import hashlib

payload = '{"appid":"1b621280becdb0fa3d3e041ff69e1e1f","sbs":"1001","timestamp":1767772879,"ranstr":"4ad0faec14a58112","kefu_id":"10078","ip":""}'
app_secret = 'YOUR_APP_SECRET'

sign = hmac.new(
    app_secret.encode(),
    payload.encode(),
    hashlib.sha256
).hexdigest()

print(sign)
```

### Go

```go
package main

import (
    "crypto/hmac"
    "crypto/sha256"
    "encoding/hex"
    "fmt"
)

func main() {
    payload := `{"appid":"1b621280becdb0fa3d3e041ff69e1e1f","sbs":"1001","timestamp":1767772879,"ranstr":"4ad0faec14a58112","kefu_id":"10078","ip":""}`
    appSecret := "YOUR_APP_SECRET"

    mac := hmac.New(sha256.New, []byte(appSecret))
    mac.Write([]byte(payload))
    sign := hex.EncodeToString(mac.Sum(nil))

    fmt.Println(sign)
}
```

### Java (JDK 8+)

```java
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

public class SignExample {
    public static void main(String[] args) throws Exception {
        String payload = "{\"appid\":\"1b621280becdb0fa3d3e041ff69e1e1f\",\"sbs\":\"1001\",\"timestamp\":1767772879,\"ranstr\":\"4ad0faec14a58112\",\"kefu_id\":\"10078\",\"ip\":\"\"}";
        String appSecret = "YOUR_APP_SECRET";

        Mac mac = Mac.getInstance("HmacSHA256");
        mac.init(new SecretKeySpec(appSecret.getBytes("UTF-8"), "HmacSHA256"));
        byte[] hash = mac.doFinal(payload.getBytes("UTF-8"));

        StringBuilder sb = new StringBuilder();
        for (byte b : hash) {
            sb.append(String.format("%02x", b));
        }
        System.out.println(sb.toString());
    }
}
```

### Node.js

```javascript
const crypto = require('crypto')

const payload = '{"appid":"1b621280becdb0fa3d3e041ff69e1e1f","sbs":"1001","timestamp":1767772879,"ranstr":"4ad0faec14a58112","kefu_id":"10078","ip":""}'
const appSecret = 'YOUR_APP_SECRET'

const sign = crypto
  .createHmac('sha256', appSecret)
  .update(payload)
  .digest('hex')

console.log(sign)
```
