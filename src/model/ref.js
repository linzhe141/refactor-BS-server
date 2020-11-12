/* *
 * 模型之间的关联关系
*/

var sequelize = require('../../config/sequelize.config')
var Student = require('./student')
var Teacher = require('./teacher')
var User = require('./user')
var Classgrade = require('./classgrade')
var TeachGradeMappling = require('./teachgradeMappling')
var Course = require('./course')
var Homework = require('./homework.js')
var Score = require('./score')

// 一对一
User.hasOne(Student)
Student.belongsTo(User)

// 一对一
User.hasOne(Teacher)
Teacher.belongsTo(User)

// 一对多
Classgrade.hasMany(Student)
Student.belongsTo(Classgrade)

Course.hasMany(Teacher)
Teacher.belongsTo(Course)

Teacher.hasMany(Homework)
Homework.belongsTo(Teacher)

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

Homework.belongsToMany(Student,{
    through: Score,
    foreignKey: 'hwid',
}) 
Student.belongsToMany(Homework,{
    through: Score,
    foreignKey: 'stuid',
})
 
  
/* 创建默认数据 */

// sequelize.sync({force: true}).then(()=>{
//     defaultUser()
// })      
const defaultUser = async ()=>{
    await User.create({username: 'root', password: 'linzhe141', permissions: 0})
    await User.create({username: 'admin', password: 'root', permissions: 0})

    await User.create({username: 'JG001', password: 'JG001', permissions: 1})
    await User.create({username: 'JG002', password: 'JG002', permissions: 1})
    await User.create({username: 'JG003', password: 'JG003', permissions: 1})
    await User.create({username: '160101', password: '160101', permissions: 2})
    await User.create({username: '160102', password: '160102', permissions: 2})
    await User.create({username: '160103', password: '160103', permissions: 2})
    await User.create({username: '160201', password: '160201', permissions: 2})
    await User.create({username: '160202', password: '160202', permissions: 2})

    await Course.create({courseNum: 'KC001', courseName: '语文'})
    await Course.create({courseNum: 'KC002', courseName: '数学'})
    await Course.create({courseNum: 'KC003', courseName: '英语'})

    await Classgrade.create({classNum: '2016001', className: '高16一班'})
    await Classgrade.create({classNum: '2016002', className: '高16二班'})

    await Teacher.create({tchNum: 'JG001', tchName: '李知恩', tchAge: 27, tchGender: '女', courseId: 1,userId: 3})
    await Teacher.create({tchNum: 'JG002', tchName: '李至安', tchAge: 27, tchGender: '女', courseId: 2,userId: 4})
    await Teacher.create({tchNum: 'JG003', tchName: '张满月', tchAge: 27, tchGender: '女', courseId: 3,userId: 5})

    await TeachGradeMappling.create({tchId: 1, classgradeId: 1})
    await TeachGradeMappling.create({tchId: 1, classgradeId: 2})
    await TeachGradeMappling.create({tchId: 2, classgradeId: 2})
    await TeachGradeMappling.create({tchId: 3, classgradeId: 1})

    await Student.create({stuNum: '160101', stuName: '淋着', stuAge: 18, stuGender: '男', classgradeId: 1,userId: 6})
    await Student.create({stuNum: '160102', stuName: '王xx', stuAge: 18, stuGender: '男', classgradeId: 1,userId: 7})
    await Student.create({stuNum: '160103', stuName: '李xx', stuAge: 18, stuGender: '女', classgradeId: 1,userId: 8})
    await Student.create({stuNum: '160201', stuName: '张xx', stuAge: 18, stuGender: '男', classgradeId: 2,userId: 9})
    await Student.create({stuNum: '160202', stuName: '刘xx', stuAge: 18, stuGender: '女 ', classgradeId: 2,userId: 10})
}
