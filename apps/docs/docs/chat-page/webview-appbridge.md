# 嵌入访客端 WebView AppBridge 对接

将访客端聊天页面嵌入 App 的 WebView 时，通过 AppBridge 实现 H5 与原生层的双向通信。

访客端链接格式：`${host}/direct/${appid}?source=webview`

> `source=webview` 参数可隐藏访客端顶部左侧返回按钮。

## 技术架构

- **框架**：Flutter + `webview_flutter` 4.13.0+
- **通信机制**：JavaScript Channel（通道名 `AppBridgeChannel`）
- **H5 调用方式**：`window.AppBridge.call(method, params, callback)`
- **APP 处理**：通过 `BridgeAction` 类统一路由消息

## 必须实现：AppBridge 兼容层注入

页面每次加载完成后（`onPageFinished`），必须注入兼容层脚本，否则 `window.AppBridge` 不可用。

### WebView 初始化（关键配置）

```dart
import 'package:business_module/business_module.dart';

void initWebViewController() async {
  // ... 平台适配省略，见完整文档

  webViewController
    ..addJavaScriptChannel(
      'AppBridgeChannel',
      onMessageReceived: (message) {
        BridgeAction().handleJSMessage(
          BridgeMessageBean.fromJsonString(message.message),
          controller: webViewController,
        );
      },
    )
    ..setNavigationDelegate(NavigationDelegate(
      onPageFinished: (url) async {
        await _injectAppBridgeCompatibilityLayer();
      },
    ));
}
```

### 兼容层注入脚本

```dart
Future<void> _injectAppBridgeCompatibilityLayer() async {
  const script = r'''
(function() {
  window.AppBridgeChannel_native = {
    postMessage: function(msg) {
      if (window.AppBridgeChannel?.postMessage) {
        window.AppBridgeChannel.postMessage(msg);
      }
    }
  };

  window.AppBridge = window.AppBridge || {};
  window.AppBridge._callbacks = window.AppBridge._callbacks || {};

  window.AppBridge.call = function(method, data, callback) {
    return new Promise(function(resolve, reject) {
      var callbackId = null;
      if (typeof callback === 'function') {
        callbackId = 'cb_' + Date.now() + '_' + Math.floor(Math.random() * 10000);
        window.AppBridge._callbacks[callbackId] = callback;
      }
      var msg = { method: method, params: data || {}, callback: callbackId };
      window.AppBridgeChannel_native.postMessage(JSON.stringify(msg));
      resolve({ status: 'sent', callbackId: callbackId });
    });
  };

  window.AppBridge.invokeCallback = function(callbackId, result) {
    var cb = window.AppBridge._callbacks[callbackId];
    if (cb) { cb(result); delete window.AppBridge._callbacks[callbackId]; }
  };
})();
''';
  await webViewController.runJavaScript(script);
}
```

## 数据模型

```dart
class BridgeMessageBean {
  final String method;
  final Map<String, dynamic>? params;
  final String? callback;

  factory BridgeMessageBean.fromJsonString(String jsonString) {
    final json = jsonDecode(jsonString);
    return BridgeMessageBean(
      method: json['method'] ?? '',
      params: json['params'] != null ? Map<String, dynamic>.from(json['params']) : null,
      callback: json['callback'],
    );
  }
}

class BridgeCallbackBean {
  final int code;
  final String msg;
  final Map<String, dynamic>? data;

  String toString() => jsonEncode({'code': code, 'msg': msg, 'data': data});
}
```

## 支持的桥接方法

### `download` — 下载文件

```js
window.AppBridge.call('download', { url: 'https://...', type: 'image' }, (res) => {
  console.log(res.code === 1 ? '下载成功' : res.msg);
});
```

| 参数 | 类型 | 说明 |
|------|------|------|
| `url` | string | 文件地址 |
| `type` | string | `image` / `video` / 其他 |

### `new_message` — 播放新消息提示音

```js
window.AppBridge.call('new_message', {});
```

### `android_recording_permission` — 获取录音权限

```js
window.AppBridge.call('android_recording_permission', {}, (res) => {
  if (res?.data?.permission) {
    console.log('录音权限已获取');
  }
});
```

回调数据：`{ code: 1, msg: 'success', data: { permission: true/false } }`

### `on_ring` / `off_ring` — 铃声控制

```js
window.AppBridge.call('on_ring', {});   // 开启铃声
window.AppBridge.call('off_ring', {});  // 关闭铃声
```

## APP 端消息处理

```dart
class BridgeAction {
  late BridgeMessageBean message;
  late WebViewController webViewController;

  Future<void> handleJSMessage(BridgeMessageBean message, {required WebViewController controller}) async {
    this.message = message;
    webViewController = controller;

    switch (message.method) {
      case 'download': await _handleDownload(message.params); break;
      case 'new_message': await AudioPlayerUtil().togglePlay(R.files.alert); break;
      case 'android_recording_permission': await _handleRecordingPermission(); break;
      case 'on_ring': await _handleRingControl(true); break;
      case 'off_ring': await _handleRingControl(false); break;
    }
  }

  Future<void> callbackJS(BridgeCallbackBean data) async {
    final callbackId = message.callback ?? '';
    if (callbackId.isEmpty) return;
    await webViewController.runJavaScript(
      "window.AppBridge?.invokeCallback('$callbackId', ${data.toString()})"
    );
  }
}
```

## 权限配置

使用录音、摄像头相关功能前，需在原生层声明权限：

- **Android**：`AndroidManifest.xml` 中添加 `RECORD_AUDIO`、`CAMERA` 权限
- **iOS**：`Info.plist` 中添加麦克风、摄像头使用说明

## 调试

开发阶段启用 WebView 调试：

```dart
AndroidWebViewController.enableDebugging(true);
```

验证注入是否成功：控制台应输出 `[AppBridge] 注入完成`（如保留了 console.log）。
