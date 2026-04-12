# 开放 API

通过 REST API 与 TWT Chat 平台进行深度集成，管理会话、发送消息、同步客户数据。

## 基本信息

| 项目 | 说明 |
| --- | --- |
| Base URL | `https://apichat.twt.com` |
| 协议 | HTTPS |
| 数据格式 | JSON |
| 字符编码 | UTF-8 |

## 鉴权方式

所有 API 请求需通过 HMAC-SHA256 签名鉴权，详见 [鉴权与签名](./authentication)。

## API 模块

### 在线聊天

| 接口 | 方法 | 说明 |
| --- | --- | --- |
| [创建单聊](/api/chat/create-session) | POST | 创建单个聊天会话 |
| [创建单聊-批量](/api/chat/create-session-batch) | POST | 批量创建单聊会话 |
| [创建群聊-批量](/api/chat/create-group) | POST | 批量创建群聊会话 |
| [删除单聊](/api/chat/delete-session) | POST | 删除单个聊天会话 |
| [解散群聊](/api/chat/dissolve-group) | POST | 解散单个群聊 |
| [批量解散群聊](/api/chat/dissolve-group-batch) | POST | 批量解散群聊 |

## 错误处理

所有 API 遵循统一的错误响应格式，详见 [错误码参考](./error-codes)。

::: tip 开始使用
还没有账号？[免费注册 TWT Chat](https://app.twt.com) 获取 API Key，3 分钟完成接入。
:::
