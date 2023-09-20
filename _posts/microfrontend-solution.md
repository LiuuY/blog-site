---
title: '微前端方案'
date: '2020-05-22'
author:
  name: LiuuY
---

## 微前端方案

### 背景

1. 后端微服务，前端“大泥球”

<img width="781" src="/assets/images/microfrontend-solution/monolith.png">

2. 前端“大泥球”，不适合跨功能小团队

<img width="781" src="/assets/images/microfrontend-solution/CFT.png">

### 微前端是什么

它是：
  1. 将单体大应用拆分为多个较小的自治应用，但他们依旧聚合为一。

  2. 将多个分散的应用聚合为一且保持自治。

它能：
  1. 迁移遗留系统。
  
  2. 统一用户体验。

  3. 帮助多团队协作。

### 微前端特性

1. 技术栈无关
2. 独立发布
3. 样式隔离
4. 运行沙盒
5. 懒/预加载

### 微前端优势

- 技术栈无关：主框架不限制接入应用的技术栈，微应用具备完全自主权

- 独立开发、独立部署：微应用仓库独立，前后端可独立开发，部署完成后主框架自动完成同步更新

- 增量升级：在面对各种复杂场景时，我们通常很难对一个已经存在的系统做全量的技术栈升级或重构，而微前端是一种非常好的实施渐进式重构的手段和策略

- 独立运行时：每个微应用之间状态隔离，运行时状态不共享

### 遗留系统演进方案

<img width="781" src="/assets/images/microfrontend-solution/solution.png">

### 实施

1. Application模式

最简单的实施模式，根据 URL 的不同，访问不同的子应用。

<img width="781" src="/assets/images/microfrontend-solution/url.png">

2. Parcel模式

页面混合不同团队、技术栈等，可采用 [Module Fedration](https://webpack.js.org/concepts/module-federation/)、[Web Components](https://developer.mozilla.org/en-US/docs/Web/API/Web_components) 、[Single SPA](https://single-spa.js.org/)等技术。

<img width="781" src="/assets/images/microfrontend-solution/parcel.png">

### 消息通信

为了防止子应用间通信而导致的管理混乱，采用统一管理的订阅发布机制。

<img width="781" src="/assets/images/microfrontend-solution/communicate.png">

### 案例

加载主应用后，根据用户不同，从服务器获取子应用配置。

<img width="781" src="/assets/images/microfrontend-solution/example.png">
