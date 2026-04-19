# TWT Chat 嵌入访客端 webview AppBridge对接文档

## 文档概述

本文档基于实际 H5 调用方式和 APP 接收处理逻辑，提供完整的 AppBridge 对接方案。

---

## 必须接入方案：AppBridge 兼容层

### 技术架构

*   **框架：**Flutter
    

*   **核心组件**: `webview_flutter` 4.13.0+
    
*   **通信机制**: 通过 JavaScript Channel 实现 H5 与 Flutter 双向通信
    
*   **H5 调用方式**: `window.AppBridge.call(method, params, callback)`
    
*   **APP 处理**: 通过 `BridgeAction` 类统一处理消息
    

### 核心实现代码

#### WebView 控制器初始化

```dart
import 'package:business_module/business_module.dart';

/// 初始化webview控制器
void initWebViewController() async {
  late final PlatformWebViewControllerCreationParams params;
  
  // iOS WebKit 适配
  if (WebViewPlatform.instance is WebKitWebViewPlatform) {
    params = WebKitWebViewControllerCreationParams(
      allowsInlineMediaPlayback: true,
      mediaTypesRequiringUserAction: const <PlaybackMediaTypes>{},
    );
  } else {
    params = const PlatformWebViewControllerCreationParams();
  }

  // 创建 WebViewController
  webViewController = WebViewController.fromPlatformCreationParams(
    params,
    onPermissionRequest: (request) => onPermissionRequest(request),
  )..setJavaScriptMode(JavaScriptMode.unrestricted);

  // Android 平台适配
  if (webViewController.platform is AndroidWebViewController) {
    AndroidWebViewController.enableDebugging(true);
    (webViewController.platform as AndroidWebViewController)
        .setOnShowFileSelector(_androidFilePicker);
    (webViewController.platform as AndroidWebViewController)
        .setMediaPlaybackRequiresUserGesture(true);
  }

  // 设置 UserAgent 和配置
  final userAgent = await webViewController.getUserAgent();
  webViewController
    ..setUserAgent('$userAgent $kUserAgentRemark')
    ..setJavaScriptMode(JavaScriptMode.unrestricted)
    ..setNavigationDelegate(
      NavigationDelegate(
        onProgress: (progress) {
          this.progress.value = progress;
        },
        onPageStarted: (url) async {
          LOG('webview onPageStarted: $url');
        },
        onPageFinished: (url) async {
          setAppBarTitle();
          // 关键：注入 AppBridge 兼容层
          await _injectAppBridgeCompatibilityLayer();
        },
        onUrlChange: (change) {
          LOG('webview onUrlChange: ${change.url}');
        },
        onHttpError: (error) {},
        onWebResourceError: (error) {},
        onNavigationRequest: (request) {
          return NavigationDecision.navigate;
        },
      ),
    )
    // 注册 JavaScript Channel - 关键配置
    ..addJavaScriptChannel(
      'AppBridgeChannel', // 通道名称，与注入脚本中的 window.AppBridgeChannel_native 对应
      onMessageReceived: (message) {
        // 使用 BridgeAction 处理消息
        BridgeAction().handleJSMessage(
          BridgeMessageBean.fromJsonString(message.message),
          controller: webViewController,
        );
      },
    );
  
  // 加载 URL
  final url = args?.url ?? '';
  if (url.startsWith('http')) {
    webViewController.loadRequest(Uri.parse(url));
  } else {
    webViewController.loadFlutterAsset(url);
  }
}
```

#### AppBridge 兼容层注入（必须实现）

```dart
/// 注入兼容层脚本 - 必须实现
Future<void> _injectAppBridgeCompatibilityLayer() async {
  const injectAppBridgeScript = r'''
(function() {
  try {
    console.log('[AppBridge] 开始注入');

    // 创建原生通道引用
    if (!window.AppBridgeChannel_native) {
      window.AppBridgeChannel_native = {
        postMessage: function(msg) {
          // 这个会由 Flutter 的 JavaScript Channel 处理
          if (window.AppBridgeChannel && window.AppBridgeChannel.postMessage) {
            window.AppBridgeChannel.postMessage(msg);
          }
        }
      };
    }

    // 主桥对象
    window.AppBridge = window.AppBridge || {};
    window.AppBridge._callbacks = window.AppBridge._callbacks || {};

    function genCallbackId() {
      return 'cb_' + Date.now() + '_' + Math.floor(Math.random() * 10000);
    }

    // call(method, data, callback) - H5 调用方式
    window.AppBridge.call = function(method, data, callback) {
      return new Promise(function(resolve, reject) {
        if (!method || typeof method !== 'string') {
          reject('[AppBridge] 参数错误：method 必须为字符串');
          return;
        }

        var callbackId = null;
        if (typeof callback === 'function') {
          callbackId = genCallbackId();
          window.AppBridge._callbacks[callbackId] = callback;
        }

        var msg = {
          method: method,
          params: data || {},
          callback: callbackId
        };

        try {
          if (window.AppBridgeChannel_native && typeof window.AppBridgeChannel_native.postMessage === 'function') {
            console.log('[AppBridge] 发送消息:', method, data);
            window.AppBridgeChannel_native.postMessage(JSON.stringify(msg));
            resolve({status: 'sent', callbackId: callbackId});
          } else {
            console.warn('[AppBridge] 无可用通道');
            resolve({status: 'no_bridge', data: data});
          }
        } catch (e) {
          console.error('[AppBridge] 调用异常:', e);
          reject(e);
        }
      });
    };

    // Flutter 回调 H5：invokeCallback(callbackId, result)
    window.AppBridge.invokeCallback = function(callbackId, result) {
      try {
        var cb = window.AppBridge._callbacks[callbackId];
        if (cb) {
          try {
            cb(result);
          } catch (err) {
            console.error('[AppBridge] 回调执行错误:', err);
          }
          delete window.AppBridge._callbacks[callbackId];
        } else {
          console.warn('[AppBridge] 未找到回调函数:', callbackId);
        }
      } catch (e) {
        console.error('[AppBridge] invokeCallback 异常:', e);
      }
    };

    console.log('[AppBridge] 注入完成');
  } catch (err) {
    console.error('[AppBridge] 注入失败:', err);
  }
})();
''';

  try {
    await webViewController.runJavaScript(injectAppBridgeScript);
    debugPrint('AppBridge 兼容层注入成功');
  } catch (e) {
    debugPrint('注入 AppBridge 失败: $e');
  }
}
```

#### 数据模型定义

```dart
/// 桥接消息数据模型
class BridgeMessageBean {
  final String method;
  final Map<String, dynamic>? params;
  final String? callback;

  BridgeMessageBean({
    required this.method,
    this.params,
    this.callback,
  });

  factory BridgeMessageBean.fromJsonString(String jsonString) {
    try {
      final Map<String, dynamic> json = jsonDecode(jsonString);
      return BridgeMessageBean(
        method: json['method'] ?? '',
        params: json['params'] != null ? Map<String, dynamic>.from(json['params']) : null,
        callback: json['callback'],
      );
    } catch (e) {
      throw FormatException('解析 BridgeMessageBean 失败: $e, 原始数据: $jsonString');
    }
  }

  @override
  String toString() {
    return 'BridgeMessageBean{method: $method, params: $params, callback: $callback}';
  }
}

/// 桥接回调数据模型
class BridgeCallbackBean {
  final int code;
  final String msg;
  final Map<String, dynamic>? data;

  BridgeCallbackBean({
    required this.code,
    required this.msg,
    this.data,
  });

  String toString() {
    return jsonEncode({
      'code': code,
      'msg': msg,
      'data': data,
    });
  }
}
```

#### 消息处理类（基于实际业务逻辑）

```dart
import 'package:business_module/business_module.dart';

/// 桥接动作处理类
class BridgeAction {
  late BridgeMessageBean message;
  late WebViewController webViewController;

  /// 处理JS消息
  Future<void> handleJSMessage(
    BridgeMessageBean message, {
    required WebViewController controller,
  }) async {
    this.message = message;
    webViewController = controller;

    kLog('handleJSMessage - ${message.toString()}');
    final method = message.method;
    
    // 根据 method 路由到不同的处理方法
    switch (method) {
      case 'download':
        await _handleDownload(message.params);
        break;
      case 'new_message':
        await _handleNewMessage();
        break;
      case 'android_recording_permission':
        await _handleRecordingPermission();
        break;
      case 'on_ring':
        await _handleRingControl(true);
        break;
      case 'off_ring':
        await _handleRingControl(false);
        break;
      default:
        kLog('未知的桥接方法: $method');
        await _handleUnknownMethod(method, message.params);
    }
  }

  /// 处理下载请求
  Future<void> _handleDownload(Map<String, dynamic>? params) async {
    final fileUrl = params?['url'];
    if (fileUrl == null || fileUrl.isEmpty) {
      kLog('下载链接为空');
      return;
    }
    
    final type = params?['type'];
    if (type == null || type.isEmpty) {
      kLog('文件类型为空');
      return;
    }
    
    kLog('🟢 收到下载请求: $fileUrl, 类型: $type');
    
    try {
      if (type == 'image') {
        await ImageUtil.saveImageWithString(fileUrl);
      } else if (type == 'video') {
        await FileUtil.downloadFile(fileUrl, onReceiveProgress: (count, total) {
          JMLoading.progress(msg: S.common.downloading, value: count / total);
          final progress = ((count / total) * 100).toInt();
          if (progress == 100) {
            kShowToast(S.chat.frameChatMsgDownloadSuccess);
          }
        });
      } else {
        await FileUtil.downloadFile(fileUrl, onReceiveProgress: (count, total) {
          JMLoading.progress(msg: S.common.downloading, value: count / total);
          if (count == total) {
            kShowToast(S.chat.frameChatMsgDownloadSuccess);
          }
        });
      }
    } catch (e) {
      kLog('下载文件失败: $e');
    }
  }

  /// 处理新消息铃声
  Future<void> _handleNewMessage() async {
    kLog('新消息铃声');
    try {
      await AudioPlayerUtil().togglePlay(R.files.alert);
    } catch (e) {
      kLog('播放铃声失败: $e');
    }
  }

  /// 处理录音权限请求
  Future<void> _handleRecordingPermission() async {
    kLog('获取录音权限');
    try {
      final status = await _handleRecordingPermissionStatus();
      await callbackJS(BridgeCallbackBean(
        code: 1, 
        msg: 'success', 
        data: {'permission': status}
      ));
    } catch (e) {
      kLog('处理录音权限失败: $e');
      await callbackJS(BridgeCallbackBean(
        code: 0, 
        msg: 'error', 
        data: {'permission': false}
      ));
    }
  }

  /// 处理铃声控制
  Future<void> _handleRingControl(bool enable) async {
    kLog('${enable ? '开启' : '关闭'}铃声');
    // 实现铃声控制逻辑
  }

  /// 处理未知方法
  Future<void> _handleUnknownMethod(String method, Map<String, dynamic>? params) async {
    kLog('未知桥接方法: $method, 参数: $params');
    // 可以返回错误信息给 H5
    if (message.callback != null) {
      await callbackJS(BridgeCallbackBean(
        code: 0,
        msg: '未知方法: $method',
        data: null,
      ));
    }
  }

  /// 检查录音权限状态
  Future<bool> _handleRecordingPermissionStatus() async {
    // 检查当前权限状态
    final hasAccess = await PermissionUtil.getPermissionStatus(PermissionType.microphone);
    if (hasAccess == false) {
      // 请求权限
      await PermissionUtil.requestPermission(PermissionType.microphone);
      // 再次检查权限状态
      return await PermissionUtil.getPermissionStatus(PermissionType.microphone);
    }
    return true;
  }

  /// 回调JS的通用方法
  Future<void> callbackJS(BridgeCallbackBean data) async {
    final callbackId = message.callback ?? '';
    if (callbackId.isEmpty) {
      kLog('callbackId 为空，无法回调');
      return;
    }
    
    final script = "window.AppBridge && window.AppBridge.invokeCallback('$callbackId', ${data.toString()})";
    kLog('回调 JS: $script');
    
    try {
      await webViewController.runJavaScript(script);
    } catch (e) {
      kLog('回调 JS 失败: $e');
    }
  }
}
```

### H5 调用示例（基于实际使用）

```dart
// 获取录音权限 - 实际调用方式
window.AppBridge.call('android_recording_permission', {}, (res) => {
  if (res?.data?.permission) {
    hasPermission.value = true;
    console.log('录音权限已获取');
  } else {
    console.log('录音权限被拒绝');
  }
});

// 下载文件
window.AppBridge.call('download', {
  url: 'https://example.com/file.jpg',
  type: 'image'
}, (res) => {
  if (res.code === 1) {
    console.log('下载成功');
  } else {
    console.log('下载失败:', res.msg);
  }
});

// 新消息通知
window.AppBridge.call('new_message', {}, (res) => {
  console.log('铃声播放状态:', res);
});
```

### 权限处理配置

```dart
/// 处理 WebView 权限请求
Future<void> onPermissionRequest(PermissionRequest request) async {
  final permissions = request.types;
  final results = <PermissionResourceType, PermissionDecision>{};
  
  for (final permission in permissions) {
    switch (permission) {
      case PermissionResourceType.camera:
        final granted = await _requestCameraPermission();
        results[permission] = granted ? PermissionDecision.grant : PermissionDecision.deny;
        break;
      case PermissionResourceType.microphone:
        final granted = await _requestMicrophonePermission();
        results[permission] = granted ? PermissionDecision.grant : PermissionDecision.deny;
        break;
      default:
        results[permission] = PermissionDecision.deny;
    }
  }
  
  request.grant(results);
}

Future<bool> _requestCameraPermission() async {
  final status = await Permission.camera.request();
  return status.isGranted;
}

Future<bool> _requestMicrophonePermission() async {
  final status = await Permission.microphone.request();
  return status.isGranted;
}
```

### 调试和验证

#### 调试配置

```dart
// 在开发阶段启用调试
AndroidWebViewController.enableDebugging(true);

// 查看关键日志
kLog('handleJSMessage - ${message.toString()}');
kLog('回调 JS: $script');
```

#### 验证步骤

1.  **注入验证**: 检查控制台输出 `[AppBridge] 注入完成`
    
2.  **通道验证**: H5 调用 `window.AppBridge.call` 无错误
    
3.  **权限验证**: 测试 `android_recording_permission` 调用和回调
    
4.  **功能验证**: 测试下载、铃声等功能
    

### 注意事项

1.  **权限配置**: 确保在 `AndroidManifest.xml` 和 `Info.plist` 中声明所需权限
    
2.  **webview 嵌入访客的链接为**："${host}/direct/${appid}?source=webview"，其中参数`source`可选，设置为 **webview** 可实现去掉访客应用的顶部左侧返回按钮