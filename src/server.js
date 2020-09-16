const express = require('express')
const bodyParser = require('body-parser'); /*post方法*/
const swagger = require('express-swagger-generator')

const initControllers = require('./controller/index.js');

const server = express()

server.use(bodyParser.json()); // 添加json解析
server.use(bodyParser.urlencoded({
    extended: false
}));
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
    server.use(await initControllers());
    server.listen(port)
    console.log(`> Started on port ${port}`)
}
serverStart()