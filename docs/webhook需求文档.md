# Webhook 平台集成需求文档

## 1. 文档概述

### 1.1 目的
本文档描述客户服务系统的 Webhook 平台集成功能的技术实现方案，包括平台适配、签名验证、消息格式转换等核心设计。

### 1.2 背景
客户服务系统需要支持接入多个第三方平台（如飞书、企业微信、钉钉等），当有客服消息到达时，通过 Webhook 推送给用户配置的接收地址。

### 1.3 核心功能
- 多平台 Webhook 统一接收
- 签名验证确保消息来源可信
- 平台间消息格式统一适配
- 并发推送提高性能
- 支持自定义时间设置（访客消息未回复提醒）

---

## 2. 系统架构

### 2.1 整体架构图

```
┌─────────────────────────────────────────────────────────────────┐
│                        第三方平台                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │   飞书    │  │ 企业微信 │  │   钉钉   │  │  其他... │       │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘       │
│       │              │              │              │           │
└───────┼──────────────┼──────────────┼──────────────┼───────────┘
        │              │              │              │
        └──────────────┼──────────────┼──────────────┘
                       │              │
        ┌──────────────▼──────────────▼──────────────┐
        │          Webhook 接收服务                    │
        │  ┌─────────────────────────────────────┐    │
        │  │  签名验证层                          │    │
        │  │  - HMAC-SHA256 验证                  │    │
        │  │  - 时间戳防重放                       │    │
        │  └──────────────┬──────────────────────┘    │
        │                 │                           │
        │  ┌──────────────▼──────────────────────┐    │
        │  │  平台适配层                          │    │
        │  │  - 飞书 Adapter                      │    │
        │  │  - 企业微信 Adapter                  │    │
        │  │  - 钉钉 Adapter                      │    │
        │  └──────────────┬──────────────────────┘    │
        │                 │                           │
        │  ┌──────────────▼──────────────────────┐    │
        │  │  统一消息格式                        │    │
        │  │  - WebhookEvent                     │    │
        │  └──────────────┬──────────────────────┘    │
        └─────────────────┼──────────────────────────┘
                          │
        ┌─────────────────▼──────────────────────────┐
        │          Webhook 推送服务                    │
        │  ┌─────────────────────────────────────┐    │
        │  │  推送队列管理                        │    │
        │  └──────────────┬──────────────────────┘    │
        │                 │                           │
        │  ┌──────────────▼──────────────────────┐    │
        │  │  并发推送                            │    │
        │  │  - Promise.allSettled               │    │
        │  │  - 失败重试机制                      │    │
        │  └──────────────┬──────────────────────┘    │
        └─────────────────┼──────────────────────────┘
                          │
        ┌─────────────────▼──────────────────────────┐
        │            用户配置的接收端                  │
        │  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
        │  │ URL 1    │  │ URL 2    │  │ URL 3    │  │
        │  └──────────┘  └──────────┘  └──────────┘  │
        └─────────────────────────────────────────────┘
```

### 2.2 技术栈
- **后端**: Node.js + Express + TypeScript
- **前端**: Vue 3 + TypeScript + Vite + Tailwind CSS v4
- **设计模式**: 适配器模式 (Adapter Pattern)
- **加密算法**: HMAC-SHA256

---

## 3. 平台适配设计

### 3.1 适配器模式

#### 3.1.1 设计目标
- 统一不同平台的 Webhook 消息格式
- 屏蔽平台差异，便于后续扩展新平台
- 解耦平台特定逻辑与核心业务逻辑

#### 3.1.2 接口定义

```typescript
// 平台适配器接口
interface PlatformAdapter {
  // 解析平台原始 Webhook 请求
  parseRequest(req: any): Promise<WebhookEvent>;

  // 验证签名
  verifySignature(req: any, secret: string): boolean;

  // 生成签名（用于测试）
  generateSignature(payload: string, secret: string): string;
}

// 统一消息格式
interface WebhookEvent {
  eventId: string;          // 事件唯一标识
  eventType: string;         // 事件类型：new_message | reply_message | system_notice
  platform: Platform;       // 来源平台
  timestamp: number;        // 时间戳
  data: {
    visitorId: string;      // 访客ID
    visitorName?: string;   // 访客名称
    message: string;        // 消息内容
    messageType: 'text' | 'image' | 'file'; // 消息类型
    attachments?: Array<{   // 附件列表
      type: string;
      url: string;
      name: string;
    }>;
  };
  raw?: any;                // 原始平台数据（用于调试）
}
```

#### 3.1.3 飞书平台适配示例

```typescript
class FeishuAdapter implements PlatformAdapter {
  async parseRequest(req: any): Promise<WebhookEvent> {
    const { header, event } = req.body;

    // 飞书消息格式转换为统一格式
    return {
      eventId: event.event_id,
      eventType: this.mapEventType(event.type),
      platform: 'feishu',
      timestamp: event.create_time,
      data: {
        visitorId: event.sender.sender_id.user_id,
        visitorName: event.sender.sender_id.name,
        message: this.extractMessage(event),
        messageType: this.getMessageType(event),
        attachments: this.extractAttachments(event),
      },
      raw: req.body,
    };
  }

  verifySignature(req: any, secret: string): boolean {
    const timestamp = req.header['X-Lark-Request-Timestamp'];
    const nonce = req.header['X-Lark-Request-Nonce'];
    const body = JSON.stringify(req.body);
    const signature = req.header['X-Lark-Signature'];

    // 拼接字符串
    const signString = `${timestamp}\n${nonce}\n${body}`;

    // 计算 HMAC-SHA256
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(signString)
      .digest('base64');

    // Base64 编码后比较
    return signature === expectedSignature;
  }

  generateSignature(payload: string, secret: string): string {
    const timestamp = Math.floor(Date.now() / 1000);
    const nonce = crypto.randomBytes(16).toString('hex');

    const signString = `${timestamp}\n${nonce}\n${payload}`;

    return crypto
      .createHmac('sha256', secret)
      .update(signString)
      .digest('base64');
  }

  private mapEventType(feiShuType: string): string {
    const typeMap: Record<string, string> = {
      'im.message.receive_v1': 'new_message',
      'im.message.reply_v1': 'reply_message',
    };
    return typeMap[feiShuType] || 'system_notice';
  }

  private extractMessage(event: any): string {
    // 根据消息类型提取内容
    const content = JSON.parse(event.message.content);
    if (content.text) return content.text;
    if (content.image_key) return '[图片]';
    if (content.file_key) return '[文件]';
    return '[未知消息类型]';
  }

  private getMessageType(event: any): 'text' | 'image' | 'file' {
    const msgType = event.message.msg_type;
    if (msgType === 'text') return 'text';
    if (msgType === 'image') return 'image';
    if (msgType === 'file') return 'file';
    return 'text';
  }

  private extractAttachments(event: any) {
    // 提取附件信息
    const msgType = event.message.msg_type;
    if (msgType === 'image' || msgType === 'file') {
      return [{
        type: msgType,
        url: `/api/files/${event.message[msgType + '_key']}`,
        name: msgType === 'image' ? '图片' : '文件',
      }];
    }
    return undefined;
  }
}
```

#### 3.1.4 适配器工厂

```typescript
class AdapterFactory {
  private static adapters: Map<Platform, PlatformAdapter> = new Map();

  static {
    // 注册各平台适配器
    this.adapters.set('feishu', new FeishuAdapter());
    this.adapters.set('wecom', new WeComAdapter());
    this.adapters.set('dingtalk', new DingTalkAdapter());
  }

  static getAdapter(platform: Platform): PlatformAdapter {
    const adapter = this.adapters.get(platform);
    if (!adapter) {
      throw new Error(`Unsupported platform: ${platform}`);
    }
    return adapter;
  }

  static registerAdapter(platform: Platform, adapter: PlatformAdapter) {
    this.adapters.set(platform, adapter);
  }
}
```

### 3.2 使用流程

```typescript
// Webhook 接收处理流程
async function handleWebhook(req: any, res: Response, platform: Platform) {
  try {
    // 1. 获取平台适配器
    const adapter = AdapterFactory.getAdapter(platform);

    // 2. 验证签名
    const secret = getPlatformSecret(platform);
    const isValid = adapter.verifySignature(req, secret);
    if (!isValid) {
      return res.status(401).json({ error: '签名验证失败' });
    }

    // 3. 解析请求为统一格式
    const webhookEvent = await adapter.parseRequest(req);

    // 4. 存储事件（可选，用于审计）
    await storage.saveWebhookEvent(webhookEvent);

    // 5. 推送给用户配置的接收地址
    await pushToWebhooks(webhookEvent);

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Webhook 处理失败:', error);
    return res.status(500).json({ error: '处理失败' });
  }
}
```

---

## 4. 签名验证机制

### 4.1 为什么需要签名验证

1. **消息完整性**: 确保消息在传输过程中未被篡改
2. **身份认证**: 验证消息确实来自声称的平台
3. **防止伪造**: 防止恶意攻击者伪造 Webhook 请求

### 4.2 飞书签名验证方案

#### 4.2.1 验证流程

```
┌─────────────────────────────────────────────────────────────┐
│                    飞书签名验证流程                            │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. 接收请求头                                               │
│     ├── X-Lark-Request-Timestamp: 1645123456               │
│     ├── X-Lark-Request-Nonce: abc123...                     │
│     └── X-Lark-Signature: abcdef123456...                   │
│                                                              │
│  2. 拼接签名字符串                                           │
│     signString = timestamp + '\n' + nonce + '\n' + body    │
│                                                              │
│  3. 计算 HMAC-SHA256                                         │
│     signature = HMAC-SHA256(signString, appSecret)          │
│                                                              │
│  4. Base64 编码                                              │
│     signatureBase64 = Base64(signature)                     │
│                                                              │
│  5. 比较签名                                                 │
│     if (signatureBase64 == X-Lark-Signature) {              │
│       验证成功                                                │
│     } else {                                                 │
│       验证失败                                                │
│     }                                                        │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

#### 4.2.2 防重放攻击

**问题**: 如果攻击者截获了合法的 Webhook 请求，可以重复发送。

**解决方案**:
1. 检查时间戳，拒绝超过 5 分钟的请求
2. 使用 nonce（随机数）记录已处理过的请求，相同 nonce 的请求只处理一次

```typescript
function verifyTimestamp(timestamp: string): boolean {
  const now = Math.floor(Date.now() / 1000);
  const requestTime = parseInt(timestamp, 10);

  // 拒绝超过 5 分钟的请求
  if (Math.abs(now - requestTime) > 300) {
    return false;
  }

  return true;
}

// 已处理 nonce 的缓存（生产环境建议使用 Redis）
const processedNonces = new Set<string>();

function verifyNonce(nonce: string): boolean {
  if (processedNonces.has(nonce)) {
    return false; // 重复请求
  }

  processedNonces.add(nonce);

  // 清理 5 分钟前的 nonce（避免内存泄漏）
  setTimeout(() => {
    processedNonces.delete(nonce);
  }, 5 * 60 * 1000);

  return true;
}
```

### 4.3 企业微信签名验证

企业微信的签名验证略有不同：

```typescript
class WeComAdapter implements PlatformAdapter {
  verifySignature(req: any, secret: string): boolean {
    const msgSignature = req.query.msg_signature;
    const timestamp = req.query.timestamp;
    const nonce = req.query.nonce;
    const body = req.body;

    // 1. 将 token、timestamp、nonce、msg_encrypt 按字典序排序
    const token = getWeComToken();
    const msgEncrypt = body.echostr || ''; // URL 验证时
    const arr = [token, timestamp, nonce, msgEncrypt].sort();

    // 2. 拼接字符串
    const str = arr.join('');

    // 3. 计算 SHA1
    const signature = crypto
      .createHash('sha1')
      .update(str)
      .digest('hex');

    // 4. 比较
    return signature === msgSignature;
  }
}
```

### 4.4 签名验证最佳实践

1. **统一错误处理**: 验证失败返回 401 状态码，不泄露具体错误
2. **日志记录**: 记录所有验证失败的请求，便于排查问题
3. **密钥安全**: 使用环境变量存储密钥，不要硬编码
4. **测试工具**: 提供签名生成工具，方便开发者测试

---

## 5. 消息推送机制

### 5.1 推送流程

```typescript
async function pushToWebhooks(event: WebhookEvent) {
  // 1. 获取所有启用的 Webhook 配置
  const webhooks = await storage.getEnabledWebhooks();

  // 2. 过滤匹配平台的 Webhook
  const matchedWebhooks = webhooks.filter(
    wh => wh.platform === event.platform
  );

  if (matchedWebhooks.length === 0) {
    console.log('没有匹配的 Webhook 配置');
    return;
  }

  // 3. 并发推送
  const results = await Promise.allSettled(
    matchedWebhooks.map(webhook =>
      pushToSingleWebhook(webhook, event)
    )
  );

  // 4. 记录推送结果
  const successCount = results.filter(r => r.status === 'fulfilled').length;
  const failCount = results.length - successCount;

  console.log(`推送完成: 成功 ${successCount}, 失败 ${failCount}`);

  // 5. 保存推送日志
  await storage.savePushLog({
    eventId: event.eventId,
    total: results.length,
    success: successCount,
    failed: failCount,
    details: results.map((r, i) => ({
      webhookId: matchedWebhooks[i].id,
      url: matchedWebhooks[i].url,
      status: r.status,
      error: r.status === 'rejected' ? r.reason.message : undefined,
    })),
  });
}
```

### 5.2 单个 Webhook 推送

```typescript
async function pushToSingleWebhook(
  webhook: Webhook,
  event: WebhookEvent
): Promise<void> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-Webhook-Event': event.eventType,
    'X-Webhook-Platform': event.platform,
    'X-Webhook-Timestamp': event.timestamp.toString(),
  };

  // 添加自定义头
  if (webhook.headers) {
    Object.assign(headers, webhook.headers);
  }

  // 生成签名（如果需要）
  if (webhook.secret) {
    const signature = crypto
      .createHmac('sha256', webhook.secret)
      .update(JSON.stringify(event))
      .digest('hex');
    headers['X-Webhook-Signature'] = signature;
  }

  try {
    const response = await axios.post(webhook.url, event, {
      headers,
      timeout: 5000, // 5 秒超时
    });

    if (response.status >= 200 && response.status < 300) {
      console.log(`推送成功: ${webhook.url}`);
    } else {
      throw new Error(`HTTP ${response.status}`);
    }
  } catch (error: any) {
    console.error(`推送失败: ${webhook.url}`, error.message);
    throw error;
  }
}
```

### 5.3 重试策略

```typescript
async function pushToSingleWebhookWithRetry(
  webhook: Webhook,
  event: WebhookEvent,
  maxRetries = 3
): Promise<void> {
  let lastError: Error;

  for (let i = 0; i < maxRetries; i++) {
    try {
      await pushToSingleWebhook(webhook, event);
      return; // 成功则返回
    } catch (error: any) {
      lastError = error;
      console.error(`第 ${i + 1} 次尝试失败`, error.message);

      // 指数退避
      if (i < maxRetries - 1) {
        const delay = Math.pow(2, i) * 1000; // 1s, 2s, 4s
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError;
}
```

---

## 6. 时间设置功能

### 6.1 功能描述

用户可以设置"访客消息未回复提醒"的阈值时间。当访客发送消息后，如果超过设定时间未收到客服回复，系统触发提醒。

### 6.2 数据结构

```typescript
interface TimeSettings {
  enabled: boolean;          // 是否启用
  hours: number;            // 小时数 (0-23)
  minutes: number;          // 分钟数 (0-59)
  seconds: number;          // 秒数 (0-59)
}
```

### 6.3 后端实现

```typescript
// 存储接口
interface ITimeSettingsStorage {
  getTimeSettings(): Promise<TimeSettings>;
  updateTimeSettings(settings: TimeSettings): Promise<void>;
}

// 内存存储实现
class MemoryTimeSettingsStorage implements ITimeSettingsStorage {
  private settings: TimeSettings = {
    enabled: false,
    hours: 0,
    minutes: 0,
    seconds: 0,
  };

  async getTimeSettings(): Promise<TimeSettings> {
    return { ...this.settings };
  }

  async updateTimeSettings(settings: TimeSettings): Promise<void> {
    // 验证输入
    if (
      settings.hours < 0 || settings.hours > 23 ||
      settings.minutes < 0 || settings.minutes > 59 ||
      settings.seconds < 0 || settings.seconds > 59
    ) {
      throw new Error('时间设置无效');
    }

    this.settings = { ...settings };
  }
}

// API 路由
router.get('/api/webhooks/time-settings', async (req, res) => {
  try {
    const settings = await storage.getTimeSettings();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: '获取时间设置失败' });
  }
});

router.put('/api/webhooks/time-settings', async (req, res) => {
  try {
    await storage.updateTimeSettings(req.body);
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
```

### 6.4 前端实现

```typescript
// API 调用
export async function getTimeSettings(): Promise<TimeSettings> {
  const response = await axios.get<TimeSettings>('/api/webhooks/time-settings');
  return response.data;
}

export async function updateTimeSettings(
  settings: TimeSettings
): Promise<void> {
  await axios.put('/api/webhooks/time-settings', settings);
}

// Vue 组件
<template>
  <div class="time-settings">
    <label class="toggle">
      <input
        type="checkbox"
        v-model="settings.enabled"
        @change="saveSettings"
      />
      <span>启用未回复提醒</span>
    </label>

    <div v-if="settings.enabled" class="time-inputs">
      <input
        type="number"
        v-model.number="settings.hours"
        min="0"
        max="23"
        placeholder="时"
      />
      <span>:</span>
      <input
        type="number"
        v-model.number="settings.minutes"
        min="0"
        max="59"
        placeholder="分"
      />
      <span>:</span>
      <input
        type="number"
        v-model.number="settings.seconds"
        min="0"
        max="59"
        placeholder="秒"
      />
      <button @click="saveSettings">保存</button>
    </div>
  </div>
</template>
```

---

## 7. 配置说明

### 7.1 配置文档页面

配置说明页面包含以下内容：

#### 7.1.1 支持的事件类型

| 事件类型 | 描述 | 示例数据 |
|---------|------|---------|
| `new_message` | 新消息到达 | 访客发送消息到客服 |
| `reply_message` | 回复消息 | 客服回复访客 |
| `system_notice` | 系统通知 | 会话状态变更 |

#### 7.1.2 请求头

```http
POST /your-webhook-endpoint HTTP/1.1
Content-Type: application/json
X-Webhook-Event: new_message
X-Webhook-Platform: feishu
X-Webhook-Timestamp: 1645123456
X-Webhook-Signature: abc123...
```

#### 7.1.3 请求体示例

```json
{
  "eventId": "evt_1234567890",
  "eventType": "new_message",
  "platform": "feishu",
  "timestamp": 1645123456,
  "data": {
    "visitorId": "user_123",
    "visitorName": "张三",
    "message": "你好，有什么可以帮您的吗？",
    "messageType": "text",
    "attachments": []
  }
}
```

#### 7.1.4 签名验证

用户在接收端验证签名：

```typescript
function verifyWebhookSignature(
  body: any,
  secret: string,
  receivedSignature: string
): boolean {
  const payload = JSON.stringify(body);
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');

  return expectedSignature === receivedSignature;
}
```

---

## 8. 数据存储设计

### 8.1 存储抽象

为便于未来切换数据库，定义存储接口：

```typescript
interface IWebhookStorage {
  // Webhook 配置
  getWebhooks(): Promise<Webhook[]>;
  getWebhookById(id: string): Promise<Webhook | null>;
  createWebhook(webhook: Omit<Webhook, 'id'>): Promise<Webhook>;
  updateWebhook(id: string, webhook: Partial<Webhook>): Promise<void>;
  deleteWebhook(id: string): Promise<void>;
  toggleWebhook(id: string, enabled: boolean): Promise<void>;

  // 时间设置
  getTimeSettings(): Promise<TimeSettings>;
  updateTimeSettings(settings: TimeSettings): Promise<void>;

  // 统计
  getWebhookStats(): Promise<WebhookStats>;
}
```

### 8.2 内存存储实现

```typescript
class MemoryStorage implements IWebhookStorage {
  private webhooks: Map<string, Webhook> = new Map();
  private timeSettings: TimeSettings = {
    enabled: false,
    hours: 0,
    minutes: 0,
    seconds: 0,
  };

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  async getWebhooks(): Promise<Webhook[]> {
    return Array.from(this.webhooks.values());
  }

  async createWebhook(webhook: Omit<Webhook, 'id'>): Promise<Webhook> {
    const newWebhook: Webhook = {
      ...webhook,
      id: this.generateId(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    this.webhooks.set(newWebhook.id, newWebhook);
    return newWebhook;
  }

  async updateWebhook(id: string, webhook: Partial<Webhook>): Promise<void> {
    const existing = this.webhooks.get(id);
    if (!existing) {
      throw new Error('Webhook not found');
    }
    const updated = { ...existing, ...webhook, updatedAt: Date.now() };
    this.webhooks.set(id, updated);
  }

  async deleteWebhook(id: string): Promise<void> {
    this.webhooks.delete(id);
  }

  async toggleWebhook(id: string, enabled: boolean): Promise<void> {
    const webhook = this.webhooks.get(id);
    if (!webhook) {
      throw new Error('Webhook not found');
    }
    webhook.enabled = enabled;
    webhook.updatedAt = Date.now();
  }

  // ... 其他方法实现
}
```

### 8.3 未来扩展到数据库

当需要持久化存储时，可以实现 `MySQLStorage`、`PostgreSQLStorage` 等：

```typescript
class MySQLStorage implements IWebhookStorage {
  constructor(private connection: mysql.Connection) {}

  async getWebhooks(): Promise<Webhook[]> {
    const [rows] = await this.connection.execute(
      'SELECT * FROM webhooks'
    );
    return rows as Webhook[];
  }

  async createWebhook(webhook: Omit<Webhook, 'id'>): Promise<Webhook> {
    const [result] = await this.connection.execute(
      'INSERT INTO webhooks SET ?',
      webhook
    );
    const id = (result as any).insertId;
    return { ...webhook, id, createdAt: Date.now(), updatedAt: Date.now() };
  }

  // ... 其他方法实现
}
```

---

## 9. 错误处理与监控

### 9.1 错误处理策略

1. **签名验证失败**: 返回 401，记录日志但不报警
2. **平台解析失败**: 返回 400，记录详细错误信息
3. **推送失败**: 记录失败日志，支持重试
4. **未知错误**: 返回 500，发送告警通知

### 9.2 日志记录

```typescript
class Logger {
  private logLevel: 'debug' | 'info' | 'warn' | 'error';

  log(level: string, message: string, data?: any) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      data,
    };

    console.log(JSON.stringify(logEntry));

    // 可选：写入文件或发送到日志服务
  }

  debug(message: string, data?: any) {
    this.log('debug', message, data);
  }

  info(message: string, data?: any) {
    this.log('info', message, data);
  }

  warn(message: string, data?: any) {
    this.log('warn', message, data);
  }

  error(message: string, data?: any) {
    this.log('error', message, data);
  }
}
```

### 9.3 监控指标

建议监控以下指标：

1. **Webhook 接收量**: 每分钟/小时/天的请求数
2. **签名验证成功率**: 验证成功 vs 验证失败的比率
3. **推送成功率**: 推送成功 vs 推送失败的比率
4. **推送延迟**: 从接收到推送完成的时间
5. **错误率**: 各类错误的发生频率

---

## 10. 安全建议

### 10.1 密钥管理

1. **使用环境变量**: 不要将密钥硬编码在代码中
2. **定期轮换**: 建议每 90 天更换一次密钥
3. **最小权限**: 只授予必要的权限

### 10.2 HTTPS

1. **强制 HTTPS**: 所有 Webhook URL 必须使用 HTTPS
2. **证书验证**: 验证服务器证书有效性

### 10.3 速率限制

```typescript
import rateLimit from 'express-rate-limit';

const webhookRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 分钟
  max: 1000, // 每个平台最多 1000 次请求
  keyGenerator: (req) => {
    // 使用平台类型作为 key
    return req.params.platform;
  },
  message: '请求过于频繁，请稍后再试',
});

app.use('/api/webhooks/:platform/*', webhookRateLimit);
```

---

## 11. 测试建议

### 11.1 单元测试

```typescript
describe('FeishuAdapter', () => {
  const adapter = new FeishuAdapter();
  const secret = 'test_secret';

  describe('verifySignature', () => {
    it('应该验证成功的签名', () => {
      const timestamp = '1645123456';
      const nonce = 'abc123';
      const body = { test: 'data' };
      const signString = `${timestamp}\n${nonce}\n${JSON.stringify(body)}`;

      const signature = crypto
        .createHmac('sha256', secret)
        .update(signString)
        .digest('base64');

      const req = {
        header: {
          'X-Lark-Request-Timestamp': timestamp,
          'X-Lark-Request-Nonce': nonce,
          'X-Lark-Signature': signature,
        },
        body,
      };

      expect(adapter.verifySignature(req, secret)).toBe(true);
    });

    it('应该拒绝错误的签名', () => {
      const req = {
        header: {
          'X-Lark-Request-Timestamp': '1645123456',
          'X-Lark-Request-Nonce': 'abc123',
          'X-Lark-Signature': 'wrong_signature',
        },
        body: { test: 'data' },
      };

      expect(adapter.verifySignature(req, secret)).toBe(false);
    });
  });
});
```

### 11.2 集成测试

```typescript
describe('Webhook 接收', () => {
  it('应该成功接收并推送飞书 Webhook', async () => {
    const feishuPayload = {
      header: { event_id: 'evt_123' },
      event: {
        event_id: 'evt_123',
        type: 'im.message.receive_v1',
        create_time: 1645123456,
        sender: {
          sender_id: {
            user_id: 'user_123',
            name: '张三',
          },
        },
        message: {
          msg_type: 'text',
          content: JSON.stringify({ text: '你好' }),
        },
      },
    };

    const response = await request(app)
      .post('/api/webhooks/feishu')
      .set('X-Lark-Request-Timestamp', '1645123456')
      .set('X-Lark-Request-Nonce', 'abc123')
      .set('X-Lark-Signature', generateSignature(feishuPayload))
      .send(feishuPayload);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ success: true });
  });
});
```

### 11.3 签名测试工具

提供一个命令行工具，方便开发者测试签名：

```typescript
// tools/signature-generator.ts
import crypto from 'crypto';

function generateFeishuSignature(
  secret: string,
  timestamp: string,
  nonce: string,
  body: string
): string {
  const signString = `${timestamp}\n${nonce}\n${body}`;
  return crypto
    .createHmac('sha256', secret)
    .update(signString)
    .digest('base64');
}

// 使用示例
const secret = process.argv[2];
const timestamp = process.argv[3] || Math.floor(Date.now() / 1000).toString();
const nonce = crypto.randomBytes(16).toString('hex');
const body = process.argv[4];

if (!secret || !body) {
  console.log('用法: node signature-generator.js <secret> <timestamp> <body>');
  process.exit(1);
}

const signature = generateFeishuSignature(secret, timestamp, nonce, body);
console.log('Timestamp:', timestamp);
console.log('Nonce:', nonce);
console.log('Signature:', signature);
console.log('');
console.log('Curl 示例:');
console.log(`curl -X POST http://localhost:3000/api/webhooks/feishu \\`);
console.log(`  -H "X-Lark-Request-Timestamp: ${timestamp}" \\`);
console.log(`  -H "X-Lark-Request-Nonce: ${nonce}" \\`);
console.log(`  -H "X-Lark-Signature: ${signature}" \\`);
console.log(`  -H "Content-Type: application/json" \\`);
console.log(`  -d '${body}'`);
```

---

## 12. 部署建议

### 12.1 环境变量

```bash
# .env
NODE_ENV=production
PORT=3000

# 平台密钥
FEISHU_APP_SECRET=your_feishu_secret
WECOM_TOKEN=your_wecom_token
WECOM_ENCODING_AES_KEY=your_wecom_aes_key
DINGTALK_APP_SECRET=your_dingtalk_secret

# 数据库配置（如果使用）
DB_HOST=localhost
DB_PORT=3306
DB_NAME=webhooks
DB_USER=root
DB_PASSWORD=password
```

### 12.2 健康检查

```typescript
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: Date.now(),
    platform: {
      feishu: !!process.env.FEISHU_APP_SECRET,
      wecom: !!process.env.WECOM_TOKEN,
      dingtalk: !!process.env.DINGTALK_APP_SECRET,
    },
  });
});
```

### 12.3 Docker 部署

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["node", "dist/index.js"]
```

```yaml
# docker-compose.yml
version: '3.8'

services:
  webhook-server:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - PORT=3000
      - FEISHU_APP_SECRET=${FEISHU_APP_SECRET}
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
```

---

## 13. 扩展性设计

### 13.1 添加新平台

添加新平台只需三步：

1. **实现适配器**:
```typescript
class NewPlatformAdapter implements PlatformAdapter {
  async parseRequest(req: any): Promise<WebhookEvent> {
    // 实现解析逻辑
  }

  verifySignature(req: any, secret: string): boolean {
    // 实现签名验证
  }

  generateSignature(payload: string, secret: string): string {
    // 生成签名（用于测试）
  }
}
```

2. **注册适配器**:
```typescript
AdapterFactory.registerAdapter('newplatform', new NewPlatformAdapter());
```

3. **添加路由**:
```typescript
app.post('/api/webhooks/newplatform', async (req, res) => {
  await handleWebhook(req, res, 'newplatform');
});
```

### 13.2 插件化架构

未来可以设计插件系统，允许动态加载平台适配器：

```typescript
interface WebhookPlugin {
  name: string;
  platform: Platform;
  adapter: PlatformAdapter;
  routes: express.Router;
}

class PluginManager {
  private plugins: Map<string, WebhookPlugin> = new Map();

  registerPlugin(plugin: WebhookPlugin) {
    this.plugins.set(plugin.name, plugin);
    AdapterFactory.registerAdapter(plugin.platform, plugin.adapter);
  }

  loadPlugin(pluginPath: string) {
    const plugin = require(pluginPath);
    this.registerPlugin(plugin);
  }
}
```

---

## 14. 常见问题

### Q1: 签名验证总是失败怎么办？

**A**: 检查以下几点：
1. 确保密钥正确，注意前后空格
2. 确认拼接字符串的格式和顺序
3. 检查 Base64 编码方式
4. 使用日志工具输出中间结果进行对比

### Q2: 如何测试 Webhook 推送？

**A**: 使用以下工具：
- ngrok: 将本地服务暴露到公网
- Webhook.site: 提供测试用的 Webhook URL
- curl: 手动发送请求

### Q3: 如何处理大量并发请求？

**A**: 
1. 使用消息队列（RabbitMQ、Kafka）缓冲请求
2. 增加 Worker 进程数量（PM2 cluster mode）
3. 实现请求限流和熔断机制

### Q4: 如何保证推送的可靠性？

**A**:
1. 实现重试机制（指数退避）
2. 记录推送日志，支持手动重试
3. 提供 Webhook 状态查询 API
4. 失败时发送告警通知

---

## 15. 参考文档

- [飞书开放平台 - Webhook](https://open.feishu.cn/document/ukTMukTMukTM/uEjNwUjLxYDM14iN2ATN)
- [企业微信 - 消息推送](https://developer.work.weixin.qq.com/document/path/90930)
- [钉钉开放平台 - 事件订阅](https://open.dingtalk.com/document/orgapp-server/subscribe-to-events)

---

## 附录：完整类型定义

```typescript
// src/types/platform.ts
export type Platform = 'feishu' | 'wecom' | 'dingtalk' | 'custom';

export interface TimeSettings {
  enabled: boolean;
  hours: number;
  minutes: number;
  seconds: number;
}

export interface WebhookEvent {
  eventId: string;
  eventType: 'new_message' | 'reply_message' | 'system_notice';
  platform: Platform;
  timestamp: number;
  data: {
    visitorId: string;
    visitorName?: string;
    message: string;
    messageType: 'text' | 'image' | 'file';
    attachments?: Array<{
      type: string;
      url: string;
      name: string;
    }>;
  };
  raw?: any;
}

export interface PlatformAdapter {
  parseRequest(req: any): Promise<WebhookEvent>;
  verifySignature(req: any, secret: string): boolean;
  generateSignature(payload: string, secret: string): string;
}

// src/types/webhook.ts
export interface Webhook {
  id: string;
  name: string;
  platform: Platform;
  url: string;
  secret?: string;
  headers?: Record<string, string>;
  enabled: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface WebhookStats {
  total: number;
  enabled: number;
  disabled: number;
  byPlatform: Record<Platform, number>;
}
```

---

**文档版本**: v1.0
**最后更新**: 2026-03-22
**维护者**: 开发团队
