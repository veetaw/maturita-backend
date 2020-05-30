const Pizzeria = require('../../../models/pizzeria')
const Owner = require('../../../models/owner')
const Item = require('../../../models/item')
const Opening = require('../../../models/opening')
const Order = require('../../../models/order')

// send owner infos
exports.info = (req, res) => {
    Owner.findOne({ where: { id: req.decoded.id } })
        .then(owner => {
            if (owner == undefined || owner === {})
                throw new Error('owner not registered')
            res.json(owner)
        })
        .catch(error => res.json({ success: false, message: error.message }))
}

exports.createPizzeria = (req, res) => {
    const { name, p_iva, address, phone, email } = req.body

    var currentOwner

    const checkAlreadyExisting = (user) => {
        if (user.pizzeria == undefined || user.pizzeria === {}) {
            currentOwner = user
            return user
        }
        else throw new Error('pizzeria already exists')
    }

    const create = () => {
        const p = new Promise((resolve, reject) => {
            Pizzeria.create({
                name: name,
                p_iva: p_iva,
                address: address,
                phone: phone,
                email: email,
            })
                .then(resolve)
                .catch(e => { reject(new Error("Error creating pizzeria, " + e.message)) })
        })
        return p
    }

    const associate = (pizzeria) => {
        const p = new Promise((resolve, reject) => {
            currentOwner
                .setPizzeria(pizzeria)
                .then(resolve)
                .catch(reject)
        })

        return p
    }

    const respond = (pizzeria) => {
        res.json({
            success: true,
            owner: currentOwner,
            pizzeria: pizzeria,
        })
    }

    const error = (error) => {
        res.json({
            success: false, message: error.message
        })
    }

    Owner.findOne({ where: { id: req.decoded.id }, include: Pizzeria })
        .then(checkAlreadyExisting)
        .then(create)
        .then(associate)
        .then(respond)
        .catch(error)
}

exports.pizzeria = (req, res) => {
    const get = (owner) => {
        const p = new Promise((resolve, reject) => {
            owner.getPizzeria().then(pizzeria => {
                if (pizzeria === {} || pizzeria == undefined)
                    reject(new Error('no pizzeria associated'))
                else
                    resolve({
                        id: pizzeria.id,
                        name: pizzeria.name,
                        p_iva: pizzeria.p_iva,
                        address: pizzeria.address,
                        phone: pizzeria.phone,
                        email: pizzeria.email,
                    })
            }).catch(e => reject(new Error("can't get pizzeria associated with user, " + e.message)))
        })

        return p

    }

    const respond = (pizzeria) => {
        res.json({
            success: true,
            pizzeria: pizzeria,
        })
    }

    const error = (error) => {
        res.json({
            success: false, message: error.message
        })
    }

    Owner.findOne({ where: { id: req.decoded.id } })
        .then(get)
        .then(respond)
        .catch(error)
}

exports.menu = (req, res) => {
    var currentPizzeria

    const get = (owner) => {
        const p = new Promise((resolve, reject) => {
            owner.getPizzeria().then(pizzeria => {
                if (pizzeria === {} || pizzeria == undefined)
                    throw new Error('no pizzeria associated')
                else
                    resolve(pizzeria)
            }).catch(e => reject(new Error("can't get pizzeria associated with user, " + e.message)))
        })
        return p
    }

    const getMenu = (pizzeria) => {
        const p = new Promise((resolve, reject) => {
            pizzeria.getItems()
                .then(items => {
                    resolve(items.map(item => {
                        return {
                            id: item.id,
                            name: item.name,
                            price: item.price,
                            type: item.type,
                        }
                    }))
                }).catch(e => reject(new Error('no menu, ' + e.message)))
        })
        return p
    }

    const respond = (menu) => {
        res.json({
            success: true,
            pizzeria: currentPizzeria,
            menu: menu
        })
    }

    const error = (error) => {
        res.json({
            success: false, message: error.message
        })
    }

    Owner.findOne({ where: { id: req.decoded.id } })
        .then(get)
        .then(getMenu)
        .then(respond)
        .catch(error)
}

exports.createMenu = (req, res) => {
    const { items } = req.body

    const getPizzeria = (owner) => {
        const p = new Promise((resolve, reject) => {
            owner.getPizzeria().then(pizzeria => {
                if (pizzeria == undefined || pizzeria === {})
                    reject(new Error('Add a pizzeria before a menu'))
                resolve(pizzeria)
            }).catch(reject)
        })

        return p
    }

    const createMenu = (pizzeria) => {
        const p = new Promise((resolve, reject) => {
            items
                .map(item => {
                    resolve(
                        getItem(item.id)
                            .then(pizzeria.addItem)
                            .catch(reject)
                    )
                })
        })

        return p
    }

    const getItem = (id) => {
        const p = new Promise((resolve, reject) => {
            item.findOne({ where: { id: id } }).then(item => {
                if (item == undefined || item === {})
                    reject(new Error('item not found'))
                else
                    resolve(item)

            })
                .catch(reject)
        })

        return p
    }

    const respond = (_) => {
        res.json({
            success: true,
        })
    }

    const error = (error) => {
        res.json({
            success: false,
            message: error.message
        })
    }


    Owner.findOne({ where: { id: req.decoded.id } })
        .then(getPizzeria)
        .then(createMenu)
        .then(respond)
        .catch(error)
}

exports.addToMenu = (req, res) => {
    const { item } = req.body

    const getPizzeria = (owner) => {
        const p = new Promise((resolve, reject) => {
            owner.getPizzeria().then(pizzeria => {
                if (pizzeria == undefined || pizzeria === {})
                    reject(new Error('Add a pizzeria before a menu'))
                resolve(pizzeria)
            }).catch(reject)
        })

        return p
    }

    const add = (pizzeria) => {
        const p = new Promise((resolve, reject) => {
            getItem(item.id)
                .then(_item => {
                    pizzeria.addItem(_item).then(resolve(_item))
                })
                .catch(reject)
        })
        return p
    }

    const getItem = (id) => {
        const p = new Promise((resolve, reject) => {
            Item.findOne({ where: { id: id } }).then(_item => {
                if (_item == undefined || _item === {})
                    reject(new Error('item not found'))
                else
                    resolve(_item)
            })
                .catch(reject)
        })

        return p
    }

    const respond = (_item) => {
        res.json({
            success: true,
            item: {
                id: _item.id,
                name: _item.name,
                price: _item.price,
                type: _item.type,
                image: _item.image
            }
        })
    }

    const error = (error) => {
        res.json({
            success: false,
            message: error.message
        })
    }


    Owner.findOne({ where: { id: req.decoded.id } })
        .then(getPizzeria)
        .then(add)
        .then(respond)
        .catch(error)
}

exports.createItem = (req, res) => {
    const { name, price, type, image } = req.body

    const respond = (item) => {
        res.json({
            success: true,
            item: item
        })
    }

    const error = (error) => {
        res.json({
            success: false,
            message: error.message
        })
    }

    Item.create({
        name: name,
        price: price,
        type: type,
        image: image
    })
        .then(respond)
        .catch(error)
}

exports.item = (req, res) => {
    const id = req.query.id

    const respond = (item) => {
        res.json({
            success: true,
            item: item
        })
    }

    const error = (error) => {
        res.json({
            success: false,
            message: error.message
        })
    }

    Item.findOne({ where: { id: id } })
        .then(respond)
        .catch(error)
}

exports.editItem = (req, res) => {
    const id = req.query.id

    const respond = (item) => {
        res.json({
            success: true,
        })
    }

    const error = (error) => {
        res.json({
            success: false,
            message: error.message
        })
    }

    Item.update(req.body, { where: { id: id } })
        .then(respond)
        .catch(error)

}

exports.openings = (req, res) => {
    const getPizzeria = (owner) => {
        const p = new Promise((resolve, reject) => {
            owner.getPizzeria().then(pizzeria => {
                if (pizzeria == undefined || pizzeria === {})
                    reject(new Error('Owner has no pizzeria associated'))
                else
                    resolve(pizzeria)
            })
        })

        return p
    }

    const getOpenings = (pizzeria) => {
        const p = new Promise((resolve, reject) => {
            pizzeria.getOpenings().then(openings => {
                if (openings === undefined)
                    reject(new Error('no openings'))
                else
                    resolve(openings)
            })
        })

        return p
    }

    const respond = (openings) => {
        res.json({
            success: true,
            openings: openings
        })
    }

    const error = (error) => {
        res.json({
            success: false,
            message: error.message
        })
    }

    Owner.findOne({ where: { id: req.decoded.id } })
        .then(getPizzeria)
        .then(getOpenings)
        .then(respond)
        .catch(error)
}

exports.addOpening = (req, res) => {
    const { start, end } = req.body

    const getPizzeria = (owner) => {
        const p = new Promise((resolve, reject) => {
            owner.getPizzeria().then(pizzeria => {
                if (pizzeria == undefined || pizzeria === {})
                    reject(new Error('Owner has no pizzeria associated'))
                else
                    resolve(pizzeria)
            })
        })

        return p
    }

    const addOpening = (pizzeria) => {
        const p = new Promise((resolve, reject) => {
            Opening.create({
                start: start,
                end: end,
            }).then(opening => {
                pizzeria.addOpening(opening).then(pizzeria => {
                    pizzeria.getOpenings().then(resolve)
                })
            }).catch(reject)

        })

        return p
    }

    const respond = (openings) => {
        res.json({
            success: true,
            openings: openings
        })
    }

    const error = (error) => {
        res.json({
            success: false,
            message: error.message
        })
    }

    Owner.findOne({ where: { id: req.decoded.id } })
        .then(getPizzeria)
        .then(addOpening)
        .then(respond)
        .catch(error)
}

exports.removeOpening = (req, res) => {
    const id = req.query.id

    const deleteOpening = (owner) => {
        const p = new Promise((resolve, reject) => {

            Opening.findOne({ where: { id: id } })
                .then(opening => owner.pizzeria.removeOpening(opening).then(resolve))
                .catch(reject)
        })
        return p
    }

    const respond = (openings) => {
        res.json({
            success: true,
        })
    }

    const error = (error) => {
        res.json({
            success: false,
            message: error.message
        })
    }


    Owner.findOne({ where: { id: req.decoded.id }, include: Pizzeria })
        .then(deleteOpening)
        .then(respond)
        .catch(error)
}

exports.removeFromMenu = (req, res) => {
    const id = req.query.id

    const remove = (owner) => {
        const p = new Promise((resolve, reject) => {
            Item.findOne({ where: { id: id } })
                .then(item => owner.pizzeria.removeItem(item).then(resolve))
                .catch(reject)
        })
        return p
    }

    const respond = (_) => {
        res.json({
            success: true,
        })
    }

    const error = (error) => {
        res.json({
            success: false,
            message: error.message
        })
    }


    Owner.findOne({ where: { id: req.decoded.id }, include: Pizzeria })
        .then(remove)
        .then(respond)
        .catch(error)
}

exports.getOrders = (req, res) => {
    const get = async (owner) => {
        const p = new Promise((resolve, reject) => {
            Order.findAll({ include: Pizzeria, where: { pizzeriaId: owner.pizzeria.id } })
                .then(orders => {
                    resolve(Promise.all(orders.map(parseOrder)))
                }).catch(reject)

        })
        return p
    }

    const parseOrder = async (order) => {
        return {
            id: order.id,
            start: order.start,
            shipped: order.shipped,
            delivered: order.delivered,
            total: await order.total,
            items: await order.getItems(),
            updatedAt: order.updatedAt
        }
    }


    const respond = (orders) => {
        res.json({
            success: true,
            orders: orders
        })
    }

    const error = (error) => {
        res.json({
            success: false,
            message: error.message
        })
    }


    Owner.findOne({ where: { id: req.decoded.id }, include: Pizzeria })
        .then(get)
        .then(respond)
        .catch(error)
}

exports.editOrder = (req, res) => {
    const id = req.query.id

    const edit = (owner) => {
        const p = new Promise((resolve, reject) => {
            Order.update(req.body, {
                include: Pizzeria,
                where: {
                    id: id,
                    pizzeriaId: owner.pizzeria.id
                }
            })
                .then(order => {
                    resolve(order)
                }).catch(reject)

        })
        return p
    }

    const respond = (_) => {
        res.json({
            success: true,
            order: order
        })
    }

    const error = (error) => {
        res.json({
            success: false,
            message: error.message
        })
    }


    Owner.findOne({ where: { id: req.decoded.id }, include: Pizzeria })
        .then(edit)
        .then(respond)
        .catch(error)
}
