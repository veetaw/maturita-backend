const { Model, DataTypes } = require('sequelize')
const sequelize = require('../db/db')

class Opening extends Model { }

Opening.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    start: {
        type: DataTypes.TIME,
        allowNull: false,
    },
    end: {
        type: DataTypes.TIME,
        allowNull: false,
    },
}, {
    sequelize, modelName: 'opening', name: {
        singular: 'opening',
        plural: 'openings'
    }
})


module.exports = Opening
