// tablename为pet
var Sequelize = require('sequelize')
var sequelize = require('../../config/sequelize.config')
var User = sequelize.define('users', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false, //非空
        autoIncrement: true, //自动递增
        primaryKey: true //主键
    },
    username: Sequelize.STRING(50),
    password: Sequelize.STRING(50),
    permissions: Sequelize.BIGINT(50),
}, {
    timestamps: false,
    raw: true,
}); 
module.exports = User