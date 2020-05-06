---
title: '你真的会字符串反转、计算字符串长度么？'
date: '2017-09-15'
author:
  name: LiuuY
---

## 问题

一个常见的问题：如何将字符串反转?

一个常见的解答：

```javascript
'abcd'.split('').reverse().join('') // dcba
```

再如，如何得到一个字符串的长度？

答：

```javascript
'abcd'.length // 4
```

这些答案都不是完全正确，或者说并不是对于所有的字符都是适用的，例如：

```javascript
'a💩bc'.split('').reverse().join('') \\ cb��a
'a💩bc'.lenght // 5

'aãbc'.split('').reverse().join('') \\ cb̃aa
'aãbc'.length // 5

```

这其中的原因涉及到了 Javascript 的字符串编码。

## Unicode 及编码

[Unicode](https://en.wikipedia.org/wiki/Unicode) 是一套包含了人类所有的字符、编码、展示的标准。

Unicode 对于每一个字符（character）给了唯一的数字标示，称为[「代码点」（code point）](http://www.unicode.org/versions/Unicode10.0.0/ch02.pdf#G25564)。也就是说 Unicode 利用一个抽象的数字，即 code point 来代表字符。Unicode 定义了 1,114,112 个 code point，十六进制为 0 到 10FFFF，一般的表示方式为 「U+」开头，后面接十六进制表示的 code point，例如：「A」的 code point 为 U+0041。[^1]

在实际的使用、传输 Unicode 中为了减少数据大小等需求，一般会将 code point 编码（encoding）。一般的 encoding 方式为 「UCS-2」、「UTF-16」、「UTF-8」。

- UCS-2：用 16 bit 来表示 code point。现在 code point 的范围已经超越了 16 bit 可以表示的了。

- UTF-16：对于可以使用 16 bit 范围内的 code point，就与 UCS-2 相同；否则：
  - code point 减 0x010000
  - 结果前 10 bit 加 0xD800，后 10 bit 加 0xDC00

这样就会得到两个 16 bit 的结果，范围分别为：0xD800 - 0xDBFF，和 0xDC00 - 0xDFFF，这两个值就代表了相应的 code point，一般称这两个值为「surrogate pairs」。

Unicode 标准保证了所有的 code point 都可以用 UTF-16 表示。

- UTF-8：
  - code point 小于 0x7F，则编码为其本身。
  - code point 大于 0x7F 小于 0x7FF，编码为 110+code point 前五位，10+code point 剩下的。
  - code point 大于 0x7FF 小于 0xFFFF，编码为 1110+code point 前四位，10+code point 剩下的。
  - 剩下的 code point 编码为 11110+code point 前三位，10+code point 剩下的六位。

### 术语

Unicode 中有很多概念需要厘清，和本文关系不大，但是对于更好的理解编码、或者后续的更深入的学习也是有好处的。

- [character](http://unicode.org/glossary/#character)：

> The smallest component of written language that has semantic value; refers to the abstract meaning and/or shape, rather than a specific shape (see also glyph), though in code tables some form of visual representation is essential for the reader’s understanding. 。

- [grapheme](http://unicode.org/glossary/#grapheme)：

> A minimally distinctive unit of writing in the context of a particular writing system

例如，英语中的 ```<b>``` 和 ```<d>```，就是两种不同的grapheme；```<a>``` 和 ```<ɑ>``` 就是同一个 grapheme，是字母 ```a``` 不同表示。

一个 grapheme 可以用一个或多个 code point 表示，例如「ç」的 code point 为 U+0063 U+0327

```javascript
String.fromCodePoint(0x0063, 0x0327); // ç
```

多个 grapheme 也可能只有一个 code point 表示，例如「ﷺ」的 code point 为 U+FDFA，但是「ﷺ」是有多个 grapheme 组成的。	

```javascript
Sting.fromCodePoint(0xFDFA); // ﷺ
```

- [glyph](http://unicode.org/glossary/#glyph)：对于 grapheme 的可视化的表示。

可以看出，我们一般理解中，「字符」都是为「grapheme」；「字体」、「字号」等都是「glyph」。

## 原因

ECMAScript 对于字符的编码方式并没有严格的约定，但是大部分引擎的实现都是 UTF-16，但是，Javascript 对于一个字符的定义（注意和 Unicode 中 「character」的区别）：

> the word “character” will be used to refer to a 16-bit unsigned value used to represent a single 16-bit unit of text [^2]

，**不严格**的说字符串就是一个个 16 bit 字符组成的串（从这个角度来说又和 UCS-2 很相似），也称为（code units）。

```javascript
'a💩bc'[0] // a
'a💩bc'[1] // �
'a💩bc'[2] // �
'a💩bc'[3] // b
'a💩bc'[4] // c

'aãbc'[0] // a
'aãbc'[1] // a
'aãbc'[2] //  ̃
'aãbc'[3] // b
'aãbc'[4] // c
```

「💩」的 code point 长度大于 16 bit 的使用 UTF-16 的「surrogate pairs」即，两个 16 bit 来表示，但同时，内部的很多处理都是按照字符（16 bit）, 例如：

```javascript
'a💩bc'.length === 5
```

所以就产生了上面字符串反转的问题：

```javascript
String.fromCodePoint(0xD83D, 0xDCA9) \\ 💩
```

将 ```0xD83D 0xDCA9``` 反转为 ```0xDCA9 0xD83D``` 导致错误的字符串。

「ã」则是由字符「a」和一个 combining marks 「 ̃」组合成的一个字符：

```javascript
String.fromCodePoint(0x0061, 0x0303) \\ ã
```

类似的将其按照 16 bit 反转后就会有问题。

## 解答

根据 UTF-16 对于「surrogate pairs」的定义和 「combining marks」的 code point 位置，我们可以自己处理字符串反转的问题，

以「surrogate pairs」为例：

```javascript
const regexSurrogatePair = /([\uD800-\uDBFF])([\uDC00-\uDFFF])/g

const reverse = (string) => {
  return string.replace(regexSurrogatePair, ($0, $1, $2) => {
  return $2 + $1 // 先将「surrogate pairs」反转
  }).split('').reverse().join('')
}

reverse('a💩bc') // cb💩a
```

更全面的库 [esrever](https://github.com/mathiasbynens/esrever)。

而对于「长度」问题：

```javascript
[...'a💩bc'].length // 4
```

或

```javascript
let count = 0

for (let codePoint of 'a💩bc') {
  count++
}

count // 4
```

因为[```String.prototype[@@iterator]()```](http://www.ecma-international.org/ecma-262/6.0/#sec-string.prototype-@@iterator)是遍历的 code point。

## 总结

Javascript 字符串对外并没有暴露 code point ，而是以 16 bit 为单位（UCS-2）提供，导致了 code point 长度大于 16 bit 的字符（non-BMP）在某些操作上会有问题（反转、取长度），所以在对于这种字符就需要特别处理。

[^1]: https://en.wikipedia.org/wiki/Unicode
[^2]: http://es5.github.io/x6.html#x6