// tablename为pet
var Sequelize = require('sequelize')
var sequelize = require('../../config/sequelize.config')
var TeachGradeMapping = sequelize.define('TeachGrade', {
    tchId: {
        type: Sequelize.INTEGER,
        allowNull: false, //非空
        primaryKey: true //主键
    },
    classgradeId: {
        type: Sequelize.INTEGER,
        allowNull: false, //非空
        primaryKey: true //主键
    }
}, {
    timestamps: false,
    raw: true,
});
module.exports = TeachGradeMapping 