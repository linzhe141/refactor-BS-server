const { Router } = require('express')
const userService = require('../service/user')
const studentService = require('../service/student')
const teacherService = require('../service/teacher')
const classgradeService = require('../service/classgrade')

const util = require('../util')

class UserController{
    // userService
    async init(){
        this.userService = await userService()
        this.studentService = await studentService()
        this.teacherService = await teacherService()
        this.classgradeService = await classgradeService()
        this.util = await util()

        const router = Router()
        router.post('/login',this.login)
        router.get('/userList',this.userList)
        router.post('/',this.createUser)
        router.get('/',this.find)
        router.get('/:username',this.getUserinfo)
        router.put('/',this.updateUser)
        router.delete('/',this.deleteUser)
        return router
    }

    /**
     * 用户登录
     * @route POST /api/user/login
     * @summary 用户登录
     * @group user - 用户模块
     * @param {string} username.formData - 请输入用户名
     * @param {string} password.formData - 请输入密码
     */
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
        console.log('result--->',result[0].permissions == 2)
        let stuOrtchNum
        let stuOrtchName
        let className
        let classgradeId
        if(result[0].permissions == 1){
            console.log('教师')
            // return 
        } else if(result[0].permissions == 2){
            const stuUser = (await this.studentService.find({stuNum:username}))[0]
            console.log('stuUser--->',stuUser.id)
            className =(await this.classgradeService.find({id:stuUser.classgradeId}))[0].className
            stuOrtchNum = stuUser.id 
            stuOrtchName = stuUser.stuName 
            classgradeId = stuUser.classgradeId 
        }
        const data =  []
        result.forEach(item=>{
            data.push({
                id: item.id,
                username: item.username,
                permissions: item.permissions,
                stuOrtchNum,
                stuOrtchName,
                className,
                classgradeId            })
        })
        let token = await this.util.generateToken(username)
        return res.send({success: true, data: data, token: token})
    }

    /**
     * 获取所有用户
     * @route GET /api/user/userList
     * @summary 获取所有用户
     * @group user - 用户模块
     */
    userList = async(req, res) => {
        const userList = await this.userService.findAll()
        res.send({success: true, data: userList})
    }

    /**
     * 创建用户
     * @route POST /api/user/
     * @summary 创建用户
     * @group user - 用户模块
     * @param {string} username.formData - 请输入用户名
     * @param {string} password.formData - 请输入密码
     * @param {string} permissions.formData - 请输入权限
     */
    createUser = async (req, res) => {
        const {username, password, permissions} = req.body
        const validation = await this.util.validaRequiredFields({username, password, permissions})
        if(validation !== true){
            return res.send(validation)
        }
        let newUser = await this.userService.create({username, password, permissions})
        if(newUser.errors) {
            return res.send({success: false, error: newUser.errors})
        }
        return res.send({success: true, data: newUser})
    }

    /**
     * 查找用户
     * @route GET /api/user/
     * @summary 查找用户
     * @group user - 用户模块
     * @param {string} username.query - 请输入用户名
     * @param {string} password.query - 请输入密码
     * @param {string} permissions.query - 请输入权限
     */
    find = async(req, res) => {
        let {username, password, permissions} = req.query
        username = username || ''
        password = password || ''
        permissions = permissions || ''
        const result = await this.userService.find({username, password, permissions})
        res.send({success: true, data: result})
    }

    /**
     * 获取用户信息
     * @route GET /api/user/{username}
     * @summary 获取用户信息
     * @group user - 用户模块
     * @param {string} username.path.required - 请输入用户名
     */
    getUserinfo = async(req, res) => {
        let {username} = req.params
        username = username || ''
        const result = await this.userService.find({username})
        res.send({success: true, data: result})
    }

    /**
     * 更新用户
     * @route PUT /api/user/
     * @summary 更新用户
     * @group user - 用户模块
     * @param {string} id.formData - 请输入用户id
     * @param {string} username.formData - 请输入用户名
     * @param {string} password.formData - 请输入密码
     * @param {string} permissions.formData - 请输入权限
     */
    updateUser = async (req, res)=>{
        let {id,username,password,permissions} = req.body
        const validation = await this.util.validaRequiredFields({id, username, password,permissions})
        if(validation !== true){
            return res.send(validation)
        }
        const result = await this.userService.update({id,username,password,permissions})
        if(result.length != 1){
            return res.send({success: false, data: result})
        }
        return res.send({success: true, data: result})
    }

    /**
     * 删除用户
     * @route DELETE /api/user/
     * @summary 删除用户
     * @group user - 用户模块
     * @param {string} id.formData - 请输入用户id
     */
    deleteUser = async (req, res)=>{ 
        let {id} = req.body
        const user = await this.userService.find({id})
        if(id == 1 || id == 2){
            return res.send({success:false,msg:'该用户不可删除'})
        }
        if(user.length){
            const type = user[0].permissions
            if(type == 1 ){
                const tch = await this.teacherService.find({userId: id})
                const tid = tch[0].id
                const deleteteacher = await this.teacherService.deleteById({id:tid})
                const deleteuser = await this.userService.delete({id})
                return res.send({success: true, msg: '删除成功'})
            }
            if(type == 2 ){
                const stu = await this.studentService.find({userId: id})
                const sid = stu[0].id
                const deletestudent = await this.studentService.deleteById({id:sid})
                const deleteuser = await this.userService.delete({id})
                return res.send({success: true, msg: '删除成功'})
            }
        }else{
            return res.send({success:false,msg:'该用户已删除'})
        }
    }

    
}
module.exports =    async () => {
    const c = new UserController();
    return await c.init();
};