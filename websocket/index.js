const Encrypted = require('../encrypted')
module.exports = (port) => {
  const ws = require('ws');
  const cuid = require('cuid');
  const clientList = [];
  let clientOnline = 0;
  const WebSocketServer = ws.Server,
        wss = new WebSocketServer({port});
  
    wss.on('connection', function(ws) {

      let clientId = cuid();

      // 记录当前在线总人数
      clientOnline += 1;

      // 收到客户端的信息， 全部推送回去
      ws.on('message', function(msg) {
        // 解密消息
        
        const encrypted = Encrypted(msg);
        console.log('--------------------'+encrypted)
        console.log('--------------------')
        // 可能由于网络传输中可能的验证不正确做处理
        const msgObj = JSON.parse(encrypted) || {};
        if (msgObj.init) {
          // 将客户端的ID和ws存储起来
          clientList.push({clientId, ws, username: msgObj.init});
          let message = `${msgObj.init}进入群聊`;
          
          onlineNumber(message)
          return;
        }

        sendMsg(msg);
        

      })

      ws.onclose = function(e) {
        clientOnline -= 1;
        let closedclient;
        
        //关闭连接时发送xx退出群聊和在线人数。
        for(let i=0,len=clientList.length;i<len;i++) {

          let clientSocket = clientList[i].ws;
         
          //获得每个客户端的ws连接
          if (clientSocket === e.target) {
            // 获得退出的用户的名字
            closedclient = clientList[i].username;
            
            // 将数组中保存的该客户端信息删除
            clientList.splice(i,1);
            let msg = `${closedclient}退出群聊`;

            onlineNumber(msg)
            break;
          }   
        }  

        
      }

    })


    // 发送当前在线人数以及xx进入群聊广播
    function onlineNumber(message) {
      
      for(let i=0,len=clientList.length;i<len;i++) {
        // 获得每个客户端的ws连接
        
        let clientSocket = clientList[i].ws;
       
        if(clientSocket.readyState === 1) { 
          
            // 发送进入群聊广播
            clientSocket.send(JSON.stringify({  
              "id": clientList[i].clientId,  
              radioMsg: message,
              online: clientOnline,
              encrypt: false
            }));        
          
        }  
      }
    }
    
    function sendMsg(msg) {
      
      // 再加密返回
      let msgObj = JSON.parse(msg) || {};
      for(let i=0,len=clientList.length;i<len;i++) {
        // 获得每个客户端的ws连接
        let clientSocket = clientList[i].ws;
        if(clientSocket.readyState === 1) {  
          clientSocket.send(JSON.stringify({  
            "id": clientList[i].clientId,  
             "message": msgObj.encrypted,
             encrypt: true
          }));  
        }  
      }
    }
    
}