const router = require('express').Router();
const auth = require('./auth');
const authMiddleware = require('../../middlewares/jwt_middleware');
const user = require('./user');
const owner = require('./owner');

router.use('/auth', auth);

router.use('/user', authMiddleware);
router.use('/user', user);

router.use('/owner', authMiddleware);
router.use('/owner', owner);

module.exports = router;
