---
title: 'React 的核心模式'
date: '2023-11-15'
author:
  name: LiuuY
---

组合模式（Component Composition）被 [Dan Abramov](https://twitter.com/dan_abramov/status/1623771055943831553?s=20) 誉为 2023 最佳的 React 技巧，而且 React 原本也是推荐[组合大于继承（Composition over inheritance）](https://legacy.reactjs.org/docs/composition-vs-inheritance.html)，可见组合模式在 React 中的重要地位。我们下面就来介绍下组合模式常见的三种好处：

1. 减少子组件渲染。

2. 减少 Prop Drilling。

3. 更佳适合 React Server Component。

### 减少子组件渲染

我们有下面的例子，当点击 `<ParentComponent />` 的按钮时，由于 state 的变化，会引起 `<ChildComponent />` 的重新渲染，如果 `<ChildComponent />` 是一个耗时的组件，这明显就会造成性能问题。

```javascript
const ChildComponent = () => {
  return <ExpensiveList />;
};

const ParentComponent = () => {
  const [count, setCount] = useState(0);
  return (
    <div>
      <button onClick={() => setCount(number + 1)}>{count}</button>
      <ChildComponent />
    </div>
  );
};
```

如果我们采用组合的模式，将 `<ChildComponent />` 提升（Lift content up），此时 `<ParentComponent />` 的渲染就不会引起 `<ChildComponent />` 的重新渲染。

```javascript
const ChildComponent = () => {
  return <ExpensiveList />;
};

const ParentComponent = ({ children }) => {
  const [count, setCount] = useState(0);
  return (
    <div>
      <button onClick={() => setCount(number + 1)}>{number}</button>
      {children}
    </div>
  );
};

const App = () => {
  return (
    <ParentComponent>
      <ChildComponent />
    </ParentComponent>
  );
};
```

### 减少 Prop Drilling

将数据（Props）一级一级向下传是一种常见模式，但是如果传的层数过多、过复杂，使得 Debug 和重构都困难：

```javascript
const App = () => {
  const data = useData();

  return (
    <ParentComponent data={data} />
  );
};

const ParentComponent = ({ data }) => {
  return (
    <div>
      <ChildComponent data={data} />
    </div>
  );
};

const ChildComponent = ({ data }) => {
  return <p>{ data }</p>;
};
```

我们一般可以使用 React Context、React Hook 或者其他如 Redux 库等等方式来解决。同时我们也可以考虑使用组合模式，这样也能避免 Prop Drilling：

```javascript
const App = () => {
  const data = useData();

  return (
    <ParentComponent>
      <ChildComponent data={data} />
    </ParentComponent>
  );
};

const ParentComponent = ({ children }) => {
  return (
    <div>
      {children}
    </div>
  );
};

const ChildComponent = ({ data }) => {
  return <p>{ data }</p>;
};
```

### 更佳适合 React Server Component

下面代码的问题是，由于 Client Component 不能 import Server Component，所以 `<ServerComponent />` 只能改为 Client Component，在浏览器渲染，增加发送到浏览器代码量，增加其负担。

```javascript
const App = () => {
  return (
    <ClientComponent />
  );
};

const ClientComponent = () => {
  return (
    <div>
      { /* ❌ Client Component 不能 import Server Component */ }
      <ServerComponent />
    </div>
  );
};

const ServerComponent = () => {
  return <ExpensiveList />;
};
```

但是，我们可以采用组合模式，将 Server Component 作为 children 传递给 Client Component，这样 `<ServerComponent />` 就可以在服务端渲染，减少了浏览器的压力。

```javascript
const App = () => {
  return (
    <ClientComponent>
      <ServerComponent />
    </ClientComponent>
  );
};

const ClientComponent = ({ children }) => {
  return (
    <div>
      {children}
    </div>
  );
};

const ServerComponent = () => {
 return <ExpensiveList />;
};
```

### 总结

组合模式可以说是 React 最核心设计模式，可以说很多 React 的核心逻辑也是围绕组合模式来设计的，希望本文可以加深大家的理解，以「组合」的方式使用 React。