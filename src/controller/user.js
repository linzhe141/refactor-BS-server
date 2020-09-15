const { Router } = require('express')
const userService = require('../service/user')
const util = require('../util')

class UserController{
    // userService
    async init(){
        this.userService = await userService()
        this.util = await util()

        const router = Router()
        router.post('/',this.createUser)
        router.get('/userList',this.userList)
        router.post('/login',this.login)
        router.get('/:username',this.find)
        router.delete('/',this.deleteUser)
        router.put('/:username',this.updateUser)
        return router
    }

    createUser = async (req, res) => {
        const {username, password, permissions} = req.body
        const validation = await this.util.validaRequiredFields({username, password, permissions})
        if(validation !== true){
            return res.send(validation)
        }
        let newUser = await this.userService.create({username, password, permissions})
        console.log(newUser)
        if(newUser.errors) {
            return res.send({success: false, error: newUser.errors})
        }
        return res.send({success: true, data: newUser})
    }

    userList = async(req, res) => {
        const userList = await this.userService.findAll()
        res.send({success: true, data: userList})
    }

    login = async(req, res) => {
        const {username,password} = req.body
        const validation = await this.util.validaRequiredFields({username, password})
        if(validation !== true){
            return res.send(validation)
        }
        const result = await this.userService.adminLogin({username, password})
        if(result.length == 0){
            return res.send({success: false, msg: '账号或者密码错误'})
        }
        let token = await this.util.generateToken(username)
        return res.send({success: true, data: result, token: token})
    }

    find = async(req, res) => {
        let {username, password, permissions} = req.params
        username = username || ''
        password = password || ''
        permissions = permissions || ''
        const result = await this.userService.find({username, password, permissions})
        res.send({success: true, data: result})
    }

    deleteUser = async (req, res)=>{
        let {username} = req.body
        const result = await this.userService.delete({username})
        res.send({success: true, data: result})
    }

    updateUser = async (req, res)=>{
        let {username} = req.params
        let {password,permissions} = req.body
        const validation = await this.util.validaRequiredFields({username, password,permissions})
        if(validation !== true){
            return res.send(validation)
        }
        const result = await this.userService.update({username,password,permissions})
        if(result.length != 1){
            return res.send({success: false, data: result})
        }
        return res.send({success: true, data: result})
    }
}
module.exports = async () => {
    const c = new UserController();
    return await c.init();
};