# 配置项参考

基础安装完成后，TWT Chat 已经可以直接使用。如果你需要隐藏默认入口、切换语言，或者把登录用户信息同步给客服，可以在 `window.__twt__config` 里继续扩展配置。

## 隐藏默认图标

将 `icon` 设置为 `"2"`，可以隐藏右下角默认浮窗图标，改用你自己的按钮触发聊天窗口。

```html
<button id="open-chat">联系客服</button>

<script>
window.__twt__config = {
  appid: '你的APPID',
  icon: '2',
}

document.getElementById('open-chat').addEventListener('click', function () {
  if (window.__twt__api && window.__twt__api.open) {
    window.__twt__api.open()
  }
})
</script>
```

## 监听未读消息数

SDK 会通过 `__twt__custom_event` 抛出未读消息变化事件，你可以拿它给自定义入口挂角标。

```html
<script>
window.addEventListener('__twt__custom_event', function (event) {
  console.log('Unread message count:', event.detail.unread)
})
</script>
```

## 设置界面语言

`lang` 不会自动读取浏览器语言，需要你在配置里显式传入。

| 代码 | 语言 |
| --- | --- |
| `zh-cn` | 简体中文 |
| `zh-tw` | 繁体中文 |
| `en` | 英文 |

```html
<script>
window.__twt__config = {
  appid: '你的APPID',
  lang: 'en',
}
</script>
```

如果你想在运行时切换语言，也可以在 SDK 加载后调用：

```html
<script>
if (window.__twt__api && window.__twt__api.setLanguage) {
  window.__twt__api.setLanguage('zh-cn')
}
</script>
```

## 传递登录用户信息

如果你的站点有登录体系，可以把用户身份同步到客服工作台。常用字段包括：

| 字段 | 说明 |
| --- | --- |
| `sbs` | 用户唯一标识 |
| `sbs_mm` | 服务端生成的签名 |
| `ranstr` | 服务端生成的随机串 |
| `name` | 用户姓名 |
| `nickname` | 用户备注名 |
| `email` | 用户邮箱 |
| `phone` | 用户电话 |

```html
<script>
window.__twt__config = {
  appid: '你的APPID',
  sbs: 'user_1001',
  sbs_mm: '服务端生成的签名',
  ranstr: '服务端生成的随机串',
  name: '张三',
  email: 'zhangsan@example.com',
}
</script>
```

也可以在 SDK 加载后动态登录：

```html
<script>
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
</script>
```

## `sbs_mm` 生成规则

`sbs_mm` 必须在服务端生成，公式如下：

```text
sbs_mm = md5(md5(sbs + '_' + AppSecret) + '_' + ranstr)
```

::: danger 安全警告
`AppSecret` 只能保存在服务端，不能下发到浏览器。
:::

## 下一步

- [基础安装](./installation) 查看最小接入代码
- [示例项目](./examples) 查看完整接入示例
- [JavaScript API](./javascript-api) 查看运行时控制能力
