const express = require('express')

const cookieParser = require('cookie-parser');
const {db} = require('../data/models')
const authenticateToken = require('./auth')


const {reloadState, getLeftUsers, presentations, createUser, login, logout, admin, removeUser} = require("../controller/admin")
const {navigator, userList}  = require("../controller/app")

const path = require('path');
const app = express()


const PORT = 8080

app.use(express.json());
app.use(cookieParser());

app.use(express.static(path.join(__dirname, '../../' ,'/public')))
app.use(express.static(path.join(__dirname, '../' ,'/admin')))



app.post('/api/navigator', navigator)

app.get('/api/userList', userList)

//ADMIN
app.get('/api/reload', reloadState)

app.get('/api/getLeftUser', getLeftUsers)

app.get('/api/presentations', presentations)

app.post("/api/createUser", createUser)

app.post('/api/login', login)

app.post("/api/removeUser", removeUser)

app.get('/admin', authenticateToken, admin)

app.get('/api/logout',logout)




app.get('*', function(_req, res) {
    res.sendFile(path.join(__dirname, '../../' ,'/public/index.html'));
});


//SERVER
db.sync().then(_ => {
    app.listen(PORT, () => {
        console.log(`server is running on port ${PORT}`)
    })
})


