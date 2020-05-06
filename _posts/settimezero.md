---
title: '比 setTimeout(sb, 0) 更短延时'
date: '2019-12-22'
author:
  name: LiuuY
---

React 源码（[在此](https://github.com/facebook/react/blob/eeb817785c771362416fd87ea7d2a1a32dde9842/packages/scheduler/src/Scheduler.js#L212-L222)）在 polyfill requestIdleCallback 的时候使用了 postMessage 来使 [idleTick](https://github.com/facebook/react/blob/eeb817785c771362416fd87ea7d2a1a32dde9842/packages/scheduler/src/Scheduler.js#L343) 在下一次 Event Loop 时尽早执行。
