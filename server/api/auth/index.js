require('dotenv').config()
const jwt = require("jsonwebtoken")
const path = require("path");
const authenticateToken = (req, res, next) => {
    const token = req.cookies?.accessToken
    if(token == null) {
        return req.path?.startsWith('/api') 
            ? res.sendStatus(401) 
            : res.sendFile(path.join(__dirname, "../../", "/admin/authenticate.html"))
    }
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, _user) => {
        if(err) {
            res.clearCookie("accessToken");
            res.status(500).json("Server Error: JWS token in invalid, Please Reload!")
        } else {
            next()
        } 
    })
}

module.exports = authenticateToken