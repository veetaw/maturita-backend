const Sequelize = require('sequelize')
const config = require('../config')

// TODO: prod use mysql
if (config.env != 'prod')
    const sequelize = new Sequelize('sqlite:db.sqlite')
else
    const sequelize = new Sequelize(config.db.db_name, config.db.username, config.db.password, {
        dialect: 'mysql',
        host: config.db.url,
    })

module.exports = sequelize
