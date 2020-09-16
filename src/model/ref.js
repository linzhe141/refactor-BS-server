/* *
 * 模型之间的关联关系
*/

var sequelize = require('../../config/sequelize.config')
var Student = require('./student')
var Teacher = require('./teacher')
var User = require('./user')
var Classgrade = require('./classgrade')
var TeachGradeMappling = require('./teachgradeMappling')

// 一对一
User.hasOne(Student)
Student.belongsTo(User)

// 一对一
User.hasOne(Teacher)
Teacher.belongsTo(User)

// 一对多
Classgrade.hasMany(Student)
Student.belongsTo(Classgrade)

// 多对多
Classgrade.belongsToMany(Teacher,{
    through: TeachGradeMappling,
    foreignKey: 'classgradeId',
    otherKey: 'tchId',
}) 
Teacher.belongsToMany(Classgrade,{
    through: TeachGradeMappling,
    foreignKey: 'tchId',
    otherKey: 'classgradeId',
})
 
  

sequelize.sync({force: true})      