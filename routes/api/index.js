const router = require('express').Router()
const auth = require('./auth')
const authMiddleware = require('../../middlewares/auth_middleware')
const typeChecker = require('../../middlewares/type_checker_middleware')
const user = require('./user')
const owner = require('./owner')

router.use('/auth', auth)

router.use('/user', authMiddleware)
router.use('/user', typeChecker.userMiddleware)
router.use('/user', user)

// middleWare for authentication
router.use('/owner', authMiddleware)
// check that owner is an owner and not a simple user
router.use('/owner', typeChecker.ownerMiddleware)
// route owner
router.use('/owner', owner)

module.exports = router
