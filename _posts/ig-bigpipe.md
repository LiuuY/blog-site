---
title: 'Instagram.com 首页优化 - BigPipe'
date: '2020-01-18'
author:
  name: LiuuY
---

看了一篇介绍 Instagram 网站优化的文章，[Making Instagram.com faster](https://instagram-engineering.com/making-instagram-com-faster-part-2-f350c8fba0d4)，里面介绍了他们优化页面首次渲染的技术，其中有一种简化的 Facebook BigPipe 技术。我就去 [Instagram](https://www.instagram.com/) 一探究竟。

**继续阅读前，你首先需要知道 [BigPipe](https://www.facebook.com/notes/facebook-engineering/bigpipe-pipelining-web-pages-for-high-performance/389414033919/)**，简单来说就是：利用 HTTP 1.1 的 [Chunked transfer encoding](https://en.wikipedia.org/wiki/Chunked_transfer_encoding)，浏览器边下载首页 HTML 的各个 「chunks」，边解析 HTML，最开始的 「chunks」包含 script 标签下载页面所需的 JavaScript 文件，而后面的 「chunks」中的 script 标签就包含了初始 API 请求的数据结果。这样就节省了 JavaScript 文件中再次需要发送 API 请求获取数据。

![excalidraw-202011822304](https://user-images.githubusercontent.com/14286374/72673406-f9e7ff80-3aa4-11ea-9a04-304fdbcb4dbb.png)


打开 Chrome ，访问  [Instagram](https://www.instagram.com/) ：

1. 在初始页面，找到了如下，这个就是最后数据放置的地方
<img width="1253" alt="ig1" src="https://user-images.githubusercontent.com/14286374/72665074-1a31a300-3a40-11ea-89bd-686faf94a027.png">

2. 服务器渲染数据到一个 Script 标签，并调用初始化函数（类似于 JSONP）。
**我认为这一步渲染的数据如果是一个 JSON 结构的对象的话，可以使用 `JSON.parse` 来优化解析效率，[看这里](https://v8.dev/blog/cost-of-javascript-2019#json)**。

`window._sharedData = JSON.parse('{"config": "csrf" ... }')`

<img width="696" alt="ig2" src="https://user-images.githubusercontent.com/14286374/72665148-7e546700-3a40-11ea-8758-1a6c9ef40dfb.png">

3. 初始化函数就是把数据放到 ` window.__initialData`
<img width="620" alt="ig3" src="https://user-images.githubusercontent.com/14286374/72665190-c07da880-3a40-11ea-9dcc-d6da24fd7cde.png">

4. 我们搜索 ` window.__initialData` ，就能发现实际用到数据的地方
<img width="1015" alt="ig4" src="https://user-images.githubusercontent.com/14286374/72665195-dc814a00-3a40-11ea-9963-d0ee4848628f.png">
