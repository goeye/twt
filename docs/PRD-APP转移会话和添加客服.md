# PRD - APP 转移会话和添加客服

## 需求概述

在 mobile-app 中实现转移会话和添加客服功能，与 web-agent 的操作逻辑保持一致。客服可以将会话转移给其他客服，或邀请其他客服加入会话协作。

## 功能范围

### 包含功能

- 会话信息页面支持转移会话
- 会话信息页面支持添加客服
- 转移会话后生成系统消息
- 添加客服后生成系统消息

### 排除功能

- 不支持批量转移会话
- 不支持批量添加客服

## 数据结构

### 会话对象扩展

```typescript
interface ConversationSession {
  id: string;
  queueKey: 'pending-reply' | 'queueing' | 'processing' | 'resolved';
  owner: string;           // 会话负责人
  staffAgents: StaffAgent[];  // 参与服务的客服列表
  closed?: boolean;        // 是否已关闭
  claimed?: boolean;       // 是否已领取（排队会话）
  // ... 其他字段
}

interface StaffAgent {
  name: string;
  avatarText: string;
  avatarColor: string;
  avatarUrl?: string;
  role?: string;  // 如 "会话负责人"
}
```

### 客服对象

```typescript
interface Agent {
  id: number;
  name: string;
  initial: string;
  color: string;
  online: boolean;
}
```

### 系统消息对象

```typescript
interface Message {
  id: number;
  type: 'system';
  role: 'system';
  sender: '系统';
  content: string;  // 系统消息文案
  time: string;     // HH:mm 格式
}
```

## 交互规则

### 转移会话

**触发条件**
- 会话未关闭（`closed !== true`）
- 不能在排队中状态转移（除非已领取）
- 当前客服是会话负责人

**触发入口**
- 会话信息页面（`/session/:id/info`）的"会话信息"标签页
- 在"服务客服"区域的底部，显示"转移会话"按钮

**操作流程**

1. **打开转移页面**
   - 客服在会话信息页面点击"转移会话"按钮
   - 跳转到转移会话页面（`/session/:id/transfer`）

2. **选择目标客服**
   - 显示可转移的客服列表
   - 客服列表按在线/离线状态排序（在线客服优先）
   - 排除当前客服自己
   - 支持搜索功能

3. **确认转移**
   - 客服点击目标客服旁边的"转移"按钮
   - 弹出确认弹窗，标题"确认转移"，内容"转移后你将自动移出当前会话"
   - 客服点击"确认"后执行转移

4. **转移结果**
   - 会话的 `owner` 字段更新为目标客服昵称
   - 当前客服从 `staffAgents` 列表中移除
   - 生成系统消息：`${当前客服名}已将会话转移给${目标客服名}`
   - 显示 Toast 提示："转移成功"
   - 1.2 秒后自动返回会话列表页面（`/session`）
   - 会话从当前客服的会话列表中移除

**系统消息格式**
- 类型：`type: 'system'`
- 角色：`role: 'system'`
- 发送者：`sender: '系统'`
- 内容：`${当前客服名}已将会话转移给${目标客服名}`
- 时间：HH:mm 格式（如 "14:23"）

**确认弹窗样式**
- 标题："确认转移"
- 描述："转移后你将自动移出当前会话"
- 按钮：取消（灰色背景）、确认（红色背景）

### 添加客服

**触发条件**
- 会话未关闭（`closed !== true`）
- 当前客服是会话负责人或参与客服

**触发入口**
- 会话信息页面（`/session/:id/info`）的"会话信息"标签页
- 在"服务客服"区域的标题右侧，显示"+ 添加"按钮

**操作流程**

1. **打开添加客服页面**
   - 客服在会话信息页面点击"+ 添加"按钮
   - 跳转到添加客服页面（`/session/:id/add-agent`）

2. **选择客服**
   - 显示可添加的客服列表
   - 客服列表按在线/离线状态排序（在线客服优先）
   - 支持多选
   - 支持搜索功能

3. **查看已选择**
   - 底部显示"已选择 (N)"按钮，点击后弹出已选择面板
   - 已选择面板显示已选客服列表，支持移除

4. **确认添加**
   - 客服点击底部的"确认"按钮
   - 选中的客服添加到 `staffAgents` 列表中
   - 生成系统消息：`${当前客服名}添加了${客服名列表}加入会话`
   - 显示 Toast 提示："添加成功"
   - 1.2 秒后自动返回会话信息页面（`/session/:id/info?tab=session`）

**系统消息格式**
- 类型：`type: 'system'`
- 角色：`role: 'system'`
- 发送者：`sender: '系统'`
- 内容：`${当前客服名}添加了${客服名列表}加入会话`
- 时间：HH:mm 格式（如 "14:23"）

**客服名列表格式**
- 如果添加 1-3 个客服：`张三、李四、王五`
- 如果添加 4 个及以上客服：`张三、李四、王五等N人`

**已选择面板**
- 从底部弹出的半屏面板
- 标题："已选择"
- 显示已选客服的头像、昵称
- 每个客服右侧显示"移除"按钮

### 客服列表排序规则

**排序优先级**
1. 在线状态：在线客服优先显示
2. 字母顺序：同一在线状态下按昵称字母顺序排列

**在线状态显示**
- 在线客服：头像右下角显示绿色圆点
- 离线客服：头像右下角显示灰色圆点

### 权限控制

**转移会话权限**
- 当前客服必须是会话负责人（`owner === 当前客服昵称`）
- 不能在排队中状态转移（除非已领取）
- 不能在已关闭会话中转移

**添加客服权限**
- 当前客服必须是会话负责人或参与客服
- 不能在已关闭会话中添加客服

## 页面位置

**会话信息页面** (`/session/:id/info`)
- 在"会话信息"标签页的"服务客服"区域
- 标题右侧显示"+ 添加"按钮
- 客服列表下方显示"转移会话"按钮

**转移会话页面** (`/session/:id/transfer`)
- 独立的全屏页面
- 包含搜索框、客服列表、确认弹窗

**添加客服页面** (`/session/:id/add-agent`)
- 独立的全屏页面
- 包含搜索框、客服列表、已选择面板、底部操作栏

## 边界情况

**已关闭会话**
- 如果会话已关闭，不显示"转移会话"和"+ 添加"按钮

**排队中会话**
- 排队中会话不能转移（除非已领取）
- 排队中会话可以添加客服

**转移给离线客服**
- 支持转移给离线客服
- 离线客服在客服列表中显示，但排在在线客服之后

**添加已存在的客服**
- 如果选择的客服已在 `staffAgents` 列表中，不重复添加
- 添加时自动过滤已存在的客服

**转移失败**
- 如果转移操作失败（如网络错误），显示错误提示："转移失败，请重试"
- 不更新会话状态，保持原有负责人

**添加失败**
- 如果添加操作失败（如网络错误），显示错误提示："添加失败，请重试"
- 不更新 `staffAgents` 列表

**并发操作**
- 如果多个客服同时转移同一会话，以服务端响应为准
- 后转移的客服显示提示："该会话已被其他客服转移"

**空选择**
- 添加客服时，如果未选择任何客服，"确认"按钮禁用
- 按钮样式：浅蓝色背景，不可点击

**搜索无结果**
- 如果搜索关键词无匹配结果，显示空列表
- 不显示"无结果"提示

## 参考实现

**web-agent 中的转移会话功能**
- 文件：`apps/web-agent/src/App.vue`
- 转移弹窗：`packages/ui-agent/src/components/overlay/TransferModal.vue`
- 转移函数：`handleConfirmTransfer` (第 3732-3761 行)
- 系统消息生成：`${currentAgentName}已将会话转移给${newOwner.name}`

**web-agent 中的添加客服功能**
- 文件：`apps/web-agent/src/views/SettingsAgentsPage.vue`
- 邀请弹窗：`packages/ui-agent/src/components/overlay/InviteModal.vue`
- 会话头部：`packages/ui-agent/src/components/conversation/ConversationHeader.vue`

**mobile-app 中的现有实现**
- 转移会话页面：`apps/mobile-app/src/views/TransferSessionView.vue`
- 添加客服页面：`apps/mobile-app/src/views/AddAgentView.vue`
- 会话信息页面：`apps/mobile-app/src/views/SessionInfoView.vue`
- 当前实现已包含完整的 UI 和交互逻辑
- 需要确保系统消息生成和会话状态更新逻辑与 web-agent 一致

**系统消息存储方式**
- 当前实现使用 `sessionStorage` 存储待发送的系统消息
- 键名：`pendingSystemMessages`
- 格式：`{ [sessionId]: [message1, message2, ...] }`
- 在会话详情页面加载时读取并显示
