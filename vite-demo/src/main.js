import { createApp } from 'vue'
import App from './App.vue'
// import './index.css'

createApp(App).mount('#app')

// 默认采用的是 es6 原生的模块 (import语法在es6中默认会发送一个请求)
// 默认会给vue的模块增加一个前缀 /@modules
// 把.vue文件在后端给解析成 一个对象了 (唯一就是编译了.vue文件)

// 主要原理是通过node的框架koa，快速搭建http服务

// vite只能生成vue3的项目，vue2不行
