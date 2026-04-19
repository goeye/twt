# JavaScript API

基础安装并加载 SDK 后，运行时能力会挂载到 `window.__twt__api` 上。这里仅说明方法、事件和生命周期回调，配置字段与身份参数请看 [配置项参考](./configuration)。

## API 一览

| 方法 | 说明 | 返回值 |
| --- | --- | --- |
| `open()` | 打开聊天窗口 | — |
| `close()` | 关闭聊天窗口 | — |
| `setLanguage(lang)` | 切换界面语言 | — |
| `login(sbs, sbs_mm, ranstr, name, nickname, email, phone)` | 动态设置客户信息 | — |
| `isReady()` | 检查 SDK 是否就绪 | `boolean` |
| `onReady(callback)` | 注册就绪回调 | — |
| `getError()` | 获取错误信息 | `Object \| null` |

## 事件一览

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| `__twt__sdk_ready` | SDK 加载完成 | — |
| `__twt__custom_event` | 未读消息数变化 | `e.detail.unread` |

::: tip 提示
如果你需要隐藏默认图标、设置初始语言，或者在页面加载时注入登录用户信息，请改看 [配置项参考](./configuration)。
:::

## 聊天窗口控制

### open()

打开聊天窗口。

```javascript
if (window.__twt__api && window.__twt__api.open) {
  window.__twt__api.open()
}
```

### close()

关闭聊天窗口。

```javascript
if (window.__twt__api && window.__twt__api.close) {
  window.__twt__api.close()
}
```

## 动态设置语言

在运行时切换聊天组件的界面语言，无需重新加载页面。

支持的语言代码：`zh-cn`、`zh-tw`、`en`。

```javascript
if (window.__twt__api && window.__twt__api.setLanguage) {
  window.__twt__api.setLanguage('en')
}
```

## 动态设置客户信息

`login` 适用于 SDK 加载完成后再同步用户身份的场景。`sbs_mm` 的生成规则和安全要求见 [配置项参考](./configuration)。

```javascript
if (window.__twt__api && window.__twt__api.login) {
  window.__twt__api.login(
    'user_1001',
    '服务端生成的签名',
    '服务端生成的随机串',
    '张三',
    '张三',
    'zhangsan@example.com',
    '13800000000'
  )
}
```

## SDK 生命周期

### isReady()

检查 SDK 是否已加载完成。

```javascript
if (window.__twt__api && window.__twt__api.isReady()) {
  console.log('SDK 已加载完成')
}
```

### onReady(callback)

注册 SDK 就绪回调，回调函数会收到 API 对象作为参数。

```javascript
if (window.__twt__api && window.__twt__api.onReady) {
  window.__twt__api.onReady((api) => {
    console.log('SDK 已加载完成', api)
  })
}
```

### getError()

获取 SDK 错误信息。返回值：`Object | null`。

```javascript
if (window.__twt__api && window.__twt__api.getError) {
  console.log(window.__twt__api.getError())
}
```

## 事件监听

### SDK 加载完成

::: warning 注意
此代码需放在 SDK 安装脚本之后。
:::

```javascript
window.addEventListener('__twt__sdk_ready', () => {
  console.log('SDK 已加载完成')
})
```

### 未读消息变化

```javascript
window.addEventListener('__twt__custom_event', (event) => {
  console.log('Unread message count:', event.detail.unread)
})
```
