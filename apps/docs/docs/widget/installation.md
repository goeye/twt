# 3 分钟接入

在你网站的每个页面上嵌入 TWT Chat 聊天小部件。

## 安装步骤

在每个网页的 `</body>` 标签之前，复制并粘贴以下代码：

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

::: tip 提示
你可以在 TWT Chat 后台的 **设置 > 安装 > 网站代码** 页面直接复制已填入 `appid` 的代码。
:::

## 配置字段说明

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `appid` | string | 是 | 应用唯一标识，在后台获取 |
| `lang` | string | 否 | 界面语言，可选 `zh-cn`、`zh-tw`、`en` |
| `theme` | string | 否 | 主题模式，可选 `light`、`dark` |
| `icon` | string | 否 | 浮窗图标样式，`"1"` 显示默认图标，`"2"` 隐藏图标 |
| `sbs` | string | 否 | 用户唯一标识 |
| `sbs_mm` | string | 否 | 用户签名 |
| `ranstr` | string | 否 | 随机字符串（建议 16 位以上） |
| `name` | string | 否 | 用户姓名 |
| `nickname` | string | 否 | 用户备注名 |
| `email` | string | 否 | 用户邮箱 |
| `phone` | string | 否 | 用户电话 |

关于客户信息字段的详细说明，请参阅 [URL 参数与客户信息](/chat-page/parameters)。
