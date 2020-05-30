const { Model, DataTypes } = require('sequelize')
const sequelize = require('../db/db')
const config = require('../config')
const crypto = require('crypto')

const Pizzeria = require('./pizzeria')

class Owner extends Model {
    static encryptPassword(password) {
        const encrypted_password = crypto.createHmac('sha1', config.token_secret)
            .update(password)
            .digest('base64')

        return encrypted_password
    }

    verifyPassword(password) {
        const encrypted_password = crypto.createHmac('sha1', config.token_secret)
            .update(password)
            .digest('base64')

        return this.password === encrypted_password
    }
}

Owner.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    profile_picture: {
        type: DataTypes.BLOB('long')
    }
}, { sequelize, modelName: 'owner' })

Owner.prototype.toJSON = function () {
    var values = Object.assign({}, this.get());

    delete values.password;
    return values;
}

Owner.hasOne(Pizzeria, { targetKey: 'id' })

module.exports = Owner