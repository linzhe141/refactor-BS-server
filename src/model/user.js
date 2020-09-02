// tablename为pet
var Sequelize = require('sequelize')
var sequelize = require('../../config/sequelize.config')
var user = sequelize.define('users', {
    username: {
        type: Sequelize.STRING(50),
        primaryKey: true
    },
    password: Sequelize.STRING(100),
    permissions: Sequelize.BIGINT,
}, {
    timestamps: false,
    raw: true,
});
module.exports = user