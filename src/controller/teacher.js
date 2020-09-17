const { Router } = require('express')
const userService = require('../service/user')
const teacherService = require('../service/teacher')
var util = require('../util')

class TeacherController{
    // teacherService
    async init(){
        this.teacherService = await teacherService()
        this.userService = await userService()
        this.util = await util()
        const router = Router()
        router.get('/teacherList',this.teacherList)
        router.post('/',this.createTeacher)
        router.get('/',this.find)
        router.put('/',this.updateTeacher)
        router.delete('/',this.deleteTeacher)
        
        return router
    }
    
    /**
     * 获取所有教师
     * @route GET /api/teacher/teacherList
     * @summary 获取所有教师
     * @group teacher - 教师管理模块
     */
    teacherList = async(req, res) => {
        const teacherList = await this.teacherService.findAll()
        return res.send({success: true, data: teacherList})
    }

    /**
     * 创建教师
     * @route POST /api/teacher/
     * @summary 创建教师
     * @group teacher - 教师管理模块
     * @param {string} tchNum.formData - 请输入教师编号
     * @param {string} tchName.formData - 请输入教师姓名
     * @param {string} tchAge.formData - 请输入教师年龄
     * @param {enum} tchGender.formData - 请输入教师性别
     */
    createTeacher = async(req, res) => {
        const {tchNum,tchName,tchAge,tchGender/* ,classID */} = req.body
        const validation = await this.util.validaRequiredFields({tchNum,tchName,tchAge,tchGender/* ,classID */})
        if(validation !== true){
            return res.send(validation)
        }
        const username = tchNum
        const password = tchNum
        const permissions = 1
        const newUser = await this.userService.create({username, password, permissions})
        
        const newTeacher = await newUser.createTeacher({tchNum,tchName,tchAge,tchGender/* ,classID */})
        if(newTeacher.errors){
            return res.send({success: false, error: newTeacher.errors}) 
        }
        
        return res.send({success: true, data: newTeacher})
    }

    /**
     * 查找教师
     * @route GET /api/teacher/
     * @summary 查找教师
     * @group teacher - 教师管理模块
     * @param {string} tchNum.query - 请输入教师编号
     * @param {string} tchName.query - 请输入教师姓名
     * @param {string} tchAge.query - 请输入教师年龄
     * @param {enum} tchGender.query - 请输入教师性别
     */
    find = async(req, res) => {
        let {tchNum,tchName,tchAge,tchGender/* ,classID */} = req.query
        tchNum = tchNum || ''
        tchName = tchName || ''
        tchAge = tchAge || ''
        tchGender = tchGender || ''
       /*  classID = classID || '' */
        const result = await this.teacherService.find({tchNum,tchName,tchAge,tchGender/* ,classID */})
        if(result.errors){
            return res.send({success: false, error: result.errors})
        }
        return res.send({success: true, data: result})
    }

    /**
     * 更新教师
     * @route PUT /api/teacher/
     * @summary 更新教师
     * @group teacher - 教师管理模块
     * @param {string} id.formData - 请输入id
     * @param {string} tchNum.formData - 请输入教师编号
     * @param {string} tchName.formData - 请输入教师姓名
     * @param {string} tchAge.formData - 请输入教师年龄
     * @param {enum} tchGender.formData - 请输入教师性别
     */
    updateTeacher = async(req, res) => {
        let {id,tchNum,tchName,tchAge,tchGender/* ,classID */} = req.body
        const validation = await this.util.validaRequiredFields({id,tchNum,tchName,tchAge,tchGender/* ,classID */})
        if(validation !== true){
            return res.send(validation)
        }
        const result = await this.teacherService.update({id,tchNum,tchName,tchAge,tchGender/* ,classID */})
        if(result.length != 1){
            return res.send({success: false, msg: result})
        }
        return res.send({success: true, msg: '更新成功'})
    }

    /**
     * 删除教师
     * @route DELETE /api/teacher/
     * @summary 删除教师
     * @group teacher - 教师管理模块
     * @param {Number} id.formData - 请输入id
     */
    deleteTeacher = async(req, res) => {
        const {id} = req.body
        const teacher = await this.teacherService.find({id})
        if(teacher.length){
            const userid = teacher[0].userId
            const teacherid = teacher[0].id
            const deleteuser = await this.userService.deleteById({id:userid})
            const deleteteacher = await this.teacherService.deleteById({id: teacherid})
            res.send({success: true, data: deleteteacher})
        } else {
            res.send({success: false, msg: '已删除'})
        }
    }
}
module.exports = async () => {
    const c = new TeacherController();
    return await c.init();
};