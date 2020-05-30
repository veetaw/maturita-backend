const router = require('express').Router()
const controller = require('./owner.controller')

router.get('/info', controller.info)

router.get('/pizzeria', controller.pizzeria)
router.post('/pizzeria', controller.createPizzeria)

router.get('/menu', controller.menu)
router.post('/menu', controller.createMenu)
router.put('/menu', controller.addToMenu)
router.delete('/menu', controller.removeFromMenu)

router.get('/item', controller.item)
router.post('/item', controller.createItem)
router.patch('/item', controller.editItem)

router.get('/opening', controller.openings)
router.put('/opening', controller.addOpening)
router.delete('/opening', controller.removeOpening)

router.get('/order', controller.getOrders)
router.patch('/order', controller.editOrder)

module.exports = router