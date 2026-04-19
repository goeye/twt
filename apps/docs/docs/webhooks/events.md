# 事件类型

当前系统支持以下 Webhook 事件类型。

## UNREPLIED - 访客消息未回复

| 字段 | 值 |
| --- | --- |
| 事件名称 | `UNREPLIED` |
| 触发条件 | 访客消息超时未回复 |
| 首次触发 | 自定义 |
| 后续触发 | 自定义 |
| 停止条件 | 客服回复 或 推送次数 >= 4 次 |

### content 字段说明

| 参数名 | 类型 | 说明 | 参数示例 |
| --- | --- | --- | --- |
| `subject` | string | 会话标题 | `New Conversation` |
| `visitor_name` | string | 访客姓名 | `Visitor15` |
| `created_at` | number | 消息创建时间 | `1765439652` |
| `message_content` | string | 消息内容 | `1` |
| `property_name` | string | 项目名称 | `test` |
| `visitor_nickname` | string | 访客备注名 | `VIP` |
| `sbs` | string | 客户标识 | `234442313` |
| `status` | string | 状态（1: 待回复 2: 排队中 3: 待处理 4: 已回复） | `1` |
| `push_times` | number | 推送次数 | `4` |
| `time_sec` | number | 超时时间（秒） | `289` |
| `assigned_agent_nickname` | string | 服务客服名称 | `ctccccd` |

### 完整示例

```json
{
  "created_at": 1765439941,
  "event": "UNREPLIED",
  "webhook_id": "58946f5f583edd94f5cf87e3534d04fb",
  "content": [
    {
      "subject": "New Conversation",
      "visitor_name": "Visitor15",
      "created_at": 1765439652,
      "message_content": "1",
      "property_name": "test",
      "visitor_nickname": "visitor nickname",
      "sbs": "",
      "status": "1",
      "push_times": 4,
      "time_sec": 289,
      "assigned_agent_nickname": "ctccccd"
    }
  ]
}
```

### 应用场景

- 自动转接到其他客服
- 触发邮件/短信通知提醒客服
- 记录超时工单用于绩效考核

::: tip 提示
后续支持的事件类型会直接更新到本文档中。
:::
