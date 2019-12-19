<template>
 <div class="home">
    <div class="bg"></div>
    <div class="wrapBg"></div>
    <div class="content-body">
      <div class="left-part">
        <div class="user-info">
          <div class="avatar" :style="'background:'+randomColor">{{ uName.slice(0,1) }}</div>
          <span>{{ uName }}</span>
        </div>
        <div class="chat-list">
          <div
            class="chat-item"
            @click="verifyUser(item)"
            v-for="(item,index) in chatRoomsName"
            :key="index"
          >
            <div class="chat-title">{{ item.name }}</div>
          </div>
        </div>
      </div>
      <div class="right-part">
        <div v-if="wsConnect" class="chat-dialog">
          <div class="rightPart-header">
            <span class="quit-ws" @click="WSclose(nowName)">返回</span>
            <div class="roomInfo">
              <span class="roomName">{{ nowName }}</span>
              <span class="online">在线({{ online }})</span>
            </div>
          </div>

          <div class="msg-area">
            <div class="home-content">
              <!-- 页面内容区域 -->
              <div :class="faceShow ? 'contentBox contFaceShow' : 'contentBox'">
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
                          :style="'background:'+randomColor"
                        >{{ uName.slice(0,1) }}</div>
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
                          :style="'background:'+item.color"
                        >{{ item.username.slice(0,1) }}</div>
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
              <div :class="faceShow ?'box boxFaceShow' : 'box'" ref="heightFace">
                <input type="text" v-model="textConent" class="inputContent" @keydown.enter="referContent"/>
                <button class="referBut" @click="referContent">提交</button>
                <button class="faceBut" @click="faceContent">表情</button>
                
              </div>
              <!-- 表情区域 -->
              <div class="browBox" v-if="faceShow">
                <ul>
                  <li v-for="(item,index) in faceList" :key="index" @click="getBrow(index)">{{item}}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div v-else>
          <p>快去加入一个群聊吧</p>
        </div>
      </div>
    </div>
    <my-dialog v-show="showDialog" :showFlag="showDialog" @sureFn1="postUName" @turnOff="turnOff"></my-dialog>
    <error-dialog v-show="errorFlag" @turnOff="turnOff" :msg="errormsg"></error-dialog>
  </div>
</template>

<script>
// @ is an alias to /src
import Mydialog from "@/components/dialog.vue";
import ErrorDialog from "@/components/ErrorDialog.vue";
// 导入JSON格式的表情库
const appData = require("@/assets/emojis.json");
import CryptoJS from "crypto-js";
import JSEncrypt from "jsencrypt";
// 定义AES密钥
const AES_KEY = "qq3217834abcdefg"; //16位
const AES_IV = "1234567890123456"; //16位
export default {
  name: "home",
  components: {
    "my-dialog": Mydialog,
    ErrorDialog
  },
  data() {
    function color16() {
      //十六进制颜色随机
      var r = Math.floor(Math.random() * 256);
      var g = Math.floor(Math.random() * 256);
      var b = Math.floor(Math.random() * 256);
      var color = "#" + r.toString(16) + g.toString(16) + b.toString(16);
      if (color == "#ffffff" || color == "#000000") {
        return color16();
      }
      return color;
    }
    let randomColor = color16();
    return {
      showDialog: false,
      uName: "",
      wsConnect: false,
      ws: "",
      textConent: "",
      faceList: [],
      faceShow: false,
      getBrowString: "",
      content: [],
      online: 0,
      chatRoomsName: [
        {name: '信息安全讨论组', port: '224'},
        {name: '开黑', port: '223'}
      ],
      nowName: "",
      randomColor,
      errorFlag: false,
      errormsg: 'sorry,出问题了(可能是网络问题，建议刷新重试)'
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
    verifyUser(item) {
      // 如果本地存储中没有用户名，则弹出弹窗
      const isLogin = localStorage.dvaAccessUName ? true : false;

      if (!isLogin) {
        return (this.showDialog = true);
      }
      if (!this.wsConnect) {
        this.wsConnect = true;
        // 内容初始化
        this.nowName = item.name;
        this.content = JSON.parse(localStorage.getItem(this.nowName)) || [];

        this.getConnectionWS(item.port);
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
        ? JSON.parse(this.aes_decrypt(encryptMsg.message))
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
        return;
      }
      if (msg.online) {
        this.online = msg.online;
      }
      this.content.push(msg);
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
    mixSend(message) {
      // 使用AES加密消息
      let encrypted = this.aes_encrypt(message);
      // 将AES密钥通过RSA公钥加密，一起发送给服务端
      let encryptedAESKEY = this.RSAEncrypt(
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
    // 对消息加密
    RSAEncrypt(msg) {
      let jse = new JSEncrypt();
      //公钥
      var publicKey = `-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCK3siV2MKl7ADFMajEsbc/ZrST
fo9h37c6+m0cUHOTqGR4V+Ugzc5Wzpcrz6QGu7/umQBJRC3LZ8xRW8+J6Z1lI0+T
r6LT8NfLUeyBTBXkBI1j0BIzmEjsW/a1vDr2ahXn1RFvtnHeKs41lbICkY7mRA2c
AyiMWhrteM1d1MR3gQIDAQAB
-----END PUBLIC KEY-----`;
      jse.setPublicKey(publicKey);
      // 加密内容

      return jse.encrypt(msg);
    },

    // AES 加密消息
    aes_encrypt(plainText) {
      var encrypted = CryptoJS.AES.encrypt(
        plainText,
        CryptoJS.enc.Utf8.parse(AES_KEY),
        { iv: CryptoJS.enc.Utf8.parse(AES_IV) }
      );
      return CryptoJS.enc.Base64.stringify(encrypted.ciphertext);
    },
    //  Aes 解密消息
    aes_decrypt(ciphertext) {
      var decrypted = CryptoJS.AES.decrypt(
        ciphertext,
        CryptoJS.enc.Utf8.parse(AES_KEY),
        { iv: CryptoJS.enc.Utf8.parse(AES_IV) }
      );
      return decrypted.toString(CryptoJS.enc.Utf8);
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
    }
  },
  created() {
    this.uName = localStorage.getItem("dvaAccessUName") || "";
  },
  watch: {}
};
</script>

<style scoped>
body {
  overflow-x: hidden;
}
.bg {
  width: 100%;
  height: 100vh;
  background: url("http://dmimg.5054399.com/allimg/pkm/pk/22.jpg");
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
  justify-content: space-between;
  height: 60vh;
  margin: 150px auto 0;
  width: 70%;
  max-width: 880px;
}
.chat-item {
  width: 100%;
  box-sizing: border-box;
  padding: 5px;
  height: 3rem;
  display: flex;
  justify-content: center;
  align-items: center;
  border-bottom: 1px solid #ccc;
}
.chat-item:hover {
  background: rgba(0, 0, 0, 0.1);
}
.left-part {
  max-width: 240px;
  width: 25%;
}
.right-part {
  max-width: 600px;
  width: 70%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.left-part,
.right-part {
  background: #fff;
  height: 100%;
  border-radius: 10px;
}
.user-info {
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #ccc;
  padding: 10px;
}
.avatar {
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  background: rgba(7, 40, 233, 0.5);
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
  flex: 1;
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
  padding: 5px;
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
    height: 88.7%;
    display: flex;
    justify-content: flex-end;
    text-align: right;
    position: absolute;
    bottom: 60px;
    overflow-y: scroll;
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
  .contFaceShow {
    position: absolute;
    bottom: 240px;
    height: 50%;
  }
  .box {
    width: 100%;
    height: 40px;
    margin: auto;
    position: absolute;
    bottom: 0px;
    .inputContent {
      position: absolute;
      bottom: 0%;
      left: 0%;
      width: 74%;
      height: 100%;
      border: 1px solid #ccc;
      padding-left: 5px;
    }
    .referBut {
      position: absolute;
      bottom: 0%;
      right: 2%;
      height: 100%;
      width: 10%;
      border-radius: 5px;
      background: #aaaaff;
      color: #fff;
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
    width: 100%;
    height: 200px;
    background: #e6e6e6;
    position: absolute;
    bottom: 0px;
    overflow: scroll;
    ul {
      display: flex;
      flex-wrap: wrap;
      padding: 10px;
      li {
        width: 14%;
        font-size: 16px;
        list-style: none;
        text-align: center;
        cursor: pointer;
      }
    }
  }
}
</style>
