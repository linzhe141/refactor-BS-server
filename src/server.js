const express = require('express')
const bodyParser = require('body-parser'); /*post方法*/
const swagger = require('express-swagger-generator')
const morgan = require('morgan')
const FileStreamRotator = require('file-stream-rotator')
const fs = require('fs')
const path = require('path')
const util = require('./util')

const initControllers = require('./controller/index.js');

const server = express()

server.use(bodyParser.json()); // 添加json解析
server.use(bodyParser.urlencoded({
    extended: false
}));
process.env.TZ = 'Asia/Shanghai';
// 文件上传
const uploadDirectory = path.join(__dirname,'upload')
fs.existsSync(uploadDirectory) || fs.mkdirSync(uploadDirectory)

const hwDirectory = path.join(__dirname,'upload/homework')
fs.existsSync(hwDirectory) || fs.mkdirSync(hwDirectory) 

const correctDirectory = path.join(__dirname,'upload/correct')
fs.existsSync(correctDirectory) || fs.mkdirSync(correctDirectory)

const completionDirectory = path.join(__dirname,'upload/completion')
fs.existsSync(completionDirectory) || fs.mkdirSync(completionDirectory)
// 日志模块配置
const logDirectory = path.join(__dirname,'log')
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory)

const accessLogStream = FileStreamRotator.getStream({
    date_format: 'YYYYMMDD',
    filename: path.join(logDirectory, 'access-%DATE%.log'),
    // frequency: 'daily', 
    verbose: true
})
// 自定义token
morgan.token('localDate',function getDate(req) {
    let date = new Date();
    return date.toLocaleString()
})
   
// 自定义format，其中包含自定义的token
morgan.format('combined', '[:localDate] ":method :url" :status   --  ":user-agent"');
   
// 使用自定义的format

server.use(morgan('combined',{stream: accessLogStream}))

const port = parseInt(process.env.PORT || 9000)

// 加载主外键关系及创建数据库
require('./model/ref');

// swagger 配置
//swagger
const expressSwagger = swagger(server)
let options = {
    swaggerDefinition: {
        info: {
            description: 'This is a sample server',
            title: 'Swagger',
            version: '1.0.0'
        },
        host: 'localhost:9000',
        basePath: '/',
        produces: ['application/json', 'application/xml'],
        schemes: ['http', 'https'],
        securityDefinitions: {
            JWT: {
                type: 'apiKey',
                in: 'header',
                name: 'Authorization',
                description: ''
            }
        }
    },
    route: {
        url: '/swagger',
        docs: '/swagger.json' //swagger文件 api
    },
    basedir: __dirname, //app absolute path
    files: ['./controller/*.js'] //Path to the API handle folder
}
expressSwagger(options)
async function serverStart() {
    // server.use(async function(req, res, next) {
    //     if (req.url != '/api/user/login') {
    //         let token = req.headers.token;
    //         const utilTool = await util()
    //         let result = await utilTool.verifyToken(token);
    //         if (result == 'err') {
    //             res.send({status: 403, msg: '登录已过期,请重新登录'});
    //         } else {
    //             next();
    //         }
    //     } else {
    //         next();
    //     }
    
    // })
    server.use(await initControllers());
    server.listen(port)
    console.log(`> Started on port ${port}`)
    console.log(`> swagger--> http://localhost:${port}/swagger`)
}
serverStart()