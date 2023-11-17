---
title: 'Event Loop 中的 Event 和 Loop'
date: '2023-10-28'
author:
  name: LiuuY
---

Event Loop 是由于 JavaScript 的单线程执行机制，为了是协调代码执行、事件、用户交互、页面渲染和网络等等而使用并发的机制。

### 什么是 Event？

Event Loop 中的 Event 指的是：Task（或称为 Macrotask）和 Microtask，注意不是 Task Queue 或者 Microtask Queue。

- [Task](https://html.spec.whatwg.org/multipage/webappapis.html#concept-task) 包含了，执行代码、代码回调、`setTimeout` 延迟执行的函数等等。

- [Microtask](https://html.spec.whatwg.org/multipage/webappapis.html#microtask) 则全部为代码触发的任务，包含：`Promise`、`MutationObserver`、`queueMicrotask` 等等。

### 什么是 Loop？

我们知道了现在有两种 Event（Task 和 Microtask）需要我们处理，但是如何处理呢？

```javascript
while (EventQueueIsNotEmpty) {
   const event = eventQueue.dequeue();
   event.run();
}
```

这就是 Loop 的由来，即循环（Loop）一个个处理 Event。😄

当然事情并非着么简单，此时我们需要知道：Task Queue 和 Microtask Queue。

- [Task Queue](https://html.spec.whatwg.org/multipage/webappapis.html#task-queue)，故名思议是包含 Task 的 Queue，一个 Event Loop 可以包含多个 Task Queue，例如，有的 Task Queue 只包含用户交互 Task，而有的 Task Queue 包含其他的 Task。在 Node.js 的 Event Loop 实现中 Queue 之间有优先级的区别，例如：Timer Queue 针对 `setTimeout` 等时间相关的 Task、Poll Queue 针对 IO 相关的 Task。Timer Queue 的优先级比 Poll Queue 高。

- [Microtask Queue](https://html.spec.whatwg.org/multipage/webappapis.html#microtask-queue)，不同于 Task Queue，一个 Event Loop 只有一个 Microtask Queue，它包含所有 Microtask。在 Node.js 的 Event Loop 实现中 Microtask Queue 包含 `process.nextTick` Queue 和 Promise Queue，它们之间有优先级的区别，会先执行全部的 `process.nextTick` Queue 然后在执行全部的 Promise Queue。

由此可见，我们需要循环（Loop）处理两种 Queue，具体逻辑是：

1. 从 Task Queue 中取出一个 Task，并执行这个 Task，执行过程中可能产生新的 Task，就继续加入到对应的 Task Queue 中。

2. 每执行完一个 Task，就依次执行 Microtask Queue 中的所有 Microtask，执行过程中产生的新 Microtask，就继续加入到 Microtask Queue 中，直到所有 Microtask 执行完毕。

3. Microtask Queue 执行完毕后，会进行页面渲染。

4. 回到步骤 1。

```javascript
while (TaskQueueIsNotEmpty) {
   const task = taskQueue.dequeue();
   task.run();
   while (MicrotaskQueueIsNotEmpty) {
    const microtask = microtaskQueue.dequeue();
    microtask.run();
  }
  render();
}
```

### 什么是 Call Stack

那什么时候这个 Loop 开始执行呢？我们就需要了解 [Call Stack（标准中称为 Execution Context Stack）](https://tc39.es/ecma262/#execution-context-stack)。

Call Stack 是 JavaScript 执行上下文组成的栈。

例如：

```javascript
// main.js
function foo() {
  bar();
}

function bar() {
}

foo()
```

0. 初始 Call Stack 为空：

```
|        |
|        | 
|        |
|        |
|        |
```

1. JavaScript 引擎，首先载入这个文件，即开始执行代码，我们可以称之为 `main()`，将其入栈：

```
|        |
|        | 
|        |
|        |
| main() |
```

2. 执行到 `foo()`，将其入栈：

```
|        |
|        | 
|        |
| foo()  |
| main() |
```

3. 执行到 `foo()` 函数中，遇到 `bar()`，将其入栈：

```
|        |
|        | 
| bar()  |
| foo()  |
| main() |
```

4. `bar()` 执行完毕，将其出栈：

```
|        |
|        | 
|        |
| foo()  |
| main() |
```

5. `foo()` 执行完毕，将其出栈：

```
|        |
|        | 
|        |
|        |
| main() |
```

6. `main()` 执行完毕，将其出栈：

```
|        |
|        | 
|        |
|        |
|        |
```

任何代码都是放到 Call Stack 中执行的（无论来自代码还是 Task Queue/Microtask Qeueu）。

### Event Loop 执行步骤

有了上述的理论基础，我们可以将它们串联起来，JavaScript 代码执行的过程就是：载入代码，将其放入 Call Stack 开始执行，遇到 Task 就放到 Task Queue 中，遇到 Microtask 就放到 Microtask Queue。

当 Call Stack 为空的时候，Event Loop 就开始执行，注意，执行代码本身也是一个 Task，所以当前代码执行后，需要执行 Microtask Queue。

我们举个例子：

```javascript
setTimeout(() => alert("timeout")); // Task

Promise.resolve()
  .then(() => alert("promise")); // MicroTask

alert("script");
```

代码执行：

1. 执行代码 `main()`，将其入栈。

2. `() => alert("timeout")` 被加入到 Task Queue。

3. `() => alert("promise")` 被加入到 Microtask Queue。

4. 执行 `alert("script")`。

5. `main()` 执行完毕，将其出栈。

6. 此时 Call Stack 为空， Event Loop 开始执行：

7. Microtask Queue 不为空，取出一个，并执行（也会将其放入 Call Stack 中）。

8. Microtask Qeueu 为空，页面渲染。

9. Task Queue 不为空，取出一个，并执行（也会将其放入 Call Stack 中）。

所以依次弹出：script、promise、timeout。

### 总结

了解 Event Loop 的执行逻辑，和不同 Task 和 Queue 的关系，是明白很多前端黑魔法的基础：[「React Fiber 如何调度任务的」](https://liuuy.cc/posts/react-schedule-work)、[「setTimeout(fn, 0) 并非延时 0ms 也不是 4ms❗❗」](https://liuuy.cc/posts/setTimeout)。所以希望本文能帮助大家更好的理解 Event Loop。