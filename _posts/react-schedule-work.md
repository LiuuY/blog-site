---
title: 'React Fiber 如何调度任务的'
date: '2023-10-27'
author:
  name: LiuuY
---

React Fiber 如何做到性能提升的呢？

超极简版本：

1. 将 React 需要执行的任务分解。

2. 在每个固定的时间片内执行任务，然后释放主线程（yield to the main thread），以执行绘制和响应用户交互事件等。

这样无论多复杂的任务，都不会阻塞主线程，保证了体验。

我们通过最简单的代码来还原上述的逻辑：

我们有一个大任务，如果直接执行它会导致阻塞主线程：

```javascript
/**
 * 大任务
 */
function bigCpuIntensiveTask() {
  for (let i = 0; i < 1000000000; i++) {
  }
}
```

我们将其分解为 100 个小任务：

```javascript
/**
 * 小任务
 */
function smallCpuIntensiveTask() {
  for (let i = 0; i < 10000000; i++) {
  }
}
```

但是如果我们直接执行这 100 个小任务，则还是无法避免阻塞主线程：

```javascript
for (let i = 0; i < 100; i++) {
  smallCpuIntensiveTask();
}
```

此时就需要在每个时间片后，然后释放主线程，即将后面未执行的任务，放入 [Task Queue](https://javascript.info/event-loop#macrotasks-and-microtasks) 中，待浏览器主线执行优先级更高的任务后，再执行 Task Queue 中我们的任务。

例如我们可以使用 `setTimeout` 将后续任务放入 Task Queue，将超时时间设为 0ms（虽然设置为 0ms，一般浏览器最少超时时间 4ms，[不过这个说法已经过时了](https://liuuy.cc/posts/setTimeout)）。

这样在每个小任务执行后，就释放了主线程：

```javascript
/**
 * 运行 100 个小任务
 */
let count1 = 100;
async function runTasks1() {
  if (count1-- > 0) {
    smallCpuIntensiveTask()
    setTimeout(smallCpuIntensiveTask, 0); // 释放主线程，将后续任务加入 Task Queue
  }
}
```

因为 `setTimeout` 的 4ms 最短超时时间限制，React 使用的是 [`MessageChannel`](https://github.com/facebook/react/blob/9e3b772b8cabbd8cadc7522ebe3dde3279e79d9e/packages/scheduler/src/forks/Scheduler.js#L568C3-L568C3)，以减小不必要的「超时」。

```javascript
/**
 * 运行 100 个小任务
 */
let count2 = 100;
const channel = new MessageChannel();
const port = channel.port2;

channel.port1.onmessage = () => {
  if (count2-- > 0) {
    smallCpuIntensiveTask()
    port.postMessage(null); // 释放主线程，将后续任务加入 Task Queue
  }
}

function runTasks2() {
  port.postMessage(null);
}
```

最后，我们运行下面的例子，红色方块代表高优先级的动画，三个按钮分别代表了，执行一个大任务、使用 `setTimeout`/`MessageChannel` 释放主线程。

可以看到如果我们点击「大任务」按钮，红色方块动画就会被卡住，而分解任务则不会出现：

<video width="741" controls>
  <source src="/assets/images/react-schedule-work/record.mov" type="video/mp4">
  Your browser does not support HTML video.
</video>

</br>

<iframe src="https://codesandbox.io/embed/yieldtomain-wthtnt?fontsize=14&hidenavigation=1&theme=dark"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="yieldToMain"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

但是使用 `setTimeout`/`MessageChannel` 的方案也并不完美，例如可能有其他的代码也将任务加入了 Task Queue 中并且在我们的 Task 前面，这就会导致更加长的延迟执行。

针对这个情况，有个新的 API：[`scheduler.yield()`](https://github.com/WICG/scheduling-apis/blob/main/explainers/yield-and-continuation.md)，专门处理「释放主线程」这个问题：

```javascript
async function yieldy () {
  // Do some work...
  // ...

  // Yield!
  await scheduler.yield();

  // Do some more work...
  // ...
}
```

### 总结

React 就是通过分解任务和让出主线程来优化性能的，这也就是 React Fiber 架构调度任务的的核心逻辑。同时，「释放主线程（yield to the main thread）」这个方式也是一个通用的优化长任务的逻辑：例如处理[输入延迟的问题](https://web.dev/articles/optimize-input-delay#avoid_long_tasks)。



