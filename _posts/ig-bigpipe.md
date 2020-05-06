---
title: 'Instagram.com 首页优化 - BigPipe'
date: '2020-01-18'
author:
  name: LiuuY
---

看了一篇介绍 Instagram 网站优化的文章，[Making Instagram.com faster](https://instagram-engineering.com/making-instagram-com-faster-part-2-f350c8fba0d4)，里面介绍了他们优化页面首次渲染的技术，其中有一种简化的 Facebook BigPipe 技术。我就去 [Instagram](https://www.instagram.com/) 一探究竟。

**继续阅读前，你首先需要知道 [BigPipe](https://www.facebook.com/notes/facebook-engineering/bigpipe-pipelining-web-pages-for-high-performance/389414033919/)**，简单来说就是：利用 HTTP 1.1 的 [Chunked transfer encoding](https://en.wikipedia.org/wiki/Chunked_transfer_encoding)，浏览器边下载首页 HTML 的各个 「chunks」，边解析 HTML，最开始的 「chunks」包含 script 标签下载页面所需的 JavaScript 文件，而后面的 「chunks」中的 script 标签就包含了初始 API 请求的数据结果。这样就节省了 JavaScript 文件中再次需要发送 API 请求获取数据。