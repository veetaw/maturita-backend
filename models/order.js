const { Model, DataTypes } = require('sequelize')
const sequelize = require('../db/db')

const Pizzeria = require('./pizzeria')
const User = require('./user')
const Item = require('./item')

class Order extends Model { }

Order.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    start: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    shipped: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false,
    },
    delivered: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false,
    },
    total: {
        type: DataTypes.VIRTUAL,
        get() {
            const p = new Promise((resolve, reject) => {
                this.getItems()
                    .then(items => {
                        var total = 0.0
                        items.forEach(item => {
                            total += item.price
                        })
                        resolve(total)
                    })
                    .catch(err => reject(new Error('getItems threw error: ', err)))
            })

            return p
        }
    }
}, {
    sequelize, modelName: 'order',
})

Order.belongsTo(Pizzeria, { targetKey: 'id' })
Order.belongsTo(User, { targetKey: 'id' })
Order.belongsToMany(Item, { through: 'order_item', targetKey: 'id' })

module.exports = Order
