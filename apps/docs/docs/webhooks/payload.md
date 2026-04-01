# 请求体结构

每个 Webhook 请求都遵循统一的结构规范。

## 请求头

每个 Webhook 请求至少包含以下两个请求头：

| 请求头 | 说明 | 示例 |
| --- | --- | --- |
| `Content-Type` | 内容类型 | `application/json` |
| `X-Chat-Signature` | HMAC-SHA256 签名 | `4ecdcaf813c422d34413671b2ed68e0a6e69ea8496d34ab40bd33cef26571e70` |

## 请求体

请求体为 JSON 格式，所有事件共享以下基础字段：

| 参数名 | 类型 | 说明 | 参数示例 |
| --- | --- | --- | --- |
| `created_at` | number | Webhook 发送日期（时间戳） | `1765439941` |
| `event` | string | 事件名称 | `UNREPLIED` |
| `webhook_id` | string | 唯一的 Webhook ID | `58946f5f583edd94f5cf87e3534d04fb` |
| `content` | array | 包含特定事件数据的对象 | — |

`content` 数组中的字段根据事件类型不同而不同，详见 [事件类型](./events)。

## 响应要求

你的接收端应在 **5 秒内** 返回 HTTP `200` 状态码，表示已成功接收。

如果返回非 200 状态码或超时，系统将进行重试。
