const Sequelize = require('sequelize')
const config = require('../config')

// TODO: prod use mysql
const sequelize = new Sequelize('sqlite:db.sqlite')

module.exports = sequelize
