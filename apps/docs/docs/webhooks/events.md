# 事件类型

当前系统支持以下 Webhook 事件类型。

## UNREPLIED - 访客消息未回复

访客发出首条消息后 0 小时 1 分 20 秒首次触发；后续每 0 小时 10 分 0 秒再次触发，直到被客服回复或提醒 4 次以上为止。

| 字段 | 值 |
| --- | --- |
| 事件名称 | `UNREPLIED` |
| 触发条件 | 访客消息超时未回复 |
| 首次触发 | 消息发出后 1 分 20 秒 |
| 后续触发 | 每 10 分钟一次 |
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
后续将支持更多事件类型，请关注 [更新日志](/changelog) 获取最新动态。
:::
