# JavaScript API

TWT Chat SDK 加载完成后，会在 `window` 上挂载 `__twt__api` 对象，提供程序化控制聊天组件的能力。

## 聊天窗口控制

### open()

打开聊天窗口。

```javascript
window.__twt__api.open()
```

### close()

关闭聊天窗口。

```javascript
window.__twt__api.close()
```

## 语言设置

### setLanguage(lang)

动态切换界面语言，无需重新加载页面。

- **参数**：`lang` — 语言代码，可选 `zh-cn`、`zh-tw`、`en`

```javascript
window.__twt__api.setLanguage('en')
```

## 用户身份

### login(sbs, sbs_mm, ranstr, name, nickname, email, phone)

动态设置客户信息，适用于 SDK 加载后再登录的场景。

```javascript
window.__twt__api.login(
  '1001',           // sbs - 用户唯一标识
  'a1b2c3d4...',    // sbs_mm - 用户签名
  'random16str',    // ranstr - 随机字符串
  '张三',           // name - 用户姓名
  '三哥',           // nickname - 备注名
  'zhang@test.com', // email - 邮箱
  '13800138000'     // phone - 电话
)
```

关于 `sbs_mm` 签名生成规则，请参阅 [配置项参考 - sbs_mm 签名生成规则](./configuration#sbs-mm-签名生成规则)。

## SDK 生命周期

### isReady()

检查 SDK 是否已加载完成。

- **返回值**：`boolean` — SDK 是否已就绪

```javascript
if (window.__twt__api.isReady()) {
  console.log('SDK已加载完成')
} else {
  console.log('SDK未加载完成')
}
```

### onReady(callback)

注册 SDK 就绪回调（便捷方法）。回调函数会收到 API 对象作为参数。

```javascript
if (window.__twt__api.onReady) {
  window.__twt__api.onReady(() => {
    console.log('SDK已加载完成')
    // TODO: 处理业务逻辑
  })
}
```

### getError()

获取 SDK 错误信息。

- **返回值**：`Object | null` — 错误对象或 `null`

```javascript
window.__twt__api.getError()
```

## 事件监听

### SDK 加载完成事件

::: warning 注意
此代码需放在 SDK 安装脚本之后。
:::

```javascript
window.addEventListener('__twt__sdk_ready', () => {
  console.log('SDK已加载完成')
})
```

### 未读消息数变化事件

::: warning 注意
此代码需放在 SDK 安装脚本之后。
:::

```javascript
window.addEventListener('__twt__custom_event', (e) => {
  console.log('Unread message count:', e.detail.unread)
})
```

## API 一览

| 方法 | 说明 | 返回值 |
| --- | --- | --- |
| `open()` | 打开聊天窗口 | — |
| `close()` | 关闭聊天窗口 | — |
| `setLanguage(lang)` | 切换界面语言 | — |
| `login(sbs, sbs_mm, ...)` | 动态设置客户信息 | — |
| `isReady()` | 检查 SDK 是否就绪 | `boolean` |
| `onReady(callback)` | 注册就绪回调 | — |
| `getError()` | 获取错误信息 | `Object \| null` |

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| `__twt__sdk_ready` | SDK 加载完成 | — |
| `__twt__custom_event` | 未读消息数变化 | `e.detail.unread` |
