// tablename为pet
var Sequelize = require('sequelize')
var sequelize = require('../../config/sequelize.config')
var user = sequelize.define('users', {
    username: {
        type: Sequelize.STRING(50),
        primaryKey: true
    },
    password: Sequelize.STRING(50),
    permissions: Sequelize.BIGINT(50),
}, {
    timestamps: false,
    raw: true,
});
module.exports = user