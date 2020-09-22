// tablename为pet
var Sequelize = require('sequelize')
var sequelize = require('../../config/sequelize.config')
var Score = sequelize.define('score', {
    stuid: {
        type: Sequelize.INTEGER,
        allowNull: false, //非空
        primaryKey: true //主键
    },
    hwid: {
        type: Sequelize.INTEGER,
        allowNull: false, //非空
        primaryKey: true //主键
    },
    score: Sequelize.STRING(50),
    resultFile: Sequelize.STRING(250),
}, {
    timestamps: false,
    raw: true,
});
module.exports = Score 