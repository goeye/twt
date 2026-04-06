# Telegram 渠道接入技术方案

> **文档版本**：v1.0
> **更新日期**：2026-04-06

---

## 一、Telegram Bot 工作原理

### 1.1 核心概念

| 概念 | 说明 |
|------|------|
| **Bot** | Telegram 机器人账号，通过 @BotFather 创建 |
| **Bot Token** | 机器人的唯一认证凭证，格式：`{bot_id}:{auth_token}` |
| **User ID** | Telegram 用户的唯一数字标识符 |
| **Chat ID** | 对话的唯一标识符，私聊时等于 User ID |
| **Message ID** | 消息的唯一标识符（每个对话内递增） |

### 1.2 消息接收模式

Telegram Bot API 提供两种消息接收方式：

| 模式 | 工作原理 | 优点 | 缺点 | 推荐度 |
|------|---------|------|------|--------|
| **Webhook** | Telegram 服务器主动推送消息到你的服务器 | 实时性高、服务器资源占用少 | 需要公网 HTTPS 地址 | ⭐⭐⭐⭐⭐ |
| **Long Polling** | 服务器定期轮询 Telegram API 获取新消息 | 无需公网地址 | 延迟高、服务器资源占用大 | ⭐⭐ |

**行业标准：** Zendesk、Intercom、Tidio 等主流客服系统均采用 Webhook 模式。

### 1.3 Telegram Bot API 核心端点

| 端点 | 用途 | 说明 |
|------|------|------|
| `getMe` | 获取 Bot 信息 | 验证 Token 有效性，获取 Bot Username |
| `setWebhook` | 设置 Webhook | 配置消息推送地址 |
| `deleteWebhook` | 删除 Webhook | 切换到 Long Polling 模式 |
| `getWebhookInfo` | 查询 Webhook 状态 | 检查连接状态、错误信息 |
| `sendMessage` | 发送文本消息 | 支持 Markdown/HTML 格式 |
| `sendPhoto` | 发送图片 | 支持 URL 或文件上传 |
| `sendDocument` | 发送文件 | 支持任意文件类型 |
| `deleteMessage` | 删除消息 | 撤回消息功能 |

**API 基础 URL：** `https://api.telegram.org/bot{token}/{method}`

---

## 二、消息接收与会话管理

### 2.1 Webhook 消息格式

Telegram 推送的消息格式（JSON）：

```json
{
  "update_id": 123456789,
  "message": {
    "message_id": 1,
    "from": {
      "id": 987654321,
      "is_bot": false,
      "first_name": "John",
      "last_name": "Doe",
      "username": "johndoe",
      "language_code": "en"
    },
    "chat": {
      "id": 987654321,
      "first_name": "John",
      "last_name": "Doe",
      "username": "johndoe",
      "type": "private"
    },
    "date": 1234567890,
    "text": "Hello, I need help!"
  }
}
```

**关键字段：**
- `from.id`：用户唯一标识符（用于会话合并）
- `chat.id`：对话标识符（私聊时等于 `from.id`）
- `message_id`：消息 ID（用于撤回）
- `text`：文本消息内容
- `photo`/`document`：富媒体消息

### 2.2 会话识别与合并

**核心规则：** 同一 `from.id` 的所有消息归入同一会话。

```
收到新消息
│
├─ 提取 from.id（Telegram User ID）
│
├─ 查询数据库：是否存在该 User ID 的会话
│  ├─ 存在 → 追加消息到该会话
│  │  ├─ 会话状态为「已结束」→ 自动重新开启会话
│  │  └─ 会话状态为「进行中」→ 直接追加
│  └─ 不存在 → 创建新会话
│
├─ 会话标题生成规则：
│  ├─ 优先：first_name + last_name（如 "John Doe"）
│  ├─ 次选：@username（如 "@johndoe"）
│  └─ 兜底："Telegram 用户"
│
├─ 自动分配客服（按在线状态和会话数量）
│
└─ 发送欢迎消息（首次联系时）
```

### 2.3 消息类型处理

| 消息类型 | Telegram 字段 | 处理方式 |
|---------|--------------|---------|
| 文本消息 | `message.text` | 直接存储和展示 |
| 图片消息 | `message.photo[]` | 获取最大尺寸图片，调用 `getFile` 获取下载 URL |
| 文件消息 | `message.document` | 获取文件信息，调用 `getFile` 获取下载 URL |
| 语音消息 | `message.voice` | 第一版不支持 |
| 视频消息 | `message.video` | 第一版不支持 |

**文件下载流程：**

```
收到文件消息 → 提取 file_id → 调用 getFile API → 获取 file_path
→ 下载文件：https://api.telegram.org/file/bot{token}/{file_path}
→ 上传到 OSS/S3 → 存储永久 URL
```

---

## 三、消息发送

### 3.1 发送文本消息

```bash
POST https://api.telegram.org/bot{token}/sendMessage
Content-Type: application/json

{
  "chat_id": 987654321,
  "text": "Hello! How can I help you?",
  "parse_mode": "HTML"
}
```

**响应示例：**

```json
{
  "ok": true,
  "result": {
    "message_id": 2,
    "from": { "id": 123456789, "is_bot": true, "username": "support_bot" },
    "chat": { "id": 987654321, "type": "private" },
    "date": 1234567890,
    "text": "Hello! How can I help you?"
  }
}
```

### 3.2 发送图片

```bash
POST https://api.telegram.org/bot{token}/sendPhoto
Content-Type: multipart/form-data

{
  "chat_id": 987654321,
  "photo": <file_upload>,
  "caption": "Product screenshot"
}
```

**或使用 URL：**

```json
{
  "chat_id": 987654321,
  "photo": "https://example.com/image.jpg"
}
```

### 3.3 发送文件

```bash
POST https://api.telegram.org/bot{token}/sendDocument
Content-Type: multipart/form-data

{
  "chat_id": 987654321,
  "document": <file_upload>,
  "caption": "Invoice.pdf"
}
```

### 3.4 消息格式化

Telegram 支持两种格式化模式：

| 模式 | 语法 | 示例 |
|------|------|------|
| **Markdown** | `*bold*` `_italic_` `` `code` `` | `parse_mode: "Markdown"` |
| **HTML** | `<b>bold</b>` `<i>italic</i>` `<code>code</code>` | `parse_mode: "HTML"` |

**推荐使用 HTML 模式**，更接近 Web 编辑器的输出格式。

---

## 四、消息撤回

### 4.1 撤回机制

Telegram Bot API 限制：
- ✅ Bot 可以删除自己发送的消息（无时间限制）
- ❌ Bot 无法删除用户发送的消息（私聊场景）
- ✅ 用户删除消息后，Telegram 会发送 `deleted_messages` 更新

### 4.2 客服撤回消息

```bash
POST https://api.telegram.org/bot{token}/deleteMessage

{
  "chat_id": 987654321,
  "message_id": 2
}
```

**响应：**

```json
{
  "ok": true,
  "result": true
}
```

**实现流程：**

```
客服点击撤回
│
├─ 前端调用后端 API：POST /api/telegram/revoke
│
├─ 后端校验权限（只能撤回自己发送的消息）
│
├─ 调用 Telegram deleteMessage API
│  ├─ 成功 → Telegram 中消息被删除
│  └─ 失败 → 返回错误（如消息已被删除）
│
├─ 更新数据库：message.revoked = true
│
└─ 前端更新 UI：消息内容替换为「消息已撤回」
```

### 4.3 用户删除消息处理

Telegram Webhook 会推送 `deleted_messages` 更新：

```json
{
  "update_id": 123456790,
  "deleted_messages": {
    "message_id": 1,
    "chat": { "id": 987654321 },
    "date": 1234567890
  }
}
```

**处理流程：**

```
收到 deleted_messages 更新
│
├─ 查找对应消息记录
│
├─ 标记为「用户已删除」：message.user_deleted = true
│
├─ 原始内容保留在数据库（审计需求）
│
└─ 前端显示：「用户撤回了一条消息」
```

---

## 五、Bot 配置管理

### 5.1 Bot Token 验证

添加 Bot 时验证 Token 有效性：

```bash
GET https://api.telegram.org/bot{token}/getMe
```

**成功响应：**

```json
{
  "ok": true,
  "result": {
    "id": 123456789,
    "is_bot": true,
    "first_name": "Support Bot",
    "username": "support_bot",
    "can_join_groups": true,
    "can_read_all_group_messages": false,
    "supports_inline_queries": false
  }
}
```

**失败响应：**

```json
{
  "ok": false,
  "error_code": 401,
  "description": "Unauthorized"
}
```

### 5.2 Webhook 设置

```bash
POST https://api.telegram.org/bot{token}/setWebhook

{
  "url": "https://your-domain.com/api/telegram/webhook",
  "max_connections": 40,
  "allowed_updates": ["message", "edited_message", "deleted_messages"]
}
```

**参数说明：**
- `url`：Webhook 接收地址（必须 HTTPS）
- `max_connections`：最大并发连接数（1-100，默认 40）
- `allowed_updates`：订阅的更新类型

### 5.3 Webhook 状态检查

```bash
GET https://api.telegram.org/bot{token}/getWebhookInfo
```

**响应示例：**

```json
{
  "ok": true,
  "result": {
    "url": "https://your-domain.com/api/telegram/webhook",
    "has_custom_certificate": false,
    "pending_update_count": 0,
    "last_error_date": 0,
    "last_error_message": "",
    "max_connections": 40,
    "allowed_updates": ["message"]
  }
}
```

**健康检查逻辑：**

```
定时任务（每 5 分钟）
│
├─ 调用 getWebhookInfo
│
├─ 检查 last_error_date
│  ├─ 有错误 → 更新 Bot 状态为「异常」
│  └─ 无错误 → 更新 Bot 状态为「正常」
│
└─ 检查 pending_update_count
   └─ 积压过多 → 记录告警日志
```

---

## 六、数据库设计

### 6.1 核心表结构

**telegram_bots（Bot 配置）**

| 字段 | 类型 | 说明 |
|------|------|------|
| id | UUID | Bot ID |
| token | VARCHAR(256) | Bot Token（加密存储） |
| bot_id | BIGINT | Telegram Bot ID |
| username | VARCHAR(64) | Bot Username |
| name | VARCHAR(100) | Bot 显示名称 |
| welcome_message | TEXT | 欢迎消息 |
| status | ENUM | 状态：active/error |
| webhook_url | VARCHAR(512) | Webhook 地址 |
| last_error | TEXT | 最后错误信息 |
| created_by | UUID | 创建人 |
| created_at | TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | 更新时间 |

**telegram_sessions（Telegram 会话）**

| 字段 | 类型 | 说明 |
|------|------|------|
| id | UUID | 会话 ID |
| bot_id | UUID | 关联 Bot |
| telegram_user_id | BIGINT | Telegram User ID（唯一索引） |
| telegram_username | VARCHAR(64) | @username |
| telegram_first_name | VARCHAR(64) | 用户名 |
| telegram_last_name | VARCHAR(64) | 用户姓 |
| telegram_language_code | VARCHAR(10) | 语言代码（en/zh-CN） |
| customer_name | VARCHAR(128) | 会话标题 |
| status | ENUM | 状态：pending/processing/resolved/closed |
| closed | BOOLEAN | 是否已结束 |
| assigned_agent_id | UUID | 分配的客服 |
| last_message_at | TIMESTAMP | 最后消息时间 |
| created_at | TIMESTAMP | 创建时间 |

**telegram_messages（Telegram 消息）**

| 字段 | 类型 | 说明 |
|------|------|------|
| id | UUID | 消息 ID |
| session_id | UUID | 关联会话 |
| telegram_message_id | BIGINT | Telegram Message ID |
| role | ENUM | customer/agent/system |
| sender_name | VARCHAR(128) | 发送者名称 |
| content | TEXT | 消息内容 |
| content_type | ENUM | text/photo/document |
| file_url | VARCHAR(512) | 文件 URL（图片/文档） |
| file_name | VARCHAR(256) | 文件名 |
| file_size | BIGINT | 文件大小（字节） |
| revoked | BOOLEAN | 是否已撤回 |
| user_deleted | BOOLEAN | 用户是否已删除 |
| send_status | ENUM | sending/sent/failed |
| created_at | TIMESTAMP | 发送时间 |

### 6.2 索引建议

```sql
-- 会话查询：通过 Telegram User ID 查找会话
CREATE UNIQUE INDEX idx_sessions_telegram_user ON telegram_sessions(telegram_user_id, bot_id);

-- 会话消息列表：按会话 + 时间排序
CREATE INDEX idx_messages_session_time ON telegram_messages(session_id, created_at);

-- 消息撤回：通过 Telegram Message ID 查找
CREATE INDEX idx_messages_telegram_id ON telegram_messages(telegram_message_id);

-- Bot 状态查询
CREATE INDEX idx_bots_status ON telegram_bots(status);
```

---

## 七、完整流程示例

### 7.1 收消息流程

```
Telegram 用户发送消息
│
├─ Telegram 服务器推送到 Webhook
│  POST https://your-domain.com/api/telegram/webhook
│  Body: { update_id, message: { from, chat, text, ... } }
│
├─ 后端接收并解析
│  ├─ 提取 from.id（User ID）
│  ├─ 提取 message.text / photo / document
│  └─ 提取用户信息（first_name, last_name, username）
│
├─ 会话匹配
│  ├─ 查询：telegram_sessions WHERE telegram_user_id = from.id
│  ├─ 存在 → 追加消息
│  │  └─ 若会话已结束 → 重新开启 + 重新分配
│  └─ 不存在 → 创建新会话
│     ├─ 生成会话标题（first_name + last_name）
│     ├─ 自动分配客服
│     └─ 发送欢迎消息
│
├─ 存储消息
│  └─ INSERT INTO telegram_messages
│
├─ 实时推送
│  └─ WebSocket → 前端显示新消息
│
└─ 返回 200 OK（告知 Telegram 已处理）
```

### 7.2 发消息流程

```
客服编辑消息并点击发送
│
├─ 前端调用后端 API
│  POST /api/telegram/send
│  Body: { session_id, content, content_type, file_url }
│
├─ 后端查询会话信息
│  ├─ 获取 telegram_user_id（chat_id）
│  ├─ 获取 bot_id → 获取 Bot Token
│  └─ 检查 Bot 状态（是否已删除/异常）
│
├─ 调用 Telegram API
│  ├─ 文本消息 → sendMessage
│  ├─ 图片消息 → sendPhoto
│  └─ 文件消息 → sendDocument
│
├─ 处理响应
│  ├─ 成功 → 提取 message_id
│  │  └─ 存储到数据库（用于撤回）
│  └─ 失败 → 返回错误信息
│
├─ 存储消息记录
│  └─ INSERT INTO telegram_messages
│     (role='agent', telegram_message_id, send_status)
│
└─ 返回前端
   ├─ 成功 → 前端显示已发送消息
   └─ 失败 → 前端显示重试按钮
```

---

## 八、安全与限流

### 8.1 Bot Token 安全

| 措施 | 说明 |
|------|------|
| 加密存储 | 使用 AES-256 加密 Token，密钥存储在环境变量 |
| 权限控制 | 只有管理员可以添加/编辑/删除 Bot |
| 审计日志 | 记录所有 Bot 配置变更操作 |
| Token 轮换 | 支持更新 Token（通过 @BotFather 重新生成） |

### 8.2 Telegram API 限流

Telegram API 限流规则：

| 限制类型 | 限制值 | 说明 |
|---------|--------|------|
| 全局限流 | 30 条/秒 | 所有方法的总请求数 |
| 单对话限流 | 1 条/秒 | 同一 chat_id 的消息发送频率 |
| 群组消息 | 20 条/分钟 | 群组消息发送限制 |

**应对策略：**

```
消息发送队列
│
├─ 使用 Redis 队列缓存待发送消息
│
├─ 消费者限速处理
│  ├─ 全局：每秒最多 25 条（留 5 条余量）
│  └─ 单对话：每秒最多 1 条
│
├─ 超限时自动重试
│  ├─ 指数退避：1s → 2s → 4s → 8s
│  └─ 最多重试 3 次
│
└─ 失败通知
   └─ 前端显示「消息发送失败，请稍后重试」
```

### 8.3 Webhook 安全

验证 Telegram 请求来源：

```javascript
// 验证请求来自 Telegram
function verifyTelegramRequest(req) {
  const secretToken = process.env.TELEGRAM_WEBHOOK_SECRET;
  const headerToken = req.headers['x-telegram-bot-api-secret-token'];
  return secretToken === headerToken;
}
```

**设置 Webhook 时传入 secret_token：**

```bash
POST https://api.telegram.org/bot{token}/setWebhook

{
  "url": "https://your-domain.com/api/telegram/webhook",
  "secret_token": "your-random-secret-string"
}
```

---

## 九、技术组件清单

### 后端

| 组件 | 用途 | 推荐方案 |
|------|------|---------|
| HTTP 客户端 | 调用 Telegram API | axios（Node.js）/ requests（Python） |
| 加密库 | Bot Token 加密存储 | crypto（Node.js）/ cryptography（Python） |
| 消息队列 | 限流和异步处理 | Redis + Bull（Node.js）/ Celery（Python） |
| 文件存储 | 图片/文件存储 | OSS / S3 / MinIO |
| WebSocket | 实时推送 | Socket.IO / ws |
| 数据库 | 数据持久化 | PostgreSQL / MySQL |

### 前端

| 组件 | 用途 |
|------|------|
| 消息列表组件 | 展示 Telegram 消息 |
| 文件上传组件 | 图片/文件上传 |
| 消息撤回 UI | 撤回按钮 + 已撤回状态 |
| 会话重新开启 | 已结束会话的重新开启按钮 |
| WebSocket 客户端 | 接收新消息实时推送 |

---

## 十、行业对标

### 主流客服系统的 Telegram 集成方式

| 平台 | 实现方式 | 特点 |
|------|---------|------|
| **Zendesk** | Telegram Channel App | Webhook 模式，支持文本/图片/文件 |
| **Intercom** | 通过 Octopods 集成 | 第三方集成服务 |
| **Tidio** | 原生支持 | Webhook 模式，支持多 Bot |
| **Mava** | 专业 Telegram 客服工具 | 支持群组消息、自动回复 |

### 我们的方案定位

- 消息接收：Webhook 模式（行业标准）
- 会话管理：按 User ID 合并会话
- 消息撤回：支持客服撤回，记录用户删除
- 多 Bot 支持：最多 10 个 Bot

---

## 十一、前后端职责划分

| 职责 | 原型阶段 | 生产环境 |
|------|---------|---------|
| Bot Token 验证 | Mock 数据 | **后端** |
| Webhook 设置 | 不涉及 | **后端** |
| 消息接收 | Mock 数据 | **后端** |
| 会话匹配 | Mock 数据 | **后端** |
| 消息发送 | Mock 数据 | **后端** |
| 消息撤回 | Mock 数据 | **后端** |
| 文件下载存储 | Mock 数据 | **后端** |
| 消息展示 | **前端** | **前端** |
| Bot 配置 UI | **前端** | **前端** |
| 实时推送 | 不涉及 | **后端** WebSocket |

---

**文档结束**
