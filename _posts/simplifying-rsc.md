---
title: '该如何理解 React RSC'
date: '2023-11-09'
author:
  name: LiuuY
---

React RSC 已经推出一段时间，相对于常见的 React 的渲染模式（SPA、SSR/SSG）等等有很大的不同，它将数据获取、服务端/浏览器端渲染融合在一起，[减少了包大小、提升了渲染性能](https://vercel.com/blog/understanding-react-server-components#rscs-performance-and-bundle-size)。但同时也增加了 React 的复杂度，甚至截止本文发布时只有 [Next.js 支持 RSC](https://nextjs.org/docs/app/building-your-application/rendering/server-components)， 所以本文从原理的角度介绍 RSC，帮助大家更好的理解。

### 两种组件、三种渲染模式

在 RSC 出现之前，我们只有「一种组件」和「两种渲染模式」，「一种组件」指所有的组件没有本质的区别，都是一个包含标签（HTML）逻辑（JavaScript）和样式（CSS）的模块，甚至可以说组件就是一个函数：

```javascript
function Greeting({ name }) {
  return (
    <h1 className="greeting">
      Hello <i>{name}</i>. Welcome!
    </h1>
  );
}
```

JSX 仅仅是创建标签的语法糖，上面的代码也就是：

```javascript
import { createElement } from 'react';

function Greeting({ name }) {
  return createElement(
    'h1',
    { className: 'greeting' },
    'Hello ',
    createElement('i', null, name),
    '. Welcome!'
  );
}
```

而「两种渲染模式」指的就是，渲染组件的方式，包括：[Client Side Render（CSR）](https://nextjs.org/docs/pages/building-your-application/rendering/client-side-rendering) 和 [Server Side Render（SSR）]((https://web.dev/rendering-on-the-web/#server-side-rendering))（包含 [Server Side Generate（SSG）](https://web.dev/rendering-on-the-web/#static-rendering)），即组件可以在浏览器中渲染成页面可见的 HTML 标签，或者在服务器端预先渲染成 HTML 标签然后发送到浏览器中显示。同时，我们知道 SSR/SSG 只是针对第一加载页面的优化，后续组件的行为还是会在浏览器中渲染（即 [Hydrate](https://react.dev/reference/react-dom/hydrate))。

<img width="781" src="/assets/images/simplifying-rsc/before.png">

但在 RSC 的出现后，我们现在有了「两种组件」：Clinet Components 和 Server Components，「三种渲染模式」：CSR、SSR/SSG 和 Server Components Render

#### Server Components

Server Components 是一种**只**在服务器端渲染的组件，由于不会在浏览器环境渲染，它不能有用户交互相关的逻辑（`onClick`、`useState` 等等）。原先我们熟悉的组件则称为 Client Components。

Client Components 中的「Client」有些误导，它指的并不是组件只能在「Client」（一般就是浏览器）中渲染，也可以使用 SSR/SSG 渲染。

Client Components 与 Server Components 的核心区别就是，Client Components 无论是否 SSR/SSG 渲染（也仅仅针对第一次请求），后续渲染都需要在浏览器中由 React 完成，而 Server Components 永远不会在浏览器渲染，包括数据请求也在服务端完成，而且 Server Components 的刷新（Rerender）也是通过[路由刷新](https://liuuy.cc/posts/rsc-routing)，重新在服务器端完成，然后在发送给浏览器，如果所有数据请求都在 Server Components 完成，浏览器就不会发一个数据请求🤯。

一种简单的理解是：我们熟悉的「容器/展示模式」（Container/Presentational Pattern），Server Components 就是将容器组件放到了服务器端渲染，浏览器得到的并不是组件而是已经渲染好的 HTML 标签（严格来说浏览器得到并不是 HTML 标签，这需要经过 SSR/SSG 才可以，后面会讲到），当然容器组件和 Server Components 并不完全一致，仅仅是作为易于理解的参考。

使用 Server Components 将用户交互逻辑（使用 Client Components）与可以不在浏览器中完成的逻辑分离，首先可以减少发送到浏览器代码量，比如这个 Server Component：

```javascript
import { parseISO, format } from 'date-fns'

async function DateDisplay() {
  const dateString = await getCurrentDate()
  const date = parseISO(dateString)

  return <time dateTime={dateString}>{format(date, 'yyyy-MM-dd')}</time>
}
```

由于这个组件在服务器端渲染，浏览器得到的只是 `<time datetime="2008-02-14">2008-02-14</time>`，并不会包含 `date-fns` 这个库，这样便可以显著的减少发送到浏览器的包大小。

同时，由于服务器端并没有并发请求限制而且离数据源更近，使得请求速度快，渲染更快。

#### Server Components Render

Server Components 是如何渲染的呢？很简单，由服务器端将组件渲染完后，再[序列化（Serialization）](https://developer.mozilla.org/en-US/docs/Glossary/Serialization)发送到浏览器，序列化后的格式被称为：[RSC Wire Format](https://twitter.com/dan_abramov/status/1631646794059743232) (有时候也被称为：RSC Payload 或 RSC Flight Format)。

例如：

```javascript
// ClientComponent.jsx
"use client";

export default function ClientComponent({ children }) {
  return (
    <div>
      <button onClick={() => alert("hello")}>Show</button>
      {children}
    </div>
  );
}


// OuterServerComponent.jsx
import ClientComponent from './ClientComponent'
import ServerComponent from './ServerComponent'

export default function OuterServerComponent() {
  return (
    <ClientComponent>
      <DateDisplay />
    </ClientComponent>
  )
}
```

对于 Server Components 可以转化成（实际格式更为复杂）：

```javascript 
// <DateDisplay />
{
  $$typeof: Symbol(react.element),
  type: "time",
  props: {
    dateTime: '2008-02-14',
    children: "2008-02-14"
  }
}
```

由于 Client Components 中的可能存在事件处理函数、Promise 等等无法序列化，RSC Wire Format 采用了记录 Client Components 的「模块的引用」的方式，包括组件所在的文件位置、名字等等：

```javascript
// <ClientComponent />
{
  $$typeof: Symbol(react.element),
  type: {
    $$typeof: Symbol(react.module.reference),
    name: "default",
    filename: "./src/ClientComponent.client.js"
  }
}
```

这样，在真正需要渲染成 HTML 的时候（CSR、SSR/SSG），就可以通过这些「模块的引用」找到真正的代码并执行。

总结一下，Server Component Render 即是将组件树中的 Server Components 在服务器端渲染；对于 Client Components 则记录其所在模块，然后序列化为 RSC Wire Format，供后续的 SSR/SSG 或者 CSR 渲染使用。

同时由于序列化也带来了一些限制，例如 Server Components 向 Client Components 传递的 Props 必须是可以序列化的，否则在后续变无法将渲染的内容序列化：

```javascript 
// OuterServerComponent.tsx
import ClientComponent from './ClientComponent'

export default function OuterServerComponent() {
  const callback = () => alert('call from client') // ❌ NOT Serializable

  return <ClientComponent callback={callback}>
}
```

但是由于 Server Components 本身是可以序列化的，所以可以将 Server Components 作为 Props 传给 Client Components，这也就是为什么 Client Components 可以包含（作为 children）的原因。

```javascript 
// OuterServerComponent.tsx
import ClientComponent from './ClientComponent'
import ServerComponent from './ServerComponent'

export default function OuterServerComponent() {
  return (
    <ClientComponent>
      <ServerComponent />
    </ClientComponent>
  )
}
```

那 Server Components Render 对 SSR/SSG 的影响是什么呢？答案是：没有影响。从上面的描述，我们也能看出，SSR/SSG 都是后续针对 RSC Wire Format 的渲染流程，有无 Server Components，SSR/SSG 都仅仅是对于用户第一请求将 RSC Wire Format 渲染为 HTML 标签后发送到浏览器。

可以将这个流程看作一个流水线：

<img width="781" src="/assets/images/simplifying-rsc/after.png">

### 总结

RSC 增加了一种新的组件形式：Server Components，一种**只**在服务器端渲染的组件，它的刷新需要结合路有操作。Server Components 可以显著减小发送浏览器包的大小，以及数据请求的性能。

RSC 的渲染逻辑是：组件树在服务器端渲染并序列化成为 RSC Wire Format 后，再进行 SSR/SSG 成为 HTML 或者发送给浏览器供 React 直接使用。