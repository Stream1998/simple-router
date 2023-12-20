# simple-router

目的：学习 Vue-router 原理

## 路由跳转两种方式

### hash

- 监听 `hashchange` 事件，触发视图更新。
- 可由 `<a>`/`location.hash`/浏览器的前进后退触发。

### history

- 监听 `popstate` 事件，触发视图更新。
- `history.go()`/`history.forward()`/`history.back()` 可以触发 `popstate` 事件。
- 由于 `<a>`/`history.replaceState()`/`history.pushState()` 无法触发 `popstate` 事件，需要进行拦截，手动触发视图更新。

## Vue 插件

具有 `install` 方法的对象。

`Vue.use()` 会执行 `install` 方法，每个插件只执行一次。

### vue-router 中的 install 方法

- 通过 `Vue.mixin` 将 `router` 注入到每个组件。
- 在 `beforeCreate` 声明周期中，将 `$options` 中的 `router` 从根组件开始逐级向下分发。
- 使用 `Object.defineProperty` 将 `router` 代理成 `$router`，将 `router.history` 代理成 `$route`
- 使用 `Vue.util.defineReactive` 监听 `router.history`，使得 `router.history` 变化后，触发视图更新。

## Vue.util.defineReactive

Vue 的核心函数，用于实现数据响应。

利用 `Object.defineProperty` 函数作用于对象属性的值，进行取值和赋值操作时的拦截和处理。
