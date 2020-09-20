// tablename为pet
var Sequelize = require('sequelize')
var sequelize = require('../../config/sequelize.config')
var Course = sequelize.define('courses', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false, //非空
        autoIncrement: true, //自动递增
        primaryKey: true //主键
    },
    courseNum: Sequelize.STRING(50),
    courseName: Sequelize.STRING(50),
}, {
    timestamps: false,
    raw: true,
});
module.exports = Course