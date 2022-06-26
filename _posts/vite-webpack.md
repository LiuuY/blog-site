---
title: "Vite vs. Webpack 速度对比"
date: "2022-06-26"
author:
  name: LiuuY
---

最近将 [vehicle-plate-keyboard](https://github.com/LiuuY/vehicle-plate-keyboard) 迁移到 [Vite](https://github.com/vitejs/vite)。

同为构建 umd 格式速度对比，包括 PostCSS、SASS

| Vite@2.9.12 | vs. | Webpack@4.3.3 |
| ----------- | --- | ------------- |
| 6.59s       |     | 5.57s         |

虽然在编译速度略落后于 Webpack，但是 Vite 有更好的输出 es 格式支持，配置也非常简单。
