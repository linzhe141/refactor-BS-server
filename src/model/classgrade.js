// tablename为pet
var Sequelize = require('sequelize')
var sequelize = require('../../config/sequelize.config')
var Classgrade = sequelize.define('classgrade', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false, //非空
        autoIncrement: true, //自动递增
        primaryKey: true //主键
    },
    classNum: Sequelize.STRING(50),
    className: Sequelize.STRING(50),
}, {
    timestamps: false,
    raw: true,
});
module.exports = Classgrade 