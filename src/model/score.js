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
    state: Sequelize.INTEGER,
    score: Sequelize.STRING(50),
    comments: Sequelize.STRING(250),
    resultFile: Sequelize.STRING(250),
    stuFile: Sequelize.STRING(250),
}, {
    timestamps: false,
    raw: true,
});
module.exports = Score 