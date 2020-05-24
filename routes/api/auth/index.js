const controller = require('./auth.controller');
const router = require('express').Router()
const authMiddleware = require('../../../middlewares/jwt_middleware');

router.post('/registerUser', controller.registerUser);
router.post('/loginUser', controller.loginUser);

router.post('/registerOwner', controller.registerOwner);
router.post('/loginOwner', controller.loginOwner);

router.use('/check', authMiddleware);
router.get('/check', controller.check);

module.exports = router;