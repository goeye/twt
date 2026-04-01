# 创建群聊-批量

批量创建多个群聊会话。

## 请求

```
POST https://apichat.twt.com/openapi/zxlt/fqlt_ql_batch
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
| `u_info` | array[object] | 是 | 群聊信息列表 |

#### u_info 对象字段

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `item` | array[object] | 是 | 群成员列表 |
| `qlmc` | string | 否 | 群聊名称，1-30 字符 |
| `content` | string | 否 | 创建群聊后发送的一条消息，1-2000 字符 |

#### item 对象字段（群成员）

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `u_lx` | string | 是 | 用户类型 |
| `uid` | integer | 是 | 用户 ID |

### 请求示例

```bash
curl --location --request POST 'https://apichat.twt.com/openapi/zxlt/fqlt_ql_batch' \
--header 'x-chat-signature: 7ac03ccc306902234f3b40cbe797fcb0f' \
--header 'Accept: application/json' \
--header 'Content-Type: application/json' \
--data-raw '{
    "appid": "string",
    "timestamp": 0,
    "ranstr": "string",
    "u_info": [
        {
            "item": [
                {
                    "u_lx": "string",
                    "uid": 0
                }
            ],
            "qlmc": "string",
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
| `data` | array[object] | 是 | 返回数据 |

#### data 对象字段

| 参数名 | 类型 | 说明 |
| --- | --- | --- |
| `chat_id` | string | 群聊 ID |
| `uid` | string | 群主 UID |

```json
{
  "code": 1,
  "msg": "ok",
  "data": [
    {
      "chat_id": "1841",
      "uid": "10005"
    }
  ]
}
```
