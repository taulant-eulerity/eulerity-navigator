const {Users, UsersLeft, Presentations} = require("../data/models")


const navigator = async (req,res) => {
    const {userName} = req.body

    const userleft = await UsersLeft.findOne({where: {name: userName}})
    await userleft?.destroy()
    await Presentations.create({name: userName, date: new Date()})
    res.status(200).json('Success')
}


const userList = async (req,res) => {
    let users = await Users.findAll({attributes: ['name']})
    users = users.map(user => user.name)
    res.json(users)
}


module.exports = {navigator, userList}