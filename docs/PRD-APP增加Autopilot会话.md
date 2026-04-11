# PRD - APP 增加 Autopilot 会话

## 需求概述

在 mobile-app 的档案页面中增加 Autopilot 会话的显示和管理功能，支持分配会话和接管会话操作。

## 功能范围

### 包含功能

- 档案页面的会话记录列表中显示 Autopilot 会话
- 支持按 Autopilot 参与情况筛选会话
- 支持分配 Autopilot 会话给客服
- 支持客服接管 Autopilot 会话

### 排除功能

- 不支持在 APP 中配置 Autopilot 设置（Autopilot 配置在 web-agent 中完成）
- 不支持查看 Autopilot 的回复历史统计

## 数据结构

### 会话记录对象扩展

在档案页面的会话记录列表中，会话对象需包含 Autopilot 相关字段：

```typescript
interface ConversationRecord {
  id: string;
  title: string;
  visitorName: string;
  status: 'pending-reply' | 'queueing' | 'processing' | 'replied' | 'closed';
  owner: string;  // 会话负责人（可能是 Autopilot 或客服名称）
  staffCount: number;
  staffAgents: StaffAgent[];  // 参与服务的客服列表
  aiAgentHandled: boolean;  // 是否由 Autopilot 处理过
  // ... 其他字段
}

interface StaffAgent {
  name: string;
  avatarText: string;
  avatarColor: string;
  avatarUrl?: string;
  role?: string;  // 如 "客服" 或 "Autopilot"
}
```

### Autopilot 身份识别

- Autopilot 的默认昵称为 "Autopilot"（可在 web-agent 中自定义）
- 当 `owner` 字段值为 Autopilot 昵称时，识别为 Autopilot 负责的会话
- 当 `aiAgentHandled` 字段为 `true` 时，表示该会话曾由 Autopilot 处理过

## 交互规则

### 会话列表中的 Autopilot 会话显示

**Autopilot 会话识别**
- 当会话的 `owner` 字段值为 Autopilot 昵称时，在会话列表中标识为 Autopilot 会话
- Autopilot 会话的头像使用 Autopilot 的自定义头像（如有）或默认头像

**会话状态显示**
- Autopilot 会话支持所有会话状态：待回复、排队中、待处理、已回复、已关闭
- 会话状态的显示规则与普通会话一致

**服务客服列表**
- 如果 Autopilot 会话被客服接管，`staffAgents` 列表中包含 Autopilot 和接管客服
- 服务客服列表按参与时间顺序排列

### 筛选功能

**按 Autopilot 参与情况筛选**
- 筛选选项：全部、Autopilot 参与、无 Autopilot 参与
- "Autopilot 参与"：筛选 `aiAgentHandled` 为 `true` 的会话
- "无 Autopilot 参与"：筛选 `aiAgentHandled` 为 `false` 的会话

**筛选器位置**
- 在档案页面的筛选区域中，与状态、客服、标签等筛选器并列

### 会话操作

**接管 Autopilot 会话**

触发条件：
- 会话的 `owner` 字段值为 Autopilot 昵称
- 会话状态不为"已关闭"

操作流程：
1. 客服在会话操作菜单中点击"接管会话"
2. 弹出确认弹窗，标题"确认接管"，内容"确认接管该会话吗？"
3. 客服点击"确认"后，执行接管操作
4. 接管成功后，会话的 `owner` 字段更新为当前客服昵称
5. 当前客服添加到 `staffAgents` 列表中
6. 如果会话状态为"排队中"，更新为"待回复"
7. 自动跳转到会话聊天详情页面

操作结果：
- 会话负责人从 Autopilot 变更为当前客服
- 会话在当前客服的会话列表中显示
- 会话的接待时间更新为接管时间（如果之前未接待）

**分配 Autopilot 会话**

触发条件：
- 会话的 `owner` 字段值为 Autopilot 昵称
- 会话状态不为"已关闭"

操作流程：
1. 客服在会话操作菜单中点击"分配会话"
2. 弹出客服选择弹窗，显示可分配的客服列表
3. 客服列表按在线状态排序：在线客服优先显示
4. 客服选择目标客服后，点击"确认"
5. 分配成功后，会话的 `owner` 字段更新为目标客服昵称
6. 目标客服添加到 `staffAgents` 列表中
7. 如果会话状态为"排队中"，更新为"待回复"

操作结果：
- 会话负责人从 Autopilot 变更为目标客服
- 会话在目标客服的会话列表中显示
- 会话的接待时间更新为分配时间（如果之前未接待）

**查看 Autopilot 会话**

触发条件：
- 会话的 `owner` 字段值为 Autopilot 昵称

操作流程：
1. 客服在会话操作菜单中点击"查看会话"
2. 跳转到已归档会话详情页面 (`/archive/session/:id`)
3. 页面底部显示"接管"和"分配"按钮

### 会话操作菜单逻辑

**Autopilot 会话的操作菜单**
- 接管会话
- 分配会话
- 查看会话

**排队中会话的操作菜单**
- 领取会话
- 分配会话
- 查看会话

**其他客服负责的会话操作菜单**
- 分配会话
- 查看会话

## 页面位置

**档案页面** (`/archive`)
- 在"会话记录"标签页的会话列表中显示 Autopilot 会话
- 在筛选区域中增加"Autopilot 参与"筛选器

**已归档会话详情页面** (`/archive/session/:id`)
- 显示 Autopilot 会话的完整聊天记录
- 页面底部显示"接管"和"分配"按钮（如果会话由 Autopilot 负责）

## 边界情况

**Autopilot 昵称变更**
- 如果 Autopilot 昵称在 web-agent 中被修改，APP 需同步更新
- 历史会话中的 Autopilot 昵称保持不变（记录历史状态）

**Autopilot 禁用**
- 如果 Autopilot 在 web-agent 中被禁用，已有的 Autopilot 会话仍正常显示
- 不再产生新的 Autopilot 会话

**接管失败**
- 如果接管操作失败（如网络错误），显示错误提示："接管失败，请重试"
- 不更新会话状态，保持原有负责人

**分配失败**
- 如果分配操作失败（如目标客服离线），显示错误提示："分配失败，请重试"
- 不更新会话状态，保持原有负责人

**并发操作**
- 如果多个客服同时接管同一 Autopilot 会话，以服务端响应为准
- 后接管的客服显示提示："该会话已被其他客服接管"

**Autopilot 头像缺失**
- 如果 Autopilot 未设置自定义头像，使用默认头像（首字母头像）
- 默认头像文本为 Autopilot 昵称的首字符

## 参考实现

**web-agent 中的 Autopilot 会话管理**
- 会话列表：`apps/web-agent/src/components/archive/ArchiveConversationTab.vue`
- 分配弹窗：`apps/web-agent/src/components/archive/ArchiveAssignModal.vue`
- 工具函数：`apps/web-agent/src/lib/archiveUtils.ts`
- Autopilot 设置：`apps/web-agent/src/lib/aiAgentSettings.ts`

**web-agent 中的操作逻辑**
- 接管会话：`handleTakeoverAutopilot` 函数
- 分配会话：`handleAssignConfirm` 函数
- 领取会话：`confirmClaimSession` 函数

**mobile-app 中的现有实现**
- 已归档会话详情：`apps/mobile-app/src/views/ArchiveSessionDetailView.vue`
- 已支持会话操作按钮：分配、接管、加入、进入、领取、删除
- 需要根据会话负责人（Autopilot 或客服）显示对应操作按钮
