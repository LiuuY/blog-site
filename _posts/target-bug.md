---
title: 'target="_blank" 的重大漏洞'
date: '2020-04-01'
author:
  name: LiuuY
---

在日常代码中我们经常这样写：<a href="bad.example.com" target="_blank"> 或者 window.open('bad.example.com')，但是在打开的 bad.example.com 页面中就能通过 window.opener 访问到原本页面的 window 对象😱。

解决方法：rel=noopener
