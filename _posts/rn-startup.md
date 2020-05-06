---
title: 'React Native 启动发生了什么？'
date: '2020-01-30'
author:
  name: LiuuY
---

![excalidraw-2020130144852 (1)](https://user-images.githubusercontent.com/14286374/73429103-c5622680-4375-11ea-8c80-3a4f00900308.png)

**基于 0.5.9 版本**


1. 创建 `RootView`，这个是所有 APP 内容的容器。

2. 创建 `Bridge Interface`，用于和 C++ 实现的 `Bridge` 通信。

3. `Bridge` 包含 `Native To JavaScript` 和 `JavaScript To Native` 两部分。

4. 创建 `JavaScript Thread` 和 `Native Module Thread`，分别运行 APP 的 JavaScript 代码，和 `Native Module` 代码。

5. 创建 `Native Module` 和 `Custom Module`。

6. 创建 [`Global Object`](https://github.com/facebook/react-native/blob/c20070f10458d48d6ac1eaac49e681e932bfb9fd/ReactCommon/jsiexecutor/jsireact/JSIExecutor.cpp#L56)，类似于浏览器的 `window` 对象，它有两个重要的值：`ModuleConfig` 对象（包含了`Native Module` 和  `Custom Module` 的配置）和 [`nativeFlushQueueImmediate`](https://github.com/facebook/react-native/blob/c20070f10458d48d6ac1eaac49e681e932bfb9fd/ReactCommon/jsiexecutor/jsireact/JSIExecutor.cpp#L87) 方法（用于 JavaScript 和 Bridge 传递数据），它可以被 JavaScript 和 Bridge 访问。

7. 创建 [`BatchedBridge`](https://github.com/facebook/react-native/blob/0.59-stable/Libraries/BatchedBridge/BatchedBridge.js) 对象，用于将数据传到 `Bridge`（使用 [`nativeFlushQueueImmediate`](https://github.com/facebook/react-native/blob/c20070f10458d48d6ac1eaac49e681e932bfb9fd/ReactCommon/jsiexecutor/jsireact/JSIExecutor.cpp#L87) 方法）。

8. 创建 [`NativeModules`](https://github.com/facebook/react-native/blob/0.59-stable/Libraries/BatchedBridge/NativeModules.js) 对象，里面包含了原生提供方法，JavaScript 可以直接调用。
