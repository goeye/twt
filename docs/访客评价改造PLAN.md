# 访客评价改造方案

## Summary
- 采用 输入框上方常驻轻量入口，不采用常驻展开评价面板。
- 评价入口从会话创建开始一直可见，会话中和会话结束后都能操作。
- 评价规则改为可反复修改，始终以最后一次选择为准。
- 提交后入口保留已评价状态，用户可再次点击修改。

## Key Changes
- 在 [ChatView.vue](/Users/pg133/Downloads/TWT/TWT/twt/apps/web-customer/src/views/ChatView.vue#L61) 拆开当前 仅 `sessionEnded` 才显示评价卡 的逻辑。
- 在 [ChatView.vue](/Users/pg133/Downloads/TWT/TWT/twt/apps/web-customer/src/views/ChatView.vue#L110) 的 `.cw-input-area` 顶部新增常驻评价入口条，默认展示 `服务评价`，已评价后展示 `已评价 满意/一般/不满意` 和可修改态。
- 在 [ChatView.vue](/Users/pg133/Downloads/TWT/TWT/twt/apps/web-customer/src/views/ChatView.vue#L161) 新增本地状态 `isFeedbackPanelOpen` 和基于 `selectedFeedback` 的展示文案；选择任一评价后立即生效并自动收起面板。
- 活跃会话里点击入口后，在输入框上方展开紧凑评价面板，复用现有三档选项 `满意 / 一般 / 不满意`，不弹全屏、不遮挡发送主路径。
- 会话结束后保留现有结束页评价区，但改成展示当前已选结果并允许重新选择，不再把结束后评价当成唯一入口。
- 在 [WidgetCustomizePage.vue](/Users/pg133/Downloads/TWT/TWT/twt/apps/web-agent/src/views/WidgetCustomizePage.vue#L198) 把说明文案从 关闭后自动邀请评价 改成 会话创建后常驻显示评价入口，会话中和结束后都可评价。
- 在 [WidgetCustomizePage.vue](/Users/pg133/Downloads/TWT/TWT/twt/apps/web-agent/src/views/WidgetCustomizePage.vue#L569) 把预览从 结束态整块评价卡 改为 活跃会话中的输入区上方常驻入口，并默认展示一次展开态，方便配置页理解真实交互。
- 不改路由，不新增后端接口，不引入评价历史列表；外部可见的数据语义仍是 单个当前评价值。

## Public Interfaces / Types
- 无外部 API 变更。
- 内部仅新增 `web-customer` 页面级 UI 状态和一个明确的评价值类型，评价结果仍为单值枚举，最新选择覆盖旧值。

## Test Plan
- 进入会话后，即使一条消息都没发，评价入口也已出现。
- 入口可展开和收起，360px 到 420px 宽度下不挤坏输入区和发送按钮。
- 依次选择 满意 一般 不满意，入口状态实时更新，再次打开可修改，最终显示最后一次选择。
- 会话中先评价再继续发消息，发送链路不受影响。
- 未评价就结束、已评价后结束、结束后再次修改，这三条路径都能正常工作。
- 重置或重新创建会话后，评价值和面板展开状态都被清空。
- 验证构建 `pnpm build:web-customer`；若同步改配置预览，再跑 `pnpm build:web-agent`。

## Assumptions
- 这轮先做前端原型交互，不补后端持久化、报表口径调整和评价历史审计。
- v1 保留固定入口文案，不新增新的可配置字段；现有评价标题继续作为评价面板标题使用。
- 不采用常驻展开方案，因为访客窗主宽度只有 360 到 420px，长期展开三档评价会持续侵占消息区和输入区。
