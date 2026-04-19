# 3 分钟接入

快速完成 TWT Chat 接入。

## 第 1 步：获取安装代码

登录 [TWT Chat 客服端](https://twt.chat.com)，进入 **设置 > 安装 > 网站代码**，复制安装代码片段。

## 第 2 步：粘贴到网页

将代码粘贴到你网站每个页面的 `</body>` 标签之前：

```html
<!-- Start of TWT Chat code -->
<script>
  window.TWTChatWidget = window.TWTChatWidget || {
    _q: [],
    on: function () {
      this._q.push(["on", Array.prototype.slice.call(arguments)]);
    },
  };

  window.__twt__config = {
    appid: "你的APPID",
    icon: "1",
  };

  (function (n, t) {
    var e = {
      init: function () {
        var n = t.createElement("script");
        n.async = !0;
        n.type = "text/javascript";
        n.src = "https://visitorchat.twt.com/install/core.js?version=v1.2";
        t.head.appendChild(n);
      },
    };
    e.init();
  })(window, document);
</script>
<!-- End of TWT Chat code -->
```

## 第 3 步：验证

刷新网页，页面右下角应出现聊天浮窗图标。点击即可发起对话。

## 下一步

- [JavaScript API](/widget/javascript-api) — 调整外观和行为
- [JavaScript API](/widget/javascript-api) — 程序化控制聊天组件
- [传递客户信息](/chat-page/parameters) — 将已登录用户信息同步到聊天

::: tip 开始使用
还没有账号？[免费注册 TWT Chat](https://twt.com) 获取 API Key，3 分钟完成接入。
:::
