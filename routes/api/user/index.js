const router = require('express').Router()
const controller = require('./user.controller')

router.get('/info', controller.info)

router.get('/pizzerie', controller.pizzerie)

router.get('/pizzeria', controller.pizzeria)

router.get('/orders', controller.orders)

router.post('/order', controller.order)
router.get('/order', controller.get_order)

module.exports = router