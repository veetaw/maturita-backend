const Pizzeria = require('../../../models/pizzeria');
const User = require('../../../models/user');
const Order = require('../../../models/order');
const Item = require('../../../models/item');

// send user infos
exports.info = (req, res) => {
    res.json(req.decoded);
}

exports.pizzerie = (req, res) => {

    const parse = (pizzerie) => {

        if (pizzerie == undefined || pizzerie === [])
            return {};
        else
            return pizzerie.map(pizzeria => {
                return {
                    id: pizzeria.id,
                    name: pizzeria.name,
                    p_iva: pizzeria.p_iva,
                    address: pizzeria.address,
                    phone: pizzeria.phone,
                    email: pizzeria.email,
                    owner_id: pizzeria.ownerId,
                }
            });
    }

    const respond = (_json) => {
        res.json({
            success: true,
            pizzerie: _json,
        });
    }

    const onError = (error) => {
        res.json({
            success: false, message: error.message
        });
    }

    Pizzeria.findAll()
        .then(parse)
        .then(respond)
        .catch(onError);
}

exports.pizzeria = (req, res) => {
    const pizzeria_id = req.query.id;

    var currentPizzeria;

    const parse = (pizzeria) => {

        if (pizzeria == undefined || pizzeria === {})
            throw new Error('pizzeria not found');
        else
            currentPizzeria = pizzeria;


        return pizzeria;
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
                        };
                    }));
                })
        });

        return p;
    }


    const respond = (menu) => {
        res.json({
            success: true,
            pizzeria: {
                id: currentPizzeria.id,
                name: currentPizzeria.name,
                p_iva: currentPizzeria.p_iva,
                address: currentPizzeria.address,
                phone: currentPizzeria.phone,
                email: currentPizzeria.email,
                owner_id: currentPizzeria.ownerId,
                menu: menu,
            },
        });
    }

    const onError = (error) => {
        res.json({
            success: false,
            message: error.message
        });
    }

    Pizzeria.findOne({ where: { id: pizzeria_id } })
        .then(parse)
        .then(getMenu)
        .then(respond)
        .catch(onError);
}

exports.orders = (req, res) => {
    const user = req.decoded;

    const parse = (orders) => {
        if (orders == undefined || orders === []) {
            return {}
        } else {
            return orders.map(order => {
                return {
                    id: order.id,
                    start: order.start,
                    shipped: order.shipped,
                    delivered: order.delivered,
                    total: order.total,
                }
            });
        }
    }

    const respond = (_json) => {
        res.json({
            success: true,
            orders: _json,
        });
    }

    const onError = (error) => {
        res.json({
            success: false,
            message: error.message
        });
    }

    Order.findAll({ where: { userId: user.id } })
        .then(parse)
        .then(respond)
        .catch(onError);
}

exports.order = (req, res) => {
    const { pizzeria_id, item_list } = req.body;

    var currentUser;
    var currentPizzeria;

    const getPizzeria = (user) => {
        if (user == undefined || user === {})
            throw new Error('user not found');
        currentUser = user;

        if (pizzeria_id == undefined)
            throw new Error('pizzeria id not specified');


        const p = new Promise((resolve, reject) => {
            Pizzeria.findOne({ where: { id: pizzeria_id } })
                .then(pizzeria => {
                    if (pizzeria == null || pizzeria === {})
                        reject(new Error('pizzeria not found'))
                    else
                        resolve(pizzeria);
                });
        });


        return p;
    }

    const getItems = (pizzeria) => {
        currentPizzeria = pizzeria;

        const p = new Promise((resolve, reject) => {
            Item.findAll({
                where: {
                    id: item_list.map(i => i.id)
                }
            }).then(items => {
                if (items == null || items === [])
                    reject(new Error('no items'));
                resolve(items);
            });
        });

        return p;
    }

    const createOrder = (items) => {
        const p = new Promise((resolve, reject) => {
            Order.create({
                start: new Date(),
            }).then(async (order) => {
                order.setPizzeria(currentPizzeria);
                order.setUser(currentUser);
                await order.setItems(items);

                resolve({
                    total: await order.total,
                    shipped: order.shipped,
                    delivered: order.delivered,
                    id: order.id,
                    start: order.start,
                });
            });
        });

        return p;
    }

    const respond = (order) => {
        res.json({
            success: true,
            newOrder: order,
        });
    }

    const onError = (error) => {
        res.json({
            success: false,
            message: error.message
        });
    }


    User.findOne({ where: { id: req.decoded.id } })
        .then(getPizzeria)
        .then(getItems)
        .then(createOrder)
        .then(respond)
        .catch(onError);

}
