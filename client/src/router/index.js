/*
 * @Author: your name
 * @Date: 2019-12-16 13:03:17
 * @LastEditTime : 2020-01-15 14:12:58
 * @LastEditors  : Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \chatroom\client\src\router\index.js
 */
import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/login.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  }
 
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// // 全局路由守卫
// router.beforeEach((to, form, next) => {
//   // console.log(to)
//   // if (to.path == '/')  {
//   //   // 要求用户输入用户名
//   //   const isLogin = localStorage.dvaAccess ? true : false;
//   //   if(!isLogin) {
//   //     let app = document.querySelector('#app');
      
//   //   }
    
//   // }
// })
export default router
