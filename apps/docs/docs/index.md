---
home: true
title: TWT Chat 开发者文档
heroText: TWT Chat 开发者文档
tagline: 快速接入在线客服，为你的网站和应用添加实时聊天能力
actions:
  - text: 3 分钟接入
    link: /guide/quickstart
    type: primary
  - text: 开放 API
    link: /api/
    type: secondary
features:
  - title: 网站小部件
    details: 一行代码嵌入聊天组件到你的网站，支持自定义外观和行为
    link: /widget/
  - title: 聊天页面
    details: 生成独立聊天链接或自托管 HTML 页面，适用于邮件、App、社交媒体等场景
    link: /chat-page/
  - title: Webhooks
    details: 实时接收平台事件推送，与你的业务系统无缝集成
    link: /webhooks/
  - title: 开放 API
    details: 通过 REST API 管理会话、发送消息，实现深度业务集成
    link: /api/
---

## 3 分钟接入

将以下代码粘贴到你网站的 `</body>` 标签之前，即可完成接入：

```html
<!-- Start of TWT Chat code -->
<script>
window.__twt__config = {
  appid: "你的APPID",
  lang: "zh-cn",
  theme: "light"
};
(function(n, t) {
  var e = { init: function() {
    var n = t.createElement("script");
    n.async = !0;
    n.type = "text/javascript";
    n.src = "https://visitorchat.twt.com/install/core.js?version=v1.2";
    t.head.appendChild(n);
  }};
  e.init();
})(window, document);
</script>
<!-- End of TWT Chat code -->
```

**三步完成：**

1. 登录 [TWT Chat 后台](https://app.twt.com)，进入 **设置 > 网站代码**，复制安装代码
2. 将代码粘贴到网站每个页面的 `</body>` 标签之前
3. 刷新网页，页面右下角出现聊天浮窗图标

::: tip 开始使用
还没有账号？[免费注册 TWT Chat](https://app.twt.com) 获取 API Key，3 分钟完成接入。
:::
