
const WebSocket = require('ws');

const server = new WebSocket.Server({port:5000});

let clients = [];
server.on('connection', ws => { 
    console.log('客户端连接起来了');
    clients.push(ws);
    ws.on('open', function open() {
        console.log('connected');
        ws.send(Date.now());
    });
      
    ws.on('close', function close() {
        console.log('disconnected');
    });
    ws.on('message',(data) => {
        data = JSON.parse(data)
        console.log('data:',data)
         clients.forEach(item => {
             item.send(`${JSON.stringify(data)}`)
         });
    });
})

console.log('websocket 已启动')