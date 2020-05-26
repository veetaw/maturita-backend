const User = require('../models/user')
const Item = require('../models/item')
const Opening = require('../models/opening')
const Order = require('../models/order')
const Owner = require('../models/owner')
const Pizzeria = require('../models/pizzeria')

exports.populate_db = async () => {
    await User.create({
        firstName: "Poggers",
        lastName: "F",
        email: "fasf" + Math.random().toString() + "@fasf.com",
        address: "F street, 4",
        phone: "+393333333333",
        password: "testPassword"
    })

    await Owner.create({
        firstName: "Poggers",
        lastName: "F",
        email: "fasf" + Math.random().toString() + "@fasf.com",
        password: "testPassword"
    })
    // use API to create a user and a owner prior to this
    var owner = await Owner.findOne({ where: { id: 1 } })

    var pizzeria = await Pizzeria.create({
        name: "pizzeria mamma mia",
        p_iva: "EEEE" + Math.random().toString(),
        address: "302, fasf st.",
        phone: "+393333333333",
        email: "fasf" + Math.random().toString() + "@fasf.com"
    })

    owner.setPizzeria(pizzeria)

    var opening = await Opening.create({
        start: "19:30",
        end: "23:30",
    })

    pizzeria.addOpening(opening)

    var i1 = await Item.create({
        name: "Pizza",
        price: 3.50,
        type: 'pizza'
    })

    var i2 = await Item.create({
        name: "Water",
        price: 0.5,
        type: 'drink'
    })

    pizzeria.addItem(i1)
    pizzeria.addItem(i2)

}
