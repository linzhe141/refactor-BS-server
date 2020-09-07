// tablename为pet
var Sequelize = require('sequelize')
var sequelize = require('../../config/sequelize.config')
var student = sequelize.define('students', {
    stuID: {
        type: Sequelize.STRING(50),
        primaryKey: true
    },
    stuName: Sequelize.STRING(50),
    stuAge: Sequelize.BIGINT(50),
    stuGender: Sequelize.STRING(50),
    classID: Sequelize.BIGINT(50),
}, {
    timestamps: false,
    raw: true,
});
module.exports = student