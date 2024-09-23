---
tags:
  - Vue
  - VueRouter
---

# Vue Router 使用文档

[Vue Router](https://router.vuejs.org/zh/) 是 [Vue.js](https://cn.vuejs.org/) 的官方路由。它与 Vue.js 核心深度集成，让用 Vue.js 构建单页应用变得轻而易举。功能包括：

- 嵌套路由映射
- 动态路由选择
- 模块化、基于组件的路由配置
- 路由参数、查询、通配符
- 展示由 Vue.js 的过渡系统提供的过渡效果
- 细致的导航控制
- 自动激活 CSS 类的链接
- HTML5 history 模式或 hash 模式
- 可定制的滚动行为
- URL 的正确编码

## 1 安装

首先，确保你已经安装了 `pnpm`，然后在项目中安装 `vue-router`：

```bash
pnpm add vue-router@next
```

## 2 创建路由器

在 `src` 目录下创建 `router` 文件夹，并在其中创建 `index.js` 文件：

```javascript
// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import About from '../views/About.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    component: About
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
```

在 `src/main.js` 中引入并使用这个路由器：

```javascript
// src/main.js
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

createApp(App)
  .use(router)
  .mount('#app')
```

## 3 动态路由匹配

动态路由匹配允许你匹配带参数的路径，例如用户 ID 等：

```javascript
// src/router/index.js
const routes = [
  {
    path: '/user/:id',
    name: 'User',
    component: () => import('../views/User.vue')
  }
]
```

在组件中，可以通过 `this.$route.params.id` 访问参数：

```vue
// src/views/User.vue
<template>
  <div>User ID: {{ $route.params.id }}</div>
</template>

<script>
export default {
  name: 'User'
}
</script>
```

## 4 组件传参

有时候你可能希望通过路由传递更多的参数，这可以通过 `props` 选项实现：

```javascript
const routes = [
  {
    path: '/user/:id',
    name: 'User',
    component: () => import('../views/User.vue'),
    props: true
  }
]
```

在组件中，参数将作为 `props` 传递：

```vue
// src/views/User.vue
<template>
  <div>User ID: {{ id }}</div>
</template>

<script>
export default {
  name: 'User',
  props: ['id']
}
</script>
```

## 5 嵌套路由

嵌套路由允许你在组件中嵌套子组件：

```js
const routes = [
  {
    path: '/user/:id',
    component: () => import('../views/User.vue'),
    children: [
      {
        path: 'profile',
        component: () => import('../views/UserProfile.vue')
      },
      {
        path: 'posts',
        component: () => import('../views/UserPosts.vue')
      }
    ]
  }
]
```

在 `User.vue` 中使用 `<router-view>` 以渲染嵌套路由：

```vue
<template>
  <div>
    <h2>User</h2>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'User'
}
</script>
```

## 6 重定向和别名

重定向可以让你将一个路径重定向到另一个路径：

```javascript
const routes = [
  {
    path: '/home',
    redirect: '/'
  }
]
```

别名允许你为现有路由提供一个或多个替代路径：

```javascript
const routes = [
  {
    path: '/user/:id',
    component: () => import('../views/User.vue'),
    alias: '/u/:id'
  }
]
```

## 7 示例：左侧导航栏，点击右侧显示对应内容

```
src/
├── assets/
├── components/
│   ├── Navbar.vue
├── views/
│   ├── Home.vue
│   ├── About.vue
│   ├── User.vue
│   ├── UserProfile.vue
│   ├── UserPosts.vue
│   ├── NotFound.vue
├── router/
│   ├── index.js
├── App.vue
├── main.js
```

### 7.1 `src/router/index.js`

```javascript
import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import About from '../views/About.vue'
import User from '../views/User.vue'
import UserProfile from '../views/UserProfile.vue'
import UserPosts from '../views/UserPosts.vue'
import NotFound from '../views/NotFound.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    component: About
  },
  {
    path: '/user/:id',
    name: 'User',
    component: User,
    props: true,
    children: [
      {
        path: 'profile',
        name: 'UserProfile',
        component: UserProfile
      },
      {
        path: 'posts',
        name: 'UserPosts',
        component: UserPosts
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
```

### 7.2 `src/components/Navbar.vue`

```vue
<template>
  <nav>
    <ul>
      <li><router-link to="/">Home</router-link></li>
      <li><router-link to="/about">About</router-link></li>
      <li><router-link to="/user/123">User 123</router-link></li>
    </ul>
  </nav>
</template>

<style>
nav {
  width: 200px;
  background-color: #f8f9fa;
  padding: 1em;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  margin: 0.5em 0;
}
</style>
```

### 7.3 `src/views/Home.vue`

```vue
<template>
  <div>
    <h1>Home</h1>
  </div>
</template>
```

### 7.4 `src/views/About.vue`

```vue
<template>
  <div>
    <h1>About</h1>
  </div>
</template>
```

### 7.5 `src/views/User.vue`

```vue
<template>
  <div>
    <h2>User {{ id }}</h2>
    <nav>
      <router-link :to="{ name: 'UserProfile', params: { id } }">Profile</router-link>
      <router-link :to="{ name: 'UserPosts', params: { id } }">Posts</router-link>
    </nav>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  props: ['id']
}
</script>
```

### 7.6 `src/views/UserProfile.vue`

```vue
<template>
  <div>
    <h3>User Profile</h3>
  </div>
</template>
```

### 7.7 `src/views/UserPosts.vue`

```vue
<template>
  <div>
    <h3>User Posts</h3>
  </div>
</template>
```

### 7.8 `src/views/NotFound.vue`

```vue
<template>
  <div>
    <h1>404 Not Found</h1>
    <router-link to="/">Go to Home</router-link>
  </div>
</template>
```

### 7.9 `src/App.vue`

```vue
<template>
  <div id="app">
    <Navbar />
    <div class="content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import Navbar from './components/Navbar.vue'

export default {
  components: {
    Navbar
  }
}
</script>

<style>
#app {
  display: flex;
}

.content {
  flex: 1;
  padding: 1em;
}
</style>
```

### 7.10 `src/main.js`

```javascript
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

createApp(App)
  .use(router)
  .mount('#app')
```

### 7.11 项目样式

添加一些基本的样式，使得左侧导航栏和右侧内容区域布局合理：

```css
/* src/assets/styles.css */
#app {
  display: flex;
}

nav {
  width: 200px;
  background-color: #f8f9fa;
  padding: 1em;
}

.content {
  flex: 1;
  padding: 1em;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  margin: 0.5em 0;
}

.router-link-active {
  font-weight: bold;
  color: red;
}
```
