const { Router } = require('express')
const userService = require('../service/user')

class UserController{
    // userService
    async init(){
        this.userService = await userService()
        const router = Router()
        router.post('/createUser',this.createUser)
        router.get('/userList',this.userList)
        router.post('/login',this.login)
        router.get('/:username',this.find)
        return router
    }

    createUser = async (req, res) => {
        const {username, password, permissions} = req.body
        const newUser = await this.userService.create({username, password, permissions})
        res.send({success: true, data: newUser})
    }

    userList = async(req, res) => {
        const userList = await this.userService.findAll()
        res.send({success: true, data: userList})
    }

    login = async(req, res) => {
        const {username,password} = req.body
    }

    find = async(req, res) => {
        let {username, password, permissions} = req.params
        username = username || ''
        password = password || ''
        permissions = permissions || ''
        console.log(username, password, permissions)
        const result = await this.userService.find({username, password, permissions})
        console.log(result)
        res.send({success: true, data: result})
    }
}
module.exports = async () => {
    const c = new UserController();
    return await c.init();
};