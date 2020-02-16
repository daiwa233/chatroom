import Vue from 'vue'
import App from './App.vue'
import router from './router'
import moment from 'moment'


Vue.config.productionTip = false
let Senstive = ['傻逼','草泥马','sb', '操你妈','屏蔽词'];
// 敏感词过滤，真实项目敏感词很多，不能这样搞
Vue.filter('SenstiveFilter', content => {
  let str = '';
  Senstive.forEach(item => {
    if (!content.includes(item)) return;
    content = content.replace(item, str.padStart(item.length, '*'))
  })

  
  return  content;
  
})

// 时间格式过滤器
Vue.filter('dateFormat', date =>{
  let _Now = moment()._d;
  let DayNow = _Now.getDate();
  // 当前时间是间隔发消息时长大于一天
  if (DayNow > new Date(date).getDate() || _Now.getTime()-date > 86400000 ){
    return moment(date).format("YYYY/MM/DD hh:mm:ss");
  }
  
  return moment(date).format("hh:mm:ss");
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
