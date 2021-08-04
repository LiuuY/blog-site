---
title: "前端架构之 JAMStack"
date: "2020-05-02"
author:
  name: LiuuY
---

## 什么是 JAMStack

JAMStack（JAM 代表 **J**avaScript，**A**PI 和 **M**arkup）是一种使用 [Static Site Generators](https://www.staticgen.com/) (SSG) 技术、不依赖 Web Server 的前端架构。

它的核心是：**不依赖 Web Server。**

这看起来和把一个静态网站部署到文件服务器没什么区别。我理解，JAMStack = 现代 SSG 框架 + DevOps + Serverless，是一种「究极」的前后端分离。

激进的说，「[Static is the new dynamic](https://rauchg.com/2020/2019-in-review#static-is-the-new-dynamic)」。

![cdn](https://user-images.githubusercontent.com/14286374/80860439-2d3c4c00-8c9a-11ea-934d-c6a1ea994329.png)

_一种有趣的比喻是：「[CDN 优先应用程序](https://www.thoughtworks.com/cn/radar/techniques/jamstack)」。_

## JAMStack 好在哪

1. **高性能**：由于网页是静态生成的，没有额外的网络数据请求，它的 [Time to first byte](https://en.wikipedia.org/wiki/Time_to_first_byte) (TTFB)性能是最佳的（因为不涉及后端、数据库等等）。

2. **易部署**：因为 JAMStack 不依赖 Web Server，部署就仅仅是把生成的网页放到 [CDN](https://en.wikipedia.org/wiki/Content_delivery_network) 就可以了。

3. **强安全**：同样因为不依赖 Web Server 的原因，就导致 JAMStack 网站的攻击面很小。

4. **易开发**：JAMStack 由于其特性，开发也极其简单，不强依赖后端，开发、测试仅仅是部署到一个静态文件服务器即可。现在「三大框架」都有相应的 SSG 方案，学习成本不高。

---

对比 Client Side Rendering（CSR），SSG 的 TTFB 有明显的优势；同时由于提前渲染，SEO 也更友好。

对比 Server Side Rendering（SSR），SSG 部署简单，直接放到 CDN 即可，不依赖 Node Server 动态渲染。TTFB 也优于 SSR。

---

[Next.js](https://nextjs.org/) 的作者之一 [Guillermo Rauch](https://vercel.com/about/rauchg) 提到，由于 JAMStack 的易部署特性，给整个前端的开发测试流程带了翻天覆地的变化：「[The Deploy URL, the Center of Gravity](https://rauchg.com/2020/2019-in-review#testing-the-jamstack)」，即在开发、测试、验收等等的流程中，核心是围绕 URL。

- UX 想看到现在开发的网页效果，开发只需要部署到一个暂时的 URL，然后把它发给 UX 就可以了；
- 多个 feature 分支，测试都可以在自己独立的 URL 中实时看到效果；
- E2E 测试、用户测试也独立在一个 URL 中；
- 等等...

![url2](https://user-images.githubusercontent.com/14286374/80860449-3b8a6800-8c9a-11ea-92f8-65241800305d.png)

## 如何实现 JAMStack

现在「三大框架」都有相应的 SSG 方案，既满足了多样化、复杂化的前端开发需要，又能简单的生成静态网页：

1. [Next.js](https://nextjs.org/) 是基于 React 的 SSR/SSG 框架。
2. [Scully](https://github.com/scullyio/scully) 是基于 Angular 的 SSG 框架。
3. [VitePress](https://github.com/vuejs/vitepress) 是 Vue 官方推出的 SSG 框架。

部署方面有 [Vercel](https://vercel.com/)、[Netlify](https://www.netlify.com/)、[腾讯云云开发](https://cloud.tencent.com/product/tcb?from=12334)等等。

## [Ledge](https://devops.phodal.com/) 项目的实践

> Ledge（源自 know-ledge，意指承载物）知识平台是基于我们所进行的一系列 DevOps 实践、敏捷实践、精益实践提炼出来的知识体系。

Ledge 网站使用 Angular 开发。作为一个类 Wiki 型的网站，它使用 Markdown 作为编写内容的语言，使用 [Ledge Framework](https://www.npmjs.com/package/@ledge-framework/render) 动态的将 Markdown 转换为 HTML。这就涉及到，如果转换过程在浏览器进行，势必导致性能的下降，和对 SEO 的影响。

所以我们选择了 [Scully](https://scully.io/docs/showcase) 作为 SSG 框架，在 build 阶段依据路由将内容提前转换为 HTML 页面：

![ledge](https://user-images.githubusercontent.com/14286374/80860454-4513d000-8c9a-11ea-907e-9c88f7a93c47.png)
_项目的开发部署流程_

各方面性能都有了大幅提高：

![data](https://user-images.githubusercontent.com/14286374/80860462-4ba24780-8c9a-11ea-8a2a-e79af72b6754.png)
_对比 JAMStack 和 CSR_
