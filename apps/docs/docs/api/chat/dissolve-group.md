# 解散群聊

> **POST** `https://apichat.twt.com/openapi/zxlt/js_zxlt_ql` -- 需要签名鉴权

解散一个群聊。

## 请求

```
POST https://apichat.twt.com/openapi/zxlt/js_zxlt_ql
```

### Header 参数

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `x-chat-signature` | string | 是 | HMAC-SHA256 签名 |
| `Accept` | string | 否 | 默认值：`application/json` |
| `Content-Type` | string | 是 | `application/json` |

### Body 参数

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `appid` | string | 是 | 应用标识，客服端-设置-开发设置查看 |
| `timestamp` | integer | 是 | 发起请求的时间戳 |
| `ranstr` | string | 是 | 随机字符串 |
| `chat_id` | integer | 是 | 群聊 ID |

### 请求示例

```bash
curl -X POST 'https://apichat.twt.com/openapi/zxlt/js_zxlt_ql' \
-H 'x-chat-signature: 4ecdcaf813c422d34413671b2ed68e0a6e69ea8496d34ab40bd33cef26571e70' \
-H 'Content-Type: application/json' \
-d '{
    "appid": "1b621280becdb0fa3d3e041ff69e1e1f",
    "timestamp": 1712899200,
    "ranstr": "4ad0faec14a58112",
    "chat_id": 1841
}'
```

## 返回响应

### 200 成功

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `code` | integer | 是 | 1 正常，-1 失败 |
| `msg` | string | 是 | 失败时的错误信息 |
| `data` | string | 是 | 返回数据 |

成功响应：

```json
{
  "code": 1,
  "msg": "ok",
  "data": ""
}
```

失败响应：

```json
{
  "code": -1,
  "msg": "群聊不存在",
  "data": ""
}
```
