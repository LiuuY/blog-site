---
title: 'React RSC 的渲染和刷新'
date: '2023-10-30'
author:
  name: LiuuY
---

[Dan Abramov 在 X 上提了一个关于 React Server Component 的问题](https://twitter.com/dan_abramov/status/1648923232937058304)：

> the *only* Client Component out of these is Toggle. it has state (isOn, initially false). it returns <>{isOn ? children : null}</>. what happens when you setIsOn(true)? A. Details gets fetched; B. Details appears instantly

```javascript
function Note({ note }) {
  return (
    <Toggle>
      <Details note={note} />
    </Toggle>
  )
}
```

答案是 B，只有 54.6% 的人答对了。

可运行的代码如下，我们在 `<Details />`（是一个 Server Component）中，加上打印信息，用于观察该组件在服务器端何时构建的。我们刷新页面，在按钮点击之前就能在服务器端看到打印信息：

<img width="781" src="/assets/images/rsc-routing/server-log-1.png">

当点击按钮后，服务器端没有新的打印信息。我们可以知道，在页面加载的时候，这个 Server Component 已经发送到服务器了。所以应该选 B。

<iframe src="https://codesandbox.io/p/sandbox/dan-question-dr3vj9?file=%2Fapp%2FToggle.tsx%3A3%2C18&embed=1"
     style="width:100%; height: 500px; border:0; border-radius: 4px; overflow:hidden;"
     title="dan-question"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

`<Toggle />` 组件的核心逻辑是：

```javascript
<div>
  {isOn ? props.children : <p>not showing children</p>}
</div>
```

这就会产生几个疑问🤔️。

1. `isOn` 是 `false` 的时候，子组件（`<Details />`）不应该渲染，实际情况是已经渲染好了，只是没有显示出来。

2. `isOn` 从 `true` 到 `false` 再到 `true`，也没有销毁后重新创建（即没有「刷新」）。

3. 假设 `<Details />` 是需要登录才能查看，只有当用户点击按钮后且是登录用户，才渲染该组件，这样才安全。可是使用了 Server Components 之后，无论是否点击按钮，都渲染了组件，明显会导致问题。

要了解这是为什么，我们需要了解 RSC 的渲染逻辑。

### RSC 渲染逻辑

首先我们需要有个核心前提：Client Components 不能依赖（import）Server Components，或者说，Server Components 的渲染不可以依赖 Client Components 的行为。

```javascript
'use client'

import ServerComponents from './ServerComponents.jsx' // ❌
```

Server Components 只能成为 Client Components 的 Props/Children: 

```javascript
// OutletServerComponents.server.jsx
import ClientComponents from './ClientComponents.jsx'
import ServerComponents from './ServerComponents.jsx'

export function OutletServerComponents() {
  return (
    <>
      <ClientComponents>
        <ServerComponents />
      </ ClientComponents>

      <ClientComponents child={ServerComponents}>
      </ ClientComponents>
    </>
  )
}
```

所以我们可以知道，即如果有前提：组件树中有 Server Components，那组件树的**根组件**一定为 Server Components，否则作为根组件的 Client Components 则不可以依赖（import）Server Components，那同理，其他**子组件**也就只能是 Client Components 不可以依赖（import）Server Components，从而使整个组件树都是 Client Components ，与前提「组件树中有 Server Components」矛盾。

<img width="781" src="/assets/images/rsc-routing/tree.png">

同时，React 规定：组件树上所有的 Server Components 都会一次性发送到浏览器（也可能先进行 SSR/SSG）。

所以，无论 `<Toggle />` 如何渲染，`<Details />` 都会一次性渲染好发送到前端：

<img width="781" src="/assets/images/rsc-routing/tree2.png">

为什么 React 会做出这样的设计决策？为了避免 Server Components 和 Client Components 的依赖，在页面加载时，就可以避免由于依赖而导致的请求 [Waterfall](https://tanstack.com/query/v5/docs/react/guides/request-waterfalls#what-is-a-request-waterfall)。例如上述案例中，如果 `<Details />` 依赖 `<Toggle />` 而渲染，那么就会导致组件请求需要有先后，从而影响了性能，而这恰恰就是 RSC 要解决的问题之一。

### 如何刷新 RSC ？

是否 Server Components 到了浏览器后就无法更新了呢？是的，Server Components 由于**只**在服务器端渲染，从而不会在浏览器中刷新（Rerender）。

但是 RSC 都是要结合路有使用的，组件树都是对应了路由，所以更新 Server Components 就是刷新页面路有获取新的组件树，需要注意的是，这里的「刷新」并不是指浏览器硬刷新，而是指前端[软刷新](https://nextjs.org/docs/app/building-your-application/routing)，它不会导致前端的状态丢失，同时也不是一定要全屏刷新（整个页面的组件树刷新），可以是[嵌套路由](https://nextjs.org/docs/app/building-your-application/routing#nested-routes)的刷新。

我们修改代码，每次点击按钮改变 [`searchParams`](https://nextjs.org/docs/app/api-reference/file-conventions/page#searchparams-optional) 的方式，使得每次点击都重新渲染了 `<Details />`。 

<iframe src="https://codesandbox.io/p/sandbox/dan-question-forked-tykm8r?file=%2Fapp%2FToggle.tsx&embed=1"
     style="width:100%; height: 500px; border:0; border-radius: 4px; overflow:hidden;"
     title="dan-question-answer"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

除了使用路由刷新，对于 Next.js 也可以使用[缓存刷新（Revalidating）](https://nextjs.org/docs/app/building-your-application/caching#revalidating-1)的方式，但也同样是组件树级别。

### 如何条件渲染 RSC ？

对于统一页面（同一个组件树）来说，Server Components 从设计上就不允许条件渲染。但是我们可以通过 [Dynamic Rendering](https://nextjs.org/docs/app/api-reference/functions/use-search-params#dynamic-rendering) 的方式，在 Server Components 中获取 Cookie、Headers 或者 SearchParams，进行判断，而渲染不同的内容。

我们在点击按钮的时候，在 Client Components (`<Toggle />`) 修改 `searchParams` 中 `auth=true` 或 `auth=false`，从而在 Server Components（`<Details />`） 中渲染不同的内容。

<iframe src="https://codesandbox.io/p/sandbox/dan-question-dynamic-rendering-ly3psy?file=%2Fapp%2Fpage.tsx&embed=1"
     style="width:100%; height: 500px; border:0; border-radius: 4px; overflow:hidden;"
     title="dan-question-dynamic-rendering"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

### 总结

现阶段，RSC 只能是整个组件树级别的刷新，并不能指定某些组件刷新。不同的路有对应着不同的组件树，所以 RSC 的刷新就是路由/缓存的刷新。但是我们可以通过 [Dynamic Rendering](https://nextjs.org/docs/app/api-reference/functions/use-search-params#dynamic-rendering) 的方式，在 Server Components 中获取 Cookie、Headers 或者 SearchParams，进行判断，而渲染不同的内容。

注：组件树级别的刷新并不意味着，所有组件（包括 Client Components 和 Server Components）都会重新渲染，而还是遵循 [React Reconciliation](https://react.dev/learn/preserving-and-resetting-state) 的逻辑，只更新改变了的内容。
