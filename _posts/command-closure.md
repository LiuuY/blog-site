---
title: 'Command 模式与闭包'
date: '2020-06-01'
author:
  name: LiuuY
---

[Command 模式](https://en.wikipedia.org/wiki/Command_pattern)，是一种在 OOP 中封装实现（command）和执行分割的模式，正如 [Wikipedia](https://en.wikipedia.org/wiki/Command_pattern) 里面所说：

> The central ideas of this design pattern closely mirror the semantics of first-class functions and higher-order functions in functional programming languages. Specifically, the invoker object is a higher-order function of which the command object is a first-class argument.

即，Command 模式就是为了模拟一些函数式编程中的语法概念，如：first-class functions、闭包。

因为 [Wikipedia](https://en.wikipedia.org/wiki/Command_pattern) 里面的 JavaScript 例子过于简单，我稍微修改下：

```javascript

"use strict";

/* The Invoker function */
class Switch {
  execute(command) {
    command.execute();
  }
}

/* The Receiver function */
class Light {
  turnOn(id) { console.log(`trun on ${id}`) }
  turnOff(id) { console.log(`turn off ${id}`) }
}

/* The Command */
class FlipDownCommand {
  constructor(light, id) {
    this._id = id;
    this._light = light;
  }

  execute() {
    this._light.turnOff(this._id);
  }
}

/* The Command */
class FlipUpCommand {
  constructor(light, id) {
    this._id = id;
    this._light = light;
  }

  execute() {
    this._light.turnOn(this._id);
  }
}

var light = new Light();
var switchUp = new FlipUpCommand(light, 110);
var switchDown = new FlipDownCommand(light, 110);

/* execute later */
var switcher = new Switch();
switcher.execute(switchUp);
switcher.execute(switchDown);

```

可以看出来，Command 模式，就是提前保存了 `FlipUpCommand` 和 `FlipDownCommand` 以及他们参数，而 `switcher` 可以在合适的时候调用。

如果使用函数式编程的概念重构呢？

```javascript

class Light {
  turnOn(id) { console.log(`trun on ${id}`) }
  turnOff(id) { console.log(`turn off ${id}`) }
}

function command(func, id) {
  return (function() {
    func(id);
  });
}

var light = new Light();
var switchUp = command(light.trunOn, 110);
var switchDown = command(light.turnOff, 110);

/* execute later */
switchUp();
switchDow();

```

这样利用 first-class functions、闭包就能同样实现 Command 模式的效果。
