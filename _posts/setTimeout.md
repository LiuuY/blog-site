---
title: 'setTimeout(fn, 0) 并非延时 0ms 也不是 4ms❗❗'
date: '2023-10-28'
author:
  name: LiuuY
---

本文翻译自：[Ivan Akulov](https://twitter.com/iamakulov/status/1643629579129503744)。

我们经常看到文章说，setTimeout(fn, 0) 并非延时 0ms，而是至少有 4ms的延时。

现在这个说法已经不正确了，至少对于最新版的 Chrome 和 Safari 来说。

<img width="781" src="/assets/images/setTimeout/setTimeout.png">

让我们从头讲起。

1. HTML 标准文档里面说，超过 5 层以上的嵌套 `setTimeout` 需要延迟 4ms 执行。这是为了防止低端硬件 CPU 过载。（注意是「嵌套」`setTimeout` 需要延迟，文档中并没有要求非嵌套 `setTimeout` 需要延迟！）。

<img width="781" src="/assets/images/setTimeout/htmlspec.jpeg">

> 译者注：这里的「嵌套」指的是 `setTimeout` 中嵌套 `setTimeout`:
  ```javascript
    setTimeout(() => {
      setTimeout(() => {
        ...
      }, 0)
    }, 0)
  ```

2. 浏览器都遵守这个标准。然而在 2022 年，Chromium 注意到，把需要延迟的嵌套层级从 5 增加到 7，可以增加 10% 的性能测试分数。

https://chromestatus.com/feature/5710690097561600

<img width="781" src="/assets/images/setTimeout/chromium.jpeg">

3. 这听起来是为了性能测试分数而做的优化，但是这个「性能测试」是模拟了 TodoMVC，所以这个测试成绩是可以反应到真实用户体验的。

经过一些讨论后（原本要增加到 100？[Increased nesting threshold for SetTimeout(0)](https://docs.google.com/document/d/1boT0k8BQjl7mXXzvI9SdN4XJPSza27vE8T0CNxmMhCI)），把需要延迟的嵌套层级增加到 15。

然而，这个修改并没有发布:(

<img width="781" src="/assets/images/setTimeout/increase100.jpeg">

4. Safari 也将需要延迟的嵌套层级从 5 增加到 10。

https://sourcegraph.com/github.com/WebKit/WebKit/-/commit/786e3e0b252e38fb01c8db97a94d52cb0f57891e?visible=6

<img width="781" src="/assets/images/setTimeout/safari.jpeg">

5. HTML 文档中指表述了「嵌套」`setTimeout`，然而直到 2022 年，Chrome 和 Safari 都将把非嵌套 `setTimeout(..., 0)` 延迟 1ms！

这是 2006 年引入的逻辑，在第一版 Chrome 发布之前、更在在 Webkit 和 Blink 这两个内核分叉之前。

<img width="781" src="/assets/images/setTimeout/webkit.jpeg">

6. 这个 1ms 延迟并非 HTML 标准文档中要求的，同时很可能对于性能有负面影响。所以 Chromium 在 2014 年就尝试修复这个问题（https://bugs.chromium.org/p/chromium/issues/detail?id=402694）。

然而，用了 8 年时间才修复并发布，原因可能是没时间和没测试？

<img width="781" src="/assets/images/setTimeout/fix.jpeg">

7. 尽管 Chromium （https://chromestatus.com/feature/4889002157015040） 和 Safari （https://bugs.webkit.org/show_bug.cgi?id=221124） 都在 2022 年移除了这个延迟，Firefox 从来都没有加过这个延迟。

8. 所以，当我们调用 `setTimeout(fn, 0)` 时，实际发生的是：

  - 对于「非嵌套」`setTimeout(fn, 0)`，在所有浏览器都会立即执行。

  - 对于「嵌套」`setTimeout(fn, 0)`，超过 5 层（Firefox、Chrome）、10 层（Safari）会延迟 4ms。

  我们可以在这里测试：https://developer.mozilla.org/en-US/docs/Web/API/setTimeout#reasons_for_delays_longer_than_specified

  <img width="781" src="/assets/images/setTimeout/test.jpeg">

  注意，「立即执行」，指的是将回调函数 `fn`，放入 Task Queue 的最后一个。在 `fn` 执行前，

  a. 执行所有的 Microtasks（Promise、MutationObserver 等等）。

  b. 执行 Task Queue 中之前加入的任务。

  只有 Microtasks Queue 和 Task Queue 都为空的时候，`fn` 才会真的立即执行。

（https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/）
