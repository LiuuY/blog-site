---
title: 'AirPods Pro 官网动效揭秘'
date: '2020-01-25'
author:
  name: LiuuY
---

新年想买个新耳机 🎧，逛了下[苹果官网](https://www.apple.com.cn/cn/airpods/)，发现 AirPods Pro 网站的动效很酷炫（电脑的风扇也转的飞起），尤其是里面的动效都是跟随滚动条而且十分顺滑：
**最好去官网自己体会下**
![output2](https://user-images.githubusercontent.com/14286374/73084808-99bfe600-3f08-11ea-9cd9-58688491b5f7.gif)
「本能」打开 DevTools 一探究竟：
<img width="775" alt="1" src="https://user-images.githubusercontent.com/14286374/73085561-d8a26b80-3f09-11ea-965d-8fcbb1c4406a.png">
<img width="781" alt="2" src="https://user-images.githubusercontent.com/14286374/73085699-130c0880-3f0a-11ea-9b87-de8b9292a216.png">
原来是，一帧一帧的图片，根据滚动条展示出来。

