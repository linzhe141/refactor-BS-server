/* *
 * 模型之间的关联关系
*/

var sequelize = require('../../config/sequelize.config')
var Student = require('../model/student')
var User = require('../model/user')

// 一对一
User.hasOne(Student)
Student.belongsTo(User)

// sequelize.sync({force: false}) 