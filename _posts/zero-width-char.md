---
title: '使用零宽字符发现泄密者'
date: '2023-11-13'
author:
  name: LiuuY
---

有时候，我们可能在内网发布了机密信息，不想被外人知道，但是总会有人直接复制粘贴到外网从而泄密，此时我们如何能找到泄密者呢？

我们可以在机密文档中将打开者的名字编码为「零宽字符」插入到文档中，让后通过将外网的泄密文档解码就能找到泄密者。

### 零宽字符

零宽字符指的是一种[控制字符](https://zh.wikipedia.org/wiki/%E6%8E%A7%E5%88%B6%E5%AD%97%E7%AC%A6)，一般用于页面排版，它们不会显示出来。

例如：

> 零宽空格（zero-width space, ZWSP）是一种不可打印的Unicode字符，用于可能需要换行处。

> 零宽不连字 (zero-width non-joiner，ZWNJ)是一个不打印字符，放在电子文本的两个字符之间，抑制本来会发生的连字，而是以这两个字符原本的字形来绘制。

> 零宽连字（zero-width joiner，ZWJ）是一个控制字符，放在某些需要复杂排版语言（如阿拉伯语、印地语）的两个字符之间，使得这两个本不会发生连字的字符产生了连字效果。

> 连词字符（英语：Word joiner，简称“WJ”）是一个在Unicode中的格式字符，于部分不使用显式间距（explicit spacing）的语言中用作表达一个不应出现分字的地方。


而且如名字所说，它是「零宽」的，不可见，我们就利用这一点，在机密文档中插入「零宽字符」从而神不知鬼不觉记录了泄密者。

### 实现

如何将泄密者名字编码为零宽字符呢？

编码阶段：

1. 将泄密者名字转换为二进制。

```javascript
const toBinary = (text) =>
  text
    .split('')
    .map(char => char.charCodeAt(0).toString(2))
    .join(' ');
```

```javascript
toBinary('小王') // '101110000001111 111001110001011'
```

2. 将二进制的「1」对应「零宽空格」，「0」对应「零宽不连字」，「空格」对应「零宽连字」，然后将其用「连词字符」连起来。

```javascript
const binaryToZeroWidth = (binary) =>
  binary
    .split('')
    .map(binaryNum => {
      const num = parseInt(binaryNum, 10);
      if (num === 1) {
        return '\u{200B}';
      } else if (num === 0) {
        return '\u{200C}';
      }
      return '‍\u{200D}';
    })
    .join('‍\u{2060}');
```

3. 将编码为零宽字符的二进制插入到机密文档中。

```javascript
const incertText = (confidentialText, username) => {
  return confidentialText + binaryToZeroWidth(toBinary(username))
}
```

解码阶段：

1. 移除非零宽字符。

```javascript
const removeText = (original) => {
  return original.replace(/\p{L}|\p{N}/gu, ''); // 将字符和数字移除
}
```

2. 将零宽字符转换为二进制。

```javascript
const zeroWidthToBinary = (zeroWidthStr) =>
  zeroWidthStr
    .split('‍\u{2060}')
    .map(char => {
      if (char === '\u{200B}') {
        return '1';
      } else if (char === '\u{200C}') {
        return '0';
      }
      return ' ';
    })
    .join('');
```

```javascript
zeroWidthToBinary(binaryToZeroWidth(toBinary('小王'))) // '101110000001111 111001110001011'
```

3. 将二进制转换为泄密者名字。

```javascript
const binaryToText = (binary) =>
  binary
    .split(' ')
    .map(num => String.fromCharCode(parseInt(num, 2)))
    .join('');
```

```javascript
binaryToText(zeroWidthToBinary(binaryToZeroWidth(toBinary('小王')))) // '小王'
```