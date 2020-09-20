// tablename为pet
var Sequelize = require('sequelize')
var sequelize = require('../../config/sequelize.config')
var Teacher = sequelize.define('teachers', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false, //非空
        autoIncrement: true, //自动递增
        primaryKey: true //主键
    },
    tchNum: Sequelize.STRING(50),
    tchName: Sequelize.STRING(50),
    tchAge: Sequelize.BIGINT(50),
    tchGender: Sequelize.STRING(50),
    // classID: Sequelize.BIGINT(50),
}, {
    timestamps: false,
    raw: true,
});
module.exports = Teacher