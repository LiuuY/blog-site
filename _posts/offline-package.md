---
title: "WebView 离线包方案"
date: "2023-09-19"
author:
  name: LiuuY
---

## WebView 离线包方案

### 为什么要做离线包

某 APP 是对内办公 APP，服务全行数万员工，主要为原生技术栈加大量 Web 应用（2000+），这些 Web 应用技术栈各异，包括 React 等现代框架也有 Zepto 甚至 ASP、FreeMarker等。

我们希望尽量不修改 Web 应用的前提下优化这上千个应用，达到“秒开”的原生用户体验，同时提高开发者的开发效率，提升线上监控和数据分析能力。

### 方案

1. WebView 预创建

在App初始化的时候，创建WebView缓存池，并提前初始化WebView（甚至可以提前预加载资源），当需要展示Web页面时直接从WebView缓存池中获取WebView对象进行资源渲染。

<img width="781" src="/assets/images/offline-package/precreate.png">

2. 前端公共包内置注入

<img width="781" src="/assets/images/offline-package/shared.png">


3. 资源拦截

通过Web容器加载web page时，根据缓存策略拦截一部分的静态资源（例如img、js、css 文件）的加载，直接加载缓存在本地的静态资源。

<img width="781" src="/assets/images/offline-package/cache.png">

4. 离线包更新

采用 bsdiff 算法，对于 zip 包进行二进制对比输入出 Patch 包，有 50% 到 90% 的压缩率。

<img width="781" src="/assets/images/offline-package/patch.png">

5. 监控/调试

优化 Web 调用原生功能 API 调试信息，将日志直接返回到 Web 中；增加 FPS、CPU、加载时长等性能信息展示。

<img width="781" src="/assets/images/offline-package/debug.png">

6. 离线包管理平台

功能包括：

 - 开发者认证
 - 灰度发布
 - A/B Test
 - 快速回滚
 - 日志查看
 - 更新策略管理
