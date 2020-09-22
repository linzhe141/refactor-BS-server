const { Router } = require('express')
const userService = require('../service/user')
const studentService = require('../service/student')
const classgradeService = require('../service/classgrade')
var util = require('../util')

class StudentController{
    // studentService
    async init(){
        this.classgradeService = await classgradeService()
        this.studentService = await studentService()
        this.userService = await userService()
        this.util = await util()
        const router = Router()
        router.get('/studentList',this.studentList)
        router.post('/',this.createStudent)
        router.get('/',this.find)
        router.put('/',this.updateStudent)
        router.delete('/',this.deleteStudent)
        
        return router
    }
    
    /**
     * 获取所有学生
     * @route GET /api/student/studentList
     * @summary 获取所有学生
     * @group student - 学生管理模块
     */
    studentList = async(req, res) => {
        const studentList = await this.studentService.findAll()
        return res.send({success: true, data: studentList})
    }

    /**
     * 创建学生
     * @route POST /api/student/
     * @summary 创建学生
     * @group student - 学生管理模块
     * @param {string} stuNum.formData - 请输入学生编号
     * @param {string} stuName.formData - 请输入学生姓名
     * @param {string} stuAge.formData - 请输入学生年龄
     * @param {enum} stuGender.formData - 请输入学生性别
     * @param {number} classgradeId.formData - 请输入班级id
     */
    createStudent = async(req, res) => {
        const {stuNum,stuName,stuAge,stuGender,classgradeId} = req.body
        const validation = await this.util.validaRequiredFields({stuNum,stuName,stuAge,stuGender,classgradeId})
        if(validation !== true){
            return res.send(validation)
        }
        const classgrade = await this.classgradeService.find({id: classgradeId}) 
        if(classgrade.length == 0){
            return res.send({success: false, msg: '请先创建班级'})
        }
        const username = stuNum
        const password = stuNum
        const permissions = 2
        const newUser = await this.userService.create({username, password, permissions})
        
        const newStudent = await newUser.createStudent({stuNum,stuName,stuAge,stuGender,classgradeId})
        if(newStudent.errors){
            return res.send({success: false, error: newStudent.errors}) 
        }
        
        return res.send({success: true, data: newStudent})
    }

    /**
     * 查找学生
     * @route GET /api/student/
     * @summary 查找学生
     * @group student - 学生管理模块
     * @param {string} stuNum.query - 请输入学号
     * @param {string} stuName.query - 请输入姓名
     * @param {string} stuAge.query - 请输入年龄
     * @param {string} stuGender.query - 请输入性别
     * @param {number} classgradeId.query - 请输入班级id
     */
    find = async(req, res) => {
        let {stuNum,stuName,stuAge,stuGender,classgradeId} = req.query
        stuNum = stuNum || ''
        stuName = stuName || ''
        stuAge = stuAge || ''
        stuGender = stuGender || ''
        classgradeId = classgradeId || ''
        const result = await this.studentService.find({stuNum, stuName, stuAge, stuGender,classgradeId})
        if(result.errors){
            return res.send({success: false, error: result.errors})
        }
        return res.send({success: true, data: result})
    }

    /**
     * 更新学生
     * @route PUT /api/student/
     * @summary 更新学生
     * @group student - 学生管理模块
     * @param {string} id.formData - 请输入id
     * @param {string} stuNum.formData - 请输入学号
     * @param {string} stuName.formData - 请输入姓名
     * @param {string} stuAge.formData - 请输入年龄
     * @param {string} stuGender.formData - 请输入性别
     * @param {number} classgradeId.formData - 请输入班级id
     */
    updateStudent = async(req, res) => {
        let {id,stuNum,stuName,stuAge,stuGender,classgradeId} = req.body
        const validation = await this.util.validaRequiredFields({id,stuNum,stuName,stuAge,stuGender,classgradeId})
        if(validation !== true){
            return res.send(validation)
        }
        const result = await this.studentService.update({id, stuNum, stuName, stuAge, stuGender,classgradeId})
        if(result.length != 1){
            return res.send({success: false, msg: result})
        }
        return res.send({success: true, msg: '更新成功'})
    }

    /**
     * 删除学生
     * @route DELETE /api/student/
     * @summary 删除学生
     * @group student - 学生管理模块
     * @param {string} id.formData - 请输入id
     */
    deleteStudent = async(req, res) => {
        const {id} = req.body
        const student = await this.studentService.find({id})
        if(student.length){
            const userid = student[0].userId
            const studentid = student[0].id
            const deleteuser = await this.userService.deleteById({id:userid})
            const deletestudent = await this.studentService.deleteById({id: studentid})
            res.send({success: true, data: deletestudent})
        } else {
            res.send({success: false, msg: '已删除'})
        }
    }
}
module.exports = async () => {
    const c = new StudentController();
    return await c.init();
};