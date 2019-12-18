import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import dialog from '../components/dialog.vue'
Vue.component('mydialog', dialog);
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
