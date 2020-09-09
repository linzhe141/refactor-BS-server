const { Router } = require('express')
const studentService = require('../service/student')
const userService = require('../service/user')
var util = require('../util')

class StudentController{
    // studentService
    async init(){
        this.studentService = await studentService()
        this.userService = await userService()
        this.util = await util()
        const router = Router()
        router.get('/studentList',this.studentList)
        router.post('/',this.createStudent)
        router.get('/',this.find)
        
        return router
    }

    studentList = async(req, res) => {
        const studentList = await this.studentService.findAll()
        return res.send({success: true, data: studentList})
    }

    createStudent = async(req, res) => {
        const {stuID,stuName,stuAge,stuGender,classID} = req.body
        const validation = await this.util.validaRequiredFields({stuID,stuName,stuAge,stuGender,classID})
        if(validation !== true){
            return res.send(validation)
        }
        
        const newStudent = await this.studentService.create({stuID,stuName,stuAge,stuGender,classID})
        if(newStudent.errors){
            return res.send({success: false, error: newStudent.errors})
        }
        const username = stuID
        const password = stuID
        const permissions = 2
        const newUser = await this.userService.create({username, password, permissions})
        return res.send({success: true, data: newStudent})
    }

    find = async(req, res) => {
        let {stuID,stuName,stuAge,stuGender,classID} = req.query
        stuID = stuID || ''
        stuName = stuName || ''
        stuAge = stuAge || ''
        stuGender = stuGender || ''
        classID = classID || ''
        const result = await this.studentService.find({stuID, stuName, stuAge, stuGender,classID})
        if(result.errors){
            return res.send({success: false, error: result.errors})
        }
        return res.send({success: true, data: result})
    }
}
module.exports = async () => {
    const c = new StudentController();
    return await c.init();
};