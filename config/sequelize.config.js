const Sequelize = require('sequelize');
const config = require('./mysql.db.config.js');
console.log(config)
var sequelize = new Sequelize(config.database, config.user, config.password, {
    host: config.host,
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        idle: 30000
    }
});

module.exports = sequelize
