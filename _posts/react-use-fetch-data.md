---
title: '旧调新弹 - 使用 use 来获取数据'
date: '2024-01-30'
author:
  name: LiuuY
---

如果你问我：React 使用什么方式获取数据？我的回答是：用第三方库，例如 [SWR](https://swr.vercel.app/) 或者 [React Query](https://tanstack.com/query/latest/docs/framework/react/overview) 之类的。再或者使用第三方框架自带的机制，例如 [Remix](https://remix.run/docs/en/main/guides/data-loading)。

难道 React 没有自带的数据获取方式么？`useEffect` 不行么？

使用 `useEffect` 获取数据异常的麻烦，你需要：

1. 处理成功、失败和 Loading 状态。

2. 处理 [Race Condition](https://react.dev/reference/react/useEffect#fetching-data-with-effects)。

3. 区分空数据和初始数据。

4. 处理 `useEffect` 在[触发两次](https://react.dev/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development)问题。

一个「简单」的使用 `useEffect` 获取数据的代码如下：

<img width="500" src="/assets/images/react-use-fetch-data/fetch-data-useEffect.png">

这也就是为什么第三方数据获取库大行其道的重要原因，因为它们极大的简化了逻辑，同时也包含了 [Cache](https://swr.vercel.app/docs/advanced/cache)、[Prefetching](https://swr.vercel.app/docs/prefetching)、[Middleware](https://swr.vercel.app/docs/middleware) 等等更加高级的功能。

<img width="500" src="/assets/images/react-use-fetch-data/fetch-data-useSWR.png">

不过现在 React 团队推出了一个新的 Hook：[use](https://react.dev/reference/react/use)。

它结合 [Suspence](https://react.dev/reference/react/Suspense) 和 [Error Boundary](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary) 可以非常简单明了的处理成功、失败和 loading 状态。

同时也没有 [Race Condition](https://react.dev/reference/react/useEffect#fetching-data-with-effects) 等等问题。

1. 我们可以把获取数据的 `Promise` 传入到 `use` 中，返回值就是 `Promise` 的 resolve 值，类似于 `await`一般

```javascript
const data = use(dataPromise); 
// 后续处理逻辑

// 类似
const data = await dataPromise;
// 后续处理逻辑
```

2. 使用 [Suspence](https://react.dev/reference/react/Suspense) 处理 Loading 状态。

<img width="500" src="/assets/images/react-use-fetch-data/fetch-data-use-1.png">

3. 使用 [Error Boundary](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary) 或者 `Promise.catch` 处理 Error 状态。

<img width="500" src="/assets/images/react-use-fetch-data/fetch-data-use-2.png">

可以看到和上面 `useEffect` 的代码相比简化了非常多。

同时，`use` 也可以在 Server Components 和 Client Components 之间[传递数据](https://react.dev/reference/react/use#streaming-data-from-server-to-client)。

<iframe src="https://stackblitz.com/edit/stackblitz-starters-zbijzd?ctl=1&embed=1&file=src%2Fmessage.js"    
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="useTransition-only-heavy-example"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"></iframe>

### 总结

不使用第三方库获取数据一直是一个老大难问题，现在我们可以考虑使用 `use`，这也算第一个官方的「原生」获取数据方法。但是 `use` 并没有包含其他的高级功能：[Cache](https://swr.vercel.app/docs/advanced/cache)、[Prefetching](https://swr.vercel.app/docs/prefetching)、[Middleware](https://swr.vercel.app/docs/middleware) 等等在数据获取，或者可以称之为异步数据管理这个问题所必须的功能。

所以我还是如本文开始所说：使用第三方库或者框架来管理异步数据。