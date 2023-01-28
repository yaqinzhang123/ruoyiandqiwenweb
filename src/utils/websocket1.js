import store from '@/store'
var webSocket = null;
var globalCallback = null;//定义外部接收数据的回调函数

//初始化websocket
export function initWebSocket (url) {
  //判断浏览器是否支持websocket
  if ("WebSocket" in window) {
    webSocket = new WebSocket(url);//创建socket对象
  } else {
    alert("该浏览器不支持websocket!");
  }
  //打开
  webSocket.onopen = function () {
    webSocketOpen();
  };
  //收信
  webSocket.onmessage = function (msg) {
    webSocketOnMessage(msg);
  };
  //关闭
  webSocket.onclose = function () {
    webSocketClose();
  };
  //连接发生错误的回调方法
  webSocket.onerror = function () {
    // console.log("WebSocket连接发生错误");
  };
}

//连接socket建立时触发
export function webSocketOpen () {
  // console.log("WebSocket连接成功");
}

//客户端接收服务端数据时触发,e为接受的数据对象
export function webSocketOnMessage (e) {
  // 存储在store中，然后在聊天界面中监控变化 自动拿取收到的信息
  store.commit('SET_WS_MSG', e)
}

//发送数据
export function webSocketSend (data) {
  // console.log('发送数据');
  //在这里根据后端需要来转换数据格式
  webSocket.send(JSON.stringify(data));
}

//关闭socket
export function webSocketClose () {
  webSocket.close()
  // console.log("对话连接已关闭");
  // }
}


//在其他需要socket地方调用的函数，用来发送数据及接受数据
export function sendSock (agentData, callback) {
  globalCallback = callback;//此callback为在其他地方调用时定义的接收socket数据的函数，此关重要。
  //下面的判断主要是考虑到socket连接可能中断或者其他的因素，可以重新发送此条消息。
  switch (webSocket.readyState) {
    //CONNECTING：值为0，表示正在连接。
    case webSocket.CONNECTING:
      setTimeout(function () {
        // console.log('正在连接。。。');
        webSocketSend(agentData, callback);
      }, 1000);
      break;
    //OPEN：值为1，表示连接成功，可以通信了。
    case webSocket.OPEN:
      // console.log('连接成功');
      webSocketSend(agentData);
      break;
    //CLOSING：值为2，表示连接正在关闭。
    case webSocket.CLOSING:
      setTimeout(function () {
        // console.log('连接关闭中');
        webSocketSend(agentData, callback);
      }, 1000);
      break;
    //CLOSED：值为3，表示连接已经关闭，或者打开连接失败。
    case webSocket.CLOSED:
      // console.log('连接关闭/打开失败');
      // do something
      break;
    default:
      // this never happens
      break;
  }
}

//将初始化socket函数、发送（接收）数据的函数、关闭连接的函数export出去
export default {
  initWebSocket,
  webSocketClose,
  sendSock
};
