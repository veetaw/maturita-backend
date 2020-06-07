const jwt = require('jsonwebtoken')

const User = require('../../../models/user')
const Owner = require('../../../models/owner')
const config = require('../../../config')

exports.registerUser = (req, res) => {
    const { firstName, lastName, email, phone, address, password, profile_picture } = req.body

    const create = (user) => {
        if (user) {
            throw new Error('Email already registered')
        } else {
            User.create({
                firstName: firstName,
                lastName: lastName,
                email: email,
                address: address,
                phone: phone,
                password: User.encryptPassword(password),
                profile_picture: profile_picture
            })
        }
    }

    const respond = (user) => {
        res.json({
            success: true,
        })
    }

    const error = (error) => {
        res.status(409).json({
            success: false,
            message: error.message,
        })
    }

    User.findOne({ where: { email: email } })
        .then(create)
        .then(respond)
        .catch(error)
}

exports.loginUser = (req, res) => {
    const { email, password } = req.body

    const check = (user) => {
        if (!user) throw new Error("user not registered")
        else {
            if (user.verifyPassword(password)) {
                const p = new Promise((resolve, reject) => {
                    jwt.sign(
                        {
                            id: user.id,
                            firstName: user.firstName,
                            lastName: user.lastName,
                            email: user.email,
                            address: user.address,
                            phone: user.phone,
                            type: 'User',
                        },
                        config.token_secret,
                        {},
                        (err, token) => {
                            if (err) reject(err)
                            resolve(token)
                        }
                    )
                })
                return p
            } else {
                throw new Error("Wrong password")
            }
        }
    }

    const respond = (token) => {
        res.json({
            token
        })
    }

    const handleError = (error) => {
        res.status(403).json({ message: error.message })
    }

    User.findOne({ where: { email: email } })
        .then(check)
        .then(respond)
        .catch(handleError)
}

exports.registerOwner = (req, res) => {
    const { firstName, lastName, email, password } = req.body

    const create = (owner) => {
        if (owner) {
            throw new Error('Email already registered')
        } else {
            Owner.create({
                firstName: firstName,
                lastName: lastName,
                email: email,
                password: Owner.encryptPassword(password)
            })
        }
    }

    const respond = (owner) => {
        res.json({
            success: true,
        })
    }

    const error = (error) => {
        res.status(409).json({
            success: false,
            message: error.message,
        })
    }

    Owner.findOne({ where: { email: email } })
        .then(create)
        .then(respond)
        .catch(error)
}

exports.loginOwner = (req, res) => {
    const { email, password } = req.body

    const check = (owner) => {
        if (!owner) throw new Error("owner not registered")
        else {
            if (owner.verifyPassword(password)) {
                const p = new Promise((resolve, reject) => {
                    jwt.sign(
                        {
                            id: owner.id,
                            firstName: owner.firstName,
                            lastName: owner.lastName,
                            email: owner.email,
                            type: 'Owner',
                        },
                        config.token_secret,
                        {
                            expiresIn: '7d',
                        },
                        (err, token) => {
                            if (err) reject(err)
                            resolve(token)
                        }
                    )
                })
                return p
            } else {
                throw new Error("Wrong password")
            }
        }
    }

    const respond = (token) => {
        res.json({
            token
        })
    }

    const handleError = (error) => {
        res.status(403).json({ message: error.message })
    }

    Owner.findOne({ where: { email: email } })
        .then(check)
        .then(respond)
        .catch(handleError)
}
