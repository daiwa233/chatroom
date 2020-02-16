<!--
 * @Author: your name
 * @Date: 2019-12-16 13:05:01
 * @LastEditTime: 2020-02-16 13:52:54
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \chatroom\README.md
 -->
# chatroom 
## 使用
### clone 该仓库
```shell
$ git clone https://github.com/lhj233/chatroom.git
```
### 安装依赖
```shell
npm install
```
### 本地运行
```shell
// 后端
node app.js
// 前端
npm run serve
```
tip: 需要注意该项目依赖github认证，需要在后端创建/config/oauth/index.js提供clientId和clientKey，前端在/client/.env中提供clientId.

## License
MIT

