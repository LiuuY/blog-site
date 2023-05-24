---
title: 'Front-End New Wave 🌊'
date: '2023-05-24'
author:
  name: LiuuY
---

1. **SPA is NOT Sensible Default ❌**

   考虑到日益膨胀的前端代码量，对于前端性能、开发体验和用户体验等等的影响，不再将 **[SPA (Single-page application)](https://developer.mozilla.org/en-US/docs/Glossary/SPA)，作为前端项目架构的默认选项。**

2. **“Hybrid Rendering” is A Sensible Choice ✅**

   使用新的框架 [Next.js](https://nextjs.org/)、[Qwik](https://qwik.builder.io/)、[Astro](https://astro.build/) 等等，混合后端生成和前端渲染，显著的减少发送到浏览器的 JavaScript 包大小，提升页面速度及用户体验。他们**尤其**适用于电商、内容博客等重内容且对于用户访问速度体验要求高的网站。对于需要大量浏览器渲染和交互的网站，例如邮箱，地图不是很适用。

   > 「后端生成」包括 [SSR](https://web.dev/rendering-on-the-web/#server-side-rendering)、[SSG](https://web.dev/rendering-on-the-web/#static-rendering)，也包括 [RSC](https://nextjs.org/docs/getting-started/react-essentials)，Qwik 提供的 [Resumable](https://qwik.builder.io/docs/concepts/resumable/)、Astro 提供的 [Astro Islands](https://docs.astro.build/en/concepts/islands/)。不同于 SSR 和 SSG 主要针对的是首次加载，而且由于后续的交互需要 **Hydration** ，其对于包大小没有优化。而例如 Qwik 提供的 [Resumable](https://qwik.builder.io/docs/concepts/resumable/)，则不需要 **Hydration** 过程。
   > <img width="781" src="/assets/images/frontend-new-wave/render.png">
