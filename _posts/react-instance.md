---
title: '如何在浏览器中获取 Production Mode 的 React 实例'
date: '2020-01-07'
author:
  name: LiuuY
---

在 Production Mode 下，React 并没有暴露其实例。无论什么原因如果你要获取的话可以参考以下方法。

## 条件
 - 浏览器安装了 [React Developer Tools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en)

## 步骤

以[知乎](https://www.zhihu.com/)为例

- 打开浏览器 Console，输入 `__REACT_DEVTOOLS_GLOBAL_HOOK__`，这是 React Developer Tools 暴露的全局变量。

<img width="861" alt="1" src="https://user-images.githubusercontent.com/14286374/71900075-02ccfd00-3198-11ea-816b-438043ca7718.png">

- `__REACT_DEVTOOLS_GLOBAL_HOOK__` 的对象中包含了一个 `renderers`，找到其中其中的 `findFiberByHostInstance` 方法，右键，然后选择 `Show function definition`。

<img width="817" alt="2" src="https://user-images.githubusercontent.com/14286374/71900368-ab7b5c80-3198-11ea-9189-e0eb2d4ad54c.png">

- 浏览器会跳到 Sources Tab 中，点击左下角 Pretty print。
<img width="687" alt="3" src="https://user-images.githubusercontent.com/14286374/71900549-feedaa80-3198-11ea-8e99-d5c45554c3f4.png">

- 在 `findFiberByHostInstance` 对应的文件就是 ReactDOM 所在的文件，然后在这个文件中搜索（ctrl + f） `createElement` 方法，这就是 React 本身包含的方法。在搜索结果中找到类似如下的位置，加断点。

<img width="819" alt="4" src="https://user-images.githubusercontent.com/14286374/71901100-26914280-319a-11ea-8af1-c9093704efb0.png">

- 刷新浏览器，在浏览器断点暂停后，对应的例如上面的 `a.a` 就是 React 实例了，可以在 Console 中打印看看。如果没有断点暂停，说明代码并没有运行到，可以更换`createElement` 方法出现的位置加断点。

<img width="823" alt="5" src="https://user-images.githubusercontent.com/14286374/71901186-635d3980-319a-11ea-8258-b824e80525b2.png">