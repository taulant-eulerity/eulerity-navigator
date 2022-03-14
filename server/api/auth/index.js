require('dotenv').config()
const jwt = require('jsonwebtoken')
const authenticateToken = (req, res, next) => {
    const token = req.cookies?.accessToken
    if(token == null) {
        req.login = false
        next()
        return
    }
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err,user) => {
        err ?  req.login = false :  req.login = true
        next()
    })
}

module.exports = authenticateToken