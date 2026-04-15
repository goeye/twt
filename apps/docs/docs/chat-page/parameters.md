# URL 参数说明

通过 URL 参数可以自定义聊天页面的语言，以及将你系统中的客户信息同步到 TWT Chat。

## 语言参数

聊天页面的界面语言通过 `?lang=` 参数指定，**不自动检测浏览器语言**，未传时默认显示简体中文（`zh-cn`）。

在链接末尾追加 `?lang=` 参数切换界面语言：

```
https://visitorchat.twt.com/direct/{你的APPID}?lang=en
```

| 代码 | 语言 |
| --- | --- |
| `zh-cn` | 简体中文（默认） |
| `zh-tw` | 繁体中文 |
| `en` | 英文 |

## 客户信息参数

将内部系统的客户信息传入聊天页面，客服可在工作台中查看访客的身份信息。

| 参数名 | 类型 | 说明 |
| --- | --- | --- |
| `sbs` | string | 用户唯一标识 |
| `sbs_mm` | string | 用户签名 |
| `ranstr` | string | 随机字符串（建议 16 位以上） |
| `name` | string | 用户姓名 |
| `nickname` | string | 用户备注名 |
| `email` | string | 用户邮箱 |
| `phone` | string | 用户电话 |

### sbs_mm 生成规则

```
sbs_mm = md5( md5(sbs + '_' + AppSecret) + '_' + ranstr )
```

- MD5 结果为**小写 32 位**
- `AppSecret` 是生成 `sbs_mm` 的必要参数，请在 **开发设置** 中生成，并妥善保存，避免泄露

### 完整示例

```
https://visitorchat.twt.com/direct/8cba81d468aac01b4f15f8ea4ef33677?sbs={sbs}&sbs_mm={sbs_mm}&ranstr={ranstr}&name={name}&nickname={nickname}&email={email}&phone={phone}
```

::: danger 安全警告
`sbs_mm` 签名必须在服务端生成，切勿将 `AppSecret` 暴露到前端代码或 URL 中。
:::
