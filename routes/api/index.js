const router = require('express').Router();
const auth = require('./auth');
// const authMiddleware = require('../../middlewares/jwt_middleware');
// const user = require('./user');

router.use('/auth', auth);

module.exports = router;
