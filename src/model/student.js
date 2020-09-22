// tablename为pet
var Sequelize = require('sequelize')
var sequelize = require('../../config/sequelize.config')
var Student = sequelize.define('students', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false, //非空
        autoIncrement: true, //自动递增
        primaryKey: true //主键
    },
    stuNum: Sequelize.STRING(50),
    stuName: Sequelize.STRING(50),
    stuAge: Sequelize.BIGINT(50),
    stuGender: Sequelize.STRING(50),
    // classID: Sequelize.BIGINT(50),
}, {
    timestamps: false,
    raw: true,
});
module.exports = Student