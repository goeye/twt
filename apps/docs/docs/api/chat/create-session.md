# 创建单聊

> **POST** `https://apichat.twt.com/openapi/zxlt/fqlt_dl` -- 需要签名鉴权

创建一个单聊会话。

## 请求

```
POST https://apichat.twt.com/openapi/zxlt/fqlt_dl
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
| `sbs` | string | 是 | 客户标识，用户唯一标识，1-64 字符 |
| `timestamp` | integer | 是 | 发起请求的时间戳 |
| `ranstr` | string | 是 | 随机字符串 |
| `kefu_id` | string | 是 | 客服 ID，客服端-团队-客服列表查看 |
| `ip` | string | 否 | 用户 IP，可在客户详情查看该客户 IP 信息 |
| `sbs_mc` | string | 否 | 访客姓名，客户姓名，1-30 字符，如果为空系统生成 |
| `content` | string | 否 | 单聊创建成功后发送的消息内容，1-2000 字符 |
| `kefu_show_chat` | string | 否 | 客服是否显示会话。1 是，0 否（默认 0）。该参数只有在生成新会话时才有效，如果是已存在的单聊，则默认按 1 的逻辑处理 |

### 请求示例

```bash
curl -X POST 'https://apichat.twt.com/openapi/zxlt/fqlt_dl' \
-H 'x-chat-signature: 4ecdcaf813c422d34413671b2ed68e0a6e69ea8496d34ab40bd33cef26571e70' \
-H 'Content-Type: application/json' \
-d '{
    "appid": "1b621280becdb0fa3d3e041ff69e1e1f",
    "sbs": "user_1001",
    "timestamp": 1712899200,
    "ranstr": "4ad0faec14a58112",
    "kefu_id": "10078",
    "ip": "203.0.113.1",
    "sbs_mc": "张三",
    "content": "你好，我想咨询一下产品功能"
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
  "msg": "appid不存在",
  "data": ""
}
```
