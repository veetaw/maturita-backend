const Pizzeria = require('../../../models/pizzeria')
const Owner = require('../../../models/owner')

// send owner infos
exports.info = (req, res) => {
    res.json(req.decoded)
}

exports.createPizzeria = (req, res) => {
    const { name, p_iva, address, phone, email } = req.body

    var currentPizzeria

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
        currentPizzeria = pizzeria
        const p = new Promise((resolve, reject) => {
            Owner.findOne({ where: { id: req.decoded.id } }).then(
                owner => {
                    owner.setPizzeria(pizzeria)
                    resolve(owner)
                }
            ).catch(e => { reject(new Error("Error associating pizzeria, " + e.message)) })
        })

        return p
    }

    const respond = (_) => {
        res.json({
            success: true,
            pizzeria: currentPizzeria,
        })
    }

    const error = (error) => {
        res.json({
            success: false, message: error.message
        })
    }

    create()
        .then(associate)
        .then(respond)
        .catch(error)
}

exports.pizzeria = (req, res) => {
    const get = (owner) => {
        const p = new Promise((resolve, reject) => {
            owner.getPizzeria().then(pizzeria => {
                if (pizzeria === {} || pizzeria == undefined)
                    resolve({})
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
            Item.findAll({ where: { pizzeriaId: pizzeria.id } })
                .then(items => {
                    resolve(items.map(item => {
                        return {
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

}

exports.addToMenu = (req, res) => {

}

exports.createItem = (req, res) => {

}

exports.item = (req, res) => {

}

exports.editItem = (req, res) => {

}

exports.openings = (req, res) => {

}

exports.setOpenings = (req, res) => {

}

exports.addOpening = (req, res) => {

}
