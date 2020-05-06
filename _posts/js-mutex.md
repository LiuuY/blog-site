---
title: 'JavaScript 实现线程锁'
date: '2017-07-16'
author:
  name: LiuuY
---

[ECMAScript 2018](https://tc39.github.io/ecma262/) 中增加了 [SharedArrayBuffer](https://tc39.github.io/ecma262/#sec-sharedarraybuffer-objects) 和 [Atomics](https://tc39.github.io/ecma262/#sec-atomics-object) ，利用它们可以实现锁（Lock），即页面主线程和 Web Worker 线程间的锁。

## SharedArrayBuffer

SharedArrayBuffer（以下简称为SAB） 是一个可以主线程和 Web Worker 线程间共享数据的对象，即同一个 SAB 可以被多个线程***读写***。

```javascript
let sab = new SharedArrayBuffer(1024);
worker.postMessage(sab);
```

SAB 避免了多个线程间为了传递数据而进行数据拷贝，但同时缺引入了经典的数据访问「冲突」：

```javascript
// 线程A
let sharedBuffer = new SharedArrayBuffer(1024);
let sharedArray = new Int32Array(sab);

let worker = new Worker("browser-worker.js");
worker.postMessage(sab);

sharedArray[1] = 1;

// 线程B
onmessage = function (e) {
  let sharedBuffer = e.data;
  let sharedArray = new Int32Array(sab);

  sharedArray[1] = 10;
  sharedArray[2] = sharedArray[1] + sharedArray[1];
  // sharedArray[2] = ? :(
}

```

这时候就需要[原子操作](https://en.wikipedia.org/wiki/Linearizability)。

## Atomics

Atomics 可以实现对于 SAB 原子访问，其包含很多[操作](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Atomics#Methods)。

我们下面会用到的：

`Atomics.store(typedArray, index, value)`：向 SAB 的 index 位置赋值 value。

`Atomics.wait(typedArray, index, value[, timeout])`：验证 Int32Array 的 index 位置是否为给定的 value，是则睡眠（阻塞），否则继续执行。

`Atomics.wake(typedArray, index, count)`：唤醒 Int32Array 的 index 位置上wait 队列（Atomics.wait 产生）。

`Atomics.sub(typedArray, index, value)`：index 位置的值减去 value 并保存到 index 位置，返回***原值***。

`Atomics.compareExchange(typedArray, index, expectedValue, replacementValue)`：如果 index 位置的值为 expectedValue，则与 replcementValue 交换，返回***原值***。

## Lock

有了上面的 SAB 和 Atomics 就可以实现一个很「简单」的线程锁，

简单来说，就是利用 SAB 在多个线程间共享控制位，当控制位为「已锁」时，则暂停线程。这些操作都依赖 Atomics。

***注意***：这个算法是 [Futex](https://en.wikipedia.org/wiki/Futex)，参考了[Futexes Are Tricky](https://www.akkadia.org/drepper/futex.pdf)。

```javascript
// lock 
if ((c = Atomics.compareExchange(SAB, index, 0, 1)) !== 0) { // 不为0，说明其他人持锁
  do {
    if (c === 2 || Atomics.compareExchange(SAB, index, 1, 2) != 0) { // 如果依旧得不到锁
      Atomics.wait(SAB, index, 2); // 暂停
    }
  } while ((c = Atomics.compareExchange(SAB, index, 0, 2)) !== 0) // 再次尝试获取锁
}

// unlock
let v0 = Atomics.sub(SAB, index, 1); // 此时拥有锁，状态为1或2
if (v0 != 1) {
  Atomics.store(SAB, index, 0); // 释放锁
  Atomics.wake(SAB, index, 1); // 唤醒一个 wait 的
}
```

### 参考

1. [Shared memory and atomics](http://exploringjs.com/es2016-es2017/ch_shared-array-buffer.html)
2. [A Taste of JavaScript’s New Parallel Primitives](https://hacks.mozilla.org/2016/05/a-taste-of-javascripts-new-parallel-primitives/)
3. [https://www.akkadia.org/drepper/futex.pdf](https://www.akkadia.org/drepper/futex.pdf)
4. [一个完整的实现](https://github.com/lars-t-hansen/js-lock-and-condition)
