const router = require('express').Router()
const controller = require('./owner.controller')

router.get('/info', controller.info)
router.post('/pizzeria', controller.createPizzeria)
router.get('/pizzeria', controller.pizzeria)
router.get('/menu', controller.menu)


module.exports = router