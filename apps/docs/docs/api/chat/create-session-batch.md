# 创建单聊-批量

批量创建多个单聊会话。

## 请求

```
POST https://apichat.twt.com/openapi/zxlt/fqlt_dl_batch
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
| `u_info` | array[object] | 是 | 用户信息列表 |

#### u_info 对象字段

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `kefu_id` | integer | 是 | 客服 ID，客服端-团队-客服列表查看 |
| `sbs` | string | 是 | 客户标识，用户唯一标识，1-64 字符 |
| `sbs_mc` | string | 否 | 访客名称 |
| `content` | string | 否 | 单聊创建成功后发送的消息内容，1-2000 字符 |
| `kefu_show_chat` | integer | 否 | 客服是否显示会话。1 是，0 否（默认 0）。该参数只有在生成新会话时才有效，如果是已存在的单聊，则默认按 1 的逻辑处理 |

### 请求示例

```bash
curl --location --request POST 'https://apichat.twt.com/openapi/zxlt/fqlt_dl_batch' \
--header 'x-chat-signature: 7ac03ccc306902234f3b40cbe797fcb0f' \
--header 'Accept: application/json' \
--header 'Content-Type: application/json' \
--data-raw '{
    "appid": "string",
    "timestamp": 0,
    "ranstr": "string",
    "u_info": [
        {
            "kefu_id": 0,
            "sbs": "string",
            "content": "string"
        }
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
