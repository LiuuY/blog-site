---
title: '五种前端状态类型'
date: '2020-07-04'
author:
  name: LiuuY
---

1. `Local`，是组件内部的只属于自身的状态。
2. `Shared`， 是属于多个组件的状态，注意各个组件不应该知道对方的存在。
3. `Remote`，是需要 API 获取的状态。
4. `Meta`，是状态的状态，例如，isLoading 一般指的就是一个 `Remote` 的状态是否加载完成。
5. `Router`，是 URL 路由状态。

<img width="781" alt="2" src="/assets/images/five-states.png">

这些状态有的是不能混在一起的，例如 `Local` 和 `Shared`，如果混在一起，明显导致了冗余；而 `Meta` 有的时候可能也放在 `Shared` 中。

在 Redux 诞生的初期，很多人都有使用 Redex 代替 [Component State](https://reactjs.org/docs/state-and-lifecycle.html) 的想法，这也杂糅了 `Local` 和 `Shared`。

所以在设计组件的时候，最好问问自己“这个状态属于什么类型，它应该放在哪里”。
