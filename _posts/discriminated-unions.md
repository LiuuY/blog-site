---
title: 'TypeScript 可识别联合 Discriminated Unions'
date: '2023-10-25'
author:
  name: LiuuY
---

使用 TypeScript 时一个常见的需求：如何定义一个具有部分相同成员的类型。

例如，我们第一个 Pet 类型，它可能是狗汪汪叫，也可能是猫喵喵叫，同时都有体重和颜色两个属性：

```typescript
type Pet = {
    type: '狗' | '猫';
    sound: '汪汪' | '喵喵';
    weight: number;
    color: string;
}
```

但是这个类型并不会阻止我们定一个「喵喵叫的狗」😄：

```typescript
const dog: Pet = {
    type: 'dog',
    sound: 'neow', // 这里不会报错，
    weight: 10,
    color: 'gold'
}
```

这种情况我们可以使用可识别联合（Discriminated Unions）：当 type/interface 中有有个[字面量（literal）](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#literal-types)成员，我们可以使用它区分不同的联合。

我们先分别定义 `Dog` 和 `Cat` 两个类型，其中包括了 `type` 和 `sound`，两个字面量成员，然后分别（`|`）将其与共同的成员 `weight` 和 `color` 组合（`&`）在一起：

```typescript
type Dog = {
    type: 'dog';
    sound: 'woof';
}

type Cat = {
    type: 'cat';
    sound: 'neow';
}

type Pet = {
    weight: number;
    color: string;
} & (Dog | Cat);

const dog: Pet = {
    type: 'dog',
    sound: 'neow',
    weight: 10,
    color: 'gold'
}
```

此时「喵喵叫的狗」就会导致错误：

```
Type '{ type: "dog"; sound: "neow"; weight: number; color: string; }' is not assignable to type 'Pet'.
  Types of property 'sound' are incompatible.
    Type '"neow"' is not assignable to type '"woof"'.
```

而且我们也可以通过 [`Type Guards`](https://www.typescriptlang.org/docs/handbook/advanced-types.html#type-guards-and-differentiating-types)，在分支逻辑中帮助我们检查类型错误：


```typescript
const howThePetSound = (pet: Pet) => {
    if (pet.type === 'dog') {
        console.log(pet.sound === 'neow') // 会报错
    }
}
```

错误信息：

```
This comparison appears to be unintentional because the types '"woof"' and '"neow"' have no overlap.
```