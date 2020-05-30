const controller = require('./auth.controller')
const router = require('express').Router()
const authMiddleware = require('../../../middlewares/auth_middleware')

router.post('/registerUser', controller.registerUser)
router.post('/loginUser', controller.loginUser)

router.post('/registerOwner', controller.registerOwner)
router.post('/loginOwner', controller.loginOwner)

module.exports = router