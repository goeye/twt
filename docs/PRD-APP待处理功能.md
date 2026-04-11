# PRD - APP 待处理功能

## 需求概述

在 mobile-app 中实现"待处理"功能，与 web-agent 的操作逻辑保持一致。客服可以将会话标记为待处理状态，用于标识需要后续跟进的会话。

## 功能范围

### 包含功能

- 会话详情页面中支持标记为待处理
- 会话详情页面中支持取消待处理
- 会话列表中支持按待处理状态筛选
- 待处理会话在会话列表中显示

### 排除功能

- 不支持批量标记待处理

## 数据结构

### 会话状态定义

会话队列状态（`queueKey`）支持以下值：

- `'pending-reply'` - 待回复
- `'queueing'` - 排队中
- `'processing'` - 待处理
- `'resolved'` - 已回复

### 会话对象扩展

```typescript
interface ConversationSession {
  id: string;
  queueKey: 'pending-reply' | 'queueing' | 'processing' | 'resolved';
  closed?: boolean;  // 是否已关闭
  // ... 其他字段
}
```

## 交互规则

### 标记为待处理

**触发条件**
- 会话未关闭（`closed !== true`）
- 当前状态不是待处理（`queueKey !== 'processing'`）

**触发入口**
- 会话详情页面的操作菜单中，显示"标记待处理"选项

**操作流程**
1. 客服在会话详情页面点击操作菜单（右上角三点图标）
2. 在菜单中点击"标记待处理"
3. 会话的 `queueKey` 字段更新为 `'processing'`
4. 显示 Toast 提示："已标记为待处理"
5. 会话在会话列表中移动到"待处理"标签页

**状态变更**
- 会话从当前队列（待回复/已回复）移动到待处理队列
- 会话的 `queueKey` 字段从原值更新为 `'processing'`

### 取消待处理

**触发条件**
- 会话未关闭（`closed !== true`）
- 当前状态是待处理（`queueKey === 'processing'`）

**触发入口**
- 会话详情页面的操作菜单中，显示"取消待处理"选项

**操作流程**
1. 客服在会话详情页面点击操作菜单
2. 在菜单中点击"取消待处理"
3. 会话的 `queueKey` 字段更新为 `'pending-reply'`
4. 显示 Toast 提示："已取消待处理"
5. 会话在会话列表中移动到"待回复"标签页

**状态变更**
- 会话从待处理队列移动到待回复队列
- 会话的 `queueKey` 字段从 `'processing'` 更新为 `'pending-reply'`

### 会话列表中的待处理显示

**会话列表标签页**
- 在会话列表页面（`/session`）中，支持四个标签页：待回复、排队中、待处理、已回复
- 当前实现中已有四个标签，待处理标签对应 `queueKey === 'processing'` 的会话

**筛选规则**
- 点击"待处理"标签时，只显示 `queueKey === 'processing'` 的会话
- 待处理会话按时间倒序排列（最新的在前）

**会话卡片显示**
- 待处理会话的卡片样式与其他会话一致
- 不需要特殊的视觉标识

### 操作菜单逻辑

**会话详情页面的操作菜单**

当前会话状态为待处理时：
- 修改标题
- 访客信息
- 会话信息
- 取消待处理 ← 新增
- 结束会话

当前会话状态不是待处理时：
- 修改标题
- 访客信息
- 会话信息
- 标记待处理 ← 新增
- 结束会话

**菜单项显示规则**
- 如果会话已关闭，不显示"标记待处理"和"取消待处理"选项
- 如果会话状态是待处理，显示"取消待处理"，隐藏"标记待处理"
- 如果会话状态不是待处理，显示"标记待处理"，隐藏"取消待处理"

## 页面位置

**会话详情页面** (`/session/:id`)
- 在右上角操作菜单中增加"标记待处理"或"取消待处理"选项

**会话列表页面** (`/session`)
- 在"待处理"标签页中显示待处理会话
- 当前实现中已有"待处理"标签，需要确保筛选逻辑正确

## 业务场景

**待处理状态的典型使用场景**

1. **需要后续跟进的会话** - 客户提出复杂问题，需要查询资料或等待其他部门反馈
2. **等待客户回复** - 已发送解决方案，等待客户确认或反馈
3. **暂时无法处理** - 客服当前忙碌，需要标记以便后续处理
4. **需要特殊处理** - 涉及退款、投诉等需要特殊审批的问题

**与其他状态的区别**
- **待回复 vs 待处理**：待回复是初始状态，待处理是客服主动标记的状态
- **待处理 vs 已回复**：已回复表示问题已解决，待处理表示仍需处理
- **待处理 vs 排队中**：排队中是系统自动分配，待处理是客服手动标记

## 边界情况

**已关闭会话**
- 如果会话已关闭（`closed === true`），不显示"标记待处理"和"取消待处理"选项
- 已关闭的待处理会话在会话列表中不显示

**排队中会话**
- 排队中会话可以标记为待处理
- 标记后会话状态从"排队中"变为"待处理"

**已回复会话**
- 已回复会话可以标记为待处理
- 标记后会话状态从"已回复"变为"待处理"

**操作失败**
- 如果标记待处理操作失败（如网络错误），显示错误提示："操作失败，请重试"
- 不更新会话状态，保持原有状态

**并发操作**
- 如果多个客服同时操作同一会话，以服务端响应为准
- 客户端需要同步服务端的最新状态

## 参考实现

**web-agent 中的待处理功能**
- 文件：`apps/web-agent/src/App.vue`
- 标记待处理函数：`markSessionAsPending` (第 4013-4020 行)
- 取消待处理函数：`removeSessionFromPending` (第 4022-4029 行)
- 会话队列导航：`packages/ui-agent/src/components/session/SessionQueueNav.vue`

**web-agent 中的操作逻辑**
```typescript
// 标记为待处理
const markSessionAsPending = () => {
  if (!activeSession.value || activeSession.value.queueKey === "processing") return;
  allSessions.value = allSessions.value.map((s) => {
    if (s.id !== activeSession.value!.id) return s;
    return { ...s, queueKey: "processing" };
  });
  if (activeQueueKey.value !== "all-online") activeQueueKey.value = "processing";
};

// 取消待处理
const removeSessionFromPending = () => {
  if (!activeSession.value || activeSession.value.queueKey !== "processing") return;
  allSessions.value = allSessions.value.map((s) => {
    if (s.id !== activeSession.value!.id) return s;
    return { ...s, queueKey: "pending-reply" };
  });
  if (activeQueueKey.value !== "all-online") activeQueueKey.value = "pending-reply";
};
```

**mobile-app 中的现有实现**
- 会话详情页面：`apps/mobile-app/src/views/SessionDetailView.vue`
- 会话列表页面：`apps/mobile-app/src/views/SessionView.vue`
- 当前会话列表已支持四个标签：待回复、排队中、待处理、已回复
- 需要在会话详情页面的操作菜单中增加"标记待处理"和"取消待处理"选项
