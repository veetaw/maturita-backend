const Sequelize = require('sequelize')
const config = require('../config')

// TODO: prod use mysql
if (config.env != 'prod')
    var sequelize = new Sequelize('sqlite:db.sqlite')
else
    var sequelize = new Sequelize(config.db.db_name, config.db.username, config.db.password, {
        dialect: 'mysql',
        host: config.db.url,
    })

module.exports = sequelize
