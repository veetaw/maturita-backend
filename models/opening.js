const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db/db');

class Opening extends Model { }

Opening.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    start: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    end: {
        type: DataTypes.DATE,
        allowNull: false,
    },
}, { sequelize, modelName: 'opening' });


module.exports = Opening;
