# refactor-BS-server
## 毕业设计——基于```node.js和mysql```的学生作业管理系统后台程序重构中
### 运行步骤
+ 1、使用git切换到develop分支
+ 2、安装mysql数据库，并在```config/mysql.db.config.js```配置相应的数据库信息
  ```js
  module.exports = {
      host: 'localhost',
      user: '用户名',
      password: '密码',
      // 数据库要手动建
      database: '数据库名',
      port: '3306'
  }
  ```
+ 3、在`src/model/ref.js`文件中,将这段代码取消注释，即可创建对应表结构,并填入默认数据，**`成功后，还是要注释掉`**
  ```js
  /* 创建默认数据 */
  // sequelize.sync({force: true}).then(()=>{
  //     defaultUser()
  // })      
  ```

+ 3、使用```npm i```命令或者```yarn install```安装相应插件和模块
+ 4、使用```npm run start```或者```yarn start```命令启动后台程序服务
+ 5、使用浏览器进入```http://localhost:9000/swagger#/```网址，可以使用swagger文档进行测试