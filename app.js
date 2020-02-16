const Koa = require('koa');
const app = new Koa();
const router = require('./router/index.js');
const WSRoom = require('./websocket/index.js');

const cors = require('koa2-cors');
// 使用允许跨域中间件
app.use(cors());

// 使用router中间件
app
   .use(router.routes())
   .use(router.allowedMethods())

try{
  WSRoom(223);
} catch{
  // 出错重启便是了
  WSRoom(223);  
}

try{
  WSRoom(224);
}catch{
  WSRoom(224);
}

app.listen(5000);
console.log('server is running at 5000')