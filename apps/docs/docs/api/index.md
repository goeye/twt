# 开放 API

通过 REST API 与 TWT Chat 平台进行深度集成，管理会话、发送消息、同步客户数据。

## 能做什么

- 服务端创建单聊或群聊会话，支持批量操作
- 删除/解散会话，清理历史数据
- 通过 HMAC-SHA256 签名鉴权，保障接口安全

## 怎么做

1. [鉴权与签名](./authentication) — 生成请求签名，所有接口必读
2. 在线聊天接口 — [创建单聊](/api/chat/create-session)、[批量创建](/api/chat/create-session-batch)、[创建群聊](/api/chat/create-group)、[删除/解散](/api/chat/delete-session)
3. [错误码参考](./error-codes) — 统一错误响应格式

**Base URL：** `https://apichat.twt.com`，HTTPS，JSON 格式。

## API 一览

| 接口 | 方法 | 模块 | 说明 |
| --- | --- | --- | --- |
| [鉴权与签名](./authentication) | — | 鉴权 | HMAC-SHA256 签名，所有接口必读 |
| [创建单聊](./chat/create-session) | POST | 在线聊天 | 创建单个聊天会话 |
| [批量创建单聊](./chat/create-session-batch) | POST | 在线聊天 | 批量创建单聊会话 |
| [创建群聊](./chat/create-group) | POST | 在线聊天 | 批量创建群聊会话 |
| [删除单聊](./chat/delete-session) | POST | 在线聊天 | 删除单个聊天会话 |
| [解散群聊](./chat/dissolve-group) | POST | 在线聊天 | 解散单个群聊 |
| [批量解散群聊](./chat/dissolve-group-batch) | POST | 在线聊天 | 批量解散群聊 |
| [错误码参考](./error-codes) | — | 通用 | 统一错误响应格式 |

## 能获得什么

- 将 TWT Chat 嵌入业务系统工作流，自动化会话管理
- 服务端主动发起会话，无需等待访客触发
- 与 CRM、工单系统深度集成

::: tip 还没有账号？
[免费注册 TWT Chat](https://twt.com) 获取 API Key，3 分钟完成接入。
:::
