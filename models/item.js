const { Model, DataTypes } = require('sequelize')
const sequelize = require('../db/db')

class Item extends Model { }

Item.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    type: {
        type: DataTypes.ENUM,
        values: ['drink', 'pizza'],
        allowNull: false,
    },
    image: {
        type: DataTypes.BLOB('long')
    }
}, { sequelize, modelName: 'item' })


module.exports = Item
