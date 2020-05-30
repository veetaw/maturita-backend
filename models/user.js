const { Model, DataTypes } = require('sequelize')
const config = require('../config')
const crypto = require('crypto')
const sequelize = require('../db/db')

class User extends Model {
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

User.init({
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
    address: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    profile_picture: {
        type: DataTypes.BLOB('long')
    }
}, { sequelize, modelName: 'user' })

User.prototype.toJSON = function () {
    var values = Object.assign({}, this.get());

    delete values.password;
    return values;
}

module.exports = User