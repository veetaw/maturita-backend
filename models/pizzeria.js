const { Model, DataTypes } = require('sequelize')
const sequelize = require('../db/db')

const Opening = require('./opening')
const Item = require('./item')

class Pizzeria extends Model { }

Pizzeria.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    p_iva: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    address: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isEmail: true,
        }
    },
    profile_picture: {
        type: DataTypes.BLOB('long')
    }
}, {
    sequelize, modelName: 'pizzeria', name: {
        singular: 'pizzeria',
        plural: 'pizzerie'
    }
})

Pizzeria.hasMany(Opening, { targetKey: 'id' })
Pizzeria.belongsToMany(Item, { through: 'pizzeria_menu', targetKey: 'id' })

module.exports = Pizzeria