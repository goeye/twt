# web-agent 更新日志

## 2026-03-04 18:45

### 修复聊天窗口消息方向

**修改文件：**
- `apps/web-agent/src/views/ProactiveCampaignRoutePage.vue`

**修改内容：**
1. **消息数据结构改造**：`visitorChatMessages` 从 `string[]` 改为 `{ role: "visitor" | "agent"; text: string }[]`，区分消息来源
2. **点击客服通知 → 客服消息展示在左侧**：`clickAgentNotification` 以 `role: "agent"` 写入消息，在聊天窗口中渲染为左侧灰色气泡
3. **点击营销按钮 → 访客消息展示在右侧**：`handleVisitorBubbleAction` 以 `role: "visitor"` 写入消息，渲染为右侧蓝色气泡
4. **模板根据 role 动态绑定样式**：`visitor-chat-msg--agent` / `visitor-chat-msg--visitor` 及对应 `__bubble` 样式

## 2026-03-04 18:30

### 客服通知气泡样式优化

**修改文件：**
- `apps/web-agent/src/views/ProactiveCampaignRoutePage.vue`

**修改内容：**
1. **模拟客服消息时隐藏营销卡片**：点击"+ 模拟客服消息"后自动设置 `visitorBubbleDismissed = true`，只展示客服消息通知气泡
2. **关闭按钮移至气泡上方**：通知气泡的关闭按钮从每条气泡内移至整组通知上方右侧（`top: -32px`），深色半透明圆形，与营销卡片关闭按钮风格一致；点击一次关闭所有通知
3. **移除气泡内关闭按钮和多余元素**：通知气泡内只保留纯文本，无头像、无昵称、无内联关闭按钮

## 2026-03-04 18:10

### 访客端视角：客服通知气泡 & 模式切换修复

**修改文件：**
- `apps/web-agent/src/views/ProactiveCampaignRoutePage.vue`

**修改内容：**
1. **客服主动消息通知气泡**：FAB 按钮上方新增通知气泡区域，最多纵向堆叠 3 条消息；第 4 条自动淘汰最旧一条；每条带 [×] 关闭按钮；点击气泡打开聊天窗口并发送对应消息内容；通过"+ 模拟客服消息"按钮可触发模拟数据
2. **修复模式切换不恢复营销气泡**：切换预览模式时调用 `switchVisitorPreviewMode`，自动重置 `visitorBubbleDismissed = false`、关闭聊天窗口、清空通知；解决关闭气泡后切换模式看不到内容的问题
3. **修复超出滚动模式标题/描述不显示**：根因同 #2，关闭气泡后 `v-if="!visitorBubbleDismissed"` 导致整个 section 隐藏；模式切换重置后标题和描述正常展示

## 2026-03-04 17:30

### 营销模版与交互优化

**修改文件：**
- `apps/web-agent/src/views/ProactiveCampaignRoutePage.vue`

**修改内容：**
1. **新增自定义模版**：模版库末尾增加"自定义"模版，进入后标题默认为"自定义"、描述默认为"自定义"
2. **模版弹窗图片优化**：重写 `createTemplatePreviewImage` 函数，为每个模版生成独立风格的 SVG 预览图（含主题色渐变背景 + 居中图标 + 英文标签），图片比例改为 16:9；网格布局改为 3 列
3. **欢迎访客模版调整**：标题改为"欢迎"，描述改为"用友好的问候语给访客留下良好的第一印象"
4. **关注社交媒体模版调整**：标题改为"关注我们"，描述改为"引导关注你的社交媒体账号，保持互动"
5. **限时优惠模版调整**：标题改为"限时优惠"，描述改为"推送限时折扣活动，提升转化率"
6. **新增客服引导模版**：标题"客服引导"，描述"主动邀请访客进行在线咨询，提升服务体验"，默认按钮为"立即咨询"+"稍后再说"
7. **关闭按钮位置调整**：气泡关闭按钮从卡片内右上角移至卡片正上方（`top: -32px`），深色半透明圆形样式，hover 加深
8. **修复按钮不可点击**：在 `.preview-bubble--visitor-modal` 作用域内覆盖 `pointer-events: none`，使访客视角弹窗中的按钮可点击并触发聊天窗口

## 2026-03-04 16:30

### 修复访客端视角弹窗 UI

**修改文件：**
- `packages/ui-agent/src/components/overlay/BaseModal.vue`
- `apps/web-agent/src/views/ProactiveCampaignRoutePage.vue`

**修改内容：**
1. **BaseModal 组件增加 `maxWidth` prop**：新增可选属性 `maxWidth`（默认 `"560px"`），通过内联 style 绑定覆盖 CSS 硬编码值，完全向后兼容
2. **访客端视角弹窗传入 `max-width="800px"`**：解决弹窗内容（760px）溢出容器（560px）的根因
3. **添加默认占位图**：当 `headerImage` 为空字符串时，自动使用内联 SVG DataURL 作为 placeholder，确保预览气泡中始终显示图片
4. **移除冗余的内容固定宽度**：`.visitor-preview-modal` 不再设置 `width: min(760px, 78vw)`，宽度由 BaseModal 的 `maxWidth` 统一控制
5. **预览画布区域微调**：`min-height` 由 `430px` 增加至 `460px`，避免预览气泡底部被截断
