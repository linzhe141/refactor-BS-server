const express = require('express')
const bodyParser = require('body-parser');/*post方法*/

const initControllers = require('./controller/index.js');

const server = express()
server.use(bodyParser.json());// 添加json解析
server.use(bodyParser.urlencoded({extended: false}));
const port = parseInt(process.env.PORT || 9000)

//加载主外键关系及创建数据库
require('./model/ref');

async function serverStart(){
    server.use(await initControllers());
    server.listen(port)
    console.log(`> Started on port ${port}`)
}
serverStart()