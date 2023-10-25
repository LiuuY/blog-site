---
title: '常见的 JSBridge 设计'
date: '2023-10-26'
author:
  name: LiuuY
---

JSBridge 是指用于 JavaScript 和原生平台通信的代码。

常见的例如手机 App 中 WebView 的网页需要调用手机的原生能力（例如，从手机获取用户信息）。

通信就包含向原生发送数据，和接收原生发回的数据。

### 向原生发送数据

对于 Android 平台，会在 WebView 创建的时候定义中的全局 [`window`](https://developer.mozilla.org/en-US/docs/Web/API/Window) 对象挂载一个 android 对象成员方法供 JavaScript 调用。

例如：`window.android.__CallNative(toNativeData)`，这个 `__CallNative` 就是 Android 原生在 WebView 创建的时候定义的方法，JavaScript可以直接使用：

```javascript
// 向原生发送数据
window.android.__CallNative('what is my name?');
```

对于 iOS 平台，同样的道理，是 `window.webkit.messageHandlers.__CallNative.postMessage(toNativeData);`

```javascript
// 向原生发送数据
window.webkit.messageHandlers.__CallNative.postMessage('what is my name?');
```

需要注意的是，向原生发送数据必须_序列化_。


### 接收原生发回的数据

接收原生发回的数据就更加简单粗暴，原生会直接调用一个提前约定好的方法，并将返回的数据作为参数，例如，当原生平台发回的数据的时候，提前定义的 `window.__NativeCallback` 就会被调用：

```javascript
// 如果我们定义这个方法，当原生平台发回的数据的时候，data 就会打印出来。
window.__NativeCallback = (data) => {
    console.log(data);
}
```

### 问题

1. 由于返回数据并不是同步的，当需要向原生发送的数据种类繁多时，这种方式难以管理：

```javascript
// fn1 和 fn2 都向原生请求当前的时间，由于返回数据并非同步，无法区分返回数据对应哪个方法调用。
function fn1() {
    window.android.__CallNative(JSON.stringify({type: 'GET_CURRENT_TIME'}));
}

function fn2() {
    window.android.__CallNative(JSON.stringify({type: 'GET_CURRENT_TIME'}));
}

window.__NativeCallback = (data) => {
    console.log(data);
}
```

2. 现有方式将发送与接收分开为两个全局方法，使用困难，不够简洁。本质上，对于开发者来说，从原生获取数据，和从服务器获取数据都是「异步」，应该将其逻辑统一，例如：

```javascript
function main() {
    JSBridge.getCurrentTime()
        .then((data) => {
            console.log(data)
        }).
        catch((error) => {
            console.log(error)
        })
}
```

这样与一般的服务端 API 调用习惯无二。

### 方案

https://github.com/LiuuY/jsbridge

封装了上述逻辑，所有调用返回都是 Promise，对于使用者来说，就与普通异步函数调用无异，😄。

```JavaScript
class JSBridgeDemo extends JSBridgeBase {
  constructor() {
    super();
  }

  public demoAPI() {
    return this.handlePublicAPI('DemoActionID');
  }
}

function test() {
    const jsBridge = new JSBridgeDemo();

    jsBridge.demoAPI()
        .then(data => console.log(data))
        .error(error => console.log(error))
}
```

