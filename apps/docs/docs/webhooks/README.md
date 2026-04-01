# Webhooks

通过 Webhook 将 TWT Chat 平台的事件实时推送至你的外部服务，实现业务流程自动化。

## 工作原理

当特定事件发生时（如访客消息超时未回复），TWT Chat 会向你配置的 URL 发送 HTTP POST 请求，请求体中包含事件详情。

## 文档目录

- [配置指南](./setup) — 设置 Webhook URL 和事件订阅
- [签名校验](./signature) — 验证请求来源，确保安全
- [事件类型](./events) — 支持的事件类型及触发条件
- [请求体结构](./payload) — 请求头和请求体的字段说明
