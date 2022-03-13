const express = require('express')
const {writeFile, readFile} = require('fs')
const {promisify} = require('util')
const cookieParser = require('cookie-parser');
const {db} = require('../data/models')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const {Users} = require("../data/models")


const path = require('path')
const app = express()

const writeFilePromise = promisify(writeFile)
const readFilePromise = promisify(readFile)


const PORT = 8080

app.use(express.json());
app.use(cookieParser());

app.use(express.static(path.join(__dirname, '../../' ,'/public')))
app.use(express.static(path.join(__dirname, '../' ,'/admin')))



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

app.post('/api', async (req,res) => {
    const {userName} = req.body
    const data = await readFilePromise('../data/data-store.json')
    const parsedData = JSON.parse(data)

    const removeUser = parsedData.filter(user => user !== userName)
    await writeFilePromise('../data/data-store.json', JSON.stringify(removeUser))
    const left = await readFilePromise('../data/data-store.json')
    const parsedLeft = JSON.parse(left)

    //-----
    let presantation = await readFilePromise('../data/presentations.json')
    presantation = JSON.parse(presantation)

    await writeFilePromise('../data/presentations.json', JSON.stringify({...presantation, [new Date()]: userName  }))


    if(!parsedLeft.length) {
        const restoreUsers = await readFilePromise('../data/restore-data.json')
        const parsedRestoreUsers = JSON.parse(restoreUsers)
        await writeFilePromise('../data/data-store.json', JSON.stringify(parsedRestoreUsers))
    }
    res.status(200).json('Success')
})


app.get('/api/reload',   async (_req, res) => {
    const restoreUsers = await readFilePromise('../data/restore-data.json')
    const parsedRestoreUsers = JSON.parse(restoreUsers)
    await writeFilePromise('../data/data-store.json', JSON.stringify(parsedRestoreUsers))
    await writeFilePromise('../data/presentations.json', JSON.stringify({}))
    res.status(200).json('reload success')
})


app.get('/api',  async (_req,res) => {
    const data = await readFilePromise('../data/data-store.json')
    res.json(JSON.parse(data))
})

app.get('/api/presentations', async (_req,res) => {
    const data = await readFilePromise('../data/presentations.json')
    res.json(JSON.parse(data))
})

app.get('/api/userList', async (_req,res) => {
    const data = await readFilePromise('../data/restore-data.json')
    res.json(JSON.parse(data))
})


app.post("/api/createUser", async (req,res) => {
    const {userName} = req.body

    const currentList = await readFilePromise('../data/restore-data.json')
    const currentListParsed = JSON.parse(currentList)
    const user = currentListParsed.find(user => user === userName) 

    if(user) {
        res.status(422).json("User Exists");
        return
    }
    await writeFilePromise('../data/restore-data.json', JSON.stringify([...currentListParsed, userName]))
    res.status(200).json('user has been created')
})
app.post('/api/login', (req,res) => {
    const {username, password} = req.body
    if(username === 'test' &&  password === '123') {
        const user = {name: username, password: password}
        const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
        res.json({accessToken})
        return 
    }
    res.sendStatus(401)

})


app.get('/api/logout',(req,res) => {
    res.clearCookie('accessToken');
    res.end()
})

app.post("/api/removeUser", async (req,res) => {
    const {userName} = req.body
    const currentList = await readFilePromise('../data/restore-data.json')
    let activeUserList = await readFilePromise('../data/data-store.json')
    activeUserList = JSON.parse(activeUserList)
    const currentListParsed = JSON.parse(currentList)
    const user = currentListParsed.find(user => user === userName) 
    const userInActiveList = activeUserList.find(user => user === userName)
    if(user) {
        await writeFilePromise('../data/restore-data.json', JSON.stringify(currentListParsed.filter(user => user !== userName)))
        if(userInActiveList) {
            await writeFilePromise('../data/data-store.json', JSON.stringify(activeUserList.filter(user => user !== userName)))
        }
        res.status(200).json('user has been removed')
        return 
    }
    res.status(422).json("User doesn't exists");
})

app.get('/admin', authenticateToken,  async (req,res) => {
    if(req.login){
        res.sendFile(path.join(__dirname, '../' ,'/admin/index.html')); 
    } else {
        res.sendFile(path.join(__dirname, '../' ,'/admin/authenticate.html')); 
    }
})
app.get('*', function(_req, res) {
    res.sendFile(path.join(__dirname, '../../' ,'/public/index.html'));
});
db.sync().then(_ => {

    Users.create({name: "manolo"})


    app.listen(PORT, () => {
        console.log(`server is running on port ${PORT}`)
    })
})


