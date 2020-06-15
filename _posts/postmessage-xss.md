---
title: 'postMessage 的 XSS 漏洞'
date: '2020-06-15'
author:
  name: LiuuY
---

一篇好文：[$20000 Facebook DOM XSS](https://vinothkumar.me/20000-facebook-dom-xss/)，作者发现了一个 Facebook 的 XSS 漏洞，Facebook 奖励了他 $20000。🤑

具体细节见上文，结论就是，在使用 postMessage 进行跨站通信时，需要注意因为接收内容而导致的 XSS 漏洞，例如上面的文章中，由于 Facebook SDK 使用 `window.open` 直接打开 postMessage 传递过来的内容，从而导致了攻击者可以直接传递 `javascript:alert(document.domain)` 来获取目标网站的信息。