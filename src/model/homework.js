// tablename为pet
var Sequelize = require('sequelize')
var sequelize = require('../../config/sequelize.config')
var Homework = sequelize.define('homework', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false, //非空
        autoIncrement: true, //自动递增
        primaryKey: true //主键
    },
    hwName: Sequelize.STRING(50),
    hwDesc: Sequelize.STRING(50),
    endDate: Sequelize.STRING(50),
    hwFile: Sequelize.STRING(250),
    type: Sequelize.INTEGER,
}, {
    timestamps: false,
    raw: true,
});
module.exports = Homework 