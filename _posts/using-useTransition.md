---
title: '深入理解 useTransition'
date: '2023-10-19'
author:
  name: LiuuY
---

### useTransition 很难用

React 官方文档中关于 [useTransition 的例子](https://react.dev/reference/react/useTransition#marking-a-state-update-as-a-non-blocking-transition)，我们首先点击 `Post (slow)` 按钮，马上再点击其他按钮，由于按钮点击响应事件使用了 `startTransition`，从而不会因为 `<PostsTab />` 组件耗时而导致的冻结用户界面。

<iframe src="https://codesandbox.io/embed/usetransition-original-example-t2rqyq?fontsize=14&hidenavigation=1&module=%2FPostsTab.js&theme=dark"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="useTransition-original-example"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

但是，我们注意到，例子中，将耗时组件 `<PostsTab />` 使用 `memo` 包起来了。如果我们删除 `memo`，按照上述的操作首先点击 `Post (slow)` 按钮，**等到 Posts 加载出来后**，再点击其他按钮，明显页面卡顿了，仅仅是删除了 `memo`，`useTransition` 就「失效」了 😭🤔️。

<iframe src="https://codesandbox.io/embed/usetransition-without-memo-example-mq99rw?expanddevtools=1&fontsize=14&hidenavigation=1&module=%2FPostsTab.js&theme=dark"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="useTransition-without-memo-example"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

### useTransition 会导致渲染两次

我们需要知道的是，调用 `useTransition` 时，会触发**两次渲染**，首先优先级高的任务会先渲染（例如点击按钮事件），然后才会进行 `startTransition` 回调中触发的优先级低的渲染。

在例子中，当我们在父组件 `TabContainer` 中，每次点击按钮时（即调用了 `startTransition`），就会导致两次渲染。

所以，当我们处于 `Post (slow)` 按钮时，再点击其他按钮，导致 `TabContainer` 首先重新渲染，即会导致非常耗时的 `<PostsTab />` 组件重新渲染（这也就是 React 文档中，为什么需要使用 `memo` 而防止这个两次渲染导致的问题）。

<img width="781" src="/assets/images/using-useTransition/app.png">

我们在代码中加入 `<Profiler />`，分别在按钮、下面内容和 App 本身渲染时打印日志，我们可以看到，当处于 `Post (slow)` 按钮时，再点击其他按钮，会导致渲染两次。

<img width="381" src="/assets/images/using-useTransition/render.png">

### 如何正确的使用 useTransition 

1. 按照 React 文档中例子，配合 `memo` 使用（虽然文档中并没有明说🤔️）。

2. 将 `useTransition` 放到子组件中，这样由 `useTransition` 而导致的二次渲染，就仅仅是渲染 `<TabButton />` 这个轻量级组件两次。

<iframe src="https://codesandbox.io/embed/usetransition-move-down-example-sxycqr?fontsize=14&hidenavigation=1&module=%2FTabButton.js&theme=dark"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="useTransition-move-down-example"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

当处于 `Post (slow)` 按钮时，再点击其他按钮，console 打印的渲染日志，可见只有 `<TabButton />` 渲染了两次：

<img width="381" src="/assets/images/using-useTransition/norender.png">

3. 只在耗时组件使用 `useTransition`，即仅当点击 `Post (slow)` 按钮时，这样再点击其他按钮就并不会因为 `useTransition` 而导致的二次渲染。

<iframe src="https://codesandbox.io/embed/usetransition-only-heavy-example-q386mc?fontsize=14&hidenavigation=1&module=%2FApp.js&theme=dark"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="useTransition-only-heavy-example"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

当处于 `Post (slow)` 按钮时，再点击其他按钮，console 打印的渲染日志：

<img width="381" src="/assets/images/using-useTransition/norender2.png">

### 总结

`useTransition` 会导致组件二次渲染，所以使用时需要特别注意子组件二次渲染导致的卡顿。
