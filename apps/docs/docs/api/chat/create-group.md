# 创建群聊-批量

> **POST** `https://apichat.twt.com/openapi/zxlt/fqlt_ql_batch` -- 需要签名鉴权

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
curl -X POST 'https://apichat.twt.com/openapi/zxlt/fqlt_ql_batch' \
-H 'x-chat-signature: 4ecdcaf813c422d34413671b2ed68e0a6e69ea8496d34ab40bd33cef26571e70' \
-H 'Content-Type: application/json' \
-d '{
    "appid": "1b621280becdb0fa3d3e041ff69e1e1f",
    "timestamp": 1712899200,
    "ranstr": "4ad0faec14a58112",
    "u_info": [
        {
            "item": [
                { "u_lx": "kefu", "uid": 10078 },
                { "u_lx": "visitor", "uid": 20056 }
            ],
            "qlmc": "VIP 客户服务群",
            "content": "欢迎加入群聊"
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

成功响应：

```json
{
  "code": 1,
  "msg": "ok",
  "data": [
    {
      "chat_id": "1841",
      "uid": "10078"
    }
  ]
}
```

失败响应：

```json
{
  "code": -1,
  "msg": "参数缺失：u_info",
  "data": ""
}
```
