const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db/db');

const Pizzeria = require('./pizzeria');
const User = require('./user');
const Item = require('./item');

class Order extends Model { }

Order.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    start: {
        type: DataTypes.DATE, allowNull :false,
    },
    shipped: {
        type: DataTypes.BOOLEAN,
        allowNull :true,
        defaultValue :false,
    },
    delivered: {
        type: DataTypes.BOOLEAN,
        allowNull :true,
        defaultValue :false,
    },
    total: {
        type: DataTypes.FLOAT,
        allowNull :false,
    },
}, { sequelize, modelName: 'order' });

Order.belongsTo(Pizzeria, { targetKey: 'id' });
Order.belongsTo(User, { targetKey: 'id' });
Order.hasMany(Item, { targetKey: 'id' });

module.exports = Order;
