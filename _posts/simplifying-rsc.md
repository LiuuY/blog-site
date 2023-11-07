---
title: '该如何理解 RSC'
date: '2023-11-07'
author:
  name: LiuuY
---

React RSC 已经推出一段时间，它相对于以往我们使用 React 的模式（SPA、SSR/SSG）等等有很大的不同，本文从原理的角度介绍 RSC，使大家更好的理解。

### 两种组件、三种渲染模式

在 RSC 出现之前，我们只有「一种组件」和「两种渲染模式」，「一种组件」即我们所有的组件没有本质的区别，都是一个包含标签（HTML）逻辑（JavaScript）和样式（CSS）的模块，甚至可以说组件就是一个函数：

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

而「两种渲染模式」指的就是，[Client Side Render（CSR）](https://nextjs.org/docs/pages/building-your-application/rendering/client-side-rendering) 和 [Server Side Render（SSR）]((https://web.dev/rendering-on-the-web/#server-side-rendering))（包含 [Server Side Generate（SSG）](https://web.dev/rendering-on-the-web/#static-rendering)），即组件可以在浏览器中渲染成页面可见的 HTML 标签，或者在服务器端预先渲染成 HTML 标签然后发送到浏览器中显示。同时，我们知道 SSR/SSG 只是针对第一加载页面的优化，后续组件还是会在浏览器中渲染（即 [Hydrate](https://react.dev/reference/react-dom/hydrate))。

<img width="781" src="/assets/images/simplifying-rsc/before.png">

在 RSC 的出现后，我们现在有了「两种组件」：Clinet Components 和 Server Components，「三种渲染模式」：CSR、SSR/SSG 和 Server Components Render

#### Server Components

Server Components 是一种只在服务器端渲染的组件，由于并非在浏览器环境渲染，它不能有用户交互相关的逻辑（`onClick`、`useState`等等），一种简单的理解是：我们熟悉的「容器/展示模式」（Container/Presentational Pattern），Server Components 就是将容器组件放到了服务器端渲染，浏览器得到的并不是组件而是已经渲染好的 HTML 标签（严格来说浏览器得到并不是 HTML 标签，这需要经过 SSR 才可以，后面会讲到），当然容器组件和 Server Components 并不完全一致，仅仅是作为易于理解的参考。

使用 Server Components 将用户交互逻辑（使用 Client Components）与可以不在浏览器中完成的逻辑分离，首先可以减少发送到浏览器代码量：

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

Server Components 是如何渲染的呢？很简单，由服务器端将组件渲染完后，再[序列化（Serialization）](https://developer.mozilla.org/en-US/docs/Glossary/Serialization)发送到浏览器。其中最重要的就是「序列化」。

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

由于 Client Components 中的事件处理函数无法序列化，React 采用了记录 Client Components 的位置的「引用」的方式：

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

总结一下，组件树序列化后包含了已经经过渲染的 Server Components 和一个个 Client Components 所在位置的引用。

同时，由于序列化也带来了一些限制，例如 Server Components 向 Client Components 传递的 Props 必须是可以序列化的，否则在后续变无法将渲染的内容序列化：

```javascript 
// OuterServerComponent.tsx
import ClientComponent from './ClientComponent'

export default function OuterServerComponent() {
  const callback = () => alert('call from client') // ❌ NOT Serializable

  return <ClientComponent callback={callback}>
}
```

由于 Server Components 本身是可以序列化的，所以可以将 Server Components 作为 Props 传给 Client Components，这也就是为什么 Client Components 可以包含（作为 children）的原因。

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

那 Server Components Render 对 SSR/SSG 的影响是什么呢？答案是：没有影响。有无 Server Components，SSR/SSG 都仅仅是对于用户第一请求将组件（上述格式）渲染为 HTML 标签发送到浏览器。

<img width="781" src="/assets/images/simplifying-rsc/after.png">

