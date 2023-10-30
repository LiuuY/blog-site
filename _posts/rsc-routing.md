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
}
```

答案是 B，只有 54.6% 的人答对了。

可运行的案例如下，我们在 `<Details />` (是一个 RSC) 中，加上打印信息，用于观察该组件在服务器端何时构建的。我们刷新页面，在按钮点击之前就能在服务器端看到打印信息：

<img width="781" src="/assets/images/rsc-routing/server-log-1.png">

当点击按钮后，服务器端没有新的打印信息。我们可以知道，在页面加载的时候，这个 RSC 组件已经发送到服务器了。所以应该选 B。

<iframe src="https://codesandbox.io/p/sandbox/dan-question-dr3vj9?file=%2Fapp%2FToggle.tsx%3A3%2C18&embed=1"
     style="width:100%; height: 500px; border:0; border-radius: 4px; overflow:hidden;"
     title="dan-question"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

但是 `<Toggle />` 组件的核心逻辑是：

```javascript
<div>{isOn ? props.children : <p>not showing children</p>}</div>
```

即 `isOn` 是 `false` 的时候，子组件（`<Details />`）不应该渲染；同时，`isOn` 从 `true` 到 `false` 再到 `true`， 由于子组件已经渲染好了，也没有销毁后重新创建（即没有「刷新」）。

而且，假设 `<Details />` 是需要登录才能查看，只有当用户点击按钮后且是登录用户，才渲染该组件，这样才安全。可是使用了 RSC 之后，无论是否点击按钮，都渲染了组件，明显会导致问题。

要了解为什么这样，我们需要了解 RSC 的渲染逻辑。

### RSC 渲染逻辑

首先我们需要有个核心前提： React 规定 Client Components 不能 import Server Components！

```javascript
'use client'

import ServerComponents from './ServerComponents.server.jsx' // ❌
```

Server Components 只能成为 Client Components 的 Props/Children: 

```javascript
// OutletServerComponents.server.jsx
import ClientComponents from './ClientComponents.client.jsx'
import ServerComponents from './ServerComponents.server.jsx'

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

所以我们可以知道，即如果页面上有 Server Components，那组件树的_根组件_一定为 Server Components。

<img width="781" src="/assets/images/rsc-routing/tree.png">

同时，React 规定：组件树上所有的 Server Components 都会一次性发送到浏览器！

所以，无论 `<Toggle />` 如何渲染，`<Details />` 都会一次性渲染好发送到前端：

<img width="781" src="/assets/images/rsc-routing/tree2.png">

### 如何刷新 RSC ？

那如何刷新 Server Components？

一般组件树都是对应了路由，所以我们需要刷新页面获取新的组件树，需要注意的是，这里的「刷新」并不是指浏览器硬刷新。

<iframe src="https://codesandbox.io/p/sandbox/dan-question-forked-tykm8r?file=%2Fapp%2FToggle.tsx&embed=1"
     style="width:100%; height: 500px; border:0; border-radius: 4px; overflow:hidden;"
     title="dan-question-answer"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

我们通过每次点击改变 [`searchParams`](https://nextjs.org/docs/app/api-reference/file-conventions/page#searchparams-optional) 的方式，每次都「刷新」了 Server Component。 

### 如何条件渲染 RSC ？

对于统一页面（同一个组件树）来说，Server Components 从设计上就不允许条件渲染。但是我们可以通过 [Dynamic Rendering](https://nextjs.org/docs/app/api-reference/functions/use-search-params#dynamic-rendering) 的方式，在 Server Components 中获取 Cookie、Headers 或者 SearchParams，进行判断，而渲染不同的内容。

<iframe src="https://codesandbox.io/p/sandbox/dan-question-dynamic-rendering-ly3psy?file=%2Fapp%2Fpage.tsx&embed=1"
     style="width:100%; height: 500px; border:0; border-radius: 4px; overflow:hidden;"
     title="dan-question-dynamic-rendering"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

我们在点击按钮的时候，在 Client Components (`<Toggle />`) 修改 `searchParams` 中 `auth=true` 或 `auth=false`，从而在 Server Components（`<Details />`） 中渲染不同的内容。