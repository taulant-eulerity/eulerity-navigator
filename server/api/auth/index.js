require('dotenv').config()
const jwt = require("jsonwebtoken")
const path = require("path");
const authenticateToken = (req, res, next) => {
    const token = req.cookies?.accessToken
    if(token == null) {
        switch(req.path) {
            case "/admin": return  res.sendFile(path.join(__dirname, "../../", "/admin/authenticate.html"))
            case "/app": return  res.sendFile(path.join(__dirname, "../../", "/admin/authenticate.html"))
            default: return res.sendStatus(401)
        }
    }
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err,_) => {
        if(err) {
            res.clearCookie("accessToken");
            res.status(500).json("Server Error: JWS token in invalid, Please Reload!")
        } else {
            next()
        } 
    })
}

module.exports = authenticateToken