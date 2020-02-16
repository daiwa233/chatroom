<template>
 <div class="home">
    <div class="bg"></div>
    <div class="wrapBg"></div>
    <div class="content-body">
      <div class="right-part">
        <div v-if="login" class="chat-dialog">
          

          <div class="msg-area">
            <div class="home-content">
              <div class="rightPart-header">
            
            <div class="roomInfo">
              <span class="roomName">{{ nowName }}</span>
              <span class="online">在线({{ online }})</span>
            </div>
          </div>
              <!-- 页面内容区域 -->
              <div :class="faceShow ? 'contentBox scrollbar contentBoxWithEmoji' : 'contentBox scrollbar' " ref="content_body">
                <ul>
                
                  <li v-for="(item,index) in content" :key="index">
                  <!-- 时间 大于30s显示出来 -->
                    <div class="radioMsg" v-if=" content[index-1] && item.date - content[index-1].date > 10000 ">
                      <span style="padding: 3px;">{{item.date | dateFormat}}</span>
                    </div>
                  <!-- 收到自己的消息 -->
                    <div v-if="item.clientContent" class="right">
                      <div class="msg-info-right">
                        <div>
                          <span class="msg-user">{{item.username}}</span>
                          <div class="clientMsg">
                            
                            <p v-for="(i,ind) in Math.ceil(item.clientContent.length/18)" :key="ind" style="text-align:left">{{item.clientContent.slice(ind*18,i*18) | SenstiveFilter}} </p>
                            <!-- <p >{{item.clientContent}}</p> -->
                            
                          </div>
                        </div>
                        <div
                          class="chat-avatar"
                        ><img :src="avatar_url" alt="" class="avatar"></div>
                      </div>
                    </div>
                    <!-- 入场或退出广播 -->
                    <div v-if="item.radioMsg" class="radioMsg">
                      <span >{{item.radioMsg}}</span>
                    </div>
                    
                    <!-- 收到别人的消息 -->
                    <div v-if="item.content" class="serverMsg">
                      <div class="msg-info-left">
                        <div
                          class="chat-avatar"
                        ><img :src="avatar_url" alt="" class="avatar"></div>
                        <div>
                          <span class="msg-user">{{item.username}}</span>
                          <div class="serverMsg-content">
                            
                            <p v-for="(i,ind) in Math.ceil(item.content.length/18)" :key="ind" style="text-align:left; ">{{item.content.slice(ind*18,i*18) | SenstiveFilter}}</p>
                            <!-- <p >{{item.content}}</p> -->
                            
                          </div>
                          
                        </div>
                      </div>
                    </div>
                  </li>
                  
                </ul>
              </div>
              <!-- 输入框区域 -->
              <div :class="faceShow ? 'boxWithEmoji box' : 'box'" ref="heightFace">
               
              
                <div class="add_area">
                  <div class="icon-font">
                    <svg @click="faceContent" t="1579087229705" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5776" width="32" height="32"><path d="M512 832c-176.448 0-320-143.552-320-320S335.552 192 512 192s320 143.552 320 320-143.552 320-320 320m0-704C300.256 128 128 300.256 128 512s172.256 384 384 384 384-172.256 384-384S723.744 128 512 128" p-id="5777" fill="#cdcdcd"></path><path d="M700.64 580.288a32 32 0 0 0-43.712 11.68A160.608 160.608 0 0 1 518.304 672a160.576 160.576 0 0 1-138.592-80 32 32 0 0 0-55.424 32.032 224.896 224.896 0 0 0 194.016 112 224.768 224.768 0 0 0 194.016-112 32 32 0 0 0-11.68-43.744M384 512a32 32 0 0 0 32-32v-96a32 32 0 0 0-64 0v96a32 32 0 0 0 32 32M640 512a32 32 0 0 0 32-32v-96a32 32 0 0 0-64 0v96a32 32 0 0 0 32 32" p-id="5778" fill="#cdcdcd"></path></svg>
                    
                  </div>
                  <div class="icon-font">
                  <svg t="1579087200143" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4473" width="32" height="32"><path d="M271.738 465.729c56.472 0 102.438-46.461 102.438-103.514 0-57.083-45.966-103.515-102.438-103.515S169.3 305.132 169.3 362.215C169.3 419.268 215.266 465.729 271.738 465.729zM271.738 288.5c40.058 0 72.637 33.074 72.637 73.715 0 40.654-32.579 73.714-72.637 73.714-40.059 0-72.638-33.06-72.638-73.714C199.1 321.574 231.679 288.5 271.738 288.5z" p-id="4474" fill="#cdcdcd"></path><path d="M65 154.4 65 869.6l894 0L959 154.4 65 154.4zM929.2 839.8 123.582 839.8l288.76-244.322L560.57 724.965 929.2 430.355 929.2 839.8zM929.2 392.218 561.414 686.144 412.662 556.176 94.8 825.118 94.8 184.2l834.4 0L929.2 392.218z" p-id="4475" fill="#cdcdcd"></path></svg> 
                  </div>
                </div>
                
                  <textarea v-model="textConent" class="textarea scrollbar" @keydown.enter="referContent"></textarea>
                <!-- <input type="text" v-model="textConent" class="inputContent" @keydown.enter="referContent"/> -->
               
                <div class="sendBox">
                   <button class="btn btn-primary sendBtn"  @click="referContent">发送</button>
                </div>
                
                
              </div>
               
               <!-- 表情区域 -->
                <div class="browBox scrollbar" v-if="faceShow">
                
                <ul>
                  <li v-for="(item,index) in faceList" :key="index" @click="getBrow(index)">{{item}}</li>
                </ul>
                
              </div>
            </div>
          </div>
        </div>
        <login v-else></login>
      </div>
    </div>
   
    <error-dialog v-show="errorFlag" @turnOff="turnOff" :msg="errormsg"></error-dialog>
    
  </div>
</template>

<script>

import ErrorDialog from "@/components/ErrorDialog.vue";

// 登录组件
import Login from "@/views/login.vue"

import { solveCookie, RSAEncrypt, AESEncrypt, AESDecrypt, color16, AES_KEY, AES_IV } from "@/utils/index.js"
// 导入JSON格式的表情库
const appData = require("@/assets/emojis.json");


export default {
  name: "home",
  components: {
    ErrorDialog,
    Login
  },
  data() { 
    
    let randomColor = color16();
    return {
      login: false,
      uName: "",
      wsConnect: false,
      ws: "",
      textConent: "",
      faceList: [],
      faceShow: false,
      getBrowString: "",
      content: [],
      online: 0,
      nowName: "交流",
      randomColor,
      errorFlag: false,
      errormsg: 'sorry,出问题了(可能是网络问题，建议刷新重试)',
      dialogmsg: '请输入一个用户名以便加入聊天',
      avatar_url: ''
    };
  },
  methods: {
    postUName(uName) {
      this.showDialog = false;
      // 将uName存储到本地，不再向服务端请求存放到数据库，存在用户名重复
      localStorage.setItem("dvaAccessUName", uName);
      this.uName = uName;
    },
    turnOff() {
      this.showDialog = false;
      this.errorFlag = false;
    },
    verifyUser() {
      // 如果本地存储中没有用户名，则弹出弹窗
      const isLogin = localStorage.dvaAccessUName ? true : false;

      if (isLogin) {
        this.login = true;
      }
      if (this.login && !this.wsConnect) {
        this.wsConnect = true;
        // 内容初始化
        this.content = JSON.parse(localStorage.getItem(this.nowName)) || [];

        this.getConnectionWS(223);
      }
    },
    getConnectionWS(port) {
      let _that = this;
      // 实例化一个websocket
      const ws = new WebSocket(`ws://localhost:${port}`);

      ws.onerror = function(e) {
        _that.errorFlag = true;
        console.log("socket状态不对");
        return;
      };

      this.ws = ws;

      // 监听websocket连接打开
      ws.onopen = function(e) {
        console.log("chatroom connected");
        this.uName = localStorage.getItem("dvaAccessUName");
        // 发送请求服务端广播进场消息
        const initMsg = JSON.stringify({ init: this.uName });

        _that.mixSend(initMsg);
      };

      // 监听ws断开连接
      ws.onclose = function(e) {
        // 如果正常使用中断开连接，则向客户端提示错误
        if (_that.wsConnect) {
          _that.wsConnect = false;
          _that.errormsg = 'socket断开连接';
          _that.errorFlag = true;
        }

      }


      ws.onmessage = this.getmsgFromServer;
    },

    getmsgFromServer(e) {
      //先解密
      let encryptMsg = JSON.parse(e.data) || "";


      let msg = encryptMsg.encrypt
        ? JSON.parse(AESDecrypt(encryptMsg.message))
        : encryptMsg;

      // 一共会受到三种广播消息：在线人数， xx进入或退出群聊， 发送的消息。

      if (msg.username == this.uName) {
        // 存入
        this.content.push({
          clientContent: this.textConent,
          username: this.uName,
          date: Date.now()
        });
        
        // 清空input数据
        this.textConent = "";
        // 发送完消息, dom 更新完毕 滚动条到最下面
        this.$nextTick(() => {
          this.$refs.content_body.scrollTo(0, this.$refs.content_body.scrollHeight);
        })
        

        return;
      }
      if (msg.online) {
        this.online = msg.online;
      }
      this.content.push(msg);
      // 发送完消息, dom 更新完毕 滚动条到最下面
        this.$nextTick(() => {
          this.$refs.content_body.scrollTo(0, this.$refs.content_body.scrollHeight);
        })
    },

    sendMsg() {
      if (this.wsConnect) {
        // 对信息加密
        let message = JSON.stringify({
          username: this.uName,
          content: this.textConent,
          date: Date.now(),
          color: this.randomColor
        });
        this.mixSend(message);
      }
    },
    // 对信息进行混合加密
    mixSend(message) {
      // 使用AES加密消息
      let encrypted = AESEncrypt(message)
      // 将AES密钥通过RSA公钥加密，一起发送给服务端
      let encryptedAESKEY = RSAEncrypt(
        JSON.stringify({
          AES_KEY,
          AES_IV
        })
      );

      // 发送加密后的消息
      this.ws.send(
        JSON.stringify({
          encrypted,
          encryptedAESKEY
        })
      );
    },
    // 表情
    faceContent() {
      this.faceShow = !this.faceShow;
      if (this.faceShow == true) {
        for (let i in appData) {
          this.faceList.push(appData[i].char);
        }
      } else {
        this.faceList = [];
      }
    },
    // 获取用户点击之后的标签 ，存放到输入框内
    getBrow(index) {
      for (let i in this.faceList) {
        if (index == i) {
          this.getBrowString = this.faceList[index];
          this.textConent += this.getBrowString;
        }
      }
    },
    // 将input的内容渲染到页面上并向服务端发送消息请求广播出去
    referContent() {
      if (!this.textConent) {
        return;
      }
      if(!this.wsConnect) return this.errorFlag = true;
      // 调用发送信息方法
      this.sendMsg();

      // 关闭表情列表
      this.faceShow = false;
    },
    WSclose() {
      this.wsConnect = false;
      // 退出聊天室，清空数据
      this.ws.close();
      localStorage.setItem(this.nowName, JSON.stringify(this.content));
      this.content = [];
      this.online = 0;
    },
    // 修改用户名
    changeUname() {
      this.dialogmsg = "请修改您的昵称"
      this.showDialog = true;
    }
  },
  created() {
    
    
    let cookies = solveCookie(document.cookie) || '';
    const { usr, avatar_url } = cookies;
    if (usr && avatar_url) {
      this.uName = usr;
      localStorage.setItem('dvaAccessUName', usr)
      this.avatar_url = avatar_url;
      this.verifyUser();
      return;
    }

    this.login = false
    

  },
};
</script>

<style scoped>
p{
  margin: 0;
  padding: 0;
}
body {
  overflow-x: hidden;
}
.bg {
  width: 100%;
  height: 100vh;
  background: url("http://q2nusq7zh.bkt.clouddn.com/timg.jpg");
  background-size: 100% 100%;
  z-index: -999;
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  filter: blur(100px);
}
.wrapBg {
  width: 100%;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  background-size: 100% 100%;
  z-index: -998;
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
}
.content-body {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 65vh;
  margin: 150px auto 0;
}



.right-part {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #fff;
  height: 100%;
}


.avatar {
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.chat-dialog {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  
}
.rightPart-header {
  position: relative;
  height: 40px;
  flex-shrink: 0;
  border-bottom: 1px solid #ccc;
  display: flex;
  justify-content: center;
  align-items: center;
}
.quit-ws:before{
  content: '';
  display: block; 
  position: absolute;
  left: 3px;
  top: 7px;
  border-top: 1px solid #000;
  border-right: 1px solid #000;
  transform: rotate(-135deg);
  right: 8px;
  width: 6px;
  height: 6px;
}
.change{
  font-size: 10px;
  color: #ccc;
  cursor: pointer;
}
.quit-ws{
  position: absolute;
  left: 16px;
  padding-left: 10px;
  font-size: 14px;
  cursor: pointer;
}

.roomInfo {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.online {
  color: #999;
  font-size: 10px;
}
.msg-area {
  flex: 12;
  display: flex;
  justify-content: center;
}
.home{
  max-width: 800px;
  width: 100%;
  min-width: 300px;
  margin: 0 auto;
}
.textarea{
  width: 100%;
  line-height: 1.2em;
  border: none;
  outline: none;
  background: #fff;
  padding-left: 10px;
  margin: 10px 0;
  resize: none;
  height: 2.5em;

}
.icon{
  padding: 5px;
}
.icon-font{
  position: relative;
  border-radius: 50%;
}
.icon-font:hover{
  background: #ddd;
}
@media (max-width: 800px) {
  .content-body {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100%;
  overflow: hidden;
  margin: 0;
}
.avatar{
  width: 2rem !important;
  height: 2rem !important;
}

.add_area{
  order: 2;
}
.contentBox {
  bottom: 70px !important;

}
.contentBoxWithEmoji{
  bottom: 270px !important;
}
.boxWithEmoji{
  bottom: 200px !important;
}
.browBox{
  width: 100% !important;
  bottom: 0 !important;
}
.box{
  height: 70px !important;
  flex-direction: row !important;
  flex-wrap: wrap;
}
.textarea{
  height: 36.5px !important;
  margin: 0 !important;
  padding: 0 !important;
  padding: 5px !important;
  width: 80% !important;
}
.sendBox{
  width: 20% !important;
  margin: 0 !important;
}
.sendBtn{
  margin: 0 !important;
}
}
</style>

<style lang="less" scoped>
body,
html,
head,
.home-content {
  width: 100%;
  height: 100%;
  padding: 0px;
  position: relative;
  margin: 0px;
}
.home-content {
  width: 100%;
  height: 100%;
  .contentBox {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    text-align: right;
    position: absolute;
    top: 50px;
    bottom: 130px;
    border-bottom: 1px solid #ccc;
    ul {
      width: 100%;
      box-sizing: border-box;
      li {
        list-style: none;
        padding: 4px 10px;
        margin-bottom: 10px;
        
        .clientMsg {
          background: #2683f5;
          border-radius: 5px;
          padding: 5px;
          display: inline-block;
          margin-right: 4px;
        }
        .radioMsg {
          display: flex;
          justify-content: center;
          align-items: center;
          span {
            background: #e5f4ff;
            font-size: 10px;
            border-radius: 3px;
            color: #6b8299;
            padding: 4px 10px;
          }
        }
        .chat-avatar {
          border-radius: 50%;
          display: block;
          width: 2rem;
          height: 2rem;
          display: flex;
          justify-content: center;
          align-items: center;
          margin: 0 6px;
        }
        .right {
          display: flex;
          flex-direction: row-reverse;
          .msg-info-right {
            display: flex;
            justify-content: space-between;
            align-items: center;
            div {
              display: flex;
              flex-direction: column;
              color: #fff;
              .msg-user {
                text-align: right;
                color: #666;
                font-size: 12px;
                padding-bottom: 5px;
              }
            }
          }
        }

        .serverMsg {
          display: flex;
          justify-content: left;
          align-items: center;
          .msg-info-left {
            display: flex;
            justify-content: space-between;
            align-items: center;
            div {
              display: flex;
              flex-direction: column;
              .msg-user {
                text-align: left;
                color: #666;
                font-size: 12px;
                padding-bottom: 5px;
              }
            }

            .serverMsg-content {
              background: rgb(238, 238, 238);
              border-radius: 5px;
              padding: 5px;
              display: inline-block;
              margin-left: 3px;
            }
          }
        }
      }
    }
  }

  .box {
    width: 100%;
    margin: auto;
    height: 130px;
    position: absolute;
    bottom: 0px;
    display: flex;
    flex-direction: column;
    
    .add_area{
      width: 100%;
      display: flex;
      
    }

   .sendBox{
     display: flex;
     flex-direction: row-reverse;
   }
   .sendBtn{
     font-size: 12px;
     margin-right: 1.5rem;
     outline: none;
   }
    .faceBut {
      position: absolute;
      bottom: 0;
      right: 13%;
      height: 100%;
      width: 10%;
      border-radius: 5px;
      background: #aaaaff;
      color: #fff;
    }
  }
  .boxFaceShow {
    position: absolute;
    bottom: 200px !important;
  }
  .browBox {
    width: 50%;
    height: 200px;
    background: #fff;
    position: absolute;
    bottom: 130px;
    border: 1px solid #ccc;
    overflow-x: hidden;
    overflow-y: scroll;
    box-shadow: 0px 0px 5px 2px rgba(0, 0, 0, 0.2);
    ul {
      display: flex;
      flex-wrap: wrap;
      li {
        width: 14%;
        font-size: 20px;
        list-style: none;
        text-align: center;
        cursor: pointer;
      }
    }
  }
}
</style>
