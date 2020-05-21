---
title: '微前端到底解决什么问题？'
date: '2020-05-21'
author:
  name: LiuuY
---

微前端指的是：

> "An architectural style where independently deliverable frontend applications are composed into a greater whole"

更详细的介绍可以看[这里](https://martinfowler.com/articles/micro-frontends.html)。

---

在我看来微前端是利用技术的手段解决一个组织问题。

微前端的核心优势：

- 技术栈无关
- 独立发布

都是为了解决两个核心痛点：

- 将单体大应用拆分为多个较小的自治应用，但他们依旧聚合为一
- 将多个分散的应用聚合为一且保持自治

归根结底解决的核心问题是：在多团队独立、水平参差不齐情况下，如何做技术演进（技术栈升级、迁移遗留系统）和统一体验。

优势就是两个词「隔离」和「聚合」。

---

在我直接或者间接接触过的项目中，大部分选择微前端的原因是「单体大应用拆分」进而「技术栈升级」和「迁移遗留系统」。

如果不用微前端可不可解决上述问题？可以。

但是对于多团队开发和集成要求更高，因为要找到一个合适的「隔离」方案。