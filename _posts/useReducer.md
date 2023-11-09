---
title: '两种 useReducer 使用场景'
date: '2023-11-06'
author:
  name: LiuuY
---

我发现很多人 [useReducer](https://react.dev/reference/react/useReducer) 使用的频率很少，大多都是使用 useState 来管理状态，但是很多情况下用  useReducer 更加合适，这里介绍两种场景：1. 组件中包含非常多的 useState；2. 全局状态管理。

### 组件中包含非常多的 useState

有时候，我们的组件可能会包含多个状态（state），例如设计一个用户地址组件：

```javascript
import { useState } from 'react'

function UserAddress() {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phone, setPhone] = useState('')
  const [street, setStreet] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [country, setCountry] = useState('')

  const handlePhoneInput = (value) => {
    if (value[0] !== '1') {
      // 错误处理
    }
    setPhone(value)
  }

  /* ... */
  
  return <>
    <input value={phone} onChange={e => handlePhoneInput(e.target.value)} />
    {/* ... */}
  </>
}
```

首先很多的 useState 导致阅读不清晰。更重要的是，每个 state 都应该有相应的校验条件，例如，`phone` 必须以 `1` 开头，这样使用 useState，我们的校验逻辑只能在「Event Handler」中，例如上面代码中的 `handlePhoneInput`，这就导致处理逻辑分散，如果遇到相关联的字段处理也是麻烦。

我们可以使用 useReducer 的 [reducer](https://react.dev/reference/react/useReducer#usereducer) 函数，统一处理校验逻辑，使逻辑更紧凑更清晰：

```javascript
import { useReducer } from 'react'

// 将所以的状态处理逻辑统一
const addressReducer = (state, action) => {
 switch (action.type) {
    case 'set_phone': {
      if (action.value[0] !== '1') {
        // 错误处理
      }
      return {
        ...state,
        phone: action.value
      }
    }
    /* ... */
  }
}

function UserAddress() {
  const [event, updateAddress] = useReducer(addressReducer, 
    { firstName: '', lastName: '',  phone: '', street: '', city: '', state: '', country: '' })
  
  return <>
    <input value={event.phone} 
      onChange={e => updateAddress({ type: 'set_phone', value: e.target.value }) } />
    {/* ... */}
  </>
}
```

### 全局状态管理

很多情况下，我们可能不想为了几个全局变量（例如主题、用户信息等等），而引入如 [Redux](https://github.com/reduxjs/redux)、[Zusland](https://github.com/pmndrs/zustand) 等等状态管理库，此时我们可以结合 useReducer 和 [useContext](https://react.dev/reference/react/useContext) 来完成简单的全局状态管理。

例如我们的上述的用户地址组件的各个 `state`, 但是在组件树的不同位置，我们可以将 useReducer 的 [dispatch](https://react.dev/reference/react/useReducer#dispatch) 方法，通过 useContext，传递到不同的组件树位置，同时保留了统一的状态管理（reducer），这就是一个简单的全局状态管理了。

```javascript
const AddressContext = React.createContext(null);

function App() {
  const [event, updateAddress] = useReducer(addressReducer, 
    { firstName: '', lastName: '',  phone: '', street: '', city: '', state: '', country: '' })

  return (
    <AddressContext.Provider value={updateAddress}>
      <DeepTree address={address} />
    </AddressContext.Provider>
  );
}
```
可以在不同的位置调用 `updateAddress` 方法更新全局状态：

```javascript
function PhoneInput(props) {
  const updateAddress = useContext(AddressContext);

  function handlePhoneInput(value) {
    updateAddress({ type: 'set_phone', value });
  }

  return (
    <input onChange={e => handlePhoneInput(e.target.value)} />
  );
}
```

### 总结

当遇到我们遇到多个状态，不仅仅是简单的更新，而是需要先进行某些处理之后再进行更新时，我们可以考虑使用 useReducer，即将复杂的更新逻辑统一在一个地方处理（[reducer](https://react.dev/learn/extracting-state-logic-into-a-reducer#consolidate-state-logic-with-a-reducer)），进而使代码清晰。

同时 useReducer 搭配 useContext 使用也是一个很简洁的全局状态管理工具。