---
title: '什么是 JavaScript Event Loop'
date: '2019-01-31'
author:
  name: LiuuY
---

Event Loop 是 JavaScript 的并发模型，为了是协调 Call Stack 与 Callback 执行的机制。

- 因为 JavaScript 是单线程的，所以 Call Stack 中一次只能执行一个函数（内部嵌套会 Push 到 Call Stack 中），不同于多线程的并发模型，函数的执行不能被打断。

- 当存在回调时，Callback 函数并不会存入 Call Stack 中，而是会保持到一个 Queue 中，等待触发。这其中包含两种 Queue：Task Queue （也称作 Macrotask Queue）和 [MicroTask](https://javascript.info/microtask-queue) Queue。

- 当 Call Stack 为空并且 Queue 中的 Callback 达到触法条件时，Event Loop 会从 Queue （优先处理 MicroTask Queue）中取出一个 Callback 执行。（由此可以看出，这里使用的术语 Queue ，并不是一个队列数据结构，而是一个 [Sets](https://html.spec.whatwg.org/multipage/webappapis.html#task-queue)）

- 每次 Event Loop 执行完成后，都会导致 UI 重新渲染，[见这里](https://html.spec.whatwg.org/multipage/webappapis.html#event-loop-processing-model)。

- 如果 Call Stack 里面执行了大量运算导致其长时间不为空，就是导致回调也会被阻塞。解决方法：Web Workers、child_process。

![excalidraw-202031104014 (1)](https://user-images.githubusercontent.com/14286374/75619181-68939f00-5bb3-11ea-8b5e-8e1ac3223a55.png)

## 例子

点击👉[🌰](http://latentflip.com/loupe/?code=JC5vbignYnV0dG9uJywgJ2NsaWNrJywgZnVuY3Rpb24gb25DbGljaygpIHsKICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gdGltZXIoKSB7CiAgICAgICAgY29uc29sZS5sb2coJ1lvdSBjbGlja2VkIHRoZSBidXR0b24hJyk7ICAgIAogICAgfSwgMjAwMCk7Cn0pOwoKY29uc29sZS5sb2coIkhpISIpOwoKc2V0VGltZW91dChmdW5jdGlvbiB0aW1lb3V0KCkgewogICAgY29uc29sZS5sb2coIkNsaWNrIHRoZSBidXR0b24hIik7Cn0sIDUwMDApOwoKY29uc29sZS5sb2coIldlbGNvbWUgdG8gbG91cGUuIik7!!!PGJ1dHRvbj5DbGljayBtZSE8L2J1dHRvbj4%3D)