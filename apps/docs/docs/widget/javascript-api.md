# JavaScript API

基础安装并加载 SDK 后，运行时能力会挂载到 `window.__twt__api` 上。

## 隐藏默认图标

将 `icon` 设置为 `"2"` 可隐藏右下角默认浮窗图标，然后通过自定义按钮触发聊天窗口。

::: tip 注意
`button` 需要替换为对应触发元素的 ID。
:::

```html
<script>
// Hide default badge
if (window.__twt__config) {
  window.__twt__config.icon = '2'
}
// Customize the trigger for the visitor chat window
document.getElementById('button').addEventListener('click', function () {
  if (window.__twt__api && window.__twt__api.open) {
    window.__twt__api.open()
  }
})
</script>
```

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
如果你需要隐藏默认图标、设置初始语言，或者在页面加载时注入登录用户信息，请看本页「接入内部系统的客户信息」章节。
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

`login` 适用于 SDK 加载完成后再同步用户身份的场景。`sbs_mm` 的生成规则和安全要求见本页「sbs_mm 签名生成规则」章节。

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

## 接入内部系统的客户信息

将你系统中已登录用户的信息同步到 TWT Chat，客服在工作台中可直接查看访客身份。

### 方式一：静态设置（页面加载时）

在页面加载时通过 `window.__twt__config` 设置客户信息，需要在页面加载时设置，否则无法生效。

```html
<script>
if (window.__twt__config) {
  // 用户唯一标识
  window.__twt__config.sbs = '{sbs}'
  // sbs_mm 生成规则：md5(md5(sbs + '_' + AppSecret) + '_' + ranstr)
  // 注：md5 结果为小写 32 位
  window.__twt__config.sbs_mm = '{sbs_mm}'
  // 随机字符串（建议 16 位以上）
  window.__twt__config.ranstr = '{ranstr}'
  // 用户姓名
  window.__twt__config.name = '{name}'
  // 用户备注名
  window.__twt__config.nickname = '{nickname}'
  // 用户邮箱
  window.__twt__config.email = '{email}'
  // 用户电话
  window.__twt__config.phone = '{phone}'
}
</script>
```

### 方式二：动态设置（加载后调用）

通过 `login` 方法动态设置客户信息，适用于先无感登录、在 SDK 加载后再设置的场景。

```html
<script>
if (window.__twt__api && window.__twt__api.login) {
  window.__twt__api.login({sbs}, {sbs_mm}, {ranstr}, {name}, {nickname}, {email}, {phone})
}
</script>
```

### `sbs_mm` 签名生成规则

`sbs_mm` 用于验证用户身份，需在服务端生成：

```
sbs_mm = md5( md5(sbs + '_' + AppSecret) + '_' + ranstr )
```

| 步骤 | 操作 | 示例 |
| --- | --- | --- |
| 1 | 拼接 `sbs + _ + AppSecret` | `1001_your_app_secret` |
| 2 | 对步骤 1 结果取 MD5（小写 32 位） | `a1b2c3d4...` |
| 3 | 拼接步骤 2 结果 `+ _ + ranstr` | `a1b2c3d4..._random16string` |
| 4 | 对步骤 3 结果取 MD5（小写 32 位） | 最终 `sbs_mm` 值 |

::: danger 安全警告
`AppSecret` 是生成 `sbs_mm` 的必要参数，请在**开发设置**中生成，务必在服务端完成签名计算，切勿将 `AppSecret` 暴露到前端代码中。
:::

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
