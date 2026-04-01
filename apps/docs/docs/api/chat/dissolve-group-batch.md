# 批量解散群聊

一次解散多个群聊。

## 请求

```
POST https://apichat.twt.com/openapi/zxlt/js_zxlt_ql_batch
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
| `chat_ids` | array[integer] | 是 | 群聊 ID 列表 |

### 请求示例

```bash
curl --location --request POST 'https://apichat.twt.com/openapi/zxlt/js_zxlt_ql_batch' \
--header 'x-chat-signature: 7ac03ccc306902234f3b40cbe797fcb0f' \
--header 'Accept: application/json' \
--header 'Content-Type: application/json' \
--data-raw '{
    "appid": "string",
    "timestamp": 1769072367,
    "ranstr": "string",
    "chat_ids": [
        0
    ]
}'
```

## 返回响应

### 200 成功

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `code` | integer | 是 | 1 正常，-1 失败 |
| `msg` | string | 是 | 失败时的错误信息 |
| `data` | string | 是 | 返回数据 |

```json
{
  "code": 1,
  "msg": "ok",
  "data": ""
}
```
