# 示例项目

可直接复制运行的完整接入示例。

## 纯 HTML 最小接入

将以下内容保存为 `.html` 文件，用浏览器打开即可看到效果：

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>TWT Chat Demo</title>
</head>
<body>
  <h1>TWT Chat 接入示例</h1>
  <p>页面右下角应出现聊天浮窗图标。</p>

  <script>
  window.__twt__config = {
    appid: "你的APPID",
    lang: "zh-cn",
    theme: "light",
    sbs: "",
    sbs_mm: "",
    ranstr: "",
    name: "",
    nickname: "",
    email: "",
    phone: "",
    icon: "1"
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
</body>
</html>
```

## React 项目接入

```jsx
import { useEffect } from 'react';

function App() {
  useEffect(() => {
    window.__twt__config = {
      appid: '你的APPID',
      lang: 'zh-cn',
      theme: 'light',
    };

    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://visitorchat.twt.com/install/core.js?version=v1.2';
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return <div>你的应用内容</div>;
}

export default App;
```

## Vue 3 项目接入

```vue
<template>
  <div>你的应用内容</div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue';

let scriptEl = null;

onMounted(() => {
  window.__twt__config = {
    appid: '你的APPID',
    lang: 'zh-cn',
    theme: 'light',
  };

  scriptEl = document.createElement('script');
  scriptEl.async = true;
  scriptEl.src = 'https://visitorchat.twt.com/install/core.js?version=v1.2';
  document.head.appendChild(scriptEl);
});

onUnmounted(() => {
  if (scriptEl) document.head.removeChild(scriptEl);
});
</script>
```

## 自定义触发按钮

隐藏默认浮窗图标，改用自定义按钮触发聊天窗口：

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>自定义触发按钮</title>
</head>
<body>
  <button id="open-chat">联系客服</button>

  <script>
  window.__twt__config = {
    appid: "你的APPID",
    lang: "zh-cn",
    theme: "light",
    icon: "2"
  };
  (function(n, t) {
    var e = { init: function() {
      var n = t.createElement("script");
      n.async = !0;
      n.src = "https://visitorchat.twt.com/install/core.js?version=v1.2";
      t.head.appendChild(n);
    }};
    e.init();
  })(window, document);

  document.getElementById('open-chat').addEventListener('click', function() {
    if (window.__twt__api && window.__twt__api.open) {
      window.__twt__api.open();
    }
  });
  </script>
</body>
</html>
```

## 传递登录用户信息

将已登录用户的身份同步到客服工作台。`sbs_mm` 签名必须在服务端生成：

```js
// 服务端（Node.js）生成签名
const crypto = require('crypto')

function md5(str) {
  return crypto.createHash('md5').update(str).digest('hex')
}

function generateSbsMm(sbs, appSecret, ranstr) {
  return md5(md5(sbs + '_' + appSecret) + '_' + ranstr)
}

// 示例
const sbs = 'user_1001'
const ranstr = crypto.randomBytes(8).toString('hex')
const sbsMm = generateSbsMm(sbs, process.env.APP_SECRET, ranstr)
// 将 sbs、sbsMm、ranstr 注入到页面
```

```html
<!-- 前端：将服务端生成的值注入 config -->
<script>
window.__twt__config = {
  appid: "你的APPID",
  lang: "zh-cn",
  sbs: "user_1001",
  sbs_mm: "服务端生成的签名",
  ranstr: "服务端生成的随机串",
  name: "张三",
  email: "zhangsan@example.com"
};
(function(n, t) {
  var e = { init: function() {
    var n = t.createElement("script");
    n.async = !0;
    n.src = "https://visitorchat.twt.com/install/core.js?version=v1.2";
    t.head.appendChild(n);
  }};
  e.init();
})(window, document);
</script>
```

::: danger 安全警告
`APP_SECRET` 必须保存在服务端，切勿暴露到前端代码中。
:::

## 多语言切换

页面上提供语言切换按钮，运行时切换聊天组件语言：

```html
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><title>多语言切换</title></head>
<body>
  <button onclick="setLang('zh-cn')">简体中文</button>
  <button onclick="setLang('zh-tw')">繁體中文</button>
  <button onclick="setLang('en')">English</button>

  <script>
  window.__twt__config = {
    appid: "你的APPID",
    lang: "zh-cn"
  };
  (function(n, t) {
    var e = { init: function() {
      var n = t.createElement("script");
      n.async = !0;
      n.src = "https://visitorchat.twt.com/install/core.js?version=v1.2";
      t.head.appendChild(n);
    }};
    e.init();
  })(window, document);

  function setLang(lang) {
    if (window.__twt__api && window.__twt__api.setLanguage) {
      window.__twt__api.setLanguage(lang);
    }
  }
  </script>
</body>
</html>
```

::: warning 注意
以上示例中的 `你的APPID` 需替换为你在 TWT Chat 后台获取的真实 appid。
:::

::: tip 还没有账号？
[免费注册 TWT Chat](https://twt.com) 获取 APPID，3 分钟完成接入。
:::
