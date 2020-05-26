exports.userMiddleware = (req, res, next) => {
    const decoded = req.decoded

    if (decoded['type'] === 'User') {
        next()
    } else {
        res.status(401).json({
            success: false,
            message: 'tried requesting user api with a owner token',
        })
    }
}

exports.ownerMiddleware = (req, res, next) => {
    const decoded = req.decoded

    if (decoded['type'] === 'Owner') {
        next()
    } else {
        res.status(401).json({
            success: false,
            message: 'tried requesting owner api with a user token',
        })
    }
}
