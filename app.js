const WSRoom = require('./websocket/index.js');

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