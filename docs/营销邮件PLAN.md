# Autopilot 多语言营销邮件与预览页方案

## Summary
- 交付一个多语言营销邮件方案，面向现有客户，核心目标是宣布 Autopilot 上线并推动立即试用。
- 最终产物包含两部分：
  1. 一个内部预览页，支持语言切换查看实际邮件效果
  2. 三份可直接发送的独立邮件 HTML：`zh-cn`、`en`、`zh-tw`
- 不接入发送系统，不改全站 i18n，不同步改官网产品动态页。

## Implementation Changes
- 在 [router.ts](/Users/pg133/Downloads/TWT/TWT/twt/apps/web-website/src/router.ts) 新增内部预览路由 `/email-previews/autopilot-launch`，不挂到主导航，仅作为设计验收和链接校对入口。
- 新增预览页 [EmailPreviewAutopilotPage.vue](/Users/pg133/Downloads/TWT/TWT/twt/apps/web-website/src/views/EmailPreviewAutopilotPage.vue)，使用本地 `LangKey = 'zh-cn' | 'en' | 'zh-tw'` 状态切换语言，页面包含：
  - 顶部语言切换 Tabs
  - 打开原始 HTML 的快捷入口
  - 居中邮件画布预览区
  - 预览区直接通过 `iframe` 加载真实静态邮件文件，避免预览内容和最终发送模板不一致
- 在 [public/emails](/Users/pg133/Downloads/TWT/TWT/twt/apps/web-website/public/emails) 新增三份静态邮件模板：
  - `autopilot-launch-v1-6-2.zh-cn.html`
  - `autopilot-launch-v1-6-2.en.html`
  - `autopilot-launch-v1-6-2.zh-tw.html`
- 三份邮件结构保持完全一致，只替换对应语言文案。固定结构为：
  1. `preheader` 概述 Autopilot 上线和最近更新
  2. 品牌头部 `TWT Chat`
  3. Hero 区，强调 `Autopilot 机器人正式上线`
  4. 核心说明，讲清自动接待、知识库驱动回复、必要时转人工
  5. 三张价值卡，分别对应 自动接待、智能回复、无缝转人工
  6. 主 CTA 按钮，文案按语言本地化，目标统一为立即试用
  7. 最近更新区，固定包含四条：
     - 支持自定义聊天小组件
     - 支持角色权限控制
     - APP 更新 1.6.2 版本
     - 支持档案功能
  8. 页脚支持邮箱与轻量说明
- 邮件实现按真实 EDM 标准处理：
  - 单文件 HTML
  - table 布局
  - inline CSS
  - 无 JS
  - 内容宽度 640px
  - 兼容移动端单列
  - CTA 使用 bulletproof button 风格
  - 尽量不依赖外链图片，装饰效果用纯 HTML/CSS 完成
- 视觉延续官网品牌基调，但邮件本身走精致发布风格：官网蓝为主色，深色标题，浅灰背景，柔和渐变 Hero，圆角卡片，强 CTA，对已有客户更像高质量版本发布通知。

## Interfaces
- 新增预览路由：`/email-previews/autopilot-launch`
- 预览页支持 `?lang=zh-cn|en|zh-tw` 作为默认展示语言，便于直接分享指定语言的验收链接
- 静态邮件公开路径固定为：
  - `/emails/autopilot-launch-v1-6-2.zh-cn.html`
  - `/emails/autopilot-launch-v1-6-2.en.html`
  - `/emails/autopilot-launch-v1-6-2.zh-tw.html`
- 不新增全站 i18n 依赖，不修改现有公共组件接口

## Test Plan
- 访问预览页时默认展示 `zh-cn`，切换语言后 iframe 正确切换到对应 HTML，`?lang=` 参数可直接生效。
- 三份 HTML 都要检查桌面和手机宽度下的排版，确保标题、CTA、更新区不挤压、不换行失控。
- 每个语言版本都必须包含 Autopilot 上线说明和四条最近更新，且按钮、标题、段落语言一致，不混语。
- 在禁用图片场景下验证邮件仍完整可读，CTA 明显可点。
- 在浏览器和至少一种真实邮件预览环境里检查按钮、圆角、间距、字体回退和链接有效性。

## Assumptions
- 多语言范围固定为产品现有语言键：`zh-cn`、`en`、`zh-tw`。
- 最终交付同时包含预览页和三份真实模板，预览页只用于内部验收，不放进营销导航。
- 三个语言版本使用同一个 CTA 目标链接，默认指向 `https://www.twt.com`。
- `APP 更新 1.6.2 版本，支持档案功能` 按你的需求作为本次邮件口径，不额外展开未在仓库里明确落地的细节。
