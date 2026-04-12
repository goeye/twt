# 示例项目

以下示例帮助你快速在不同技术栈中接入 TWT Chat。

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

在 React 项目中，通过 `useEffect` 加载 TWT Chat SDK：

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

在 Vue 3 项目中，通过 `onMounted` 加载 TWT Chat SDK：

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
  if (scriptEl) {
    document.head.removeChild(scriptEl);
  }
});
</script>
```

::: warning 注意
以上示例中的 `你的APPID` 需要替换为你在 TWT Chat 后台获取的真实 appid。
:::

::: tip 开始使用
还没有账号？[免费注册 TWT Chat](https://twt.com) 获取 API Key，3 分钟完成接入。
:::
